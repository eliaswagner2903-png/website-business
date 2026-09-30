# Jury OSG-Neubau – Runden und Punkte

Kriterien und Punkteschema: [JURY-KRITERIEN.md](JURY-KRITERIEN.md), vor Runde 1 festgelegt. Bestanden ab 75 von 100 Punkten.
Jede Runde bewerten drei neue, unabhängige Bewerter (eigene Agenten, die nicht mitgebaut haben): Gestaltung (A, D), Inhalt und Nutzerführung (B, D, im Browser bedient), Technik (C, selbst gemessen). D ist der Mittelwert beider Bewerter.

## Runde 1 (2026-09-30) – 63,75 / 100 → nicht bestanden, nachbessern

| Block | Punkte | Höchstwert |
|---|---|---|
| A Gestaltung und Wirkung | 21 | 35 |
| B Inhalt und Nutzerführung | 15 | 25 |
| C Technik, Barrierefreiheit, Auffindbarkeit | 17 | 25 |
| D Fortschritt (Mittel aus 11 und 10,5) | 10,75 | 15 |
| **Summe** | **63,75** | **100** |

Einzelnoten: A1 3,5 · A2 3 · A3 2,5 · A4 3 · A5 3 · A6 3,5 · A7 2,5 · B1 2,5 · B2 3,5 · B3 3 · B4 2,5 · B5 3,5 · C1 4,5 · C2 3 · C3 2,5 · C4 3 · C5 4 · D1 4/4 · D2 3,5/3,5 · D3 3,5/3.

Wichtigste Mängel (zusammengeführt, nach Wirkung):
1. Handy-Menü nicht bedienbar: der Schleier liegt über dem Blatt, jeder Tipp schließt das Menü (Bewerter 2, per Touch nachgewiesen).
2. Cloudflare Pages leitet `/x.html` auf `/x` um: Canonicals, Sitemap und Links zeigen auf Umleitungen, drei `_redirects`-Regeln bilden Schleifen.
3. Formular: nur Browser-Blasen, Label unter dem festen Kopf, Kontext (Serie, Finder-Auswahl) geht verloren, Knopf bleibt nach „Zurück“ gesperrt.
4. Fokus auf dem Handy von der Schnellleiste verdeckt; 29 px Überlauf bei 320 px durch die neue Shop-Suche.
5. Werkzeugfinder: Grenze (6 Leitserien) nicht offen gesagt, kein Shop-Weg je Treffer.
6. Satz: zu enge Laufweite in Überschriften (fehlende Wortabstände), Anrede uneinheitlich.
7. Bildlose Unterseiten, wenige Motive, gleichförmige Unterseiten-Köpfe; Hero ohne JavaScript ohne Bild.
8. Wege der alten Seite fehlen: Suche im Kopf, Anmelden auf dem Handy, direkte Links zu Downloads/Händlern/Terminen.
9. Vorlagen-Reste (Schriftlizenz, ungenutzte Pakete, kunde.json), og:image nur auf der Startseite, lange Beschreibung.

Die Nachbesserung steht im Commit „Nachbesserung nach Jury Runde 1“.

## Runde 2 (2026-09-30) – 70,25 / 100 → nicht bestanden, nachbessern

| Block | Punkte | Höchstwert |
|---|---|---|
| A Gestaltung und Wirkung | 22,5 | 35 |
| B Inhalt und Nutzerführung | 17 | 25 |
| C Technik, Barrierefreiheit, Auffindbarkeit | 19 | 25 |
| D Fortschritt (Mittel aus 11,5 und 12) | 11,75 | 15 |
| **Summe** | **70,25** | **100** |

Einzelnoten: A1 4 · A2 3 · A3 3 · A4 2,5 · A5 3 · A6 3,5 · A7 3,5 · B1 3,5 · B2 3,5 · B3 3,5 · B4 3 · B5 3,5 · C1 4,5 · C2 3,5 · C3 3,5 · C4 3,5 · C5 4 · D1 4/4,5 · D2 4/4 · D3 3,5/3,5.

Wichtigste Mängel (zusammengeführt, nach Wirkung):
1. Alle „Online-Shop“-Links zeigen auf die eigene Startseite (`shop` = `basis`).
2. Unterseiten gleichförmig: Service, Über OSG und Kontakt ohne eigenes Motiv, sechs gleiche Branchenblöcke; Startseite zeigt dasselbe Fräsbild zweimal.
3. „00“ vor jedem Gruppenmitglied (Zähler am falschen Element).
4. Shop-Suche fehlt auf dem Handy in Kopf und Menü.
5. Werkzeugfinder: Auswahl nicht in der Adresse, geht beim Weg zum Formular verloren; Wahlknöpfe auf dem Handy nur durch Wischen erreichbar; Karten auf dem Handy sehr lang, Lücke im Raster am Computer; „0 Serien passen“.
6. Formular: Vorbelegung unsichtbar, keine Fehlerfarbe, `max@firma` gilt als gültig, Telefon-`pattern` im v-Modus ungültig.
7. Video-Halt-Knopf bei 1366 px nicht mit der Maus erreichbar; Fokusring auf dunklen Flächen zu schwach.
8. Downloads und Händler auf /service ohne Sprungleiste; Newsletter, Beiträge und OSG Shape IT fehlen.
9. Texte: Floskeln („Präzision beginnt an der Schneide“), „Beispiel 1/2“, „mehr als 75 Jahre“ neben 1938, NEXAM bei Luftfahrt fehlt.
10. Technik: vier render-blockierende CSS-Dateien, `npm run pruefen` mit falschem Pfad, Turnstile-Zweig ohne Widget, keine Größengrenze vor `formData()`, `.leiste` ohne Landmarke, `class=""`-Reste, og-Angaben dünn.

## Runde 3 (2026-09-30) – 71 / 100 → nicht bestanden, nachbessern

| Block | Punkte | Höchstwert |
|---|---|---|
| A Gestaltung und Wirkung | 23,5 | 35 |
| B Inhalt und Nutzerführung | 16,5 | 25 |
| C Technik, Barrierefreiheit, Auffindbarkeit | 19,5 | 25 |
| D Fortschritt (Mittel aus 11,5 und 11,5) | 11,5 | 15 |
| **Summe** | **71** | **100** |

Einzelnoten: A1 4 · A2 3 · A3 3,5 · A4 3 · A5 3 · A6 3,5 · A7 3,5 · B1 3,5 · B2 3 · B3 3,5 · B4 3 · B5 3,5 · C1 4,5 · C2 4 · C3 3,5 · C4 3,5 · C5 4 · D1 4/4 · D2 3,5/4 · D3 4/3,5.

Wichtigste Mängel (zusammengeführt, nach Wirkung):
1. Serien ohne Bild in gleichförmigen Textkarten; /produkte auf dem Handy 14.600 px lang.
2. Unterseiten nach derselben Hero-Schablone; Kontaktformular erst unter dem ersten Bildschirm; Turbinenrad doppelt.
3. Conversion-Wege passen sich der Seite nicht an (Handy-Leiste auf Karriere und Kontakt), Finder-Treffer ohne Beratungsweg, Shop-Links der Serien als Freitextsuche, Werkzeugkürzel nicht klickbar, Warenkorb fehlt.
4. Finder auf dem Handy: Ergebnis nach der Auswahl nicht sichtbar.
5. Chip-Bänder am Computer angeschnitten, Pfeile und Codes brechen allein um.
6. Downloads und Händler ohne Wegweiser in Kopf und Menü; Schwerindustrie-Text doppelt; Fehlerseite ohne Telefon und E-Mail.
7. Technik: vier render-blockierende Stylesheets, dünnes JSON-LD und ein og:image für alle Seiten, Kopf und Leiste nehmen bei Zoom 35–59 % der Höhe, Größengrenze nur per Content-Length, Resend ohne Timeout, kleine Reste.
