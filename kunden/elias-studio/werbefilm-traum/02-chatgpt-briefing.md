# Werbefilm „Traum“ – ChatGPT-Briefing für die Skizzen (Auftrag A-124)

Stand 03.11.2026, Kommandeur Stahl. Grundlage: `00-grundlagen.md` (§1, §3, §5) und `01-drehbuch.md`; Zeiten und IDs nur aus
`zeitleiste.json`. Dieses Blatt wiederholt das Drehbuch nicht – es übersetzt es in **Stil, Wirkung, Stimmung, Kontext und roten
Faden**. ChatGPT entscheidet selbst, wie die Bilder aussehen (Elias' Vorgabe, Grundlage 1.8). Fest sind nur: der Anzug, die
tragende Form jeder Naht (Zwillingspaar oder Kippbild, wie Drehbuch §4.0), die Website-Regeln, „Handlung in der Bildmitte“ für
9:16 und die wenigen Gegenstände und Lichtrichtungen, die Handlung oder Naht brauchen – in jeder Karte unter **„Must be in the
story“**. Alles unter **„Mood and palette“** ist Stimmung, keine Vorschrift.

## Gebrauchsanleitung für Elias

1. **Neuer ChatGPT-Chat** für den ganzen Film (ein Chat hält den roten Faden). Wird er lang oder driftet der Anzug: neuer Chat,
   Master-Briefing erneut, dazu die zuletzt freigegebenen Skizzen als Referenz.
2. **Referenzbilder aus v3** zusammen mit dem Master-Briefing anhängen (4K-Originale in deinem Projektordner, kleine JPG-Fassungen
   gibt Claude auf Zuruf heraus):
   - v3 bei **51,0 s** – Astronaut auf dem Felsen (Anzug, Tonwert, Ruhe). Die Landefähre darin gilt nicht.
   - v3 bei **48,2 s** – Goldvisier mit Erdspiegelung. Die erhobene Hand darin gilt nicht.
   - v3 bei **1,5 s** – Mondboden: **nur Körnung und Streiflicht; der Abdruck rechts gilt nicht** (Drehbuch S01: keine Spuren).
     Besser: Claude gibt auf Zuruf nur die linke Bildhälfte ohne Abdruck heraus.
   - Erst zur Karte S05: v3 bei **67,0 s** – Hörwerk-Seite, **nur der Kopfhörer** als Gegenstand (Schrift und Browser nicht übernehmen).
   - **Nicht** anhängen: v3 bei 72,5 s (die „Raupe“ – genau das soll nicht wiederkommen).
3. **Master-Briefing** (unten) einfügen. ChatGPT antwortet mit einer kurzen Zusammenfassung und einem Anzug-Skizzenbogen. Diesen
   Bogen prüfst du; freigegeben ist er die Referenz für jede weitere Skizze mit Astronaut.
4. **Karten in Filmreihenfolge** einfügen, je eine Nachricht. Ausnahme: in S05 zuerst K10, dann K09. Jede Karte nennt in ihrer
   ersten Zeile („Attached“), welche freigegebenen Skizzen du anhängst und wofür – vor allem den **Partner an der Naht**: den
   Zwilling, wo es einen gibt, sonst das Bild davor in der Kette.
   Karten ohne neues Keyframe (S08, S09, S11, S12, S14, S18, S19) sind optional – nur für die Animatik.
5. Je Keyframe kommen **zwei Varianten**. Speichern als `<Keyframe-ID>-v<n>` (z. B. `K04-v1`, `K04-v2`); nichts überschreiben.
   Bilder ohne Keyframe-ID haben feste Namen: `K01-H2` (Haken „Der Himmel springt“), `K01-H3` („Falsches Spiegelbild“),
   `K-Fall-v1`/`-v2` (Hilfsbild „Fall“, S10), Stimmungsskizzen `S07-M`, `S08-M`, `S09-M`, `S10-M`, `S11-M`, `S12-M`, `S14-M`,
   `S18-M`, Drehskizzen `S16-P1`, `S16-P2`. ChatGPT liefert PNG; Claude legt nach der Prüfung nur die WebP-Fassung ab
   (Grundregel 8) und löscht die PNG erst nach deiner Freigabe.
6. **Zurück an Claude:** in Claude Code `/filmszene S04 – Skizzen` (Szenen-ID) und die Dateien schicken. Claude lässt den Agenten
   `kontinuitaet` prüfen (Zwilling als Überlagerung, Kippbild auf beide Welten, Anzug, Website-Anteil, Stimmung, 9:16-Mitte, Regeln) und gibt
   dir je Bild „passt“ oder „nachbessern“ samt einem Rückmeldeblock für ChatGPT. Du hast das letzte Wort.
7. Skizzen sind **Plan und Animatik, nie Filmmaterial**. Die Originale macht Higgsfield erst nach deiner ausdrücklichen
   Freigabe (`03-higgsfield.md`). Erfindet ChatGPT Schrift ins Bild, ist das immer „nachbessern“.

## Master-Briefing

```text
You are the concept artist for a short film. I will send you one card per scene. I will not tell you exactly what each image looks like – I describe style, effect, mood, context and the red thread. You decide the pictures. Please read everything below first; then reply with (1) five bullet points of what you understood and (2) one sketch sheet of the astronaut: front, side, back and three-quarter view, plus visor and glove in detail. Then wait for the first card.

PROJECT
A cinematic short film of about 85 seconds, working title "Before Waking" (German: "Vor dem Aufwachen"). It is made for a one-person studio that builds calm, fast, accessible websites for practices, workshops and restaurants – each business gets its own world instead of a template. The viewer must not suspect an ad until the middle of the film. No brand, no logo, no product name ever appears in your images. Your sketches are plans and a timed animatic; the final images are made later with another tool, using your sketches as guides.

THE STORY (the red thread)
A lone astronaut sits on the Moon, breathes, and hears a faint melody inside the helmet. When he looks up, the Earth hangs on a cable – it is the lamp of a carpentry workshop at night, and the fall begins. He follows the melody through a workshop, a physiotherapy practice and a restaurant; each world is shorter and stranger. In the middle he finds the source: a floating headphone that opens under his finger and shows what everything is made of – real parts of websites. The camera flies into it, and the worlds return as what they are: pages. Faster and faster the pages fall into each other until only a blinking cursor remains. Silence. A click, the helmet lifts – and a person in a room at dawn takes off their headphones and breathes out. Everything in the dream came from that room.

THE FORM
Every dream level is shorter than the one before (by a quarter). The fall runs towards one point at exactly 60 seconds: the cursor. There is not a single hard cut inside the dream. Every border between two worlds is a seam, and every seam is built in one of the two ways below.

THE SEAMS: TWINS AND TIPPING IMAGES (most important)
There are two kinds of seam images, and each card says which one it asks for.
1. Twin pair: two images that can be laid on top of each other. The same shape sits at the same place and size, the camera stands at the same height, the light comes from the same direction, the movement keeps its direction; only material and world change. Test: laid on top of each other, the main shape shows no double outline.
2. Tipping image: one single picture that honestly belongs to both worlds at once – the last image of one world and the first of the next. Test: you cannot say where the one world ends and the other begins.
A tipping image can also be the twin of its neighbour (the card then says so); then both tests apply. Where a card names the shape that carries, that shape is set; where it does not, you decide and tell me why. If two images are too different, the film cross-fades cheaply instead of transforming – that is the one thing we must avoid.

VISUAL WORLD AND STYLE
Each card has two lines about the look. "Must be in the story" names the few objects and light directions the action or the seam needs – these are story necessities. "Mood and palette" gives feeling and colour only – everything else is yours. Photoreal, cinematic stills, as if taken from a quiet feature film. Real places that are almost right – one detail is wrong, and the wrongness grows with every level: first only too perfect, then openly impossible. Never comic, never chaotic, always dignified. One warm line runs through all worlds: brass and gold (visor, lamp fitting, plumb bob, plate rim, ear-cup ring, desk lamp). Our "code" is brass, not green. Each world has its own light and colour; the light of the world paints the suit. Rings and circles return again and again (visor, lamp globe, measuring point, plate, brass ring, annual rings, cursor). The camera changes with depth: first a film camera (pulling back, rising, tilting, gliding, circling), then a product camera (one axis, perfect light), then a browser camera (scrolling in clicks), at the bottom stillness, at the end a real handheld camera in a real room.

THE SUIT PRINCIPLE
The suit is the white canvas on which every world paints its light. The worlds change – he never does. Fixed identity in every image: a modern, slightly retro spacesuit in warm off-white, matte woven fabric with soft folds; a rounded helmet with an opaque mirrored gold visor that is always closed – never a face, never eyes; a thin brushed-brass neck ring; a boxy off-white backpack with one small round gauge without numbers; off-white gloves with dark grey rubber fingertips; grey-white boots with evenly ribbed soles; fine grey moon dust on knees and boots in every world (he carries the Moon through all dreams). No patches, badges, flags, names, numbers or writing on the suit. He has no gender, no name. Body language: calm, careful, slow, as if he weighed less.

THE WEBSITE WORLD
The worlds are made of websites – but you never draw a website. Real pages are captured from the real sample sites and added later in editing; AI-made text would be garbled. So: never invent readable text, letters, numbers, buttons or UI. Where a page, a screen, an engraving or a written measurement will go, leave the surface plain, blank or softly abstract (calm colour blocks in that page's colours), and tell me in your reply which sample page belongs there. The website share grows with depth: at first it is only a feeling of "too perfect" (grain running in straight lines like a text block, dust standing in an exact grid), later it is openly material, at the bottom everything is pages. The traces are strengths, never errors: a flawless measure, a line that draws itself, a focus frame like keyboard navigation, a cursor. No loading bars, no glitches, no waiting.

THE SAMPLE PAGES (colour worlds, for atmosphere only)
Eiche & Span – carpentry, night blue and oak. Lotlinie – physiotherapy, bright and airy, a plumb line from ear to ankle. ZEYTIN & GLUT – grill restaurant, embers, round food photos. Hörwerk – headphones, black and brass. For the fall at the bottom: Blütenwerk Lilou (florist, pastel pink and cream), Zeit für Zimt (café, dark green), Lindgrund (watchmaker, green dial), Salon Ambra (hair salon, black and coral), Pulsraum (fitness, black and neon yellow-green), Nachtfalter (cinema, black and white noir), Pixelhain Arcade (pixel art, night blue and neon), Zwischenbild (motion design). The studio's own page: cream, green, anthracite. All of these are sample pages, not real customers.

FORMAT
16:9 landscape. A tall 9:16 version is cut from the middle of your images, so the action, the figure and the shape that carries across the seam sit in the middle third. Leave a little air at the edges – start and end of a camera move are taken as slightly different crops of one image.

NEVER
No logos, brands or product names. No real persons, no celebrities, no face in the helmet, no recognisable person at all – in the real room only anonymous hands. No green character rain, no pills, no white rabbit, no spoon, no quotes or recreated shots from famous films (the feeling of a simulation is fine; the look must be our own). No text of any kind. No lunar lander, no flag, no thumb held up against the Earth, no footprints, tracks or tyre marks in the dust (he is alone, nobody knows how he got there). No glow rings, holograms or sci-fi interfaces. No prices, no figures, no product data.

HOW TO ANSWER EACH CARD
Two variants per keyframe I ask for. Under each, two or three sentences: what carries across the seam, what the strange detail is, which surfaces you left blank for which sample page. Name each image by its keyframe ID in your reply (for example "K04 – variant 1"); for sketches without a keyframe ID use the name given in the card (for example "S16-P1"). Never put a name inside the image. If a card leaves something open, decide it yourself and tell me why.
```

## Karten je Szene

### Karte S01

```text
CARD S01 · The Moon · "Catching breath" · 0.00–15.00 s · level L00, the surface
Attached: v3 references (astronaut on the rock, gold visor, moon ground) and your approved suit sheet.

Place in the story: The very first images. Nothing comes before – no black, no fade-in; frame one is already a picture. In the first seconds the glass begins to mist from below and swallows the Earth for a moment, then clears – leave the lower part of the view calm and uncluttered, and let a thin warm gold edge show where the helmet frames the view. Afterwards the Earth turns out to hang on a cable and becomes the lamp of a workshop at night (card S02).
Effect on the viewer: Grip them in the first second, on a muted phone, without any hint of an ad. One impossible detail does it: the Earth sways slowly like a hanging lamp (the swaying is animated later – you only need to make it feel possible). Then the hook gives way to calm: a lone being on the Moon who breathes and longs for home.
Mood: Silence, loneliness, longing, a held breath. Beautiful and very slightly wrong.
Must be in the story: the sun from the right (it carries into the next world as light from top right); a small, crisp Earth (it becomes a lamp); the closed gold visor. Large in frame: first the view out of the helmet, then the visor close, then the whole figure.
Mood and palette, your choice: stark and silent – black, cool greys, one blue-white jewel; the gold of the visor as the first warm line of the film.
Red thread and what carries: One continuous movement without a cut – from inside the helmet, through the glass to the outside, back and up to the figure. K01 and K02 are twins: the Earth stays at the same place; what changes is only "seen through glass" into "mirrored in gold". In K03 he sits in profile on a rock, head slightly lowered – he is listening to a faint melody, chest in the middle of a breath. This seated pose and the light from top right are the anchor for the next world: he will sit exactly like this in the workshop.
Website trace (0 %, hidden): nothing visible. A single star near the Earth will later blink with the rhythm of a text cursor – give it a calm dark place to live.
Keyframes needed: K01 (the view out of the helmet), K02 (outside, the gold visor close, the same Earth mirrored), K03 (on the rock, listening).
Also needed for a hook test: one sketch each of two alternative first frames – K01-H2 "The sky jumps" (the gold visor fills the frame from outside, mirroring Earth and plain) and K01-H3 "Wrong reflection" (the visor mirrors not the Moon but a small dim room with a round lamp on a cable, a glowing laptop and a window; nothing readable).
Your freedom: Angle, crop, the rock, how much horizon, how the helmet rim frames the view, how the gold catches the sun. Keep the Earth free of the helmet rim so it can move on its own.
```

### Karte S02

```text
CARD S02 · The workshop · "The flawless measure" · 15.00–26.25 s · level L01 · sample page Eiche & Span
Attached: approved K03 (twin partner of K05), approved K01/K02 (the Earth).

Place in the story: Straight out of the Moon: the camera rises towards the Earth on its cable – and it is the glass globe of a pendant lamp; the camera passes underneath it and tilts down into a carpentry workshop late at night. Afterwards a brass plumb bob leads down into a bright physio practice (S03).
Effect on the viewer: "Wait – how did he get here?" Almost real; only details are wrong. Every craftsman knows the workshop alone at night. Wonder, not fear.
Mood: Still, after hours, a warm lamp in the night blue. Sawdust hangs in the light and does not fall. Shavings fly back into the board, which becomes smooth.
Must be in the story: the lamp light from top right (as the sun on the Moon); an oak block where he sits; a brass plumb bob on a string (it leads into the next world); one plain board for the measurement; a finished piece waiting for pickup with an empty tag – the business, without writing; moon dust leaving a fine grey trace on the oak where his glove touches it. The figure half-close.
Mood and palette, your choice: night blue and warm milky light, the honest warmth of wood, a craft space at rest.
Red thread and what carries: K04 is the tipping image of the seam Moon → workshop: one luminous globe on a thin dark cable that is honestly both – the Earth with stars around it and the glass globe of a lamp with dust in its light. Shape and place carry; the colour turns from Earth blue to warm milk white; the black stays. K05 is the twin of K03: he sits on an oak block where the rock was, in the same pose, with the same light direction; moon dust has become shavings, the horizon has become the edge of the workbench.
Website trace (2 %, noticed on a second look): too perfect – a hand's width of grain runs in straight lines like a block of text; the dust stands in an exact grid for a moment. A pencil measurement on a board is added later from the real page: leave that board plain.
Keyframes needed: K04 (the tipping image Earth / lamp), K05 (the workshop under the lamp, him in the pose of K03).
Your freedom: What the workshop looks like, its tools and wood, how the lamp hangs, how the Earth turns into glass – as long as one shape is honestly both, and he stays where the rock was.
```

### Karte S03

```text
CARD S03 · The practice · "Brought into plumb" · 26.25–34.68 s · level L02 · sample page Lotlinie
Attached: approved K05 (the image before K06 in the chain: the plumb bob on its string, his position, suit and proportions), approved K04 (night colours).

Place in the story: The camera follows the plumb string downwards; behind the string the wood turns white from below – and we arrive in a bright treatment room in the morning. Afterwards the camera glides low over the light floorboards, which darken into a restaurant (S04).
Effect on the viewer: The brightest images of the film – they reset the eye after the night. For the first time something behaves like software, but gently. A physiotherapist recognises her posture analysis. The question: is there a human inside the suit?
Mood: Clear, airy, quiet morning. Being seen. He stands upright and still.
Must be in the story: soft window light from the left and light wooden floorboards (both carry into the restaurant); a treatment couch freshly covered for the first appointment; his shadow on the wall, which straightens up a moment before he does. The whole figure in frame.
Mood and palette, your choice: white, airy, clean morning light – the cleanest air of the film.
Red thread and what carries: K06 is the tipping image of the seam workshop → practice: the string with the brass plumb bob, above still the dark oak of the workshop, below already the white of the practice; at the edges his glove and the tip of his boot. The vertical line carries: the string becomes a drawn line, the plumb bob becomes a measuring point at the ankle, the tilt keeps its speed. K06b is the anchor in the middle of this world: him standing upright in the room, the line exactly vertical through him – same suit and proportions as K05, a new room.
Website trace (3.5 %): a fine line draws itself through him from top to bottom, small round measuring points appear at ear, shoulder, hip, knee and ankle; stripes of window light on the wall fall in the column grid of a page. The line is the real drawing animation of the sample page Lotlinie and is added later – in the sketch only hint at it as light.
Keyframes needed: K06 (the tipping image string / line), K06b (upright in the room).
Your freedom: The room, the window, the couch, how the white "rises" from below, where his shadow falls – keep the light from the left, it must carry into the next world.
```

### Karte S04

```text
CARD S04 · The restaurant · "The glass at the visor" · 34.68–41.02 s · level L03 · sample page ZEYTIN & GLUT
Attached: approved K06b (light from the left, floorboards), approved K05 (suit).

Place in the story: The floorboards under the gliding camera turn dark; the light still comes from the left – now from embers. A grill restaurant after closing. Afterwards a plate tips onto its edge, and its rim becomes a thin golden ellipse in near-black: the brass ring of a floating headphone (S05).
Effect on the viewer: Warmth he cannot touch. He lifts a tea glass to drink, and it clinks against the visor – he cannot drink. Dignified, not comic. A restaurant owner recognises his place after closing. Then physics breaks openly: the plates rise and circle him like moons.
Mood: Dark, warm, glowing, closing time; longing becomes physical. A voice on the radio asks "…who is playing?" – the melody is nearer than ever.
Must be in the story: embers as the light, still from the left; a round table with white plates in a circle (they will rise, and one rim becomes the next seam); a tea glass. Close at the table. The camera starts a slow circle around the table, moving to the right.
Mood and palette, your choice: dark, warm, glowing, closing time – ember orange in deep brown and black.
Red thread and what carries: K07 is the tipping image of the seam practice → restaurant: floorboards seen obliquely from above, light from the left, his shadow lying to the right, the wood tone halfway between light and dark. Light direction, the boards and the shadow carry; only the wood darkens and morning light becomes ember glow. K08 is the middle of this world: the table, the plates in their circle, the glass at the visor, the glow behind – the camera already in its circling move, never standing still.
Website trace (6 %): a fine focus frame, the kind keyboard navigation draws around a chosen element, jumps from plate to plate (added later – leave the plates clean); the steam of a dish draws one exact thin circle. No readable menu, no prices.
Keyframes needed: K07 (the tipping image boards / boards), K08 (at the table, the glass at the visor).
Your freedom: The room, the grill, the table, how the glass meets the visor, the warmth of the light – keep it dignified and keep the circle of plates.
```

### Karte S05

```text
CARD S05 · The headphone: the source · turning point · 41.02–45.77 s · level L04 · sample page Hörwerk
Attached: v3 reference at 67.0 s (only the headphone as an object – ignore the page, the browser and all text), approved K08 (circling plates, glow), approved suit sheet (glove).

Place in the story: The circling continues; the golden ellipse of the plate rim becomes the brass ring of an ear cup. In a black void floats a headphone – the melody he has followed since the Moon comes from it. His glove presses a small brass plaque. Afterwards the front ear cup opens along its own axis and the camera travels inside (S06).
Effect on the viewer: Discovery and decision – he chooses. This is the middle of the film; from here on the simulation can no longer be missed. Precise and quiet, like the most beautiful product shot – but it is a dream.
Mood: Dry silence, focus, a held breath.
Must be in the story: a black void without floor or horizon; the brass ring of the front ear cup (the seam); the small brass plaque he presses; the cable plugged into its socket (the plug slides out in the next card); one key light from top left that never changes. Only his glove and the blurred edge of his helmet are in frame; the fingertip gives the real size.
Mood and palette, your choice: black, anthracite and brass, quiet materials, shallow depth of field – a product shot in a dream.
Red thread and what carries: K10 is the master image and comes first: the closed headphone in three-quarter view, a fingertip at the plaque, the same object as on the sample page so that film and page show one headphone. K09 is the tipping image of the seam restaurant → headphone and at the same time the twin of K10, made from a crop of it: a thin golden ellipse in near-black that is both the tilted plate rim and the brass ring of the ear cup. The circling movement carries and runs out into a very slow approach – no stop.
Website trace (10 %): two engravings from the real page come later – on the plaque and on the face of the brass ring. Leave both surfaces smooth and blank.
What went wrong last time (do not repeat): it looked like a collage – parts with their own light and perspective, both ear cups on one long line, glow rings, a loose cable. Here: one object, one camera, one light.
Keyframes needed: K10 first, then K09.
Your freedom: The angle of the three-quarter view, how the glove enters, how the ellipse sits in the dark, the exact materials – as long as it is one believable object.
```

### Karte S06

```text
CARD S06 · The headphone: putting it on · 45.77–49.33 s · level L05 · sample page Hörwerk
Attached: approved K10 (the master image – K11 is an edit of it).

Place in the story: After the press, only the front ear cup comes apart along its own axis – cover disc, brass ring, driver, cushion, and the plug sliding a little out of its socket – gently, like breathing out, with equal gaps and no rotation. Then the camera glides along the axis, over the cover disc, through the hollow ring and the empty housing; the parts close behind us – we sit inside the headphone. Ahead lies the dust cap of the driver with fine concentric rings. Afterwards those rings turn out to be the annual rings of oak (S07).
Effect on the viewer: This is the clasp of the film: putting it on means dreaming deeper, taking it off means waking up. From here on the viewer dreams along.
Mood: Precise, calm, a quiet awe.
Must be in the story: the same camera and the same light as K10 – nothing changes except the parts that move; in every image it is still clearly a headphone. No glow, no glass panels, no hologram.
Mood and palette, your choice: as K10 – black and brass, real materials only.
Red thread and what carries: K11 is an edit of K10: headband, joint, second ear cup and housing stay exactly where they are; only the parts of the front cup have moved along its axis. The framing is a little tighter and turned slightly towards the axis, because the camera is moving in. Ring and housing must read as visibly hollow, empty and matte inside, and the cover disc lies below the path the camera will fly – otherwise the flight through cannot be built.
Website trace (18 %): the inner wall of the housing carries the column grid of a page as fine grooves – material, not readable. Fine brass hairlines may lead away from the parts, without any values.
Keyframes needed: K11 (the opened ear cup).
Your freedom: The feeling of the gaps, the depth of field, how the hollowness becomes readable, how the cable lies in its calm curve.
Please: two variants, with your two or three sentences each.
```

### Karte S07

```text
CARD S07 · The workshop as a page · 49.33–52.00 s · level L06 · sample page Eiche & Span
Attached: approved K11 (K12 is made from a crop of it), approved K05 (the workshop).

Place in the story: The flight along the axis goes on through the centre of the rings – and out of the middle grows the workshop from S02, in exactly its old framing, but flat like a photograph. It splits into layers that drift apart in depth, and underneath lies the real sample page Eiche & Span. Afterwards we fly through the layers into the next page (S08).
Effect on the viewer: The backwards "aha": the worlds were pages all along.
Mood: Recognition, a first quickening; the camera now scrolls in small clicks.
Red thread and what carries: K12 is the tipping image of the seam headphone → pages and the twin of K11 (a crop of it): the dust cap of the driver seen close from the front, its fine concentric rings honestly also the annual rings in the end grain of an oak. The rings and the forward flight carry; silver and brass become oak.
Website trace (32 %): the real page, captured, never drawn. The flat workshop needs no new image (it is a crop of K05).
Keyframes needed: K12. Optional for the animatic: S07-M, one mood sketch of the flat workshop splitting into layers, the page layers as blank panels in night blue.
Your freedom: How the metal turns into wood, the scale of the rings, the depth of the layers.
Please: two variants of K12, with your two or three sentences each.
```

### Karte S08

```text
CARD S08 · The practice as a page · 52.00–54.00 s · level L07 · sample page Lotlinie
Place in the story: The layers of the workshop fly past the camera; behind them stands the sample page Lotlinie like a wall of the bright room, and its drawn figure draws itself – the same line that ran through him. Afterwards the restaurant returns as its page (S09).
Effect: Recognition of the second world; light, calm, a brief stillness while the line draws.
Mood: Recognition, calm, a short clear breath before the fall speeds up. Palette: the bright, airy white of the practice.
Website trace (56 %): the real page is captured – nothing for you to draw.
Keyframes needed: none. Optional for the animatic: S08-M, one mood sketch of how the page could stand in the bright room as a wall, the page area blank, and tell me where the drawn figure would sit.
```

### Karte S09

```text
CARD S09 · The restaurant as a page · 54.00–55.50 s · level L08 · sample page ZEYTIN & GLUT
Place in the story: The sample page ZEYTIN & GLUT lies like a floor under the circle of plates; its round food photos are the plates. The focus frame jumps on, now from photo to photo. Afterwards the fall becomes a shaft of pages (S10).
Effect: All three kinds of business have now been seen twice – as worlds and as pages.
Mood: Recognition, calm, warmth seen once more from above – already a little faster. Palette: embers, warm dark brown and black.
Website trace (100 %): the real page is captured – nothing for you to draw.
Keyframes needed: none. Optional for the animatic: S09-M, one mood sketch with blank round frames where the plates were, warm dark tones.
```

### Karte S10

```text
CARD S10 · Fly-through I · 55.50–56.63 s · level L09 · sample pages Blütenwerk Lilou, Zeit für Zimt, Lindgrund
Attached: approved suit sheet.

Place in the story: A shaft of pages, layer behind layer, each in its own colours; the camera falls through them, faster with every layer. Afterwards: faster still (S11, S12), then the visor-in-visor pull (S13).
Effect: Variety without a template – every world looks different; the fall towards collapse.
Mood: Falling, rushing, but still beautiful and ordered – never green columns on black, never flashing. The colours run once from light to dark.
Red thread: In every layer he falls along, small – one figure, reused many times.
Website trace (100 %): all pages are real captures, added later.
Keyframes needed: the helper image "Fall" (name it K-Fall): the astronaut falling, arms calm, slightly turned, dignified, never flailing – on an evenly grey background so he can be cut out. Optional for the animatic: S10-M, one mood sketch of the shaft with blank panels in the colours of these three pages.
Your freedom: His falling pose and angle, within calm and dignity.
Please: two variants of the falling figure.
```

### Karte S11

```text
CARD S11 · Fly-through II · 56.63–57.48 s · level L10 · sample pages Salon Ambra, Pulsraum, Nachtfalter
Attached: approved K-Fall (the falling figure from S10 – the same figure, reused).
Place in the story: The shaft of pages again, faster; the colours darker (black and coral, black and neon, black and white). He falls small along.
Mood: Faster, darker, still beautiful and ordered, never flashing.
Website trace (100 %): real captures, added later.
Keyframes needed: none. Optional for the animatic: S11-M, one mood sketch with blank panels in these colours and the falling figure.
```

### Karte S12

```text
CARD S12 · Fly-through III · 57.48–58.12 s · level L11 · sample pages Pixelhain Arcade, Hörwerk, Zwischenbild
Attached: approved K-Fall (the falling figure from S10).
Place in the story: The last and fastest layers before everything pulls into one point (S13). Night blue, neon, black and brass.
Mood: The deepest and darkest layer; a strange quiet before the point – still ordered, never flashing.
Website trace (100 %): real captures, added later.
Keyframes needed: none. Optional for the animatic: S12-M, one mood sketch, the deepest and darkest layer of the shaft.
```

### Karte S13

```text
CARD S13 · The pull: visor in visor · 58.12–60.00 s · level L12
Attached: approved K02 (K16 is an edit of it).

Place in the story: In the last page he stands small; his visor mirrors the next page, in which he stands again, whose visor mirrors the next – circles inside circles, darker and darker, all running towards one point. Afterwards the point becomes a cursor (S14).
Effect: "Who is dreaming whom?" – only as a feeling. The fall becomes endless.
Mood: Pull, vertigo, the last rise before silence.
Red thread and what carries: K16 is the twin of K02 – the same gold visor, now filling the frame, but its mirror surface is empty: an even, neutral grey, as if masked. The pages and his small figure are placed inside it later, again and again.
Website trace (100 %): all mirrored content comes from real captures in editing – the mirror must stay empty.
Keyframes needed: K16.
Your freedom: The curve of the visor, the gold rim, the highlight.
Please: two variants, with your two or three sentences each.
```

### Karte S14

```text
CARD S14 · The cursor · climax · 60.00–62.40 s · level L13, the bottom
Place in the story: Black. In the middle a slim cream text cursor blinks – with the rhythm of the star on the Moon. Nothing else, no typed text. Hard silence. Then a fine golden rim appears at the edge: the black is the inside of the visor, the cursor floats behind the glass like the first star. Afterwards: a click, the helmet lifts (S15).
Effect: Everything has fallen into one point. The tension is not released, it is held.
Mood: Held breath, hard silence after the rush of the fall; then the quiet surprise that the black is the inside of the visor – we are back where the film began.
Website trace (100 %): an empty page – the beginning of every page.
Keyframes needed: none (made in editing). Optional for the animatic: S14-M, one mood sketch of the moment the golden rim reveals that we are inside the helmet.
```

### Karte S15

```text
CARD S15 · The helmet lifts · 62.40–65.40 s · reality W (seen from inside)
Attached: approved K01 (K18 is an edit of it).

Place in the story: The view from inside the helmet as in the very first image. A click – the helmet lock. The helmet lifts slowly; its dark lower edge moves up, and below it morning blue appears. Never a head, hair or neck – only the view from inside. Afterwards real hands lift real headphones off in a real room (S16).
Effect: Waking up without a cut. "Where are we – still in the helmet?"
Mood: Release, first breath, cool dawn.
Red thread and what carries: K18 is the twin of K01: the same inside view, through the glass only black, in the middle a tiny point of light – the cursor as a star. K19 is the tipping image of the seam dream → room and an edit of K18 (its twin): a dark arch in the upper part of the frame, pulled down at both sides, that is both the lower edge of the helmet seen from inside and the headband with its cushions seen from under the headphones; below it morning blue. Here the picture source changes from generated to real footage, hidden in the moment the arch covers the frame. K19 is also the template for the real shoot – the shape must be something a real headphone lifted off a head can make.
Keyframes needed: K18, K19.
Your freedom: The curve of the arch, the quality of the morning blue, how the cushions read.
```

### Karte S16

```text
CARD S16 · Waking: headphones off · 65.40–70.40 s · reality W · real footage, filmed later
Attached: approved K19.

Place in the story: Real hands lift real over-ear headphones off; the cushion wipes upwards out of frame, in the same direction and speed as the helmet. The view from the eyes into a room at dawn: blue hour, the desk lamp still on. The hands put the headphones on the table. Afterwards the camera looks calmly around the room (S17).
Effect: Relief. Helmet off = headphones off = home. A long breath out.
Mood: Real light for the first time, quiet, a little grain, morning.
Purpose of your sketch: a shooting guide only – this scene is filmed for real and your image never appears in the film. Only anonymous hands; no face, no person, nothing personal.
Keyframes needed: none. Please make two point-of-view sketches as a guide: S16-P1, the moment the cushion leaves the frame (matching K19), and S16-P2, the headphones laid on the table.
```

### Karte S17

```text
CARD S17 · The room: everything he dreamed from · 70.40–77.40 s · reality W · real footage · sample page: the studio's own page
Attached: approved K04, K07, K08 (the dream worlds the room must echo).

Place in the story: One calm shot through the room at dawn. Everything in the dream came from here: the round glass lamp on its cable (the Earth on the line), a cold tea glass (the glass at the visor), wooden floorboards with morning light from the left, the real Moon in the window, the headphones on the table, a laptop with a page on it. The camera ends calm and frontal in front of the laptop, a hand already on the mouse. Afterwards a click opens a cream circle that fills the frame – the end card (S18).
Effect: The reason to watch again: "Why does this room feel familiar?" Calm as the promise of the brand.
Mood: Dawn, not night; quiet, clear, unhurried. Nobody is asleep over the computer, the computer types nothing, only the hand moves.
Purpose of your sketch: a shooting guide and a check of the dream residues – this is filmed for real. An anonymous room: no letters, no photos, no names, nothing that belongs to a real person.
Website trace (about 8 %): the real page is placed on the screen later – leave the screen blank and calm.
Keyframes needed (as guides): K20 (the room with all residues), K21 (the laptop frontal, the screen filling most of the frame, the hand at the mouse).
Your freedom: Which residues are seen first, how the room is arranged, the light – propose what makes the echoes felt without pointing at them.
```

### Karte S18

```text
CARD S18 · The end card · 77.40–83.40 s · card K
Place in the story: Cream fills the frame after the click. One after another: the closing sentence, the word mark, a line naming the businesses, three short words, one button – around which a fine ring closes, the ring of the film one last time – and a quiet line saying these were sample pages. Afterwards the card simply stays (S19).
Effect: The sender, and exactly one invitation to talk about a project. Calm, generous space.
Mood: Settled, warm, still.
Website trace (100 %): the card is set in editing; its words are fixed elsewhere.
Keyframes needed: none. Optional for the animatic: S18-M, one sketch of the rhythm of the card – cream, green and anthracite, the text as neutral placeholder bars, no letters, the ring around the button.
```

### Karte S19

```text
CARD S19 · Coda: the blackbird · 83.40–85.00 s · card K
Place in the story: The end card stands. Outside, a blackbird whistles the first notes of the melody from the dream – the only hint: was that still a dream? Nothing else happens.
Effect: A reason to watch again, carried only by sound.
Keyframes needed: none – the image stays as in S18. Nothing to draw.
```

## Rückmeldungen an ChatGPT

Rückmeldungen beschreiben **Wirkung, Stimmung und roten Faden**, nie Pixel, Maße oder Objektlisten. Ein Punkt je Nachricht,
das freigegebene Bild als Referenz anhängen. Den Rückmeldeblock von `kontinuitaet` kannst du unverändert einfügen.

- **Überblendung statt Kippbild:** „This still feels like two pictures lying on top of each other. I need one shape that honestly is both worlds – keep the shape, its place and the light of the partner image, and change only what it is made of.“
- **Zwilling verrutscht:** „The seam loses its magic because the shape moved. Let it sit where it sat in the partner image, seen from the same height, lit from the same side – the viewer should notice the new world only on a second look.“
- **Anzug driftet:** „He has changed. The suit is the one thing that never changes – please match the approved suit sheet: warm off-white, closed gold visor, brass neck ring, the small gauge without numbers, grey fingertips, moon dust on the knees.“
- **Gesicht im Visier:** „I can sense a face behind the visor. The visor stays opaque, mirrored gold at all times – he is anyone, so he has no face.“
- **Erfundene Schrift:** „There is invented writing on this surface. Please leave it plain – the real page is added later, and anything you write would be wrong.“
- **Zu viel Website zu früh:** „This world should still feel almost real. Let the page be felt in one too-perfect detail that you only notice on a second look.“
- **Zu wenig seltsam für die Tiefe:** „Beautiful, but too normal for this depth. Let one thing quietly break the rules of physics – calmly, never comically.“
- **Zu komisch oder hektisch:** „He looks clumsy here. Keep him dignified and slow, as if he weighed less – a stranger who is careful in every world.“
- **Licht kippt:** „The light comes from the other side than in the world before. Keep its direction; let only its colour change.“
- **Kopfhörer als Collage:** „It reads as separate parts put together. One object, one camera, one light – only the front ear cup moves, along its own axis, and it is always clearly a headphone.“
- **9:16 am Rand:** „The important part sits too close to the edge. Move the figure and the shape that carries across towards the middle, so a tall phone crop still tells the whole moment.“
- **Zu nah an einem Filmzitat:** „This feels too close to a famous film. Keep the feeling of a simulation, but find an image that is our own – brass and real materials, no code.“
- **Verboten im Bild:** „Please remove the [lander / flag / logo / glow ring] – the dream has none of these.“
- **Passt:** „This is it. Keep exactly this mood, light and suit – this image is now the reference for the next card.“
