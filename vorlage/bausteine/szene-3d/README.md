# Baustein: 3D-Szene (three.js, nachgeladen, Standbild als Rückfall)

Ein prozedural gebautes Objekt, das sich langsam dreht und leicht auf den Zeiger (Computer) bzw. das Scrollen
(Handy) reagiert. **Sichtbar ist zuerst immer ein Standbild** (AVIF/WebP) – es ist das LCP-Element. three.js wird
erst danach geladen, und nur, wenn es sich lohnt. Wer kein WebGL, „Bewegung reduzieren“, „Daten sparen“ oder keinen
echten Grafikchip hat, sieht dauerhaft das Standbild und lädt kein einziges Byte three.js.

## Dateien

| Datei | Wohin in der Kundenseite |
|---|---|
| `szene-3d.js` (2,7 KB, gzip ~1,2 KB) | `public/js/` – Lader, `<script src="/js/szene-3d.js" defer>` |
| `szene-3d.modul.js` (139 KB gzip) | `public/js/` – three.js + Szene, wird **nur bei Bedarf** nachgeladen |
| `szene-3d.css` | in `public/css/stil.css` einfügen oder als eigene Datei laden |
| `medien/szene-*.avif/.webp` | `public/medien/` – die Standbilder (mit `poster-rendern.mjs` erzeugt) |
| `quelle/`, `bauen.mjs` | bleiben im Baukasten (Quelltext und Bündelung), **nicht** ausliefern |
| `demo.html`, `demo.css`, `_headers` | Demo und Prüfung; `demo.css` zeigt nur, wie die Marken-Variablen heißen |

## Einbau

```html
<link rel="stylesheet" href="/css/szene-3d.css">
<script src="/js/szene-3d.js" defer></script>
...
<figure class="szene-3d" data-objekt="gefaess" data-farbe="--farbe-akzent">
  <picture class="szene-3d__poster">
    <source type="image/avif" srcset="/medien/szene-gefaess-640.avif 640w, /medien/szene-gefaess-1280.avif 1280w" sizes="(min-width: 56rem) 38rem, calc(100vw - 2rem)">
    <img src="/medien/szene-gefaess-1280.webp" srcset="/medien/szene-gefaess-640.webp 640w, /medien/szene-gefaess-1280.webp 1280w"
         sizes="(min-width: 56rem) 38rem, calc(100vw - 2rem)" width="1280" height="1280" fetchpriority="high" alt="…">
  </picture>
</figure>
```

Das Poster steht im Markup, nicht im CSS: nur so findet der Browser es früh, und nur so hat es einen Alt-Text.
Im ersten Bildschirm `fetchpriority="high"` und **kein** `loading="lazy"` (FEHLER.md Nr. 33), weiter unten
`loading="lazy" decoding="async"`.

## Einstellungen (data-Attribute an `.szene-3d`)

| Attribut | Standard | Bedeutung |
|---|---|---|
| `data-objekt` | `gefaess` | `gefaess` (Keramik, Rillen), `knoten` (Metall), `kiesel` (Stein), `ringe` (drei Reifen) |
| `data-material` | je Objekt | `keramik`, `metall`, `stein` überschreiben |
| `data-farbe` | `--farbe-akzent` | CSS-Variable **oder** direkte Farbe (`#b08d57`, `oklch(…)`) |
| `data-farbe-zwei` | `--farbe-text` | zweite Farbe (nur `ringe`) |
| `data-licht` | `1` | Helligkeit der Studio-Umgebung |
| `data-zoom` | `1` | Objekt größer/kleiner im Bildausschnitt |
| `data-drehung` | `0.16` | Bogenmaß pro Sekunde (eine Umdrehung ≈ 40 s). Mehr wirkt schnell unruhig |
| `data-dpr-max` | `2` | Obergrenze der Pixeldichte |
| `data-min-fps` | `45` | darunter: erst gröber rechnen, dann zurück zum Standbild |
| `--szene-seiten` (CSS) | `1` | Seitenverhältnis des Rahmens; **muss** zum Poster passen |

Die Szene meldet ihren Zustand am Element: `data-szene` (`zu-langsam`, `gestoppt`) und `data-szene-fps` – praktisch
für Prüfskripte.

## Wann three.js geladen wird (und wann nicht)

1. Seite vollständig geladen (`load`), dann im Leerlauf (`requestIdleCallback`).
2. Kein `prefers-reduced-motion: reduce`, kein `saveData`, kein 2G.
3. WebGL vorhanden **und** kein Nur-Software-Renderer (SwiftShader, llvmpipe, „Basic Render“ …). Das Urteil steht im
   `sessionStorage` – jede weitere Seite entscheidet sofort.
4. Szene im Bild (`IntersectionObserver`, 200 px Vorlauf).
5. Danach ein **Probelauf**: die Szene wird 0,6 s praktisch unsichtbar (1 % Deckkraft) gezeichnet und die Bildrate
   gemessen. Erst wenn sie reicht, blendet sie über das Poster und beginnt sich zu bewegen. Sonst: Standbild bleibt.
6. Im Betrieb misst der Wächter alle 1,5 s weiter: zu langsam → erst Pixeldichte senken, dann Standbild.

Pausiert außerhalb des Bildes und bei verstecktem Tab; `ResizeObserver` hält den Ausschnitt korrekt; ein Wechsel auf
„Bewegung reduzieren“ im laufenden Betrieb stoppt die Szene.

## Poster erzeugen (Pflicht nach jeder Änderung an Objekt, Farbe, Zoom, Seitenverhältnis)

```bash
node werkzeuge/gzserver.mjs 8102 vorlage/bausteine/szene-3d &
node werkzeuge/poster-rendern.mjs http://localhost:8102/demo.html vorlage/bausteine/szene-3d/medien
```

Das Werkzeug rendert im headless Chromium **dasselbe erste Bild**, das die Szene live zeichnet (`?standbild`),
in zwei Größen und legt AVIF + WebP mit Transparenz ab. Deshalb ist der Übergang Poster → Szene unsichtbar
(gemessen: mittlere Pixelabweichung 2,3 von 255 auf dem Computer, 4,5 auf dem Handy – dort ist die Leinwand bei
devicePixelRatio 3 etwas schärfer als das herunterskalierte Poster; die Bildfolge zeigt acht gleiche Bilder,
keinen Sprung).

Objekt- oder Szenencode geändert? `node vorlage/bausteine/szene-3d/bauen.mjs` bündelt three.js neu (esbuild,
Tree-Shaking) und bricht ab, wenn 180 KB gzip überschritten werden.

## Budget und Messwerte (gemessen 2026-09-28, gzip-Server, Handy-Profil 390×844)

| Posten | Wert | Grenze |
|---|---|---|
| Erster Aufruf gesamt | 112 KB | 500 KB |
| JavaScript im ersten Aufruf | 2,7 KB | 60 KB |
| JavaScript nachgeladen (three.js + Szene) | 142 KB | 180 KB |
| Anfragen | 8 | 25 |
| fps beim Scrollen (4× gedrosselt) | 60 | ≥ 55 |
| Lighthouse mobil | Performance **100**, A11y 100, Best Practices 100, TBT 0 ms, CLS 0 | ≥ 95 / 100 |
| LCP-Element | `figure.szene-3d > picture.szene-3d__poster > img`, 1,1 s | Poster |

SEO zeigt auf der Demo 66, weil sie bewusst `noindex` trägt und keine echte Domain hat – auf einer Kundenseite 100.

## Prüfen

```bash
node werkzeuge/gzserver.mjs 8102 vorlage/bausteine/szene-3d &
werkzeuge/node_modules/.bin/html-validate -c werkzeuge/.htmlvalidate.json vorlage/bausteine/szene-3d/demo.html
python3 werkzeuge/kopf-pruefen.py vorlage/bausteine/szene-3d
node werkzeuge/budget.mjs vorlage/bausteine/szene-3d 8102 "demo.html?szene3d=an"
SEITEN=demo.html bash werkzeuge/lighthouse.sh vorlage/bausteine/szene-3d 8102
node werkzeuge/bildfolge.mjs "http://localhost:8102/demo.html?szene3d=an" "warte:.szene-3d--bereit" 390
```

**`?szene3d=an`** schaltet Geräteprüfung und Probelauf ab. Diese Maschine (und jede Claude-Cloud-Umgebung) hat
keinen Grafikchip, sondern SwiftShader – dort bliebe es sonst beim Standbild, was für Messungen richtig, für
Screenshots aber unbrauchbar ist. **Auf einer Kundenseite nie verwenden.** Die so gemessene Bildrate sagt nichts
über echte Geräte: three.js in Software rechnet hier ~2 fps, ein Handy mit Grafikchip 60.

## Video statt Echtzeit-3D

Braucht der Kunde keine Interaktion, ist ein kurzes Video meist die bessere Wahl (kein three.js, weniger Rechenzeit).
Dafür bräuchte es **ffmpeg**, das in dieser Umgebung nicht installierbar ist. So sähe es aus:

```bash
# Bildfolge aus der Szene rendern (Poster-Werkzeug als Vorlage), dann:
ffmpeg -framerate 30 -i bild-%03d.png -c:v libvpx-vp9 -crf 34 -b:v 0 -an -pix_fmt yuv420p szene.webm
ffmpeg -framerate 30 -i bild-%03d.png -c:v libx264 -crf 24 -preset slow -an -movflags +faststart -pix_fmt yuv420p szene.mp4
```

```html
<video class="szene-video" poster="/medien/szene-gefaess-1280.webp" width="1280" height="1280"
       muted playsinline loop preload="none" aria-hidden="true">
  <source src="/medien/szene.webm" type="video/webm">
  <source src="/medien/szene.mp4" type="video/mp4">
</video>
```

Schleife 6–8 s, ohne Ton, ≤ 1,5 MB; das Poster ist das LCP-Element; bei `prefers-reduced-motion` und `saveData`
nur das Poster zeigen (Video per JS gar nicht erst starten).

## Lizenz

three.js steht unter der MIT-Lizenz (© 2010–2026 three.js authors); der Hinweis steht als Kommentar in
`szene-3d.modul.js`. Die Objekte sind vollständig im Code gebaut – kein fremdes Modell, keine fremde Textur.
