// Screenshot eines Abschnitts bei Handy- und Desktop-Breite (Einblend-Animationen abgeschaltet, lazy Bilder geladen).
// node werkzeuge/abschnitt-foto.mjs <url> <css-selektor> <ausgabe-präfix> [breiten=390,1440]
import { playwright } from './_playwright.mjs';
const [url, sel, aus, br = '390,1440'] = process.argv.slice(2);
const { chromium } = await playwright();
const b = await chromium.launch();
for (const w of br.split(',').map(Number)) {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  await p.goto(url, { waitUntil: 'networkidle' });
  const el = p.locator(sel).first();
  await el.scrollIntoViewIfNeeded();
  await p.evaluate(() => Promise.all([...document.images].map(i => { i.loading = 'eager'; return i.decode().catch(() => {}); })));
  await p.waitForTimeout(400);
  await el.screenshot({ path: `${aus}-${w}.png` });
  console.log(`${aus}-${w}.png`);
}
await b.close();
