// Kopiert die Schriftdateien (latin + latin-ext, Achse wght) aus npm-Paketen nach public/fonts/.
// Aufruf im Ordner der Seite:  node bausteine/schriften.mjs @fontsource-variable/fraunces @fontsource-variable/instrument-sans
// Vorher: npm i -D <paket>. Danach Namen und Ersatz-Maße in public/css/marke.css eintragen (siehe bausteine/README.md).
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const require = createRequire(path.resolve('package.json'));
const pakete = process.argv.slice(2);
if (!pakete.length) { console.log('Aufruf: node bausteine/schriften.mjs @fontsource-variable/<name> …'); process.exit(1); }
const ziel = path.resolve('public/fonts'); fs.mkdirSync(ziel, { recursive: true });
for (const p of pakete) {
  const ordner = path.join(path.dirname(require.resolve(`${p}/package.json`)), 'files');
  const dateien = fs.readdirSync(ordner).filter((f) => /-latin(-ext)?-wght-normal\.woff2$/.test(f));
  if (!dateien.length) { console.log(`✗ ${p}: keine *-latin-wght-normal.woff2 (statische Schrift? dann *-latin-400-normal.woff2 von Hand)`); continue; }
  for (const f of dateien) {
    fs.copyFileSync(path.join(ordner, f), path.join(ziel, f));
    console.log(`✓ ${f}  ${Math.round(fs.statSync(path.join(ziel, f)).size / 1024)} KB`);
  }
}
