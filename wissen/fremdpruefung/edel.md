# Fremdprüfung Showcase edel (Lindgrund) – 2026-09-29

Prüfer mit Browser (Playwright, curl, Lighthouse) über localhost:8203, gzserver.

| Fach | Ergebnis |
|---|---|
| Technik/A11y | Lighthouse 100/100/100/100, LCP 1,6 s, CLS 0; keine Konsolenfehler; kein Überlauf 320/390/1440; 3D lädt nach `load` im Leerlauf (149 KB gzip) |
| Sicherheit | strenge CSP ohne unsafe-inline, volles Header-Set, keine Drittquellen/Cookies, Honigtopf |
| Funktion | Sprungmarken, Zifferblatt-Auswahl, `<details>`, ohne JS und reduzierte Bewegung vorbildlich |
| Content/SEO | Titel/Description je Seite, saubere H-Hierarchie, Demo konsequent markiert |

## Mängel

- [HOCH] Formular ohne Fehlerbehandlung: normaler POST auf `/api/kontakt`; antwortet die Function mit Fehler statt Weiterleitung, landet der Besucher auf einer ungestalteten Seite (`js/seite.js`).
- [MITTEL] Kein JSON-LD (LocalBusiness/Product/FAQPage).
- [NIEDRIG] `form-action` erlaubt `https://checkout.stripe.com`, obwohl die Seite nichts verkauft (aus der Vorlage).
- [NIEDRIG] Footer-Link „Datenschutz“ 81×18 px (unter 44 px Hausregel).
- Hinweis: gzserver wendet nur den `/*`-Block aus `_headers` an; pfadspezifische Cache-Header lokal nicht prüfbar.
