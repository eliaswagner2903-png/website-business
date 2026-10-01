# Training plan: ready for high-end websites

As of 2026-09-28. Order from Elias: first build the capability, sales, accounts, prices and authorities come last.
Each stage ends with a measurable result against the [Meisterstandard](MEISTERSTANDARD.md) and an
entry in the order log.

| Stage | Content | Result |
|---|---|---|
| 1 Yardstick | Meisterstandard, weight budget, frame sequence, skill `/meisterpruefung` | measurable bar; template checked against it |
| 2 Toolkit | tested building blocks in `vorlage/bausteine/`: brand file `marke.css` with two schemes; hero with poster and video; fade-in via scroll timeline (CSS, no JS) with fallback; page transitions with View Transitions; menu sheet; bento grid; gallery with `<dialog>`; 3D scene (three.js, lazy-loaded, still image as fallback) | each block individually passed (P1–P3) |
| 3 Showcases | three demo pages with made-up brands, clearly labelled „Demo“, one style each: **light & calm** (practice/service provider, appointment booking), **dark & refined** (manufactory, 3D product), **loud & modern** (studio/agency, typography and motion) | three pages with W ≥ 4, at the same time the later sales portfolio |
| 4 Visuals | image pipeline (AVIF/WebP/poster, video WebM+MP4 with ffmpeg), render 3D stills from three.js; integrate Higgsfield as soon as an account exists | visual in under 30 min from draft to built in and measured |
| 5 External review | Fernspäherkommando examines the own showcases like a foreign site; findings go to `wissen/` | no KRIT/HOCH findings |
| 6 Dress rehearsal | a real site (e.g. the URFA master variant) in one go from briefing to acceptance | time and effort measured, process as a skill |

Principle: better three pages that pass every check than ten drafts. Every mistake becomes a line in
`wissen/FEHLER.md`, every proven technique becomes a building block.
