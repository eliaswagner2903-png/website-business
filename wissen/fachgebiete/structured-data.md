# Strukturierte Daten (Schema.org, JSON-LD)

> Schlüssel `structured-data` · Quellen: Q-G23–Q-G29, Q-S01–Q-S04, Q-P02 · Stand 2026-09-29

## 1 Ziel
Suchsysteme lesen die wichtigsten Tatsachen über Betrieb und Seite maschinenlesbar – korrekt, vollständig und deckungsgleich mit dem sichtbaren Inhalt.

## 2 Warum relevant
Markup macht Rich Results möglich (keine Garantie) und hilft beim Verständnis der Entität (Q-G23). Es ist **kein Rankingfaktor** und kein
KI-Hebel: Google braucht für KI-Funktionen kein spezielles Schema (Q-G19, Q-G20). Falsches Markup kostet die Rich-Result-Berechtigung (Q-G23).

## 3 Faktoren (belegt)
- Nur markieren, was Besucher sehen; nichts Irreführendes; spezifischster Typ; JSON-LD empfohlen (Q-G23).
- Pflichtfelder fehlen → kein Rich Result; lieber wenige, aber vollständige und richtige Felder (Q-G23).
- LocalBusiness: Pflicht `name`, `address`; empfohlen `telephone`, `url`, `openingHoursSpecification`, `geo` (≥ 5 Nachkommastellen),
  `priceRange` (< 100 Zeichen), bei Gastronomie `servesCuisine`, `menu` (Q-G24). Mehrfachtyp als Array (`["Plumber","HVACBusiness"]`).
- Öffnungszeiten: 24 h = `00:00`–`23:59`, geschlossen = `00:00`–`00:00`, Saison mit `validFrom`/`validThrough` (Q-G24).
- Eigenbewertungen (LocalBusiness/Organization über sich selbst) bekommen keine Sterne (Q-G25).
- Eingestellt: FAQ-Rich-Results (seit 2026-05-07), HowTo, Sitelinks-Suchfeld; Breadcrumbs mobil nicht mehr sichtbar (Q-G29, Q-G27).

## 4 Beim Programmieren
- JSON-LD im Generator aus denselben Stammdaten wie der sichtbare Text (siehe `kunden/urfa-meister/bauen.mjs`), `<` als `<` maskieren.
- LocalBusiness auf Startseite und Kontaktseite; `WebSite` (name, url) nur auf der Startseite (Q-G28).
- Arrays (z. B. `servesCuisine`) nur mit Werten, die sichtbar auf der Seite stehen (FEHLER.md, A-037).
- Ein Test je Seite prüft Syntax und Sichtbarkeit (`werkzeuge/qualitaet.mjs` Prüfungen `jsonld-*`).

## 5 Inhalte und Strukturen
Typ je Branche aus `branchen.md`. Speisekarte als HTML-Seite (dann `hasMenu`/`menu` = ihre URL). `sameAs` nur auf echte, aktive Profile.

## 6 Vermeiden
Unsichtbare Werte, erfundene Preise/Zeiten, veraltete Typen (`ProfessionalService`, `Attorney`), `aggregateRating` für den eigenen Betrieb,
FAQ-Markup „für Snippets“, Markup auf jeder Seite doppelt mit abweichenden Werten.

## 7 Automatisch umsetzbar
JSON-LD aus Stammdaten im Generator.

## 8 Automatisch prüfbar
Syntax, @context/@type, Sichtbarkeit jedes Textwerts, LocalBusiness-Pflichtfelder und Typ, keine Eigenbewertungen.

## 9 Manuell prüfen
Richtigkeit der Werte (Kunde), Schema Markup Validator auf den Code, nach Launch Rich Results Test auf die URL.

## 10 Wie Claude die Umsetzung belegt
`QUALITAET.md` (jsonld-*); in `abnahme.md` Ergebnis des Schema Markup Validators (Anzahl Fehler/Warnungen) mit Datum.

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| SD-01 | Strukturierte Daten nur als JSON-LD, syntaktisch gültig, `@context` schema.org, Startseite mit Typ, keine Eigenbewertungen des eigenen Betriebs (wie LOC-09) | K | B | AUTO | jsonld-syntax, jsonld-typ, jsonld-bewertungen | O Q-G23 | stabil |
| SD-02 | Jeder Textwert im Markup (auch in Arrays) steht sichtbar auf derselben Seite | K | B | AUTO | jsonld-sichtbar | O Q-G23, P Q-P02 | stabil |
| SD-03 | Spezifischster zutreffender Typ (Tabelle `branchen.md`), Mehrfachtyp als Array, keine veralteten Typen | K | P | SEMI-AUTO | jsonld-typ | O Q-G23, O Q-S02 | stabil |
| SD-04 | Nur wahre, vom Kunden bestätigte Angaben (Preise, Zeiten, Leistungen) | K | P | MANUAL | | O Q-G23 | stabil |
| SD-05 | Pflicht- und empfohlene Eigenschaften je Typ laut Google-Doku; lieber weniger, aber vollständig | E | B | SEMI-AUTO | jsonld-lokal | O Q-G23, O Q-G24 | zeitabh. |
| SD-06 | WebSite (name, url) nur auf der Startseite; Organization-Angaben (logo ≥ 112 px, sameAs nur echte Profile) | E | B | MANUAL | | O Q-G26, O Q-G28 | stabil |
| SD-07 | BreadcrumbList bei Seiten ab zweiter Ebene | Z | B | MANUAL | | O Q-G27 | zeitabh. |
| SD-08 | Keine eingestellten Rich-Result-Typen versprechen (FAQ, HowTo); FAQPage nur, wenn die Fragen sichtbar sind | E | P | MANUAL | | O Q-G29 | zeitabh. |
| SD-09 | Validierung: Schema Markup Validator auf den Code, nach Launch Rich Results Test auf die URL | E | A | MANUAL | | O Q-S03, O Q-S04 | stabil |

## Mythen und Unbelegtes
- „Schema verbessert das Ranking“ – Markup ermöglicht Rich Results, kein Ranking (Q-G23).
- „Mit Schema empfiehlt dich ChatGPT“ – kein Beleg; Google: kein spezielles Schema für KI nötig (Q-G19, Q-G20).
- „FAQ-Markup bringt Snippets“ – seit 2026-05-07 abgeschaltet (Q-G29).
- „`hasMenu` statt `menu`“ – schema.org empfiehlt `hasMenu` (Q-S02), Google listet nur `menu` (Q-G24): **unsicher**, beide mit derselben URL sind unschädlich.

## Zeitabhängig
Liste der unterstützten Rich-Result-Typen (Q-G29), Bewertungsregeln (Q-G25), Breadcrumb-Darstellung (Q-G27).
