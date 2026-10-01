---
name: wartung
description: Care run for all active customer sites - check, assessment, update PRs, monthly reports - via the wartungsoffizier agent. Use on "/wartung", on a maintenance issue or in the scheduled weekly routine.
---

# Maintenance

1. Deploy the agent `wartungsoffizier` (he runs `wartung/check.mjs` and writes the reports).
2. KRIT/HOCH findings: immediately branch `fix/<slug>-<thema>`, fix, `/pruefen`, PR, inform the user.
3. Deep check due according to the package (`wartung/PAKETE.md`): `/aufklaerung https://<domain>`.
4. Commit reports and log with `/sichern`.
