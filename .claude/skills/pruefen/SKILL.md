---
name: pruefen
description: Complete quality check of a customer site or the template - tests, HTML, head, overflow 320-1920 px, console errors, without JavaScript, reduced motion, tap targets, Lighthouse mobile with compression and real security headers. Use before every commit or on "/pruefen".
---

# Check

Folder `S` = `vorlage` or `kunden/<slug>`. Once: `cd werkzeuge && npm install`.
Server in the background (separate command): `node werkzeuge/gzserver.mjs 8080 $S/public` – serves gzip and the headers
from `_headers`, so CSP violations show up as console errors.

1. `cd $S && npm test` → all tests green (API + security).
2. `werkzeuge/node_modules/.bin/html-validate -c werkzeuge/.htmlvalidate.json $S/public/*.html` → 0 errors.
3. `python3 werkzeuge/kopf-pruefen.py $S/public` → 0 errors.
4. `node werkzeuge/pruefen.mjs $S/public 8080` → overflow, console, H1, tap targets, without JS, reduced motion.
   Look at the screenshots in `werkzeuge/ausgabe/` once (390 and 1440).
5. `bash werkzeuge/lighthouse.sh $S/public 8080` (single page: `SEITEN=index.html`) → Perf ≥ threshold of the class (kunde.json: 95 / 90 / 85), A11y/BP/SEO 100, CLS ≈ 0.
5a. `node werkzeuge/qualitaet.mjs $S` → rules from the order and the global standard (SEO, Schema, NAP, links, sitemap …); full acceptance: `/abnahme`.
6. Report the result as a table, append new errors to `wissen/FEHLER.md`.
