# Portfolio schärfen – gespeicherter Plan (A-050)

**Stand 2026-09-29: abgelegt, NICHT umgesetzt.** Elias ruft den Plan ab, wenn er will
(„Portfolio schärfen umsetzen“ bzw. „Plan A-050 anwenden“). Bis dahin bleibt die Portfolio-Seite
(`kunden/elias-studio/`) unverändert.

## Warum

Elias (2026-09-29): Alles ist vorhanden, aber nichts ausgereift. Die Seite soll das High-End-Referenzprodukt
sein, „dass den Kunden schon fast der Atem bei meiner Seite stockt“.

## Die drei Hero-Varianten (Auswahl offen)

Aufrufbar: https://claude.ai/artifact/Xnd2zGP54yLrNWPCW1uhdP · Quelle: `hero-varianten/index.html`
(lokal: `node werkzeuge/gzserver.mjs 8110 wissen/entwuerfe/portfolio-schaerfe/hero-varianten`) ·
Bilder: `screenshots/var-{a,b,c}-{d,m}.png` (d = 1440 px, m = 390 px).

| Variante | Idee | Stärke |
|---|---|---|
| **A · Werkstück** (Empfehlung) | gekipptes Handy, echte Seiten scrollen darin und wechseln alle 9 s; „Gebaut wie ein *Werkstück*.“ + Messwerte | am stärksten auf dem Handy, echte Arbeit sofort sichtbar |
| B · Galerie im Raum | Desktop-Tafel + zwei Handys im 3D-Raum, kippen mit der Maus | wirkt am Rechner räumlich; auf dem Handy flach |
| C · Lichtkegel | Arbeiten im Dunkeln, Lichtkegel folgt dem Zeiger; „Gebaut. *Gemessen.* Betreut.“ | geheimnisvoll; auf dem Handy überdeckt eine Kachel die Überschrift (beheben) |

Mischungen möglich (z. B. A mit Lichtkegel aus C im Hintergrund).

## Umsetzung auf die ganze Seite (wenn Elias es abruft)

Branch `aufbau/portfolio-schaerfe`, Seite `kunden/elias-studio/`.

1. **Eine Welt:** dunkles Atelier als Grund (`--grund #0a0b0d`, Text `#f1efe9`, leise `#a8a59d`,
   Linie `#2a2b30`), genau ein Lichtakzent (`--licht #b9c3ff`). Tag/Nacht-Schalter prüfen: behalten nur, wenn
   der helle Modus gleich hochwertig wird, sonst entfernen.
2. **Hero:** gewählte Variante einbauen, höchstens zwei Zeilen Überschrift, echte Arbeiten statt Stimmungsbild.
   Scroll-Film (Kling) nur behalten, wenn er zur Variante passt.
3. **Arbeiten bildschirmfüllend:** je Musterseite (Lotlinie, Zwischenbild, Lindgrund) ein Bildschirm,
   echte Seite scrollt im Gerät, Link zum Artifact.
4. **Generator rendert echte Mini-Seite:** statt Modell-Skizze eine kleine echte Seite, die Farbe, Schrift,
   Stil und Stufen sofort übernimmt (vorhandene `:has()`-Logik und Reiter weiterverwenden).
5. **Texte halbieren:** jede Überschrift ≤ 2 Zeilen, Absätze ≤ 2 Sätze.
6. **Meisterprüfung:** `/pruefen` + `/meisterpruefung` (Lighthouse ≥ 95/100/100/100, CLS 0, 320–1920 px,
   ohne JS bedienbar, reduzierte Bewegung, Kopf-Regeln, CSP ohne `unsafe-inline`).
7. **Sichern:** Commit, PR, Portfolio-Artifact (https://claude.ai/artifact/8Yaq6z8EGEYNpf9SKEXjDE) neu
   veröffentlichen, Screenshots 1440/390 ablegen.

Kosten: keine Credits nötig. Optional danach: Seedance-Kamerafilm mit echter Seite auf dem Display
(ca. 20 Higgsfield-Credits) – nur mit neuer Freigabe von Elias.

## Stolperfallen aus dem Varianten-Bau

- Bilder in Tafeln mit `height`-Attribut brauchen `block-size: auto`, sonst gestaucht.
- Hintergrundbild „Werkbank“ zeigte ein zweites Handy → durch Holz-Verlauf ersetzt.
- Auf dem Handy 3D flach schalten und Seitengeräte ausblenden.
- Blob-/Film-Seiten erreichen nie `networkidle` (pruefen.mjs ist angepasst).
