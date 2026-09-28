// Rendert das Standbild (Poster) jeder 3D-Szene einer Seite im headless Chromium (WebGL über SwiftShader)
// und legt es als AVIF + WebP mit Transparenz ab. Das Poster ist exakt das erste Bild der Live-Szene.
// node werkzeuge/poster-rendern.mjs <url der seite> <zielordner> [breiten=640,1280]
// Beispiel: node werkzeuge/poster-rendern.mjs http://localhost:8102/bausteine/szene-3d/demo.html vorlage/bausteine/szene-3d/medien
// Dateiname: data-poster-name der .szene-3d, sonst szene-<data-objekt>  →  <name>-<breite>.avif / .webp
// Nach jeder Änderung an Objekt, Farbe (marke.css), Seitenverhältnis oder Kamera neu rendern, sonst springt der Übergang.
import fs from 'node:fs'; import path from 'node:path'; import { playwright } from './_playwright.mjs';
import sharp from 'sharp';
const [url, ziel, breitenText = '640,1280'] = process.argv.slice(2);
if (!url || !ziel) { console.log('Aufruf: node werkzeuge/poster-rendern.mjs <url> <zielordner> [breiten]'); process.exit(1); }
const breiten = breitenText.split(',').map(Number);
const { chromium } = await playwright();
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const fehler = []; p.on('pageerror', e => fehler.push(e.message)); p.on('console', m => m.type() === 'error' && fehler.push(m.text()));
const u = new URL(url); u.searchParams.set('standbild', '1');
await p.goto(u.href, { waitUntil: 'load' });
await p.waitForFunction(() => typeof window.szeneStandbild === 'function', null, { timeout: 10000 });
const namen = await p.$$eval('.szene-3d', els => els.map(e => e.dataset.posterName || `szene-${e.dataset.objekt || 'gefaess'}`));
fs.mkdirSync(ziel, { recursive: true });
for (const [nr, name] of namen.entries()) for (const breite of breiten) {
  const daten = await p.evaluate(([w, n]) => window.szeneStandbild(w, n), [breite, nr]);
  const png = Buffer.from(daten.split(',')[1], 'base64');
  const avif = path.join(ziel, `${name}-${breite}.avif`), webp = path.join(ziel, `${name}-${breite}.webp`);
  await sharp(png).avif({ quality: 62, effort: 6 }).toFile(avif);
  await sharp(png).webp({ quality: 84, alphaQuality: 90, effort: 6 }).toFile(webp);
  const kb = f => (fs.statSync(f).size / 1024).toFixed(1);
  const { width, height } = await sharp(png).metadata();
  console.log(`${name}-${breite}: ${width}×${height}  AVIF ${kb(avif)} KB · WebP ${kb(webp)} KB`);
}
await b.close();
if (fehler.length) { console.error('Fehler auf der Seite:\n ' + fehler.join('\n ')); process.exit(1); }
