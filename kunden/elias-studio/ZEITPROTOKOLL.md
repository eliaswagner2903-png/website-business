# Zeitprotokoll A-038 – Portfolio-Seite von Elias (kunden/elias-studio)

Ablauf nach `/kundenseite-bauen`. Zeiten in UTC (`date -u +%H:%M`).

| Phase | von | bis | Dauer | Ergebnis |
|---|---|---|---|---|
| 1 Lesen + Vorschau-Aufnahmen | 10:27 | 10:31 | 4 min | Skills, MEISTERSTANDARD, FEHLER, PAKETE.md; 4 Musterseiten frisch aufgenommen (1440×900 DPR 2, 390×844 DPR 3, vorher durchgescrollt) |
| 2 Anlegen | 10:31 | 10:33 | 2 min | Kopie der Vorlage, Stripe-Functions/-Seiten entfernt, CSP `form-action 'self'`, Schriften (Instrument Serif + Geist, 3 Dateien, 67 KB), Wartungseintrag |
| 3 Bilder + Messwerte + Inhalte | 10:33 | 10:40 | 7 min | `bilder.mjs` → 40 AVIF/WebP; Budget + Lighthouse (3 Läufe) aller vier Arbeiten im Hintergrund; `inhalt/seite.json` |
| 4 Gestaltung/Generator | 10:40 | 10:47 | 7 min | `bauen.mjs`, `marke.css` (+ Schema „nacht“), `stil.css`, Tests `seite.test.mjs` |
| 5 Prüfen + Nachbessern | 10:47 | 10:53 | 6 min | Hero-Fächer, Betreuung auf dem Handy gekürzt, html-validate (aria-label), smooth-scroll, Blatt-Radius |
| 6 Meisterprüfung | 10:53 | 10:55 | 2 min | Bildfolgen Laden/Menü, Schema „nacht“, Zustands-Sammelbilder |
| 7 Doku | 10:55 | 11:00 | 5 min | FEHLER.md, Skill, Log, Commit, Push |

**Gesamt ≈ 33 min.** Zeitfresser: Lighthouse-Läufe (je Seite 3 Läufe ≈ 30 s, fünf Unterseiten ≈ 2,5 min) und das
Messen der vier Arbeiten (≈ 5 min, lief parallel zum Schreiben im Hintergrund).

## Ergebnis

- Tests 19/19, html-validate 0, Kopf 0, `pruefen.mjs` 320–1920 ohne Befund (auch ohne JS und mit reduzierter Bewegung).
- Lighthouse mobil (3 Läufe): Startseite 99–100 / 100 / 100 / 100, LCP 1,9–2,0 s (H1), CLS 0. Unterseiten 100/100/100,
  SEO 66 nur wegen `noindex` (Impressum, Datenschutz, 404, Danke – gewollt).
- Budget Startseite: 236 KB, JS 4,5 KB, CSS 12,8 KB, Schriften 68 KB in 3 Dateien, 13 Anfragen, 61 fps.
- Schema „nacht“: `pruefen.mjs` ohne Befund, Lighthouse 99/100/100/100.
