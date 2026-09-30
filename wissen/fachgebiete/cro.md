# CRO und UX (Anfragen, Nutzerführung, Vertrauen, Reputation)

> Schlüssel `cro` · Quellen: Q-F01–Q-F07, Q-G15, Q-G32, Q-R08, Q-M05, Q-P01 · Stand 2026-09-29

## 1 Ziel
Aus Besuchern werden Anrufe, Reservierungen, Terminbuchungen und Anfragen – ohne Tricks, durch klare Führung, vollständige Angaben und Vertrauen.

## 2 Warum relevant
Eine gut gefundene Seite ohne klaren nächsten Schritt bringt dem Kunden nichts. Belegt ist: kurze, klar beschriftete Formulare sind deutlich
erfolgreicher (NN/g: 78 % vs. 42 % Erfolg beim ersten Versuch, Q-F01); Kontaktseiten brauchen Telefon, Adresse, E-Mail (Q-F02); Vertrauen entsteht
durch Designqualität, offene Angaben, aktuellen Inhalt und Verbindung zu externen Belegen (Q-F03, Q-F06).

## 3 Faktoren
Ein Hauptziel je Seite · sichtbare Handlungsaufforderung im ersten Bildschirm · vollständige Kontaktwege · kurze Formulare · echte Belege
(Fotos, Meistertitel, Jahre, Referenzen) · offene Angaben (Preise/Preisrahmen, Ablauf, Gebiet) · lesbare Gliederung (Q-F04).

## 4 Beim Programmieren
- Hauptknopf mit Verb („Tisch reservieren“, „Termin buchen“, „Jetzt anrufen“), Kontrast zur Umgebung (Q-F07), im ersten Bildschirm auf 390 und 1440 px.
- Feste Schnellleiste auf dem Handy (Anrufen, Route, Anfrage) – bereits Pflicht laut `CLAUDE.md`.
- Formular: ≤ 6 sichtbare Felder, eine Spalte, sichtbare Labels (kein Placeholder als Label), `autocomplete`, Pflichtfelder markiert,
  Fehlermeldung als Text am Feld, Antwortzeit genannt, Danke-Seite mit nächstem Schritt.
- `tel:+49…` (Q-M05), `mailto:` nur zusätzlich zum Formular.

## 5 Inhalte und Strukturen
Hero: wer, was, wo, nächster Schritt · Leistungen mit konkretem Nutzen · Belege (Team, Arbeiten, Zertifikate) · Stimmen/Bewertungen nur echt und
mit Quelle · Kontakt mit allen Wegen und Zeiten · jede Seite endet mit dem nächsten Schritt.

## 6 Vermeiden
Mehrere gleich starke Hauptknöpfe, Pop-ups/Interstitials, Pflicht-Telefonnummer im Formular ohne Grund, erfundene Bewertungen oder Zahlen,
eingebettete Bewertungs-Widgets von Dritten (fremde Skripte), Farb-Mythen („Rot konvertiert am besten“, Q-F07), F-Muster als Layoutziel (Q-F04).

## 7 Automatisch umsetzbar
Schnellleiste, Formular-Baustein aus der Vorlage, Danke-Seite, CTA-Muster im Generator.

## 8 Automatisch prüfbar
Handlungsaufforderung im ersten Bildschirm (Browser, 390 und 1440 px), Kontaktweg auf jeder Seite, Felderzahl, Labels.

## 9 Manuell prüfen
Ist das Hauptziel richtig gewählt? Sind Belege echt und freigegeben? Wirkt die Seite vertrauenswürdig (W1, W7 im Meisterstandard)?

## 10 Wie Claude die Umsetzung belegt
`QUALITAET.md` (cta-sichtbar mit gefundenem Knopftext); Zustands-Screenshots aus `/meisterpruefung` (Fokus, Fehler, Danke) als Pfade in `abnahme.md`.

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| CRO-01 | Ein Hauptziel je Seite festlegen; Handlungsaufforderung im ersten Bildschirm auf Handy (390 px) und Computer (1440 px) | K | PB | AUTO | cta-sichtbar | F Q-F02, P Q-P01 | stabil |
| CRO-02 | Alle Kontaktwege: Telefon (`tel:+49`), E-Mail, Adresse, Formular bzw. Buchung; feste Schnellleiste auf dem Handy; Kontaktweg auf jeder Seite | K | B | SEMI-AUTO | kontakt-jede-seite | F Q-F02, O Q-M05, P Q-P03 | stabil |
| CRO-03 | Formulare: ≤ 6 sichtbare Felder, eine Spalte, sichtbare Labels, Pflichtfelder markiert, Fehler als Text, Antwortzeit genannt | K | B | SEMI-AUTO | formular-felder, formular-label | F Q-F01, F Q-F02, F Q-F05 | stabil |
| CRO-04 | Vertrauensbelege nur echt und freigegeben: Fotos von Team/Räumen/Arbeiten, Meistertitel, Zertifikate, Jahre, Referenzen | K | P | MANUAL | | F Q-F03, F Q-F06, O Q-G15 | stabil |
| CRO-05 | Offene Angaben: Preise oder Preisrahmen (mit Zustimmung des Kunden), Ablauf, Einzugsgebiet, Zeiten | E | P | MANUAL | | F Q-F03 | stabil |
| CRO-06 | Bewertungen/Stimmen nur echt, mit Quelle und Hinweis, ob und wie die Echtheit geprüft wird (§ 5b UWG); Link zum Profil statt Fremd-Widget | E | PB | MANUAL | | G Q-R08, O Q-G32 | stabil |
| CRO-07 | Navigation kurz und eindeutig benannt (Faustregel ≤ 7 Hauptpunkte); jede Seite endet mit dem nächsten Schritt | E | P | MANUAL | | F Q-F03, P Q-P01 | stabil |
| CRO-08 | Lesbar gegliedert: Kerninfo zuerst, kurze Absätze, Zwischenüberschriften, Listen | E | P | MANUAL | | F Q-F04 | stabil |
| CRO-09 | Zustände gestaltet: Fokus, Fehler, Senden, Danke-Seite mit nächstem Schritt | E | B | MANUAL | | P Q-P01 | stabil |
| CRO-10 | Hauptknopf mit Verb und deutlichem Kontrast zur Umgebung (keine „Wunderfarbe“) | E | B | MANUAL | | F Q-F07 | stabil |
| CRO-11 | Nach Launch: Anfragen und Anruf-Klicks zählen (siehe `analytics.md`) und nach 4–8 Wochen mit dem Kunden auswerten | Z | A | MANUAL | | P Q-P03 | stabil |

## Mythen und Unbelegtes
- „Rote/orange Knöpfe konvertieren besser“ – Mythos, Kontrast zählt (Q-F07).
- „F-Muster als Layoutvorlage“ – Missverständnis, es ist ein Warnsignal (Q-F04).
- „Honigtopf reicht als Spamschutz“ – Praxiswissen, keine Primärquelle; wir kombinieren Honigtopf + Origin-Prüfung + Rate-Limit (siehe `sicherheit.md`).

## Zeitabhängig
Rechtslage zu Bewertungen (Q-R08) und Google-Bewertungsrichtlinie (Q-G32); Formularstudien sind stabil.
