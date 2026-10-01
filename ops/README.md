# ops – Management and Records

| File | Purpose |
|---|---|
| `auftraege.jsonl` | Order log: one order per line |
| `log.py` | Tool for entering, closing, searching |
| `HAENDE.md` | What only you can do yourself |
| `WIE-ICH-ARBEITE.md` | How Claude works and how we use it wisely |

## Why JSONL

One line per order is compact, can be found instantly with `grep` or `log.py suche`, produces clean diffs in Git
(every change is one line) and is directly machine-readable for Claude. No database server, no dependency.

```json
{"id":"A-009","datum":"2026-09-28","von":"Elias","bereich":"front1","auftrag":"Website-Starter bauen","ausfuehrung":"Vorlage mit Stripe, Kontakt, CSP","ergebnis":"12 Tests grün, Lighthouse 100","status":"erledigt","ref":"PR #1"}
```

Status: `offen` · `laeuft` · `blockiert` · `erledigt`. Areas: `plan`, `setup`, `front1`–`front4`, `kunde-<slug>`, `wartung`.

```bash
python3 ops/log.py liste --offen     # what is still to do
python3 ops/log.py suche stripe      # everything about Stripe
python3 ops/log.py zeige A-009       # one order in full
```
