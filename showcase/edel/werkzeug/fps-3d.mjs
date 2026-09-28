// Misst die 3D-Uhr: Bildrate der Szene (Worker) und Scroll-Bildrate der Seite, WÄHREND die Szene läuft.
// node showcase/edel/werkzeug/fps-3d.mjs [port=8104]   (Server: node werkzeuge/gzserver.mjs 8104 showcase/edel/public)
// Handy-Profil 390×844, DPR 2, 4× CPU-Drosselung. Headless nutzt SwiftShader (Software-GPU) → Szenen-fps pessimistisch.
import { playwright } from '../../../werkzeuge/_playwright.mjs';
const port = process.argv[2] || '8104';
const { chromium } = await playwright();
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const p = await c.newPage(); const anfragen = [];
p.on('requestfinished', async (r) => { const s = await r.sizes().catch(() => null); anfragen.push({ url: r.url(), bytes: s ? s.responseBodySize + s.responseHeadersSize : 0 }); });
await p.goto(`http://localhost:${port}/index.html?messen`, { waitUntil: 'load' });
const tLoad = Date.now();
await p.waitForSelector('.uhr-live', { timeout: 30000 });
console.log(`Szene sichtbar ${Date.now() - tLoad} ms nach „load“`);
const js3d = anfragen.filter((a) => /uhr-(worker|haupt)\.js/.test(a.url));
console.log(`3D-Skript: ${js3d.map((a) => `${a.url.split('/').pop()} ${Math.round(a.bytes / 102.4) / 10} KB`).join(', ')} (komprimiert)`);
const cdp = await c.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await p.waitForTimeout(4500);
console.log(`Szene (Worker): ${await p.evaluate(() => window.uhrFps)} fps`);
const fps = await p.evaluate(() => new Promise((fertig) => {
  const H = 1400, dauer = 3000; let bilder = 0, start;
  const schritt = (t) => { start ??= t; const f = Math.min((t - start) / dauer, 1); scrollTo(0, H * f); bilder++;
    f < 1 ? requestAnimationFrame(schritt) : fertig(Math.round(bilder / (dauer / 1000))); };
  requestAnimationFrame(schritt);
}));
console.log(`Scrollen (Haupt-Thread, 3D läuft, 4× Drosselung): ${fps} fps`);
await b.close();
