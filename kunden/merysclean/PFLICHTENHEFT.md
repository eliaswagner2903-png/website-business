# Pflichtenheft – Merys Clean UG (haftungsbeschränkt)

> Erzeugt von `node werkzeuge/auftrag-lesen.mjs` aus dem Kundenauftrag. Nicht von Hand ändern: Auftrag ändern und neu erzeugen.

| Angabe | Wert |
|---|---|
| Kunde | Merys Clean UG (haftungsbeschränkt) |
| Branche | Gebäudereinigung → schema.org `ProfessionalService` |
| Ort | Eislingen/Fils |
| Domain | merysclean.de |
| Funktionen | Angebotsformular auf eigener Seite (Leistung, Objektart, Fläche, PLZ/Ort, Rhythmus, Rückrufzeit, Datenschutz-Checkbox, Honigtopf, Origin-Check), |
| Besondere Wünsche | Optisch sehr schön, lokal gehostete Schrift, schönes Menü, klare Struktur. Nichts erfinden: Unbekanntes mit data-pruefen markieren (Gründungsjahr, Versicherung, Qualifikationen, Referenzen, Bewertungen, Preise, Registerdaten, Hauptnummer). Keine Stock-Referenzen. Alte URLs mit 301 auf die neuen Seiten. |
| Weitere Angaben | Anruf-, WhatsApp- und E-Mail-Link, immer sichtbarer Anruf-/Angebot-Knopf, Einsatzgebiet als eigene SVG-Karte mit Ortsliste statt eingebetteter Fremdkarte, · je Leistung eine Seite (Text, Ablauf, Für wen, FAQ), Über uns/Team mit Porträts, Vertrauensleiste, Kontakt mit Zeiten Mo–Fr 8–16 Uhr, |

## Aktive Fachgebiete

| Fachgebiet | Priorität | Herkunft | Muss | Soll | Kann |
|---|---|---|---|---|---|
| Globaler Mindeststandard | IMMER | nicht abwählbar | 24 | – | – |
| Local SEO | HOCH | Auftrag | 10 | 0 | 1 |
| CRO und UX | HOCH | Auftrag | 10 | 0 | 1 |
| SEO (On-Page, Inhalte) | MITTEL | Auftrag (ohne Priorität → MITTEL) | 7 | 5 | 0 |
| Technical SEO | MITTEL | Auftrag (ohne Priorität → MITTEL) | 7 | 3 | 0 |
| Strukturierte Daten | MITTEL | Auftrag (ohne Priorität → MITTEL) | 4 | 4 | 0 |
| Performance | MITTEL | Auftrag (ohne Priorität → MITTEL) | 5 | 4 | 0 |
| Barrierefreiheit | MITTEL | Auftrag (ohne Priorität → MITTEL) | 7 | 1 | 0 |
| Sicherheit | MITTEL | Auftrag (ohne Priorität → MITTEL) | 4 | 3 | 0 |

Nicht bestellt: GEO / KI-Suche, Analytics und Messung (nur der globale Standard gilt).

## Branche: Gebäudereinigung

- schema.org-Typ: `ProfessionalService`
- Pflichtinhalte: services as own pages, service area as text, process (visit, offer, plan), guarantee conditions, contact person
- Hinweise: no dedicated schema.org type; `Service` per service page, `areaServed` only visible places; without reviews/prices unless confirmed

## Vor dem Bauen lesen

- `wissen/fachgebiete/README.md`
- `wissen/fachgebiete/GLOBAL.md`
- `wissen/fachgebiete/local-seo.md`
- `wissen/fachgebiete/cro.md`
- `wissen/fachgebiete/seo.md`
- `wissen/fachgebiete/technical-seo.md`
- `wissen/fachgebiete/structured-data.md`
- `wissen/fachgebiete/performance.md`
- `wissen/fachgebiete/accessibility.md`
- `wissen/fachgebiete/sicherheit.md`

## Planen (Struktur, Inhalte, Daten)

| ID | Regel | Verbindlich | Art | Auch |
|---|---|---|---|---|
| GLB-04 | Exactly one H1 per page, heading levels without gaps | Muss | AUTO | Bauen |
| GLB-05 | Every page has a `<title>` and a meta description (indexed pages) | Muss | AUTO | Bauen |
| GLB-15 | No third-party origins (scripts, fonts, images, iframes) and no tracking that requires consent | Muss | AUTO | Bauen |
| GLB-18 | Imprint and privacy policy linked from every page; texts from the customer/generator, not invented | Muss | SEMI-AUTO | Bauen, Abnahme |
| GLB-21 | Every fact (address, hours, prices, services) comes from the customer; customer has approved the texts | Muss | MANUAL | Abnahme |
| CRO-01 | Define one main goal per page; call to action on the first screen on phone (390 px) and computer (1440 px) | Muss | AUTO | Bauen |
| CRO-04 | Trust evidence only real and approved: photos of team/premises/work, master title, certificates, years, references | Muss | MANUAL | – |
| CRO-05 | Open details: prices or price range (with the customer's consent), process, service area, hours | Muss | MANUAL | – |
| CRO-06 | Reviews/testimonials only real, with source and a note on whether and how authenticity is verified (§ 5b UWG); link to the profile instead of a third-party widget | Muss | MANUAL | Bauen |
| CRO-07 | Navigation short and unambiguously named (rule of thumb ≤ 7 main items); every page ends with the next step | Muss | MANUAL | – |
| CRO-08 | Readably structured: core info first, short paragraphs, subheadings, lists | Muss | MANUAL | – |
| LOC-01 | Name, address, phone identical on website, in JSON-LD and in the Google Business Profile; name as on the sign, without keywords | Muss | SEMI-AUTO | Bauen, Abnahme |
| LOC-03 | Opening hours from one data source, visible in the text and identical in JSON-LD and in the profile; special hours maintained | Muss | SEMI-AUTO | Bauen |
| LOC-07 | Place and service appear as text on the home page (title, H1 or intro); service area as running text, no place lists | Muss | SEMI-AUTO | – |
| LOC-11 | Several locations: one page per location with its own details and its own JSON-LD (otherwise document „not applicable“) | Muss | MANUAL | – |
| A11Y-08 | Document the BFSG classification with the customer (consumer booking/shop? micro-enterprise?) – no legal advice | Muss | MANUAL | – |
| SD-03 | Most specific applicable type (table in `branchen.md`), multiple types as an array, no outdated types | Muss | SEMI-AUTO | – |
| SD-04 | Only true details confirmed by the customer (prices, hours, services) | Muss | MANUAL | – |
| SEO-01 | Plan the page structure from search intents: one page or a clearly named section per main service; clarify terms with the customer | Muss | MANUAL | – |
| SEO-02 | Title unique and descriptive per page (topic + business, for local businesses on the home page + place), no keyword stuffing | Muss | AUTO | Bauen |
| SEO-05 | H1 names the page topic; subheadings describe their section | Muss | SEMI-AUTO | Bauen |
| SEO-06 | Every indexed page is linked from at least one other page; navigation reaches all main pages | Muss | AUTO | Bauen |
| SEO-09 | Texts concrete and original (services, process, team, service area); no filler sentences, no mass AI texts; approved by the customer | Muss | MANUAL | – |
| SEO-10 | No doorway pages per city and no place lists; location pages only for real locations | Muss | MANUAL | – |
| TEC-08 | One main domain: http → https and www/non-www via 301/308; old addresses via `_redirects` | Muss | MANUAL | nach Launch |
| SD-08 | Do not promise discontinued rich-result types (FAQ, HowTo); FAQPage only if the questions are visible | Soll | MANUAL | – |
| SEO-11 | Speaking URLs (lowercase, hyphens); keep existing addresses or redirect via 301/308 | Soll | MANUAL | – |
| SEO-12 | Answer frequent customer questions (prices, directions, parking, appointments) visibly | Soll | MANUAL | – |

## Bauen (Code, Markup, Assets)

| ID | Regel | Verbindlich | Art | Auch |
|---|---|---|---|---|
| GLB-01 | 320–1920 px without overflow, tap targets ≥ 44 px, no console errors; content, navigation, contact and forms usable without JS too (experiences with a still image); with „reduce motion“ everything visible | Muss | AUTO | Abnahme |
| GLB-02 | Viewport `width=device-width`, no zoom lock (`user-scalable=no`, `maximum-scale` < 2) | Muss | AUTO | – |
| GLB-03 | `<html lang>` set | Muss | AUTO | – |
| GLB-06 | No dead internal links, anchors exist, no `href="#"`/empty/`javascript:` | Muss | AUTO | Abnahme |
| GLB-07 | Skip link as the first link, every page has a way to contact (tel:, mailto:, contact page) | Muss | AUTO | – |
| GLB-08 | Navigation works on phone and computer, with keyboard, without JS (fallback: row/link); current page marked | Muss | SEMI-AUTO | Abnahme |
| GLB-09 | Every `<img>` has `alt` (decorative: `alt=""`) as well as `width` and `height` | Muss | AUTO | – |
| GLB-10 | Images as WebP/AVIF, ≤ 300 KB (class schlank) or ≤ 500 KB (erlebnis, kino), first image not lazy | Muss | AUTO | – |
| GLB-13 | Site tests green, html-validate without errors, head rules met | Muss | AUTO | Abnahme |
| GLB-14 | Security headers: CSP without `unsafe-inline`/`unsafe-eval`, HSTS, nosniff, Referrer- and Permissions-Policy, frame-ancestors | Muss | AUTO | – |
| GLB-16 | No mixed content (https addresses only) | Muss | AUTO | – |
| GLB-17 | Forms: every field labelled, honeypot and server-side validation | Muss | AUTO | – |
| GLB-19 | 404 page and favicon present | Muss | AUTO | – |
| GLB-22 | Main content is in the HTML and present without JavaScript | Muss | AUTO | – |
| GLB-23 | robots.txt and sitemap.xml present, home page indexable | Muss | AUTO | – |
| CRO-02 | All contact routes: phone (`tel:+49`), email, address, form or booking; fixed quick bar on the phone; contact route on every page | Muss | SEMI-AUTO | – |
| CRO-03 | Forms: ≤ 6 visible fields, one column, visible labels, required fields marked, errors as text, response time stated | Muss | SEMI-AUTO | – |
| CRO-09 | States designed: focus, error, sending, thank-you page with next step | Muss | MANUAL | – |
| CRO-10 | Main button with a verb and clear contrast against the surroundings (no „miracle color“) | Muss | MANUAL | – |
| LOC-02 | Address and phone (`tel:+49…`) as text on home page and contact page, name on every page | Muss | AUTO | – |
| LOC-04 | LocalBusiness JSON-LD with the most specific type from `branchen.md`, name, address, telephone, url, opening hours | Muss | AUTO | – |
| LOC-05 | Route/map as a link (Google Maps, Apple Maps), no iframe | Muss | AUTO | – |
| LOC-09 | No aggregateRating/review for the business itself in the markup | Muss | AUTO | – |
| A11Y-01 | Everything operable by keyboard, logical order, focus visible and not obscured by fixed bars (2.1.1, 2.4.7, 2.4.11) | Muss | MANUAL | Abnahme |
| A11Y-02 | Contrast text ≥ 4.5:1 (large 3:1), controls ≥ 3:1 – in every color scheme | Muss | SEMI-AUTO | – |
| A11Y-04 | Forms: label, error as text at the field, `autocomplete`, no redundant entry (3.3.7), help in the same place (3.2.6) | Muss | SEMI-AUTO | – |
| A11Y-05 | Alt texts describe content or function; decorative images `alt=""`; every link has a name | Muss | SEMI-AUTO | – |
| A11Y-06 | Motion: „reduce motion“ respected, nothing flashes, autoplay video can be paused (2.2.2, 2.3.1) | Muss | SEMI-AUTO | – |
| PERF-01 | LCP image/poster in the HTML, `fetchpriority="high"`, never lazy, suitable size via `srcset` | Muss | AUTO | – |
| PERF-02 | No layout shift: dimensions for images/videos, fonts with `font-display` and a matched fallback font | Muss | AUTO | – |
| PERF-03 | No render-blocking scripts in the head | Muss | AUTO | – |
| PERF-05 | Little and late JavaScript (class budget, only what adds value), long tasks split | Muss | SEMI-AUTO | – |
| SD-01 | Structured data only as JSON-LD, syntactically valid, `@context` schema.org, home page with a type, no self-reviews of the business itself (as LOC-09) | Muss | AUTO | – |
| SD-02 | Every text value in the markup (also in arrays) is visible on the same page | Muss | AUTO | – |
| SEC-03 | Forms: origin check, length limits, honeypot, rate-limit rule in Cloudflare | Muss | SEMI-AUTO | – |
| SEC-04 | Payments only via Stripe Checkout, price server-side, webhook with signature verification (if payment) | Muss | SEMI-AUTO | – |
| SEC-05 | No secrets in `public/`, `functions/` or the repo | Muss | AUTO | – |
| SEO-04 | Meta description unique per indexed page, ≥ 50 characters, summarizes the page | Muss | AUTO | – |
| TEC-01 | robots.txt allows crawling, names the sitemap absolutely, contains no noindex | Muss | AUTO | – |
| TEC-02 | sitemap.xml contains exactly the indexed pages (canonical https URLs), no noindex pages, without priority/changefreq | Muss | AUTO | – |
| TEC-03 | Every indexed page has exactly one absolute, self-referencing https canonical on its own domain | Muss | AUTO | – |
| TEC-04 | noindex only for imprint, privacy, thank-you, error and cancellation pages; never the home page | Muss | AUTO | – |
| TEC-05 | Only crawlable links (`<a href>`), main content in the initial HTML | Muss | AUTO | – |
| TEC-07 | Phone and computer show the same content, data and metadata | Muss | MANUAL | – |
| PERF-06 | Images below the first screen `loading="lazy"` | Soll | AUTO | – |
| PERF-07 | Fonts: WOFF2 subset, local, file count by class (schlank 3, erlebnis 5, kino 6) | Soll | SEMI-AUTO | – |
| PERF-08 | Long cache times for CSS, JS, fonts, media in `_headers` | Soll | AUTO | – |
| PERF-09 | Video/3D only after poster and „loaded“, paused off-screen, not on „save data“ | Soll | SEMI-AUTO | – |
| SD-05 | Required and recommended properties per type according to the Google docs; better fewer but complete | Soll | SEMI-AUTO | – |
| SD-06 | WebSite (name, url) only on the home page; Organization details (logo ≥ 112 px, sameAs only real profiles) | Soll | MANUAL | – |
| SEC-02 | Strict CSP: `default-src 'self'`, `object-src 'none'`, `base-uri`, `form-action` set | Soll | AUTO | – |
| SEC-06 | Functions responses set their own security headers (`_headers` does not apply there) | Soll | SEMI-AUTO | – |
| SEO-03 | Title length 10–70 characters (rule of thumb; Google truncates by device width, names no limit) | Soll | AUTO | – |
| SEO-07 | Link texts describe the target (no „hier“, „mehr“, „weiter“ without context) | Soll | AUTO | – |
| SEO-08 | Content images as `<img>` with descriptive alt and speaking file name | Soll | SEMI-AUTO | – |
| TEC-06 | Unknown addresses return the 404 page with status 404 (no soft 404) | Soll | AUTO | – |
| TEC-09 | Semantic structure: header, nav, main, footer; lists and tables only for their purpose | Soll | SEMI-AUTO | – |

## Abnahme (Prüfen und Belegen)

| ID | Regel | Verbindlich | Art | Auch |
|---|---|---|---|---|
| GLB-11 | Lighthouse mobile (home page): Performance ≥ 95, Accessibility, Best Practices, SEO = 100 | Muss | AUTO | – |
| GLB-12 | Weight budget of the chosen class (schlank/erlebnis/kino, `kunde.json`) met | Muss | AUTO | – |
| GLB-20 | No placeholder text, no open `data-pruefen` entries at acceptance | Muss | AUTO | – |
| GLB-24 | Visual check on phone and computer: master check W1–W7 averages ≥ 4 | Muss | MANUAL | – |
| A11Y-03 | Zoom 200 % and reflow at 320 px without loss (1.4.4, 1.4.10), no zoom lock | Muss | SEMI-AUTO | – |
| PERF-04 | Lighthouse mobile lab values: LCP ≤ 2.5 s, CLS ≤ 0.02 (Meisterstandard; Google's „good“ limit is 0.1) | Muss | AUTO | – |
| SEC-01 | `/sicherheit` (agent security-auditor) without KRIT/HOCH findings | Muss | MANUAL | – |
| A11Y-07 | Screen-reader spot check: landmarks, heading list, form understandable | Soll | MANUAL | – |
| SD-09 | Validation: Schema Markup Validator on the code, after launch Rich Results Test on the URL | Soll | MANUAL | – |
| SEC-07 | Dependencies minimal, `npm audit --omit=dev` without high/critical | Soll | MANUAL | – |

## Nach Launch (erster Wartungslauf, blockiert die Abnahme nicht)

| ID | Regel | Verbindlich | Art | Auch |
|---|---|---|---|---|
| LOC-06 | Google Business Profile exists and is verified, category fits, website link and hours match the site | Muss | MANUAL | – |
| LOC-08 | Reviews: the customer asks for Google reviews without incentive and without filtering, and replies to them | Muss | MANUAL | – |
| TEC-10 | After launch: Search Console and Bing Webmaster Tools (customer's account), submit sitemap, check indexing | Soll | MANUAL | – |

## Kann (nur wenn es ohne Mehraufwand geht)

- LOC-10: Consistent entries in Apple Business Connect, Bing Places and industry-relevant directories
- CRO-11: After launch: count inquiries and call clicks (see `analytics.md`) and review with the customer after 4–8 weeks

## Abnahme

Nach dem Bau: `/abnahme` (bzw. `node werkzeuge/qualitaet.mjs <ordner> --voll`). Muss-Regeln blockieren, Soll-Regeln erscheinen als Hinweis.
