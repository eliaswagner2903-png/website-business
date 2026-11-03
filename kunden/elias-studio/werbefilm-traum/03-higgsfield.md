# Werbefilm „Traum“ – Produktionsblatt Higgsfield (Originale, Auftrag A-124)

Stand 03.11.2026, Kommandeur Stahl. Nur Planung, löst nichts aus. Zeiten und IDs aus `zeitleiste.json` (`zeitleiste.py liste` /
`clips`); Hintergründe im Drehbuch (§3, §4.0, §5, §9). Kosten sind Schätzungen (Kostenabfrage 02.11.2026) – **keine Freigabe**.

## 1. Methode: Keyframe-Kette

- **Keyframes zuerst, Clips danach.** Jeder Clip läuft von Keyframe n (Startbild) zu n+1 (Endbild); beauftragt wird er erst, wenn
  beide Keyframes bei `kontinuitaet` „passt“ haben.
- **Woher ein Keyframe kommt (billigster tragfähiger Weg zuerst):** (1) **ChatGPT-Skizze direkt** (0 Credits), wenn sie fotoreal,
  16:9, ohne Pseudo-Schrift ist und abgenommen wird → hochladen (§3); (2) **in Higgsfield mit `gpt_image_2_5` verfeinern**
  (0,25 Credits je Bild, Vorlage §6); (3) **Bearbeitung eines anderen Keyframes** (0,25) – Pflicht für jeden Zwilling B
  (`zwilling_von`) und für K06b, K11, K16, K18, K19.
- **Startbild = echtes letztes Bild des Vorgängers**, sobald der abgenommen ist (`kette-pruefen.py letztes-bild`), sonst das
  Keyframe-Original. **Endbild = immer das Keyframe-Original** – so passt auch ein später erzeugter Vorgänger genau.
- **Nie zwei deckungsgleiche Bilder** als Start und Ende einer Kamerafahrt: verschiedene Ausschnitte aus einem größeren Bild.
- **Zielflächen leer** (Brett S02, Wand S03, Teller S04, Schild und Ringstirn S05/S06, Visier K16): *surface blank, camera slow*.
  Lesbarer Text kommt nur aus echten Seitenaufnahmen.
- **Negativliste vollständig in jedem Prompt** (Drehbuch §3). **Astronaut oder Anzugteil von außen im Bild → Anzug-Textbaustein
  wörtlich.** Zwei bewusste Ausnahmen, weil der Baustein sonst einen Astronauten ins Bild holt: C11 (kein Anzug im Bild, kein
  Baustein) und C18/K18/K19 (Innensicht, nur Helm-Kurzfassung *rounded helmet, clear curved inner glass with a thin gold sheen
  on the rim, thin brushed-brass neck ring as its lower edge; no wearer, no backpack, no boots*; „opaque“ entfällt, weil man von
  innen hindurchsieht). Referenzbild jedes Astronauten-Keyframes ist der Referenzbogen aus Tor 1.

## 2. Reihenfolge der Erzeugung (Drehbuch §9.5)

Jedes Tor ist eine eigene ausdrückliche Freigabe durch Elias; innerhalb eines Tores einzeln, in Filmreihenfolge, ein Nachfolger
erst nach Abnahme seines Vorgängers.

| Tor | Was | Credits (Schätzung) | Halt-Regel |
|---|---|---|---|
| 0 | Gratis: Animatik, Seitenaufnahmen (§9), Haken-Test, **Download-Probe** (§3), `get_cost`, Hochrechnen-Test 9:16 | 0 | Download nicht sicher → keine Erzeugung |
| 1 | Anzug-Referenzbogen: 4 Ansichten, Visier, Handschuh | 1,50 | Anzug nicht wie Bibel → Bogen neu |
| 2 | Alle Keyframes inkl. Zwillinge, K06b, „Fall“; **K10 zuerst** in seiner Szene; Überlagerung je Zwillingspaar | ≈ 8,00 | nicht deckungsgleich → Bearbeitung neu |
| 3 | **Bezahlte Probe als Tor:** C02 (Anzug-Test) → N1: C03, C04 → N2/N3: C06a, C06b → N4 + Kopfhörer: C08–C11 | 43,75 | „Sprung“ oder Überblendung → **Halt**, erst Zwischenbild oder Rückfall |
| 4 | Paket A: C01, C05, C07 · Paket B: C18 | 17,50 + 3,75 | wie Tor 3; C05 vor C07, Nähte C04\|C05\|C06a messen, bevor C07 läuft |

N1 (C03|C04) und N4 (C08|C09) sind in Tor 3 vollständig messbar, **N2 (C05|C06a) und N3 (C06b|C07) erst nach Tor 4**. Bildgleich
sind diese Grenzen durch das Verfahren (§1); offen bleibt die Bewegung (Stopp-und-los, Ruck). Befund dort: zuerst den Tor-4-Clip
mit P2 anpassen; Nachdreh von C06a/C06b nur, wenn das nicht reicht (Reserve, neue Freigabe).

## 3. Arbeitsgang je Auftrag

1. **Download-Falle zuerst** (`wissen/FEHLER.md`, A-036): `d8j0ntlcm91z4.cloudfront.net` gab am Proxy 403. Gratis ein
   **vorhandenes** Ergebnis (`show_generations`) herunterladen; scheitert es, Domain in die Netzfreigabe (wirkt erst in einer
   **neuen** Sitzung). Erzeugt wird erst, wenn der Download sicher ist.
2. **Hochladen:** Higgsfield-Keyframes per Job-ID (als `value`); lokale Dateien (Skizze, letztes Bild) per `media_upload` →
   `curl` PUT → `media_confirm`; `media_id` ins Protokoll (§11).
3. **Kostenabfrage gratis:** `balance`, dann **derselbe** Aufruf mit `params.get_cost: true`. Abweichung → erst Sparhebel (§10),
   dann Elias fragen.
4. **Freigabe durch Elias** (Vorlage unten). Der Hook `werkzeuge/kosten-waechter.py` ersetzt sein OK nie. Anderes Modell,
   Prompt, Dauer oder Anzahl = neue Frage.
5. **Genau einmal senden.** Fehler oder Zeitüberschreitung: `jobs_wait` / `show_generations` – **nie doppelt senden**.
6. **Herunterladen, messen:** Original unverändert sichern, `ffprobe` (Auflösung, B/s, Dauer, Bildzahl) ins Protokoll.

**Benennung** (nichts überschreiben, nichts löschen – Regel 8; große Medien nie ins Git): Skizze `K05-v1` (WebP) · Higgsfield-Bild
`K05-hf-v1` (WebP, Job-ID ist die Referenz) · Clip `C05-v1.mp4` (wie geliefert) · `C05-v1-letztes.png` (zum Hochladen, danach
verlustfreies WebP) · `C05-v1-bogen.jpg` · `C05-v1-60.mp4`. Prompt-Fassungen P1, P2 … Arbeitskopien unter
`werkzeuge/ausgabe/traum/` (von Git ignoriert); den Ablageort der Originale nennt Elias.

### Vorlage Freigabe-Frage

```text
Chef, Freigabe erbeten: Clip <ID> (<Szene>, <Keyframe> → <Keyframe>), kling_o3_flf pro, <Dauer> s, Ton aus, 16:9 – Prompt <Fassung P1/P2 …>, <n> Zeichen, Wortlaut in 03-higgsfield.md „Clip <ID>“ (bei P2 und jeder weiteren Fassung ist eine neue Frage fällig) – <x> Credits laut Kostenabfrage, Guthaben <y>, danach <y−x>. Wofür: <ein Satz>. Startbild: <letztes Bild von … / Keyframe-Original>, Endbild: <Keyframe>. Freigeben?
```

### Vorlage Freigabe-Frage Bilder

```text
Chef, Freigabe erbeten: Tor <n>, <Anzahl> Bilder gpt_image_2_5 (<welche Keyframes / Ansichten>), höchstens <Versuche> Versuche je Bild – <x> Credits laut Kostenabfrage, Guthaben <y>, danach <y−x>. Wofür: <ein Satz>. Mehr Versuche als freigegeben = neue Frage. Freigeben?
```

## 4. Prüfung nach jedem Clip und Nachdreh-Regeln

1. **Nähte:** `python3 werkzeuge/video-film/traum/kette-pruefen.py naehte <Vorgänger> <Clip> <Nachfolger>` (Filmreihenfolge,
   soweit vorhanden). „Sprung“ = Exit 1; „Stopp-und-los“ oder „Ruck“ ist ebenfalls ein Befund. „Bewegung stockt – doppeltes
   Bild“ ist erwartbar (Startbild = letztes Bild des Vorgängers): im Schnitt das erste Bild von Clip n+1 weglassen, kein Nachdreh.
2. **Kontaktbogen** (`kette-pruefen.py kontaktbogen C05-v1.mp4 C05-v1-bogen.jpg --n 12`), dann `kontinuitaet`: Morph statt
   Überblendung, Anzug, Pseudo-Schrift, leere Zielflächen, 9:16-Mitte.
3. **Abgenommen:** `kette-pruefen.py letztes-bild C05-v1.mp4 C05-v1-letztes.png` → Startbild des nächsten Clips (an einer
   Weltgrenze prüft `kontinuitaet` es zuerst gegen den Zwilling).
4. **Nicht abgenommen, in dieser Reihenfolge:** P2 schärfen (*continuous camera motion, no pause*, Richtung und Tempo wie der
   Nachbar) → Zwischenbild halb/halb (0,25) und Clip teilen, **zuerst** `zeitleiste.json` ändern und `zeitleiste.py pruefen` →
   Rückfall gratis in Remotion (2,5D-Ebenen, 2–4 Bilder überlappen).
5. **Jeder Nachdreh ist eine neue Freigabe**, bezahlt aus der Reserve; höchstens einer je Clip, dann Rückfall prüfen. Vorrang:
   C03/C04, C06a/C06b, C08–C11. Ein Nachdreh ändert das letzte Bild: Naht zum Nachfolger neu messen, erst bei „Sprung“ handeln.

## 5. 9:16, Hochrechnen, Bildrate

- **16:9** für alle Keyframes und Clips; nie einzeln `reframe` auf 9:16 (Ränder passen an den Nähten nicht). **Kompositionsregel:** Handlung, Zwillingsform und Erde im **mittleren Drittel**.
- **Hochrechnen 9:16 (lokal, gratis):** Mittelausschnitt 608 × 1080 → 1080 × 1920 (Faktor 1,78):
  `ffmpeg -i C04-v1.mp4 -vf "crop=608:1080:656:0,scale=1080:1920:flags=lanczos,unsharp=5:5:0.5" C04-v1-9x16.mp4` (setzt 1080p
  voraus). Auf dem Handy prüfen: Anzugkanten, Visier, Seitenschrift, Flimmern. Probe in Tor 0 mit vorhandenem Material, endgültig
  an C04; fällt die Schärfe durch, gilt „eigene Brücken“ (§10).
- **Hochrechnen 16:9:** Lieferauflösung am ersten Clip messen; unter 1920 × 1080 lokal hochrechnen. `topaz_video` nur mit Elias' OK – Kosten vorab nicht abfragbar.
- **Bildrate:** Master 60 B/s; Kling vermutlich 24 B/s (messen). Lokal umrechnen: ffmpeg
  `minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`, zweiter Versuch RIFE; `fps_boost` nur nach `get_cost`
  und OK. Elias sieht C04 in Tor 3 in 60 und 24 B/s nebeneinander und entscheidet für den ganzen Film (Entscheidung 4).

## 6. Keyframes: Weg je Bild (Tor 1–2)

| KF | Weg | Referenz | leer lassen / Achtung |
|---|---|---|---|
| Bogen | 6 × `gpt_image_2_5` | Tonwerte v3 `v3_51.0s.jpg`, `v3_48.2s.jpg` | Prüfliste Anzug (Drehbuch §3) |
| K01 | Skizze direkt oder Verfeinerung | Bogen (Helmrand, Visier) | Himmel um die Erde rein schwarz (Remotion setzt die pendelnde Erde ein) |
| K02 | Zwilling B von K01 | K01, Bogen | Erde an derselben Bildstelle |
| K03 | Verfeinerung | Bogen, Tonwert `v3_51.0s` | Brustkorb mitten im Einatmen |
| K04 | Verfeinerung | Teilreferenz K03 (Erde) | Kugel und Leitung in der Bildmitte |
| K05 | Zwilling B von K03 | K03, Bogen | Pose, Lage, Licht von rechts oben bleiben |
| K06 | Verfeinerung | Bogen (Handschuh, Stiefel) | Schnur genau senkrecht in der Mitte |
| K06b | Bearbeitung von K05 (Pose, Anzug), Raum neu | K05, Bogen | **ohne Linie**, Wand leer (Lot-Licht setzt Remotion); fast aufrecht, Schultern leicht gebeugt |
| K07 | Verfeinerung | – | Licht links, Schatten rechts |
| K08 | Verfeinerung | Bogen | Teller schlicht weiß (Fokusrahmen) |
| K10 | **Meisterbild, zuerst** in S05/S06 | Produktbild der Hörwerk-Aufnahme | Schild und Ringstirn leer |
| K09 | Bearbeitung eines Ausschnitts von K10 | K10 | nur die Ellipse im Fast-Schwarz |
| K11 | Bearbeitung von K10 | K10 | Differenzbild K10/K11; Ring und Gehäuse hohl, innen leer und matt |
| K12 | Bearbeitung eines Ausschnitts von K11 | K11 | konzentrische Ringe, keine Schrift |
| K16 | Bearbeitung von K02 | K02 | Spiegelfläche gleichmäßig neutral grau, Maske mit erzeugen |
| K18 | Bearbeitung von K01 | K01 | durch das Glas Schwarz, winziger Lichtpunkt in der Mitte; Helm-Kurzfassung (§1) |
| K19 | Bearbeitung von K18 | K18 | ∩-Form im oberen Drittel; Vorlage für Elias' Dreh; Helm-Kurzfassung (§1) |
| Fall | neu | Bogen | gleichmäßig grauer Grund (Maske lokal); `remove_background` nur nach Kostenabfrage |

Gratis: K13 (Ausschnitt von K05), K13b–K15, K21 (Aufnahmen), K17, K22–K24 (Remotion), K20 (Elias).

### Vorlage Verfeinerung (gpt_image_2_5)

```text
Refine the attached sketch into a photorealistic cinematic film still, 16:9. Keep the composition, the position and size of every main shape, the camera height and the light direction exactly as in the sketch. World and mood: <WORLD>. Keep the main action, the twin shape and the Earth inside the central third of the frame. These surfaces stay completely blank and plain: <SURFACES>. Natural light falloff, subtle film grain, shallow depth of field, quiet dreamlike stillness. <SUIT TEXT BLOCK, if the astronaut or any part of the suit is visible>. Avoid: no text, no letters, no logos, no patches, no flags, no name tag, no numbers, no visible face, no eyes, no glow rings, no hologram, no lander, no green code rain.
```

### Vorlage Zwilling B (Bearbeitung)

```text
Use the attached image as the exact reference. Keep the exact composition, shapes, camera height and light direction; change only the material and the world to <NEW WORLD>. Every main shape stays at the same place and size in the frame. Photorealistic, cinematic, subtle film grain, 16:9. <SUIT TEXT BLOCK, if visible>. Avoid: no text, no letters, no logos, no patches, no flags, no name tag, no numbers, no visible face, no eyes, no glow rings, no hologram, no lander, no green code rain.
```

## 7. Clips bei Higgsfield (13 Clips, 52 s)

Für alle: `kling_o3_flf`, pro, **sound off** (Ton macht ElevenLabs), 16:9, 1,25 Credits/s. Prompt-Längengrenze vorher gratis
prüfen (`models_explore`). Tempo-Angleich (≤ ±6 % an der Naht) macht Remotion, nicht der Prompt.

### Clip C01

Haken, Naht N0 im Clip. Die pendelnde Erde und die Raste (Absacken, Nachfedern über Bild 1–2) setzt Remotion ein; der Prompt
enthält beides bewusst nicht. Prompt, K01 und K02 gelten nur für die Hauptvariante „Beschlag mit Raste“: nach dem Haken-Test
(Tor 0) prüfen, bei Alternative 1 oder 2 (Drehbuch §6) neu schreiben.

- Von → nach: K01 → K02 (im Film 0,00–5,00 s, Tempo 1,00×)
- Dauer: 5 s
- Modell: `kling_o3_flf`, Modus pro, sound off
- Seitenverhältnis: 16:9
- Kosten: 5 s × 1,25 = 6,25 Credits
- Startbild: K01-Original · Endbild: K02-Original · Tor 4 (Paket A)

```text
One continuous shot, continuous camera motion, no pause, no cut, no cross-fade. Start: the view from inside a space helmet through the curved glass – a small, sharp Earth hangs above the grey lunar horizon in a pure black sky, the soft helmet rim at the edges, a thin gold sheen on the curve. The wearer's breath fogs the glass from the bottom up and briefly swallows the Earth, then the fog retreats from the edges. The camera drifts forward and passes through the glass: the clear curve thickens into mirrored gold, and the view through the glass physically becomes the reflection in the gold sun visor seen from outside. The Earth stays at exactly the same spot in the frame the whole time and does not move; the black sky around it stays clean. In the second half the camera eases into a slow pull-back from the visor and is still moving backward at the end. Harsh sunlight from the right. Lone astronaut in a modern, slightly retro EVA spacesuit, warm off-white woven fabric, matte, soft folds; rounded helmet with an opaque mirrored gold sun visor, face never visible; thin brushed-brass neck ring; boxy off-white life-support backpack with one small round gauge without numbers; off-white gloves with dark grey rubber fingertips; grey-white boots with evenly ribbed soles; fine grey moon dust on knees and boots; calm, careful, dignified body language. Style: photorealistic, cinematic, natural light, subtle film grain, shallow depth of field, quiet dreamlike stillness. Avoid: no text, no letters, no logos, no patches, no flags, no name tag, no numbers, no visible face, no eyes, no glow rings, no hologram, no lander, no green code rain.
```

**Wenn es schiefgeht**
- Glas blendet über statt zu Gold zu werden: Zwischenbild „Durchblick mit Goldschimmer“ (0,25), Clip teilen.
- Erde wandert: unkritisch, solange der Himmel ringsum schwarz bleibt (Remotion ersetzt sie).
- Reserve knapp: Sparhebel std (−1,25).

### Clip C02

Anzug-Test, erster bezahlter Clip: hält der Anzug, gilt der Bogen.

- Von → nach: K02 → K03 (im Film 5,00–10,00 s, Tempo 1,00×)
- Dauer: 5 s
- Modell: `kling_o3_flf`, Modus pro, sound off
- Seitenverhältnis: 16:9
- Kosten: 5 s × 1,25 = 6,25 Credits
- Startbild: K02-Original · Endbild: K03-Original · Tor 3 (zuerst)

```text
One continuous shot, continuous camera motion, no pause, no cut, no cross-fade. Start: close on the mirrored gold sun visor, the small Earth reflected in it. The camera pulls back with a slight rise at a steady speed: helmet, shoulder, then the whole figure. The astronaut sits in profile on a grey moon rock, forearms resting on his knees, head slightly lowered as if listening. Two calm, clearly visible breaths: shoulders and backpack rise gently and a fine wisp of vapour escapes from a valve on the backpack; on the second breath the chest lifts and a little dust slips from the knee. Black sky, the small sharp Earth upper right, harsh sun from the right, an empty grey dust plain without tracks. At the end the camera is still rising slowly. The suit stays identical in every frame. Lone astronaut in a modern, slightly retro EVA spacesuit, warm off-white woven fabric, matte, soft folds; rounded helmet with an opaque mirrored gold sun visor, face never visible; thin brushed-brass neck ring; boxy off-white life-support backpack with one small round gauge without numbers; off-white gloves with dark grey rubber fingertips; grey-white boots with evenly ribbed soles; fine grey moon dust on knees and boots; calm, careful, dignified body language. Style: photorealistic, cinematic, natural light, subtle film grain, shallow depth of field, quiet dreamlike stillness. Avoid: no text, no letters, no logos, no patches, no flags, no name tag, no numbers, no visible face, no eyes, no glow rings, no hologram, no lander, no green code rain.
```

**Wenn es schiefgeht**
- Anzug driftet (Visier durchsichtig, Abzeichen, Ziffern): **Halt vor C03**, Bogen und Textbaustein prüfen.
- Kamera steht am Ende: P2 „still rising at the end“ nach vorn; sonst 2–4 Bilder Überlappung.
- Atem nicht sichtbar: P2 einmal, danach trägt der Ton den Atem.

### Clip C03

Naht N1, Teil 1: die Erde wird zur Kugel an der Leitung.

- Von → nach: K03 → K04 (im Film 10,00–15,00 s, Tempo 1,00×)
- Dauer: 5 s
- Modell: `kling_o3_flf`, Modus pro, sound off
- Seitenverhältnis: 16:9
- Kosten: 5 s × 1,25 = 6,25 Credits
- Startbild: letztes Bild von C02 · Endbild: K04-Original · Tor 3

```text
One continuous shot, continuous camera motion, no pause, no cut, no cross-fade. Start: the astronaut sits in profile on a grey moon rock under a black sky, the small Earth upper right. He slowly raises his head towards the Earth; the camera follows his gaze, rising and tilting upward at an even pace until the Earth sits in the centre of the frame. On the way the Earth physically transforms: a thin black cable becomes visible, running from its top out of the upper edge of the frame – it hangs from it. Its blue grows warmer, the clouds turn into a milky pattern inside frosted glass, and the stars around it drift like dust motes in a beam of light. It becomes a glowing blue-white glass sphere on a thin cable, still recognisable as the Earth. At the end the camera is still moving towards it. Lone astronaut in a modern, slightly retro EVA spacesuit, warm off-white woven fabric, matte, soft folds; rounded helmet with an opaque mirrored gold sun visor, face never visible; thin brushed-brass neck ring; boxy off-white life-support backpack with one small round gauge without numbers; off-white gloves with dark grey rubber fingertips; grey-white boots with evenly ribbed soles; fine grey moon dust on knees and boots; calm, careful, dignified body language. Style: photorealistic, cinematic, natural light, subtle film grain, shallow depth of field, quiet dreamlike stillness. Avoid: no text, no letters, no logos, no patches, no flags, no name tag, no numbers, no visible face, no eyes, no glow rings, no hologram, no lander, no green code rain.
```

**Wenn es schiefgeht**
- Erde blendet in die Kugel über: Zwischenbild „Erde mit Leitung, noch blau“ (0,25), Clip teilen.
- Neigung stockt am Ende: P2; sonst 2–4 Bilder Überlappung.

### Clip C04

Naht N1, Teil 2: Mond wird Werkstatt. An diesem Clip fällt die Bildrate (§5).

- Von → nach: K04 → K05 (im Film 15,00–20,00 s, Tempo 1,00×)
- Dauer: 5 s
- Modell: `kling_o3_flf`, Modus pro, sound off
- Seitenverhältnis: 16:9
- Kosten: 5 s × 1,25 = 6,25 Credits
- Startbild: letztes Bild von C03 · Endbild: K05-Original · Tor 3

```text
One continuous shot, continuous camera motion, no pause, no cut, no cross-fade. Start: a glowing blue-white glass sphere on a thin black cable in darkness, dust motes drifting in its light. The camera keeps approaching at the same speed: the sphere becomes the frosted glass globe of a pendant lamp in a carpentry workshop at night. The camera glides beneath the lamp and, in the middle of the shot, tilts down. Below, the moon physically turns into the workshop: the moon rock becomes a block of oak, the grey moon dust becomes wood shavings on the floor, the lunar horizon becomes the edge of a workbench, the stars become sawdust floating in the lamp's light cone. The astronaut sits on the oak block exactly where the rock was, in the same pose, light from the upper right. Night blue in the shadows, warm milky lamp light, oak boards, bench dogs, a brass plumb bob on a string. At the end the camera moves slowly on at eye level. Lone astronaut in a modern, slightly retro EVA spacesuit, warm off-white woven fabric, matte, soft folds; rounded helmet with an opaque mirrored gold sun visor, face never visible; thin brushed-brass neck ring; boxy off-white life-support backpack with one small round gauge without numbers; off-white gloves with dark grey rubber fingertips; grey-white boots with evenly ribbed soles; fine grey moon dust on knees and boots; calm, careful, dignified body language. Style: photorealistic, cinematic, natural light, subtle film grain, shallow depth of field, quiet dreamlike stillness. Avoid: no text, no letters, no logos, no patches, no flags, no name tag, no numbers, no visible face, no eyes, no glow rings, no hologram, no lander, no green code rain.
```

**Wenn es schiefgeht**
- Werkstatt blendet über: Zwischenbild halb/halb (Felsen schon Eiche, Himmel noch schwarz).
- Pose weicht ab: Überlagerung K03/K05 vorher von `kontinuitaet` prüfen lassen.
- Schlieren bei 60 B/s: RIFE; sonst 24 B/s (Entscheidung 4).

### Clip C05

Werkstatt; trägt die Spur „18 cm“ (Brett leer).

- Von → nach: K05 → K06 (im Film 20,00–26,25 s, Tempo 0,96×)
- Dauer: 6 s
- Modell: `kling_o3_flf`, Modus pro, sound off
- Seitenverhältnis: 16:9
- Kosten: 6 s × 1,25 = 7,50 Credits
- Startbild: letztes Bild von C04 · Endbild: K06-Original · Tor 4 (Paket A)

```text
One continuous shot, continuous camera motion, no pause, no cut, no cross-fade. Start: a carpentry workshop at night, the astronaut sits on an oak block under a frosted glass pendant lamp. The camera moves along slowly at eye level. He stands up slowly, as if he weighed less, and strokes an oak board with his fingertips; his glove leaves a fine grey line of moon dust; the wood shavings on the floor fly backwards into the board, which becomes perfectly smooth. In the background a finished oak piece waits for pickup with a blank paper tag, nothing written on it. Beside his hand the board surface stays blank and plain while the camera almost stops (surface blank, camera slow). A brass plumb bob on a string sways although nothing moves; he holds his palm beneath it and it comes to rest just above his palm. The camera tilts down along the string at an even speed; behind the string the oak lightens from below into clean white. The tilt is still moving at the end. Sawdust hangs in the light cone and does not fall. Night blue shadows, warm lamp light. Lone astronaut in a modern, slightly retro EVA spacesuit, warm off-white woven fabric, matte, soft folds; rounded helmet with an opaque mirrored gold sun visor, face never visible; thin brushed-brass neck ring; boxy off-white life-support backpack with one small round gauge without numbers; off-white gloves with dark grey rubber fingertips; grey-white boots with evenly ribbed soles; fine grey moon dust on knees and boots; calm, careful, dignified body language. Style: photorealistic, cinematic, natural light, subtle film grain, shallow depth of field, quiet dreamlike stillness. Avoid: no text, no letters, no logos, no patches, no flags, no name tag, no numbers, no visible face, no eyes, no glow rings, no hologram, no lander, no green code rain.
```

**Wenn es schiefgeht**
- Späne fliegen nicht zurück: kein Vorrang in der Reserve – Nachdreh nur, wenn sie es trägt; sonst entscheidet Elias.
- Pseudo-Schrift auf dem Brett: Nachdreh oder „18 cm“ an eine ruhige leere Stelle setzen.
- Reserve knapp: Sparhebel std (−1,50).

### Clip C06a

Naht N2. Umkehr der Kamera in der Clipmitte, nie auf dem Keyframe. Linie und Messpunkte sind Website-Spur (echte
Zeichen-Animation `lot-zeichnen`), Remotion setzt sie per Tracking ein (Drehbuch S03, §9.1): im KI-Clip vergeht die Schnur, die
Wand bleibt leer. „Linie senkrecht durch ihn“ (K06b in `zeitleiste.json`) beschreibt das fertige Filmbild, nicht das Keyframe.

- Von → nach: K06 → K06b (im Film 26,25–30,50 s, Tempo 0,94×)
- Dauer: 4 s
- Modell: `kling_o3_flf`, Modus pro, sound off
- Seitenverhältnis: 16:9
- Kosten: 4 s × 1,25 = 5,00 Credits
- Startbild: K06-Original · Endbild: K06b-Original · Tor 3

```text
One continuous shot, continuous camera motion, no pause, no cut, no cross-fade. Start: a brass plumb bob on a string in the centre of the frame, a gloved palm just below it, dark oak above, bright white below, a boot tip at the lower edge. The downward tilt continues at the same speed and arrives: the bob touches down next to the boot tip. In the middle of the shot the camera reverses smoothly into a pull-back with a gentle rise. Meanwhile the workshop physically transforms into a bright, quiet physiotherapy room in the morning: the dark oak becomes white walls, the white below becomes light wooden floorboards, the string thins to a faint hairline and fades into the blank white wall. The astronaut now stands in the room, full figure, almost upright, shoulders very slightly bowed, head a little lowered; a treatment couch with a paper roll, wall bars, soft window light from the left. Towards the end the camera slows almost to a standstill but is still moving. The wall behind him stays blank (surface blank, camera slow). Lone astronaut in a modern, slightly retro EVA spacesuit, warm off-white woven fabric, matte, soft folds; rounded helmet with an opaque mirrored gold sun visor, face never visible; thin brushed-brass neck ring; boxy off-white life-support backpack with one small round gauge without numbers; off-white gloves with dark grey rubber fingertips; grey-white boots with evenly ribbed soles; fine grey moon dust on knees and boots; calm, careful, dignified body language. Style: photorealistic, cinematic, natural light, subtle film grain, shallow depth of field, quiet dreamlike stillness. Avoid: no text, no letters, no logos, no patches, no flags, no name tag, no numbers, no visible face, no eyes, no glow rings, no hologram, no lander, no green code rain.
```

**Wenn es schiefgeht**
- Raum blendet über: weiteres Zwischenbild (Eiche oben schon Wand, unten Dielen), 0,25.
- Kamera steht auf K06b still: P2 „still drifting at the end“ (sonst Stopp-und-los zu C06b).

### Clip C06b

Praxis → Naht N3. Gleiten nach rechts (Vorgabe dieses Blatts, passt zur Kreisfahrt nach rechts in K08). Ausgangshaltung „fast
aufrecht“ (K06b), „ganz gerade“ ist das Ereignis; die senkrechte Linie setzt Remotion (wie C06a).

- Von → nach: K06b → K07 (im Film 30,50–34,68 s, Tempo 0,96×)
- Dauer: 4 s
- Modell: `kling_o3_flf`, Modus pro, sound off
- Seitenverhältnis: 16:9
- Kosten: 4 s × 1,25 = 5,00 Credits
- Startbild: letztes Bild von C06a · Endbild: K07-Original · Tor 3

```text
One continuous shot, continuous camera motion, no pause, no cut, no cross-fade. Start: a bright, quiet physiotherapy room in the morning, the astronaut stands almost upright, shoulders very slightly bowed, head a little lowered, soft window light from the left. The camera drifts almost still, then begins a slow sideways glide to the right. His shadow on the blank white wall straightens up first, while he is still slightly bowed; then he follows, lifts his head and shoulders and stands perfectly straight, and walks calmly towards the window. The camera sinks close to the floor and glides sideways to the right at a steady speed; light wooden floorboards fill the frame obliquely from above, light from the left, his shadow lying to the right. Towards the end the light wood takes on a slightly deeper tone. Still gliding at the end. Lone astronaut in a modern, slightly retro EVA spacesuit, warm off-white woven fabric, matte, soft folds; rounded helmet with an opaque mirrored gold sun visor, face never visible; thin brushed-brass neck ring; boxy off-white life-support backpack with one small round gauge without numbers; off-white gloves with dark grey rubber fingertips; grey-white boots with evenly ribbed soles; fine grey moon dust on knees and boots; calm, careful, dignified body language. Style: photorealistic, cinematic, natural light, subtle film grain, shallow depth of field, quiet dreamlike stillness. Avoid: no text, no letters, no logos, no patches, no flags, no name tag, no numbers, no visible face, no eyes, no glow rings, no hologram, no lander, no green code rain.
```

**Wenn es schiefgeht**
- Schatten richtet sich nicht zuerst auf: P2 einmal, sonst entfällt das Ereignis.
- Gleitrichtung kippt: Richtung in P2 nach vorn; C07 gleitet gleich.

### Clip C07

Naht N3; Teller leer (Fokusrahmen).

- Von → nach: K07 → K08 (im Film 34,68–37,85 s, Tempo 0,95×)
- Dauer: 3 s
- Modell: `kling_o3_flf`, Modus pro, sound off
- Seitenverhältnis: 16:9
- Kosten: 3 s × 1,25 = 3,75 Credits
- Startbild: letztes Bild von C06b · Endbild: K08-Original · Tor 4 (Paket A)

```text
One continuous shot, continuous camera motion, no pause, no cut, no cross-fade. Start: floorboards seen obliquely from above, light from the left, a shadow to the right, the camera gliding sideways to the right. The glide continues while the floor physically changes: the light boards darken into the dark wood of a grill restaurant after closing time, and the morning light becomes the warm glow of embers, still coming from the left. The camera rises into an oblique view: a round table, plain white plates in a circle, a tea glass; the astronaut sits at the table. He lifts the tea glass to his helmet – it touches the gold visor; he cannot drink and holds it there, dignified. The camera begins a slow orbit to the right around the table and is orbiting at the end. Chairs upturned on the other tables, olive branches, embers glowing in an open grill. The plates stay blank (surface blank, camera slow). Lone astronaut in a modern, slightly retro EVA spacesuit, warm off-white woven fabric, matte, soft folds; rounded helmet with an opaque mirrored gold sun visor, face never visible; thin brushed-brass neck ring; boxy off-white life-support backpack with one small round gauge without numbers; off-white gloves with dark grey rubber fingertips; grey-white boots with evenly ribbed soles; fine grey moon dust on knees and boots; calm, careful, dignified body language. Style: photorealistic, cinematic, warm low light, subtle film grain, shallow depth of field, quiet dreamlike stillness. Avoid: no text, no letters, no logos, no patches, no flags, no name tag, no numbers, no visible face, no eyes, no glow rings, no hologram, no lander, no green code rain.
```

**Wenn es schiefgeht**
- 3 s zu knapp: das Glas am Visier zählt; P2 kürzt die Raumbeschreibung.
- Speisekarte oder Schrift im Bild: Nachdreh.

### Clip C08

Naht N4, Teil 1.

- Von → nach: K08 → K09 (im Film 37,85–41,02 s, Tempo 0,95×)
- Dauer: 3 s
- Modell: `kling_o3_flf`, Modus pro, sound off
- Seitenverhältnis: 16:9
- Kosten: 3 s × 1,25 = 3,75 Credits
- Startbild: K08-Original · Endbild: K09-Original · Tor 3

```text
One continuous shot, continuous camera motion, no pause, no cut, no cross-fade. Start: a round table in a dark grill restaurant, plain white plates in a circle, the astronaut holds a tea glass at his gold visor, embers glowing back left, the camera orbiting to the right. The orbit continues without pause and speeds up at plate height. Soft steam rises from a dish. The plates lift off the table and circle around him like moons; the camera joins their orbit. A plate in the foreground tilts onto its edge and its rim catches the light as a thin golden ellipse; the embers in the background shrink into distant points of light like stars, and the room sinks into near-black. End: a thin golden ellipse in near-black, still orbiting. Lone astronaut in a modern, slightly retro EVA spacesuit, warm off-white woven fabric, matte, soft folds; rounded helmet with an opaque mirrored gold sun visor, face never visible; thin brushed-brass neck ring; boxy off-white life-support backpack with one small round gauge without numbers; off-white gloves with dark grey rubber fingertips; grey-white boots with evenly ribbed soles; fine grey moon dust on knees and boots; calm, careful, dignified body language. Style: photorealistic, cinematic, warm low light, subtle film grain, shallow depth of field, quiet dreamlike stillness. Avoid: no text, no letters, no logos, no patches, no flags, no name tag, no numbers, no visible face, no eyes, no glow rings, no hologram, no lander, no green code rain.
```

**Wenn es schiefgeht**
- Teller verschmelzen oder vermehren sich: P2 „the same plates as at the start, they stay solid“.
- Ellipse entsteht per Überblendung: Zwischenbild „Teller auf der Kante im Dunkel“ (0,25).

### Clip C09

Naht N4, Teil 2. Schild leer („Aufbau ansehen“ setzt Remotion).

- Von → nach: K09 → K10 (im Film 41,02–44,02 s, Tempo 1,00×)
- Dauer: 3 s
- Modell: `kling_o3_flf`, Modus pro, sound off
- Seitenverhältnis: 16:9
- Kosten: 3 s × 1,25 = 3,75 Credits
- Startbild: letztes Bild von C08 · Endbild: K10-Original (Meisterbild) · Tor 3

```text
One continuous shot, continuous camera motion, no pause, no cut, no cross-fade. Start: a thin golden ellipse in near-black, the camera orbiting. The orbit eases out smoothly into a three-quarter view while the ellipse physically becomes the brass ring of an ear cup: a pair of over-ear headphones floats in a black void – anthracite, leather, slim brass rings, a braided cable plugged into its jack, hanging in a calm S-curve. The distant points of light fade into the void. Soft key light from the top left, cool rim light from behind right. Out of focus at the frame edge, over a shoulder, the rim of a helmet; a gloved hand rises into frame, the fingertip resting on a small brass plate on the outer shell. The plate and the face of the ring stay blank (surface blank, camera slow). Near the end the camera is almost still, in a very slow push-in. Lone astronaut in a modern, slightly retro EVA spacesuit, warm off-white woven fabric, matte, soft folds; rounded helmet with an opaque mirrored gold sun visor, face never visible; thin brushed-brass neck ring; boxy off-white life-support backpack with one small round gauge without numbers; off-white gloves with dark grey rubber fingertips; grey-white boots with evenly ribbed soles; fine grey moon dust on knees and boots; calm, careful, dignified body language. Style: photorealistic product cinematography, real materials only, subtle film grain, shallow depth of field. Avoid: no text, no letters, no logos, no patches, no flags, no name tag, no numbers, no visible face, no eyes, no glow rings, no hologram, no lander, no green code rain.
```

**Wenn es schiefgeht**
- Kopfhörer weicht vom Meisterbild ab: Überlagerung K09/K10 prüfen.
- Leuchtringe oder Glanzgrafik: Nachdreh.

### Clip C10

Zerlegung (Drehbuch §5.2–5.3). Gravur und Haarlinien setzt Remotion.

- Von → nach: K10 → K11 (im Film 44,02–46,52 s, Tempo 1,20× als Rampe 1,00 → 1,35 → 1,10)
- Dauer: 3 s
- Modell: `kling_o3_flf`, Modus pro, sound off
- Seitenverhältnis: 16:9
- Kosten: 3 s × 1,25 = 3,75 Credits
- Startbild: letztes Bild von C09 · Endbild: K11-Original · Tor 3

```text
One continuous shot, very slow push-in turning towards the axis, continuous camera motion, no pause, no cut, no cross-fade. Start: closed over-ear headphones in three-quarter view floating in a black void, a gloved fingertip on a small blank brass plate. The fingertip presses the plate; a warm sheen runs once over the brass ring. Then a precise mechanical exploded view of the front ear cup only, along its own single straight axis: towards the camera the brushed cover disc and the brass ring glide out; away from it, towards the head, the driver (silver membrane with fine rings, brass rim) and the black leather cushion; the plug of the braided cable slides two centimetres out of its jack. Each part starts a fraction of a second after the previous one, equal gaps, smooth ease-in ease-out, no rotation, no morphing, no new parts; headband, hinge and the second ear cup stay together. Ring and housing are visibly hollow, inner surfaces empty and matte; the cover disc ends below the centre line. Blank engraving surfaces. At the end the parts hang still while the camera keeps moving slowly towards the axis. Constant soft key light from top left, cool rim light, black void. Lone astronaut in a modern, slightly retro EVA spacesuit, warm off-white woven fabric, matte, soft folds; rounded helmet with an opaque mirrored gold sun visor, face never visible; thin brushed-brass neck ring; boxy off-white life-support backpack with one small round gauge without numbers; off-white gloves with dark grey rubber fingertips; grey-white boots with evenly ribbed soles; fine grey moon dust on knees and boots; calm, careful, dignified body language. Style: photorealistic product cinematography, real materials only, subtle film grain, shallow depth of field. Avoid: no text, no letters, no logos, no patches, no flags, no name tag, no numbers, no visible face, no eyes, no glow rings, no hologram, no lander, no green code rain.
```

**Wenn es schiefgeht**
- Teile drehen oder verdoppeln sich, „Raupe“: Nachdreh mit P2, Differenzbild neu prüfen.
- Kabel hängt lose ohne Buchse: Abnahme §5.3 Nr. 5 verfehlt → Nachdreh.

### Clip C11

Fahrt durch die Tore bis Naht N5. Kein Astronaut im Bild, daher kein Anzug-Baustein (Ausnahme §1); Negativliste vollständig.

- Von → nach: K11 → K12 (im Film 46,52–49,33 s, Tempo 1,07×)
- Dauer: 3 s
- Modell: `kling_o3_flf`, Modus pro, sound off
- Seitenverhältnis: 16:9
- Kosten: 3 s × 1,25 = 3,75 Credits
- Startbild: letztes Bild von C10 · Endbild: K12-Original · Tor 3

```text
One continuous shot, continuous camera motion at an even speed, no pause, no cut, no cross-fade. Start: an opened front ear cup of over-ear headphones in a black void, its parts floating apart along one axis, a hollow brass ring and an empty housing. The camera glides along the axis just above the brushed cover disc, which slides out of frame below; through the hollow brass ring; through the empty housing, whose inner wall carries fine engraved grid grooves (texture only, nothing readable). Behind the camera the ring and the cover close again. It ends facing the driver's dust cap: silver, close, with fine concentric rings. The camera is still moving slowly forward towards the dust cap at the last frame. The same soft key light from the top left throughout; nothing melts or merges. Style: photorealistic product cinematography, real materials only, subtle film grain, shallow depth of field. Avoid: no text, no letters, no logos, no patches, no flags, no name tag, no numbers, no visible face, no eyes, no glow rings, no hologram, no lander, no green code rain.
```

**Wenn es schiefgeht**
- Teile verschmelzen: Rückfall – drei Standbilder entlang der Achse (je 0,25, Reserve), Tunnel in Remotion.
- Rillen werden zu Pseudo-Schrift: Nachdreh mit „smooth grooves only“.

### Clip C18

Helm hebt sich (K19 für den Wischschnitt N11). Nie ein Kopf. Statt des Anzug-Bausteins die Helm-Kurzfassung (Ausnahme §1).

- Von → nach: K18 → K19 (im Film 62,40–65,40 s, Tempo 1,00×)
- Dauer: 3 s
- Modell: `kling_o3_flf`, Modus pro, sound off
- Seitenverhältnis: 16:9
- Kosten: 3 s × 1,25 = 3,75 Credits
- Startbild: K18-Original · Endbild: K19-Original · Tor 4 (Paket B)

```text
Locked-off camera that is the eye of the wearer, no cut, no cross-fade. Start: the view from inside a space helmet through the curved glass into darkness, one tiny soft point of light in the centre, a thin gold sheen on the rim. For about one second nothing moves. Then the helmet lifts off upwards with a soft ease-in, accelerating evenly: its dark lower edge travels up the frame as an arch with both sides drawn down, and beneath it soft, out-of-focus morning-blue light appears. No head, no hair, no neck, no hands, no face is ever visible. At the end the dark arch fills the upper third and is still moving upwards with natural motion blur. Helmet, inside view only: rounded helmet, clear curved inner glass with a thin gold sheen on the rim, thin brushed-brass neck ring as its lower edge; no wearer, no backpack, no boots. Style: photorealistic, cinematic, subtle film grain. Avoid: no text, no letters, no logos, no patches, no flags, no name tag, no numbers, no visible face, no eyes, no glow rings, no hologram, no lander, no green code rain.
```

**Wenn es schiefgeht**
- Haar, Nacken oder Gesicht erscheint: verworfen, Nachdreh (Würde, J3 Korr. 9).
- Tempo am Ende ≠ 0,6 Bildhöhen/s: messen, Rampe in Remotion. Farbe auf Elias' Morgenblau graden.

## 8. Clips ohne Higgsfield (gratis, kein Prompt)

Von → nach, Dauer und Quelle: `zeitleiste.py clips`. **Remotion:** C12 Durchflug durch die Ringe in das flache Bild K13 ·
C16 Visier in Visier (K16 + Aufnahmen) · C17 Cursor, goldener Saum · C22 Schlusskarte (Text exakt Drehbuch §7.3) · C23 Ausklang.
**Website-Aufnahmen:** C13 Ebenen → Eiche & Span · C13b Eiche & Span (2 Rasten) → Lotlinie (4 Rasten, `lot-zeichnen`) · C14 →
ZEYTIN & GLUT (8 Rasten) · C15 Seitenschacht, Freisteller „Fall“ · C21 Portal-Kreis der eigenen Seite, auf den Bildschirm
gesetzt. **Elias' Dreh:** C19 Kopfhörer ab (Drehbuch §10) · C20 Zimmer bis Bildschirm frontal.

## 9. Aufnahmeliste der echten Website-Aufnahmen (Drehbuch §9.7)

Playwright lokal, bildgenau, 60 B/s, 1920 × 1080, für 9:16 zusätzlich Handy 390 px; Artifact-Seiten lokal ausgeliefert. Quellen
laut Drehbuch §9.7 (fehlt eine, entfällt die Seite). `kontinuitaet` hakt jede Zeile am Bild ab („offen“ → „ok“).

| Aufnahme | Ausschnitt | keine Preise | keine erfundenen Zahlen | Kennzeichen | Abgehakt |
|---|---|---|---|---|---|
| Eiche & Span | Kopfzeile, Bild, Maß „18 cm“ | prüfen | „18 cm“ ist Bleistiftmaß, zulässig | ja (S07) | offen |
| Hörwerk | Knopf, Kopfzeile | prüfen | „40 mm“, „280 g“ **nicht** verwenden | ja (ab 42,50) | offen |
| Lotlinie | Kopfzeile, Strichfigur | prüfen | keine | ja | offen |
| ZEYTIN & GLUT | Schriftzug, runde Speisefotos | **Speisekarte mit Preisen nicht im Bild** | keine | ja | offen |
| Lindgrund | Startbild | prüfen | Ausschnitt ohne Zahlenzeile | Bildecke | offen |
| v3-Seiten (6) | Startbilder | prüfen | ohne Zahlen, Termine, Preise | Bildecke | offen |
| Wagner Seiten (Laptop) | Abschnitt ohne Preisanzeigen und Messwerte | **Pflicht** | Messwerte nicht im Bild | – | offen |

## 10. Kosten (Higgsfield-Credits)

Stimmt mit `zeitleiste.py clips` überein: 13 Clips, 52 s, pro × 1,25 = 65,00. Gratis abfragen: **vor Tor 1** `balance` und
`get_cost` für `gpt_image_2_5` (je Bild, ein Bild und die Tor-Anzahl); **vor Tor 3** Clip-Preise pro und std für 3/4/5/6 s.
Bis dahin sind auch die Bildkosten unten nur Schätzung. (Drehbuch §9.4 nennt den Bildpreis erst „vor Tor 3“ – dort angleichen.)

| Posten | Menge | Credits |
|---|---|---|
| Tor 1 Anzug-Referenzbogen | 6 Bilder × 0,25 | 1,50 |
| Tor 2 Keyframes und Hilfsbild „Fall“ | ≈ 32 Bilder × 0,25 (Ø 2 Versuche) | 8,00 |
| Tor 3 Probe C02, C03, C04, C06a, C06b, C08, C09, C10, C11 | 35 s pro | 43,75 |
| Tor 4 Paket A C01, C05, C07 | 14 s pro | 17,50 |
| Tor 4 Paket B C18 | 3 s pro | 3,75 |
| **Plan** | | **74,50** |
| **Reserve** für Nachdrehs (≈ 10,2 s pro) | | **12,75** |
| **Summe = Guthaben** | | **87,25** |
| *Kurzfassungen extra (Entscheidung 6): 30 s quer A1–A5, 9:16-Mittelausschnitt geteilt* | 5 × 3 s pro | *18,75* |
| *9:16 eigene Brücken* | 8 × 3 s pro + Standbilder | *≈ 32,50* |

Reserve ehrlich: ein Nachdreh von C03/C04 frisst 49 %, einer C06-Hälfte 39 %; zwei solche sind gedeckt, drei nicht.
Sparhebel in dieser Reihenfolge: C02 std (−1,25) · C05 std (−1,50) · C01 std (−1,25). `fps_boost`, `remove_background` nur nach
`get_cost`; `topaz_video` ist vorab nicht abfragbar.

## 11. Auftragsprotokoll und offene Punkte

| Datum | Auftrag | Fassung | Modell, Modus, Dauer | Job-ID / media_id | Credits | Naht-Urteil | Freigabe |
|---|---|---|---|---|---|---|---|
| – | noch kein Auftrag | | | | | | |

Offen: Ablageort der Originale (Elias) · Download-Freigabe für `d8j0ntlcm91z4.cloudfront.net` · Lieferauflösung und Bildrate von
`kling_o3_flf` (erster Clip) · Prompt-Längengrenze des Modells · Quellen der Seiten (Entscheidung 5c) · im Drehbuch (S03, §9.2)
und in `zeitleiste.json` angleichen: K06b „fast aufrecht“, Linie aus Remotion; Drehbuch §9.4 Bildpreis vor Tor 1.
