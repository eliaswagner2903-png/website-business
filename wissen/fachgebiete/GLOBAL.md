# Globaler Mindeststandard

> Key `global` · applies to **every** site; every rule is **Muss** and cannot be opted out by any customer option.
> Builds on `CLAUDE.md` („Pflicht für jede Kundenseite“) and `wissen/MEISTERSTANDARD.md` (P1–P4, W1–W7) instead of repeating them.

## 1 Ziel
Every delivered site is usable on every device, low-barrier, fast, secure, technically clean and correct in content –
regardless of which services the customer ordered.

## 2 Warum relevant
This is the craft the customer takes for granted without ordering it. Google indexes the mobile version (Q-G13); WCAG 2.2 AA is
the yardstick for accessibility (Q-W07); the imprint obligation applies to every commercial site (Q-R01).

## 3 Faktoren
Responsive 320–1920 px · operability (keyboard, without JS, reduced motion) · semantic HTML (one H1, heading levels, lang) ·
metadata · working links and navigation · image optimization · performance (Lighthouse, budget) · security headers ·
privacy (no third-party origins) · legal pages reachable · correct, approved content.

## 4 Beim Programmieren
- Generator (`bauen.mjs`) instead of hand-written HTML; title, description, canonical per page from one data source.
- Head rules from `CLAUDE.md`, scripts with `defer`, no inline scripts without a hash.
- `<img>` always with `alt`, `width`, `height`; first large image `fetchpriority="high"`, never lazy.
- Navigation as `<nav>` with `<a href>`, current page `aria-current="page"`, skip link as the first element.

## 5 Inhalte und Strukturen
Imprint and privacy policy (texts from the customer or the generator, never written yourself), 404 page, favicon, a way to contact on every page.

## 6 Vermeiden
Zoom lock in the viewport · placeholder text · invented facts · third-party scripts/fonts · dead links · content that only appears with JS.

## 7–10 Automatik und Beleg
- **Implemented automatically:** the template (`vorlage/`) provides headers, CSP, 404, form with honeypot, head structure; the generator sets metadata.
- **Checked automatically:** `werkzeuge/qualitaet.mjs` (static + browser) and, with `--voll`, `pruefen.mjs`, `lighthouse.sh`, `budget.mjs`.
- **Manual:** correctness of the content (customer confirms), visual check of the screenshots (`/meisterpruefung`, W1–W7).
- **Evidence:** `QUALITAET.md` with verdict BESTANDEN; manual items in `abnahme.md` with evidence (screenshot path, customer approval with date).

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| GLB-01 | 320–1920 px without overflow, tap targets ≥ 44 px, no console errors; content, navigation, contact and forms usable without JS too (experiences with a still image); with „reduce motion“ everything visible | G | BA | AUTO | ext-pruefen | O Q-W07, P Q-P01 | stabil |
| GLB-02 | Viewport `width=device-width`, no zoom lock (`user-scalable=no`, `maximum-scale` < 2) | G | B | AUTO | viewport | O Q-W08 | stabil |
| GLB-03 | `<html lang>` set | G | B | AUTO | html-lang | O Q-W07 | stabil |
| GLB-04 | Exactly one H1 per page, heading levels without gaps | G | PB | AUTO | h1, ueberschriften | F Q-W11, P Q-P03 | stabil |
| GLB-05 | Every page has a `<title>` and a meta description (indexed pages) | G | PB | AUTO | titel, description | O Q-G02, O Q-G03 | stabil |
| GLB-06 | No dead internal links, anchors exist, no `href="#"`/empty/`javascript:` | G | BA | AUTO | links-intern, links-leer | O Q-G04 | stabil |
| GLB-07 | Skip link as the first link, every page has a way to contact (tel:, mailto:, contact page) | G | B | AUTO | skip-link, kontakt-jede-seite | O Q-W07, P Q-P03 | stabil |
| GLB-08 | Navigation works on phone and computer, with keyboard, without JS (fallback: row/link); current page marked | G | BA | SEMI-AUTO | ext-pruefen, link-namen | O Q-W07 | stabil |
| GLB-09 | Every `<img>` has `alt` (decorative: `alt=""`) as well as `width` and `height` | G | B | AUTO | bilder-alt, bilder-masse | O Q-G05, O Q-W03 | stabil |
| GLB-10 | Images as WebP/AVIF, ≤ 300 KB (class schlank) or ≤ 500 KB (erlebnis, kino), first image not lazy | G | B | AUTO | bilder-format, bilder-gewicht, lcp-nicht-lazy | O Q-W02, O Q-W06 | stabil |
| GLB-11 | Lighthouse mobile (home page): Performance ≥ 95, Accessibility, Best Practices, SEO = 100 | G | A | AUTO | ext-lighthouse | P Q-P01 | stabil |
| GLB-12 | Weight budget of the chosen class (schlank/erlebnis/kino, `kunde.json`) met | G | A | AUTO | ext-budget | P Q-P01 | stabil |
| GLB-13 | Site tests green, html-validate without errors, head rules met | G | BA | AUTO | ext-tests, ext-html-validate, ext-kopf | P Q-P03 | stabil |
| GLB-14 | Security headers: CSP without `unsafe-inline`/`unsafe-eval`, HSTS, nosniff, Referrer- and Permissions-Policy, frame-ancestors | G | B | AUTO | sicherheits-header | F Q-M01, P Q-P03 | stabil |
| GLB-15 | No third-party origins (scripts, fonts, images, iframes) and no tracking that requires consent | G | PB | AUTO | fremde-quellen, tracking-skripte | G Q-R04, O Q-R05, P Q-P03 | stabil |
| GLB-16 | No mixed content (https addresses only) | G | B | AUTO | mixed-content | F Q-M01 | stabil |
| GLB-17 | Forms: every field labelled, honeypot and server-side validation | G | B | AUTO | formular-label, formular-honigtopf | O Q-W07, P Q-P03 | stabil |
| GLB-18 | Imprint and privacy policy linked from every page; texts from the customer/generator, not invented | G | PBA | SEMI-AUTO | impressum-datenschutz | G Q-R01 | stabil |
| GLB-19 | 404 page and favicon present | G | B | AUTO | seite-404, favicon | P Q-P03 | stabil |
| GLB-20 | No placeholder text, no open `data-pruefen` entries at acceptance | G | A | AUTO | platzhalter, data-pruefen | P Q-P03 | stabil |
| GLB-21 | Every fact (address, hours, prices, services) comes from the customer; customer has approved the texts | G | PA | MANUAL | | P Q-P03 | stabil |
| GLB-22 | Main content is in the HTML and present without JavaScript | G | B | AUTO | inhalt-ohne-js | O Q-G14 | stabil |
| GLB-23 | robots.txt and sitemap.xml present, home page indexable | G | B | AUTO | robots-txt, sitemap, noindex-bewusst | O Q-G08, O Q-G10 | stabil |
| GLB-24 | Visual check on phone and computer: master check W1–W7 averages ≥ 4 | G | A | MANUAL | | P Q-P01 | stabil |

## Mythen und Unbelegtes
- „Google penalizes multiple H1s“: Google does not care about the order of headings (Q-G01). One H1 is our rule, for accessibility (Q-W11).
- „Passed the Mobile-Friendly Test = good on mobile“: the test has not existed since 2023-12-01 (Q-G34); we measure with Lighthouse and `pruefen.mjs`.

## Zeitabhängig
No rule here is time-dependent; the Lighthouse thresholds follow the Meisterstandard and change only with it.
