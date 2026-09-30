// Welche Quellen im Qualitätssystem sind fällig für eine Nachrecherche? Liest wissen/quellen/QUELLEN.md (Spalte „Nächste Prüfung“).
//   node werkzeuge/wissen-alter.mjs            Liste der fälligen Quellen mit betroffenen Regeln
//   node werkzeuge/wissen-alter.mjs --kurz     eine Zeile (für den Start-Hook); still, wenn nichts fällig ist
import fs from 'node:fs'; import path from 'node:path';
import { REPO, FG, tabellen } from './regeln.mjs';

const heute = process.env.HEUTE || new Date().toISOString().slice(0, 10);
const quellen = tabellen(fs.readFileSync(path.join(REPO, 'wissen/quellen/QUELLEN.md'), 'utf8')).filter(t => t.kopf[0] === 'ID').flatMap(t => t.zeilen);
const faellig = quellen.filter(q => /^\d{4}-\d{2}-\d{2}$/.test(q['Nächste Prüfung']) && q['Nächste Prüfung'] <= heute);
if (argv('--kurz')) {
  if (faellig.length) console.log(`Wissen: ${faellig.length} Quelle(n) fällig zur Nachrecherche (node werkzeuge/wissen-alter.mjs, Ablauf wissen/quellen/AKTUALISIERUNG.md)`);
  process.exit(0);
}
function argv(n) { return process.argv.includes(n); }
const regeln = fs.readdirSync(FG).filter(f => f.endsWith('.md')).flatMap(f => fs.readFileSync(path.join(FG, f), 'utf8').split('\n').filter(z => /^\| [A-Z0-9]{2,5}-\d{2} \|/.test(z)).map(z => ({ id: z.split('|')[1].trim(), z })));
if (!faellig.length) { console.log(`Keine Quelle fällig (Stand ${heute}). Nächste: ${quellen.map(q => q['Nächste Prüfung']).filter(Boolean).sort()[0]}`); process.exit(0); }
console.log(`${faellig.length} Quelle(n) fällig (Stand ${heute}):\n`);
for (const q of faellig) {
  const betroffen = regeln.filter(r => r.z.includes(q.ID)).map(r => r.id);
  console.log(`- ${q.ID} ${q.Quelle} (${q['Stabilität']}, fällig ${q['Nächste Prüfung']})\n  ${q.URL}\n  Regeln: ${betroffen.join(', ') || '–'}`);
}
