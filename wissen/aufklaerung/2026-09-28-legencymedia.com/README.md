# Aufklärung legencymedia.com — Übergabe an das Website-Business

Stand 2026-09-28 · Quelle: Fernspäherkommando (Repo `Fernsp-herkommando-Fortenbacher-`), fünf Späher mit Browser,
Dossier von Fw. Gezi Golem, übergeben durch Hfw Fortenbacher.

**Ziel:** Legency Media (Galway), Webflow-Agentur für B2B-Marketingteams — also ein direktes Vorbild aus unserer eigenen
Branche. **Gesamtnote 2** (Optik 2–, Technik 2+, Sicherheit 3, Funktion 1–, Content/SEO 2+).

| Datei | Inhalt |
|---|---|
| [`dossier.md`](dossier.md) | Konsolidiertes Dossier: Stärken, Mängel nach Schweregrad, Widersprüche, Top-5, Noten |
| [`rohbefunde.md`](rohbefunde.md) | Die fünf Befund-Blöcke der Späher unverändert (mit Messwerten und Fundorten) |
| `bilder/` | Belegfotos, siehe unten |

**Methodik-Vorbehalt:** Die Späher teilten sich eine Browser-Instanz. Zustandsabhängige Befunde (Consent, Konsole,
Netzwerk-Logs) sind mit Vorbehalt zu lesen; Details in `dossier.md` Abschnitt 5.

## Lehren für unsere Beispielseiten

Übersetzt in Bauregeln, abgeglichen mit dem Pflichtkatalog in `CLAUDE.md`.

### Übernehmen — das macht Legency hochwertig

- **Eine Marken-Idee statt Stock:** eng begrenzte Palette (ein Signalblau `#0004F6` + Schwarz, Hellgrau, Weiß) und
  eine durchgehende Bildsprache (Pixel/Dither: Planet, Pfeile, Logo, Case-Kacheln). Deckt sich mit unserer Lehre
  „Leitmotiv aus dem Fach“ (`lehren/showcase-hell.md`). → `bilder/schnoerkel-home-atf.png`
- **Headline mit Farbakzent auf dem Nutzen:** „…partner for **B2B marketing teams**.“ — Nutzenteil in Markenfarbe,
  Punkt bewusst schwarz. Botschaft in unter 3 s erfassbar.
- **Editoriale Typo:** eine Charakter-Grotesk (PP Frama) für Headlines mit engem Tracking (H1 72,7 px,
  `letter-spacing` ≈ −0,04 em), eine Text-Variante für Fließtext; Zeilenlänge ~70 Zeichen, 17,6/24,6 px.
- **Ein CTA-System überall:** Pille + separates quadratisches Pfeil-Kästchen (↘), identisch auf allen Seiten, sogar auf
  der 404. Wiedererkennbar und billig umzusetzen.
- **Beweise mit Zahlen:** Kennzahl-Chips („475 pages with structured data“), Google 5,0 aus 16 Bewertungen,
  Kundenlogoleiste. Aber nur echte Zahlen vom Kunden (Grundregel 3).
- **Leistungspakete als Staffel:** Core / Velocity / Premium, das oberste dunkel hervorgehoben, „Everything in X,
  plus:“. Passt direkt zu unseren Abo-Paketen (`wartung/PAKETE.md`). → `bilder/schnoerkel-d-1700.png`
- **Anfrage als 3-Schritt-Assistent:** Fortschritt „Step 1 of 3“, Feld-Fehlertexte, `aria-invalid`, Fokus aufs erste
  Fehlerfeld, Honigtopf, `noscript`-Fallback mit mailto, Termin-Alternative. → `bilder/fritte-form-invalid.png`
- **Gestaltete 404** mit echtem Status, Marken-Laufband und Heim-CTA. → `bilder/fritte-404.png`
- **Performance-Muster:** statischer Build, HTML 11,5 KB (Brotli), LCP = Text-H1 (< 0,5 s), CLS 0, Fonts selbst
  gehostet + 2 Schnitte `preload`, Hero-Video `muted` + Poster + `preload="metadata"` + WebM vor MP4.
- **SEO-Handwerk:** vollständige Meta/OG/Twitter-Daten serverseitig, robots.txt mit ausdrücklicher KI-Crawler-Freigabe
  (GPTBot, ClaudeBot, PerplexityBot, Google-Extended), Artikel mit `BlogPosting` + `BreadcrumbList` + `FAQPage`,
  Autor und Aktualisierungsdatum.

### Vermeiden — hier verliert Legency Punkte

| Fehler bei Legency | Regel für uns |
|---|---|
| Fixierter Header aus zwei schwebenden Teilen ohne Hintergrund — Inhalt scrollt durch die Lücke und kollidiert (`bilder/schnoerkel-d-1700.png`, `-d-900.png`) | Fixierte Leisten immer mit eigener Fläche (Hintergrund oder Blur); beim Scrollen auf Kollision prüfen (Screenshots bei mehreren scrollY) |
| Partner-Siegel fest unten rechts, überdeckt Headlines, bis zu 3× gleichzeitig sichtbar (`bilder/schnoerkel-d-1700.png`) | Siegel/Badges nie `position: fixed`; ein Siegel je Ansicht |
| Buchstaben-Split-Animation auf allen H2: Screenreader lesen „foryour“, `textContent` liefert „WWeebbffllooww“, 740 Inline-Style-Elemente (`bilder/schnoerkel-d-8200.png`) | Überschriften bleiben echter Text; Effekte nur auf einer `aria-hidden`-Kopie oder per CSS auf der ganzen Zeile (vgl. unser `clip-path`-Einblenden in `lehren/showcase-hell.md`); `prefers-reduced-motion` greift |
| Gepinnte Scroll-Sektion zeigte ~3 s leeren Viewport (`bilder/schnoerkel-d-6400.png`) | Keine Pin-Spacer-Sektionen ohne sichtbaren Fallback; Anker-Sprünge testen |
| WebGL-Canvas im Vollbild: ~2,5 s Long Tasks, „GPU stall due to ReadPixels“ | Effekte ohne Main-Thread-Last; auf Mobil drosseln oder statisches Poster |
| Nachgeladene Fremd-Szene (Unicorn Studio via jsdelivr/firebase), Thumbnail antwortet 400 | Keine fremden Skripte/Hosts (Pflicht Datenschutz); jede Datei selbst hosten und im Build prüfen |
| Fremd-Tracker `t.rialtodata.com` ohne SRI, sendet vor Einwilligung | Kein Tracking (Pflicht); falls je nötig: selbst hosten, an Einwilligung koppeln |
| Kein HSTS, keine CSP, kein `frame-ancestors`, keine Permissions-Policy, keine `security.txt` | HSTS, CSP, `frame-ancestors`, Permissions-Policy stehen schon in `vorlage/public/_headers`; `/.well-known/security.txt` fehlt der Vorlage noch. Legency zeigt, dass selbst Premium-Agenturen das vergessen: **Verkaufsargument** |
| Consent-Buttons zweizeilig mit `line-height: 1` (`bilder/schnoerkel-home-atf.png`) | Wir brauchen keinen Banner (keine Cookies/Tracking) — ebenfalls Verkaufsargument |
| PNG-Texturen 258–304 KB, Cache nur 4 h für gehashte Assets | AVIF/WebP; gehashte Dateien `max-age=31536000, immutable` |
| Kein Skip-Link, Menü-Links mobil nur 35 px hoch, kein CTA above the fold auf Mobil (`bilder/schnoerkel-m-atf.png`) | Skip-Link, Tippflächen ≥ 44 px und feste Kontaktleiste auf dem Handy (steht schon in der Pflicht) |
| Case-Raster mit leerer Zelle, Mikro-Schrift < 12 px in Kacheln (`bilder/schnoerkel-cases-d.png`) | Raster immer vollständig füllen; Text ≥ 16 px (Pflicht), Beschriftungen nie unter 12 px |
| Partnerstatus dreimal verschieden benannt; „Mobile-Score 36 → 72“ als Erfolg gezeigt | Eine Formulierung je Fakt; nur Zahlen zeigen, die wirklich beeindrucken |
| Webflow-Agentur baut eigene Seite in Astro | Eigene Beispielseiten mit genau dem Stack bauen, den wir verkaufen |

### Konkrete Ideen für die eigenen Beispielseiten

1. **Agentur-Startseite im Legency-Aufbau, aber sauber:** Hero mit Nutzen-Headline + Farbakzent, Logoleiste,
   Paket-Staffel (unsere Abo-Pakete), Case-Kacheln mit Kennzahlen, Anfrage-Assistent in 3 Schritten, gestaltete 404.
2. **Messbarer Vorsprung als Botschaft:** Lighthouse 100/100/100/100, strenge CSP, keine Cookies, kein Banner —
   Legency (Premium-Partner) erreicht Sicherheit 3 und braucht einen Consent-Banner.
3. **Ein Leitmotiv-Effekt statt vieler:** ein ruhiger Marken-Effekt (z. B. Pixel/Dither als statisches SVG/AVIF,
   Bewegung nur per CSS mit `prefers-reduced-motion`), keine Buchstaben-Splits, kein WebGL im Hero.

## Belegfotos (`bilder/`)

| Datei | Zeigt |
|---|---|
| `schnoerkel-home-atf.png` | Hero Desktop: Headline, Farbakzent, CTA-System, Consent-Banner mit gequetschten Buttons |
| `schnoerkel-m-atf.png`, `schnoerkel-m-menu.png` | Mobil: Hero ohne CTA, Overlay-Menü |
| `schnoerkel-d-900.png`, `schnoerkel-d-1700.png` | Header-Lücke, Kollision mit Karten, Partner-Siegel über Headline; Paket-Staffel |
| `schnoerkel-d-8200.png` | Buchstaben-Animation der H2 mitten im Flug |
| `schnoerkel-d-6400.png` | leerer Viewport in der gepinnten Sektion |
| `schnoerkel-cases-d.png` | /case-studies/ mit unvollständigem Raster |
| `fritte-menu.png`, `fritte-mobile-services.png` | Mega-Menü Desktop, Services-Akkordeon mobil |
| `fritte-form-invalid.png` | Anfrage-Assistent mit Validierung |
| `fritte-404.png` | gestaltete 404-Seite |
