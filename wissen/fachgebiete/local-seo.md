# Local SEO (lokale Suche, Karten, Entität „Betrieb an einem Ort“)

> Schlüssel `local-seo` · setzt voraus: `structured-data`, `technical-seo` · Quellen: Q-G16, Q-G20, Q-G24, Q-G25, Q-G30–Q-G32, Q-R08, Q-F08 · Stand 2026-09-29

## 1 Ziel
Der Betrieb erscheint bei Suchen mit Ortsbezug („Friseur Eislingen“, „Restaurant in der Nähe“) in Google Maps, im lokalen Block und in
KI-Antworten mit korrekten Angaben – und wer ihn findet, kann sofort anrufen, kommen oder buchen.

## 2 Warum relevant
Google nennt drei Faktoren für das lokale Ranking: **Relevanz, Entfernung, Bekanntheit**; vollständige, korrekte Profile werden eher
gezeigt, Rezensionen und Verweise zählen zur Bekanntheit (Q-G31). Die Website ist die Quelle, auf die Profil, Verzeichnisse und KI verweisen.
Google verweist auch für KI-Funktionen bei lokalen Betrieben auf das Business Profile (Q-G20).

## 3 Faktoren
- **Offiziell:** vollständiges, verifiziertes Google-Unternehmensprofil mit echtem Namen (ohne Keywords), passender Kategorie, Zeiten (Q-G30, Q-G31);
  Bewertungen ohne Anreize und ohne Filter (Q-G32); LocalBusiness-Markup mit name und address, empfohlen telephone, url, Zeiten, geo (Q-G24).
- **Fachquelle (Umfrage, keine Messung):** gleiche NAP-Angaben auf Website und Profil, einheitliche Verzeichniseinträge (Q-F08).
- **Entfernung** ist nicht beeinflussbar (Lage des Betriebs bzw. Servicegebiet).

## 4 Beim Programmieren
- Stammdaten (Name, Adresse, Telefon, Zeiten, Koordinaten) **einmal** im Inhalts-JSON; Text, Fußzeile, Kontaktseite, JSON-LD und
  Schnellleiste lesen daraus → Abweichungen sind technisch ausgeschlossen.
- `tel:` global mit `+49` (Q-M05), Anzeige in der üblichen Schreibweise.
- Route als Link zu Google Maps/Apple Karten (kein iframe: Datenschutz und Gewicht).
- JSON-LD `LocalBusiness`-Untertyp aus `branchen.md`, Details in `structured-data.md`.

## 5 Inhalte und Strukturen
Startseite: Name, Leistung, Ort im Text und im Titel. Kontakt/Anfahrt: Adresse, Telefon, E-Mail, Zeiten, Parken/ÖPNV, Route.
Handwerker ohne Ladengeschäft: Einzugsgebiet als Fließtext (Orte, in denen wirklich gearbeitet wird), keine Stadtseiten-Fabrik.
Mehrere Standorte: je Standort eine eigene Seite mit eigenen Angaben.

## 6 Vermeiden
Keywords im Firmennamen (Profil und Website), virtuelle Büros, Callcenter-Nummern (Q-G30), Doorway-Seiten je Nachbarort, Ortslisten (Q-G16),
gekaufte/gefilterte Bewertungen (Q-G32), Sterne-Markup für eigene Bewertungen (Q-G25).

## 7 Automatisch umsetzbar
NAP aus einer Quelle, JSON-LD, tel-/Route-Links, Schnellleiste.

## 8 Automatisch prüfbar
NAP-Gleichheit Text ↔ JSON-LD ↔ tel:-Links, Öffnungszeiten Text ↔ JSON-LD, Pflichtfelder und Typ im JSON-LD, Route-Link, keine Eigenbewertungen.

## 9 Manuell prüfen
Google-Unternehmensprofil (nur der Kunde hat Zugang), Verzeichniseinträge, Bewertungsprozess, Mehrstandort-Fragen.

## 10 Wie Claude die Umsetzung belegt
`QUALITAET.md`; in `abnahme.md` Screenshot bzw. Angaben aus dem Profil (Name, Kategorie, Zeiten, Website-Link) gegen die Seite abgeglichen, mit Datum.

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| LOC-01 | Name, Adresse, Telefon identisch auf Website, im JSON-LD und im Google-Unternehmensprofil; Name wie auf dem Schild, ohne Keywords | K | PBA | SEMI-AUTO | nap | O Q-G30, F Q-F08 | stabil |
| LOC-02 | Adresse und Telefon (`tel:+49…`) als Text auf Startseite und Kontaktseite, Name auf jeder Seite | K | B | AUTO | nap | O Q-G31, F Q-F02, O Q-M05 | stabil |
| LOC-03 | Öffnungszeiten aus einer Datenquelle, im Text sichtbar und gleich im JSON-LD und im Profil; Sonderzeiten gepflegt | K | PB | SEMI-AUTO | oeffnungszeiten | O Q-G24 | stabil |
| LOC-04 | LocalBusiness-JSON-LD mit dem spezifischsten Typ aus `branchen.md`, name, address, telephone, url, Öffnungszeiten | K | B | AUTO | jsonld-lokal | O Q-G24 | stabil |
| LOC-05 | Route/Karte als Link (Google Maps, Apple Karten), kein iframe | K | B | AUTO | karte-route | P Q-P03 | stabil |
| LOC-06 | Google-Unternehmensprofil vorhanden und verifiziert, Kategorie passend, Website-Link und Zeiten stimmen mit der Seite überein | K | L | MANUAL | | O Q-G30, O Q-G31, O Q-G20 | zeitabh. |
| LOC-07 | Ort und Leistung stehen als Text auf der Startseite (Titel, H1 oder Einleitung); Einzugsgebiet als Fließtext, keine Ortslisten | K | P | SEMI-AUTO | fakten-text | O Q-G16, O Q-G31 | stabil |
| LOC-08 | Bewertungen: Kunde bittet ohne Anreiz und ohne Filter um Google-Rezensionen und antwortet darauf | E | L | MANUAL | | O Q-G32, O Q-G31 | stabil |
| LOC-09 | Kein aggregateRating/review für den eigenen Betrieb im Markup | K | B | AUTO | jsonld-bewertungen | O Q-G25 | zeitabh. |
| LOC-10 | Einheitliche Einträge in Apple Business Connect, Bing Places und branchenrelevanten Verzeichnissen | Z | A | MANUAL | | F Q-F08 | zeitabh. |
| LOC-11 | Mehrere Standorte: je Standort eine eigene Seite mit eigenen Angaben und eigenem JSON-LD (sonst „trifft nicht zu“ belegen) | E | P | MANUAL | | O Q-G24, O Q-G16 | stabil |

## Mythen und Unbelegtes
- „NAP-Konsistenz ist ein offizieller Google-Faktor“ – offiziell ist nur „vollständig und korrekt“ und der echte Name (Q-G30, Q-G31); die Gewichtung
  stammt aus Expertenumfragen (Q-F08). Wir machen es trotzdem, weil es fast nichts kostet und Kunden nicht verwirrt.
- „Keywords im Profilnamen helfen“ – Verstoß gegen die Richtlinie (Q-G30).
- „Eine Seite je Nachbarort bringt Rankings“ – genau das nennt Google als Doorway-Beispiel (Q-G16).
- „Mehr Bewertungen = Platz 1“ – Bewertungen zählen zur Bekanntheit (Q-G31), garantieren aber nichts.

## Zeitabhängig
Business-Profile-Richtlinien und -Funktionen (Q-G30–Q-G32), Bewertungsregeln (Q-G25), Verzeichnislandschaft (Q-F08).
