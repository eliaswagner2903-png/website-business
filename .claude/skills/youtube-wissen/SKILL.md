---
name: youtube-wissen
description: Use stored YouTube knowledge (wissen/youtube/) - search, compare, reconcile with new videos, apply to a task. Use on "was weißt du über …", "/youtube-suche", "/youtube-vergleich", "/youtube-revise", "nutze mein gespeichertes Wissen über … für diese Seite".
---

# Retrieve YouTube knowledge

Never load everything. Procedure: task → search → read a few sources → integrate.
1. `python3 werkzeuge/youtube.py suche <Begriffe der Aufgabe> --n 5` (empty = no knowledge yet, say so openly, invent nothing).
2. Read only the hits (concepts first, then sources). Name sources with their type (BEHAUPTUNG/MEINUNG …) and timestamp; never pass on creator statements as fact.
3. For customer sites, `wissen/fachgebiete/` (rules) always takes precedence over YouTube knowledge; address contradictions.
4. **Comparison** (`/youtube-vergleich`): set hits from several videos side by side (commonalities, differences, contradictions, conditions), update the concept file if needed.
5. **Reconciliation** (`/youtube-revise`): check a new video against the `suche` hits, supplement the concept file, link duplicates instead of writing new text.
6. Changes to knowledge files: `pruefen` + `index`.
