#!/usr/bin/env python3
"""Kopf-Prüfung: Was gehört in den <head>, was nicht? Für alle Bruder-Seiten.

    python3 werkzeuge/kopf-pruefen.py bruder-a            (alle .html/.htm im Ordner)
    python3 werkzeuge/kopf-pruefen.py bruder-a/index.html  (eine Datei)

Läuft automatisch nach jeder Bearbeitung einer Bruder-Seite (Hook in .claude/settings.json) und in /pruefen.
Exit 1 bei Fehlern. Regeln siehe CLAUDE.md, Abschnitt „Kopf (<head>)“.
"""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ERLAUBT_IM_KOPF = {"meta", "title", "link", "script", "style", "noscript", "base", "template"}
NUR_IM_KOPF = {"title", "base"}
DOM_ZUGRIFF = re.compile(r"querySelector|getElementById|getElementsBy|document\.body|\.addEventListener\(\s*['\"]click")
WARTET = re.compile(r"DOMContentLoaded|readyState|function|=>")


class Leser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ort = "vor"          # vor | kopf | koerper
        self.tiefe_kopf = 0
        self.kopf = []            # (tag, attrs, zeile)
        self.koerper = []
        self.skript = None        # (ort, attrs, zeile, text)
        self.skripte = []
        self.html_attrs = {}
        self.hat_head = self.hat_body = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        zeile = self.getpos()[0]
        if tag == "html":
            self.html_attrs = a
        elif tag == "head":
            self.hat_head, self.ort = True, "kopf"
        elif tag == "body":
            self.hat_body, self.ort = True, "koerper"
        else:
            (self.kopf if self.ort == "kopf" else self.koerper).append((tag, a, zeile))
            if tag == "script":
                self.skript = [self.ort, a, zeile, ""]

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag):
        if tag == "head":
            self.ort = "zwischen"
        elif tag == "script" and self.skript:
            self.skripte.append(tuple(self.skript))
            self.skript = None

    def handle_data(self, data):
        if self.skript:
            self.skript[3] += data


def pruefe(datei: Path):
    fehler, text = [], datei.read_text(encoding="utf-8")
    L = Leser()
    L.feed(text)
    f = lambda z, m: fehler.append(f"{datei}:{z}: {m}")

    if not text.lstrip().lower().startswith("<!doctype html"):
        f(1, "<!DOCTYPE html> fehlt (sonst Quirks-Modus)")
    if not L.html_attrs.get("lang"):
        f(1, '<html lang="de"> fehlt')
    if not L.hat_head:
        f(1, "kein <head>")
        return fehler
    kopf_tags = [t for t, _, _ in L.kopf]
    if not kopf_tags or kopf_tags[0] != "meta" or "charset" not in L.kopf[0][1]:
        f(L.kopf[0][2] if L.kopf else 1, '<meta charset="utf-8"> muss das erste Element im <head> sein')
    if not any(t == "meta" and a.get("name") == "viewport" for t, a, _ in L.kopf):
        f(1, '<meta name="viewport" …> fehlt im <head>')
    if kopf_tags.count("title") != 1:
        f(1, f"genau ein <title> im <head> nötig (gefunden: {kopf_tags.count('title')})")
    if not any(t == "meta" and a.get("name") == "description" for t, a, _ in L.kopf):
        f(1, '<meta name="description"> fehlt (SEO)')

    for t, a, z in L.kopf:
        if t not in ERLAUBT_IM_KOPF:
            f(z, f"<{t}> gehört nicht in den <head> (nur meta, title, link, script, style, noscript, base)")
        if t == "link" and a.get("rel") == "preload" and a.get("as") == "font" and "crossorigin" not in a:
            f(z, "Schrift-Preload ohne crossorigin wird doppelt geladen")
        if t == "link" and "fonts.googleapis" in (a.get("href") or ""):
            f(z, "Google-Fonts-CDN verboten (Datenschutz) – Schriften lokal einbinden")
    for t, a, z in L.koerper:
        if t in NUR_IM_KOPF:
            f(z, f"<{t}> gehört in den <head>, nicht in den <body>")
        if t == "meta" and "itemprop" not in a:
            f(z, "<meta> gehört in den <head>")
        if t == "link" and a.get("rel") in ("stylesheet", "preload", "icon"):
            f(z, f'<link rel="{a.get("rel")}"> gehört in den <head>')

    for ort, a, z, js in L.skripte:
        if ort != "kopf":
            continue
        if a.get("src"):
            if not ({"defer", "async"} & set(a)) and a.get("type") != "module":
                f(z, f'<script src="{a["src"]}"> im <head> ohne defer: blockiert das Laden und läuft vor der Seite → defer ergänzen')
        elif DOM_ZUGRIFF.search(js) and not WARTET.search(js):
            f(z, "Inline-Skript im <head> greift auf die Seite zu, die es dort noch nicht gibt → in Funktion packen, "
                 "nach dem Element aufrufen oder auf DOMContentLoaded warten")
    return fehler


def main():
    ziele = sys.argv[1:] or sorted(str(p) for p in Path(".").glob("bruder-[abc]"))
    dateien = []
    for z in map(Path, ziele):
        dateien += sorted(z.glob("*.htm*")) if z.is_dir() else [z]
    alle = [m for d in dateien for m in pruefe(d)]
    for m in alle:
        print("  ✗", m)
    print(f"Kopf-Prüfung: {len(dateien)} Seite(n), {len(alle)} Fehler")
    sys.exit(1 if alle else 0)


if __name__ == "__main__":
    main()
