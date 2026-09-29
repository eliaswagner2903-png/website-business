# Lehren aus dem Showcase „dunkel & edel“ (Lindgrund, Demo-Uhrmacherei)

Stand 2026-09-28, Branch `aufbau/showcase-edel`. Seite: `showcase/edel/`.
Das Herzstück ist eine prozedural modellierte Armbanduhr (three.js), kein Foto und kein Stockbild.

## 1. Prozedurales 3D statt Stockfoto – was sich bewährt hat

- **Ein Modul, drei Verwendungen:** `src/szene.js` baut Uhr, Materialien und Studio-Licht. Daraus entstehen
  (a) die Standbilder (`werkzeug/standbild.mjs` rendert sie im headless Chromium, `sharp` macht AVIF/WebP),
  (b) die Live-Szene im Worker, (c) die Varianten (drei Zifferblätter, drei Kameras). Poster und Live-Bild
  stimmen deshalb **pixelgenau** überein – der Übergang ist in der Bildfolge nicht zu sehen.
- **Studio-Umgebung selbst bauen** statt HDRI: ein schwarzer Raum mit fünf leuchtenden Flächen (`MeshBasicMaterial`
  mit Farbe > 1), einmal durch `PMREMGenerator.fromScene` – das ergibt die typischen langen Lichtstreifen auf
  poliertem Stahl. Kostet keine Datei und keine fremde Herkunft.
- **Anisotropie für den Sonnenschliff:** `MeshPhysicalMaterial.anisotropy` + `anisotropyMap`, deren Rot/Grün die
  radiale Richtung vom Mittelpunkt kodiert (im Canvas gerechnet). Das ist der Unterschied zwischen „grüne Scheibe“
  und „Zifferblatt“.
- **Zeiger von Hand triangulieren:** ein facettierter Dauphine-Zeiger braucht nur 6 Dreiecke, aber die richtige
  **Reihenfolge der Ecken** – bei falscher Wicklung zeigen die Normalen nach innen und der Zeiger wirkt flach und
  dunkel. Nach jedem Geometrie-Eingriff `computeVertexNormals()` und ein Standbild ansehen.
- **Leder als Extrusion und dann biegen:** Querschnitt als `Shape`, `ExtrudeGeometry` mit vielen Schritten, danach
  die Punkte per Formel krümmen (`z -= k·(Länge)²`) und die UV neu setzen. Naht und Korn kommen aus einer
  Canvas-Textur, das Band braucht keine einzige Bilddatei.
- **Gerendert wird mit SwiftShader:** headless Chromium hat keine GPU. Start mit
  `--use-angle=swiftshader --enable-unsafe-swiftshader`, sonst gibt es gar kein WebGL. Für `toDataURL`
  muss der Renderer mit `preserveDrawingBuffer: true` laufen.

## 2. Nachladen ohne Leistungsverlust

- Reihenfolge: Poster ist LCP (`fetchpriority="high"`, nie lazy) → `load` → 700 ms warten → `requestIdleCallback`
  → nur wenn sichtbar (IntersectionObserver), kein `prefers-reduced-motion`, kein `saveData`, WebGL vorhanden.
  Ergebnis: Lighthouse mobil 100/100/100/100, CLS 0, erster Aufruf 141 KB.
- **OffscreenCanvas im Worker** (`transferControlToOffscreen`): three.js läuft komplett neben dem Haupt-Thread.
  Rückfall für Browser ohne Worker/Offscreen: dasselbe Modul im Haupt-Thread (`uhr-haupt.js`).
- **Beim Scrollen pausieren:** `scroll` setzt die Szene für 200 ms still. Scrollen hat Vorrang; die Uhr läuft
  danach ohne Sprung weiter, weil die Animation auf verstrichener Zeit und nicht auf Bildnummern beruht.
- **Bildrate deckeln** (≈ 40 fps) und **Pixeldichte deckeln** (`min(DPR, 2)`, Leinwand höchstens 1100 px). Dazu ein
  Wächter: bleibt die mittlere Bildzeit über 26 ms, sinkt die Auflösung stufenweise auf 1.
- Gewicht der Szene: **148 KB gzip** (three.js-Kern + Szene, mit esbuild gebündelt, nur benutzte Module) –
  unter der Grenze von 180 KB, aber nur, weil keine Addons außer `RoundedBoxGeometry` verwendet werden.

## 3. Neue Fehler (für `wissen/FEHLER.md`, wenn sie sich wiederholen)

| Fehler | Regel |
|---|---|
| CLS 0,066 nur im **zweiten** Farbschema: dessen Display-Schrift (Newsreader) wird nicht vorgeladen und tauschte spät | Schriften, die nicht im Kopf vorgeladen sind, mit `font-display: optional` einbinden; `size-adjust`/`ascent-override` allein reichen nicht, weil sich auch die Zeilenumbrüche ändern |
| Lighthouse SEO 63 auf Dankes- und 404-Seite | `noindex` kostet die SEO-Note; Dankeseiten lieber normal indexierbar lassen oder bewusst mit der schlechteren Note leben |
| Überlauf bei 320 px: die Navigation als Scrollstreifen in einem Grid | Grid-Spalte `minmax(0, 1fr)` **und** `min-width: 0` am Scrollcontainer; ab 359 px den Zweit-Knopf im Kopf weglassen |
| `position: sticky` auf einem Grid-Kind wirkte auf dem Handy nicht | Sticky hält nur innerhalb der **eigenen** Gridzeile; auf einer Spalte pro Zeile lieber die Bildhöhe verkleinern |
| Standbild mit `toDataURL` kam schwarz | `preserveDrawingBuffer: true` beim Renderer setzen, sonst ist der Puffer nach dem Zeichnen leer |
| fps-Messung schwankte zwischen 53 und 61, während andere Agenten auf der Maschine arbeiteten | Grenzwerte nie anheben, sondern drei Läufe machen und den Median nehmen |

## 4. Gestaltung, die zur Manufaktur passt

- **Leitmotiv Minuterie:** die Strichskala des Zifferblatts kehrt wieder als Lineal unter dem Hero, als Ring hinter
  der Uhr (`repeating-conic-gradient` mit Radial-Maske) und als Wochen-Lineal der Zeitleiste. Ein Motiv, drei Orte –
  das bindet die Seite zusammen, ohne dass Deko entsteht.
- **Zahlen groß in der Display-Schrift** (40 mm, 42 h, 28 800, 21 Tage) statt Kartenreihen: Fakten wirken damit wie
  ein Datenblatt, nicht wie Werbung.
- **Marcellus** (Serif-Display, weite Laufweite 0,03 em) + **Hanken Grotesk** (Text) ist eine ruhige Paarung; die
  Versal-Überzeilen mit 0,24 em Laufweite tragen den „edel“-Eindruck mehr als jede Farbe.
- Der Demo-Hinweis wurde **gestaltet** (Band mit Rahmen-Etikett oben, Absatz im Fuß) statt als Warnung – so stört er
  den Eindruck nicht und ist trotzdem auf jedem Bildschirm da.

## 5. Nachbesserung nach der Zweitnote (A-032, W5 = 2, W6 = 3)

| Befund | Ursache | Regel |
|---|---|---|
| Bildfolge des Zifferblatt-Wechsels zeigte nur die Liste | Ausschnitt war der Bildschirm nach dem Klick; die Uhr lag darüber | Bildfolgen mit **gezieltem Ausschnitt** (Bild + Auslöser zusammen), Abschnitt vorher so scrollen, dass beides im Bild ist; bei Radien/Masken den berechneten Wert (`getComputedStyle(...).clipPath`) je Zeitpunkt mitschreiben |
| Übergang Poster → Szene belegt keine Bewegung | er ist absichtlich unsichtbar | langsame Bewegung als **Einzelbilder über Sekunden** belegen und die mittlere Pixelabweichung zum ersten Bild daneben schreiben (Zahl statt Behauptung) |
| Fokusbild Telefon war schwarz | erster `a[href^="tel:"]` war der versteckte in der Handyleiste | Zustands-Skripte nur mit `locator(sel).locator('visible=true')`; `Tab` vor `focus()` fokussiert den Skip-Link und scrollt nach oben → stattdessen `keyboard.press('Shift')` und `el.focus()`; `scroll-behavior` im Test per `style` auf `auto` (CSP verbietet `addStyleTag`) |
| Hover/Aktiv kaum vom Ruhezustand zu unterscheiden | nur 2 px Verschiebung und 16 % Farbmischung | Hover: deutlich heller (+20 % Weiß) **und** feine Linie unter der Schrift (`::after`, `scaleX`); Aktiv: `scale(.975)`, 24 % dunkler, Übergang 80 ms; Fokus: Ring mit 4 px Abstand. Alle vier Zustände nebeneinander aufnehmen |
| Kreis des Zifferblatt-Wechsels öffnete sich neben der Zeigerachse | Mitte `52% 50%` geschätzt | Mitte aus dem Standbild messen (`--mitte`), auf dem Handy mit `object-fit: contain` umrechnen; Endradius so wählen, dass die entfernteste Ecke gedeckt ist (hier 85 %) |

**Ladezustand der 3D-Szene – bewusst kein Hinweis:** Das Poster ist mit dem ersten 3D-Bild deckungsgleich und
vollwertig. Ein Lade-Symbol würde fehlenden Inhalt vortäuschen und bliebe dort, wo die Szene nie startet
(„Bewegung reduzieren“, „Daten sparen“, kein WebGL), für immer stehen. Der Zustand steckt leise im Punkt der
Bildunterschrift: leer = Standbild, golden = Szene läuft (Beleg `zustaende-3d-laedt.png`).
