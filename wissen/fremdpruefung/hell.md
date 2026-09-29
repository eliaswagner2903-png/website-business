# Fremdprüfung Showcase hell (Lotlinie) – 2026-09-29

Prüfer mit Browser (Playwright, curl, Lighthouse) über localhost:8201, 7 Seiten.

| Fach | Ergebnis |
|---|---|
| Technik/A11y | Lighthouse 100/100/100/100, LCP 1,7 s, CLS 0; 8 Anfragen, 123 KiB; Skip-Link, Fokus 3 px, Landmarks, kein Überlauf |
| Sicherheit | volles Header-Set, `form-action 'none'`, keine Cookies/Drittquellen, externe Links mit `rel="noopener"` |
| Funktion | 21 Links/Anker ohne Fehler, ohne JS bedienbar, reduzierte Bewegung ohne Animation, `#pruefen` funktioniert |
| Content/SEO | Titel/Description/Canonical je Seite, Sitemap, ruhiger konkreter Ton |

## Mängel

- [MITTEL] Kein JSON-LD (z. B. `Physiotherapy`/`MedicalBusiness`).
- [NIEDRIG] Footer-Links Telefon/E-Mail nur 18 px hoch.
- Testumgebung: gzserver liefert bei unbekannten Pfaden nur „404“ statt `404.html` und nur den `/*`-Header-Block.
