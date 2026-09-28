#!/usr/bin/env python3
"""Baut aus Variante 1 eine Vorschau zum Veröffentlichen als Artifact auf claude.ai.

Artifacts betten jede Seite in ein eigenes Grundgerüst ein; CSS, JavaScript, Schriften und Icons müssen deshalb
in der Seite selbst stecken. Fotos, Muster und PDF liegen als eigene Dateien daneben.

    python3 werkzeuge/seiten.py
    python3 werkzeuge/vorschau.py /pfad/zum/ordner

Danach den Ordner mit dem Artifact-Werkzeug veröffentlichen: Seite index.html, alle übrigen Dateien über „files“
(die .htm-Seiten mit contentType text/html). Zum Aktualisieren dieselbe URL angeben.
"""
import base64
import re
import shutil
import sys
from pathlib import Path

wurzel = Path(__file__).resolve().parent.parent / "public"
ziel = Path(sys.argv[1] if len(sys.argv) > 1 else "/tmp/urfa-v1-vorschau")
if ziel.exists():
    shutil.rmtree(ziel)
(ziel / "assets/img").mkdir(parents=True)

css = (wurzel / "assets/css/style.css").read_text(encoding="utf-8")
css = re.sub(r'url\("\.\./fonts/([^"]+\.woff2)"\)',
             lambda m: 'url("data:font/woff2;base64,' + base64.b64encode((wurzel / "assets/fonts" / m.group(1)).read_bytes()).decode() + '")', css)
css = css.replace('url("../img/', 'url("assets/img/')
css += "\n:root { color-scheme: dark; }\n.kopf { top: env(safe-area-inset-top, 0px); }\n"

js = (wurzel / "assets/js/main.js").read_text(encoding="utf-8").replace("assets/img/icons.svg#", "#")
icons = (wurzel / "assets/img/icons.svg").read_text(encoding="utf-8")
icons = re.sub(r"<\?xml[^>]*>\s*", "", icons).replace("<svg ", '<svg style="display:none" aria-hidden="true" ', 1)

seiten = ["index.html", "speisekarte.htm", "galerie.htm", "kontakt.htm", "impressum.htm", "datenschutz.htm"]
for name in seiten:
    doc = (wurzel / name).read_text(encoding="utf-8")
    titel = re.search(r"<title>.*?</title>", doc, re.S).group(0)
    if name == "index.html":
        titel = "<title>URFA SOFRASI Variante 1</title>"
    ld = "\n".join(re.findall(r'<script type="application/ld\+json">.*?</script>', doc, re.S))
    body_cls = re.search(r"<body(?: class=\"([^\"]*)\")?>", doc).group(1) or ""
    koerper = re.search(r"<body[^>]*>(.*)</body>", doc, re.S).group(1)
    koerper = koerper.replace('<script src="assets/js/main.js" defer></script>', "")
    koerper = koerper.replace('"assets/img/icons.svg#', '"#')
    seite = f"""{titel}
<meta name="robots" content="noindex">
<meta name="theme-color" content="#0f0e0c">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<script>document.documentElement.classList.add("js");document.documentElement.lang="de";</script>
<style>
{css}
</style>
{ld}
<script>document.body.className = {body_cls!r};</script>
{icons}
{koerper.strip()}
<script>
{js}
</script>
"""
    (ziel / name).write_text(seite, encoding="utf-8")

for f in (wurzel / "assets/img").iterdir():
    if f.suffix in (".webp", ".svg", ".jpg") and f.name != "icons.svg":
        shutil.copy2(f, ziel / "assets/img" / f.name)
shutil.copy2(wurzel / "favicon.svg", ziel / "favicon.svg")
shutil.copy2(wurzel / "speisekarte.pdf", ziel / "speisekarte.pdf")
dateien = sorted(str(p.relative_to(ziel)) for p in ziel.rglob("*") if p.is_file())
print(f"Vorschau in {ziel}: {len(dateien)} Dateien")
