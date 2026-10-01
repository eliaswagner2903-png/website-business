---
name: kundenseite-bauen
description: Build a customer site in one go from briefing to acceptance – reading, setting up, design with generator, menu/data with reconciliation test, subpages, checking, refinement, master examination, documentation. With time targets, commands and pitfalls from the dress rehearsal A-037. Use on "/kundenseite-bauen", "baue die Seite für …", "komplette Kundenseite".
---

# Build a customer site (procedure from the dress rehearsal A-037)

Folder `S=kunden/<slug>`, branch `kunde/<slug>`. Write each phase into a time log with `date -u +%H:%M`.
Target times apply to a restaurant/tradesman site with 6–8 pages (dress rehearsal: ≈ 40 min building and checking).

| Phase | Target time | Result |
|---|---|---|
| 1 Read | 5 min | Facts, open points, pitfalls known |
| 2 Set up | 5 min | Folder, master data, maintenance entry, tests run |
| 3 Design/skeleton | 15–30 min | `bauen.mjs`, `marke.css`, `stil.css`, home page |
| 4 Data (menu, prices) | 5–10 min | JSON from the source + reconciliation test |
| 5 Subpages | 5 min | old addresses, contact, legal-text placeholders |
| 6 Check | 15 min | Tests, HTML, head, widths, Lighthouse, budget |
| 7 Refine | 5–15 min | all findings fixed, check green again |
| 8 Master examination | 10 min | P1–P4, W1–W7, state screenshots |
| 9 Documentation | 10 min | Time log, FEHLER.md, log, commit, push |

## 1 Read
**First `/bestellung`:** `auftrag.md` → `PFLICHTENHEFT.md`; its rules under "Planen" and "Bauen" apply from here on in every phase.
In addition `wissen/FEHLER.md`, `wissen/MEISTERSTANDARD.md`, `wissen/DESIGN-WISSEN.md`, and any `CLAUDE.md`/analysis the customer already has.
Create a list: **fixed facts** (phone, address, route) and **open points** (these become `data-pruefen`).

## 2 Set up
`/neuer-kunde` (copy of `vorlage/` without `node_modules`/`package-lock.json`). Remove unused things immediately
(e.g. Stripe functions and tests if nothing is sold) and adjust `_headers`/CSP (`form-action 'self'`).
Photos only from the customer's existing stock, never upscale (no width above the source).

## 3 Design/skeleton
- **Generator instead of hand-written HTML:** `bauen.mjs` reads `inhalt/seite.json` (+ data JSON) and writes all pages and
  `sitemap.xml`. The test "HTML ist aktuell" rebuilds in a temp folder and compares (pattern: `kunden/urfa-meister/tests/seite.test.mjs`).
- **Leitmotiv from the customer's world** (W2), e.g. copper tray "Sini", logo skyline as a CSS mask, ornamental line from the logo.
- **Brand in one file:** `public/css/marke.css` with fonts and 6–7 color roles; build the second scheme
  `:root[data-schema="…"]` right away (P4 then costs 2 min).
- **Fonts:** woff2 from npm `@fontsource…` or google/fonts raw files, then **one** file per font with
  Latin-1 + Latin Extended-A (Turkish, Polish …):
  `pyftsubset x.ttf --unicodes="U+0000-00FF,U+0100-017F,U+2000-206F,U+20AC" --flavor=woff2 --layout-features='*' --output-file=public/fonts/x.woff2`.
  Measure the fallback font with `size-adjust` from fontTools (width of "Hamburgefonstiv" against Arial/Georgia).
- Building blocks: `node bausteine/einbauen.mjs einblenden seitenwechsel menue-blatt galerie` in the site folder.
- Hero: LCP image with `fetchpriority="high"`, never lazy, visible from frame 0; loading animation only `transform`/`opacity`.

## 4 Data with reconciliation test
Never type data by hand: pull it from the authoritative source (Python source via `ast`, do not execute it – FEHLER 32).
The test reads the **old and the new page with the same regex** and compares position by position (number, name,
label, price, quantity, description, check flag). Derived details ("ab 12,50 €") are computed from the data in the test.
**Counter-check:** change a price as a test → the test must turn red, then change it back.
Pattern: `kunden/urfa-meister/tests/speisekarte.test.mjs`.

## 5 Subpages
Keep old addresses (`galerie.htm` …), `_redirects` for `/index.htm`. Imprint/privacy policy only as placeholders
with `data-pruefen="Rechtstext nicht erfinden …"`. Contact form: honeypot, POST to `/api/kontakt`,
leave the target address open, mark the form itself `data-pruefen`. Fixed quick bar call/route/map on every page.

## 6 Check
```bash
node werkzeuge/gzserver.mjs 8231 $S/public &   # Port 8230–8239, PID merken: echo $! > …/server.pid
(cd $S && npm test)
werkzeuge/node_modules/.bin/html-validate -c werkzeuge/.htmlvalidate.json $S/public/*.htm*
python3 werkzeuge/kopf-pruefen.py $S/public
node werkzeuge/pruefen.mjs $S/public 8231       # 320–1920, ohne JS, reduzierte Bewegung, Tippflächen
werkzeuge/lighthouse.sh $S/public 8231           # SEITEN="index.html" für einzelne Seiten
node werkzeuge/budget.mjs $S/public 8231
```
Stop the server at the end with `kill $(cat …/server.pid)`, **never `pkill -f`**.

## 7 Refine – most frequent findings of the dress rehearsal
- 1 px overflow at 360: ornamental line with `nowrap` → let the lines shrink, wrap below 26rem.
- A11y 96: accent/copper color as text below 4.5:1 → `color-mix(in srgb, var(--farbe-linie) 72%, var(--farbe-text))`.
- Header two lines at 768 → hide secondary elements (phone in the header) between 48–64rem.
- Menu veil gray on a dark theme → override the veil with `--farbe-grund`.
- JSON-LD: every text value (also entries in arrays) must be visibly on the page, otherwise leave it out.

## 7a Quality gate
`/abnahme` (`node werkzeuge/qualitaet.mjs $S --voll`) – checks obligations from the order and the global standard; manual items with evidence in `abnahme.md`.

## 8 Master examination
`/meisterpruefung`. Take the states yourself (focus, hover, error, empty search, open menu, quick bar,
`#pruefen`, without JS) as a collage per phone/desktop. **Full-page screenshots with `reducedMotion: 'reduce'`**,
otherwise scroll-timeline fade-ins hide sections. Frame sequences only for DocumentTimeline animations.
Screenshots as PNG ≤ 300 KB (DPR 1 for 1440, crops instead of full page).

## Special case: one-pager / portfolio (A-038, ≈ 33 min)
- One home page with anchors + imprint/privacy/404/thank-you is enough; still use `bauen.mjs` (test "HTML ist aktuell").
- Header links on subpages as `/#anker`, on the home page as `#anker`; form return path `zurueck: '/#kontakt'`.
- Personal details (name, place, phone, e-mail, photo, prices) as a visible placeholder with `data-pruefen`; a test checks
  that every `tel:`/`mailto:` link is marked and no euro amount appears on the page.
- Measure values of third-party work (Lighthouse, budget) in the background while the generator is being created.
- Do not use the pill radius as `--radius-gross` for surfaces (the menu sheet becomes round), no global `scroll-behavior: smooth`.

## 9 Documentation
Close the time log (duration, total, time sinks), add lessons to the end of `wissen/FEHLER.md`,
`python3 ops/log.py fertig A-xxx "…"`, `python3 ops/log_vereinen.py --pruefen`, commit with trailer, `git push -u origin kunde/<slug>`.
PR only if the order requires it.
