// Bildfolge des Übergangs Poster → 3D-Szene (die Szene startet erst nach dem Laden, darum eigene Aufnahme).
// node showcase/edel/werkzeug/uebergang.mjs [breite=390] [port=8104]
import fs from 'node:fs'; import { playwright } from '../../../werkzeuge/_playwright.mjs';
const breite = +(process.argv[2] || 390), port = process.argv[3] || '8104', h = breite < 700 ? 844 : 900;
const ts = [0, 150, 300, 450, 600, 800, 1100, 1500];
const { chromium } = await playwright();
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const c = await b.newContext({ viewport: { width: breite, height: h }, isMobile: breite < 700, hasTouch: breite < 700 });
const p = await c.newPage();
await p.goto(`http://localhost:${port}/index.html`, { waitUntil: 'load' });
// Warten, bis die Leinwand da ist, dann die Einblend-Animation anhalten und Bild für Bild stellen
await p.waitForSelector('.uhr-live', { timeout: 40000 });
await p.evaluate(() => { window.__a = document.querySelector('.uhr-leinwand').getAnimations(); window.__a.forEach((a) => a.pause()); });
const bilder = [];
for (const t of ts) { await p.evaluate((t) => window.__a.forEach((a) => { a.currentTime = t; }), t); await p.waitForTimeout(80); bilder.push((await p.screenshot({ clip: { x: 0, y: 0, width: breite, height: Math.min(h, 760) } })).toString('base64')); }
const s = await (await b.newContext({ viewport: { width: 1600, height: 600 } })).newPage();
const sw = Math.round(1600 / ts.length) - 8, sh = Math.round(sw * Math.min(h, 760) / breite);
await s.setContent(`<body style="margin:0;background:#333;display:flex;gap:8px;padding:8px;font:12px sans-serif;color:#fff">${bilder.map((d, i) =>
  `<div><div>${ts[i]} ms</div><img src="data:image/png;base64,${d}" style="width:${sw}px;height:${sh}px;display:block"></div>`).join('')}</body>`);
fs.mkdirSync('werkzeuge/ausgabe', { recursive: true });
await s.screenshot({ path: `werkzeuge/ausgabe/uebergang-${breite}.png`, fullPage: true });
console.log(`werkzeuge/ausgabe/uebergang-${breite}.png`);
await b.close();
