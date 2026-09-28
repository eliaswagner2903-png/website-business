# Lehren aus dem Showcase „hell & ruhig“ (Lotlinie, Physiotherapie-Demo)

Stand 2026-09-28. Seite: `showcase/hell/` (Inhalte `inhalt.json`, gebaut mit `node bauen.mjs`).

## Was funktioniert hat

- **Leitmotiv aus dem Fach statt Stockfoto:** das Lot aus der Haltungsanalyse (Linie + Gewicht + fünf Messpunkte
  Ohr–Schulter–Hüfte–Knie–Knöchel). Es trägt Hero-Zeichnung, Logo, Überzeilen, Favicon, die Navigationsmarke und die
  Monogramme im Team. Ohne ein einziges Foto wirkt die Seite dadurch „von einer Praxis“ und nicht von einer Vorlage.
- **Diagramme als Bildersatz:** ein Grundriss (SVG) und ein Zeitband „45 Minuten“ (Grid `10fr 10fr 20fr 5fr`) erklären
  mehr als Kartenreihen. Beschwerden als große Zitat-Sätze mit Link zur passenden Leistung statt Symbol-Kacheln.
- **Stilskizzen vorher:** zwei Hero-Skizzen (Sand/Terrakotta + Fraunces/Figtree vs. Salbei/Petrol + Hanken Grotesk)
  in 10 Minuten; die warme Variante gewann, die kühle wirkte wie eine Klinik. Die kühle Palette wurde zum P4-Testschema.
- **Menü-Blatt als natives `<dialog>`:** `showModal()` bringt Fokusfalle, Escape und inerten Hintergrund mit.
  Öffnen/Schließen rein in CSS: `transition: transform …, overlay … allow-discrete, display … allow-discrete` +
  `@starting-style`. 0,85 s sanft / 0,42 s schließen; Bildfolge: 150 ms fast nichts, 300 ms ≈ ¼.
- **Gleitende Navigationsmarke über View Transitions:** die Marke unter dem aktiven Punkt hat
  `view-transition-name: nav-marke` – beim Seitenwechsel gleitet sie ohne eine Zeile JS zum neuen Punkt.
- **Einblenden per `animation-timeline: view()` ohne Deckkraft:** `translateY` + `clip-path: inset(0 0 100% 0)` →
  `inset(-1rem)`. Text bleibt farblich voll (keine Kontrastfehler in Lighthouse), das Endbild beschneidet den Fokusrahmen
  nicht (negativer inset statt `inset(0)`). Ohne Unterstützung: nichts versteckt.
- **Inhalte an einer Stelle:** `inhalt.json` + `bauen.mjs`; ein Test baut in ein Temp-Verzeichnis und vergleicht,
  damit niemand das HTML von Hand ändert. Ein zweiter Test verbietet feste Farbwerte in `stil.css` (Marke nur in `marke.css`).
- Ergebnis: Lighthouse 100/100/100/100 auf allen Seiten, 120 KB erster Aufruf, 1,6 KB JS, 60 fps.

## Fehler / Stolperfallen

| Fehler | Regel |
|---|---|
| `werkzeuge/bildfolge.mjs` bricht ab („Setting currentTime … not supported for progress based animations“), sobald die Seite `animation-timeline: view()` nutzt | vor dem Pausieren filtern: `document.getAnimations().filter(a => !a.timeline \|\| a.timeline instanceof DocumentTimeline)` – Werkzeug sollte das übernehmen |
| `<title>` in inline-SVG wird von `kopf-pruefen.py` als „title im body“ gemeldet | SVG mit `role="img" aria-label="…"` statt `<title>` |
| Ganzseiten-Screenshots mit Scroll-Timeline zeigen alles unterhalb des Viewports ausgeschnitten | Ganzseiten-Aufnahmen mit `reducedMotion: 'reduce'` machen (globale Regel setzt Dauer 0) |
| SVG-Beschriftungen (Grundriss, 14–17 Einheiten) auf 390 px nur ~6 px groß | Schriftgrößen in SVG per Media-Query für schmale Bildschirme anheben (25 Einheiten) |
| Lighthouse-Lauf lieferte auf ausgelasteter Maschine „Perf 0, LCP undefined“ | einzeln nachmessen, bevor man sucht; war nicht reproduzierbar |

## Offen

- `theme-color` steht in `bauen.mjs` fest (#f6f0e7) und folgt dem Schema nicht.
- Firefox/Safari ohne Scroll-Timeline: kein Einblenden (bewusst), Menü ohne `@starting-style` öffnet ohne Animation.
