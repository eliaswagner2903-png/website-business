---
name: auftrag
description: Einen Auftrag ins Auftragslog (ops/auftraege.jsonl) eintragen, Status ändern oder abschließen, offene Aufträge zeigen. Nutzen bei jedem neuen Auftrag des Nutzers, nach jeder erledigten Arbeit (auch von Agents und anderen Sessions) und bei "/auftrag".
---

# Auftragslog führen

Jeder Auftrag ist eine Zeile JSON. Ein Auftrag = was der Nutzer (oder eine andere Session) verlangt hat.

1. Neuer Auftrag: `python3 ops/log.py neu "Auftrag in einem Satz" --bereich <front1|front2|front3|front4|kunde-<slug>|setup|plan>` → gibt die ID aus (A-012).
2. Arbeit eines Agents oder einer anderen Session: eigener Eintrag mit `--von "<Agent/Session>"`.
3. Abschluss: `python3 ops/log.py fertig A-012 "Ergebnis in einem Satz" --ausfuehrung "wie, knapp" --ref "PR #3"`.
4. Blockiert: `python3 ops/log.py status A-012 blockiert "worauf gewartet wird"`.
5. Nachschlagen: `liste --offen`, `suche stripe`, `zeige A-012`.
6. Das Log wird mit dem nächsten Commit gesichert (`/sichern`).

Kurz halten: ein Satz pro Feld. Keine Geheimnisse, keine personenbezogenen Kundendaten ins Log.
