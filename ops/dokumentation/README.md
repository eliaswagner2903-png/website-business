# Dokumentation für Elias (Lagebericht zum Ausdrucken)

Druckfertige Berichte ohne Code, in Schwarz-Weiß, für Leser ohne Vorwissen. Sie decken **alle** Vorhaben ab, also
auch die Ablagen außerhalb dieses Repos (urfa, Brüder-Wettbewerb, claude-setup, Fernspäherkommando), und nicht nur
das Projekt „Website Business“.

## Register (fest, für den Ordner)

| Register | Titel | Inhalt |
|---|---|---|
| 0 | Deckblatt | Deckblatt, Registerverzeichnis |
| A | Überblick | Kurzfassung, Idee, Beteiligte, Wörterbuch |
| B | Chronik | Zeitleiste, alle Sitzungen, Zahlen |
| C | Projekte | die Vorhaben und alle gebauten Seiten |
| D | Arbeitsweise und Qualität | Ablauf, Bauzeiten, Qualitätssystem, Proben mit Jury |
| E | Wissen und Lehren | Lehren, wo das Wissen liegt |
| F | Geld | Preismodell, Preisbeispiele, Verbrauch |
| G | Plan und Entscheidungen | Gesamtplan mit Position, offene Entscheidungen, nächste Schritte |
| H | Anhang | Ablageorte, Vorschau-Links, Quellen |
| L | Einleger | Registerstreifen und Rückenschild zum Ausschneiden |

## Nachträge: der Ordner wächst

Elias will die ganze Entwicklung sehen (30.09.2026). Deshalb wird **nichts ersetzt**: Der Grundbestand vom 30.09.
bleibt, jeder neue Stand kommt als datierter Nachtrag (N001, N002 …) hinter das passende Register. Ablauf im Skill
`/nachtrag`; eine tägliche Routine sammelt abends, was neu ist. Einzige Ausnahme: das Nachtragsverzeichnis
(`register/0b-Nachtragsverzeichnis.pdf`) wird bei jedem Nachtrag neu gedruckt und ausgetauscht.

## Dateien

- `STAND-<datum>.html`: Quelle; jeder Abschnitt trägt `data-reg="A"` usw.
- `STAND-<datum>.pdf`: Gesamtfassung aller Register.
- `register/<Buchstabe>-<Titel>.pdf`: jedes Register einzeln, mit eigenen Seitenzahlen (C-1, C-2 …) und Daumenleiste am rechten Rand.
- `druck.css`: gemeinsame Druckgestaltung für Grundbestand und Nachträge.
- `nachtraege/verzeichnis.jsonl`: ein Eintrag je Nachtrag (N000 = Grundbestand); daraus entsteht das Nachtragsverzeichnis.
- `nachtraege/N###-<datum>.html` → `nachtraege/pdf/<Buchstabe>-N###.pdf`: die Nachtragsblätter je Register.
- `ORDNER-KOMPLETT.pdf`: alles in Ordner-Reihenfolge (je Register Grundbestand, dahinter seine Nachträge).

## Neu bauen

```bash
node ops/dokumentation/baue-pdf.cjs
```

Braucht Playwright (global) und `pymupdf` für Python. Danach alle Seiten als Bild ansehen und erst dann ausliefern.
