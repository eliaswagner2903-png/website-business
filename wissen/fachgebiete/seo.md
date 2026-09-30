# SEO (On-Page, Inhalte, Suchintention, interne Verlinkung, Bilder)

> Schlüssel `seo` · setzt voraus: `technical-seo` · Quellen: Q-G01–Q-G06, Q-G15–Q-G17 · Stand 2026-09-29

## 1 Ziel
Jede Seite beantwortet eine klar umrissene Suchabsicht so gut, dass Google (und alle Suchsysteme, die auf Suchindizes aufbauen)
sie als passende Antwort erkennen und Menschen daraufhin handeln.

## 2 Warum relevant
Für lokale Betriebe kommen Anfragen überwiegend über Suche. Google nennt als Kern: auffindbar sein, verständliche
Seiten, eigene und hilfreiche Inhalte, beschreibende Titel und Links (Q-G01, Q-G15). Das ist zugleich die Grundlage
für KI-Antworten (Q-G20, siehe `geo.md`).

## 3 Faktoren (belegt)
- **Suchintention:** Welche Begriffe benutzen Kunden wirklich („Friseur Eislingen Herrenschnitt“, „Elektriker Notdienst“)? (Q-G01)
- **Titel und Description:** je Seite eigen, beschreibend, ohne Keyword-Stapel (Q-G02, Q-G03).
- **Überschriften:** gliedern für Menschen und Screenreader; für Google ist die Reihenfolge egal (Q-G01, Q-W11).
- **Interne Links:** `<a href>` mit beschreibendem Text; jede wichtige Seite von mindestens einer anderen verlinkt (Q-G04).
- **Bilder:** `<img>` mit beschreibendem alt, sprechende Dateinamen, nahe am passenden Text (Q-G05).
- **Inhaltsqualität:** people-first, echte Erfahrung, Who/How/Why (Q-G15); KI-Texte erlaubt, Masse ohne Mehrwert nicht (Q-G17).

## 4 Beim Programmieren
- Titel, Description und H1 je Seite im Inhalts-JSON (`inhalt/seite.json`) führen, der Generator schreibt sie; nie im Markup verstreut.
- Titelmuster: `<Seitenthema> – <Betrieb>` bzw. Startseite `<Betrieb> – <Leistung> in <Ort>` (Ort nur, wenn lokal).
- Navigation und Fußzeile verlinken alle Hauptseiten mit Klartext; Leistungen untereinander verlinken, wo es passt.
- Bilddateien beim Einbau sprechend benennen (`herrenschnitt-salon-eislingen-1016.webp`), nicht `IMG_2034`.

## 5 Inhalte und Strukturen
Startseite (wer, was, wo, nächster Schritt) · je Hauptleistung eine Seite oder ein klarer Abschnitt · Über uns/Team ·
Kontakt/Anfahrt · häufige Fragen der Kunden sichtbar beantwortet (Preise, Parken, Termine, Einzugsgebiet).

## 6 Vermeiden
Keyword-Stapel in Titeln, Ortslisten („Elektriker Göppingen, Eislingen, Salach, …“), fast gleiche Seiten je Stadt (Doorway, Q-G16),
leere Floskeln, Texte in Bildern, „hier klicken“, das Datum ändern ohne Inhalt zu ändern (Q-G15).

## 7 Automatisch umsetzbar
Metadaten aus dem Inhalts-JSON, Sitemap, Canonical, Linktexte der Navigation, Bild-Dateinamen beim Konvertieren (`werkzeuge/bilder.mjs`).

## 8 Automatisch prüfbar
Titel/Description vorhanden, eindeutig, Länge (Faustregel) · verwaiste Seiten · nichtssagende Linktexte · Bild-Dateinamen · Open Graph.

## 9 Manuell prüfen
Trifft die Seitenstruktur die Suchabsichten? Sind die Texte konkret und vom Kunden freigegeben? Keine Doorway-Muster?

## 10 Wie Claude die Umsetzung belegt
`QUALITAET.md` (AUTO-Zeilen) und in `abnahme.md`: Liste „Suchabsicht → Seite/Abschnitt“ (für SEO-01) und Freigabe der Texte mit Datum.

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| SEO-01 | Seitenstruktur aus Suchabsichten planen: je Hauptleistung eine Seite oder ein klar benannter Abschnitt; Begriffe mit dem Kunden klären | K | P | MANUAL | | O Q-G01, O Q-G15 | stabil |
| SEO-02 | Titel je Seite eindeutig und beschreibend (Thema + Betrieb, bei lokalen Betrieben auf der Startseite + Ort), kein Keyword-Stapel | K | PB | AUTO | titel-einzigartig | O Q-G02 | stabil |
| SEO-03 | Titellänge 10–70 Zeichen (Faustregel; Google kürzt nach Gerätebreite, nennt keine Grenze) | E | B | AUTO | titel-laenge | P Q-P02, O Q-G02 | stabil |
| SEO-04 | Meta description je indexierter Seite eindeutig, ≥ 50 Zeichen, fasst die Seite zusammen | K | B | AUTO | description, description-einzigartig | O Q-G03 | stabil |
| SEO-05 | H1 nennt das Seitenthema; Zwischenüberschriften beschreiben ihren Abschnitt | K | PB | SEMI-AUTO | h1 | O Q-G01, F Q-W11 | stabil |
| SEO-06 | Jede indexierte Seite ist von mindestens einer anderen Seite verlinkt; Navigation erreicht alle Hauptseiten | K | PB | AUTO | interne-verlinkung | O Q-G04 | stabil |
| SEO-07 | Linktexte beschreiben das Ziel (kein „hier“, „mehr“, „weiter“ ohne Kontext) | E | B | AUTO | ankertexte | O Q-G04 | stabil |
| SEO-08 | Inhaltsbilder als `<img>` mit beschreibendem alt und sprechendem Dateinamen | E | B | SEMI-AUTO | dateinamen, bilder-alt | O Q-G05 | stabil |
| SEO-09 | Texte konkret und eigen (Leistungen, Ablauf, Team, Einzugsgebiet); keine Füllsätze, keine Massen-KI-Texte; vom Kunden freigegeben | K | P | MANUAL | | O Q-G15, O Q-G17 | zeitabh. |
| SEO-10 | Keine Doorway-Seiten je Stadt und keine Ortslisten; Standortseiten nur für echte Standorte | K | P | MANUAL | | O Q-G16 | zeitabh. |
| SEO-11 | Sprechende URLs (klein, Bindestriche); bestehende Adressen behalten oder per 301/308 weiterleiten | E | P | MANUAL | | O Q-G01, O Q-G11 | stabil |
| SEO-12 | Häufige Kundenfragen (Preise, Anfahrt, Parken, Termine) sichtbar beantworten | E | P | MANUAL | | O Q-G15, F Q-F02 | stabil |
| SEO-13 | Open Graph auf der Startseite: og:title, og:description, og:image (absolut), og:url, og:type | Z | B | AUTO | og-tags | F Q-W12 | stabil |
| SEO-14 | Datum/„Stand“ nur ändern, wenn sich der Inhalt ändert; saisonale Inhalte im Abo pflegen | Z | A | MANUAL | | O Q-G15 | stabil |

## Mythen und Unbelegtes
| Behauptung | Stand der Belege |
|---|---|
| meta keywords helfen | widerlegt, Google nutzt sie nicht (Q-G01) |
| ideale Keyword-Dichte / Mindestwortzahl | widerlegt, „no magical word count“ (Q-G01, Q-G15) |
| Titel max. 60, Description max. 155 Zeichen | keine Grenze bei Google, nur Kürzung nach Breite (Q-G02, Q-G03); unsere 70 sind Faustregel |
| Keyword-Domain rankt besser | „hardly any effect“ (Q-G01) |
| E-E-A-T ist ein Rankingfaktor | Google verneint ausdrücklich (Q-G01, Q-G15) |
| Duplicate-Content-Strafe | keine manuelle Maßnahme für eigene Duplikate, nur kanonisieren (Q-G01) |
| KI-Texte werden abgestraft | nicht pauschal, nur Massenproduktion ohne Mehrwert (Q-G17) |

## Zeitabhängig (bei Nachrecherche zuerst prüfen)
Spam-Richtlinien (Q-G16), Umgang mit KI-Inhalten (Q-G17), helpful content (Q-G15).
