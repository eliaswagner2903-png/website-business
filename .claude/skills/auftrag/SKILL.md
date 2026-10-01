---
name: auftrag
description: Enter an order into the order log (ops/auftraege.jsonl), change or close its status, show open orders. Use for every new order from the user, after every piece of completed work (also by agents and other sessions) and on "/auftrag".
---

# Keeping the order log

Every order is one JSON line. One order = what the user (or another session) requested.

1. New order: `python3 ops/log.py neu "Auftrag in einem Satz" --bereich <front1|front2|front3|front4|kunde-<slug>|setup|plan>` → prints the ID (A-012).
2. Work by an agent or another session: its own entry with `--von "<Agent/Session>"`.
3. Completion: `python3 ops/log.py fertig A-012 "Ergebnis in einem Satz" --ausfuehrung "wie, knapp" --ref "PR #3"`.
4. Blocked: `python3 ops/log.py status A-012 blockiert "worauf gewartet wird"`.
5. Look-up: `liste --offen`, `suche stripe`, `zeige A-012`.
6. The log is saved with the next commit (`/sichern`).

Keep it short: one sentence per field. No secrets, no personal customer data in the log.
