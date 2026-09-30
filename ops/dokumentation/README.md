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

Neue Berichte (z. B. Abschlussberichte, Kundenberichte) bekommen einen dieser Buchstaben, damit Elias sie im Ordner
abheften kann. Ein neuer Stand ersetzt nur die Register, die sich geändert haben.

## Dateien

- `STAND-<datum>.html`: Quelle; jeder Abschnitt trägt `data-reg="A"` usw.
- `STAND-<datum>.pdf`: Gesamtfassung aller Register.
- `register/<Buchstabe>-<Titel>.pdf`: jedes Register einzeln, mit eigenen Seitenzahlen (C-1, C-2 …) und Daumenleiste am rechten Rand.

## Neu bauen

```bash
node ops/dokumentation/baue-pdf.cjs STAND-2026-09-30
```

Braucht Playwright (global) und `pymupdf` für Python. Danach alle Seiten als Bild ansehen und erst dann ausliefern.
