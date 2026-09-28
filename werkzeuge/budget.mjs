// Gewichts-Budget und Scroll-Flüssigkeit einer Seite (Meisterstandard P2/P3).
// node werkzeuge/budget.mjs <ordner> [port=8080] [seite=index.html]   (vorher: node werkzeuge/gzserver.mjs <port> <ordner>)
// Misst komprimiert, erster Aufruf auf dem Handy-Profil: Übertragung, JS, CSS, Schriften, Anfragen, fremde Herkünfte,
// danach Bilder pro Sekunde beim Scrollen mit 4× CPU-Drosselung.
import { playwright } from './_playwright.mjs';
const [ordner, port = '8080', seite = 'index.html'] = process.argv.slice(2);
if (!ordner) { console.log('Aufruf: node werkzeuge/budget.mjs <ordner> [port] [seite]'); process.exit(1); }
const url = `http://localhost:${port}/${seite}`;
const GRENZEN = { gesamt: 500, js: 60, css: 30, schrift: 120, schriftDateien: 3, anfragen: 25, fps: 55 };

const { chromium } = await playwright(); const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
const p = await c.newPage(); const antworten = [];
p.on('requestfinished', async r => { const s = await r.sizes().catch(() => null); antworten.push({ url: r.url(), typ: r.resourceType(), bytes: s ? s.responseBodySize + s.responseHeadersSize : 0 }); });
await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(500);

const kb = n => Math.round(n / 102.4) / 10;
const summe = f => kb(antworten.filter(f).reduce((a, r) => a + r.bytes, 0));
const eigen = new URL(url).origin;
const werte = {
  gesamt: summe(() => true), js: summe(r => r.typ === 'script'), css: summe(r => r.typ === 'stylesheet'),
  schrift: summe(r => r.typ === 'font'), schriftDateien: antworten.filter(r => r.typ === 'font').length,
  anfragen: antworten.length,
};
const fremd = [...new Set(antworten.map(r => new URL(r.url).origin).filter(o => o !== eigen && !o.startsWith('data:')))];

// Scroll-Flüssigkeit: 4× langsamere CPU, gleichmäßig bis zum Ende scrollen, Bilder pro Sekunde zählen.
const cdp = await c.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
werte.fps = await p.evaluate(() => new Promise(fertig => {
  const H = document.documentElement.scrollHeight - innerHeight, dauer = 3000; let bilder = 0, start;
  const schritt = t => { start ??= t; const f = Math.min((t - start) / dauer, 1); scrollTo(0, H * f); bilder++;
    f < 1 ? requestAnimationFrame(schritt) : fertig(Math.round(bilder / (dauer / 1000))); };
  requestAnimationFrame(schritt);
}));
await b.close();

let fehler = 0; console.log(`Budget ${url} (komprimiert, Handy)`);
for (const [k, grenze] of Object.entries(GRENZEN)) {
  const ok = k === 'fps' ? werte[k] >= grenze : werte[k] <= grenze; if (!ok) fehler++;
  const einheit = ['schriftDateien', 'anfragen', 'fps'].includes(k) ? '' : ' KB';
  console.log(`  ${ok ? '✓' : '✗'} ${k.padEnd(15)} ${String(werte[k]).padStart(7)}${einheit}   Grenze ${k === 'fps' ? '≥' : '≤'} ${grenze}${einheit}`);
}
if (fremd.length) { fehler++; console.log(`  ✗ fremde Herkünfte: ${fremd.join(', ')}`); } else console.log('  ✓ keine fremden Herkünfte');
console.log(fehler ? `\n${fehler} Grenze(n) überschritten.` : '\nBudget eingehalten.');
process.exit(fehler ? 1 : 0);
