# Technical SEO (Crawling, Indexierung, Architektur)

> Key `technical-seo` · Sources: Q-G04, Q-G07–Q-G14 · As of 2026-09-29

## 1 Ziel
Search engines and AI search systems can find, fetch, render and assign to exactly one address every desired page;
unwanted pages stay out deliberately.

## 2 Warum relevant
What is not crawled and indexed can neither rank nor appear in AI Overviews or ChatGPT search (Q-G19, Q-K01).
Mistakes here make all content work worthless.

## 3 Faktoren (belegt)
- robots.txt controls crawling, **not** indexing; noindex only via meta/header and never block it in robots.txt at the same time (Q-G08, Q-G09).
- Canonical absolute, unambiguous, self-referencing; do not canonicalize via robots.txt or noindex (Q-G07).
- Sitemap: absolute URLs, only canonical, indexed pages; `priority`/`changefreq` are ignored, `lastmod` only if correct (Q-G10).
- Permanent redirects server-side (301/308); Google follows up to 10 hops; 404/410 equal (Q-G11, Q-G12).
- Mobile-first: same content, data and metadata on phone and computer (Q-G13).
- Only `<a href>` is crawlable; content in the initial HTML, SSR/prerendering preferred (Q-G04, Q-G14).

## 4 Beim Programmieren
- `bauen.mjs` generates `sitemap.xml` from the same page data as the canonicals; noindex pages (imprint, privacy, thank-you) are missing there.
- `robots.txt`: `User-agent: *` / `Allow: /` / `Sitemap: https://<domain>/sitemap.xml`.
- Cloudflare Pages strips `.html` via 308 (`/seite.html` → `/seite`): choose canonicals and links consistently; existing `.htm` addresses
  stay unchanged and are secured via `_redirects`.
- Static HTML from the generator; no client-side loading of main content.

## 5 Inhalte und Strukturen
Flat architecture (every page ≤ 2 clicks from the home page), speaking paths, one main domain.

## 6 Vermeiden
`Disallow: /` for all, `noindex` in robots.txt, relative canonicals, canonical pointing to redirecting addresses, soft 404 (empty page with 200),
links only via `onclick`, content that is missing on the phone.

## 7 Automatisch umsetzbar
Sitemap, robots.txt, canonicals, noindex meta tags, `_redirects` from the generator.

## 8 Automatisch prüfbar
robots.txt, sitemap format and coverage, canonicals, noindex list, crawlable links, content without JS, 404 page.

## 9 Manuell prüfen
Domain redirects (www/non-www, http→https) after launch, registration in Search Console and Bing Webmaster Tools.

## 10 Wie Claude die Umsetzung belegt
`QUALITAET.md`; after launch in `abnahme.md`: `curl -sI http://<domain>/` and `curl -sI https://www.<domain>/` with status and target, screenshot of the
submitted sitemap in Search Console.

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| TEC-01 | robots.txt allows crawling, names the sitemap absolutely, contains no noindex | K | B | AUTO | robots-txt | O Q-G08, O Q-G09, O Q-G10 | stabil |
| TEC-02 | sitemap.xml contains exactly the indexed pages (canonical https URLs), no noindex pages, without priority/changefreq | K | B | AUTO | sitemap, sitemap-abdeckung | O Q-G10 | stabil |
| TEC-03 | Every indexed page has exactly one absolute, self-referencing https canonical on its own domain | K | B | AUTO | canonical | O Q-G07 | stabil |
| TEC-04 | noindex only for imprint, privacy, thank-you, error and cancellation pages; never the home page | K | B | AUTO | noindex-bewusst | O Q-G09 | stabil |
| TEC-05 | Only crawlable links (`<a href>`), main content in the initial HTML | K | B | AUTO | links-leer, inhalt-ohne-js | O Q-G04, O Q-G14 | stabil |
| TEC-06 | Unknown addresses return the 404 page with status 404 (no soft 404) | E | B | AUTO | seite-404 | O Q-G12 | stabil |
| TEC-07 | Phone and computer show the same content, data and metadata | K | B | MANUAL | | O Q-G13 | stabil |
| TEC-08 | One main domain: http → https and www/non-www via 301/308; old addresses via `_redirects` | K | PL | MANUAL | | O Q-G07, O Q-G11 | stabil |
| TEC-09 | Semantic structure: header, nav, main, footer; lists and tables only for their purpose | E | B | SEMI-AUTO | ext-html-validate | O Q-W07 | stabil |
| TEC-10 | After launch: Search Console and Bing Webmaster Tools (customer's account), submit sitemap, check indexing | E | L | MANUAL | | O Q-G10, O Q-K06 | zeitabh. |
| TEC-11 | IndexNow for Bing & co. only as an addition (Google does not use it) | Z | A | MANUAL | | O Q-K07 | zeitabh. |

## Mythen und Unbelegtes
- „`priority` in the sitemap controls crawling“ – ignored (Q-G10).
- „Disallow removes pages from the index“ – false, use noindex for that (Q-G08, Q-G09).
- „Keep redirects for at least a year“ – not stated in the Google docs (Q-G11); we keep them permanently because it costs nothing.

## Zeitabhängig / nicht recherchiert
HTTP status details (Q-G12). **hreflang** (multilingual sites) has not been researched yet: catch up with the first multilingual customer.
