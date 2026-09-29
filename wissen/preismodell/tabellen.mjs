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
