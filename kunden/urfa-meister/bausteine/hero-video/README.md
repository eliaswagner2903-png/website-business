# hero-video

Bildrahmen im ersten Bildschirm. Das Poster ist das LCP-Element, das Video kommt erst danach.

- **Markup:** `<figure class="held-video" data-webm="…webm" data-mp4="…mp4">` mit
  `<img class="held-video-poster" fetchpriority="high" width height srcset …>` (nie `loading="lazy"`), optional
  `<button class="held-video-knopf" type="button" aria-pressed="false" hidden><span class="unsichtbar">Video anhalten</span></button>`.
- **Laden:** erst nach `window.load` + Leerlauf und nur, wenn der Rahmen sichtbar ist. Nicht bei „Bewegung reduzieren“,
  nicht bei „Daten sparen“ (`navigator.connection.saveData`), nicht ohne `data-webm`/`data-mp4`. Das Video bekommt kein
  `poster`-Attribut und hat die Größe des Posters – es wird kein neues LCP-Element.
- **Laufen:** stumm, Schleife, `playsinline`; blendet 1,2 s `--kurve-sanft` über das Poster. Pausiert außerhalb des Bildes,
  bei verstecktem Tab und per Knopf (WCAG 2.2.2).
- **Grenzen** (Meisterstandard P2): Video ≤ 1,5 MB, WebM (VP9) + MP4 (H.264 für ältere Safari), 6–10 s, ruhige Bewegung.
- **Platzhalter:** `class="held-video held-video--platzhalter"` ohne Bild/Video zeigt eine Fläche aus den Markenfarben mit
  Hinweis – so steht es auf der Startseite der Vorlage. `medien/film.webm` (8 s, 640 KB) und die Poster sind erzeugte
  Testbilder, kein echtes Visual.
