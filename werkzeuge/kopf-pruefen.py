#!/usr/bin/env python3
"""Head check: what belongs in the <head> and what does not? For all Bruder sites.

    python3 werkzeuge/kopf-pruefen.py bruder-a            (all .html/.htm in the folder)
    python3 werkzeuge/kopf-pruefen.py bruder-a/index.html  (one file)

Runs automatically after every edit of a Bruder site (hook in .claude/settings.json) and in /pruefen.
Exit 1 on errors. Rules: see CLAUDE.md, section „Kopf (<head>)“.
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
        f(1, "<!DOCTYPE html> missing (otherwise quirks mode)")
    if not L.html_attrs.get("lang"):
        f(1, '<html lang="de"> missing')
    if not L.hat_head:
        f(1, "no <head>")
        return fehler
    kopf_tags = [t for t, _, _ in L.kopf]
    if not kopf_tags or kopf_tags[0] != "meta" or "charset" not in L.kopf[0][1]:
        f(L.kopf[0][2] if L.kopf else 1, '<meta charset="utf-8"> must be the first element in the <head>')
    if not any(t == "meta" and a.get("name") == "viewport" for t, a, _ in L.kopf):
        f(1, '<meta name="viewport" …> missing in the <head>')
    if kopf_tags.count("title") != 1:
        f(1, f"exactly one <title> required in the <head> (found: {kopf_tags.count('title')})")
    if not any(t == "meta" and a.get("name") == "description" for t, a, _ in L.kopf):
        f(1, '<meta name="description"> missing (SEO)')

    for t, a, z in L.kopf:
        if t not in ERLAUBT_IM_KOPF:
            f(z, f"<{t}> does not belong in the <head> (only meta, title, link, script, style, noscript, base)")
        if t == "link" and a.get("rel") == "preload" and a.get("as") == "font" and "crossorigin" not in a:
            f(z, "Font preload without crossorigin is loaded twice")
        if t == "link" and "fonts.googleapis" in (a.get("href") or ""):
            f(z, "Google Fonts CDN forbidden (privacy) – host fonts locally")
    for t, a, z in L.koerper:
        if t in NUR_IM_KOPF:
            f(z, f"<{t}> belongs in the <head>, not in the <body>")
        if t == "meta" and "itemprop" not in a:
            f(z, "<meta> belongs in the <head>")
        if t == "link" and a.get("rel") in ("stylesheet", "preload", "icon"):
            f(z, f'<link rel="{a.get("rel")}"> belongs in the <head>')

    for ort, a, z, js in L.skripte:
        if ort != "kopf":
            continue
        if a.get("src"):
            if not ({"defer", "async"} & set(a)) and a.get("type") != "module":
                f(z, f'<script src="{a["src"]}"> in the <head> without defer: blocks loading and runs before the page → add defer')
        elif DOM_ZUGRIFF.search(js) and not WARTET.search(js):
            f(z, "Inline script in the <head> accesses the page, which does not exist there yet → wrap in a function, "
                 "call it after the element or wait for DOMContentLoaded")
    return fehler


def main():
    ziele = sys.argv[1:] or sorted(str(p) for p in Path(".").glob("bruder-[abc]"))
    dateien = []
    for z in map(Path, ziele):
        dateien += sorted(z.glob("*.htm*")) if z.is_dir() else [z]
    alle = [m for d in dateien for m in pruefe(d)]
    for m in alle:
        print("  ✗", m)
    print(f"Head check: {len(dateien)} page(s), {len(alle)} error(s)")
    sys.exit(1 if alle else 0)


if __name__ == "__main__":
    main()
