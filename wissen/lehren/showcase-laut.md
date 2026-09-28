# Lehren aus dem Showcase „laut & modern“ (Zwischenbild, Demo)

Stand 2026-09-28. Ordner `showcase/laut/`. Konzept: ausgedachtes Motion-Studio, Leitmotiv Zeitleiste
(Schlüsselbilder als Rauten, Abspielkopf, Clip-Spur) und variable Breitenachse (Archivo 62–125 %).

## Fehler / Stolperfallen

| # | Fehler | Regel |
|---|---|---|
| L1 | `werkzeuge/bildfolge.mjs` bricht ab, sobald die Seite scroll-getriebene Animationen hat: `currentTime` in ms ist bei `ViewTimeline`/`ScrollTimeline` verboten („progress based animations“) | im Werkzeug nur zeitbasierte Animationen einfrieren: `document.getAnimations().filter(a => a.timeline === document.timeline)` (hier lokal als Kopie genutzt, `werkzeuge/` bitte so anpassen) |
| L2 | `pruefen.mjs` meldete 8 „unsichtbare“ Elemente: Chips mit `input { opacity: 0 }` über dem Etikett | versteckte Eingaben mit `appearance: none; background: none; border: 0` statt `opacity: 0` – bleiben klickbar, zählen nicht als unsichtbar |
| L3 | `html-validate` `tel-non-breaking` gilt auch für versteckten Lesetext im Telefon-Link („Anrufen: 01234 …“) | **jedes** Leerzeichen im `tel:`-Link als `&nbsp;`, auch nach „Anrufen:“ |
| L4 | Scroll-Enthüllung mit `animation-fill-mode: both` überschrieb später `:active`/Hover-`transform` | scroll-getriebene Enthüllungen mit `backwards`: nach dem Bereich gilt wieder der normale Stil |
| L5 | `clip-path` per `view()` animiert = Neuzeichnen großer SVG-Plakate bei jedem Scrollbild | scroll-getrieben nur `transform`/`opacity` (läuft im Compositor), `clip-path` nur zeitbasiert |
| L6 | Riesige Titel in fester Größe liefen bei 1440 px aus dem Bild | Titelbreite einmal messen (em-Breite der längsten Zeile) und Größe daraus rechnen: `font-size: calc((100vw - 2 * var(--rand)) / 6.7)` für „Wir bringen“ = 6,44 em; Zeilenumbrüche je Gerät mit `<br class="br-h">` / `br-c` steuern |
| L7 | Wortmarke im Fuß mit `white-space: nowrap` machte die einspaltige Grid-Spalte breiter als den Bildschirm (Text lief rechts hinaus, `overflow-x: clip` versteckte es nur) | Grid immer `grid-template-columns: minmax(0, 1fr)`, Größe der Wortmarke aus ihrer em-Breite rechnen |
| L8 | Schnellleiste verdeckte auf dem Handy die Zeitleiste im ersten Bildschirm | Leiste erst zeigen, wenn die Hero-Knöpfe aus dem Bild sind (IntersectionObserver); Telefon dafür im Kopf (≤ 22 rem nur Symbol) |
| L9 | Lighthouse unter Last (sechs Agenten): einzelne Läufe „Perf 0 / LCP undefined“, fps schwankt 39–61 | Ausreißer sind Messfehler, nicht Seite; einzeln nachmessen, `uptime` mitloggen |
| L10 | Die 404-Seite hat SEO 63, weil `noindex` | gewollt; 404 in der SEO-Bewertung ausnehmen |

## Bewährt

- **CSS-Bildzähler ohne JS:** `@property --bild { syntax: "<integer>" }`, in einer Keyframe-Animation 0 → 48,
  `counter-reset: bild var(--bild); content: counter(bild, decimal-leading-zero)` – der Abspielkopf zählt die Bilder mit.
- **SVG ohne viewBox für Skalen:** Striche per `x1="12.3%"`, Rauten als verschachtelte `<svg x="…%" overflow="visible">` –
  Positionen kommen aus den Daten, nichts verzerrt, keine Inline-Stile (CSP).
- **Kurven als Zwiebelhaut:** 13 Quadrate je Kurve, Positionen per cubic-bezier im Baus-Skript berechnet – erklärt
  Easing ohne Bewegung (reduzierte Bewegung, ohne JS) und läuft mit JS einmal per WAAPI ab.
- **Breitenachse einmalig:** `font-stretch`-Übergang 62 % → 125 % auf einem einzelnen, links ausgerichteten Wort in eigener
  Zeile – kein CLS, weil sich nichts anderes verschiebt; ausgelöst per IntersectionObserver, nicht an den Scroll gekoppelt.
- **Seitenwechsel:** `@view-transition { navigation: auto }` + gleiche `view-transition-name` für Plakat und Titel auf Liste
  und Projektseite; Elemente, die nur auf einer Seite existieren, mit `::view-transition-old(*):only-child` kurz ausblenden.
- **Schriften unter Budget:** `pyftsubset` (fonttools aus PyPI) auf die @fontsource-Dateien: Archivo (Breite+Gewicht) 90 → 75 KB,
  JetBrains Mono 40 → 13 KB, `unicode-range` passend; latin-ext bleibt als Nachlade-Datei.
- **Inhalte an einer Stelle:** `inhalt.mjs` + `bauen.mjs` erzeugen alle Seiten; ein Test vergleicht gebaut ↔ ausgeliefert.

## Nachbesserung nach der Zweitnote (W 3,4)

| # | Befund | Lösung |
|---|---|---|
| L11 | Zeitcode stand auf 00:00:00:00, während der Abspielkopf „Bild 48“ zeigte – wirkt wie ein Fehler | Endstand (00:00:02:00) als Text im HTML; mit Bewegung zählen `@property --sek/--fr` (integer, `inherits: true`, sonst sieht `::before` nur den Startwert) mit derselben Dauer/Verzögerung wie der Abspielkopf; Sekunden mit `steps(1, end)`, Bilder 0–23 zweimal linear |
| L12 | Fokus am Logo sah aus wie der 2-px-Ruherahmen der Knöpfe | zweifarbiger Ring: `outline` Akzent mit Versatz + `box-shadow: 0 0 0 6px` in Tinte – auf jeder Fläche ist eine Hälfte kontrastreich |
| L13 | Hover nur mit 2 px Anheben wirkte matt | Farbwechsel auf den Akzent + Anheben; Karten: wachsende Unterstreichung am Titel, Pfeil dreht und wächst |
| L14 | Große H1 wirkte „getippt“: L, b, d standen sichtbar eingerückt neben dem W | Vorbreite der ersten Glyphe messen (`measureText().actualBoundingBoxLeft`) und je Zeilenanfang als `margin-left`/`text-indent` abziehen; Zeilenanfänge je Gerät aus den Umbruch-Daten bestimmen |
| L15 | Seitenwechsel: das nicht angeklickte Plakat und der alte Titel lagen als „Geisterschrift“ über der Projektseite | `view-transition-name` nur am angeklickten Projekt (Klasse per Klick, Rückweg per `pagereveal` + `navigation.activation.from`); `view-transition-class` für Titel/Plakat: altes Bild 0,16 s weg, neues 0,34 s |
