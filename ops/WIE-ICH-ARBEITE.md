# Wie Claude arbeitet – und wie wir es klug einsetzen

## Die Bausteine

| Baustein | Was es ist | Wofür wir es nutzen |
|---|---|---|
| **Session** | Eine Unterhaltung mit eigenem Arbeitsgedächtnis (Kontext) in einem frischen Cloud-Container. Endet die Session, ist der Container weg. | Deshalb wird alles committet und gepusht: GitHub ist das Langzeitgedächtnis für Code. |
| **Kontext** | Was ich gerade „im Kopf“ habe. Groß, aber endlich; sehr lange Sessions werden zusammengefasst und verlieren Details. | Große Aufgaben in Threads aufteilen, Wichtiges in Dateien schreiben statt es nur zu sagen. |
| **CLAUDE.md** | Datei im Repo, die ich bei jedem Start automatisch lese. | Regeln, Persona, Qualitätsstandard – gilt für jede Session gleich. |
| **Projekt-Memory** | Kleine Notizen, die alle Claudes in diesem Projekt lesen. | Entscheidungen und Vorlieben, die sonst neu erfragt werden müssten. |
| **Auftragslog** | `ops/auftraege.jsonl` | Was wann von wem verlangt und wie es erledigt wurde. |
| **Skills** (`/pruefen`) | Gespeicherte Arbeitsanleitungen, per Schrägstrich-Befehl oder automatisch passend geladen. | Wiederkehrende Abläufe immer gleich gut erledigen. |
| **Agents** (Subagents) | Helfer mit eigenem Kontext, eigenem Werkzeugsatz und wählbarem Modell. Sie melden nur das Ergebnis zurück. | Parallele Arbeit (5 Späher gleichzeitig) und Entlastung meines Kontexts. Kosten Energie, also gezielt. |
| **Hooks** | Befehle, die das System (nicht ich) automatisch ausführt, z. B. nach jeder Dateiänderung. | Fehler sofort abfangen: HTML-, Kopf- und Sicherheitsprüfung nach jeder Bearbeitung. Ich kann sie nicht „vergessen“. |
| **MCP / Connectors** | Anschlüsse an fremde Dienste (Higgsfield, Stripe, Cloudflare, GitHub, Browser). | Ich bediene die Dienste direkt – Zugang gibst du per Anmeldung, nie per Passwort im Chat. |
| **Routinen** | Geplante Sessions, die zu festen Zeiten starten. | Wöchentliche Wartung ohne dein Zutun. |
| **Workflows** | Viele Agents nach festem Plan, z. B. Review in mehreren Dimensionen mit Gegenprüfung. | Nur für große Aufgaben, weil teuer. Sag „nutze einen Workflow“, wenn du das willst. |
| **Artifacts** | Private Webseiten auf claude.ai (wie die Lagekarte). | Vorschauen, Pläne, Berichte zum Anschauen und Teilen. |
| **Remote Control** | Eine Session auf deinem eigenen Gerät, in einem Ordner von dir. | Wenn etwas lokal laufen muss (deine Konten, deine Programme). |
| **Pull Request** | Vorschlag, einen Branch in `main` zu übernehmen, mit automatischer Prüfung (CI). | Jeder PR ist gleichzeitig Backup und Kontrollpunkt. Du mergst, ich bereite vor. |

## Backup, Branch, PR – der Unterschied

- **Commit + Push** = Backup. Der Stand liegt sicher auf GitHub, auch wenn die Session endet.
- **Branch** = eigene Arbeitsspur. `main` bleibt immer lauffähig; neue Arbeit passiert daneben.
- **Pull Request** = „Ich schlage vor, das in `main` zu übernehmen.“ GitHub prüft automatisch (Workflow „Prüfen“),
  du siehst die Änderungen und klickst auf Merge. Erst dann geht eine Kundenseite live.

## Was ich nicht kann (und wie wir es lösen)

- Konten anlegen, Verträge schließen, Ausweise hochladen, beim Amt anmelden → `ops/HAENDE.md`.
- In dieser Umgebung keine neuen GitHub-Repos anlegen → du legst das leere Repo an, ich fülle es.
- Geheimnisse sehen, die du mir nicht gibst → gut so. Schlüssel gehören in Cloudflare/GitHub-Secrets.
- Mich an frühere Sessions erinnern, wenn nichts aufgeschrieben wurde → darum Log, Memory, CLAUDE.md.

## Energie sparen

Große Modelle für Planung, Architektur und schwierige Fehler. Späher und Routine auf kleineren Modellen
(im Agent festgelegt). Agents nur, wenn sie parallel arbeiten oder viel lesen müssen. Erst prüfen, dann pushen:
ein sauberer Push spart drei Korrekturrunden.
