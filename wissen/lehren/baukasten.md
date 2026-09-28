# Lehren aus Stufe 2 „Baukasten“ (2026-09-28)

| # | Beobachtung | Regel |
|---|---|---|
| 1 | `werkzeuge/bildfolge.mjs` brach ab: `currentTime` in ms lässt sich bei Scroll-Timeline-Animationen (`animation-timeline: view()`) nicht setzen | Bildfolge filtert jetzt auf `DocumentTimeline`; Scroll-gekoppelte Effekte funktional prüfen (`bausteine/pruefen.mjs`: erster Bildschirm voll sichtbar, darunter wartend, nach dem Scrollen sichtbar) |
| 2 | Einblend-Animation auf `transform` hätte Hover-Transforms derselben Kachel blockiert (Animation schlägt normale Regeln) | Einblenden über die Einzeleigenschaft `translate`, Hover über `transform` – beide wirken zusammen |
| 3 | `view()`-Bereich `entry 0% → entry 100%`: ein Element, das beim Laden ganz im Bild ist, hat den Bereich schon hinter sich | so bleibt der erste Bildschirm unangetastet – ohne Skript und ohne Klasse |
| 4 | Überlauf 391 px bei 320 px: „Datenschutzerklärung“ als H1 im Grid-Kind – `overflow-wrap: break-word` greift nicht, weil das Grid-Kind `min-width: auto` hat | `min-width: 0` auf Grid-Kinder (FEHLER 4 gilt auch für einspaltige Grids) |
| 5 | `pkill -f "gzserver.mjs 8111 …"` beendete die eigene Shell (Exit 144), weil das Muster auch in der eigenen Befehlszeile steht | Server nur als eigenen Hintergrundbefehl starten und so beenden; nach `pkill -f` nichts mehr in derselben Kette (FEHLER 37) |
| 6 | Test „nur Marken-Variablen“ meldete `--hell` aus dem Klassennamen `.knopf--hell` | Variablen nur als `var(--…)` bzw. Deklaration `--…:` zählen, nicht jedes `--` |
| 7 | Menü-Blatt `position: fixed` im Kopf funktioniert nur, weil der Kopf kein `backdrop-filter` mehr hat | Kopf deckend (`--farbe-grund`) statt Glaseffekt, wenn das Blatt darin wohnt (FEHLER 14) |
| 8 | Budget-fps schwankt auf der geteilten Maschine (einmal 54, gleich danach 61) | bei ✗ nur für fps einzeln nachmessen, bevor man sucht |
| 9 | Demos außerhalb von `public/` hatten beim Test keine CSP | `vorlage/_headers` ist ein Verweis auf `public/_headers`; `gzserver.mjs 8111 vorlage` liefert so dieselbe CSP |
| 10 | Test-Visuals ohne ffmpeg/Pillow: Chromium kann per Canvas `toDataURL('image/webp')` Poster und per `MediaRecorder` VP9-WebM erzeugen (8 s, 640 KB) | für Platzhalter reicht der vorhandene Browser; echtes MP4 (H.264) braucht ffmpeg (Stufe 4) |

Bewährt: `bausteine/einbauen.mjs` fügt Baustein-CSS/JS zu je einer Datei zusammen, `npm test` meldet veraltete Dateien
und feste Farbwerte. Beide Schemata (dunkel, warm) liefen ohne Änderung an Stil oder Bausteinen durch alle Prüfungen.
