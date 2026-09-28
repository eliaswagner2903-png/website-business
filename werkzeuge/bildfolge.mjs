// Nimmt eine Animation als Bildfolge auf (0, 150, 300, 450, 600, 800, 1100, 1500 ms) – exakt, über die Web-Animations-API.
// node werkzeuge/bildfolge.mjs <url> "<css-selektor zum Antippen | laden>" [breite=390] [scrollY=0]
// Beispiel Menü:  node werkzeuge/bildfolge.mjs http://localhost:8080/bruder-a/index.html ".menue-knopf"
// Beispiel Laden: node werkzeuge/bildfolge.mjs http://localhost:8080/bruder-a/index.html laden 1440
// Ergebnis: werkzeuge/ausgabe/bildfolge.png (alle Bilder nebeneinander, mit Zeitangabe)
import fs from 'node:fs'; import { playwright } from './_playwright.mjs';
const [url, ausloeser = 'laden', breite = '390', scrollY = '0'] = process.argv.slice(2);
const w = +breite, h = w < 700 ? 844 : 900, ts = [0, 150, 300, 450, 600, 800, 1100, 1500];
const { chromium } = await playwright(); const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 700, hasTouch: w < 700 })).newPage();
await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(300);
if (ausloeser !== 'laden') { await p.evaluate(y => scrollTo(0, y), +scrollY); await p.waitForTimeout(3000); w < 700 ? await p.tap(ausloeser) : await p.click(ausloeser); }
await p.evaluate(() => { window.__a = document.getAnimations().filter(a => !a.timeline || a.timeline instanceof DocumentTimeline); window.__a.forEach(a => a.pause()); });
fs.mkdirSync('werkzeuge/ausgabe', { recursive: true }); const bilder = [];
for (const t of ts) { await p.evaluate(t => window.__a.forEach(a => { a.currentTime = t; }), t); await p.waitForTimeout(60); bilder.push((await p.screenshot()).toString('base64')); }
// Zusammensetzen im Browser (kein Python/PIL nötig)
const s = await (await b.newContext({ viewport: { width: 1600, height: 600 } })).newPage();
const sw = Math.round(1600 / ts.length) - 8, sh = Math.round(sw * h / w);
await s.setContent(`<body style="margin:0;background:#333;display:flex;gap:8px;padding:8px;font:12px sans-serif;color:#fff">${bilder.map((d, i) =>
  `<div><div>${ts[i]} ms</div><img src="data:image/png;base64,${d}" style="width:${sw}px;height:${sh}px;display:block"></div>`).join('')}</body>`);
await s.screenshot({ path: 'werkzeuge/ausgabe/bildfolge.png', fullPage: true });
console.log('werkzeuge/ausgabe/bildfolge.png  – Faustregel: nach 150 ms höchstens ein Viertel da, sonst wirkt es hektisch.');
await b.close();
