#!/usr/bin/env python3
"""YouTube-Lernsystem: Daten holen, Frames ziehen, Wissen prüfen, suchen, Index bauen.

    python3 werkzeuge/youtube.py holen <url|id> [--sprache de,en]   Metadaten + Transkript nach werkzeuge/ausgabe/youtube/<id>/
    python3 werkzeuge/youtube.py liste <playlist|kanal|suche:begriff> [--n 10]   Video-Liste (ohne Download)
    python3 werkzeuge/youtube.py frames <id> --zeiten 1:30,5:00 [--breite 960]   Einzelbilder nach .../<id>/frames/
    python3 werkzeuge/youtube.py pruefen [datei ...]                 Wissensdateien prüfen (ohne Datei: alle)
    python3 werkzeuge/youtube.py suche <begriff ...> [--n 5]         relevante Quellen/Konzepte finden
    python3 werkzeuge/youtube.py index                               wissen/youtube/index.md neu bauen

Werkzeuge: yt-dlp (Metadaten, Untertitel, Video für Frames) mit youtube-transcript-api als Rückfall, ffmpeg für Frames.
Kein API-Key, kein Konto. Rohtranskripte bleiben in werkzeuge/ausgabe (nicht im Git); ins Wissen kommt nur Extrahiertes.
Ausgabe der Fehler immer: Problem / Ursache / Alternative. Exit 0 = ok, 1 = Fehler, 2 = Prüfung mit Mängeln.
"""
import argparse
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

WURZEL = Path(__file__).resolve().parent.parent
AUSGABE = WURZEL / "werkzeuge" / "ausgabe" / "youtube"
WISSEN = WURZEL / "wissen" / "youtube"
KATEGORIEN = ["webdesign", "ux", "frontend", "backend", "ai", "claude", "marketing", "sales", "business", "seo", "content", "video", "automation", "recht", "sonstiges"]
PFLICHT_KOPF = ["titel", "url", "video_id", "kanal", "datum", "dauer", "kategorien", "tags", "gelernt"]
PFLICHT_ABSCHNITTE = ["Zusammenfassung", "Kernideen", "Methoden", "Werkzeuge", "Beispiele", "Handlungsempfehlungen",
                      "Aussagen des Creators", "Wichtige Zeitstempel", "Visuelles", "Relevanz für unsere Arbeit",
                      "Verknüpfungen"]
AUSSAGE_ARTEN = {"FAKT", "BEHAUPTUNG", "MEINUNG", "ERFAHRUNG", "EMPFEHLUNG", "SCHLUSSFOLGERUNG"}
GEHEIMNIS = re.compile(r"(sk-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{30,}|ghp_[A-Za-z0-9]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY|api[_-]?key\s*[:=]\s*\S{12,})", re.I)


def fehler(problem, ursache, alternative, code=1):
    print(f"PROBLEM: {problem}\nURSACHE: {ursache}\nALTERNATIVE: {alternative}", file=sys.stderr)
    sys.exit(code)


def video_id(s):
    m = re.search(r"(?:v=|youtu\.be/|shorts/|embed/|live/)([A-Za-z0-9_-]{11})", s) or re.fullmatch(r"([A-Za-z0-9_-]{11})", s.strip())
    return m.group(1) if m else None


def ytdlp(*args, timeout=180):
    exe = shutil.which("yt-dlp") or str(Path.home() / ".local/bin/yt-dlp")
    if not Path(exe).exists():
        fehler("yt-dlp fehlt", "nicht installiert", "python3 -m pip install yt-dlp (kein Konto nötig)")
    return subprocess.run([exe, "--no-warnings", "--no-playlist", *args], capture_output=True, text=True, timeout=timeout)


def stempel(sek):
    sek = int(sek)
    return f"{sek // 3600:02d}:{sek % 3600 // 60:02d}:{sek % 60:02d}" if sek >= 3600 else f"{sek // 60:02d}:{sek % 60:02d}"


def zeit_zu_sek(z):
    t = [int(x) for x in z.strip().split(":")]
    return sum(v * 60 ** i for i, v in enumerate(reversed(t)))


def diagnose(text):
    t = text.lower()
    if "private video" in t:
        return "Video ist privat", "nur der Besitzer kann es sehen", "öffentliche Version suchen oder Inhalt als Text einfügen"
    if "unavailable" in t or "removed" in t or "terminated" in t:
        return "Video nicht verfügbar", "gelöscht, gesperrt oder regional beschränkt", "anderes Video nutzen oder Inhalt als Text einfügen"
    if "sign in to confirm" in t or "confirm you" in t and "bot" in t:
        return "YouTube verlangt Bestätigung", "Bot-Schutz für diese IP", "später erneut versuchen; Notlösung: Transkript selbst einfügen"
    if "429" in t or "too many requests" in t:
        return "Zu viele Anfragen (429)", "Rate-Limit von YouTube", "einige Minuten warten, weniger Videos je Lauf"
    if "age" in t and "restrict" in t:
        return "Altersbeschränkt", "Login nötig", "anderes Video oder Inhalt als Text einfügen"
    return "Abruf fehlgeschlagen", text.strip()[-200:] or "unbekannt", "erneut versuchen; sonst Inhalt als Text einfügen"


def meta_holen(vid):
    r = ytdlp("--skip-download", "--dump-single-json", f"https://www.youtube.com/watch?v={vid}")
    if r.returncode != 0:
        fehler(*diagnose(r.stderr))
    d = json.loads(r.stdout)
    return {
        "video_id": vid, "titel": d.get("title"), "url": f"https://www.youtube.com/watch?v={vid}",
        "kanal": d.get("channel") or d.get("uploader"), "datum": (d.get("upload_date") or "")[:8],
        "dauer_sek": d.get("duration"), "dauer": stempel(d.get("duration") or 0), "sprache": d.get("language"),
        "beschreibung": d.get("description") or "", "kapitel": [{"start": c["start_time"], "titel": c["title"]} for c in d.get("chapters") or []],
        "tags": d.get("tags") or [], "kategorien_youtube": d.get("categories") or [], "live": d.get("is_live"),
        "untertitel_manuell": sorted((d.get("subtitles") or {}).keys()), "untertitel_auto": sorted((d.get("automatic_captions") or {}).keys()),
    }


def lies_json3(pfad):
    segs = []
    for e in json.loads(Path(pfad).read_text(encoding="utf-8")).get("events", []):
        text = "".join(s.get("utf8", "") for s in e.get("segs", [])).replace("\n", " ").strip()
        if text:
            segs.append({"start": e["tStartMs"] / 1000, "text": text})
    return segs


def transkript_ytdlp(vid, meta, sprachen):
    man, auto = meta["untertitel_manuell"], meta["untertitel_auto"]
    orig = meta.get("sprache")
    wahl = None
    for art, verf in (("manuell", man), ("automatisch", auto)):
        for s in ([orig] if orig else []) + sprachen:
            for k in verf:
                if k == s or k.split("-")[0] == s.split("-")[0]:
                    wahl = (art, k)
                    break
            if wahl:
                break
        if wahl:
            break
    if not wahl:
        return None, "keine passenden Untertitel (manuell: %s, automatisch: %s)" % (man or "-", auto[:5] or "-")
    art, k = wahl
    with tempfile.TemporaryDirectory() as tmp:
        r = ytdlp("--skip-download", "--write-subs" if art == "manuell" else "--write-auto-subs", "--sub-langs", k,
                  "--sub-format", "json3", "-o", f"{tmp}/s", f"https://www.youtube.com/watch?v={vid}")
        dateien = list(Path(tmp).glob("s.*.json3"))
        if not dateien:
            return None, r.stderr.strip()[-200:] or "Untertitel-Download leer"
        return {"quelle": f"yt-dlp/{art}", "sprache": k, "segmente": lies_json3(dateien[0])}, None


def transkript_api(vid, sprachen):
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
        api = YouTubeTranscriptApi()
        t = api.fetch(vid, languages=sprachen)
        return {"quelle": "youtube-transcript-api", "sprache": t.language_code,
                "segmente": [{"start": s.start, "text": s.text.replace("\n", " ")} for s in t.snippets]}, None
    except ImportError:
        return None, "youtube-transcript-api nicht installiert"
    except Exception as e:  # Bibliothek wirft viele eigene Typen
        return None, type(e).__name__


def blocke(meta, segs):
    """Gliedert nach Kapiteln, sonst in Blöcke von ~4 Minuten."""
    grenzen = [(c["start"], c["titel"]) for c in meta["kapitel"]] or [(i * 240, f"Block {i + 1}") for i in range(int((meta["dauer_sek"] or 0) // 240) + 1)]
    out = []
    for i, (start, titel) in enumerate(grenzen):
        ende = grenzen[i + 1][0] if i + 1 < len(grenzen) else float("inf")
        text = " ".join(s["text"] for s in segs if start <= s["start"] < ende)
        if text.strip():
            out.append((start, titel, text))
    return out


def cmd_holen(a):
    vid = video_id(a.ziel) or fehler("Keine gültige YouTube-URL", f"'{a.ziel}' enthält keine Video-ID", "Link der Form https://www.youtube.com/watch?v=… verwenden")
    sprachen = [s.strip() for s in a.sprache.split(",")]
    ziel = AUSGABE / vid
    ziel.mkdir(parents=True, exist_ok=True)
    meta = meta_holen(vid)
    if meta["live"]:
        fehler("Livestream", "noch kein vollständiges Transkript", "nach dem Ende erneut versuchen")
    (ziel / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8")
    tr, grund1 = transkript_ytdlp(vid, meta, sprachen)
    grund2 = None
    if not tr:
        tr, grund2 = transkript_api(vid, sprachen)
    print(f"TITEL: {meta['titel']}\nKANAL: {meta['kanal']}   DATUM: {meta['datum']}   DAUER: {meta['dauer']}   SPRACHE: {meta['sprache'] or '?'}")
    print(f"KAPITEL: {len(meta['kapitel'])}   ORDNER: {ziel.relative_to(WURZEL)}")
    if not tr:
        print(f"TRANSKRIPT: nicht verfügbar (yt-dlp: {grund1}; api: {grund2})")
        fehler("Kein Transkript", "Video hat keine Untertitel oder YouTube blockiert den Abruf",
               "Metadaten liegen vor. Alternativen: später erneut versuchen, Transkript von Elias einfügen lassen, "
               "oder nur Bildanalyse (frames) plus Beschreibung", code=3)
    (ziel / "transkript.json").write_text(json.dumps(tr, ensure_ascii=False), encoding="utf-8")
    md = [f"# {meta['titel']}\n", f"Quelle: {meta['url']} · {meta['kanal']} · {meta['datum']} · {meta['dauer']} · Transkript: {tr['quelle']} ({tr['sprache']})\n"]
    for start, titel, text in blocke(meta, tr["segmente"]):
        md.append(f"\n## [{stempel(start)}] {titel}\n{text}\n")
    (ziel / "roh.md").write_text("".join(md), encoding="utf-8")
    woerter = sum(len(s["text"].split()) for s in tr["segmente"])
    print(f"TRANSKRIPT: {len(tr['segmente'])} Segmente, ~{woerter} Wörter, Quelle {tr['quelle']} ({tr['sprache']})")
    print("Hinweis: automatische Untertitel enthalten Erkennungsfehler und keine Sprecherwechsel." if "automatisch" in tr["quelle"] or "api" in tr["quelle"] else "")
    if woerter > 25000:
        print("ACHTUNG: sehr lang, roh.md abschnittsweise lesen (nach Kapiteln) statt komplett.")
    print(f"LESEN: {(ziel / 'roh.md').relative_to(WURZEL)}")


def cmd_liste(a):
    ziel = a.ziel
    if ziel.startswith("suche:"):
        ziel = f"ytsearch{a.n}:{ziel[6:]}"
    r = ytdlp("--flat-playlist", "--playlist-end", str(a.n), "--dump-json", "--yes-playlist", ziel)
    if r.returncode != 0:
        fehler(*diagnose(r.stderr))
    for z in r.stdout.splitlines():
        d = json.loads(z)
        print(f"{d['id']}\t{stempel(d.get('duration') or 0)}\t{d.get('title')}\t{d.get('channel') or d.get('uploader') or ''}")


def cmd_frames(a):
    vid = video_id(a.ziel) or a.ziel
    ffmpeg = shutil.which("ffmpeg") or next(iter(sorted(Path("/opt/pw-browsers").glob("ffmpeg-*/ffmpeg-linux"))), None)
    if not ffmpeg:
        fehler("ffmpeg fehlt", "weder im System noch bei Playwright", "ffmpeg installieren; bis dahin nur Transkript nutzen")
    ziel = AUSGABE / vid / "frames"
    ziel.mkdir(parents=True, exist_ok=True)
    try:
        with tempfile.TemporaryDirectory() as tmp:
            r = ytdlp("-f", "bv[height<=480][height>=360][vcodec!*=av01][protocol=https]/bv[height<=480][vcodec!*=av01]/bv[height<=720][vcodec!*=av01]/worst",
                      "-o", f"{tmp}/v.%(ext)s", f"https://www.youtube.com/watch?v={vid}", timeout=120)
            dateien = [d for d in Path(tmp).glob("v.*") if d.stat().st_size > 0]
            if r.returncode != 0 or not dateien:
                raise RuntimeError(r.stderr.strip()[-150:])
            for z in a.zeiten.split(","):
                sek = zeit_zu_sek(z)
                out = ziel / f"{sek:05d}s.jpg"
                subprocess.run([ffmpeg, "-y", "-loglevel", "error", "-ss", str(sek), "-i", str(dateien[0]), "-frames:v", "1",
                                "-vf", f"scale={a.breite}:-2", "-q:v", "4", str(out)], check=False)
                print(out.relative_to(WURZEL) if out.exists() else f"FEHLT {z} (Zeit hinter Videoende?)")
            return
    except (RuntimeError, subprocess.TimeoutExpired) as e:
        print(f"HINWEIS: Videoabruf nicht möglich ({e}); Rückfall auf die 3 Vorschaubilder von YouTube (ca. 25/50/75 %, keine freie Zeitwahl).", file=sys.stderr)
    import urllib.request
    for n in (1, 2, 3):
        out = ziel / f"vorschau-{n}.jpg"
        try:
            urllib.request.urlretrieve(f"https://i.ytimg.com/vi/{vid}/hq{n}.jpg", out)
            print(out.relative_to(WURZEL))
        except OSError as e:
            print(f"FEHLT vorschau-{n}: {e}")


# ---- Wissensdateien -------------------------------------------------------------------------------------------

def lies_wissen(pfad):
    text = Path(pfad).read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---\n(.*)", text, re.S)
    if not m:
        return None, text
    kopf = {}
    for z in m.group(1).splitlines():
        if ":" in z:
            k, v = z.split(":", 1)
            v = v.strip()
            kopf[k.strip()] = [x.strip().strip("'\"") for x in v[1:-1].split(",") if x.strip()] if v.startswith("[") else v.strip("'\"")
    return kopf, m.group(2)


def wissensdateien():
    return sorted(p for p in WISSEN.rglob("*.md") if p.name not in ("index.md", "README.md", "VORLAGE.md") and "konzepte" not in p.parts)


def konzeptdateien():
    return sorted((WISSEN / "konzepte").glob("*.md")) if (WISSEN / "konzepte").exists() else []


def pruefe_datei(p, alle_ids):
    m = []
    kopf, body = lies_wissen(p)
    if kopf is None:
        return ["Kopf (--- … ---) fehlt"]
    for f in PFLICHT_KOPF:
        if not kopf.get(f):
            m.append(f"Kopffeld '{f}' fehlt")
    vid = kopf.get("video_id", "")
    if vid and (video_id(kopf.get("url", "")) != vid):
        m.append("url passt nicht zu video_id")
    if vid and not p.stem.endswith(vid):
        m.append(f"Dateiname sollte auf -{vid} enden")
    if vid and alle_ids.get(vid, p) != p:
        m.append(f"Video schon gelernt in {alle_ids[vid].relative_to(WURZEL)} (Duplikat)")
    kat = kopf.get("kategorien") or []
    if not isinstance(kat, list) or not kat or any(k not in KATEGORIEN for k in kat):
        m.append(f"Kategorien ungültig (erlaubt: {', '.join(KATEGORIEN)})")
    elif p.parent.name != kat[0]:
        m.append(f"Ordner '{p.parent.name}' passt nicht zur ersten Kategorie '{kat[0]}'")
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", kopf.get("gelernt", "")):
        m.append("'gelernt' muss JJJJ-MM-TT sein")
    for ab in PFLICHT_ABSCHNITTE:
        if not re.search(rf"^##\s+{re.escape(ab)}\b", body, re.M):
            m.append(f"Abschnitt '## {ab}' fehlt")
    if not re.search(r"\[\d{1,2}:\d{2}(:\d{2})?\]", body):
        m.append("keine Zeitstempel [mm:ss] als Quellenbeleg")
    arten = set(re.findall(r"\*\*(FAKT|BEHAUPTUNG|MEINUNG|ERFAHRUNG|EMPFEHLUNG|SCHLUSSFOLGERUNG)\*\*", body))
    if not arten:
        m.append("Aussagen nicht gekennzeichnet (**BEHAUPTUNG**, **MEINUNG** …)")
    for z in body.splitlines():
        if z.lstrip().startswith(">") and len(z.split()) > 30:
            m.append(f"Zitat zu lang (>30 Wörter, Urheberrecht): {z[:50]}…")
    if len(body.split()) > 3500:
        m.append("Datei sehr lang (>3500 Wörter): eher Auszug statt Transkriptkopie?")
    if GEHEIMNIS.search(body) or GEHEIMNIS.search(str(kopf)):
        m.append("möglicher Schlüssel/Geheimnis im Text")
    for ziel in re.findall(r"\]\(((?!https?:|#)[^)\s]+)\)", body):
        if not (p.parent / ziel.split("#")[0]).exists():
            m.append(f"toter Link: {ziel}")
    return m


def cmd_pruefen(a):
    dateien = [Path(x).resolve() for x in a.dateien] or wissensdateien()
    ids = {}
    for p in wissensdateien():
        k, _ = lies_wissen(p)
        if k and k.get("video_id"):
            ids.setdefault(k["video_id"], p)
    schlecht = 0
    for p in dateien:
        if "konzepte" in p.parts:
            k, b = lies_wissen(p)
            mg = [] if k and k.get("konzept") else ["Kopffeld 'konzept' fehlt"]
            mg += [f"toter Link: {z}" for z in re.findall(r"\]\(((?!https?:|#)[^)\s]+)\)", b) if not (p.parent / z.split('#')[0]).exists()]
        else:
            mg = pruefe_datei(p, ids)
        name = p.relative_to(WURZEL) if WURZEL in p.parents else p
        print(f"{'OK    ' if not mg else 'MANGEL'} {name}")
        for x in mg:
            print(f"   - {x}")
        schlecht += bool(mg)
    print(f"{len(dateien) - schlecht}/{len(dateien)} in Ordnung")
    sys.exit(2 if schlecht else 0)


def woerter(s):
    return {w[:6] for w in re.findall(r"[a-zäöüß0-9]{3,}", s.lower())}  # grobe Wortstämme (Landingpage ~ Landingpages)


def cmd_suche(a):
    frage = woerter(" ".join(a.begriffe))
    treffer = []
    for p in wissensdateien() + konzeptdateien():
        k, body = lies_wissen(p)
        if not k:
            continue
        kopf_text = " ".join(" ".join(v) if isinstance(v, list) else v for kk, v in k.items() if kk in ("titel", "kategorien", "tags", "konzept", "kanal"))
        wk, wb = woerter(kopf_text), woerter(body)
        punkte = 3 * len(frage & wk) + len(frage & wb) * 0.5
        if punkte:
            treffer.append((punkte, p, k, body))
    treffer.sort(key=lambda t: -t[0])
    if not treffer:
        print("Kein gespeichertes Wissen zu diesem Thema. (Noch keine passenden Videos gelernt.)")
        return
    for punkte, p, k, body in treffer[: a.n]:
        titel = k.get("titel") or k.get("konzept")
        m = re.search(r"^##\s+Zusammenfassung\s*\n+(.+)", body, re.M) or re.search(r"^##\s+Stand\s*\n+(.+)", body, re.M)
        print(f"[{punkte:.1f}] {p.relative_to(WURZEL)}  |  {titel}  |  {', '.join(k.get('kategorien', [])) if isinstance(k.get('kategorien'), list) else 'Konzept'}")
        if m:
            print(f"      {m.group(1)[:220]}")


def cmd_index(_a):
    WISSEN.mkdir(parents=True, exist_ok=True)
    zeilen, tagmap = [], {}
    for p in wissensdateien():
        k, _ = lies_wissen(p)
        if not k:
            continue
        rel = p.relative_to(WISSEN).as_posix()
        zeilen.append((k.get("kategorien", ["sonstiges"])[0], k.get("titel", p.stem), rel, k.get("kanal", ""), k.get("gelernt", "")))
        for t in k.get("tags", []):
            tagmap.setdefault(t.lower(), []).append((k.get("titel", p.stem), rel))
    out = ["# YouTube-Wissen: Index", "", "Automatisch erzeugt mit `python3 werkzeuge/youtube.py index`, nicht von Hand ändern.", "",
           f"Gelernte Videos: **{len(zeilen)}**", ""]
    for kat in KATEGORIEN:
        eintr = [z for z in zeilen if z[0] == kat]
        if eintr:
            out += [f"## {kat}", ""] + [f"- [{t}]({rel}) · {kanal} · gelernt {g}" for _, t, rel, kanal, g in sorted(eintr)] + [""]
    k_liste = konzeptdateien()
    if k_liste:
        out += ["## Konzepte (Wissen über mehrere Videos, inkl. Unterschiede)", ""]
        for p in k_liste:
            kk, _ = lies_wissen(p)
            out.append(f"- [{kk.get('konzept', p.stem) if kk else p.stem}](konzepte/{p.name})")
        out.append("")
    gemeinsam = {t: v for t, v in tagmap.items() if len(v) > 1}
    if gemeinsam:
        out += ["## Verknüpfungen über Schlagwörter (mind. 2 Videos)", ""]
        for t, v in sorted(gemeinsam.items()):
            out.append(f"- **{t}**: " + ", ".join(f"[{x}]({rel})" for x, rel in v))
        out.append("")
    (WISSEN / "index.md").write_text("\n".join(out), encoding="utf-8")
    print(f"index.md: {len(zeilen)} Videos, {len(k_liste)} Konzepte, {len(gemeinsam)} gemeinsame Schlagwörter")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = ap.add_subparsers(dest="cmd", required=True)
    h = sp.add_parser("holen"); h.add_argument("ziel"); h.add_argument("--sprache", default="de,en"); h.set_defaults(f=cmd_holen)
    l = sp.add_parser("liste"); l.add_argument("ziel"); l.add_argument("--n", type=int, default=10); l.set_defaults(f=cmd_liste)
    f = sp.add_parser("frames"); f.add_argument("ziel"); f.add_argument("--zeiten", required=True); f.add_argument("--breite", type=int, default=960); f.set_defaults(f=cmd_frames)
    pr = sp.add_parser("pruefen"); pr.add_argument("dateien", nargs="*"); pr.set_defaults(f=cmd_pruefen)
    s = sp.add_parser("suche"); s.add_argument("begriffe", nargs="+"); s.add_argument("--n", type=int, default=5); s.set_defaults(f=cmd_suche)
    sp.add_parser("index").set_defaults(f=cmd_index)
    a = ap.parse_args()
    try:
        a.f(a)
    except subprocess.TimeoutExpired:
        fehler("Zeitüberschreitung", "YouTube oder Netz antwortet nicht", "später erneut versuchen")


if __name__ == "__main__":
    main()
