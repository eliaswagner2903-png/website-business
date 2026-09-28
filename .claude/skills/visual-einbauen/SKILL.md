---
name: visual-einbauen
description: Ein Visual (Foto, 3D-Szene, später Higgsfield-Bild oder -Video) leistungsschonend in eine Seite einbauen - Bildpipeline AVIF/WebP mit srcset, Poster der 3D-Szene rendern, Budget und Übergang prüfen. Nutzen bei "Bild einbauen", "Hero-Visual", "3D-Objekt", neuen Fotos vom Kunden oder vor dem Einbau von Higgsfield-Material.
---

# Visual einbauen (Ziel: vom Entwurf bis gemessen in unter 30 min)

`$S` = Seitenordner (z. B. `kunden/<slug>`), Server: `node werkzeuge/gzserver.mjs <port> $S/public` (eigener Hintergrundbefehl).

## 1. Foto / Standbild
`node werkzeuge/bilder.mjs <bild> $S/public/medien --name=<motiv> --sizes="…" --alt="…" [--hero]`
- erzeugt AVIF + WebP in 640/1016/1600 px (nie hochskaliert) und gibt das fertige `<picture>` aus → einfügen.
- `--hero` nur für das Bild im ersten Bildschirm (LCP: `fetchpriority="high"`, nie lazy). `sizes` an das Layout anpassen.
- Nur echte Fotos des Kunden, keine Stockfotos (nichts erfinden). Alt-Text beschreibt, was zu sehen ist.

## 2. 3D-Szene (`vorlage/bausteine/szene-3d/`, Einbau siehe dortiges README)
1. `szene-3d.js`, `szene-3d.modul.js` nach `public/js/`, `szene-3d.css` nach `public/css/`, Markup aus `demo.html`.
2. Objekt/Farben per `data-objekt`, `data-farbe="--farbe-akzent"` wählen; Farben kommen aus `css/marke.css`.
3. Poster rendern – nach **jeder** Änderung an Objekt, Farbe, Seitenverhältnis:
   `node werkzeuge/poster-rendern.mjs http://localhost:<port>/index.html $S/public/medien`
4. Objekt geändert? `node vorlage/bausteine/szene-3d/bauen.mjs` (bündelt three.js neu, meldet die Größe).

## 3. Prüfen (Pflicht)
- `node werkzeuge/budget.mjs $S/public <port> <seite>` – `js` ≤ 60 KB (erster Aufruf), `jsNachgeladen` ≤ 180 KB, fps ≥ 55.
- `SEITEN=<seite> bash werkzeuge/lighthouse.sh $S/public <port>` – LCP-Element muss das Poster/Bild sein.
- Übergang: `node werkzeuge/bildfolge.mjs http://localhost:<port>/<seite> "warte:.szene-3d--bereit"` – kein Sprung.
- „Bewegung reduzieren“ und ohne JS: nur das Standbild, nichts fehlt.

## 4. Video (WebM + MP4) – braucht ffmpeg (hier nicht installierbar)
Schleife 6–8 s, ohne Ton, ≤ 1,5 MB, `muted playsinline loop preload="none"`, `poster` = Bild aus Schritt 1 (LCP),
bei reduzierter Bewegung und „Daten sparen“ nur das Poster. Befehle stehen im README der 3D-Szene.

## 5. Higgsfield (später, sobald Konto + MCP verbunden)

**Feste Regel von Elias:** Keine Higgsfield-Werkzeuge aufrufen, die Credits kosten (`generate_*`, `execute_preset`,
Upscale, 3D, Video, Audio …). **Vor jeder Higgsfield-Generierung Elias fragen: was, ungefähre Credits, wozu.**
Bis zu seiner ausdrücklichen Erlaubnis gilt das Verbot; nur lesende Aufrufe (Kataloge ansehen) sind frei.
Visuals kommen bis dahin aus echten Kundenfotos und dem Baustein `szene-3d` (three.js, prozedural).

Higgsfield liefert **Rohmaterial**; ab dann ist der Weg derselbe: Bild → Schritt 1, Video → Schritt 4,
Produkt-/Objektansicht als Video statt Echtzeit-3D, wenn keine Interaktion nötig ist. Agent `visual-higgsfield`
erzeugt Varianten und trägt Prompt/Modell/Datum in `kunden/<slug>/medien-quellen.md` ein.
