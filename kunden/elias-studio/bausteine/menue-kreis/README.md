# menue-kreis

Handy-Menü (unter 48rem) als Kreis, der aus dem Menü-Knopf wächst und die Seite füllt. Idee aus Bruder C
(DESIGN-WISSEN §8); ersetzt `menue-blatt` auf der OQ-Seite.

- **Markup:** wie `menue-blatt`: `<button class="menue-knopf" aria-expanded="false" aria-controls="nav">Menü</button>` und
  `<nav class="nav blatt" id="nav">…<ul>…</ul><div class="blatt-fuss">…</div></nav>` im `.kopf`. Der Kopf darf kein
  `backdrop-filter`/`transform` haben. Der letzte `<li>` der Liste ist der Hauptknopf, alle davor werden nummeriert.
- **Ohne JS:** Navigation bleibt als Zeile im Kopf. Am Computer immer Zeile (`.blatt-fuss` ist dort versteckt).
- **Tempi:** öffnen 0,95 s `cubic-bezier(.55,.05,.25,1)`, schließen 0,45 s, Einträge ab 0,35 s um 70 ms versetzt.
  Bildfolge prüfen mit dem Skill `bildfolge`.
- **Bedienung:** geschlossen `inert` + `visibility: hidden`; offen: alles außer Knopf, Logo, Schema-Schalter und Fläche
  `inert`, Fokus auf den ersten Eintrag; Escape oder Link schließt, Fokus zurück zum Knopf. Der Knopf heißt offen „Schließen“.
- **Reduzierte Bewegung:** die globale Regel der Seite setzt alle Übergänge auf 0 s, das Menü erscheint sofort.
