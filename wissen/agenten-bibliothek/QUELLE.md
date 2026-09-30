# Agenten-Bibliothek: agency-agents

**Quelle:** https://github.com/msitarzewski/agency-agents (Michael Sitarzewski und Mitwirkende)
**Stand:** Commit `765be42` vom 29.09.2026, übernommen am 30.09.2026 (A-057)
**Lizenz:** MIT, (c) 2025 AgentLand Contributors, siehe `agency-agents/LICENSE`. Nutzung, Änderung und Weitergabe
erlaubt, solange der Lizenzhinweis erhalten bleibt.

## Was hier liegt

`agency-agents/` ist ein **unveränderter Katalog** von 279 Rollenbeschreibungen (Englisch) in 19 Bereichen, dazu
Beispiel-Abläufe (`examples/`) und Strategie-Playbooks (`strategy/`). Nicht übernommen: Installations- und
Konvertierungsskripte, Anbindungen an andere Werkzeuge (Cursor, Copilot usw.).

Der Katalog ist **nicht aktiv**. Jeder aktive Agent kostet in jeder Sitzung Platz im Kontext; 279 auf einmal würden
den Stab unübersichtlich machen und ständig falsche Agents anziehen. Aktiv wird nur, was geprüft und gebraucht wird.

## Aktiv im Stab (`.claude/agents/agency-*.md`)

| Agent | Werkzeuge | Wofür im Website-Business |
|---|---|---|
| `agency-brand-guardian` | bauen | Markenkern und Tonalität eines Kunden festhalten |
| `agency-ai-citation-strategist` | bauen | GEO/AEO: warum KI-Assistenten Wettbewerber nennen und den Kunden nicht |
| `agency-proposal-strategist` | bauen | Angebote und Verkaufsmappen schärfen (für die spätere Verkaufsphase) |

Jeder aktive Agent bekommt beim Übernehmen einen deutschen **Einsatzrahmen**: Antworten auf Deutsch, `CLAUDE.md` und
`wissen/fachgebiete/` haben Vorrang, Prüfwerkzeuge des Repos statt erfundener Skripte, keine Versprechen zu Rankings
oder KI-Empfehlungen, nichts Kostenpflichtiges und nichts nach außen. Modell: sonnet.

## Bewusst nicht aktiviert (Überschneidung oder unpassend)

- `design-ux-architect`, `design-ui-designer`: decken `frontend` und `uffz-schnoerkel` ab (am 30.09. wieder
  entfernt, um Kontext zu sparen; bei Bedarf mit dem Werkzeug unten zurückholen).
- `marketing-seo-specialist`: deckt `wissen/fachgebiete/` mit `/bestellung` und `hptgefr-duden` ab.
- `testing-accessibility-auditor`, `testing-reality-checker`: decken `/pruefen`, `/meisterpruefung`, `tester` und
  `reviewer` ab.
- `engineering-frontend-developer`, `engineering-backend-architect`, `engineering-senior-developer`,
  `engineering-code-reviewer`: decken sich mit den globalen Agents `frontend`, `backend`, `reviewer`. Der
  Frontend-Developer enthält außerdem einen fachfremden Abschnitt (Editor-Erweiterungen).
- `security/*`: Sicherheit prüft `security-auditor` (defensiv, auf die Vorlage zugeschnitten).
- `testing-performance-benchmarker`, `testing-evidence-collector`: erledigen `werkzeuge/lighthouse.sh`, `pruefen.mjs`
  und `/bildfolge` bereits mit festen Grenzwerten.
- `design-ui-finish-gate-reviewer`: verweist auf einen fremden Bezahldienst (uizze.com).
- China-, Spiele-, GIS-, Gesundheits-, Finanz- und Social-Media-Rollen: für das Geschäft derzeit ohne Bezug.

## Weitere Agents übernehmen

```bash
python3 werkzeuge/agent-aktivieren.py --liste            # ganzer Katalog, ✓ = aktiv
python3 werkzeuge/agent-aktivieren.py --liste marketing  # ein Bereich
python3 werkzeuge/agent-aktivieren.py design/design-ux-researcher.md             # mit Schreibrechten
python3 werkzeuge/agent-aktivieren.py testing/testing-api-tester.md --nur-lesen  # nur lesend (Prüfer)
```

Danach Tabelle oben und den Stab in `CLAUDE.md` ergänzen. Vorher die Rolle lesen: Qualität schwankt, manche Rollen
nennen Skripte, die es nur im Original gibt.

## Katalog aktualisieren

Neuen Stand von GitHub holen, die Bereichsordner in `agency-agents/` ersetzen, Commit und Datum oben anpassen und die
aktiven Agents mit `agent-aktivieren.py` neu erzeugen. Den Diff der aktiven Rollen vor dem Übernehmen lesen.
