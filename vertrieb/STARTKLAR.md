# Startklar: kürzester Weg bis zur ersten Rechnung

> Recherche 2026-09-30 (A-056), Primärquellen wo möglich. Keine Rechtsberatung; Unsicheres ist markiert.
> Ergänzt `recht/LEITFADEN.md` und `ops/HAENDE.md` um die Frage: **Was ist vor der ersten Rechnung wirklich Pflicht?**

## Pflicht vor der ersten Rechnung (nur 3 Schritte)

| # | Schritt | Kosten | Dauer | Quelle |
|---|---|---|---|---|
| 1 | **Gewerbe anmelden** bei der Wohnsitzgemeinde (§ 14 GewO: mit Beginn). Online über Service-BW (Servicekonto BW oder BundID); Eislingen hat ein Online-Formular (unterschreiben, per Post oder Scan-Mail). | laut Gebührensatzung; Göppingen 43 € (**unbestätigt**) | Eislingen: „innerhalb von drei Tagen“ | gesetze-im-internet.de/gewo/__14.html · service-bw.de/zufi/leistungen/496 · eislingen.de (Dienstleistungen A–Z, Gewerbeanmeldung) |
| 2 | **Fragebogen zur steuerlichen Erfassung** über ELSTER, dabei Kleinunternehmerregelung wählen. Frist 1 Monat nach Beginn (§ 138 AO). | 0 € | ELSTER-Konto: Aktivierungsbrief rund 1–2 Wochen (**unbestätigt**) | gesetze-im-internet.de/ao_1977/__138.html |
| 3 | **Steuernummer abwarten** (Finanzamt Göppingen). Pflichtangabe auf der Rechnung (§ 34a Nr. 2 UStDV). | 0 € | einige Wochen (**unbestätigt**) – **der kritische Pfad** | gesetze-im-internet.de/ustdv_1980/__34a.html |

**Deshalb:** Schritt 1 und 2 sofort, sobald der erste Kunde in Sicht ist, nicht erst nach seinem „ja“.

## Keine Pflicht (empfohlen)

| Was | Einordnung | Quelle |
|---|---|---|
| Geschäftskonto | keine gesetzliche Vorschrift, empfohlen | existenzgruendungsportal.de (Kleinunternehmer Geschäftskonto) |
| Stripe / Zahlungsdienst | nicht nötig, **Überweisung reicht** für den Pilot | – |
| Vermögensschaden-/Betriebshaftpflicht | nicht Pflicht, IHK empfiehlt sie | ihk.de/schwaben (Einzelunternehmen) |

## Pflicht, sobald gehostet wird

- **AV-Vertrag (Art. 28 DSGVO)** mit jedem Kunden, wenn OQ hostet oder mit Zugriff auf personenbezogene Daten wartet;
  der eigene Hoster (Cloudflare) ist dann Unterauftragsverarbeiter (dessen DPA akzeptieren). Quelle: DSK-Kurzpapier Nr. 13
  (datenschutzkonferenz-online.de/media/kp/dsk_kpnr_13.pdf; Anhang nicht wörtlich geprüft).

## Kleinunternehmer (§ 19 UStG, Fassung ab 01.01.2025)

- Steuerfrei, wenn Vorjahresumsatz ≤ 25.000 € und laufendes Jahr ≤ 100.000 €. **Im Gründungsjahr: höchstens 25.000 €**;
  schon der Umsatz, der die Grenze überschreitet, ist regulär zu versteuern (finanzamt.nrw.de, Kleinunternehmer).
- Keine Umsatzsteuer-Jahreserklärung, kein Vorsteuerabzug. Verzicht möglich, bindet 5 Jahre (§ 19 Abs. 3).
- **E-Rechnung:** Empfangen muss jeder seit 01.01.2025 können (E-Mail-Postfach genügt). Kleinunternehmer dürfen
  immer PDF oder Papier ausstellen (§ 34a S. 4 UStDV). PDF per E-Mail braucht die Zustimmung des Empfängers (§ 14 Abs. 1 S. 5 UStG).

## Rechnungsangaben als Kleinunternehmer (§ 34a UStDV)

1. Name und Anschrift von OQ/Elias und vom Kunden
2. Steuernummer (oder USt-IdNr. bzw. Kleinunternehmer-IdNr.)
3. Ausstellungsdatum
4. Umfang und Art der Leistung
5. Entgelt in einer Summe mit Hinweis auf die Steuerbefreiung für Kleinunternehmer
6. Üblich, aber nach § 34a nicht verlangt: Rechnungsnummer, Leistungsdatum

Frist: bei Leistungen an Unternehmen innerhalb von 6 Monaten (§ 14 Abs. 2 UStG).

## Vertragsmuster (nicht selbst formulieren)

- **Kostenlos:** IHK Frankfurt „Software-Erstellungsvertrag“ und „Software-Pflegevertrag“
  (frankfurt-main.ihk.de/recht/mustervertraege/uebersicht), IHK München „Softwareerstellungsvertrag“ – zum Anpassen,
  besser vom Steuerberater/Anwalt kurz prüfen lassen.
- **Kostenpflichtig:** z. B. Smartlaw „Webdesign-Vertrag“ (Preis nicht geprüft).
- Ein eigenes IHK-Muster „Webdesign“ wurde nicht gefunden.

## Nebenberuflich

- Arbeitsvertrag auf Nebentätigkeitsklausel prüfen; bei Konkurrenz zum Arbeitgeber schriftliche Zustimmung.
- Krankenkasse informieren (sie prüft haupt- oder nebenberuflich).
- Gewinn in die Einkommensteuererklärung (EÜR, Anlage G).

## Offen

Gebühr Eislingen und Dauer bis zur Steuernummer nicht amtlich belegt; IHK-Beitragsbefreiung für Kleingewerbe nicht
geprüft; Einordnung Gewerbe statt freier Beruf ist die sichere Annahme (siehe `recht/LEITFADEN.md`).
