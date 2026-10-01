---
name: sichern
description: Secure the work state - update the order log, check, commit, push, open or update a PR and propose a merge to the user. Use after every completed work step, on "/sichern", "Backup", "PR machen".
---

# Secure (backup = commit + push + PR)

A commit with a push is the backup on GitHub. The PR is the proposal to take the state into `main`.

1. Log: close the open orders of this step with `/auftrag` or set their status.
2. Check: at least `npm test` in the affected folder, for sites `/pruefen`.
3. Never work on `main`. Branch names: `aufbau/<thema>`, `kunde/<slug>`, `fix/<slug>-<thema>`, `wartung/<datum>`.
4. `git add -A && git commit` (German, one summary line, then bullet points), `git push -u origin <branch>`.
5. Open the PR (or update the existing one) with before/after and check results; CI "Prüfen" must be green.
6. Propose the merge to the user as soon as CI is green and nothing is open. The user does the merging.
