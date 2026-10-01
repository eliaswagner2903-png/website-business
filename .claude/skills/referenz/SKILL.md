---
name: referenz
description: Evaluate a reconnaissance report on someone else's website (e.g. from Hfw Fortenbacher) and take the transferable parts into the system. Use on "/referenz", when a dossier lies in wissen/referenzen/eingang/ or the user sends a report.
---

# Evaluate a reference

1. Put the dossier at `wissen/referenzen/eingang/<JJJJ-MM-TT>-<domain>.md` (unchanged), log the order
   (`python3 ops/log.py neu "Referenz auswerten: <domain>" --bereich wissen`).
2. Copy `wissen/referenzen/VORLAGE.md` to `ausgewertet/<same name>.md` and fill it in. Grade strictly by
   the W criteria from `wissen/MEISTERSTANDARD.md`. Only from the dossier and own observation, invent nothing.
3. Take the section **Übertragbar** seriously: describe our own implementation for each pattern, never take over texts, images
   or code. Whatever violates our obligations (tracking, cookies, third-party scripts, weight) goes
   under "Nicht übernehmen".
4. Each pattern as a line in `MUSTER.md` (next free ID `M-###`), the site in `REFERENZLISTE.md`.
5. Take small rules into their target immediately (`DESIGN-WISSEN.md`, `FEHLER.md`, `MEISTERSTANDARD.md`: append only,
   name the source) and set status `drin`. Log new building blocks as their own order (status `geplant`).
6. Move the dossier to `ausgewertet/`, `/sichern`.
7. **Report to Elias (mandatory, immediately):** a visual (screenshot of the other site phone + computer, or a
   graphic, as a file under `/mnt/project-files/referenzen/` or an artifact), the 3–5 most important insights and the
   **top 3 innovations/features** with one sentence each on how we implement them ourselves.
