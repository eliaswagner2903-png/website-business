// Wöchentliche Wartungsprüfung aller Kundenseiten aus wartung/kunden.json.
// node wartung/check.mjs [--nur slug]   → Bericht nach wartung/berichte/JJJJ-MM-TT.md, Exit 1 bei KRIT oder HOCH.
// Rein beobachtend: normale Seitenaufrufe wie ein Besucher, kein Scannen.
import fs from 'node:fs'; import tls from 'node:tls'; import path from 'node:path';
import { fileURLToPath } from 'node:url';

const hier = path.dirname(fileURLToPath(import.meta.url));
const kunden = JSON.parse(fs.readFileSync(path.join(hier, 'kunden.json'), 'utf8')).kunden;
const nur = process.argv.includes('--nur') ? process.argv[process.argv.indexOf('--nur') + 1] : null;
const PFLICHT = ['content-security-policy', 'strict-transport-security', 'x-content-type-options', 'referrer-policy', 'permissions-policy'];

function zertifikatTage(host) {
  return new Promise((ok) => {
    const s = tls.connect({ host, port: 443, servername: host, timeout: 8000 }, () => {
      const bis = new Date(s.getPeerCertificate().valid_to); s.end(); ok(Math.floor((bis - Date.now()) / 864e5));
    });
    s.on('error', () => ok(null)); s.on('timeout', () => { s.destroy(); ok(null); });
  });
}

async function holen(url, opt = {}) {
  const t0 = Date.now();
  const r = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'Wartung/1.0 (+Betreuung der Website)' }, ...opt });
  return { r, ms: Date.now() - t0 };
}

async function pruefe(k) {
  const m = []; const melde = (stufe, text) => m.push({ stufe, text });
  const url = `https://${k.domain}/`;
  try {
    const { r, ms } = await holen(url);
    if (r.status >= 500) melde('KRIT', `Startseite antwortet ${r.status}`);
    else if (r.status >= 400) melde('HOCH', `Startseite antwortet ${r.status}`);
    else if (r.status >= 300) melde('MITTEL', `Startseite leitet weiter nach ${r.headers.get('location')}`);
    if (ms > 2500) melde('MITTEL', `Antwortzeit ${ms} ms`);
    for (const h of PFLICHT) if (!r.headers.get(h)) melde('HOCH', `Header fehlt: ${h}`);
    const csp = r.headers.get('content-security-policy') || '';
    if (/unsafe-inline|unsafe-eval/.test(csp)) melde('MITTEL', 'CSP erlaubt unsafe-inline/unsafe-eval');
    const html = r.status < 300 ? await r.text() : '';
    if (html && !/<title>[^<]+<\/title>/.test(html)) melde('MITTEL', 'Kein <title>');
    if (/fonts\.googleapis|google-analytics|googletagmanager/.test(html)) melde('HOCH', 'Google-Dienst eingebunden (DSGVO prüfen)');
    for (const p of ['/impressum.html', '/datenschutz.html']) {
      const { r: rp } = await holen(`https://${k.domain}${p}`); if (rp.status !== 200) melde('HOCH', `${p} antwortet ${rp.status}`);
    }
  } catch (e) { melde('KRIT', `Seite nicht erreichbar: ${e.cause?.code || e.message}`); }
  try {
    const { r } = await holen(`http://${k.domain}/`);
    if (!(r.status >= 300 && r.status < 400 && (r.headers.get('location') || '').startsWith('https://'))) melde('HOCH', 'http leitet nicht auf https um');
  } catch { /* http gesperrt ist in Ordnung */ }
  const tage = await zertifikatTage(k.domain);
  if (tage === null) melde('NIEDRIG', 'Zertifikat nicht prüfbar (Netz/Proxy)');
  else if (tage < 7) melde('KRIT', `Zertifikat läuft in ${tage} Tagen ab`);
  else if (tage < 21) melde('HOCH', `Zertifikat läuft in ${tage} Tagen ab`);
  return { k, m, tage };
}

const liste = kunden.filter((k) => k.aktiv !== false && (!nur || k.slug === nur));
if (!liste.length) { console.log('Keine aktiven Kunden in wartung/kunden.json – nichts zu prüfen.'); process.exit(0); }
const erg = await Promise.all(liste.map(pruefe));
const heute = new Date().toISOString().slice(0, 10);
let md = `# Wartungsbericht ${heute}\n\n| Kunde | Domain | Befunde | Zertifikat |\n|---|---|---|---|\n`;
for (const { k, m, tage } of erg) md += `| ${k.name} | ${k.domain} | ${m.length ? m.map((x) => `[${x.stufe}] ${x.text}`).join('<br>') : 'in Ordnung'} | ${tage ?? '?'} Tage |\n`;
const ernst = erg.some(({ m }) => m.some((x) => x.stufe === 'KRIT' || x.stufe === 'HOCH'));
md += `\n${ernst ? '**Handlungsbedarf.** Fernspäherkommando auf die betroffenen Seiten ansetzen (/aufklaerung).' : 'Keine ernsten Befunde.'}\n`;
fs.mkdirSync(path.join(hier, 'berichte'), { recursive: true });
fs.writeFileSync(path.join(hier, 'berichte', `${heute}.md`), md);
console.log(md);
process.exit(ernst ? 1 : 0);
