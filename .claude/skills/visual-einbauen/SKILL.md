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
- `node werkzeuge/budget.mjs $S/public <port> <seite>` – Grenzen der Klasse aus `kunde.json` (`schlank` 60/180 KB JS, `erlebnis` 200/600, `kino` 350/1500), fps ≥ 55.
- `SEITEN=<seite> bash werkzeuge/lighthouse.sh $S/public <port>` – LCP-Element muss das Poster/Bild sein.
- Übergang: `node werkzeuge/bildfolge.mjs http://localhost:<port>/<seite> "warte:.szene-3d--bereit"` – kein Sprung.
- „Bewegung reduzieren“ und ohne JS: nur das Standbild, nichts Wichtiges fehlt.

## 4. Video (WebM + MP4) – Baustein `vorlage/bausteine/hero-video`
ffmpeg gibt es per npm: `npm i ffmpeg-static` im Scratchpad → `node_modules/ffmpeg-static/ffmpeg`.
```
ffmpeg -i roh.mp4 -an -vf scale=1280:-2 -c:v libvpx-vp9 -b:v 0 -crf 31 -row-mt 1 -cpu-used 1 -pix_fmt yuv420p film.webm
ffmpeg -i roh.mp4 -an -vf scale=1280:-2 -c:v libx264 -crf 22 -preset slow -pix_fmt yuv420p -movflags +faststart film.mp4
```
Schleife 5–10 s, ohne Ton, ≤ 1,5 MB. Poster = Startbild des Videos (Schritt 1). Markup/JS/CSS aus `hero-video`
(`held-video--16x9` für Filme weiter unten, dort Poster mit `loading="lazy"`). Bei „Bewegung reduzieren“ und
„Daten sparen“ bleibt nur das Poster, Halt-Knopf 48 px (WCAG 2.2.2). Naht prüfen: SSIM erstes/letztes Bild ≥ 0,99.

## 5. Higgsfield

**Feste Regel von Elias:** Credits nur mit seiner ausdrücklichen Freigabe (Motiv, Modell, Credits vorher nennen).
Kosten vorher mit `get_cost: true` abfragen (kostet nichts). Stand 2026-09-29:

| Modell | Einstellung | Credits |
|---|---|---|
| `gpt_image_2_5` | 1k, Qualität „low“ (Standard) | 0,25 |
| `recraft_v4_1` | 1k | 1,25 |
| `kling3_0` | 5 s, `mode: std`, `sound: off` | 6,25 |
| `kling3_0` | 6 s, `mode: std`, `sound: off` | 7,50 |
| `seedance_2_0_mini` | 4 s, 480p / 720p, ohne Ton | 2 / 4 |
| `seedance1_5` | 4 s, 720p, ohne Ton | 4,80 |
| `seedance_2_0` | 4 s, `mode: fast`, 720p, ohne Ton | 10 |
| `seedance_2_0` | 8 s, `mode: std`, 1080p, ohne Ton | 72 |
| `seedance_2_5` | 4 s, 480p, ohne Ton | 12 |
| `seedance_2_5` | 5 s | 35 |

- **Seedance vs. Kling (A-048):** Seedance 2.x kann Start-/Endbild plus Bild-/Video-Referenzen und bis 15 s (2.5: 30 s)
  in einem Zug: stark für lange Kamerafahrten (Scroll-Film). Für kurze ruhige Schleifen reicht `kling3_0` billiger.
  `seedance_2_0_mini` nur 480p/720p: als Ersatz für einen 1080p-Kling-Film ein Rückschritt.
- **Nahtlose Schleife:** bei `kling3_0` dasselbe Bild als `start_image` und `end_image` (Job-ID als `value`),
  Prompt „Locked-off static camera … nothing else moves“ → ruhige Bewegung, Naht praktisch unsichtbar.
- **Download:** Ergebnisse liegen auf `d8j0ntlcm91z4.cloudfront.net`. Die Domain muss in der Netzwerkfreigabe der
  Umgebung stehen; eine Änderung wirkt erst in neuen Sitzungen.
- Batch-Aufträge können am Ratenlimit (429) scheitern; gescheiterte Einträge kosten nichts, einzeln neu senden.
- KI-Bilder sichtbar kennzeichnen (Bildunterschrift) und mit `data-pruefen` markieren: nie als echtes Foto des Kunden ausgeben.

Higgsfield liefert **Rohmaterial**; ab dann ist der Weg derselbe: Bild → Schritt 1, Video → Schritt 4,
Produkt-/Objektansicht als Video statt Echtzeit-3D, wenn keine Interaktion nötig ist. Agent `visual-higgsfield`
erzeugt Varianten und trägt Prompt/Modell/Datum in `kunden/<slug>/medien-quellen.md` ein.
