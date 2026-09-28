---
name: sichern
description: Arbeitsstand sichern - Auftragslog aktualisieren, prüfen, committen, pushen, PR öffnen oder aktualisieren und dem Nutzer einen Merge vorschlagen. Nutzen nach jedem abgeschlossenen Arbeitsschritt, bei "/sichern", "Backup", "PR machen".
---

# Sichern (Backup = Commit + Push + PR)

Ein Commit mit Push ist das Backup auf GitHub. Der PR ist der Vorschlag, den Stand in `main` zu übernehmen.

1. Log: offene Aufträge dieses Schritts mit `/auftrag` abschließen oder Status setzen.
2. Prüfen: mindestens `npm test` im betroffenen Ordner, bei Seiten `/pruefen`.
3. Nie auf `main` arbeiten. Branch-Namen: `aufbau/<thema>`, `kunde/<slug>`, `fix/<slug>-<thema>`, `wartung/<datum>`.
4. `git add -A && git commit` (Deutsch, eine Zeile Zusammenfassung, dann Stichpunkte), `git push -u origin <branch>`.
5. PR öffnen (oder bestehenden aktualisieren) mit Vorher/Nachher und Prüfergebnissen; CI „Prüfen“ muss grün sein.
6. Dem Nutzer den Merge vorschlagen, sobald CI grün ist und nichts offen ist. Mergen tut der Nutzer.
