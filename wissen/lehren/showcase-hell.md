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

## Nachbesserung nach der Zweitnote (W2 und W6 waren 3)

Der Gutachter fand die Lot-Idee gut, aber die Umsetzung „Creme, Serif-Headline, runde Knöpfe“ austauschbar, und er
konnte Hover/Fokus/Aktiv an Standbildern nicht beurteilen. Daraus:

- **Ein Motiv wird erst durch die Struktur eigenständig, nicht durch Illustrationen.** Das Lot ist jetzt die
  senkrechte Achse der ganzen Seite: eine durchgehende Linie auf der linken Kante der Hülle
  (`main { background: linear-gradient(…) var(--achse-x) 0 / 1px 100% no-repeat }` mit
  `--achse-x: max(1.25rem, (100% - var(--breite)) / 2)`), an jedem Abschnitt ein Messpunkt plus Nummer
  (`main > section::before/::after` mit `counter(mass, decimal-leading-zero)`), am Ende der Seite das Lotgewicht
  (`clip-path: polygon(…)` auf `main::before`). Der Text rückt über `padding-inline-start: var(--einzug)`
  auf der Hülle von der Achse ab – ein Einzug, der auf allen Seiten gleich ist, macht die Achse erst glaubhaft.
- **Der Hero misst sich selbst:** je ein Punkt an Überzeile, Überschrift, Fließtext, Knopfzeile und Faktenzeile
  (`.held-text > *::before`). Damit ist das Motiv auf dem Handy im ersten Bildschirm sichtbar, ohne ein Bild zu laden
  (LCP bleibt die Überschrift, Lighthouse 100).
- **Trennlinien als Messmarken:** statt `border-top: 1px solid` eine Lineal-Kante aus zwei Hintergrundebenen –
  `repeating-linear-gradient(90deg, linie 0 6px, transparent 6px 11px)` plus ein 18 × 2 px Akzentstrich links.
- **Gleichförmige Reihen auflösen:** die fünf Patientensätze hängen jetzt in fünf verschiedenen Tiefen am Lot
  (Messstrich zeigt die „Abweichung“), zwei davon groß. Aus fünf gleichen Zeilen wird eine Messreihe.
- **`attr()` mit `type(<number>)` in `calc()`** ist zu neu (Chrome 133+): brach still ab und alle Tiefen waren 0.
  Zahlen aus Attributen lieber über `[data-tiefe="2"] { --tiefe: … }` setzen.
- **Zustände selbst belegen:** Tastaturfokus lässt sich in Playwright erzwingen mit `keyboard.press('Tab')`
  (setzt den Tastatur-Modus), danach `el.focus()`; `el.matches(':focus-visible')` bestätigt es. Ausschnitt über
  `boundingBox()` als Beleg speichern (`showcase/hell/screenshots/zustaende-*.png`).
- **Kontrast messen statt schätzen:** Im Browser jeden Knoten mit eigenem Text durchgehen, den wirksamen
  Hintergrund über die Vorfahren suchen und das Verhältnis rechnen. Achtung: `color-mix()` kommt als
  `color(srgb 0.51 0.47 0.42)` zurück – Werte 0…1, nicht 0…255. Wer das übersieht, misst Traumwerte.
- **Fläche auf Fläche:** Beige auf Beige hat nur 1,1:1. Das ist als Dekoration erlaubt, aber sobald eine Fläche
  etwas bedeutet (belegt/frei), braucht sie ≥ 3:1 – hier über `color-mix(in srgb, var(--farbe-leise) 72%, …)`
  und eine Legende in Worten, nicht nur Farbe.
