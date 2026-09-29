# einblenden

Elemente mit `class="einblenden"` gleiten beim Hereinscrollen 24 px hoch und werden sichtbar.

- **Einbau:** Klasse an Überschriften, Absätze, Kacheln unterhalb des ersten Bildschirms. `einblenden.css` + `einblenden.js`.
- **CSS zuerst:** `animation-timeline: view()` unter `@supports`, Bereich `entry 5% → entry 100%`. Was beim Laden ganz im
  Bild ist, hat den Bereich schon hinter sich und bleibt unverändert – nichts im ersten Bildschirm wird versteckt.
- **Rückfall** (Browser ohne Scroll-Timeline): IntersectionObserver; der erste Aufruf liefert die Lage ohne erzwungenes
  Layout, danach festes Tempo 0,85 s `--kurve-standard`, Geschwister 85 ms versetzt, Hilfsklassen werden danach entfernt.
  Testen: `demo.html?rueckfall`.
- Bewegt wird `translate` statt `transform` – Hover-Transforms (z. B. Bento-Kachel hebt sich) bleiben frei.
- Reduzierte Bewegung / ohne JS: alles sofort sichtbar (ohne JS läuft nur die CSS-Variante, die nach dem Scrollen fertig ist).
- Hinweis: Die CSS-Variante ist an die Scrollposition gekoppelt. Der Bereich ist kurz gewählt (fertig, sobald das Element
  ganz im Bild ist), damit es nicht „schwimmt“. Große Flächen lieber nicht einblenden.
