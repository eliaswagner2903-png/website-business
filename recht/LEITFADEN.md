# Leitfaden: Gewerbe, Recht, Steuern, Buchhaltung (Deutschland)

Stand 28.09.2026. Orientierung, keine Rechts- oder Steuerberatung. Vor dem Start einmal mit einem Steuerberater
durchgehen; Punkte mit ⚖ unbedingt dort bestätigen lassen.

## 1. Anmeldung – in dieser Reihenfolge

| Schritt | Wo | Kosten | Hinweis |
|---|---|---|---|
| 1. Einordnung klären | selbst / Steuerberater | – | Siehe unten „Gewerbe oder freier Beruf“ |
| 2. Gewerbeanmeldung | Gewerbeamt der Stadt, oft online | ca. 15–65 € | Tätigkeit z. B.: „Erstellung, Hosting und Wartung von Websites, IT-Dienstleistungen“ |
| 3. Fragebogen zur steuerlichen Erfassung | ELSTER (online, Pflicht) | – | Innerhalb eines Monats nach Beginn. Hier wählst du die Kleinunternehmerregelung (ja/nein) und schätzt Umsatz und Gewinn |
| 4. Steuernummer abwarten | Post vom Finanzamt | – | Erst dann Rechnungen mit Steuernummer schreiben |
| 5. USt-IdNr. beantragen | Bundeszentralamt für Steuern | – | Nötig für Leistungen von EU-Anbietern (z. B. Stripe aus Irland) ⚖ |
| 6. IHK | automatisch | anfangs oft beitragsfrei | Existenzgründer sind bei kleinem Gewinn meist in den ersten Jahren befreit |
| 7. Geschäftskonto | Bank | 0–10 €/Monat | Privat und Geschäft strikt trennen |
| 8. Versicherungen | Makler / Vergleich | ca. 15–40 €/Monat | IT-Haftpflicht mit Vermögensschaden, bei Zahlungsseiten Cyber-Baustein prüfen |
| 9. Krankenversicherung | Kasse | – | Als Selbstständiger freiwillig gesetzlich oder privat; Nebenerwerb anders ⚖ |

### Gewerbe oder freier Beruf?

Reines, künstlerisch geprägtes Webdesign kann freiberuflich sein. Sobald programmiert, gehostet und gewartet wird,
sehen Finanzämter fast immer ein **Gewerbe**. Mischt man beides, kann der gewerbliche Teil den freiberuflichen
„infizieren“ (Abfärberegel). Für dieses Geschäftsmodell (Bau + Hosting + Abo) ist die Gewerbeanmeldung der sichere Weg.

Gewerbesteuer fällt für Einzelunternehmer erst über 24.500 € Gewinn im Jahr an und wird zum großen Teil auf die
Einkommensteuer angerechnet.

## 2. Umsatzsteuer

- **Kleinunternehmerregelung (§ 19 UStG):** möglich, wenn der Umsatz im Vorjahr höchstens 25.000 € betrug und im
  laufenden Jahr 100.000 € nicht übersteigt. Wird die 100.000 € im laufenden Jahr überschritten, gilt ab diesem Umsatz
  sofort die normale Umsatzsteuer.
  Vorteil: keine Umsatzsteuer auf Rechnungen, weniger Aufwand. Nachteil: keine Vorsteuer aus Einkäufen (Laptop, Software).
  Rechnungshinweis: „Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.“
- **Leistungen ausländischer Anbieter** (Stripe-Gebühren aus Irland, Software-Abos aus den USA): Hier schuldest du
  unter Umständen selbst die Umsatzsteuer (Reverse Charge, § 13b UStG), **auch als Kleinunternehmer**. ⚖
- **Ohne Kleinunternehmerregelung:** 19 % auf Rechnungen, Umsatzsteuer-Voranmeldungen über ELSTER
  (monatlich oder vierteljährlich, legt das Finanzamt fest), Vorsteuerabzug möglich.
- **Monatsabo über Stripe:** Stripe Billing kann Rechnungen erzeugen. Rechnungsangaben prüfen (Name, Anschrift,
  Steuernummer, Rechnungsnummer, Leistungszeitraum, § 19-Hinweis).

### E-Rechnung

- Seit 01.01.2025 muss jedes Unternehmen E-Rechnungen **empfangen** können (ein E-Mail-Postfach reicht).
- Ausstellen wird für B2B-Rechnungen ab 2027 (Vorjahresumsatz über 800.000 €) bzw. ab 2028 für alle Pflicht.
  **Kleinunternehmer sind vom Ausstellen ausgenommen.** Trotzdem ein Programm wählen, das XRechnung/ZUGFeRD kann.

## 3. Buchhaltung

- **Einnahmen-Überschuss-Rechnung (EÜR)** statt Bilanz, solange kein Eintrag im Handelsregister nötig ist.
- **GoBD:** Belege vollständig, unveränderbar, zeitnah erfassen. Aufbewahrung: Rechnungen und Buchungsbelege
  8 Jahre, Bücher und Jahresabschlüsse 10 Jahre.
- Programm mit Bank- und Stripe-Anbindung, E-Rechnung und ELSTER-Schnittstelle, z. B. Lexware Office, sevDesk.
- Stripe zahlt gesammelt aus und zieht Gebühren ab: Einnahmen **brutto** buchen, Gebühren als Ausgabe.
- Rücklagen: 25–35 % jedes Gewinns für Einkommensteuer zurücklegen, bis die erste Veranlagung da ist.
- Jährlich: Einkommensteuererklärung mit Anlage EÜR und Anlage G, Gewerbesteuererklärung.

## 4. Verträge mit Kunden

| Vertrag | Inhalt | Warum |
|---|---|---|
| **Werkvertrag Website** | Leistungsumfang, Korrekturschleifen, Abnahme, Preis, Zahlungsplan (z. B. 50 % Start, 50 % Abnahme), Nutzungsrechte | Klarheit, wann fertig ist und was es kostet |
| **Betreuungsvertrag (Abo)** | Paket aus `wartung/PAKETE.md`, Antwortzeiten, Laufzeit, Kündigung, Preisanpassung, was nicht enthalten ist | Monatliche Einnahmen rechtssicher |
| **AV-Vertrag (Art. 28 DSGVO)** | Du verarbeitest als Auftragsverarbeiter Daten der Website-Besucher (Hosting, Formulare) | Pflicht, sobald du hostest |
| **AGB** | Haftung, Mitwirkungspflichten (Kunde liefert Texte, Fotos, Fakten), Zahlungsverzug | Einmal sauber, dann für alle |

Vorlagen: Anwalt oder Muster-Pakete (IT-Recht Kanzlei, eRecht24 Premium). Nicht aus dem Netz zusammenkopieren.

**Nutzungsrechte an KI-Bildern und -Videos:** Die Nutzungsbedingungen von Higgsfield (und der jeweiligen Modelle)
bestimmen, was du dem Kunden einräumen kannst. Im Vertrag festhalten, dass Visuals KI-generiert sind. ⚖

**Domain:** immer auf den Kunden registrieren. Bei Kündigung Übergabe der Dateien und der Domain regeln.

## 5. Rechtspflichten der Kundenseiten

- **Impressum** nach § 5 DDG, **Datenschutzerklärung** nach DSGVO: aus einem Generator, nie selbst formulieren.
  Genannt werden müssen alle Dienste: Cloudflare, Stripe, Cal.com, Resend, ggf. Turnstile und Higgsfield-Medien vom eigenen Server.
- **Cookies/Tracking:** Die Vorlage setzt keine Cookies und trackt nicht, deshalb ist kein Cookie-Banner nötig (§ 25 TDDDG).
  Wer Analytics will: datensparsame Lösung ohne Cookies wählen oder Einwilligung einholen.
- **Onlineshop / Zahlung an Verbraucher:** Widerrufsbelehrung, Bestell-Button „zahlungspflichtig bestellen“
  (§ 312j BGB), Endpreise inkl. MwSt. (Preisangabenverordnung), AGB des Kunden.
- **Barrierefreiheit (BFSG, seit 28.06.2025):** gilt für Online-Shops und Buchungsdienste an Verbraucher. Kleinstunternehmen
  (unter 10 Beschäftigte und höchstens 2 Mio. € Umsatz) sind bei Dienstleistungen ausgenommen. Die Vorlage erfüllt
  WCAG AA ohnehin, das ist ein Verkaufsargument.

## 6. Checkliste vor dem ersten zahlenden Kunden

- [ ] Gewerbe angemeldet, Steuernummer da, Kleinunternehmer-Entscheidung getroffen
- [ ] Geschäftskonto und Buchhaltungsprogramm eingerichtet
- [ ] IT-Haftpflicht abgeschlossen
- [ ] Vertragsvorlagen (Werk, Betreuung, AV, AGB) vorhanden
- [ ] Eigene Website mit Impressum und Datenschutz online (Referenz!)
- [ ] Stripe-Konto verifiziert, Test-Checkout erfolgreich
- [ ] Preisliste der Pakete festgelegt

## Quellen

- Existenzgründungsportal des BMWK: Webdesigner freiberuflich oder gewerblich
- eRecht24: Webdesigner als Freiberufler
- § 19 UStG in der Fassung ab 01.01.2025 (25.000 € / 100.000 €)
- BMF-Schreiben zur E-Rechnung (Übergangsfristen 2025–2028)
- Barrierefreiheitsstärkungsgesetz (BFSG)
