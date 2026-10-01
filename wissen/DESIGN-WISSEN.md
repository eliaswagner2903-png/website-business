# Design knowledge (proven in earlier projects)

Collected from two competing website variants of an earlier project (one dark & refined, one light &
modern). Both directions worked. What is written here is tried and measured. Additions: append only,
with the brother's initial.

## 1. What makes a page feel high-quality

1. **One clear colour world instead of many tones.** 4–6 roles: background, surface, text, secondary text, line, **one** accent.
   Use the accent only for the most important things (main button, prices/numbers, one highlighted word). If possible, **measure
   colours from the logo** (read pixels) instead of guessing.
2. **Real brand elements instead of imitations.** Prefer to cut out an existing logo (PNG → WebP with transparency)
   or vectorise it cleanly rather than redraw it „similarly“. Details are quickly lost when redrawing.
3. **One leitmotif** from the client's world that recurs everywhere: e.g. arches from an architecture in the
   logo (image frames, menu top edge, info boxes), an ornament as an eyebrow line („line – diamond – text“), a pattern
   as a background. That way everything feels of a piece.
4. **Typography with character:**
   - Serif display (e.g. Cormorant Garamond, 500–600) large and with wide letter-spacing for brand names → refined.
   - Strong grotesque (e.g. Bricolage Grotesque 700–800) with tight letter-spacing (−0.025 to −0.035 em),
     line height ≈ 1 → modern, „agency“.
   - Body font calm (Lato, Manrope …), 16–18 px, line height 1.6–1.7.
   - Italic emphasis on **one** word in the accent colour in headings works very well.
   - Small eyebrow lines: 0.7–0.78 rem, capitals, letter-spacing 0.16–0.24 em.
   - Prices/numbers always `font-variant-numeric: tabular-nums`.
5. **Generous white space:** sections 80–100 px (phone) or 120–150 px (computer) padding.
6. **Consistent shapes:** e.g. cards 24 px, panels 28–32 px, buttons as pills. Consistency makes quality.
7. **Tension through different sizes:** bento grid (one large 2×2 tile next to small ones), offset
   gallery, overlapping photos. Uniform rows of cards look like a template.
8. **Menus/price lists** as a list with a **dotted leader to the price** look more authentic than cards.
9. **Phone number as a design element:** in the contact area huge in the display font, with a growing
   underline on hover.
10. **No contrasting background colours between all sections** if the client wants a calm
    surface – better one continuous background with a subtle pattern.

## 2. Motion: proven tempos and curves

| Curve | Value | Used for |
|---|---|---|
| Standard | `cubic-bezier(.2, .8, .2, 1)` | buttons, small elements, hover |
| Gentle (starts quietly) | `cubic-bezier(.45, .05, .25, 1)` | large surfaces: menu, curtains, image frames |
| Closing | `cubic-bezier(.5, 0, .75, 0)` or similar, shorter | menus close faster than they open |

| Effect | Tempo | Experience |
|---|---|---|
| Hover lift | 2–4 px, 0.3 s | more looks cheap |
| Fade-in on scroll | offset 18–28 px, 0.8–1 s, siblings staggered 80–90 ms | only what is **not** visible on load |
| Slideshow in an image frame | interval 6.5–7 s, crossfade 1.4 s, zoom 7 % over interval + 2 s | two frames offset by half an interval |
| Slideshow progress bar | **below** the photo, with image title and counter „02 / 04“ | inside the photo it looks like a foreign body |
| Open phone menu | 0.7–0.95 s, gentle curve | after 150 ms at most a quarter may be visible |
| Close phone menu | 0.3–0.5 s | |
| Menu entries | from 0.2 s, offset 45–70 ms | appear when the surface reaches them |
| Word wave (text lights up word by word) | 45–70 ms per word, ~1 s each, total ≈ 3.5 s | time-controlled, **not** coupled to scroll position; keep text legible beforehand |
| Logo draws itself / skyline gets „lit“ | 2–2.5 s | mask with soft edge (`mask-position`) or `stroke-dashoffset` |
| Counters (70, 40 …) | 1.2–1.4 s ease-out | once only |
| Sliding marker in the navigation | 0.45–0.5 s | line or pill sliding under the menu item |

**Popular, well-received effects:** sliding navigation marker, slideshow with Ken Burns zoom, word wave,
menu as a curtain with a soft gradient edge **or** as a sheet from below (thumb zone, swipe to close),
image frames that „rise“ in their shape on load (`clip-path` with `round`), line drawings that
draw themselves.

**Rejected/poorly received:** parallax and anything coupled to scroll speed (feels
restless), full-screen surfaces that take over the screen in < 0.3 s (startles), endless pulse/float animations,
blinking things.

## 3. Rules for motion

- Animate only `transform` and `opacity`; `clip-path` and `mask-position` for individual surfaces are fine.
  Never `box-shadow`, `width`, `top/left`, `filter` in loops.
- Hover only in `@media (hover: hover) and (pointer: fine)`; on touch `:active` feedback (press in slightly).
- Everything that moves under `.js` (set class early in `<head>`) and `@media (prefers-reduced-motion: no-preference)`.
- Only slow slideshows may run continuously and only while they are visible (IntersectionObserver),
  paused on a hidden tab and under the mouse.
- Check animations **as a frame sequence** (`/bildfolge`), not only in the end state. „Nice as a still“ ≠ „pleasant in
  motion“.

## 4. Phone first – proven building blocks

- **Fixed quick bar at the bottom** (floating pill with distance to the edge, `env(safe-area-inset-bottom)`): large
  accent button with the phone number written out + two small ones (route, map/offer). On the start page it may
  appear as soon as the call button in the hero has left the screen.
- **Menu:** entries large in the display font, with a short subline and a small photo; at the bottom phone,
  opening status, address. Keep the page behind visible (darkened, slightly blurred) and set `inert`.
- **Gallery on the phone** as a swipe strip with snapping (`scroll-snap`) instead of an endless grid; tap opens
  a large view (native `<dialog>`, swipe, arrow keys, Escape).
- **Long lists** (menu, services) with a sticky bar: search + category chips, horizontally scrollable
  with a soft fade-out mask at the edge, active category with a sliding pill.
- **Opening status** („Jetzt geöffnet · bis 23:00 Uhr“) is well liked – but only with confirmed times, otherwise
  mark it.

## 5. Performance – what really counted

- Look up the **LCP element** in Lighthouse (`lcp-breakdown-insight`). Never `loading="lazy"` for this image,
  but `fetchpriority="high"`. Do not let anything in the first screen start with `opacity: 0`.
- Load further slideshow/gallery photos **only when needed** (data attributes, by script shortly before the change).
- Hidden images (`display: none`) load anyway – except with `loading="lazy"`.
- Fonts: load only faces that appear in the first screen, early; `unicode-range` separates Latin/Latin-ext.
- `Intl.DateTimeFormat` with `timeZone` costs ~75 ms blocking time → compute local time yourself from UTC.
- In the script read all positions first, then write (no layout thrashing).
- Always measure locally **with compression** (`werkzeuge/gzserver.mjs`); without gzip Lighthouse is far too pessimistic.

## 6. Additions from brother A (Hairstyle by Ümit)

- **Vectorise the logo instead of rebuilding it:** `pip install potracer` (pure Python, no system package needed), mask per
  colour from the PNG (enlarged 4×), `potrace.Bitmap(~mask).trace()` → paths. Caution: pass the mask **inverted**,
  otherwise the background is drawn. Result: sharp original logo, recolourable (black → ivory).
- **Refine washed-out old photos:** greyscale, tone curve (e.g. 70–232, gamma 1.4), `ImageOps.colorize` with warm
  black/ivory, slight vignette → a uniform, high-quality look from a weak photo.
- **Measure fallback fonts:** `ctx.measureText` with the web font and the system fonts → `size-adjust` per
  fallback `@font-face` (Jost ↔ Arial 96.3 %, Bodoni Moda ↔ Times 111 %).
- **Sliding pill only with `clip-path`:** one surface across the whole chip list, animate `clip-path: inset(0 R 0 L round 999px)`
  – no `width`, scrolls along in the container.
- **`#pruefen` without script:** `html:has(#pruefen:target) [data-pruefen]::before { content: "prüfen: " attr(data-pruefen) }`.
- **Menu sheet from below:** 0.85 s `cubic-bezier(.45,.05,.25,1)`, closing 0.42 s; entries from 0.22 s offset by
  60 ms. Frame sequence: 150 ms almost nothing, 300 ms ≈ ¼ – feels calm.

## 7. Additions from brother B (Hairstyle by Ümit)

- **Price lists as `<details open>`:** without JS everything open; an inline script directly after the block closes all but the first card
  on the phone – before the first paint, so CLS 0. Soft expanding without JS animation:
  `interpolate-size: allow-keywords` + `::details-content { block-size: 0 → auto }` (under `@supports`).
- **Wave edge between colour surfaces:** one `<symbol viewBox="0 0 1440 80" preserveAspectRatio="none">`, placed at the top of the
  section as `<svg class="welle">` with `bottom: calc(100% - 1px)` and `fill: currentColor` in its own
  background colour – each surface „sloshes“ over the previous one, height `clamp(22px, 4.6vw, 72px)`.
- **Curtain menu from above:** 0.85 s `cubic-bezier(.45,.05,.25,1)`, closing 0.42 s; curtain one step darker than
  the header so that you can see the layer. Frame sequence: 150 ms hardly anything, 300 ms ≈ ⅓.
- **Unbounded (wide grotesque)** needs ≈ 20 % smaller sizes than a normal grotesque: H1 `clamp(2.2rem, 1rem + 6.1vw, 5.1rem)`
  fits on two lines at 320 px („Friseur in / Eislingen.“). Fallback: Arial Bold × 1.30.

## 8. Additions from brother C (Hairstyle by Ümit)

- **Leitmotif from the client's real space:** The newest photo of the salon (Instagram) showed three
  pendant lamps and a black marble counter → from it colours (wall white, marble, grout grey, lamplight) and
  motifs (lamps in the hero, counter for contact/menu/bar). The user chose this direction from three sketches.
- **Light cone with CSS only:** `conic-gradient(from 150deg at 50% -70px, transparent, licht 14deg 46deg, transparent 60deg)`
  – the apex lies **above** the shade, so the cone is already shade-wide at the shade edge – plus
  `mask-image: linear-gradient(#000, transparent)` downwards. Switching on: `opacity` 0 → 1 with `scaleY(.9)`, 1.6 s
  gentle, glow offset 0.35 s. A small lamp above tabs is a nice „sliding marker“.
- **Menu as a circle from the button:** `clip-path: circle(0 at X Y)` → `circle(R at X Y)`, X/Y = button centre, R = distance to the
  farthest corner (set as CSS variables by script). 0.95 s `cubic-bezier(.55,.05,.25,1)`, closing 0.42 s.
  Frame sequence: 150 ms small circle, 300 ms ≈ 40 % – the area grows quadratically, hence a quietly starting curve.
- **Emphasis through weight instead of colour/italic:** thin (250) + bold (680) in the same sentence as in the logo
  (HAI**RST**YLE) – with a variable font (Mona Sans, width 112 %) very distinctive.
- **Tear-off slip with studio animation** (user's wish): anticipation 190 ms (pull 6 px, 5 % longer, sheet gives
  way) → tear 260 ms (copy `position: fixed` on `body`, remainder and piece with a **shared** random tear edge via
  `clip-path`, piece snaps up and tips around a corner) → flight 1.3 s (`y = h·(0.62t² + 0.38t)`, sideways drift,
  fluttering rotateX/Y/Z decaying, fade-out in the last third), neighbours swing 0.8 s damped, sheet springs back.
  Action (call) after ≈ 0.7 s. Principles: anticipation, follow-through, overlapping motion, arcs.
- **Slow motion for chained animations:** CDP `Animation.setPlaybackRate({ playbackRate: .08 })` and screenshots at
  fixed intervals – also works when animations only start in the `onfinish` of others (`bildfolge.mjs` cannot do that).
- **Textures procedural instead of stock photo:** black marble from random walks (veins) + sheen + grain, 1400 × 900 in
  23 KB (`gemeinsam/bruder-c/skizzen/marmor.py`); paper grain as a 192 px tile, WebP quality 100 (4.7 KB).
- **Pictures „hang“:** hanging wire as an SVG data URI with `vector-effect="non-scaling-stroke"` and
  `preserveAspectRatio="none"`, frames hung at different depths – breaks up the uniform row of pictures.
- **Fallback font measured:** Mona Sans ↔ Arial/Liberation Sans `size-adjust` 102.5 % (text 400), 104.4 % (width 112 %, thin).
- [C] **Against „empty and white“:** change of material as rhythm (light – marble – light – tiles – light – marble) instead of
  one base colour for all sections; bind every quote/voice to an object (marble with lamp,
  note slip with adhesive tape), every column of a timeline with an image. The user immediately noticed „inconsistent“.
- [C] **Emphasis through light:** `radial-gradient(ellipse 60% 55% at 50% 62%, licht .75, licht .28 55%, transparent 78%)`
  behind the word, `box-decoration-break: clone` for line breaks – fits lamp motifs, replaces bold/italic.

## 9. From reference: Video Metics Media „$10K Websites“ (A-045, 2026-09-29)

Evaluation: `wissen/referenzen/ausgewertet/2026-09-29-video-metics-media-10k-websites.md`, technique:
`wissen/lehren/scroll-film.md`.

- **One signature effect per page**, plus only justified fade-ins. Before every animation ask: What does it
  communicate (ranking, story, feedback, state)? „Looked cool“ is out.
- **Hero discipline:** at most 4 text elements in the first screen (eyebrow *or* brand, headline ≤ 2 lines,
  subline ≤ 20 words, button row with 1 main + at most 1 secondary button). No badge strip, no
  bullet points, no prices in the hero. The hero needs a **real** image or a film, not a gradient blob.
- **Scroll film (cinema hero):** a product film without cuts that the scroll position plays. Exception to the rejection
  above (parallax/scroll speed): it hangs on the position, one layer, dark calm stage. Allowed with
  its own limit (Meisterstandard P2: computer ≤ 12 MB, phone ≤ 5 MB). Script rules (no cuts, hero centred, dark background, start ≠ end, no
  text in the film) are in the lesson.
- **Storyboard before video:** first one image with 6 fields of the same movement, only then video credits.
- **Avoid AI giveaways** (how customers recognise „AI sites“, collected by the Higgsfield skill):
  uniform rows of three identical cards; every section shape several times; an eyebrow line on every section
  (at most 1 per 3 sections); rebuilt „product interfaces“ made of divs; filler words („nahtlos“, „auf das
  nächste Level“); invented success figures („92 % schneller“); „Jetzt scrollen“ hints; numbered sections
  („001 · Leistungen“); standard palettes near-black + orange/neon cyan/purple glow. One order, three
  different button texts for the same intent („Kontakt“, „Schreib uns“, „Los geht's“) → choose one.
- **Not adopted:** Their rule „serif font only in exceptional cases“ contradicts our proven refined
  direction (section 1.4) – for us serif stays allowed for refined brands, but with justification in the brief.
