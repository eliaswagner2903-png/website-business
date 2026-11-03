#!/usr/bin/env python3
"""Storyboard-Seite des Werbefilms „Traum“ erzeugen – ein HTML-Fragment zum Arbeiten (später privates Artifact).

    python3 werkzeuge/video-film/traum/storyboard.py [--film <filmordner>] [--aus <datei>]

Liest aus dem Filmordner (Standard: kunden/elias-studio/werbefilm-traum):
    zeitleiste.json          Szenen, Keyframes, Clips, Ton (Format: README.md, Prüfung: zeitleiste.py)
    01-drehbuch.md           nur Kopf: erste Überschrift (Titel), Absatz „Logline …“
    02-chatgpt-briefing.md   „## Master-Briefing“ + je Szene „### Karte <SZENEN-ID>“, je genau ein ```text-Block
    03-higgsfield.md         je Clip „### Clip <CLIP-ID>“: Einstellzeilen (Liste) + genau ein ```text-Block
    04-ton.md                je Tonereignis „### Ton <TON-ID>“ + genau ein ```text-Block
    00-grundlagen.md         nur das zuletzt notierte Higgsfield-Guthaben (Hinweis, keine Abfrage)
Schreibt standardmäßig <filmordner>/storyboard.html. Fehlende Dateien oder IDs: die Seite entsteht trotzdem, die Lücken
stehen dort als „noch nicht geschrieben“ und am Ende als Liste auf stderr. Ruft nichts Bezahltes auf.
Nur Python-Standardbibliothek.
"""
import argparse
import html
import math
import re
import sys
from datetime import datetime
from pathlib import Path

HIER = Path(__file__).resolve().parent
sys.path.insert(0, str(HIER))
import zeitleiste as zl  # noqa: E402

STANDARDFILM = zl.WURZEL / "kunden" / "elias-studio" / "werbefilm-traum"
DATEIEN = {"zeitleiste": "zeitleiste.json", "drehbuch": "01-drehbuch.md", "briefing": "02-chatgpt-briefing.md",
           "higgsfield": "03-higgsfield.md", "ton": "04-ton.md", "grundlagen": "00-grundlagen.md"}
FEHLT = "noch nicht geschrieben"
OHNE_PROMPT_TON = {"stille"}          # Stille braucht keinen Erzeugungs-Prompt
SCHRIFTEN = ("https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600"
             "&family=JetBrains+Mono:wght@400;500&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;"
             "1,7..72,400&display=swap")


# ---------- Markdown lesen ----------

ZAUN = re.compile(r"^\s{0,3}(`{3,}|~{3,})\s*([\w+-]*)\s*$")
UEBERSCHRIFT = re.compile(r"^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$")


def _zeilen_mit_zaun(text):
    """Zeilen mit Kennzeichen, ob sie in einem Codeblock liegen (Überschriften darin zählen nicht)."""
    offen = None
    for z in text.splitlines():
        m = ZAUN.match(z)
        if offen is None and m:
            offen = m.group(1)
            yield z, False
            continue
        if offen is not None:
            if m and m.group(1)[0] == offen[0] and len(m.group(1)) >= len(offen) and not m.group(2):
                offen = None
                yield z, False
            else:
                yield z, True
            continue
        yield z, False


def abschnitte(text):
    """Markdown in Abschnitte: Liste von (stufe, überschrift, zeilen bis zur nächsten Überschrift gleicher/höherer Stufe
    oder einer beliebigen weiteren Überschrift ≤ 3). Tiefere Überschriften (z. B. „#### Einstellungen“ unter
    „### Clip C01“) bleiben Zeilen des Abschnitts. Überschriften in Codeblöcken zählen nicht."""
    teile, aktuell = [], None
    for z, im_code in _zeilen_mit_zaun(text):
        m = None if im_code else UEBERSCHRIFT.match(z)
        if m and aktuell is not None and len(m.group(1)) > max(aktuell[0], 3):
            aktuell[2].append(z)
        elif m:
            aktuell = [len(m.group(1)), m.group(2).strip(), []]
            teile.append(aktuell)
        elif aktuell is not None:
            aktuell[2].append(z)
    return [tuple(t) for t in teile]


def block_lesen(zeilen):
    """Ein Abschnitt → {"hinweis": Text vor dem Block, "einstellungen": Listenzeilen, "text": erster Codeblock oder None,
    "bloecke": Anzahl Codeblöcke}. Bevorzugt den ersten ```text-Block, sonst den ersten Codeblock."""
    vor, liste, bloecke, aktuell, offen = [], [], [], None, None
    for z in zeilen:
        m = ZAUN.match(z)
        if offen is None and m:
            offen, aktuell = m.group(1), {"sprache": m.group(2).lower(), "zeilen": []}
            continue
        if offen is not None:
            if m and m.group(1)[0] == offen[0] and len(m.group(1)) >= len(offen) and not m.group(2):
                bloecke.append(aktuell)
                offen = aktuell = None
            else:
                aktuell["zeilen"].append(z)
            continue
        if bloecke:
            continue                      # Text nach dem Block gehört nicht zum Hinweis
        lz = re.match(r"^\s*[-*+]\s+(.*)$", z)
        zw = UEBERSCHRIFT.match(z)
        if zw:                            # Zwischenüberschrift im Abschnitt: als eigener Absatz
            vor += ["", zw.group(2).strip(), ""]
        elif lz:
            liste.append(lz.group(1).strip())
        else:
            vor.append(z)
    if aktuell is not None:              # nicht geschlossener Block zählt bis zum Abschnittsende
        bloecke.append(aktuell)
    wahl = next((b for b in bloecke if b["sprache"] == "text"), bloecke[0] if bloecke else None)
    hinweis = "\n".join(vor).strip()
    return {"hinweis": re.sub(r"\n\s*\n+", "\n\n", hinweis), "einstellungen": liste,
            "text": "\n".join(wahl["zeilen"]).strip("\n") if wahl else None, "bloecke": len(bloecke)}


def karten(text, wort):
    """Alle „### <wort> <ID>“-Abschnitte → {ID: block_lesen(...)}; die erste Fassung einer ID gilt."""
    muster = re.compile(rf"^{re.escape(wort)}\s+([A-Za-z0-9][\w.-]*)\b", re.IGNORECASE)
    aus = {}
    for stufe, titel, zeilen in abschnitte(text):
        m = muster.match(titel)
        if stufe == 3 and m and m.group(1) not in aus:
            aus[m.group(1)] = block_lesen(zeilen)
    return aus


def master_briefing(text):
    for stufe, titel, zeilen in abschnitte(text):
        if stufe == 2 and re.match(r"^master-briefing\b", titel, re.IGNORECASE):
            return block_lesen(zeilen)
    return None


def drehbuch_kopf(text):
    """Erste Überschrift und Logline (Absatz, der mit „Logline“ beginnt – fett oder als Überschrift)."""
    titel = next((t for _, t, _ in abschnitte(text)), None)
    absaetze = [a.strip() for a in re.split(r"\n\s*\n", text) if a.strip()]
    logline = None
    for i, a in enumerate(absaetze):
        kopf = UEBERSCHRIFT.match(a.splitlines()[0])
        roh = kopf.group(2) if kopf else a
        roh = re.sub(r"^\s*(?:\d+(?:\.\d+)*\.?\s+)?", "", roh)
        m = re.match(r"^[*_]{0,3}\s*Logline\b\s*[*_]{0,3}\s*[:：–—-]?\s*[*_]{0,3}\s*(.*)$", roh, re.DOTALL)
        if not m:
            continue
        rest = m.group(1).strip() if not kopf else ""
        if kopf and len(a.splitlines()) > 1:
            rest = "\n".join(a.splitlines()[1:]).strip()
        if not rest and i + 1 < len(absaetze) and not UEBERSCHRIFT.match(absaetze[i + 1].splitlines()[0]):
            rest = absaetze[i + 1]
        rest = re.sub(r"^>\s?", "", rest, flags=re.MULTILINE).strip()
        if rest:
            logline = " ".join(rest.split())
            break
    return titel, logline


def guthaben(text):
    """Zuletzt notiertes Higgsfield-Guthaben aus 00-grundlagen.md: (Zahl, Stand-Datum oder None) oder None."""
    m = None
    for m in re.finditer(r"Guthaben\W{0,6}([\d.]*\d(?:,\d+)?)\s*Credits", text):
        pass
    if not m:
        return None
    try:
        wert = float(m.group(1).replace(".", "").replace(",", "."))
    except ValueError:
        return None
    stand = re.findall(r"Stand\s+(\d{1,2}\.\d{1,2}\.\d{4})", text[:m.start()])
    return wert, stand[-1] if stand else None


# ---------- HTML-Bausteine ----------

def e(x):
    return html.escape("" if x is None else str(x), quote=True)


def inline(text):
    """Escape, dann nur einfache Markdown-Auszeichnung: **fett**, *kursiv*/_kursiv_, `code`. Kein HTML-Durchlass."""
    t = e(text)
    t = re.sub(r"`([^`\n]+)`", r"<code>\1</code>", t)
    t = re.sub(r"\*\*(?=\S)(.+?)(?<=\S)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<![\w*])\*(?=\S)([^*\n]+?)(?<=\S)\*(?![\w*])", r"<em>\1</em>", t)
    t = re.sub(r"(?<![\w_])_(?=\S)([^_\n]+?)(?<=\S)_(?![\w_])", r"<em>\1</em>", t)
    return t


def schlicht(text):
    """Markdown-Zeichen für Fettung/Kursiv/Code entfernen (für Text ohne Auszeichnung, z. B. SVG-Titel)."""
    return re.sub(r"(\*\*|(?<!\w)[*_](?=\S)|(?<=\S)[*_](?!\w)|`)", "", text)


def absaetze_html(text):
    return "".join(f"<p>{inline(' '.join(a.split()))}</p>" for a in re.split(r"\n\s*\n", text) if a.strip())


def html_id(*teile):
    return "-".join(re.sub(r"[^A-Za-z0-9_-]+", "-", str(t)).strip("-") or "x" for t in teile)


def wert(x):
    return x.strip() if isinstance(x, str) and x.strip() else None


def mmss(t):
    s = round(t)
    return f"{s // 60:02d}:{s % 60:02d}"


def tc(t, fps):
    """Zeitcode, wenn die Bildrate lesbar ist, sonst Sekunden."""
    return zl.zeitcode(t, fps) if fps else f"{zl.de(t)} s"


# Feste IDs im Fragment – Szenen-, Clip- und Kopier-IDs dürfen nicht auf sie fallen
FESTE_IDS = {"h-kurve", "h-ablauf", "h-master", "h-szenen", "kurve-titel", "kurve-text", "steuer", "alle-oeffnen",
             "alle-schliessen"}


class Seite:
    """Sammelt fehlende Teile (für stderr) und vergibt eindeutige, stabile HTML-IDs (aus den Roh-IDs abgeleitet)."""

    def __init__(self):
        self.fehlend, self.hinweise, self._ids = [], [], set(FESTE_IDS)

    def id(self, *teile):
        """html_id(*teile); bildet die Bereinigung zwei Roh-IDs gleich ab („S 1“, „S-1“), bekommt die spätere -2, -3 …"""
        basis = html_id(*teile)
        kandidat, n = basis, 1
        while kandidat in self._ids:
            n += 1
            kandidat = f"{basis}-{n}"
        self._ids.add(kandidat)
        return kandidat

    def kopierblock(self, schluessel, text, wo, beschriftung):
        """<pre> mit Kopierknopf (IDs aus dem Schlüssel, z. B. kopieren-karte-S03 / text-karte-S03); fehlt der Text,
        ein sichtbarer Platzhalter und ein Eintrag für stderr."""
        if text is None or not text.strip():
            self.fehlend.append(wo)
            return f'<p class="fehlt"><span class="marke">{FEHLT}</span> {e(wo)}</p>'
        kid = self.id("kopieren", *schluessel)
        pid = self.id("text", *schluessel)
        return (f'<div class="kopie"><div class="kopie-kopf"><span class="klappe">{e(beschriftung)}</span>'
                f'<button type="button" class="knopf kopieren" id="{kid}" data-ziel="{pid}" hidden>'
                f'Kopieren</button><span class="rueck" role="status" aria-live="polite"></span></div>'
                f'<pre id="{pid}" tabindex="0">{e(text)}</pre></div>')


# ---------- Diagramm ----------

def kurve_svg(d):
    """Inline-SVG: x = Filmzeit (s), Balken je Szene (Breite = Dauer, Höhe = Spannung), Linie Spannung (0–10),
    Stufenlinie Website-Anteil (0–100 %, gleiche Höhe wie Spannung/10), Marken an Weltgrenzen."""
    sz, fps, dauer = d["szenen"], d["bildrate"], d["dauer_s"]
    ebenen = {x["id"]: x for x in d.get("ebenen", []) if isinstance(x, dict)}
    reihenfolge = list(dict.fromkeys(s["ebene"] for s in sz))
    W, H, L, R, O, U = 1000, 300, 52, 56, 46, 236     # Breite, Höhe, Ränder links/rechts, Plot oben/unten
    breite = W - L - R
    spanne = max([dauer] + [s["start_s"] + s["dauer_s"] for s in sz]) or 1   # Szenen über dauer_s hinaus bleiben im Bild

    def x(t):
        return L + breite * min(max(t, 0), spanne) / spanne

    def y(v10):
        return U - (U - O) * min(max(v10, 0), 10) / 10

    teile = [f'<svg class="kurve" viewBox="0 0 {W} {H}" role="img" aria-labelledby="kurve-titel kurve-text">']
    gipfel = zl._anstieg(sz)[-1]
    teile.append(f'<title id="kurve-titel">Spannung und Website-Anteil über die Filmzeit</title>'
                 f'<desc id="kurve-text">{len(sz)} Szenen, {e(zl.de(dauer))} s. Höhepunkt {e(gipfel["id"])} bei '
                 f'{e(zl.zeitcode(gipfel["start_s"], fps))} mit Spannung {e(zl.kurz(gipfel["spannung"]))}.</desc>')
    teile.append(f'<rect class="k-flaeche" x="{L}" y="{O}" width="{breite}" height="{U - O}"/>')
    for v in (0, 2.5, 5, 7.5, 10):                 # Raster und beide y-Achsen in einem Maßstab
        yy = y(v)
        teile.append(f'<line class="k-raster" x1="{L}" x2="{W - R}" y1="{yy:.1f}" y2="{yy:.1f}" fill="none"/>')
        if v in (0, 5, 10):
            teile.append(f'<text class="k-achse" x="{L - 8}" y="{yy + 4:.1f}" text-anchor="end">{zl.kurz(v)}</text>'
                         f'<text class="k-achse" x="{W - R + 8}" y="{yy + 4:.1f}">{v * 10:.0f} %</text>')
    for s in sz:                                   # Balken je Szene
        x0, x1 = x(s["start_s"]), x(s["start_s"] + s["dauer_s"])
        stufe = reihenfolge.index(s["ebene"]) % 4
        b = max(x1 - x0 - 1.5, 0.5)
        teile.append(f'<rect class="k-balken k-ebene-{stufe}" x="{x0 + 0.75:.1f}" y="{y(s["spannung"]):.1f}" '
                     f'width="{b:.1f}" height="{U - y(s["spannung"]):.1f}"><title>{e(s["id"])} '
                     f'{e(schlicht(wert(s.get("titel")) or ""))} · {e(zl.zeitcode(s["start_s"], fps))} · '
                     f'{e(zl.de(s["dauer_s"]))} s · Spannung {e(zl.kurz(s["spannung"]))}</title></rect>')
        if b >= 24:
            teile.append(f'<text class="k-szene" x="{(x0 + x1) / 2:.1f}" y="{U - 6}" text-anchor="middle">'
                         f'{e(s["id"])}</text>')
    grenzen = [s for a, s in zip(sz, sz[1:]) if a["ebene"] != s["ebene"]]
    segmente, beginn = [], sz[0]
    for s in grenzen + [None]:
        ende = s["start_s"] if s else spanne
        segmente.append((beginn["ebene"], beginn["start_s"], ende))
        beginn = s
    for s in grenzen:                              # Weltgrenzen
        xx = x(s["start_s"])
        teile.append(f'<line class="k-grenze" x1="{xx:.1f}" x2="{xx:.1f}" y1="{O - 30}" y2="{U}" fill="none"/>')
    for eb, a, z in segmente:
        platz = x(z) - x(a) - 8
        name = wert(ebenen.get(eb, {}).get("name"))
        text = f"{eb} {name}" if name else eb
        zeichen = int(platz / 6.6)
        if zeichen < len(text):
            text = eb if zeichen >= len(eb) else ""
        if text:
            teile.append(f'<text class="k-welt" x="{x(a) + 5:.1f}" y="{O - 22}">{e(text)}</text>')
    web = []                                       # Website-Anteil als Stufenlinie
    for s in sz:
        v = ebenen.get(s["ebene"], {}).get("website_anteil")
        v = v * 10 if zl.ist_zahl(v) else 0
        web += [(x(s["start_s"]), y(v)), (x(s["start_s"] + s["dauer_s"]), y(v))]
    teile.append('<polyline class="k-web" fill="none" points="'
                 + " ".join(f"{a:.1f},{b:.1f}" for a, b in web) + '"/>')
    punkte = [(x(s["start_s"] + s["dauer_s"] / 2), y(s["spannung"])) for s in sz]
    teile.append('<polyline class="k-spannung" fill="none" points="'
                 + " ".join(f"{a:.1f},{b:.1f}" for a, b in punkte) + '"/>')
    for (px, py), s in zip(punkte, sz):
        teile.append(f'<circle class="k-punkt{" k-gipfel" if s is gipfel else ""}" cx="{px:.1f}" cy="{py:.1f}" '
                     f'r="{5 if s is gipfel else 3}"/>')
    gx, gy = punkte[sz.index(gipfel)]
    anker = "end" if gx > W - R - 80 else "start" if gx < L + 80 else "middle"
    teile.append(f'<text class="k-marke" x="{gx:.1f}" y="{max(gy - 12, O - 4):.1f}" text-anchor="{anker}">'
                 f'Höhepunkt {e(gipfel["id"])}</text>')
    schritt = next((s for s in (1, 2, 5, 10, 15, 30, 60, 120, 300) if spanne / s <= 12), spanne / 12)
    t = 0.0
    while t <= spanne + 1e-9:                      # Zeitachse
        xx = x(t)
        teile.append(f'<line class="k-strich" x1="{xx:.1f}" x2="{xx:.1f}" y1="{U}" y2="{U + 6}" fill="none"/>'
                     f'<text class="k-achse k-zeit" x="{xx:.1f}" y="{U + 22}" text-anchor="middle">{mmss(t)}</text>')
        t += schritt
    teile.append(f'<line class="k-basis" x1="{L}" x2="{W - R}" y1="{U}" y2="{U}" fill="none"/>')
    teile.append(f'<text class="k-achse k-titel" x="{L}" y="{U + 46}">◂ Spannung 0–10</text>'
                 f'<text class="k-achse k-titel" x="{(L + W - R) / 2:.1f}" y="{U + 46}" text-anchor="middle">'
                 f'Filmzeit mm:ss</text>'
                 f'<text class="k-achse k-titel" x="{W - R}" y="{U + 46}" text-anchor="end">Website-Anteil ▸</text>')
    teile.append("</svg>")
    return "".join(teile)


# ---------- Abschnitte der Seite ----------

ABLAUF = [
    ("ChatGPT-Karte", "Elias bekommt die Karte der Szene unverändert zum Einfügen (neuer Chat: erst das Master-Briefing) "
                      "und malt die Keyframe-Skizzen."),
    ("Skizzen prüfen", "/filmszene schickt die Skizzen an den Agenten kontinuitaet: „passt“ oder „nachbessern“, "
                       "Rückmeldung in Wirkung und Stimmung. Elias hat das letzte Wort."),
    ("Kosten + Freigabe", "Higgsfield gratis abfragen (balance, get_cost), dann Elias fragen: was, wie viele Credits, "
                          "wofür. Ohne sein OK keine Erzeugung."),
    ("Clip", "Genau den freigegebenen Auftrag einmal senden; Job-ID, Credits und Datum in 03-higgsfield.md."),
    ("Nahtprüfung", "kette-pruefen.py naehte gegen Vorgänger und Nachfolger, kontinuitaet sieht den Clip; "
                    "das echte letzte Bild wird Startbild des nächsten Clips."),
    ("Ton", "Tonereignisse aus 04-ton.md gegen das fertige Bild legen – auch hier nur mit Freigabe."),
]


def kopf_html(d, b, doku, kosten, guth, titel, unlesbar):
    teile = [f'<header class="kopf"><p class="klappe">Storyboard · Regiepult</p><h1>{e(titel)}</h1>']
    if doku.get("logline"):
        teile.append(f'<p class="logline">{inline(doku["logline"])}</p>')
    fakten = []
    if wert(d.get("fassung")):
        fakten.append(("Fassung", e(d["fassung"])))
    if "kopf" in b.heil:
        dauer, fps = d["dauer_s"], d["bildrate"]
        fakten.append(("Dauer", f'{mmss(dauer)} <span class="leise">({e(zl.de(dauer))} s)</span>'))
        fakten.append(("Bildrate", f"{e(zl.kurz(fps))} B/s"))
    for liste, eins, mehr in (("szenen", "Szene", "Szenen"), ("clips", "Clip", "Clips"),
                              ("ton", "Tonereignis", "Tonereignisse")):
        if isinstance(d.get(liste), list):
            fakten.append((mehr, str(len(d[liste]))))
    teile.append('<dl class="fakten">' + "".join(f"<div><dt>{k}</dt><dd>{v}</dd></div>" for k, v in fakten) + "</dl>")
    absatz = []
    if kosten:
        satz = (f"Schätzung Higgsfield: {zl.anzahl(kosten['clips'], 'Clip', 'Clips')}, "
                f"{zl.kurz(kosten['sekunden'])} s → <strong>≈ {zl.de(kosten['credits'])} Credits</strong> für je einen "
                f"Versuch ({zl.KLING}: pro {zl.de(zl.KLING_SATZ['pro'])} · std {zl.de(zl.KLING_SATZ['std'])} · "
                f"4k {zl.de(zl.KLING_SATZ['4k'])} Credits/s).")
        if kosten["ohne_satz"]:
            satz += (" Ohne Kostensatz, vorher gratis abfragen: "
                     + e(", ".join(c["id"] for c in kosten["ohne_satz"])) + ".")
        absatz.append(satz)
    if guth:
        menge, stand = guth
        vergleich = ""
        if kosten:
            diff = menge - kosten["credits"]
            vergleich = (f" – die Schätzung bleibt {zl.de(diff)} Credits darunter" if diff >= 0 else
                         f' – <span class="zustand-warn">die Schätzung übersteigt es um {zl.de(-diff)} Credits</span>')
        absatz.append(f"Guthaben laut 00-grundlagen.md{f' (Stand {e(stand)})' if stand else ''}: "
                      f"{zl.de(menge)} Credits{vergleich}. Vor jeder Freigabe neu abfragen (balance, gratis).")
    else:
        absatz.append("Guthaben vor jeder Freigabe gratis abfragen (balance).")
    teile.append('<p class="kosten">' + " ".join(absatz) + "</p>")
    for name, fehler in unlesbar.items():
        teile.append(f'<p class="zustand-warn">{e(name)} nicht lesbar: {e(fehler)}</p>')
    if b.maengel:
        teile.append(f'<p class="zustand-warn">Die Zeitleiste hat {zl.anzahl(len(b.maengel), "Mangel", "Mängel")} – '
                     f'<code>zeitleiste.py pruefen</code> zeigt sie. Die Seite zeigt, was lesbar ist.</p>')
    teile.append("</header>")
    return "".join(teile)


def kurve_html(d, b):
    teile = ['<section class="teil" aria-labelledby="h-kurve"><h2 id="h-kurve" class="klappe">Die Kurve</h2>']
    if not {"kopf", "szenen"} <= b.heil:
        teile.append(f'<p class="fehlt"><span class="marke">fehlt</span> Szenen der Zeitleiste nicht lesbar.</p>')
        return "".join(teile) + "</section>"
    teile.append(f'<div class="rolle" tabindex="0" role="region" aria-label="Diagramm, waagerecht scrollbar">'
                 f'{kurve_svg(d)}</div><p class="schmal leise">Diagramm waagerecht verschieben.</p>')
    teile.append('<ul class="legende">'
                 '<li><svg viewBox="0 0 28 10" aria-hidden="true"><line class="k-spannung" x1="1" x2="27" y1="5" '
                 'y2="5" fill="none"/></svg>Spannung 0–10, Punkt in der Szenenmitte</li>'
                 '<li><svg viewBox="0 0 28 10" aria-hidden="true"><line class="k-web" x1="1" x2="27" y1="5" y2="5" '
                 'fill="none"/></svg>Website-Anteil der Ebene, 0–100 %</li>'
                 '<li><svg viewBox="0 0 14 10" aria-hidden="true"><rect class="k-balken k-ebene-1" x="1" y="1" '
                 'width="12" height="8"/></svg>Szene: Breite = Dauer, Höhe = Spannung, Ton = Ebene</li>'
                 '<li><svg viewBox="0 0 10 10" aria-hidden="true"><line class="k-grenze" x1="5" x2="5" y1="0" '
                 'y2="10" fill="none"/></svg>Weltgrenze</li></ul></section>')
    return "".join(teile)


def ablauf_html():
    schritte = "".join(f'<li><span class="nr">{i}</span><h3>{e(t)}</h3><p>{e(x)}</p></li>'
                       for i, (t, x) in enumerate(ABLAUF, 1))
    return ('<section class="teil" aria-labelledby="h-ablauf"><h2 id="h-ablauf" class="klappe">Ablauf je Szene</h2>'
            f'<ol class="ablauf">{schritte}</ol></section>')


def hinweis_html(blk, mit_liste=True):
    """Text vor dem Block als Hinweis – Absätze und (außer bei Clips, dort stehen sie als Einstellungen) Listenzeilen."""
    if not blk:
        return ""
    innen = absaetze_html(blk["hinweis"]) if blk["hinweis"] else ""
    if mit_liste and blk["einstellungen"]:
        innen += '<ul class="einst">' + "".join(f"<li>{inline(x)}</li>" for x in blk["einstellungen"]) + "</ul>"
    return f'<div class="hinweis">{innen}</div>' if innen else ""


def master_html(seite, master):
    teile = ['<section class="teil" aria-labelledby="h-master"><h2 id="h-master" class="klappe">Master-Briefing '
             'für ChatGPT</h2>', hinweis_html(master)]
    teile.append(seite.kopierblock(("master",), master["text"] if master else None,
                                   "Master-Briefing (02-chatgpt-briefing.md)", "In einen neuen ChatGPT-Chat zuerst"))
    return "".join(teile) + "</section>"


def feld(name, inhalt, klasse=""):
    v = wert(inhalt)
    return (f'<div class="feld {klasse}"><dt>{e(name)}</dt>'
            f'<dd>{inline(v) if v else "<span class=leise>–</span>"}</dd></div>')


def clip_html(seite, c, kf, fps, prompts, hid):
    von, nach = kf.get(c["von"]), kf.get(c["nach"])

    def stelle(k, kid):
        return f'{e(kid)} <span class="tc">{e(tc(k["zeit_s"], fps))}</span>' if k else f"{e(kid)} ?"

    cr = zl.clip_credits(c)
    hf = zl.ist_higgsfield(c)
    if cr is not None:
        kosten = f"≈ {zl.de(cr)} Credits ({e(zl._modus(c))})"
    elif hf:
        kosten = '<span class="zustand-warn">Satz unbekannt – vorher gratis abfragen</span>'
    else:
        kosten = f"keine Credits ({e(c['quelle'])})"
    p = prompts.get(c["id"])
    zeilen = [f'<article class="clip" id="{hid}"><h5><span class="tc">{e(c["id"])}</span> '
              f'{stelle(von, c["von"])} → {stelle(nach, c["nach"])}</h5><dl class="werte">'
              f'<div><dt>Dauer</dt><dd>{e(zl.kurz(c["dauer_s"]))} s</dd></div>'
              f'<div><dt>Modell</dt><dd>{e(zl._modell(c))}</dd></div>'
              f'<div><dt>Art</dt><dd>{e(c["art"])} · {e(c["quelle"])}</dd></div>'
              f'<div><dt>Kosten</dt><dd>{kosten}</dd></div></dl>']
    extra = [f"Kamera: {wert(c.get('kamera'))}" if wert(c.get("kamera")) else None,
             f"Morph: {wert(c.get('morph'))}" if wert(c.get("morph")) else None]
    einst = [x for x in extra if x] + (p["einstellungen"] if p else [])
    if einst:
        zeilen.append('<ul class="einst">' + "".join(f"<li>{inline(x)}</li>" for x in einst) + "</ul>")
    zeilen.append(hinweis_html(p, mit_liste=False))
    if p or hf:
        zeilen.append(seite.kopierblock(("clip", c["id"]), p["text"] if p else None,
                                        f"Clip {c['id']} (03-higgsfield.md)", "Prompt Higgsfield (englisch)"))
    else:
        zeilen.append('<p class="leise">Kein KI-Prompt nötig – eigenes Material.</p>')
    return "".join(zeilen) + "</article>"


def ton_html(seite, t, fps, prompts):
    p = prompts.get(t["id"])
    zeilen = [f'<article class="ton" id="{seite.id("ton", t["id"])}"><h5><span class="tc">{e(t["id"])}</span> '
              f'<span class="tc">{e(tc(t["zeit_s"], fps))}</span> · {e(t["art"])}</h5>']
    beschr = " – ".join(x for x in (wert(t.get("inhalt")), wert(t.get("ereignis"))) if x)
    if beschr:
        zeilen.append(f"<p>{inline(beschr)}</p>")
    zeilen.append(hinweis_html(p))
    if p or t["art"] not in OHNE_PROMPT_TON:
        zeilen.append(seite.kopierblock(("ton", t["id"]), p["text"] if p else None, f"Ton {t['id']} (04-ton.md)",
                                        "Prompt ElevenLabs (englisch)"))
    return "".join(zeilen) + "</article>"


def szenen_html(seite, d, b, doku):
    teile = ['<section class="teil" aria-labelledby="h-szenen"><div class="szenen-kopf"><h2 id="h-szenen" '
             'class="klappe">Szenen in Filmreihenfolge</h2><div class="steuer" id="steuer" hidden>'
             '<button type="button" class="knopf" id="alle-oeffnen">Alle öffnen</button>'
             '<button type="button" class="knopf" id="alle-schliessen">Alle schließen</button></div></div>']
    fps = d["bildrate"] if "kopf" in b.heil else None
    kf = {k["id"]: k for k in d["keyframes"]} if "keyframes" in b.heil else {}
    clips = d["clips"] if "clips" in b.heil else []
    tonliste = d["ton"] if "ton" in b.heil else []
    cid = {id(c): seite.id("clip", c["id"]) for c in clips}   # vorab, damit Verweise auf spätere Clips stimmen

    def clips_html(liste):
        return "".join(clip_html(seite, c, kf, fps, doku["clips"], cid[id(c)]) for c in liste)

    def toene_html(liste):
        return "".join(ton_html(seite, t, fps, doku["toene"]) for t in liste)

    if not {"kopf", "szenen"} <= b.heil:          # Ersatzliste: alles Lesbare ohne Szenenzuordnung
        teile.append('<p class="fehlt"><span class="marke">fehlt</span> Szenen der Zeitleiste nicht lesbar – '
                     '<code>zeitleiste.py pruefen</code>. Darunter alles, was ohne Szenen lesbar ist.</p>')
        for sid, blk in doku["karten"].items():
            teile.append(f'<div class="unterteil" id="{seite.id("karte", sid)}"><h3 class="klappe u-titel">'
                         f'ChatGPT-Karte {e(sid)}</h3>' + hinweis_html(blk)
                         + seite.kopierblock(("karte", sid), blk["text"], f"Karte {sid} (02-chatgpt-briefing.md)",
                                             f"Karte {sid}") + "</div>")
        if clips:
            teile.append('<div class="unterteil"><h3 class="klappe u-titel">Clips (Szenen nicht lesbar)</h3>'
                         + clips_html(clips) + "</div>")
        if tonliste:
            teile.append('<div class="unterteil"><h3 class="klappe u-titel">Ton (Szenen nicht lesbar)</h3>'
                         + toene_html(tonliste) + "</div>")
        return "".join(teile) + "</section>"
    sz = d["szenen"]
    ids = {s["id"] for s in sz}
    ebenen = {x["id"]: x for x in d.get("ebenen", []) if isinstance(x, dict)}

    def szene_von(t):
        for i, s in enumerate(sz):
            a, z = s["start_s"], s["start_s"] + s["dauer_s"]
            if a - zl.TOLERANZ <= t < z - zl.TOLERANZ or (i == len(sz) - 1 and t <= z + zl.TOLERANZ):
                return s["id"]
        return None

    eigene, hinein = {}, {}
    for c in clips:                                # Clip gehört zur Szene seines Start-Keyframes
        von, nach = kf.get(c["von"]), kf.get(c["nach"])
        heim = (von or {}).get("szene")
        if heim not in ids:                        # Verweis fehlt oder zeigt ins Leere: nach Zeit zuordnen
            heim = szene_von(von["zeit_s"]) if von else None
        eigene.setdefault(heim, []).append(c)
        if von and nach:                           # weitere Szenen, die der Clip überdeckt
            for s in sz:
                if s["id"] != heim and s["start_s"] < nach["zeit_s"] - zl.TOLERANZ \
                        and s["start_s"] + s["dauer_s"] > von["zeit_s"] + zl.TOLERANZ:
                    hinein.setdefault(s["id"], []).append((c, heim))
    toene = {}
    for t in tonliste:
        toene.setdefault(szene_von(t["zeit_s"]), []).append(t)

    teile.append('<div class="szenen">')
    for i, s in enumerate(sz, 1):
        eb = ebenen.get(s["ebene"], {})
        welt = " · ".join(x for x in (s["ebene"], wert(eb.get("name")), wert(eb.get("welt"))) if x)
        anteil = eb.get("website_anteil")
        kopf = (f'<summary><span class="nr">{i:02d}</span><span class="tc zeit">{e(zl.zeitcode(s["start_s"], fps))}'
                f'</span><h3 class="s-titel"><span class="s-id">{e(s["id"])}</span> '
                f'{inline(wert(s.get("titel")) or "ohne Titel")}</h3><span class="s-meta"><span class="tc">'
                f'{e(zl.de(s["dauer_s"]))} s</span> · {e(welt)}'
                + (f' · Web {e(zl.prozent(anteil))}' if zl.ist_zahl(anteil) else "")
                + f' · Spannung {e(zl.kurz(s["spannung"]))}</span></summary>')
        inhalt = ['<div class="karte-innen"><dl class="felder">',
                  feld("Bild", s.get("bild"), "breit"), feld("Kamera", s.get("kamera")),
                  feld("Übergang heraus", s.get("uebergang_heraus")), feld("Website-Spur", s.get("website_spur")),
                  feld("Ton", s.get("ton")), feld("Zweck", s.get("zweck"), "breit"), "</dl>"]
        karte = doku["karten"].get(s["id"])
        inhalt.append('<div class="unterteil"><h4 class="klappe u-titel">ChatGPT-Karte</h4>' + hinweis_html(karte))
        inhalt.append(seite.kopierblock(("karte", s["id"]), karte["text"] if karte else None,
                                        f"Karte {s['id']} (02-chatgpt-briefing.md)", f"Karte {s['id']}"))
        inhalt.append("</div>")
        inhalt.append('<div class="unterteil"><h4 class="klappe u-titel">Clips</h4>')
        if eigene.get(s["id"]):
            inhalt.append(clips_html(eigene[s["id"]]))
        for c, heim in hinein.get(s["id"], []):
            inhalt.append(f'<p class="leise">Clip <a href="#{cid[id(c)]}">{e(c["id"])}</a> läuft hier '
                          f'weiter (beginnt in {e(heim or "?")}).</p>')
        if not eigene.get(s["id"]) and not hinein.get(s["id"]):
            inhalt.append('<p class="leise">Kein Clip in der Zeitleiste.</p>')
        inhalt.append('</div><div class="unterteil"><h4 class="klappe u-titel">Ton</h4>')
        if toene.get(s["id"]):
            inhalt.append(toene_html(toene[s["id"]]))
        else:
            inhalt.append('<p class="leise">Kein Tonereignis in der Zeitleiste.</p>')
        inhalt.append("</div></div>")
        teile.append(f'<details class="karte" id="{seite.id("szene", s["id"])}" open>'   # offen: ohne Klick lesbar
                     + kopf + "".join(inhalt) + "</details>")
    teile.append("</div>")
    if eigene.get(None):
        teile.append('<div class="unterteil"><h3 class="klappe u-titel">Clips ohne Szene</h3>'
                     + clips_html(eigene[None]) + "</div>")
    if toene.get(None):
        teile.append('<div class="unterteil"><h3 class="klappe u-titel">Ton außerhalb der Szenen</h3>'
                     + toene_html(toene[None]) + "</div>")
    return "".join(teile) + "</section>"


def fuss_html(film, vorhanden, unlesbar):
    zeiten = [p.stat().st_mtime for p in vorhanden.values()]
    stand = datetime.fromtimestamp(max(zeiten)).strftime("%d.%m.%Y %H:%M") if zeiten else "unbekannt"
    quellen = " · ".join(f"<code>{e(n)}</code>" + ("" if k in vorhanden and n not in unlesbar else
                                                   f' <span class="leise">(nicht lesbar)</span>' if n in unlesbar else
                                                   f' <span class="leise">({FEHLT})</span>')
                         for k, n in DATEIEN.items())
    try:                                           # kein lokaler absoluter Pfad im veröffentlichten Artifact
        ort = film.resolve().relative_to(zl.WURZEL).as_posix()
    except ValueError:
        ort = film.resolve().name
    return (f'<footer class="fuss"><p>Stand {e(stand)} (jüngste Quelldatei) · erzeugt mit '
            f'<code>werkzeuge/video-film/traum/storyboard.py</code></p><p>Quelle: <code>{e(ort)}</code> – {quellen}</p>'
            '<p class="pflicht">Bezahlte Erzeugung nur mit Elias\' Freigabe – vorher sagen: was, wie viele Credits, '
            'wofür.</p></footer>')


FUELLWORTE = {"der", "die", "das", "den", "dem", "des", "ein", "eine", "einer", "eines", "einem", "einen", "vom",
              "von", "im", "in", "am", "an", "zum", "zur", "und", "the", "a", "an", "of"}


def seitentitel(d, doku):
    """Name aus 2–4 Wörtern: „<Filmtitel> Storyboard“. Längere Titel: erst Füllwörter weg, reicht das nicht, das erste
    Substantiv (großgeschrieben) – nie ein hart abgeschnittener Rest wie „Der Traum vom“."""
    roh = wert(d.get("titel")) or wert(doku.get("titel")) or "Film"
    roh = re.split(r"\s+[–—-]\s+|:", roh)[0]
    worte = re.sub(r"[„“”\"'«»‚‘’]", "", roh).split() or ["Film"]
    if len(worte) > 3 and worte[0].lower() in FUELLWORTE:      # „Der Traum vom Fliegen“ → „Traum vom Fliegen“
        worte = worte[1:]
    if len(worte) > 3:
        worte = [w for w in worte if w.lower() not in FUELLWORTE] or worte
    if len(worte) > 3:
        worte = [next((w for w in worte if w[:1].isupper()), "Film")]
    return " ".join(worte + ["Storyboard"])


# ---------- Stil und Skript ----------

STIL = """
:root{
  --bg:#101312;--flaeche:#171b19;--flaeche-2:#1d2220;--linie:#2b312e;--linie-stark:#46504b;
  --text:#e4e8e5;--text-2:#a7b0ab;--text-3:#8a948e;
  --akzent:#62c283;--akzent-linie:#62c283;--akzent-text:#0d1a12;--akzent-flaeche:#173523;
  --warn:#e6b45a;--warn-flaeche:#3a2c12;--fokus:#8fdcaa;
  --e0:#7d8781;--e1:#a7b0ab;--e2:#c9d0cc;--e3:#5d6762;
  color-scheme:dark;
}
@media (prefers-color-scheme: light){
  :root:not([data-theme="dark"]){
    --bg:#f2f3f2;--flaeche:#ffffff;--flaeche-2:#f7f8f7;--linie:#d9ddda;--linie-stark:#a9b1ac;
    --text:#151a17;--text-2:#4f5852;--text-3:#68716b;
    --akzent:#1f6e3a;--akzent-linie:#2f8f4e;--akzent-text:#ffffff;--akzent-flaeche:#e3f1e8;
    --warn:#8a5a00;--warn-flaeche:#fbf0d9;--fokus:#14532b;
    --e0:#8b948f;--e1:#5d6762;--e2:#3b433f;--e3:#b3bab6;
    color-scheme:light;
  }
}
:root[data-theme="light"]{
  --bg:#f2f3f2;--flaeche:#ffffff;--flaeche-2:#f7f8f7;--linie:#d9ddda;--linie-stark:#a9b1ac;
  --text:#151a17;--text-2:#4f5852;--text-3:#68716b;
  --akzent:#1f6e3a;--akzent-linie:#2f8f4e;--akzent-text:#ffffff;--akzent-flaeche:#e3f1e8;
  --warn:#8a5a00;--warn-flaeche:#fbf0d9;--fokus:#14532b;
  --e0:#8b948f;--e1:#5d6762;--e2:#3b433f;--e3:#b3bab6;
  color-scheme:light;
}
*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);
  font:400 17px/1.55 Literata,"Iowan Old Style",Georgia,"Times New Roman",serif;
  padding-left:max(16px, env(safe-area-inset-left, 0px));padding-right:max(16px, env(safe-area-inset-right, 0px));
  padding-block:32px 48px;-webkit-text-size-adjust:100%;overflow-wrap:anywhere}
.blatt{max-width:1120px;margin:0 auto}
.klappe,summary .nr,.ablauf .nr,dt,.knopf,.marke{font-family:"Barlow Condensed","Arial Narrow","Roboto Condensed",
  "Helvetica Neue",Arial,sans-serif;text-transform:uppercase;letter-spacing:.09em;font-weight:600}
.tc,code,pre,.fakten dd{font-family:"JetBrains Mono",ui-monospace,"SFMono-Regular",Menlo,Consolas,monospace;
  font-variant-numeric:tabular-nums}
code{font-size:.88em;overflow-wrap:anywhere}
a{color:var(--akzent)}
:focus-visible{outline:2px solid var(--fokus);outline-offset:2px;border-radius:2px}
h1,h2,h3,h4,h5{margin:0;font-weight:600;line-height:1.2}
.leise{color:var(--text-3)}
.kopf{border-bottom:1px solid var(--linie);padding-bottom:24px}
.kopf .klappe{color:var(--akzent);font-size:15px;margin:0 0 6px}
.kopf h1{font-family:"Barlow Condensed","Arial Narrow",Arial,sans-serif;font-size:clamp(40px,7vw,68px);
  letter-spacing:.02em;text-transform:uppercase;line-height:1;hyphens:auto;-webkit-hyphens:auto}
.logline{font-size:clamp(18px,2.2vw,21px);font-style:italic;max-width:62ch;margin:14px 0 0;color:var(--text)}
.fakten{display:flex;flex-wrap:wrap;gap:4px 28px;margin:20px 0 0;padding:0}
.fakten div{min-width:0}
.fakten dt{font-size:13px;color:var(--text-3)}
.fakten dd{margin:0;font-size:16px}
.kosten{margin:16px 0 0;max-width:80ch;color:var(--text-2);font-size:16px}
.kosten strong{color:var(--text)}
.zustand-warn{color:var(--warn)}
p.zustand-warn{background:var(--warn-flaeche);padding:8px 12px;border-left:3px solid var(--warn);margin:12px 0 0}
.teil{margin-top:40px}
.teil>h2,.szenen-kopf h2{font-size:17px;color:var(--text-2);margin-bottom:14px}
.rolle{overflow-x:auto;border:1px solid var(--linie);background:var(--flaeche);padding:8px 4px}
.kurve{display:block;width:100%;min-width:1000px;height:auto}
.kurve text{font-family:"JetBrains Mono",ui-monospace,Menlo,Consolas,monospace;font-variant-numeric:tabular-nums}
.k-flaeche{fill:var(--flaeche-2)}
.k-raster{stroke:var(--linie);stroke-width:1}
.k-basis,.k-strich{stroke:var(--linie-stark);stroke-width:1}
.k-achse{fill:var(--text-3);font-size:12px}
.k-titel{font-family:"Barlow Condensed","Arial Narrow",Arial,sans-serif!important;text-transform:uppercase;
  letter-spacing:.08em;font-size:13px}
.k-zeit{font-size:12px}
.k-balken{fill-opacity:.34}
.k-ebene-0{fill:var(--e0)}.k-ebene-1{fill:var(--e1)}.k-ebene-2{fill:var(--e2)}.k-ebene-3{fill:var(--e3)}
.k-szene{fill:var(--text-2);font-size:11px}
.k-grenze{stroke:var(--text-3);stroke-width:1;stroke-dasharray:3 3}
.k-welt{fill:var(--text-2);font-size:12px}
.k-web{stroke:var(--text);stroke-width:1.6;stroke-dasharray:6 4}
.k-spannung{stroke:var(--akzent-linie);stroke-width:2.6;stroke-linejoin:round}
.k-punkt{fill:var(--akzent-linie)}
.k-gipfel{fill:var(--bg);stroke:var(--akzent-linie);stroke-width:2.6}
.k-marke{fill:var(--akzent);font-size:13px;font-weight:500}
.schmal{display:none;margin:6px 0 0;font-size:14px}
.legende{list-style:none;display:flex;flex-wrap:wrap;gap:6px 24px;padding:0;margin:10px 0 0;font-size:15px;
  color:var(--text-2)}
.legende li{display:flex;align-items:center;gap:8px;min-width:0}
.legende svg{width:28px;height:10px;flex:none}
.legende li:nth-child(3) svg,.legende li:nth-child(4) svg{width:14px}
.ablauf{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,170px),1fr));
  gap:0;border-top:2px solid var(--linie-stark)}
.ablauf li{padding:12px 14px 14px 0;min-width:0;border-bottom:1px solid var(--linie)}
.ablauf li+li{padding-left:14px;border-left:1px solid var(--linie)}
.ablauf .nr{display:block;font-size:30px;line-height:1;color:var(--akzent);letter-spacing:0}
.ablauf h3{font-family:"Barlow Condensed","Arial Narrow",Arial,sans-serif;font-size:19px;margin:6px 0 4px;
  text-transform:uppercase;letter-spacing:.05em}
.ablauf p{margin:0;font-size:15px;color:var(--text-2);line-height:1.45}
.hinweis{color:var(--text-2);font-size:15px;border-left:2px solid var(--linie-stark);padding-left:12px;margin:0 0 10px}
.hinweis p{margin:0 0 6px}
.kopie{border:1px solid var(--linie);background:var(--flaeche-2);margin:8px 0 0}
.kopie-kopf{display:flex;align-items:center;flex-wrap:wrap;gap:6px 12px;padding:6px 6px 6px 12px;
  border-bottom:1px solid var(--linie)}
.kopie-kopf .klappe{font-size:13px;color:var(--text-3);flex:1 1 auto;min-width:0}
.rueck{font-size:14px;color:var(--akzent);font-family:"Barlow Condensed","Arial Narrow",Arial,sans-serif;
  letter-spacing:.06em;text-transform:uppercase}
pre{margin:0;padding:12px;font-size:14px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere;
  overflow-x:auto;max-height:28em;overflow-y:auto;color:var(--text)}
.knopf{appearance:none;font-size:15px;min-height:44px;padding:0 16px;border:1px solid var(--linie-stark);
  background:var(--flaeche);color:var(--text);cursor:pointer;border-radius:2px}
.knopf:hover{border-color:var(--akzent)}
.kopieren{background:var(--akzent);color:var(--akzent-text);border-color:var(--akzent)}
.kopieren:hover{filter:brightness(1.08)}
.fehlt{margin:8px 0 0;color:var(--text-2);font-size:15px}
.marke{display:inline-block;font-size:12px;color:var(--warn);border:1px solid var(--warn);padding:1px 6px;
  margin-right:6px;background:var(--warn-flaeche)}
.szenen-kopf{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 16px;
  margin-bottom:14px}
.szenen-kopf h2{margin:0}
.steuer{display:flex;gap:8px;flex-wrap:wrap}
.steuer[hidden],.knopf[hidden]{display:none}
.szenen{border-top:2px solid var(--linie-stark)}
.karte{border-bottom:1px solid var(--linie);background:var(--bg)}
.karte[open]{background:var(--flaeche)}
summary{cursor:pointer;list-style:none;display:grid;grid-template-columns:12px auto auto 1fr;gap:4px 14px;
  align-items:baseline;padding:14px 12px 14px 8px;min-height:44px}
summary::-webkit-details-marker{display:none}
summary::before{content:"";grid-row:1/span 2;align-self:center;width:8px;height:8px;border-right:2px solid var(--text-3);
  border-bottom:2px solid var(--text-3);transform:rotate(-45deg);margin-right:2px}
.karte[open]>summary::before{transform:rotate(45deg);border-color:var(--akzent)}
summary .nr{font-size:22px;color:var(--akzent);line-height:1;letter-spacing:.02em}
summary .zeit{font-size:15px;color:var(--text-2)}
.s-titel{font-weight:600;font-size:18px;min-width:0}
.s-id{font-family:"JetBrains Mono",ui-monospace,Menlo,Consolas,monospace;font-weight:400;font-size:14px;
  color:var(--text-3);margin-right:4px}
.s-meta{grid-column:2/-1;font-size:14px;color:var(--text-3);min-width:0}
.karte-innen{padding:0 12px 20px 36px}
.felder{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:12px 28px;margin:4px 0 0}
.feld{min-width:0}
.feld.breit{grid-column:1/-1}
.feld dt{font-size:13px;color:var(--text-3)}
.feld dd{margin:2px 0 0;max-width:72ch}
.unterteil{margin-top:22px;min-width:0}
.unterteil>.u-titel{font-size:14px;color:var(--text-3);border-bottom:1px solid var(--linie);padding-bottom:4px;margin-bottom:8px}
.clip,.ton{padding:10px 0 14px;min-width:0}
.clip+.clip,.ton+.ton{border-top:1px dashed var(--linie)}
.clip h5,.ton h5{font-size:16px;font-weight:600}
.clip h5 .tc:first-child,.ton h5 .tc:first-child{color:var(--akzent)}
.werte{display:flex;flex-wrap:wrap;gap:2px 22px;margin:6px 0 0;font-size:15px}
.werte div{min-width:0}
.werte dt{display:inline;font-size:12px;color:var(--text-3);margin-right:6px}
.werte dd{display:inline;margin:0}
.einst{margin:8px 0 0;padding-left:18px;font-size:15px;color:var(--text-2)}
.ton p{margin:4px 0 0}
.fuss{margin-top:48px;padding-top:16px;border-top:1px solid var(--linie);font-size:14px;color:var(--text-3)}
.fuss p{margin:0 0 6px;overflow-wrap:anywhere}
.fuss .pflicht{color:var(--text-2);font-weight:600}
@media (max-width:640px){
  body{font-size:16px;padding-block:20px 36px}
  summary{grid-template-columns:12px auto 1fr;padding-right:4px}
  .s-titel{grid-column:2/-1}
  .karte-innen{padding:0 4px 18px 4px}
  .ablauf li,.ablauf li+li{padding-left:0;border-left:0}
  .schmal{display:block}
}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{transition:none!important;animation:none!important;
  scroll-behavior:auto!important}}
"""

SKRIPT = """
(function(){
  function start(){
    var steuer=document.getElementById('steuer');
    if(steuer){steuer.hidden=false;}
    var karten=function(){return document.querySelectorAll('details.karte');};
    var auf=document.getElementById('alle-oeffnen'), zu=document.getElementById('alle-schliessen');
    if(auf){auf.addEventListener('click',function(){karten().forEach(function(k){k.open=true;});});}
    if(zu){zu.addEventListener('click',function(){karten().forEach(function(k){k.open=false;});});}
    function markieren(el){
      try{var r=document.createRange();r.selectNodeContents(el);var s=window.getSelection();
        s.removeAllRanges();s.addRange(r);}catch(e){}
    }
    function melden(knopf,text){
      var r=knopf.parentNode.querySelector('.rueck');
      if(!r){return;}
      r.textContent=text;
      clearTimeout(knopf._uhr);
      knopf._uhr=setTimeout(function(){r.textContent='';},2500);
    }
    document.querySelectorAll('button.kopieren').forEach(function(knopf){
      knopf.hidden=false;
      knopf.addEventListener('click',function(){
        var ziel=document.getElementById(knopf.getAttribute('data-ziel'));
        if(!ziel){return;}
        var text=ziel.textContent;
        var ersatz=function(){markieren(ziel);melden(knopf,'Markiert – mit Strg+C kopieren');};
        try{
          if(navigator.clipboard&&navigator.clipboard.writeText){
            navigator.clipboard.writeText(text).then(function(){melden(knopf,'Kopiert');},ersatz);
          }else{ersatz();}
        }catch(e){ersatz();}
      });
    });
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',start);}else{start();}
})();
"""


# ---------- Zusammensetzen ----------

def lesen(film):
    """Vorhandene Quelldateien, nicht lesbare ({dateiname: fehler}) und gelesene Dokumente."""
    vorhanden = {k: film / n for k, n in DATEIEN.items() if (film / n).is_file()}
    unlesbar = {}

    def text(k):
        try:
            return vorhanden[k].read_text(encoding="utf-8-sig") if k in vorhanden else ""
        except (OSError, UnicodeDecodeError) as fehler:
            unlesbar[DATEIEN[k]] = str(fehler).replace(str(vorhanden[k]), DATEIEN[k])   # ohne lokalen Pfad
            return ""

    titel, logline = drehbuch_kopf(text("drehbuch"))
    briefing = text("briefing")
    doku = {"titel": titel, "logline": logline, "master": master_briefing(briefing), "karten": karten(briefing, "Karte"),
            "clips": karten(text("higgsfield"), "Clip"), "toene": karten(text("ton"), "Ton")}
    return vorhanden, unlesbar, doku, guthaben(text("grundlagen"))


def bauen(film):
    """Fragment-Text und Liste fehlender Teile (für stderr)."""
    film = Path(film)
    vorhanden, unlesbar, doku, guth = lesen(film)
    seite = Seite()
    d, b = {}, zl.Befund()
    if "zeitleiste" in vorhanden:
        try:
            d, doppelt = zl.laden(vorhanden["zeitleiste"])
            b = zl.pruefe(d, doppelt)
            if not isinstance(d, dict):
                d = {}
        except zl.Ladefehler as fehler:          # vorhanden, aber kaputt: auf der Seite zeigen, nicht „fehlt“
            unlesbar[DATEIEN["zeitleiste"]] = str(fehler).replace(str(vorhanden["zeitleiste"]), DATEIEN["zeitleiste"])
    else:
        seite.fehlend.append("zeitleiste.json")
    for name, fehler in unlesbar.items():
        seite.hinweise.append(f"{name} nicht lesbar: {fehler}")
    kosten = zl.kosten(d) if "clips" in b.heil else None
    titel = seitentitel(d, doku)
    filmtitel = wert(d.get("titel")) or wert(doku.get("titel")) or "Film"
    inhalt = [kopf_html(d, b, doku, kosten, guth, filmtitel, unlesbar), kurve_html(d, b), ablauf_html(),
              master_html(seite, doku["master"]), szenen_html(seite, d, b, doku), fuss_html(film, vorhanden, unlesbar)]
    for art, ids, liste in (("Karte", doku["karten"], "szenen"), ("Clip", doku["clips"], "clips"),
                            ("Ton", doku["toene"], "ton")):
        bekannt = {x.get("id") for x in d.get(liste, []) if isinstance(x, dict)} if isinstance(d.get(liste), list) else set()
        for i in ids:
            if bekannt and i not in bekannt:
                seite.hinweise.append(f"{art} {i} steht in den Dokumenten, aber nicht in der Zeitleiste")
        for i, blk in ids.items():
            if blk["bloecke"] > 1:
                seite.hinweise.append(f"{art} {i}: {blk['bloecke']} Codeblöcke – nur der erste ```text-Block zählt")
    fragment = (f'<title>{e(titel)}</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n'
                f'<link rel="preconnect" href="https://fonts.googleapis.com">\n'
                f'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
                f'<link rel="stylesheet" href="{e(SCHRIFTEN)}">\n<style>{STIL}</style>\n'
                f'<main class="blatt" lang="de">\n' + "\n".join(inhalt) + f'\n</main>\n<script>{SKRIPT}</script>\n')
    return fragment, seite


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--film", default=str(STANDARDFILM), help="Filmordner (Standard: Werbefilm „Traum“)")
    ap.add_argument("--aus", help="Zieldatei (Standard: <filmordner>/storyboard.html)")
    a = ap.parse_args(argv)
    film = Path(a.film)
    if not film.is_dir():
        print(f"MANGEL: Filmordner nicht gefunden: {film}", file=sys.stderr)
        return 1
    fragment, seite = bauen(film)
    ziel = Path(a.aus) if a.aus else film / "storyboard.html"
    ziel.write_text(fragment, encoding="utf-8")
    for h in seite.hinweise:
        print(f"HINWEIS: {h}", file=sys.stderr)
    if seite.fehlend:
        print(f"Fehlt ({len(seite.fehlend)}):", file=sys.stderr)
        for f in seite.fehlend:
            print(f"  {f}", file=sys.stderr)
    print(f"Storyboard geschrieben: {ziel} ({len(fragment.encode('utf-8')) // 1024} KB, "
          f"{zl.anzahl(len(seite.fehlend), 'Lücke', 'Lücken')})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
