---
name: abnahme
description: Quality gate of a customer site against the customer order - checks the global minimum standard and every ordered service (SEO, Local SEO, GEO, Schema, CRO, Performance, Accessibility, Analytics, Security) automatically and via evidenced confirmation, fixes errors and re-checks. Use before a site is reported as done, on "/abnahme", "Quality Gate", "ist die Seite fertig?".
---

# Acceptance (quality gate)

A site is only done when `QUALITAET.md` shows **BESTANDEN** (or BESTANDEN MIT HINWEISEN, with "should" items justified).
Never report "done" without this report.

1. **Check:** `node werkzeuge/qualitaet.mjs kunden/<slug> --voll` (Lighthouse, budget, widths: a few minutes; after each
   fix the quick run without `--voll` is enough at first). Without `auftrag.md` only the global standard applies – then run `/bestellung` first.
2. **Work through every error (✗):**
   1. Document the problem (rule ID, page, finding from the report).
   2. Determine the cause (generator? data? template? is the tool wrong?).
   3. Fix it – at the source (content JSON, `bauen.mjs`, `marke.css`), not in the generated HTML.
   4. Re-check.
   5. Only then does the line count as passed. If the tool is wrong (false alarm): correct the check in `werkzeuge/qualitaet.mjs`,
      add the example as a test, note it in `wissen/FEHLER.md` – never silently skip the rule.
3. **Manual items (○, ◐)** in `kunden/<slug>/abnahme.md`: check them and confirm with `[x]` + evidence: screenshot path, file:line,
   measured value or statement by the customer with a date. Without verifiable evidence it does not count ("ok" is not enough, the tool checks this). Items that only the customer or Elias can settle
   (business profile, approval of the texts, BFSG classification, training crawlers) are presented to the user together.
   Not applicable (e.g. only one location) = confirm with the evidence "does not apply because …". ◐ also means: the tool found
   nothing to check (e.g. no JSON-LD) – that is not a pass.
   Without `--voll`, an otherwise clean run ends with VORLÄUFIG; only the full run can yield BESTANDEN.
4. **Visual check:** `/meisterpruefung` (W1–W7, state screenshots) – evidence for GLB-24, CRO-09, A11Y-01.
5. **Security** for form/booking/payment or ordered security: `/sicherheit` – evidence for SEC-01.
6. **Report** in the format of the report, grouped like `QUALITAET.md`:
   ```
   GLOBAL         ✓ 24/24
   LOCAL SEO      ✓ 9/11 · offen: LOC-06 Unternehmensprofil (Kunde), LOC-08 Bewertungen (Kunde)
   GEO / KI-SUCHE ✓ …
   Urteil: BESTANDEN MIT HINWEISEN · Muss offen 0 · Soll offen 2 (begründet)
   ```
   No ranking or AI promises in the report (GEO-08).
7. `/sichern` – `auftrag.md`, `PFLICHTENHEFT.md`, `abnahme.md`, `QUALITAET.md` are versioned together with the site.

## After launch (maintenance)
Rules with phase **L** (↻ in the report: TEC-08 redirects, TEC-10/ANA-05 Search Console, LOC-06 business profile, LOC-08 reviews,
PERF-10 field data, GEO-10 AI reports) do not block acceptance. Check them in the first maintenance run and document them in `abnahme.md`.
Check GEO-01 (Cloudflare bot settings) in the Cloudflare project before launch.
