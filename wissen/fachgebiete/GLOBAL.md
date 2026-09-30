# Globaler Mindeststandard

> Schlüssel `global` · gilt für **jede** Seite, jede Regel ist **Muss** und durch keine Kundenoption abwählbar.
> Baut auf `CLAUDE.md` („Pflicht für jede Kundenseite“) und `wissen/MEISTERSTANDARD.md` (P1–P4, W1–W7) auf, statt sie zu wiederholen.

## 1 Ziel
Jede ausgelieferte Seite ist auf jedem Gerät benutzbar, barrierearm, schnell, sicher, technisch sauber und inhaltlich korrekt –
egal, welche Leistungen der Kunde bestellt hat.

## 2 Warum relevant
Das ist das Handwerk, das der Kunde voraussetzt, ohne es zu bestellen. Google indexiert die Handy-Fassung (Q-G13); WCAG 2.2 AA ist
der Maßstab für Barrierefreiheit (Q-W07); Impressumspflicht gilt für jede geschäftsmäßige Seite (Q-R01).

## 3 Faktoren
Responsive 320–1920 px · Bedienbarkeit (Tastatur, ohne JS, reduzierte Bewegung) · semantisches HTML (eine H1, Ebenen, lang) ·
Metadaten · funktionierende Links und Navigation · Bildoptimierung · Leistung (Lighthouse, Budget) · Sicherheits-Header ·
Datenschutz (keine fremden Herkünfte) · Rechtstexte erreichbar · korrekte, freigegebene Inhalte.

## 4 Beim Programmieren
- Generator (`bauen.mjs`) statt Hand-HTML; Titel, Description, Canonical je Seite aus einer Datenquelle.
- Kopf-Regeln aus `CLAUDE.md`, Skripte mit `defer`, keine Inline-Skripte ohne Hash.
- `<img>` immer mit `alt`, `width`, `height`; erstes großes Bild `fetchpriority="high"`, nie lazy.
- Navigation als `<nav>` mit `<a href>`, aktuelle Seite `aria-current="page"`, Skip-Link als erstes Element.

## 5 Inhalte und Strukturen
Impressum und Datenschutz (Texte vom Kunden bzw. Generator, nie selbst formuliert), 404-Seite, Favicon, Kontaktweg auf jeder Seite.

## 6 Vermeiden
Zoom-Sperre im Viewport · Blindtext · erfundene Fakten · fremde Skripte/Schriften · tote Links · Inhalte, die nur mit JS erscheinen.

## 7–10 Automatik und Beleg
- **Automatisch umgesetzt:** Vorlage (`vorlage/`) liefert Header, CSP, 404, Formular mit Honigtopf, Kopf-Struktur; Generator setzt Metadaten.
- **Automatisch geprüft:** `werkzeuge/qualitaet.mjs` (statisch + Browser) und mit `--voll` `pruefen.mjs`, `lighthouse.sh`, `budget.mjs`.
- **Manuell:** Richtigkeit der Inhalte (Kunde bestätigt), Sichtprüfung der Screenshots (`/meisterpruefung`, W1–W7).
- **Beleg:** `QUALITAET.md` mit Urteil BESTANDEN; manuelle Punkte in `abnahme.md` mit Beleg (Screenshot-Pfad, Freigabe des Kunden mit Datum).

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| GLB-01 | 320–1920 px ohne Überlauf, Tippflächen ≥ 44 px, keine Konsolenfehler, Inhalt, Navigation, Kontakt und Formulare auch ohne JS nutzbar (Erlebnisse mit Standbild), bei „Bewegung reduzieren“ alles sichtbar | G | BA | AUTO | ext-pruefen | O Q-W07, P Q-P01 | stabil |
| GLB-02 | Viewport `width=device-width`, keine Zoom-Sperre (`user-scalable=no`, `maximum-scale` < 2) | G | B | AUTO | viewport | O Q-W08 | stabil |
| GLB-03 | `<html lang>` gesetzt | G | B | AUTO | html-lang | O Q-W07 | stabil |
| GLB-04 | Genau eine H1 je Seite, Überschriftenebenen ohne Sprung | G | PB | AUTO | h1, ueberschriften | F Q-W11, P Q-P03 | stabil |
| GLB-05 | Jede Seite hat einen `<title>` und eine meta description (indexierte Seiten) | G | PB | AUTO | titel, description | O Q-G02, O Q-G03 | stabil |
| GLB-06 | Keine toten internen Links, Anker existieren, kein `href="#"`/leer/`javascript:` | G | BA | AUTO | links-intern, links-leer | O Q-G04 | stabil |
| GLB-07 | Skip-Link als erster Link, jede Seite hat einen Kontaktweg (tel:, mailto:, Kontaktseite) | G | B | AUTO | skip-link, kontakt-jede-seite | O Q-W07, P Q-P03 | stabil |
| GLB-08 | Navigation funktioniert auf Handy und Computer, mit Tastatur, ohne JS (Rückfall: Zeile/Link); aktuelle Seite markiert | G | BA | SEMI-AUTO | ext-pruefen, link-namen | O Q-W07 | stabil |
| GLB-09 | Jedes `<img>` hat `alt` (dekorativ: `alt=""`) sowie `width` und `height` | G | B | AUTO | bilder-alt, bilder-masse | O Q-G05, O Q-W03 | stabil |
| GLB-10 | Bilder als WebP/AVIF, ≤ 300 KB (Klasse schlank) bzw. ≤ 500 KB (erlebnis, kino), erstes Bild nicht lazy | G | B | AUTO | bilder-format, bilder-gewicht, lcp-nicht-lazy | O Q-W02, O Q-W06 | stabil |
| GLB-11 | Lighthouse mobil (Startseite): Performance ≥ 95, Barrierefreiheit, Best Practices, SEO = 100 | G | A | AUTO | ext-lighthouse | P Q-P01 | stabil |
| GLB-12 | Gewichts-Budget der gewählten Klasse (schlank/erlebnis/kino, `kunde.json`) eingehalten | G | A | AUTO | ext-budget | P Q-P01 | stabil |
| GLB-13 | Tests der Seite grün, html-validate ohne Fehler, Kopf-Regeln eingehalten | G | BA | AUTO | ext-tests, ext-html-validate, ext-kopf | P Q-P03 | stabil |
| GLB-14 | Sicherheits-Header: CSP ohne `unsafe-inline`/`unsafe-eval`, HSTS, nosniff, Referrer-, Permissions-Policy, frame-ancestors | G | B | AUTO | sicherheits-header | F Q-M01, P Q-P03 | stabil |
| GLB-15 | Keine fremden Herkünfte (Skripte, Schriften, Bilder, iframes) und kein einwilligungspflichtiges Tracking | G | PB | AUTO | fremde-quellen, tracking-skripte | G Q-R04, O Q-R05, P Q-P03 | stabil |
| GLB-16 | Kein Mixed Content (nur https-Adressen) | G | B | AUTO | mixed-content | F Q-M01 | stabil |
| GLB-17 | Formulare: jedes Feld beschriftet, Honigtopf und serverseitige Prüfung | G | B | AUTO | formular-label, formular-honigtopf | O Q-W07, P Q-P03 | stabil |
| GLB-18 | Impressum und Datenschutz von jeder Seite verlinkt; Texte vom Kunden/Generator, nicht erfunden | G | PBA | SEMI-AUTO | impressum-datenschutz | G Q-R01 | stabil |
| GLB-19 | 404-Seite und Favicon vorhanden | G | B | AUTO | seite-404, favicon | P Q-P03 | stabil |
| GLB-20 | Kein Blindtext, keine offenen `data-pruefen`-Angaben bei Abnahme | G | A | AUTO | platzhalter, data-pruefen | P Q-P03 | stabil |
| GLB-21 | Jede Tatsache (Adresse, Zeiten, Preise, Leistungen) stammt vom Kunden; Kunde hat Texte freigegeben | G | PA | MANUAL | | P Q-P03 | stabil |
| GLB-22 | Hauptinhalt steht im HTML und ist ohne JavaScript vorhanden | G | B | AUTO | inhalt-ohne-js | O Q-G14 | stabil |
| GLB-23 | robots.txt und sitemap.xml vorhanden, Startseite indexierbar | G | B | AUTO | robots-txt, sitemap, noindex-bewusst | O Q-G08, O Q-G10 | stabil |
| GLB-24 | Sichtprüfung Handy und Computer: Meisterprüfung W1–W7 im Schnitt ≥ 4 | G | A | MANUAL | | P Q-P01 | stabil |

## Mythen und Unbelegtes
- „Google bestraft mehrere H1“: Google ist die Reihenfolge der Überschriften egal (Q-G01). Eine H1 ist unsere Regel wegen Barrierefreiheit (Q-W11).
- „Mobile-Friendly-Test bestanden = mobil gut“: Den Test gibt es seit 2023-12-01 nicht mehr (Q-G34); wir messen mit Lighthouse und `pruefen.mjs`.

## Zeitabhängig
Keine Regel hier ist zeitabhängig; die Lighthouse-Grenzen folgen dem Meisterstandard und ändern sich nur mit ihm.
