---
name: kundenseite-bauen
description: Eine Kundenseite in einem Zug vom Briefing bis zur Abnahme bauen – Lesen, Anlegen, Gestaltung mit Generator, Speisekarte/Daten mit Abgleich-Test, Unterseiten, Prüfen, Nachbessern, Meisterprüfung, Doku. Mit Zeitvorgaben, Befehlen und Stolperfallen aus der Generalprobe A-037. Nutzen bei "/kundenseite-bauen", "baue die Seite für …", "komplette Kundenseite".
---

# Kundenseite bauen (Ablauf aus der Generalprobe A-037)

Ordner `S=kunden/<slug>`, Branch `kunde/<slug>`. Jede Phase mit `date -u +%H:%M` in ein Zeitprotokoll schreiben.
Richtzeiten gelten für eine Restaurant-/Handwerkerseite mit 6–8 Seiten (Generalprobe: ≈ 40 min Bauen und Prüfen).

| Phase | Richtzeit | Ergebnis |
|---|---|---|
| 1 Lesen | 5 min | Fakten, offene Punkte, Stolperfallen bekannt |
| 2 Anlegen | 5 min | Ordner, Stammdaten, Wartungseintrag, Tests laufen |
| 3 Gestaltung/Grundgerüst | 15–30 min | `bauen.mjs`, `marke.css`, `stil.css`, Startseite |
| 4 Daten (Speisekarte, Preise) | 5–10 min | JSON aus der Quelle + Abgleich-Test |
| 5 Unterseiten | 5 min | alte Adressen, Kontakt, Rechtstext-Platzhalter |
| 6 Prüfen | 15 min | Tests, HTML, Kopf, Breiten, Lighthouse, Budget |
| 7 Nachbessern | 5–15 min | alle Befunde behoben, Prüfung erneut grün |
| 8 Meisterprüfung | 10 min | P1–P4, W1–W7, Zustands-Screenshots |
| 9 Doku | 10 min | Zeitprotokoll, FEHLER.md, Log, Commit, Push |

## 1 Lesen
**Zuerst `/bestellung`:** `auftrag.md` → `PFLICHTENHEFT.md`; dessen Regeln aus „Planen“ und „Bauen“ gelten ab hier in jeder Phase.
Dazu `wissen/FEHLER.md`, `wissen/MEISTERSTANDARD.md`, `wissen/DESIGN-WISSEN.md`, beim Kunden vorhandene `CLAUDE.md`/Analyse.
Eine Liste anlegen: **feste Fakten** (Telefon, Adresse, Route) und **offene Punkte** (werden `data-pruefen`).

## 2 Anlegen
`/neuer-kunde` (Kopie von `vorlage/` ohne `node_modules`/`package-lock.json`). Nicht Gebrauchtes sofort entfernen
(z. B. Stripe-Functions und -Tests, wenn nichts verkauft wird) und `_headers`/CSP anpassen (`form-action 'self'`).
Fotos nur aus dem Bestand des Kunden, nie hochrechnen (keine Breite über der Quelle).

## 3 Gestaltung/Grundgerüst
- **Generator statt Hand-HTML:** `bauen.mjs` liest `inhalt/seite.json` (+ Daten-JSON) und schreibt alle Seiten und
  `sitemap.xml`. Test „HTML ist aktuell“ baut in einem Temp-Ordner nach und vergleicht (Muster: `kunden/urfa-meister/tests/seite.test.mjs`).
- **Leitmotiv aus der Welt des Kunden** (W2), z. B. Kupfertablett „Sini“, Logo-Skyline als CSS-Maske, Zierlinie aus dem Logo.
- **Marke in einer Datei:** `public/css/marke.css` mit Schriften und 6–7 Farbrollen; zweites Schema
  `:root[data-schema="…"]` gleich mitbauen (P4 kostet dann 2 min).
- **Schriften:** woff2 aus npm `@fontsource…` oder google/fonts-Rohdateien, dann **eine** Datei je Schrift mit
  Latin-1 + Latin Extended-A (türkisch, polnisch …):
  `pyftsubset x.ttf --unicodes="U+0000-00FF,U+0100-017F,U+2000-206F,U+20AC" --flavor=woff2 --layout-features='*' --output-file=public/fonts/x.woff2`.
  Ersatzschrift mit `size-adjust` aus fontTools messen (Breite von „Hamburgefonstiv“ gegen Arial/Georgia).
- Bausteine: `node bausteine/einbauen.mjs einblenden seitenwechsel menue-blatt galerie` im Seitenordner.
- Hero: LCP-Bild mit `fetchpriority="high"`, nie lazy, ab Bild 0 sichtbar; Ladeanimation nur `transform`/`opacity`.

## 4 Daten mit Abgleich-Test
Daten nie abtippen: aus der maßgeblichen Quelle ziehen (Python-Quelle per `ast`, nicht ausführen – FEHLER 32).
Test liest **alte und neue Seite mit derselben Regex** und vergleicht Position für Position (Nummer, Name,
Kennzeichnung, Preis, Menge, Beschreibung, Prüf-Flag). Abgeleitete Angaben („ab 12,50 €“) im Test aus den Daten
berechnen. **Gegenprobe:** einen Preis testweise ändern → Test muss rot werden, dann zurück.
Muster: `kunden/urfa-meister/tests/speisekarte.test.mjs`.

## 5 Unterseiten
Alte Adressen behalten (`galerie.htm` …), `_redirects` für `/index.htm`. Impressum/Datenschutz nur als Platzhalter
mit `data-pruefen="Rechtstext nicht erfinden …"`. Kontaktformular: Honigtopf, POST an `/api/kontakt`,
Zieladresse offen lassen, Formular selbst `data-pruefen`. Feste Schnellleiste Anrufen/Route/Karte auf jeder Seite.

## 6 Prüfen
```bash
node werkzeuge/gzserver.mjs 8231 $S/public &   # Port 8230–8239, PID merken: echo $! > …/server.pid
(cd $S && npm test)
werkzeuge/node_modules/.bin/html-validate -c werkzeuge/.htmlvalidate.json $S/public/*.htm*
python3 werkzeuge/kopf-pruefen.py $S/public
node werkzeuge/pruefen.mjs $S/public 8231       # 320–1920, ohne JS, reduzierte Bewegung, Tippflächen
werkzeuge/lighthouse.sh $S/public 8231           # SEITEN="index.html" für einzelne Seiten
node werkzeuge/budget.mjs $S/public 8231
```
Server am Ende mit `kill $(cat …/server.pid)` beenden, **nie `pkill -f`**.

## 7 Nachbessern – häufigste Befunde der Generalprobe
- 1 px Überlauf bei 360: Zierlinie mit `nowrap` → Linien schrumpfen lassen, unter 26rem umbrechen.
- A11y 96: Akzent-/Kupferfarbe als Text unter 4,5:1 → `color-mix(in srgb, var(--farbe-linie) 72%, var(--farbe-text))`.
- Kopfzeile zweizeilig bei 768 → Nebenelemente (Telefon im Kopf) zwischen 48–64rem ausblenden.
- Menü-Schleier grau auf dunklem Thema → Schleier mit `--farbe-grund` überschreiben.
- JSON-LD: jeder Textwert (auch Einträge in Arrays) muss sichtbar auf der Seite stehen, sonst weglassen.

## 7a Quality Gate
`/abnahme` (`node werkzeuge/qualitaet.mjs $S --voll`) – prüft Pflichten aus dem Auftrag und den globalen Standard; manuelle Punkte mit Beleg in `abnahme.md`.

## 8 Meisterprüfung
`/meisterpruefung`. Zustände selbst aufnehmen (Fokus, Hover, Fehler, leere Suche, offenes Menü, Schnellleiste,
`#pruefen`, ohne JS) als Sammelbild je Handy/Desktop. **Ganzseiten-Screenshots mit `reducedMotion: 'reduce'`**,
sonst verstecken Scroll-Timeline-Einblendungen Abschnitte. Bildfolgen nur für DocumentTimeline-Animationen.
Screenshots als PNG ≤ 300 KB (DPR 1 für 1440, Ausschnitte statt Ganzseite).

## Sonderfall: Einseiter / Portfolio (A-038, ≈ 33 min)
- Eine Startseite mit Ankern + Impressum/Datenschutz/404/Danke reicht; `bauen.mjs` trotzdem nutzen (Test „HTML ist aktuell“).
- Kopf-Links auf Unterseiten als `/#anker`, auf der Startseite als `#anker`; Formular-Rückweg `zurueck: '/#kontakt'`.
- Persönliches (Name, Ort, Telefon, E-Mail, Foto, Preise) als sichtbarer Platzhalter mit `data-pruefen`; ein Test prüft,
  dass jeder `tel:`/`mailto:`-Link markiert ist und kein Euro-Betrag auf der Seite steht.
- Messwerte fremder Arbeiten (Lighthouse, Budget) im Hintergrund messen, während der Generator entsteht.
- Pillen-Radius nicht als `--radius-gross` für Flächen (Menü-Blatt wird rund), kein globales `scroll-behavior: smooth`.

## 9 Doku
Zeitprotokoll abschließen (Dauer, Gesamt, Zeitfresser), Lehren ans Ende von `wissen/FEHLER.md`,
`python3 ops/log.py fertig A-xxx "…"`, `python3 ops/log_vereinen.py --pruefen`, Commit mit Trailer, `git push -u origin kunde/<slug>`.
PR nur, wenn der Auftrag es verlangt.
