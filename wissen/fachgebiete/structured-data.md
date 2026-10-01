# Strukturierte Daten (Schema.org, JSON-LD)

> Key `structured-data` · Sources: Q-G23–Q-G29, Q-S01–Q-S04, Q-P02 · As of 2026-09-29

## 1 Ziel
Search systems read the most important facts about the business and the page in machine-readable form – correct, complete and matching the visible content.

## 2 Warum relevant
Markup makes rich results possible (no guarantee) and helps with understanding the entity (Q-G23). It is **not a ranking factor** and not an
AI lever: Google needs no special schema for AI features (Q-G19, Q-G20). Wrong markup costs the rich-result eligibility (Q-G23).

## 3 Faktoren (belegt)
- Mark up only what visitors see; nothing misleading; most specific type; JSON-LD recommended (Q-G23).
- Required fields missing → no rich result; better few but complete and correct fields (Q-G23).
- LocalBusiness: required `name`, `address`; recommended `telephone`, `url`, `openingHoursSpecification`, `geo` (≥ 5 decimal places),
  `priceRange` (< 100 characters), for hospitality `servesCuisine`, `menu` (Q-G24). Multiple types as an array (`["Plumber","HVACBusiness"]`).
- Opening hours: 24 h = `00:00`–`23:59`, closed = `00:00`–`00:00`, seasonal with `validFrom`/`validThrough` (Q-G24).
- Self-reviews (LocalBusiness/Organization about itself) get no stars (Q-G25).
- Discontinued: FAQ rich results (since 2026-05-07), HowTo, sitelinks search box; breadcrumbs no longer visible on mobile (Q-G29, Q-G27).

## 4 Beim Programmieren
- Generate JSON-LD in the generator from the same master data as the visible text (see `kunden/urfa-meister/bauen.mjs`), escape `<` (as `<`).
- LocalBusiness on home page and contact page; `WebSite` (name, url) only on the home page (Q-G28).
- Arrays (e.g. `servesCuisine`) only with values that are visibly on the page (FEHLER.md, A-037).
- One test per page checks syntax and visibility (`werkzeuge/qualitaet.mjs` checks `jsonld-*`).

## 5 Inhalte und Strukturen
Type per industry from `branchen.md`. Menu as an HTML page (then `hasMenu`/`menu` = its URL). `sameAs` only to real, active profiles.

## 6 Vermeiden
Invisible values, invented prices/hours, outdated types (`ProfessionalService`, `Attorney`), `aggregateRating` for the business itself,
FAQ markup „for snippets“, duplicate markup on every page with deviating values.

## 7 Automatisch umsetzbar
JSON-LD from master data in the generator.

## 8 Automatisch prüfbar
Syntax, @context/@type, visibility of every text value, LocalBusiness required fields and type, no self-reviews.

## 9 Manuell prüfen
Correctness of the values (customer), Schema Markup Validator on the code, after launch Rich Results Test on the URL.

## 10 Wie Claude die Umsetzung belegt
`QUALITAET.md` (jsonld-*); in `abnahme.md` the result of the Schema Markup Validator (number of errors/warnings) with date.

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| SD-01 | Structured data only as JSON-LD, syntactically valid, `@context` schema.org, home page with a type, no self-reviews of the business itself (as LOC-09) | K | B | AUTO | jsonld-syntax, jsonld-typ, jsonld-bewertungen | O Q-G23 | stabil |
| SD-02 | Every text value in the markup (also in arrays) is visible on the same page | K | B | AUTO | jsonld-sichtbar | O Q-G23, P Q-P02 | stabil |
| SD-03 | Most specific applicable type (table in `branchen.md`), multiple types as an array, no outdated types | K | P | SEMI-AUTO | jsonld-typ | O Q-G23, O Q-S02 | stabil |
| SD-04 | Only true details confirmed by the customer (prices, hours, services) | K | P | MANUAL | | O Q-G23 | stabil |
| SD-05 | Required and recommended properties per type according to the Google docs; better fewer but complete | E | B | SEMI-AUTO | jsonld-lokal | O Q-G23, O Q-G24 | zeitabh. |
| SD-06 | WebSite (name, url) only on the home page; Organization details (logo ≥ 112 px, sameAs only real profiles) | E | B | MANUAL | | O Q-G26, O Q-G28 | stabil |
| SD-07 | BreadcrumbList on pages from the second level | Z | B | MANUAL | | O Q-G27 | zeitabh. |
| SD-08 | Do not promise discontinued rich-result types (FAQ, HowTo); FAQPage only if the questions are visible | E | P | MANUAL | | O Q-G29 | zeitabh. |
| SD-09 | Validation: Schema Markup Validator on the code, after launch Rich Results Test on the URL | E | A | MANUAL | | O Q-S03, O Q-S04 | stabil |

## Mythen und Unbelegtes
- „Schema improves ranking“ – markup enables rich results, not ranking (Q-G23).
- „With schema ChatGPT recommends you“ – no evidence; Google: no special schema needed for AI (Q-G19, Q-G20).
- „FAQ markup brings snippets“ – switched off since 2026-05-07 (Q-G29).
- „`hasMenu` instead of `menu`“ – schema.org recommends `hasMenu` (Q-S02), Google lists only `menu` (Q-G24): **uncertain**, both with the same URL are harmless.

## Zeitabhängig
List of supported rich-result types (Q-G29), review rules (Q-G25), breadcrumb display (Q-G27).
