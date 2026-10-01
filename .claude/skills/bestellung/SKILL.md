---
name: bestellung
description: Read the customer order and translate it into a requirements specification (Pflichtenheft) - recognizes ordered services (SEO, Local SEO, GEO/AEO/LLMO, Technical SEO, Schema, CRO, Performance, Accessibility, Analytics, Security) with priority, loads the matching rules from wissen/fachgebiete/ and sorts them into plan/build/acceptance. Use BEFORE building, on "/bestellung", on every customer order ("Website für einen Friseur, Local SEO hoch, GEO hoch") and when an existing site is to be optimized.
---

# Order → requirements specification

Goal: requirements apply **from planning onward**, not only at checking. Rules live only in `wissen/fachgebiete/`; this skill applies them.

1. **Record the order.** Customer exists: `kunden/<slug>/auftrag.md` (template `vorlage/auftrag.md`, comes along with `/neuer-kunde`).
   Only one sentence from the user ("Friseur in Eislingen, Local SEO hoch, GEO hoch, CRO mittel"): first test with
   `node werkzeuge/auftrag-lesen.mjs --text "<Satz>" --kurz`, then transfer the details into `auftrag.md` (format of the template) –
   the order is the written basis for scope and price. Take over configurator requests ("Sicherheit: Stufe 4 von 5 (Hoch)") directly.
   Log the order (`/auftrag`, area `kunde-<slug>`).
2. **Generate the requirements specification:** `node werkzeuge/auftrag-lesen.mjs kunden/<slug>` → `kunden/<slug>/PFLICHTENHEFT.md`.
   Check the output: recognized industry and schema.org type, disciplines with priority, derived basics, notes.
3. **Clarify notes, do not guess.** "Nicht verstanden", "Ort geraten", "Branche nicht erkannt", recommendations (e.g. Local SEO for a local
   business, BFSG for online booking) → make a default choice and state it or, if it changes scope/price, ask the user. Never activate
   services on your own that the customer did not order.
4. **Read:** the files under "Vor dem Bauen lesen" in the requirements specification (only the active disciplines, highest priority first), plus, as always,
   `wissen/FEHLER.md`, `wissen/MEISTERSTANDARD.md`, `wissen/DESIGN-WISSEN.md`.
5. **Plan with the requirements specification:** carry every rule under "Planen" into the build plan (page list from search intents, master-data source,
   fact block, main goal per page, questions for the customer). Mark open customer details as `data-pruefen`, invent nothing.
6. **Build:** `/kundenseite-bauen`; the rules under "Bauen" apply during building, not afterwards. In between run
   `node werkzeuge/qualitaet.mjs kunden/<slug>` (quick, ≈ 5 s).
7. **Acceptance:** `/abnahme`.

## Optimizing an existing site
Create the order with the desired services → step 2 → `node werkzeuge/qualitaet.mjs kunden/<slug> --voll` shows the gaps →
fix by priority (must-haves first) → `/abnahme`.

## No false promises
In the requirements specification, in the offer and in replies to customers, never promise rankings or AI recommendations (README "Keine falschen Versprechen", GEO-08).
