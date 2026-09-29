# Scroll-Film – ein generierter Film, den der Besucher mit dem Scrollen abspielt

Stand 2026-09-29, Auftrag A-045. Quelle: Auswertung des Videos „How to Build $10K Websites in Minutes (Claude AI)“
von Metics Media (siehe `wissen/referenzen/ausgewertet/2026-09-29-video-metics-media-10k-websites.md`) und die
öffentliche Anleitung des Higgsfield-Website-Skills (`github.com/higgsfield-ai/skills`, Datei
`higgsfield-websites/references/scroll-scrub.md`), auf dem dieses Vorgehen beruht. Nichts davon ist kopiert; hier
steht, wie **wir** es bauen. Baustein dazu: A-046 (geplant, `vorlage/bausteine/scroll-film/`).

## Was der Effekt ist

Der Hero ist kein Foto und kein Schleifenvideo, sondern ein **Film ohne Schnitt** (z. B. Kaffee wird in eine Tasse
gegossen, ein Tropfen wird zum Parfümflakon). Die Scrollposition bestimmt die Filmzeit: runter spielt ihn vorwärts,
hoch rückwärts, Anhalten zeigt ein Standbild. Über dem Film liegen 3–6 kurze Kapitel als normales HTML.

Abgrenzung zu `DESIGN-WISSEN.md` („Parallax und alles, was an die Scrollgeschwindigkeit gekoppelt ist, abgelehnt“):
Der Scroll-Film hängt an der **Position**, nicht an der Geschwindigkeit, und es bewegt sich nur **eine** Ebene. Ob
er zu uns passt, entscheidet Elias (offene Entscheidung in A-045); bis dahin nur in Showcases, nie ungefragt beim
Kunden.

## 1. Der Film – daran hängt die Wirkung (der „Drehbuch-Vertrag“)

Jedes Bild wird irgendwann als Standbild gezeigt. Darum:

1. **Eine durchgehende Bewegung, kein Schnitt.** Langsame Umrundung, Heranfahren, Aufsteigen oder eine Verwandlung
   des Gegenstands. Ein Schnitt wird beim Scrollen zum Sprung.
2. **Ein Held, mittig, mit Luft drumherum.** In der Luft stehen später die Kapiteltexte. Der Film füllt das Bild
   (`object-fit: cover`) und wird am Handy seitlich beschnitten: alles Wichtige in die mittlere Zone.
3. **Dunkler, ruhiger Grund** (Studio-Schwarz, weicher Verlauf, der Gegenstand taucht aus dem Dunkel auf). Ein
   heller, unruhiger Hintergrund hinter Text ist der häufigste Grund, warum ein schöner Film unbrauchbar wird.
4. **Langsam und gleichmäßig**, nur am Anfang und Ende sanft. Das Tempo macht das Scrollen.
5. **Belichtung und Weißabgleich fest, kein Flackern, kaum Bewegungsunschärfe.**
6. **Anfang ≠ Ende:** erstes Bild = Eröffnung, letztes Bild = der schönste Zustand. Sonst fehlt die Belohnung.
7. **Keine Schrift, kein Logo, kein Wasserzeichen im Film.** Alle Schrift ist HTML.

Gut geeignet: Produkt dreht sich langsam auf Schwarz, Explosionszeichnung setzt sich zusammen, Makrofahrt über eine
Oberfläche, Verwandlung (Tropfen → Flasche, Bohne → Tasse), Gegenstand steigt aus dem Dunkel.
Schlecht: Schnitte, schnelle Schwenks, Handkamera, helle volle Hintergründe, Farbsprünge.

## 2. Ablauf mit Kosten (Higgsfield nur mit Erlaubnis, siehe Memory-Regel)

1. **Klärungsfragen zuerst.** Branche, Zielgruppe, Stimmung, *was* der Film zeigt. Metics lässt Claude die Nische
   recherchieren und Texte selbst schreiben; bei uns gilt weiter „nichts erfinden“ beim echten Kunden.
2. **Ein Storyboard-Bild** (16:9, 6 Felder = 6 Momente **einer** Bewegung, „nicht sechs Szenen“, ohne Schrift).
   Legt Farben, Licht, Objektiv fest, bevor Video-Credits fließen. Höchstens 2 Neuversuche.
3. **Ein Film, ein Aufruf** (`single-shot`): längste Einstellung des Modells (~10–15 s), 16:9, höchste Auflösung,
   ohne Ton. Storyboard als **Stil-Referenz**, nicht als Startbild (sonst steht der Film die erste Sekunde still).
   Im Prompt: Farbwerte (Hex), „no cuts, no camera shake, slow steady motion, locked exposure, no on-screen text“.
4. **Mehrere Welten** (`multi-leg`) nur, wenn die Geschichte wirklich verschiedene Orte braucht: jede Etappe startet
   mit dem **echten letzten Bild** der vorigen (per ffmpeg herausgezogen), nie mit einem neu gemalten Bild. Kostet ein
   Video je Etappe. „Sieht mit mehr Szenen cooler aus“ ist kein Grund.
5. **Handy-Fassung** ist Pflicht, kein Extra: mittige Komposition reicht meist; eigenes Hochformat nur, wenn eine
   Szene den Beschnitt nicht übersteht.

## 3. Aufbereiten mit ffmpeg (`npm i ffmpeg-static`, siehe FEHLER.md)

| Fassung | Einstellung | Warum |
|---|---|---|
| Computer | H.264, `yuv420p`, CRF ≈ 20, `-g 8 -keyint_min 8 -sc_threshold 0`, ohne Ton, `+faststart` | kurze Schlüsselbild-Abstände → schnelles Springen beim Rückwärtsscrollen |
| Handy | Höhe ≤ 720 px, CRF ≈ 23, `-g 4`, ohne Ton, `+faststart` | weniger Dekodierarbeit bei jedem Sprung |
| Poster | erstes Bild **der fertig kodierten Datei** (`-ss 0 -frames:v 1`) | jede andere Quelle ergibt einen sichtbaren Sprung (wie Lehre 1 in `3d-visuals.md`) |
| Letztes Bild | `-vf reverse -frames:v 1` | exakt das letzte dekodierte Bild für die nächste Etappe |

Leichtes Nachschärfen (`unsharp=5:5:0.8`) gleicht die Weichheit generierter Filme aus.
Kein Export von Hunderten Einzelbildern: die MP4 direkt steuern ist leichter und schärfer. (Die ältere Variante
„~100 Einzelbilder auf ein Canvas“ taugt nur für sehr kurze Filme.)

## 4. Im Browser (unser Stack: reines HTML/CSS/JS, kein React nötig)

- Hero-Abschnitt ≈ 300–500 `svh` hoch, darin eine klebende Bühne (`position: sticky; block-size: 100dvh`).
- Film per `fetch` → Blob-URL laden, dann `video.currentTime` aus dem Scrollfortschritt setzen. Blob, weil manche
  Hoster keine Byte-Range-Anfragen bedienen und Springen sonst nicht geht. CSP: `media-src 'self' blob:`.
- Sprünge **bündeln**: solange `video.seeking`, nur den neuesten Zielwert merken; ein `requestAnimationFrame`-Takt.
  Nie pro Bild Zustand in Frameworks schieben.
- **Poster bleibt**, bis `loadeddata` **und** ein erstes gesprungenes Bild da sind. Schlägt der Film fehl: Poster
  bleibt, kein Wiederholen in Schleife.
- iOS: stumm + `playsinline`, bei der ersten Berührung einmal `play()` → `pause()`, damit Springen geht. Nie
  Autoplay.
- Handy (schmale Bildschirme/grober Zeiger) lädt die Handy-Fassung. Reine Höhenänderungen durch die Adressleiste
  ignorieren.
- **Bewegung reduzieren / Daten sparen:** kein Film-Download, nur Poster + dieselben Kapitel.
- Kapiteltexte stehen im normalen HTML-Fluss (lesbar ohne JS, für Suchmaschinen sichtbar), nicht im Film.
- Aufräumen: Listener, `requestAnimationFrame` und Blob-URLs freigeben.

## 5. Prüfen (zusätzlich zu `/meisterpruefung`)

- Bildfolge beim Scrollen vorwärts **und** rückwärts; schneller Wisch darf nicht einfrieren oder nachlaufen.
- Erstes Bild beim Laden = Poster = erstes Filmbild (kein Sprung, kein schwarzer Kasten).
- 390 px: Handy-Fassung wird geladen, Held bleibt im Bild, Text lesbar (Kontrast gegen den dunkelsten **und**
  hellsten Filmmoment).
- „Bewegung reduzieren“: null Videoanfragen.
- Gewicht: der Film zählt nicht zum ersten Aufruf, braucht aber eine eigene Grenze (Vorschlag in A-045, offen).

## 6. Warum es teuer aussieht (Kurzfassung)

Ein einziges, handwerklich sauberes Bewegtbild (Produktfilm-Ästhetik) + dunkle Bühne + **ein** Akzent + wenig,
großer Text. Der Besucher „steuert“ den Film selbst – das fühlt sich an wie eine Agentur-Produktion, obwohl es
eine einzelne Videodatei ist.
