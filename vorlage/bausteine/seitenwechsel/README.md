# seitenwechsel

Weicher Übergang zwischen zwei Seiten derselben Website – ohne JavaScript (`@view-transition { navigation: auto }`).

- **Einbau:** `seitenwechsel.css` auf **beiden** Seiten (steckt in `bausteine.css`). Kopf (`.kopf`), Schnellleiste
  (`.schnell`) und `main` haben feste Namen: Kopf und Leiste stehen still, der Inhalt wechselt.
- **Tempi:** alter Inhalt 0,3 s `--kurve-schliessen` 8 px nach oben weg; neuer 0,55 s `--kurve-standard`, 0,12 s später,
  16 px von unten. Verwandlungen (`::view-transition-group`) 0,85 s `--kurve-sanft`.
- **Benannte Übergänge:** `class="uebergang-titel"` bzw. `uebergang-bild` auf Seite A und B – das Element verwandelt sich.
  Jeder Name darf pro Seite nur einmal vorkommen (sonst bricht der Übergang ab). Weitere Namen in der CSS ergänzen.
- „Bewegung reduzieren“ und Browser ohne Unterstützung: normaler Seitenwechsel. Demo: `demo.html` ↔ `seite-2.html`.
