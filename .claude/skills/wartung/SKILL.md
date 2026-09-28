---
name: wartung
description: Betreuungslauf für alle aktiven Kundenseiten - Prüfung, Bewertung, Update-PRs, Monatsberichte - über den Agent wartungsoffizier. Nutzen bei "/wartung", bei einem Wartungs-Issue oder in der geplanten wöchentlichen Routine.
---

# Wartung

1. Agent `wartungsoffizier` ansetzen (er führt `wartung/check.mjs` aus und schreibt die Berichte).
2. Befunde KRIT/HOCH: sofort Branch `fix/<slug>-<thema>`, beheben, `/pruefen`, PR, Nutzer informieren.
3. Laut Paket (`wartung/PAKETE.md`) fällige Tiefenprüfung: `/aufklaerung https://<domain>`.
4. Berichte und Log mit `/sichern` committen.
