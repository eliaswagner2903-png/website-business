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

## House rules that WIN over the skills (CLAUDE.md ground rules)
1. **No stand-in photos presented as real.** Taste-skill suggests licensed stock photographs when the client has none.
   We use only the customer's own photos, clearly marked placeholders, or visuals Elias approved. Never pass invented
   photos, reviews or facts off as real (ground rules 0 and 3). Ignore `assets/photos` as content.
2. **Fonts local, no third-party requests.** Its lab/gallery pages load Google Fonts and jsDelivr; our sites use
   `@fontsource` only, strict CSP, no CDN, no trackers (see CLAUDE.md "Mandatory"). Copy assets into the site, never link.
3. **Performance budget classes** (`schlank`/`erlebnis`/`kino`) and Lighthouse targets still apply; shader/WebGL
   effects only in `erlebnis`/`kino` and with a still-image fallback and `prefers-reduced-motion`.
4. **No new dependencies** just because a skill suggests a library (`pick-ui-library`): ground rule "no unnecessary dependencies".
5. Customer sites stay German in copy; the skills' English copy rules are style guidance, not text to paste.
6. When the taste-skill gate and our `/abnahme` disagree, `/abnahme` decides; report the conflict to Elias.

## Updating
`git -C <clone> pull`, diff against `.claude/skills/`, re-run the safety grep, then copy. Never edit the copies in place
(its gate flags edited kit files); put project overrides here instead.
