// Baut die gewählten Bausteine in die Seite ein: fügt ihr CSS zu public/css/bausteine.css und ihr JS zu
// public/js/bausteine.js zusammen (eine Anfrage je Art). Die erzeugten Dateien nicht von Hand ändern –
// Änderungen im Baustein-Ordner machen und neu erzeugen. `npm test` prüft, dass beides aktuell ist.
//   node bausteine/einbauen.mjs einblenden seitenwechsel menue-blatt bento hero-video
//   node bausteine/einbauen.mjs            (ohne Namen: Auswahl aus der Kopfzeile der vorhandenen Datei)
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const hier = path.dirname(fileURLToPath(import.meta.url));
const css = path.join(hier, '../public/css/bausteine.css');
const js = path.join(hier, '../public/js/bausteine.js');

export function auswahlAus(datei) {
  try { return (fs.readFileSync(datei, 'utf8').match(/Bausteine: ([\w\- ,]+)/)?.[1] ?? '').split(/[ ,]+/).filter(Boolean); } catch { return []; }
}
export function erzeuge(namen) {
  const kopf = (art) => `/* Erzeugt von bausteine/einbauen.mjs – nicht von Hand ändern. Bausteine: ${namen.join(', ')} */\n`;
  const teile = (endung) => namen.map((n) => path.join(hier, n, `${n}.${endung}`)).filter((f) => fs.existsSync(f))
    .map((f) => `\n/* ===== ${path.relative(hier, f)} ===== */\n${fs.readFileSync(f, 'utf8')}`).join('');
  return { css: kopf('css') + teile('css'), js: kopf('js') + teile('js') };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const namen = process.argv.slice(2).length ? process.argv.slice(2) : auswahlAus(css);
  for (const n of namen) if (!fs.existsSync(path.join(hier, n))) { console.log(`✗ Baustein „${n}“ gibt es nicht`); process.exit(1); }
  const { css: c, js: j } = erzeuge(namen);
  fs.writeFileSync(css, c); fs.writeFileSync(js, j);
  console.log(`✓ ${path.relative(process.cwd(), css)} (${Math.round(c.length / 102.4) / 10} KB), ${path.relative(process.cwd(), js)} (${Math.round(j.length / 102.4) / 10} KB): ${namen.join(', ')}`);
}
