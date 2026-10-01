# menue-blatt

Handy-Menü (unter 48rem) als Blatt von unten, im Daumenbereich.

- **Markup:** `<button class="menue-knopf" aria-expanded="false" aria-controls="nav">Menü</button>` und
  `<nav class="nav blatt" id="nav">…<ul>…</ul></nav>` im `.kopf`. Der Kopf darf kein `backdrop-filter`/`transform`
  haben (sonst bezieht sich `position: fixed` auf den Kopf, FEHLER 14).
- **Ohne JS:** Navigation bleibt als Zeile im Kopf sichtbar. Am Computer immer Zeile.
- **Tempi:** öffnen 0,85 s `--kurve-sanft`, schließen 0,42 s `--kurve-schliessen`, Einträge ab 0,22 s um 60 ms versetzt,
  Schleier blendet mit. Bildfolge: 150 ms fast nichts, 300 ms ≈ ein Viertel.
- **Bedienung:** geschlossen `inert` + `visibility: hidden`; offen: alles außer Knopf und Blatt `inert` (auch Skip-Link,
  Fuß, Schnellleiste), Fokus auf den ersten Eintrag; Escape, Schleier, Link oder Wischen nach unten (> 90 px oder schnell)
  schließt; Fokus zurück zum Knopf. Der Knopf heißt offen „Schließen“.
