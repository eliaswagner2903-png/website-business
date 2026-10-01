# Performance und Core Web Vitals

> Key `performance` · Sources: Q-W01–Q-W06, Q-G18, Q-P01 · As of 2026-09-29

## 1 Ziel
The site is immediately visible, immediately operable and does not jump on an average phone with a mobile network.

## 2 Warum relevant
Core Web Vitals are used by Google's ranking systems, but relevance comes first and good scores guarantee nothing (Q-G18).
The bigger benefit: fast sites lose fewer visitors. Our Meisterstandard is stricter than Google's thresholds (Q-P01).

## 3 Faktoren (belegt)
Thresholds at the 75th percentile, phone and computer separately: **LCP ≤ 2.5 s · INP ≤ 200 ms · CLS ≤ 0.1** (Q-W01).
LCP: image in the initial HTML, `fetchpriority="high"`, never lazy, no synchronous scripts in the head (Q-W02).
CLS: dimensions/`aspect-ratio`, reserve space, `font-display` + fallback font with `size-adjust`, animation via `transform` (Q-W03, Q-W05).
INP: split long tasks (> 50 ms), small DOM, no layout thrashing (Q-W04).

## 4 Beim Programmieren
Static HTML, images AVIF/WebP with `srcset`, fonts as local WOFF2 subsets (file count by class), JS with `defer` and within the class budget (schlank ≤ 60 KB, erlebnis ≤ 200 KB, kino ≤ 350 KB), 3D/video only after the poster
and after „loaded“ (Meisterstandard P2), long cache times for `/css/*`, `/js/*`, `/fonts/*`, `/medien/*` in `_headers`.

## 5 Inhalte und Strukturen
Hero motif as image/poster (LCP element), short videos, no carousels on the first screen.

## 6 Vermeiden
Lazy LCP image, images without dimensions, fonts from third-party servers, large frameworks for static sites, autoplay videos without poster.

## 7 Automatisch umsetzbar
`werkzeuge/bilder.mjs` (formats/sizes), `schriften.mjs`, the generator sets `fetchpriority`/`loading`.

## 8 Automatisch prüfbar
Lighthouse mobile (lab values), `budget.mjs`, static checks (lazy, dimensions, blocking scripts, font-display, image weight, cache headers).

## 9 Manuell prüfen
Field data (CrUX / Search Console) only after launch and only with enough visitors; scroll smoothness on a real phone for 3D/video.

## 10 Wie Claude die Umsetzung belegt
`QUALITAET.md --voll` with the Lighthouse median (3 runs) and budget; lab values are not field values – state this in the report.

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| PERF-01 | LCP image/poster in the HTML, `fetchpriority="high"`, never lazy, suitable size via `srcset` | K | B | AUTO | lcp-nicht-lazy | O Q-W02 | stabil |
| PERF-02 | No layout shift: dimensions for images/videos, fonts with `font-display` and a matched fallback font | K | B | AUTO | bilder-masse, schriften-lokal | O Q-W03, O Q-W05 | stabil |
| PERF-03 | No render-blocking scripts in the head | K | B | AUTO | skripte-blockierend | O Q-W02 | stabil |
| PERF-04 | Lighthouse mobile lab values: LCP ≤ 2.5 s, CLS ≤ 0.02 (Meisterstandard; Google's „good“ limit is 0.1) | K | A | AUTO | ext-cwv-labor | O Q-W01, P Q-P01 | zeitabh. |
| PERF-05 | Little and late JavaScript (class budget, only what adds value), long tasks split | K | B | SEMI-AUTO | ext-budget | O Q-W04, P Q-P01 | stabil |
| PERF-06 | Images below the first screen `loading="lazy"` | E | B | AUTO | bilder-lazy | O Q-W06 | stabil |
| PERF-07 | Fonts: WOFF2 subset, local, file count by class (schlank 3, erlebnis 5, kino 6) | E | B | SEMI-AUTO | schriften-lokal, ext-budget | O Q-W05, P Q-P01 | stabil |
| PERF-08 | Long cache times for CSS, JS, fonts, media in `_headers` | E | B | AUTO | cache-header | P Q-P03 | stabil |
| PERF-09 | Video/3D only after poster and „loaded“, paused off-screen, not on „save data“ | E | B | SEMI-AUTO | ext-budget | P Q-P01 | stabil |
| PERF-10 | After launch: check field values (Search Console/CrUX) in the maintenance run once data exists | Z | L | MANUAL | | O Q-W01, O Q-G18 | zeitabh. |

## Mythen und Unbelegtes
- „In 2026 the LCP threshold was lowered to 2.0 s“ / „new metric Engagement Reliability“ – only on third-party sites, web.dev still states 2.5 s / 200 ms / 0.1 (unsupported, probably false).
- „Lighthouse 100 = good ranking“ – lab value, relevance comes first (Q-G18).

## Zeitabhängig
Metrics and thresholds (Q-W01; stable metrics change once a year at most), role in ranking (Q-G18).
