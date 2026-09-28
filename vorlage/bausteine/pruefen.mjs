// Prüft alle Baustein-Demos: Breiten 320–1920 ohne Überlauf, keine Konsolen-/CSP-Fehler, genau eine H1,
// Tippflächen, ohne JS und bei „Bewegung reduzieren“ nichts unsichtbar – plus Funktionstests je Baustein.
// Vorher (eigener Befehl): node werkzeuge/gzserver.mjs 8111 vorlage   (liefert vorlage/_headers → CSP wie live)
// Aufruf aus dem Repo: node vorlage/bausteine/pruefen.mjs [port=8111]
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { playwright } from '../../werkzeuge/_playwright.mjs';
const port = process.argv[2] || '8111', basis = `http://localhost:${port}/bausteine/`;
const hier = path.dirname(fileURLToPath(import.meta.url));
const seiten = ['index.html', ...fs.readdirSync(hier).filter((d) => fs.statSync(path.join(hier, d)).isDirectory())
  .flatMap((d) => fs.readdirSync(path.join(hier, d)).filter((f) => f.endsWith('.html')).map((f) => `${d}/${f}`))];
const { chromium } = await playwright(); const b = await chromium.launch();
let probleme = 0; const melde = (...a) => { probleme++; console.log('  ✗', ...a); }; const gut = (...a) => console.log('  ✓', ...a);
const kontext = (w, opt = {}) => b.newContext({ viewport: { width: w, height: w < 700 ? 844 : 900 }, isMobile: w < 700, hasTouch: w < 700, ...opt });
const fehlerSammeln = (p) => { const f = []; p.on('pageerror', (e) => f.push(e.message)); p.on('console', (m) => m.type() === 'error' && f.push(m.text())); return f; };

console.log('Allgemein');
for (const w of [320, 360, 390, 768, 1440, 1920]) {
  const c = await kontext(w); const p = await c.newPage(); const f = fehlerSammeln(p);
  for (const s of seiten) {
    await p.goto(basis + s, { waitUntil: 'networkidle' });
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    if (sw > w) melde(`${s} @${w}: ${sw} px breit`);
    if (w === 390) {
      const h1 = await p.$$eval('h1', (a) => a.length); if (h1 !== 1) melde(`${s}: ${h1} H1`);
      const klein = await p.$$eval('a, button, input', (els) => els.filter((e) => { const r = e.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden' && r.height < 44 && r.width < 44 && !e.closest('p, li p, td'); }).map((e) => e.textContent.trim().slice(0, 20)));
      if (klein.length) melde(`${s}: kleine Tippflächen ${klein.join(' | ')}`);
    }
  }
  if (f.length) melde(`@${w} Konsole: ${[...new Set(f)].slice(0, 4).join(' | ')}`);
  await c.close();
}
for (const [name, opt] of [['ohne JS', { javaScriptEnabled: false }], ['reduziert', { reducedMotion: 'reduce' }]]) {
  const c = await kontext(390, opt); const p = await c.newPage();
  for (const s of seiten) {
    await p.goto(basis + s, { waitUntil: 'networkidle' });
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H + 600; y += 500) { await p.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), y); await p.waitForTimeout(50); }
    await p.waitForTimeout(300);
    const n = await p.$$eval('main *', (a) => a.filter((e) => getComputedStyle(e).opacity === '0' && e.getBoundingClientRect().height > 0).length);
    if (n) melde(`${s} (${name}): ${n} Elemente unsichtbar`);
    if (name === 'reduziert') { const an = await p.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length); if (an) melde(`${s} (reduziert): ${an} laufende Animationen`); }
  }
  await c.close();
}
gut('Breiten, Konsole, H1, Tippflächen, ohne JS, reduziert geprüft');

console.log('einblenden');
for (const [name, url] of [['CSS', 'einblenden/demo.html'], ['Rückfall', 'einblenden/demo.html?rueckfall']]) {
  const c = await kontext(390); const p = await c.newPage(); await p.goto(basis + url, { waitUntil: 'networkidle' }); await p.waitForTimeout(200);
  const oben = await p.$$eval('.einblenden', (a) => a.filter((e) => e.getBoundingClientRect().bottom < innerHeight).map((e) => +getComputedStyle(e).opacity));
  if (oben.some((o) => o < 1)) melde(`${name}: Element im ersten Bildschirm nicht voll sichtbar (${oben})`); else gut(`${name}: erster Bildschirm unverändert (${oben.length} Elemente)`);
  const unten = await p.$$eval('.einblenden', (a) => a.filter((e) => e.getBoundingClientRect().top > innerHeight).map((e) => +getComputedStyle(e).opacity));
  if (!unten.length || unten.some((o) => o > 0.05)) melde(`${name}: Elemente unterhalb nicht versteckt (${unten})`); else gut(`${name}: ${unten.length} Elemente unterhalb warten`);
  await p.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })); await p.waitForTimeout(1800);
  const rest = await p.$$eval('.einblenden', (a) => a.filter((e) => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }).map((e) => [+getComputedStyle(e).opacity, e.className]));
  if (rest.some(([o]) => o < 1)) melde(`${name}: nach dem Scrollen nicht sichtbar ${JSON.stringify(rest)}`); else gut(`${name}: nach dem Scrollen alles sichtbar`);
  if (name === 'Rückfall' && rest.some(([, k]) => /einblenden--/.test(k))) melde('Rückfall: Hilfsklassen nicht entfernt');
  await c.close();
}

console.log('menue-blatt');
{
  const c = await kontext(390); const p = await c.newPage(); await p.goto(basis + 'menue-blatt/demo.html', { waitUntil: 'networkidle' });
  const zu = await p.evaluate(() => ({ inert: document.getElementById('nav').inert, sicht: getComputedStyle(document.getElementById('nav')).visibility }));
  zu.inert && zu.sicht === 'hidden' ? gut('geschlossen: inert + unsichtbar') : melde(`geschlossen: ${JSON.stringify(zu)}`);
  await p.tap('.menue-knopf'); await p.waitForTimeout(1000);
  const auf = await p.evaluate(() => ({ fokus: document.activeElement.textContent, main: document.querySelector('main').inert, sprung: document.querySelector('.sprung').inert,
    unten: Math.round(document.getElementById('nav').getBoundingClientRect().bottom), h: innerHeight, expanded: document.querySelector('.menue-knopf').getAttribute('aria-expanded') }));
  auf.main && auf.sprung && auf.fokus === 'Abschnitt eins' && Math.abs(auf.unten - auf.h) < 2 && auf.expanded === 'true' ? gut(`offen: Fokus „${auf.fokus}“, Rest inert, Blatt unten bündig`) : melde(`offen: ${JSON.stringify(auf)}`);
  for (let i = 0; i < 6; i++) await p.keyboard.press('Tab');
  const imBlatt = await p.evaluate(() => !!document.activeElement.closest('#nav') || document.activeElement.classList.contains('menue-knopf'));
  imBlatt ? gut('Tab bleibt in Blatt und Knopf') : melde('Tab verlässt das Blatt');
  await p.keyboard.press('Escape'); await p.waitForTimeout(600);
  const nach = await p.evaluate(() => ({ fokus: document.activeElement.className, main: document.querySelector('main').inert, inert: document.getElementById('nav').inert }));
  nach.fokus === 'menue-knopf' && !nach.main && nach.inert ? gut('Escape: zu, Fokus zurück auf den Knopf') : melde(`Escape: ${JSON.stringify(nach)}`);
  await p.tap('.menue-knopf'); await p.waitForTimeout(1000); await p.tap('#nav a[href="#zwei"]'); await p.waitForTimeout(900);
  const sprung = await p.evaluate(() => ({ offen: document.documentElement.classList.contains('menue-offen'), top: Math.round(document.getElementById('zwei').getBoundingClientRect().top), ende: Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight - 1 }));
  !sprung.offen && sprung.top >= 0 && (sprung.top < 200 || sprung.ende) ? gut(`Link: Blatt zu, Ziel bei ${sprung.top} px`) : melde(`Link: ${JSON.stringify(sprung)}`);
  await c.close();
  const d = await kontext(1440); const q = await d.newPage(); await q.goto(basis + 'menue-blatt/demo.html');
  const desk = await q.evaluate(() => ({ inert: document.getElementById('nav').inert, knopf: getComputedStyle(document.querySelector('.menue-knopf')).display }));
  !desk.inert && desk.knopf === 'none' ? gut('Computer: Navigation als Zeile, nicht inert') : melde(`Computer: ${JSON.stringify(desk)}`);
  await d.close();
}

console.log('galerie');
{
  const c = await kontext(390); const p = await c.newPage(); await p.goto(basis + 'galerie/demo.html', { waitUntil: 'networkidle' });
  await p.tap('.galerie-bild >> nth=1'); await p.waitForTimeout(700);
  let z = await p.evaluate(() => ({ offen: document.querySelector('.galerie-dialog').open, text: document.querySelector('.galerie-zaehler').textContent, src: document.querySelector('.galerie-dialog img').getAttribute('src') }));
  z.offen && z.text.startsWith('02 / 06') && z.src.endsWith('bild-2-1280.webp') ? gut(`Tipp öffnet Großansicht „${z.text}“`) : melde(`öffnen: ${JSON.stringify(z)}`);
  await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowRight');
  z = await p.evaluate(() => document.querySelector('.galerie-zaehler').textContent); z.startsWith('04') ? gut('Pfeiltasten blättern') : melde(`Pfeiltasten: ${z}`);
  await p.keyboard.press('Escape'); await p.waitForTimeout(600);
  z = await p.evaluate(() => ({ offen: document.querySelector('.galerie-dialog').open, fokus: document.activeElement.className }));
  !z.offen && z.fokus === 'galerie-bild' ? gut('Escape schließt, Fokus zurück am Bild') : melde(`schließen: ${JSON.stringify(z)}`);
  await c.close();
  const n = await kontext(390, { javaScriptEnabled: false }); const q = await n.newPage(); await q.goto(basis + 'galerie/demo.html');
  await q.click('.galerie-bild >> nth=0'); await q.waitForTimeout(300); q.url().endsWith('bild-1-1280.webp') ? gut('ohne JS: Link öffnet das große Bild') : melde(`ohne JS: ${q.url()}`);
  await n.close();
}

console.log('hero-video');
{
  const c = await kontext(390); const p = await c.newPage(); const anfragen = [];
  p.on('request', (r) => anfragen.push([r.url().split('/').pop(), Date.now()]));
  await p.goto(basis + 'hero-video/demo.html', { waitUntil: 'load' }); const geladen = Date.now();
  await p.waitForTimeout(3500);
  const film = anfragen.find(([u]) => u === 'film.webm');
  film && film[1] >= geladen - 50 ? gut(`Video erst nach „load“ angefragt (+${film[1] - geladen} ms)`) : melde(`Video: ${JSON.stringify(film)}`);
  let s = await p.evaluate(() => { const v = document.querySelector('.held-video-film'); return v && { spielt: !v.paused, sicht: getComputedStyle(v).opacity, knopf: !document.querySelector('.held-video-knopf').hidden }; });
  s && s.spielt && s.sicht === '1' && s.knopf ? gut('Video spielt, eingeblendet, Pause-Knopf da') : melde(`spielt: ${JSON.stringify(s)}`);
  const lcp = await p.evaluate(() => new Promise((r) => new PerformanceObserver((l) => { const e = l.getEntries().at(-1); r(e.element ? e.element.className || e.element.tagName : e.url); }).observe({ type: 'largest-contentful-paint', buffered: true })));
  /poster/.test(lcp) ? gut(`LCP-Element: ${lcp}`) : melde(`LCP-Element: ${lcp}`);
  await p.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })); await p.waitForTimeout(600);
  s = await p.evaluate(() => document.querySelector('.held-video-film').paused); s ? gut('außerhalb des Bildes pausiert') : melde('läuft außerhalb des Bildes weiter');
  await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(600);
  await p.tap('.held-video-knopf'); await p.waitForTimeout(200);
  s = await p.evaluate(() => [document.querySelector('.held-video-film').paused, document.querySelector('.held-video-knopf').getAttribute('aria-pressed')]);
  s[0] && s[1] === 'true' ? gut('Pause-Knopf hält an (aria-pressed)') : melde(`Knopf: ${s}`);
  await c.close();
  for (const [name, opt, init] of [['reduziert', { reducedMotion: 'reduce' }, null], ['Save-Data', {}, () => Object.defineProperty(navigator, 'connection', { value: { saveData: true } })]]) {
    const d = await kontext(390, opt); const q = await d.newPage(); if (init) await q.addInitScript(init); const a = [];
    q.on('request', (r) => a.push(r.url())); await q.goto(basis + 'hero-video/demo.html', { waitUntil: 'load' }); await q.waitForTimeout(3000);
    a.some((u) => u.endsWith('.webm')) ? melde(`${name}: Video wurde geladen`) : gut(`${name}: kein Video, nur Poster`);
    await d.close();
  }
}

console.log('seitenwechsel');
{
  const c = await kontext(1440); const p = await c.newPage(); await p.goto(basis + 'seitenwechsel/demo.html', { waitUntil: 'networkidle' });
  const regel = await p.evaluate(() => [...document.styleSheets].some((s) => { try { return [...s.cssRules].some((r) => r.cssText.includes('@view-transition') || (r.cssRules && [...r.cssRules].some((x) => x.cssText.includes('@view-transition')))); } catch { return false; } }));
  regel ? gut('@view-transition-Regel aktiv') : melde('@view-transition fehlt');
  await p.click('.uebergang-titel a'); await p.waitForLoadState('networkidle');
  p.url().endsWith('seite-2.html') ? gut('Navigation zur zweiten Seite') : melde(`Navigation: ${p.url()}`);
  await c.close();
}
await b.close();
console.log(probleme ? `\n${probleme} Problem(e).` : `\nAlle Baustein-Demos in Ordnung (${seiten.length} Seiten).`);
process.exit(probleme ? 1 : 0);
