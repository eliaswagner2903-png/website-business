# Seiten-Konfigurator auf der OQ-Seite – Ablauf (Entwurf)

> Stand 2026-09-29, Auftrag A-041. Idee von Elias (14:45 Uhr): Der Kunde stellt seine Seite Schritt für Schritt
> zusammen; daraus werden Seite **und** Preis gebaut. Ziel: **die Kundenvorgabe so genau wie möglich treffen, damit
> auch der Preis stimmt und angemessen ist.**
> **Preise, Punkte und Werte sind vorerst Platzhalter** (Elias: werden noch angepasst). Formeln: `PREISFORMELN.md`.

## Elias' Ablauf

1. **Stil** auswählen
2. **Farbe** auswählen
3. vielleicht: **Was für ein Business** hat die Person?
4. **Wie sicher** soll die Seite sein?
5. **Die Kriterien** (Funktionen, Umfang, Visuals …)
6. Anhand der Angaben wird **die Seite gebaut** (und der Preis errechnet)

## Was jeder Schritt für Bau und Preis bedeutet

| Schritt | Kunde wählt | Wirkung auf den Bau | Wirkung auf den Preis (Formel) |
|---|---|---|---|
| 1 Stil | z. B. hell & ruhig, laut & verspielt, dunkel & edel (die drei Musterseiten als Stilbeispiele) | Grundgerüst und Gestaltungsregeln | Design-Stufe: Vorlage 0 · eigenes Design 10 P · Markenauftritt 18 P |
| 2 Farbe | Farbwelt aus Vorschlägen oder eigene Markenfarben | Farbrollen in `marke.css` | keine, solange aus Vorschlägen; eigene Marke → Markenauftritt |
| 3 Business | Branche (Praxis, Restaurant, Handwerk, Friseur, Handel …) | **schlägt passende Bausteine vor** (Praxis → Termin, Restaurant → Speisekarte, Friseur → Buchung) | Branchenhebel in der Untergrenze C; Vorschläge sind abwählbar |
| 4 Sicherheit | Standard · erhöht · hoch | Standard ist immer dabei (HTTPS, strenge Header, kein Tracking) | erhöht 4 P / 2 Pflege-P · hoch 10 P / 5 Pflege-P (wirkt auch auf AM) |
| 5 Kriterien | Bausteine anklicken: Seiten, Formular, Buchung, Zahlung, Galerie, Video, 3D, Texte … | genau diese Bausteine werden gebaut | Punkte je Baustein × Gewicht (Konzept A), Gegenprobe B |
| 6 Bau | – | `/kundenseite-bauen` mit den Angaben als Briefing | Angebot mit jeder Zeile und ihrem Grund, Elias bestätigt |

## Sicherheitsstufen (Vorschlag)

| Stufe | Enthält | Für wen |
|---|---|---|
| **Standard** (immer, im Grundpaket) | HTTPS, strenge CSP und Header, keine Fremdskripte, kein Tracking, wöchentliche Prüfung | jede Seite |
| **Erhöht** | dazu Spam-Schutz an Formularen, Erreichbarkeits-Überwachung, Sicherungen | Seiten mit Formular oder Anfragen |
| **Hoch** | dazu Zahlung/Login-Absicherung, Webhook-Prüfung, monatliche Tiefenprüfung (Fernspäher) | Seiten mit Zahlung, Buchung, Kundendaten |

Hat ein Kunde Zahlung gewählt, schlägt der Konfigurator „hoch“ vor; unter „erhöht“ geht es dann nicht.

## Damit die Vorgabe genau getroffen wird

- **Vorschau statt Beschreibung:** Stil und Farbe zeigt der Konfigurator als echtes Bild der Musterseite in der gewählten Farbe.
- **Business-Frage vor den Kriterien:** Die Branche liefert sinnvolle Voreinstellungen; der Kunde muss weniger raten.
- **Jede Auswahl zeigt sofort ihre Punkte** („Online-Buchung +10 Punkte“), der Preis läuft mit.
- **Offene Angaben** (Texte, Fotos, Logo) werden ausdrücklich abgefragt; sie bestimmen die Kriterien „Inhalte“.
- **Zusammenfassung vor dem Absenden:** alle Bausteine, Punkte, BK-Einstufung (von Elias, nicht vom Kunden), Preisrahmen.
- **Elias bestätigt**; Änderungen danach laufen über den Änderungsaufschlag (7.1 in `PREISFORMELN.md`).

## Offen (entscheidet Elias)

- Business-Frage fest einbauen oder optional lassen (Vorschlag: fest, weil sie die Vorschläge liefert).
- Zeigt der Konfigurator dem Kunden einen genauen Preis oder einen Rahmen („1.800–2.200 €“)? Vorschlag: Rahmen, weil BK
  und Elias' Bestätigung erst danach kommen.
- Baut der Konfigurator sofort eine Vorschauseite oder erst nach dem Gespräch?
