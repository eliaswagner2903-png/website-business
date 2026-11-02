#!/usr/bin/env python3
"""Keyframe-Kette prüfen: die Nähte zwischen echten Clips (Werbefilm „Traum“).

    python3 werkzeuge/video-film/traum/kette-pruefen.py naehte <clip1.mp4> <clip2.mp4> … [Schwellen]
    python3 werkzeuge/video-film/traum/kette-pruefen.py letztes-bild <clip.mp4> <ziel.png>
    python3 werkzeuge/video-film/traum/kette-pruefen.py erstes-bild <clip.mp4> <ziel.png>
    python3 werkzeuge/video-film/traum/kette-pruefen.py kontaktbogen <clip.mp4> <ziel.jpg> [--n 12]

naehte vergleicht das LETZTE Bild von Clip n mit dem ERSTEN Bild von Clip n+1, beide 256 px breit:
  Helligkeit (Graustufen): Differenz Ø = mittlere absolute Differenz (0–255) · SSIM = strukturelle Ähnlichkeit
  (Gauß 11 px, σ 1,5; 1 = gleich). Farbe: Farbe Ø = mittlere absolute Differenz der Farbanteile Cb/Cr ohne
  Helligkeit (BT.709, 0–255), gemittelt je Feld von 16 × 16 px – ein Farbstich zählt voll, Bewegung kaum.
  Urteil: nahtlos (Ø ≤ 4, SSIM ≥ 0,90 und Farbe Ø ≤ 2) · Sprung (Ø > 20, SSIM < 0,60 oder Farbe Ø > 10) · sonst
  sichtbar (Schwellen als Parameter).
  Bewegung: Ø vorletztes→letztes Bild von Clip n · Ø über die Naht · Ø erstes→zweites Bild von Clip n+1
  → erkennt Stopp-und-los (eine Seite steht) und das Stocken an der Naht (doppeltes Bild: Endbild = Startbild).
Exit: 0 = kein Sprung · 1 = mindestens ein Sprung · 2 = Bedienfehler (Datei fehlt, ffmpeg scheitert).
letztes-bild / erstes-bild: das genaue Bild in voller Auflösung als PNG (RGB, Farbmatrix wie im Player, genaue
Umrechnung mit voller Farbauflösung), etwa als Startbild des nächsten Clips. Vorhandene Ziele werden nur mit
--ueberschreiben ersetzt.
Braucht ffmpeg/ffprobe und numpy. Löst nichts Bezahltes aus.
"""
import argparse
import math
import shutil
import subprocess
import sys
import tempfile
from collections import deque
from pathlib import Path

import numpy as np

BREITE = 256        # px, Vergleichsbreite an der Naht
KACHEL = 320        # px, Kachelbreite im Kontaktbogen
STILL = 0.15        # Bewegung Ø darunter: das Bild steht (Standbild, Schwarz, Kompressionsrauschen)
STOPP = 0.25        # eine Seite bewegt sich mit weniger als 25 % der anderen: Stopp-und-los
STOCKT = 0.5        # die Naht ändert weniger als 50 % der Bewegung: die Bewegung stockt (doppeltes Bild)
RUCK = 3.0          # die Naht ändert mehr als 3× so viel wie die Bewegung: Ruck
FELD = 16           # px, Kantenlänge der Felder im Farbmaß (bei 256 px Breite: 16 × 9 Felder im 16:9-Bild)
LUMA = np.array([0.2126, 0.7152, 0.0722])           # BT.709: Helligkeit aus R, G, B
GRAU = f"scale={BREITE}:-2:flags=area,format=gray"
GENAU = "bicubic+accurate_rnd+full_chroma_int"   # YUV→RGB: Rundweg-Fehler Ø 0,1 statt 1,2 (Messung 02.11.2026)


def fehler(problem, ursache, alternative):
    """Bedienfehler melden (Problem / Ursache / Alternative) und mit Exit 2 enden."""
    print(f"PROBLEM: {problem}\nURSACHE: {ursache}\nALTERNATIVE: {alternative}", file=sys.stderr)
    sys.exit(2)


def de(x, stellen=2):
    """Zahl mit deutschem Komma."""
    return f"{x:.{stellen}f}".replace(".", ",")


def _clip(pfad):
    p = Path(pfad)
    if not p.is_file():
        fehler(f"Datei nicht gefunden: {p}", "Pfad falsch oder Clip noch nicht heruntergeladen",
               "Pfad prüfen (ls) und erneut aufrufen")
    return p


def _ziel(pfad, endungen, ueberschreiben):
    p = Path(pfad)
    if p.suffix.lower() not in endungen:
        fehler(f"Ziel muss auf {' oder '.join(endungen)} enden: {p.name}", "das Format folgt aus der Endung",
               f"z. B. {p.with_suffix(endungen[0]).name}")
    if p.exists() and not ueberschreiben:
        fehler(f"Ziel gibt es schon: {p}", "vorhandene Bilder werden nicht stillschweigend ersetzt",
               "anderen Namen wählen (z. B. -v2) oder --ueberschreiben angeben")
    p.parent.mkdir(parents=True, exist_ok=True)
    return p


def _farbmatrix(pfad):
    """YUV→RGB-Matrix: die Angabe im Video, sonst wie Player üblich (HD = BT.709, SD = BT.601)."""
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                        "stream=width,height,color_space", "-of", "default=nw=1", str(pfad)],
                       capture_output=True, text=True, check=False)
    w = dict(z.split("=", 1) for z in r.stdout.splitlines() if "=" in z)
    if w.get("color_space", "unknown") not in ("unknown", "", "N/A"):
        return "auto"
    breite, hoehe = (int(w[k]) if w.get(k, "").isdigit() else 0 for k in ("width", "height"))
    return "bt709" if breite >= 1280 or hoehe > 576 else "bt601"


def _farbig(pfad):
    """Farbbilder in Vergleichsbreite, Farbmatrix wie im Player – beide Clips werden gleich umgerechnet."""
    return f"scale={BREITE}:-2:flags=area:in_color_matrix={_farbmatrix(pfad)},format=rgb24"


def _bilder(pfad, vf, farbig=False, erste=None, ab_ende=None):
    """Dekodierte Bilder als numpy-Felder. Der PGM/PPM-Strom trägt die Maße im Kopf jedes Bildes.
    erste=n: nur die ersten n Bilder · ab_ende=s: erst s Sekunden vor dem Ende einsteigen."""
    cmd = ["ffmpeg", "-v", "error", "-nostdin"] + (["-sseof", f"-{ab_ende}"] if ab_ende else [])
    cmd += ["-i", str(pfad), "-map", "0:v:0", "-an", "-sn", "-dn", "-vf", vf, "-fps_mode", "passthrough"]
    cmd += (["-frames:v", str(erste)] if erste else []) + ["-f", "image2pipe", "-c:v", "ppm" if farbig else "pgm", "-"]
    with tempfile.TemporaryFile() as log:          # stderr in eine Datei: kein Verklemmen bei vielen Meldungen
        p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=log)
        fertig = False
        try:
            while magie := p.stdout.readline():
                breite, hoehe = map(int, p.stdout.readline().split())
                p.stdout.readline()                  # Höchstwert, immer 255
                kanaele = 3 if magie.startswith(b"P6") else 1
                roh = p.stdout.read(breite * hoehe * kanaele)
                if len(roh) < breite * hoehe * kanaele:
                    break
                yield np.frombuffer(roh, np.uint8).reshape((hoehe, breite, 3) if kanaele == 3 else (hoehe, breite))
            fertig = True
        finally:
            if not fertig:
                p.kill()
            p.stdout.close()
            p.wait()
        if p.returncode:
            log.seek(0)
            zeilen = log.read().decode(errors="replace").strip().splitlines()
            ursache = ("die Datei hat keine Videospur" if any("matches no streams" in z for z in zeilen)
                       else zeilen[-1] if zeilen else f"Exit {p.returncode}")
            fehler(f"ffmpeg kann {pfad} nicht lesen", ursache,
                   "Datei mit ffprobe prüfen – ist der Clip vollständig heruntergeladen?")


def letzte_bilder(pfad, n, vf=GRAU, farbig=False):
    """Die letzten n Bilder: Einstieg 1 s vor dem Ende, notfalls den ganzen Clip lesen."""
    bilder = deque(_bilder(pfad, vf, farbig, ab_ende=1), maxlen=n)
    if len(bilder) < n:
        bilder = deque(_bilder(pfad, vf, farbig), maxlen=n)
    return list(bilder)


def erste_bilder(pfad, n, vf=GRAU, farbig=False):
    return list(_bilder(pfad, vf, farbig, erste=n))


def differenz(a, b):
    """Mittlere absolute Differenz zweier gleich großer Bilder oder Felder (0–255)."""
    return float(np.abs(a.astype(np.float64) - b.astype(np.float64)).mean())


def farbanteile(bild):
    """Farbanteile Cb/Cr eines RGB-Bildes ohne Helligkeit (BT.709, Skala 0–255), gemittelt je Feld FELD × FELD px."""
    x = bild.astype(np.float64)
    y = x @ LUMA
    c = np.stack(((x[..., 2] - y) / 1.8556, (x[..., 0] - y) / 1.5748), axis=-1)
    k = max(1, min(FELD, c.shape[0], c.shape[1]))
    h, w = c.shape[0] // k * k, c.shape[1] // k * k
    return c[:h, :w].reshape(h // k, k, w // k, k, 2).mean(axis=(1, 3))


def farbabstand(a, b):
    """Farbe Ø zweier RGB-Bilder: mittlere absolute Differenz der Farbanteile je Feld (0–255). Gleiche Helligkeits-
    änderung aller Kanäle zählt nicht, Bewegung um wenige Pixel kaum; ein Farbstich oder Weißabgleich-Sprung voll."""
    return differenz(farbanteile(a), farbanteile(b))


def _glaetten(x, kern):
    """Separabler Filter, nur der gültige Bereich (ohne Randfortsetzung)."""
    x = np.lib.stride_tricks.sliding_window_view(x, len(kern), axis=0) @ kern
    return np.lib.stride_tricks.sliding_window_view(x, len(kern), axis=1) @ kern


def ssim(a, b):
    """Mittleres SSIM nach Wang u. a. (2004): Gauß-Fenster 11 px, σ 1,5, Graustufen 0–255. 1 = gleich."""
    x = np.arange(-5, 6, dtype=np.float64)
    kern = np.exp(-x * x / (2 * 1.5 ** 2))
    kern /= kern.sum()
    a, b = a.astype(np.float64), b.astype(np.float64)
    c1, c2 = (0.01 * 255) ** 2, (0.03 * 255) ** 2
    ma, mb = _glaetten(a, kern), _glaetten(b, kern)
    vaa = _glaetten(a * a, kern) - ma * ma
    vbb = _glaetten(b * b, kern) - mb * mb
    vab = _glaetten(a * b, kern) - ma * mb
    karte = (2 * ma * mb + c1) * (2 * vab + c2) / ((ma * ma + mb * mb + c1) * (vaa + vbb + c2))
    return float(karte.mean())


def urteil(diff, aehnl, farbe, s):
    """nahtlos / sichtbar / Sprung nach den Schwellen s – Helligkeit (Differenz Ø, SSIM) und Farbe (Farbe Ø)."""
    if diff > s.sprung_diff or aehnl < s.sprung_ssim or farbe > s.sprung_farbe:
        return "Sprung"
    if diff <= s.nahtlos_diff and aehnl >= s.nahtlos_ssim and farbe <= s.nahtlos_farbe:
        return "nahtlos"
    return "sichtbar"


def bewegung(vor, naht, nach, sprung):
    """Bewegung über die Naht deuten. vor/nach: Ø zwischen den zwei Randbildern jedes Clips, naht: Ø über die Naht,
    sprung: Differenz-Schwelle für einen Sprung."""
    if vor is None or nach is None:
        return "unbekannt – ein Clip hat nur ein Bild"
    hoch, tief = max(vor, nach), min(vor, nach)
    if hoch > sprung:
        wo = ("zwischen den letzten zwei Bildern von Clip n" if vor > nach
              else "zwischen den ersten zwei Bildern von Clip n+1")
        return f"Schnitt {wo} – der Clip springt direkt neben der Naht (Clip falsch geschnitten?)"
    if hoch < STILL:
        return "ruhig – beide Seiten stehen"
    if tief < STOPP * hoch:
        wer = "Clip n kommt zum Stehen" if vor < nach else "Clip n+1 beginnt im Stand"
        return (f"Stopp-und-los – {wer} (Abhilfe: „continuous camera motion, no pause“, gleiche Richtung und "
                "Geschwindigkeit; notfalls 2–4 Bilder überlappen)")
    if naht < STOCKT * tief:
        return ("Bewegung stockt an der Naht – doppeltes Bild (Endbild = Startbild)? "
                "Im Schnitt das erste Bild von Clip n+1 weglassen")
    if naht > RUCK * hoch:
        return f"Ruck – die Naht ändert ×{de(naht / hoch, 1)} so viel wie die Bewegung"
    return "gleichmäßig"


def befehl_naehte(clips, s):
    if len(clips) < 2:
        fehler("zu wenige Clips", "eine Naht braucht mindestens zwei Clips",
               "kette-pruefen.py naehte clip1.mp4 clip2.mp4 [clip3.mp4 …] (in Filmreihenfolge)")
    if s.nahtlos_diff > s.sprung_diff or s.nahtlos_ssim < s.sprung_ssim or s.nahtlos_farbe > s.sprung_farbe:
        fehler("Schwellen widersprechen sich", "„nahtlos“ muss strenger sein als „Sprung“",
               "z. B. --nahtlos-diff 4 --sprung-diff 20 --nahtlos-ssim 0.9 --sprung-ssim 0.6 "
               "--nahtlos-farbe 2 --sprung-farbe 10")
    clips = [_clip(c) for c in clips]
    zahl = {"nahtlos": 0, "sichtbar": 0, "Sprung": 0}
    for i, (a, b) in enumerate(zip(clips, clips[1:]), 1):
        ende, anfang = letzte_bilder(a, 2), erste_bilder(b, 2)
        if not ende or not anfang:
            fehler(f"kein Bild in {a if not ende else b}", "der Clip hat keinen lesbaren Videostrom",
                   "Clip neu herunterladen oder mit ffprobe prüfen")
        x, y = ende[-1], anfang[0]
        print(f"Naht {i}: {a} → {b}")
        if x.shape[1] != y.shape[1] or abs(x.shape[0] - y.shape[0]) > 2:
            print(f"  Format verschieden ({x.shape[1]}×{x.shape[0]} gegen {y.shape[1]}×{y.shape[0]} px) → Sprung")
            zahl["Sprung"] += 1
            continue
        h = min(x.shape[0], y.shape[0])            # 1–2 Zeilen Rundung beim Verkleinern ausgleichen
        fx, fy = letzte_bilder(a, 1, _farbig(a), True), erste_bilder(b, 1, _farbig(b), True)
        if not fx or not fy:
            fehler(f"kein Farbbild in {a if not fx else b}", "der Clip lässt sich nicht in RGB umrechnen",
                   "Clip mit ffprobe prüfen")
        diff, aehnl, farbe = differenz(x[:h], y[:h]), ssim(x[:h], y[:h]), farbabstand(fx[-1][:h], fy[0][:h])
        u = urteil(diff, aehnl, farbe, s)
        zahl[u] += 1
        vor = differenz(ende[-2], ende[-1]) if len(ende) > 1 else None
        nach = differenz(anfang[0], anfang[1]) if len(anfang) > 1 else None
        print(f"  Differenz Ø {de(diff)} · SSIM {de(aehnl, 3)} · Farbe Ø {de(farbe)} → {u}")
        print(f"  Bewegung Ø: vorher {'–' if vor is None else de(vor)} · Naht {de(diff)} · "
              f"nachher {'–' if nach is None else de(nach)} → {bewegung(vor, diff, nach, s.sprung_diff)}")
    n = len(clips) - 1
    print(f"Ergebnis: {n} {'Naht' if n == 1 else 'Nähte'} – {zahl['nahtlos']} nahtlos, {zahl['sichtbar']} sichtbar, "
          f"{zahl['Sprung']} Sprung (Schwellen: nahtlos Ø ≤ {de(s.nahtlos_diff, 1)}, SSIM ≥ {de(s.nahtlos_ssim)} und "
          f"Farbe Ø ≤ {de(s.nahtlos_farbe, 1)}; Sprung Ø > {de(s.sprung_diff, 1)}, SSIM < {de(s.sprung_ssim)} oder "
          f"Farbe Ø > {de(s.sprung_farbe, 1)})")
    return 1 if zahl["Sprung"] else 0


def befehl_bild(clip, ziel, letztes, ueberschreiben):
    clip, ziel = _clip(clip), _ziel(ziel, (".png",), ueberschreiben)
    vf = f"scale=in_color_matrix={_farbmatrix(clip)}:flags={GENAU},format=rgb24"
    bilder = letzte_bilder(clip, 1, vf, True) if letztes else erste_bilder(clip, 1, vf, True)
    if not bilder:
        fehler(f"kein Bild in {clip}", "der Clip hat keinen lesbaren Videostrom", "Clip mit ffprobe prüfen")
    bild = bilder[-1]
    hoehe, breite = bild.shape[:2]
    ppm = f"P6\n{breite} {hoehe}\n255\n".encode() + bild.tobytes()
    r = subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "image2pipe", "-c:v", "ppm", "-i", "-", "-frames:v", "1",
                        "-update", "1", "-c:v", "png", "-pred", "mixed", str(ziel)],
                       input=ppm, capture_output=True, check=False)
    if r.returncode:
        fehler(f"PNG nicht geschrieben: {ziel}", r.stderr.decode(errors="replace").strip()[-300:],
               "Zielordner beschreibbar? Platz auf dem Datenträger?")
    print(f"{'Letztes' if letztes else 'Erstes'} Bild von {clip} → {ziel} ({breite}×{hoehe} px)")
    return 0


def befehl_kontaktbogen(clip, ziel, n, ueberschreiben):
    clip, ziel = _clip(clip), _ziel(ziel, (".jpg", ".jpeg"), ueberschreiben)
    if n < 1:
        fehler("--n muss mindestens 1 sein", f"angegeben: {n}", "z. B. --n 12")
    anzahl = sum(1 for _ in _bilder(clip, "scale=32:-2,format=gray"))     # genau zählen, wie dekodiert wird
    if not anzahl:
        fehler(f"kein Bild in {clip}", "der Clip hat keinen lesbaren Videostrom", "Clip mit ffprobe prüfen")
    nummern = sorted({round(i * (anzahl - 1) / max(min(n, anzahl) - 1, 1)) for i in range(min(n, anzahl))})
    spalten = math.ceil(math.sqrt(len(nummern)))
    zeilen = math.ceil(len(nummern) / spalten)
    basis = f"scale={KACHEL}:-2:flags=area:in_color_matrix={_farbmatrix(clip)}"
    schrift = ("drawtext=text='Bild %{frame_num} · %{pts\\:hms}':x=6:y=6:fontsize=14:fontcolor=white"
               ":box=1:boxcolor=black@0.6:boxborderw=3")
    rest = "select='" + "+".join(f"eq(n\\,{k})" for k in nummern) + f"',tile={spalten}x{zeilen}"
    for vf in (f"{basis},{schrift},{rest}", f"{basis},{rest}"):           # ohne Beschriftung, falls Schriften fehlen
        r = subprocess.run(["ffmpeg", "-v", "error", "-nostdin", "-y", "-i", str(clip), "-map", "0:v:0", "-an",
                            "-vf", vf, "-fps_mode", "passthrough", "-frames:v", "1", "-update", "1", "-q:v", "3",
                            str(ziel)], capture_output=True, check=False)
        if r.returncode == 0:
            break
    else:
        fehler(f"Kontaktbogen nicht geschrieben: {ziel}", r.stderr.decode(errors="replace").strip()[-300:],
               "Clip mit ffprobe prüfen")
    print(f"Kontaktbogen {ziel}: {len(nummern)} von {anzahl} Bildern ({spalten}×{zeilen}), "
          f"Bildnummern {', '.join(map(str, nummern))}")
    return 0


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="befehl", required=True)
    p = sub.add_parser("naehte", help="Nähte prüfen: letztes Bild von Clip n gegen erstes Bild von Clip n+1")
    p.add_argument("clips", nargs="+", help="Clips in Filmreihenfolge")
    p.add_argument("--nahtlos-diff", type=float, default=4.0, help="nahtlos: Differenz Ø höchstens (Standard 4)")
    p.add_argument("--nahtlos-ssim", type=float, default=0.90, help="nahtlos: SSIM mindestens (Standard 0.90)")
    p.add_argument("--sprung-diff", type=float, default=20.0, help="Sprung: Differenz Ø über (Standard 20)")
    p.add_argument("--sprung-ssim", type=float, default=0.60, help="Sprung: SSIM unter (Standard 0.60)")
    p.add_argument("--nahtlos-farbe", type=float, default=2.0, help="nahtlos: Farbe Ø höchstens (Standard 2)")
    p.add_argument("--sprung-farbe", type=float, default=10.0, help="Sprung: Farbe Ø über (Standard 10)")
    for name, hilfe in (("letztes-bild", "genaues letztes Bild als PNG (Startbild des nächsten Clips)"),
                        ("erstes-bild", "genaues erstes Bild als PNG")):
        p = sub.add_parser(name, help=hilfe)
        p.add_argument("clip")
        p.add_argument("ziel", help="Zieldatei .png")
        p.add_argument("--ueberschreiben", action="store_true", help="vorhandene Zieldatei ersetzen")
    p = sub.add_parser("kontaktbogen", help="gleichmäßig verteilte Bilder (erstes bis letztes) als JPG-Bogen")
    p.add_argument("clip")
    p.add_argument("ziel", help="Zieldatei .jpg")
    p.add_argument("--n", type=int, default=12, help="Anzahl Bilder (Standard 12)")
    p.add_argument("--ueberschreiben", action="store_true", help="vorhandene Zieldatei ersetzen")
    a = ap.parse_args(argv)
    for werkzeug in ("ffmpeg", "ffprobe"):
        if not shutil.which(werkzeug):
            fehler(f"{werkzeug} fehlt", f"{werkzeug} ist nicht installiert oder nicht im PATH", "ffmpeg installieren")
    if a.befehl == "naehte":
        return befehl_naehte(a.clips, a)
    if a.befehl == "kontaktbogen":
        return befehl_kontaktbogen(a.clip, a.ziel, a.n, a.ueberschreiben)
    return befehl_bild(a.clip, a.ziel, a.befehl == "letztes-bild", a.ueberschreiben)


if __name__ == "__main__":
    sys.exit(main())
