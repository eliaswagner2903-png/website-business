# Quality Gate – OSG GmbH (OSG Germany)

**Urteil: NICHT BESTANDEN** · 2026-09-30 05:13 UTC · schnelle Prüfung · 11 Seiten · Auftrag: kunden/osg-germany/auftrag.md

Muss offen: **11** (11 verschiedene Befunde) · Soll offen: 2 · nach Launch: 2 · Legende: ✓ bestanden · ✗ Fehler · ◐ Werkzeug ok oder ohne Befund, Bestätigung fehlt · ○ manuell offen · … nur mit --voll · ↻ nach Launch (Wartung) · · nicht anwendbar

## Globaler Mindeststandard (immer)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| … | GLB-01 | 320–1920 px ohne Überlauf, Tippflächen ≥ 44 px, keine Konsolenfehler, ohne JS und bei „Bewegung reduzieren“ alles sichtbar | Muss | ext-pruefen: nur mit --voll |
| ✓ | GLB-02 | Viewport `width=device-width`, keine Zoom-Sperre (`user-scalable=no`, `maximum-scale` < 2) | Muss | 404.html: viewport „width=device-width, initial-scale=1, viewport-fit=cover“; datenschutz.html: viewport „width=device-width, initial-scale=1, viewport-fit=cover“ |
| ✓ | GLB-03 | `<html lang>` gesetzt | Muss | 404.html: lang="de"; datenschutz.html: lang="de" |
| ✓ | GLB-04 | Genau eine H1 je Seite, Überschriftenebenen ohne Sprung | Muss | 404.html: 1 H1; datenschutz.html: 1 H1 |
| ✓ | GLB-05 | Jede Seite hat einen `<title>` und eine meta description (indexierte Seiten) | Muss | 404.html: Titel vorhanden; datenschutz.html: Titel vorhanden |
| ✓ | GLB-06 | Keine toten internen Links, Anker existieren, kein `href="#"`/leer/`javascript:` | Muss | 404.html: interne Links ok; datenschutz.html: interne Links ok |
| ✓ | GLB-07 | Skip-Link als erster Link, jede Seite hat einen Kontaktweg (tel:, mailto:, Kontaktseite) | Muss | 404.html: erster Link #inhalt; datenschutz.html: erster Link #inhalt |
| … | GLB-08 | Navigation funktioniert auf Handy und Computer, mit Tastatur, ohne JS; aktuelle Seite markiert | Muss | ext-pruefen: nur mit --voll; 404.html: alle Links benannt |
| ✓ | GLB-09 | Jedes `<img>` hat `alt` (dekorativ: `alt=""`) sowie `width` und `height` | Muss | 404.html: 1 Bilder mit alt; datenschutz.html: 1 Bilder mit alt |
| ✓ | GLB-10 | Bilder als WebP/AVIF, ≤ 300 KB, erstes Bild nicht lazy | Muss | 404.html: moderne Formate; datenschutz.html: moderne Formate |
| … | GLB-11 | Lighthouse mobil (Startseite): Performance ≥ 95, Barrierefreiheit, Best Practices, SEO = 100 | Muss | ext-lighthouse: nur mit --voll |
| … | GLB-12 | Gewichts-Budget des Meisterstandards eingehalten | Muss | ext-budget: nur mit --voll |
| ✓ | GLB-13 | Tests der Seite grün, html-validate ohne Fehler, Kopf-Regeln eingehalten | Muss | 4 Testdateien grün; html-validate ohne Fehler |
| ✓ | GLB-14 | Sicherheits-Header: CSP ohne `unsafe-inline`/`unsafe-eval`, HSTS, nosniff, Referrer-, Permissions-Policy, frame-ancestors | Muss | CSP, HSTS, nosniff, Referrer, Permissions, Framing gesetzt |
| ✓ | GLB-15 | Keine fremden Herkünfte (Skripte, Schriften, Bilder, iframes) und kein einwilligungspflichtiges Tracking | Muss | nur eigene Herkunft; 404.html: kein Tracking-Code |
| ✓ | GLB-16 | Kein Mixed Content (nur https-Adressen) | Muss | 404.html: nur https; datenschutz.html: nur https |
| ✓ | GLB-17 | Formulare: jedes Feld beschriftet, Honigtopf und serverseitige Prüfung | Muss | 404.html: alle Felder beschriftet; datenschutz.html: alle Felder beschriftet |
| ◐ | GLB-18 | Impressum und Datenschutz von jeder Seite verlinkt; Texte vom Kunden/Generator, nicht erfunden | Muss | datenschutz.html: Impressum und Datenschutz verlinkt; impressum.html: Impressum und Datenschutz verlinkt |
| ✓ | GLB-19 | 404-Seite und Favicon vorhanden | Muss | 404.html vorhanden; 404.html: Favicon verlinkt |
| ✗ | GLB-20 | Kein Blindtext, keine offenen `data-pruefen`-Angaben bei Abnahme | Muss | 19 offene Angaben mit data-pruefen (vor Launch vom Kunden bestätigen lassen) |
| ○ | GLB-21 | Jede Tatsache (Adresse, Zeiten, Preise, Leistungen) stammt vom Kunden; Kunde hat Texte freigegeben | Muss | in abnahme.md bestätigen |
| ✓ | GLB-22 | Hauptinhalt steht im HTML und ist ohne JavaScript vorhanden | Muss | index.html: ohne JS 7429 von 7429 Zeichen Hauptinhalt; industrieloesungen.html: ohne JS 3920 von 3920 Zeichen Hauptinhalt |
| ✓ | GLB-23 | robots.txt und sitemap.xml vorhanden, Startseite indexierbar | Muss | robots.txt ok; 7 URLs |
| ○ | GLB-24 | Sichtprüfung Handy und Computer: Meisterprüfung W1–W7 im Schnitt ≥ 4 | Muss | in abnahme.md bestätigen |

## Performance (KRITISCH)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ✓ | PERF-01 | LCP-Bild/Poster im HTML, `fetchpriority="high"`, nie lazy, passende Größe per `srcset` | Muss | index.html @390px: erster Bildschirm ohne lazy-Bilder; industrieloesungen.html @390px: erster Bildschirm ohne lazy-Bilder |
| ✓ | PERF-02 | Kein Layoutsprung: Maße für Bilder/Videos, Schriften mit `font-display` und abgestimmter Ersatzschrift | Muss | 404.html: alle Bilder mit Maßen; datenschutz.html: alle Bilder mit Maßen |
| ✓ | PERF-03 | Keine render-blockierenden Skripte im Kopf | Muss | 404.html: keine blockierenden Skripte; datenschutz.html: keine blockierenden Skripte |
| … | PERF-04 | Laborwerte Lighthouse mobil: LCP ≤ 2,5 s, CLS ≤ 0,02 (Meisterstandard; Googles Grenze „gut“ ist 0,1) | Muss | ext-cwv-labor: nur mit --voll |
| … | PERF-05 | Wenig und spätes JavaScript (Budget ≤ 60 KB), lange Tasks aufgeteilt | Muss | ext-budget: nur mit --voll |
| ✓ | PERF-06 | Bilder unterhalb des ersten Bildschirms `loading="lazy"` | Muss | index.html: Bilder unterhalb lazy; industrieloesungen.html: Bilder unterhalb lazy |
| … | PERF-07 | Schriften: WOFF2-Subset, lokal, ≤ 3 Dateien | Muss | 2 Schriften lokal mit font-display; ext-budget: nur mit --voll |
| ✓ | PERF-08 | Lange Cache-Zeiten für CSS, JS, Schriften, Medien in `_headers` | Muss | lange Cache-Zeiten für Assets gesetzt |
| … | PERF-09 | Video/3D erst nach Poster und „geladen“, pausiert außerhalb des Bildschirms, nicht bei „Daten sparen“ | Muss | ext-budget: nur mit --voll |
| ↻ | PERF-10 | Nach Launch: Feldwerte (Search Console/CrUX) im Wartungslauf prüfen, sobald Daten vorliegen | Soll | im ersten Wartungslauf prüfen und in abnahme.md belegen |

## SEO (On-Page, Inhalte) (HOCH)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ✓ | SEO-01 | Seitenstruktur aus Suchabsichten planen: je Hauptleistung eine Seite oder ein klar benannter Abschnitt; Begriffe mit dem Kunden klären | Muss | Beleg: geprüft 2026-09-30 – Seiten je Suchabsicht: Produkte (Serien mit Anker), Industrielösungen (6 Branchen mit Anker), Service (Toolmanagement, Academy, Downloads, Händler), Karriere, Kontakt; Begriffe von de.osgeurope.com übernommen |
| ✓ | SEO-02 | Titel je Seite eindeutig und beschreibend (Thema + Betrieb, bei lokalen Betrieben auf der Startseite + Ort), kein Keyword-Stapel | Muss | „OSG Germany – Gewindebohrer, Bohrer und Fräser aus Göppingen“; „Industrielösungen – Automotive bis Medizintechnik \| OSG“ |
| ✓ | SEO-03 | Titellänge 10–70 Zeichen (Faustregel; Google kürzt nach Gerätebreite, nennt keine Grenze) | Muss | index.html: Titel 60 Zeichen (Faustregel 10–70, Google kürzt nach Breite); industrieloesungen.html: Titel 55 Zeichen (Faustregel 10–70, Google kürzt nach Breite) |
| ✓ | SEO-04 | Meta description je indexierter Seite eindeutig, ≥ 50 Zeichen, fasst die Seite zusammen | Muss | index.html: Description 148 Zeichen; industrieloesungen.html: Description 144 Zeichen |
| ✓ | SEO-05 | H1 nennt das Seitenthema; Zwischenüberschriften beschreiben ihren Abschnitt | Muss | Beleg: geprüft 2026-09-30 – tests/seite.test.mjs „eine H1, Ebenen ohne Sprung“; H1 je Seite = Thema (Produkte: „Werkzeuge für Gewinden, Bohren und Fräsen“ usw.) |
| ✓ | SEO-06 | Jede indexierte Seite ist von mindestens einer anderen Seite verlinkt; Navigation erreicht alle Hauptseiten | Muss | industrieloesungen.html von 10 Seite(n) verlinkt; karriere.html von 10 Seite(n) verlinkt |
| ✓ | SEO-07 | Linktexte beschreiben das Ziel (kein „hier“, „mehr“, „weiter“ ohne Kontext) | Muss | 404.html: Linktexte beschreibend; datenschutz.html: Linktexte beschreibend |
| ✓ | SEO-08 | Inhaltsbilder als `<img>` mit beschreibendem alt und sprechendem Dateinamen | Muss | Beleg: geprüft 2026-09-30 – Alle Inhaltsbilder als <img> in <picture>, Dateinamen sprechend (produkte-, branchen-, bohren-, gewinden- …), alt beschreibend (bauen.mjs bild()-Aufrufe) |
| ○ | SEO-09 | Texte konkret und eigen (Leistungen, Ablauf, Team, Einzugsgebiet); keine Füllsätze, keine Massen-KI-Texte; vom Kunden freigegeben | Muss | in abnahme.md bestätigen |
| ✓ | SEO-10 | Keine Doorway-Seiten je Stadt und keine Ortslisten; Standortseiten nur für echte Standorte | Muss | Beleg: geprüft 2026-09-30 – Keine Stadt-/Ortsseiten; ein Standort (Göppingen) |
| ✓ | SEO-11 | Sprechende URLs (klein, Bindestriche); bestehende Adressen behalten oder per 301/308 weiterleiten | Muss | Beleg: geprüft 2026-09-30 – URLs klein mit Bindestrich, ohne .html (Cloudflare Pages); alte Adressen per public/_redirects 301; Shop-Pfade bleiben (auftrag.md Fremde Pfade) |
| ✓ | SEO-12 | Häufige Kundenfragen (Preise, Anfahrt, Parken, Termine) sichtbar beantworten | Muss | Beleg: geprüft 2026-09-30 – Fragen eines B2B-Einkäufers sichtbar: Welche Serie für welchen Werkstoff (Finder), Wo bestellen (Shop, EDP), Termine (Service#academy), Händler, Kontaktwege; Preise nur im Shop |
| ✓ | SEO-13 | Open Graph auf der Startseite: og:title, og:description, og:image (absolut), og:url, og:type | Kann | Open Graph vollständig |
| ○ | SEO-14 | Datum/„Stand“ nur ändern, wenn sich der Inhalt ändert; saisonale Inhalte im Abo pflegen | Kann | in abnahme.md bestätigen |

## Technical SEO (HOCH)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ✓ | TEC-01 | robots.txt erlaubt das Crawling, nennt die Sitemap absolut, enthält kein noindex | Muss | robots.txt ok |
| ✓ | TEC-02 | sitemap.xml enthält genau die indexierten Seiten (kanonische https-URLs), keine noindex-Seiten, ohne priority/changefreq | Muss | 7 URLs; Sitemap deckt alle indexierten Seiten ab |
| ✓ | TEC-03 | Jede indexierte Seite hat genau ein absolutes, selbstreferenzierendes https-Canonical auf der eigenen Domain | Muss | index.html: → https://de.osgeurope.com/; industrieloesungen.html: → https://de.osgeurope.com/industrieloesungen |
| ✓ | TEC-04 | noindex nur für Impressum, Datenschutz, Danke-, Fehler- und Abbruchseiten; Startseite nie | Muss | datenschutz.html ist noindex (gewollt); impressum.html ist noindex (gewollt) |
| ✓ | TEC-05 | Nur crawlbare Links (`<a href>`), Hauptinhalt im Ausgangs-HTML | Muss | 404.html: alle Links mit Ziel; datenschutz.html: alle Links mit Ziel |
| ✓ | TEC-06 | Unbekannte Adressen liefern die 404-Seite mit Status 404 (keine Soft-404) | Muss | 404.html vorhanden |
| ✓ | TEC-07 | Handy und Computer zeigen dieselben Inhalte, Daten und Metadaten | Muss | Beleg: geprüft 2026-09-30 – Gleiches HTML für alle Breiten (ein Generator, nur CSS-Umbrüche); Screenshots 390/1440 jury/runde-2/seiten |
| ○ | TEC-08 | Eine Hauptdomain: http → https und www/ohne per 301/308; alte Adressen per `_redirects` | Muss | in abnahme.md bestätigen |
| ✓ | TEC-09 | Semantische Struktur: header, nav, main, footer; Listen und Tabellen nur für ihren Zweck | Muss | Beleg: geprüft 2026-09-30 – header/nav/main/footer in bauen.mjs seite(); Tabellen nur für Bauteil→Werkzeug und Kennzahlen; html-validate ohne Fehler |
| ↻ | TEC-10 | Nach Launch: Search Console und Bing Webmaster Tools (Konto des Kunden), Sitemap einreichen, Indexierung prüfen | Muss | im ersten Wartungslauf prüfen und in abnahme.md belegen |
| ○ | TEC-11 | IndexNow für Bing & Co. nur als Zusatz (Google nutzt es nicht) | Kann | in abnahme.md bestätigen |

## CRO und UX (HOCH)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ✓ | CRO-01 | Ein Hauptziel je Seite festlegen; Handlungsaufforderung im ersten Bildschirm auf Handy (390 px) und Computer (1440 px) | Muss | @390px im ersten Bildschirm: Anwendungsberatung anfragen \| Anrufen \| Beratung anfragen; @1440px im ersten Bildschirm: +49 7161 6064‑0 \| Kontakt \| Beratung anfragen |
| ✓ | CRO-02 | Alle Kontaktwege: Telefon (`tel:+49`), E-Mail, Adresse, Formular bzw. Buchung; feste Schnellleiste auf dem Handy; Kontaktweg auf jeder Seite | Muss | Beleg: geprüft 2026-09-30 – Telefon tel:+4971616064-0, E-Mail, Adresse, Formular; Schnellleiste auf dem Handy; Kontaktweg auf jeder Seite (qualitaet.mjs kontakt-jede-seite ✓) |
| ✓ | CRO-03 | Formulare: ≤ 6 sichtbare Felder, eine Spalte, sichtbare Labels, Pflichtfelder markiert, Fehler als Text, Antwortzeit genannt | Muss | Beleg: geprüft 2026-09-30 – 6 sichtbare Felder (Name, Firma, E-Mail, Telefon optional, Anliegen, Nachricht), eine Spalte, Labels, * markiert, Fehler als Text am Feld (seite.js), Antwortweg genannt |
| ○ | CRO-04 | Vertrauensbelege nur echt und freigegeben: Fotos von Team/Räumen/Arbeiten, Meistertitel, Zertifikate, Jahre, Referenzen | Muss | in abnahme.md bestätigen |
| ✓ | CRO-05 | Offene Angaben: Preise oder Preisrahmen (mit Zustimmung des Kunden), Ablauf, Einzugsgebiet, Zeiten | Muss | Beleg: geprüft 2026-09-30 – Preise bewusst nicht auf der Seite (B2B, Staffel/Konto im Shop); Ablauf Toolmanagement, Termine, Händler offen genannt |
| ✓ | CRO-06 | Bewertungen/Stimmen nur echt, mit Quelle und Hinweis, ob und wie die Echtheit geprüft wird (§ 5b UWG); Link zum Profil statt Fremd-Widget | Muss | Beleg: geprüft 2026-09-30 – Keine Bewertungen/Stimmen; ein Anwenderbericht mit Quelle (Fachmagazin) und Link |
| ✓ | CRO-07 | Navigation kurz und eindeutig benannt (Faustregel ≤ 7 Hauptpunkte); jede Seite endet mit dem nächsten Schritt | Muss | Beleg: geprüft 2026-09-30 – 6 Hauptpunkte + „Beratung anfragen“; jede Seite endet mit CTA-Band |
| ✓ | CRO-08 | Lesbar gegliedert: Kerninfo zuerst, kurze Absätze, Zwischenüberschriften, Listen | Muss | Beleg: geprüft 2026-09-30 – Kerninfo zuerst (Hero, Seitenköpfe), kurze Absätze, Tabellen, Listen; Screenshots jury/runde-2/seiten |
| ✓ | CRO-09 | Zustände gestaltet: Fokus, Fehler, Senden, Danke-Seite mit nächstem Schritt | Muss | Beleg: geprüft 2026-09-30 – Fokus (zustand-fokus-tastatur-1440.png), Fehler am Feld (zustand-formular-fehler-1440.png), „Wird gesendet …“, nachricht-gesendet.html mit nächsten Schritten, Finder-Leerzustand |
| ✓ | CRO-10 | Hauptknopf mit Verb und deutlichem Kontrast zur Umgebung (keine „Wunderfarbe“) | Muss | Beleg: geprüft 2026-09-30 – „Beratung anfragen“/„Werkzeug finden“ mit Verb, Akzent #00559d auf Weiß 7,5:1 |
| ○ | CRO-11 | Nach Launch: Anfragen und Anruf-Klicks zählen (siehe `analytics.md`) und nach 4–8 Wochen mit dem Kunden auswerten | Kann | in abnahme.md bestätigen |

## Barrierefreiheit (HOCH)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ✓ | A11Y-01 | Alles per Tastatur bedienbar, Reihenfolge logisch, Fokus sichtbar und nicht von festen Leisten verdeckt (2.1.1, 2.4.7, 2.4.11) | Muss | Beleg: geprüft 2026-09-30 – Tastaturweg mit Sprunglink, Fokus sichtbar; scroll-padding oben (Kopf) und unten (Schnellleiste, Handy) – Fokus-Test in Playwright: Firma/E-Mail/Telefon über der Leiste |
| … | A11Y-02 | Kontrast Text ≥ 4,5:1 (groß 3:1), Bedienelemente ≥ 3:1 – in jedem Farbschema | Muss | ext-lighthouse: nur mit --voll |
| … | A11Y-03 | Zoom 200 % und Reflow bei 320 px ohne Verlust (1.4.4, 1.4.10), keine Zoom-Sperre | Muss | ext-pruefen: nur mit --voll; 404.html: viewport „width=device-width, initial-scale=1, viewport-fit=cover“ |
| ✓ | A11Y-04 | Formulare: Label, Fehler als Text am Feld, `autocomplete`, keine doppelte Eingabe (3.3.7), Hilfe an gleicher Stelle (3.2.6) | Muss | Beleg: geprüft 2026-09-30 – Labels, autocomplete (name, organization, email, tel), Fehlertext am Feld mit aria-describedby/aria-invalid, keine doppelte Eingabe, Hilfe unter Nachricht |
| ✓ | A11Y-05 | Alt-Texte beschreiben Inhalt oder Funktion; dekorative Bilder `alt=""`; jeder Link hat einen Namen | Muss | Beleg: geprüft 2026-09-30 – alt beschreibend, Logo mit alt, externe Links mit unsichtbarem Hinweis; qualitaet.mjs link-namen ✓ |
| … | A11Y-06 | Bewegung: „Bewegung reduzieren“ respektiert, nichts blinkt, Autoplay-Video pausierbar (2.2.2, 2.3.1) | Muss | ext-pruefen: nur mit --voll |
| ○ | A11Y-07 | Screenreader-Stichprobe: Landmarken, Überschriftenliste, Formular verständlich | Muss | in abnahme.md bestätigen |
| ○ | A11Y-08 | BFSG-Einordnung mit dem Kunden dokumentieren (Verbraucher-Buchung/Shop? Kleinstunternehmen?) – keine Rechtsberatung | Muss | in abnahme.md bestätigen |
| ○ | A11Y-09 | Fremdsprachige Passagen mit `lang`, verständliche Sprache | Kann | in abnahme.md bestätigen |

## Sicherheit (HOCH)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ✓ | SEC-01 | `/sicherheit` (Agent security-auditor) ohne Mängel KRIT/HOCH | Muss | Beleg: geprüft 2026-09-30 – Sicherheitsprüfung 30.09.2026: keine KRIT/HOCH; MITTEL (wrangler.toml-Platzhalter, Stripe-Reste) behoben |
| ✓ | SEC-02 | CSP streng: `default-src 'self'`, `object-src 'none'`, `base-uri`, `form-action` gesetzt | Muss | CSP streng |
| ◐ | SEC-03 | Formulare: Origin-Prüfung, Längengrenzen, Honigtopf, Rate-Limit-Regel in Cloudflare | Muss | 4 Testdateien grün; kontakt.html: Honigtopf vorhanden |
| ✓ | SEC-04 | Zahlungen nur über Stripe Checkout, Preis serverseitig, Webhook mit Signaturprüfung (falls Zahlung) | Muss | Beleg: geprüft 2026-09-30 – trifft nicht zu: keine Zahlungen, Shop bleibt auf de.osgeurope.com |
| ✓ | SEC-05 | Keine Geheimnisse in `public/`, `functions/` oder im Repo | Muss | keine Geheimnisse gefunden |
| ✓ | SEC-06 | Functions-Antworten setzen eigene Sicherheits-Header (`_headers` gilt dort nicht) | Muss | Beleg: geprüft 2026-09-30 – functions/_lib/antwort.js setzt eigene Header (CSP der Fehlerseite, Cache-Control no-store) |
| ✓ | SEC-07 | Abhängigkeiten minimal, `npm audit --omit=dev` ohne hoch/kritisch | Muss | Beleg: geprüft 2026-09-30 – keine Produktionsabhängigkeiten; devDependency nur html-validate (Fontsource-Reste entfernt) |
| ✗ | SEC-08 | `/.well-known/security.txt` mit Contact und Expires | Kann | /.well-known/security.txt fehlt |
| ○ | SEC-09 | Bei Spam: Turnstile mit serverseitiger Prüfung (Widget allein schützt nicht) | Kann | in abnahme.md bestätigen |

## Strukturierte Daten (MITTEL)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ✓ | SD-01 | Strukturierte Daten nur als JSON-LD, syntaktisch gültig, `@context` schema.org, Startseite mit Typ, keine Eigenbewertungen des eigenen Betriebs (wie LOC-09) | Muss | index.html: JSON-LD gültig; Startseite: Organization, PostalAddress, WebSite |
| ✓ | SD-02 | Jeder Textwert im Markup (auch in Arrays) steht sichtbar auf derselben Seite | Muss | index.html: alle JSON-LD-Werte sichtbar |
| ✓ | SD-03 | Spezifischster zutreffender Typ (Tabelle `branchen.md`), Mehrfachtyp als Array, keine veralteten Typen | Muss | Beleg: geprüft 2026-09-30 – Organization laut wissen/fachgebiete/branchen.md „Hersteller und Industrie (B2B)“; kein Laden mit Kundenverkehr |
| ○ | SD-04 | Nur wahre, vom Kunden bestätigte Angaben (Preise, Zeiten, Leistungen) | Muss | in abnahme.md bestätigen |
| ✓ | SD-05 | Pflicht- und empfohlene Eigenschaften je Typ laut Google-Doku; lieber weniger, aber vollständig | Soll | Beleg: geprüft 2026-09-30 – Organization: name, url, logo, address, telephone, email, sameAs; Öffnungszeiten entfallen (kein LocalBusiness) |
| ✓ | SD-06 | WebSite (name, url) nur auf der Startseite; Organization-Angaben (logo ≥ 112 px, sameAs nur echte Profile) | Soll | Beleg: geprüft 2026-09-30 – WebSite nur auf der Startseite (tests/seite.test.mjs „JSON-LD nur Startseite“); logo = SVG 171×60 – Hinweis: Google verlangt Raster ≥ 112 px, vor Launch PNG-Logo ergänzen |
| ✓ | SD-08 | Keine eingestellten Rich-Result-Typen versprechen (FAQ, HowTo); FAQPage nur, wenn die Fragen sichtbar sind | Soll | Beleg: geprüft 2026-09-30 – Keine FAQPage/HowTo |
| ○ | SD-09 | Validierung: Schema Markup Validator auf den Code, nach Launch Rich Results Test auf die URL | Soll | in abnahme.md bestätigen |

## GEO / KI-Suche (MITTEL)

| | ID | Regel | Verb. | Befund |
|---|---|---|---|---|
| ✓ | GEO-01 | Such-Crawler (Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot, Applebot) nicht sperren – weder in robots.txt noch in Cloudflare-Bot-Einstellungen | Muss | Beleg: geprüft 2026-09-30 – public/robots.txt: alle erlaubt (qualitaet.mjs ki-crawler ✓); Cloudflare-Bot-Einstellungen beim Launch prüfen |
| ○ | GEO-02 | Trainings-Crawler (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended): Entscheidung des Kunden dokumentieren (Standard: zulassen) | Soll | in abnahme.md bestätigen |
| ✓ | GEO-03 | Snippets erlaubt: kein nosnippet, max-snippet:0 oder data-nosnippet auf dem Hauptinhalt | Muss | index.html: Snippets erlaubt; industrieloesungen.html: Snippets erlaubt |
| ✓ | GEO-04 | Kernfakten (Name, Leistung, Ort, Kontakt, Zeiten) als Text im HTML, nicht nur in Bildern, PDFs, Tabs oder per JS | Muss | Startseite nennt OSG GmbH, Göppingen als Text; index.html: ohne JS 7429 von 7429 Zeichen Hauptinhalt |
| ✓ | GEO-05 | Eindeutige Entität: gleicher Name, Adresse, Telefon auf allen Seiten und im JSON-LD; `sameAs` nur auf echte Profile | Soll | Beleg: geprüft 2026-09-30 – Name, Adresse, Telefon aus einer Quelle (seite.json) auf allen Seiten und im JSON-LD (Test „Fakten gleich auf allen Seiten“); sameAs = Profile, die de.osgeurope.com selbst verlinkt |
| ✓ | GEO-06 | Eigene, überprüfbare Angaben (Zahlen, Erfahrung, Zertifikate, Quellen) statt Allgemeinplätzen – nur Belegtes | Soll | Beleg: geprüft 2026-09-30 – Zahlen mit Quelle: 1938, 33 Länder, 7.173 Mitarbeitende, Anwenderbericht 150→600 min mit Quellenlink, ISO 9001/14001 |
| ✓ | GEO-07 | Häufige Kundenfragen sichtbar und direkt beantworten, ohne eine Seite je Formulierung | Soll | Beleg: geprüft 2026-09-30 – siehe SEO-12; keine Seite je Formulierung |
| ✓ | GEO-08 | Keine Garantie-Aussagen zu KI-Sichtbarkeit in Seite, Angebot und Bericht | Muss | Beleg: geprüft 2026-09-30 – keine Aussagen zu KI-Sichtbarkeit auf der Seite |

## Zu beheben (Muss)

- **GLB-18** Impressum und Datenschutz von jeder Seite verlinkt; Texte vom Kunden/Generator, nicht erfunden → Bestätigung mit Beleg in abnahme.md
- **GLB-20** Kein Blindtext, keine offenen `data-pruefen`-Angaben bei Abnahme → 19 offene Angaben mit data-pruefen (vor Launch vom Kunden bestätigen lassen)
- **GLB-21** Jede Tatsache (Adresse, Zeiten, Preise, Leistungen) stammt vom Kunden; Kunde hat Texte freigegeben → Bestätigung mit Beleg in abnahme.md
- **GLB-24** Sichtprüfung Handy und Computer: Meisterprüfung W1–W7 im Schnitt ≥ 4 → Bestätigung mit Beleg in abnahme.md
- **SEO-09** Texte konkret und eigen (Leistungen, Ablauf, Team, Einzugsgebiet); keine Füllsätze, keine Massen-KI-Texte; vom Kunden freigegeben → Bestätigung mit Beleg in abnahme.md
- **TEC-08** Eine Hauptdomain: http → https und www/ohne per 301/308; alte Adressen per `_redirects` → Bestätigung mit Beleg in abnahme.md
- **SD-04** Nur wahre, vom Kunden bestätigte Angaben (Preise, Zeiten, Leistungen) → Bestätigung mit Beleg in abnahme.md
- **CRO-04** Vertrauensbelege nur echt und freigegeben: Fotos von Team/Räumen/Arbeiten, Meistertitel, Zertifikate, Jahre, Referenzen → Bestätigung mit Beleg in abnahme.md
- **A11Y-07** Screenreader-Stichprobe: Landmarken, Überschriftenliste, Formular verständlich → Bestätigung mit Beleg in abnahme.md
- **A11Y-08** BFSG-Einordnung mit dem Kunden dokumentieren (Verbraucher-Buchung/Shop? Kleinstunternehmen?) – keine Rechtsberatung → Bestätigung mit Beleg in abnahme.md
- **SEC-03** Formulare: Origin-Prüfung, Längengrenzen, Honigtopf, Rate-Limit-Regel in Cloudflare → Bestätigung mit Beleg in abnahme.md

Ablauf bei Fehlern: Problem dokumentieren → Ursache bestimmen → beheben → erneut prüfen → erst dann bestanden (`.claude/skills/abnahme/SKILL.md`).
