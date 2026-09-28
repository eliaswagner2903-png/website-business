// Rendert Standbilder der 3D-Uhr im headless Chromium (gleicher Code wie live) und wandelt sie mit sharp in AVIF/WebP.
// node showcase/edel/werkzeug/standbild.mjs [nur-png]
// Ergebnis: public/medien/<name>-<breite>.avif|webp  (Poster: uhr-held-*)
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { playwright } from '../../../werkzeuge/_playwright.mjs';
const hier = path.dirname(fileURLToPath(import.meta.url)), wurzel = path.resolve(hier, '..');
const { createRequire } = await import('node:module');
const sharp = createRequire(path.resolve(wurzel, '../../werkzeuge/package.json'))('sharp');
const nurPng = process.argv[2] === 'nur-png', nur = process.argv[3];
// name, ansicht, variante, Pixel (quadratisch), Breiten der Ausgabe
const BILDER = [
  ['uhr-held', 'held', 'tanne', 1400, [480, 720, 960, 1400]],
  ['uhr-tanne', 'schraeg', 'tanne', 1200, [480, 800, 1200]],
  ['uhr-schiefer', 'schraeg', 'schiefer', 1200, [480, 800, 1200]],
  ['uhr-elfenbein', 'schraeg', 'elfenbein', 1200, [480, 800, 1200]],
  ['uhr-krone', 'krone', 'tanne', 1200, [480, 800, 1200]],
];
const { chromium } = await playwright();
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage();
await p.route('http://render.local/**', (r) => {
  const u = new URL(r.request().url()).pathname;
  if (u === '/') return r.fulfill({ contentType: 'text/html', body: '<!doctype html><body style="margin:0;background:#000"><canvas id="c"></canvas></body>' });
  r.fulfill({ contentType: 'text/javascript', body: fs.readFileSync(path.join(wurzel, 'public', u)) });
});
p.on('console', (m) => console.log('  [browser]', m.text()));
await p.goto('http://render.local/');
const aus = path.join(wurzel, 'public/medien'), roh = path.join(wurzel, 'werkzeug/roh'); fs.mkdirSync(aus, { recursive: true }); fs.mkdirSync(roh, { recursive: true });
for (const [name, ansicht, variante, px, breiten] of BILDER.filter((x) => !nur || x[0] === nur)) {
  const daten = await p.evaluate(async ({ ansicht, variante, px }) => {
    const { erstelle } = await import('/js/uhr-haupt.js');
    const c = document.createElement('canvas'); c.width = px; c.height = px;
    const s = erstelle(c, { breite: px, hoehe: px, dpr: 1, ansicht, variante, erhalten: true });
    s.zeichne(); return c.toDataURL('image/png');
  }, { ansicht, variante, px });
  const png = Buffer.from(daten.split(',')[1], 'base64'); fs.writeFileSync(path.join(roh, `${name}.png`), png);
  if (nurPng) { console.log(name, 'png'); continue; }
  for (const w of breiten) {
    const bild = sharp(png).resize(w, w);
    await bild.clone().avif({ quality: 58, effort: 6 }).toFile(path.join(aus, `${name}-${w}.avif`));
    await bild.clone().webp({ quality: 80, alphaQuality: 90, effort: 6 }).toFile(path.join(aus, `${name}-${w}.webp`));
  }
  console.log(name, breiten.map((w) => `${w}: ${Math.round(fs.statSync(path.join(aus, `${name}-${w}.avif`)).size / 1024)}/${Math.round(fs.statSync(path.join(aus, `${name}-${w}.webp`)).size / 1024)} KB`).join('  '));
}
await b.close();
