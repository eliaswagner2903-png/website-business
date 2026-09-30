# Pflichtenheft – OSG GmbH (OSG Germany)

> Erzeugt von `node werkzeuge/auftrag-lesen.mjs` aus dem Kundenauftrag. Nicht von Hand ändern: Auftrag ändern und neu erzeugen.

| Angabe | Wert |
|---|---|
| Kunde | OSG GmbH (OSG Germany) |
| Branche | Hersteller von Präzisions-Zerspanungswerkzeugen (B2B, Industrie) → schema.org `Organization` |
| Ort | Göppingen |
| Domain | de.osgeurope.com |
| Funktionen | Kontaktformular (Anwendungsberatung / Angebot), Werkzeugfinder (Bearbeitung × Werkstoff → Serie), |
| Besondere Wünsche | Komplett neu von Grund auf, High-End, „anspruchsvolle Jury“. Onlineshop (Konto, Warenkorb, Schnellbestellung per EDP) bleibt im bestehenden Shop und wird nur verlinkt. Fakten ausschließlich von de.osgeurope.com (Stand 2026-09-30). |
| Weitere Angaben | Produktbereiche mit Serien, Industrielösungen, Service (Micro Toolmanagement, OSG Academy, Downloads), Events, Karriere |

## Aktive Fachgebiete

| Fachgebiet | Priorität | Herkunft | Muss | Soll | Kann |
|---|---|---|---|---|---|
| Globaler Mindeststandard | IMMER | nicht abwählbar | 24 | – | – |
| Performance | KRITISCH | Auftrag | 9 | 1 | 0 |
| SEO (On-Page, Inhalte) | HOCH | Auftrag | 12 | 0 | 2 |
| Technical SEO | HOCH | Auftrag | 10 | 0 | 1 |
| CRO und UX | HOCH | Auftrag | 10 | 0 | 1 |
| Barrierefreiheit | HOCH | Auftrag | 8 | 0 | 1 |
| Sicherheit | HOCH | Zahlung/Login im Auftrag → mindestens HOCH | 7 | 0 | 2 |
| Strukturierte Daten | MITTEL | Auftrag | 4 | 4 | 0 |
| GEO / KI-Suche | MITTEL | Auftrag | 4 | 4 | 0 |

Nicht bestellt: Local SEO, Analytics und Messung (nur der globale Standard gilt).

## Branche: Hersteller und Industrie (B2B)

- schema.org-Typ: `Organization`
- Pflichtinhalte: Produkte/Serien mit technischen Daten, Anwendungen/Branchen, Ansprechpartner oder Vertrieb, Downloads (Katalog, Zertifikate), Händler
- Hinweise: ohne Laden mit Kundenverkehr: `Organization` statt LocalBusiness, keine Öffnungszeiten im JSON-LD (Organization hat keine); Shop/Portal nur verlinken

## Vor dem Bauen lesen

- `wissen/fachgebiete/README.md`
- `wissen/fachgebiete/GLOBAL.md`
- `wissen/fachgebiete/performance.md`
- `wissen/fachgebiete/seo.md`
- `wissen/fachgebiete/technical-seo.md`
- `wissen/fachgebiete/cro.md`
- `wissen/fachgebiete/accessibility.md`
- `wissen/fachgebiete/sicherheit.md`
- `wissen/fachgebiete/structured-data.md`
- `wissen/fachgebiete/geo.md`

## Planen (Struktur, Inhalte, Daten)

| ID | Regel | Verbindlich | Art | Auch |
|---|---|---|---|---|
| GLB-04 | Genau eine H1 je Seite, Überschriftenebenen ohne Sprung | Muss | AUTO | Bauen |
| GLB-05 | Jede Seite hat einen `<title>` und eine meta description (indexierte Seiten) | Muss | AUTO | Bauen |
| GLB-15 | Keine fremden Herkünfte (Skripte, Schriften, Bilder, iframes) und kein einwilligungspflichtiges Tracking | Muss | AUTO | Bauen |
| GLB-18 | Impressum und Datenschutz von jeder Seite verlinkt; Texte vom Kunden/Generator, nicht erfunden | Muss | SEMI-AUTO | Bauen, Abnahme |
| GLB-21 | Jede Tatsache (Adresse, Zeiten, Preise, Leistungen) stammt vom Kunden; Kunde hat Texte freigegeben | Muss | MANUAL | Abnahme |
| A11Y-08 | BFSG-Einordnung mit dem Kunden dokumentieren (Verbraucher-Buchung/Shop? Kleinstunternehmen?) – keine Rechtsberatung | Muss | MANUAL | – |
| CRO-01 | Ein Hauptziel je Seite festlegen; Handlungsaufforderung im ersten Bildschirm auf Handy (390 px) und Computer (1440 px) | Muss | AUTO | Bauen |
| CRO-04 | Vertrauensbelege nur echt und freigegeben: Fotos von Team/Räumen/Arbeiten, Meistertitel, Zertifikate, Jahre, Referenzen | Muss | MANUAL | – |
| CRO-05 | Offene Angaben: Preise oder Preisrahmen (mit Zustimmung des Kunden), Ablauf, Einzugsgebiet, Zeiten | Muss | MANUAL | – |
| CRO-06 | Bewertungen/Stimmen nur echt, mit Quelle und Hinweis, ob und wie die Echtheit geprüft wird (§ 5b UWG); Link zum Profil statt Fremd-Widget | Muss | MANUAL | Bauen |
| CRO-07 | Navigation kurz und eindeutig benannt (Faustregel ≤ 7 Hauptpunkte); jede Seite endet mit dem nächsten Schritt | Muss | MANUAL | – |
| CRO-08 | Lesbar gegliedert: Kerninfo zuerst, kurze Absätze, Zwischenüberschriften, Listen | Muss | MANUAL | – |
| SEO-01 | Seitenstruktur aus Suchabsichten planen: je Hauptleistung eine Seite oder ein klar benannter Abschnitt; Begriffe mit dem Kunden klären | Muss | MANUAL | – |
| SEO-02 | Titel je Seite eindeutig und beschreibend (Thema + Betrieb, bei lokalen Betrieben auf der Startseite + Ort), kein Keyword-Stapel | Muss | AUTO | Bauen |
| SEO-05 | H1 nennt das Seitenthema; Zwischenüberschriften beschreiben ihren Abschnitt | Muss | SEMI-AUTO | Bauen |
| SEO-06 | Jede indexierte Seite ist von mindestens einer anderen Seite verlinkt; Navigation erreicht alle Hauptseiten | Muss | AUTO | Bauen |
| SEO-09 | Texte konkret und eigen (Leistungen, Ablauf, Team, Einzugsgebiet); keine Füllsätze, keine Massen-KI-Texte; vom Kunden freigegeben | Muss | MANUAL | – |
| SEO-10 | Keine Doorway-Seiten je Stadt und keine Ortslisten; Standortseiten nur für echte Standorte | Muss | MANUAL | – |
| SEO-11 | Sprechende URLs (klein, Bindestriche); bestehende Adressen behalten oder per 301/308 weiterleiten | Muss | MANUAL | – |
| SEO-12 | Häufige Kundenfragen (Preise, Anfahrt, Parken, Termine) sichtbar beantworten | Muss | MANUAL | – |
| TEC-08 | Eine Hauptdomain: http → https und www/ohne per 301/308; alte Adressen per `_redirects` | Muss | MANUAL | nach Launch |
| GEO-04 | Kernfakten (Name, Leistung, Ort, Kontakt, Zeiten) als Text im HTML, nicht nur in Bildern, PDFs, Tabs oder per JS | Muss | AUTO | Bauen |
| GEO-08 | Keine Garantie-Aussagen zu KI-Sichtbarkeit in Seite, Angebot und Bericht | Muss | MANUAL | Abnahme |
| SD-03 | Spezifischster zutreffender Typ (Tabelle `branchen.md`), Mehrfachtyp als Array, keine veralteten Typen | Muss | SEMI-AUTO | – |
| SD-04 | Nur wahre, vom Kunden bestätigte Angaben (Preise, Zeiten, Leistungen) | Muss | MANUAL | – |
| GEO-02 | Trainings-Crawler (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended): Entscheidung des Kunden dokumentieren (Standard: zulassen) | Soll | MANUAL | – |
| GEO-06 | Eigene, überprüfbare Angaben (Zahlen, Erfahrung, Zertifikate, Quellen) statt Allgemeinplätzen – nur Belegtes | Soll | MANUAL | – |
| GEO-07 | Häufige Kundenfragen sichtbar und direkt beantworten, ohne eine Seite je Formulierung | Soll | MANUAL | – |
| SD-08 | Keine eingestellten Rich-Result-Typen versprechen (FAQ, HowTo); FAQPage nur, wenn die Fragen sichtbar sind | Soll | MANUAL | – |

## Bauen (Code, Markup, Assets)

| ID | Regel | Verbindlich | Art | Auch |
|---|---|---|---|---|
| GLB-01 | 320–1920 px ohne Überlauf, Tippflächen ≥ 44 px, keine Konsolenfehler, ohne JS und bei „Bewegung reduzieren“ alles sichtbar | Muss | AUTO | Abnahme |
| GLB-02 | Viewport `width=device-width`, keine Zoom-Sperre (`user-scalable=no`, `maximum-scale` < 2) | Muss | AUTO | – |
| GLB-03 | `<html lang>` gesetzt | Muss | AUTO | – |
| GLB-06 | Keine toten internen Links, Anker existieren, kein `href="#"`/leer/`javascript:` | Muss | AUTO | Abnahme |
| GLB-07 | Skip-Link als erster Link, jede Seite hat einen Kontaktweg (tel:, mailto:, Kontaktseite) | Muss | AUTO | – |
| GLB-08 | Navigation funktioniert auf Handy und Computer, mit Tastatur, ohne JS; aktuelle Seite markiert | Muss | SEMI-AUTO | Abnahme |
| GLB-09 | Jedes `<img>` hat `alt` (dekorativ: `alt=""`) sowie `width` und `height` | Muss | AUTO | – |
| GLB-10 | Bilder als WebP/AVIF, ≤ 300 KB, erstes Bild nicht lazy | Muss | AUTO | – |
| GLB-13 | Tests der Seite grün, html-validate ohne Fehler, Kopf-Regeln eingehalten | Muss | AUTO | Abnahme |
| GLB-14 | Sicherheits-Header: CSP ohne `unsafe-inline`/`unsafe-eval`, HSTS, nosniff, Referrer-, Permissions-Policy, frame-ancestors | Muss | AUTO | – |
| GLB-16 | Kein Mixed Content (nur https-Adressen) | Muss | AUTO | – |
| GLB-17 | Formulare: jedes Feld beschriftet, Honigtopf und serverseitige Prüfung | Muss | AUTO | – |
| GLB-19 | 404-Seite und Favicon vorhanden | Muss | AUTO | – |
| GLB-22 | Hauptinhalt steht im HTML und ist ohne JavaScript vorhanden | Muss | AUTO | – |
| GLB-23 | robots.txt und sitemap.xml vorhanden, Startseite indexierbar | Muss | AUTO | – |
| PERF-01 | LCP-Bild/Poster im HTML, `fetchpriority="high"`, nie lazy, passende Größe per `srcset` | Muss | AUTO | – |
| PERF-02 | Kein Layoutsprung: Maße für Bilder/Videos, Schriften mit `font-display` und abgestimmter Ersatzschrift | Muss | AUTO | – |
| PERF-03 | Keine render-blockierenden Skripte im Kopf | Muss | AUTO | – |
| PERF-05 | Wenig und spätes JavaScript (Budget ≤ 60 KB), lange Tasks aufgeteilt | Muss | SEMI-AUTO | – |
| PERF-06 | Bilder unterhalb des ersten Bildschirms `loading="lazy"` | Muss | AUTO | – |
| PERF-07 | Schriften: WOFF2-Subset, lokal, ≤ 3 Dateien | Muss | SEMI-AUTO | – |
| PERF-08 | Lange Cache-Zeiten für CSS, JS, Schriften, Medien in `_headers` | Muss | AUTO | – |
| PERF-09 | Video/3D erst nach Poster und „geladen“, pausiert außerhalb des Bildschirms, nicht bei „Daten sparen“ | Muss | SEMI-AUTO | – |
| A11Y-01 | Alles per Tastatur bedienbar, Reihenfolge logisch, Fokus sichtbar und nicht von festen Leisten verdeckt (2.1.1, 2.4.7, 2.4.11) | Muss | MANUAL | Abnahme |
| A11Y-02 | Kontrast Text ≥ 4,5:1 (groß 3:1), Bedienelemente ≥ 3:1 – in jedem Farbschema | Muss | SEMI-AUTO | – |
| A11Y-04 | Formulare: Label, Fehler als Text am Feld, `autocomplete`, keine doppelte Eingabe (3.3.7), Hilfe an gleicher Stelle (3.2.6) | Muss | SEMI-AUTO | – |
| A11Y-05 | Alt-Texte beschreiben Inhalt oder Funktion; dekorative Bilder `alt=""`; jeder Link hat einen Namen | Muss | SEMI-AUTO | – |
| A11Y-06 | Bewegung: „Bewegung reduzieren“ respektiert, nichts blinkt, Autoplay-Video pausierbar (2.2.2, 2.3.1) | Muss | SEMI-AUTO | – |
| CRO-02 | Alle Kontaktwege: Telefon (`tel:+49`), E-Mail, Adresse, Formular bzw. Buchung; feste Schnellleiste auf dem Handy; Kontaktweg auf jeder Seite | Muss | SEMI-AUTO | – |
| CRO-03 | Formulare: ≤ 6 sichtbare Felder, eine Spalte, sichtbare Labels, Pflichtfelder markiert, Fehler als Text, Antwortzeit genannt | Muss | SEMI-AUTO | – |
| CRO-09 | Zustände gestaltet: Fokus, Fehler, Senden, Danke-Seite mit nächstem Schritt | Muss | MANUAL | – |
| CRO-10 | Hauptknopf mit Verb und deutlichem Kontrast zur Umgebung (keine „Wunderfarbe“) | Muss | MANUAL | – |
| SEC-02 | CSP streng: `default-src 'self'`, `object-src 'none'`, `base-uri`, `form-action` gesetzt | Muss | AUTO | – |
| SEC-03 | Formulare: Origin-Prüfung, Längengrenzen, Honigtopf, Rate-Limit-Regel in Cloudflare | Muss | SEMI-AUTO | – |
| SEC-04 | Zahlungen nur über Stripe Checkout, Preis serverseitig, Webhook mit Signaturprüfung (falls Zahlung) | Muss | SEMI-AUTO | – |
| SEC-05 | Keine Geheimnisse in `public/`, `functions/` oder im Repo | Muss | AUTO | – |
| SEC-06 | Functions-Antworten setzen eigene Sicherheits-Header (`_headers` gilt dort nicht) | Muss | SEMI-AUTO | – |
| SEO-03 | Titellänge 10–70 Zeichen (Faustregel; Google kürzt nach Gerätebreite, nennt keine Grenze) | Muss | AUTO | – |
| SEO-04 | Meta description je indexierter Seite eindeutig, ≥ 50 Zeichen, fasst die Seite zusammen | Muss | AUTO | – |
| SEO-07 | Linktexte beschreiben das Ziel (kein „hier“, „mehr“, „weiter“ ohne Kontext) | Muss | AUTO | – |
| SEO-08 | Inhaltsbilder als `<img>` mit beschreibendem alt und sprechendem Dateinamen | Muss | SEMI-AUTO | – |
| TEC-01 | robots.txt erlaubt das Crawling, nennt die Sitemap absolut, enthält kein noindex | Muss | AUTO | – |
| TEC-02 | sitemap.xml enthält genau die indexierten Seiten (kanonische https-URLs), keine noindex-Seiten, ohne priority/changefreq | Muss | AUTO | – |
| TEC-03 | Jede indexierte Seite hat genau ein absolutes, selbstreferenzierendes https-Canonical auf der eigenen Domain | Muss | AUTO | – |
| TEC-04 | noindex nur für Impressum, Datenschutz, Danke-, Fehler- und Abbruchseiten; Startseite nie | Muss | AUTO | – |
| TEC-05 | Nur crawlbare Links (`<a href>`), Hauptinhalt im Ausgangs-HTML | Muss | AUTO | – |
| TEC-06 | Unbekannte Adressen liefern die 404-Seite mit Status 404 (keine Soft-404) | Muss | AUTO | – |
| TEC-07 | Handy und Computer zeigen dieselben Inhalte, Daten und Metadaten | Muss | MANUAL | – |
| TEC-09 | Semantische Struktur: header, nav, main, footer; Listen und Tabellen nur für ihren Zweck | Muss | SEMI-AUTO | – |
| GEO-01 | Such-Crawler (Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot, Applebot) nicht sperren – weder in robots.txt noch in Cloudflare-Bot-Einstellungen | Muss | SEMI-AUTO | Abnahme |
| GEO-03 | Snippets erlaubt: kein nosnippet, max-snippet:0 oder data-nosnippet auf dem Hauptinhalt | Muss | AUTO | – |
| SD-01 | Strukturierte Daten nur als JSON-LD, syntaktisch gültig, `@context` schema.org, Startseite mit Typ, keine Eigenbewertungen des eigenen Betriebs (wie LOC-09) | Muss | AUTO | – |
| SD-02 | Jeder Textwert im Markup (auch in Arrays) steht sichtbar auf derselben Seite | Muss | AUTO | – |
| GEO-05 | Eindeutige Entität: gleicher Name, Adresse, Telefon auf allen Seiten und im JSON-LD; `sameAs` nur auf echte Profile | Soll | SEMI-AUTO | – |
| SD-05 | Pflicht- und empfohlene Eigenschaften je Typ laut Google-Doku; lieber weniger, aber vollständig | Soll | SEMI-AUTO | – |
| SD-06 | WebSite (name, url) nur auf der Startseite; Organization-Angaben (logo ≥ 112 px, sameAs nur echte Profile) | Soll | MANUAL | – |

## Abnahme (Prüfen und Belegen)

| ID | Regel | Verbindlich | Art | Auch |
|---|---|---|---|---|
| GLB-11 | Lighthouse mobil (Startseite): Performance ≥ 95, Barrierefreiheit, Best Practices, SEO = 100 | Muss | AUTO | – |
| GLB-12 | Gewichts-Budget des Meisterstandards eingehalten | Muss | AUTO | – |
| GLB-20 | Kein Blindtext, keine offenen `data-pruefen`-Angaben bei Abnahme | Muss | AUTO | – |
| GLB-24 | Sichtprüfung Handy und Computer: Meisterprüfung W1–W7 im Schnitt ≥ 4 | Muss | MANUAL | – |
| PERF-04 | Laborwerte Lighthouse mobil: LCP ≤ 2,5 s, CLS ≤ 0,02 (Meisterstandard; Googles Grenze „gut“ ist 0,1) | Muss | AUTO | – |
| A11Y-03 | Zoom 200 % und Reflow bei 320 px ohne Verlust (1.4.4, 1.4.10), keine Zoom-Sperre | Muss | SEMI-AUTO | – |
| A11Y-07 | Screenreader-Stichprobe: Landmarken, Überschriftenliste, Formular verständlich | Muss | MANUAL | – |
| SEC-01 | `/sicherheit` (Agent security-auditor) ohne Mängel KRIT/HOCH | Muss | MANUAL | – |
| SEC-07 | Abhängigkeiten minimal, `npm audit --omit=dev` ohne hoch/kritisch | Muss | MANUAL | – |
| SD-09 | Validierung: Schema Markup Validator auf den Code, nach Launch Rich Results Test auf die URL | Soll | MANUAL | – |

## Nach Launch (erster Wartungslauf, blockiert die Abnahme nicht)

| ID | Regel | Verbindlich | Art | Auch |
|---|---|---|---|---|
| TEC-10 | Nach Launch: Search Console und Bing Webmaster Tools (Konto des Kunden), Sitemap einreichen, Indexierung prüfen | Muss | MANUAL | – |
| PERF-10 | Nach Launch: Feldwerte (Search Console/CrUX) im Wartungslauf prüfen, sobald Daten vorliegen | Soll | MANUAL | – |

## Kann (nur wenn es ohne Mehraufwand geht)

- SEO-13: Open Graph auf der Startseite: og:title, og:description, og:image (absolut), og:url, og:type
- SEO-14: Datum/„Stand“ nur ändern, wenn sich der Inhalt ändert; saisonale Inhalte im Abo pflegen
- TEC-11: IndexNow für Bing & Co. nur als Zusatz (Google nutzt es nicht)
- CRO-11: Nach Launch: Anfragen und Anruf-Klicks zählen (siehe `analytics.md`) und nach 4–8 Wochen mit dem Kunden auswerten
- A11Y-09: Fremdsprachige Passagen mit `lang`, verständliche Sprache
- SEC-08: `/.well-known/security.txt` mit Contact und Expires
- SEC-09: Bei Spam: Turnstile mit serverseitiger Prüfung (Widget allein schützt nicht)

## Abnahme

Nach dem Bau: `/abnahme` (bzw. `node werkzeuge/qualitaet.mjs <ordner> --voll`). Muss-Regeln blockieren, Soll-Regeln erscheinen als Hinweis.
