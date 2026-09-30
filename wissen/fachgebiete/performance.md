# Performance und Core Web Vitals

> Schlüssel `performance` · Quellen: Q-W01–Q-W06, Q-G18, Q-P01 · Stand 2026-09-29

## 1 Ziel
Die Seite ist auf einem durchschnittlichen Handy mit mobilem Netz sofort sichtbar, sofort bedienbar und springt nicht.

## 2 Warum relevant
Core Web Vitals werden von Googles Rankingsystemen genutzt, aber Relevanz geht vor und gute Werte garantieren nichts (Q-G18).
Der größere Nutzen: schnelle Seiten verlieren weniger Besucher. Unser Meisterstandard ist strenger als Googles Schwellen (Q-P01).

## 3 Faktoren (belegt)
Schwellen am 75. Perzentil, Handy und Computer getrennt: **LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1** (Q-W01).
LCP: Bild im Ausgangs-HTML, `fetchpriority="high"`, nie lazy, keine synchronen Skripte im Kopf (Q-W02).
CLS: Maße/`aspect-ratio`, Platz reservieren, `font-display` + Ersatzschrift mit `size-adjust`, Animation per `transform` (Q-W03, Q-W05).
INP: lange Tasks (> 50 ms) aufteilen, kleines DOM, kein Layout-Thrashing (Q-W04).

## 4 Beim Programmieren
Statisches HTML, Bilder AVIF/WebP mit `srcset`, Schriften als WOFF2-Subset lokal (Dateizahl nach Klasse), JS mit `defer` und im Budget der Klasse (schlank ≤ 60 KB, erlebnis ≤ 200 KB, kino ≤ 350 KB), 3D/Video erst nach dem Poster
und nach „geladen“ (Meisterstandard P2), lange Cache-Zeiten für `/css/*`, `/js/*`, `/fonts/*`, `/medien/*` in `_headers`.

## 5 Inhalte und Strukturen
Hero-Motiv als Bild/Poster (LCP-Element), Videos kurz, keine Karussells im ersten Bildschirm.

## 6 Vermeiden
Lazy-LCP-Bild, Bilder ohne Maße, Schriften von Fremdservern, große Frameworks für statische Seiten, Autoplay-Videos ohne Poster.

## 7 Automatisch umsetzbar
`werkzeuge/bilder.mjs` (Formate/Größen), `schriften.mjs`, Generator setzt `fetchpriority`/`loading`.

## 8 Automatisch prüfbar
Lighthouse mobil (Laborwerte), `budget.mjs`, statische Prüfungen (Lazy, Maße, blockierende Skripte, font-display, Bildgewicht, Cache-Header).

## 9 Manuell prüfen
Feldwerte (CrUX / Search Console) erst nach Launch und nur bei genug Besuchern; Scroll-Flüssigkeit auf echtem Handy bei 3D/Video.

## 10 Wie Claude die Umsetzung belegt
`QUALITAET.md --voll` mit Lighthouse-Median (3 Läufe) und Budget; Laborwerte sind keine Feldwerte – im Bericht so benennen.

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| PERF-01 | LCP-Bild/Poster im HTML, `fetchpriority="high"`, nie lazy, passende Größe per `srcset` | K | B | AUTO | lcp-nicht-lazy | O Q-W02 | stabil |
| PERF-02 | Kein Layoutsprung: Maße für Bilder/Videos, Schriften mit `font-display` und abgestimmter Ersatzschrift | K | B | AUTO | bilder-masse, schriften-lokal | O Q-W03, O Q-W05 | stabil |
| PERF-03 | Keine render-blockierenden Skripte im Kopf | K | B | AUTO | skripte-blockierend | O Q-W02 | stabil |
| PERF-04 | Laborwerte Lighthouse mobil: LCP ≤ 2,5 s, CLS ≤ 0,02 (Meisterstandard; Googles Grenze „gut“ ist 0,1) | K | A | AUTO | ext-cwv-labor | O Q-W01, P Q-P01 | zeitabh. |
| PERF-05 | Wenig und spätes JavaScript (Budget der Klasse, nur was Nutzen bringt), lange Tasks aufgeteilt | K | B | SEMI-AUTO | ext-budget | O Q-W04, P Q-P01 | stabil |
| PERF-06 | Bilder unterhalb des ersten Bildschirms `loading="lazy"` | E | B | AUTO | bilder-lazy | O Q-W06 | stabil |
| PERF-07 | Schriften: WOFF2-Subset, lokal, Dateizahl nach Klasse (schlank 3, erlebnis 5, kino 6) | E | B | SEMI-AUTO | schriften-lokal, ext-budget | O Q-W05, P Q-P01 | stabil |
| PERF-08 | Lange Cache-Zeiten für CSS, JS, Schriften, Medien in `_headers` | E | B | AUTO | cache-header | P Q-P03 | stabil |
| PERF-09 | Video/3D erst nach Poster und „geladen“, pausiert außerhalb des Bildschirms, nicht bei „Daten sparen“ | E | B | SEMI-AUTO | ext-budget | P Q-P01 | stabil |
| PERF-10 | Nach Launch: Feldwerte (Search Console/CrUX) im Wartungslauf prüfen, sobald Daten vorliegen | Z | L | MANUAL | | O Q-W01, O Q-G18 | zeitabh. |

## Mythen und Unbelegtes
- „2026 wurde die LCP-Schwelle auf 2,0 s gesenkt“ / „neue Metrik Engagement Reliability“ – nur auf Drittseiten, web.dev nennt weiter 2,5 s / 200 ms / 0,1 (unbelegt, vermutlich falsch).
- „Lighthouse 100 = gutes Ranking“ – Laborwert, Relevanz geht vor (Q-G18).

## Zeitabhängig
Metriken und Schwellen (Q-W01; stabile Metriken ändern sich höchstens jährlich), Rolle im Ranking (Q-G18).
