// Qualitätsprüfung einer Kundenseite (Ordner mit den ausgelieferten Dateien).
// node werkzeuge/pruefen.mjs vorlage/public [port=8080]    (vorher: node werkzeuge/gzserver.mjs 8080 vorlage/public &)
// Prüft jede .html/.htm-Seite im Ordner: Überlauf bei 320–1920 px, Konsolenfehler, ohne JavaScript alles sichtbar,
// „Bewegung reduzieren“, Tippflächen < 44 px, genau eine H1. Screenshots nach werkzeuge/ausgabe/<bruder>/.
import fs from 'node:fs'; import path from 'node:path';
import { playwright } from './_playwright.mjs';
const [ordner, port = '8080'] = process.argv.slice(2);
if (!ordner) { console.log('Aufruf: node werkzeuge/pruefen.mjs kunden/<slug>/public [port]'); process.exit(1); }
const basis = `http://localhost:${port}/`;
const seiten = fs.readdirSync(ordner).filter(f => /\.html?$/.test(f));
const aus = path.join('werkzeuge/ausgabe', ordner.replace(/[\/]/g, '_')); fs.mkdirSync(aus, { recursive: true });
const { chromium } = await playwright(); const b = await chromium.launch();
let probleme = 0; const melde = (...a) => { probleme++; console.log('  ✗', ...a); };
for (const w of [320, 360, 390, 768, 1440, 1920]) {
  const c = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 700, hasTouch: w < 700 });
  const p = await c.newPage(); const fehler = []; p.on('pageerror', e => fehler.push(e.message)); p.on('console', m => m.type() === 'error' && fehler.push(m.text()));
  for (const s of seiten) {
    await p.goto(basis + s, { waitUntil: 'networkidle' });
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    if (sw > w) melde(`${s} @${w}px: Seite ${sw}px breit (Überlauf)`);
    if (w === 390) {
      const h1 = await p.$$eval('h1', a => a.length); if (h1 !== 1) melde(`${s}: ${h1} H1-Überschriften (genau 1 nötig)`);
      const klein = await p.$$eval('a, button, [role=button], input, select', els => els.filter(e => { const r = e.getBoundingClientRect(); const st = getComputedStyle(e);
        return r.width > 0 && r.height > 0 && st.visibility !== 'hidden' && (r.height < 44 && r.width < 44) && !e.closest('p, li p, address, td'); }).map(e => (e.textContent || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 30)));
      if (klein.length) melde(`${s}: kleine Tippflächen (< 44 px): ${[...new Set(klein)].slice(0, 6).join(' | ')}`);
      await p.screenshot({ path: path.join(aus, `${s}-390.png`) });
    }
    if (w === 1440) await p.screenshot({ path: path.join(aus, `${s}-1440.png`) });
  }
  if (fehler.length) melde(`@${w}px Konsolenfehler: ${[...new Set(fehler)].slice(0, 4).join(' | ')}`);
  await c.close();
}
for (const [name, opt] of [['ohne JavaScript', { javaScriptEnabled: false }], ['Bewegung reduzieren', { reducedMotion: 'reduce' }]]) {
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, ...opt }); const p = await c.newPage();
  for (const s of seiten) {
    await p.goto(basis + s, { waitUntil: 'networkidle' });
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 600) { await p.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), y); await p.waitForTimeout(60); } // instant: FEHLER 49
    await p.waitForTimeout(400);
    const unsichtbar = await p.$$eval('main *', a => a.filter(e => getComputedStyle(e).opacity === '0' && e.getBoundingClientRect().height > 0).length);
    if (unsichtbar) melde(`${s} (${name}): ${unsichtbar} Elemente bleiben unsichtbar`);
  }
  await c.close();
}
await b.close();
console.log(probleme ? `\n${probleme} Problem(e) gefunden. Screenshots: ${aus}` : `\nAlles in Ordnung (${seiten.length} Seiten). Screenshots: ${aus}`);
process.exit(probleme ? 1 : 0);
