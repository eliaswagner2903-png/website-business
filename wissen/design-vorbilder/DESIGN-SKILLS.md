# Design skills for website builds (installed 2026-11-23, A-133)

Two third-party skill sets, both MIT, copied unchanged into `.claude/skills/` (licence files kept beside them).
Use them in the design/build phase of every customer or showcase site, together with `/bestellung` and `/abnahme`.

| Skill | Source (pinned commit) | Use |
|---|---|---|
| `design-taste-frontend` ("taste-skill" 2.5.1) | https://github.com/Leonxlnx/taste-skill @ 6c0b5c7 | Anti-slop frontend design: layout, type, spacing, copy, motion, finish gate. Load when building/redesigning/reviewing any page. |
| Emil Kowalski set (19 skills: `emil-design-eng`, `animate`, `animation-performance`, `animation-vocabulary`, `choreograph`, `gestures`, `review-animations`, `improve-animations`, `find-animation-opportunities`, `remove-animations`, `break-ui`, `apple-design`, `prototype`, `learn-taste`, `pick-ui-library`, `ask-emil`, `ask-sonner`, `mobile-native`) | https://github.com/emilkowalski/skills @ 64eb3de | Animation and UI-craft rules. `emil-design-eng` is the main one; `review-animations` before a motion review; `animation-performance` for fps. Cheatsheets in `emil-kowalski/`. |

Not installed on purpose: `write-swift`, `animate-expo` (native apps, not websites).

## Safety review (2026-11-23)
Read-through plus grep of both sets: no hidden instructions, no network calls at run time, no secrets access.
Taste-skill ships Node scripts (checker, gate, icon fetcher from jsDelivr, optional map baker from Overpass) that run
only when invoked; its SKILL.md registers a **Stop hook** (`scripts/gate.mjs`) that only acts when a build is armed
(`.taste-skill/build.json`) and otherwise exits 0. Needs Node 22+ and Chromium.

## House rules vs. skill rules: weigh per customer (Elias, 2026-11-23)
House rules do NOT automatically win. For each customer decide what fits best: our house rule or the skill's rule
(a house rule may not suit the customer, the skill's rule may fit better). Write the decision and the reason in the
customer's `auftrag.md` / `PFLICHTENHEFT.md`. Points where they collide:
1. **Photos.** Taste-skill suggests licensed stock photographs when the client has none. Weigh: customer photos > approved
   stock clearly marked as placeholder > none. Never pass invented photos, reviews or facts off as real
   (CLAUDE.md ground rules 0 and 3 are principles, not style rules, and are not weighed away).
2. **Fonts and third parties.** Its lab/gallery pages load Google Fonts and jsDelivr; our default is `@fontsource`,
   strict CSP, no CDN/trackers. Copy assets into the site, never link. Deviate only with a written reason and a CSP that still holds.
3. **Budget classes** (`schlank`/`erlebnis`/`kino`) and Lighthouse targets: shader/WebGL effects fit `erlebnis`/`kino`;
   always with still-image fallback and `prefers-reduced-motion`.
4. **Dependencies.** `pick-ui-library` may suggest libraries; take one only when it clearly pays off for this customer.
5. **Copy.** Customer sites stay German; the skills' English copy rules are style guidance, not text to paste.
6. **Gate vs. `/abnahme`.** If the taste-skill gate and `/abnahme` disagree, weigh the finding for this customer and note the outcome.

## Updating
`git -C <clone> pull`, diff against `.claude/skills/`, re-run the safety grep, then copy. Never edit the copies in place
(its gate flags edited kit files); put project overrides here instead.
