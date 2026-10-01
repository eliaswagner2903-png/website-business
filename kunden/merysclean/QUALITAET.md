# Quality Gate – Merys Clean UG (haftungsbeschränkt)

**Urteil: NICHT BESTANDEN** · 2026-10-01 22:12 UTC · volle Prüfung · 16 Seiten · Auftrag: kunden/merysclean/auftrag.md

Muss offen: **21** (21 verschiedene Befunde) · Soll offen: 7 · nach Launch: 3 · Legende: ✓ bestanden · ✗ Fehler · ◐ Werkzeug ok oder ohne Befund, Bestätigung fehlt · ○ manuell offen · … nur mit --voll · ↻ nach Launch (Wartung) · · nicht anwendbar

## Globaler Mindeststandard (immer)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ✓ | GLB-01 | 320–1920 px without overflow, tap targets ≥ 44 px, no console errors; content, navigation, contact and forms usable without JS too (experiences with a still image); with „reduce motion“ everything visible | Muss | pruefen.mjs: 320–1920 px, Konsole, Tippflächen, ohne JS, reduzierte Bewegung ohne Befund |
| ✓ | GLB-02 | Viewport `width=device-width`, no zoom lock (`user-scalable=no`, `maximum-scale` < 2) | Muss | 404.html: viewport „width=device-width, initial-scale=1, viewport-fit=cover“; angebot.html: viewport „width=device-width, initial-scale=1, viewport-fit=cover“ |
| ✓ | GLB-03 | `<html lang>` set | Muss | 404.html: lang="de"; angebot.html: lang="de" |
| ✓ | GLB-04 | Exactly one H1 per page, heading levels without gaps | Muss | 404.html: 1 H1; angebot.html: 1 H1 |
| ✓ | GLB-05 | Every page has a `<title>` and a meta description (indexed pages) | Muss | 404.html: Titel vorhanden; angebot.html: Titel vorhanden |
| ✓ | GLB-06 | No dead internal links, anchors exist, no `href="#"`/empty/`javascript:` | Muss | 404.html: interne Links ok; angebot.html: interne Links ok |
| ✓ | GLB-07 | Skip link as the first link, every page has a way to contact (tel:, mailto:, contact page) | Muss | 404.html: erster Link #inhalt; angebot.html: erster Link #inhalt |
| ✓ | GLB-08 | Navigation works on phone and computer, with keyboard, without JS (fallback: row/link); current page marked | Muss | Beleg: Desktop-Panel per Hover/Fokus, Escape schließt (Playwright-Skript Tab/Escape 01.10.); Handy-Blatt per Enter/Escape, Fokus zurück auf Menü-Knopf; ohne JS Menü als Zeile (pruefen.mjs „ohne JavaScript“ ok); aria-current gesetzt. screenshots/*-390.png, *-1440.png |
| ✓ | GLB-09 | Every `<img>` has `alt` (decorative: `alt=""`) as well as `width` and `height` | Muss | 404.html: 2 Bilder mit alt; angebot.html: 2 Bilder mit alt |
| ✓ | GLB-10 | Images as WebP/AVIF, ≤ 300 KB (class schlank) or ≤ 500 KB (erlebnis, kino), first image not lazy | Muss | 404.html: moderne Formate; angebot.html: moderne Formate |
| ✓ | GLB-11 | Lighthouse mobile (home page): Performance ≥ 95, Accessibility, Best Practices, SEO = 100 | Muss | Lighthouse mobil (Median 3 Läufe, Klasse schlank, Perf ≥ 95): Perf 100 · A11y 100 · BP 100 · SEO 100 |
| ✓ | GLB-12 | Weight budget of the chosen class (schlank/erlebnis/kino, `kunde.json`) met | Muss | Budget eingehalten |
| ✓ | GLB-13 | Site tests green, html-validate without errors, head rules met | Muss | 4 Testdateien grün; html-validate ohne Fehler |
| ✓ | GLB-14 | Security headers: CSP without `unsafe-inline`/`unsafe-eval`, HSTS, nosniff, Referrer- and Permissions-Policy, frame-ancestors | Muss | CSP, HSTS, nosniff, Referrer, Permissions, Framing gesetzt |
| ✓ | GLB-15 | No third-party origins (scripts, fonts, images, iframes) and no tracking that requires consent | Muss | nur eigene Herkunft; 404.html: kein Tracking-Code |
| ✓ | GLB-16 | No mixed content (https addresses only) | Muss | 404.html: nur https; angebot.html: nur https |
| ✓ | GLB-17 | Forms: every field labelled, honeypot and server-side validation | Muss | angebot.html: alle Felder beschriftet; angebot.html: Honigtopf vorhanden |
| ✓ | GLB-18 | Imprint and privacy policy linked from every page; texts from the customer/generator, not invented | Muss | Beleg: Impressum und Datenschutz im Fuß jeder Seite; Impressum aus merysclean.de übernommen, Datenschutz nur als Gerüst nach recht/LEITFADEN.md (Generatortext fehlt, data-pruefen) |
| ✓ | GLB-19 | 404 page and favicon present | Muss | 404.html vorhanden; 404.html: Favicon verlinkt |
| ✗ | GLB-20 | No placeholder text, no open `data-pruefen` entries at acceptance | Muss | 62 offene Angaben mit data-pruefen (vor Launch vom Kunden bestätigen lassen) |
| ○ | GLB-21 | Every fact (address, hours, prices, services) comes from the customer; customer has approved the texts | Muss | in abnahme.md bestätigen |
| ✓ | GLB-22 | Main content is in the HTML and present without JavaScript | Muss | angebot.html: ohne JS 1922 von 1922 Zeichen Hauptinhalt; bueroreinigung.html: ohne JS 2248 von 2248 Zeichen Hauptinhalt |
| ✓ | GLB-23 | robots.txt and sitemap.xml present, home page indexable | Muss | robots.txt ok; 12 URLs |
| ✓ | GLB-24 | Visual check on phone and computer: master check W1–W7 averages ≥ 4 | Muss | Beleg: Sichtprüfung 1440/390 px aller 16 Seiten (screenshots/), Menü, Panel, Formular-Fehlerzustand im Browser angesehen; Gestaltung nach DESIGN.md |

## Local SEO (HOCH)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ◐ | LOC-01 | Name, address, phone identical on website, in JSON-LD and in the Google Business Profile; name as on the sign, without keywords | Muss | Name, Adresse, Telefon einheitlich (2 Rufnummern) |
| ✓ | LOC-02 | Address and phone (`tel:+49…`) as text on home page and contact page, name on every page | Muss | Name, Adresse, Telefon einheitlich (2 Rufnummern) |
| ✓ | LOC-03 | Opening hours from one data source, visible in the text and identical in JSON-LD and in the profile; special hours maintained | Muss | Beleg: Mo–Fr 8–16 Uhr aus inhalt/seite.json, sichtbar (Kontakt, Fuß) und gleich in openingHoursSpecification; Profil offen |
| ✓ | LOC-04 | LocalBusiness JSON-LD with the most specific type from `branchen.md`, name, address, telephone, url, opening hours | Muss | ProfessionalService vollständig |
| ✓ | LOC-05 | Route/map as a link (Google Maps, Apple Maps), no iframe | Muss | Route-/Kartenlink vorhanden |
| ↻ | LOC-06 | Google Business Profile exists and is verified, category fits, website link and hours match the site | Muss | im ersten Wartungslauf prüfen und in abnahme.md belegen |
| ◐ | LOC-07 | Place and service appear as text on the home page (title, H1 or intro); service area as running text, no place lists | Muss | Startseite nennt Merys Clean, Eislingen/Fils als Text |
| ↻ | LOC-08 | Reviews: the customer asks for Google reviews without incentive and without filtering, and replies to them | Muss | im ersten Wartungslauf prüfen und in abnahme.md belegen |
| ✓ | LOC-09 | No aggregateRating/review for the business itself in the markup | Muss | keine Eigenbewertungen im Markup |
| ○ | LOC-10 | Consistent entries in Apple Business Connect, Bing Places and industry-relevant directories | Kann | in abnahme.md bestätigen |
| ✓ | LOC-11 | Several locations: one page per location with its own details and its own JSON-LD (otherwise document „not applicable“) | Muss | Beleg: trifft nicht zu, weil nur ein Standort (Eislingen/Fils) |

## CRO und UX (HOCH)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ✓ | CRO-01 | Define one main goal per page; call to action on the first screen on phone (390 px) and computer (1440 px) | Muss | @390px im ersten Bildschirm: 0173 185 35 63 anrufen \| Kostenloses Angebot anfragen \| Anrufen 0173 185 35 63; @1440px im ersten Bildschirm: Kontakt \| 0173 185 35 63 anrufen \| Angebot anfragen |
| ✓ | CRO-02 | All contact routes: phone (`tel:+49`), email, address, form or booking; fixed quick bar on the phone; contact route on every page | Muss | Beleg: tel:+491731853563, mailto, WhatsApp (data-pruefen), Adresse, Formular; feste Schnellleiste am Handy (screenshots/*-390.png) |
| ✗ | CRO-03 | Forms: ≤ 6 visible fields, one column, visible labels, required fields marked, errors as text, response time stated | Muss | angebot.html: /api/kontakt: 11 sichtbare Felder (Richtwert ≤ 6) |
| ○ | CRO-04 | Trust evidence only real and approved: photos of team/premises/work, master title, certificates, years, references | Muss | in abnahme.md bestätigen |
| ○ | CRO-05 | Open details: prices or price range (with the customer's consent), process, service area, hours | Muss | in abnahme.md bestätigen |
| ○ | CRO-06 | Reviews/testimonials only real, with source and a note on whether and how authenticity is verified (§ 5b UWG); link to the profile instead of a third-party widget | Muss | in abnahme.md bestätigen |
| ○ | CRO-07 | Navigation short and unambiguously named (rule of thumb ≤ 7 main items); every page ends with the next step | Muss | in abnahme.md bestätigen |
| ○ | CRO-08 | Readably structured: core info first, short paragraphs, subheadings, lists | Muss | in abnahme.md bestätigen |
| ○ | CRO-09 | States designed: focus, error, sending, thank-you page with next step | Muss | in abnahme.md bestätigen |
| ✓ | CRO-10 | Main button with a verb and clear contrast against the surroundings (no „miracle color“) | Muss | Beleg: „Kostenloses Angebot anfragen“, Weiß auf #2a7430 = 5,8:1 |
| ○ | CRO-11 | After launch: count inquiries and call clicks (see `analytics.md`) and review with the customer after 4–8 weeks | Kann | in abnahme.md bestätigen |

## SEO (On-Page, Inhalte) (MITTEL)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ○ | SEO-01 | Plan the page structure from search intents: one page or a clearly named section per main service; clarify terms with the customer | Muss | in abnahme.md bestätigen |
| ✓ | SEO-02 | Title unique and descriptive per page (topic + business, for local businesses on the home page + place), no keyword stuffing | Muss | „Kostenloses Angebot anfragen \| Merys Clean Gebäudereinigung“; „Büroreinigung & Gewerbereinigung Göppingen \| Merys Clean“ |
| ✓ | SEO-03 | Title length 10–70 characters (rule of thumb; Google truncates by device width, names no limit) | Soll | angebot.html: Titel 59 Zeichen (Faustregel 10–70, Google kürzt nach Breite); bueroreinigung.html: Titel 56 Zeichen (Faustregel 10–70, Google kürzt nach Breite) |
| ✓ | SEO-04 | Meta description unique per indexed page, ≥ 50 characters, summarizes the page | Muss | angebot.html: Description 163 Zeichen; bueroreinigung.html: Description 142 Zeichen |
| ✓ | SEO-05 | H1 names the page topic; subheadings describe their section | Muss | Beleg: tests/seite.test.mjs „genau eine H1“; H1 je Seite nennt Thema (z. B. „Gebäudereinigung in Eislingen und Göppingen“) |
| ✓ | SEO-06 | Every indexed page is linked from at least one other page; navigation reaches all main pages | Muss | angebot.html von 15 Seite(n) verlinkt; bueroreinigung.html von 15 Seite(n) verlinkt |
| ✓ | SEO-07 | Link texts describe the target (no „hier“, „mehr“, „weiter“ without context) | Soll | 404.html: Linktexte beschreibend; angebot.html: Linktexte beschreibend |
| ✓ | SEO-08 | Content images as `<img>` with descriptive alt and speaking file name | Soll | Beleg: Bilder als <img> in <picture> mit beschreibendem alt und Dateinamen wie buero-boden-800.webp |
| ○ | SEO-09 | Texts concrete and original (services, process, team, service area); no filler sentences, no mass AI texts; approved by the customer | Muss | in abnahme.md bestätigen |
| ✓ | SEO-10 | No doorway pages per city and no place lists; location pages only for real locations | Muss | Beleg: Keine Ortsseiten; Einsatzgebiet als Fließtext plus SVG-Karte (PLAN.md Überarbeitung 01.10.) |
| ✓ | SEO-11 | Speaking URLs (lowercase, hyphens); keep existing addresses or redirect via 301/308 | Soll | Beleg: Sprechende URLs ohne .html; alte WordPress-Adressen per 301 in public/_redirects (tests/seite.test.mjs „Weiterleitungen“) |
| ○ | SEO-12 | Answer frequent customer questions (prices, directions, parking, appointments) visibly | Soll | in abnahme.md bestätigen |

## Technical SEO (MITTEL)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ✓ | TEC-01 | robots.txt allows crawling, names the sitemap absolutely, contains no noindex | Muss | robots.txt ok |
| ✓ | TEC-02 | sitemap.xml contains exactly the indexed pages (canonical https URLs), no noindex pages, without priority/changefreq | Muss | 12 URLs; Sitemap deckt alle indexierten Seiten ab |
| ✓ | TEC-03 | Every indexed page has exactly one absolute, self-referencing https canonical on its own domain | Muss | angebot.html: → https://merysclean.de/angebot; bueroreinigung.html: → https://merysclean.de/bueroreinigung |
| ✓ | TEC-04 | noindex only for imprint, privacy, thank-you, error and cancellation pages; never the home page | Muss | datenschutz.html ist noindex (gewollt); impressum.html ist noindex (gewollt) |
| ✓ | TEC-05 | Only crawlable links (`<a href>`), main content in the initial HTML | Muss | 404.html: alle Links mit Ziel; angebot.html: alle Links mit Ziel |
| ✓ | TEC-06 | Unknown addresses return the 404 page with status 404 (no soft 404) | Soll | 404.html vorhanden |
| ✓ | TEC-07 | Phone and computer show the same content, data and metadata | Muss | Beleg: Gleiches HTML für alle Breiten, nur CSS-Umstellung; pruefen.mjs 320–1920 px ohne Überlauf |
| ○ | TEC-08 | One main domain: http → https and www/non-www via 301/308; old addresses via `_redirects` | Muss | in abnahme.md bestätigen |
| ◐ | TEC-09 | Semantic structure: header, nav, main, footer; lists and tables only for their purpose | Soll | html-validate ohne Fehler |
| ↻ | TEC-10 | After launch: Search Console and Bing Webmaster Tools (customer's account), submit sitemap, check indexing | Soll | im ersten Wartungslauf prüfen und in abnahme.md belegen |

## Strukturierte Daten (MITTEL)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ✓ | SD-01 | Structured data only as JSON-LD, syntactically valid, `@context` schema.org, home page with a type, no self-reviews of the business itself (as LOC-09) | Muss | angebot.html: JSON-LD gültig; bueroreinigung.html: JSON-LD gültig |
| ✓ | SD-02 | Every text value in the markup (also in arrays) is visible on the same page | Muss | angebot.html: alle JSON-LD-Werte sichtbar; bueroreinigung.html: alle JSON-LD-Werte sichtbar |
| ✓ | SD-03 | Most specific applicable type (table in `branchen.md`), multiple types as an array, no outdated types | Muss | Beleg: ProfessionalService (branchen.md Reinigung), Service je Leistungsseite, BreadcrumbList |
| ○ | SD-04 | Only true details confirmed by the customer (prices, hours, services) | Muss | in abnahme.md bestätigen |
| ◐ | SD-05 | Required and recommended properties per type according to the Google docs; better fewer but complete | Soll | ProfessionalService vollständig |
| ✓ | SD-06 | WebSite (name, url) only on the home page; Organization details (logo ≥ 112 px, sameAs only real profiles) | Soll | Beleg: WebSite nur in index.html; kein sameAs, da keine bestätigten Profile |
| ○ | SD-08 | Do not promise discontinued rich-result types (FAQ, HowTo); FAQPage only if the questions are visible | Soll | in abnahme.md bestätigen |
| ○ | SD-09 | Validation: Schema Markup Validator on the code, after launch Rich Results Test on the URL | Soll | in abnahme.md bestätigen |

## Performance (MITTEL)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ✓ | PERF-01 | LCP image/poster in the HTML, `fetchpriority="high"`, never lazy, suitable size via `srcset` | Muss | angebot.html @390px: erster Bildschirm ohne lazy-Bilder; bueroreinigung.html @390px: erster Bildschirm ohne lazy-Bilder |
| ✓ | PERF-02 | No layout shift: dimensions for images/videos, fonts with `font-display` and a matched fallback font | Muss | 404.html: alle Bilder mit Maßen; angebot.html: alle Bilder mit Maßen |
| ✓ | PERF-03 | No render-blocking scripts in the head | Muss | 404.html: keine blockierenden Skripte; angebot.html: keine blockierenden Skripte |
| ✓ | PERF-04 | Lighthouse mobile lab values: LCP ≤ 2.5 s, CLS ≤ 0.02 (Meisterstandard; Google's „good“ limit is 0.1) | Muss | Labor: LCP 1.5 s / 1.6 s / 1.7 s, CLS 0 (Feldwerte erst nach Launch) |
| ✓ | PERF-05 | Little and late JavaScript (class budget, only what adds value), long tasks split | Muss | Beleg: 5,5 KB JS gesamt, defer (budget.mjs) |
| ✓ | PERF-06 | Images below the first screen `loading="lazy"` | Soll | angebot.html: Bilder unterhalb lazy; bueroreinigung.html: Bilder unterhalb lazy |
| ✓ | PERF-07 | Fonts: WOFF2 subset, local, file count by class (schlank 3, erlebnis 5, kino 6) | Soll | Beleg: Instrument Sans/Serif lokal als woff2, 2 Dateien geladen (budget.mjs) |
| ✓ | PERF-08 | Long cache times for CSS, JS, fonts, media in `_headers` | Soll | lange Cache-Zeiten für Assets gesetzt |
| ◐ | PERF-09 | Video/3D only after poster and „loaded“, paused off-screen, not on „save data“ | Soll | Budget eingehalten |

## Barrierefreiheit (MITTEL)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ○ | A11Y-01 | Everything operable by keyboard, logical order, focus visible and not obscured by fixed bars (2.1.1, 2.4.7, 2.4.11) | Muss | in abnahme.md bestätigen |
| ✓ | A11Y-02 | Contrast text ≥ 4.5:1 (large 3:1), controls ≥ 3:1 – in every color scheme | Muss | Beleg: Lighthouse A11y 100 auf allen Seiten; Kontraste in DESIGN.md (min. 5,2:1 Text) |
| ✓ | A11Y-03 | Zoom 200 % and reflow at 320 px without loss (1.4.4, 1.4.10), no zoom lock | Muss | Beleg: pruefen.mjs: kein Überlauf bei 320 px; kein Zoom-Sperre im viewport |
| ✓ | A11Y-04 | Forms: label, error as text at the field, `autocomplete`, no redundant entry (3.3.7), help in the same place (3.2.6) | Muss | Beleg: Labels, autocomplete, Feldfehler mit aria-describedby/aria-invalid (seite.js), Browser-Screenshot Fehlerzustand |
| ◐ | A11Y-05 | Alt texts describe content or function; decorative images `alt=""`; every link has a name | Muss | 404.html: 2 Bilder mit alt; angebot.html: 2 Bilder mit alt |
| ✓ | A11Y-06 | Motion: „reduce motion“ respected, nothing flashes, autoplay video can be paused (2.2.2, 2.3.1) | Muss | Beleg: prefers-reduced-motion schaltet Einblenden/Seitenwechsel ab (pruefen.mjs „Bewegung reduzieren“ ok); kein Video |
| ○ | A11Y-07 | Screen-reader spot check: landmarks, heading list, form understandable | Soll | in abnahme.md bestätigen |
| ○ | A11Y-08 | Document the BFSG classification with the customer (consumer booking/shop? micro-enterprise?) – no legal advice | Muss | in abnahme.md bestätigen |

## Sicherheit (MITTEL)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ○ | SEC-01 | `/sicherheit` (agent security-auditor) without KRIT/HOCH findings | Muss | in abnahme.md bestätigen |
| ✓ | SEC-02 | Strict CSP: `default-src 'self'`, `object-src 'none'`, `base-uri`, `form-action` set | Soll | CSP streng |
| ◐ | SEC-03 | Forms: origin check, length limits, honeypot, rate-limit rule in Cloudflare | Muss | 4 Testdateien grün; angebot.html: Honigtopf vorhanden |
| ◐ | SEC-04 | Payments only via Stripe Checkout, price server-side, webhook with signature verification (if payment) | Muss | 4 Testdateien grün |
| ✓ | SEC-05 | No secrets in `public/`, `functions/` or the repo | Muss | keine Geheimnisse gefunden |
| ✓ | SEC-06 | Functions responses set their own security headers (`_headers` does not apply there) | Soll | Beleg: fehlerSeite setzt eigene CSP und Sicherheitsköpfe (functions/_lib/antwort.js) |
| ✓ | SEC-07 | Dependencies minimal, `npm audit --omit=dev` without high/critical | Soll | Beleg: Keine Laufzeit-Dependencies (package.json ohne dependencies) |

## Zu beheben (Muss)

- **GLB-20** No placeholder text, no open `data-pruefen` entries at acceptance → 62 offene Angaben mit data-pruefen (vor Launch vom Kunden bestätigen lassen)
- **GLB-21** Every fact (address, hours, prices, services) comes from the customer; customer has approved the texts → Bestätigung mit Beleg in abnahme.md
- **SEO-01** Plan the page structure from search intents: one page or a clearly named section per main service; clarify terms with the customer → Bestätigung mit Beleg in abnahme.md
- **SEO-09** Texts concrete and original (services, process, team, service area); no filler sentences, no mass AI texts; approved by the customer → Bestätigung mit Beleg in abnahme.md
- **TEC-08** One main domain: http → https and www/non-www via 301/308; old addresses via `_redirects` → Bestätigung mit Beleg in abnahme.md
- **LOC-01** Name, address, phone identical on website, in JSON-LD and in the Google Business Profile; name as on the sign, without keywords → Bestätigung mit Beleg in abnahme.md
- **LOC-07** Place and service appear as text on the home page (title, H1 or intro); service area as running text, no place lists → Bestätigung mit Beleg in abnahme.md
- **SD-04** Only true details confirmed by the customer (prices, hours, services) → Bestätigung mit Beleg in abnahme.md
- **CRO-03** Forms: ≤ 6 visible fields, one column, visible labels, required fields marked, errors as text, response time stated → angebot.html: /api/kontakt: 11 sichtbare Felder (Richtwert ≤ 6)
- **CRO-04** Trust evidence only real and approved: photos of team/premises/work, master title, certificates, years, references → Bestätigung mit Beleg in abnahme.md
- **CRO-05** Open details: prices or price range (with the customer's consent), process, service area, hours → Bestätigung mit Beleg in abnahme.md
- **CRO-06** Reviews/testimonials only real, with source and a note on whether and how authenticity is verified (§ 5b UWG); link to the profile instead of a third-party widget → Bestätigung mit Beleg in abnahme.md
- **CRO-07** Navigation short and unambiguously named (rule of thumb ≤ 7 main items); every page ends with the next step → Bestätigung mit Beleg in abnahme.md
- **CRO-08** Readably structured: core info first, short paragraphs, subheadings, lists → Bestätigung mit Beleg in abnahme.md
- **CRO-09** States designed: focus, error, sending, thank-you page with next step → Bestätigung mit Beleg in abnahme.md
- **A11Y-01** Everything operable by keyboard, logical order, focus visible and not obscured by fixed bars (2.1.1, 2.4.7, 2.4.11) → Bestätigung mit Beleg in abnahme.md
- **A11Y-05** Alt texts describe content or function; decorative images `alt=""`; every link has a name → Bestätigung mit Beleg in abnahme.md
- **A11Y-08** Document the BFSG classification with the customer (consumer booking/shop? micro-enterprise?) – no legal advice → Bestätigung mit Beleg in abnahme.md
- **SEC-01** `/sicherheit` (agent security-auditor) without KRIT/HOCH findings → Bestätigung mit Beleg in abnahme.md
- **SEC-03** Forms: origin check, length limits, honeypot, rate-limit rule in Cloudflare → Bestätigung mit Beleg in abnahme.md
- **SEC-04** Payments only via Stripe Checkout, price server-side, webhook with signature verification (if payment) → Bestätigung mit Beleg in abnahme.md

Ablauf bei Fehlern: Problem dokumentieren → Ursache bestimmen → beheben → erneut prüfen → erst dann bestanden (`.claude/skills/abnahme/SKILL.md`).
