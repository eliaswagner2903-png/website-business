# Showcase „dunkel & edel“ – Lindgrund Uhrmacherei (Demo)

**Alles an dieser Seite ist ausgedacht.** Lindgrund gibt es nicht; Marke, Texte, Adresse, Telefonnummer und Preise
sind erfunden und auf der Seite als Demo gekennzeichnet (Band oben, Absatz im Fuß, `data-pruefen` an jeder
erfundenen Angabe – sichtbar mit `index.html#pruefen`). Die Seite dient als Arbeitsprobe.

## Aufbau

| Pfad | Inhalt |
|---|---|
| `public/` | die ausgelieferte Seite (HTML, `css/marke.css` + `css/stil.css`, `js/`, `fonts/`, `medien/`) |
| `src/szene.js` | die 3D-Uhr: Geometrie, Materialien, Studio-Licht, Bewegung |
| `src/worker.js`, `src/haupt.js` | Einstiege für Worker (OffscreenCanvas) und Rückfall im Haupt-Thread |
| `werkzeug/standbild.mjs` | rendert die Standbilder aus derselben Szene und wandelt sie in AVIF/WebP |
| `werkzeug/fps-3d.mjs` | misst Szenen- und Scroll-Bildrate mit laufender 3D-Szene |
| `werkzeug/uebergang.mjs` | Bildfolge des Übergangs Poster → Szene |
| `functions/api/kontakt.js` | Anfrageformular (Origin-Prüfung, Honigtopf, Resend); keine Zahlung |

## Arbeiten

```sh
npm install                 # three, esbuild, Schriften (nur zum Bauen)
npm run bauen               # Szene bündeln → public/js/uhr-worker.js und uhr-haupt.js
node werkzeug/standbild.mjs # Standbilder neu rendern (dauert ~1 min)
npm test && npm run html && npm run kopf
node ../../werkzeuge/gzserver.mjs 8104 public   # Server mit gzip und echten Headern
```

Die Schriftdateien in `public/fonts/` stammen aus `@fontsource`/`@fontsource-variable` (nur die Schnitte,
die vorkommen). `public/js/uhr-*.js` sind gebaute Dateien und liegen bewusst im Repo, damit die Seite ohne
Bauschritt ausgeliefert werden kann.

## Marke ändern

Alles Gestalterische steckt in `public/css/marke.css`: sechs Farbrollen, zwei Schriften, Radien, Tempi, Kurven,
Abstand der Abschnitte. Ein zweites Schema (hell, andere Display-Schrift) liegt dort unter
`:root[data-marke="elfenbein"]` und wird mit `<html data-marke="elfenbein">` eingeschaltet – geprüft mit
`/meisterpruefung` (Lighthouse 99/100/100/100, CLS 0).
