# Local SEO (lokale Suche, Karten, Entität „Betrieb an einem Ort“)

> Key `local-seo` · requires: `structured-data`, `technical-seo` · Sources: Q-G16, Q-G20, Q-G24, Q-G25, Q-G30–Q-G32, Q-R08, Q-F08 · As of 2026-09-29

## 1 Ziel
The business appears for searches with a place reference („Friseur Eislingen“, „Restaurant in der Nähe“) in Google Maps, in the local pack and in
AI answers with correct details – and whoever finds it can call, come by or book right away.

## 2 Warum relevant
Google names three factors for local ranking: **relevance, distance, prominence**; complete, correct profiles are shown more
often, reviews and references count toward prominence (Q-G31). The website is the source that the profile, directories and AI point to.
For AI features about local businesses Google also points to the Business Profile (Q-G20).

## 3 Faktoren
- **Official:** complete, verified Google Business Profile with the real name (no keywords), fitting category, hours (Q-G30, Q-G31);
  reviews without incentives and without filtering (Q-G32); LocalBusiness markup with name and address, recommended telephone, url, hours, geo (Q-G24).
- **Expert source (survey, not measurement):** identical NAP details on website and profile, consistent directory entries (Q-F08).
- **Distance** cannot be influenced (location of the business or service area).

## 4 Beim Programmieren
- Master data (name, address, phone, hours, coordinates) **once** in the content JSON; text, footer, contact page, JSON-LD and
  quick bar read from it → deviations are technically ruled out.
- `tel:` globally with `+49` (Q-M05), displayed in the usual notation.
- Route as a link to Google Maps/Apple Maps (no iframe: privacy and weight).
- JSON-LD `LocalBusiness` subtype from `branchen.md`, details in `structured-data.md`.

## 5 Inhalte und Strukturen
Home page: name, service, place in the text and in the title. Contact/directions: address, phone, email, hours, parking/public transport, route.
Tradespeople without a shop: service area as running text (places where work is actually done), no city-page factory.
Several locations: one page per location with its own details.

## 6 Vermeiden
Keywords in the business name (profile and website), virtual offices, call-center numbers (Q-G30), doorway pages per neighboring town, place lists (Q-G16),
bought/filtered reviews (Q-G32), star markup for own reviews (Q-G25).

## 7 Automatisch umsetzbar
NAP from one source, JSON-LD, tel/route links, quick bar.

## 8 Automatisch prüfbar
NAP equality text ↔ JSON-LD ↔ tel: links, opening hours text ↔ JSON-LD, required fields and type in JSON-LD, route link, no self-reviews.

## 9 Manuell prüfen
Google Business Profile (only the customer has access), directory entries, review process, multi-location questions.

## 10 Wie Claude die Umsetzung belegt
`QUALITAET.md`; in `abnahme.md` a screenshot or details from the profile (name, category, hours, website link) compared against the site, with date.

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| LOC-01 | Name, address, phone identical on website, in JSON-LD and in the Google Business Profile; name as on the sign, without keywords | K | PBA | SEMI-AUTO | nap | O Q-G30, F Q-F08 | stabil |
| LOC-02 | Address and phone (`tel:+49…`) as text on home page and contact page, name on every page | K | B | AUTO | nap | O Q-G31, F Q-F02, O Q-M05 | stabil |
| LOC-03 | Opening hours from one data source, visible in the text and identical in JSON-LD and in the profile; special hours maintained | K | PB | SEMI-AUTO | oeffnungszeiten | O Q-G24 | stabil |
| LOC-04 | LocalBusiness JSON-LD with the most specific type from `branchen.md`, name, address, telephone, url, opening hours | K | B | AUTO | jsonld-lokal | O Q-G24 | stabil |
| LOC-05 | Route/map as a link (Google Maps, Apple Maps), no iframe | K | B | AUTO | karte-route | P Q-P03 | stabil |
| LOC-06 | Google Business Profile exists and is verified, category fits, website link and hours match the site | K | L | MANUAL | | O Q-G30, O Q-G31, O Q-G20 | zeitabh. |
| LOC-07 | Place and service appear as text on the home page (title, H1 or intro); service area as running text, no place lists | K | P | SEMI-AUTO | fakten-text | O Q-G16, O Q-G31 | stabil |
| LOC-08 | Reviews: the customer asks for Google reviews without incentive and without filtering, and replies to them | E | L | MANUAL | | O Q-G32, O Q-G31 | stabil |
| LOC-09 | No aggregateRating/review for the business itself in the markup | K | B | AUTO | jsonld-bewertungen | O Q-G25 | zeitabh. |
| LOC-10 | Consistent entries in Apple Business Connect, Bing Places and industry-relevant directories | Z | A | MANUAL | | F Q-F08 | zeitabh. |
| LOC-11 | Several locations: one page per location with its own details and its own JSON-LD (otherwise document „not applicable“) | E | P | MANUAL | | O Q-G24, O Q-G16 | stabil |

## Mythen und Unbelegtes
- „NAP consistency is an official Google factor“ – officially only „complete and correct“ and the real name count (Q-G30, Q-G31); the weighting
  comes from expert surveys (Q-F08). We do it anyway because it costs almost nothing and does not confuse customers.
- „Keywords in the profile name help“ – violates the policy (Q-G30).
- „One page per neighboring town brings rankings“ – this is exactly what Google names as a doorway example (Q-G16).
- „More reviews = rank 1“ – reviews count toward prominence (Q-G31) but guarantee nothing.

## Zeitabhängig
Business Profile policies and features (Q-G30–Q-G32), review rules (Q-G25), directory landscape (Q-F08).
