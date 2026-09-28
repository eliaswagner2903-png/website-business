// Alle Inhalte der Demo-Seite „Zwischenbild“ an einer Stelle.
// Das Studio, seine Kunden, Preise und Kontaktdaten sind AUSGEDACHT (Showcase / Verkaufsportfolio).
// Nach jeder Änderung: `npm run bauen` (erzeugt public/*.html).

export const studio = {
  name: 'Zwischenbild',
  wortmarke: ['zwischen', 'bild'],
  art: 'Studio für Motion-Design',
  ort: 'Beispielstadt',
  telefonAnzeige: '01234 567 890',
  telefonLink: 'tel:+491234567890',
  email: 'hallo@zwischenbild.example',
  adresse: ['Musterstraße 12, Hinterhaus', '12345 Beispielstadt'],
  zeiten: 'Mo–Fr 9–17 Uhr',
  demoHinweis: 'Demo-Seite – ausgedachtes Studio',
  demoLang: 'Zwischenbild gibt es nicht. Studio, Kunden, Preise und Kontaktdaten sind für diese Demo ausgedacht.',
};

export const start = {
  titel: 'Zwischenbild – Studio für Motion-Design (Demo)',
  beschreibung: 'Demo-Seite eines ausgedachten Studios für Motion-Design: Logo-Animationen, Kampagnen in Bewegung, Erklärfilme und Bewegung für Websites.',
  ueberzeile: 'Motion-Design für Marken, Kommunen und Kultur',
  // H1 in Stücken: umbruch 'h' = Zeilenende auf dem Handy, 'c' = am Computer, 'hc' = beides.
  // Das Stück mit clip: true sitzt auf der orangefarbenen Spur (wie ein Clip in der Zeitleiste).
  h1: [{ t: 'Wir bringen', umbruch: 'h' }, { t: 'Logos', umbruch: 'c' }, { t: 'das', umbruch: 'h' }, { t: 'Laufen', clip: true, umbruch: 'h' }, { t: 'bei.' }],
  h1Text: 'Wir bringen Logos das Laufen bei.',
  lead: 'Für Getränkemarken, Stadtwerke und Festivals animieren wir Logos, bauen Kampagnen für Social Media und Bildschirme an Haltestellen und legen fest, wie sich Websites bewegen. Vier Leute, ein Kurven-Editor und viel Geduld für die Bilder dazwischen.',
  zeitcode: '00:00:02:00',
  zeitleiste: { bilder: 48, schluessel: [0, 11, 29, 47], text: '2 Sekunden Logo · 48 Bilder · jedes davon gestaltet' },
};

export const projekte = [
  {
    slug: 'brausewerk',
    kunde: 'Brausewerk Moll',
    branche: 'Limonaden-Manufaktur',
    leistung: 'Logo-Animation und Social-Clips',
    jahr: '2025',
    dauer: '5 Wochen',
    kurz: 'Ein Kronkorken, der ploppt, und ein Schriftzug, der von unten aufperlt.',
    aufgabe: 'Die Limo hatte ein gutes Etikett, aber keine Bewegung. Im Getränkeregal-Bildschirm und auf Instagram sah sie aus wie ein Foto von einer Flasche.',
    idee: 'In dieser Marke steigt alles von unten nach oben: Blasen perlen auf, der Kronkorken springt ab, der Schriftzug erscheint Buchstabe für Buchstabe wie Kohlensäure.',
    umsetzung: 'Wir haben eine eigene Aufstiegskurve gebaut: unten langsam, oben schneller, wie echte Blasen. Dieselbe Kurve steckt jetzt im Ident, in den Clips und im Hover des Webshops.',
    geliefert: ['Ident, 3 Sekunden (MP4 und Lottie)', 'Sechs Social-Clips im Format 9:16', 'Motion-Leitfaden, 14 Seiten'],
    farben: { grund: '#0e3b2c', eins: '#f4e04d', zwei: '#f6efd9' },
  },
  {
    slug: 'hallenbad',
    kunde: 'Hallenbad Am Kiesel',
    branche: 'Städtisches Hallenbad',
    leistung: 'Kampagne für Bildschirme im Stadtraum',
    jahr: '2026',
    dauer: '7 Wochen',
    kurz: 'Eine Welle läuft durch die Kacheln und schreibt das Eröffnungsdatum.',
    aufgabe: 'Nach zwei Jahren Sanierung sollte die ganze Stadt merken: Das Bad ist wieder offen. Geld für Bildschirme an Haltestellen war da, für einen Film nicht.',
    idee: 'Das Kachelraster des Beckens wird zur Anzeige. Jede Fliese kippt einzeln, eine Welle läuft hindurch, und am Ende steht da, was alle wissen sollen: wieder offen.',
    umsetzung: 'Ein Raster aus 12 × 12 Kacheln, gesteuert über eine Tabelle statt über Keyframes. So entstanden aus einer Vorlage 40 Motive, jedes in einer Nacht gerendert.',
    geliefert: ['40 Motive als 10-Sekunden-Schleife', 'Countdown bis zur Eröffnung', 'Animationen für die Anzeige im Foyer'],
    farben: { grund: '#0b4a86', eins: '#9fd8f0', zwei: '#ffffff' },
  },
  {
    slug: 'rauschen',
    kunde: 'Hörfest Rauschen',
    branche: 'Festival für Hörspiel und Podcast',
    leistung: 'Trailer und bewegtes Schriftsystem',
    jahr: '2025',
    dauer: '6 Wochen',
    kurz: 'Die Schrift hört mit: Wird es laut, werden die Buchstaben breit.',
    aufgabe: 'Ein Festival zum Zuhören braucht Bilder, ohne dass Bilder die Hauptsache werden. Der Trailer sollte auch ohne Ton funktionieren, denn die meisten sehen ihn stumm.',
    idee: 'Die Schrift macht den Ton sichtbar. Wir haben die Lautstärke der Tonspur auf die Breitenachse einer variablen Schrift gelegt: leise ist schmal, laut ist breit.',
    umsetzung: 'Die Werte kommen direkt aus der Tonspur. Von Hand haben wir nur geglättet, damit nichts zappelt. Das System gibt es als Vorlage, damit das Festival-Team selbst Ankündigungen bauen kann.',
    geliefert: ['Trailer, 45 Sekunden', 'Zwölf Ankündigungen für Sprecherinnen und Sprecher', 'Schriftsystem als Vorlage für After Effects'],
    farben: { grund: '#1b1030', eins: '#ff8fb0', zwei: '#f3e9ff' },
  },
];

export const handwerk = {
  titel: 'Wir kümmern uns um die Bilder dazwischen.',
  text: 'Zwischenbilder liegen zwischen zwei Schlüsselbildern. Früher hat sie jemand von Hand gezeichnet, heute rechnet sie der Computer aus. Genau dort entscheidet sich, ob Bewegung billig oder teuer wirkt: an der Kurve, nach der die Bilder verteilt werden.',
  laborTitel: 'Dieselbe Bewegung, dreimal.',
  laborText: 'Jede Spur dauert 1,2 Sekunden und hat 13 Bilder. Nur die Kurve ist anders. Jedes Quadrat ist ein Bild: Wo sie dicht liegen, ist die Bewegung langsam.',
  kurven: [
    { name: 'Linear', wert: [0, 0, 1, 1], css: 'linear', urteil: 'Gleichmäßig. Wirkt wie ein Förderband.' },
    { name: 'Ease-out', wert: [0.2, 0.8, 0.2, 1], css: 'cubic-bezier(.2, .8, .2, 1)', urteil: 'Schnell los, weich an. Gut für Knöpfe und kleine Dinge.' },
    { name: 'Leiser Start', wert: [0.45, 0.05, 0.25, 1], css: 'cubic-bezier(.45, .05, .25, 1)', urteil: 'Startet leise, kommt entschieden an. So erschrecken große Flächen nicht.' },
  ],
};

export const leistungen = {
  titel: 'Was wir machen',
  hinweis: 'Richtpreise netto. Für diese Demo ausgedacht.',
  liste: [
    { name: 'Logo-Animation', text: 'Das Logo bekommt einen Auftritt: 2 bis 5 Sekunden, als Video und als Lottie-Datei für Website und App.', dauer: 'ab 3 Wochen', preis: 'ab 3.900 €' },
    { name: 'Kampagnen in Bewegung', text: 'Social-Clips, Bildschirme an Haltestellen, Messewände. Ein Motiv, viele Formate, alle aus einer Vorlage.', dauer: 'ab 4 Wochen', preis: 'ab 8.500 €' },
    { name: 'Erklärfilm', text: '60 bis 90 Sekunden, die ein Produkt verständlich machen. Mit Sprecherin oder Sprecher, ohne Stockfotos.', dauer: 'ab 6 Wochen', preis: 'ab 12.000 €' },
    { name: 'Bewegung für Websites', text: 'Wie sich Menüs öffnen, Seiten wechseln und Knöpfe antworten. Wir liefern Tempi und Kurven als Code, nicht als Video.', dauer: 'ab 2 Wochen', preis: 'ab 2.400 €' },
    { name: 'Motion-Leitfaden', text: 'Regeln für alle, die später an der Marke arbeiten: Kurven, Tempi, Beispiele, Dateien.', dauer: 'ab 2 Wochen', preis: 'ab 3.200 €' },
  ],
};

export const ablauf = {
  titel: 'So läuft ein Projekt',
  text: 'Fünf Schlüsselbilder, dazwischen arbeiten wir. Beispiel: eine Logo-Animation in vier Wochen.',
  schritte: [
    { wann: 'Tag 1', was: 'Gespräch', text: '30 Minuten am Telefon: Was soll sich bewegen, wo läuft es, bis wann?' },
    { wann: 'Woche 1', was: 'Standbilder', text: 'Die wichtigsten Momente als Standbilder. Hier entscheidet ihr über Look und Farbe.' },
    { wann: 'Woche 2', was: 'Animatic', text: 'Eine grobe Fassung mit echtem Timing. Noch nicht schön, aber die Länge stimmt.' },
    { wann: 'Woche 3–4', was: 'Animation', text: 'Jetzt wird jedes Zwischenbild gestaltet. Zwei Korrekturrunden sind im Preis.' },
    { wann: 'Übergabe', was: 'Dateien', text: 'MP4, Lottie, Quelldateien und eine Seite mit Kurven und Tempi für eure Entwicklung.' },
  ],
};

export const kontakt = {
  titel: 'Was soll sich bewegen?',
  text: 'Schreibt uns zwei, drei Sätze zu eurem Vorhaben. Wir antworten innerhalb von zwei Werktagen mit einer ersten Einschätzung und einem Terminvorschlag.',
  themen: ['Logo-Animation', 'Kampagne', 'Erklärfilm', 'Website', 'Leitfaden'],
  zeitraum: ['so bald wie möglich', 'in 1–2 Monaten', 'später im Jahr'],
};
