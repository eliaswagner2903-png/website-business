# Barrierefreiheit (WCAG 2.2 AA, BFSG)

> Schlüssel `accessibility` · Quellen: Q-W07–Q-W10, Q-R02, Q-R03 · Stand 2026-09-29 · **Rechtliches ist keine Rechtsberatung.**

## 1 Ziel
Jeder Mensch kann die Seite wahrnehmen, bedienen und verstehen – mit Tastatur, Screenreader, Vergrößerung, schwachem Kontrast­sehen oder
eingeschränkter Motorik. Maßstab: **WCAG 2.2 Stufe AA** (Q-W07).

## 2 Warum relevant
Rund ein Achtel der Menschen hat eine Einschränkung; barrierearme Seiten sind für alle leichter. Rechtlich: Das **BFSG** gilt seit 2025-06-28 für
Dienstleistungen im elektronischen Geschäftsverkehr mit Verbrauchern, z. B. **Online-Terminbuchung oder Shop** – dann für die ganze Seite.
Ausgenommen sind Kleinstunternehmen (< 10 Beschäftigte und ≤ 2 Mio. € Umsatz oder Bilanzsumme), die Dienstleistungen anbieten; reine
Präsentationsseiten fallen nicht darunter (Q-R02, Q-R03). EN 301 549 V4.1.1 (WCAG 2.2) ist erschienen, maßgeblich bleibt bis zur Zitierung
im Amtsblatt V3.2.1 (WCAG 2.1) (Q-W10). WCAG 3.0 ist ein Entwurf und keine Anforderung (Q-W09).

## 3 Faktoren (WCAG 2.2 AA, Auswahl für unsere Seiten)
Kontrast 1.4.3/1.4.11 · Zoom 200 % 1.4.4 · Reflow 320 px 1.4.10 · Tastatur 2.1.1 · Fokus sichtbar 2.4.7 und **nicht verdeckt 2.4.11** (feste Leisten!) ·
Zielgröße ≥ 24 px **2.5.8** (unser Standard 44 px) · Beschriftungen 3.3.2 · Fehler als Text 3.3.1 · **Konsistente Hilfe 3.2.6** · **keine doppelte
Eingabe 3.3.7** · **Anmeldung ohne Gedächtnisrätsel 3.3.8** · Bewegung stoppbar 2.2.2 · Sprache 3.1.1/3.1.2 · 4.1.1 entfällt in 2.2.

## 4 Beim Programmieren
Semantisches HTML zuerst (Button ist `<button>`, Link ist `<a>`), ARIA nur wo nötig · `:focus-visible` gestaltet und mit `scroll-padding` für feste Leisten ·
Farben aus `marke.css` mit geprüftem Kontrast in beiden Schemata · `prefers-reduced-motion` · Formulare mit `<label>`, `autocomplete`, `aria-describedby` für Fehler ·
Kontaktweg an gleicher Stelle auf jeder Seite (3.2.6).

## 5 Inhalte und Strukturen
Alt-Texte beschreiben Inhalt oder Funktion, dekorative Bilder `alt=""` · Linktexte eindeutig · einfache Sprache · bei BFSG-Pflicht: die dort
geforderten Informationen zur Barrierefreiheit (genauen Umfang vor dem ersten BFSG-Kunden recherchieren).

## 6 Vermeiden
Zoom-Sperre, Text in Bildern, nur Farbe als Information, Fokus-Rahmen entfernen, Placeholder statt Label, Autoplay ohne Pause, Overlays/„A11y-Widgets“.

## 7 Automatisch umsetzbar
Vorlage liefert Skip-Link, Fokusstil, reduzierte Bewegung, Formular-Muster.

## 8 Automatisch prüfbar
Lighthouse-Barrierefreiheit (Kontrast, Namen, ARIA), `pruefen.mjs` (Überlauf 320 px, Tippflächen, ohne JS, reduzierte Bewegung), Labels, Alt-Attribute, Viewport.
**Werkzeuge finden nur einen Teil der WCAG-Probleme** – Tastatur- und Screenreader-Stichprobe bleibt Pflicht.

## 9 Manuell prüfen
Tastaturdurchlauf (Reihenfolge, Fokus sichtbar und nicht verdeckt), Screenreader-Stichprobe (Landmarken, Überschriften, Formular), Alt-Texte inhaltlich, BFSG-Einordnung.

## 10 Wie Claude die Umsetzung belegt
Fokus-Screenshots (Hauptknopf, Telefonlink, Menü, Formularfehler) aus `/meisterpruefung`; Accessibility-Snapshot (Playwright `browser_snapshot`) der
Startseite in `werkzeuge/ausgabe/`; Pfade in `abnahme.md`.

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| A11Y-01 | Alles per Tastatur bedienbar, Reihenfolge logisch, Fokus sichtbar und nicht von festen Leisten verdeckt (2.1.1, 2.4.7, 2.4.11) | K | BA | MANUAL | | O Q-W07 | stabil |
| A11Y-02 | Kontrast Text ≥ 4,5:1 (groß 3:1), Bedienelemente ≥ 3:1 – in jedem Farbschema | K | B | SEMI-AUTO | ext-lighthouse | O Q-W07 | stabil |
| A11Y-03 | Zoom 200 % und Reflow bei 320 px ohne Verlust (1.4.4, 1.4.10), keine Zoom-Sperre | K | A | SEMI-AUTO | ext-pruefen, viewport | O Q-W07, O Q-W08 | stabil |
| A11Y-04 | Formulare: Label, Fehler als Text am Feld, `autocomplete`, keine doppelte Eingabe (3.3.7), Hilfe an gleicher Stelle (3.2.6) | K | B | SEMI-AUTO | formular-label | O Q-W07 | stabil |
| A11Y-05 | Alt-Texte beschreiben Inhalt oder Funktion; dekorative Bilder `alt=""`; jeder Link hat einen Namen | K | B | SEMI-AUTO | bilder-alt, link-namen | O Q-W07 | stabil |
| A11Y-06 | Bewegung: „Bewegung reduzieren“ respektiert, nichts blinkt, Autoplay-Video pausierbar (2.2.2, 2.3.1) | K | B | SEMI-AUTO | ext-pruefen | O Q-W07 | stabil |
| A11Y-07 | Screenreader-Stichprobe: Landmarken, Überschriftenliste, Formular verständlich | E | A | MANUAL | | O Q-W07 | stabil |
| A11Y-08 | BFSG-Einordnung mit dem Kunden dokumentieren (Verbraucher-Buchung/Shop? Kleinstunternehmen?) – keine Rechtsberatung | K | P | MANUAL | | G Q-R02, O Q-R03 | zeitabh. |
| A11Y-09 | Fremdsprachige Passagen mit `lang`, verständliche Sprache | Z | B | MANUAL | | O Q-W07 | stabil |

## Mythen und Unbelegtes
- „Lighthouse 100 = barrierefrei“ – nein, automatische Prüfungen decken nur einen Teil ab.
- „Overlay-Widgets machen die Seite BFSG-konform“ – kein Beleg; wir bauen Barrierefreiheit in den Code.
- „WCAG 3.0 gilt schon“ – Entwurf (Q-W09).

## Zeitabhängig
EN-301-549-Zitierung (Q-W10), BFSG-Auslegung der Behörden (Q-R03), WCAG-3.0-Stand (Q-W09).
