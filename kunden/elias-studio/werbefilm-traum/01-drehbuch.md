# Werbefilm „Traum“ – Drehbuch 1 (Auftrag A-124)

Stand 03.11.2026 · Chefautor (Zusammenführung der Entwürfe A, B, C und der Jury-Berichte J1–J3; Nachbesserung nach Prüfbericht:
Kennzeichen „Musterseite“ ab 42,50 s, Kopfhörer- und Werkstatt-Zeiten neu, C11 als KI-Clip, C06 geteilt, Kurzfassungen regelkonform)
Grundlage: `00-grundlagen.md` · Zeiten: einzig `zeitleiste.json` (geprüft mit `werkzeuge/video-film/traum/zeitleiste.py pruefen`)

## 0. Entscheidungen der Zusammenführung (Herkunft, Widersprüche)

**Leitlinie (aus J1–J3):** Gerüst und Traumlogik aus **A** „Vor dem Aufwachen“ · Zielgruppen-Reihenfolge, Sog-Plan und
Kurzfassungen aus **B** „Tiefer“ · Baubarkeit, Budget und Naht-Handwerk aus **C** „Bis zum Ende der Seite“.
Jury-Wertung: J1 Sieger A (8,5) · J2 Sieger B (8,0) · J3 Sieger C (7,5). Keiner trägt allein – das Finale ist eine
Verbindung, kein Kompromiss: A's Form, B's Reihenfolge, C's Bauweg.

### 0.1 Was woher kommt

| Baustein | Quelle | Im Finale |
|---|---|---|
| Fall als geometrische Reihe, die in endlicher Zeit ankommt; Cursor genau bei 1:00 | A §1–2 | Faktor 0,75 statt 0,7 (siehe 0.2), Start 15 s: 15 / (1 − 0,75) = **60,00 s** |
| Kippbild je Weltgrenze, Nahttabelle (Form/Farbe/Bewegung), fünf Nahtregeln | A §4.0 | Pflichtspalte jeder Szene; Regelwerk in 4.0 |
| Traumrückstände: alles im Traum stammt aus dem Zimmer | A §1, §7.2 | jede Welt hat ihr Gegenstück im Zimmer (Tabelle in 7.2) |
| Haken „Beschlag“ (Blick aus dem Helm), Gratis-Test mit Unbeteiligten | A §6 | Hauptvariante, verbunden mit C's Raste in Bild 1 |
| Kopfhörer-Bau: nur die vordere Ohrschale, eigene Achse, ein Licht, Endbild = Bearbeitung des Startbilds, Differenzbild, Rückfall Ebenen | A §5.3–5.6 | Grundbau des Wendepunkts |
| Erwachen: Helmklick = Bügelklick, Bildanschluss auf die Bewegung, Drehtrick „Die Kamera trägt den Kopfhörer“, „Der leere Platz“ | A W1–W3, §7.4, §9.4 | Hauptvariante und Ausweichfassung |
| Vier-Ton-Motiv, der fünfte Ton erst im Zimmer | A §1 | Leitmotiv, vor allem anderen festgelegt (B §9.4) |
| Portal-Kreis der eigenen Seite (echt, `auftritt.css`, 0,75 s) | A §7.3 | nur einmal: Zimmer → Schlusskarte, in Originalgeschwindigkeit |
| Welten-Reihenfolge Werkstatt → Praxis → Restaurant **vor** dem Kopfhörer, danach Rückkehr als ihre Seiten | B §4 S02–S10 | Rückgrat des Fallens |
| Erde an der Leitung = Lampe der Tischlerei (erster Morph, eigenes Bild) | B S01–S02 | Naht N1 |
| Cursor-Stern (blinkt im Cursortakt 0,5 s an/aus) | B S01, S20 | ab 5,5 s auf dem Mond, Auflösung bei 60 s und im Zimmer |
| Messingschild „Aufbau ansehen“, das der Handschuh drückt; der Kopfhörer schließt sich um die Kamera | B S05, S07 | Entscheidung des Helden; Klammer aufsetzen = tiefer träumen, abnehmen = aufwachen |
| Sog-Plan (spätestens alle 5 s eine neue offene Frage) | B §2.5 | Tabelle 4.1, Abnahmekriterium jedes Rohschnitts |
| Kurzfassungen als eigene Kurven (30 s quer, 9:16), erstes Unmögliches vor der 5-s-Marke | B §8 | Abschnitt 8 |
| „Jeder Betrieb ist eine eigene Welt.“ vor dem Schlusssatz; leerer Cursor ohne getippten Text; Amsel pfeift das Motiv | B §1, §7, S27 | gesprochen im Zimmer; einziger Wink |
| Raste (Mausrad-Klick) in Bild 1 und ihre Auflösung im Zimmer; Rasten verdoppeln sich ab der Browser-Kamera | C S1, §2 | Haken und Kamera-Grammatik |
| Atem ×1/Faktor: jede Welt genau drei Atemzüge | C §0, §2 | Atemspur in der Zeitleiste |
| Dielen werden Dielen (gleiches Licht von links, Schatten bleibt liegen) | C Naht B4 | Naht N3 Praxis → Restaurant |
| Durchflug durch Ebenen statt Klick-Schnitt | C S9 | Rückrufe und Montage |
| Zwilling B per Bildbearbeitung aus Zwilling A, Überlagerungsprüfung; Start/Ende als verschiedene Ausschnitte | C §9.2, J3 Korr. 1 | Regel für jede Naht |
| Budget im Guthaben mit Reserve, Tempo je Clip, Sparhebel, Animatik gratis zuerst | C §9.1, §9.3 | Abschnitt 9 |
| Probe der riskantesten Nähte als bezahltes Tor | A §9.5, J3 | Tor 3 in Abschnitt 9 |

### 0.2 Widersprüche und wie sie gelöst sind

1. **Welten-Reihenfolge (J1 will A's Kino → Café → Kopfhörer, J2 will B's Werkstatt → Praxis → Restaurant).** Gelöst nach der
   Leitlinie für B: Die drei Zielgruppen kommen zuerst, je ≥ 6 s, als erkennbare Orte (J2 Korr. 6, J1 Korr. 13). **Kino und Café
   entfallen als eigene Welten.** Was aus ihnen trägt, wandert mit: das Nicht-trinken-Können (A E2.2) ins Restaurant (Teeglas am
   Visier), die Tassen-Umlaufbahn (J1 #11) als Teller-Umlaufbahn (B's Original), der Nachtfalter als Seite im Durchflug.
   Das „Leinwand-Ich“ (A E1.2) entfällt – ein Traum-im-Traum in 1 s wäre nicht lesbar; das Gefühl „Wer träumt hier wen?“ trägt
   jetzt der Sog „Visier in Visier“.
2. **Faktor 0,7 (A) oder 0,75 (B).** 0,75: Der Kopfhörer bekommt so **8,32 s** in der Filmmitte (41,02–49,33 s, die Mitte 42,5 s
   liegt darin) statt A's knapper 6,18 s, die Zielgruppen-Welten sind 11,25 / 8,43 / 6,33 s lang. Die Form bleibt A's: Summe
   der Reihe = 60,00 s. Atem ×1,33 (= 1/0,75) – jede Welt genau drei Atemzüge (C).
3. **Hartschnitte (B's Klick-Montage S10–S18).** Gestrichen. Rückrufe und Montage sind ein **Durchflug durch Ebenen** (C), der
   Portal-Kreis kommt nur einmal (in die Karte). Kein Schwarzbild als versteckter Schnitt, keine Blende statt Morph **im Traum**.
   Zwei Übergänge sind ausdrücklich keine Morphs und werden so benannt: **N11** (Helm → Zimmer) ist ein Wischschnitt in der
   Verdeckung, weil hier die Bildquelle von KI zu echtem Material wechselt (Farbe, Korn und Bewegungsunschärfe werden angeglichen);
   **N12** (Zimmer → Karte) ist der echte Portal-Kreis der eigenen Seite, also ein Ereignis auf dem Bildschirm. Beide liegen nach dem
   Traum; N12 bestätigt Elias als bewusste Ausnahme (Entscheidung 7).
4. **Richtungsumkehr an der Naht (B's Schwenk weg – Schwenk zurück).** Die Erde-Lampe-Naht wird als durchgehende Bewegung
   gebaut: Die Kamera steigt zur Erde, fährt auf die Lampe zu, **unter ihr hindurch** und neigt sich erst in der Mitte des
   nächsten Clips in die Werkstatt hinab. Jede Umkehr liegt mitten in einem Clip (J1 Korr. 1, J2 Korr. 2).
5. **Kopfhörer früh (C, 16 s) oder in der Mitte (A, B).** Mitte. Vorher kein Werbesignal (J1 Korr. 4, J2 Korr. 5).
6. **Haken: A's „Beschlag“ oder C's „Der Himmel springt“.** Beide in den Test (Abschnitt 6). Hauptvariante: A's Innensicht mit
   C's Raste in Bild 1 – das Zucken **ist** eine Mausrad-Raste, aufgelöst im Zimmer (J1 #5). Kein Standbild mit Effekt: Bild 1
   ist ein echter KI-Clip (J3 Korr. 10).
7. **Bildrate 24 (C) oder 60 (Playbook).** Standard 60 B/s; Entscheidung an der Probe (Abschnitt 9.6, offene Entscheidung 4).
8. **Vorleseprogramm als hörbarer „Code“ (C).** Nicht im Hauptplan: Es braucht beschleunigte Sprache (Playbook-Verbot) und
   müsste für Elias wahr sein (Grundregel 0). Bleibt als spätere Variante, wenn Elias seine Seiten nachweislich mit einem
   Vorleseprogramm prüft.
9. **Wer fragt „…hört mich jemand?“ (offen in A und B).** Die **Erzählstimme des Films** (ElevenLabs, gestaltet, ruhig, warm). Im
   Traum kommt sie durch Funk und Kopfhörer; sie spricht **ohne Anrede** (kein „du“, kein „Sie“), weil der Film Teil der Seite
   und von Anzeigen wird und die Marke „Sie“ sagt: „…hört mich jemand?“ · „…ganz ruhig. Atmen.“ · „…wer spielt da?“. Im Zimmer ist
   sie ohne Filter, nah: „Jeder Betrieb ist eine eigene Welt. Seine Website ist die Tür hinein.“ Hörbare Auflösung: Als der
   Kopfhörer abgenommen wird, fällt der Funkfilter in derselben Bewegung weg. Keine zweite Person im Bild, kein „ich“ einer KI-Stimme. Elias' eigene Stimme ist Option (Entscheidung 3).
10. **A's Eselsohr am Anzug und Stiefel-Lade-Balken.** Gestrichen (J2 Korr. 8, J3 Korr. 8): keine Abzeichen, keine
    Lade-Platzhalter – Spuren zeigen Stärken (Maß, Lot-Zeichnung, Fokusrahmen = Tastaturbedienung, Cursor-Stern).
11. **A's Staub aus der Ohrschale als Wink.** Gestrichen (wirkt wie ein bekannter Kreisel-Beweis). Einziger Wink: die Amsel pfeift
    die ersten Töne des Motivs.
12. **Werbesätze.** B's „Erzählen Sie mir von Ihrer.“ entfällt; einzige Handlungsaufforderung „Projekt besprechen“.
    „Ihre Seite, ruhig gemacht.“ erscheint erst nach Elias' Bestätigung des Wortlauts (auf der Seite noch `data-pruefen`).

## 1. Titel, Logline, Idee, Botschaft, Schlusssatz

**Titel:** „Vor dem Aufwachen“ (Gegenstück zu v3 „Nach dem Mond“). Arbeitsname der Kurzfassungen: „Tiefer“.

**Logline:** Ein Astronaut holt auf dem Mond Luft und fällt ohne einen einzigen Schnitt durch immer kürzere, immer fremdere
Traumwelten – eine Werkstatt, eine Praxis, ein Restaurant –, bis ein schwebender Kopfhörer zeigt, dass sie alle aus Websites
gebaut sind, und am tiefsten Punkt, wo nur ein blinkender Cursor bleibt, nimmt ein Mensch im Morgengrauen die Kopfhörer ab
und atmet aus.

**Idee in drei Sätzen**
1. Ein Astronaut sitzt allein auf dem Mond, atmet durch und hört eine leise Melodie im Helm; als er zur Erde aufschaut, hängt
   sie an einer Leitung – sie ist die Lampe einer nächtlichen Tischlerei, und der Fall beginnt.
2. Er folgt der Melodie durch eine Werkstatt, eine Physiopraxis und ein Restaurant, jede Welt kürzer und seltsamer, bis er
   ihre Quelle findet: einen Kopfhörer, der sich unter seinem Finger öffnet und zeigt, woraus alles besteht – aus echten
   Teilen von Websites; dann schließt er sich um uns, und die Welten kehren als das zurück, was sie sind: Seiten.
3. Immer schneller stürzen die Seiten ineinander, bis nur ein Cursor bleibt – Stille –, ein Klick, der Helm hebt sich, und
   ein Mensch nimmt in seinem Zimmer die Kopfhörer ab, in dem alles liegt, woraus er geträumt hat: Jede Welt beginnt mit einer Seite.

**Botschaft für Betriebe (Praxen, Werkstätten, Restaurants)**
> Viele Kunden betreten Ihren Betrieb zuerst durch eine Seite. Wagner Seiten baut sie als Ihre eigene Welt – nicht aus dem
> Baukasten, ruhig, schnell auf dem Handy, barrierefrei, ohne Tracking. Gebaut. Geprüft. Gepflegt.

**Perspektive (festgelegt):** Der Schläfer ist **anonym ein Mensch** – kein Name, kein Gesicht, kein Beruf im Bild; das Zimmer ist
ein beliebiges Zimmer im Morgengrauen, nichts darin weist es als Elias' Zimmer aus (keine eigene Wortmarke, keine Post, keine
Fotos). Er ist mit Seiten auf dem Laptop eingeschlafen – mit den Welten von Betrieben im Kopf. Der Zuschauer setzt sich selbst ein.
Die Brücke **Traumwelt → Seite → Betrieb** schließt ein Satz vor der Karte: „Jeder Betrieb ist eine eigene Welt. Seine Website ist
die Tür hinein.“ (71,40 s). Danach erst „Jede Welt beginnt mit einer Seite.“ – das Wortspiel ist dann eindeutig.
**Betrieb im Traum markiert:** Jede Zielgruppenwelt hat ein Betriebsdetail ohne Schrift – Werkstatt: ein fertiges Stück wartet mit
leerem Anhänger auf Abholung · Praxis: die Liege frisch bezogen für den ersten Termin · Restaurant: Stühle hochgestellt, der Pass
noch warm.

Der Film **zeigt** das, statt es zu behaupten:
- Jede Welt sieht völlig anders aus → „eigenes Leitmotiv statt Baukasten“.
- Die drei Zielgruppen sind die ersten drei Welten und kehren als ihre Seiten zurück; wenn die Karte „Websites für Praxen,
  Werkstätten und Restaurants“ sagt, hat man sie zweimal gesehen.
- Die Spuren der Website sind Stärken: ein makelloses Maß, eine Linie, die sich zeichnet, ein Fokusrahmen (Tastaturbedienung),
  ein Cursor – kein Ladebalken, kein Warten.
- 60 Sekunden steigen Atem, Tempo und Musik; dann wird die Hetze in das aufgelöst, was die Marke verspricht: Ruhe.

**Gesprochener Schluss (Erzählstimme, ohne Funk, nah):** „Jeder Betrieb ist eine eigene Welt.“ … „Jede Welt beginnt mit einer Seite.“

**Schlusssatz (Karte, Wort für Wort wie gesprochen):** **„Jede Welt beginnt mit einer Seite.“**
„Seite“ heißt Website und spielt mit „Wagner Seiten“; das Bild davor (der leere Cursor) beweist ihn; er verspricht nichts,
was nicht zu halten ist.

**Die Form (A):** Jede Traumebene ist um den Faktor 0,75 kürzer als die vorige. Die Summe der unendlichen Reihe ist endlich:
15 s / (1 − 0,75) = **genau 60,00 s**. Unendlich viele Träume passen in eine Minute; die Reihe läuft auf einen Punkt zu –
den Cursor bei 1:00. Der Fall ist die Form des Films, nicht nur sein Thema.

**Sechs Leitfäden**

| Leitfaden | Verlauf |
|---|---|
| **Atem** (Taktgeber) | jede Welt genau drei Atemzüge; das erste Einatmen einer Welt liegt auf ihrer Naht (Mond: 0,0 / 5,3 / 10,0 s, Werkstatt ab 15,0); ×1,33 je Ebene; angehalten beim Klick am Kopfhörer und am Grund; erlöst im langen Ausatmen am Morgen |
| **Ring** (Form) | Visier → Lampenglas → Messpunkt → Teller → Messingring → Staubkappe → Jahresringe → Portal-Kreis → Cursor (der Kreis ist zur Linie geworden) → Ring um „Projekt besprechen“ |
| **Melodie** (Sehnsucht) | vier schlichte Töne, offen wie eine Frage, in jeder Welt anders instrumentiert; sie kommt aus den Kopfhörern des Schlafenden; der fünfte Ton erklingt erst im Zimmer |
| **Messing/Gold** (Farbe) | Visier, Lampenfassung, Senklot, Tellerrand, Ohrschalenring, Schreibtischlampe – die eine warme Linie durch alle Welten; unser „Code“ ist Messing, nicht Grün |
| **Kippbilder** (Übergänge) | jede Weltgrenze ist ein Bild, das zu beiden Welten gehört – an der Naht gibt es nichts zu schneiden |
| **Traumrückstände** (Erzählung) | alles im Traum stammt aus dem Zimmer; beim zweiten Ansehen ergibt jedes Bild Sinn |

**Kamera-Grammatik (kippt mit der Tiefe):** Mond bis Restaurant Filmkamera (Rückfahrt, Steigen, Neigen, Gleiten, Kreisfahrt) ·
Kopfhörer Produktkamera (eine Achse, perfektes Licht) · Rückrufe Browser-Kamera (Scrollen mit Rasten, die sich verdoppeln:
Bild 1 eine Raste, dann S07 2 → S08 4 → S09 8 → Dauerscroll) · Durchflug durch Ebenen · Sog in die Mitte · Cursor Stillstand · Zimmer echte Handkamera ·
Karte gesetzt und ruhig.

**Bildreim:** Erstes Bild: Blick aus dem Helm, die Erde hängt über dem Mond. Letztes Bild vor der Karte: Blick aus dem Zimmer,
der Mond hängt im Morgenhimmel, die runde Lampe hängt am Kabel.

## 2. Spannungskurve (Formel, Faktoren, Tabelle)

**Formel (einzige Quelle: `zeitleiste.json`, Feld `faktoren`):**
Dauer der Ebene n: d(n) = 15,00 s × 0,75ⁿ · Summe aller Ebenen = 15 / 0,25 = **60,00 s** (Cursor bei 1:00,00).
Bildgenau bei 60 B/s: 900 · 675 · 506 · 380 · 285 · 214 · 160 · 120 · 90 · 68 · 51 · 38 Bilder, Rest 113 Bilder = alle weiteren
Ebenen im Sog. Summe 3600 Bilder. `zeitleiste.py pruefen`: Exit 0, 0 Hinweise; gemessen Szenenlänge ×0,75, Website ×1,69
(geplant ×1,75), Atem ×1,33.

**Messgröße statt freier Noten.** Spannung wird nicht geschätzt, sondern aus einer zählbaren Größe abgeleitet: der
**Ereignisdichte E** (Bildereignisse + Tonereignisse + Rasten je Sekunde). Jede Ebene trägt gleich viel Handlung – drei
Atemzüge und drei Hauptereignisse –, aber in 0,75 der Zeit. Daraus folgt E(n) = E(0) × (1/0,75)ⁿ = **×1,33 je Ebene**: eine echte
Exponentialreihe in der Tiefe, in der Filmzeit sogar steiler (E wächst wie 1 / (60 s − t)). Die Spannungsspalte ist
**10 × E / E(S13)**, gerundet. Sie ist ein Planwert aus der Zeitleiste; **in Tor 0 wird E an der Animatik nachgezählt** (Ereignisse
und Bildwechsel je Sekunde je Szene, Zählliste aus `zeitleiste.json` + Skizzenwechsel); weicht eine Ebene um mehr als 25 % vom
Plan ab, wird die Animatik nachgebessert, bevor ein Credit fließt. Musik und Fremdheit wachsen gleichmäßig ×1,21 je Ebene und
erreichen 10 erst im Sog (S13); gedeckelt wird nichts vor dem Cursor.

| Größe | Faktor je Ebene | Verlauf | Warum |
|---|---|---|---|
| Szenenlänge | **×0,75** | 15,00 s → 0,63 s, Rest 1,88 s | geometrische Reihe, der Fall konvergiert auf einen Punkt |
| Ereignisdichte E (→ Spannung) | **×1,33** | 1,0 → 31,6 je Einheit (S01 → S13) | gleiche Handlung je Ebene in 0,75 der Zeit |
| Website-Anteil im Bild | **×1,75** bis zur Sättigung | 0 → 2 → 3,5 → 6 → 10 → 18 → 32 → 56 → 100 % | Fläche, die erkennbar aus echtem Seitenmaterial besteht; ab S09 100 %, danach kann nichts mehr wachsen – deshalb misst die Zeitleiste über alle Ebenen ×1,69 |
| Atem /min | **×1,33** (= 1 / 0,75) | 12 → 16 → 21 → 28 → 38 → 51 → 67 → 90 → 120, danach Fallwind | jede Welt genau **drei Atemzüge**; das erste Einatmen liegt auf der Naht; ab ~90/min ist kein einzelner Zug mehr hörbar |
| Musik 0–10 | ×1,21 | 1,0 → 9,8 (S13), im Cursor 0 | die Musik „öffnet sich“ beim Kopfhörer in der Breite (mono → raumbreit), nicht im Pegel |
| Fremdheit 0–10 | ×1,21 | 1,0 → 9,8 (S13) | ab Bild 1 ein unmögliches Detail, je Welt ein größeres unmögliches Ereignis (Tabelle unten) |
| Rasten (Browser-Kamera) | ×2 | 2 → 4 → 8 → Dauerscroll | die Kamera wird hörbar zum Browser (C); die eine Raste in Bild 1 und im Zimmer ist der Rahmen |

**Tabelle je Szene** (Zeiten aus `zeitleiste.json`)

| Szene | Start | Dauer | Welt (Ebene) | Website % | Atem /min | E | Musik | Fremdheit | Spannung |
|---|---|---|---|---|---|---|---|---|---|
| S01 | 0,00 | 15,00 | Mond (L00) | 0 (verborgen: Cursor-Stern) | 12 | 1,00 | 1,0 | 1,0 | 0,3 |
| S02 | 15,00 | 11,25 | Werkstatt – Tischlerei bei Nacht (L01) | 2 | 16 | 1,33 | 1,2 | 1,2 | 0,4 |
| S03 | 26,25 | 8,43 | Praxis – Physiotherapie am Morgen (L02) | 3,5 | 21 | 1,78 | 1,5 | 1,5 | 0,6 |
| S04 | 34,68 | 6,33 | Restaurant – Grill nach Feierabend (L03) | 6 | 28 | 2,37 | 1,8 | 1,8 | 0,8 |
| S05 | 41,02 | 4,75 | Kopfhörer: die Quelle (L04) – **Wendepunkt** | 10 | 38 → angehalten | 3,16 | 2,1 | 2,1 | 1,0 |
| S06 | 45,77 | 3,57 | Kopfhörer: aufsetzen (L05) | 18 | 51 | 4,21 | 2,6 | 2,6 | 1,3 |
| S07 | 49,33 | 2,67 | Werkstatt als Seite (L06) | 32 | 67 | 5,62 | 3,1 | 3,1 | 1,8 |
| S08 | 52,00 | 2,00 | Praxis als Seite (L07) | 56 | 90 | 7,49 | 3,8 | 3,8 | 2,4 |
| S09 | 54,00 | 1,50 | Restaurant als Seite (L08) | 100 | 120 | 9,99 | 4,6 | 4,6 | 3,2 |
| S10 | 55,50 | 1,13 | Durchflug I (L09) | 100 | Fallwind | 13,3 | 5,6 | 5,6 | 4,2 |
| S11 | 56,63 | 0,85 | Durchflug II (L10) | 100 | Fallwind | 17,8 | 6,7 | 6,7 | 5,6 |
| S12 | 57,48 | 0,63 | Durchflug III (L11) | 100 | Fallwind | 23,7 | 8,1 | 8,1 | 7,5 |
| S13 | 58,12 | 1,88 | Sog: Visier in Visier (L12, ∞ Ebenen) | 100 | Fallwind | 31,6 | 9,8 | 9,8 | 10 |
| **S14** | 60,00 | 2,40 | **Der Cursor (L13) – Höhepunkt** | 100 (eine leere Seite) | 0 – angehalten | – | **0 – Stille** | 10 | **10** |
| S15 | 62,40 | 3,00 | Der Helm hebt sich (W) | 8 | ein Einatmen | – | 1,0 | 5,0 | 6,0 |
| S16 | 65,40 | 5,00 | Erwachen: Kopfhörer ab (W, echt) | 8 | langes Ausatmen, dann 8 | – | 1,5 | 0,5 | 3,0 |
| S17 | 70,40 | 7,00 | Zimmer im Morgengrauen (W, echt) | 8 (echte eigene Seite) | 8 | – | 2,0 (Auflösung) | 0,5 | 2,0 |
| S18 | 77,40 | 6,00 | Schlusskarte (K) | 100 (eigene Marke) | ruhig | – | 1,5 | 0 | 1,5 |
| S19 | 83,40 | 1,60 | Ausklang: die Amsel (K) | 100 | – | – | 0,5 | 0 | 1,0 |

**Fremdheit je Welt – ein Unmögliches, das das vorige übertrifft:** Mond: die Erde pendelt ab Bild 1 wie eine Lampe (12 s: sie
hängt an einer Leitung) · Werkstatt: die Späne fliegen rückwärts ins Holz zurück, das Lot pendelt von selbst · Praxis: sein
Schatten richtet sich vor ihm auf, eine Linie zeichnet sich durch ihn · Restaurant: die Teller heben ab und kreisen wie Monde ·
Kopfhörer: ein Gegenstand öffnet sich auf Fingerdruck und lässt uns hinein · danach sind die Welten Seiten.

**Die Kurve in Worten:** Der Haken trägt die ersten Sekunden (Bewegung, Atem, ein unmögliches Detail), nicht die Dichte. Dann
drei Welten, die man noch glaubt und in denen sich Handwerker, Therapeutin und Wirt wiedererkennen – jede kürzer, dichter und
eine Stufe unmöglicher. In der Filmmitte der Kopfhörer: Die Melodie hat eine Quelle, die Quelle besteht aus einer Seite. Danach
verdoppelt sich die Dichte etwa alle zweieinhalb Ebenen – die Welten kehren als Seiten zurück, die Kamera wird Browser, der
Durchflug wird Sog. Bei 1:00 schlagartig Stille. Die Spannung bricht nicht ab, sie wird angehalten – und im Zimmer ausgeatmet.

```
Spannung = 10 × E / E(S13)   0 ─────────────────────────────── 10
S01  0,0 s  ▏
S04 34,7 s  ▊
S06 45,8 s  █▎
S08 52,0 s  ██▍
S10 55,5 s  ████▏
S12 57,5 s  ███████▌
S13 58,1 s  ██████████
S14 60,0 s  ██████████  Höhepunkt (Stille)
S16 65,4 s  ███
S19 83,4 s  █
```

## 3. Figur und Anzug-Bibel

**Wer er ist:** Der Astronaut ist der Träumer selbst – das, was ein Mensch im Schlaf aus sich macht: jemand, der sehr weit
weg ist und nach Hause will. Kein Gesicht, kein Name, kein Geschlecht im Bild. Er ist in jeder Welt ein Fremder im Anzug.

**Sein Ziel (sichtbar):** der Melodie folgen. **Seine Entscheidung:** Er drückt das Schild „Aufbau ansehen“ (S05).
**Seine Sehnsucht (dreifach, alles mit dem Helm verbunden):** die Erde (zu Hause) · eine Stimme, die ihn erreicht
(„…hört mich jemand?“) · den Helm abnehmen dürfen (im Restaurant kann er nicht trinken). Erfüllt in einer Bewegung:
Helm ab = Kopfhörer ab = zu Hause.

**Bogen und eigenes Ereignis je Welt**

| Welt | Zustand | sein Ereignis |
|---|---|---|
| Mond | Sehnsucht, Ruhe | atmet zweimal sichtbar durch (Rucksack hebt sich), lauscht der Melodie, hebt den Kopf zur Erde |
| Werkstatt | Staunen | Mondstaub auf Eiche; das Lot kommt über seiner Hand zur Ruhe |
| Praxis | gesehen werden | die Linie zeigt, dass ein Mensch im Anzug steckt; er richtet sich auf |
| Restaurant | Wärme, die er nicht berühren kann | das Teeglas klingt gegen das Visier |
| Kopfhörer | Entdeckung, Entschluss | er drückt das Schild |
| Seiten, Durchflug | Fall | klein in jeder Ebene, fallend, nie fuchtelnd |
| Zimmer | Erlösung | (der Mensch, echt) nimmt die Kopfhörer ab, atmet aus |

**Grundsatz:** Der Anzug ist die weiße Leinwand, auf die jede Welt ihr Licht malt. Die Welten ändern sich – er nie.

**Anzug (identisch in allen Welten)**
- Moderner, leicht retro wirkender Außenbord-Anzug in warmem Gebrochenweiß (nahe Creme `#f4efe3`), matt, feines Gewebe,
  weiche Falten an Ellbogen und Knien.
- Runder Helm mit undurchsichtigem, verspiegeltem **Goldvisier**, immer geschlossen; nie Gesicht oder Augen.
  Am Hals ein schmaler Ring aus gebürstetem **Messing** – der Verschluss, der am Ende klickt.
- Kantiger, gebrochenweißer Rucksack, oben links ein kleines rundes Messgerät **ohne Ziffern**.
- Handschuhe gebrochenweiß, Fingerkuppen dunkelgrau gummiert. Stiefel grau-weiß, Sohle mit gleichmäßigen Querrillen.
- Spur: feiner grauer **Mondstaub** an Knien und Stiefeln in jeder Welt (er trägt den Mond durch alle Träume).
- **Keine** Aufnäher, Abzeichen, Flaggen, Logos, Namen, Nummern, Schrift – auch kein Markenzeichen (J2 Korr. 8, J3 Korr. 8).

**Körpersprache je Tiefe:** Mond schwebend langsam · Werkstatt ruhig, vorsichtig · Praxis aufrecht, still · Restaurant nah,
zögernd · Kopfhörer eine einzige Fingerbewegung · Seiten klein, dann fallend. Nie komisch, nie tanzend – immer würdig.

**Licht auf dem Anzug:** nimmt die Farbe jeder Welt an – Sonnenweiß und Erdblau, Lampengold, Morgenweiß, Glut-Orange,
Messing-Streiflicht, das Leuchten der Seiten. Das Visier trägt in jedem Bild ein Glanzlicht.

**Visier-Regel (lernt der Zuschauer unbewusst):** Das Visier spiegelt die Welt, in der er ist – und sechs Bilder (0,1 s) vor
jeder Naht schon die nächste: Lampenkugel (vor der Werkstatt), helle Linie (vor der Praxis), Glut (vor dem Restaurant),
Messingring (vor dem Kopfhörer). Im Sog wird es zur Methode. Eingesetzt in Remotion auf der Visierfläche – gratis.

**Größe im Bild (senkt Drift und hilft 9:16):** Mond groß (Visier formatfüllend, dann Totale) · Werkstatt halbnah · Praxis
ganze Figur · Restaurant nah am Tisch · Kopfhörer nur Handschuh und Helmrand · Seiten und Durchflug klein, als
**Freisteller** aus einem eigenen Standbild **„fallend, Arme ruhig, leicht gedreht“** (K-Fall, 0,25 Credits, mit Referenzbogen, auf
gleichmäßig grauem Grund erzeugt, damit die Maske lokal in Remotion gratis entsteht; `remove_background` nur nach Kostenabfrage).
K03/K05 zeigen ihn sitzend und taugen dafür nicht. Eine Figur, mehrfach wiederverwendet.

**Figur als Anker der Zwillinge (B §3):** An den Nähten N1 und N2 steht oder sitzt er in gleicher Pose an gleicher Stelle
(Felsen ↔ Eichenklotz); die Lichtrichtung gehört zur Zwillingsbedingung.

**Verbote:** kein Gesicht, keine Augen hinter dem Glas, kein Mondlandefahrzeug, keine Fahne, keine Daumen-vor-die-Erde-Geste
(Anekdote einer echten Person), kein Zitat; kein Löffel, kein weißes Kaninchen, keine Pillen (Matrix-nah).

**Referenzen für jede Erzeugung**
- **Referenzbogen** (Tor 2): 4 Standbilder (vorn, Seite, hinten, Dreiviertel), dazu Visier und Handschuh im Detail; einmal
  erzeugt, danach Referenzbild jedes Keyframes mit Astronaut. Tonwert-Vorlage: v3 `v3_51.0s.jpg` (Felsen), `v3_48.2s.jpg` (Visier).
- **Anzug-Test** (J3 Korr. 8): Der erste bezahlte Clip ist C02 (Mond, ohne Naht) – hält der Anzug über einen Clip, gilt der Bogen.
- **Prüfliste je Keyframe** (Agent `kontinuitaet`): Visier gold und undurchsichtig · Messingring · Rucksack mit rundem Messgerät
  ohne Ziffern · graue Fingerkuppen · Staub an Knien · keine Schrift, keine Logos, keine Abzeichen · Proportionen wie im Bogen.

**Anzug-Textbaustein (wörtlich in jeden Bild- und Video-Prompt):**
> lone astronaut in a modern, slightly retro EVA spacesuit, warm off-white woven fabric, matte, soft folds; rounded helmet
> with an opaque mirrored gold sun visor, face never visible; thin brushed-brass neck ring; boxy off-white life-support
> backpack with one small round gauge without numbers; off-white gloves with dark grey rubber fingertips; grey-white boots
> with evenly ribbed soles; fine grey moon dust on knees and boots; calm, careful, dignified body language

**Negativliste (in jeden Prompt):** *no text, no letters, no logos, no patches, no flags, no name tag, no numbers, no visible
face, no eyes, no glow rings, no hologram, no lander, no green code rain*

## 4. Szene für Szene

### 4.0 Die Nähte (alle Weltgrenzen auf einen Blick)

Jede Weltgrenze ist ein **Kippbild** (A): ein Standbild, das zu beiden Welten gehört. Es ist Endbild des einen und Startbild des
nächsten Clips – an der Naht gibt es physikalisch keinen Schnitt. Die Bewegungsart wechselt von Naht zu Naht (J1 Korr. 2).

| Naht | Zeit | Von → Nach | Kippbild (Keyframe) | Form trägt | Farbe trägt | Bewegung trägt |
|---|---|---|---|---|---|---|
| N0 | 5,00 (im Clip C01) | Innensicht → Außen | Durchblick durch das Glas / Spiegelung im Gold (K01 → K02, Zwilling) | die Erde an derselben Stelle | Blau-Weiß bleibt, Gold kommt dazu | Fahrt durch das Glas nach außen, geht in Rückfahrt über |
| N1 | 15,00 | Mond → Werkstatt | **K04** leuchtende Kugel an dünner Leitung, weiße Punkte = Erde an der Leitung / Glaskugel der Pendelleuchte, Staub im Licht | Kugel und Leitung in der Bildmitte | Erdblau → warmes Milchweiß, Schwarz bleibt | **Steigen/Neigen** → Annäherung, unter der Lampe hindurch; Neigung hinab erst in der Clipmitte |
| N2 | 26,25 | Werkstatt → Praxis | **K06** Schnur mit Messinglot in Bildmitte, oben dunkle Eiche, unten helles Weiß | senkrechte Linie + Lot | Nachtblau/Lampengold → Weiß, von unten | **Sinken** (Neigung nach unten), gleiche Geschwindigkeit diesseits und jenseits |
| N3 | 34,68 | Praxis → Restaurant | **K07** Dielen schräg von oben, Licht von links, sein Schatten rechts (C's „Dielen werden Dielen“) | Dielenfugen, Schatten | helles Holz → dunkles Holz, Morgenlicht → Glut, Licht bleibt links | **seitliches Gleiten** tief über dem Boden |
| N4 | 41,02 | Restaurant → Kopfhörer | **K09** dünne goldene Ellipse im Fast-Schwarz = gekippter Tellerrand / Messingring der Ohrschale (B) | Ellipse | Glut-Orange → Messing, Raum → Leere, Glut → Sterne | **Kreisfahrt**, läuft in die langsame Annäherung von C10 aus (gleiche Richtung, kein Halt) |
| N5 | 49,33 | Kopfhörer → Seiten | **K12** Staubkappe mit feinen konzentrischen Ringen = Jahresringe im Hirnholz einer Eiche | konzentrische Ringe | Silber/Messing → Eiche | **Fahrt entlang der Achse** (C11, KI), setzt sich in Remotion durch die Mitte der Ringe fort (C12, Durchflug in das flache Bild K13) |
| N6–N9 | 52,00 · 54,00 · 55,50 · 58,12 | Seite → Seite → Schacht → Sog | Seiten lösen sich in Ebenen (Hintergrund, Bild, Text, Knopf), dahinter die nächste | Ebenen | Eigenfarben der Seiten, nach gemessener Helligkeit geordnet (Messung vor dem Schnitt) | **Durchflug durch Ebenen** (C), Rasten 2 → 4 → 8 |
| N10 | 60,00 | Sog → Grund | Kreise in Kreisen werden ein Punkt, der Punkt ein Cursor | Punkt | alles → Schwarz und Creme | beschleunigte Fahrt in die Mitte, Abriss |
| N11 | 65,40 | Helm → Zimmer | **K19** dunkle ∩-Form im oberen Drittel, an den Rändern herabgezogen = Unterkante des Helms von innen / Bügel mit Polstern, darunter Morgenblau | Bogen | Schwarz → Morgenblau | **Wischschnitt in der Verdeckung** (kein Morph, offen benannt): beide wischen mit 0,6 Bildhöhen/s nach oben; Farbe, Korn und Bewegungsunschärfe angeglichen |
| N12 | 76,65 | Zimmer → Karte | Klickpunkt auf dem Laptop, Bildschirm frontal | Kreis | Morgenlicht → Creme | echter Portal-Kreis der eigenen Seite (0,75 s), auf den Bildschirm eingesetzt – **bewusste Ausnahme**, Entscheidung 7 |

**Fünf Nahtregeln (A) und drei Bauregeln (C, J3)**
1. Jede Welt hat drei Atemzüge; ihr erstes Einatmen liegt auf ihrer Naht (das Ende des dritten Atemzugs der vorigen Welt).
2. Etwa 1 s vor der Naht beginnt der Ton der nächsten Welt (man hört sie, bevor man sie sieht).
3. Die Kamera bewegt sich in beiden Clips in gleicher Richtung und Geschwindigkeit durch die Naht
   („continuous camera motion, no pause“). **Keine Umkehr und kein Stillstand genau auf einem Keyframe** – eine Umkehr gehört in
   die Mitte eines Clips. Tempo-Unterschiede zwischen zwei Clips werden in Remotion als stetige Rampe über die Clipmitte
   ausgeglichen; **an der Naht selbst höchstens ±6 % Sprung**.
4. Sechs Bilder vor der Naht zeigt das Visier schon die nächste Welt (wo er im Bild ist).
5. Macht das Modell eine Überblendung statt einer Verwandlung: Zwischenbild halb/halb einsetzen oder die Naht in Remotion als
   2,5D-Ebenenbewegung bauen.
6. **Zwilling B entsteht durch Bearbeitung von Zwilling A** (A als Referenz: „keep the exact composition, shapes, camera height
   and light direction; change only the material and the world to …“). `kontinuitaet` prüft das Überlagerungsbild vor dem Auftrag.
7. **Nie zwei deckungsgleiche Bilder als Start und Ende eines Clips mit Kamerafahrt** (J3 Korr. 1): Start- und Endbild sind
   verschiedene Ausschnitte (Skalierung bzw. Versatz in Bewegungsrichtung) – gratis aus einem etwas größer erzeugten Bild.
8. Jede Naht nach dem Clip mit `kette-pruefen.py naehte` messen; Urteil „Sprung“ = Nachdreh oder Rückfall 5.

### 4.1 Sog-Plan: spätestens alle 5 s eine neue offene Frage (B)

Abnahmekriterium für Animatik und jeden Rohschnitt. Größter Abstand zwischen zwei neuen Fragen: 5,0 s.

| öffnet | offene Frage im Kopf des Zuschauers | schließt |
|---|---|---|
| 0,0 | Was ist das – warum zuckt das Bild? | 0,5 (Blick aus einem Helm); das Zucken erst bei 76,0 (eine Mausrad-Raste) |
| 0,0 | Warum schwankt die Erde wie eine Lampe? | 12,0 (sie hängt an einer Leitung) |
| 0,0 | Wer atmet da so erschrocken? | 65,4 (ein Mensch wacht auf) |
| 2,3 | Wer ruft – „…hört mich jemand?“ | 71,4 (dieselbe Stimme, ohne Funk, im Zimmer) |
| 5,5 | Warum blinkt dieser eine Stern so gleichmäßig? | 60,0 (der Cursor) |
| 8,5 | Woher kommt die Melodie im Helm? | 41,0 (der Kopfhörer) |
| 12,0 | Hängt die Erde an einem Kabel? | 15,5 (die Lampe einer Werkstatt) |
| 16,0 | Wie kommt er vom Mond hierher? | 65,4 (er träumt) |
| 19,0 | Warum fliegen die Späne zurück, warum ist das Maß so makellos? | 50,8 (es ist die Seite Eiche & Span) |
| 22,0 | Wer bewegt das Lot? | 65,4 (es gibt einen Träumer) |
| 25,0 | Warum wird das Holz hinter der Schnur weiß? | 26,5 (die Praxis) |
| 28,5 | Warum zeichnet sich die Linie von selbst? | 52,0 (die Seite Lotlinie) |
| 29,0 | Steckt da ein Mensch drin? | 65,4 |
| 30,0 | „…ganz ruhig. Atmen.“ – ist er in Gefahr? | 65,6 (das lange Ausatmen) |
| 34,0 | Wohin gleitet er? | 35,0 (ein Restaurant) |
| 36,0 | Warum kann er nicht trinken? | 65,4 (Helm ab) |
| 37,0 | Wer bewegt den Rahmen von Teller zu Teller? | 54,0 (die Seite ZEYTIN & GLUT) |
| 38,4 | „…wer spielt da?“ | 41,0 (ein Kopfhörer im Nichts) |
| 41,0 | Was ist das für ein Ding im Nichts? | 44,0 |
| 43,5 | Was passiert, wenn er drückt? | 44,1 |
| 44,4 | Ist alles aus Seiten gebaut? | 50,8–55,5 (die drei Rückrufe) |
| 46,5 | Wohin führt das Innere des Kopfhörers? | 50,3 (in die Werkstatt – flach) |
| 50,8 | Waren alle Welten Seiten? | 54,0 |
| 55,5 | Wie tief geht das noch – wo endet es? | 60,0 (in einem Punkt) |
| 60,0 | Stille. Und jetzt? | 62,4 (Klick) |
| 62,4 | Wo sind wir – noch im Helm? | 65,4 |
| 65,4 | Wer ist dieser Mensch? | 71,4 (jemand, der mit den Welten von Betrieben im Kopf eingeschlafen ist; wer genau, bleibt offen – der Zuschauer setzt sich ein) |
| 70,4 | Warum kommt mir dieses Zimmer bekannt vor? | beim zweiten Ansehen (Traumrückstände) |
| 71,4 | Was heißt „eine eigene Welt“ für meinen Betrieb? | 71,4–77,6 („Seine Website ist die Tür hinein.“, Schlusssatz) |
| 73,4 | Der fünfte Ton – ist die Melodie zu Hause angekommen? | 77,6 (der Satz auf der Karte) |
| 77,6 | Wer baut solche Seiten? | 79,6 (Wortmarke) |
| 79,6 | Für wen? | 80,3 („Websites für Praxen, Werkstätten und Restaurants“) |
| 82,4 | Wie sähe meine eigene Welt aus? | außerhalb des Films: „Projekt besprechen“ |
| 83,6 | Pfeift die Amsel die Melodie aus dem Traum? | bleibt offen – Grund für das zweite Ansehen |

### S01 · 0,00–15,00 s · Mond · „Luft holen“ (L00, Clips C01–C03, Keyframes K01–K04)

**Welt:** Der Mond, wie man ihn kennt und doch nicht: schwarzer Himmel, harte Sonne von rechts, grauer Staub, die Erde klein
und gestochen scharf. Kein Landefahrzeug, keine Fahne, keine Spuren – er ist allein, und niemand weiß, wie er hergekommen ist.

**Was man sieht (Stimmung):**
- **0,00–3,00 Haken** (Abschnitt 6): Blick aus dem Helm. Die Erde **pendelt** sichtbar, langsam, wie eine hängende Lampe (das
  erste Unmögliche, ab Bild 1). Bild 1 sackt um eine Raste ab und federt nach – ein Einschlafzucken. Das Glas beschlägt von unten
  und schluckt die Erde, zieht sich zurück; „…hört mich jemand?“
- **3,00–5,00:** Die Kamera gleitet durch das Glas nach außen: Wo eben der Durchblick war, ist jetzt die Spiegelung – dieselbe
  Erde an derselben Stelle, nun im Gold des Visiers (Naht N0 im Clip).
- **5,00–10,00:** Rückfahrt mit leichtem Steigen: Helm, Schulter, die ganze Gestalt. Er sitzt im Profil auf einem Felsen,
  Unterarme auf den Knien (das stärkste Bild aus v3, neu). **Zwei ruhige Atemzüge, hörbar und sichtbar – er atmet durch:** bei
  5,30 heben sich Schultern und Rucksack, aus dem Ventil am Rucksack steigt eine feine Fahne; bei 10,00 (Totale K03) hebt sich der
  Brustkorb, vom Knie löst sich Staub. Rechts der Erde blinkt ein einzelner Stern gleichmäßig an und aus. Die Melodie beginnt im
  Helm, dünn; er neigt den Kopf und lauscht.
- **10,00–15,00:** Er hebt den Kopf zur Erde; die Kamera folgt seinem Blick, steigt und neigt sich nach oben, bis die Erde in der
  Bildmitte steht – und jetzt sieht man es: **Sie hängt an einer dünnen schwarzen Leitung**, die oben aus dem Bild läuft. Ihr
  Blau wird wärmer, die Wolken werden ein Muster in Milchglas, die Sterne treiben wie Staub im Licht.

**Kamera:** eine Bewegung ohne Schnitt – Innensicht, durch das Glas nach außen, Rückfahrt mit Steigen, dann Steigen und Neigen
nach oben (≈ 6°/s), das in S02 ohne Halt als Annäherung weiterläuft.

**Übergang hinein:** keiner – das erste Bild ist schon Bild (kein Schwarz, keine Blende).
**Übergang heraus – N1 „Die Erde an der Leitung“:** Kippbild **K04** (Kugel an Leitung, weiße Punkte); Zwillingspaar der Figur
K03 (Felsen) ↔ K05 (Eichenklotz, gleiche Pose, gleiches Licht von rechts oben).

**Website-Spur (0 %, verborgen):** Der Stern blinkt im Takt eines Textcursors (0,5 s an, 0,5 s aus; Remotion). Niemand merkt es
beim ersten Sehen; er kehrt bei 60 s als Cursor und im Zimmer auf dem Laptop zurück.

**Ton:** Atemzug 1: T01 scharfes Einatmen und T02 Raste (0,00), T03 Ausatmen, Beschlag · T04 Funkknacken (2,15) · T05 „…hört
mich jemand?“ (2,25) · Atemzug 2 und 3: T06/T07 zwei ruhige Atemzüge im Takt 12/min (5,30 / 10,00) · T08 Leitmotiv (8,50),
Spieluhr, wie aus einem Kopfhörer im Nebenzimmer, endet offen · T09 tiefes Brummen 50 Hz ab 12,00 – die Erde summt wie eine
Lampe · T10 erstes Einatmen der Werkstatt auf der Naht (15,00). Anzug knarzt leise, Ventil zischt bei jedem Einatmen.

**Zweck:** Haken, Held, Sehnsucht – und Elias' Punkt 1 (Astronaut, atmet ein paar Mal durch). Das erste Unmögliche ab Bild 1
(die pendelnde Erde, in Remotion als eigene Ebene vor dem schwarzen Himmel bewegt – gratis), aufgelöst bei 12 s.
**Sog:** öffnet „Wer atmet?“, „Warum schwankt die Erde?“, „Wer ruft?“, „Warum blinkt der Stern?“, „Woher die Melodie?“ ·
schließt „Was ist das?“ (ein Helm).

### S02 · 15,00–26,25 s · Werkstatt · „Das makellose Maß“ (L01, Musterseite Eiche & Span, C04–C05, K04–K06)

**Welt:** Eine Tischlerei spät nachts, Nachtblau im Dunkel (Farbwelt von Eiche & Span), eine warme Glaskugel-Lampe über der
Hobelbank, Eichenbretter, Bankhaken, Hobelspäne, Bleistiftstriche, ein Senklot aus Messing an einer Schnur. Sägestaub schwebt
im Lichtkegel und fällt nicht. Still, wie eine Werkstatt nur nach Feierabend still ist.

**Was man sieht:**
- **15,00–20,00:** Die Annäherung an die Kugel geht weiter – sie ist eine Pendelleuchte; die Kamera gleitet **unter ihr hindurch**
  und neigt sich in der Mitte des Clips hinab: Er sitzt da, wo der Felsen war, auf einem Eichenklotz, in derselben Haltung.
  Aus dem Mondstaub sind Späne geworden, aus dem Horizont die Kante der Hobelbank.
- **20,00–23,50:** Er steht langsam auf, als wöge er weniger, und streicht mit den Fingerspitzen über ein Brett; sein Handschuh
  hinterlässt einen feinen grauen Strich – Mondstaub auf Eiche –, und **die Hobelspäne am Boden fliegen rückwärts ins Brett zurück**,
  das glatt wird. Daneben ein Bleistiftmaß „18 cm“ mit makellosen Pfeilen. Hinten wartet ein fertiges Stück mit leerem Anhänger
  auf Abholung (der Betrieb, ohne Schrift).
- **23,50–26,25:** Das Senklot pendelt, obwohl sich nichts bewegt. Er hält die Hand darunter; es kommt über seiner Handfläche zur
  Ruhe. Die Kamera neigt sich an der Schnur entlang nach unten; hinter der Schnur wird das Holz von unten her hell.

**Kamera:** Annäherung, unter der Lampe hindurch, Neigung hinab (Clipmitte von C04) · Mitgehen auf Augenhöhe · Neigung entlang
der Schnur nach unten mit gleichmäßiger Geschwindigkeit, die in S03 ohne Halt weiterläuft.

**Übergang hinein:** N1 (K04). Diesseits der Naht verwandeln sich Felsen → Eichenklotz, Mondebene → Boden mit Spänen,
Horizont → Bankkante, Sterne → Staub im Licht.
**Übergang heraus – N2 „Das Lot“:** Kippbild **K06** (Schnur mit Lot, oben dunkle Eiche, unten Weiß).

**Website-Spur (2 %, bewusst bemerkbar):** Das Maß „18 cm“ stammt aus der Aufnahme von Eiche & Span (als Graphit aufs Brett
gesetzt, nie von der KI geschrieben; eingesetzt erst, wenn die Kamera nach dem Mitgehen fast steht, Brett im KI-Bild leer).
Die Maserung läuft auf einer Handbreit in vollkommen geraden Zeilen wie ein Textblock. Für 0,5 s steht der Staub im
Lichtkegel in einem genauen Raster still – lang genug, dass man es bemerkt. Ein einzelnes Maß ist keine lesbare Seite; das
Kennzeichen „Musterseite“ beginnt mit dem ersten lesbaren Seitentext (42,50 s).

**Ton:** Vorlauf ab 14,00: Dachbalken knackt · Lampenbrummen als Grund · Späne knistern unter dem Stiefel · T11 Handschuh
raspelt über Eiche (19,00) · T12 Lotschnur knarzt (22,00) · T13 erstes Einatmen der Praxis auf der Naht (26,25). Musik 1,3: das Motiv, jetzt mit
einem dumpfen Klöpfel auf Holz. Der Funk schweigt – das macht die Stille unheimlich.

**Zweck:** Zielgruppe Werkstatt – jeder Handwerker kennt die Werkstatt allein in der Nacht. Fast wirklich, nur Details sind falsch.
**Sog:** öffnet „Wie kommt er hierher?“, „Warum ist das Maß so makellos?“, „Wer bewegt das Lot?“, „Warum wird das Holz weiß?“ ·
schließt „Hängt die Erde an einem Kabel?“ (15,5).

### S03 · 26,25–34,68 s · Praxis · „Ins Lot gebracht“ (L02, Musterseite Lotlinie, C06, K06–K07)

**Welt:** Ein heller, stiller Behandlungsraum am Morgen: weiße Wände, eine Liege mit Papierrolle, eine Sprossenwand, helle
Holzdielen, weiches Fensterlicht von links (Farbwelt von Lotlinie). Klar, luftig.

**Was man sieht:**
- **26,25–28,00:** Die Neigung kommt unten an: Das Messinglot setzt neben seiner Stiefelspitze auf (K06 zeigt Handfläche und
  Stiefelspitze schon am Rand). Die Kamera weicht zurück und steigt (Umkehr in der Clipmitte von C06a): Er steht im Raum. Die Liege
  ist frisch bezogen für den ersten Termin.
- **28,00–30,00:** Eine feine Linie zeichnet sich von oben nach unten durch ihn, und an Ohr, Schulter, Hüfte, Knie und Knöchel
  erscheinen kleine runde Messpunkte – vier klingen, **der fünfte bleibt stumm**. Für einen Atemzug umreißt die Linie die
  Haltung eines Menschen im Anzug: Da drin steckt jemand.
- **30,00–32,00:** Funk: „…ganz ruhig. Atmen.“ **Sein Schatten an der Wand richtet sich vor ihm auf**, dann folgt er; die Linie
  steht genau senkrecht (K06b bei 30,50: ganze Figur, aufrecht).
- **32,00–34,68:** Er geht zum Fenster; die Kamera gleitet tief und seitlich über die hellen Dielen, sein Schatten liegt rechts.

**Kamera:** Neigung kommt zur Ruhe, Rückfahrt mit Steigen bis K06b (C06a, 4 s), fast stehend, dann seitliches Gleiten tief über
den Boden (C06b, 4 s). Die Teilung gibt der Figur einen Anker in der Mitte der Welt (Stolperfalle 1).

**Übergang hinein:** N2 (K06): Schnur → gezeichnete Linie, Messinglot → Messpunkt am Knöchel, Weiß „lädt“ von unten.
**Übergang heraus – N3 „Dielen werden Dielen“:** Kippbild **K07**; Licht bleibt links, der Schatten bleibt liegen, nur das Holz
dunkelt und das Morgenlicht wird Glut.

**Website-Spur (3,5 %):** Die Linie ist die echte Zeichen-Animation der Lotlinie-Strichfigur (`lot-zeichnen`, 1,8 s), bildgenau
aufgenommen und als Licht in den Raum gesetzt; die Messpunkte haben die Form der Punkte auf der Seite; die Lichtstreifen an der
Wand liegen im Spaltenraster der Seite. *(Lotlinie ist im Repo „ruhend“ – Einsatz im Film bestätigt Elias, Entscheidung 5.)*

**Ton:** kleiner heller Raum, fast lautlos · Lot setzt auf („tock“) · T14 vier gläserne Messpunkt-Töne = das Motiv (28,50) ·
T15 Funk „…ganz ruhig. Atmen.“ (30,00) · T16 erstes Einatmen des Restaurants auf der Naht (34,68). Musik 1,7, darunter eine kaum hörbare Fläche.

**Zweck:** Zielgruppe Praxis – die Therapeutin erkennt ihre Haltungsanalyse. Das hellste Bild setzt das Auge nach der Nacht
zurück; zum ersten Mal verhält sich etwas wie Software, aber sanft.
**Sog:** öffnet „Warum zeichnet sich die Linie?“, „Steckt da ein Mensch drin?“, „Ist er in Gefahr?“, „Wohin gleitet er?“ ·
schließt „Warum wird das Holz weiß?“.

### S04 · 34,68–41,02 s · Restaurant · „Das Glas am Visier“ (L03, Musterseite ZEYTIN & GLUT, C07–C08, K07–K09)

**Welt:** Ein Grillrestaurant nach Feierabend: dunkel und warm, im offenen Grill glimmt noch Glut, Olivenzweige, auf den anderen
Tischen stehen die Stühle schon hoch. An einem runden Tisch sitzt er; vor ihm weiße Teller in einem Kreis, ein Teeglas.

**Was man sieht:**
- **34,68–36,00:** Die Dielen unter der gleitenden Kamera sind dunkel geworden, das Licht kommt noch immer von links – jetzt aus
  der Glut. Die Kamera steigt in die Schräge: der Tisch, die Teller im Kreis, er.
- **36,00–37,00:** Er hebt das Teeglas zum Mund – und es klingt hell gegen das Goldvisier. Er kann nicht trinken. Er hält das
  Glas noch einen Moment dort (würdig, nicht komisch).
- **37,00–38,40:** Die Kamera beginnt eine langsame Kreisfahrt um den Tisch (ohne Halt durch K08 bei 37,85). Ein feiner Rahmen –
  wie ihn die Tastaturbedienung um ein gewähltes Element zeichnet – springt dreimal von Teller zu Teller. Der Dampf eines
  Gerichts zieht einen genauen dünnen Kreis.
- **38,40–41,02:** Funk: „…wer spielt da?“ – die Melodie ist näher als je zuvor, von irgendwo außerhalb des Raums. Die Teller
  heben vom Tisch ab und kreisen um ihn wie Monde; die Kamera schließt sich der Bahn an. Ein Teller im Vordergrund kippt auf die
  Kante, sein Rand fängt das Licht als dünne goldene Ellipse; die Glut im Hintergrund wird zu fernen Lichtpunkten.

**Kamera:** Gleiten (aus N3), Steigen in die Schräge, ab ≈ 37,0 eine langsame Kreisfahrt, die durch K08 läuft und auf Tellerhöhe
schneller wird und in S05 weiterläuft. C07 und C08 je 3 s bei 0,95× – kein Stillstand, kein Tempowechsel auf K08.

**Übergang hinein:** N3 (K07). **Übergang heraus – N4 „Die Umlaufbahn“:** Kippbild **K09** (goldene Ellipse im Fast-Schwarz =
Tellerrand / Messingring der Ohrschale); die Kreisfahrt läuft ohne Unterbrechung weiter.

**Website-Spur (6 %):** der springende Fokusrahmen (Barrierefreiheit, gezeigt statt gesagt – Gestaltung aus dem echten
Fokus-Stil der Seite; *prüfen, ob ZEYTIN & GLUT einen sichtbaren Fokusrahmen hat, sonst den der eigenen Seite*), der Dampfkreis
im Maß der runden Bildrahmen der Seite. Keine lesbare Speisekarte (kein KI-Text).

**Ton:** Glut knistert, Dunstabzug brummt tief · T17 „Ting“ Glas am Visier (36,00) – das erste helle Außengeräusch · T18 drei
leise Fokus-Klicks (37,00) · Teller klingen beim Abheben in den Tönen des Motivs · T19 Funk „…wer spielt da?“ (38,40) · T20
erstes Einatmen des Kopfhörers auf der Naht (41,02). Musik 2,2: das Motiv klar, aber immer noch dünn, wie aus einem Kopfhörer im Nebenraum.

**Zweck:** Zielgruppe Restaurant – der Wirt erkennt seinen Laden nach Feierabend. Die Sehnsucht wird körperlich; die Physik
bricht offen (der Mond kehrt im Kleinen zurück).
**Sog:** öffnet „Warum kann er nicht trinken?“, „Wer bewegt den Rahmen?“, „…wer spielt da?“ · schließt „Wohin gleitet er?“.

### S05 · 41,02–45,77 s · Kopfhörer: die Quelle · Wendepunkt (L04, Musterseite Hörwerk, C09–C10, K09–K10)

**Welt:** Schwarze Leere ohne Boden und Horizont. Darin schwebt ein Kopfhörer – Anthrazit, Leder, schmale Messingringe,
geflochtenes Kabel, das in seiner Buchse steckt (Farbwelt von Hörwerk). Ein weiches Licht von oben links, ein kühles Kantenlicht
von rechts hinten. Aus ihm kommt die Melodie. Alles Weitere in Abschnitt 5.

**Was man sieht:**
- **41,02–44,02:** Die Kreisfahrt läuft aus: Aus der goldenen Ellipse ist der Messingring einer Ohrschale geworden; der ganze
  Kopfhörer in Dreiviertelansicht. Über seiner Schulter, unscharf am Bildrand, der Helm. Sein Handschuh hebt sich ins Bild; auf
  der Außenschale ein kleines Messingschild mit der Gravur „Aufbau ansehen“ (lesbar ab 43,0, die Kamera ist fast still). Ab
  **42,50** steht unten rechts klein und ruhig das Kennzeichen **„Musterseite · Gezeigt: Musterseiten von Wagner Seiten“**
  (Inter, Creme mit 70 % Deckkraft, Remotion) – bis 60,00, also über jedem lesbaren Seitentext des Traums.
- **44,02–45,77:** Er drückt (44,10) – ein satter Klick, er hält die Luft an. Die vordere Ohrschale gleitet entlang ihrer eigenen
  Achse auseinander: Deckelscheibe, Messingring, Stecker, Treiber, Polster, je 0,15 s nacheinander, gleiche Abstände, ohne
  Drehung. Feine Messing-Haarlinien zeichnen sich von den Teilen weg – **ohne Werte** (das erfundene Produkt bekommt keine
  Produktdaten ins Bild). Auf der Stirnfläche des Messingrings, der langsam zur Kamera gleitet, steht graviert „Hör, was bleibt.“
  (lesbar 45,0–46,4; der Ring bewegt sich auf einer Geraden mit bekannter Rampe – sauber nachführbar).

**Kamera:** auslaufende Kreisfahrt, dann sehr langsame Annäherung, die sich bis 46,52 auf die Achse dreht (C10, 3 s bei 1,20×,
über die Clipmitte stetig angehoben – an K10 kein Sprung).
**Übergang hinein:** N4 (K09). **Übergang heraus:** keiner – S05 und S06 sind eine Einstellung (eine Achse, ein Licht).

**Website-Spur (10 %):** Gravur „Aufbau ansehen“ (echter Knopftext der Hörwerk-Seite) und „Hör, was bleibt.“ (Kopfzeile der
Seite) – aus der Aufnahme, in Remotion auf leer erzeugte Flächen gesetzt; Haarlinien im Zeichenstil der Seite; Kennzeichen.

**Ton:** absichtlich trockene Leere · das Motiv aus seiner Quelle, mono und schmal · T21 Klick des Schildes, Spitze auf dem Bild,
in dem es nachgibt (44,10) · T22 fünf präzise Löseklicks (ab 44,40) · T23 mit jedem Teil öffnet sich die Musik eine Schicht:
Höhen, Mitten, Raum, Bass, Luft (bis 46,5).

**Zweck:** Die erste große Frage (woher die Melodie?) wird beantwortet und sofort ersetzt. Der Held entscheidet selbst. Ab hier ist
die Simulation nicht mehr zu übersehen – genau in der Filmmitte (42,5 s).
**Sog:** öffnet „Was ist das für ein Ding?“, „Was passiert, wenn er drückt?“, „Ist alles aus Seiten gebaut?“ · schließt „Woher
die Melodie?“, „…wer spielt da?“.

### S06 · 45,77–49,33 s · Kopfhörer: aufsetzen (L05, C10–C11, K11–K12)

**Was man sieht:** 45,77–46,52 die Teile kommen in der Schwebe zur Ruhe, die Gravur auf dem Ring ist noch zu lesen, die Kamera
dreht sich weiter auf die Achse (Ende C10). **46,52–49,33 Fahrt durch die Tore (C11, 2,82 s):** knapp über der Deckelscheibe
hinweg, die unter der Kamera aus dem Bild gleitet; durch den hohlen Messingring; durch das leere Gehäuse, dessen Innenwand
das Spaltenraster der Seite als feine Rillen trägt (Material, nicht lesbar). Hinter der Kamera schließen sich Ring und Deckel
wieder (48,40) – **wir sitzen im Kopfhörer**. Vor uns die Staubkappe des Treibers mit feinen konzentrischen Ringen.

**Kamera:** Fahrt entlang der Achse, gleichmäßig, ohne Halt – **ein KI-Clip** (C11, `kling_o3_flf` 3 s pro, 3,75 Credits) von
K11 nach K12. Aus dem Standbild K11 allein ist diese Fahrt nicht baubar: Innenseite von Ring und Gehäuse sind darin nicht zu
sehen. Deshalb wird K11 so erzeugt, dass Ring und Gehäuse **sichtbar hohl und innen leer** sind und die Deckelscheibe unterhalb
der Fahrtlinie liegt; der Treiber bleibt das Ziel. Rückfall (5.3 Nr. 4): drei Standbilder entlang der Achse.
**Übergang heraus – N5 „Jahresringe“:** Kippbild **K12** (Staubkappe = Hirnholz einer Eiche); die Fahrt setzt sich in Remotion
durch die Mitte der Ringe fort.

**Website-Spur (18 %):** Gravur „Hör, was bleibt.“ (bis 46,4), das Raster der Seite als Rillen der Innenwand; Kennzeichen steht.
**Ton:** T24 Ring und Deckel schließen sich hinter uns (48,40): Die Musik wird von mono zu raumbreit – zum ersten Mal klingt sie,
als säße man mitten in ihr. Atem 51/min.
**Zweck:** Klammer des Films – aufsetzen = tiefer träumen, abnehmen = aufwachen. Tor in die Seitenwelt.
**Sog:** öffnet „Wohin führt das Innere?“ · schließt „Was passiert, wenn er drückt?“.

### S07 · 49,33–52,00 s · Werkstatt als Seite (L06, Musterseite Eiche & Span, C12–C13, K12–K13b)

**Was man sieht:** **49,33–50,33** die Fahrt geht durch die Mitte der Jahresringe (C12, Remotion, gratis): Aus der Mitte wächst
die Tischlerei, **genau im Ausschnitt von S02** (K13 = Ausschnitt von K05) – die Lampe, die Bank, er auf dem Eichenklotz. Aber
jetzt ist sie flach wie ein Foto; der Staub steht im Raster. **50,33–50,83** sie löst sich in Ebenen, die in die Tiefe
auseinanderziehen – Hintergrund, Bild, Schrift (C13). **50,83–52,00** darunter liegt die echte Seite **Eiche & Span** (K13b) als
Ebenen im Raum der Werkstatt, nicht als Browserfenster: Nachtblau, „Maßarbeit aus Holz.“, das Maß „18 cm“ an seinem Platz –
1,17 s lesbar. Zwei Rasten (51,20 / 51,60) rücken sie je eine Stufe weiter.
**Kamera:** Durchflug durch die Ringe, Abbremsen in den alten Ausschnitt, Ebenen ziehen auseinander, dann Browser-Kamera (2 Rasten).
**Übergang hinein:** N5 (K12). **Heraus:** Durchflug durch die Ebenen der Seite (N6) in die nächste.
**Website-Spur (32 %):** echte Aufnahme Eiche & Span (Quelle siehe 9.7), unverzerrt, Kennzeichen „Musterseite“ im Bild.
**Ton:** T25 zwei Rasten (51,20 / 51,60), Seitenklang; das Motiv mit Klöpfel, schneller. **Zweck:** rückwirkendes Aha – die
Welten waren Seiten. **Sog:** öffnet „Waren alle Welten Seiten?“ (50,8) · schließt „Warum ist das Maß so makellos?“, „Wohin
führt das Innere?“.

### S08 · 52,00–54,00 s · Praxis als Seite (L07, Musterseite Lotlinie, C13b, K14)

**Was man sieht:** Die Ebenen der Tischlerei fliegen an der Kamera vorbei; dahinter steht die Seite **Lotlinie** als Wand des hellen
Raums: „Physiotherapie, die zuerst hinschaut.“ Vier Rasten bis 52,40 bringen die Strichfigur ins Bild, dann steht die Seite, und
die Figur zeichnet sich 52,20–54,00 in Originaltempo (1,8 s) – dieselbe Linie, die durch ihn lief.
**Kamera:** Durchflug, dann Scrollen mit 4 Rasten (weiches Einrasten mit Nachfedern), Stillstand während der Zeichnung.
**Website-Spur (56 %):** echte Aufnahme Lotlinie (aus dem Artifact, damit `lot-zeichnen` läuft), Kennzeichen „Musterseite“.
**Ton:** T26 vier Rasten, ein gläserner Ton. **Zweck:** Rückruf Praxis. **Sog:** schließt „Warum zeichnet sich die Linie?“.

### S09 · 54,00–55,50 s · Restaurant als Seite (L08, Musterseite ZEYTIN & GLUT, C14–C15, K15)

**Was man sieht:** Die Seite **ZEYTIN & GLUT** als Boden unter dem Tellerkreis: der große Schriftzug, die Speisefotos in runden
Rahmen – der Tellerkreis. Der Fokusrahmen springt weiter, jetzt von Foto zu Foto. Acht Rasten. Keine Speisekarte, keine Preise im
Bildausschnitt (Aufnahmeliste 9.7).
**Website-Spur (100 %):** echte Aufnahme, Kennzeichen „Musterseite“ (Quelle: Artifact + Langscreenshot, siehe 9.7).
**Ton:** acht Rasten, Glutknistern wird zum Klickrhythmus. **Zweck:** alle drei Zielgruppen als Seiten.
**Sog:** öffnet „Wie tief geht das noch?“ · schließt „Wer bewegt den Rahmen?“, „Waren alle Welten Seiten?“.

### S10–S12 · 55,50–58,12 s · Durchflug I–III (L09–L11, C15)

**Was man sieht:** Ein Schacht aus Seiten, Ebene hinter Ebene, jede in ihren Eigenfarben – nie grüne Spalten auf Schwarz.
Vorläufige Folge (endgültig nach Messung, siehe Lichtschutz): S10 (1,13 s) Blütenwerk Lilou, Zeit für Zimt, Lindgrund · S11
(0,85 s) Salon Ambra, Pulsraum, Nachtfalter · S12 (0,63 s) Pixelhain Arcade, Hörwerk, Zwischenbild. NORVAK entfällt (die Seite
zeigt Kennzahlen). Jede Seite steht **mindestens 8 Bilder (0,13 s)**; bei 3 Seiten je Szene sind es 0,21–0,38 s. In jeder Ebene
fällt er klein mit (Freisteller aus dem Fall-Standbild, Abschnitt 3). Die Seiten sind ganz und unverzerrt; lesbar ist bei dieser
Dauer keine – das ruhige Kennzeichen unten rechts (seit 42,50) ist es.
**Kamera:** Durchflug durch Ebenen, Dauerscroll, beschleunigt (jede Ebene 0,75 × die vorige).
**Lichtschutz (WCAG 2.3.1):** höchstens drei große Hell-Dunkel-Wechsel je Sekunde. Die mittlere Helligkeit jeder Aufnahme wird
**vor dem Schnitt gemessen**; die Folge läuft einmal von hell nach dunkel (kein Dunkel–Hell–Dunkel), Prüfung des fertigen
Abschnitts mit `werkzeuge/video-film/aufnahme/film-pruefung.py`.
**Ton:** T27 Dichte statt Lautstärke: Shepard-Anstieg, Klickrhythmus im Dauerscroll, der Atem wird Fallwind.
**Zweck:** Vielfalt ohne Baukasten – jede Welt anders; Steigerung bis zum Kollaps.

### S13 · 58,12–60,00 s · Sog: Visier in Visier (L12, C16, K16)

**Was man sieht:** In der letzten Seite steht er klein; sein Visier spiegelt die nächste Seite, in der wieder er steht, dessen
Visier die nächste spiegelt – Kreise in Kreisen, immer dunkler, alles läuft auf einen Punkt zu. („Wer träumt hier wen?“ als
Gefühl.) **Kamera:** eine beschleunigte Fahrt in die Mitte (Remotion, rekursiv). K16 ist ein Goldvisier mit **leerer, neutral
grauer Spiegelfläche** (Bearbeitung von K02, Maske der Fläche wird mit erzeugt) – die Spiegelinhalte (echte Seiten, sein
Freisteller) setzt nur Remotion ein; die KI erzeugt keinen Seiteninhalt.
**Übergang heraus – N10:** der Punkt wird ein Cursor (K17). **Ton:** Dichte steigt weiter bis zum Abriss.
**Zweck:** Der Fall wird unendlich. **Sog:** schließt „Wie tief geht das noch?“ (in einem Punkt).

### S14 · 60,00–62,40 s · Der Cursor · Höhepunkt (L13, C17, K17–K18)

**Was man sieht:** Schwarz. In der Mitte ein schmaler cremefarbener Textcursor. Er blinkt – 0,5 s an, 0,5 s aus, im Takt des
Sterns vom Mond. Sonst nichts. **Kein getippter Text** (B; Abstand zu einer bekannten Filmszene). Ab 61,40 erscheint am Bildrand
ein feiner goldener Saum: Das Schwarz ist das Innere des Visiers; der Cursor schwebt hinter dem Glas wie der erste Stern.
**Kamera:** Stillstand, dann eine winzige Rückfahrt. **Übergang heraus:** Cursor → Stern hinter dem Glas (K18 = Innensicht wie
K01, Zwilling).
**Website-Spur (100 %):** eine leere Seite – der Anfang jeder Seite.
**Ton:** T28 harter Tonschnitt auf digitale Stille bei 60,00 (der stärkste Schlag des Films) · T29 ab 61,40 Raumton und eine
Amsel aus der Stille, kaum hörbar – das Ohr wacht vor dem Auge auf.
**Zweck:** Alles stürzt in einen Punkt. **Sog:** öffnet „Stille. Und jetzt?“ · schließt „Warum blinkt der Stern?“.

### S15 · 62,40–65,40 s · Der Helm hebt sich (W, C18, K18–K19)

**Was man sieht:** Innensicht wie im ersten Bild. **Klick** – der Helmverschluss. Bis ≈ 63,5 steht der Helm; dann hebt er sich
mit weichem Anlauf, die dunkle Unterkante wandert nach oben, darunter wird Morgenblau sichtbar. Nie ein Kopf, nie Haar oder
Nacken – nur der Blick von innen (J3 Korr. 9).
**Kamera:** steht (sie ist das Auge); der Helm beschleunigt bis K19 auf **0,6 Bildhöhen je Sekunde** – derselbe Wert steht im
Drehblatt (10.3) und wird am Probedreh gemessen.
**Übergang heraus – N11, offen benannt als Wischschnitt in der Verdeckung:** Kippbild **K19** – eine dunkle ∩-Form im oberen
Drittel, an beiden Rändern bis zur Bildmitte herabgezogen (Unterkante des Helms von innen = Bügel mit Polstern). Im echten
Material wischt dieselbe Form mit 0,6 Bildhöhen/s nach oben. Der Wechsel der Bildquelle liegt in den Bildern, in denen die Form
das Bild deckt. Den Unterschied der Quellen fängt der Schnitt ab: gleiche Farbstimmung (KI-Clip auf das Morgenblau des Drehs
gegradet), gleiches Korn über beide, gleiche Bewegungsunschärfe.
**Ton:** T30 Helmverschluss-Klick (62,40), trocken, metallisch – das lauteste Einzelgeräusch des Films.
**Zweck:** Erwachen ohne Schnitt. **Sog:** schließt „Und jetzt?“ · öffnet „Wo sind wir?“.

### S16 · 65,40–70,40 s · Erwachen: Kopfhörer ab (W, echtes Material von Elias, C19, K19–K20)

**Was man sieht:** Echte Hände heben echte Over-Ear-Kopfhörer ab; das Polster wischt nach oben aus dem Bild. Blick aus den Augen
in ein Zimmer im Morgengrauen: blaue Stunde, die Schreibtischlampe brennt noch. Die Hände legen den Kopfhörer auf den Tisch.
**Kamera:** echte Handkamera auf Augenhöhe, Drehtrick „Die Kamera trägt den Kopfhörer“ (Abschnitt 10). Zum ersten Mal echtes Licht.
**Ton:** T31 der Funkfilter fällt weg, der Klang öffnet sich vom Kopf in den Raum; aus den Ohrschalen dringt blechern die Melodie –
die Quelle, die wir die ganze Zeit gehört haben · T32 ein langes Ausatmen (4 s) · Amsel · T33 Bügelklick beim Ablegen (69,00).
**Zweck:** Erlösung; Helm ab = Kopfhörer ab = zu Hause. **Sog:** öffnet „Wer ist dieser Mensch?“ · schließt „Wer atmet?“, „Wie
kommt er dorthin?“, „Wer bewegt das Lot?“, „Steckt ein Mensch drin?“, „Warum kann er nicht trinken?“, „Ist er in Gefahr?“.

### S17 · 70,40–77,40 s · Zimmer: alles, woraus er geträumt hat (W, echt, C20–C21, K20–K22)

**Was man sieht (eine ruhige Einstellung, 7 s):** 70,40–72,00 die runde Glaskugel-Lampe am Kabel (die Erde an der Leitung), das
kalte Teeglas auf dem Tisch (das Glas am Visier), Holzdielen, auf denen Morgenlicht von links liegt · 72,00–73,80 ein langsamer
Schwenk zum Fenster: der echte Mond im Morgenhimmel · 74,00–75,60 weiter zum Laptop; die Hand liegt schon an der Maus, bevor
die Kamera ankommt; die Kamera endet **frontal und ruhig** vor dem Bildschirm (Bildschirm ≥ 60 % des Bildes, Hand unten im Bild).
Auf dem Laptop die eigene Seite, live; in einem Feld blinkt ein Cursor im Takt des Sterns. 76,00 die Hand dreht **eine Raste** –
dasselbe trockene Klicken wie in Bild 1 –, die Seite rückt genau eine Stufe weiter. 76,65 ein Klick: Aus dem Klickpunkt öffnet
sich der **Portal-Kreis der eigenen Seite** in Originalgeschwindigkeit (0,75 s, `cubic-bezier(.7, 0, .25, 1)`), Creme füllt das
Bild. Nach den beschleunigten Welten läuft die Zeit wieder normal – keine schnellen Schwenks.
**Bildschirm-Ersatz:** Im Dreh zeigt der Laptop schon die echte Seite. Im Schnitt wird ab 75,60 die Playwright-Aufnahme
deckungsgleich auf die vier Bildschirmecken gesetzt (Eckpunkte verfolgt, siehe 9.1 „Einsetzen“); der Portal-Kreis kommt aus dieser
Aufnahme und wächst über den Bildschirmrand hinaus, bis Creme das Bild füllt. Weil die Kamera am Ende steht, ist die Deckung
einfach; die Naht N12 ist ein Ereignis auf dem Bildschirm, keine Kamerafahrt (bewusste Ausnahme, Entscheidung 7).
**Matrix-Abgrenzung (J2 Korr. 4):** Morgengrauen statt Nacht, helle ruhige Seite statt Terminal, niemand schläft über dem Rechner,
der Rechner tippt nichts und spricht niemanden an – nur die Hand des Menschen bewegt etwas.
**Website-Spur (≈ 8 %):** die echte eigene Seite Wagner Seiten auf dem Laptop. Die Kopfzeile „Ihre Seite, ruhig gemacht.“ nur,
wenn Elias den Wortlaut bestätigt hat (auf der Seite noch `data-pruefen`); sonst ein Ausschnitt ohne diese Zeile.
**Ton:** T34 Erzählstimme ohne Filter, nah: „Jeder Betrieb ist eine eigene Welt. Seine Website ist die Tür hinein.“ (71,40–74,6)
· T35 das Klavier spielt die vier Töne – und den fünften (73,40, unter dem Satzende): zu Hause · T36 die Raste (76,00) · T37
Klick, Portal (76,65).
**Zweck:** Traumrückstände (Grund für das zweite Ansehen); Ruhe als Markenversprechen. **Sog:** öffnet „Warum kommt mir das
Zimmer bekannt vor?“, „Was heißt das für meinen Betrieb?“ · schließt „Wer ruft?“, „Warum zuckt das Bild?“.

### S18 · 77,40–83,40 s · Schlusskarte (K, C22, K22–K23) – Text exakt in Abschnitt 7.3

**Was man sieht:** Creme `#f4efe3`. Nacheinander: der Schlusssatz, die Wortmarke, die Zielgruppen-Zeile, der Dreiklang, der Knopf
„Projekt besprechen“, um den sich ein feiner Ring schließt (der Ring des Films, ein letztes Mal), die Musterseiten-Zeile.
**Ton:** T38 „Jede Welt beginnt mit einer Seite.“ (77,60) · T39 drei leise Klaviertöne zu „Gebaut. Geprüft. Gepflegt.“ (81,00) ·
T40 weicher Klick, der Ring schließt sich (82,40). **Zweck:** Absender und genau eine Handlungsaufforderung.
**Sog:** öffnet „Wie sähe meine eigene Welt aus?“ · schließt „Wer baut solche Seiten?“, „Für wen?“.

### S19 · 83,40–85,00 s · Ausklang: die Amsel (K, C23)

Die Karte steht. **T41** Draußen pfeift eine Amsel die ersten Töne des Motivs (83,60) – der einzige Wink: War das noch ein Traum?
Sonst nichts. **Zweck:** Grund für das zweite Ansehen, ohne einen bekannten Kreisel-Beweis nachzustellen.

## 5. Der Kopfhörer-Teil (S05–S06, 41,02–49,33 s, 8,32 s)

### 5.1 Warum er in v3 schlecht aussah (Kontaktbögen 1:06–1:18)

1. **Collage statt Gegenstand:** Gesamtbild, Bügel, gespiegelte Ohrschale und Membranen waren getrennte Standbilder mit eigener
   Perspektive und eigenem Licht, in 2D zusammengeschoben. Das Auge prüft Fluchtlinien und Schatten unbewusst – und merkt es.
2. **Die „Raupe“:** Beide Ohrschalen entlang **einer** langen Linie zerlegt, Polster und Treiber doppelt in einer Reihe – ein
   Rückgrat, kein Kopfhörer. Physikalisch falsch: Jede Ohrschale hat ihre eigene Achse.
3. **Gespiegelte Teile** drehen die Lichtrichtung um.
4. **Zu viele Teile, ungleiche Abstände,** keine Lesereihenfolge; der Bügel schwebt abgelöst darüber.
5. **Leuchtringe** als „Schallwellen“ – eine Grafik-Floskel über einem fotorealen Objekt.
6. **Das Kabel hängt lose daneben** – ohne Buchse, ohne Zug.
7. **Keine Funktion in der Geschichte:** elf Sekunden Merkmal einer Musterseite, mit Überblendungen angebunden.

### 5.2 Die neue Lösung: ein Ding, eine Achse, ein Licht, eine Fahrt

**Bauregeln (A §5.3, J1 Korr. 8, J3 Korr. 6)**
- **Ein Gegenstand, eine Kamera, ein Licht:** weiches Hauptlicht oben links (wie das Produktbild der Hörwerk-Seite), kühles
  Kantenlicht rechts hinten, schwarze Leere. Licht und Perspektive ändern sich in der ganzen Szene nicht.
- **Nur die vordere Ohrschale zerlegt sich**, entlang **ihrer eigenen Achse**; Bügel, Gelenk und die zweite Ohrschale bleiben
  zusammen. In jedem Bild ist es erkennbar ein Kopfhörer. Keine zwei Muscheln auf einer Linie, keine Raupen-Silhouette.
- **Richtig herum zerlegt:** zur Kamera hin (1) gebürstete Deckelscheibe, (2) Messingring; vom Gehäuse weg Richtung Kopf
  (3) Treiber (silberne Membran mit feinen Ringen, Messingrand), (4) Polster (schwarzes Leder); dazu (5) der Stecker des
  geflochtenen Kabels, der zwei Zentimeter aus seiner Buchse gleitet – das Kabel hängt in einem ruhigen S-Bogen.
- **Saubere Abstände:** gleich große Lücken (etwa 0,6 Schalentiefen), alles bleibt auf der Achse, keine Drehung einzelner Teile.
- **Bewegung wie ein Ausatmen:** Die Deckelscheibe beginnt (sie wurde berührt), jedes weitere Teil folgt 0,15 s später; weiches
  Anlaufen, weiches Auslaufen, Stillstand in der Schwebe. Nichts federt, nichts dreht sich spektakulär.
- **Nur echte Materialien:** Aluminium, Messing, Leder, Membran. Keine Leuchtringe, keine Glas- oder Hologrammflächen. Das
  einzige Leuchten ist ein warmer Glanz, der über den Messingring läuft, als die Fingerspitze das Schild berührt.
- **Maßstab:** Die Fingerspitze gibt die Größe vor (so groß wie ein echter Kopfhörer). Geringe Tiefenschärfe, die Schärfe wandert
  vom Deckel zum Treiber.

**Woran man sieht, dass er aus einer Website besteht (10 % → 18 %)** – alles echtes Material der Hörwerk-Seite, nie von der KI;
ab 42,50 steht das Kennzeichen „Musterseite · Gezeigt: Musterseiten von Wagner Seiten“:
1. **Schild:** „Aufbau ansehen“ als Gravur auf dem Messingschild (der Knopf der Seite wird Ereignis), lesbar 43,0–44,1.
2. **Gravur:** auf der Stirnfläche des Messingrings die Kopfzeile „Hör, was bleibt.“, lesbar 45,0–46,4, während der Ring auf
   einer Geraden zur Kamera gleitet.
3. **Haarlinien:** feine Messinglinien (1 px bei 1080p) im Zeichenstil der Seite, **ohne Werte** – „Treiber 40 mm“, „Gewicht 280 g“
   und Ähnliches sind Produktdaten eines erfundenen Produkts und bleiben aus dem Film. Unser „Code“: Messing statt Grün.
4. **Wand:** Die Innenwand des Gehäuses trägt das Spaltenraster der Seite als feine Rillen – Material, nicht lesbar.
Höchstens ein lesbares Element zur gleichen Zeit, jedes ≥ 1 s.

**Ablauf (Zeiten aus `zeitleiste.json`)**

| Zeit (s) | Bild | Kamera | Ton |
|---|---|---|---|
| 41,02–44,02 | Ellipse → Messingring; der ganze Kopfhörer schwebt; Handschuh am Schild; Kennzeichen ab 42,50 (C09) | Kreisfahrt läuft aus | Motiv mono und schmal aus dem Objekt |
| 44,02–44,10 | Druck auf das Schild, Glanz läuft über den Ring | sehr langsame Annäherung | T21 satter Klick, Atem angehalten |
| 44,10–46,52 | Zerlegung, Haarlinien zeichnen sich, Gravur „Hör, was bleibt.“ (C10, 3 s bei 1,20×) | Annäherung, dreht sich auf die Achse | T22 fünf Löseklicks; T23 je Teil eine Musikschicht (bis 46,5) |
| 46,52–49,33 | Fahrt durch die Tore: über die Deckelscheibe, durch Ring und leeres Gehäuse, Ring und Deckel schließen sich hinter uns, Staubkappe (C11, KI, 3 s bei 1,07×) | Fahrt entlang der Achse | T24 Musik wird raumbreit (48,40) |

### 5.3 Wie er erzeugt wird (damit er nicht wieder zur Collage wird)

1. **Meisterbild K10** zuerst (vor allen anderen Keyframes der Szene): der geschlossene Kopfhörer in Dreiviertelansicht,
   schwarze Leere, Licht wie oben, Fingerspitze am Schild – angelehnt an das Produktbild der Hörwerk-Seite, damit Seite und Film
   denselben Kopfhörer zeigen. Schild und Ringstirn **leer** erzeugen; die Gravuren setzt Remotion.
2. **Endbild K11 = Bearbeitung von K10** (gleiche Kamera, gleiches Licht): nur die genannten Teile entlang der Achse verschoben,
   keine neuen Teile; Ausschnitt etwas enger, Blick leicht zur Achse gedreht (Kamerafahrt eingerechnet). Ring und Gehäuse
   **sichtbar hohl, innen leer und matt**; die Deckelscheibe liegt unterhalb der späteren Fahrtlinie. **Differenzbild K10/K11:**
   Bügel, Gelenk, zweite Ohrschale und Gehäuse deckungsgleich; nur bewegte Teile dürfen sich unterscheiden.
3. **C10 (K10 → K11):** ein durchgehender Clip, `kling_o3_flf`, 3 s, pro. Prompt-Kern: *precise mechanical exploded view of one
   ear cup, parts glide apart along a single straight axis, equal gaps, smooth ease-in ease-out, no rotation, no morphing, no new
   parts, no glow, blank engraving surfaces, constant soft key light from top left, black void, very slow push-in turning towards
   the axis, continuous camera motion, no pause.*
4. **C11 (K11 → K12), KI-Clip statt „gratis“:** `kling_o3_flf`, 3 s, pro, **3,75 Credits** (gedeckt durch C12 in Remotion, siehe
   9.4). Prompt-Kern: *camera glides along the axis just above the cover disc, through the hollow brass ring and the empty housing
   (inner wall with fine engraved grid grooves, no text), parts close behind the camera, ends facing the driver's dust cap with fine
   concentric rings, same light, continuous motion.* Ein 2,5D-Ebenenbau aus K11 allein trägt nicht – Innenflächen sind in K11 nicht
   zu sehen. **Rückfall**, wenn der Clip die Teile verschmilzt: drei Standbilder entlang der Achse (Blick durch den Ring, Inneres
   des Gehäuses, Staubkappe; je 0,25 Credits, aus der Reserve), daraus in Remotion ein Tunnel mit einer Perspektive.
5. **Abnahme:** in jedem Bild als Kopfhörer erkennbar · keine Teile doppelt · Kabel in der Buchse · keine Leuchtringe · Website-
   Text nur aus der Aufnahme, Gravur steht ≥ 1 s ruhig auf ihrer Fläche · Agent `kontinuitaet` prüft Skizze, Keyframes und Clips ·
   `kette-pruefen.py naehte C09.mp4 C10.mp4 C11.mp4`.
6. **9:16:** Weil die Achse in die Tiefe zeigt, funktioniert die Zerlegung auch hochkant – Bügel oben, Teile kommen auf die Kamera zu.

### 5.4 Seine Funktion in der Geschichte (vier Aufgaben)

1. **Quelle:** Die Melodie, der er seit dem Mond folgt, kommt aus diesem Gegenstand – er hat gefunden, wonach er gesucht hat.
2. **Erkenntnis:** Innen ist er aus seiner Seite gebaut. Ab hier ist die Simulation nicht mehr zu übersehen – in der Filmmitte.
3. **Tor:** Die Kamera fährt hindurch und setzt ihn auf – der Zuschauer träumt jetzt mit; dahinter liegen die Welten als Seiten.
4. **Schlüssel zum Ende:** Kopfhörer und Helm sind Zwillinge (beide umschließen den Kopf, in beiden klingt etwas nur für einen).
   Weil man ihn gesehen hat, versteht man im Zimmer ohne ein Wort: Helm ab = Kopfhörer ab = aufwachen.

## 6. Der Haken (erste 3 Sekunden)

Anforderung (Elias 1.7): Das erste Bild oder der erste Ton hält fest; der Zuschauer darf noch nicht ahnen, dass es Werbung ist.
Alle drei Varianten spielen auf dem Mond, beginnen ohne Schwarz, funktionieren **stumm** (Website und viele Feeds starten ohne
Ton) und sind ein echter KI-Clip, kein Standbild mit Effekt (J3 Korr. 10). Bis zum Wendepunkt kein Werbesignal: kein Logo, kein
Produkt, kein lesbarer Bildschirm, kein UI-Wort.

### Hauptvariante: „Beschlag mit Raste“ (A + C)

- **Erstes Bild:** Blick aus dem Helm. Durch das gewölbte Glas hängt die Erde, klein und gestochen scharf, über dem grauen
  Mondhorizont; am Rand weich der Helmrand, ein goldener Lichtsaum auf der Wölbung. Das allein wäre das bekannte Motiv – deshalb
  **stimmt in Bild 1 etwas nicht: Die Erde pendelt.** Sie schwingt langsam und deutlich (etwa 4 % der Bildbreite je Halbschwung,
  Periode ≈ 2,4 s) wie eine Lampe an einem unsichtbaren Faden; ihr Glanzlicht wandert mit. Das ist auf dem Handy und stumm vor
  der ersten Sekunde zu sehen und erst bei 12 s erklärt (die Leitung). Dazu sackt das ganze Bild um eine Raste ab und federt nach.
  Gebaut in Remotion: die Erde als eigene Ebene vor dem schwarzen Himmel (gratis, kein Risiko für den KI-Clip).
- **Erstes Geräusch (0,00):** ein scharfes Einatmen, ganz nah, binaural, mit dem kleinen Hall des Helms – darin, kaum bewusst, ein
  trockenes Klicken (die Mausrad-Raste). Keine Musik.
- **Ablauf:** 0,40–1,60 Ausatmen, das Glas beschlägt von unten und schluckt die Erde · 1,60–2,20 der Beschlag zieht sich vom Rand
  zurück, die Erde kommt wieder · 2,15 Funkknacken · 2,25 „…hört mich jemand?“ (Untertitel klein, Creme).
- **Begründung:** Ein unmögliches Detail, Bewegung und ein menschlicher Laut in Bild 1 – das Auge stutzt („Warum schwingt die
  Erde?“), Atem steckt an. Der Blick aus dem Helm macht den Zuschauer zum Astronauten. Der Beschlag nimmt ihm die Erde, die er
  gerade gesehen hat – das Auge will sie wiederhaben. Die Frage ist offen („Wer fragt?“). Stumm tragen pendelnde Erde, Zucken,
  Beschlag und Untertitel. Das Zucken ist die verborgenste Website-Spur des Films: Es wird erst bei 76,0 s aufgelöst, wenn dieselbe
  Raste im Zimmer die Seite eine Stufe weiterrückt.
- **9:16:** Der Blick aus dem Helm ist von Natur aus hochformatig (das Visier ist ein hohes Oval): Erde im oberen Drittel.

### Alternative 1: „Der Himmel springt“ (C)

- **Erstes Bild:** von außen, das klare Goldvisier formatfüllend; darin gespiegelt Erdsichel und Mondebene, gebogen von der Wölbung.
- **Erstes Geräusch:** ein scharfes Einatmen in Bild 1. Bei 1,60 springt der gespiegelte Himmel eine Raste nach oben – als hätte
  jemand gescrollt –, der Atem stockt. 2,25 „…hört mich jemand?“
- **Begründung:** der stärkste stumme Haken im Feed (ein Stutzen: „Hat das Bild gerade gesprungen?“); sofort lesbar als Helm.
  Schwächer in der Nähe zum Zuschauer (er sieht den Helden, ist ihn aber nicht).

### Alternative 2: „Falsches Spiegelbild“ (A)

- **Erstes Bild:** Das Goldvisier füllt das Bild – und spiegelt **nicht** die Erde, sondern, verzogen von der Wölbung, ein kleines
  Zimmer im Dämmerlicht: eine runde Lampe am Kabel, ein leuchtender Laptop, ein Fenster (das Zimmer vom Ende, aus Elias' echtem
  Material in das Visier gesetzt; nichts lesbar).
- **Erstes Geräusch:** sehr leise der Raumton dieses Zimmers und, wie durch eine Wand, zwei Töne der Melodie; bei 0,90 das
  scharfe Einatmen – das Spiegelbild zuckt, und der Lampenkreis ist die Erde.
- **Begründung:** ein unmögliches Bild in Bild 1 und der stärkste Grund für ein zweites Ansehen. Risiko: Das Rätsel braucht
  1–2 s, um als Rätsel erkannt zu werden – im schnellen Feed riskanter als ein Atemzug.

### Test mit Unbeteiligten (gratis, vor dem ersten Credit)

Die ersten 3 s aller drei Varianten als bewegte Skizze (ChatGPT-Skizzen, Remotion-Bewegung, Probe-Ton) **3–5 Menschen** zeigen,
die das Projekt nicht kennen – je einmal mit und ohne Ton, auf dem Handy. Zwei Fragen: **„Was glaubst du, ist das?“** und
**„Würdest du weiterschauen?“** Gewinnt die Variante mit den meisten „ja“; nennt jemand „Werbung“, ist sie raus. Ergebnis kurz in
`ops/auftraege.jsonl` vermerken. **Bei Unentschieden gewinnt keine Variante pauschal:** Die beiden gleichauf liegenden werden mit
3 weiteren Unbeteiligten nur stumm auf dem Handy nachgetestet; erst wenn auch das gleich ausgeht, entscheidet Elias
(offene Entscheidung 1).

## 7. Das Ende

### 7.1 Höhepunkt (58,12–62,40 s)

Der Sog „Visier in Visier“ beschleunigt, bis alle Kreise ein Punkt sind (60,00). Harter Tonschnitt auf digitale Stille – nach
60 Sekunden Steigerung der stärkste Schlag des Films. Ein Cursor blinkt im Takt des Sterns; kein Text. Die Spannung bricht nicht
ab, sie wird angehalten. Ab 61,40 ein goldener Saum am Rand und, kaum hörbar, Raumton und Amsel: Das Ohr wacht vor dem Auge auf.

### 7.2 Erwachen (62,40–77,40 s)

- **62,40 Klick** – der Helmverschluss. Innensicht; der dunkle Helmrand wischt nach oben aus dem Bild (KI-Clip C18, kein Kopf).
- **65,40 Bildanschluss auf die Bewegung:** Echte Hände heben echte Kopfhörer ab, das Polster wischt in derselben Richtung und im
  selben Tempo nach oben. Der Funkfilter fällt weg, der Klang öffnet sich vom Kopf in den Raum, blechern dringt die Melodie aus den
  Ohrschalen. Ein langes Ausatmen. Eine Amsel.
- **69,00** Der Kopfhörer liegt auf dem Tisch (Bügelklick). **70,40–76,65** eine ruhige Einstellung durch das Zimmer: Lampe, Glas,
  Fenster mit Mond, Laptop. **71,40** „Jeder Betrieb ist eine eigene Welt. Seine Website ist die Tür hinein.“ **73,40** das Klavier
  spielt die vier Töne – und den fünften. **76,00** eine Raste am Mausrad. **76,65** Klick, Portal-Kreis auf dem Bildschirm.

**Traumrückstände – was der Traum aus dem Zimmer gemacht hat** (nichts davon wird erklärt; zugleich Requisitenliste für Elias):

| Im Zimmer | Im Traum |
|---|---|
| die Musik in den Kopfhörern, mit denen er eingeschlafen ist | die Melodie seit dem Mond; der schwebende Kopfhörer |
| der Kopfhörer um den Kopf, das Klicken seines Bügels | der Helm, der Helmverschluss |
| der Mond vor dem Fenster | der Mond, auf dem er sitzt |
| die runde Glaskugel-Lampe am Kabel, die die Nacht über brannte | die Erde an der Leitung, die Lampe der Tischlerei |
| Holzdielen mit Morgenlicht von links | die Dielen von Praxis und Restaurant |
| das kalte Teeglas | das Glas, das er nicht trinken kann |
| die Seiten auf dem Laptop | alle Welten |
| der blinkende Cursor | der Stern, der Grund aller Welten |
| das Mausrad unter der Hand | das Zucken in Bild 1, die Rasten der Browser-Kamera |
| der eigene Atem | der Taktgeber des Falls |

### 7.3 Schlusskarte (77,40–83,40 s) und Ausklang (83,40–85,00 s) – Text exakt

```
Jede Welt beginnt mit einer Seite.

Wagner
    Seiten

Websites für Praxen, Werkstätten und Restaurants

Gebaut. Geprüft. Gepflegt.

[ Projekt besprechen ]

Gezeigt: Musterseiten von Wagner Seiten
```

- **Wortmarke** genau wie auf der eigenen Seite (aus `bauen.mjs`/`marke.css`): „Wagner“ fett, feine grüne Linie, „Seiten“ kursiv
  eine Zeile tiefer, das grüne Eselsohr – **nur hier**, nie am Anzug.
- **Domainzeile** `wagnerseiten.de`: erscheint erst, wenn die Domain gekauft ist (`data-pruefen="Domain noch nicht gekauft"`);
  bis dahin fehlt die Zeile ganz (keine Adresse, die ins Leere führt).
- **Gestaltung:** Grund Creme `#f4efe3`, Schrift Anthrazit `#26292d`, Inter (lokal); Knopf Grün `#23703f` mit cremefarbener
  Schrift; Linie und Eselsohr Logo-Grün `#2f8f4e`. Keine Preise, keine Ranking- oder KI-Versprechen, keine direkte Anrede.
- **Aufbau (bildgenau, aus `zeitleiste.json`):** 77,40 Creme steht (Ende des Portal-Kreises) · 77,60–79,40 „Jede Welt beginnt mit
  einer Seite.“ erscheint Wort für Wort mit der Stimme (kein Tippen) · 79,60 Wortmarke (das Eselsohr knickt in 0,3 s um, leises
  Papiergeräusch) · 80,30 „Websites für Praxen, Werkstätten und Restaurants“ · 81,00 / 81,45 / 81,90 „Gebaut.“ – „Geprüft.“ –
  „Gepflegt.“ auf drei Klaviertönen · 82,40 Knopf „Projekt besprechen“, ein feiner Ring schließt sich um ihn, weicher Klick ·
  82,90 Musterseiten-Zeile · bis 85,00 steht die Karte; 83,60 die Amsel pfeift die ersten Töne des Motivs, der Akkord verklingt.
  Alle Zeilen bleiben stehen, wenn die nächste kommt; ab 83,40 ist die Karte vollständig (1,6 s Ausklang).
- **Musterseiten-Zeile zweimal:** Die Zeile „Gezeigt: Musterseiten von Wagner Seiten“ steht nicht nur hier, sondern als
  Kennzeichen „Musterseite · Gezeigt: Musterseiten von Wagner Seiten“ schon von 42,50 bis 60,00 unten rechts im Bild – ab dem
  ersten lesbaren Seitentext (Grundlage §3).
- **Untertitel:** genau die gesprochenen Worte („…hört mich jemand?“, „…ganz ruhig. Atmen.“, „…wer spielt da?“, „Jeder Betrieb ist
  eine eigene Welt. Seine Website ist die Tür hinein.“, „Jede Welt beginnt mit einer Seite.“).
- Auf der eigenen Website blendet der Film danach weich in die echte Startseite über – die Karte sieht aus wie die Seite.

### 7.4 Variante ohne Elias im Bild: „Der leere Platz“ (A)

- S15 bleibt (Helm hebt sich, KI-Innensicht).
- S16 ohne Hände: Die Kamera **trägt** den Kopfhörer; er wird von hinter der Kamera nach oben abgezogen, im Bild wischt nur das
  Polster nach oben. Elias bleibt hinter der Kamera.
- S17 dieselbe ruhige Einstellung ohne Hände: Der Kopfhörer liegt schon auf dem Tisch, die Melodie dringt blechern heraus; die
  Kamera hebt sich zum Fenster und gleitet zum Laptop. Die Raste und der Klick kommen aus dem Off (Ton), die Seite rückt eine Stufe.
- Das lange Ausatmen hört man – der Mensch ist da, nur nicht im Bild. Wirkung: Der Zuschauer selbst ist der, der aufwacht.
- **Nicht** als Ausweg: eine KI-erzeugte Person (auch nicht von hinten) – das wäre eine erfundene „Elias“-Figur (Grundlage §3).
- **Ohne Stimme** geht es auch: „…hört mich jemand?“ nur als Funk-Untertitel, der Schlusssatz nur auf der Karte.

## 8. Kurzfassungen (30 s und 9:16)

Beide sind **eigene Filme mit eigener Kurve**, keine gekürzten Hauptfilme (B §8). Regeln für beide: keine Kürzung mitten in einem
durchgehenden Clip, keine Sprungschnitte (J3 Korr. 13) – Verkürzung nur über **Abkürzungsclips** (neue Clips zwischen
vorhandenen Keyframes über ausgelassene hinweg) oder **stetige Tempo-Rampen** (bis ×1,5, ab dem Kopfhörer bis ×2, Zeitlupe
höchstens 10 %). Die Kippbilder an den Nähten bleiben in jeder Fassung ganz. **Die Tempo-Regeln gehen vor der Formel:** Die
Teillängen folgen ×0,75 nur, soweit das Material es erlaubt; der Kopfhörer bleibt als Wendepunkt länger. Eine
Handlungsaufforderung: „Projekt besprechen“ – im Bild und im Ton nichts anderes. Ein Verweis auf den Link gehört, wo die
Plattform ihn braucht, in den Beschreibungstext außerhalb des Films.

### 8.1 30 Sekunden (16:9) – YouTube vor Videos, LinkedIn, Website-Teaser

YouTube-Anzeigen sind ab 5 s überspringbar: Die Erde pendelt ab Bild 1, **bei ≈ 4,8 s hängt sie sichtbar an der Leitung** – der
Überspringen-Knopf erscheint im Moment der größten Neugier.

| Teil | Zeit (s) | Dauer | Inhalt | Material | Tempo |
|---|---|---|---|---|---|
| Mond | 0,00–5,40 | 5,40 | Haken (0–3), durch das Glas nach außen, ein ruhiger Atemzug, Blick hinauf: Erde an der Leitung | C01 (3,33 s) + **A1** K02→K04 (2,07 s) | ×1,50 / ×1,45 |
| Werkstatt | 5,40–8,40 | 3,00 | unter der Lampe hindurch, Späne fliegen zurück, das Lot, Neigung an der Schnur | **A2** K04→K06 | ×1,00 |
| Praxis | 8,40–10,80 | 2,40 | die Linie zeichnet sich, vier Töne, Gleiten über die Dielen | **A3** K06→K07 | ×1,25 |
| Restaurant | 10,80–12,80 | 2,00 | Glas am Visier, Teller heben ab, „…wer spielt da?“ | **A4** K07→K09 | ×1,50 |
| Kopfhörer | 12,80–16,30 | 3,50 | Ring, Schild, Zerlegung mit Gravur, Fahrt durch die Tore | C09 (1,50 s) + **A5** K10→K12 (2,00 s) | ×2,00 / ×1,50 |
| Seiten | 16,30–18,40 | 2,10 | Eiche & Span (0,90 s lesbar), Lotlinie, ZEYTIN & GLUT als Ebenen | Remotion, neu getimt | – |
| Durchflug, Sog | 18,40–19,30 | 0,90 | vier Seiten nach Helligkeit (Lichtschutz), Visier in Visier | Remotion | – |
| Cursor | 19,30–20,10 | 0,80 | ein Blinker, Stille | Remotion | – |
| Erwachen | 20,10–24,70 | 4,60 | Klick, Helm hebt sich, Kopfhörer ab; „Jeder Betrieb ist eine eigene Welt. Seine Website ist die Tür hinein.“ | C18 (1,50 s, ×2 nach dem Stand bis 63,5) + Elias' Material | ≤ ×2 |
| Karte | 24,70–30,00 | 5,30 | „Jede Welt beginnt mit einer Seite.“ (Stimme), Wortmarke, Zielgruppen-Zeile, Dreiklang, „Projekt besprechen“, Musterseiten-Zeile | Remotion | – |

Kennzeichen „Musterseite“ ab dem Schild (≈ 14,0 s) bis zum Cursor. Ohne Amsel-Wink (keine Zeit). Der Mond hat einen ruhigen
Atemzug nach dem Schreck – Elias' „ein paar Mal durchatmen“ gilt für den Hauptfilm; die Kurzfassung zitiert ihn.
**Kosten:** 5 Abkürzungsclips A1–A5 × 3 s pro = **18,75 Credits** (Nachkauf, Entscheidung 6). Ohne A5 ginge der Kopfhörer nur mit
×2,4 – das bricht die Regel.

### 8.2 Hochkant 9:16 (30 s) – Reels, TikTok, Shorts (eigener Film)

Gleiche Teillängen wie 8.1 (Material und Tempo-Grenzen sind dieselben). **Senkrecht erzählt:** Leitung, Lot, Seitenschacht,
Scrollen und das Abheben des Helms sind senkrechte Bewegungen; Übergänge sind Neigungen, keine Schwenks.

| Teil | Zeit (s) | Inhalt (hochkant gedacht) |
|---|---|---|
| Mond | 0,00–5,40 | Blick aus dem Helm (das Visier ist ein hohes Oval), die Erde pendelt, Raste, Beschlag; „…hört mich jemand?“ (Untertitel); Neigung nach oben: die Leitung kommt vom oberen Bildrand |
| Werkstatt | 5,40–8,40 | unter der Lampe hindurch nach unten; das Lot; die Schnur läuft über die ganze Bildhöhe |
| Praxis | 8,40–10,80 | die Linie geht vom oberen bis zum unteren Bildrand durch ihn; vier Töne |
| Restaurant | 10,80–12,80 | Tellerkreis senkrecht von oben, füllt die Bildbreite und hebt ab |
| Kopfhörer | 12,80–16,30 | eine Ohrschale schaut uns an; Druck auf „Aufbau ansehen“; Zerlegung **auf uns zu**, Fahrt hinein |
| Seiten, Sog | 16,30–19,30 | **Handy-Ansichten** der drei Seiten (390 px), bildfüllend gescrollt; vier Handy-Seiten nach Helligkeit; Wirbel in den Punkt |
| Cursor | 19,30–20,10 | Stille |
| Erwachen | 20,10–24,70 | Klick, Helm hebt sich senkrecht, Kopfhörer ab (hochkant gedreht); der Satz von 71,40 |
| Karte | 24,70–29,50 | große Schrift, Schlusssatz, Wortmarke, Zeile, Dreiklang, „Projekt besprechen“, Musterseiten-Zeile |
| Schleife | 29,50–30,00 | das Creme löst sich in milchigen Dunst – den Beschlag aus Bild 1: Beim automatischen Wiederholen entsteht ein Kreis |

- **Untertitel eingebrannt**, mindestens 64 px, in der sicheren Zone (nicht im unteren Fünftel, nicht am rechten Rand).
- **Nähte hochkant:** Nie zwei an einer Naht anstoßende Clips einzeln mit `reframe` umrechnen – die ergänzten Ränder passen dann
  nicht zusammen (J3). Zwei Wege:
  1. **Mittelausschnitt (Standard):** Jedes Keyframe des Hauptfilms wird so komponiert, dass Handlung, Zwillingsform und Erde im
     **mittleren Drittel** liegen (Kompositionsregel in `02-chatgpt-briefing.md` und `03-higgsfield.md`); daraus 608 × 1080
     ausschneiden und lokal auf 1080 × 1920 hochrechnen (Faktor 1,78). **Kostet nicht 0:** Die 30-s-Zeitachse braucht dieselben
     Abkürzungsclips **A1–A5 (18,75 Credits, mit 8.1 geteilt)** – aus dem Hauptfilm-Material allein ist sie nicht regelkonform
     erreichbar. **Vor jeder Freigabe gratis prüfen:** einen Clip (C04) und eine Seitenaufnahme ausschneiden, hochrechnen
     (ffmpeg, Lanczos, leichtes Nachschärfen), auf dem Handy ansehen – Anzugkanten, Visier, Seitenschrift; dazu Flimmerprüfung.
     Fällt die Schärfe durch, gilt Weg 2.
  2. **Eigene Brücken (Nachkauf):** 8 eigene 9:16-Zwillings-Keyframes und Clips – Visier, Erde-Leitung, Lot, **Dielen (N3)**,
     Teller/Umlauf → Kopfhörer, **Zerlegung frontal (eigenes Meisterbild „auf die Kamera zu“ + Clip)**, Fahrt durch die Tore, Helm –
     **≈ 30,00 Credits** (8 × 3 s pro) plus ≈ 2,50 Credits Standbilder = **≈ 32,50**.
- Ton: dieselben Geräusche und Takes; Musik aus der Hauptmusik auf Taktschläge geschnitten, nur wenn das nicht trägt ein eigener Take.

### 8.3 Aus demselben Material

| Teil | 30 s quer | 9:16 |
|---|---|---|
| KI-Welten | dieselben Keyframes, 5 Abkürzungsclips A1–A5, Rampen | Mittelausschnitt aus denselben Clips (A1–A5 geteilt) oder 8 eigene Brücken |
| Kopfhörer | C09 als Rampe + A5 | Weg A (Achse in die Tiefe) aus dem Ausschnitt, sonst eigenes Meisterbild |
| Seiten, Durchflug, Cursor, Karte | Remotion aus der Zeitleiste neu gerendert (gratis) | Remotion mit Handy-Aufnahmen, Hochformat-Layout (gratis) |
| Echtes Material | dieselben Einstellungen, kürzer | hochkant gedreht (Drehliste Abschnitt 10) |

Jede Kurzfassung bekommt eine eigene Zeitleiste (`zeitleiste-30s.json`, `zeitleiste-9x16.json`) im selben Format, geprüft mit
`zeitleiste.py pruefen` (Zeitlupe und Kette werden dort mitgeprüft).

## 9. Produktionslogik, Clips, Credits

### 9.1 Wer macht was (Elias 1.8, 1.9)

| Wer | Was | Wie |
|---|---|---|
| **ChatGPT** | Skizzen je Szene | `02-chatgpt-briefing.md`: Stil, Wirkung, Stimmung, Kontext, roter Faden – **nicht** genau vorgeschrieben. Fest sind nur die Zwillingsformen an den Nähten und die Kompositionsregel „Handlung im mittleren Drittel“ (für 9:16) |
| **Higgsfield** | Originale: Standbilder (`gpt_image_2_5`) und Clips (`kling_o3_flf`, Start- + Endbild) | `03-higgsfield.md`: Keyframe-Kette, Prompts, Kosten; jeder Auftrag erst nach Elias' ausdrücklichem OK, einzeln, nie doppelt gesendet |
| **ElevenLabs** | Ton: Atem, Geräusche, Leitmotiv, Erzählstimme, Musik | `04-ton.md`; Musik zuletzt gegen das fertige Bild |
| **Playwright** | echte Seitenaufnahmen (Desktop 1920 × 1080, Handy 390 px), bildgenau, gratis | alle lesbaren Website-Teile; nie KI-Schrift; Quellen und Prüfung je Aufnahme in 9.7 |
| **Remotion** | Schnitt, Website-Ebenen, Gravuren, Kennzeichen „Musterseite“, Cursor-Stern, pendelnde Erde, Durchflug, Sog, Karte, Untertitel | eine Zeitleiste als einzige Quelle |
| **Einsetzen (Tracking)** | jede Website-Spur auf einem bewegten KI-Clip oder Dreh (Maß S02, Lot-Licht S03, Fokusrahmen S04, Gravuren S05/S06, Bildschirm S17) | **lokal und gratis:** 2D-Punktverfolgung (OpenCV, in Tor 0 eingerichtet und an einem Probeclip getestet) liefert je Bild Position, Maßstab und Drehung bzw. vier Ecken; Remotion liest den Pfad als JSON. Wo das Teil sich gerade bewegt (Ring der Zerlegung), wird der Pfad aus der bekannten Rampe gerechnet. **Regeln:** Spuren nur in Einstellungen mit langsamer, gleichmäßiger Kamera; die Zielfläche im KI-Bild leer erzeugen (*surface blank, camera slow* in jedem betroffenen Prompt). **Prüfkriterium je Spur:** Position stabil auf ±2 px (1080p) über ≥ 1 s, keine Drift gegenüber der Fläche, Prüfung am Kontaktbogen (`kette-pruefen.py kontaktbogen`) |
| **Elias** | echtes Material im Zimmer (Abschnitt 10), Freigaben | nur echtes Material oder anonym |
| **Werkzeuge** | je Szene Skill `/filmszene`; Agent `kontinuitaet` prüft jede Skizze, jedes Keyframe, jeden Clip (Zwillinge, Anzug, Website-Anteil, Nähte, 9:16); `traum/zeitleiste.py pruefen`; `traum/kette-pruefen.py naehte`; `aufnahme/film-pruefung.py` (Flimmern, Blitzschutz); Hook `werkzeuge/kosten-waechter.py` fragt vor jedem bezahlten Aufruf (ersetzt nie Elias' OK); `traum/storyboard.py` baut die Arbeitsseite | |

### 9.2 Keyframe-Kette (Higgsfield-Standbilder, Zeiten aus `zeitleiste.json`)

| KF | Zeit | Inhalt | Zwilling / entsteht aus |
|---|---|---|---|
| K01 | 0,00 | Blick aus dem Helm, Erde über dem Mondhorizont (Erde als eigene Ebene für das Pendeln) | neu (Haken) |
| K02 | 5,00 | Goldvisier nah, dieselbe Erde gespiegelt | Zwilling von K01: Erde an derselben Stelle |
| K03 | 10,00 | Astronaut auf dem Felsen im Profil, Kopf leicht gesenkt (lauscht), Brustkorb im Einatmen | neu, Tonwert v3_51.0s |
| K04 | 15,00 | **N1** Kugel an der Leitung | neu, als Mischform; Teilreferenz K03 (Erde) |
| K05 | 20,00 | Tischlerei unter der Lampe, Pose wie K03 | **Bearbeitung von K03** (Pose, Lage, Licht bleiben) |
| K06 | 26,25 | **N2** Schnur mit Lot, Handfläche darunter, Stiefelspitze am Rand, oben Eiche, unten Weiß | neu |
| K06b | 30,50 | Praxis, er steht aufrecht im Raum, Linie senkrecht, Licht von links | **Bearbeitung von K05** für Pose und Anzug, Raum neu |
| K07 | 34,68 | **N3** Dielen, Licht links, Schatten rechts | neu |
| K08 | 37,85 | Tisch mit Tellerkreis, Glas am Visier, Kamera schon in Kreisbewegung | neu |
| K09 | 41,02 | **N4** goldene Ellipse | Bearbeitung eines Ausschnitts von K10 (derselbe Ring) – `zwilling_von` K10 |
| K10 | 44,02 | **Meisterbild Kopfhörer** geschlossen, Schild und Ringstirn leer | **zuerst** erzeugt (Vorbild: Produktbild der Hörwerk-Seite) |
| K11 | 46,52 | Kopfhörer, vordere Ohrschale geöffnet, Ring und Gehäuse hohl, Deckel unter der Fahrtlinie | **Bearbeitung von K10**, Differenzbild-Prüfung |
| K12 | 49,33 | **N5** Staubkappe = Jahresringe | Bearbeitung eines Ausschnitts von K11 – `zwilling_von` K11 |
| K13 | 50,33 | Tischlerei im Ausschnitt von K05, flaches Standbild | Ausschnitt von K05 (gratis, keine Erzeugung, keine eingesetzte Seite) |
| K13b | 50,83 | echte Seite Eiche & Span als Ebenen | Aufnahme (gratis), Quelle 9.7 |
| K14–K15 | 54,00 · 55,50 | echte Seiten Lotlinie, ZEYTIN & GLUT | Playwright (gratis) |
| K16 | 58,12 | Goldvisier mit leerer, neutral grauer Spiegelfläche + Maske | Bearbeitung von K02 – `zwilling_von` K02; Seiten setzt nur Remotion ein |
| K17 | 60,00 | Schwarz, Cursor | Remotion (gratis) |
| K18 | 62,40 | Innensicht wie K01, Lichtpunkt in der Mitte | Bearbeitung von K01 |
| K19 | 65,40 | **N11** dunkle ∩-Form im oberen Drittel, Morgenblau | Bearbeitung von K18 – `zwilling_von` K18; Vorlage für Elias' Dreh |
| K20–K24 | 70,40–85,00 | Zimmer, Bildschirm frontal (K21 76,65), Karte (K22 77,40) | Elias' Material, Playwright, Remotion (gratis) |
| Hilfsbild „Fall“ | – | Astronaut fallend, Arme ruhig, auf gleichmäßig grauem Grund | neu mit Referenzbogen (Freisteller für S10–S13) |

Jedes Bild mit Astronaut bekommt Referenzbogen, Anzug-Textbaustein und Negativliste (Abschnitt 3). Jedes KI-Bild wird auf
Pseudo-Schrift geprüft; Flächen, auf die später Text oder eine Seite kommt (Schild, Ringstirn, Brett, Visierfläche, Bildschirm),
werden leer erzeugt.

### 9.3 Clips (Higgsfield `kling_o3_flf`, pro, 1,25 Credits je Sekunde laut Kostenabfrage 02.11.2026)

| Clip | Start → Ende | erzeugt | im Film | Tempo (Mittel) | Art | Credits |
|---|---|---|---|---|---|---|
| C01 | K01 → K02 | 5 s | 0,00–5,00 | 1,00× | Haken, Glas | 6,25 |
| C02 | K02 → K03 | 5 s | 5,00–10,00 | 1,00× | Mond, **Anzug-Test** | 6,25 |
| C03 | K03 → K04 | 5 s | 10,00–15,00 | 1,00× | Morph N1 (Teil 1) | 6,25 |
| C04 | K04 → K05 | 5 s | 15,00–20,00 | 1,00× | Morph N1 (Teil 2) | 6,25 |
| C05 | K05 → K06 | 6 s | 20,00–26,25 | 0,96× | Werkstatt | 7,50 |
| C06a | K06 → K06b | 4 s | 26,25–30,50 | 0,94× | Morph N2, Praxis | 5,00 |
| C06b | K06b → K07 | 4 s | 30,50–34,68 | 0,96× | Praxis → Morph N3 | 5,00 |
| C07 | K07 → K08 | 3 s | 34,68–37,85 | 0,95× | Morph N3 (Restaurant) | 3,75 |
| C08 | K08 → K09 | 3 s | 37,85–41,02 | 0,95× | Morph N4 (Teil 1) | 3,75 |
| C09 | K09 → K10 | 3 s | 41,02–44,02 | 1,00× | Morph N4 (Teil 2) | 3,75 |
| C10 | K10 → K11 | 3 s | 44,02–46,52 | 1,20× (Rampe 1,00 → 1,35 → 1,10) | Zerlegung | 3,75 |
| C11 | K11 → K12 | 3 s | 46,52–49,33 | 1,07× | Fahrt durch die Tore | 3,75 |
| C18 | K18 → K19 | 3 s | 62,40–65,40 | 1,00× | Helm hebt sich | 3,75 |
| **13 Clips** | | **52 s** | | | | **65,00** |

Nicht bei Higgsfield (gratis): C12, C16, C17, C22, C23 (Remotion) · C13, C13b, C14, C15, C21 (Seitenaufnahmen) · C19–C20 (Elias'
Material). Tempo jedes KI-Clips im Mittel zwischen 0,94× und 1,20× (J3 Korr. 3); keine Zeitlupe über 10 % (`zeitleiste.py`:
0 Hinweise). **An jeder Naht höchstens ±6 % Tempo-Sprung:** Unterschiede werden in Remotion als stetige Rampe über die Clipmitte
gelegt (Spalte „Tempo“: Mittelwert; bei C10 der Verlauf). Größte Sprünge: C08 → C09 und C10 → C11 je ≈ 5 %.

### 9.4 Credit-Plan (Guthaben laut Grundlage: 87,25 Credits)

| Posten | Menge | Credits |
|---|---|---|
| Anzug-Referenzbogen | 6 Bilder (4 Ansichten, Visier, Handschuh) × 0,25 | 1,50 |
| Keyframes und Hilfsbild „Fall“ mit Ø 2 Versuchen | ≈ 32 Bilder × 0,25 | 8,00 |
| Clips Hauptfilm | 13 Clips, 52 s pro | 65,00 |
| **Plan** | | **74,50** |
| **Reserve** für Nachdrehs | ≈ 10,2 s pro = 31 % der 33 riskanten Sekunden (Morphs C03, C04, C06a, C06b, C07, C08, C09, C18 = 30 s, dazu die Fahrt C11) | **12,75** |
| **Summe** | | **87,25** |

- **Was C11 kostet, spart C12:** C11 ist jetzt ein KI-Clip (+3,75), dafür entsteht C12 (Jahresringe → flache Tischlerei) gratis in
  Remotion (−3,75) – die Tischlerei soll dort ohnehin flach sein. C07 ist 3 s statt 4 s (−1,25), C10 3 s statt 4 s (−1,25),
  die Teilung von C06 kostet nichts extra (2 × 4 s = 8 s), nur ein Keyframe (K06b).
- **Puffer ehrlich:** Ein Nachdreh einer C06-Hälfte (5,00) frisst 39 % der Reserve, einer von C03/C04 (6,25) 49 %. Zwei
  Nachdrehs dieser Größe sind gedeckt, drei nicht. Bezahlte Folgefassungen (9:16, 30 s) liegen ganz außerhalb des Guthabens.
- **Sparhebel, falls die Reserve schmilzt (in dieser Reihenfolge):** C02 in std (−1,25) · C05 in std (−1,50) · C01 in std
  (−1,25). **Nicht sparen** an C03/C04, C06a/C06b, C08–C11 (Nähte N1–N4 und der Kopfhörer – Elias' ausdrücklicher Auftrag).
- **Kurzfassungen kosten extra (Nachkauf, Entscheidung 6):** 30 s quer A1–A5 = 18,75 · 9:16 im Mittelausschnitt nutzt dieselben
  A1–A5 (geteilt, mindestens 18,75 ohne 30-s-Fassung) · 9:16 mit eigenen Brücken ≈ 32,50 (8 Clips + Standbilder).
- **Preise vor Tor 3 gratis per `get_cost` abfragen** (kein Auftrag): `kling_o3_flf` pro und std für **3, 4, 5, 6 s**, dazu
  `gpt_image_2_5` je Bild und – nur falls gebraucht – `fps_boost` und `remove_background`. Die Tabelle 9.3 wird mit den abgefragten
  Werten überschrieben; weicht ein Preis ab, zuerst die Sparhebel prüfen, dann Elias fragen. Die Schätzung ist keine Freigabe.
- **ElevenLabs** (eigenes Guthaben, Bezugswerte der Grundlage): Geräusche ≈ 3.500 · Musik 2 Takes ≈ 1.800 · Erzählstimme
  (Stimmdesign + Takes der fünf Sätze) ≈ 1.700 · **gesamt ≈ 7.000 ElevenLabs-Credits**, ebenfalls nur nach Freigabe.

### 9.5 Ablauf in Toren (jedes Tor = Elias' ausdrückliche Freigabe)

| Tor | Was | Kosten | Elias sieht |
|---|---|---|---|
| 0 | **Leitmotiv festlegen** (vier Töne + der fünfte, Tonart, Tempo – vor allem anderen, B §9.4); Seitenaufnahmen (Playwright, Quellen 9.7, Prüfspalte „keine Preise, keine erfundenen Zahlen“); Helligkeit der Durchflug-Seiten messen; Tracking-Werkzeug an einem Probeclip einrichten; ChatGPT-Skizzen; **Animatik**: der ganze Film als getimte Bildfolge aus Skizzen, Seitenaufnahmen und Probe-Ton; Ereignisdichte E je Szene nachzählen (§2); Haken-Test mit Unbeteiligten; Sog-Plan an der Animatik prüfen; Hochrechnen-Test 9:16 (8.2) | 0 | Rhythmus, Atem, Haken, Sog – solange es nichts kostet |
| 1 | Anzug-Referenzbogen | ≈ 1,50 | den Helden |
| 2 | Standbildkette aller Keyframes inkl. Zwillinge, K06b und Hilfsbild „Fall“, Überlagerungsprüfung je Naht durch `kontinuitaet` (alle Paare mit `zwilling_von`) | ≈ 8,00 | den Film als Standbildfolge, Nähte als Überlagerung |
| 3 | **Probe als bezahltes Tor:** C02 (Anzug-Test, nahtfrei), dann die riskantesten Nähte **N1** (C03 + C04), **N2/N3** (C06a + C06b) und **N4 + Kopfhörer** (C08 + C09 + C10 + C11) | 43,75 | ob Morphs tragen und der Anzug hält; `kette-pruefen.py naehte`; beide Bildraten (9.6). **Halt, wenn eine Naht „Sprung“ oder eine Überblendung zeigt:** erst Zwischenbild oder Rückfall bauen, dann weiter |
| 4 | Paket A: C01, C05, C07 · Paket B: C18 | 17,50 + 3,75 | Clips in Filmreihenfolge; Startbild = echtes letztes Bild des Vorgängers (`kette-pruefen.py letztes-bild`) |
| 5 | Ton: Leitmotiv-Einzeltöne, Atem, Geräusche, Erzählstimme; **Musik zuletzt** gegen das fertige Bild | ElevenLabs | Tonblatt `04-ton.md`, Spitze jedes Geräuschs aufs Bildereignis |
| 6 | Schnitt, Einsetzen mit Tracking-Prüfung, Prüfungen (Nähte, Flimmern, Blitzschutz, Synchronität, −14 LUFS / −1 dBTP), **private Prüfseite** | 0 | den fertigen Film; eingebaut wird erst nach Freigabe |

### 9.6 Bildrate: 24 oder 60 B/s (Entscheidung vor der ersten Erzeugung)

- **Playbook-Standard ist 60 B/s** in beiden Formaten; Scrollen, Rasten und Seitenaufnahmen wirken bei 60 B/s ruhig, bei 24 B/s
  ruckeln sie. Die Zeitleiste ist bildgenau für 60 B/s gebaut.
- **Kling-Clips kommen vermutlich mit 24 B/s** (Annahme aus Entwurf C, am ersten Clip prüfen). Auf 60 B/s heben heißt Zwischenbilder
  rechnen – an Morphs können dabei Schlieren entstehen. C empfahl deshalb 24 B/s für alles.
- **Werkzeug der Umrechnung (verbindlich):** lokal und gratis – zuerst ffmpeg `minterpolate` (bewegungskompensiert), als zweiter
  Versuch RIFE (lokal). Higgsfield `fps_boost` nur, wenn beide Schlieren zeigen, und nur nach `get_cost` und Elias' OK.
- **Empfehlung:** 60 B/s als Master. In Tor 3 wird C04 (Morph N1) beide Wege fertig gemacht – (a) lokal auf 60 B/s gerechnet,
  (b) in 24 B/s belassen – und Elias sieht beide nebeneinander. Zeigt (a) Schlieren, gilt 24 B/s für den ganzen Film (dann rundet
  das Skript alle Zeiten neu auf 24 B/s; eine Ausnahme vom Playbook, die Elias festschreibt). Gemischt (KI 24, Seiten 60) wird nicht.

### 9.7 Risiken, Quellen der Seiten, Aufnahmeliste

| Risiko | Gegenmittel |
|---|---|
| Modell überblendet statt zu morphen | Zwilling B als Bearbeitung von A; verschiedene Ausschnitte statt deckungsgleicher Bilder; Zwischenbild halb/halb (wie K06b); 2,5D-Rückfall |
| Stopp-und-los an einer Naht | „continuous camera motion, no pause“; gleiche Richtung und Geschwindigkeit; ≤ ±6 % Tempo-Sprung; 2–4 Bilder überlappen |
| Fahrt durch den Kopfhörer (C11) verschmilzt Teile | K11 mit hohlen, leeren Innenflächen; Probe in Tor 3; Rückfall: drei Standbilder entlang der Achse (≈ 0,75 aus der Reserve) |
| Website-Spur schwimmt auf dem Bild | Tracking-Schritt (9.1) mit ±2-px-Kriterium; nur bei langsamer Kamera; Zielflächen leer erzeugen |
| Anzug driftet | Referenzbogen, Textbaustein, Negativliste; Anzug-Test C02 zuerst; in tiefen Welten klein oder Freisteller |
| Pseudo-Schrift im KI-Bild | Flächen leer erzeugen, jedes Bild prüfen, Text nur aus Seitenaufnahmen |
| Kopfhörer wird wieder Collage | Meisterbild zuerst, Endbild als Bearbeitung, Differenzbild, C11 als echter Clip statt Ebenen aus einem Außenbild |
| Kein Mond am Drehmorgen | Mond an einem anderen Morgen echt aufnehmen und ins Fenster setzen |
| Reserve schmilzt | Sparhebel 9.4; Nähte und Kopfhörer haben Vorrang |

**Quellen aller gezeigten Seiten** (Stand Repo 03.11.2026; „Quelltext“ = ausführbare Seite, nötig für Scrollen, Ebenen-Trennung
per DOM und Animationen). Zur Grundlage §4: „im Repo“ heißt dort „in `kunden/elias-studio/inhalt/seite.json` eingetragen“ – der
Quelltext von ZEYTIN & GLUT, Lotlinie, Lindgrund, NORVAK und Zwischenbild liegt **nicht** im Repo, nur Artifact-Link und
Langscreenshots. Das ist kein Widerspruch mehr, sondern hier genau festgehalten.

| Seite | genutzt in | Quelle heute | Aufnahmeweg |
|---|---|---|---|
| Eiche & Span | S02 (Maß), S07 | nur v3-Aufnahme (4K, Elias' Projektordner) | Ebenen aus rechteckigen Ausschnitten der Aufnahme (Kopfzeile, Bild, Maß); echte DOM-Ebenen nur, wenn Elias den Quelltext nennt |
| Hörwerk | S05, S06, S12 | nur v3-Aufnahme | Schrift und Texte der Aufnahme für die Gravuren; Durchflug aus der Aufnahme |
| Lotlinie | S03, S08 | Artifact-Link (`seite.json`, ruhend) + Langscreenshots `public/medien/arbeit-hell-*` | Zeichnung `lot-zeichnen` **nur aus dem Artifact** (Artifact-HTML lokal ausliefern und mit Playwright aufnehmen) |
| ZEYTIN & GLUT | S04 (Fokus-Stil), S09 | Artifact-Link + `arbeit-glut-*` | Fokusrahmen und Rasten aus dem Artifact; sonst Langscreenshot 1440 → 1920 |
| Lindgrund | S10 | Artifact-Link + `arbeit-edel-*` | Langscreenshot 1440 → 1920 genügt (≤ 0,4 s im Bild) |
| Zwischenbild | S12 | Artifact-Link + `arbeit-laut-*` | Langscreenshot genügt |
| Blütenwerk Lilou, Zeit für Zimt, Salon Ambra, Pulsraum, Nachtfalter, Pixelhain Arcade | S10–S12 | nur v3-Aufnahmen, nicht im Repo | v3-Aufnahme; **fehlt eine, entfällt die Seite** (S10–S12 zeigen nur Seiten mit Quelle, mindestens zwei je Szene) |
| NORVAK | – | Artifact + `arbeit-norvak-*` | entfällt (zeigt Kennzahlen) |
| Wagner Seiten | S17, Karte | eigener Quelltext `kunden/elias-studio` | Playwright lokal |

**Aufnahmeliste – Prüfung je Aufnahme „keine Preise, keine erfundenen Zahlen“** (wird in `03-higgsfield.md` übernommen, sobald das
Blatt angelegt ist; `kontinuitaet` hakt jede Zeile am Bild ab):

| Aufnahme | Ausschnitt | keine Preise | keine erfundenen Zahlen / Kennzahlen | Kennzeichen sichtbar |
|---|---|---|---|---|
| Eiche & Span | Kopfzeile, Bild, Maß „18 cm“ | prüfen | „18 cm“ ist ein Bleistiftmaß, keine Leistungszahl – zulässig | ja (S07) |
| Hörwerk | Knopf, Kopfzeile | prüfen | **Werte „40 mm“, „280 g“ nicht verwenden** | ja (ab 42,50) |
| Lotlinie | Kopfzeile, Strichfigur | prüfen | keine | ja |
| ZEYTIN & GLUT | Schriftzug, runde Speisefotos | **Speisekarte mit Preisen nicht im Bild** | keine | ja |
| Lindgrund | Startbild | prüfen | „Zwölf Uhren im Jahr“ nicht lesbar (≤ 0,4 s), Ausschnitt ohne Zahlenzeile wählen | Bildecke |
| v3-Seiten (6) | Startbilder | prüfen | Ausschnitt ohne Zahlen, Termine, Preise | Bildecke |
| Wagner Seiten (Laptop) | Abschnitt ohne Preise und ohne Messwerte (die Seite führt Preisanzeigen, `seite.json` `preis_*`) | **Pflicht** | Messwerte nicht im Bild | – (eigene Seite) |

## 10. Handgriffe für Elias (eigenes Material drehen)

Etwa eine Stunde an einem Morgen. Kein Gesicht nötig, nichts Privates im Bild (Post, Fotos, fremde Bildschirme, Benachrichtigungen).

### 10.1 Wann und wo

- **Blaue Stunde:** etwa 30–45 Minuten vor Sonnenaufgang. **Mond im Fenster:** ein Morgen einige Tage nach Vollmond (dann steht
  er morgens im Westen) – vorher im Mondkalender prüfen. Kein Mond am Drehtag: Mond an einem anderen Morgen getrennt aufnehmen
  (Telefon auf Stativ, 2× Zoom, 10 s ruhig) und ins Fenster setzen.
- Der Tisch steht so, dass das **Fenster links** liegt: Das Morgenlicht fällt von links über Tisch und Dielen (wie an der Naht N3).

### 10.2 Licht

- Raumlicht aus. Die **runde Glaskugel-Lampe am Kabel** brennt warm (sie ist die Erde an der Leitung); wenn keine da ist, eine
  ähnliche Pendelleuchte ausleihen oder Entscheidung, die Lampe wegzulassen (dann entfällt nur dieser Traumrückstand).
- Laptop-Helligkeit auf etwa die Hälfte, damit der Bildschirm nicht ausbrennt; Night-Shift/Blaufilter aus.
- Belichtung am Telefon auf das Fenster sperren (antippen und halten), dann leicht abdunkeln – die Lampe darf glühen, nicht weiß
  ausfressen. Weißabgleich fest (ca. 4000–4500 K), damit sich die Farbe in der Bewegung nicht ändert.

### 10.3 Bewegung – der Drehtrick „Die Kamera trägt den Kopfhörer“

1. Telefon im Querformat auf Augenhöhe (Kopfhalterung oder Stativ mit Kugelkopf), 4K, **60 B/s**; danach dasselbe hochkant für 9:16.
2. Den Kopfhörer so um das Telefon legen, dass die Polster links und rechts am Bildrand sind (das Telefon ist der Kopf); den
   Kopfhörer ein paar Zentimeter **vor** die Linse versetzen und das Telefon auf Stirnhöhe stellen, so dass der **Bügel als dunkler
   Bogen im oberen Drittel** zu sehen ist und die Polster an beiden Rändern herabhängen – die ∩-Form von K19.
3. **Aufnahme läuft** → Elias hebt den Kopfhörer mit beiden Händen gleichmäßig **nach oben** ab: Bügel und Polster wischen mit
   **0,6 Bildhöhen je Sekunde** nach oben aus dem Bild (die halbe Bildhöhe in ≈ 0,8 s) – derselbe Wert wie der Helm an K19.
   Beim Probedreh am Kontaktbogen messen (Bildhöhen je Sekunde) und mit dem Helm-Clip C18 vergleichen; Bogenform und Höhe gleich.
4. Kopfhörer auf den Tisch legen (Bügel klickt). Dann **langsam** (je Schwenk ≈ 1,8 s): Lampe, Fenster (Mond), Laptop. Die Hand
   liegt schon an der Maus, bevor die Kamera beim Laptop ankommt; die Kamera endet **frontal, bildfüllend (≥ 60 %) und ruhig** vor
   dem Bildschirm und **hält 2 s** – dann eine Raste am Mausrad, dann ein Klick. Auf dem Laptop läuft die echte eigene Seite (ohne
   Preise im Bild); der Portal-Kreis wird später aus der Aufnahme deckungsgleich auf den Bildschirm gesetzt.
5. Bewegungen langsam wie beim Atmen; keine Zooms, keine schnellen Schwenks. Je **3 Durchgänge quer und 3 hochkant**.
6. **Ohne Hände** („Der leere Platz“, 7.4): dasselbe, aber der Kopfhörer wird von hinter dem Telefon abgezogen; danach liegt er schon
   auf dem Tisch.

### 10.4 Requisiten (die Traumrückstände)

Over-Ear-Kopfhörer, schwarz, am besten mit Metall- oder Messingakzent (beim Dreh leise die Probe-Melodie darin) · runde
Glaskugel-Lampe am Kabel · ein Teeglas, halb voll, kalt · Holzdielen oder Holztisch · Laptop mit der echten eigenen Seite
(Kopfzeile „Ihre Seite, ruhig gemacht.“ nur nach Bestätigung des Wortlauts) · eine Maus mit hörbarer Raste.

### 10.5 Ton am Drehort (Option, Standard ist ElevenLabs)

Raumton zwei Minuten bei offenem Fenster in der Dämmerung (Amsel) · Bügelklick · Ablegen auf dem Tisch · die Mausrad-Raste und der
Klick nah aufgenommen. Wenn Elias will: das lange Ausatmen und die Sätze in eigener Stimme (Entscheidung 3) – Telefon nah am Mund
in einem kleinen gedämpften Raum (vor dem offenen Kleiderschrank klingt es nach Helm), je Satz dreimal.

## 11. Offene Entscheidungen (7, je mit Empfehlung)

| # | Frage | Empfehlung |
|---|---|---|
| 1 | **Haken:** „Beschlag mit Raste“ (mit pendelnder Erde), „Der Himmel springt“ oder „Falsches Spiegelbild“? | Test mit 3–5 Unbeteiligten (gratis, Abschnitt 6); bei Unentschieden Nachtest der beiden Besten mit 3 weiteren Personen, erst danach Elias |
| 2 | **Elias im Bild:** echte Hände im Zimmer oder „Der leere Platz“ ohne Person? | echte Hände (stärkster Bildanschluss, kein Gesicht nötig); „Der leere Platz“ bleibt fertig geplant als Ausweich |
| 3 | **Stimme:** gestaltete ElevenLabs-Erzählstimme oder Elias' eigene Stimme? | ElevenLabs als Standard (Arbeitsteilung 1.8), ruhig, warm, nah, ohne Sprecherpathos; Elias' Stimme nur, wenn er sie selbst gut findet – eine KI-Stimme spricht nie in seinem Ich |
| 4 | **Bildrate:** 60 B/s (Playbook) oder 24 B/s für den ganzen Film? | 60 B/s, entschieden an C04 in Tor 3 mit beiden Fassungen nebeneinander (9.6) |
| 5 | **Freigaben für Inhalte:** (a) Lotlinie (im Repo „ruhend“) als Praxis-Welt und -Seite; (b) Wortlaut „Ihre Seite, ruhig gemacht.“ auf dem Laptop; (c) Quellen **aller 12 gezeigten Seiten** (Tabelle 9.7): Quelltext oder Artifact-HTML für Eiche & Span, Hörwerk, Lotlinie, ZEYTIN & GLUT; v3-Aufnahmen für Blütenwerk Lilou, Zeit für Zimt, Salon Ambra, Pulsraum, Nachtfalter, Pixelhain Arcade; Langscreenshots genügen für Lindgrund und Zwischenbild | (a) freigeben – einzige Praxis-Musterseite; (b) bestätigen oder Ausschnitt ohne die Zeile; (c) Projektordner bzw. Artifacts nennen; fehlende Seiten fallen aus S10–S12 heraus |
| 6 | **Kurzfassungen:** gleich mitplanen oder nach dem Hauptfilm? Nachkauf 18,75 (30 s, A1–A5; der 9:16-Mittelausschnitt nutzt dieselben) oder ≈ 32,50 (9:16 eigene Brücken) Credits | Hauptfilm zuerst im Guthaben (87,25); 9:16 erst gratis hochrechnen und prüfen (8.2); Nachkauf erst nach Abnahme des Hauptfilms entscheiden |
| 7 | **Zwei Übergänge ohne Morph:** N11 als offen benannter Wischschnitt in der Verdeckung (KI → echtes Material) und N12 als Portal-Kreis der eigenen Seite auf dem Bildschirm – als bewusste Ausnahmen nach dem Traum bestätigen? | bestätigen: Im Traum bleibt jeder Übergang ein Morph in der Kamerabewegung; beim Erwachen wechselt die Wirklichkeit, und der Portal-Kreis ist ein echtes Stück der eigenen Seite. Ausweich für N12: Kamera fährt im Dreh in den Bildschirm, Creme der Seite füllt das Bild (kein Kreis) |

Nicht offen, sondern festgelegt: kein Hartschnitt im Traum · genau eine Handlungsaufforderung „Projekt besprechen“ · Schlusssatz
„Jede Welt beginnt mit einer Seite.“ · keine Preise, keine Ranking- oder KI-Versprechen · keine echten Personen nachgestellt,
keine KI-Person · Domainzeile erst nach dem Kauf · Vorleseprogramm-Variante (C) nur, wenn Elias' Prüfpraxis sie wahr macht.

## 12. Auftrag → wo erfüllt (Grundlage Abschnitt 1)

| # | Elias' Auftrag | Wo im Drehbuch erfüllt |
|---|---|---|
| 1 | Mond bleibt erste Sequenz; Astronaut im Raumanzug, atmet ein paar Mal durch | S01 (0–15 s): nach dem Schreck-Einatmen in der Innensicht (T01) zwei ruhige Atemzüge, hörbar **und sichtbar** am Körper (T06 5,30: Schultern, Rucksack, Ventilfahne; T07 10,00: Brustkorb, Staub vom Knie); drei Atemzüge im Takt 12/min; Anzug-Bibel §3 |
| 2 | Andere Sequenz ohne Hartschnitt; Übergang morpht in der Schwenkung der Kamera; jeder Übergang glatt und perfekt | Im Traum (N0–N10) nur Kippbild-Nähte (§4.0) mit Form-, Farb- und Bewegungsträger; wechselnde Bewegungsarten; acht Naht- und Bauregeln, ≤ ±6 % Tempo-Sprung; Zwillinge per Bearbeitung; Zwischenbild K06b; Prüfung `kette-pruefen.py naehte`; Durchflug statt Klick-Schnitt; Erde → Lampe als eigene Form statt Elias' Beispielmuster. Nach dem Traum zwei offen benannte Ausnahmen (N11 Wischschnitt in der Verdeckung, N12 Portal-Kreis) zur Bestätigung (Entscheidung 7) |
| 3 | Es geht immer weiter, alles wird immer komischer, man rutscht immer tiefer in weitere Träume | Reihe d(n) = 15 × 0,75ⁿ bis zum unendlichen Sog (§2); je Welt ein unmögliches Ereignis, das das vorige übertrifft (pendelnde Erde ab Bild 1, Späne fliegen zurück, Schatten richtet sich auf, Teller kreisen); Fremdheit ×1,21 bis S13; Kamera-Grammatik kippt (§1); Traum im Traum: Kopfhörer aufsetzen, Visier in Visier |
| 4 | Langsam sieht man bei ein paar Dingen, dass sie aus Elias' Websites bestehen (statt Matrix-Code) | Website-Anteil ×1,75 je Ebene bis zur Sättigung: verborgen (Cursor-Stern, Raste) → bewusst bemerkbare Dinge ab S02 (Maß, Staubraster 0,5 s, Lot-Zeichnung, Fokusrahmen) → unübersehbar am Kopfhörer → Rückrufe als Seiten in der Tiefe ihrer Welt → 100 %; nur echte Aufnahmen, Eigenfarben statt grüner Zeichen; Kennzeichen „Musterseite“ ab dem ersten lesbaren Seitentext (42,50–60,00) und auf der Karte |
| 5 | Kopfhörer-Teil überarbeiten | Abschnitt 5: Befund v3, ein Ding / eine Achse / ein Licht, Endbild als Bearbeitung, Differenzbild; Fahrt durch die Tore als eigener KI-Clip C11 (2,82 s) statt Collage; je ein lesbares Element ≥ 1 s, keine erfundenen Produktwerte; vier Aufgaben in der Geschichte; 8,32 s in der Filmmitte |
| 6 | Geschichte immer weiter schreiben; Spannungsbogen steigt exponentiell | §2: Spannung aus der Ereignisdichte E abgeleitet, E ×1,33 je Ebene (echte Exponentialreihe), in Tor 0 an der Animatik nachgezählt; Musik und Fremdheit wachsen bis S13 ohne Deckel; Sog-Plan §4.1 (spätestens alle 5 s eine neue Frage); Zeitleiste geprüft: Szenenlänge ×0,75, Website ×1,69 (geplant ×1,75, Sättigung ab S09), Atem ×1,33 |
| 7 | Erste Szene hält mit dem ersten Bild oder Ton fest; man ahnt noch nicht, dass es Werbung ist | §6: Bild 1 zeigt ein unmögliches Detail (die Erde pendelt), bewegt sich (Raste), erster Ton ein scharfes Einatmen, offene Frage in 3 s, stumm lesbar; zwei Alternativen; Test mit Unbeteiligten, Unentschieden wird nachgetestet; kein Werbesignal bis zum Wendepunkt |
| 8 | ChatGPT Skizzen, Higgsfield Originale, ElevenLabs Ton; für ChatGPT Stil, Wirkung, Stimmung, Kontext, roter Faden statt genauer Bildvorgaben | §9.1 Arbeitsteilung; jede Szene in §4 als Stimmung beschrieben; fest sind nur die Zwillingsformen; Credits und Tore §9.4–9.5; ElevenLabs Standard, Elias' Aufnahmen nur Option |
| 9 | Alle nötigen Skills, Agenten und Hooks nutzen bzw. anlegen | `/filmszene` je Szene, Agent `kontinuitaet`, `zeitleiste.py` (Exit 0), `kette-pruefen.py`, `film-pruefung.py`, Hook `kosten-waechter.py`, `storyboard.py` (§9.1); Auftragslog `ops/auftraege.jsonl` |
