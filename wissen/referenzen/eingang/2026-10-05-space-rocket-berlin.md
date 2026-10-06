# Referenzbericht: Space Rocket Berlin (space-rocket-berlin.de)

Aufgeklärt am 2026-10-05 · Auftrag A-088 (Elias) · Methode: **statisch** (HTML, CSS, Sitemap per curl, nur Öffentliches).
**Lücke:** Der Browser (Playwright) war in dieser Umgebung gesperrt (Zertifikatsprüfung des Egress-Gateways, Freigabe
verweigert). Deshalb gibt es **keine Screenshots** und **keine Messwerte** (Lighthouse, Gewicht, fps, gerenderte Maße).
Alles unten ist aus Quelltext und Stylesheets belegt. Ablage: Ordner `2026-10-05-space-rocket-berlin/` mit
`design-tokens.json` und `kundenseiten-auswertung.md`.
Regel: Referenz zum Lernen. Keine fremden Texte/Bilder/Logos für Kunden übernehmen.

## 1. Das Wichtigste

- **Es ist eine Verkaufsseite einer Agentur, kein Kundenprojekt:** ein langer Einseiter mit einem Ziel: kostenloses
  Beratungsgespräch buchen. Angebot: **799 € netto statt 1.999 €** („60 % Rabatt“), Festpreis, Geld-zurück-Garantie,
  unbegrenzte Feedbackrunden, kein Pflege-Abo (0 €, nur bei Bedarf).
- **Beweis-Stapel statt Design-Show:** 2.000+ Websites, 5,0 Sterne aus 400+ Bewertungen, „4× German Web Award“,
  20 Profis. Dazu 8 Branchen-Fallstudien und 8 weitere Kundenkacheln mit Zitat und Google-Bewertung.
- **Technik:** Baukasten „webcard“ von site-media.eu (10 von 11 Kundenseiten laufen darauf, nur dr-smusy.com auf Framer).
  Individuell wird nur über Custom-CSS/JS: eine Schrift (Encode Sans Semi Condensed), ein Blau (#0471ec), viel Weiß.
- **Schwächen:** Testseiten stehen in der öffentlichen Sitemap (dev, testtobar, testtsite, home-1, Blog-Platzhalter);
  Doppel-Startseiten; Cookiebot + Elfsight + Calendly-Popup (Cloudflare-Worker) laden fremde Skripte; „kein
  Baukasten“-Versprechen, obwohl sie selbst einen nutzen.

## 2. Struktur der Startseite (Reihenfolge)

1. Hero: 5,0 ★ · 400+ Bewertungen, H1 „Website erstellen lassen“, Claim „Wir erstellen Websites, die Ergebnisse liefern.“,
   Preis-Anker (799 € statt 1.999 €), Button „60 % Rabatt sichern“, Telefonnummer im Kopf.
2. Siegel-Zeile: 4× German Web Award, aus 2.500 Agenturen.
3. „Warum Space Rocket?“ vier Kennzahlen-Karten (20 Profis, 5,0, 4×, 100 %).
4. „So funktioniert’s“ drei Schritte, **je mit animiertem Mini-Oberflächenbild** (Kalender mit Terminwahl und
   „Termin bestätigt“, Entwurf einer Beispielseite „Praxis Lindner“, Domain/SSL/E-Mail werden „eingerichtet … online“).
5. „Unsere Arbeiten“: Branchen-Tabs (Restaurant, Beauty, Handwerk, Coach, Friseur, Event, Arzt, Immobilien), je Tab
   Problem-Satz („Ihre Gäste entscheiden online, ob …“), Lösung, drei Häkchen, Zitat, Link zur Live-Seite.
6. Sonderangebot: 8 Leistungskarten (Premium Design, Mobil, Ladezeit, Google-Sichtbarkeit, Eigene Bearbeitung,
   Stockfotos, Domain & Hosting, Datenschutz & Impressum).
7. Kundenstimmen (Kacheln mit Google-Bewertung).
8. „Der Unterschied“: Zwei-Spalten-Vergleich Space Rocket gegen „viele andere Anbieter“ (Erfahrung, Bewertungen,
   Feedbackrunden, Pflege-Abo 39–99 €/Monat, Garantie).
9. Abschluss-CTA, nochmal Ablauf, **FAQ mit 9 langen Antworten** (Preis, warum so günstig, Zusatzkosten, Inhalte,
   Dauer, Änderungen, Domain/E-Mail, selbst bearbeiten, Sicherheit).
10. Schlusskarte „Lassen auch Sie wie über 2.000 Kunden …“ mit Bewertungs-Zeile.

## 3. Unterseiten (aus Sitemap, 29 Stück)

- **Funnel:** `/bestellen` (Bestellformular), `/bestellung` (Danke), `/anfrage` (Danke), `/buchung-beratung` (Termin),
  `/buchung-calendly-danke` / `-termin` / `buchung-beratung-whatsapp` (Danke-Seiten, „Termin erfolgreich gebucht 🥳🚀“,
  Terminvorbereitung), `/logo-erstellen`, `/logo-danke`.
- **Nach dem Kauf:** `/onboarding-kundenportal`, `/cms-website-bearbeiten`, `/e-mail-einrichtung-und-nutzung`,
  `/barrierefreiheit` (Tool-Werbung). Gut: der Kunde wird auch nach dem Kauf geführt.
- **Rechtliches:** `/impressum`, `/datenschutz`, `/agb`.
- **Altlasten:** `/dev`, `/testtobar`, `/testtsite`, `/home`, `/home-1`, `/homepage-erstellen-lassen` (Variante des
  Einseiters), `/construction`, `/wissen` (leer), 6× `/blog-eintrag/blog-post-N` (Platzhalter).
- Hinweis `robots.txt`: sperrt nur `/impressum`.

## 4. Stil und Komponenten (Details in `design-tokens.json`)

- **Farbe:** Primärblau #0471ec, Text/Marine #293247, Weiß, helle Flächen #f9f9f9 / #fbf9f6 / #f2f4f7, Grün #30b85e für
  Erfolg, Gelb #f8b400 für Sterne. Der orangefarbene Baukasten-Default #f58220 ist im CSS, aber keine Markenfarbe.
- **Schrift:** Encode Sans Semi Condensed 300/400/600, selbst gehostet, `font-display: swap`. Eine Familie, Hierarchie
  nur über Gewicht und Größe.
- **Formen:** Pillen-Buttons (Radius 55 px, leichter Schatten), Karten mit Radius 20 px und sehr feinem 0,5-px-Ring plus
  weichem, tiefem Schatten (Apple-Stil), Punkte 50 %.
- **Bewegung:** Eigene Easings (u. a. `cubic-bezier(.16,1,.3,1)`, Überschwingen `.34,1.42,.64,1`), Hover .2 s. Eigene
  Keyframe-Familie `srb-sf-*` für die Mini-Oberflächen (pop, puls, ring, haken, toast, zeiger) und `srb-ref-*` für
  Tab-Wechsel. Baukasten-Keyframes fadeIn, slideUp, zoomIn, marquee. `transition:none` kommt vor (Reduced-Motion-Spur).
- **Typische Mikro-Elemente:** Fensterpunkte rot/gelb/grün als Ornament, Kalender-Auswahl, Toast „Termin bestätigt“,
  Haken-Häkchen, Fortschritt „Schritt 1 von 3“.

## 5. Texte und Überzeugungstechnik (nur Muster, nicht wörtlich übernehmen)

- Jede Fallstudie beginnt mit einem **Entscheidungssatz** aus Kundensicht („… entscheiden online, wem …“).
- Preis-Anker (durchgestrichen) + Verknappung („nur für kurze Zeit“) + Risikoumkehr (Geld zurück).
- Vergleichstabelle gegen „andere Anbieter“ mit konkreten Zahlen (Pflege-Abo 39–99 €).
- FAQ nimmt Preis-Skepsis direkt auf („Warum so günstig?“) mit Gründer-Geschichte.
- SEO: Titel „Website erstellen lassen | 60 % Rabatt | Space Rocket“, Meta mit Preis, JSON-LD (LocalBusiness,
  ProfessionalService, Space Rocket GbR), Branchen-H3 „Website für …“.

## 6. Die Kundenseiten der Firma (11 Stück, statisch)

Kurz (Details in `kundenseiten-auswertung.md`): Bella Gawgajewa (Hausarzt, Grün), Blacklake Digital (Schwarz/Mint,
Laufband), D’Agostino Elektrotechnik (Marine/Gold, Notdienst-Puls), dr-smusy.com (**Framer**, Sand/Dunkelgrün),
JW Beauty Room (Anthrazit/Gold/Creme), LB Bayern Immobilien (Navy/Gold, **viel Custom-Code**, Vorhang-Hero,
Bewertungs-Funnel, lokale SEO-Seiten je Gemeinde), Lothar Matthäus (Schwarz, bildlastig, Einseiter), Pinsano
(Bordeaux/Beige, Reservieren/Bestellen), SAIA Agency, Tim Mathé Hair, Wortgold Coaching (Schwarz-Weiß, reduziert).
Auffällig: jede Seite hat **eigene Marken-Palette und eigene Schriftpaarung**, die Baukasten-Basis bleibt gleich.
Lokale SEO (Stadt in Titel/H1/Meta) bei fast allen. 5 Seiten mit Consent-Dialog „Ja, ich bin einverstanden / Sämtliche
Datennutzung ablehnen“.

## 7. Bewertung (nach Quelltext, ohne Messung)

| Kriterium | Note | Anmerkung |
|---|---|---|
| Erster Eindruck | nicht prüfbar | Kein Screenshot; Hero-Aufbau (Sterne, H1, Preis, Button) ist klar |
| Eigenständigkeit | 3 | Sauber, aber Standard-SaaS-Look; Mini-Oberflächen sind die Besonderheit |
| Typografie | 3 | Eine Familie, konsequent; wenig Kontrast in der Hierarchie |
| Bewegung | 4 | Eigene Mini-Animationen mit gutem Easing |
| Handwerk | 3 | Testseiten und Platzhalter öffentlich |
| Glaubwürdigkeit | 3 | Starke Zahlen, aber alle Zahlen ungeprüft und Superlative („Nr. 1“) |
| Sicherheit/Datenschutz | 2 | Cookiebot, Elfsight, externes Popup-Skript |
| Funktion | 4 | Funnel von Beratung bis Onboarding komplett |

## 8. Top 3 Innovationen (zum Lernen)

1. **Animierte Mini-Oberflächen statt Stockbild im Ablauf** (Kalender, Entwurf, Online-Schalten) erklären den Prozess
   ohne Text.
2. **Entscheidungssatz je Branche + 3 Häkchen + Zitat + Live-Link** als wiederholbares Fallstudien-Muster in Tabs.
3. **Ehrlicher Vergleich mit Zahlen gegen „andere“ + Risikoumkehr** (Garantie, kein Pflege-Abo) in einer Zeile je Punkt.

## 9. Was wir mitnehmen / nicht übernehmen

- Mitnehmen (eigene Umsetzung): Entscheidungssatz-Muster, Funnel-Danke-Seiten mit Terminvorbereitung, Onboarding-Seiten
  nach dem Kauf, FAQ mit Preis-Frage, JSON-LD mit Preis.
- Nicht übernehmen: Verknappungs-Rabatt („60 % für kurze Zeit“, Dauerangebot), ungeprüfte Superlative und
  Bewertungszahlen, Drittanbieter-Skripte vor Einwilligung, Testseiten in der Sitemap.

## 10. Offen

- Screenshots und Messwerte (Handy/Desktop) fehlen: dafür bräuchte der Browser Zugriff auf die Seite. Auf Elias’
  Entscheidung (Freigabe oder Lauf auf seinem Rechner).
- Keine Bilder gesichert (fremde Rechte); Bild-Hinweise: Kundenbilder liegen auf cdn1.site-media.eu, Hero/Siegel dort.
