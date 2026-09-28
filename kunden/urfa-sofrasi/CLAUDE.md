# URFA SOFRASI – Regeln für die Arbeit an diesem Projekt

Website des türkisch-anatolischen Restaurants **URFA SOFRASI** in Eislingen/Fils.
Der Auftraggeber schreibt Deutsch; Seiten, Texte, Kommentare und Commit-Nachrichten sind auf Deutsch.
Ausführliche Analyse und offene Punkte: `ANALYSE.md`. Pflege-Anleitung: `README.md`.

## Feste Fakten (nicht ändern, nicht ergänzen)

- Adresse: Mühlbachstraße 2, 73054 Eislingen/Fils
- Telefon: 07161 651 75 65 → Link immer `tel:+4971616517565`
- E-Mail: info@urfasofrasi-eislingen.de *(aus Suchmaschinen-Auszug, bestätigen lassen)*
- Öffnungszeiten: Mo–So 10:00–23:00 *(unsicher, Google nennt teils 11–22 → als „prüfen“ markiert lassen)*
- Tagesgerichte: 11:00–18:00 Uhr
- Innen bis 70 Gäste, Terrasse 40 Plätze
- Route (Google Maps): `https://www.google.com/maps/dir/?api=1&destination=URFA+SOFRASI,+M%C3%BChlbachstra%C3%9Fe+2,+73054+Eislingen%2FFils`
- Domain: `https://www.urfasofrasi-eislingen.de/`

## Pflicht für jede Seite und jede Design-Variante

1. **Mobil zuerst.** Die meisten Gäste kommen über Google/Maps auf dem Handy. Immer testen bei 360, 390, 768, 1440 und 1920 px. Kein horizontales Scrollen der Seite, Tippflächen ≥ 44 px, Fließtext ≥ 16 px.
2. **Anrufen muss sofort auffindbar sein:** Telefon im ersten Bildschirm (Hero), in der Navigation und auf dem Handy in einer festen Schnellleiste unten mit **Anrufen / Route / Speisekarte**.
3. **Adresse und Route:** Die Adresse ist klickbar und führt zur Route in Google Maps. **Keine eingebettete Google-Karte** (iframe): Sie überträgt ohne Einwilligung Daten an Google (DSGVO) und bräuchte ein Cookie-Banner.
4. **Die Startseite beantwortet in 5 Sekunden:** Was ist das? Wo ist es? Wann ist geöffnet? Wo ist die Speisekarte?
5. **Speisekarte als HTML-Seite** (nicht nur PDF): durchsuchbar, Kategorien anspringbar, Preise bündig. Das PDF bleibt als Download.
6. **Preise, Nummern und Gerichte niemals ändern oder erfinden.** Die Quelle ist `speisekarte.htm`, sie entspricht `speisekarte.pdf` (Stand 05/2025). Mögliche Fehler nur markieren, nicht korrigieren.
7. **Keine Informationen erfinden.** Unsichere Angaben bleiben mit `data-pruefen="Begründung"` markiert. Den Prüfmodus zeigt jede Seite, wenn `#pruefen` an die Adresse angehängt wird. Offene Punkte:
   - Öffnungszeiten
   - „Alle Gerichte auch zum Mitnehmen“ und „Feiern / individuelle Menüs“ (stammen aus Branchenportalen)
   - E-Mail-Adresse
   - Legende der Allergene/Zusatzstoffe (fehlt, der Betreiber liefert sie nach)
   - Impressum und Datenschutz (Platzhalter; den Originaltext 1:1 übernehmen, rechtliche Aussagen nicht selbst formulieren)
   - Fotos mit Gästen (Gastraum, Terrasse)
8. **Datenschutz und Technik:**
   - Schriften lokal einbinden (per npm `@fontsource/...`), **niemals das Google-Fonts-CDN**
   - Kein Tracking, keine Cookies, keine externen Skripte oder CDNs
9. **Performance** (Ziel Lighthouse mobil: Performance ≥ 95, Barrierefreiheit/Best Practices/SEO = 100, CLS ≈ 0):
   - Keine Frameworks oder Bibliotheken ohne echten Grund
   - Bilder als WebP mit `srcset`, `width`/`height` und `loading="lazy"`
   - Das Hauptbild im Hero nie lazy laden und nie per Animation verstecken
10. **Animationen:**
    - Nur `transform` und `opacity` animieren
    - Hover nur in `@media (hover: hover) and (pointer: fine)`, auf Touch-Geräten stattdessen `:active`-Feedback
    - `prefers-reduced-motion` beachten
    - Ohne JavaScript muss aller Inhalt sichtbar und die Navigation bedienbar sein
    - Keine Parallax-Effekte und keine Pop-ups. Dauerhaft laufen dürfen nur langsame Diashows in Bildrahmen; sie pausieren außerhalb des Bildschirms, bei verstecktem Tab und unter der Maus
    - Große Flächen mit einer leise startenden Kurve bewegen (z. B. `cubic-bezier(.45, .05, .25, 1)`); Animationen als Bildfolge prüfen, nicht nur im Endzustand
11. **Barrierefreiheit:**
    - Semantisches HTML mit genau einer H1 pro Seite
    - Skip-Link, sichtbarer Fokus, aussagekräftige Alt-Texte
    - Kontrast mindestens WCAG AA
    - Türkische Gerichtnamen mit `lang="tr"` auszeichnen
12. **SEO:**
    - Eigener Title und eigene Description pro Seite
    - `schema.org/Restaurant` als JSON-LD, Open Graph, Canonical, `sitemap.xml`
    - Alte Adressen beibehalten: `galerie.htm`, `kontakt.htm`, `impressum.htm`
    - Keine Keyword-Texte
13. **Ton:** Authentisch, freundlich, nicht werblich, keine Luxus-Sprache und keine KI-Marketingfloskeln. Es soll nach einem echten anatolischen Restaurant in Eislingen klingen.
14. **Türkische Schreibweise korrekt:** ş, ı, İ, ğ, ç (z. B. Şiş, İskender, Sütlaç, Urfa Sofrası). Jede Schrift braucht den `latin-ext`-Zeichensatz.
15. **Charakter behalten:** Name URFA SOFRASI, Logo (Skyline mit Baum, Burg mit Arkaden, Säulen, Palmen) und das anatolische Herz der Seite bleiben erhalten, auch wenn sich der Stil ändert.

## Vorhandene Ressourcen

- **Fotos:** `assets/img/*.webp` (je 640 und 1016 px breit)
  - Sie wurden aus Handy-Screenshots gewonnen und sind deshalb nur ca. 1000 px breit. Große Formate nur mit Originalen vom Auftraggeber.
  - Bewusst **nicht** verwendet: das Geburtstagsfoto (Gäste erkennbar), die Platte mit den stehenden Spießen und die vier Grillteller (qualitativ schwach).
- **Logo:** `assets/logo/urfa-sofrasi-logo.png` (Original), `assets/img/logo-skyline.svg` (Skyline als Vektor), `assets/img/muster.svg` (Hintergrundmuster aus Baum und Burg)
- **Speisekarte:** Daten in `werkzeuge/seiten.py` (erzeugt `speisekarte.htm`, maßgeblich inkl. Allergen-Kennzeichnungen) und `speisekarte.pdf`
- **Variante 1 (Hauptordner):** Alle HTML-Seiten entstehen mit `python3 werkzeuge/seiten.py`. HTML nicht von Hand ändern. Gestaltung, Tempi und Fehlerliste: `werkzeuge/DESIGN-NOTIZEN.md`
- **Texte:** in `index.html`, `kontakt.htm`, `galerie.htm` (bereits korrigiert und freigegeben)
- **Keine Stockfotos.** Fremde Fotos stellen die Gerichte falsch dar. Fehlende Motive lösen, indem der Auftraggeber eigene Fotos liefert.

## Bekannte Stolperfallen (sind schon passiert, bitte vermeiden)

1. **Netzwerk:** Die alte Website `urfasofrasi-eislingen.de` sowie Unsplash, Pexels, Wikimedia, archive.org und jsdelivr sind in dieser Umgebung gesperrt.
   - npm (`registry.npmjs.org`) und PyPI funktionieren.
   - Referenzen deshalb als Screenshots oder Dateien vom Auftraggeber anfordern.
2. **PDF-Textlayer der Speisekarte ist fehlerhaft:** Die Allergen-Buchstaben werden als „=“, „E“ oder Leerzeichen ausgelesen. Kennzeichnungen nie aus dem PDF-Text übernehmen, sondern aus `speisekarte.htm` (visuell geprüft).
3. **Alte Website vs. PDF:** Die Nummerierung weicht ab (Lahmacun 49/50, Pizzen 51–59). **Das PDF gilt.**
4. **CSS-Kurzschreibweise:** `.section { padding: 64px 0 }` hat den seitlichen Innenabstand von `.wrap` auf demselben Element überschrieben. Deshalb `padding-block` verwenden.
5. **Sprungmarken unter fixierten Leisten:** `scroll-padding-top` (am `html`) und `scroll-margin-top` (am Ziel) **addieren sich**. Danach immer die Position nachmessen.
6. **`text-transform: uppercase`** macht aus „Süßspeisen“ „SÜSSSPEISEN“. Deutsche Überschriften mit ß nicht per CSS in Großbuchstaben setzen.
7. **SVG-Kommentare dürfen kein `--` enthalten.** Das SVG ist sonst ungültig und wird als CSS-Maske stillschweigend ignoriert. SVGs nach dem Schreiben mit einem XML-Parser prüfen.
8. **Tests immer über einen lokalen HTTP-Server** (`python3 -m http.server`), nicht über `file://`: Masken, SVG-Sprites und Fonts schlagen sonst fehl.
9. **Ganzseiten-Screenshots zeigen lazy geladene Bilder leer.** Vorher die Seite durchscrollen, sonst entstehen falsche Befunde.
10. **Einblend-Animationen:**
    - Die Klassen nach dem Einblenden wieder entfernen, sonst blockiert ihre höhere Spezifität die Hover-Transforms.
    - Elemente, die beim Laden schon im Bild sind, nicht verstecken.
11. **Mobiles Menü:** Nur per JS ein- und ausblenden, wenn es ohne JS trotzdem erreichbar ist (Klasse `js` früh im `<head>` setzen).
12. **Spezifität bei `.js`-Regeln:** Neue `.js …`-Regeln können Desktop-Regeln überschreiben (so ging einmal der Rahmen um die Telefonnummer verloren). Nach CSS-Änderungen Desktop und Mobil ansehen.
13. **Farbabsätze:** Der Auftraggeber möchte keine abgesetzten Hintergrundfarben zwischen Abschnitten.
14. **LCP-Bild nie lazy laden:** Auf dem Handy war ein Foto im Hero das größte Element, aber `loading="lazy"` → Performance 87. Das LCP-Element in Lighthouse nachsehen (`lcp-breakdown-insight`).
15. **Layout-Thrashing:** Im Skript erst alle Positionen lesen (`getBoundingClientRect`), dann Klassen/Styles schreiben.
16. **`<figure>` hat 40 px Standard-Rand** links und rechts; immer `margin: 0` setzen.
17. **`clip-path`-Animationen mit `fill-mode: both`** schneiden auch `outline` ab; `backwards` verwenden.
18. **Lighthouse lokal ohne Kompression** ist zu pessimistisch; zusätzlich mit einem gzip-Server messen (der Webspace komprimiert per `.htaccess`).

## Arbeitsweise mit dem Auftraggeber

- Bei Gestaltungsfragen 2–3 Varianten als Screenshots nebeneinander zeigen, dann umsetzen, was er wählt. Er entscheidet gern selbst.
- Nach jeder sichtbaren Änderung Screenshots von Handy und Desktop schicken.
- Wenn eine Anweisung technisch oder rechtlich ungünstig ist: kurz das Problem erklären, eine Alternative vorschlagen und die bessere Lösung umsetzen.
- Nicht übertreiben: Verbessern statt komplett neu erfinden, außer es ist ausdrücklich eine neue Variante gewünscht.
- Vor dem Commit prüfen:
  - `html-validate` ohne Fehler
  - Overflow-Test über alle Breiten
  - Lighthouse mobil
  - Preisabgleich mit dem PDF, wenn die Speisekarte berührt wurde
