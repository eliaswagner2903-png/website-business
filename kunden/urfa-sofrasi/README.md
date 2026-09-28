# URFA SOFRASI – Website

Überarbeitete Website des Restaurants **URFA SOFRASI**, Mühlbachstraße 2, 73054 Eislingen/Fils.
Reines HTML/CSS mit etwa 2 KB JavaScript. Es gibt keinen Build-Schritt und keine Bibliotheken.

Konzept, Analyse und **offene Punkte zur Prüfung**: siehe [`ANALYSE.md`](ANALYSE.md).

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite |
| `speisekarte.htm` | Speisekarte (HTML, durchsuchbar) |
| `speisekarte.pdf` | Speisekarte zum Download (Stand 05/2025) |
| `galerie.htm`, `kontakt.htm`, `impressum.htm`, `datenschutz.htm` | Unterseiten (alte Adressen beibehalten) |
| `assets/css/style.css` | gesamtes Design, Farben oben als Variablen |
| `assets/js/main.js` | Handy-Menü, Diashows, Einblenden, Wort-Welle, Öffnungsstatus, Suche und aktive Kategorie in der Speisekarte, Großansicht, Prüfmodus |
| `werkzeuge/seiten.py` | erzeugt alle HTML-Seiten; hier stehen Speisekarte, Preise und Texte |
| `werkzeuge/DESIGN-NOTIZEN.md` | Gestaltung, Tempi der Animationen, Fehlerliste |
| `assets/img/` | Bilder (WebP), Icons, `skyline-720/1400.webp` (Skyline aus dem Original-Logo), `logo-skyline.svg` und `muster.svg` (Hintergrundmuster) |
| `assets/fonts/` | Schriften Cormorant Garamond und Lato, lokal gehostet |
| `.htaccess` | Weiterleitung, Caching, Kompression (Apache) |

## Online-Vorschau

https://claude.ai/artifact/Qo99W1RFepBRnNZBE1FaxL (privat, nur im eigenen claude.ai-Konto sichtbar). Neu bauen mit `python3 werkzeuge/vorschau.py <ordner>`.

## Lokal ansehen

```bash
python3 -m http.server 8000
# dann http://localhost:8000 im Browser öffnen
```

## Häufige Änderungen

**Preis ändern:** In `werkzeuge/seiten.py` nach der Nummer suchen, z. B. `("02", "Adana Kebap", …)`, den Preis anpassen und `python3 werkzeuge/seiten.py` ausführen.
Das PDF `speisekarte.pdf` bitte gleichzeitig austauschen.

**Öffnungszeiten ändern:** Sie stehen an diesen Stellen:
- `index.html`: Hero, Kontaktbereich und die strukturierten Daten (`openingHoursSpecification`)
- `kontakt.htm`: Tabelle und strukturierte Daten
- im Footer aller Seiten

Tipp: In allen Dateien nach `10:00 – 23:00` bzw. `"opens"` suchen.

**Prüfmodus:** Wird eine Seite mit `#pruefen` am Ende aufgerufen (z. B. `index.html#pruefen`), werden alle noch unbestätigten Angaben gelb markiert.
Nach der Prüfung kann das Attribut `data-pruefen="…"` am jeweiligen Element gelöscht werden.

## Logo und Muster im Hintergrund

- `assets/logo/urfa-sofrasi-logo.png` ist die Original-Logodatei. Sie ist nur die Quelle und wird von der Website nicht geladen.
- `assets/img/skyline-720.webp` und `skyline-1400.webp` sind die schattierte Skyline aus der Original-Logodatei (mit Transparenz). Sie steht groß im Hero, im Kontakt-Panel und in der Fußzeile.
- `assets/img/logo-skyline.svg` enthält die Skyline aus dem Logo (Baum, Burg mit Arkaden, Säulen, Palmen), vektorisiert als Strichzeichnung. Sie steht ab 480 px Bildschirmbreite links neben dem Schriftzug in der Kopfzeile.
- `assets/img/muster.svg` ist die Musterkachel für den Seitenhintergrund: Baum und Burg aus dem Logo wechseln sich in jeder Reihe ab, die Reihe darunter ist um ein Symbol versetzt. Das Ganze liegt in einem diagonalen Gitter (45°), dessen Linien kurz vor den Symbolen enden.

Einstellungen in `assets/css/style.css` ganz oben:
- `--monogramm`: Farbe und Deckkraft des Musters. Standard ist dezentes Hellschwarz `rgba(255, 255, 255, .045)`, grün wäre `rgba(134, 177, 99, .10)`.
- `--muster-groesse`: Größe einer Kachel mit 2 × 2 Rauten (Standard `400px`)

## Effekte und Animationen

Alles ist bewusst ruhig. Animiert werden nur Bewegung, Transparenz und Masken, damit es auch auf älteren Handys flüssig läuft. Genaue Tempi: `werkzeuge/DESIGN-NOTIZEN.md`.

- **Hero:** Die Skyline aus dem Logo wird wie von Abendlicht erfasst, dann erscheinen Schriftzug, Untertitel und Knöpfe. Links und rechts stehen zwei Bögen mit Diashows (sanfter Zoom, Leiste mit Bildtitel darunter).
- **Handy-Menü:** Ein Blatt mit Bogen-Oberkante gleitet von unten herein. Es schließt per Wischen nach unten, Tipp daneben, Tipp auf den Griff oder Escape.
- **Schnellleiste:** Auf der Startseite erscheint sie, sobald der Anruf-Knopf im Hero aus dem Bild ist.
- **Willkommen:** Wörter werden nacheinander hell (Wort-Welle), einmal und zeitgesteuert.
- **Beliebte Gerichte:** Am Computer wechselt das Foto passend zum Gericht, jede Zeile führt zur Kategorie der Speisekarte.
- **Gut zu wissen:** Drei Arkaden. Die innere Linie zieht sich von unten nach oben, dann setzt die Raute auf.
- **Speisekarte:** Eine grüne Markierung gleitet zur aktuellen Kategorie, die Taste „/“ springt in die Suche.
- **Navigation am Computer:** Eine Linie mit Raute gleitet unter den Menüpunkt.
- **Barrierefreiheit:** Wer „Bewegung reduzieren“ eingestellt hat, sieht keine Animationen. Ohne JavaScript ist alles sichtbar, und die Navigation steht dann als Zeile unter dem Logo.

## Eigene Fotos einsetzen

Die Website ist so gebaut, dass echte Fotos einfach nachgerüstet werden können.

1. **Foto vorbereiten:** mindestens 1600 px breit, Querformat, als WebP in zwei Größen, z. B. mit [squoosh.app](https://squoosh.app):
   `adana-kebap-640.webp` (640 px breit) und `adana-kebap-1600.webp` (1600 px breit), Qualität etwa 80.
   Dateinamen klein schreiben, ohne Umlaute, mit Bindestrichen.
2. **In `assets/img/` ablegen.**
3. **Gericht-Kachel auf der Startseite mit Foto versehen:** Bei der Kachel `class="dish"` ergänzen: `class="dish has-photo"`, dann ein Bild und einen `dish-body` einfügen. Die Kachel „Urfa Sofrası“ in `index.html` dient als Vorlage:
   ```html
   <article class="dish has-photo">
     <img src="assets/img/adana-kebap-1600.webp"
          srcset="assets/img/adana-kebap-640.webp 640w, assets/img/adana-kebap-1600.webp 1600w"
          sizes="(min-width: 1000px) 360px, (min-width: 600px) 50vw, 100vw"
          width="1600" height="900" alt="Adana Kebap mit Reis, Salat und gegrillter Paprika"
          loading="lazy" decoding="async">
     <div class="dish-body"> … Name, Beschreibung, Preis … </div>
   </article>
   ```
4. **Galerie:** In `galerie.htm` ein weiteres `<figure>` nach dem gleichen Muster anlegen.

Die Original-Fotos der bisherigen Galerie (in voller Auflösung) sollten die derzeitigen Bilder ersetzen. Diese wurden aus Screenshots gewonnen und sind nur 1016 px breit.

## Veröffentlichen

Den gesamten Ordner, ohne `ANALYSE.md`, `README.md`, `CLAUDE.md` und den Ordner `werkzeuge/`, per FTP in das Hauptverzeichnis des Webspaces laden.
Vorher die Punkte der Prüfliste in `ANALYSE.md` abarbeiten, vor allem **Impressum, Datenschutz, Allergen-Legende und Öffnungszeiten**.
