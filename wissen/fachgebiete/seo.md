# SEO (On-Page, Inhalte, Suchintention, interne Verlinkung, Bilder)

> Key `seo` · requires: `technical-seo` · Sources: Q-G01–Q-G06, Q-G15–Q-G17 · As of 2026-09-29

## 1 Ziel
Every page answers a clearly defined search intent so well that Google (and every search system built on search indexes)
recognizes it as a fitting answer and people then act.

## 2 Warum relevant
For local businesses, inquiries come mostly through search. Google names as the core: be findable, understandable
pages, own and helpful content, descriptive titles and links (Q-G01, Q-G15). This is also the basis
for AI answers (Q-G20, see `geo.md`).

## 3 Faktoren (belegt)
- **Search intent:** which terms do customers really use („Friseur Eislingen Herrenschnitt“, „Elektriker Notdienst“)? (Q-G01)
- **Title and description:** distinct per page, descriptive, no keyword stuffing (Q-G02, Q-G03).
- **Headings:** structure for people and screen readers; for Google the order does not matter (Q-G01, Q-W11).
- **Internal links:** `<a href>` with descriptive text; every important page linked from at least one other (Q-G04).
- **Images:** `<img>` with descriptive alt, speaking file names, close to the matching text (Q-G05).
- **Content quality:** people-first, real experience, Who/How/Why (Q-G15); AI texts allowed, mass production without added value not (Q-G17).

## 4 Beim Programmieren
- Keep title, description and H1 per page in the content JSON (`inhalt/seite.json`), the generator writes them; never scattered in the markup.
- Title pattern: `<page topic> – <business>`; home page `<business> – <service> in <place>` (place only if local).
- Navigation and footer link all main pages with plain text; link services to each other where it fits.
- Name image files descriptively when embedding (`herrenschnitt-salon-eislingen-1016.webp`), not `IMG_2034`.

## 5 Inhalte und Strukturen
Home page (who, what, where, next step) · one page or a clear section per main service · about us/team ·
contact/directions · frequent customer questions answered visibly (prices, parking, appointments, service area).

## 6 Vermeiden
Keyword stuffing in titles, place lists („Elektriker Göppingen, Eislingen, Salach, …“), nearly identical pages per city (doorway, Q-G16),
empty platitudes, text in images, „hier klicken“, changing the date without changing content (Q-G15).

## 7 Automatisch umsetzbar
Metadata from the content JSON, sitemap, canonical, link texts of the navigation, image file names during conversion (`werkzeuge/bilder.mjs`).

## 8 Automatisch prüfbar
Title/description present, unique, length (rule of thumb) · orphan pages · meaningless link texts · image file names · Open Graph.

## 9 Manuell prüfen
Does the page structure match the search intents? Are the texts concrete and approved by the customer? No doorway patterns?

## 10 Wie Claude die Umsetzung belegt
`QUALITAET.md` (AUTO rows) and in `abnahme.md`: list „search intent → page/section“ (for SEO-01) and approval of the texts with date.

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| SEO-01 | Plan the page structure from search intents: one page or a clearly named section per main service; clarify terms with the customer | K | P | MANUAL | | O Q-G01, O Q-G15 | stabil |
| SEO-02 | Title unique and descriptive per page (topic + business, for local businesses on the home page + place), no keyword stuffing | K | PB | AUTO | titel-einzigartig | O Q-G02 | stabil |
| SEO-03 | Title length 10–70 characters (rule of thumb; Google truncates by device width, names no limit) | E | B | AUTO | titel-laenge | P Q-P02, O Q-G02 | stabil |
| SEO-04 | Meta description unique per indexed page, ≥ 50 characters, summarizes the page | K | B | AUTO | description, description-einzigartig | O Q-G03 | stabil |
| SEO-05 | H1 names the page topic; subheadings describe their section | K | PB | SEMI-AUTO | h1 | O Q-G01, F Q-W11 | stabil |
| SEO-06 | Every indexed page is linked from at least one other page; navigation reaches all main pages | K | PB | AUTO | interne-verlinkung | O Q-G04 | stabil |
| SEO-07 | Link texts describe the target (no „hier“, „mehr“, „weiter“ without context) | E | B | AUTO | ankertexte | O Q-G04 | stabil |
| SEO-08 | Content images as `<img>` with descriptive alt and speaking file name | E | B | SEMI-AUTO | dateinamen, bilder-alt | O Q-G05 | stabil |
| SEO-09 | Texts concrete and original (services, process, team, service area); no filler sentences, no mass AI texts; approved by the customer | K | P | MANUAL | | O Q-G15, O Q-G17 | zeitabh. |
| SEO-10 | No doorway pages per city and no place lists; location pages only for real locations | K | P | MANUAL | | O Q-G16 | zeitabh. |
| SEO-11 | Speaking URLs (lowercase, hyphens); keep existing addresses or redirect via 301/308 | E | P | MANUAL | | O Q-G01, O Q-G11 | stabil |
| SEO-12 | Answer frequent customer questions (prices, directions, parking, appointments) visibly | E | P | MANUAL | | O Q-G15, F Q-F02 | stabil |
| SEO-13 | Open Graph on the home page: og:title, og:description, og:image (absolute), og:url, og:type | Z | B | AUTO | og-tags | F Q-W12 | stabil |
| SEO-14 | Change date/„Stand“ only when the content changes; maintain seasonal content in the subscription | Z | A | MANUAL | | O Q-G15 | stabil |

## Mythen und Unbelegtes
| Claim | State of the evidence |
|---|---|
| meta keywords help | refuted, Google does not use them (Q-G01) |
| ideal keyword density / minimum word count | refuted, „no magical word count“ (Q-G01, Q-G15) |
| Title max. 60, description max. 155 characters | Google has no limit, only truncation by width (Q-G02, Q-G03); our 70 is a rule of thumb |
| Keyword domain ranks better | „hardly any effect“ (Q-G01) |
| E-E-A-T is a ranking factor | Google explicitly denies it (Q-G01, Q-G15) |
| Duplicate-content penalty | no manual action for own duplicates, just canonicalize (Q-G01) |
| AI texts get penalized | not across the board, only mass production without added value (Q-G17) |

## Zeitabhängig (bei Nachrecherche zuerst prüfen)
Check first during re-research: spam policies (Q-G16), handling of AI content (Q-G17), helpful content (Q-G15).
