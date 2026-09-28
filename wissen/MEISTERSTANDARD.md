# Meisterstandard – woran eine High-End-Seite gemessen wird

Jede Showcase- und jede Kundenseite muss **alle Pflichtpunkte (P)** erfüllen und in der **Wirkung (W)** im Schnitt
mindestens 4 von 5 erreichen. Geprüft wird mit `/meisterpruefung`. Was nicht messbar ist, wird an Screenshots und
Bildfolgen beurteilt, nicht am Code.

## P1 Technik (automatisch, `werkzeuge/pruefen.mjs`, `lighthouse.sh`, `npm test`)

- Lighthouse mobil mit Kompression: Performance ≥ 95, Barrierefreiheit, Best Practices und SEO = 100, CLS ≤ 0,02.
- 320–1920 px ohne Überlauf, Tippflächen ≥ 44 px, genau eine H1, keine Konsolenfehler.
- Ohne JavaScript alles sichtbar, bei „Bewegung reduzieren“ nichts unsichtbar und nichts in Bewegung.
- Strenge CSP ohne `unsafe-inline`, keine fremden Herkünfte (Schriften, Skripte, Bilder alle vom eigenen Server).

## P2 Gewicht (automatisch, `werkzeuge/budget.mjs`, gemessen komprimiert, erster Aufruf der Startseite)

| Posten | Grenze | Grund |
|---|---|---|
| Übertragung bis „geladen“ | ≤ 500 KB | auf 4G in unter 2 s sichtbar |
| JavaScript | ≤ 60 KB | Seite bleibt sofort bedienbar |
| JavaScript mit 3D-Szene (nachgeladen, nicht im ersten Aufruf) | ≤ 180 KB | three.js-Kern + Szene |
| CSS | ≤ 30 KB | |
| Schriften | ≤ 3 Dateien, ≤ 120 KB | nur Schnitte des ersten Bildschirms vorladen |
| Anfragen bis „geladen“ | ≤ 25 | |
| Video im Hero | nur nach dem Poster, ≤ 1,5 MB, nicht auf „Daten sparen“ | Poster ist das LCP-Element |

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
