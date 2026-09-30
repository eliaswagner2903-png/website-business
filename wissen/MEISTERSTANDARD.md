# Meisterstandard – woran eine High-End-Seite gemessen wird

Jede Showcase- und jede Kundenseite muss **alle Pflichtpunkte (P)** erfüllen und in der **Wirkung (W)** im Schnitt
mindestens 4 von 5 erreichen. Geprüft wird mit `/meisterpruefung`. Was nicht messbar ist, wird an Screenshots und
Bildfolgen beurteilt, nicht am Code.

## P1 Technik (automatisch, `werkzeuge/pruefen.mjs`, `lighthouse.sh`, `npm test`)

- Lighthouse mobil mit Kompression: Performance ≥ Wert der Gewichts-Klasse (P2: schlank 95, Erlebnis 90, Kino 85), Barrierefreiheit, Best Practices und SEO = 100, CLS ≤ 0,02.
- 320–1920 px ohne Überlauf, Tippflächen ≥ 44 px, genau eine H1, keine Konsolenfehler.
- JavaScript ist erlaubt, wenn es Nutzen bringt (Bedienung, Konfigurator, 3D, Bewegung). Ohne JavaScript bleiben **Inhalt, Navigation, Kontakt und Formulare** nutzbar; ein rein interaktives Erlebnis (3D, Film, Konfigurator) zeigt dann ein Standbild oder den Text dazu. Bei „Bewegung reduzieren“ nichts unsichtbar und nichts in Bewegung.
- Strenge CSP ohne `unsafe-inline`, keine fremden Herkünfte (Schriften, Skripte, Bilder alle vom eigenen Server).

## P2 Gewicht (automatisch, `werkzeuge/budget.mjs`, gemessen komprimiert, erster Aufruf der Startseite)

Die Grenze hängt am **Zweck der Seite**, nicht an einer festen Zahl (Elias 2026-09-30). Die Klasse steht in `kunde.json`
(`"budgetklasse"`) und wird im Pflichtenheft begründet; ohne Angabe gilt `schlank`. Gemessen wird das, was Nutzer spüren
(LCP ≤ 2,5 s, CLS ≤ 0,02, ≥ 55 fps beim Scrollen, Lighthouse); die KB-Grenzen sind die Leitplanken dafür. Schwere Medien
(Film, große 3D-Szene) kommen erst nach Poster und „geladen“, nie bei „Daten sparen“ oder „Bewegung reduzieren“.

| Klasse | Wann | Gesamt | JS (1. Aufruf / nachgeladen) | CSS | Schriften | Anfragen | fps | Lighthouse Perf |
|---|---|---|---|---|---|---|---|---|
| `schlank` | Info-Seite: Zeiten, Telefon, Karte (Handwerk, Gastro, Praxis) | 500 KB | 60 / 180 KB | 30 KB | 3 Dateien, 120 KB | 25 | 55 | 95 |
| `erlebnis` | Markenauftritt mit Bewegung, 3D, Konfigurator | 1,2 MB | 200 / 600 KB | 60 KB | 5 Dateien, 250 KB | 40 | 55 | 90 |
| `kino` | Scroll-Film, große 3D-Szene, Produkt-Showcase | 2,5 MB | 350 / 1500 KB | 100 KB | 6 Dateien, 400 KB | 60 | 50 | 85 |

Werte stehen in `werkzeuge/budgetklasse.mjs` (eine Quelle). Wer eine höhere Klasse wählt, nennt den Nutzen (Wirkung, Zweck) im
Pflichtenheft. Für Medien gilt zusätzlich:

| Posten | Grenze | Grund |
|---|---|---|
| Video im Hero | nur nach dem Poster, ≤ 1,5 MB (`schlank`) bzw. ≤ 3 MB (`erlebnis`, `kino`), nicht auf „Daten sparen“ | Poster ist das LCP-Element |
| Scroll-Film (Kino-Hero, `wissen/lehren/scroll-film.md`) | Computer ≤ 12 MB, Handy ≤ 5 MB, erst nach dem Poster und nach „geladen“, nie bei „Daten sparen“ oder „Bewegung reduzieren“ | Elias 2026-09-29 (A-045); zählt nicht zum ersten Aufruf |

## P3 Bewegung (Bildfolge, `werkzeuge/bildfolge.mjs`)

- Nach 150 ms ist höchstens ein Viertel einer großen Bewegung sichtbar; nichts nimmt in < 0,3 s den Bildschirm ein.
- Nur `transform`, `opacity`, `clip-path`, `mask-position`. Keine Endlos-Puls- oder Schwebe-Effekte.
- 3D und Videos pausieren außerhalb des Bildschirms und bei verstecktem Tab; bei „Bewegung reduzieren“ ein Standbild.
- Mindestens 55 fps beim Scrollen auf dem Handy-Profil (4× CPU-Drosselung) – gemessen, nicht geschätzt.

## P4 Anpassbarkeit

- Die ganze Marke steckt in **einer** Datei `css/marke.css`: Farben (6 Rollen), Schriften, Radien, Tempi, Abstände.
  Eine Farb- oder Schriftänderung dort darf nichts anderes kaputt machen (Test: zweites Farbschema einspielen,
  `/meisterpruefung` muss grün bleiben, Kontrast AA bleibt).
- Inhalte (Texte, Leistungen, Preise) stehen an einer Stelle, nicht verstreut im Markup.

## W Wirkung (Beurteilung an Screenshots Handy + Computer, je 1–5)

| | Frage | 5 heißt |
|---|---|---|
| W1 Erster Eindruck | Weiß man in 5 s, was es ist, für wen und was der nächste Schritt ist? | ja, und man will weiterscrollen |
| W2 Eigenständigkeit | Könnte die Seite zu jeder beliebigen Firma gehören? | nein: Leitmotiv aus der Welt des Kunden |
| W3 Typografie | Hierarchie, Rhythmus, Laufweite, Zeilenlänge 55–75 Zeichen | wirkt gesetzt, nicht getippt |
| W4 Komposition | Spannung durch Größenunterschiede, Weißraum, Raster | keine gleichförmigen Kartenreihen |
| W5 Bewegung | Hat jede Animation einen Zweck (führen, erklären, antworten)? | ruhig, genau, nie im Weg |
| W6 Handwerk | Zustände (Hover, Fokus, Aktiv, Fehler, leer, lädt) gestaltet? | jeder Zustand bedacht |
| W7 Glaubwürdigkeit | Echte Fotos/Visuals, konkrete Texte, keine Floskeln | nichts wirkt ausgedacht |

Unter 4 in einem Punkt: konkret benennen, was fehlt, nachbessern, neu beurteilen. Die Beurteilung macht nicht nur
der Erbauer: Uffz. Schnörkel (Optik-Späher) bewertet die Screenshots unabhängig; weichen die Noten um mehr als 1 ab,
entscheidet die strengere.

## Hinweis zur Zweitnote

Der Optik-Späher (`uffz-schnoerkel`) hat in dieser Umgebung oft keinen Browser. Ihm deshalb immer die
Screenshot-Pfade mitgeben (Handy, Computer, Ganzseite, Bildfolgen) und zusätzlich Belege für die Zustände:
je ein Bild mit Tastaturfokus auf Hauptknopf, Telefonlink und einem aufklappbaren Element. Ohne solche Bilder
kann er W5 und W6 nicht beurteilen und benotet zu Recht streng.
