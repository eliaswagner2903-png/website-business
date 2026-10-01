---
name: meisterpruefung
description: Checks a site against the master standard (wissen/MEISTERSTANDARD.md) - technology, weight budget, motion as a frame sequence, adaptability and impact with an independent second grade. Use before a showcase or customer site counts as done, or on "/meisterpruefung".
---

# Master examination

Folder `S` = `vorlage`, `showcase/<name>` or `kunden/<slug>`. Server in the background:
`node werkzeuge/gzserver.mjs 8080 $S/public`.

1. **P1 Technology:** skill `/pruefen` in full (tests, HTML, head, widths, without JS, reduced motion, Lighthouse).
2. **P2 Weight:** `node werkzeuge/budget.mjs $S/public 8080` for the home page and every page with 3D or video
   (third parameter = page). Exceeded → name the cause and fix it, do not raise the limits.
3. **P3 Motion:** record every animation once with `/bildfolge` (loading at 390 and 1440, menu, own effects).
4. **P4 Adaptability:** apply a second color scheme in `css/marke.css`, repeat steps 1–2 for the home page,
   then set it back. If there is no `marke.css` yet: report it as a defect.
5. **W Impact:** look at screenshots 390 and 1440 (`werkzeuge/ausgabe/`), grade W1–W7, one sentence of justification per grade.
   Second grade: deploy `uffz-schnoerkel` with the screenshot paths and the W1–W7 table from the standard, without
   revealing your own grades. With more than 1 deviation, the stricter one counts.
6. Report the result as a table (P1–P4 passed/not, W1–W7 grade), attach phone + computer screenshots.
   Defects go into the order log, new lessons into `wissen/`.
