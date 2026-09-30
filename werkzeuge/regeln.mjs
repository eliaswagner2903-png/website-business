// Gemeinsame Logik des Qualitätssystems (wissen/fachgebiete/): Fachgebiete und Regeln aus den Markdown-Tabellen lesen,
// einen Kundenauftrag (kunden/<slug>/auftrag.md oder ein freier Satz) verstehen und daraus das Pflichtenheft bilden.
// Einzige Quelle der Regeln sind die Tabellen in wissen/fachgebiete/*.md – hier steht nur die Mechanik.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';

export const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const FG = path.join(REPO, 'wissen/fachgebiete');

export const PRIO = { 5: 'KRITISCH', 4: 'HOCH', 3: 'MITTEL', 2: 'NIEDRIG', 1: 'OPTIONAL' };
// Priorität des Fachgebiets × Stufe der Regel → Verbindlichkeit (Muss blockiert die Abnahme, Soll ist Hinweis, Kann ist frei)
const MATRIX = {
  5: { K: 'Muss', E: 'Muss', Z: 'Soll' },
  4: { K: 'Muss', E: 'Muss', Z: 'Kann' },
  3: { K: 'Muss', E: 'Soll' },
  2: { K: 'Soll', E: 'Kann' },
  1: { K: 'Kann' },
};
export const verbindlichkeit = (prio, stufe) => (stufe === 'G' ? 'Muss' : MATRIX[prio]?.[stufe] || null);

// Wörter für Prioritäten (Reihenfolge wichtig: „sehr hoch“ vor „hoch“)
const PRIO_WOERTER = [
  [5, /\b(kritisch|critical|sehr\s+hoch|h(?:ö|oe)chste?|very\s+high|top)\b/i],
  [4, /\b(hoch|high|wichtig)\b/i],
  [3, /\b(mittel|medium|normal|mittlere?)\b/i],
  [2, /\b(niedrig|low|gering|nebensache)\b/i],
  [1, /\b(optional|nice\s+to\s+have|wenn\s+m(?:ö|oe)glich|bonus)\b/i],
]; // „muss“/„kann“ bewusst nicht: „kann warten“, „muss nicht“ wären sonst still falsch
// Alle Prioritätswörter in Textreihenfolge („sehr hoch“ zählt nicht zusätzlich als „hoch“)
export function prioTreffer(text) {
  let s = String(text || ''); const t = [];
  for (const [p, re] of PRIO_WOERTER) s = s.replace(new RegExp(re.source, 'gi'), (m, _g, i) => { t.push({ p, i }); return ' '.repeat(m.length); });
  return t.sort((a, b) => a.i - b.i).map(x => x.p);
}
export function prioAus(text) {
  const s = String(text || '');
  const stufe = s.match(/\bstufe\s*([1-5])\b/i) || s.match(/^\s*([1-5])\s*(?:\/\s*5|von\s*5)?\s*$/);
  if (stufe) return +stufe[1];
  return prioTreffer(s)[0] || null; // das erste Wort gilt („hoch, aber nicht kritisch“ = HOCH)
}
const JA = /^\s*(ja|yes|x|✓|✔|aktiv|an|true)\b/i;
const NEIN = /^\s*(nein|no|aus|keine?[nrs]?|nicht|ohne|false|–|-)(?![\p{L}])/iu;
const VERNEINT = /(?<![\p{L}])(nicht|kein\p{L}*|ohne)(?![\p{L}])/iu;

// ---------- Markdown-Tabellen ----------
function zellen(zeile) {
  return zeile.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map(z => z.trim().replace(/\\\|/g, '|'));
}
export function tabellen(text) {
  const out = []; let t = null;
  for (const zeile of text.split('\n')) {
    if (!zeile.trim().startsWith('|')) { t = null; continue; }
    const z = zellen(zeile);
    if (!t) { t = { kopf: z.map(k => k.replace(/\*|`/g, '')), zeilen: [] }; out.push(t); continue; }
    if (z.every(c => /^:?-{2,}:?$/.test(c))) continue;
    t.zeilen.push(Object.fromEntries(t.kopf.map((k, i) => [k, z[i] ?? ''])));
  }
  return out;
}
const ohneCode = s => String(s || '').replace(/`/g, '').trim();
const liste = s => ohneCode(s).split(/[,;]/).map(x => x.trim()).filter(x => x && x !== '–' && x !== '-');

// ---------- Wissen laden ----------
export function ladeWissen(ordner = FG) {
  const readme = fs.readFileSync(path.join(ordner, 'README.md'), 'utf8');
  const tab = tabellen(readme).find(t => t.kopf[0] === 'Schlüssel');
  if (!tab) throw new Error('wissen/fachgebiete/README.md: Tabelle „Schlüssel | Fachgebiet | Datei | …“ fehlt');
  const gebiete = {};
  for (const z of tab.zeilen) {
    const key = ohneCode(z['Schlüssel']);
    gebiete[key] = { key, name: z['Fachgebiet'], datei: ohneCode(z['Datei']), aliase: liste(z['Auch genannt']), voraus: liste(z['Setzt voraus']), regeln: [] };
  }
  const ids = new Set();
  for (const g of Object.values(gebiete)) {
    const datei = path.join(ordner, g.datei);
    if (!fs.existsSync(datei)) throw new Error(`Fachgebiet ${g.key}: Datei ${g.datei} fehlt`);
    for (const t of tabellen(fs.readFileSync(datei, 'utf8')).filter(t => t.kopf[0] === 'ID' && t.kopf.includes('Stufe'))) {
      for (const z of t.zeilen) {
        const id = ohneCode(z.ID);
        if (!/^[A-Z][A-Z0-9]{1,4}-\d{2}$/.test(id)) throw new Error(`${g.datei}: ungültige Regel-ID „${id}“`);
        if (ids.has(id)) throw new Error(`${g.datei}: Regel-ID ${id} doppelt`);
        ids.add(id);
        const r = { id, bereich: g.key, regel: z.Regel, stufe: ohneCode(z.Stufe), phase: ohneCode(z.Phase), art: ohneCode(z.Art),
          pruefung: liste(z['Prüfung']), beleg: ohneCode(z.Beleg), stand: ohneCode(z.Stand) };
        if (!/^[GKEZ]$/.test(r.stufe)) throw new Error(`${id}: Stufe „${r.stufe}“ (erlaubt G, K, E, Z)`);
        if (r.stufe === 'G' && g.key !== 'global') throw new Error(`${id}: Stufe G nur in GLOBAL.md`);
        if (!/^(AUTO|SEMI-AUTO|MANUAL)$/.test(r.art)) throw new Error(`${id}: Art „${r.art}“ (AUTO, SEMI-AUTO, MANUAL)`);
        if (!/^[PBAL]+$/.test(r.phase)) throw new Error(`${id}: Phase „${r.phase}“ (P, B, A, L)`);
        if (r.art !== 'MANUAL' && !r.pruefung.length) throw new Error(`${id}: ${r.art} braucht eine Prüfung`);
        g.regeln.push(r);
      }
    }
  }
  const btab = tabellen(fs.readFileSync(path.join(ordner, 'branchen.md'), 'utf8')).find(t => t.kopf[0] === 'Branche');
  const branchen = (btab?.zeilen || []).map(z => ({ name: z.Branche, woerter: liste(z['Stichwörter']).map(w => w.toLowerCase()),
    typ: ohneCode(z['schema.org-Typ']), lokal: /^ja/i.test(z.Lokal), inhalte: z.Pflichtinhalte, hinweise: z.Hinweise }));
  return { gebiete, branchen };
}

// ---------- Auftrag verstehen ----------
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function aliasListe(gebiete) {
  const l = [];
  for (const g of Object.values(gebiete)) for (const a of [g.name, g.key, ...g.aliase]) l.push([a, g.key]);
  return l.sort((a, b) => b[0].length - a[0].length).map(([a, key]) => ({ a, key, re: new RegExp(`(?<![\\p{L}\\p{N}])${esc(a)}(?![\\p{L}\\p{N}])`, 'iu') }));
}
const META = [
  ['kunde', /^(kunde|firma|name|unternehmen|betrieb)$/i], ['branche', /^(branche|business|ihr business|gewerbe)$/i],
  ['ort', /^(ort|standort|stadt|region)$/i], ['domain', /^(domain|adresse der seite|url|webadresse)$/i],
  ['website', /^(website|webseite|seite)$/i], ['wuensche', /^(besondere w(ü|ue)nsche|w(ü|ue)nsche|hinweise|stil|notizen)$/i],
  ['funktionen', /^(funktionen|bausteine)$/i], ['fremdePfade', /^(fremde pfade|pfade anderer systeme)$/i], ['sprachen', /^(sprachen?)$/i],
  ['block', /^(priorit(ä|ae)ten|leistungen|optimierung|services)$/i],
];

export function leseAuftrag(text, wissen) {
  const A = { kunde: '', branche: '', ort: '', domain: '', fremdePfade: '', website: true, wuensche: [], funktionen: '', sprachen: '', bereiche: {}, aus: [], konfigurator: {}, angaben: {}, notizen: [], unklar: [] };
  const aliase = aliasListe(wissen.gebiete);
  const gebietVon = (s) => { const n = s.trim().toLowerCase(); return aliase.find(x => x.a.toLowerCase() === n)?.key; };
  const setze = (key, prio, quelle) => {
    if (key === 'global') return; // immer aktiv
    const b = A.bereiche[key] || (A.bereiche[key] = { prio: null, quelle: [] });
    if (prio) b.prio = Math.max(b.prio || 0, prio); b.quelle.push(quelle);
  };
  const frei = (zeile) => { // freier Text: „Local SEO hoch, GEO hoch, CRO mittel“ / „✓ SEO“
    let gefunden = false;
    for (const teil of zeile.split(/[,;.\n]|\bund\b|\s+-\s+/i)) {
      const t = aliase.find(x => x.re.test(teil)); if (!t) continue;
      const i = teil.search(t.re); const vorne = teil.slice(0, i); const hinten = teil.slice(i + t.a.length);
      // verneint nur, wenn die Verneinung direkt davor steht („keine Analytics“) oder direkt dahinter („Analytics: nein“) –
      // „Local SEO hoch ohne Doorway-Seiten“ bleibt aktiv
      if (/(?<![\p{L}])(kein\p{L}*|ohne|nicht)\s+(\S+\s+){0,2}$/iu.test(vorne) || /^\s*:?\s*(nein|nicht|aus|kein\p{L}*)(?![\p{L}])/iu.test(hinten)) { A.aus.push(t.key); gefunden = true; continue; }
      setze(t.key, prioAus(hinten) || prioAus(teil.replace(t.re, '')), 'Text'); gefunden = true;
    }
    return gefunden;
  };
  const wert = (key, k, v) => { // Wert eines Fachgebiets: Nein → aus; sonst Priorität, Zweifel landen unter „unklar“
    if (NEIN.test(v)) { A.aus.push(key); return; }
    const t = prioTreffer(v); const z = `${k.trim()}: ${v.trim()}`;
    if (!JA.test(v) && !t.length) A.unklar.push(`${z} (Priorität nicht erkannt → MITTEL)`);
    else if (new Set(t).size > 1) A.unklar.push(`${z} (mehrere Prioritäten, genommen: ${PRIO[t[0]]})`);
    else if (VERNEINT.test(v)) A.unklar.push(`${z} (enthält eine Verneinung, trotzdem aktiv als ${PRIO[t[0] || 3]})`);
    setze(key, t[0] || null, JA.test(v) ? 'Ja' : 'Priorität');
  };
  const zeilen = text.replace(/\r/g, '').replace(/<!--[\s\S]*?-->/g, '').split('\n');
  let offen = null; // Schlüssel ohne Wert → Wert in den nächsten Zeilen
  for (const roh of zeilen) {
    const zeile = roh.replace(/^\s*(?:[-*•✓✔]|\d+\.)\s+/, '').replace(/\*\*/g, '').trim();
    if (!zeile || /^#|^={3,}|^<!--|^>/.test(zeile)) continue; // leer, Überschrift, Trenner, Kommentar, Zitat
    const kv = zeile.match(/^([^:]{1,60}):\s*(.*)$/);
    if (kv) {
      const [, k, v] = kv; const key = gebietVon(k); const meta = META.find(([, re]) => re.test(k.trim()))?.[0];
      if (key) {
        offen = null;
        if (!v.trim()) { offen = { gebiet: key, k }; continue; } // Wert steht in der nächsten Zeile
        if (/stufe\s*[1-5]/i.test(v)) A.konfigurator[k.trim()] = v.trim();
        wert(key, k, v); continue;
      }
      if (meta === 'block') { offen = null; continue; }
      if (meta) {
        if (!v) { offen = meta; continue; }
        offen = meta === 'wuensche' ? 'wuensche' : null;
        if (meta === 'website') A.website = !NEIN.test(v); else if (meta === 'wuensche') A.wuensche.push(v); else A[meta] = v.trim();
        continue;
      }
      if (/stufe\s*[1-5]/i.test(v)) { A.konfigurator[k.trim()] = v.trim(); offen = null; continue; } // Konfigurator-Regler ohne Fachgebiet
      offen = null; if (!frei(zeile) && v.trim()) A.angaben[k.trim()] = v.trim(); continue; // z. B. Telefon, Budget, Termin
    }
    if (offen?.gebiet) {
      const { gebiet, k } = offen; offen = null;
      wert(gebiet, k, zeile); continue;
    }
    if (offen) {
      if (offen === 'wuensche') A.wuensche.push(zeile);
      else if (offen === 'website') A.website = !NEIN.test(zeile);
      else { A[offen] = zeile; offen = null; }
      continue;
    }
    if (!frei(zeile)) A.notizen.push(zeile);
  }
  for (const k of A.aus) delete A.bereiche[k];
  // Freitext-Auftrag ohne „Branche:“ → Branche aus dem Text raten
  if (!A.ort) { const m = text.replace(/<!--[\s\S]*?-->/g, '').match(/\b(?:in|aus)\s+(\p{Lu}[\p{L}-]+(?:\s+(?:an der|am|im|bei)\s+\p{Lu}[\p{L}-]+)?)/u); if (m) { A.ort = m[1]; A.ortGeraten = true; } }
  const b = erkenneBranche(A.branche || text, wissen.branchen);
  A.brancheInfo = b;
  return A;
}

export function erkenneBranche(text, branchen) {
  const t = String(text || '').toLowerCase();
  let best = null;
  for (const b of branchen) for (const w of b.woerter) {
    const re = new RegExp(`(?<![\\p{L}])${esc(w)}${w.length < 5 ? '(?![\\p{L}])' : ''}`, 'iu'); // kurze Wörter nur ganz („bar“ ≠ „barrierefrei“)
    if (re.test(t) && (!best || w.length > best.w.length)) best = { b, w };
  }
  return best?.b || null;
}

// ---------- Pflichtenheft ----------
export function erstellePlan(A, wissen) {
  const { gebiete } = wissen;
  const aktiv = {}; const hinweise = []; const empfehlungen = [];
  for (const [key, b] of Object.entries(A.bereiche)) aktiv[key] = { prio: b.prio || 3, herkunft: b.prio ? 'Auftrag' : 'Auftrag (ohne Priorität → MITTEL)' };
  // Voraussetzungen: ein aktives Fachgebiet hebt seine Grundlagen auf mindestens min(eigene Priorität, MITTEL)
  let geaendert = true;
  while (geaendert) {
    geaendert = false;
    for (const [key, a] of Object.entries(aktiv)) for (const v of gebiete[key]?.voraus || []) {
      if (A.aus.includes(v)) { hinweise.push(`${gebiete[key].name} setzt ${gebiete[v].name} voraus, der Auftrag schließt es aus: Grundregeln (Stufe K) trotzdem einhalten und beim Kunden nachfragen.`); continue; }
      const ziel = Math.min(a.prio, 3);
      if (!aktiv[v] || aktiv[v].prio < ziel) { aktiv[v] = { prio: ziel, herkunft: `abgeleitet von ${gebiete[key].name}` }; geaendert = true; }
    }
  }
  // Funktionen mit Zahlung/Login heben Sicherheit (Konfigurator-Regel: Zahlung → Stufe ≥ 4)
  const ZAHLUNG = /(?<![\p{L}])(online-?shop|shop|checkout|zahlung\p{L}*|bezahl\p{L}*|login|kundenkonto)(?![\p{L}])/iu;
  const mitZahlung = (A.funktionen + '. ' + A.wuensche.join('. ')).split(/[,;.\n]/).some(t => ZAHLUNG.test(t) && !/(?<![\p{L}])(kein\p{L}*|ohne|nicht)\s+(\S+\s+){0,2}$/iu.test(t.slice(0, t.search(ZAHLUNG))));
  if (mitZahlung && (aktiv.sicherheit?.prio || 0) < 4) {
    aktiv.sicherheit = { prio: 4, herkunft: 'Zahlung/Login im Auftrag → mindestens HOCH' };
  }
  const br = A.brancheInfo;
  if (br?.lokal && !aktiv['local-seo'] && !A.aus.includes('local-seo')) empfehlungen.push(`Lokaler Betrieb (${br.name}) ohne Local SEO bestellt: dem Kunden Local SEO anbieten (nicht eigenmächtig aktivieren).`);
  if (A.ortGeraten) hinweise.push(`Ort „${A.ort}“ aus dem Text geraten – bitte bestätigen.`);
  if (/termin|buchung|buchen|shop|bestell|reservier|zahlung/i.test(A.funktionen) && !A.aus.includes('accessibility'))
    (aktiv.accessibility ? hinweise : empfehlungen).push(`Funktion „${A.funktionen}“ kann unter das BFSG fallen (Verbraucher-Buchung/Shop, Ausnahme Kleinstunternehmen): A11Y-08 klären${aktiv.accessibility ? '' : ', Barrierefreiheit dem Kunden anbieten'} – keine Rechtsberatung.`);
  if (aktiv.analytics) hinweise.push('Analytics bestellt: Standard ist datensparsame Zählung ohne Cookies und ohne fremde Skripte (siehe analytics.md). Alles mit Einwilligungspflicht nur nach schriftlicher Entscheidung des Kunden.');
  if (!A.kunde) hinweise.push('Kundenname fehlt im Auftrag.');
  if (!A.branche && !br) hinweise.push('Branche nicht erkannt: Branche angeben, sonst fehlen Schema-Typ und Pflichtinhalte.');
  if (A.unklar.length) hinweise.push(`Nicht verstanden (bitte prüfen): ${A.unklar.map(z => `„${z}“`).join(', ')}`);

  const regeln = [];
  for (const r of gebiete.global.regeln) regeln.push({ ...r, verbindlich: 'Muss', prio: 'IMMER' });
  for (const [key, a] of Object.entries(aktiv)) {
    if (key === 'global' || !gebiete[key]) continue;
    for (const r of gebiete[key].regeln) { const v = verbindlichkeit(a.prio, r.stufe); if (v) regeln.push({ ...r, verbindlich: v, prio: PRIO[a.prio] }); }
  }
  const lesen = ['wissen/fachgebiete/README.md', 'wissen/fachgebiete/GLOBAL.md', ...Object.keys(aktiv).sort((x, y) => aktiv[y].prio - aktiv[x].prio).map(k => `wissen/fachgebiete/${gebiete[k].datei}`)];
  return { auftrag: A, aktiv, regeln, lesen, hinweise, empfehlungen, gebiete };
}

const PHASEN = { P: 'Planen (Struktur, Inhalte, Daten)', B: 'Bauen (Code, Markup, Assets)', A: 'Abnahme (Prüfen und Belegen)', L: 'Nach Launch (erster Wartungslauf, blockiert die Abnahme nicht)' };
export function pflichtenheftMd(plan) {
  const { auftrag: A, aktiv, regeln, gebiete } = plan;
  const b = A.brancheInfo;
  const o = [];
  o.push(`# Pflichtenheft – ${A.kunde || '(Kunde fehlt)'}`, '');
  o.push(`> Erzeugt von \`node werkzeuge/auftrag-lesen.mjs\` aus dem Kundenauftrag. Nicht von Hand ändern: Auftrag ändern und neu erzeugen.`, '');
  o.push('| Angabe | Wert |', '|---|---|');
  o.push(`| Kunde | ${A.kunde || '–'} |`, `| Branche | ${A.branche || b?.name || '–'}${b ? ` → schema.org \`${b.typ}\`` : ''} |`, `| Ort | ${A.ort || '–'} |`, `| Domain | ${A.domain || '–'} |`);
  if (A.funktionen) o.push(`| Funktionen | ${A.funktionen} |`);
  if (A.wuensche.length) o.push(`| Besondere Wünsche | ${A.wuensche.join(' ')} |`);
  for (const [k, v] of Object.entries(A.konfigurator)) o.push(`| Konfigurator: ${k} | ${v} |`);
  for (const [k, v] of Object.entries(A.angaben)) o.push(`| ${k} | ${v} |`);
  if (A.notizen.length) o.push(`| Weitere Angaben | ${A.notizen.join(' · ')} |`);
  o.push('', '## Aktive Fachgebiete', '', '| Fachgebiet | Priorität | Herkunft | Muss | Soll | Kann |', '|---|---|---|---|---|---|');
  const zaehl = (key, v) => regeln.filter(r => r.bereich === key && r.verbindlich === v).length;
  o.push(`| Globaler Mindeststandard | IMMER | nicht abwählbar | ${zaehl('global', 'Muss')} | – | – |`);
  for (const [key, a] of Object.entries(aktiv).sort((x, y) => y[1].prio - x[1].prio)) o.push(`| ${gebiete[key].name} | ${PRIO[a.prio]} | ${a.herkunft} | ${zaehl(key, 'Muss')} | ${zaehl(key, 'Soll')} | ${zaehl(key, 'Kann')} |`);
  const inaktiv = Object.keys(gebiete).filter(k => k !== 'global' && !aktiv[k]).map(k => gebiete[k].name);
  if (inaktiv.length) o.push('', `Nicht bestellt: ${inaktiv.join(', ')} (nur der globale Standard gilt).`);
  if (plan.empfehlungen.length || plan.hinweise.length) { o.push('', '## Hinweise'); for (const h of [...plan.empfehlungen, ...plan.hinweise]) o.push(`- ${h}`); }
  if (b) o.push('', `## Branche: ${b.name}`, '', `- schema.org-Typ: \`${b.typ}\``, `- Pflichtinhalte: ${b.inhalte}`, `- Hinweise: ${b.hinweise}`);
  o.push('', '## Vor dem Bauen lesen', '', ...plan.lesen.map(l => `- \`${l}\``));
  // jede Regel einmal, in ihrer frühesten Phase (Spalte „Auch“ nennt die späteren)
  const rang = r => ({ Muss: 0, Soll: 1 })[r.verbindlich] * 100 - (plan.aktiv[r.bereich]?.prio ?? 9);
  for (const [ph, titel] of Object.entries(PHASEN)) {
    const rs = regeln.filter(r => r.phase[0] === ph && r.verbindlich !== 'Kann').sort((x, y) => rang(x) - rang(y) || x.id.localeCompare(y.id));
    if (!rs.length) continue;
    o.push('', `## ${titel}`, '', '| ID | Regel | Verbindlich | Art | Auch |', '|---|---|---|---|---|');
    for (const r of rs) o.push(`| ${r.id} | ${r.regel} | ${r.verbindlich} | ${r.art} | ${[...r.phase.slice(1)].map(p => ({ B: 'Bauen', A: 'Abnahme', L: 'nach Launch' })[p]).join(', ') || '–'} |`);
  }
  const kann = regeln.filter(r => r.verbindlich === 'Kann');
  if (kann.length) o.push('', '## Kann (nur wenn es ohne Mehraufwand geht)', '', ...kann.map(r => `- ${r.id}: ${r.regel}`));
  o.push('', '## Abnahme', '', 'Nach dem Bau: `/abnahme` (bzw. `node werkzeuge/qualitaet.mjs <ordner> --voll`). Muss-Regeln blockieren, Soll-Regeln erscheinen als Hinweis.');
  return o.join('\n') + '\n';
}
