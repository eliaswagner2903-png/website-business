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
- **Formularfehler als reiner Text** (Fremdprüfung Stufe 5): Ein normales `<form method="post">` landet bei 400/403/502/503 auf der Antwort der Function. `text/plain` wirkt dort wie ein Absturz. `fehlerSeite(text, status, { zurueck })` aus `functions/_lib/antwort.js` liefert eine kleine gestaltete Seite (eigenes CSS, Meldung escaped, Link zurück zum Formular-Anker).
- **`public/_headers` gilt nicht für Antworten von Pages Functions** (Fremdprüfung Stufe 5). HTML aus einer Function braucht eigene Header im Code: CSP, `nosniff`, `no-store`.
- **Menü-Knopf nur in einer Leiste, die erst nach dem Scrollen erscheint** (Fremdprüfung Stufe 5): Im ersten Bildschirm auf dem Handy gab es dann keine Navigation. Ein Menü-Knopf gehört von Anfang an in den Kopf. Danach die Kopfhöhe bei 320–767 px messen: Ein zusätzlicher 44-px-Knopf ließ den Kopf bei 360–424 px zweizeilig werden.
- **JSON-LD** (Fremdprüfung Stufe 5): `application/ld+json` wird nicht ausgeführt und braucht keinen CSP-Hash. `<` wird als `<` maskiert. Ein Test prüft jeden Textwert gegen den sichtbaren Seitentext: `<wbr>` ohne Leerzeichen entfernen, `&nbsp;` als Leerzeichen lesen. Er fand „Lindgrund Uhrmacherei“, das nur im `<title>` stand, und „L-40 Schiefer“, das nirgends stand.
- **`rel="canonical"` ist absolut** (Fremdprüfung Stufe 5): Ein Test „keine fremde Quelle im Kopf“ (`<link … href="https:`) schlug deshalb an. Solche Tests nehmen `rel="canonical"` aus.
- **Tippfläche 44 px ohne Layoutbruch** (Fremdprüfung Stufe 5): Einzelner Link im Fließtext: `padding-block` am Inline-Element vergrößert die Fläche, die Zeilen bleiben gleich. Links, die untereinander stehen: `display: inline-block; padding-block: calc(22px - <halbe Zeilenhöhe>)`. Sonst überlappen die Flächen.
- **`pkill -f`/`pgrep -f <muster>` trifft auch die eigene Shell** (Fremdprüfung Stufe 5, wie #37): Deren Befehlszeile enthält das Muster, der Aufruf endet mit Exit 144. Die Server-PID beim Start merken (`$!`) und gezielt beenden.
- **gzserver** (Fremdprüfung Stufe 5): Er liefert jetzt `404.html` mit Status 404 und wendet alle passenden `_headers`-Blöcke an (`/fonts/*` usw.). Cache-Header sind damit lokal prüfbar, zum Beispiel mit `curl -sD- -o/dev/null localhost:PORT/fonts/x.woff2`.
- **Higgsfield-Download gesperrt** (Visualtest A-036): Die Ergebnisse liegen auf `d8j0ntlcm91z4.cloudfront.net`, der Proxy gab 403. Die Domain muss in der Netzwerkfreigabe stehen. Eine geänderte Umgebung wirkt nur in **neuen** Sitzungen; die laufende Sitzung lässt eine frische Sitzung herunterladen und auf den Branch pushen. Das Video erst erzeugen, wenn der Download sicher geht.
- **ffmpeg ist doch da** (Visualtest A-036): `npm i ffmpeg-static` liefert ein fertiges ffmpeg 7 (npm ist freigegeben). Die alte Notiz „nicht installierbar“ war falsch.
- **Video nie in `<picture>` einhängen** (Visualtest A-036): `hero-video.js` setzte das `<video>` mit `poster.after()` hinter das Poster-`<img>`. Steckt das `<img>` in einem `<picture>`, landete das Video darin. Jetzt: `(poster.closest('picture') || poster).after(film)`.
- **HTML aus Generator** (Visualtest A-036): In `showcase/hell` baut `bauen.mjs` alle Seiten. Eine Änderung direkt in `public/index.html` lässt den Test „HTML ist aktuell“ scheitern. Erst prüfen, ob es einen Generator gibt (`bauen.mjs`, `seiten.py`), und dort ändern.
- **Kupfer/Akzent als Textfarbe** (Generalprobe A-037): Die Linienfarbe #9a6b45 auf Dunkel ergab 4,21:1 → Lighthouse A11y 96. Textfarbe aus der Rolle mischen: `color-mix(in srgb, var(--farbe-linie) 72%, var(--farbe-text))`. Jede Rolle, die auch als Text dient, gegen den Grund messen.
- **Scroll-Timeline versteckt Abschnitte im Ganzseiten-Screenshot** (A-037): Mit `animation-timeline: view()` bleiben Abschnitte, die nie im Bild waren, unsichtbar. Durchscrollen hilft nicht zuverlässig. Prüf-Screenshots mit `reducedMotion: 'reduce'` aufnehmen.
- **Bildfolge und Scroll-Timeline** (A-037): `anim.currentTime = x` wirft bei Scroll-Timeline-Animationen „Invalid currentTime“. Nur Animationen mit `a.timeline instanceof DocumentTimeline` stellen.
- **Menü-Schleier auf dunklem Thema grau** (A-037): Der Baustein `menue-blatt` färbt den Schleier mit der Textfarbe; auf dunklem Grund wird er hellgrau. In `stil.css` mit `color-mix(… var(--farbe-grund) 74%, transparent)` überschreiben.
- **Schriften als eine Datei mit Latin Extended-A** (A-037): Statt latin + latin-ext (4 Dateien, 2 Anfragen mehr) je Schrift eine woff2 per `pyftsubset` mit `U+0000-00FF,U+0100-017F,U+2000-206F,U+20AC`. Türkisch (ş ı İ ğ) ist dabei, zwei Schriften zusammen 45 KB.
- **Zierlinie mit `nowrap` → 1 px Überlauf** (A-037): Linie–Raute–Text–Raute–Linie mit festen Linienbreiten war bei 360 px 1 px zu breit (innerWidth 361, FEHLER 50). Linien `flex: 0 1 1.4rem; min-inline-size: .6rem`, unter 26rem Umbruch erlauben.
- **JSON-LD-Test zu schwach** (A-037): Der Test prüfte nur Zeichenketten; `servesCuisine: ['Türkisch','Anatolisch','Grill']` rutschte durch, obwohl „Anatolisch“ nirgends sichtbar war. Arrays von Zeichenketten mitprüfen.
- **Kopfzeile bei 768 px zweizeilig** (A-037): Logo + 5 Links + Telefon passten nicht. Telefon im Kopf zwischen 48–64rem ausblenden (Schnellleiste und Hero tragen es dort).
- **Galerie über Budget trotz `loading="lazy"`** (A-037): Chrome lädt lazy Bilder im Umkreis von ~1250–2500 px sofort, eine Galerieseite mit 12 Fotos kommt so auf ≈ 690 KB. Budget gilt nur für die Startseite; für Galerien kleinere Vorschaubilder (≤ 480 px) vorsehen.
- **Pillen-Radius als `--radius-gross` macht das Menü-Blatt rund** (Portfolio A-038): Mit `--radius-gross: 999px` (Knöpfe als Pille) wurde das Blatt aus `menue-blatt` zu einem Kreisausschnitt, weil der Baustein den Radius auch für große Flächen nimmt. Blatt-Radius in `stil.css` mit höherer Spezifität setzen (`.js .kopf .blatt { border-radius: … }`, bausteine.css lädt danach) oder `--radius-gross` höchstens ≈ 32 px wählen. Nach jeder Radius-Änderung das offene Menü ansehen.
- **`html { scroll-behavior: smooth }` bricht die Prüfskripte** (A-038, wie FEHLER 49): `pruefen.mjs` meldete „6 Elemente unsichtbar“, weil `scrollTo(0, y)` weich scrollte und Scroll-Timeline-Einblendungen nie fertig wurden. `pruefen.mjs` und `bildfolge.mjs` scrollen jetzt mit `behavior: 'instant'`. Weiches Scrollen global lieber weglassen.
- **html-validate: `aria-label` auf `<span>`/`<dl>`** ist verboten bzw. nicht empfohlen (`aria-label-misuse`). Für Haken in Tabellen `<span aria-hidden="true">✓</span><span class="unsichtbar">enthalten</span>`; eine Liste mit Messwerten bekommt eine sichtbare Überschrift statt eines Labels. `<title>` höchstens 70 Zeichen (`long-title`).
- **`vorlage/tests/bausteine.test.mjs` kennt keine privaten Variablen `--_x`** (A-038): Die Kopie aus `kunden/urfa-meister` erlaubt sie (`^--(_[a-z-]+|…)`), die Vorlage noch nicht. Bis das in der Vorlage nachgezogen ist: den Test aus urfa-meister übernehmen.
- **Überlappende Kacheln (Fächer) verdecken die Beschriftung der vorigen** (A-038): Beschriftung mit `position: relative; z-index: 2` und Hintergrund in der Grundfarbe; die gerade berührte/fokussierte Kachel per `:hover, :focus-within { z-index: 1 }` nach vorn holen.
- **Lighthouse SEO 66 auf `noindex`-Seiten ist gewollt** (A-038): Impressum, Datenschutz, 404 und Danke-Seite sind `noindex`; das Audit „Seite ist von der Indexierung ausgeschlossen“ senkt SEO. Meisterstandard SEO = 100 gilt für indexierte Seiten.
- **Vorschaubilder fremder (eigener) Seiten für ein Portfolio** (A-038): Aufnahme 1440×900 mit DPR 2 und 390×844 mit DPR 3 nach Durchscrollen und 4,5 s Warten (3D-Szene, Ladeanimationen), dann `bilder.mjs --breiten=640,1016,1600` bzw. `--breiten=320,640`. Ergebnis 12–60 KB je Datei. Dieselbe Handy-Datei im Hero und im Werk mit gleichem `srcset`/`sizes` → wird nur einmal geladen.
- **Scroll-Film lief im Test-Chromium nicht** (Portfolio A-047): Playwrights Chromium kann kein H.264, `video.duration` blieb `NaN`, der Poster stand. Film immer in zwei Fassungen ablegen (MP4/H.264 und WebM/VP9, je Computer und Handy) und per `video.canPlayType('video/mp4; codecs="avc1.4d401f"')` wählen. VP9 mit `-crf 34 -g 8` war nur halb so groß wie H.264 (0,8 statt 2,0 MB).
- **`scrollIntoView()` beim Start der Reiter springt die ganze Seite** (A-047): Wer den gewählten Reiter in einer seitlich scrollenden Leiste sichtbar machen will, setzt `leiste.scrollLeft`; `scrollIntoView` scrollt auch das Fenster, schon beim Laden.
- **`opacity: 0` für versteckte Radio-Knöpfe und wartende Videos meldet `pruefen.mjs` als unsichtbar** (A-047): Eingabefelder über der ganzen Karte mit `appearance: none; background: none; border: 0` statt `opacity: 0` unsichtbar machen; Video und zweites Standbild mit `visibility: hidden`, Einblenden per Animation `from { opacity: 0 }`.
- **Seiten als Vorschau-Link (Claude-Artifact) brauchen relative Pfade** (A-047): Unsere Seiten verlinken `/css/…`; unter einer Artifact-Adresse laufen die ins Leere. `node werkzeuge/vorschau-link.mjs <public> <ziel>` kopiert und schreibt die Pfade um (Division ` / ` in JS bleibt unangetastet, Pfade in JS gelten relativ zur Seite). Formulare verschicken dort nichts. Seiten echter Betriebe (URFA) ohne deren Freigabe nicht als Artifact veröffentlichen.
- **Menü-Blatt im Kopf mit kleinem z-index nicht antippbar** (OSG A-053, Jury R1): Der Kopf war `sticky` mit `z-index: 10` und damit ein eigener Stapelkontext. Das Blatt aus `menue-blatt` liegt darin und konnte nie über dem Schleier (`z-index: 15`) liegen. Jeder Tipp schloss das Menü, mit der Tastatur ging es. Der Kopf braucht `z-index` > 15 (Vorlage: 20). `pruefen.mjs` tippt das Handy-Menü jetzt an und meldet verdeckte Links.
- **Cloudflare Pages leitet `/seite.html` auf `/seite` um** (OSG A-053, Jury R1): Canonical, Sitemap und interne Links mit `.html` zeigen auf Umleitungen. Eine `_redirects`-Regel `/seite /seite.html` läuft mit Pages im Kreis. Links, Canonical und Sitemap ohne Endung erzeugen. `qualitaet.mjs` meldet Canonicals mit `.html`. Betrifft auch ältere Kundenseiten (urfa-meister).
- **Shop eines anderen Systems auf derselben Domain** (OSG A-053): `qualitaet.mjs` hielt Shop-Links (`/customer/…`, `/catalogsearch/…`) für tote interne Links. Im Auftrag `Fremde Pfade: /customer/, /blog/, …` eintragen (Präfix mit `/` am Ende, sonst genau). Nie eine Umleitung auf eine Adresse setzen, die die neue Seite selbst im Shop verlinkt (Kreis).
- **Hersteller/B2B ohne Kundenverkehr** (OSG A-053): `branchen.md` hat jetzt „Hersteller und Industrie (B2B)“ → `Organization`, keine Öffnungszeiten im JSON-LD (die Prüfung verlangt sie nur noch bei LocalBusiness). JSON-LD mehrerer Objekte als `{"@context", "@graph": […]}`.
- **Screenshots bei Pixeldichte 1 zeigen Glyphenlücken** („fin den“, „derSchneide“; OSG Jury R1): Teils Rundung der Glyphenpositionen (behoben mit `text-rendering: geometricPrecision` am `body`), teils echt zu enge Laufweite der schmalen Archivo (Überschriften höchstens −0,018 em, `word-spacing: .06em`). Satzurteile bei `deviceScaleFactor: 2` gegenprüfen.
- **Aufnahme „ohne JavaScript“ zu früh** (OSG Jury R1): Ein Screenshot direkt nach `goto` zeigte den Hero ohne Bild, die Jury wertete das als Mangel. Vor Zustandsbildern mindestens 1 s warten.
- **Links mit `display: inline-flex` trennen keine Silben** (OSG A-053): Im Fuß sprengte „Rücknahmebedingungen“ bei 360–1024 px das Raster. Lange Wörter mit `&shy;`, Listen-Raster mit `grid-template-columns: minmax(0, 1fr)`. Überlauf nach jeder Fuß-/Kopfänderung bei 320–1440 px messen, nicht nur bei 320.
- **Versteckte Radios (1 px) als kleine Tippfläche gemeldet** (OSG A-053): `pruefen.mjs` misst bei einem 1-px-Eingabefeld mit Label jetzt das Label.
- **WebM größer als MP4** (OSG A-053): VP9 aus Higgsfield-Film mit `-b:v 0 -crf 42`, zwei Durchgänge: 713 → 118 KB bei gleichem Bild. Die zuerst angebotene Quelle muss die kleinere sein.
- **Backslashes im Template-Literal verschwinden** (OSG Jury R2): `pattern="\+?[0-9 \(\)…]"` in einem JS-Template-String wird zu `+?[0-9 ()…]` (`\+`, `\(` sind dort keine Escapes). Im `v`-Modus der Browser ist das Muster dann ungültig, jede Eingabe gilt als richtig. In Generatoren `\\` schreiben und einen Test ergänzen, der jedes `pattern` mit `new RegExp(p, 'v')` kompiliert.
- **`counter(list-item)` auf `li` mit `display: flex` zeigt „00“** (OSG Jury R2): Nur `display: list-item` zählt den eingebauten Zähler hoch. Eigenen Zähler nehmen (`counter-reset` an der Liste, `counter-increment` am `li`).
- **Text-Ebene über einem Hintergrundfilm fängt Klicks ab** (OSG Jury R2): Der Halt-Knopf im Film (z-index −1) war bei 1366 px mit der Maus nicht erreichbar, weil `.held-in` darüber lag. Überlagernde Hüllen `pointer-events: none`, nur ihre Inhalte `auto`; mit einem Klicktest bei 1280–1440 px prüfen.
- **`shop` gleich `basis`** (OSG Jury R2): Liegt der Shop auf derselben Domain wie die neue Seite, zeigt „Zum Shop“ auf die eigene Startseite. Einen echten Einstieg des Shops nehmen (`/osg-products.html`) und per Test sichern (`shop !== basis`). Pfade darunter (`/customer/…`) immer von `basis` aus bilden.
- **Wort-Bindung vor dem Pfeil in Flex-Links** (OSG Jury R3): Wer das letzte Wort mit dem Pfeil in `<span class="nw">` bindet, verliert in `display: inline-flex`-Links das Leerzeichen davor („Serie AE-VMansehen“), weil Flex-Elemente Randleerzeichen verschlucken. In solchen Links `column-gap: .3em` setzen. Im Fuß mit schmalen Spalten gar nicht binden (Überlauf bei 390 px), und nie über `&shy;` hinweg binden.
- **Trefferzahl des Filters auf dem Handy unsichtbar** (OSG Jury R3): Nach dem Tipp auf einen Filter lag das Ergebnis unter dem Bildschirm. Die Zeile mit der Trefferzahl `position: sticky; bottom: <Höhe der Schnellleiste>` setzen, mit Sprunglink zu den Treffern.
- **Eigene `sitemap.xml`/`robots.txt` neben einem Shop auf derselben Domain** (OSG Jury R4): Beim Launch hätten sie die Dateien des Shops (35.000 Artikel-URLs, Sperren für `/checkout/`, `/customer/`, `/catalogsearch/`) überschrieben. Eigene Sitemap unter eigenem Namen (`sitemap-seiten.xml`), robots.txt mit den Sperren des Shops und beiden `Sitemap:`-Zeilen; `qualitaet.mjs` liest die in robots.txt genannte lokale Sitemap.
- **Klebende Trefferzeile verdeckt Fokus** (OSG Jury R4, WCAG 2.4.11): Die sticky Zeile erst nach der ersten Wahl kleben lassen und `html:has(.finder :focus-visible) { scroll-padding-bottom: … }` um die Höhe beider Leisten erhöhen. Den Sprunglink im Leerzustand ausblenden.
- **Knopf mit `gap` plus gebundenem Wort** (OSG Jury R4): `.knopf { gap }` und ein `<span class="nw">` ergeben doppelte Wortabstände. Bei `.knopf:has(> .nw)` `gap: 0` und am Span einen Wortabstand als `margin`.
- **Verneinter Alias wählt Leistung ab** (Merys Clean, 01.10.): „kein Maps-iframe“ in `auftrag.md` hat über den Alias „Maps“ Local SEO abgewählt. In auftrag.md Verneinungen ohne Leistungs-Aliase formulieren („statt eingebetteter Fremdkarte“) und das Pflichtenheft danach auf HOCH/Muss prüfen.
- **Knopf im Menü erbt Linkfarbe** (Merys Clean, 01.10.): `.nav > ul > li > a` (0,1,3) schlägt `.knopf` (0,1,0) – dunkle Schrift auf Grün im Handy-Blatt. Navigationsregeln mit `:not(.knopf)` schreiben.
- **Einblenden im ersten Bildschirm kostet A11y-Punkte** (Merys Clean, 01.10.): Hohe Karten mit `einblenden`, die Lighthouse halb im Bild hat, werden mit Teil-Deckkraft gemessen (Kontrast 1,3:1). Inhalte im ersten Bildschirm nicht einblenden und dort nicht lazy laden.
