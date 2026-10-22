# Wagner Seiten: Auftritt der eigenen Seite (Stand 22.10.2026)

Die Seite `kunden/elias-studio` heißt **Wagner Seiten** (vorher Seitenkapitän, alter Stand: Git-Tag `vor-wagner-seiten-2026-10-22` lokal, Commit `d2cf66d`).

## Aufbau
Hero (Name, Aussage, drei Musterseiten als Handy-Bilder), Leistungen (sechs Karten im Wechsel Grüngrau/Anthrazit), Ablauf, Arbeiten (vier Musterseiten), Preise, Fragen, Kontakt (Anthrazit). Texte stehen in `inhalt/seite.json`, gebaut wird mit `node bauen.mjs` (HTML in `public/` nie von Hand ändern).

## Gestaltung
- Farben: Creme `#f4efe3` als Grund, Grün `#23703f` (Logo `#2f8f4e`), Anthrazit `#26292d`. Variablen in `public/css/marke.css`, Markenebene in `public/css/auftritt.css`.
- Schrift: Inter (normal, kursiv), lokal in `public/fonts/`.
- Knöpfe ohne Pfeile. Musterseiten-Knöpfe haben ein Portal-Symbol und einen Teleport-Übergang (`data-teleport`, Code in `public/js/seite.js`, bei „Bewegung reduzieren“ öffnet die Seite normal).
- Handy-Menü: kleine Karte unter dem Kopf, Hintergrund unscharf, Tippen daneben schließt.

## Bilder und Clips der Leistungskarten
Higgsfield, 22.10.: sechs Standbilder (gpt_image_2_5) und sechs Clips (Kling, je 5 s, 720x540 mp4, 40 bis 200 KB). Dateien `public/medien/leistung-<id>.{webp,mp4}` mit `id` = neu, alt, seo, geo, tempo, sicher. Clips laufen nur sichtbar und nie bei „Bewegung reduzieren“ (dann Standbild), siehe `leistungBild()` in `bauen.mjs`. Originale und Übersichten: `/mnt/project-files/wagner-seiten/higgsfield-bilder/`.
Kosten ca. 63,5 Credits (Stand danach 55,5). Weitere Erzeugung nur mit ausdrücklicher Summe von Elias; ein Kling-Clip kostet 8,75.

## Offen (Handgriffe für Elias)
Domain `wagnerseiten.de` kaufen, Marke von Hand prüfen (DPMA, TMview, EUIPO), Löschfreigabe für ungenutzte `kapitaen-*`-Bilder und Cormorant/Jost-Schriften.
