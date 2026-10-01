// Which sources in the quality system are due for re-research? Reads wissen/quellen/QUELLEN.md (column „Nächste Prüfung“).
//   node werkzeuge/wissen-alter.mjs            list of due sources with affected rules
//   node werkzeuge/wissen-alter.mjs --kurz     one line (for the start hook); silent if nothing is due
import fs from 'node:fs'; import path from 'node:path';
import { REPO, FG, tabellen } from './regeln.mjs';

const heute = process.env.HEUTE || new Date().toISOString().slice(0, 10);
const quellen = tabellen(fs.readFileSync(path.join(REPO, 'wissen/quellen/QUELLEN.md'), 'utf8')).filter(t => t.kopf[0] === 'ID').flatMap(t => t.zeilen);
const faellig = quellen.filter(q => /^\d{4}-\d{2}-\d{2}$/.test(q['Nächste Prüfung']) && q['Nächste Prüfung'] <= heute);
if (argv('--kurz')) {
  if (faellig.length) console.log(`Knowledge: ${faellig.length} source(s) due for re-research (node werkzeuge/wissen-alter.mjs, procedure wissen/quellen/AKTUALISIERUNG.md)`);
  process.exit(0);
}
function argv(n) { return process.argv.includes(n); }
const regeln = fs.readdirSync(FG).filter(f => f.endsWith('.md')).flatMap(f => fs.readFileSync(path.join(FG, f), 'utf8').split('\n').filter(z => /^\| [A-Z0-9]{2,5}-\d{2} \|/.test(z)).map(z => ({ id: z.split('|')[1].trim(), z })));
if (!faellig.length) { console.log(`No source due (as of ${heute}). Next: ${quellen.map(q => q['Nächste Prüfung']).filter(Boolean).sort()[0]}`); process.exit(0); }
console.log(`${faellig.length} source(s) due (as of ${heute}):\n`);
for (const q of faellig) {
  const betroffen = regeln.filter(r => r.z.includes(q.ID)).map(r => r.id);
  console.log(`- ${q.ID} ${q.Quelle} (${q['Stabilität']}, due ${q['Nächste Prüfung']})\n  ${q.URL}\n  Rules: ${betroffen.join(', ') || '–'}`);
}
