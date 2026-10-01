---
name: neuer-kunde
description: Create a new customer site from the template - folder kunden/<slug>, master data, branch, maintenance entry, order log. Use on "/neuer-kunde", "neuer Kunde", "neue Website für …".
---

# New customer site

1. Set the slug: lowercase, hyphens, unique (e.g. `urfa-sofrasi`). Log the order (`/auftrag`, area `kunde-<slug>`).
2. Branch: `git switch -c kunde/<slug>`.
3. Copy: `cp -r vorlage kunden/<slug>` (without `node_modules`), then fill in `kunden/<slug>/kunde.json`,
   `wrangler.toml` (`name`, `SEITE_URL`, `PRODUKTE`) and title/texts. Only confirmed facts, the rest `data-pruefen`.
3b. **Order:** fill in `kunden/<slug>/auftrag.md` (comes from the template) with services and priorities, then `/bestellung`.
3a. **Clarifying questions before the design** (even if the order seems clear): Who is the target group? What mood
   (3 adjectives)? What is the one next step for visitors (call, reserve, inquire)? Is there a
   product or a moment suited as a hero image/film? Which sites does the customer like? Answers in
   `kunde.json` or `kunden/<slug>/brief.md`. (From the reference video Metics Media, A-045.)
4. Design: adjust tokens in `public/css/stil.css`. For variants use the Brüder procedure (2–3 variants, customer chooses).
   First read `wissen/FEHLER.md`, `wissen/DESIGN-WISSEN.md`, `wissen/STOLPERFALLEN-URFA.md`.
5. Fonts local: `npm i @fontsource-variable/<schrift>` and copy the woff2 files to `public/fonts/`.
6. Visuals: agent `visual-higgsfield`.
7. Add to `wartung/kunden.json` (`aktiv: false` until launch).
8. `/pruefen` and `/sicherheit`, then `/sichern` (PR with preview link from Cloudflare).
