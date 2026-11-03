# Werbefilm „Traum“ – Tonblatt ElevenLabs (Auftrag A-124)

Stand 03.11.2026 (nachgebessert), Kommandeur Stahl. Nur Planung: Dieses Blatt löst nichts aus. Zeiten und IDs stammen aus `zeitleiste.json`
(`zeitleiste.py liste` / `clips`, 60 B/s, Bild = Zeit × 60); Hintergründe stehen im Drehbuch (`01-drehbuch.md` §0.2 Nr. 9, §1,
§4, §5.2, §7, §9.4–9.5, §10.5, §11) und werden hier nicht wiederholt. Kosten sind Bezugswerte aus der Grundlage – **keine Freigabe**.

## 1. Tonidee

- **Atem ist der Takt.** Je Welt drei Atemzüge, das erste Einatmen auf ihrer Naht, je Ebene ×1,33 schneller (12/min … 379/min);
  er stockt beim Klick (T21), wird im Durchflug Fallwind, schweigt am Grund und löst sich im langen Ausatmen am Morgen (T32).
- **Helmakustik und Funk.** Im Traum Atem und Funkstimme ganz nah, binaural, eine kurze harte Raumantwort; außen gedämpft durch
  das Visier, das „Ting“ (T17) ist das erste helle Außengeräusch. Mit T31 fallen Filter und Helm in derselben Bewegung weg.
- **Website-Klänge als wachsende Schicht.** Eine versteckte Raste (T02), dann wächst die Schicht mit dem Website-Anteil
  (Rasten S07 2 → S08 4 → S09 8 → Dauerscroll; das Glutknistern wird Klickrhythmus).
- **Musik vom dünnen Kopfhörerklang zur vollen Breite.** Motiv dünn und mono bis 44,40 s, Öffnung in fünf Schichten bis 46,5 s,
  raumbreit ab 48,40 s, danach Dichte statt Lautstärke bis zum harten Schnitt auf digitale Stille bei 60,00 s.
- **Erwachen.** Ab 61,40 s kaum hörbar Raumton und ferne Amsel; Helmklick (T30) und Bügelklick (T33) sind eine Klangfamilie,
  die Raste im Zimmer (T36) ist die Datei aus Bild 1 (T02).
- **Klanglogo = das Motiv.** Vier Töne offen wie eine Frage, der fünfte erst am Klavier im Zimmer (T35); auf der Karte drei
  Klaviertöne (T39), ein weicher Klick (T40) und als einziger Wink die Amsel mit den ersten Motivtönen (T41).

**Mischebenen** (Feld „Ebene“ in Abschnitt 3; nicht zu verwechseln mit den Traumebenen L00–L13):
A Atem · G Ereignisgeräusch (Spitze aufs Bild) · W Website-Klang (Spitze aufs Bild, Pegel folgt dem Website-Anteil) ·
B Bett/Teppich (weich ein- und ausblenden, ohne Spitze) · S Stimme · M Musik (Unterlage) · T Motiv-Einzelton (bildgenau gesetzt).

**Regeln für alle Prompts** (Grundlage §5, Playbook §5): ein Geräusch je Erzeugung · Quelle, Material, Textur, Raum konkret ·
keine Bildwörter (keine Farben, kein Licht, kein „Mond“, „Astronaut“, „Traum“, „cinematic“) · trocken und nah erzeugen, Helm-
und Funkklang entstehen im Mix (eine Raumantwort für alle) · Teppiche lang mit Schleife · was als Datei existiert, nicht neu erzeugen.

## 2. Stimme

**Wer spricht** (Drehbuch §0.2 Nr. 9): die Erzählstimme, im Traum durch Funk (T05, T15, T19), im Zimmer und auf der Karte nah
und ohne Filter (T34, T38); **ohne Anrede**, kein „ich“ einer KI-Stimme; Untertitel = genau die gesprochenen Worte (§7.3).

**Besetzung (offene Entscheidung 3):** Standard ist `creative_design_voice` mit der Beschreibung unten (3 Vorschläge) plus 3–4
deutsche Bibliotheksstimmen, alle mit dem Probetext auf einer privaten Hörseite; Elias wählt nach Gehör (Playbook §3). Ausweich:
Elias' eigene Stimme nach §10.5 – dann entfallen Stimmdesign und Takes. Offen ist die **Stimmlage** (Platzhalter, setzt Elias).

### Stimmdesign

Beschreibung für `creative_design_voice` (Englisch); Stimmlage vorher von Elias einsetzen. Sprache des Probetexts: Deutsch.

```text
[VOICE REGISTER CHOSEN BY ELIAS], native German speaker, standard German without regional accent. Calm, warm and very close to the microphone, as if speaking quietly to one person in a quiet room. Unhurried, gentle, natural pauses, audible soft breath between phrases, a human voice with a slight natural roughness, never smooth or synthetic. No announcer tone, no pathos, no sales energy, no sales smile. Clean studio recording, dry, no reverb.
```

### Probetext

Für alle Kandidaten gleich – die fünf Sätze des Films.

```text
…hört mich jemand?
…ganz ruhig. Atmen.
…wer spielt da?
Jeder Betrieb ist eine eigene Welt. Seine Website ist die Tür hinein.
Jede Welt beginnt mit einer Seite.
```

**Sprach-Takes:** `eleven_v3` (oder `eleven_v4`, falls auf der Hörseite besser), je Satz ein Aufruf mit den Regietags aus
Abschnitt 3; Standard zwei Takes je Aufruf. Auswahl nach Pausenbau und Transkript (scribe), nicht nach Gefühl; Wortbeginne aus
dem Audio neu messen (`ton/wortbeginn.py`, Playbook §3). **Nie beschleunigen**, nur Pausen kürzen. Die Fenster T34 und T38 sind
nach Silbenzählung zu kurz (siehe dort) – Sprechdauer **vor** jeder bezahlten Erzeugung und vor dem Dreh von S17 gratis messen:
Elias spricht die fünf Sätze in Tor 0 für den Probe-Ton der Animatik ein; die Zeitleiste folgt dieser Messung.

## 3. Tonereignisse der Zeitleiste (T01–T41)

Lesart: **Zeit** = `zeit_s` (Bild bei 60 B/s) · **Spitze** = der lauteste Punkt (2 ms geglättet) der fertig bearbeiteten Datei
liegt auf diesem Bild (Playbook §5) · **Dauer** = Erzeugungslänge (ElevenLabs 0,5–30 s), danach zugeschnitten · **Ebene** =
Mischebene aus Abschnitt 1. Stimmen-Blöcke: deutscher Text mit `eleven_v3`-Regietags. Musik-Blöcke: Briefe für
`eleven_music_v2_5`, instrumental (Abschnitt 4). Ohne Textblock: T25, T26, T36 (Datei T02) und T28 (Stille).

### Ton T01

- Zeit: 0,00 s (Bild 0) · Ereignis: Bild 1, die Raste reißt das Bild an · Spitze: **bewusste Ausnahme** – Einsatz hart auf
  Bild 0 (kein Vorlauf möglich), Spitze ≤ 0,15 s danach; Synchronprüfung mit Toleranz 9 Bilder (Abschnitt 7 Schritt 4)
- Dauer: 1 s erzeugen, auf ca. 0,4 s schneiden · Schleife: nein · Ebene: A (binaural ganz nah, Helmakustik im Mix)

```text
One sharp, sudden inhale through the mouth, startled, extremely close to the microphone, short and tight, dry, no room, isolated breath only.
```

### Ton T02

- Zeit: 0,00 s (Bild 0) · Ereignis: das Bild sackt eine Raste ab · Spitze: Bild 0 (Datei wenige ms vor der Klickspitze
  anschneiden – der Anstieg eines Klicks liegt innerhalb der Toleranz von 1 Bild)
- Dauer: 0,5 s · Schleife: nein · Ebene: W (leise, unter T01 – der Zuschauer soll sie fühlen, nicht erkennen)
- Wiederverwendung: dieselbe Datei für T25, T26, die acht Rasten in S09 und T36 – die Wiederholung ist hier Absicht.

```text
Single dry detent click of a computer mouse scroll wheel turning one notch, very close, crisp small plastic tick with a tiny mechanical body, no reverb, isolated.
```

### Ton T03

- Zeit: 0,40 s (Bild 24) · Ereignis: der Beschlag schluckt die Erde · Spitze: weicher Atemscheitel auf Bild 24
- Dauer: 2 s, auf ca. 1,75 s (bis 2,15 s) · Schleife: nein · Ebene: A

```text
One slow warm exhale through the mouth, very close, the breath pressing softly against a hard curved surface a few centimetres in front of the lips, gentle airy wash, dry, isolated.
```

### Ton T04

- Zeit: 2,15 s (Bild 129) · Ereignis: der Beschlag zieht sich zurück · Spitze: Bild 129
- Dauer: 0,5 s · Schleife: nein · Ebene: G (Funkklang, mono, im Helm)

```text
Short analog two-way radio squelch: a push-to-talk click followed by a brief crackle of static, band-limited, mono, close, dry.
```

### Ton T05

- Zeit: 2,25 s (Bild 135) · Ereignis: die Erde ist wieder sichtbar · Wortbeginn auf Bild 135
- Dauer: Satzlänge (Take) · Schleife: nein · Ebene: S – Funkband im Mix (Bandpass, leichte Sättigung, feines Rauschen), mono
  im Helm, ohne Anrede

```text
[quietly, searching, a little out of breath, as if unsure anyone is listening] …hört mich jemand?
```

### Ton T06

- Zeit: 5,30 s (Bild 318) · Ereignis: Rückfahrt, Helm und Schultern im Bild; Schultern und Rucksack heben sich (Durchatmen 1)
- Spitze: Scheitel des Einatmens auf dem höchsten Punkt der Schulterbewegung (am Bild abnehmen)
- Dauer: 4 s (Takt 12/min = 5 s je Atemzug) · Schleife: nein · Ebene: A; dazu B02 (Ventil) auf das Einatmen, B01 (Anzug) leise

```text
One calm, slow, deep breath, a full inhale through the nose followed by a relaxed exhale through the mouth, very close, unhurried, steady, dry, isolated breath only.
```

### Ton T07

- Zeit: 10,00 s (Bild 600) · Ereignis: Totale auf dem Felsen (K03); der Brustkorb hebt sich, Staub löst sich vom Knie (Durchatmen 2)
- Spitze: Scheitel des Einatmens auf der Brustbewegung · Dauer: 4 s · Schleife: nein · Ebene: A; B02 auf das Einatmen
- Eigener Aufruf (nicht T06 kopieren – zwei gleiche Atemzüge hört man).
- **Atemsätze (gilt für T10, T13, T16, T20):** Die weiteren Atemzüge einer Welt kommen aus den **Varianten desselben Aufrufs**
  (der Connector liefert standardmäßig mehrere, ohne den Aufruf zu wiederholen), nie zweimal derselbe Atemzug hintereinander.

```text
One calm, deep breath, slightly longer and heavier than a normal breath, slow inhale through the nose, long soft exhale through the mouth, very close, tired but peaceful, dry, isolated breath only.
```

### Ton T08

- Zeit: 8,50 s (Bild 510) · Ereignis: er neigt den Helm und lauscht · Einsatz des ersten Motivtons auf Bild 510
- Dauer: Stück A 8,50–60,00 s (51,5 s im Film); `duration_seconds` ≈ 55,5 – der Anstieg läuft im Brief 4 s über den Schnitt
  hinaus, **hart geschnitten wird im Mix auf Bild 3600** (Stückzeit 0:51.5), nicht in der Erzeugung · Schleife: nein · Ebene: M + T
- Das Motiv selbst (Spieluhr) wird aus Einzeltönen M1 bildgenau gesetzt; dieser Brief erzeugt die Unterlage in Tonart und Tempo
  aus Tor 0. „Dünn wie aus einem Kopfhörer“ entsteht im Mix (schmal, mono, Hochpass/Tiefpass), nicht in der Erzeugung.
- Brief für das ganze Stück A; die Blöcke T14, T23 und T27 sind seine Abschnitte (Abschnitt 4).

```text
Instrumental only, no vocals. Key: [KEY FROM GATE 0], tempo: [BPM FROM GATE 0]. A sparse, intimate, slowly building underscore that grows from almost nothing into a dense, rising wall of sound that never resolves. No lead melody in the foreground: leave space for a separate four-note motif played on top.
0:00–0:06.5: near silence; a very soft low drone and a faint high metallic shimmer, lots of space, energy 1 of 10.
0:06.5–0:17.75: a muffled wooden mallet pattern joins, dry and close, still very sparse, energy 1.2.
0:17.75–0:26.2: bright, clean, glassy textures, a barely audible soft pad underneath, airy, energy 1.5.
0:26.2–0:32.5: warm, slightly richer, low steady pulse, still restrained and thin, energy 1.8.
0:32.5–0:35.9: dry, narrow and focused, almost no reverb, suspended and motionless, energy 2.1.
0:35.9–0:40.8: the full arrangement is present and steady: highs, mids, a sense of space, deep bass and air, energy 2.6.
0:40.8–0:47.0: wide and immersive, the mallet pattern gets faster, a rhythmic ticking texture doubles its rate, energy rising from 3 to 4.6.
0:47.0–0:55.5: density not volume: an endlessly rising Shepard-like ascent, many fast overlapping layers, energy rising from 5.6 to 10; density keeps rising to the very last second, no ending, no final hit, no fade out.
Avoid: drums kit, epic trailer hits, choir, vocals, stock corporate music, elevator music.
```

### Ton T09

- Zeit: 12,00 s (Bild 720) · Ereignis: die Leitung wird sichtbar · ohne Spitze, weich einblenden (Einsatz auf Bild 720)
- Dauer: 10 s als Schleife, läuft bis 26,25 s weiter: auf der Naht N1 wird das Erdbrummen zum Lampenbrummen der Werkstatt
  (dieselbe Datei, kein zweites Brummen) · Schleife: ja · Ebene: B
- Kleine Lautsprecher geben 50 Hz kaum wieder: die Obertöne (100/150 Hz) im Mix behalten, sonst ist das Brummen am Handy weg.

```text
Deep steady electrical mains hum at 50 hertz with soft upper harmonics, like an old lamp transformer in a quiet room, warm, constant, no fluctuation, seamless loop.
```

### Ton T10

- Zeit: 15,00 s (Bild 900) · Ereignis: K04, Naht N1 – erstes Einatmen der Werkstatt (Ende des dritten Mond-Atemzugs)
- Spitze: Scheitel des Einatmens auf Bild 900 · Dauer: 3 s (Takt 16/min = 3,75 s je Atemzug) · Schleife: nein · Ebene: A
- Atemsatz Werkstatt: T10 und zwei weitere Varianten dieses Aufrufs (gekürzt), je 3,75 s; B02 auf jedes Einatmen.

```text
One breath, inhale through the nose then exhale through the mouth, a little quicker than resting, slightly alert, very close, dry, isolated breath only.
```

### Ton T11

- Zeit: 19,00 s (Bild 1140) · Ereignis: Mondstaub auf Holz – der Handschuh streicht über die Eiche · Spitze: Bild 1140
- Dauer: 2 s · Schleife: nein · Ebene: G (gedämpft, Außenwelt hinter dem Visier)

```text
A thick padded glove rubbing slowly across a rough oak plank, dry raspy friction of fabric on open wood grain, a few fine grains of grit, close, quiet empty room.
```

### Ton T12

- Zeit: 22,00 s (Bild 1320) · Ereignis: das Lot pendelt von selbst · Spitze: erster Umkehrpunkt auf Bild 1320
- Dauer: 1,5 s · Schleife: nein · Ebene: G · **ein** Knarzen erzeugen; die weiteren setzt der Schnitt aus den Varianten auf die
  Umkehrpunkte im Bild (Bilder am Bild abnehmen). Den feinen Luftzug (Zeitleiste) trägt T12 nicht; falls nötig, eigene Erzeugung.

```text
One single soft creak of a thin taut cord under the pull of a small heavy weight, close, dry, quiet wooden room, single event.
```

### Ton T13

- Zeit: 26,25 s (Bild 1575) · Ereignis: K06, Naht N2 – erstes Einatmen der Praxis · Spitze: Bild 1575
- Dauer: 2,5 s (Takt 21,3/min = 2,8 s je Atemzug) · Schleife: nein · Ebene: A; Atemsatz Praxis wie bei T10

```text
One breath, a quick inhale through the nose and a short exhale, slightly tense, more urgent than calm breathing, very close, dry, isolated breath only.
```

### Ton T14

- Zeit: 28,50 s (Bild 1710) · Ereignis: die Messpunkte erscheinen – vier gläserne Töne = das Motiv, der fünfte bleibt stumm
- Die vier Töne sind Einzeltöne M3 (Glas), je einer auf das Bild seines Messpunkts (der erste bei 28,50 s); dieser Block ist der
  Abschnitt Praxis von Stück A (Stückzeit 0:17.75–0:26.2) für einen Kompositionsplan oder einen Nachdreh nur dieses Abschnitts
- **Einsatz der Datei 26,25 s** (Abschnittsbeginn, Bild 1575), nicht 28,50 s · Dauer: 8,4 s · Schleife: nein · Ebene: M + T

```text
Instrumental only. Key: [KEY FROM GATE 0], tempo: [BPM FROM GATE 0]. 8.4 seconds. A bright, clean, very quiet section: a barely audible soft pad, glassy high textures with lots of air between them, no melody in the foreground, no percussion, intimate and still. Energy 1.5 of 10, constant, no build.
```

### Ton T15

- Zeit: 30,00 s (Bild 1800) · Ereignis: er richtet sich auf · Wortbeginn auf Bild 1800
- Dauer: Satzlänge · Schleife: nein · Ebene: S – Funkband wie T05, mit T04-Knacken davor (dieselbe Datei, leiser)

```text
[softly, soothing, slow, reassuring, almost a whisper] …ganz ruhig. [pause] Atmen.
```

### Ton T16

- Zeit: 34,68 s (Bild 2081) · Ereignis: K07, Naht N3 – erstes Einatmen des Restaurants · Spitze: Bild 2081
- Dauer: 2 s (Takt 28,4/min = 2,1 s je Atemzug) · Schleife: nein · Ebene: A; Atemsatz Restaurant wie bei T10

```text
One short breath, quick inhale and quick exhale, restless and uneasy, like someone who has been walking fast, very close, dry, isolated breath only.
```

### Ton T17

- Zeit: 36,00 s (Bild 2160) · Ereignis: das Teeglas berührt das Visier – das erste helle Außengeräusch · Spitze: Bild 2160
- Dauer: 1,5 s · Schleife: nein · Ebene: G (offen, hell, ohne Visierdämpfung)

```text
A thin tea glass tapping once against a hard curved polycarbonate shell, a bright clear ting with a short pure ring, close, quiet room, single hit.
```

### Ton T18

- Zeit: 37,00 s (Bild 2220) · Ereignis: der Fokusrahmen springt – drei leise Klicks · Spitze: je Klick auf das Bild, in dem der
  Rahmen springt (Zeiten am Bild abnehmen, in die Zeitleiste übertragen)
- Dauer: 0,5 s, ein Klick, dreimal gesetzt (zweiter und dritter ±1 Halbton) · Schleife: nein · Ebene: W

```text
One very soft, precise click of a tiny tactile switch, clean and small, close, dry, no reverb, single click.
```

### Ton T19

- Zeit: 38,40 s (Bild 2304) · Ereignis: die Teller heben ab · Wortbeginn auf Bild 2304
- Dauer: Satzlänge · Schleife: nein · Ebene: S – Funkband wie T05; die Teller klingen dabei in den Tönen des Motivs (M4)

```text
[hushed, curious, half to oneself, listening] …wer spielt da?
```

### Ton T20

- Zeit: 41,02 s (Bild 2461) · Ereignis: K09, Naht N4 – erstes Einatmen des Kopfhörers · Spitze: Bild 2461
- Dauer: 1,5 s (Takt 37,9/min = 1,6 s je Atemzug) · Schleife: nein · Ebene: A
- Bei 44,10 s wird der Atem angehalten (T21), in S06 setzt er wieder ein (50,6/min); bis S09 (120/min) Atemsätze aus den
  Varianten von T20, immer kürzer geschnitten, je Welt drei verschiedene, wiederkehrende Varianten ±1 Halbton versetzt;
  ab S10 wird der Atem Fallwind (B12).

```text
One fast, shallow breath, sharp short inhale and short exhale, nervous, close to panting, very close, dry, isolated breath only.
```

### Ton T21

- Zeit: 44,10 s (Bild 2646) · Ereignis: das Messingschild gibt nach · Spitze: auf dem Bild, in dem es nachgibt (Bild 2646)
- Dauer: 0,5 s · Schleife: nein · Ebene: W (satt, trocken; im selben Bild bricht der Atem ab – Atemspur davor schneiden)

```text
Single solid, satisfying mechanical click of a small brass push plate being pressed in until it seats, firm and precise, a short metallic body, close, completely dry, dead-quiet space.
```

### Ton T22

- Zeit: 44,40 s (Bild 2664) · Ereignis: die Teile lösen sich – fünf Klicks im Abstand 0,15 s (44,40 / 44,55 / 44,70 / 44,85 /
  45,00 s = Bild 2664 / 2673 / 2682 / 2691 / 2700) · Spitze: je Klick auf sein Bild
- Dauer: 0,5 s, ein Klick, fünfmal gesetzt, je Teil anders gestimmt in der Reihenfolge des Drehbuchs (§5): Deckelscheibe +2,
  Messingring +1, Stecker 0, Treiber −1, Polster −2 Halbtöne
- Schleife: nein · Ebene: W

```text
One small precise metal latch releasing, a light clean click followed by a tiny airy release, close, dry, no reverb, single click.
```

### Ton T23

- Zeit: 44,40 s (Bild 2664) · Ereignis: mit jedem gelösten Teil öffnet sich die Musik eine Schicht bis 46,5 s: Höhen, Mitten,
  Raum, Bass, Luft · ohne Spitze
- Umsetzung im Mix: Stück A ist ab Stückzeit 0:35.9 voll besetzt; die fünf Schichten öffnen sich als Filter-/Raumstufen auf den
  Bildern der fünf Teile (T22), die letzte bis 46,5 s ausgeblendet (Startwerte Abschnitt 6).
- Dauer: **kein eigener Aufruf**, nur Abschnitt von T08 (Stückzeit 0:35.9–0:40.8, davon 0:35.9–0:38.0 = diese Stelle);
  Erzeugungslänge siehe T08 · Schleife: nein · Ebene: M. Unten die Briefzeile für einen Kompositionsplan.

```text
0:35.9–0:40.8: the full arrangement is present and steady: highs, mids, a sense of space, deep bass and air, energy 2.6.
```

### Ton T24

- Zeit: 48,40 s (Bild 2904) · Ereignis: Ring und Deckel schließen sich hinter der Kamera; die Musik wird raumbreit (Mix: von mono
  auf volle Stereobreite in ca. 0,3 s ab Bild 2904) · Spitze: Bild 2904
- Dauer: 1 s · Schleife: nein · Ebene: G

```text
A brushed aluminium disc seating softly into a metal ring, a smooth muted thunk with a short airy seal, close, dry, single event.
```

### Ton T25

- Zeit: 51,20 s (Bild 3072) · Ereignis: Seite Eiche & Span (K13b), zwei Rasten der Browser-Kamera (51,20 / 51,60 s = Bild 3072 /
  3096) · Spitze: je Raste · Dauer: Datei T02 · Schleife: nein · Ebene: W
- **Nicht neu erzeugen:** Datei von T02. Dazu der Seitenklang (B10) und das Motiv mit Klöpfel (M2), schneller.

### Ton T26

- Zeit: 52,00 s (Bild 3120) · Ereignis: Praxis als Seite, vier Rasten bis 52,40 s (Bild 3120 / 3128 / 3136 / 3144) · Spitze: je
  Raste · Dauer: Datei T02 · Schleife: nein · Ebene: W
- **Nicht neu erzeugen:** Datei von T02. Dazu ein gläserner Ton (M3). In S09 (54,00–55,50 s) acht Rasten derselben Datei; das
  Glutknistern (B08) wird dort im Schnitt zum Klickrhythmus.

### Ton T27

- Zeit: 55,50 s (Bild 3330) · Ereignis: Durchflug – Dichte statt Lautstärke: Shepard-Anstieg, Dauerscroll (B11), Atem als
  Fallwind (B12) · ohne Spitze; der Pegel bleibt, nur die Dichte steigt
- Dieser Block ist der Schlussabschnitt von Stück A (Stückzeit 0:47.0–0:55.5); im Film 4,5 s (55,50–60,00 s), hart geschnitten
  im Mix bei 60,00 s = Stückzeit 0:51.5 (T28)
- Dauer: im Plan kein eigener Aufruf (Abschnitt von T08); nur für einen Nachdreh dieses Abschnitts 8,5 s erzeugen, davon
  4,5 s verwendet · Schleife: nein · Ebene: M

```text
Instrumental only. Key: [KEY FROM GATE 0], tempo: [BPM FROM GATE 0]. 8.5 seconds. An endlessly rising Shepard-tone ascent: many overlapping layers climbing in pitch at once, ever faster rhythmic ticking, density increasing every second while the loudness stays the same, tense and hypnotic. Keeps rising to the very last second, no ending, no final hit, no fade out.
```

### Ton T28

- Zeit: 60,00 s (Bild 3600) · Ereignis: der Cursor · **Stille, keine Erzeugung**
- Alle Spuren enden auf Bild 3600 (Schnitt mit 1–2 ms Abblende gegen Knacken), danach digitale Stille bis 61,40 s; kein Rauschen,
  kein Nachhall. Ebene: alle.

### Ton T29

- Zeit: 61,40 s (Bild 3684) · Ereignis: goldener Saum – Raumton und Amsel aus der Stille, kaum hörbar · ohne Spitze, sehr langsam
  einblenden (über ca. 1 s)
- Dauer: 20 s als Schleife, läuft bis 85,00 s (unter der Karte leiser) · Schleife: ja · Ebene: B
- Nur Raumton; die ferne Amsel ab 61,40 s und in S16 ist **B14**, nicht T41 (die Motiv-Rufe gehören nur dem Schlusswink).
  Drehort-Raumton (§10.5) ersetzt diese Erzeugung.

```text
Quiet room tone of a small room with wooden floorboards, window open, very faint distant outdoor air, soft low hush, no voices, no traffic, no birds, no music, seamless loop.
```

### Ton T30

- Zeit: 62,40 s (Bild 3744) · Ereignis: der Helm hebt sich – Helmverschluss-Klick, das lauteste Einzelgeräusch des Films
- Spitze: Bild 3744 · Dauer: 1 s · Schleife: nein · Ebene: G (noch mit Helmakustik; Klangfamilie mit T33)

```text
Single loud, dry metallic latch click of a heavy hinged clasp snapping open, sharp hard transient, short metal ring, very close, no reverb, single event.
```

### Ton T31

- Zeit: 65,40 s (Bild 3924) · Ereignis: Kopfhörer ab (Bildanschluss auf die Bewegung) · Spitze: Polster löst sich vom Ohr (Bild
  3924)
- Im Mix in derselben Bewegung: Funkfilter und Helmakustik fallen weg, der Klang öffnet sich vom Kopf in den Raum (T29 wird
  voll); aus den Ohrschalen dringt blechern das Motiv (Einzeltöne mit Bandpass, mit der Bewegung der Schalen geschwenkt).
- Dauer: 1,5 s · Schleife: nein · Ebene: G

```text
Over-ear headphones being lifted off the head, soft leatherette ear cushions sliding away from the ears with a gentle rustle against hair, close, quiet small room.
```

### Ton T32

- Zeit: 65,60 s (Bild 3936) · Ereignis: Blick ins Zimmer – langes Ausatmen (4 s) · Spitze: weicher Beginn auf Bild 3936
- Dauer: 5 s, auf 4 s · Schleife: nein · Ebene: A (ohne Helm, im Raum, nicht mehr binaural nah)

```text
One long, slow, deeply relieved exhale through the mouth lasting about four seconds, natural and human, in a quiet small room with a little soft room reflection, no enclosure, isolated breath only.
```

### Ton T33

- Zeit: 69,00 s (Bild 4140) · Ereignis: der Kopfhörer liegt auf dem Tisch – Bügelklick · Spitze: Bild 4140
- Dauer: 1 s · Schleife: nein · Ebene: G (Klangfamilie mit T30, aber klein und echt; am Drehort aufnehmbar, §10.5)
- Ein Geräusch: nur der Bügelklick; das Aufsetzen auf dem Holz kommt aus der Drehort-Aufnahme „Ablegen auf dem Tisch“ oder entfällt.

```text
One small click of a plastic and metal headphone headband hinge snapping into place, close, dry, quiet room, single click.
```

### Ton T34

- Zeit: 71,40 s (Bild 4284), Fenster bis 74,60 s · Ereignis: Lampe, dann Schwenk zum Fenster · Wortbeginn auf Bild 4284
- Dauer: Satzlänge (nie beschleunigen) · Schleife: nein · Ebene: S – ohne Filter, nah, trocken mit wenig Zimmerklang
- **Fenster geprüft: nein.** 20 Silben bei 4–4,5 Silben/s plus Pause → Soll ≈ 4,7–5,5 s, Fenster 3,2 s. Vorschlag: Wortbeginn
  **70,60 s** (Bild 4236), Satzende vor T36 (76,00 s); endgültig nach der Probeaufnahme in Tor 0, vor dem Dreh von S17.

```text
[warm, close, calm, unhurried, quietly certain] Jeder Betrieb ist eine eigene Welt. [short pause] Seine Website ist die Tür hinein.
```

### Ton T35

- Zeit: 73,40 s (Bild 4404) · Ereignis: Mond im Fenster – das Klavier spielt die vier Töne und den fünften, unter dem Satzende:
  zu Hause · Einsatz des ersten Tons auf Bild 4404
- Dauer: Stück B 73,40–85,00 s (11,6 s, mit Reserve erzeugen) · Schleife: nein · Ebene: M + T
- Spielt der Take das Motiv nicht erkennbar, wird es aus M5 gesetzt, der Take bleibt leise Unterlage. T39 liegt im 2. Abschnitt.
- Energie je Szene (Feld `musik`): 2,0 bis 77,40 s (S17, Stückzeit 0:04) · 1,5 bis 83,40 s (S18, 0:10) · 0,5 bis 85,00 s (S19).

```text
Instrumental only, solo felt piano, no other instruments. Key: [KEY FROM GATE 0], tempo: [BPM FROM GATE 0], slow and rubato. 12 seconds. Close, warm, intimate felt piano in a small quiet room, soft hammers, audible gentle pedal. No strings, no pads, no drums, no sentimentality.
0:00–0:04: a simple four-note phrase that stays open like a question, then a fifth note that resolves it calmly, energy 2 of 10.
0:04–0:08.5: almost nothing, a held soft chord, then three single soft notes evenly spaced about half a second apart, quiet, energy 1.5.
0:08.5–0:12: the last chord rings out naturally, energy 1.5 until 0:10, then falling to 0.5 and fading to silence.
```

### Ton T36

- Zeit: 76,00 s (Bild 4560) · Ereignis: die Seite springt eine Raste – dieselbe Mausrad-Raste wie in Bild 1 · Spitze: Bild 4560
- Dauer: Datei T02 · Schleife: nein · Ebene: W (jetzt deutlich hörbar, im Raum: die Auflösung des Zuckens in Bild 1)
- **Nicht neu erzeugen:** Datei von T02 (wenn am Drehort aufgenommen, §10.5: dann beide Stellen mit der echten Raste).

### Ton T37

- Zeit: 76,65 s (Bild 4599) · Ereignis: Klick, der Portal-Kreis öffnet sich · Spitze: Bild 4599
- Dauer: 0,5 s · Schleife: nein · Ebene: W

```text
Single soft click of a computer mouse button, clean and short, close, quiet small room, no reverb tail.
```

### Ton T38

- Zeit: 77,60 s (Bild 4656), Fenster bis 79,40 s (der Satz erscheint Wort für Wort mit der Stimme) · Wortbeginn auf Bild 4656
- Dauer: Satzlänge (nie beschleunigen; passt der Satz nicht, rückt der Kartenaufbau in der Zeitleiste) · Schleife: nein · Ebene: S
- Wortbeginne aus dem Audio messen (`ton/wortbeginn.py`) – sie steuern das Erscheinen der Wörter auf der Karte.
- **Fenster geprüft: nein.** 10 Silben bei 4–4,5 Silben/s → Soll ≈ 2,2–2,5 s, Fenster 1,8 s. Vorschlag: 77,60–80,00 s;
  Wortmarke und B13 auf 80,10 s, Zielgruppen-Zeile auf 80,55 s, Dreiklang bleibt 81,00 s (nur Remotion); endgültig nach Tor 0.

```text
[calm, warm, close, simple, a quiet smile of recognition, no emphasis] Jede Welt beginnt mit einer Seite.
```

### Ton T39

- Zeit: 81,00 s (Bild 4860) · Ereignis: „Gebaut. Geprüft. Gepflegt.“ – drei leise Klaviertöne (81,00 / 81,45 / 81,90 s = Bild 4860 /
  4887 / 4914) · Einsatz je Ton auf sein Bild
- Die drei Töne werden aus dem Take T35 geschnitten und bildgenau gesetzt, sonst Einzeltöne M5. Der Akkord verklingt bis 85,00 s.
- Dauer: **kein eigener Aufruf**, nur Abschnitt von T35 (Stückzeit 0:07.6–0:08.5 in 0:04–0:08.5); Erzeugungslänge siehe T35
  · Schleife: nein · Ebene: M + T. Unten die Briefzeile für einen Kompositionsplan.

```text
0:04–0:08.5: almost nothing, a held soft chord, then three single soft notes evenly spaced about half a second apart, quiet, energy 1.5.
```

### Ton T40

- Zeit: 82,40 s (Bild 4944) · Ereignis: Knopf „Projekt besprechen“, ein feiner Ring schließt sich – weicher Klick · Spitze: auf
  dem Bild, in dem der Ring sich schließt (Bild 4944) · Dauer: 0,5 s · Schleife: nein · Ebene: W

```text
One soft, rounded, muted click of a small high-quality button settling into place, gentle and warm, close, dry, single click.
```

### Ton T41

- Zeit: 83,60 s (Bild 5016) · Ereignis: Ausklang – draußen pfeift eine Amsel die ersten Töne des Motivs · Einsatz auf Bild 5016
- Dauer: 6 s erzeugen · Schleife: nein · Ebene: G (fern, durch das offene Fenster)
- Eine erzeugte Amsel pfeift kein vorgegebenes Motiv: einzelne Rufe aus dem Take schneiden und in der Tonhöhe so setzen, dass
  sie die ersten Töne des Motivs aus Tor 0 ergeben; natürlich klingen lassen, nicht glattstimmen. Diese Datei gehört **nur** dem
  einzigen Wink (Drehbuch §0.2 Nr. 11); die ferne Amsel davor ist B14. Ausweich: Amsel am Drehort (§10.5).

```text
A single blackbird singing a few clear, slow, fluted notes with pauses between them, outdoors, heard from inside a quiet room through an open window, distant, calm, no other birds.
```

## 4. Musik und Motiv

**Aufbau:** Zwei Stücke, instrumental, **zuletzt gegen das fertige Bild** (Playbook §6, Drehbuch §9.5 Tor 5): **Stück A**
„Traum“ 8,50–60,00 s (Brief T08, Abschnitte T14, T23, T27) und **Stück B** „Zimmer“ 73,40–85,00 s (Brief T35, Abschnitt T39).
Dazwischen keine Musik – nur Raumton, Atem, Klicks und das blecherne Motiv (M1, Ebene T). Die Energiewerte der Briefe sind das
Feld `musik` der Szenen **S01–S14 und S17 (ab 73,40 s)–S19**. **Abweichung:** Die Zeitleiste führt S15 1,0, S16 1,5 und S17 2,0
schon ab 70,40 s, obwohl dort keine Musik klingt – Vorschlag: S15 und S16 auf 0; S17 behält 2,0 für Stück B (offener Punkt 8).

**Abschnittslänge:** Ob `eleven_music_v2_5` Abschnitte mit eigener Länge annimmt (Kompositionsplan) und ab welcher Mindestlänge,
ist **noch nicht geprüft** (gratis im Modell-Leitfaden, Tor 0). Annahme bis dahin ≥ 3 s: Alle Briefabschnitte sind ≥ 3 s; T23 und
die Dreiton-Stelle T39 sind keine eigenen Abschnitte, ihre Feinheit entsteht im Mix bzw. Schnitt. Sonst gilt der ganze Brief.

**Das Motiv** (Tor 0, vor allem anderen): vier Töne offen wie eine Frage, der fünfte schließt – **Töne, Tonart, Tempo stehen
noch nicht fest** (Platzhalter `[KEY FROM GATE 0]`, `[BPM FROM GATE 0]`). Es wird aus **Einzeltönen** gebaut (je Klangfarbe ein
Ton, auf die Motivtöne gestimmt, bildgenau gesetzt); die Musik-KI liefert nur die Unterlage. Klangfarben (Drehbuch §4): Spieluhr ·
Klöpfel auf Holz · Glas · Teller · Klavier · Amsel.

### Motiv M1

Spieluhr – T08 (Mond, ab 8,50 s), später blechern aus den Ohrschalen (T31). Ein Ton, 3 s, auf jede Motivstufe gestimmt.

```text
One single clear note of a small music box comb being plucked, delicate metallic tine with a soft natural decay, very close, dry, isolated, no melody.
```

### Motiv M2

Klöpfel auf Holz – Werkstatt (S02) und Seite Eiche & Span (S07, schneller). Ein Ton, 1,5 s.

```text
One single muffled wooden mallet strike on a tuned hardwood bar, warm and dull with a short woody resonance, close, dry, isolated, no melody.
```

### Motiv M3

Glas – vier Messpunkt-Töne (T14), der gläserne Ton in S08 (T26). Ein Ton, 3 s.

```text
One single pure tone of a thin crystal glass struck lightly with a small soft stick, clear and bright with a long clean ring, close, quiet room, isolated.
```

### Motiv M4

Teller – die Teller klingen beim Abheben in den Tönen des Motivs (S04). Ein Ton, 2 s.

```text
One single ringing tone of a thin porcelain plate rim tapped lightly with a metal spoon, clear and slightly bell-like with a short shimmer, close, dry, isolated.
```

### Motiv M5

Klavier – Ausweich für T35 und T39, wenn Stück B das Motiv nicht erkennbar spielt. Ein Ton, 4 s, auf jede Stufe gestimmt (bei
Klavier besser je Motivton eine eigene Erzeugung als starkes Umstimmen).

```text
One single soft note on a felt piano, warm and close, gentle hammer, natural sustain and slow decay, quiet small room, isolated.
```

## 5. Begleitgeräusche ohne T-ID

Aus dem Drehbuch (§4 „Ton“ je Szene), in der Zeitleiste noch ohne eigene ID. Vorschlag: die Ereignisse mit Spitze (B02 je
Einatmen, B03, B04, B06, B07, B10, B13) als T42 ff. in `zeitleiste.json` nachtragen, damit die Synchronprüfung sie misst;
Teppiche und die ferne Amsel B14 bleiben ohne Spitze.

### Begleitung B01

Anzug knarzt leise (Traum, S01–S13, unter Bewegungen) · 3 s · Schleife nein · Ebene G, sehr leise.

```text
Faint creak of stiff layered heavy fabric and thick rubber seals flexing as someone shifts their weight, close, dry, quiet.
```

### Begleitung B02

Ventil zischt bei jedem Einatmen im Helm (S01–S09) · 1 s · Schleife nein · Ebene A, unter dem Atem.

```text
One short soft hiss of a small pressure valve opening briefly, close, dry, quiet.
```

### Begleitung B03

Dachbalken knackt, Vorlauf ab 14,00 s (vor der Naht N1, Bild 840) · 1,5 s · Ebene G, fern.

```text
One single dry creak of an old wooden roof beam settling in a large empty workshop, distant, natural room reverb.
```

### Begleitung B04

Späne knistern unter dem Stiefel (S02, 15,00–26,25 s, Bild am Schritt abnehmen) · 1,5 s · Ebene G.

```text
A heavy boot stepping onto loose wood shavings on a wooden floor, dry crunch and crackle of curled shavings, close.
```

### Begleitung B05

Raumton Praxis „kleiner heller Raum, fast lautlos“ (S03, 26,25–34,68 s) · 10 s · Schleife ja · Ebene B.

```text
Near-silent room tone of a small quiet treatment room, faint air, very low steady hush, no voices, no ventilation noise, seamless loop.
```

### Begleitung B06

Papierrolle auf der Liege (S03, am Bild abnehmen) · 2 s · Ebene G.

```text
A roll of thin paper sheeting being pulled and unrolled across a padded surface, crisp light paper rustle, close, quiet room.
```

### Begleitung B07

Das Lot setzt auf – „tock“ (S03, am Bild abnehmen) · 0,5 s · Ebene G.

```text
A small heavy metal weight touching down on a wooden floor, one short clean tock, close, quiet room.
```

### Begleitung B08

Glut knistert (S04, 34,68–41,02 s; in S09 im Schnitt zum Klickrhythmus der acht Rasten geformt) · 10 s · Schleife ja · Ebene B.

```text
Charcoal embers crackling softly in a grill after closing time, gentle irregular pops and ticks, close, steady, seamless loop.
```

### Begleitung B09

Dunstabzug brummt tief (S04) · 10 s · Schleife ja · Ebene B.

```text
Low steady hum of a large kitchen extractor fan running on low speed, soft airy rumble, distant, constant, seamless loop.
```

### Begleitung B10

Seitenklang (S07, ab 49,33 s): im Drehbuch nicht näher bestimmt. Vorschlag: ein leises weiches Einrasten der Seite mit
Nachfedern, je Rastenfolge einmal · 0,5 s · Ebene W. Elias kann es streichen; dann tragen Rasten und Klöpfel allein.

```text
One soft, smooth, cushioned settle of a sliding drawer stopping gently in place, a tiny damped bounce, close, dry.
```

### Begleitung B11

Dauerscroll (S10–S13, 55,50–60,00 s) · 5 s · Schleife ja · Ebene W, Dichte steigt mit der Abspielrate, nicht der Pegel.

```text
Continuous rapid ratcheting of a free-spinning computer mouse scroll wheel, dense fast small plastic clicks, close, dry, seamless loop.
```

### Begleitung B12

Fallwind – der Atem wird Fallwind (S10–S13, 55,50–60,00 s, endet hart mit T28) · 5 s · Schleife nein · Ebene A.

```text
Rushing wind roaring past the ears during a fast free fall, steady dense whoosh slowly rising in pitch, no impact at the end.
```

### Begleitung B13

Papiergeräusch: das Eselsohr der Wortmarke knickt um (79,60 s, Bild 4776, 0,3 s) · 0,5 s · Ebene W.

```text
One quick soft fold of a corner of thick paper, a crisp small crease, close, dry, single event.
```

### Begleitung B14

Ferne Amsel unter T29 (ab 61,40 s) und in S16 · 20 s · Schleife nein · Ebene B, sehr leise, ohne Spitze. Eigene Erzeugung,
Rufe **unverändert** (keiner darf wie die Motivtöne von T41 klingen – gegen T41 abhören). Drehort-Raumton (§10.5) ersetzt B14.

```text
A single blackbird singing an irregular, wandering song with long pauses, outdoors, far away, heard faintly through an open window from inside a quiet room, calm, no other birds.
```

## 6. Mischung

- **Ziel:** −14 LUFS integriert, −1 dBTP, Zwei-Pass linear (Playbook §6). Der Film lebt von Dynamik (Stille, T30): die
  Lautheitsspanne wird gemessen und begründet, nicht auf LRA ~3,5 gepresst. Helmakustik und Funkband je **ein** gemeinsamer Effekt.
- **Ducking, Breite, Schnitt:** Werte in der Tabelle; Teppiche (B) unter Ereignisspitzen kurz zurück; bei 60,00 s alle Spuren
  auf Bild 3600, 1–2 ms Abblende, dann echte digitale Null bis 61,40 s.

**Startwerte** – zum Nachhören, **keine Messergebnisse**. Quelle: Nachtfahrt-Pipeline (`stimmschnitt2.py`, `endmix2.py`,
`geraeusche2.py`); ohne Quellenangabe = Planwert dieses Blatts. dB relativ zur Stimme (−16 LUFS).

| Was | Startwert |
|---|---|
| Stimme S | −16 LUFS, −1,5 dBTP (`stimmschnitt2.py`) |
| Musik M | Grundlautheit −28 LUFS (= −12 dB), Verlauf je Szene nach Feld `musik`; Hochpass 50 Hz |
| Ducking Musik | Sidechain aus der Stimme: Schwelle 0,03, Ratio 5, Attack 20 ms, Release 350 ms (`endmix2.py`); Ziel −4 bis −6 dB, nachhören |
| Senke Musik | 3 kHz, Q 1, −3 dB (`endmix2.py`); unter dichten Überlagerungen −6 dB (Playbook §6) |
| Ereignisse G/W | −9 bis −25 dB (Spanne `geraeusche2.py`); Start G −15 dB. W: S01–S04 −28 dB, S05–S06 −22 dB, ab S07 auf Höhe des Atems |
| Atem A | −12 dB; B02 6 dB unter dem Atem |
| Teppiche B | −20 bis −27 dB (`geraeusche2.py`); T29 und B14 −32 dB, ab T31 T29 auf −26 dB |
| Motiv T | 3 dB über der Musik zur selben Zeit |
| T30 | Spitze 6 dB über der lautesten übrigen Ereignisspitze, im Endmix ≤ −1 dBTP |
| Funkband | Bandpass 300–3400 Hz, leichte Sättigung, Rauschen −40 dB, mono |
| Helmakustik | eine Raumantwort für Atem und Funk: Nachhall 0,25 s, nass −18 dB, endet mit T31 |
| Kopfhörerklang bis 44,40 s | Musik mono, Hochpass 400 Hz, Tiefpass 2,5 kHz, 800 Hz −6 dB, trocken |
| Öffnung T23 | je 0,15 s Übergang auf den Bildern von T22: 44,40 Höhen (Tiefpass → 8 kHz) · 44,55 Mitten (800 Hz → 0 dB) · 44,70 Raum (Hall −18 dB) · 44,85 Bass (Hochpass → 50 Hz) · 45,00 Luft (Tiefpass aus), bis 46,5 s eingeblendet |
| Breite T24 | mono → volle Stereobreite in 0,3 s ab Bild 2904 |

- **Prüfung am Kopfhörer:** Atem nicht unangenehm nah, T30 nicht schmerzhaft, Öffnung hörbar, keine Knackser. **Am Lautsprecher**
  (Handy, Laptop): T09 über Obertöne hörbar, Stimme verständlich, Monosumme ohne Auslöschung, Shepard-Anstieg kippt nicht in Lärm.
  Elias erfährt ehrlich, was nur gemessen und nicht gehört wurde (Playbook §9).

## 7. Pipeline (`werkzeuge/video-film/ton/`)

1. **Bildereignisse:** Ereignisbild = `round(zeit_s × 60)` aus `zeitleiste.json`; B-Ereignisse vorher als T42 ff. nachtragen,
   `zeitleiste.py pruefen` mit 0 Mängeln.
2. **Messen:** jede Datei in `messung.json` (LUFS, Spitze, Stille am Anfang), die Spitze am fertig bearbeiteten Clip.
3. **Spitze aufs Bild:** lautester Punkt (2 ms geglättet) jedes Ereignisgeräuschs auf sein Bild (Muster `geraeusche2.py`), nie
   auf den Ereignisbeginn (Fehler aus v1, Playbook §5); Teppiche weich ein und aus.
4. **Synchronprüfung:** `ton/synchronpruefung.py <ereignisspur.wav> <ton.wav> [film.mp4]`, Toleranz 1 Bild (16,7 ms);
   flächig über `FLAECHIG=…` nur gelistet: T09, T23, T27, T29, B05, B08, B09, B11, B12, B14; T01 benannte Ausnahme mit
   Toleranz 9 Bilder. Die Skripte erwarten `ereignisse` (Name → Bild, 60 B/s), unsere Zeitleiste hat `ton` als Liste – kleine
   Traum-Variante nötig (wie bei Uyghur); bei 24 B/s (Entscheidung 4) wandert die Bildrate mit.
5. **Endmischung** nach `endmix2.py` (Sidechain, Senke, Zwei-Pass −14 LUFS / −1 dBTP).
6. **AAC-Versatz** (42,7 ms): nach jedem Render verlustfrei neu verpacken (`-itsoffset -0.0426667`), Synchronprüfung mit dem mp4.
7. Fertiger Film zuerst auf die **private Prüfseite**; eingebaut wird erst nach Elias' Freigabe.

## 8. Reihenfolge

0. **Tor 0 (gratis):** Motiv festlegen – vier Töne und der fünfte, Tonart, Tempo; Stimmlage und Besetzung (Entscheidung 3);
   Elias spricht die fünf Sätze als Probe-Ton ein → Sprechdauer messen, Fenster T34/T38 in der Zeitleiste festlegen; Mindestlänge
   der Musikabschnitte im Modell-Leitfaden prüfen.
1. **Stimme** – Freigabe von Elias, Credits ≈ 1.700: Stimmdesign und Bibliotheksstimmen auf der Hörseite → Elias wählt → Takes
   der fünf Sätze → Transkript- und Wortbeginn-Prüfung → Fenster gegen die Probemessung bestätigen.
2. **Schnitt** (gratis): Bild steht (Remotion), Ereignisbilder aus der Zeitleiste gelten.
3. **Geräusche** – Freigabe von Elias, Credits ≈ 3.500: Atem, T-Ereignisse, Begleitgeräusche, Motiv-Einzeltöne – gegen den
   Schnitt gesetzt und synchron geprüft.
4. **Musik zuletzt** – Freigabe von Elias, Credits ≈ 1.800 (je ein Take) bzw. ≈ 3.600 (je zwei): Stück A und B gegen das fertige
   Bild, Schnitt auf Schlägen, dann Endmischung und Prüfungen.

Bei jeder neuen Stimm-Take oder Textänderung die Kette neu laufen lassen: Zeitleiste → Ton → Render (Playbook §12).

## 9. Kosten ElevenLabs (Bezugswerte, keine Abfrage, keine Freigabe)

| Posten | Bezugswert | Dieses Blatt |
|---|---|---|
| Stimme | Casting ~1.000, 60-s-Take ~860 (Playbook §11) | Drehbuch §9.4: Stimmdesign + Takes ≈ 1.700 |
| Geräusche | ~3.500 inkl. lange Teppiche (Bezugsfilm Seitenkapitän) | 26 T-Erzeugungen + 5 Motivtöne + 14 Begleitgeräusche (mit B14) = 45 Aufrufe; Wiederverwendung (T02) und Varianten (Atemsätze, T12) sparen Aufrufe |
| Musik | 900 je Take | Drehbuch: 2 Takes ≈ 1.800 – hier zwei Stücke: je ein Take ≈ 1.800, je zwei Takes ≈ 3.600 |
| **Summe** | | Drehbuch-Plan ≈ 7.000; mit je zwei Musik-Takes ≈ 8.800 |

**Varianten:** Angenommen ist die Connector-Voreinstellung – zwei Takes je Sprachaufruf, mehrere Varianten je Geräuschaufruf;
die Atemsätze und die Knarzer von T12 beruhen darauf. **Ob der Bezugswert 3.500 bzw. 1.700 diese Varianten einschließt, ist nicht
belegt.** Vor der Freigabe die Kosten je Aufruf mit Voreinstellung zeigen; wo eine Variante reicht, `generations_count` begrenzen.
Echte Kosten hängen von Längen und Modell ab. Vor jeder Erzeugung: was, wie viele Credits, wofür – erst nach Elias'
ausdrücklicher Freigabe, nie ein Aufruf doppelt.

## 10. Offene Punkte

1. Motiv (Töne, Tonart, Tempo) – Tor 0, setzt die Platzhalter in allen Musik- und Motivblöcken.
2. Besetzung und Stimmlage (Entscheidung 3) – Platzhalter im Stimmdesign.
3. Begleitgeräusche B02 (je Einatmen, aus den Atemzeiten T06/T07/T10/T13/T16/T20 und ihren Atemsätzen), B03, B04, B06, B07,
   B10, B13 als T42 ff. in die Zeitleiste. **Am Bild abnehmen** (Frames für `synchronpruefung.py`): T12 (Umkehrpunkte), T14 (vier
   Messpunkt-Töne), T18 (drei Klicks), T19/M4 (abhebende Teller), T25 (Klöpfel-Töne M2), T26 (gläserner Ton M3), B02, B04, B06, B07.
4. Traum-Anpassung der Ton-Skripte (Ereignisformat, Bildrate).
5. Seitenklang B10: behalten oder streichen.
6. Musik: ein oder zwei Takes je Stück (Kosten oben).
7. Optional Drehort-Ton (§10.5) für Raumton, Amsel, Raste, Bügelklick – ersetzt die jeweilige Erzeugung.
8. Zeitleiste (nicht dieses Blatt): Feld `musik` S15/S16 auf 0; Fenster T34 (Wortbeginn 70,60 s) und T38 (bis 80,00 s, Karte
   verschoben) nach der Probemessung in Tor 0 eintragen.
