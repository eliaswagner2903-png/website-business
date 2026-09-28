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

