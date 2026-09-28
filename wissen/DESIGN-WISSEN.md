# Design-Wissen (bewährt in früheren Projekten)

Gesammelt aus zwei konkurrierenden Website-Varianten eines früheren Projekts (eine dunkel & edel, eine hell &
modern). Beide Richtungen haben funktioniert. Was hier steht, ist erprobt und gemessen. Ergänzungen: nur anhängen,
mit Kürzel des Bruders.

## 1. Was eine Seite hochwertig wirken lässt

1. **Eine klare Farbwelt statt vieler Töne.** 4–6 Rollen: Grund, Fläche, Schrift, Nebentext, Linie, **ein** Akzent.
   Den Akzent nur für das Wichtigste (Hauptknopf, Preise/Zahlen, ein Hervorhebungswort). Farben, wenn möglich,
   **aus dem Logo messen** (Pixel auslesen) statt schätzen.
2. **Echte Markenelemente statt Nachbau.** Ein vorhandenes Logo lieber freistellen (PNG → WebP mit Transparenz)
   oder sauber vektorisieren, als es „ähnlich“ neu zu zeichnen. Details beim Nachzeichnen gehen schnell verloren.
3. **Ein Leitmotiv** aus der Welt des Auftraggebers, das überall wiederkehrt: z. B. Bögen aus einer Architektur im
   Logo (Bildrahmen, Menü-Oberkante, Info-Kästen), ein Ornament als Überzeile („Linie – Raute – Text“), ein Muster
   als Hintergrund. So wirkt alles wie aus einem Guss.
4. **Typografie mit Charakter:**
   - Serif-Display (z. B. Cormorant Garamond, 500–600) groß und mit weiter Laufweite für Markennamen → edel.
   - Kräftige Grotesk (z. B. Bricolage Grotesque 700–800) mit enger Laufweite (−0,025 bis −0,035 em),
     Zeilenhöhe ≈ 1 → modern, „Agentur“.
   - Textschrift ruhig (Lato, Manrope …), 16–18 px, Zeilenhöhe 1,6–1,7.
   - Kursive Hervorhebung **eines** Wortes in der Akzentfarbe in Überschriften wirkt sehr gut.
   - Kleine Überzeilen: 0,7–0,78 rem, Versalien, Laufweite 0,16–0,24 em.
   - Preise/Zahlen immer `font-variant-numeric: tabular-nums`.
5. **Großzügiger Weißraum:** Abschnitte 80–100 px (Handy) bzw. 120–150 px (Computer) Innenabstand.
6. **Einheitliche Formen:** z. B. Karten 24 px, Panels 28–32 px, Knöpfe als Pille. Konsistenz macht Qualität.
7. **Spannung durch unterschiedliche Größen:** Bento-Raster (eine große Kachel 2×2 neben kleinen), versetzte
   Galerie, überlappende Fotos. Gleichförmige Kartenreihen wirken wie eine Vorlage.
8. **Speisekarten/Preislisten** als Liste mit **Punktlinie zum Preis** wirken authentischer als Karten.
9. **Telefonnummer als Gestaltungselement:** im Kontaktbereich riesig in der Display-Schrift, mit wachsender
   Unterstreichung beim Hover.
10. **Keine abgesetzten Hintergrundfarben zwischen allen Abschnitten**, wenn der Auftraggeber eine ruhige Fläche
    möchte – lieber ein durchgehender Grund mit dezentem Muster.

## 2. Bewegung: erprobte Tempi und Kurven

| Kurve | Wert | Wofür |
|---|---|---|
| Standard | `cubic-bezier(.2, .8, .2, 1)` | Knöpfe, kleine Elemente, Hover |
| Sanft (startet leise) | `cubic-bezier(.45, .05, .25, 1)` | große Flächen: Menü, Vorhänge, Bildrahmen |
| Schließen | `cubic-bezier(.5, 0, .75, 0)` o. ä., kürzer | Menüs schließen schneller als sie öffnen |

| Effekt | Tempo | Erfahrung |
|---|---|---|
| Hover-Anheben | 2–4 px, 0,3 s | mehr wirkt billig |
| Einblenden beim Scrollen | Versatz 18–28 px, 0,8–1 s, Geschwister 80–90 ms gestaffelt | nur was beim Laden **nicht** sichtbar ist |
| Diashow im Bildrahmen | Takt 6,5–7 s, Überblendung 1,4 s, Zoom 7 % über Takt + 2 s | zwei Rahmen um einen halben Takt versetzt |
| Fortschrittsleiste der Diashow | **unter** dem Foto, mit Bildtitel und Zähler „02 / 04“ | im Foto wirkt sie wie ein Fremdkörper |
| Handy-Menü öffnen | 0,7–0,95 s, sanfte Kurve | nach 150 ms darf höchstens ein Viertel sichtbar sein |
| Handy-Menü schließen | 0,3–0,5 s | |
| Menüeinträge | ab 0,2 s, 45–70 ms versetzt | erscheinen, wenn die Fläche sie erreicht |
| Wort-Welle (Text leuchtet Wort für Wort auf) | 45–70 ms pro Wort, je ~1 s, gesamt ≈ 3,5 s | zeitgesteuert, **nicht** an Scrollposition koppeln; Text vorher lesbar lassen |
| Logo zeichnet sich / Skyline wird „beleuchtet“ | 2–2,5 s | Maske mit weicher Kante (`mask-position`) oder `stroke-dashoffset` |
| Zähler (70, 40 …) | 1,2–1,4 s ease-out | einmalig |
| Gleitende Markierung in der Navigation | 0,45–0,5 s | Linie oder Pille, die unter den Menüpunkt gleitet |

**Beliebte, gut angekommene Effekte:** gleitende Navigations-Markierung, Diashow mit Ken-Burns-Zoom, Wort-Welle,
Menü als Vorhang mit weicher Verlaufskante **oder** als Blatt von unten (Daumenbereich, Wischen zum Schließen),
Bildrahmen, die beim Laden in ihrer Form „aufsteigen“ (`clip-path` mit `round`), Strichzeichnungen, die sich
zeichnen.

**Abgelehnt/schlecht angekommen:** Parallax und alles, was an die Scrollgeschwindigkeit gekoppelt ist (wirkt
unruhig), Vollbild-Flächen, die in < 0,3 s den Bildschirm einnehmen (erschreckt), endlose Puls-/Schwebe-Animationen,
blinkende Dinge.

## 3. Regeln für Bewegung

- Nur `transform` und `opacity` animieren; `clip-path` und `mask-position` für einzelne Flächen sind in Ordnung.
  Nie `box-shadow`, `width`, `top/left`, `filter` in Schleifen.
- Hover nur in `@media (hover: hover) and (pointer: fine)`; auf Touch `:active`-Rückmeldung (leicht eindrücken).
- Alles Bewegte unter `.js` (Klasse früh im `<head>` setzen) und `@media (prefers-reduced-motion: no-preference)`.
- Dauerhaft laufen dürfen nur langsame Diashows und nur, solange sie sichtbar sind (IntersectionObserver),
  pausiert bei verstecktem Tab und unter der Maus.
- Animationen **als Bildfolge prüfen** (`/bildfolge`), nicht nur im Endzustand. „Schön im Standbild“ ≠ „angenehm in
  Bewegung“.

## 4. Handy zuerst – erprobte Bausteine

- **Feste Schnellleiste unten** (schwebende Pille mit Abstand zum Rand, `env(safe-area-inset-bottom)`): großer
  Akzent-Knopf mit ausgeschriebener Telefonnummer + zwei kleine (Route, Karte/Angebot). Auf der Startseite kann
  sie erscheinen, sobald der Anruf-Knopf im Hero aus dem Bild ist.
- **Menü:** Einträge groß in der Display-Schrift, mit kurzer Unterzeile und kleinem Foto; unten Telefon,
  Öffnungsstatus, Adresse. Seite dahinter sichtbar lassen (abgedunkelt, leicht unscharf) und `inert` setzen.
- **Galerie auf dem Handy** als Wisch-Streifen mit Einrasten (`scroll-snap`) statt endlosem Raster; Tipp öffnet
  eine Großansicht (natives `<dialog>`, Wischen, Pfeiltasten, Escape).
- **Lange Listen** (Speisekarte, Leistungen) mit klebender Leiste: Suche + Kategorie-Chips, horizontal scrollbar
  mit weicher Ausblend-Maske am Rand, aktive Kategorie mit gleitender Pille.
- **Öffnungsstatus** („Jetzt geöffnet · bis 23:00 Uhr“) wird gern gesehen – aber nur mit bestätigten Zeiten, sonst
  markieren.

## 5. Leistung – was wirklich gezählt hat

- Das **LCP-Element** in Lighthouse nachsehen (`lcp-breakdown-insight`). Dieses Bild nie `loading="lazy"`,
  sondern `fetchpriority="high"`. Im ersten Bildschirm nichts mit `opacity: 0` starten lassen.
- Weitere Diashow-/Galerie-Fotos **erst bei Bedarf** laden (Daten-Attribute, per Skript kurz vor dem Wechsel).
- Ausgeblendete Bilder (`display: none`) laden trotzdem – außer mit `loading="lazy"`.
- Schriften: nur Schnitte, die im ersten Bildschirm vorkommen, früh laden; `unicode-range` trennt Latin/Latin-ext.
- `Intl.DateTimeFormat` mit `timeZone` kostet ~75 ms Blockierzeit → Ortszeit selbst aus UTC rechnen.
- Im Skript erst alle Positionen lesen, dann schreiben (kein Layout-Thrashing).
- Lokal immer **mit Kompression** messen (`werkzeuge/gzserver.mjs`); ohne gzip ist Lighthouse viel zu pessimistisch.

## 6. Ergänzungen von Bruder A (Hairstyle by Ümit)

- **Logo vektorisieren statt nachbauen:** `pip install potracer` (reines Python, kein System-Paket nötig), Maske je
  Farbe aus dem PNG (4× vergrößert), `potrace.Bitmap(~maske).trace()` → Pfade. Achtung: Maske **invertiert**
  übergeben, sonst wird der Hintergrund gezeichnet. Ergebnis: scharfes Originallogo, umfärbbar (Schwarz → Elfenbein).
- **Flaue Altfotos veredeln:** Graustufe, Tonwertkurve (z. B. 70–232, Gamma 1,4), `ImageOps.colorize` mit warmem
  Schwarz/Elfenbein, leichte Vignette → einheitlicher, hochwertiger Look aus einem schwachen Foto.
- **Ersatzschriften messen:** `ctx.measureText` mit der Webschrift und den Systemschriften → `size-adjust` je
  Ersatz-`@font-face` (Jost ↔ Arial 96,3 %, Bodoni Moda ↔ Times 111 %).
- **Gleitende Pille nur mit `clip-path`:** eine Fläche über die ganze Chip-Liste, `clip-path: inset(0 R 0 L round 999px)`
  animieren – kein `width`, scrollt im Container mit.
- **`#pruefen` ohne Skript:** `html:has(#pruefen:target) [data-pruefen]::before { content: "prüfen: " attr(data-pruefen) }`.
- **Menü-Blatt von unten:** 0,85 s `cubic-bezier(.45,.05,.25,1)`, Schließen 0,42 s; Einträge ab 0,22 s um 60 ms
  versetzt. Bildfolge: 150 ms fast nichts, 300 ms ≈ ¼ – fühlt sich ruhig an.

## 7. Ergänzungen von Bruder B (Hairstyle by Ümit)

- **Preislisten als `<details open>`:** ohne JS alles offen; ein Inline-Skript direkt nach dem Block schließt auf dem
  Handy alle außer der ersten Karte – vor dem ersten Zeichnen, also CLS 0. Weiches Aufklappen ohne JS-Animation:
  `interpolate-size: allow-keywords` + `::details-content { block-size: 0 → auto }` (unter `@supports`).
- **Wellenkante zwischen Farbflächen:** ein `<symbol viewBox="0 0 1440 80" preserveAspectRatio="none">`, im
  Abschnitt oben als `<svg class="welle">` mit `bottom: calc(100% - 1px)` und `fill: currentColor` in der eigenen
  Grundfarbe – jede Fläche „schwappt“ über die vorige, Höhe `clamp(22px, 4.6vw, 72px)`.
- **Vorhang-Menü von oben:** 0,85 s `cubic-bezier(.45,.05,.25,1)`, Schließen 0,42 s; Vorhang eine Stufe dunkler als
  der Kopf, damit man die Ebene sieht. Bildfolge: 150 ms kaum etwas, 300 ms ≈ ⅓.
- **Unbounded (breite Grotesk)** braucht ≈ 20 % kleinere Größen als eine normale Grotesk: H1 `clamp(2.2rem, 1rem + 6.1vw, 5.1rem)`
  passt bei 320 px zweizeilig („Friseur in / Eislingen.“). Ersatz: Arial Bold × 1,30.

## 8. Ergänzungen von Bruder C (Hairstyle by Ümit)

- **Leitmotiv aus dem echten Raum des Auftraggebers:** Das neueste Foto des Salons (Instagram) zeigte drei
  Pendelleuchten und eine schwarze Marmortheke → daraus Farben (Wandweiß, Marmor, Fugengrau, Lampenlicht) und
  Motive (Leuchten im Hero, Theke für Kontakt/Menü/Leiste). Der Nutzer wählte diese Richtung aus drei Skizzen.
- **Lichtkegel nur mit CSS:** `conic-gradient(from 150deg at 50% -70px, transparent, licht 14deg 46deg, transparent 60deg)`
  – der Scheitel liegt **über** dem Schirm, dann ist der Kegel am Schirmrand schon schirmbreit – plus
  `mask-image: linear-gradient(#000, transparent)` nach unten. Einschalten: `opacity` 0 → 1 mit `scaleY(.9)`, 1,6 s
  sanft, Leuchten 0,35 s versetzt. Eine kleine Leuchte über Reitern ist eine schöne „gleitende Markierung“.
- **Menü als Kreis vom Knopf:** `clip-path: circle(0 at X Y)` → `circle(R at X Y)`, X/Y = Knopfmitte, R = Abstand zur
  entferntesten Ecke (per Skript als CSS-Variablen). 0,95 s `cubic-bezier(.55,.05,.25,1)`, Schließen 0,42 s.
  Bildfolge: 150 ms kleiner Kreis, 300 ms ≈ 40 % – die Fläche wächst quadratisch, darum eine leise startende Kurve.
- **Hervorhebung durch Gewicht statt Farbe/Kursive:** dünn (250) + fett (680) im selben Satz wie im Logo
  (HAI**RST**YLE) – mit einer variablen Schrift (Mona Sans, Breite 112 %) sehr eigenständig.
- **Abreißzettel mit Studio-Animation** (Wunsch des Nutzers): Vorspannung 190 ms (Zug 6 px, 5 % länger, Blatt gibt
  nach) → Riss 260 ms (Kopie `position: fixed` an `body`, Rest und Stück mit **gemeinsamer** Zufalls-Risskante per
  `clip-path`, Stück schnellt hoch und kippt um eine Ecke) → Flug 1,3 s (`y = h·(0,62t² + 0,38t)`, seitliches Driften,
  Flattern rotateX/Y/Z abklingend, Ausblenden im letzten Drittel), Nachbarn schwingen 0,8 s gedämpft, Blatt federt.
  Aktion (Anruf) nach ≈ 0,7 s. Prinzipien: Vorspannung, Nachschwingen, überlappende Bewegung, Bögen.
- **Zeitlupe für verkettete Animationen:** CDP `Animation.setPlaybackRate({ playbackRate: .08 })` und Bildschirmfotos
  in festen Abständen – geht auch, wenn Animationen erst im `onfinish` anderer starten (das kann `bildfolge.mjs` nicht).
- **Texturen prozedural statt Stockfoto:** schwarzer Marmor aus Zufallswegen (Adern) + Schein + Korn, 1400 × 900 in
  23 KB (`gemeinsam/bruder-c/skizzen/marmor.py`); Papierkorn als 192-px-Kachel, WebP Qualität 100 (4,7 KB).
- **Bilder „hängen“:** Aufhänge-Draht als SVG-Datenadresse mit `vector-effect="non-scaling-stroke"` und
  `preserveAspectRatio="none"`, Rahmen verschieden tief gehängt – bricht die gleichförmige Bilderreihe auf.
- **Ersatzschrift gemessen:** Mona Sans ↔ Arial/Liberation Sans `size-adjust` 102,5 % (Text 400), 104,4 % (Breite 112 %, dünn).
- [C] **Gegen „leer und weiß“:** Materialwechsel als Rhythmus (hell – Marmor – hell – Fliesen – hell – Marmor) statt
  einer Grundfarbe für alle Abschnitte; jedes Zitat/jede Stimme an ein Objekt binden (Marmor mit Leuchte,
  Notizzettel mit Klebestreifen), jede Spalte einer Zeitleiste mit Bild. Hat der Nutzer sofort als „unkonstant“ bemerkt.
- [C] **Hervorhebung durch Licht:** `radial-gradient(ellipse 60% 55% at 50% 62%, licht .75, licht .28 55%, transparent 78%)`
  hinter dem Wort, `box-decoration-break: clone` für Umbrüche – passt zu Leuchten-Motiven, ersetzt Fett/Kursiv.
