# Trainingsplan: bereit für High-End-Websites

Stand 2026-09-28. Auftrag von Elias: erst die Fähigkeit aufbauen, Verkauf, Konten, Preise und Amt kommen zum
Schluss. Jede Stufe endet mit einem messbaren Ergebnis gegen den [Meisterstandard](MEISTERSTANDARD.md) und einem
Eintrag im Auftragslog.

| Stufe | Inhalt | Ergebnis |
|---|---|---|
| 1 Maßstab | Meisterstandard, Gewichts-Budget, Bildfolge, Skill `/meisterpruefung` | messbare Latte; Vorlage dagegen geprüft |
| 2 Baukasten | geprüfte Bausteine in `vorlage/bausteine/`: Marken-Datei `marke.css` mit zwei Schemata; Hero mit Poster und Video; Einblenden über Scroll-Timeline (CSS, ohne JS) mit Rückfall; Seitenwechsel mit View Transitions; Menü-Blatt; Bento-Raster; Galerie mit `<dialog>`; 3D-Szene (three.js, nachgeladen, Standbild als Rückfall) | jeder Baustein einzeln bestanden (P1–P3) |
| 3 Showcases | drei Demo-Seiten mit ausgedachten, klar als „Demo“ gekennzeichneten Marken, je ein Stil: **hell & ruhig** (Praxis/Dienstleister, Terminbuchung), **dunkel & edel** (Manufaktur, 3D-Produkt), **laut & modern** (Studio/Agentur, Typo und Bewegung) | drei Seiten mit W ≥ 4, zugleich das spätere Verkaufsportfolio |
| 4 Visuals | Bildpipeline (AVIF/WebP/Poster, Video WebM+MP4 mit ffmpeg), 3D-Standbilder aus three.js rendern; Higgsfield einbinden, sobald ein Konto da ist | Visual in unter 30 min vom Entwurf bis eingebaut und gemessen |
| 5 Fremdprüfung | Fernspäherkommando klärt die eigenen Showcases auf wie eine fremde Seite; Befunde nach `wissen/` | keine KRIT/HOCH-Befunde |
| 6 Generalprobe | eine echte Seite (z. B. URFA-Meistervariante) in einem Zug vom Briefing bis zur Abnahme | Zeit und Aufwand gemessen, Ablauf als Skill |

Grundsatz: lieber drei Seiten, die jede Prüfung bestehen, als zehn Entwürfe. Jeder Fehler wird zur Zeile in
`wissen/FEHLER.md`, jede bewährte Technik zu einem Baustein.
