# Werbefilm „Traum“ – Prüfwerkzeuge

Zwei Werkzeuge für den Werbefilm „Traum“ (Auftrag A-124). Hintergrund: `kunden/elias-studio/werbefilm-traum/00-grundlagen.md`
§5 (Keyframe-Kette). Beide lösen nichts Bezahltes aus und ändern keine Film- oder Planungsdateien. Python ab 3.8;
`kette-pruefen.py` braucht zusätzlich numpy und ffmpeg/ffprobe.

## zeitleiste.py – die einzige Quelle für alle Zeiten prüfen

`zeitleiste.json` hält Szenen, Keyframes, Clips und Tonereignisse. Ohne Pfad gilt
`kunden/elias-studio/werbefilm-traum/zeitleiste.json`; ein anderer Film gibt seinen Pfad an.

| Befehl | Zweck |
|---|---|
| `pruefen [pfad]` | Format und Regeln. Exit 0 = in Ordnung, Exit 1 = Mängel (`MANGEL: …` auf stderr); `HINWEIS: …` warnt nur |
| `liste [pfad]` | Szenen: Zeitcode mm:ss.ff, Dauer, Bilder, Ebene, Website-Anteil, Spannung, Titel; darunter die Ebenen |
| `kurve [pfad] [--schritt 2]` | Spannung und Website-Anteil als Textbalken über die Zeit (Höchstwert je Zeile, Höhepunkt markiert) |
| `clips [pfad]` | Clips mit Modell, Modus, Dauer, Spanne im Film, Credits; Summe der Higgsfield-Sekunden und Kostenschätzung |
| `markdown [pfad]` | Szenen-Tabelle als Markdown auf stdout |

Die Anzeigen laufen auch bei Mängeln, solange der Aufbau lesbar ist. Unbekannte Zusatzfelder sind erlaubt.

**Mangel (Exit 1):** Pflichtfeld fehlt oder hat den falschen Typ · Szenen nicht lückenlos (Toleranz 0,001 s), erste
Szene nicht bei 0, Summe ≠ `dauer_s` · doppelte IDs oder JSON-Schlüssel · Verweis ins Leere (`szene.ebene`,
`keyframe.szene`, `clip.von/nach`, `zwilling_von`) · Keyframes nicht zeitlich aufsteigend oder außerhalb des Films ·
`ton.zeit_s` außerhalb 0…`dauer_s` · `kling_o3_flf` nicht ganzzahlig 3–15 s · unbekannte `art`, `quelle`, `modus` ·
`website_anteil` nicht 0–1, `spannung` nicht 0–10.

**Hinweis (Exit 0):** Website-Anteil fällt vor dem Höhepunkt (Szene mit der höchsten Spannung, bei Gleichstand die
letzte) · gemessener Faktor je Ebene bis zum Höhepunkt (Median der Schritte) weicht um mehr als ÷/× 1,25 vom Plan ab –
Szenenlänge (geplant 0,7), Website-Anteil (2,0), Atem (1,3) · Zeiten nicht bildgenau · Keyframe außerhalb seiner Szene ·
Kette unterbrochen (`nach` ≠ `von` des nächsten Clips) · Clip muss um mehr als 10 % gestreckt werden (Zeitlupe) ·
Higgsfield-Clip ohne Modell · beschreibendes Feld fehlt · Ebene ohne Szene.

**Kosten:** `kling_o3_flf` pro 1,25 · std 1,00 · 4k 6,00 Credits je Sekunde (Kostenabfrage 02.11.2026), Modus aus dem
Feld `modus`, sonst pro. Andere Modelle zeigt `clips` ohne Satz – vorher gratis mit `get_cost` abfragen. Die Schätzung
ist keine Freigabe: bezahlte Erzeugung nur mit Elias' ausdrücklicher Freigabe.

```
python3 werkzeuge/video-film/traum/zeitleiste.py pruefen
python3 werkzeuge/video-film/traum/zeitleiste.py kurve --schritt 2
python3 werkzeuge/video-film/traum/zeitleiste.py clips
```

## kette-pruefen.py – Nähte an echten Clips

| Befehl | Zweck |
|---|---|
| `naehte <clip1> <clip2> …` | letztes Bild von Clip n gegen erstes Bild von Clip n+1 (256 px): Helligkeit (Differenz Ø 0–255, SSIM), Farbe (Farbe Ø), Urteil, Bewegung. Exit 1 bei „Sprung“ |
| `letztes-bild <clip> <ziel.png>` | genaues letztes Bild in voller Auflösung → Startbild des nächsten Clips |
| `erstes-bild <clip> <ziel.png>` | genaues erstes Bild |
| `kontaktbogen <clip> <ziel.jpg> [--n 12]` | n Bilder gleichmäßig vom ersten bis zum letzten, beschriftet mit Bildnummer und Zeit |

| Urteil | Standard | Parameter |
|---|---|---|
| nahtlos | Ø ≤ 4, SSIM ≥ 0,90 und Farbe Ø ≤ 2 | `--nahtlos-diff`, `--nahtlos-ssim`, `--nahtlos-farbe` |
| Sprung | Ø > 20, SSIM < 0,60 oder Farbe Ø > 10 | `--sprung-diff`, `--sprung-ssim`, `--sprung-farbe` |
| sichtbar | dazwischen | |

**Farbe Ø** = mittlere absolute Differenz der Farbanteile Cb/Cr ohne Helligkeit (BT.709, 0–255), gemittelt je Feld von
16 × 16 px. Ein Farbstich oder Weißabgleich-Sprung zählt voll, eine gleiche Helligkeitsänderung aller Kanäle gar nicht,
Bewegung um wenige Pixel kaum – die Helligkeitsmaße und ihre Eichung bleiben unverändert.

Geeicht an Fassung v3 (4K, 60 B/s): alle 22 harten Schnitte hatten SSIM ≤ 0,41 und werden „Sprung“; von 5737 normalen
Bildschritten wird keiner „Sprung“ (größter Ø 18,2 bei SSIM 0,93, ein Lichtblitz), 88 % sind „nahtlos“. Farbe Ø der
normalen Schritte: 99 % ≤ 2, höchstens 3,4 – damit wird keiner „Sprung“ und nur 8 der 5043 sonst nahtlosen „sichtbar“.
Künstliche Farbsprünge auf elf Bildern aus v3 (Farbe Ø je nach Bild): Weißabgleich 6500 → 5000 K 0,6–6,4 · Farbton
+30° 0,2–11,9 · ganz entsättigt 0,3–19,9. Auf fast grauen Bildern bleibt ein Farbsprung klein – dort sieht man ihn kaum.

**Bewegung** (Ø vorletztes→letztes Bild von Clip n · Naht · erstes→zweites Bild von Clip n+1):

- *Stopp-und-los*: eine Seite bewegt sich mit weniger als 25 % der anderen → Prompt „continuous camera motion, no pause“,
  gleiche Richtung und Geschwindigkeit; notfalls 2–4 Bilder überlappen.
- *Bewegung stockt*: die Naht ändert weniger als 50 % der Bewegung → doppeltes Bild (Endbild = Startbild); im Schnitt
  das erste Bild von Clip n+1 weglassen.
- *Ruck*: die Naht ändert mehr als das Dreifache der Bewegung. *Ruhig*: beide Seiten unter Ø 0,15.
- *Schnitt neben der Naht*: ein Randschritt liegt über der Sprung-Schwelle (Clip falsch geschnitten).

`letztes-bild` rechnet mit voller Farbauflösung (Rundweg-Fehler Ø 0,1 statt 1,2 mit ffmpeg-Standard) und mit der
Farbmatrix aus dem Video, ohne Angabe wie Player üblich (ab HD BT.709). Vorhandene Ziele werden nur mit
`--ueberschreiben` ersetzt. Bilder, Bögen und Clips gehören nicht ins Git (PLAYBOOK §10); Arbeitskopien z. B. nach
`werkzeuge/ausgabe/` (ignoriert).

**Grenzen:** Bei fast schwarzen Bildern (Sternenhimmel) sind alle Maße schwach – Kontaktbogen ansehen. Die Naht misst
Helligkeit, Aufbau und Farbe der beiden Randbilder; Farbe Ø mittelt über Felder, ein kleines Objekt, das allein die
Farbe wechselt, fällt darin kaum ins Gewicht. Ob ein Übergang morpht statt überblendet, beurteilt der Agent `kontinuitaet`.

```
python3 werkzeuge/video-film/traum/kette-pruefen.py naehte C03.mp4 C04.mp4 C05.mp4
python3 werkzeuge/video-film/traum/kette-pruefen.py letztes-bild C04.mp4 werkzeuge/ausgabe/K05-start.png
python3 werkzeuge/video-film/traum/kette-pruefen.py kontaktbogen C04.mp4 werkzeuge/ausgabe/C04-bogen.jpg --n 16
```

## Storyboard-Seite

`storyboard.py` baut aus Zeitleiste und Dokumenten eine Arbeitsseite (HTML-Fragment ohne doctype/html/head/body, wird
später als privates Artifact veröffentlicht): Kopf mit Logline, Dauer, Bildrate, Anzahl, Credit-Schätzung (Logik aus
`zeitleiste.py`) und zuletzt notiertem Guthaben (`00-grundlagen.md`) · Spannungskurve als SVG · Ablauf je Szene in
6 Schritten · Master-Briefing · Szenen als Arbeitskarten (starten offen, damit die Seite ohne Klick vollständig lesbar
ist; „Alle schließen“ klappt sie beim Arbeiten ein) mit ChatGPT-Karte, Clips (Prompt, Kosten) und Tonereignissen,
jeweils mit Kopierknopf. IDs sind stabil und aus den Roh-IDs abgeleitet (`szene-S03`, `clip-C05`,
`kopieren-karte-S03`, `kopieren-master`); fallen zwei Roh-IDs bei der Bereinigung zusammen, bekommt die spätere `-2`.

Eingaben im Filmordner: `01-drehbuch.md` (erste Überschrift, Absatz „Logline …“), `02-chatgpt-briefing.md`
(`## Master-Briefing` und `### Karte S03`), `03-higgsfield.md` (`### Clip C05`, Einstellzeilen als Liste), `04-ton.md`
(`### Ton T07`) – je Abschnitt genau ein ` ```text `-Block; Text davor (Absätze und Listenzeilen) erscheint als
Hinweis, beim Clip stehen die Listenzeilen als Einstellungen. Tiefere Zwischenüberschriften (`#### Einstellungen`)
bleiben im Abschnitt. Fehlende Dateien oder IDs stehen auf der Seite als „noch nicht geschrieben“ und am Ende auf
stderr (Clips ohne Higgsfield und Stille brauchen keinen Prompt). Eine vorhandene, aber kaputte Datei steht als
„nicht lesbar“ mit Grund auf der Seite. Ist ein Szeneneintrag kaputt, zeigt die Seite Karten, Clips und Ton als
Ersatzliste ohne Szenenzuordnung; ein Clip, dessen Start-Keyframe auf eine unbekannte Szene zeigt, wird nach Zeit
zugeordnet. Alle Texte werden escaped; nur **fett**, *kursiv* und `code` werden umgesetzt. Ruft nichts Bezahltes auf.

```
python3 werkzeuge/video-film/traum/storyboard.py                      # → kunden/elias-studio/werbefilm-traum/storyboard.html
python3 werkzeuge/video-film/traum/storyboard.py --film <ordner> --aus <datei>
```

## Selbsttests

```
python3 -m unittest discover -s werkzeuge/video-film/traum -p 'test_*.py'
```

`test_zeitleiste.py`: gültige Beispiel-Zeitleiste und gezielt kaputte Varianten. `test_kette.py`: erzeugt kleine
Testclips mit ffmpeg in einem temporären Ordner (fortlaufend, Keyframe-Kette, Standbild, Sprung, Farbstich, leicht
entsättigt) und prüft die Urteile. `test_storyboard.py`: Parser der Blöcke, Seitenvertrag des
Fragments (kein Gerüst, Tokens auf `:root`, Kontrast der Tokens ≥ 4,5:1 in beiden Themen, keine externen Skripte,
Escape, eindeutige und stabile IDs, Umbruch langer Wörter) und Robustheit (kaputte Szene, falscher Szenenverweis,
kein gültiges JSON, Diagramm im viewBox); `beispiel_film()` legt einen Beispiel-Film an. Sichtprüfung zusätzlich im
Browser bei 400 px: `scrollWidth` des body = Fensterbreite.
