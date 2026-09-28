---
name: sicherheit
description: Sicherheitsprüfung einer Kundenseite vor Launch oder nach Änderungen an functions/, _headers oder Abhängigkeiten - setzt den Agent security-auditor an und fasst zusammen. Nutzen bei "/sicherheit", vor jedem Go-live, bei Dependabot-PRs.
---

# Sicherheit

1. Agent `security-auditor` mit dem Kundenordner ansetzen.
2. Bei Diffs mit Logik zusätzlich den eingebauten Befehl `/security-review` laufen lassen.
3. Live-Seite (nur eigene, freigegebene Domains): `NODE_USE_ENV_PROXY=1 node wartung/check.mjs --nur <slug>`.
4. Mängel KRIT/HOCH vor dem Merge beheben, Rest als Auftrag loggen.
