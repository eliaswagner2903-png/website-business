#!/usr/bin/env python3
"""Zeitleiste des Werbefilms „Traum“ prüfen und auswerten – die einzige Quelle für alle Zeiten.

    python3 werkzeuge/video-film/traum/zeitleiste.py pruefen  [pfad]   Format und Invarianten prüfen
    python3 werkzeuge/video-film/traum/zeitleiste.py liste    [pfad]   Szenen-Tabelle, Zeitcode mm:ss.ff (Bildrate)
    python3 werkzeuge/video-film/traum/zeitleiste.py kurve    [pfad] [--schritt 2]   Spannung, Website-Anteil als Balken
    python3 werkzeuge/video-film/traum/zeitleiste.py clips    [pfad]   Clips, Higgsfield-Sekunden und Kostenschätzung
    python3 werkzeuge/video-film/traum/zeitleiste.py markdown [pfad]   Szenen-Tabelle als Markdown

Standardpfad: kunden/elias-studio/werbefilm-traum/zeitleiste.json im Repo. Nur Python-Standardbibliothek.
pruefen: Exit 0 = in Ordnung, Exit 1 = Mängel („MANGEL: …“ auf stderr); „HINWEIS: …“ ändert den Exit nicht.
Die anderen Befehle zeigen die Zeitleiste auch mit Mängeln, solange ihr Aufbau lesbar ist.
Unbekannte Zusatzfelder werden toleriert. Format und Regeln: README.md in diesem Ordner.
"""
import argparse
import json
import math
import statistics
import sys
from collections import Counter
from pathlib import Path

WURZEL = Path(__file__).resolve().parents[3]
STANDARDPFAD = WURZEL / "kunden" / "elias-studio" / "werbefilm-traum" / "zeitleiste.json"

TOLERANZ = 0.001    # s: Szenengrenzen, Summe, Zeitbereiche
SPIELRAUM = 1.25    # Faktorprüfung: der gemessene Faktor darf um ÷/× 1,25 vom geplanten abweichen
ZEITLUPE = 1.10     # ein Clip muss um mehr als 10 % gestreckt werden, um seine Spanne zu füllen → Hinweis
KLING = "kling_o3_flf"
KLING_SATZ = {"pro": 1.25, "std": 1.00, "4k": 6.00}      # Credits je Sekunde (Kostenabfrage 02.11.2026)
CLIP_ARTEN = ("welt", "morph", "montage", "aufnahme", "echt", "grafik")
QUELLEN = ("higgsfield", "website-aufnahme", "remotion", "elias")
TON_ARTEN = ("atem", "geraeusch", "musik", "stimme", "stille")
FAKTOREN = {"szenenlaenge": "Szenenlängen", "website_anteil": "Website", "atem": "Atem"}
# Pflichtfelder je Liste („zahl“ = endliche Zahl, „text“ = nicht leerer Text): fehlen oder falscher Typ = MANGEL
PFLICHT = {
    "ebenen": {"id": "text", "website_anteil": "zahl", "atem_pro_min": "zahl"},
    "szenen": {"id": "text", "ebene": "text", "start_s": "zahl", "dauer_s": "zahl", "spannung": "zahl"},
    "keyframes": {"id": "text", "szene": "text", "zeit_s": "zahl"},
    "clips": {"id": "text", "von": "text", "nach": "text", "dauer_s": "zahl", "art": "text", "quelle": "text"},
    "ton": {"id": "text", "zeit_s": "zahl", "art": "text"},
}
# Beschreibende Felder (Text, mit „?“ auch null): fehlen = HINWEIS, falscher Typ = MANGEL
TEXTE = {
    "ebenen": ("name", "welt", "farbe", "musterseite?"),
    "szenen": ("titel", "bild", "kamera", "uebergang_heraus", "website_spur", "ton", "zweck"),
    "keyframes": ("inhalt", "zwilling_von?"),
    "clips": ("kamera", "modell?", "morph?"),
    "ton": ("inhalt", "ereignis?"),
}
BRAUCHT = {"liste": {"kopf", "ebenen", "szenen"}, "markdown": {"kopf", "ebenen", "szenen"},
           "kurve": {"kopf", "ebenen", "szenen"}, "clips": {"kopf", "keyframes", "clips"}}
KOPF_SZENEN = ("Szene", "Zeitcode", "Dauer", "Bilder", "Ebene", "Website", "Spannung", "Titel")
BLOECKE = "▏▎▍▌▋▊▉█"


# ---------- Darstellung ----------

def ist_zahl(x):
    return isinstance(x, (int, float)) and not isinstance(x, bool) and math.isfinite(x)


def de(x, stellen=2):
    """Zahl mit deutschem Komma."""
    return f"{x:.{stellen}f}".replace(".", ",")


def kurz(x):
    """Zahl knapp: 7 statt 7,00; sonst höchstens zwei Stellen."""
    return f"{x:.2f}".rstrip("0").rstrip(".").replace(".", ",")


def prozent(anteil):
    return f"{kurz(anteil * 100)} %"


def zeitcode(t, fps):
    """Sekunden → mm:ss.ff (ff = Bild innerhalb der Sekunde, nominelle Bildrate)."""
    n = max(1, round(fps))
    sek, ff = divmod(round(t * fps), n)
    return f"{sek // 60:02d}:{sek % 60:02d}.{ff:02d}"


def zeige(wert):
    t = json.dumps(wert, ensure_ascii=False)
    return t if len(t) <= 40 else t[:39] + "…"


def aufzaehlen(dinge, n=8):
    dinge = list(dinge)
    return ", ".join(dinge[:n]) + (f" … (+{len(dinge) - n})" if len(dinge) > n else "")


def anzahl(n, eins, mehr):
    return f"{n} {eins if n == 1 else mehr}"


def _text(x):
    return " ".join(x.split()) if isinstance(x, str) and x.strip() else "–"


def tabelle(zeilen, rechts=()):
    """Texttabelle mit bündigen Spalten; die letzte Spalte wird nur aufgefüllt, wenn sie rechtsbündig ist."""
    breiten = [max(len(z[i]) for z in zeilen) for i in range(len(zeilen[0]))]
    letzte = len(breiten) - 1
    return "\n".join("  ".join(w.rjust(breiten[i]) if i in rechts else w if i == letzte else w.ljust(breiten[i])
                               for i, w in enumerate(z)).rstrip() for z in zeilen)


def balken(wert, voll, breite=20):
    """Wert als Textbalken aus Achtelblöcken; kleine Werte über 0 bleiben sichtbar."""
    achtel = round(min(max(wert / voll, 0.0), 1.0) * breite * 8)
    ganz, rest = divmod(max(achtel, 1) if wert > 0 else 0, 8)
    return ("█" * ganz + (BLOECKE[rest - 1] if rest else "")).ljust(breite)


# ---------- Laden und Prüfen ----------

class Ladefehler(Exception):
    """Datei fehlt, ist nicht lesbar oder kein JSON."""


def laden(pfad):
    """JSON lesen; doppelte Schlüssel werden gesammelt statt still überschrieben."""
    doppelt = []

    def objekt(paare):
        obj = {}
        for k, v in paare:
            if k in obj:
                ort = next((w for s, w in paare if s == "id" and isinstance(w, str)), None)
                doppelt.append(f"„{k}“" + (f" in {ort}" if ort else ""))
            obj[k] = v
        return obj

    try:
        text = Path(pfad).read_text(encoding="utf-8-sig")
    except FileNotFoundError:
        raise Ladefehler(f"Datei nicht gefunden: {pfad}") from None
    except (OSError, UnicodeDecodeError) as e:
        raise Ladefehler(f"Datei nicht lesbar: {pfad} ({e})") from None
    try:
        return json.loads(text, object_pairs_hook=objekt), doppelt
    except json.JSONDecodeError as e:
        raise Ladefehler(f"kein gültiges JSON in {pfad}: {e.msg} (Zeile {e.lineno}, Spalte {e.colno})") from None


class Befund:
    """Ergebnis: Mängel (Exit 1), Hinweise (nur Warnung), fehlerfrei aufgebaute Teile, gemessene Faktoren."""

    def __init__(self):
        self.maengel, self.hinweise, self.heil, self.gemessen = [], [], set(), {}

    def mangel(self, text):
        self.maengel.append(text)

    def hinweis(self, text):
        self.hinweise.append(text)


def pruefe(d, doppelt=()):
    """Prüft eine geladene Zeitleiste. Jede Logikprüfung läuft nur auf fehlerfrei aufgebauten Teilen."""
    b = Befund()
    for k in doppelt:
        b.mangel(f"doppelter Schlüssel {k} – nur der letzte Wert zählt")
    if not isinstance(d, dict):
        b.mangel("die Zeitleiste muss ein JSON-Objekt sein")
        return b
    _aufbau(d, b)
    for pruefung, braucht in ((_ebenen, {"ebenen"}), (_szenen, {"kopf", "szenen"}), (_keyframes, {"kopf", "keyframes"}),
                              (_clips, {"clips"}), (_ton, {"kopf", "ton"}), (_website_steigt, {"ebenen", "szenen"}),
                              (_faktoren, {"ebenen", "szenen", "faktoren"})):
        if braucht <= b.heil:
            pruefung(d, b)
    return b


def _aufbau(d, b):
    """Pflichtfelder und Typen; fehlerfrei aufgebaute Teile kommen in b.heil."""
    kopf_ok = True
    for f in ("bildrate", "dauer_s"):
        if f not in d:
            b.mangel(f"Feld „{f}“ fehlt")
            kopf_ok = False
        elif not ist_zahl(d[f]) or d[f] <= 0:
            b.mangel(f"„{f}“ muss eine Zahl größer 0 sein (ist {zeige(d[f])})")
            kopf_ok = False
    if kopf_ok:
        b.heil.add("kopf")
    for f in ("titel", "fassung", "formate"):
        if f not in d:
            b.hinweis(f"Feld „{f}“ fehlt")
        elif f == "formate" and not (isinstance(d[f], list) and all(isinstance(x, str) for x in d[f])):
            b.mangel(f"„formate“ muss eine Liste von Texten sein (ist {zeige(d[f])})")
        elif f != "formate" and not isinstance(d[f], str):
            b.mangel(f"„{f}“ muss Text sein (ist {zeige(d[f])})")
    faktoren = d.get("faktoren")
    if not isinstance(faktoren, dict):
        b.mangel("„faktoren“ fehlt oder ist kein Objekt")
    else:
        schlecht = [k for k in FAKTOREN if not ist_zahl(faktoren.get(k)) or faktoren[k] <= 0]
        for k in schlecht:
            b.mangel(f"faktoren.{k} muss eine Zahl größer 0 sein (ist {zeige(faktoren.get(k))})")
        if not schlecht:
            b.heil.add("faktoren")
    fehlend = {}
    for liste, pflicht in PFLICHT.items():
        eintraege = d.get(liste)
        if not isinstance(eintraege, list):
            b.mangel(f"„{liste}“ fehlt oder ist keine Liste")
            continue
        ok = True
        if liste == "szenen" and not eintraege:
            b.mangel("„szenen“ ist leer")
            ok = False
        for i, x in enumerate(eintraege):
            if not isinstance(x, dict):
                b.mangel(f"{liste}[{i}]: Eintrag ist kein Objekt")
                ok = False
                continue
            ort = x["id"] if isinstance(x.get("id"), str) and x["id"].strip() else f"{liste}[{i}]"
            for feld, art in pflicht.items():
                if feld not in x:
                    b.mangel(f"{ort}: Pflichtfeld „{feld}“ fehlt")
                    ok = False
                elif not (ist_zahl(x[feld]) if art == "zahl" else isinstance(x[feld], str) and x[feld].strip()):
                    soll = "eine Zahl" if art == "zahl" else "ein nicht leerer Text"
                    b.mangel(f"{ort}: „{feld}“ muss {soll} sein (ist {zeige(x[feld])})")
                    ok = False
            for feld in TEXTE[liste]:
                nullbar, feld = feld.endswith("?"), feld.rstrip("?")
                if feld not in x:
                    fehlend.setdefault((liste, feld), []).append(ort)
                elif not (isinstance(x[feld], str) or (nullbar and x[feld] is None)):
                    b.mangel(f"{ort}: „{feld}“ muss Text{' oder null' if nullbar else ''} sein (ist {zeige(x[feld])})")
        doppelt = [k for k, n in Counter(x.get("id") for x in eintraege if isinstance(x, dict)
                                         and isinstance(x.get("id"), str)).items() if n > 1]
        if doppelt:
            b.mangel(f"doppelte IDs in „{liste}“: {aufzaehlen(doppelt)}")
            ok = False
        if ok:
            b.heil.add(liste)
    for (liste, feld), orte in fehlend.items():
        b.hinweis(f"Feld „{feld}“ fehlt in {liste}: {aufzaehlen(orte)}")


def _ids(d, liste):
    """IDs einer Liste für Verweise (auch wenn andere Felder kaputt sind); None, wenn die Liste fehlt."""
    x = d.get(liste)
    if not isinstance(x, list):
        return None
    return {e["id"] for e in x if isinstance(e, dict) and isinstance(e.get("id"), str)}


def _bildgenau(t, fps):
    return abs(t * fps - round(t * fps)) <= TOLERANZ * fps


def _nicht_bildgenau(b, was, ids, fps):
    if ids:
        b.hinweis(f"{was} nicht bildgenau bei {kurz(fps)} B/s: {aufzaehlen(ids)} "
                  "(der Zeitcode rundet aufs nächste Bild)")


def _ebenen(d, b):
    for e in d["ebenen"]:
        if not 0 <= e["website_anteil"] <= 1:
            b.mangel(f"{e['id']}: website_anteil {zeige(e['website_anteil'])} liegt nicht zwischen 0 und 1")
        if e["atem_pro_min"] < 0:
            b.mangel(f"{e['id']}: atem_pro_min darf nicht negativ sein")


def _szenen(d, b):
    sz, fps, ebenen = d["szenen"], d["bildrate"], _ids(d, "ebenen")
    for s in sz:
        if ebenen is not None and s["ebene"] not in ebenen:
            b.mangel(f"{s['id']}: Ebene {s['ebene']} gibt es nicht")
        if s["dauer_s"] <= 0:
            b.mangel(f"{s['id']}: dauer_s muss größer 0 sein (ist {zeige(s['dauer_s'])})")
        if not 0 <= s["spannung"] <= 10:
            b.mangel(f"{s['id']}: spannung {zeige(s['spannung'])} liegt nicht zwischen 0 und 10")
    if abs(sz[0]["start_s"]) > TOLERANZ:
        b.mangel(f"{sz[0]['id']}: die erste Szene beginnt bei {de(sz[0]['start_s'], 3)} s statt bei 0")
    for a, c in zip(sz, sz[1:]):
        ende = a["start_s"] + a["dauer_s"]
        luecke = c["start_s"] - ende
        if abs(luecke) > TOLERANZ:
            art = "Lücke" if luecke > 0 else "Überlappung"
            b.mangel(f"{art} von {de(abs(luecke), 3)} s zwischen {a['id']} (Ende {de(ende, 3)} s) "
                     f"und {c['id']} (Start {de(c['start_s'], 3)} s)")
    summe = sum(s["dauer_s"] for s in sz)
    if abs(summe - d["dauer_s"]) > TOLERANZ:
        b.mangel(f"Summe der Szenendauern {de(summe, 3)} s ≠ dauer_s {de(d['dauer_s'], 3)} s")
    krumm = [s["id"] for s in sz if not _bildgenau(s["start_s"], fps)]
    if not _bildgenau(sz[-1]["start_s"] + sz[-1]["dauer_s"], fps):
        krumm.append(f"Ende {sz[-1]['id']}")
    _nicht_bildgenau(b, "Szenengrenzen", krumm, fps)
    if ebenen:
        benutzt = {s["ebene"] for s in sz}
        frei = sorted(e for e in ebenen if e not in benutzt)
        if frei:
            b.hinweis(f"Ebenen ohne Szene: {aufzaehlen(frei)}")


def _keyframes(d, b):
    ks, dauer, fps = d["keyframes"], d["dauer_s"], d["bildrate"]
    szenen_ids = _ids(d, "szenen")
    szenen = {s["id"]: s for s in d["szenen"]} if "szenen" in b.heil else {}
    eigene = {k["id"] for k in ks}
    for k in ks:
        if szenen_ids is not None and k["szene"] not in szenen_ids:
            b.mangel(f"{k['id']}: Szene {k['szene']} gibt es nicht")
        s = szenen.get(k["szene"])
        if not -TOLERANZ <= k["zeit_s"] <= dauer + TOLERANZ:
            b.mangel(f"{k['id']}: zeit_s {de(k['zeit_s'], 3)} s liegt außerhalb des Films (0–{de(dauer, 3)} s)")
        elif s and not s["start_s"] - TOLERANZ <= k["zeit_s"] <= s["start_s"] + s["dauer_s"] + TOLERANZ:
            b.hinweis(f"{k['id']}: {de(k['zeit_s'], 3)} s liegt nicht in seiner Szene {s['id']} "
                      f"({de(s['start_s'], 3)}–{de(s['start_s'] + s['dauer_s'], 3)} s)")
        zwilling = k.get("zwilling_von")
        if zwilling == k["id"]:
            b.mangel(f"{k['id']}: zwilling_von zeigt auf sich selbst")
        elif isinstance(zwilling, str) and zwilling not in eigene:
            b.mangel(f"{k['id']}: zwilling_von {zwilling} – diesen Keyframe gibt es nicht")
    for a, c in zip(ks, ks[1:]):
        if c["zeit_s"] < a["zeit_s"] - TOLERANZ:
            b.mangel(f"Keyframes nicht zeitlich aufsteigend: {a['id']} ({de(a['zeit_s'], 3)} s) "
                     f"steht vor {c['id']} ({de(c['zeit_s'], 3)} s)")
        elif abs(c["zeit_s"] - a["zeit_s"]) <= TOLERANZ:
            b.hinweis(f"{a['id']} und {c['id']} liegen auf derselben Zeit ({de(a['zeit_s'], 3)} s)")
    _nicht_bildgenau(b, "Keyframes", [k["id"] for k in ks if not _bildgenau(k["zeit_s"], fps)], fps)


def _modus(c):
    """Modus in Kleinschrift, ohne Angabe „pro“; None, wenn er kein Text ist (dann meldet _clips den Mangel)."""
    m = c.get("modus") or "pro"
    return m.lower() if isinstance(m, str) else None


def _modell(c, ohne="–"):
    """Modell als Anzeige-Text: ohne Modell `ohne`, bei falschem Typ „?“ (den Mangel meldet pruefen)."""
    m = c.get("modell")
    if not isinstance(m, str):
        return ohne if m is None else "?"
    return _text(m) if m.strip() else ohne


def _clips(d, b):
    cl, kf_ids = d["clips"], _ids(d, "keyframes")
    kf = {k["id"]: k for k in d["keyframes"]} if "keyframes" in b.heil else {}
    for c in cl:
        for feld in ("von", "nach"):
            if kf_ids is not None and c[feld] not in kf_ids:
                b.mangel(f"{c['id']}: {feld} {c[feld]} – diesen Keyframe gibt es nicht")
        if c["dauer_s"] <= 0:
            b.mangel(f"{c['id']}: dauer_s muss größer 0 sein (ist {zeige(c['dauer_s'])})")
        if c["art"] not in CLIP_ARTEN:
            b.mangel(f"{c['id']}: art „{c['art']}“ unbekannt (erlaubt: {', '.join(CLIP_ARTEN)})")
        if c["quelle"] not in QUELLEN:
            b.mangel(f"{c['id']}: quelle „{c['quelle']}“ unbekannt (erlaubt: {', '.join(QUELLEN)})")
        if c.get("modell") == KLING:
            if not (float(c["dauer_s"]).is_integer() and 3 <= c["dauer_s"] <= 15):
                b.mangel(f"{c['id']}: {KLING} braucht eine ganze Dauer von 3 bis 15 s (ist {kurz(c['dauer_s'])} s)")
            if _modus(c) not in KLING_SATZ:
                b.mangel(f"{c['id']}: modus {zeige(c.get('modus'))} unbekannt (erlaubt: {', '.join(KLING_SATZ)})")
            if c["quelle"] != "higgsfield":
                b.hinweis(f"{c['id']}: Modell {KLING}, aber quelle „{c['quelle']}“")
        elif c["quelle"] == "higgsfield" and not c.get("modell"):
            b.hinweis(f"{c['id']}: Higgsfield-Clip ohne Modell – Kosten unbekannt")
        von, nach = kf.get(c["von"]), kf.get(c["nach"])
        if von and nach:
            spanne = nach["zeit_s"] - von["zeit_s"]
            if spanne <= TOLERANZ:
                b.hinweis(f"{c['id']}: läuft nicht vorwärts ({c['von']} {de(von['zeit_s'], 3)} s → "
                          f"{c['nach']} {de(nach['zeit_s'], 3)} s)")
            elif c["dauer_s"] > 0 and spanne > c["dauer_s"] * ZEITLUPE:
                b.hinweis(f"{c['id']}: {kurz(c['dauer_s'])} s Clip soll {de(spanne)} s Film füllen – "
                          f"Zeitlupe ×{de(c['dauer_s'] / spanne)} (KI-Clips ruckeln dann)")
    brueche = [f"{a['id']}→{c['id']} ({a['nach']} ≠ {c['von']})" for a, c in zip(cl, cl[1:]) if a["nach"] != c["von"]]
    if brueche:
        b.hinweis(f"Keyframe-Kette unterbrochen (harter Schnitt?): {aufzaehlen(brueche)}")


def _ton(d, b):
    dauer, fps = d["dauer_s"], d["bildrate"]
    for t in d["ton"]:
        if not -TOLERANZ <= t["zeit_s"] <= dauer + TOLERANZ:
            b.mangel(f"{t['id']}: zeit_s {de(t['zeit_s'], 3)} s liegt außerhalb des Films (0–{de(dauer, 3)} s)")
        if t["art"] not in TON_ARTEN:
            b.mangel(f"{t['id']}: art „{t['art']}“ unbekannt (erlaubt: {', '.join(TON_ARTEN)})")
    _nicht_bildgenau(b, "Tonereignisse", [t["id"] for t in d["ton"] if not _bildgenau(t["zeit_s"], fps)], fps)


def _anstieg(szenen):
    """Szenen vom Anfang bis zur Szene mit der höchsten Spannung (bei Gleichstand die letzte)."""
    hoch = max(s["spannung"] for s in szenen)
    return szenen[:max(i for i, s in enumerate(szenen) if s["spannung"] == hoch) + 1]


def _website_steigt(d, b):
    """Der Website-Anteil (aus der Ebene) fällt bis zum Höhepunkt nie – nur ein Hinweis."""
    anteil = {e["id"]: e["website_anteil"] for e in d["ebenen"]}
    anstieg = _anstieg(d["szenen"])
    vorher = None
    for s in anstieg:
        if s["ebene"] not in anteil:
            continue
        if vorher and anteil[s["ebene"]] < vorher[1]:
            b.hinweis(f"Website-Anteil fällt vor dem Höhepunkt {anstieg[-1]['id']}: {vorher[0]} {prozent(vorher[1])} → "
                      f"{s['id']} {prozent(anteil[s['ebene']])}")
        vorher = (s["id"], anteil[s["ebene"]])


def faktoren_messen(d):
    """Ebenen bis zum Höhepunkt (Reihenfolge des ersten Auftretens), ihre Werte und der gemessene Faktor je Ebene
    (Median der Schritte; Schritte ab 0 zählen nicht)."""
    ebenen = {e["id"]: e for e in d["ebenen"]}
    laengen = {}
    for s in _anstieg(d["szenen"]):
        if s["ebene"] in ebenen:
            laengen.setdefault(s["ebene"], []).append(s["dauer_s"])
    folge = list(laengen)
    reihen = {"szenenlaenge": [statistics.fmean(laengen[e]) for e in folge],
              "website_anteil": [ebenen[e]["website_anteil"] for e in folge],
              "atem": [ebenen[e]["atem_pro_min"] for e in folge]}
    gemessen = {}
    for k, r in reihen.items():
        schritte = [y / x for x, y in zip(r, r[1:]) if x > 0]
        if schritte:
            gemessen[k] = statistics.median(schritte)
    return folge, reihen, gemessen


def _faktoren(d, b):
    """Szenenlänge, Website-Anteil und Atem ändern sich je Ebene grob um den geplanten Faktor – nur Hinweise."""
    wert = {"szenenlaenge": lambda v: f"{de(v)} s", "website_anteil": prozent, "atem": lambda v: f"{kurz(v)}/min"}
    folge, reihen, b.gemessen = faktoren_messen(d)
    for k, name in FAKTOREN.items():
        soll, ist = d["faktoren"][k], b.gemessen.get(k)
        if ist is not None and not soll / SPIELRAUM <= ist <= soll * SPIELRAUM:
            werte = " · ".join(f"{e} {wert[k](v)}" for e, v in zip(folge, reihen[k]))
            b.hinweis(f"{name}-Faktor je Ebene gemessen ×{de(ist)}, geplant ×{de(soll)} "
                      f"(Spielraum ÷/× {de(SPIELRAUM)}): {werte}")


# ---------- Befehle ----------

def befehl_pruefen(pfad, d, b):
    for m in b.maengel:
        print(f"MANGEL: {m}", file=sys.stderr)
    for h in b.hinweise:
        print(f"HINWEIS: {h}", file=sys.stderr)
    hinweise = anzahl(len(b.hinweise), "Hinweis", "Hinweise")
    if b.maengel:
        print(f"Zeitleiste {pfad}: {anzahl(len(b.maengel), 'Mangel', 'Mängel')}, {hinweise}.")
        return 1
    teile = [anzahl(len(d[k]), eins, mehr) for k, eins, mehr in (("szenen", "Szene", "Szenen"),
             ("keyframes", "Keyframe", "Keyframes"), ("clips", "Clip", "Clips"), ("ton", "Tonereignis", "Tonereignisse"))]
    print(f"Zeitleiste {pfad}: in Ordnung – {', '.join(teile)}, {de(d['dauer_s'])} s bei {kurz(d['bildrate'])} B/s "
          f"({hinweise}).")
    if b.gemessen:
        print("Gemessen je Ebene bis zum Höhepunkt: " + " · ".join(
            f"{FAKTOREN[k]} ×{de(v)} (geplant ×{de(d['faktoren'][k])})" for k, v in b.gemessen.items()))
    return 0


def _szenen_zeilen(d, mit_namen=False):
    fps = d["bildrate"]
    ebenen = {e["id"]: e for e in d["ebenen"]}
    for s in d["szenen"]:
        e = ebenen.get(s["ebene"])
        ebene = s["ebene"] + (f" {_text(e.get('name'))}" if mit_namen and e else "")
        bilder = round((s["start_s"] + s["dauer_s"]) * fps) - round(s["start_s"] * fps)
        yield (s["id"], zeitcode(s["start_s"], fps), f"{de(s['dauer_s'])} s", str(bilder), ebene,
               prozent(e["website_anteil"]) if e else "?", kurz(s["spannung"]), _text(s.get("titel")))


def befehl_liste(d):
    sz = d["szenen"]
    print(f"{_text(d.get('titel'))} · {_text(d.get('fassung'))} · {de(d['dauer_s'])} s · {kurz(d['bildrate'])} B/s · "
          f"{anzahl(len(sz), 'Szene', 'Szenen')}")
    print(tabelle([KOPF_SZENEN, *_szenen_zeilen(d)], rechts={2, 3, 5, 6}))
    print("\nEbenen:")
    for e in d["ebenen"]:
        eigene = [s for s in sz if s["ebene"] == e["id"]]
        muster = f" · Musterseite {e['musterseite']}" if isinstance(e.get("musterseite"), str) else ""
        print(f"  {e['id']}  {_text(e.get('name'))} – {_text(e.get('welt'))} · "
              f"Website {prozent(e['website_anteil'])} · Atem {kurz(e['atem_pro_min'])}/min · "
              f"{anzahl(len(eigene), 'Szene', 'Szenen')}, "
              f"{de(sum(s['dauer_s'] for s in eigene))} s{muster}")


def befehl_markdown(d):
    print("| " + " | ".join(KOPF_SZENEN) + " |")
    print("|---|---|--:|--:|---|--:|--:|---|")
    for z in _szenen_zeilen(d, mit_namen=True):
        print("| " + " | ".join(w.replace("|", "\\|") for w in z) + " |")


def befehl_kurve(d, schritt=None):
    fps, dauer, sz = d["bildrate"], d["dauer_s"], d["szenen"]
    anteil = {e["id"]: e["website_anteil"] for e in d["ebenen"]}
    schritt = schritt or next((x for x in (0.25, 0.5, 1, 2, 5, 10, 15, 30, 60) if dauer / x <= 60), dauer / 60)
    gipfel = _anstieg(sz)[-1]
    print(f"Spannung (0–10, █ = 0,5) und Website-Anteil (0–100 %, █ = 5 %) über die Zeit · "
          f"eine Zeile = {kurz(schritt)} s · Höchstwert im Abschnitt")
    zeilen = [("Zeit", "Szenen", "Ebene", "Spannung", "", "Website", "", "")]
    for i in range(math.ceil(dauer / schritt - 1e-9)):
        a, z = i * schritt, min((i + 1) * schritt, dauer)
        drin = [s for s in sz if s["start_s"] < z - 1e-9 and s["start_s"] + s["dauer_s"] > a + 1e-9]
        if not drin:
            continue
        sp = max(s["spannung"] for s in drin)
        web = max(anteil.get(s["ebene"], 0.0) for s in drin)
        zeilen.append((zeitcode(a, fps), drin[0]["id"] + (f" +{len(drin) - 1}" if len(drin) > 1 else ""),
                       "/".join(dict.fromkeys(s["ebene"] for s in drin)), balken(sp, 10), kurz(sp),
                       balken(web, 1), prozent(web), "◀ Höhepunkt" if any(s is gipfel for s in drin) else ""))
    print(tabelle(zeilen, rechts={4, 6}))


def ist_higgsfield(c):
    return c["quelle"] == "higgsfield" or c.get("modell") == KLING


def clip_credits(c):
    """Geschätzte Credits eines Clips; None = kein Satz bekannt (anderes Modell, kein Modell, unbekannter Modus)."""
    if c.get("modell") == KLING and _modus(c) in KLING_SATZ:
        return c["dauer_s"] * KLING_SATZ[_modus(c)]
    return None


def kosten(d):
    """Higgsfield-Clips, -Sekunden und Kostenschätzung (Sätze nur für kling_o3_flf bekannt)."""
    hf = [c for c in d["clips"] if ist_higgsfield(c)]
    je_modus = dict.fromkeys(KLING_SATZ, 0.0)
    for c in hf:
        if clip_credits(c) is not None:
            je_modus[_modus(c)] += c["dauer_s"]
    return {"clips": len(hf), "sekunden": sum(c["dauer_s"] for c in hf), "je_modus": je_modus,
            "credits": sum(clip_credits(c) or 0.0 for c in hf), "ohne_satz": [c for c in hf if clip_credits(c) is None]}


def befehl_clips(d):
    kf = {k["id"]: k for k in d["keyframes"]}
    zeilen = [("Clip", "Von → Nach", "Art", "Quelle", "Modell", "Modus", "Dauer", "Spanne", "Credits")]
    for c in d["clips"]:
        von, nach, cr = kf.get(c["von"]), kf.get(c["nach"]), clip_credits(c)
        zeilen.append((c["id"], f"{c['von']} → {c['nach']}", c["art"], c["quelle"], _modell(c),
                       (_modus(c) or "?") if c.get("modell") == KLING else "–", f"{kurz(c['dauer_s'])} s",
                       f"{de(nach['zeit_s'] - von['zeit_s'])} s" if von and nach else "?",
                       de(cr) if cr is not None else "?" if ist_higgsfield(c) else "–"))
    print(tabelle(zeilen, rechts={6, 7, 8}))
    k = kosten(d)
    teile = [f"{m} {kurz(s)} s × {de(KLING_SATZ[m])} = {de(s * KLING_SATZ[m])}" for m, s in k["je_modus"].items() if s]
    print(f"\nHiggsfield: {anzahl(k['clips'], 'Clip', 'Clips')}, {kurz(k['sekunden'])} s")
    print(f"Schätzung {KLING}: {' · '.join(teile) if teile else 'keine Sekunden'} → {de(k['credits'])} Credits")
    if k["ohne_satz"]:
        print("Ohne Kostensatz – vorher gratis abfragen (get_cost): " + aufzaehlen(
            f"{c['id']} ({_modell(c, 'ohne Modell')}, {kurz(c['dauer_s'])} s)" for c in k["ohne_satz"]))
    print("Schätzung für je einen Versuch, ohne Gewähr. Bezahlte Erzeugung nur mit Elias' ausdrücklicher Freigabe "
          "(vorher sagen: was, wie viele Credits, wofür).")


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("befehl", choices=("pruefen", "liste", "kurve", "clips", "markdown"))
    ap.add_argument("pfad", nargs="?", default=str(STANDARDPFAD), help="zeitleiste.json (Standard: Werbefilm „Traum“)")
    ap.add_argument("--schritt", type=float,
                    help="kurve: Sekunden je Zeile (Standard: automatisch, höchstens 60 Zeilen)")
    a = ap.parse_args(argv)
    if a.schritt is not None and not a.schritt > 0:
        ap.error("--schritt muss größer 0 sein")
    try:
        d, doppelt = laden(a.pfad)
    except Ladefehler as e:
        print(f"MANGEL: {e}", file=sys.stderr)
        return 1
    b = pruefe(d, doppelt)
    if a.befehl == "pruefen":
        return befehl_pruefen(a.pfad, d, b)
    if not BRAUCHT[a.befehl] <= b.heil:
        for m in b.maengel:
            print(f"MANGEL: {m}", file=sys.stderr)
        print(f"Die Zeitleiste ist für „{a.befehl}“ nicht lesbar – erst die Mängel beheben (zeitleiste.py pruefen).",
              file=sys.stderr)
        return 1
    if b.maengel:
        print(f"HINWEIS: die Zeitleiste hat {anzahl(len(b.maengel), 'Mangel', 'Mängel')} – "
              "zeitleiste.py pruefen zeigt sie.", file=sys.stderr)
    if a.befehl == "kurve":
        befehl_kurve(d, a.schritt)
    else:
        {"liste": befehl_liste, "markdown": befehl_markdown, "clips": befehl_clips}[a.befehl](d)
    return 0


if __name__ == "__main__":
    sys.exit(main())
