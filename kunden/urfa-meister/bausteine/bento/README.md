# bento

Raster mit Größenspannung statt gleichförmiger Kartenreihe. Nur CSS.

- **Markup:** `<div class="bento">` mit `<article class="bento-kachel [--gross|--breit|--hoch|--akzent]">`, darin
  `<span class="bento-nummer" aria-hidden="true">01</span>` und ein `<div>` mit Überschrift und Text.
- **Spalten:** 1 (Handy), 2 ab 40rem, 3 ab 64rem. `--gross` = 2×2, `--hoch` = 2 Zeilen, `--breit` = ganze Zeile (ab 64rem
  Überschrift und Text nebeneinander).
- **Zellen zählen** (FEHLER 11): bei 3 Spalten z. B. gross 4 + 2 × normal + breit 3 = 9 = 3 Zeilen.
- **Hover** nur für Kacheln mit Link (`:has(a)`, 3 px hoch, Rahmen in Akzent, 0,3 s); der Link deckt per `::after` die ganze
  Kachel ab. Kacheln ohne Link reagieren nicht – sonst wirkt Unklickbares klickbar.
