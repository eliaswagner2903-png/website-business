# ops – Führung und Nachweis

| Datei | Zweck |
|---|---|
| `auftraege.jsonl` | Auftragslog: ein Auftrag pro Zeile |
| `log.py` | Werkzeug zum Eintragen, Abschließen, Suchen |
| `HAENDE.md` | Was nur du selbst erledigen kannst |
| `WIE-ICH-ARBEITE.md` | Wie Claude funktioniert und wie wir es klug einsetzen |

## Warum JSONL

Eine Zeile pro Auftrag ist kompakt, lässt sich mit `grep` oder `log.py suche` sofort finden, erzeugt in Git saubere
Diffs (jede Änderung ist eine Zeile) und ist für Claude direkt maschinenlesbar. Kein Datenbankserver, keine Abhängigkeit.

```json
{"id":"A-009","datum":"2026-09-28","von":"Elias","bereich":"front1","auftrag":"Website-Starter bauen","ausfuehrung":"Vorlage mit Stripe, Kontakt, CSP","ergebnis":"12 Tests grün, Lighthouse 100","status":"erledigt","ref":"PR #1"}
```

Status: `offen` · `laeuft` · `blockiert` · `erledigt`. Bereiche: `plan`, `setup`, `front1`–`front4`, `kunde-<slug>`, `wartung`.

```bash
python3 ops/log.py liste --offen     # was ist noch zu tun
python3 ops/log.py suche stripe      # alles zu Stripe
python3 ops/log.py zeige A-009       # ein Auftrag komplett
```
