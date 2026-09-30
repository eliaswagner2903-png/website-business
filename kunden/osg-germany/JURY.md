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
