# Generalprobe Stufe 6 – Zeitprotokoll (A-037)

Kundenseite `kunden/urfa-meister/` vom Briefing bis zur Abnahme in einem Zug. Uhrzeiten in UTC (`date -u +%H:%M`).

| Phase | Start | Ende | Dauer |
|---|---|---|---|
| Lesen | 09:25 | 09:28 | 3 min |
| Anlegen | 09:28 | 09:30 | 2 min |
| Gestaltung/Grundgerüst | 09:30 | 09:42 | 12 min |
| Speisekarte | 09:42 | 09:44 | 2 min |
| Unterseiten | 09:44 | 09:45 | 1 min |
| Prüfen | 09:45 | 09:57 | 12 min |
| Nachbessern | 09:57 | 09:59 | 2 min |
| Meisterprüfung | 09:59 | 10:02 | 3 min |
| Doku | 10:02 | 10:03 | 1 min |

**Gesamt: 38 min** (09:25–10:03 UTC).

**Zeitfresser:** Gestaltung/Grundgerüst (Generator, Leitmotiv Sini, Schriften-Subset, Ersatzschrift-Metriken) und
Prüfen (Lighthouse 3 Läufe je Seite, Budget, Bildfolgen, Zustands-Screenshots). Speisekarte und Unterseiten waren
dank Generator und AST-Übernahme in wenigen Minuten fertig.

**Lohnt sich als Werkzeug/Skill:**
- `werkzeuge/zustaende.mjs`: Fokus, Hover, Fehler, leere Suche, Menü, Schnellleiste, `#pruefen`, ohne JS als ein Sammelbild (heute Skript im Scratchpad).
- `werkzeuge/schrift-subset.sh`: pyftsubset auf Latin-1 + Latin Extended-A plus Messung von `size-adjust`.
- Bildfolge eines einzelnen Elements (Ausschnitt statt Vollbild) als Option von `bildfolge.mjs`.
- Abgleich-Test-Muster (alte und neue Seite mit derselben Regex) als Vorlage in `vorlage/tests/`.
- Der Gesamtablauf steht jetzt als Skill `/kundenseite-bauen`.

## Meisterprüfung (ohne `uffz-schnoerkel`, Zustände selbst aufgenommen)

| Punkt | Ergebnis | Begründung |
|---|---|---|
| P1 Technik | bestanden | npm test 26/26 (inkl. Preisabgleich 90/90), html-validate 0, kopf-pruefen 8 Seiten 0, pruefen.mjs 320–1920/ohne JS/reduzierte Bewegung OK, Lighthouse mobil 98/100/100/100 (Start), 100/100/100/100 (Karte, Kontakt), 97 (Galerie), CLS 0. |
| P2 Gewicht | bestanden | Startseite 363 KB, JS 7,3 KB, CSS 16,2 KB, Schriften 45 KB in 2 Dateien, 15 Anfragen. Galerie 693 KB (nur Startseite ist Pflicht, siehe offene Punkte). |
| P3 Bewegung | bestanden | Bildfolgen Laden 1440 (Sini dreht ein, LCP ab 0 ms sichtbar) und Menü 390 (Schleier dunkel, fertig ≈ 800 ms). |
| P4 Anpassbarkeit | bestanden | Schema `kalk` über `SCHEMA=kalk node bauen.mjs`: pruefen.mjs OK, Lighthouse 98/100/100/100, Budget OK. |
| W1 Erster Eindruck | 5 | Name, „Anatolische Küche in Eislingen“, Status, Anrufen und Speisekarte, Adresse und Zeiten im ersten Bildschirm, die Sini zieht nach unten. |
| W2 Eigenständigkeit | 5 | Leitmotiv Sini (Kupfertablett mit Gravurring), Logo-Skyline als Horizont und Zierlinie aus dem Logo – gehört nur zu diesem Restaurant. |
| W3 Typografie | 4 | Marcellus (römische Versalien wie im Logo) zu Manrope, klare Stufen, Zeilen 55–70 Zeichen; auf 320 px wird die Wortmarke eng. |
| W4 Komposition | 4 | Hero asymmetrisch, Vitrine als Bento mit Größenunterschieden, Tafel mit mitlaufendem Bild; der Wissen-Block ist noch eine gleichförmige Dreierreihe. |
| W5 Bewegung | 4 | Jede Bewegung führt (Einlaufen der Sini, Leiste erscheint erst, wenn der Anruf-Knopf weg ist, Chips folgen der Karte); aktiver Chip hinkt im zweispaltigen Desktop-Layout leicht nach. |
| W6 Handwerk | 4 | Fokus, Hover, Aktiv, Fehler („Bitte prüfen“), leere Suche, Senden-Sperre, Prüfmodus gestaltet (`bilder/zustaende-*.png`); leere Suche lässt den Chip aktiv. |
| W7 Glaubwürdigkeit | 4 | Nur eigene Fotos und freigegebene Texte, Preise aus der Karte abgeleitet; die Fotos stammen aus Handy-Screenshots und sind weich. |
