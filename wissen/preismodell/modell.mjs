// Preismodell OQ – Entwurf A-040 (2026-09-29).
// Alle Euro-Werte sind PLATZHALTER ohne Marktbasis. Gewichte und Punkte sind Vorschläge zum Prüfen durch Elias.
// Eine Quelle für Doku-Tabellen (tabellen.mjs) und den Rechner (rechner.html).

export const EINSTELLUNGEN = {
  punktwert: 35, // € je Punkt (Konzept A) – Platzhalter
  sockel: 600, // € Mindestpreis Konzept B – Platzhalter
  spanne: 4400, // € zwischen Score 0 und 10 in Konzept B – Platzhalter
  stundensatz: 60, // € für Elias' eigene Zeit (Konzept C, AM) – Platzhalter
  marge: 0.3, // Aufschlag auf Kosten in Konzept C
  bkHebel: 0.15, // BK verschiebt den Preis um höchstens ±15 %
  expressAufschlag: 0.15,
  fixkostenMonat: 7, // € Domain anteilig + Werkzeuge anteilig – Platzhalter
  pflegewert: 3, // € je Pflegepunkt im Monat – Platzhalter
  amAnteilSp: 0.025, // Alternative AM = 2,5 % von Sp
  bewertungsRabatt: 0.05, // Profit-Chain laut Elias
  willkommensRabatt: 0.05, // Neukunde über Empfehlung – Vorschlag
  empfehlungsAnteil: 0.2, // Anteil am Deckungsbeitrag des Neukunden, der als Gratismonate zurückgeht
  empfehlungMaxMonate: 6,
  margeSp: 0.7, // Anteil von Sp, der nach Fremdkosten bleibt – Schätzung
  margeAm: 0.6,
};

// Kriterien-Gruppen mit Gewicht für Konzept B. Summe = 100.
// "deckel" = so viele Punkte aus Konzept A entsprechen der Note 10 in dieser Gruppe.
export const GRUPPEN = {
  funktionen: { name: 'Funktionen', gewicht: 30, deckel: 35 },
  design: { name: 'Design-Individualität', gewicht: 20, deckel: 18 },
  visuals: { name: 'Visuals und Erlebnis', gewicht: 20, deckel: 30 },
  umfang: { name: 'Umfang (Seiten)', gewicht: 15, deckel: 40 },
  inhalte: { name: 'Inhalte erstellen', gewicht: 10, deckel: 20 },
  technik: { name: 'Technik und Recht', gewicht: 5, deckel: 12 },
};

// Bausteine (Konzept A): Gruppe 'sockel' zählt immer gleich (ungewichtet). Punkte = Wertigkeit, pflege = Pflegepunkte für AM, h = Elias-Stunden (Konzept C).
export const BAUSTEINE = {
  grund: { gruppe: 'sockel', name: 'Grundpaket (Start, Impressum, Datenschutz, 404, Handy, SEO-Basis)', punkte: 20, pflege: 0, h: 2 },
  seite: { gruppe: 'umfang', name: 'weitere Inhaltsseite', punkte: 4, pflege: 0, h: 0.3 },
  kontakt: { gruppe: 'funktionen', name: 'Kontaktformular', punkte: 4, pflege: 1, h: 0.3 },
  terminLink: { gruppe: 'funktionen', name: 'Termin-Link (extern, z. B. Cal.com)', punkte: 3, pflege: 0, h: 0.2 },
  terminEigen: { gruppe: 'funktionen', name: 'eigene Online-Terminbuchung', punkte: 10, pflege: 3, h: 1.5 },
  zahlung: { gruppe: 'funktionen', name: 'Online-Zahlung (Stripe)', punkte: 12, pflege: 4, h: 1.5 },
  katalog: { gruppe: 'funktionen', name: 'Katalog/Speisekarte mit Preisen', punkte: 6, pflege: 1, h: 0.8 },
  galerie: { gruppe: 'funktionen', name: 'Galerie', punkte: 3, pflege: 0, h: 0.3 },
  editor: { gruppe: 'funktionen', name: 'Kunden-Editor (selbst pflegen)', punkte: 10, pflege: 2, h: 1.5 },
  designEigen: { gruppe: 'design', name: 'eigenes Design', punkte: 10, pflege: 0, h: 1 },
  designMarke: { gruppe: 'design', name: 'Premium-Design mit Markenauftritt', punkte: 18, pflege: 0, h: 2 },
  animation: { gruppe: 'visuals', name: 'Bewegung und Scroll-Effekte', punkte: 4, pflege: 0, h: 0.3 },
  kiVisual: { gruppe: 'visuals', name: 'KI-Bild oder -Video je Stück', punkte: 2, pflege: 0, h: 0.2, fremd: 3 },
  videoEinstieg: { gruppe: 'visuals', name: 'Video-Einstieg / Erlebnis-Story', punkte: 14, pflege: 1, h: 2 },
  szene3d: { gruppe: 'visuals', name: '3D-Szene', punkte: 16, pflege: 2, h: 2 },
  texte: { gruppe: 'inhalte', name: 'Texte schreiben je Seite', punkte: 2, pflege: 0, h: 0.2 },
  fotos: { gruppe: 'inhalte', name: 'Bildmaterial beschaffen/aufbereiten', punkte: 4, pflege: 0, h: 0.5 },
  sprache: { gruppe: 'technik', name: 'weitere Sprache', punkte: 8, pflege: 1, h: 1 },
  cookies: { gruppe: 'technik', name: 'Einwilligung (Cookies, Karten, Tracking)', punkte: 4, pflege: 1, h: 0.5 },
};

// BK = Bekanntheit Kunde, 0–10, aus vier Teilwerten.
export const BK_TEILE = {
  reichweite: { name: 'Reichweite online (Bewertungen, Follower)', gewicht: 35 },
  groesse: { name: 'Größe (Mitarbeiter, Standorte, Umsatz)', gewicht: 25 },
  netzwerk: { name: 'Netzwerk/Multiplikator (Verband, Verein, Branche)', gewicht: 25 },
  ruf: { name: 'Ruf und Presse', gewicht: 15 },
};

export const PAKETE = {
  basis: { name: 'Basis', stunden: 0.5 },
  plus: { name: 'Plus', stunden: 1.5 },
  premium: { name: 'Premium', stunden: 3.5 },
};

// Beispiele: Umfang nach Repo-Stand geschätzt; BK-Werte ausgedacht (Demos haben keine echte Bekanntheit).
export const BEISPIELE = [
  {
    id: 'lotlinie', name: 'Lotlinie Physio (hell)', branchenHebel: 0.2, paket: 'plus',
    bausteine: { grund: 1, seite: 3, terminLink: 1, designEigen: 1, animation: 1, kiVisual: 1, texte: 4 },
    bk: { reichweite: 3, groesse: 3, netzwerk: 5, ruf: 2 },
  },
  {
    id: 'urfa', name: 'URFA SOFRASI Restaurant', branchenHebel: 0.1, paket: 'basis',
    bausteine: { grund: 1, seite: 3, kontakt: 1, katalog: 1, galerie: 1, designEigen: 1, animation: 1, texte: 2, fotos: 1 },
    bk: { reichweite: 6, groesse: 3, netzwerk: 4, ruf: 3 },
  },
  {
    id: 'zwischenbild', name: 'Zwischenbild Motion-Studio (laut)', branchenHebel: 0.3, paket: 'plus',
    bausteine: { grund: 1, seite: 3, designMarke: 1, animation: 1, texte: 4 },
    bk: { reichweite: 6, groesse: 3, netzwerk: 6, ruf: 5 },
  },
  {
    id: 'lindgrund', name: 'Lindgrund Uhren (edel)', branchenHebel: 0.4, paket: 'premium',
    bausteine: { grund: 1, kontakt: 1, designMarke: 1, szene3d: 1, animation: 1, kiVisual: 2, texte: 2 },
    bk: { reichweite: 5, groesse: 4, netzwerk: 4, ruf: 6 },
  },
  {
    id: 'friseur', name: 'Friseur-Erlebnis (Idee, Buch und Stempel)', branchenHebel: 0.2, paket: 'plus',
    bausteine: { grund: 1, seite: 3, terminEigen: 1, zahlung: 1, galerie: 1, designMarke: 1, videoEinstieg: 1, kiVisual: 4, texte: 3, cookies: 1 },
    bk: { reichweite: 5, groesse: 2, netzwerk: 6, ruf: 3 },
  },
];

const runde = (x, auf) => Math.round(x / auf) * auf;

export function bk(teile) {
  let s = 0;
  for (const [k, t] of Object.entries(BK_TEILE)) s += (teile[k] ?? 0) * t.gewicht;
  return s / 100;
}

export function bkFaktor(bkWert, e = EINSTELLUNGEN) {
  return 1 + e.bkHebel * (bkWert - 5) / 5;
}

export function punkteJeGruppe(bausteine) {
  const g = Object.fromEntries(Object.keys(GRUPPEN).map((k) => [k, 0]));
  for (const [k, n] of Object.entries(bausteine)) {
    const gruppe = BAUSTEINE[k].gruppe;
    if (gruppe !== 'sockel') g[gruppe] += BAUSTEINE[k].punkte * n;
  }
  return g;
}

export function summe(bausteine, feld) {
  return Object.entries(bausteine).reduce((s, [k, n]) => s + (BAUSTEINE[k][feld] ?? 0) * n, 0);
}

// Konzept A: Punkte-Stückliste
export function konzeptA(b, e = EINSTELLUNGEN, gruppen = GRUPPEN) {
  const pg = punkteJeGruppe(b.bausteine);
  // Gewichte aus B wirken in A als Verhältnis zum Standard: doppeltes Gewicht = Punkte zählen doppelt.
  let punkte = summe(b.bausteine, 'punkte') - Object.values(pg).reduce((x, y) => x + y, 0); // Sockel zählt ungewichtet
  for (const [k, p] of Object.entries(pg)) punkte += p * gruppen[k].gewicht / GRUPPEN[k].gewicht;
  const f = bkFaktor(bk(b.bk), e) * (b.express ? 1 + e.expressAufschlag : 1);
  return { punkte, netto: punkte * e.punktwert, sp: runde(punkte * e.punktwert * f, 10) };
}

// Konzept B: gewichtete Bewertung 0–10 je Gruppe
export function konzeptB(b, e = EINSTELLUNGEN, gruppen = GRUPPEN) {
  const pg = punkteJeGruppe(b.bausteine);
  let s = 0;
  let w = 0;
  const noten = {};
  for (const [k, g] of Object.entries(gruppen)) {
    noten[k] = Math.min(10, (pg[k] / g.deckel) * 10);
    s += noten[k] * g.gewicht;
    w += g.gewicht;
  }
  const score = s / w;
  const f = bkFaktor(bk(b.bk), e) * (b.express ? 1 + e.expressAufschlag : 1);
  return { noten, score, sp: runde((e.sockel + e.spanne * score / 10) * f, 10) };
}

// Konzept C: Aufwand × Wert
export function konzeptC(b, e = EINSTELLUNGEN) {
  const stunden = summe(b.bausteine, 'h');
  const fremd = summe(b.bausteine, 'fremd') + 25; // + Domain erstes Jahr u. Kleinkram – Platzhalter
  const kosten = stunden * e.stundensatz + fremd;
  const wert = (1 + b.branchenHebel) * bkFaktor(bk(b.bk), e);
  return { stunden, kosten, sp: runde(kosten * (1 + e.marge) * wert, 10) };
}

export function abo(b, sp, e = EINSTELLUNGEN) {
  const pflege = summe(b.bausteine, 'pflege');
  const h = PAKETE[b.paket].stunden;
  const am = runde(e.fixkostenMonat + h * e.stundensatz + pflege * e.pflegewert, 5);
  const amAnteil = runde(sp * e.amAnteilSp, 5);
  return { pflege, am, amAnteil, monateBisSp: sp / am };
}

// Profit-Chain
export function profitChain(sp, am, e = EINSTELLUNGEN) {
  const nkSp = runde(sp * (1 - e.willkommensRabatt), 10);
  const nkSpMitBewertung = runde(nkSp * (1 - e.bewertungsRabatt), 10);
  const deckung = nkSp * e.margeSp + 12 * am * e.margeAm;
  return { nkSp, nkSpMitBewertung, deckung };
}

export function gratisMonate(deckungNeukunde, kamEmpfehler, e = EINSTELLUNGEN) {
  return Math.min(e.empfehlungMaxMonate, Math.floor((e.empfehlungsAnteil * deckungNeukunde) / kamEmpfehler));
}

export function treueRabatt(aboMonate) {
  return Math.min(0.1, 0.01 * Math.floor(aboMonate / 3));
}

// Saison-Umgestaltung (z. B. Halloween): Änderungspunkte, Rückbau, Wiederverwendung ab dem 2. Jahr.
export function saison(aenderungsPunkte, jahr, aboMonate, e = EINSTELLUNGEN) {
  const wieder = jahr >= 2 ? 0.5 : 0;
  const roh = (aenderungsPunkte * (1 - wieder) + 2) * e.punktwert;
  return runde(roh * (1 - treueRabatt(aboMonate)), 5);
}

// ---- Eigene Vorschläge (nicht aus Elias' Notizen) ----

export const ZUSATZ = {
  aenderungFrei: 3, // kleine Änderungen (≤ 2 Punkte) bis zur Abnahme frei
  aenderungZuschlag: { vorEntwurf: 0, nachEntwurf: 0.25, nachAbnahme: 0.5 },
  anzahlungGrund: 0.3,
  anzahlungMax: 0.5,
  rabattMax: 0.15, // alle Rabatte zusammen
  mindestmarge: 0.4, // vom Sp muss nach Rabatten mindestens so viel Marge bleiben
  laufzeitErwartet: 36, // Monate, für den Kundenwert
  akquiseAnteil: 0.1, // höchstens 10 % des Kundenwerts für Gewinnung (Gewinnspiel, Rabatte)
  mietLaufzeit: 24,
  mietAufschlag: 0.1,
  anpassungMax: 0.05, // AM-Erhöhung pro Jahr höchstens
};

// Änderungsaufschlag: Δ-Punkte × Punktwert × (1 + Zuschlag je Phase); kleine Änderungen im Freikontingent kosten 0.
export function aenderung(deltaPunkte, phase, nrKleineAenderung = 0, e = EINSTELLUNGEN, z = ZUSATZ) {
  if (deltaPunkte <= 2 && nrKleineAenderung > 0 && nrKleineAenderung <= z.aenderungFrei && phase !== 'nachAbnahme') return 0;
  return runde(deltaPunkte * e.punktwert * (1 + z.aenderungZuschlag[phase]), 5);
}

// Anzahlung: 30 % Grund, +10 % ohne Empfehlung (unbekannter Kunde), +10 % ab 3.000 €, höchstens 50 %;
// mindestens so hoch wie die Fremdkosten.
export function anzahlung(sp, { empfohlen, fremdkosten = 0 }, z = ZUSATZ) {
  let q = z.anzahlungGrund + (empfohlen ? 0 : 0.1) + (sp >= 3000 ? 0.1 : 0);
  q = Math.min(z.anzahlungMax, q);
  return { quote: q, betrag: Math.max(runde(sp * q, 10), fremdkosten) };
}

// Rabattgrenze: Summe aller Rabatte gekappt, und Endpreis nie unter Untergrenze C.
export function rabattGrenze(sp, rabatte, untergrenze, e = EINSTELLUNGEN, z = ZUSATZ) {
  const gewuenscht = rabatte.reduce((s, r) => s + r, 0);
  const margenGrenze = 1 - (1 - e.margeSp + z.mindestmarge); // so viel darf weg, bis nur noch Mindestmarge bleibt
  const erlaubt = Math.min(gewuenscht, z.rabattMax, Math.max(0, margenGrenze));
  return { gewuenscht, erlaubt, endpreis: Math.max(untergrenze, runde(sp * (1 - erlaubt), 10)) };
}

// Kundenwert (CLV) und Akquisebudget
export function kundenwert(sp, am, e = EINSTELLUNGEN, z = ZUSATZ) {
  const clv = sp * e.margeSp + am * e.margeAm * z.laufzeitErwartet;
  return { clv, akquise: clv * z.akquiseAnteil };
}

// Mietmodell: 0 € Einmalpreis, Sp über die Mindestlaufzeit verteilt
export function miete(sp, am, z = ZUSATZ) {
  return runde(am + (sp * (1 + z.mietAufschlag)) / z.mietLaufzeit, 5);
}

// Jährliche AM-Anpassung: neu gerechnet oder Kostensteigerung, gekappt
export function amAnpassung(amAlt, amNeuGerechnet, z = ZUSATZ) {
  return runde(Math.min(amNeuGerechnet, amAlt * (1 + z.anpassungMax)), 5);
}

// Relaunch/Umbau für Bestandskunden: neue Bausteine voll, umgebaute zur Hälfte, Treue abgezogen
export function umbau(neuePunkte, umgebautePunkte, aboMonate, e = EINSTELLUNGEN) {
  return runde((neuePunkte + 0.5 * umgebautePunkte) * e.punktwert * (1 - treueRabatt(aboMonate)), 10);
}
