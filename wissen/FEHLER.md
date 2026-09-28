# Bekannte Fehler (bitte nicht wiederholen)

Aus früheren Projekten, verallgemeinert. Neue Fehler: mit `/lektion` im eigenen Logbuch eintragen; wiederkehrende
oder besonders teure Fehler zusätzlich hier unten anhängen (mit Kürzel des Bruders).

## Layout & CSS

| # | Fehler | Regel |
|---|---|---|
| 1 | `padding: 64px 0` überschrieb den seitlichen Innenabstand des Containers | `padding-block` / `padding-inline` verwenden |
| 2 | `<figure>` hat im Browser 40 px Rand links und rechts – Bildrahmen viel zu schmal | immer `figure { margin: 0 }` |
| 3 | Sprungziele unter klebenden Leisten falsch | `scroll-padding-top` (html) und `scroll-margin-top` (Ziel) **addieren sich**; Leistenhöhe per Skript messen und nachmessen |
| 4 | Grid-Kinder sprengten bei 320 px die Breite | `min-width: 0` auf Grid-Kinder; bei 320 px testen, nicht nur 390 |
| 5 | Lange deutsche Wörter ragten über den Rand | `hyphens: auto; overflow-wrap: break-word` für Überschriften |
| 6 | `text-transform: uppercase` machte aus „ß“ „SS“ | deutsche Wörter mit ß nicht per CSS versalieren |
| 7 | Telefonnummer brach mitten in der Nummer um | `&nbsp;` zwischen den Ziffernblöcken |
| 8 | `display: grid` auf Listeneinträgen hob `[hidden]` auf | `[hidden] { display: none !important }` |
| 9 | Bildunterschrift + Steuerung auf 320 px gequetscht | auf Handys untereinander stapeln |
| 10 | Kategorie-Chips brachen in zwei Zeilen um | horizontal scrollbar mit Ausblend-Maske |
| 11 | Ein Grid-Raster hatte eine Lücke | Zellen vorher durchzählen (Summe muss Vielfaches der Spaltenzahl sein) |
| 12 | Kleines Foto stark vergrößert und unscharf | kleine Quellbilder nie stark beschneiden/vergrößern |
| 13 | Halbtransparentes Menü auf `backdrop-filter`-Leiste wirkte durchsichtig | aufklappende Panels mit deckendem Hintergrund |
| 14 | `position: fixed`-Menü lag nur in der Kopfzeile | Elemente mit `backdrop-filter`/`transform` werden Bezugsrahmen → Vollbild-Ebenen außerhalb davon platzieren |

## Animation

| # | Fehler | Regel |
|---|---|---|
| 15 | Menü „erschreckt“: in 0,2 s war fast alles da | Kurve, die leise startet, ~0,8 s; Fläche nach und nach freigeben; Bildfolge prüfen |
| 16 | Ursache zuerst in der Farbe gesucht | bei „erschreckt/unruhig“ zuerst Tempo und Kurve prüfen |
| 17 | Scroll-gekoppelte Effekte wirkten unruhig | beim Sichtbarwerden auslösen, dann festes Tempo |
| 18 | Einblend-Klassen blockierten später Hover-Effekte | Klassen nach dem Einblenden entfernen – aber nur bei Elementen, die ohne die Klasse sichtbar sind |
| 19 | Elemente im ersten Bildschirm flackerten | was beim Laden sichtbar ist, nicht verstecken |
| 20 | Diashow: altes Foto sprang auf 100 % zurück, während es noch sichtbar war | Grundregel `transition: transform 0s <Überblendzeit>` |
| 21 | Erster Fortschrittsbalken schneller als erster Wechsel | erster Balken bekommt Takt + Versatz |
| 22 | `clip-path`-Animation mit `fill-mode: both` schnitt `outline` ab | `backwards` verwenden |
| 23 | Wort-Welle startete mit 16–20 % Deckkraft → Kontrastfehler | Text immer lesbar lassen (≥ 45 % oder farbige Kopie darüber animieren) |
| 24 | Screenshot zeigte halb gezeichnete Logos/leere Bereiche | nach Scrollen ≥ 2,5 s warten oder `reducedMotion: 'reduce'`; Hover per `getComputedStyle` prüfen |

## JavaScript & Bedienung

| # | Fehler | Regel |
|---|---|---|
| 25 | Geschlossenes Menü per Tab erreichbar | `inert` solange zu; Fokus beim Öffnen auf ersten Eintrag, Escape zurück zum Knopf |
| 26 | Ohne JavaScript war das Handy-Menü unerreichbar | Klasse `js` früh im `<head>` setzen, Navigation ohne JS als Zeile zeigen |
| 27 | Neue `.js …`-Regeln überschrieben Desktop-Regeln | nach CSS-Änderungen Desktop **und** Handy ansehen |
| 28 | Chip-Leiste scrollte falsch | `offsetLeft` bezieht sich auf das nächste positionierte Elternelement; Leiste `position: relative` |
| 29 | Aktive Kategorie in zwei Spalten falsch | Kategorie gewinnt, deren Überschrift zuletzt die Leselinie passiert hat; bei Gleichstand bleibt die aktive; Deep-Link `#…` direkt setzen |
| 30 | Regex-Fehler durch unsichtbare Kombinationszeichen | `̀-ͯ` schreiben; `<meta charset="utf-8">` |
| 31 | `content-visibility: auto` verschob Sprungziele | vor #-Sprüngen und im Leerlauf vollständig berechnen |
| 32 | Kopier-Skript brach, weil eine andere Seite ihr HTML änderte | aus fremden Dateien nur **Daten** lesen, eigenes HTML bauen, Abgleich mit `assert` |

## Leistung

| # | Fehler | Regel |
|---|---|---|
| 33 | Performance 87: LCP-Foto war `loading="lazy"` | LCP-Element nachsehen, nie lazy, `fetchpriority="high"` |
| 34 | 160 ms Blockierzeit | Layout lesen/schreiben nicht abwechseln; erzwungene Reflows nur beim Animations-Neustart |
| 35 | Kursivschrift lud vor dem Hero-Foto | im ersten Bildschirm nur ohnehin geladene Schnitte |
| 36 | LCP war ein Element mit Einblend-Animation | im ersten Bildschirm nichts mit `opacity: 0` starten |

## Werkzeuge & Umgebung

| # | Fehler | Regel |
|---|---|---|
| 37 | `pkill -f "http.server"` in derselben Befehlskette beendete die eigene Shell, Commit lief nicht | Server getrennt starten/stoppen; danach `git log -1` prüfen |
| 38 | Tests über `file://` – Masken, Sprites, Schriften fehlten | immer über lokalen HTTP-Server |
| 39 | Ganzseiten-Screenshots zeigten Lazy-Bilder leer | vorher durchscrollen |
| 40 | SVG mit `--` im Kommentar war ungültig, Maske fiel stillschweigend weg | SVGs mit XML-Parser prüfen |
| 41 | Artifact-Vorschau: Unterseiten ohne Grundgerüst → Quirks-Modus | Unterseiten mit `<!DOCTYPE html>` und charset; Skripte, die `document.body` brauchen, hinter den Seitenbeginn |
| 42 | Artifact lädt eigenes CSS/JS nicht zuverlässig | CSS, JS, Schriften (base64) und Icon-Sprite in jede Seite einbetten (`werkzeuge/vorschau.py`) |
| 43 | Viele Seiten sind im Netz gesperrt (je nach Umgebung) | Referenzen als Screenshots/Dateien vom Nutzer holen; npm und PyPI gehen meist |

## Ergänzungen

| # | Fehler | Regel |
|---|---|---|
| 44 | (A) Deko-SVG, die über ihren Rahmen hinausragen sollte, wurde winzig: `svg { max-width: 100% }` deckelte die Breite, `height: auto` ohne `aspect-ratio` ergab 150 px | ausragende Deko-SVG: `max-width: none` + `aspect-ratio` wie die viewBox |
| 45 | (A) CLS 0,056: Öffnungsstatus ohne JS zweizeilig, per Skript (defer) einzeilig ersetzt | Status-Funktion inline im `<head>`, direkt nach dem Element aufrufen – oder gleiche Zeilenzahl sicherstellen |
| 46 | (A) Symbol-Knopf ohne Namen, weil der Text per `display: none` versteckt war (A11y 95) | Text nur visuell verstecken (clip-path-Muster) oder `aria-label` |
| 47 | (A) Playwright: `ERR_CERT_AUTHORITY_INVALID` hinter dem Proxy, `curl` geht | fremde Seiten mit `curl` spiegeln und lokal ausliefern, nie TLS-Prüfung abschalten |
| 48 | (A) `npm install` in `werkzeuge/` legt `package-lock.json` an → `sync.sh` stoppt | Datei löschen oder `npm install --no-package-lock` |
| 49 | [B] Ganzseiten-Screenshot mit leeren Flächen: `scroll-behavior: smooth` machte `scrollTo(0, y)` im Test-Skript weich, Einblend-Elemente wurden nie ausgelöst | in Skripten `scrollTo({ top: y, behavior: 'instant' })` |
| 50 | [B] 1 px Überlauf bei 320 px durch gedrehte Deko-Kontur am Rand; `body { overflow-x: clip }` half in der Handy-Emulation nicht (`innerWidth` 321, feste Leisten mitverbreitert) | `overflow-x: clip` auf die Abschnitte; Fundort durch Ausblenden einzelner Abschnitte und Messen von `scrollWidth` eingrenzen |
| 51 | [B] A11y 96: Nebentext mit `opacity: .85` auf farbiger Karte → Kontrast 4,44 | Nebentext nie per `opacity`, feste Farbe messen |
| 52 | [B] Prüf-Ansicht: `::before`-Hinweis gequetscht (Flex), über dem Foto (Deko-`::before` absolut) oder leer (`attr()` auf `<tr>` im `td::after`) | Prüf-Stil setzt `position: static; transform: none; flex: 0 0 100%`; `data-pruefen` auf `<td>` statt `<tr>` |
| 53 | [B] Status-Punkt im offenen Menü grün: `.offen .punkt` traf auch, weil der Menü-Vorhang selbst `.offen` heißt | Zustandsklassen mit Bauteil-Präfix (`status--offen`); Öffnungsstatus mit `page.clock.setFixedTime(…)` zu mehreren Uhrzeiten testen |
| 54 | [C] `font-variant-numeric: tabular-nums` zeigte bei Mona Sans eine durchgestrichene Null („38,Ø0 €“) | Ziffern der gewählten Schrift mit `tnum` vorher ansehen; rechtsbündige Preise brauchen keine Tabellenziffern |
| 55 | [C] 157 ms lange Aufgabe beim Start: Kopfhöhe lesen → DOM einfügen → `getBoundingClientRect` für Einblenden = drei erzwungene Layouts | Maße aus `ResizeObserver`/erstem `IntersectionObserver`-Aufruf (`entry.boundingClientRect`); DOM, das vor dem ersten Zeichnen stehen muss, im Inline-Skript bauen |
| 56 | [C] Offenes Menü: Tab erreichte den Skip-Link, Seite dahinter sprang nach oben | beim Öffnen **alle** Kinder von `body` außer dem Dialog `inert` setzen, nicht nur `main`/Kopf/Fuß |
| 57 | [C] Deep-Link (`#kategorie`) beim Laden unter dem klebenden Kopf: Kopfhöhe kam erst per Skript | `scroll-padding-top` in CSS mit der Kopfhöhe vorbelegen, Skript verfeinert nur; Ziele unter einer Reiterleiste mit `scroll-margin-top` |
| 58 | [C] `writing-mode: vertical-rl` auf einem Flex-Container: Kinder standen untereinander statt nebeneinander | die Flex-Hauptachse folgt der Schreibrichtung → `flex-direction: column` für „nebeneinander“ in senkrechter Schrift |
| 59 | [C] „Bewegung reduzieren“: per Skript ausgelöste Übergänge (feste Leiste, gleitende Markierung) liefen weiter | globale Regel unter `prefers-reduced-motion: reduce` (`transition-duration`/`animation-duration: 0s !important`); mit `document.getAnimations()` prüfen |
| 60 | [C] Vorschau: 404 für Schrift-Preload (Schriften eingebettet, Datei gelöscht); `defer`-Skript lief ohne `defer` im `<head>` | `vorschau.py` entfernt lokale Schrift-Preloads (behoben); eigenes Skript wartet bei `readyState === 'loading'` auf `DOMContentLoaded` |
| 61 | [C] Serifenschrift nur mit Schnitt 400: alte `<b>`/`font-weight: 650`-Regeln ließen den Browser künstliches Fett erzeugen (unsauber) | `html { font-synthesis: none }` und Hervorhebung gestalterisch lösen (Farbe, Lichtschein, Größe); nach Schriftwechsel alle `font-weight` durchsuchen |
| 62 | [C] Deckende Textur-Kachel als oberste Hintergrundebene übermalte die Grundfarbe einer Fläche (Fliesen wurden weiß) | deckende Bildebenen nie über eine Farbfläche legen, sonst `background-blend-mode: multiply` oder halbtransparente Textur |
| 63 | (A) Lichtring um ein rundes Foto wurde oval, weil die Ebene per `inset` an der ganzen `figure` (inkl. Bildunterschrift) hing | Deko-Ebenen um runde Bilder über die Breite bemaßen: `width: 120%; aspect-ratio: 1` |
| 64 | (A) `<button>` mit Umriss-Knopf-Klasse zeigte grauen Browser-Hintergrund | Knopf-Klassen setzen immer `background` (auch `none`) |
| 65 | (A) In der Artifact-Vorschau fehlten alle Skript-Funktionen: eingebettetes Skript lief im `<head>` vor dem DOM | Skript startet bei `readyState === 'loading'` erst mit `DOMContentLoaded`; die **veröffentlichte** Vorschau mit Funktionstest prüfen (lokal mit Grundgerüst + viewport-meta) |
| 66 | (A) Kopf-Fehler wiederholten sich (Skript im `<head>` vor dem DOM, eingebettete Skripte verlieren `defer`) | **automatisch abgesichert:** `vorschau.py` setzt defer/async/module-Skripte ans Ende des `<body>`; `werkzeuge/kopf-pruefen.py` läuft per Hook nach jeder Bearbeitung; `werkzeuge/vorschau-testen.mjs` vergleicht Original und Vorschau. Regeln: CLAUDE.md Punkt 9 |
- **YAML: Doppelpunkt mit Leerzeichen in einem ungequoteten `run:`-Wert** (`--title "Wartung: …"`) macht die ganze Workflow-Datei ungültig; GitHub führt sie dann still nie aus. Mehrteilige Befehle immer als `run: |` und Workflows nach dem Schreiben mit `python3 -c "import yaml; yaml.safe_load(open(f))"` prüfen.
- **GitHub ignoriert `merge=union` aus `.gitattributes`** beim Mergen im Browser: parallele PRs, die beide ans Auftragslog anhängen, geraten in Konflikt. Vor dem Merge lokal `git merge origin/main`, bei Konflikt `python3 ops/log_vereinen.py`.
