// Kundenauftrag → Pflichtenheft (welche Fachgebiete, welche Priorität, welche Regeln in welcher Phase).
//   node werkzeuge/auftrag-lesen.mjs kunden/<slug>            liest kunden/<slug>/auftrag.md, schreibt PFLICHTENHEFT.md daneben
//   node werkzeuge/auftrag-lesen.mjs pfad/zum/auftrag.md       gibt das Pflichtenheft aus
//   node werkzeuge/auftrag-lesen.mjs --text "Friseur in Göppingen, Local SEO hoch, GEO hoch, CRO mittel"
// Optionen: --aus <datei> (Pflichtenheft dorthin schreiben), --json (Plan als JSON ausgeben)
import fs from 'node:fs'; import path from 'node:path';
import { REPO, PRIO, ladeWissen, leseAuftrag, erstellePlan, pflichtenheftMd } from './regeln.mjs';

const argv = process.argv.slice(2);
const opt = n => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : null);
let text, ziel = opt('--aus');
if (opt('--text')) text = opt('--text');
else {
  const arg = argv.find(a => !a.startsWith('--') && a !== ziel);
  if (!arg) { console.log('Aufruf: node werkzeuge/auftrag-lesen.mjs kunden/<slug> | auftrag.md | --text "…" [--aus datei] [--json]'); process.exit(2); }
  const p = path.resolve(REPO, arg);
  const datei = fs.existsSync(p) && fs.statSync(p).isDirectory() ? path.join(p, 'auftrag.md') : p;
  if (!fs.existsSync(datei)) { console.log(`Kein Auftrag gefunden: ${path.relative(REPO, datei)} (Vorlage: vorlage/auftrag.md)`); process.exit(2); }
  text = fs.readFileSync(datei, 'utf8');
  if (!ziel && datei.endsWith('auftrag.md') && !datei.startsWith(path.join(REPO, 'vorlage'))) ziel = path.join(path.dirname(datei), 'PFLICHTENHEFT.md');
}

const wissen = ladeWissen();
const plan = erstellePlan(leseAuftrag(text, wissen), wissen);
if (argv.includes('--json')) { const { gebiete, ...rest } = plan; console.log(JSON.stringify(rest, null, 2)); process.exit(0); }
const md = pflichtenheftMd(plan);
if (ziel) fs.writeFileSync(ziel, md); else if (!argv.includes('--kurz')) console.log(md);

const A = plan.auftrag; const zahl = v => plan.regeln.filter(r => r.verbindlich === v).length;
console.error(`\nKunde: ${A.kunde || '–'} · Branche: ${A.brancheInfo ? `${A.brancheInfo.name} (${A.brancheInfo.typ})` : A.branche || '–'} · Ort: ${A.ort || '–'}`);
console.error(`Fachgebiete: Global (immer)${Object.entries(plan.aktiv).sort((a, b) => b[1].prio - a[1].prio).map(([k, a]) => `, ${plan.gebiete[k].name} ${PRIO[a.prio]}${a.herkunft.startsWith('abgeleitet') || a.herkunft.startsWith('Zahlung') ? ' (' + a.herkunft + ')' : ''}`).join('')}`);
console.error(`Regeln: ${zahl('Muss')} Muss · ${zahl('Soll')} Soll · ${zahl('Kann')} Kann${ziel ? ` → ${path.relative(REPO, ziel)}` : ''}`);
for (const h of [...plan.empfehlungen, ...plan.hinweise]) console.error(`Hinweis: ${h}`);
