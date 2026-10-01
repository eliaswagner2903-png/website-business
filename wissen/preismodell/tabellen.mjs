// Druckt die Beispieltabellen für PREISFORMELN.md: node tabellen.mjs
import * as m from './modell.mjs';

const eur = (x) => `${Math.round(x).toLocaleString('de-DE')} €`;
const z = (x, n = 1) => x.toLocaleString('de-DE', { minimumFractionDigits: n, maximumFractionDigits: n });

console.log('### Sp nach drei Konzepten\n');
console.log('| Beispiel | BK | BK-Faktor | A Punkte | A: Sp | B Score | B: Sp | C Stunden | C: Sp (Untergrenze) |');
console.log('|---|---|---|---|---|---|---|---|---|');
for (const b of m.BEISPIELE) {
  const w = m.bk(b.bk), a = m.konzeptA(b), B = m.konzeptB(b), c = m.konzeptC(b);
  console.log(`| ${b.name} | ${z(w)} | ${z(m.bkFaktor(w), 2)} | ${a.punkte} | ${eur(a.sp)} | ${z(B.score)} | ${eur(B.sp)} | ${z(c.stunden)} | ${eur(c.sp)} |`);
}

console.log('\n### Punkte je Kriterium (Konzept A) und Anteil am Preis\n');
const gk = Object.keys(m.GRUPPEN);
console.log(`| Beispiel | ${gk.map((k) => m.GRUPPEN[k].name).join(' | ')} |`);
console.log(`|---|${gk.map(() => '---').join('|')}|`);
for (const b of m.BEISPIELE) {
  const pg = m.punkteJeGruppe(b.bausteine), s = Object.values(pg).reduce((x, y) => x + y, 0);
  console.log(`| ${b.name} | ${gk.map((k) => `${pg[k]} (${Math.round((100 * pg[k]) / s)} %)`).join(' | ')} |`);
}

console.log('\n### AM und Prüfung Sp = AM\n');
console.log('| Beispiel | Paket | Pflegepunkte | AM (Formel) | AM (2,5 % von Sp) | Sp ÷ AM = Monate |');
console.log('|---|---|---|---|---|---|');
for (const b of m.BEISPIELE) {
  const sp = m.konzeptA(b).sp, ab = m.abo(b, sp);
  console.log(`| ${b.name} | ${m.PAKETE[b.paket].name} | ${ab.pflege} | ${eur(ab.am)} | ${eur(ab.amAnteil)} | ${z(ab.monateBisSp)} |`);
}

console.log('\n### Seitenpreis-Spanne und Monatswert je Kunde (Preisstrategie 2026-10-01)\n');
console.log('| Beispiel | Zielpreis Sp | Richtboden | harte Kosten | Monatswert (Grundbetreuung + Kundenfragen) | Kundenwert 36 Monate | Anteil Abo am Kundenwert |');
console.log('|---|---|---|---|---|---|---|');
for (const b of m.BEISPIELE) {
  const sp = m.spSpanne(b), mw = m.monatswert(['kundenfragen']), k = m.kundenwert(sp.ziel, mw.am);
  console.log(`| ${b.name} | ${eur(sp.ziel)} | ${eur(sp.richt)} | ${eur(sp.hart)} | ${eur(mw.am)} | ${eur(k.clv)} | ${Math.round(k.anteilAbo * 100)} % |`);
}

console.log('\n### Preisliste Mindest-, Fair-, Zielpreis (intern, Platzhalter)\n');
{
  const e = m.EINSTELLUNGEN, r = (v, b) => `${eur(v)} – ${eur(b)}`;
  console.log('| Stufe | Einmalpreis Seite | Bedingung |\n|---|---|---|');
  console.log(`| Mindestpreis | ${r(e.spMindestVon, e.spMindestBis)} | Referenzpreis für erste Kunden |`);
  console.log(`| Fairpreis | ${r(e.spFairVon, e.spFairBis)} | heutiger Start, ohne Referenzen |`);
  console.log(`| Zielpreis | ${r(e.spZielVon, e.spZielBis)} | ab ${e.referenzenFuerZiel} Referenzen, Kunden mit Budget (Agenturen ab ${eur(e.spAgenturAb)}) |`);
  console.log(`| realistisch (Kleinbetriebe) | ${r(e.spRealistischVon, e.spRealistischBis)} | Handwerk/Dienstleistung |`);
  console.log('\n| Monatlich | €/Monat |\n|---|---|');
  console.log(`| Grundbetreuung | ${r(e.amGrundVon, e.amGrundBis)} |`);
  console.log(`| mit Wahlleistungen | ${r(e.amWahlVon, e.amWahlBis)} |`);
  console.log(`| lokale SEO-Betreuung | ${r(e.amSeoVon, e.amSeoBis)} |`);
  console.log('\n| Beispiel (Konzept A) | Zielpreis Sp | Stufe | Referenzen nötig |\n|---|---|---|---|');
  for (const b of m.BEISPIELE) { const sp = m.konzeptA(b).sp, t = m.spStufe(sp); console.log(`| ${b.name} | ${eur(sp)} | ${t.name} | ${t.referenzNoetig ? 'ja' : 'nein'} |`); }
  console.log('\n| Merys Clean | Sp | Stufe | Abo |\n|---|---|---|---|');
  for (const sp of [990, 1490]) console.log(`| Gebäudereinigung | ${eur(sp)} | ${m.spStufe(sp).name} | ab 79 € |`);
}

console.log('\n### Verhandlung: Nachlass gegen Abo (Lotlinie)\n');
{
  const sp = m.spSpanne(m.BEISPIELE[0]);
  for (const [t, wahl, preis] of [['Grundbetreuung', [], 1500], ['Grundbetreuung', [], 1000], ['Grundbetreuung + Kundenfragen', ['kundenfragen'], 1000], ['Grundbetreuung + Kundenfragen', ['kundenfragen'], 500], ['ohne Abo', null, 1500]]) {
    const am = wahl ? m.monatswert(wahl).am : 0, r = m.spNachlass(sp.ziel, preis, am, sp.hart);
    console.log(`| ${t} | Sp ${eur(preis)} | Nachlass ${eur(r.nachlass)} | ${Number.isFinite(r.monate) ? z(r.monate) : '–'} Monate | ${r.ok ? 'erlaubt' : 'nicht erlaubt'} |`);
  }
}

console.log('\n### Bestand: Masse betreuter Seiten (Monatswert 149 €, 1,5 Std. je Kunde)\n');
for (const n of [5, 10, 20, 26]) { const r = m.bestand(n, 149, 1.5); console.log(`| ${n} Seiten | Einnahmen ${eur(r.einnahmen)}/Monat | Deckungsbeitrag ${eur(r.deckung)}/Monat | ${z(r.stunden)} Std. | Kapazität ${r.maxKunden} Seiten |`); }

console.log('\n### Profit-Chain\n');
console.log('| Neukunde (über Empfehlung) | Sp | NkSp (−5 % Willkommen) | mit Bewertung (−5 %) | Deckungsbeitrag Jahr 1 | Gratismonate für Empfehler (KAM 95 €) |');
console.log('|---|---|---|---|---|---|');
for (const b of m.BEISPIELE) {
  const sp = m.konzeptA(b).sp, am = m.abo(b, sp).am, p = m.profitChain(sp, am);
  console.log(`| ${b.name} | ${eur(sp)} | ${eur(p.nkSp)} | ${eur(p.nkSpMitBewertung)} | ${eur(p.deckung)} | ${m.gratisMonate(p.deckung, 95)} |`);
}

console.log('\n### BK-Kontrast\n');
const l = m.BEISPIELE[0];
for (const [t, teile] of [['unbekannt', { reichweite: 1, groesse: 1, netzwerk: 1, ruf: 1 }], ['wie Demo', l.bk], ['sehr bekannt', { reichweite: 9, groesse: 8, netzwerk: 9, ruf: 8 }]]) {
  const w = m.bk(teile);
  console.log(`| ${t} | ${z(w)} | ${z(m.bkFaktor(w), 2)} | ${eur(m.konzeptA({ ...l, bk: teile }).sp)} |`);
}

console.log('\n### Saison (Halloween, 12 Änderungspunkte)\n');
for (const [j, mo] of [[1, 6], [2, 18], [3, 30]]) console.log(`| Jahr ${j} | ${mo} Abo-Monate | Treue ${Math.round(m.treueRabatt(mo) * 100)} % | ${eur(m.saison(12, j, mo))} |`);

console.log('\n### Eigene Vorschläge (Beispiel Lotlinie)\n');
{
  const b = m.BEISPIELE[0], sp = m.konzeptA(b).sp, am = m.abo(b, sp).am, c = m.konzeptC(b).sp;
  console.log(`Sp ${eur(sp)}, AM ${eur(am)}, Untergrenze ${eur(c)}`);
  console.log(`Änderung 6 Punkte: vor Entwurf ${eur(m.aenderung(6, 'vorEntwurf'))}, nach Entwurf ${eur(m.aenderung(6, 'nachEntwurf'))}, nach Abnahme ${eur(m.aenderung(6, 'nachAbnahme'))}; 2. kleine Änderung (2 P) ${eur(m.aenderung(2, 'nachEntwurf', 2))}`);
  for (const emp of [true, false]) { const a = m.anzahlung(sp, { empfohlen: emp, fremdkosten: 25 }); console.log(`Anzahlung ${emp ? 'empfohlen' : 'ohne Empfehlung'}: ${Math.round(a.quote * 100)} % = ${eur(a.betrag)}`); }
  const f = m.anzahlung(3660, { empfohlen: false }); console.log(`Anzahlung Friseur 3.660 € ohne Empfehlung: ${Math.round(f.quote * 100)} % = ${eur(f.betrag)}`);
  const r = m.rabattGrenze(sp, [0.05, 0.05, 0.1], m.spSpanne(b).richt); console.log(`Rabatte 5+5+10 %: gewünscht ${Math.round(r.gewuenscht * 100)} %, erlaubt ${Math.round(r.erlaubt * 100)} %, Endpreis ${eur(r.endpreis)}`);
  const k = m.kundenwert(sp, am); console.log(`Kundenwert ${eur(k.clv)}, Akquisebudget ${eur(k.akquise)}`);
  console.log(`AM-Anpassung 95 → neu gerechnet 110: ${eur(m.amAnpassung(95, 110))}`);
  console.log(`Umbau Bestandskunde (8 neue, 10 umgebaute Punkte, 24 Abo-Monate): ${eur(m.umbau(8, 10, 24))}`);
}
