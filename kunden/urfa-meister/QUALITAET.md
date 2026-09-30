# Quality Gate – Urfa Sofrası

**Urteil: NICHT BESTANDEN** · 2026-09-30 00:05 UTC · schnelle Prüfung · 8 Seiten · Auftrag: kunden/urfa-meister/auftrag.md

Muss offen: **35** (34 verschiedene Befunde) · Soll offen: 13 · nach Launch: 5 · Legende: ✓ bestanden · ✗ Fehler · ◐ Werkzeug ok oder ohne Befund, Bestätigung fehlt · ○ manuell offen · … nur mit --voll · ↻ nach Launch (Wartung) · · nicht anwendbar

## Globaler Mindeststandard (immer)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| … | GLB-01 | 320–1920 px ohne Überlauf, Tippflächen ≥ 44 px, keine Konsolenfehler, ohne JS und bei „Bewegung reduzieren“ alles sichtbar | Muss | ext-pruefen: nur mit --voll |
| ✓ | GLB-02 | Viewport `width=device-width`, keine Zoom-Sperre (`user-scalable=no`, `maximum-scale` < 2) | Muss | 404.html: viewport „width=device-width, initial-scale=1, viewport-fit=cover“; datenschutz.htm: viewport „width=device-width, initial-scale=1, viewport-fit=cover“ |
| ✓ | GLB-03 | `<html lang>` gesetzt | Muss | 404.html: lang="de"; datenschutz.htm: lang="de" |
| ✓ | GLB-04 | Genau eine H1 je Seite, Überschriftenebenen ohne Sprung | Muss | 404.html: 1 H1; datenschutz.htm: 1 H1 |
| ✓ | GLB-05 | Jede Seite hat einen `<title>` und eine meta description (indexierte Seiten) | Muss | 404.html: Titel vorhanden; datenschutz.htm: Titel vorhanden |
| ✓ | GLB-06 | Keine toten internen Links, Anker existieren, kein `href="#"`/leer/`javascript:` | Muss | 404.html: interne Links ok; datenschutz.htm: interne Links ok |
| ✓ | GLB-07 | Skip-Link als erster Link, jede Seite hat einen Kontaktweg (tel:, mailto:, Kontaktseite) | Muss | 404.html: erster Link #inhalt; datenschutz.htm: erster Link #inhalt |
| … | GLB-08 | Navigation funktioniert auf Handy und Computer, mit Tastatur, ohne JS; aktuelle Seite markiert | Muss | ext-pruefen: nur mit --voll; 404.html: alle Links benannt |
| ✓ | GLB-09 | Jedes `<img>` hat `alt` (dekorativ: `alt=""`) sowie `width` und `height` | Muss | galerie.htm: 13 Bilder mit alt; index.html: 10 Bilder mit alt |
| ✗ | GLB-10 | Bilder als WebP/AVIF, ≤ 300 KB, erstes Bild nicht lazy | Muss | galerie.htm @1440px: Bild im ersten Bildschirm ist lazy: /medien/grillplatte-urfa-sofrasi-1016.webp |
| … | GLB-11 | Lighthouse mobil (Startseite): Performance ≥ 95, Barrierefreiheit, Best Practices, SEO = 100 | Muss | ext-lighthouse: nur mit --voll |
| … | GLB-12 | Gewichts-Budget des Meisterstandards eingehalten | Muss | ext-budget: nur mit --voll |
| ✓ | GLB-13 | Tests der Seite grün, html-validate ohne Fehler, Kopf-Regeln eingehalten | Muss | 5 Testdateien grün; html-validate ohne Fehler |
| ✓ | GLB-14 | Sicherheits-Header: CSP ohne `unsafe-inline`/`unsafe-eval`, HSTS, nosniff, Referrer-, Permissions-Policy, frame-ancestors | Muss | CSP, HSTS, nosniff, Referrer, Permissions, Framing gesetzt |
| ✓ | GLB-15 | Keine fremden Herkünfte (Skripte, Schriften, Bilder, iframes) und kein einwilligungspflichtiges Tracking | Muss | nur eigene Herkunft; 404.html: kein Tracking-Code |
| ✓ | GLB-16 | Kein Mixed Content (nur https-Adressen) | Muss | 404.html: nur https; datenschutz.htm: nur https |
| ✓ | GLB-17 | Formulare: jedes Feld beschriftet, Honigtopf und serverseitige Prüfung | Muss | kontakt.htm: alle Felder beschriftet; kontakt.htm: Honigtopf vorhanden |
| ◐ | GLB-18 | Impressum und Datenschutz von jeder Seite verlinkt; Texte vom Kunden/Generator, nicht erfunden | Muss | datenschutz.htm: Impressum und Datenschutz verlinkt; galerie.htm: Impressum und Datenschutz verlinkt |
| ✓ | GLB-19 | 404-Seite und Favicon vorhanden | Muss | 404.html vorhanden; 404.html: Favicon verlinkt |
| ✗ | GLB-20 | Kein Blindtext, keine offenen `data-pruefen`-Angaben bei Abnahme | Muss | 41 offene Angaben mit data-pruefen (vor Launch vom Kunden bestätigen lassen) |
| ○ | GLB-21 | Jede Tatsache (Adresse, Zeiten, Preise, Leistungen) stammt vom Kunden; Kunde hat Texte freigegeben | Muss | in abnahme.md bestätigen |
| ✓ | GLB-22 | Hauptinhalt steht im HTML und ist ohne JavaScript vorhanden | Muss | galerie.htm: ohne JS 375 von 375 Zeichen Hauptinhalt; index.html: ohne JS 3052 von 3068 Zeichen Hauptinhalt |
| ✓ | GLB-23 | robots.txt und sitemap.xml vorhanden, Startseite indexierbar | Muss | robots.txt ok; 4 URLs |
| ○ | GLB-24 | Sichtprüfung Handy und Computer: Meisterprüfung W1–W7 im Schnitt ≥ 4 | Muss | in abnahme.md bestätigen |

## Local SEO (KRITISCH)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ◐ | LOC-01 | Name, Adresse, Telefon identisch auf Website, im JSON-LD und im Google-Unternehmensprofil; Name wie auf dem Schild, ohne Keywords | Muss | Name, Adresse, Telefon einheitlich (1 Rufnummer) |
| ✓ | LOC-02 | Adresse und Telefon (`tel:+49…`) als Text auf Startseite und Kontaktseite, Name auf jeder Seite | Muss | Name, Adresse, Telefon einheitlich (1 Rufnummer) |
| ◐ | LOC-03 | Öffnungszeiten aus einer Datenquelle, im Text sichtbar und gleich im JSON-LD und im Profil; Sonderzeiten gepflegt | Muss | Uhrzeiten aus dem JSON-LD stehen im Text (Wochentage bitte manuell abgleichen) |
| ✓ | LOC-04 | LocalBusiness-JSON-LD mit dem spezifischsten Typ aus `branchen.md`, name, address, telephone, url, Öffnungszeiten | Muss | Restaurant vollständig |
| ✓ | LOC-05 | Route/Karte als Link (Google Maps, Apple Karten), kein iframe | Muss | Route-/Kartenlink vorhanden |
| ↻ | LOC-06 | Google-Unternehmensprofil vorhanden und verifiziert, Kategorie passend, Website-Link und Zeiten stimmen mit der Seite überein | Muss | im ersten Wartungslauf prüfen und in abnahme.md belegen |
| ◐ | LOC-07 | Ort und Leistung stehen als Text auf der Startseite (Titel, H1 oder Einleitung); Einzugsgebiet als Fließtext, keine Ortslisten | Muss | Startseite nennt URFA SOFRASI, Eislingen/Fils als Text |
| ↻ | LOC-08 | Bewertungen: Kunde bittet ohne Anreiz und ohne Filter um Google-Rezensionen und antwortet darauf | Muss | im ersten Wartungslauf prüfen und in abnahme.md belegen |
| ✓ | LOC-09 | Kein aggregateRating/review für den eigenen Betrieb im Markup | Muss | keine Eigenbewertungen im Markup |
| ○ | LOC-10 | Einheitliche Einträge in Apple Business Connect, Bing Places und branchenrelevanten Verzeichnissen | Soll | in abnahme.md bestätigen |
| ○ | LOC-11 | Mehrere Standorte: je Standort eine eigene Seite mit eigenen Angaben und eigenem JSON-LD (sonst „trifft nicht zu“ belegen) | Muss | in abnahme.md bestätigen |

## SEO (On-Page, Inhalte) (HOCH)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ○ | SEO-01 | Seitenstruktur aus Suchabsichten planen: je Hauptleistung eine Seite oder ein klar benannter Abschnitt; Begriffe mit dem Kunden klären | Muss | in abnahme.md bestätigen |
| ✓ | SEO-02 | Titel je Seite eindeutig und beschreibend (Thema + Betrieb, bei lokalen Betrieben auf der Startseite + Ort), kein Keyword-Stapel | Muss | „Galerie – URFA SOFRASI Eislingen“; „URFA SOFRASI Eislingen – Türkisches Restaurant, Grill & Döner“ |
| ✓ | SEO-03 | Titellänge 10–70 Zeichen (Faustregel; Google kürzt nach Gerätebreite, nennt keine Grenze) | Muss | galerie.htm: Titel 32 Zeichen (Faustregel 10–70, Google kürzt nach Breite); index.html: Titel 61 Zeichen (Faustregel 10–70, Google kürzt nach Breite) |
| ✓ | SEO-04 | Meta description je indexierter Seite eindeutig, ≥ 50 Zeichen, fasst die Seite zusammen | Muss | galerie.htm: Description 113 Zeichen; index.html: Description 154 Zeichen |
| ◐ | SEO-05 | H1 nennt das Seitenthema; Zwischenüberschriften beschreiben ihren Abschnitt | Muss | 404.html: 1 H1; datenschutz.htm: 1 H1 |
| ✓ | SEO-06 | Jede indexierte Seite ist von mindestens einer anderen Seite verlinkt; Navigation erreicht alle Hauptseiten | Muss | galerie.htm von 7 Seite(n) verlinkt; kontakt.htm von 7 Seite(n) verlinkt |
| ✓ | SEO-07 | Linktexte beschreiben das Ziel (kein „hier“, „mehr“, „weiter“ ohne Kontext) | Muss | 404.html: Linktexte beschreibend; datenschutz.htm: Linktexte beschreibend |
| ◐ | SEO-08 | Inhaltsbilder als `<img>` mit beschreibendem alt und sprechendem Dateinamen | Muss | Bildnamen beschreibend; galerie.htm: 13 Bilder mit alt |
| ○ | SEO-09 | Texte konkret und eigen (Leistungen, Ablauf, Team, Einzugsgebiet); keine Füllsätze, keine Massen-KI-Texte; vom Kunden freigegeben | Muss | in abnahme.md bestätigen |
| ○ | SEO-10 | Keine Doorway-Seiten je Stadt und keine Ortslisten; Standortseiten nur für echte Standorte | Muss | in abnahme.md bestätigen |
| ○ | SEO-11 | Sprechende URLs (klein, Bindestriche); bestehende Adressen behalten oder per 301/308 weiterleiten | Muss | in abnahme.md bestätigen |
| ○ | SEO-12 | Häufige Kundenfragen (Preise, Anfahrt, Parken, Termine) sichtbar beantworten | Muss | in abnahme.md bestätigen |
| ✓ | SEO-13 | Open Graph auf der Startseite: og:title, og:description, og:image (absolut), og:url, og:type | Kann | Open Graph vollständig |
| ○ | SEO-14 | Datum/„Stand“ nur ändern, wenn sich der Inhalt ändert; saisonale Inhalte im Abo pflegen | Kann | in abnahme.md bestätigen |

## GEO / KI-Suche (HOCH)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ◐ | GEO-01 | Such-Crawler (Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot, Applebot) nicht sperren – weder in robots.txt noch in Cloudflare-Bot-Einstellungen | Muss | alle Such-Crawler (Google, Bing, OpenAI-, Anthropic-, Perplexity-, Apple-Suche) zugelassen |
| ○ | GEO-02 | Trainings-Crawler (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended): Entscheidung des Kunden dokumentieren (Standard: zulassen) | Muss | in abnahme.md bestätigen |
| ✓ | GEO-03 | Snippets erlaubt: kein nosnippet, max-snippet:0 oder data-nosnippet auf dem Hauptinhalt | Muss | galerie.htm: Snippets erlaubt; index.html: Snippets erlaubt |
| ✓ | GEO-04 | Kernfakten (Name, Leistung, Ort, Kontakt, Zeiten) als Text im HTML, nicht nur in Bildern, PDFs, Tabs oder per JS | Muss | Startseite nennt URFA SOFRASI, Eislingen/Fils als Text; galerie.htm: ohne JS 375 von 375 Zeichen Hauptinhalt |
| ◐ | GEO-05 | Eindeutige Entität: gleicher Name, Adresse, Telefon auf allen Seiten und im JSON-LD; `sameAs` nur auf echte Profile | Muss | Name, Adresse, Telefon einheitlich (1 Rufnummer) |
| ○ | GEO-06 | Eigene, überprüfbare Angaben (Zahlen, Erfahrung, Zertifikate, Quellen) statt Allgemeinplätzen – nur Belegtes | Muss | in abnahme.md bestätigen |
| ○ | GEO-07 | Häufige Kundenfragen sichtbar und direkt beantworten, ohne eine Seite je Formulierung | Muss | in abnahme.md bestätigen |
| ○ | GEO-08 | Keine Garantie-Aussagen zu KI-Sichtbarkeit in Seite, Angebot und Bericht | Muss | in abnahme.md bestätigen |
| ○ | GEO-09 | llms.txt oder KI-Spezialdateien höchstens als Zusatz ohne Wirkungsversprechen | Kann | in abnahme.md bestätigen |
| ↻ | GEO-10 | Nach Launch: Search Console (Bericht zu generativer KI) und Bing „AI Performance“ ansehen; keine Tools mit angeblichen Google-internen KI-Daten | Kann | im ersten Wartungslauf prüfen und in abnahme.md belegen |

## Performance (HOCH)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ✗ | PERF-01 | LCP-Bild/Poster im HTML, `fetchpriority="high"`, nie lazy, passende Größe per `srcset` | Muss | galerie.htm @1440px: Bild im ersten Bildschirm ist lazy: /medien/grillplatte-urfa-sofrasi-1016.webp |
| ✓ | PERF-02 | Kein Layoutsprung: Maße für Bilder/Videos, Schriften mit `font-display` und abgestimmter Ersatzschrift | Muss | galerie.htm: alle Bilder mit Maßen; index.html: alle Bilder mit Maßen |
| ✓ | PERF-03 | Keine render-blockierenden Skripte im Kopf | Muss | 404.html: keine blockierenden Skripte; datenschutz.htm: keine blockierenden Skripte |
| … | PERF-04 | Laborwerte Lighthouse mobil: LCP ≤ 2,5 s, CLS ≤ 0,02 (Meisterstandard; Googles Grenze „gut“ ist 0,1) | Muss | ext-cwv-labor: nur mit --voll |
| … | PERF-05 | Wenig und spätes JavaScript (Budget ≤ 60 KB), lange Tasks aufgeteilt | Muss | ext-budget: nur mit --voll |
| ✗ | PERF-06 | Bilder unterhalb des ersten Bildschirms `loading="lazy"` | Muss | galerie.htm: 1 Bilder außerhalb des ersten Bildschirms ohne loading="lazy": /medien/sofra-platte-gemischt-1016.webp |
| … | PERF-07 | Schriften: WOFF2-Subset, lokal, ≤ 3 Dateien | Muss | 2 Schriften lokal mit font-display; ext-budget: nur mit --voll |
| ✓ | PERF-08 | Lange Cache-Zeiten für CSS, JS, Schriften, Medien in `_headers` | Muss | lange Cache-Zeiten für Assets gesetzt |
| … | PERF-09 | Video/3D erst nach Poster und „geladen“, pausiert außerhalb des Bildschirms, nicht bei „Daten sparen“ | Muss | ext-budget: nur mit --voll |
| ↻ | PERF-10 | Nach Launch: Feldwerte (Search Console/CrUX) im Wartungslauf prüfen, sobald Daten vorliegen | Kann | im ersten Wartungslauf prüfen und in abnahme.md belegen |

## Technical SEO (MITTEL)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ✓ | TEC-01 | robots.txt erlaubt das Crawling, nennt die Sitemap absolut, enthält kein noindex | Muss | robots.txt ok |
| ✓ | TEC-02 | sitemap.xml enthält genau die indexierten Seiten (kanonische https-URLs), keine noindex-Seiten, ohne priority/changefreq | Muss | 4 URLs; Sitemap deckt alle indexierten Seiten ab |
| ✓ | TEC-03 | Jede indexierte Seite hat genau ein absolutes, selbstreferenzierendes https-Canonical auf der eigenen Domain | Muss | galerie.htm: → https://www.urfasofrasi-eislingen.de/galerie.htm; index.html: → https://www.urfasofrasi-eislingen.de/ |
| ✓ | TEC-04 | noindex nur für Impressum, Datenschutz, Danke-, Fehler- und Abbruchseiten; Startseite nie | Muss | datenschutz.htm ist noindex (gewollt); impressum.htm ist noindex (gewollt) |
| ✓ | TEC-05 | Nur crawlbare Links (`<a href>`), Hauptinhalt im Ausgangs-HTML | Muss | 404.html: alle Links mit Ziel; datenschutz.htm: alle Links mit Ziel |
| ✓ | TEC-06 | Unbekannte Adressen liefern die 404-Seite mit Status 404 (keine Soft-404) | Soll | 404.html vorhanden |
| ○ | TEC-07 | Handy und Computer zeigen dieselben Inhalte, Daten und Metadaten | Muss | in abnahme.md bestätigen |
| ○ | TEC-08 | Eine Hauptdomain: http → https und www/ohne per 301/308; alte Adressen per `_redirects` | Muss | in abnahme.md bestätigen |
| ◐ | TEC-09 | Semantische Struktur: header, nav, main, footer; Listen und Tabellen nur für ihren Zweck | Soll | html-validate ohne Fehler |
| ↻ | TEC-10 | Nach Launch: Search Console und Bing Webmaster Tools (Konto des Kunden), Sitemap einreichen, Indexierung prüfen | Soll | im ersten Wartungslauf prüfen und in abnahme.md belegen |

## CRO und UX (MITTEL)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ✓ | CRO-01 | Ein Hauptziel je Seite festlegen; Handlungsaufforderung im ersten Bildschirm auf Handy (390 px) und Computer (1440 px) | Muss | @390px im ersten Bildschirm: Anrufen07161 651 75 65; @1440px im ersten Bildschirm: Kontakt & Anfahrt \| 07161 651 75 65 \| Anrufen07161 651 75 65 |
| ◐ | CRO-02 | Alle Kontaktwege: Telefon (`tel:+49`), E-Mail, Adresse, Formular bzw. Buchung; feste Schnellleiste auf dem Handy; Kontaktweg auf jeder Seite | Muss | datenschutz.htm: Kontaktweg vorhanden; galerie.htm: Kontaktweg vorhanden |
| ◐ | CRO-03 | Formulare: ≤ 6 sichtbare Felder, eine Spalte, sichtbare Labels, Pflichtfelder markiert, Fehler als Text, Antwortzeit genannt | Muss | kontakt.htm: /api/kontakt: 3 sichtbare Felder (Richtwert ≤ 6); kontakt.htm: alle Felder beschriftet |
| ○ | CRO-04 | Vertrauensbelege nur echt und freigegeben: Fotos von Team/Räumen/Arbeiten, Meistertitel, Zertifikate, Jahre, Referenzen | Muss | in abnahme.md bestätigen |
| ○ | CRO-05 | Offene Angaben: Preise oder Preisrahmen (mit Zustimmung des Kunden), Ablauf, Einzugsgebiet, Zeiten | Soll | in abnahme.md bestätigen |
| ○ | CRO-06 | Bewertungen/Stimmen nur echt, mit Quelle und Hinweis, ob und wie die Echtheit geprüft wird (§ 5b UWG); Link zum Profil statt Fremd-Widget | Soll | in abnahme.md bestätigen |
| ○ | CRO-07 | Navigation kurz und eindeutig benannt (Faustregel ≤ 7 Hauptpunkte); jede Seite endet mit dem nächsten Schritt | Soll | in abnahme.md bestätigen |
| ○ | CRO-08 | Lesbar gegliedert: Kerninfo zuerst, kurze Absätze, Zwischenüberschriften, Listen | Soll | in abnahme.md bestätigen |
| ○ | CRO-09 | Zustände gestaltet: Fokus, Fehler, Senden, Danke-Seite mit nächstem Schritt | Soll | in abnahme.md bestätigen |
| ○ | CRO-10 | Hauptknopf mit Verb und deutlichem Kontrast zur Umgebung (keine „Wunderfarbe“) | Soll | in abnahme.md bestätigen |

## Barrierefreiheit (MITTEL)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ○ | A11Y-01 | Alles per Tastatur bedienbar, Reihenfolge logisch, Fokus sichtbar und nicht von festen Leisten verdeckt (2.1.1, 2.4.7, 2.4.11) | Muss | in abnahme.md bestätigen |
| … | A11Y-02 | Kontrast Text ≥ 4,5:1 (groß 3:1), Bedienelemente ≥ 3:1 – in jedem Farbschema | Muss | ext-lighthouse: nur mit --voll |
| … | A11Y-03 | Zoom 200 % und Reflow bei 320 px ohne Verlust (1.4.4, 1.4.10), keine Zoom-Sperre | Muss | ext-pruefen: nur mit --voll; 404.html: viewport „width=device-width, initial-scale=1, viewport-fit=cover“ |
| ◐ | A11Y-04 | Formulare: Label, Fehler als Text am Feld, `autocomplete`, keine doppelte Eingabe (3.3.7), Hilfe an gleicher Stelle (3.2.6) | Muss | kontakt.htm: alle Felder beschriftet |
| ◐ | A11Y-05 | Alt-Texte beschreiben Inhalt oder Funktion; dekorative Bilder `alt=""`; jeder Link hat einen Namen | Muss | galerie.htm: 13 Bilder mit alt; index.html: 10 Bilder mit alt |
| … | A11Y-06 | Bewegung: „Bewegung reduzieren“ respektiert, nichts blinkt, Autoplay-Video pausierbar (2.2.2, 2.3.1) | Muss | ext-pruefen: nur mit --voll |
| ○ | A11Y-07 | Screenreader-Stichprobe: Landmarken, Überschriftenliste, Formular verständlich | Soll | in abnahme.md bestätigen |
| ○ | A11Y-08 | BFSG-Einordnung mit dem Kunden dokumentieren (Verbraucher-Buchung/Shop? Kleinstunternehmen?) – keine Rechtsberatung | Muss | in abnahme.md bestätigen |

## Strukturierte Daten (MITTEL)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ✓ | SD-01 | Strukturierte Daten nur als JSON-LD, syntaktisch gültig, `@context` schema.org, Startseite mit Typ, keine Eigenbewertungen des eigenen Betriebs (wie LOC-09) | Muss | index.html: JSON-LD gültig; kontakt.htm: JSON-LD gültig |
| ✓ | SD-02 | Jeder Textwert im Markup (auch in Arrays) steht sichtbar auf derselben Seite | Muss | index.html: alle JSON-LD-Werte sichtbar; kontakt.htm: alle JSON-LD-Werte sichtbar |
| ◐ | SD-03 | Spezifischster zutreffender Typ (Tabelle `branchen.md`), Mehrfachtyp als Array, keine veralteten Typen | Muss | Startseite: Restaurant, PostalAddress, OpeningHoursSpecification |
| ○ | SD-04 | Nur wahre, vom Kunden bestätigte Angaben (Preise, Zeiten, Leistungen) | Muss | in abnahme.md bestätigen |
| ◐ | SD-05 | Pflicht- und empfohlene Eigenschaften je Typ laut Google-Doku; lieber weniger, aber vollständig | Soll | Restaurant vollständig |
| ○ | SD-06 | WebSite (name, url) nur auf der Startseite; Organization-Angaben (logo ≥ 112 px, sameAs nur echte Profile) | Soll | in abnahme.md bestätigen |
| ○ | SD-08 | Keine eingestellten Rich-Result-Typen versprechen (FAQ, HowTo); FAQPage nur, wenn die Fragen sichtbar sind | Soll | in abnahme.md bestätigen |
| ○ | SD-09 | Validierung: Schema Markup Validator auf den Code, nach Launch Rich Results Test auf die URL | Soll | in abnahme.md bestätigen |

## Zu beheben (Muss)

- **GLB-10** Bilder als WebP/AVIF, ≤ 300 KB, erstes Bild nicht lazy → galerie.htm @1440px: Bild im ersten Bildschirm ist lazy: /medien/grillplatte-urfa-sofrasi-1016.webp
- **GLB-18** Impressum und Datenschutz von jeder Seite verlinkt; Texte vom Kunden/Generator, nicht erfunden → Bestätigung mit Beleg in abnahme.md
- **GLB-20** Kein Blindtext, keine offenen `data-pruefen`-Angaben bei Abnahme → 41 offene Angaben mit data-pruefen (vor Launch vom Kunden bestätigen lassen)
- **GLB-21** Jede Tatsache (Adresse, Zeiten, Preise, Leistungen) stammt vom Kunden; Kunde hat Texte freigegeben → Bestätigung mit Beleg in abnahme.md
- **GLB-24** Sichtprüfung Handy und Computer: Meisterprüfung W1–W7 im Schnitt ≥ 4 → Bestätigung mit Beleg in abnahme.md
- **SEO-01** Seitenstruktur aus Suchabsichten planen: je Hauptleistung eine Seite oder ein klar benannter Abschnitt; Begriffe mit dem Kunden klären → Bestätigung mit Beleg in abnahme.md
- **SEO-05** H1 nennt das Seitenthema; Zwischenüberschriften beschreiben ihren Abschnitt → Bestätigung mit Beleg in abnahme.md
- **SEO-08** Inhaltsbilder als `<img>` mit beschreibendem alt und sprechendem Dateinamen → Bestätigung mit Beleg in abnahme.md
- **SEO-09** Texte konkret und eigen (Leistungen, Ablauf, Team, Einzugsgebiet); keine Füllsätze, keine Massen-KI-Texte; vom Kunden freigegeben → Bestätigung mit Beleg in abnahme.md
- **SEO-10** Keine Doorway-Seiten je Stadt und keine Ortslisten; Standortseiten nur für echte Standorte → Bestätigung mit Beleg in abnahme.md
- **SEO-11** Sprechende URLs (klein, Bindestriche); bestehende Adressen behalten oder per 301/308 weiterleiten → Bestätigung mit Beleg in abnahme.md
- **SEO-12** Häufige Kundenfragen (Preise, Anfahrt, Parken, Termine) sichtbar beantworten → Bestätigung mit Beleg in abnahme.md
- **LOC-01** Name, Adresse, Telefon identisch auf Website, im JSON-LD und im Google-Unternehmensprofil; Name wie auf dem Schild, ohne Keywords → Bestätigung mit Beleg in abnahme.md
- **LOC-03** Öffnungszeiten aus einer Datenquelle, im Text sichtbar und gleich im JSON-LD und im Profil; Sonderzeiten gepflegt → Bestätigung mit Beleg in abnahme.md
- **LOC-07** Ort und Leistung stehen als Text auf der Startseite (Titel, H1 oder Einleitung); Einzugsgebiet als Fließtext, keine Ortslisten → Bestätigung mit Beleg in abnahme.md
- **LOC-11** Mehrere Standorte: je Standort eine eigene Seite mit eigenen Angaben und eigenem JSON-LD (sonst „trifft nicht zu“ belegen) → Bestätigung mit Beleg in abnahme.md
- **GEO-01** Such-Crawler (Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot, Applebot) nicht sperren – weder in robots.txt noch in Cloudflare-Bot-Einstellungen → Bestätigung mit Beleg in abnahme.md
- **GEO-02** Trainings-Crawler (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended): Entscheidung des Kunden dokumentieren (Standard: zulassen) → Bestätigung mit Beleg in abnahme.md
- **GEO-05** Eindeutige Entität: gleicher Name, Adresse, Telefon auf allen Seiten und im JSON-LD; `sameAs` nur auf echte Profile → Bestätigung mit Beleg in abnahme.md
- **GEO-06** Eigene, überprüfbare Angaben (Zahlen, Erfahrung, Zertifikate, Quellen) statt Allgemeinplätzen – nur Belegtes → Bestätigung mit Beleg in abnahme.md
- **GEO-07** Häufige Kundenfragen sichtbar und direkt beantworten, ohne eine Seite je Formulierung → Bestätigung mit Beleg in abnahme.md
- **GEO-08** Keine Garantie-Aussagen zu KI-Sichtbarkeit in Seite, Angebot und Bericht → Bestätigung mit Beleg in abnahme.md
- **TEC-07** Handy und Computer zeigen dieselben Inhalte, Daten und Metadaten → Bestätigung mit Beleg in abnahme.md
- **TEC-08** Eine Hauptdomain: http → https und www/ohne per 301/308; alte Adressen per `_redirects` → Bestätigung mit Beleg in abnahme.md
- **CRO-02** Alle Kontaktwege: Telefon (`tel:+49`), E-Mail, Adresse, Formular bzw. Buchung; feste Schnellleiste auf dem Handy; Kontaktweg auf jeder Seite → Bestätigung mit Beleg in abnahme.md
- **CRO-03** Formulare: ≤ 6 sichtbare Felder, eine Spalte, sichtbare Labels, Pflichtfelder markiert, Fehler als Text, Antwortzeit genannt → Bestätigung mit Beleg in abnahme.md
- **CRO-04** Vertrauensbelege nur echt und freigegeben: Fotos von Team/Räumen/Arbeiten, Meistertitel, Zertifikate, Jahre, Referenzen → Bestätigung mit Beleg in abnahme.md
- **PERF-01** LCP-Bild/Poster im HTML, `fetchpriority="high"`, nie lazy, passende Größe per `srcset` → galerie.htm @1440px: Bild im ersten Bildschirm ist lazy: /medien/grillplatte-urfa-sofrasi-1016.webp
- **PERF-06** Bilder unterhalb des ersten Bildschirms `loading="lazy"` → galerie.htm: 1 Bilder außerhalb des ersten Bildschirms ohne loading="lazy": /medien/sofra-platte-gemischt-1016.webp
- **A11Y-01** Alles per Tastatur bedienbar, Reihenfolge logisch, Fokus sichtbar und nicht von festen Leisten verdeckt (2.1.1, 2.4.7, 2.4.11) → Bestätigung mit Beleg in abnahme.md
- **A11Y-04** Formulare: Label, Fehler als Text am Feld, `autocomplete`, keine doppelte Eingabe (3.3.7), Hilfe an gleicher Stelle (3.2.6) → Bestätigung mit Beleg in abnahme.md
- **A11Y-05** Alt-Texte beschreiben Inhalt oder Funktion; dekorative Bilder `alt=""`; jeder Link hat einen Namen → Bestätigung mit Beleg in abnahme.md
- **A11Y-08** BFSG-Einordnung mit dem Kunden dokumentieren (Verbraucher-Buchung/Shop? Kleinstunternehmen?) – keine Rechtsberatung → Bestätigung mit Beleg in abnahme.md
- **SD-03** Spezifischster zutreffender Typ (Tabelle `branchen.md`), Mehrfachtyp als Array, keine veralteten Typen → Bestätigung mit Beleg in abnahme.md
- **SD-04** Nur wahre, vom Kunden bestätigte Angaben (Preise, Zeiten, Leistungen) → Bestätigung mit Beleg in abnahme.md

Ablauf bei Fehlern: Problem dokumentieren → Ursache bestimmen → beheben → erneut prüfen → erst dann bestanden (`.claude/skills/abnahme/SKILL.md`).
