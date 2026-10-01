# Barrierefreiheit (WCAG 2.2 AA, BFSG)

> Key `accessibility` · Sources: Q-W07–Q-W10, Q-R02, Q-R03 · As of 2026-09-29 · **Legal matters are not legal advice.**

## 1 Ziel
Every person can perceive, operate and understand the site – with keyboard, screen reader, magnification, low contrast vision or
limited motor skills. Yardstick: **WCAG 2.2 level AA** (Q-W07).

## 2 Warum relevant
Roughly one in eight people has an impairment; low-barrier sites are easier for everyone. Legally: the **BFSG** has applied since 2025-06-28 to
services in electronic commerce with consumers, e.g. **online appointment booking or a shop** – then for the whole site.
Exempt are micro-enterprises (< 10 employees and ≤ €2 million turnover or balance sheet total) offering services; pure
presentation sites are not covered (Q-R02, Q-R03). EN 301 549 V4.1.1 (WCAG 2.2) has been published, but until it is cited
in the Official Journal V3.2.1 (WCAG 2.1) remains authoritative (Q-W10). WCAG 3.0 is a draft and not a requirement (Q-W09).

## 3 Faktoren (WCAG 2.2 AA, selection for our sites)
Contrast 1.4.3/1.4.11 · zoom 200 % 1.4.4 · reflow 320 px 1.4.10 · keyboard 2.1.1 · focus visible 2.4.7 and **not obscured 2.4.11** (fixed bars!) ·
target size ≥ 24 px **2.5.8** (our standard 44 px) · labels 3.3.2 · errors as text 3.3.1 · **consistent help 3.2.6** · **no redundant
entry 3.3.7** · **authentication without cognitive tests 3.3.8** · motion stoppable 2.2.2 · language 3.1.1/3.1.2 · 4.1.1 is dropped in 2.2.

## 4 Beim Programmieren
Semantic HTML first (a button is `<button>`, a link is `<a>`), ARIA only where needed · `:focus-visible` styled and with `scroll-padding` for fixed bars ·
colors from `marke.css` with verified contrast in both schemes · `prefers-reduced-motion` · forms with `<label>`, `autocomplete`, `aria-describedby` for errors ·
contact route in the same place on every page (3.2.6).

## 5 Inhalte und Strukturen
Alt texts describe content or function, decorative images `alt=""` · unambiguous link texts · plain language · when BFSG applies: the accessibility
information required there (research the exact scope before the first BFSG customer).

## 6 Vermeiden
Zoom lock, text in images, color as the only information, removing focus outlines, placeholder instead of label, autoplay without pause, overlays/„a11y widgets“.

## 7 Automatisch umsetzbar
The template provides skip link, focus style, reduced motion, form pattern.

## 8 Automatisch prüfbar
Lighthouse accessibility (contrast, names, ARIA), `pruefen.mjs` (overflow at 320 px, tap targets, without JS, reduced motion), labels, alt attributes, viewport.
**Tools find only part of the WCAG problems** – a keyboard and screen-reader spot check remains mandatory.

## 9 Manuell prüfen
Keyboard walkthrough (order, focus visible and not obscured), screen-reader spot check (landmarks, headings, form), alt texts for content, BFSG classification.

## 10 Wie Claude die Umsetzung belegt
Focus screenshots (main button, phone link, menu, form error) from `/meisterpruefung`; accessibility snapshot (Playwright `browser_snapshot`) of the
home page in `werkzeuge/ausgabe/`; paths in `abnahme.md`.

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| A11Y-01 | Everything operable by keyboard, logical order, focus visible and not obscured by fixed bars (2.1.1, 2.4.7, 2.4.11) | K | BA | MANUAL | | O Q-W07 | stabil |
| A11Y-02 | Contrast text ≥ 4.5:1 (large 3:1), controls ≥ 3:1 – in every color scheme | K | B | SEMI-AUTO | ext-lighthouse | O Q-W07 | stabil |
| A11Y-03 | Zoom 200 % and reflow at 320 px without loss (1.4.4, 1.4.10), no zoom lock | K | A | SEMI-AUTO | ext-pruefen, viewport | O Q-W07, O Q-W08 | stabil |
| A11Y-04 | Forms: label, error as text at the field, `autocomplete`, no redundant entry (3.3.7), help in the same place (3.2.6) | K | B | SEMI-AUTO | formular-label | O Q-W07 | stabil |
| A11Y-05 | Alt texts describe content or function; decorative images `alt=""`; every link has a name | K | B | SEMI-AUTO | bilder-alt, link-namen | O Q-W07 | stabil |
| A11Y-06 | Motion: „reduce motion“ respected, nothing flashes, autoplay video can be paused (2.2.2, 2.3.1) | K | B | SEMI-AUTO | ext-pruefen | O Q-W07 | stabil |
| A11Y-07 | Screen-reader spot check: landmarks, heading list, form understandable | E | A | MANUAL | | O Q-W07 | stabil |
| A11Y-08 | Document the BFSG classification with the customer (consumer booking/shop? micro-enterprise?) – no legal advice | K | P | MANUAL | | G Q-R02, O Q-R03 | zeitabh. |
| A11Y-09 | Foreign-language passages with `lang`, understandable language | Z | B | MANUAL | | O Q-W07 | stabil |

## Mythen und Unbelegtes
- „Lighthouse 100 = accessible“ – no, automated checks cover only part.
- „Overlay widgets make the site BFSG-compliant“ – no evidence; we build accessibility into the code.
- „WCAG 3.0 already applies“ – draft (Q-W09).

## Zeitabhängig
EN 301 549 citation (Q-W10), authorities' interpretation of the BFSG (Q-R03), WCAG 3.0 status (Q-W09).
