# Fachgebiete – Knowledge, rules and checks for customer websites

> Built with A-051 (2026-09-29). Chain: **research → rule → implementation → check.**
> Sources: `wissen/quellen/QUELLEN.md` · Updating: `wissen/quellen/AKTUALISIERUNG.md` ·
> Workflows: `/bestellung`, `/kundenseite-bauen`, `/abnahme` · Tools: `werkzeuge/auftrag-lesen.mjs` (order → requirements spec), `werkzeuge/qualitaet.mjs` (quality gate).

> Language note: these rule files are written in English for Claude. Section headings (`## 1 Ziel`, `## 2 Warum relevant`, `## Regeln`, `## Mythen und Unbelegtes`, `## Zeitabhängig`),
> table column names, rule IDs, level/phase letters, Art values and the area names/aliases in the table below stay German because the tools and tests parse them
> (Ziel = goal, Warum relevant = why relevant, Regeln = rules, Mythen und Unbelegtes = myths and unproven claims, Zeitabhängig = time-dependent).
> Search keywords and customer-text examples stay German on purpose: customers write German.

## How it is used

1. The customer order is in `kunden/<slug>/auftrag.md` (template `vorlage/auftrag.md`) or given as one sentence („Friseur in Göppingen, Local SEO hoch, GEO hoch, CRO mittel“).
2. `/bestellung` → `node werkzeuge/auftrag-lesen.mjs kunden/<slug>` writes `PFLICHTENHEFT.md`: active areas, priorities,
   which files here must be read, and every rule sorted by **plan · build · acceptance**.
3. Building follows `/kundenseite-bauen`; the requirements spec is the briefing.
4. `/abnahme` → `node werkzeuge/qualitaet.mjs kunden/<slug> --voll` checks every active rule, writes `QUALITAET.md`, and requires a confirmation
   with evidence in `abnahme.md` for manual items. Only „BESTANDEN“ (passed) means done.

## Fachgebiete (machine-readable – the tools read this table)

| Schlüssel | Fachgebiet | Datei | Auch genannt | Setzt voraus |
|---|---|---|---|---|
| `global` | Globaler Mindeststandard | GLOBAL.md | Mindeststandard, Mobile, Mobile Optimization, Mobile-Optimierung, Responsive, Semantic HTML, Semantisches HTML | – |
| `seo` | SEO (On-Page, Inhalte) | seo.md | On-Page SEO, Onpage SEO, OnPage, Suchmaschinenoptimierung, Content, Content Strategy, Content-Strategie, Search Intent, Suchintention, Internal Linking, Interne Verlinkung, Image SEO, Bilder-SEO, Metadata, Metadaten | technical-seo |
| `technical-seo` | Technical SEO | technical-seo.md | Technisches SEO, Tech SEO, Technical, Indexierung, Crawling, Sitemap, Robots, Robots.txt, Canonicals, Canonical, Website Architecture, Seitenarchitektur | – |
| `local-seo` | Local SEO | local-seo.md | Lokales SEO, Lokale SEO, Local, Google Maps, Maps, Google Business Profile, Google Unternehmensprofil, GBP, Local Business, Entity Signals, Entitätssignale, NAP | structured-data, technical-seo |
| `structured-data` | Strukturierte Daten | structured-data.md | Structured Data, Schema, Schema.org, JSON-LD, Rich Results, Rich Snippets | – |
| `geo` | GEO / KI-Suche | geo.md | GEO, AEO, LLMO, AIO, AI SEO, AI Search, AI Search Visibility, KI-Suche, KI-Sichtbarkeit, Generative Engine Optimization, Answer Engine Optimization, Large Language Model Optimization, ChatGPT, Perplexity, AI Overviews | seo, technical-seo, structured-data |
| `cro` | CRO und UX | cro.md | Conversion, Conversion Rate Optimization, Conversion-Optimierung, UX, User Experience, Nutzerführung, Trust, Trust Signals, Vertrauen, Vertrauenssignale, Reputation, Bewertungen | – |
| `accessibility` | Barrierefreiheit | accessibility.md | Accessibility, A11y, WCAG, BFSG, Barrierefrei | – |
| `performance` | Performance | performance.md | Web Performance, Core Web Vitals, CWV, Ladezeit, Geschwindigkeit, Page Speed, PageSpeed, Speed | – |
| `analytics` | Analytics und Messung | analytics.md | Analytics, Webanalyse, Tracking, Conversion Tracking, Conversion-Tracking, Messung, Statistik, Reichweitenmessung | – |
| `sicherheit` | Sicherheit | sicherheit.md | Security, Security-Basics, Sicherheits-Basics, Websicherheit | – |

New area: add a row, create the file following the pattern below, run `node --test werkzeuge/tests/*.test.mjs`.

## Terms without their own file (deliberately merged, no duplicate structure)

| Term | Where it lives | Why |
|---|---|---|
| GEO, AEO, LLMO, AIO, „AI SEO“ | `geo.md` | Same task (appearing in AI answers). Google: „optimizing for generative AI search is … still SEO“ (Q-G20). Only „GEO“ is defined as a research term (Q-K11). The differences are marketing. |
| Content Strategy, Search Intent, Internal Linking, Image SEO, Metadata | `seo.md` | Parts of on-page SEO; separate files would repeat each other. |
| Sitemap, Robots, Canonicals, website architecture | `technical-seo.md` | Crawling and indexing. |
| Local Business, Entity Signals, NAP, Google Business Profile | `local-seo.md` | The entity „business at a location“; schema details in `structured-data.md`. |
| UX, Trust Signals, Reputation | `cro.md` | On company sites, user guidance and trust decide whether inquiries come in; E-E-A-T (Q-G15) is not a ranking factor, but trust works on people. |
| Mobile Optimization, Semantic HTML | `GLOBAL.md` | Always mandatory, cannot be opted out (mobile-first indexing, Q-G13). |
| Core Web Vitals | `performance.md` | Part of performance. |
| Conversion Tracking | `analytics.md` | Measurement. |

## Reading the rules

Every file has a rule table with exactly these columns:

| Column | Values | Meaning |
|---|---|---|
| ID | `SEO-01` … | fixed, never reassigned; deleted rules stay listed marked „(entfallen)“ |
| Stufe | **G** global · **K** core (Kern) · **E** recommended (empfohlen) · **Z** extra (Zusatz) | G always applies; K/E/Z depend on priority (matrix below) |
| Phase | **P** plan · **B** build · **A** acceptance (Abnahme) · **L** after launch (maintenance, does not block acceptance) | when the rule applies (several allowed, e.g. `PB`) |
| Art | **AUTO** · **SEMI-AUTO** · **MANUAL** | AUTO: the tool decides · SEMI-AUTO: the tool checks, human/Claude confirms with evidence · MANUAL: confirmation with evidence only |
| Prüfung | check ID(s) from `werkzeuge/qualitaet.mjs` | empty for MANUAL |
| Beleg | type + source ID, e.g. `O Q-G24` | O official · G law (Gesetz) · S study · F expert source (Fachquelle) · P own practice (Praxis) |
| Stand | stabil · zeitabh. | stabil = stable; zeitabh. = time-dependent, checked first during re-research |

There are no rules with the evidence „unbelegt“ (unsupported): unsupported claims appear only in the file's „Mythen und Unbelegtes“ section.

## Priorities

The customer (or the configurator slider 1–5) sets a priority per area:

| Priority | Words in the order | Slider | Core (K) | Recommended (E) | Extra (Z) |
|---|---|---|---|---|---|
| KRITISCH | kritisch, sehr hoch, höchste, muss | 5 | Muss | Muss | Soll |
| HOCH | hoch, wichtig | 4 | Muss | Muss | Kann |
| MITTEL | mittel, normal, „Ja“ without priority | 3 | Muss | Soll | – |
| NIEDRIG | niedrig, gering | 2 | Soll | Kann | – |
| OPTIONAL | optional, wenn möglich | 1 | Kann | – | – |
| not ordered | „Nein“ or not mentioned | – | – | – | – |

- **Muss** (must) blocks acceptance. **Soll** (should) must be implemented or justified in `abnahme.md` (noted in the report). **Kann** (may) only if it costs no extra effort.
- **The global standard (G) is always Muss** and cannot be opted out by any customer option.
- **Prerequisites:** an active area raises its foundations (column „Setzt voraus“) to at least min(own priority, MITTEL).
  Example: Local SEO sehr hoch → Strukturierte Daten and Technical SEO at least MITTEL.
- **Payment or login** in the order raises Sicherheit to at least HOCH (as in the configurator).
- A local business without Local SEO → the requirements spec recommends offering it to the customer but does not activate it (the customer defines the scope).

## Pattern of an area file

1 Ziel (goal) · 2 Warum relevant (why relevant) · 3 Faktoren (factors) · 4 Beim Programmieren (while coding) · 5 Inhalte/Strukturen (content/structures) · 6 Vermeiden (avoid) · 7 Automatisch umsetzbar (automatically implementable) ·
8 Automatisch prüfbar (automatically checkable) · 9 Manuell prüfen (check manually) · 10 Wie Claude die Umsetzung belegt (how Claude evidences the implementation) · rule table · Mythen und Unbelegtes · Zeitabhängig.

## No false promises

No text, offer or report promises rankings, positions or AI recommendations. Allowed are statements about what we ensure technically
(„Die Seite ist für Google, Bing und die Such-Crawler von ChatGPT, Claude und Perplexity lesbar,
jede Angabe ist strukturiert“ – and only after evidenced acceptance of GEO-01 and LOC-06: „… auch in den Cloudflare-Einstellungen
nicht gesperrt und gleich wie im Unternehmensprofil“), not about the outcome. Google itself says:
good scores „doesn't guarantee“ top rankings (Q-G18), and inclusion in AI answers is „not guaranteed“ (Q-G19).
