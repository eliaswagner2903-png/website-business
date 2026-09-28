# galerie

Wisch-Streifen mit Einrasten und Großansicht im nativen `<dialog>`.

- **Markup:** siehe `demo.html`: `.galerie` > `.galerie-leiste` (Titel + Knöpfe `data-galerie="zurueck|weiter"`),
  `ul.galerie-streifen` > `li` > `figure` > `a.galerie-bild[href=großes Bild][data-breite][data-hoehe]` > `img`
  (`loading="lazy"`, `srcset`, `width`/`height`), und `dialog.galerie-dialog` mit `img`, `.galerie-zaehler`,
  Knöpfen `data-dialog="zurueck|weiter|zu"`.
- **Ohne JS:** Streifen wischbar, der Link öffnet die große Bilddatei. Die Leiste mit Knöpfen erscheint nur mit JS.
- **Mit JS:** Tipp öffnet die Großansicht (Zähler „02 / 06“), Pfeiltasten, Wischen (> 50 px), Escape, Klick auf den Rand;
  Fokus kehrt zum Bild zurück. Strg/Cmd-Klick öffnet weiterhin einen neuen Tab.
- **Tempi:** Großansicht 0,5 s `--kurve-sanft` auf (Deckkraft + Skalierung von 0,96), 0,42 s zu (`@starting-style`,
  `allow-discrete`); Bildwechsel 0,28 s Überblendung; Hover-Zoom 3 % in 0,85 s. Reduziert: sofort.
- Platzhalterbilder in `medien/` sind erzeugt, keine Stockfotos – durch Fotos des Kunden ersetzen.
