# Variante 1 „Abend in Urfa“ – Design-Notizen

Für alle, die an der Website weiterarbeiten, ausdrücklich auch für die Sitzung von Variante 2
(`variante-2/DESIGN-NOTIZEN.md` auf `claude/variante-2-light-minimal-1e07sl`). Dort stehen viele gute Lektionen,
die hier übernommen wurden (Tempo und Kurve vor Farbe prüfen, Bildfolgen statt Standbilder, Leiste unter statt im Foto).

Seiten erzeugen: `python3 werkzeuge/seiten.py` (alle Inhalte, Preise und Texte stehen nur dort).
Online-Vorschau (privat im Konto des Nutzers): https://claude.ai/artifact/Qo99W1RFepBRnNZBE1FaxL,
gebaut mit `python3 werkzeuge/vorschau.py <ordner>` (bettet CSS, JavaScript, Schriften und Icons in jede Seite ein).

## 1. Idee

Variante 2 ist hell, frisch und modern. Variante 1 bleibt dunkel und setzt auf das, was das Restaurant wirklich hat:

1. **Das Original-Logo, nicht nachgezeichnet.** Die Logodatei ist für dunklen Grund gemacht. Ihre schattierte Skyline
   (Baum, Burg mit vier Arkaden, zwei Säulen, Palmeninsel) steht als WebP mit Transparenz im Hero
   (`assets/img/skyline-720.webp` / `-1400.webp`). Darunter wird der Schriftzug live gesetzt, wie im Logo:
   „URFA SOFRASI“ in Cormorant mit weiter Laufweite, dann der grüne Untertitel mit Linie und Raute.
2. **Farben exakt aus dem Logo gemessen:** Creme `#f0ece4` (Schriftzug), Grün `#7cac4c` (Untertitel).
   Dazu ein ganz leiser warmer Schein (`--glut`) hinter der Skyline, wie Abendlicht über Urfa.
3. **Der Bogen als Leitmotiv** (die Arkaden der Burg): Fotos stehen in Bogenfenstern, der Hero ist wie eine
   Arkade gebaut (Bogen – Logo – Bogen), „Gut zu wissen“ sind drei Arkaden mit doppelter Linie und grüner Raute als
   Schlussstein, das Handy-Menü ist ein Blatt mit Bogen-Oberkante, die Galerie ein versetzter Säulengang.
4. **Speisetafel statt Karten:** Beliebte Gerichte als Liste mit Punktlinie zum Preis, wie auf einer Speisekarte.
   Am Computer wechselt das Foto im Bogen passend zum Gericht (nur wo es ein echtes Foto gibt: Urfa Sofrası,
   Döner, Pide & Lahmacun). Jede Zeile springt direkt zur Kategorie der Speisekarte.
5. **Überzeilen im Stil des Logos:** Linie – Raute – Text (`.zier`), mittig mit gespiegelter zweiter Raute.

## 2. Werte

| Token | Wert | Verwendung |
|---|---|---|
| `--bg` / `--bg-2` / `--panel` | `#0f0e0c` / `#16140f` / `#13110e` | Grund, Menü-Blatt, Kontakt-Panel |
| `--creme` / `--text` / `--leise` | `#f0ece4` / `#e4ded2` / `#a9a193` | Überschriften / Text / Nebentext (AA auf allen Flächen) |
| `--gruen` / `--gruen-hell` | `#7cac4c` / `#a2cb74` | Knöpfe (dunkle Schrift darauf, 7 : 1), Preise, Hervorhebung |
| `--ease` | `cubic-bezier(.2, .8, .2, 1)` | Knöpfe, kleine Bewegungen |
| `--sanft` | `cubic-bezier(.45, .05, .25, 1)` | große Flächen (Menü-Blatt, Bögen, Skyline): startet leise |

Schrift: Cormorant Garamond als Variable Font (300–700, mit Kursive für Hervorhebungen) + Lato 400/700, lokal.
Bögen: `border-radius: 999px 999px 12px 12px` ergibt bei jeder Breite einen exakten Halbkreis. Die zweite Linie
entsteht mit `outline` + `outline-offset` (folgt dem Radius).

## 3. Bewegung und Tempi

| Effekt | Tempo | Warum |
|---|---|---|
| Skyline beim Laden | 2,2 s, Maske mit weicher Kante wandert von links nach rechts | wie Licht, das über die Stadt geht; ab dem ersten Bild angeschnitten sichtbar (LCP) |
| Schriftzug, Untertitel, Text, Knöpfe | 0,15 s – 0,85 s gestaffelt | nach 1,4 s steht alles, niemand wartet |
| Bögen im Hero steigen auf | 1,5 s `clip-path` in Bogenform (nur ab 1100 px) | auf dem Handy ist das Foto das größte Element und muss sofort stehen |
| Diashow | 6,8 s Takt, 1,4 s Überblendung, 7 % Zoom über 9 s, rechter Bogen um halben Takt versetzt | wie bei Variante 2 bewährt; nie zwei Wechsel gleichzeitig |
| Handy-Menü | 0,72 s auf mit `--sanft`, 0,42 s zu; Einträge ab 0,22 s im 60-ms-Takt | Bildfolge: nach 150 ms erst die Oberkante sichtbar, nach 450 ms gut die Hälfte |
| Wort-Welle | 45 ms Versatz, je 1 s | ca. 3,5 s für den Absatz, zeitgesteuert, nicht an das Scrollen gekoppelt |
| Arkaden | Einblenden, dann innere Linie 1,6 s von unten nach oben, Raute setzt nach 1,2 s auf | „wird gebaut“, ohne zu verspielen |
| Zähler 70 / 40 | 1,4 s ease-out | |
| Navigation | Linie mit Raute gleitet 0,5 s | Raute wie im Logo-Untertitel |

Alles steht unter `.js` und `prefers-reduced-motion: no-preference`. Ohne JavaScript ist die Navigation eine Zeile
unter dem Logo, die Schnellleiste ist sichtbar, alle Inhalte sind da.

## 4. Handy zuerst

- Schnellleiste unten: großer grüner Knopf mit der Telefonnummer, dazu Route und Karte. Auf der Startseite erscheint
  sie erst, wenn der Anruf-Knopf im Hero aus dem Bild ist (so ist immer genau ein Anruf-Knopf sichtbar).
- Menü als Blatt von unten: im Daumenbereich, schließt per Wischen nach unten, Tipp daneben, Tipp auf den Griff,
  Escape. Die Seite dahinter bleibt sichtbar (abgedunkelt, leicht unscharf) und ist `inert`.
- Einblicke als Wisch-Streifen mit Einrasten statt langem Raster; Tipp öffnet die Großansicht.
- Weitere Diashow-Fotos, Tafelfotos und Menü-Vorschaubilder werden erst geladen, wenn sie gebraucht werden.

## 5. Fehler dieser Runde (und die Regel dahinter)

| # | Fehler | Ursache | Regel |
|---|---|---|---|
| 1 | Bögen viel schmaler als geplant | `<figure>` hat im Browser 40 px Rand links und rechts | Bei `<figure>` immer `margin: 0` setzen |
| 2 | Doppelte Bogenlinie fehlte im Hero | Die Aufstiegs-Animation mit `clip-path` und `fill-mode: both` schneidet auch `outline` ab | `animation-fill-mode: backwards`, dann ist `clip-path` nach dem Ende weg |
| 3 | Performance 87 statt 95 | Das Hero-Foto war auf dem Handy das LCP-Element, aber `loading="lazy"`: 2 s Ladeverzögerung | LCP-Element per Lighthouse (`lcp-breakdown-insight`) bestimmen; dieses Bild nie lazy, `fetchpriority="high"` |
| 4 | 160 ms Blockierzeit beim Start | Im Einblend-Skript wurden Position lesen und Klasse schreiben abwechselnd ausgeführt (Layout-Thrashing), dazu erzwungene Reflows beim Aufbau der Diashow | Erst alle `getBoundingClientRect()` lesen, dann schreiben; `offsetWidth`-Tricks nur beim Neustart einer Animation |
| 5 | Kursivschrift (38 KB) lud vor dem Hero-Foto | Diashow-Titel im ersten Bildschirm waren kursiv | Im ersten Bildschirm nur Schnitte verwenden, die ohnehin geladen werden |
| 6 | Header-Skyline wurde auf dem Handy geladen, obwohl ausgeblendet | `display: none` verhindert das Laden eines `<img>` nicht | `loading="lazy"`: ausgeblendete Bilder lädt der Browser dann nicht |
| 7 | Nach Sprung zu „Pizzen“ sprang die Markierung beim Weiterscrollen auf „Grillgerichte“ | Zwei Spalten: an der Leselinie liegen zwei Kategorien, beide oben gleich hoch | Die Kategorie gewinnt, deren Überschrift zuletzt die Linie passiert hat; bei Gleichstand bleibt die aktive |
| 8 | Sprungziel landete genau an der Unterkante der Leiste | `scroll-padding` + `scroll-margin` mit festen Zahlen geschätzt | Höhe der Leiste per Skript messen (`--tools-h`) und daraus rechnen; nachmessen |
| 9 | „Datenschutzerklärung“ ragte bei 320 px über den Rand | langes deutsches Wort in großer Schrift | `hyphens: auto` und `overflow-wrap: break-word` für Überschriften |
| 10 | Menü-Schließen-X lag auf dem ersten Vorschaubild | Ecke des Bogenblatts ist rund, Platz dort knapp | Den Griff oben mittig zum Schließen-Knopf machen (größere Trefferfläche, iOS-Muster) |
| 11 | Lokale Lighthouse-Werte zu pessimistisch | `python3 -m http.server` komprimiert nicht (CSS 46 KB statt 11 KB) | Zusätzlich mit gzip-Server messen, wie auf dem Webspace per `.htaccess` |

## 6. Messwerte (Lighthouse mobil, mit Kompression)

Startseite 95 · Speisekarte 98 · Galerie 95 · Kontakt 99; Barrierefreiheit, Best Practices und SEO jeweils 100;
CLS höchstens 0,007. Variante 2 unter denselben Bedingungen: Performance 94, Barrierefreiheit 94
(SEO 66 wegen des gewollten `noindex`).
