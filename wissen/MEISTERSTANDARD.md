# Meisterstandard – the yardstick for a high-end site

Every showcase and every customer site must meet **all mandatory points (P)** and reach an average of at least 4 out of 5
in **impact (W)**. It is checked with `/meisterpruefung`. What cannot be measured is judged on screenshots and
frame sequences, not on code.

## P1 Technik (automatic, `werkzeuge/pruefen.mjs`, `lighthouse.sh`, `npm test`)

- Lighthouse mobile with compression: Performance ≥ value of the weight class (P2: schlank 95, Erlebnis 90, Kino 85), Accessibility, Best Practices and SEO = 100, CLS ≤ 0.02.
- 320–1920 px without overflow, tap targets ≥ 44 px, exactly one H1, no console errors.
- JavaScript is allowed when it adds value (operation, configurator, 3D, motion). Without JavaScript, **content, navigation, contact and forms** stay usable; a purely interactive experience (3D, film, configurator) then shows a still image or the text for it. With „reduce motion“ nothing invisible and nothing moving.
- Strict CSP without `unsafe-inline`, no third-party origins (fonts, scripts, images all from the own server).

## P2 Gewicht (automatic, `werkzeuge/budget.mjs`, measured compressed, first load of the home page)

The limit depends on the **purpose of the site**, not on a fixed number (Elias 2026-09-30). The class is set in `kunde.json`
(`"budgetklasse"`) and justified in the requirements spec; without a value, `schlank` applies. What is measured is what users feel
(LCP ≤ 2.5 s, CLS ≤ 0.02, ≥ 55 fps when scrolling, Lighthouse); the KB limits are the guardrails for that. Heavy media
(film, large 3D scene) come only after the poster and „loaded“, never with „save data“ or „reduce motion“.

| Class | When | Total | JS (1st load / lazy-loaded) | CSS | Fonts | Requests | fps | Lighthouse Perf |
|---|---|---|---|---|---|---|---|---|
| `schlank` | Info site: hours, phone, map (trades, hospitality, practice) | 500 KB | 60 / 180 KB | 30 KB | 3 files, 120 KB | 25 | 55 | 95 |
| `erlebnis` | Brand presence with motion, 3D, configurator | 1.2 MB | 200 / 600 KB | 60 KB | 5 files, 250 KB | 40 | 55 | 90 |
| `kino` | Scroll film, large 3D scene, product showcase | 2.5 MB | 350 / 1500 KB | 100 KB | 6 files, 400 KB | 60 | 50 | 85 |

Values live in `werkzeuge/budgetklasse.mjs` (single source). Whoever picks a higher class states the benefit (impact, purpose) in the
requirements spec. For media the following also applies:

| Item | Limit | Reason |
|---|---|---|
| Video in the hero | only after the poster, ≤ 1.5 MB (`schlank`) or ≤ 3 MB (`erlebnis`, `kino`), not on „save data“ | The poster is the LCP element |
| Scroll film (cinema hero, `wissen/lehren/scroll-film.md`) | computer ≤ 12 MB, phone ≤ 5 MB, only after the poster and after „loaded“, never on „save data“ or „reduce motion“ | Elias 2026-09-29 (A-045); not counted in the first load |

## P3 Bewegung (frame sequence, `werkzeuge/bildfolge.mjs`)

- After 150 ms at most a quarter of a large movement is visible; nothing takes over the screen in < 0.3 s.
- Only `transform`, `opacity`, `clip-path`, `mask-position`. No endless pulse or floating effects.
- 3D and videos pause off-screen and when the tab is hidden; with „reduce motion“ a still image.
- At least 55 fps when scrolling on the phone profile (4× CPU throttling) – measured, not estimated.

## P4 Anpassbarkeit

- The whole brand lives in **one** file `css/marke.css`: colors (6 roles), fonts, radii, timings, spacing.
  A color or font change there must not break anything else (test: load a second color scheme,
  `/meisterpruefung` must stay green, AA contrast stays).
- Content (texts, services, prices) lives in one place, not scattered through the markup.

## W Wirkung (judged on screenshots phone + computer, 1–5 each)

| | Question | 5 means |
|---|---|---|
| W1 First impression | Do you know within 5 s what it is, for whom, and what the next step is? | yes, and you want to keep scrolling |
| W2 Distinctiveness | Could the site belong to any random company? | no: leitmotif from the customer's world |
| W3 Typography | Hierarchy, rhythm, tracking, line length 55–75 characters | looks typeset, not typed |
| W4 Composition | Tension through size contrast, white space, grid | no uniform rows of cards |
| W5 Motion | Does every animation have a purpose (guide, explain, respond)? | calm, precise, never in the way |
| W6 Craft | Are states (hover, focus, active, error, empty, loading) designed? | every state considered |
| W7 Credibility | Real photos/visuals, concrete texts, no platitudes | nothing feels made up |

Below 4 in any point: name concretely what is missing, improve, judge again. The judging is not done by the builder alone:
Uffz. Schnörkel (visual scout) rates the screenshots independently; if the scores differ by more than 1,
the stricter one decides.

## Hinweis zur Zweitnote

The visual scout (`uffz-schnoerkel`) often has no browser in this environment. So always give him the
screenshot paths (phone, computer, full page, frame sequences) plus evidence for the states:
one image each with keyboard focus on the main button, the phone link and an expandable element. Without such images
he cannot judge W5 and W6 and rightly grades strictly.
