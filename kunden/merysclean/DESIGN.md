# Designsystem Merys Clean (festgelegt vor dem Bau, A-073, neu bewertet von Opus am 01.10.)

Richtung: Salon Ümit Variante C (warme Wandtöne, redaktionelle Typografie, Teamporträts mit persönlichem Satz, ruhige
Bewegung), übersetzt in die Welt der Gebäudereinigung. Nichts kopiert. **Leitmotiv: der Schwung** aus dem Logo (der Wischzug
um das Haus). Er taucht als dünne grüne Linie auf: unter dem Wort der H1, als Pfad des Ablaufs, als Weg auf der Karte.
Dazu **Streifenfreiheit**: klare Flächen, viel Luft, wenige Linien.

Gegenüber dem ersten Entwurf geändert: Hero zeigt das **echte Team** (statt Stock-Fensterfoto), Karte zeigt **alle 17 Orte**
der alten Seite, Leistungsseiten ohne erfundene Leistungslisten, eigenes Menü-Panel „Leistungen“ am Computer, Blatt-Menü
bis 64 rem (statt 48 rem), Logo ohne `<style>` (CSP).

## Farben (alle in `public/css/marke.css`, Kontrast gemessen mit WCAG-Formel)

| Rolle | Wert | Einsatz | Kontrast |
|---|---|---|---|
| grund (Wand) | #f5f2eb | Seitenhintergrund | – |
| flaeche | #fbfaf6 | Karten, Felder, Blatt, Panel | – |
| text (Marke „Dunkel“) | #202020 | Text, dunkle Abschnitte | 14,6:1 auf Grund |
| leise | #55595a | Nebentext, **Feldrahmen** | 6,3:1 auf Grund, 6,8:1 auf Fläche |
| linie | #d9d3c6 | Trenner (nur Deko) | – |
| akzent (Markengrün abgedunkelt) | #2a7430 | Hauptknopf, Links, Fokus | 5,2:1 auf Grund; Weiß darauf 5,8:1 |
| tint | #e6efdc | helle Grünfläche (Vertrauensleiste, Rhythmus) | Akzent darauf 4,9:1, Text 13,8:1 |
| gruen-hell (Markengrün #6fbf52) | #6fbf52 | **nur** Deko (Schwung, Kartenpunkte) und Text auf Dunkel | 7,2:1 auf #202020, nie Text auf Hell |
| blau (Markenblau abgedunkelt) | #1d5f9e | zweiter Akzent: Orte auf der Karte, Info | 5,9:1 auf Grund |
| leise-hell | #c9ccc5 | Nebentext auf Dunkel | 10:1 auf #202020 |

Logo behält seine Farben (Rot/Blau/Grün im Haus, grüne Schrift). Schwung und Zeile „Dienstleistungen/Gebäudereinigung“
sind auf Hell #202020 (`img/logo.svg`), auf Dunkel weiß (`img/logo-hell.svg`).

## Typografie (lokal, WOFF2, OFL, nur latin; latin-ext lädt nur bei Bedarf über `unicode-range`)

- Überschriften: **Instrument Serif** 400 (ein Schnitt, `font-synthesis: none`; Betonung über Farbe/Schwung, nie Fett/Kursiv).
- Text: **Instrument Sans** variabel 400–700, 17 px (1,0625 rem), Zeilenhöhe 1,65, Zeilenlänge ≤ 62 ch.
- Skala: H1 `clamp(2.6rem, 1.5rem + 4.6vw, 5.4rem)`, Zeilenhöhe 1; H2 `clamp(2.1rem, 1.4rem + 2.6vw, 3.5rem)`;
  H3 1,35–1,7 rem. Überzeilen 0,8 rem, Versalien, Laufweite 0,16 em (keine Wörter mit ß versalieren).
- Ersatzschriften mit `size-adjust` (CLS ≈ 0). Preload nur der zwei latin-Dateien.

## Abstände und Form

- Abschnitt `clamp(4.5rem, 3rem + 5vw, 8rem)`; Inhaltsbreite 78 rem; Textspalte 62 ch.
- Radien: klein 12 px (Felder, Chips), groß 28 px (Karten, Panel, Blatt); Knöpfe als Pille (eigene Regel, nicht `--radius-gross`).
- Bildrahmen: oben stark gerundet („Bogen“) als wiederkehrende Form für Porträts und Hero.
- Rhythmus der Flächen: Wand – Tint (Vertrauensleiste) – Wand – Fläche – **Dunkel** (Garantie) – Wand – Dunkel-Fuß.

## Komponenten

1. **Kopf** (sticky, deckend): Logo links; Computer ab 64 rem: Leistungen (Panel mit allen 6 Leistungen + Übersicht, öffnet
   bei Zeigen/Fokus, ohne JS als Link), Einsatzgebiet, Über uns, Kontakt; rechts Telefon-Pille und Knopf „Angebot anfragen“.
   Unter 64 rem: Logo, Anruf-Symbol (44 px), „Angebot“, Menü-Knopf → Blatt von unten (Einträge in Serif, Leistungen als Unterliste,
   unten Anrufen/WhatsApp/E-Mail).
2. **Schnellleiste** (unter 64 rem, fest unten): Anrufen + Angebot anfragen.
3. **Hero**: Überzeile, H1 mit Ort, ein Satz, zwei Wege (Angebot anfragen, Anrufen), Zeile mit Zeiten und Adresse;
   rechts das Teamfoto im Bogenrahmen, Schwung als Linie dahinter.
4. **Vertrauensleiste**: vier belegte Zusagen auf Tint mit Haken (Besichtigung kostenlos, Angebot unverbindlich, 24-h-Garantie,
   fester Ansprechpartner).
5. **Leistungsliste**: redaktionelle Zeilen (Nummer, große Serif-Überschrift, ein Satz, Pfeil), daneben ein Bild als Gegengewicht.
6. **Ablauf**: vier Schritte entlang einer Schwung-Linie.
7. **Garantie**: dunkle Fläche mit Siegel (Marke), Text der Garantie.
8. **Team** (Ümit C): zwei große Porträts versetzt, Name, Rolle, Zitat-Platzhalter (`data-pruefen`), Gruppenfoto.
9. **Karte Einsatzgebiet**: eigene SVG (17 Orte nach Koordinaten, schematisch), Firmensitz hervorgehoben, Ortsnamen als Text.
10. **FAQ**: `<details>` ohne JS bedienbar.
11. **Formular**: eine Spalte, zwei Gruppen („Ihr Objekt“, „So erreichen wir Sie“), sichtbare Labels, Pflichtfelder markiert,
    Fehler als Text, Datenschutz-Checkbox, Honigtopf. Daneben Telefon, WhatsApp, E-Mail.
12. **Fuß**: dunkel, Logo hell, Adresse/Telefon/Zeiten, Leistungen, Unternehmen, Rechtliches.

## Bewegung

Einblenden beim Scrollen (Baustein `einblenden`, nur unterhalb des ersten Bildschirms), weicher Seitenwechsel (`seitenwechsel`),
Menü-Blatt (`menue-blatt`), Panel blendet mit `opacity`/`translate` ein, der Schwung im Hero zeichnet sich einmal (0,9 s, nach dem
ersten Bild, nie das LCP-Element). Nur `transform`/`translate`/`opacity`/`stroke-dashoffset`-freie Varianten (`clip-path`).
Bei „Bewegung reduzieren“ alles statisch und sichtbar.

## Nicht verwendet (bewusst)

Video (Stockclips, 848 × 464), Stockfotos als Referenzen/Projekte, Bewertungen (ohne Quelle), Vorher/Nachher (kein Material),
Rückenfoto vor Greenscreen (unruhig), Google Maps/iframes, Cookies, Tracking, Cookie-Banner (nicht nötig).

## Überarbeitung 02.10.2026 (A-076): Arbeitskleidung und Stickerei

Wunsch von Elias: Menü überarbeiten, Hero voller (vor allem am Handy), unnötige Nummern weg, durchdachte eigene Zeichen,
Textabschnitte lebendiger, Design aus Logo und Arbeitskleidung ableiten. Die Leitidee: **Das Team trägt schwarze Polos mit
gesticktem grünem Logo.** Daraus kommen drei Mittel, die überall gleich eingesetzt werden:

1. **Schwarz** (`--farbe-schwarz` #121412, erhaben `--farbe-schwarz-hoch` #1e221e) für Kopf, Schnellleiste, Vertrauensleiste,
   Ablauf, Anfrage-Karte und Fuß. Auf Schwarz: Text Creme (17,7:1), Nebentext `leise-hell` (11,4:1), Grün nur `gruen-hell`
   (8,2:1). Knöpfe auf Schwarz in Stickgrün mit schwarzer Schrift (`.knopf--stick`).
2. **Naht**: gestrichelte grüne Linie wie eine Steppnaht. Unter dem Kopf, über dem Fuß, als Unterstrich im Menü, als Weg im
   Ablauf, als Innenrand von Bogen, Panel, Menü-Blatt und Anfrage-Karte.
3. **Aufnäher** (`.patch`): eigene Zeichen (24er-Raster, Strich 1,6, je Zeichen genau ein grünes Detail) auf einem schwarzen
   Kreis mit Naht. Nur dort, wo ein Zeichen etwas erklärt: 6 Leistungen, 4 Zusagen, 4 Ablaufschritte, 6 Gründe. Keine
   Zeichen in FAQ, Fuß oder Fließtext. Die Nummern 01–06 (Leistungen, Gründe), 01–04 (Ablauf) und 1–2 (Formular) sind weg.

**Hero:** Das Team ist freigestellt und steht in einem bestickten Bogen; dahinter der schwarze Schwung aus dem Logo (im Logo
umfasst er das Haus, hier das Team). Zwei Karten (Garantie, Besichtigung) schweben davor. Am Computer kippt die Bühne mit
dem Zeiger (höchstens 5°, Ebenen in echter 3D-Tiefe), am Handy steht das Team direkt unter der H1 im ersten Bildschirm.
Unter dem Team beginnt die schwarze Vertrauensleiste: die Hemden gehen in die Fläche über.

**Menü:** Computer: Leiste mit Zeiten, Adresse, WhatsApp, E-Mail über dem schwarzen Kopf; „Leistungen“ öffnet ein breites
Panel mit allen Leistungen samt Aufnäher und einer schwarzen Karte „kostenlose Besichtigung“. Handy: schwarzes Blatt von
unten mit Naht, Leistungen mit Aufnähern, unten Angebot, Anrufen, WhatsApp, E-Mail, Bürozeiten.

**Text:** Ein Haltungssatz in großer Serif (nur belegte Aussagen: feste Kräfte, ein Ansprechpartner, Nachreinigung binnen
24 Stunden), Teile werden beim Lesen dunkel (Scroll-Timeline, ohne JS; vorher `leise`, also immer lesbar). Leistungsliste:
Zeigen oder Fokus wischt das passende Bild wie ein Abzieher herein (clip-path). Garantie: Siegel als Medaille mit Glanz,
pendelt leicht und folgt dem Zeiger. Bei „Bewegung reduzieren“ steht alles still.

**Bilder (Higgsfield, 02.10.2026, 6 Credits):** Teamfoto 2× hochgerechnet (2 Credits) und freigestellt (1 Credit) →
`medien/team-frei-*`. Drei Stimmungsbilder ohne Menschen für die Leistungen ohne eigenes Foto (je 1 Credit, GPT Image 2.5
mittel): Treppenhaus, Bauendreinigung, Privathaushalt. Sie sind mit `data-pruefen` als KI-Bild markiert und werden ersetzt,
sobald Merys Clean eigene Fotos liefert. Originale: Projektordner `merysclean/material/higgsfield/`.

## Feinschliff 02.10.2026 (A-077, nach Elias' Durchsicht der Vorschau)

- **Ein Grün:** überall das Logo-Grün `#5fba46` (`--farbe-akzent` = `--farbe-gruen-hell`); das dunkle `#2a7430` und die Tint-Fläche sind weg. Weil Grün auf Hell nur 2,2 : 1 hat, steht es dort nie als Schrift, Rahmen oder Fokus: Links sind dunkel mit grünem Unterstrich, Hauptknopf grün mit schwarzer Schrift, Fokus dunkel, Hervorhebungen als grüner Textmarker.
- **Überzeile als Etikett** (schwarzes Band, Naht, grüner Stich) statt des kleinen Bogens, den man nicht verstanden hat.
- **Grund:** feiner Piqué (Punktraster wie Polostoff) statt glatter Fläche; großer Logo-Schwung (`img/deko-schwung.svg`) hinter dem Haltungssatz.
- **Hero:** Garantie und Besichtigung als zwei Etiketten unter den Knöpfen, nicht mehr im Bild; Bühne in warmem Creme mit Piqué statt Hellgrün.
- **Leistungsliste:** aktive Zeile wird schwarzes Band; Bild wischt herein bei Zeigen, Fokus oder Scrollen (IntersectionObserver), auf dem Handy als mitlaufendes Bild über der Liste (sticky, kein Layoutsprung).
- **Brotkrumen** als Leiste mit Haus-Zeichen und grünen Schrägstrichen auf allen Unterseiten (auch Impressum, Datenschutz, Danke).
- **Anfrage-Band:** links Text mit drei Haken, rechts ein eingenähtes Fach: Knopf, „oder direkt“, Telefon, WhatsApp, E-Mail.
