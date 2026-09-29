# Baukasten – geprüfte Bausteine der Vorlage

Jeder Baustein liegt in einem eigenen Ordner mit `demo.html`, CSS, ggf. JS und `README.md`. Alle nutzen nur die
Variablen aus `public/css/marke.css` (Farben, Schriften, Radien, Tempi, Kurven, Abstand) und halten die strenge CSP
aus `public/_headers` ein (kein Inline-Stil, kein Inline-Skript ohne Hash, keine fremden Quellen).

| Baustein | Wofür | JS |
|---|---|---|
| [einblenden](einblenden/README.md) | Elemente gleiten beim Hereinscrollen ein (CSS-Scroll-Timeline, Rückfall IntersectionObserver) | nur Rückfall |
| [seitenwechsel](seitenwechsel/README.md) | weicher Wechsel zwischen Seiten (View Transitions), benannte Übergänge | – |
| [menue-blatt](menue-blatt/README.md) | Handy-Menü als Blatt von unten, `inert`, ohne JS als Zeile | ja |
| [bento](bento/README.md) | Raster mit Größenspannung | – |
| [galerie](galerie/README.md) | Wisch-Streifen mit scroll-snap + Großansicht im `<dialog>` | ja |
| [hero-video](hero-video/README.md) | Poster als LCP, Video erst danach, Pause-Knopf; Platzhalter aus Markenfarben | ja |

## Einbauen

```bash
cd kunden/<slug>                       # oder vorlage
node bausteine/einbauen.mjs einblenden seitenwechsel menue-blatt bento hero-video
```

Das fügt das CSS zu `public/css/bausteine.css` und das JS zu `public/js/bausteine.js` zusammen (je eine Anfrage).
Die beiden Dateien nie von Hand ändern: im Baustein-Ordner ändern und neu erzeugen. `npm test` meldet veraltete
Dateien, feste Farbwerte in `stil.css`/Bausteinen und Demos, die gegen die CSP verstoßen.

Jede Seite bindet in dieser Reihenfolge ein: `marke.css`, `stil.css`, `bausteine.css`, dann das Inline-Skript
`document.documentElement.classList.add('js')` (Hash steht in `_headers`) und `bausteine.js` mit `defer`.

## Marke wechseln (Meisterstandard P4)

- Farben: nur `:root` in `public/css/marke.css`. Zum Ausprobieren `css/schema-dunkel.css` oder `css/schema-warm.css`
  anhängen. Kontrast-Paare stehen oben in `marke.css`. Einzige Farbe außerhalb: `<meta name="theme-color">` im HTML.
- Schriften: `npm i -D @fontsource-variable/<name>` → `node bausteine/schriften.mjs @fontsource-variable/<name>` →
  `@font-face` und `--schrift-*` in `marke.css`, die zwei `<link rel="preload">` in jeder Seite anpassen.
  Ersatzschrift neu messen: Breite eines Mustertextes (Canvas `measureText`) Webschrift ÷ Arial bzw. Times →
  `size-adjust`; `ascent-override` = hhea-Ascent ÷ unitsPerEm ÷ size-adjust (fontTools). Fraunces ↔ Times 117,2 %,
  Instrument Sans ↔ Arial 101,4 %.
- Geprüft: beide Schemata eingespielt → `pruefen.mjs` ohne Befund, Lighthouse 100/100/100/100, Budget eingehalten.

## Prüfen

```bash
node werkzeuge/gzserver.mjs 8111 vorlage      # eigener Befehl; liefert vorlage/_headers (Verweis auf public/_headers)
node vorlage/bausteine/pruefen.mjs 8111       # alle Demos: Breiten, Konsole/CSP, H1, Tippflächen, ohne JS, reduziert + Funktionstests
```

Übersicht mit allen Demos: `http://localhost:8111/bausteine/index.html`.

## Gemeinsame Regeln

- Bewegt werden nur `transform`, `translate`, `opacity`, `clip-path`. Hover nur unter `(hover: hover) and (pointer: fine)`,
  auf Touch `:active`. Bei „Bewegung reduzieren“ ist alles statisch (Regel am Ende von `stil.css`).
- Im ersten Bildschirm wird nichts versteckt. Ohne JavaScript ist alles sichtbar und bedienbar.
- Tempi aus `marke.css`: kurz 0,3 s (Hover), mittel 0,42 s (Schließen), lang 0,85 s (Öffnen, Einblenden).
