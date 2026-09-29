# Fremdprüfung Showcase laut (zwischen/bild) – 2026-09-29

Prüfer mit Browser (Playwright, curl, Lighthouse) über localhost:8202, 7 Seiten.

| Fach | Ergebnis |
|---|---|
| Technik/A11y | Lighthouse 100/100/100/100, LCP 1,7 s, CLS 0; 0 Konsolenfehler; kein Überlauf; Fokus 3 px; View Transitions fehlerfrei |
| Sicherheit | strenge CSP, volles Header-Set, `form-action 'none'`, keine Drittquellen/Cookies |
| Funktion | alle Links 200, ohne JS bedienbar (mailto-Rückfall), reduzierte Bewegung ohne Animation, gestaltete 404 |
| Content/SEO | Titel/Description/OG je Seite, noindex auf 404, Rechtstexte ehrlich als fehlend markiert |

## Mängel

- [HOCH] Mobile Navigation im ersten Bildschirm unerreichbar: `.js .nav{display:none}` (css/stil.css:103) und die Schnellleiste mit Menü-Knopf erscheint erst nach dem Scrollen (IntersectionObserver auf `.held .aktionen`, css/stil.css:335–340).
- [MITTEL] Kein JSON-LD, kein `canonical`, keine `sitemap.xml` (robots.txt verweist auf keine).
