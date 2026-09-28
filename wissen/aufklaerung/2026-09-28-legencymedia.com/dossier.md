# DOSSIER — https://legencymedia.com/
Datum: 2026-09-28 · Aufklärungsart: mit Browser (headless Chromium, Playwright). Methodik-Vorbehalt: Alle fünf Späher teilten sich eine Browser-Instanz, die Instanzen waren also nicht isoliert. Befunde, die vom Zustand abhängen (Consent, Fokus, Konsolen- und Netzwerk-Logs), sind nur mit Vorbehalt verwertbar (siehe Abschnitt 5).

Eingesetzt: alle fünf Späher (Schnörkel, Snats, Gummihals, Fritte, Duden). Es fehlt kein Fach.

## 1. Lagebild
Legency Media ist eine Webflow-Agentur aus Galway. Ihre eigene Website ist ein statischer Astro-Build hinter Cloudflare und technisch wie inhaltlich deutlich überdurchschnittlich: LCP unter 0,5 s, CLS 0, wenig JS, saubere Meta- und OG-Daten sowie eine vorbildliche robots.txt (Snats, Duden). Die Markenoptik aus Signalblau, Pixel-Dither-Bildsprache und PP Frama hebt die Seite klar über Agentur-Templates (Schnörkel). Funktional gab es in der Stichprobe keine toten Links. Das Formular validiert vorbildlich und hat einen No-JS-Fallback (Fritte). Den Premium-Eindruck schwächen vor allem die effektlastigen Teile: die Split-Text-H2 (A11y, SEO und Lesbarkeit zugleich betroffen), ein lückenhafter fixierter Header samt mehrfach eingeblendetem Partner-Badge und ein kaputtes Unicorn-Studio-Vorschaubild. Bei der Sicherheit ist die Header-Härtung dünn, außerdem sendet ein Fremd-Tracker ohne SRI schon vor der Einwilligung (Gummihals, Fritte).

## 2. Stärken — was die Seite hochwertig wirken lässt
- **Eigenständige Markenidee:** Die Palette ist eng begrenzt (Signalblau #0004F6, Schwarz, #F2F2F2, Weiß). Dazu kommt eine durchgehende Pixel-/Dither-Bildsprache ohne Stock-Anmutung (Schnörkel).
- **Typografie mit Editorial-Qualität:** PP Frama bzw. PP Frama Text mit klarer Skala (H1 72,7 px, −2,9 px Tracking). Die Fonts sind selbst gehostet, 2 Schnitte werden per preload vorgeladen (Schnörkel, Snats).
- **Klare Kernbotschaft und konsistentes CTA-System:** Die H1 hat einen blauen Nutzenteil. Überall kommt dieselbe Pille mit Pfeil-Kästchen zum Einsatz, auch auf der 404 (Schnörkel).
- **Gute Lesbarkeit:** Fließtext 17,6/24,6 px, etwa 70 Zeichen pro Zeile. Kontrast Sekundärtext ca. 5:1, Blau/Weiß ca. 8,6:1 (Schnörkel).
- **Performance:** TTFB 140–216 ms, FCP und LCP 416–448 ms (LCP ist die Text-H1), CLS 0. HTML mit Brotli nur 11,5 KB, initial 32 Requests bzw. ca. 437 KB. Das Hero-Video lädt als WebM mit Poster und `preload=metadata` (Snats).
- **Wenig Third Party:** Fremd sind nur Rialto und Cloudflare Insights, das Insights-Beacon hat SRI (Snats, Gummihals).
- **A11y-Grundgerüst:** `lang`, keine Zoom-Sperre, Landmarks, genau eine H1 ohne Sprünge in der Hierarchie. Sauberes ARIA an Menü, Akkordeons und Consent-Dialog. Dazu Regeln für `:focus-visible` und `prefers-reduced-motion` im CSS (Snats). Escape schließt das Menü, der Fokus kehrt korrekt zurück (Fritte).
- **Datensparsamkeit:** Es werden keine Cookies gesetzt. Google Consent Mode steht standardmäßig auf „denied“, GTM lädt erst nach Einwilligung. Die Einwilligung lässt sich im Footer widerrufen (Gummihals, Fritte).
- **Saubere Transportebene:** HTTPS durchgehend, kein Mixed Content. www→Apex, http→https und Trailing-Slash werden jeweils mit einem einzigen Sprung ohne Ketten umgeleitet (Gummihals, Fritte).
- **Starkes Formular:** 3-Schritt-Assistent mit Honeypot, Feld-Fehlertexten, `aria-invalid` und Fokus auf das erste Fehlerfeld. Es gibt einen noscript-Fallback und als Alternative Calendly (Fritte).
- **Markenkonforme, hilfreiche 404:** echter Status 404, Laufband im Seitenstil, „Go Home“-CTA (Schnörkel, Fritte).
- **SEO-Handwerk:** vollständige Meta- und OG/Twitter-Daten, serverseitig gerendert (Roh-HTML entspricht dem DOM). robots.txt mit ausdrücklicher KI-Crawler-Freigabe, gepflegte Sitemap mit 56 URLs, sprechende URLs, 67 interne Links. Die Blogartikel tragen BlogPosting-, Breadcrumb- und FAQ-Schema (Duden).
- **Text und Vertrauen:** nüchternes britisches B2B-Englisch ohne Fehler, aktuelle Artikel mit Autor und Datum (Duden). Kennzahlen-Chips, 5,0 Google-Sterne aus 16 Bewertungen, Kundenlogos. Die Retainer-Staffel Core/Velocity/Premium ist klar aufgebaut (Schnörkel).
- **Mobil sauber:** kein horizontaler Überlauf, Akkordeon-Karten, Overlay-Menü mit funktionierendem Services-Akkordeon (Schnörkel, Fritte).

## 3. Mängel nach Schweregrad

### KRIT
- Keine. Kein Späher hat einen kritischen Befund gemeldet.

### HOCH
- **Schwebender Header ohne Hintergrundfläche** → Die Header-Pille und der separate „Get in touch“-Block sind fixiert, dazwischen gibt es keine Fläche. Inhalte scrollen durch die Lücke und kollidieren mit Buttons und Karten, im Schluss-CTA liegt Text halb unter dem Header @Startseite Desktop, scrollY ca. 900/1700/10000 (Schnörkel)
- **Fixiertes „Webflow Premium Partner“-Badge überdeckt Inhalte** → Das Badge (ca. 320×40 px) sitzt dauerhaft unten rechts über Headlines, Case-Kacheln und Footer. Weil es zusätzlich in Hero, Reviews und Footer steht, ist es bis zu 3× gleichzeitig sichtbar @Startseite und /case-studies/ Desktop (Schnörkel)

### MITTEL
- **Split-Text-H2 (Querschnittsbefund A11y/SEO/Optik, Dublette dreier Späher)** → Jede H2 wird in Buchstaben-Spans plus `data-roll-twin`-Duplikat zerlegt. Die Folgen:
  (a) Den Accessible Names per `aria-label` fehlen die Leerzeichen an den `<br>` („foryour“, „searchand“, „forthe“, „forB2B“, „improvementsfor“) (Snats, Duden).
  (b) `textContent` liefert Kauderwelsch („WWeebbffllooww ssuuppppoorrtt“). Das ist relevant für Extraktoren und KI-Crawler, auf die die Seite ausdrücklich setzt. Das Roh-HTML ist sauber (Duden, Snats, Schnörkel).
  (c) Es entstehen 740 Elemente mit Inline-Style und 1.574 DOM-Knoten (Snats).
  (d) Kurz nach dem Scrollen waren die H2 optisch als Buchstabengewirr zu sehen (Schnörkel).
  @alle animierten H2 der Startseite
- **Unicorn-Studio-Thumbnail 400 (Dublette)** → `firebasestorage.googleapis.com/.../remix_dfdsfdsf_@thumbnail.jpg` antwortet mit 400 und erzeugt bis zu 5 Konsolenfehler pro Aufruf. Ohne Video fehlt das Poster der Hero-Grafik. Die Szene lädt außerdem zusätzliche Hosts nach (jsdelivr, assets.unicorn.studio), die im initialen Waterfall nicht auftauchen @Startseite, 404-Seite (Snats, Fritte)
- **Main-Thread-Last durch WebGL/Canvas** → 11 Long Tasks mit zusammen ca. 2,55 s und Warnungen „GPU stall due to ReadPixels“ vom Vollbild-Canvas `live-dither__canvas`. Headless ohne GPU gemessen, auf echter Hardware vermutlich niedriger. Auf schwachen Mobilgeräten besteht INP-Risiko @Hero-Canvas, `nav-dither.js` (Snats)
- **Gepinnte Scroll-Sektion zeigt leeren Viewport** → Nach einem Sprung-Scroll war der Viewport ca. 3 s leer. Mobil stand nach einem Resize Sektion 01 an scrollY 0. Ob das auch außerhalb von headless auftritt, ist offen @Startseite, Sektion „separates“ (Schnörkel)
- **Cookie-Banner mit gequetschten Buttons** → „Accept/Reject analytics“ brechen zweizeilig um, line-height 1,0. Der Banner verdeckt den Track-Record-Block im Hero @Startseite unten links Desktop (Schnörkel; bestätigt als Fremdfund von Fritte)
- **Unvollständiges Raster auf /case-studies/** → Die K2-Kachel steht allein, die Zelle daneben bleibt leer. Sie hat als einzige keine Headline bzw. Eyebrow im Bild @/case-studies/ Desktop (Schnörkel)
- **Kein HSTS** → Es fehlt der Header `Strict-Transport-Security`, damit gibt es keinen Schutz beim ersten http-Aufruf und kein Preload @Response-Header (Gummihals)
- **Keine Content-Security-Policy** → weder als Header noch als Meta-Tag @Response-Header/`<head>` (Gummihals)
- **Kein Clickjacking-Schutz** → weder `X-Frame-Options` noch `frame-ancestors` @Response-Header (Gummihals)
- **Fremd-Skript Rialto ohne SRI, lädt sofort** → `t.rialtodata.com/sl.js` hat kein `integrity`-Attribut und wird mit `max-age=0` ausgeliefert. Wer diese Domain kontrolliert, kann Code auf legencymedia.com ausführen @`<head>` (Gummihals; Snats hat das parallele Laden bestätigt)

### NIEDRIG
- **Tracking vor der Einwilligung** → Rialto sendet Pageview, `sid`, Bildschirmgröße, Attribution und Sichtbarkeits-Events (auch zu den Consent-Buttons) per POST an `t.rialtodata.com/e`. Cloudflare RUM feuert unabhängig von der Consent-Wahl. Die Seite nennt Rialto im HTML-Kommentar „first-party“, es läuft aber über eine fremde Domain. Rechtlich ist das nicht bewertet @Netzwerk-Log (Gummihals, Fritte). Schweregrad von Gummihals übernommen. Fritte merkt an, dass es sich mit dem Bannertext deckt, rät aber zum Abgleich mit der Cookie-Policy.
- **Fehlende weitere Security-Header** → keine Permissions-Policy, kein COOP/COEP @Response-Header (Gummihals)
- **Keine security.txt** → 404 @/.well-known/security.txt (Gummihals, Snats)
- **Interna in robots.txt** → Die Datei beschreibt die privaten Pfade `/q/` und `/tools/` und nennt interne Dateinamen. Die Pfade wurden nicht aufgerufen @/robots.txt (Gummihals). Duden bewertet dieselbe robots.txt aus SEO-Sicht als vorbildlich, siehe Abschnitt 5.
- **Entwickler-Kommentare im Live-HTML** → frühere workers.dev-Collector-Subdomain, „compliance audit“, Staging-Hinweise, Komponentennamen @Quelltext Startseite (Gummihals)
- **`access-control-allow-origin: *` auf dem HTML** → unkritisch, aber unnötig @Hauptdokument (Gummihals)
- **Große PNG-Texturen** → `tex-hero.png` ca. 300 KB, `tex-closer.png` 258 KB, keine WebP/AVIF-Variante. Einsparpotenzial geschätzt 60–70 % @CSS-Hintergründe (Snats)
- **Kurze Cache-Dauer für gehashte Assets** → `max-age=14400` statt `31536000, immutable` @Cloudflare (Snats)
- **HTTP/1.1 gemeldet** → möglicherweise ein Proxy-Artefakt, nicht gesichert @Navigation-Timing (Snats)
- **3 render-blocking Stylesheets** → je 4–5 KB, zusammenfassen oder kritisches CSS inline einbinden @`<head>` (Snats)
- **Kein Skip-Link** @Seitenanfang (Snats)
- **Marquee als `img` mit ca. 8-fach wiederholtem Namen** → nicht `aria-hidden`, anders als das Footer-Laufband. Verwandt damit: Die H1 der 404-Seite enthält den Endlos-Laufschrifttext @„How we work“, 404 (Snats, Fritte)
- **Alt-Inkonsistenz** → Das Blueflame-Logo hat `alt=""`, laut Duden sind 2 von 21 Bildern ohne bzw. mit leerem alt @Partner-Logoleiste/Startseite (Snats, Duden)
- **11 Sections ohne Namen** → unkritisch @main (Snats)
- **Sehr kleine Beschriftungen** → Chip-Texte in den Case-Kacheln sichtbar unter 12 px, Footer-Spaltentitel mobil 11 px @/case-studies/, Footer mobil (Schnörkel)
- **Footer-Kontrast** → „Galway City, Ireland“ weiß mit Opacity 0,6 auf Blau, ca. 3,6:1 @Footer (Schnörkel)
- **Kein CTA above the fold auf Mobil, Menü-Links nur 35 px hoch** @Startseite mobil (Schnörkel)
- **Schwaches Selbstzeugnis** → „36 to 72 mobile performance score“ wird prominent gezeigt, wirkt für eine Qualitätsagentur wie ein Eigentor @Startseite, /case-studies/ (Schnörkel)
- **Leerflächen in der dunklen Case-Sektion** @„Technical improvements for ChannelSight“ (Schnörkel)
- **Formular speichert schon ab Schritt 1** → Hinweis „Continuing saves your details“, also früher Absende-Punkt. Der Hinweis ist transparent, der Ablauf wurde nicht ausgelöst @/get-in-touch/ (Fritte)
- **Keine Suche** → kein Suchfeld, /search liefert 404 @global (Fritte)
- **Blog-Filter nicht in der URL, keine Paginierung** @/blog/ (Fritte)
- **Mobil-Akkordeon: zugeklappte Links bleiben im Layout** → ob sie per Tab fokussierbar sind, ist ungeprüft @Mobil-Menü (Fritte)
- **Dünnes Structured Data auf der Startseite** → nur `Organization`. Es fehlen WebSite, ProfessionalService/LocalBusiness, Service, aggregateRating, telephone, email und founder. In `sameAs` steht ein Maps-Link @JSON-LD (Duden)
- **`og:type=website` auf Blogartikeln** → richtig wäre `article` mit `published_time` und `author` @Blogartikel (Duden)
- **Keine eigenen `twitter:title`/`twitter:description`** @head (Duden)
- **Uneinheitlich benannter Partnerstatus** → „Enterprise partner“, „Premium Partner – Enterprise“ und „Premium Partner, Enterprise tier“ nebeneinander @Hero (Duden)
- **Uneinheitliche Schreibweise der Überschriften** → Blog in Title Case, Sektionen in Satzschreibung; ein redundanter Lumos-Titel, dazu eine Fehlkategorie @Guides-Sektion (Duden)
- **Kein hreflang** → bei rein englischer Seite vertretbar @head (Duden)
- **Veraltete Treffer im Markenumfeld** → alte URL `/contact` im Index, Verzeichnisse mit alter Positionierung, konkurrierendes Webflow-Template „Legency“ @SERP (Duden)
- **Positionierung „Webflow-Agentur“, Eigenseite in Astro** → Die Seite verkauft Webflow Enterprise, läuft selbst aber auf Astro und Cloudflare. Abgemildert wird das, weil die Seite „Astro builds“ nennt und /services/astro-agency/ anbietet (Schnörkel, Snats, Gummihals; Link-Nachweis Fritte). Einordnung durch den Auswerter: Das ist ein Glaubwürdigkeits- und Positionierungsbefund, kein technischer Mangel. Die Späher haben keinen Schweregrad vergeben, NIEDRIG ist hier gesetzt, weil die Seite Astro offen als Leistung führt.

## 4. Befunde je Fach (Kurzfassung)
- **Optik (Schnörkel):** Die Markenidentität ist konsequent und hochwertig, mit starker Typo, klarem CTA-System und sauberem Mobil-Umbruch. Abzüge gibt es für die Umsetzung: lückenhafter fixierter Header, mehrfach eingeblendetes Badge, Buchstaben- und Pin-Animationen, unfertiges Case-Raster, gequetschte Consent-Buttons, Mikro-Schriftgrößen.
- **Technik (Snats):** Schneller, schlanker Astro-Build mit LCP unter 0,5 s, CLS 0 und solider ARIA-Basis. Schwachpunkte sind die Split-Text-H2 (Accessible Names, DOM-Wildwuchs), die WebGL-Long-Tasks, Unicorn-Studio-Ballast mit 400-Fehler, PNG-Texturen und kurze Cache-Header. Mobil-Messung durch Snats gestört (siehe 5).
- **Sicherheit (Gummihals, rein beobachtend):** Transport und Datensparsamkeit sind sauber (HTTPS, keine Cookies, GA korrekt consent-gebunden). Die Header-Härtung fehlt weitgehend: kein HSTS, keine CSP, kein XFO, keine Permissions-Policy, keine security.txt. Rialto läuft ohne SRI und sendet vor der Einwilligung. Kleinere Informationslecks in robots.txt und HTML-Kommentaren.
- **Funktion (Fritte):** Sehr solide: 21 interne Links alle mit 200, saubere Redirects, vorbildliches Formular, funktionierende Menüs und Filter, hilfreiche 404. Einziger echter Fehler ist das Unicorn-Thumbnail mit 400. Suche, teilbare Filter-URLs und Paginierung fehlen.
- **Content/SEO (Duden):** Überdurchschnittlich: SSR, vollständige Meta- und OG-Daten, klare Hierarchie, vorbildliche robots.txt und Sitemap, starke Artikel-Schemas, fehlerfreier B2B-Text. Hauptrisiko sind die Split-Text-H2 im gerenderten DOM. Das Schema der Startseite ist dünn, der Partnerstatus uneinheitlich benannt, dazu Altlasten im Index.

## 5. Widersprüche & Unsicherheiten
- **Methodik-Vorbehalt (Ausrüstung, kein Mangel der Seite):** Alle fünf Späher melden übereinstimmend, dass sich die Playwright-Instanz einen Browser-Kontext teilte. Tabs wurden fremdnavigiert, `navigate` brach mit ERR_ABORTED ab, der Browser wurde einmal von außen geschlossen (Schnörkel, Snats, Gummihals, Fritte, Duden). Die Folgen:
  - `lm-consent` stand bei Gummihals auf „denied“, ohne dass er etwas geklickt hatte, vermutlich wegen Frittes Ablehnen-Test. Dass der Banner anfangs sichtbar war, ist über die Rialto-Payload (cta_view) nur indirekt belegt.
  - Konsolen- und Netzwerk-Logs können zwischen den Spähern vermischt sein. Das betrifft u. a. die JS-Fehler und `datasite.png ERR_ABORTED` bei Gummihals, die Zahl der Konsolenfehler bei Fritte und die Unicorn-Nachladung bei Snats („in einem Lauf“).
  - Fokus-Zustände bei Schnörkel sind nicht sicher zuzuordnen.
  - Snats konnte die Mobil-Prüfung (390×844) nicht sauber abschließen. Mobile Befunde stammen daher von Schnörkel und Fritte.
  - Schnörkel konnte die Schriftgröße der Case-Chips nicht mehr messen, der Befund „unter 12 px“ ist visuell.
  - Empfehlung an den Hfw: MCP-Isolation prüfen (`.claude/mcp/playwright.mjs`, Feld `mcpServers`).
- **http→https:** Gummihals meldete „ungeprüft“ (405), Fritte hat per Direktprüfung einen 301 bestätigt. Nach Weisung des Hfw gilt die Weiterleitung als belegt. Die 405er auf `http://` sowie Dudens 405 bei `fetch()` sind Proxy- bzw. Parallel-Artefakte (Schnörkel, Gummihals, Fritte, Duden). Die Zertifikatsdetails wurden wegen der TLS-Neuterminierung durch den Proxy nicht bewertet (Gummihals).
- **robots.txt:** Duden bewertet sie als SEO-seitig vorbildlich, Gummihals bewertet dieselbe Datei als Informationsleck (Beschreibung von `/q/` und `/tools/`, interne Dateinamen). Beides stimmt. Die Lösung wäre, die Sperren zu behalten und die Kommentare zu kürzen.
- **Alt-Texte:** Snats zählt 22 `<img>`, von denen keines das alt-Attribut ganz weglässt, und nur Blueflame mit `alt=""`. Duden zählt „2 von 21 ohne bzw. mit leerem alt“. Die Zählung weicht leicht ab, vermutlich wegen Lazy-Load bzw. des Zeitpunkts. Der Befund bleibt NIEDRIG.
- **Reduced Motion:** Snats hat 14 `prefers-reduced-motion`-Regeln im CSS belegt. Ob Split-Text, Pin-Sektionen und Canvas damit tatsächlich ruhiggestellt werden, hat niemand verhaltensseitig geprüft (Hinweis Schnörkel).
- **Pin-Sektion leer, WebGL-Long-Tasks:** Beides wurde headless ohne GPU gemessen. Ob es auf echter Hardware auftritt, ist offen (Schnörkel, Snats).
- **HTTP/1.1:** Ursache kann der Proxy sein, der Befund ist nicht gesichert (Snats).
- **Rialto „first-party“:** Das HTML nennt Rialto „first-party“, tatsächlich läuft es über eine fremde Domain. Laut Fritte deckt sich das Senden ohne Consent mit dem Bannertext. Die rechtliche Bewertung (DSGVO/ePrivacy) liegt außerhalb des Auftrags und bleibt offen (Gummihals, Fritte).
- **Mobil-Akkordeon:** Ob die zugeklappten Service-Links per Tab erreichbar sind, ist ungeprüft (Fritte).
- **Keine eigene Plausibilisierung:** Der Auswerter hat keine eigenen Browser-, WebFetch- oder Such-Abrufe durchgeführt.

## 6. Top-5-Empfehlungen (priorisiert)
1. **Split-Text-H2 entschärfen:** Echten Text im H2 belassen und nur die visuelle Kopie per `aria-hidden` animieren, `aria-label` mit Leerzeichen an den Umbrüchen versehen oder weglassen, Twin-Duplikate reduzieren und `prefers-reduced-motion` greifen lassen. Das behebt A11y-, SEO- und Lesbarkeitsbefunde auf einmal (Snats, Duden, Schnörkel).
2. **Header-Härtung per Cloudflare:** HSTS (mit Blick auf Preload), CSP (zunächst Report-Only), `frame-ancestors`/XFO, Permissions-Policy und eine security.txt einrichten (Gummihals).
3. **Rialto bereinigen:** SRI setzen oder selbst hosten, das Laden bzw. Senden an die Einwilligung koppeln oder die Cookie-Policy und den Banner eindeutig anpassen. Den HTML-Kommentar „first-party“ korrigieren (Gummihals, Fritte, Snats).
4. **Fixierte Elemente überarbeiten:** Dem Header eine Hintergrund- bzw. Blur-Fläche geben, das schwebende Partner-Badge entfernen oder nach dem Hero ausblenden, die Consent-Buttons mit normaler line-height gestalten (Schnörkel).
5. **Unicorn-Studio und Effekt-Last aufräumen:** Das 400-Thumbnail ersetzen oder selbst hosten, die Third-Party-Nachladung prüfen, den Canvas mit `readPixels` optimieren bzw. auf Mobil drosseln, PNG-Texturen auf WebP/AVIF umstellen und gehashte Assets auf `immutable` setzen (Snats, Fritte).

Kleiner Aufwand mit sichtbarem Effekt: das Case-Raster auf /case-studies/ schließen, den Partnerstatus einheitlich benennen, das Startseiten-Schema um LocalBusiness/ProfessionalService erweitern und den Skip-Link ergänzen (Schnörkel, Duden, Snats).

## 7. Gesamtnote (Schulnote 1–6)
| Fach | Note | Begründung |
|---|---|---|
| Optik | 2– | Die Markenidentität ist erstklassig, zwei HOCH-Befunde (Header-Lücke, Badge) und die unruhigen Animationen kosten aber den Premium-Schliff. |
| Technik | 2+ | Hervorragende Ladewerte und schlanker Build, nur die Effekt-Komponenten (Split-Text, WebGL, Unicorn) ziehen die Note herunter. |
| Sicherheit | 3 | Transport und Datensparsamkeit sind sauber, aber fast alle Härtungs-Header fehlen und ein Fremd-Skript ohne SRI sendet vor der Einwilligung. |
| Funktion | 1– | Die Stichprobe ergab keine toten Links, Formular und Menüs sind vorbildlich, einziger echter Fehler ist das 400-Thumbnail. |
| Content/SEO | 2+ | SSR, Meta, robots.txt und Artikel-Schemas sind vorbildlich, Abzug für die verstümmelten H2 im gerenderten DOM und das dünne Startseiten-Schema. |
| **Gesamt** | **2** | Die Seite wirkt hochwertig und ist handwerklich überdurchschnittlich gebaut; die Mängel liegen fast ausschließlich in effektverliebten Details und in der Header-Härtung. |
