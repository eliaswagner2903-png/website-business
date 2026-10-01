# Known mistakes (please do not repeat)

From earlier projects, generalised. New mistakes: record them with `/lektion` in your own logbook; append recurring
or particularly expensive mistakes here at the bottom as well (with the brother's initial).

## Layout & CSS

| # | Mistake | Rule |
|---|---|---|
| 1 | `padding: 64px 0` overrode the container's side padding | use `padding-block` / `padding-inline` |
| 2 | `<figure>` has a 40 px margin left and right in the browser – image frame far too narrow | always `figure { margin: 0 }` |
| 3 | Jump targets wrong below sticky bars | `scroll-padding-top` (html) and `scroll-margin-top` (target) **add up**; measure the bar height with a script and re-measure |
| 4 | Grid children blew the width at 320 px | `min-width: 0` on grid children; test at 320 px, not only 390 |
| 5 | Long German words stuck out past the edge | `hyphens: auto; overflow-wrap: break-word` for headings |
| 6 | `text-transform: uppercase` turned „ß“ into „SS“ | do not capitalise German words with ß via CSS |
| 7 | Phone number wrapped in the middle of the number | `&nbsp;` between the digit blocks |
| 8 | `display: grid` on list items cancelled `[hidden]` | `[hidden] { display: none !important }` |
| 9 | Caption + controls squeezed together at 320 px | stack them on phones |
| 10 | Category chips wrapped onto two lines | horizontally scrollable with a fade-out mask |
| 11 | A grid had a gap | count the cells beforehand (the sum must be a multiple of the column count) |
| 12 | Small photo enlarged a lot and blurry | never crop/enlarge small source images heavily |
| 13 | Semi-transparent menu on a `backdrop-filter` bar looked see-through | expanding panels with an opaque background |
| 14 | `position: fixed` menu only covered the header row | elements with `backdrop-filter`/`transform` become the reference frame → place full-screen layers outside of them |

## Animation

| # | Mistake | Rule |
|---|---|---|
| 15 | Menu „startled“: almost everything was there within 0.2 s | a curve that starts quietly, ~0.8 s; release the surface bit by bit; check the frame sequence |
| 16 | Looked for the cause in the colour first | for „startling/restless“, check speed and curve first |
| 17 | Scroll-coupled effects felt restless | trigger when they become visible, then fixed speed |
| 18 | Fade-in classes blocked later hover effects | remove the classes after fading in – but only on elements that are visible without the class |
| 19 | Elements in the first screen flickered | do not hide what is visible on load |
| 20 | Slideshow: old photo jumped back to 100 % while still visible | base rule `transition: transform 0s <crossfade time>` |
| 21 | First progress bar faster than the first change | first bar gets the interval + offset |
| 22 | `clip-path` animation with `fill-mode: both` cut off `outline` | use `backwards` |
| 23 | Word wave started at 16–20 % opacity → contrast failure | always keep text legible (≥ 45 % or animate a coloured copy on top) |
| 24 | Screenshot showed half-drawn logos/empty areas | after scrolling wait ≥ 2.5 s or `reducedMotion: 'reduce'`; check hover via `getComputedStyle` |

## JavaScript & interaction

| # | Mistake | Rule |
|---|---|---|
| 25 | Closed menu reachable via Tab | `inert` while closed; on opening, focus the first entry, Escape returns to the button |
| 26 | Without JavaScript the phone menu was unreachable | set class `js` early in `<head>`, show navigation as a row without JS |
| 27 | New `.js …` rules overrode desktop rules | after CSS changes look at desktop **and** phone |
| 28 | Chip bar scrolled wrongly | `offsetLeft` refers to the nearest positioned parent element; bar `position: relative` |
| 29 | Active category wrong in two columns | the category whose heading last passed the reading line wins; on a tie the active one stays; set deep link `#…` directly |
| 30 | Regex error due to invisible combining characters | write `̀-ͯ`; `<meta charset="utf-8">` |
| 31 | `content-visibility: auto` shifted jump targets | compute fully before #-jumps and when idle |
| 32 | Copy script broke because another page changed its HTML | read only **data** from foreign files, build your own HTML, cross-check with `assert` |

## Performance

| # | Mistake | Rule |
|---|---|---|
| 33 | Performance 87: LCP photo was `loading="lazy"` | look up the LCP element, never lazy, `fetchpriority="high"` |
| 34 | 160 ms blocking time | do not alternate layout reads/writes; forced reflows only on animation restart |
| 35 | Italic font loaded before the hero photo | in the first screen only faces that are loaded anyway |
| 36 | LCP was an element with a fade-in animation | in the first screen start nothing with `opacity: 0` |

## Tools & environment

| # | Mistake | Rule |
|---|---|---|
| 37 | `pkill -f "http.server"` in the same command chain killed the own shell, commit did not run | start/stop servers separately; afterwards check `git log -1` |
| 38 | Tests via `file://` – masks, sprites, fonts missing | always via local HTTP server |
| 39 | Full-page screenshots showed lazy images empty | scroll through first |
| 40 | SVG with `--` in a comment was invalid, mask silently dropped | check SVGs with an XML parser |
| 41 | Artifact preview: subpages without skeleton → quirks mode | subpages with `<!DOCTYPE html>` and charset; scripts that need `document.body` placed after the start of the page |
| 42 | Artifact does not reliably load its own CSS/JS | embed CSS, JS, fonts (base64) and icon sprite in every page (`werkzeuge/vorschau.py`) |
| 43 | Many sites are blocked on the network (depending on environment) | get references as screenshots/files from the user; npm and PyPI usually work |

## Additions (Ergänzungen)

| # | Mistake | Rule |
|---|---|---|
| 44 | (A) Decorative SVG that was supposed to protrude beyond its frame became tiny: `svg { max-width: 100% }` capped the width, `height: auto` without `aspect-ratio` gave 150 px | protruding decorative SVG: `max-width: none` + `aspect-ratio` like the viewBox |
| 45 | (A) CLS 0.056: opening status was two lines without JS, replaced by a script (defer) with one line | status function inline in `<head>`, call it directly after the element – or ensure the same line count |
| 46 | (A) Icon button without a name because the text was hidden via `display: none` (A11y 95) | hide text only visually (clip-path pattern) or `aria-label` |
| 47 | (A) Playwright: `ERR_CERT_AUTHORITY_INVALID` behind the proxy, `curl` works | mirror foreign sites with `curl` and serve them locally, never switch off TLS verification |
| 48 | (A) `npm install` in `werkzeuge/` creates `package-lock.json` → `sync.sh` stops | delete the file or `npm install --no-package-lock` |
| 49 | [B] Full-page screenshot with empty areas: `scroll-behavior: smooth` made `scrollTo(0, y)` in the test script smooth, fade-in elements were never triggered | in scripts use `scrollTo({ top: y, behavior: 'instant' })` |
| 50 | [B] 1 px overflow at 320 px due to a rotated decorative outline at the edge; `body { overflow-x: clip }` did not help in phone emulation (`innerWidth` 321, fixed bars widened too) | `overflow-x: clip` on the sections; narrow down the location by hiding individual sections and measuring `scrollWidth` |
| 51 | [B] A11y 96: secondary text with `opacity: .85` on a coloured card → contrast 4.44 | never make secondary text via `opacity`, measure a fixed colour |
| 52 | [B] Review view: `::before` hint squeezed (flex), above the photo (decorative `::before` absolute) or empty (`attr()` on `<tr>` in `td::after`) | review style sets `position: static; transform: none; flex: 0 0 100%`; `data-pruefen` on `<td>` instead of `<tr>` |
| 53 | [B] Status dot green in the open menu: `.offen .punkt` also matched because the menu curtain itself is called `.offen` | state classes with component prefix (`status--offen`); test opening status with `page.clock.setFixedTime(…)` at several times of day |
| 54 | [C] `font-variant-numeric: tabular-nums` showed a struck-through zero in Mona Sans („38,Ø0 €“) | look at the chosen font's digits with `tnum` beforehand; right-aligned prices do not need tabular digits |
| 55 | [C] 157 ms long task at start: read header height → insert DOM → `getBoundingClientRect` for fade-in = three forced layouts | take measurements from `ResizeObserver`/first `IntersectionObserver` call (`entry.boundingClientRect`); build DOM that must exist before the first paint in the inline script |
| 56 | [C] Open menu: Tab reached the skip link, page behind jumped to the top | when opening, set **all** children of `body` except the dialog `inert`, not only `main`/header/footer |
| 57 | [C] Deep link (`#kategorie`) on load below the sticky header: header height only arrived via script | pre-set `scroll-padding-top` in CSS with the header height, script only refines; targets below a tab bar with `scroll-margin-top` |
| 58 | [C] `writing-mode: vertical-rl` on a flex container: children stood on top of each other instead of side by side | the flex main axis follows the writing direction → `flex-direction: column` for „side by side“ in vertical text |
| 59 | [C] „Reduce motion“: transitions triggered by script (fixed bar, sliding marker) kept running | global rule under `prefers-reduced-motion: reduce` (`transition-duration`/`animation-duration: 0s !important`); check with `document.getAnimations()` |
| 60 | [C] Preview: 404 for font preload (fonts embedded, file deleted); `defer` script ran without `defer` in `<head>` | `vorschau.py` removes local font preloads (fixed); own script waits for `DOMContentLoaded` when `readyState === 'loading'` |
| 61 | [C] Serif font with weight 400 only: old `<b>`/`font-weight: 650` rules made the browser create faux bold (unclean) | `html { font-synthesis: none }` and solve emphasis by design (colour, glow, size); after a font change search all `font-weight` |
| 62 | [C] Opaque texture tile as the topmost background layer painted over a surface's base colour (tiles turned white) | never put opaque image layers over a colour surface, otherwise `background-blend-mode: multiply` or a semi-transparent texture |
| 63 | (A) Light ring around a round photo became oval because the layer was attached via `inset` to the whole `figure` (incl. caption) | size decorative layers around round images via the width: `width: 120%; aspect-ratio: 1` |
| 64 | (A) `<button>` with an outline-button class showed a grey browser background | button classes always set `background` (also `none`) |
| 65 | (A) In the artifact preview all script functions were missing: embedded script ran in `<head>` before the DOM | script only starts with `DOMContentLoaded` when `readyState === 'loading'`; test the **published** preview with a function test (locally with skeleton + viewport meta) |
| 66 | (A) Head errors repeated (script in `<head>` before the DOM, embedded scripts lose `defer`) | **secured automatically:** `vorschau.py` moves defer/async/module scripts to the end of `<body>`; `werkzeuge/kopf-pruefen.py` runs via hook after every edit; `werkzeuge/vorschau-testen.mjs` compares original and preview. Rules: CLAUDE.md point 9 |
- **YAML: colon with a space in an unquoted `run:` value** (`--title "Wartung: …"`) makes the whole workflow file invalid; GitHub then silently never runs it. Always write multi-part commands as `run: |` and check workflows after writing with `python3 -c "import yaml; yaml.safe_load(open(f))"`.
- **GitHub ignores `merge=union` from `.gitattributes`** when merging in the browser: parallel PRs that both append to the order log end up in conflict. Before merging, run `git merge origin/main` locally, on conflict `python3 ops/log_vereinen.py`.
- **Form errors as plain text** (external review stage 5): A normal `<form method="post">` ends up on the Function's response at 400/403/502/503. `text/plain` looks like a crash there. `fehlerSeite(text, status, { zurueck })` from `functions/_lib/antwort.js` delivers a small designed page (own CSS, message escaped, link back to the form anchor).
- **`public/_headers` does not apply to responses from Pages Functions** (external review stage 5). HTML from a Function needs its own headers in code: CSP, `nosniff`, `no-store`.
- **Menu button only in a bar that appears after scrolling** (external review stage 5): In the first screen on the phone there was then no navigation. A menu button belongs in the header from the start. Afterwards measure the header height at 320–767 px: an additional 44 px button made the header two lines at 360–424 px.
- **JSON-LD** (external review stage 5): `application/ld+json` is not executed and needs no CSP hash. `<` is escaped as `<`. A test checks every text value against the visible page text: remove `<wbr>` without a space, read `&nbsp;` as a space. It found „Lindgrund Uhrmacherei“, which appeared only in the `<title>`, and „L-40 Schiefer“, which appeared nowhere.
- **`rel="canonical"` is absolute** (external review stage 5): A test „no foreign source in the head“ (`<link … href="https:`) therefore triggered. Such tests exclude `rel="canonical"`.
- **44 px tap area without breaking the layout** (external review stage 5): Single link in running text: `padding-block` on the inline element enlarges the area, the lines stay the same. Links that stand one below another: `display: inline-block; padding-block: calc(22px - <half line height>)`. Otherwise the areas overlap.
- **`pkill -f`/`pgrep -f <pattern>` also hits the own shell** (external review stage 5, like #37): Its command line contains the pattern, the call ends with exit 144. Remember the server PID at start (`$!`) and terminate it specifically.
- **gzserver** (external review stage 5): It now serves `404.html` with status 404 and applies all matching `_headers` blocks (`/fonts/*` etc.). Cache headers can thus be checked locally, for example with `curl -sD- -o/dev/null localhost:PORT/fonts/x.woff2`.
- **Higgsfield download blocked** (visual test A-036): The results are on `d8j0ntlcm91z4.cloudfront.net`, the proxy returned 403. The domain must be in the network allowlist. A changed environment only takes effect in **new** sessions; the running session lets a fresh session download and push to the branch. Only generate the video once the download is certain.
- **ffmpeg is there after all** (visual test A-036): `npm i ffmpeg-static` delivers a ready-made ffmpeg 7 (npm is allowed). The old note „not installable“ was wrong.
- **Never hang video into `<picture>`** (visual test A-036): `hero-video.js` placed the `<video>` behind the poster `<img>` with `poster.after()`. If the `<img>` sits in a `<picture>`, the video ended up inside it. Now: `(poster.closest('picture') || poster).after(film)`.
- **HTML from a generator** (visual test A-036): In `showcase/hell`, `bauen.mjs` builds all pages. A change directly in `public/index.html` makes the test „HTML is up to date“ fail. First check whether there is a generator (`bauen.mjs`, `seiten.py`) and change it there.
- **Copper/accent as text colour** (dress rehearsal A-037): The line colour #9a6b45 on dark gave 4.21:1 → Lighthouse A11y 96. Mix the text colour from the role: `color-mix(in srgb, var(--farbe-linie) 72%, var(--farbe-text))`. Measure every role that also serves as text against the background.
- **Scroll timeline hides sections in a full-page screenshot** (A-037): With `animation-timeline: view()`, sections that were never in view stay invisible. Scrolling through does not help reliably. Take review screenshots with `reducedMotion: 'reduce'`.
- **Frame sequence and scroll timeline** (A-037): `anim.currentTime = x` throws „Invalid currentTime“ for scroll-timeline animations. Only set animations with `a.timeline instanceof DocumentTimeline`.
- **Menu veil grey on dark theme** (A-037): The `menue-blatt` building block colours the veil with the text colour; on a dark background it becomes light grey. Override in `stil.css` with `color-mix(… var(--farbe-grund) 74%, transparent)`.
- **Fonts as one file with Latin Extended-A** (A-037): Instead of latin + latin-ext (4 files, 2 more requests) one woff2 per font via `pyftsubset` with `U+0000-00FF,U+0100-017F,U+2000-206F,U+20AC`. Turkish (ş ı İ ğ) is included, two fonts together 45 KB.
- **Decorative line with `nowrap` → 1 px overflow** (A-037): Line–diamond–text–diamond–line with fixed line widths was 1 px too wide at 360 px (innerWidth 361, FEHLER 50). Lines `flex: 0 1 1.4rem; min-inline-size: .6rem`, allow wrapping below 26rem.
- **JSON-LD test too weak** (A-037): The test only checked strings; `servesCuisine: ['Türkisch','Anatolisch','Grill']` slipped through although „Anatolisch“ was visible nowhere. Also check arrays of strings.
- **Header two lines at 768 px** (A-037): Logo + 5 links + phone did not fit. Hide the phone in the header between 48–64rem (quick bar and hero carry it there).
- **Gallery over budget despite `loading="lazy"`** (A-037): Chrome loads lazy images within ~1250–2500 px immediately, a gallery page with 12 photos thus reaches ≈ 690 KB. The budget applies only to the start page; for galleries provide smaller thumbnails (≤ 480 px).
- **Pill radius as `--radius-gross` makes the menu sheet round** (portfolio A-038): With `--radius-gross: 999px` (buttons as pills) the sheet from `menue-blatt` became a circle segment because the building block also uses the radius for large surfaces. Set the sheet radius in `stil.css` with higher specificity (`.js .kopf .blatt { border-radius: … }`, bausteine.css loads afterwards) or choose `--radius-gross` at most ≈ 32 px. After every radius change look at the open menu.
- **`html { scroll-behavior: smooth }` breaks the check scripts** (A-038, like FEHLER 49): `pruefen.mjs` reported „6 elements invisible“ because `scrollTo(0, y)` scrolled smoothly and scroll-timeline fade-ins never finished. `pruefen.mjs` and `bildfolge.mjs` now scroll with `behavior: 'instant'`. Better to omit smooth scrolling globally.
- **html-validate: `aria-label` on `<span>`/`<dl>`** is forbidden or not recommended (`aria-label-misuse`). For ticks in tables `<span aria-hidden="true">✓</span><span class="unsichtbar">enthalten</span>`; a list of measured values gets a visible heading instead of a label. `<title>` at most 70 characters (`long-title`).
- **`vorlage/tests/bausteine.test.mjs` does not know private variables `--_x`** (A-038): The copy from `kunden/urfa-meister` allows them (`^--(_[a-z-]+|…)`), the template does not yet. Until this is carried over into the template: take the test from urfa-meister.
- **Overlapping tiles (fan) cover the caption of the previous one** (A-038): Caption with `position: relative; z-index: 2` and a background in the base colour; bring the tile just touched/focused to the front via `:hover, :focus-within { z-index: 1 }`.
- **Lighthouse SEO 66 on `noindex` pages is intended** (A-038): Imprint, privacy, 404 and thank-you page are `noindex`; the audit „Page is blocked from indexing“ lowers SEO. Meisterstandard SEO = 100 applies to indexed pages.
- **Preview images of foreign (own) sites for a portfolio** (A-038): Capture 1440×900 at DPR 2 and 390×844 at DPR 3 after scrolling through and waiting 4.5 s (3D scene, loading animations), then `bilder.mjs --breiten=640,1016,1600` or `--breiten=320,640`. Result 12–60 KB per file. The same phone file in hero and work with the same `srcset`/`sizes` → loaded only once.
- **Scroll film did not run in the test Chromium** (portfolio A-047): Playwright's Chromium cannot play H.264, `video.duration` stayed `NaN`, the poster stayed. Always provide the film in two versions (MP4/H.264 and WebM/VP9, each for computer and phone) and choose via `video.canPlayType('video/mp4; codecs="avc1.4d401f"')`. VP9 with `-crf 34 -g 8` was only half the size of H.264 (0.8 instead of 2.0 MB).
- **`scrollIntoView()` at tab start jumps the whole page** (A-047): To make the selected tab visible in a sideways scrolling bar, set `leiste.scrollLeft`; `scrollIntoView` also scrolls the window, even on load.
- **`opacity: 0` for hidden radio buttons and waiting videos is reported as invisible by `pruefen.mjs`** (A-047): Make input fields over the whole card invisible with `appearance: none; background: none; border: 0` instead of `opacity: 0`; video and second still with `visibility: hidden`, fade in via animation `from { opacity: 0 }`.
- **Pages as a preview link (Claude artifact) need relative paths** (A-047): Our pages link `/css/…`; under an artifact address these lead nowhere. `node werkzeuge/vorschau-link.mjs <public> <ziel>` copies and rewrites the paths (division ` / ` in JS stays untouched, paths in JS are relative to the page). Forms send nothing there. Do not publish pages of real businesses (URFA) as an artifact without their approval.
- **Menu sheet in the header with a small z-index not tappable** (OSG A-053, jury R1): The header was `sticky` with `z-index: 10` and thus its own stacking context. The sheet from `menue-blatt` lies inside it and could never be above the veil (`z-index: 15`). Every tap closed the menu, with the keyboard it worked. The header needs `z-index` > 15 (template: 20). `pruefen.mjs` now taps the phone menu and reports covered links.
- **Cloudflare Pages redirects `/seite.html` to `/seite`** (OSG A-053, jury R1): Canonical, sitemap and internal links with `.html` point to redirects. A `_redirects` rule `/seite /seite.html` loops with Pages. Generate links, canonical and sitemap without the extension. `qualitaet.mjs` reports canonicals with `.html`. Also affects older customer sites (urfa-meister).
- **Shop of another system on the same domain** (OSG A-053): `qualitaet.mjs` took shop links (`/customer/…`, `/catalogsearch/…`) for dead internal links. Enter `Fremde Pfade: /customer/, /blog/, …` in the order (prefix with `/` at the end, otherwise exact). Never set a redirect to an address that the new site itself links in the shop (loop).
- **Manufacturer/B2B without customer traffic** (OSG A-053): `branchen.md` now has „Hersteller und Industrie (B2B)“ → `Organization`, no opening hours in the JSON-LD (the check now only requires them for LocalBusiness). JSON-LD of several objects as `{"@context", "@graph": […]}`.
- **Screenshots at pixel density 1 show glyph gaps** („fin den“, „derSchneide“; OSG jury R1): Partly rounding of the glyph positions (fixed with `text-rendering: geometricPrecision` on `body`), partly genuinely too tight tracking of the narrow Archivo (headings at most −0.018 em, `word-spacing: .06em`). Cross-check typographic judgements at `deviceScaleFactor: 2`.
- **„Without JavaScript“ capture too early** (OSG jury R1): A screenshot directly after `goto` showed the hero without an image, the jury counted that as a defect. Wait at least 1 s before state images.
- **Links with `display: inline-flex` do not hyphenate** (OSG A-053): In the footer „Rücknahmebedingungen“ blew the grid at 360–1024 px. Long words with `&shy;`, list grids with `grid-template-columns: minmax(0, 1fr)`. Measure overflow after every footer/header change at 320–1440 px, not only at 320.
- **Hidden radios (1 px) reported as a small tap area** (OSG A-053): `pruefen.mjs` now measures the label for a 1 px input with a label.
- **WebM larger than MP4** (OSG A-053): VP9 from a Higgsfield film with `-b:v 0 -crf 42`, two passes: 713 → 118 KB at the same picture. The source offered first must be the smaller one.
- **Backslashes in the template literal disappear** (OSG jury R2): `pattern="\+?[0-9 \(\)…]"` in a JS template string becomes `+?[0-9 ()…]` (`\+`, `\(` are not escapes there). In the browser's `v` mode the pattern is then invalid, every input counts as correct. In generators write `\\` and add a test that compiles every `pattern` with `new RegExp(p, 'v')`.
- **`counter(list-item)` on `li` with `display: flex` shows „00“** (OSG jury R2): Only `display: list-item` increments the built-in counter. Use your own counter (`counter-reset` on the list, `counter-increment` on the `li`).
- **Text layer over a background film intercepts clicks** (OSG jury R2): The pause button in the film (z-index −1) was not reachable with the mouse at 1366 px because `.held-in` lay above it. Overlaying wrappers `pointer-events: none`, only their contents `auto`; check with a click test at 1280–1440 px.
- **`shop` equals `basis`** (OSG jury R2): If the shop is on the same domain as the new site, „Zum Shop“ points to the own start page. Take a real entry point of the shop (`/osg-products.html`) and secure it with a test (`shop !== basis`). Always form paths below it (`/customer/…`) from `basis`.
- **Word binding before the arrow in flex links** (OSG jury R3): If you bind the last word with the arrow in `<span class="nw">`, `display: inline-flex` links lose the space before it („Serie AE-VMansehen“) because flex items swallow edge spaces. In such links set `column-gap: .3em`. In the footer with narrow columns do not bind at all (overflow at 390 px), and never bind across `&shy;`.
- **Filter result count invisible on the phone** (OSG jury R3): After tapping a filter, the result was below the screen. Set the row with the result count `position: sticky; bottom: <height of the quick bar>`, with a jump link to the results.
- **Own `sitemap.xml`/`robots.txt` next to a shop on the same domain** (OSG jury R4): At launch they would have overwritten the shop's files (35,000 article URLs, blocks for `/checkout/`, `/customer/`, `/catalogsearch/`). Own sitemap under its own name (`sitemap-seiten.xml`), robots.txt with the shop's blocks and both `Sitemap:` lines; `qualitaet.mjs` reads the local sitemap named in robots.txt.
- **Sticky result row covers focus** (OSG jury R4, WCAG 2.4.11): Make the sticky row stick only after the first choice and raise `html:has(.finder :focus-visible) { scroll-padding-bottom: … }` by the height of both bars. Hide the jump link in the empty state.
- **Button with `gap` plus bound word** (OSG jury R4): `.knopf { gap }` and a `<span class="nw">` result in double word spacing. For `.knopf:has(> .nw)` `gap: 0` and a word spacing as `margin` on the span.
