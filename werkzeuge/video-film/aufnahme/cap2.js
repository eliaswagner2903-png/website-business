// Frame-exact capture v2 (2026-10-11, after feedback "light and pages stutter while scrolling").
// One browser only (no shards: separate browsers drifted apart and interleaved frames jumped), the hero light is
// driven here per frame instead of by held.js (its rAF lerp under the fake clock stepped unevenly), images eager.
// MODE=desk (1440x900, mouse) or MODE=phone (390x844, touch). Writes <out>/NNNNN.jpg and <out>.json {frames, marks}.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const MODE = process.env.MODE || 'desk', PHONE = MODE === 'phone';
const OUT = process.argv[2] || (PHONE ? 'phone2' : 'desk2'); fs.mkdirSync(OUT, { recursive: true });
const W = PHONE ? 390 : 1440, H = PHONE ? 844 : 900, FPS = 60, DT = 1000 / FPS;
const INIT = `(() => {
  const M = new WeakMap();
  const L = { x: null, y: null, tx: 0, ty: 0, last: -1e9, t: 0, w0: 0 };
  addEventListener('mousemove', e => { const h = document.querySelector('.held'); if (!h) return; const r = h.getBoundingClientRect();
    L.tx = e.clientX - r.left; L.ty = e.clientY - r.top; L.last = L.t; L.w0 = 0; }, true);
  const light = () => { const h = document.querySelector('.held'); if (!h) return; const r = h.getBoundingClientRect();
    if (r.bottom < 0) return;
    if (L.t - L.last > 2500) { if (!L.w0) L.w0 = L.t; const s = L.t - L.w0;
      L.tx = r.width * (.6 + .3 * Math.sin(s / 2600)); L.ty = r.height * (.45 + .22 * Math.sin(s / 1900)); }
    if (L.x === null) { L.x = r.width * .6; L.y = r.height * .45; }
    L.x += (L.tx - L.x) * .12; L.y += (L.ty - L.y) * .12;
    h.style.setProperty('--licht-x', L.x.toFixed(1) + 'px'); h.style.setProperty('--licht-y', L.y.toFixed(1) + 'px'); };
  window.__adv = (dt) => { L.t += dt;
    for (const a of document.getAnimations()) { if (a.timeline !== document.timeline) continue;
      if (!M.has(a)) { M.set(a, a.currentTime || 0); a.pause(); }
      const t = M.get(a) + dt; M.set(a, t); try { a.currentTime = t; } catch (e) {} }
    light(); };
  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.style.scrollBehavior = 'auto';
    for (const i of document.images) { i.loading = 'eager'; i.decoding = 'sync'; }
    const c = document.createElement('div'); c.id = '__z';
    c.style.cssText = 'position:fixed;left:-50px;top:-50px;z-index:2147483647;pointer-events:none;width:26px;height:26px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.5))${PHONE ? ';display:none' : ''}';
    c.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M4 2l15 11.5-6.6.9 3.9 7.3-2.9 1.5-3.9-7.4L4 20z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>';
    const r = document.createElement('div'); r.id = '__r';
    r.style.cssText = 'position:fixed;z-index:2147483646;pointer-events:none;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;border:2px solid rgba(232,196,120,.9);opacity:0;left:-99px;top:-99px';
    document.body.append(r, c);
    addEventListener('mousemove', e => { c.style.left = (e.clientX - 3) + 'px'; c.style.top = (e.clientY - 2) + 'px'; }, true);
    window.__ring = (x, y) => { r.style.left = x + 'px'; r.style.top = y + 'px'; r.animate([{ opacity: .95, transform: 'scale(.35)' }, { opacity: 0, transform: 'scale(1.25)' }], { duration: 520, easing: 'ease-out' }); };
  });
})();`;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, ...(PHONE ? { isMobile: true, hasTouch: true } : {}) });
  await ctx.route('**/js/held.js', r => r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
  await ctx.addInitScript(INIT);
  const p = await ctx.newPage();
  await p.clock.install({ time: new Date('2026-10-11T10:00:00') });
  await p.goto('http://127.0.0.1:8766/index.html', { waitUntil: 'load' });
  await p.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
  await p.waitForTimeout(500);
  const cdp = await ctx.newCDPSession(p);
  let n = 0, mx = 1000, my = 420; const marks = [];
  const mark = (name) => { marks.push({ name, frame: n }); console.log(n, (n / FPS).toFixed(2), name); };
  const frame = async () => { await p.clock.runFor(DT); await p.evaluate(dt => window.__adv(dt), DT);
    const r = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 93 });
    fs.writeFileSync(`${OUT}/${String(n).padStart(5, '0')}.jpg`, Buffer.from(r.data, 'base64')); n++; };
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const wait = async ms => { for (let i = 0; i < Math.round(ms / DT); i++) await frame(); };
  const scrollTo = async (y, ms = 1000) => { const y0 = await p.evaluate(() => scrollY); const k = Math.round(ms / DT);
    for (let i = 1; i <= k; i++) { await p.evaluate(v => window.scrollTo(0, v), y0 + (y - y0) * ease(i / k)); await frame(); } };
  const topOf = s => p.evaluate(s => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : 0; }, s);
  const go = async (s, off = 60, ms = 1000) => scrollTo(Math.max(0, (await topOf(s)) - off), ms);
  const move = async (x, y, ms = 600) => { const x0 = mx, y0 = my, k = Math.round(ms / DT);
    for (let i = 1; i <= k; i++) { const e = ease(i / k); mx = x0 + (x - x0) * e; my = y0 + (y - y0) * e; await p.mouse.move(mx, my); await frame(); } };
  const centre = s => p.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, s);
  const moveTo = async (s, ms = 600) => { const c = await centre(s); if (c) await move(c.x, c.y, ms); return c; };
  const click = async (s, rest = 300) => { const c = await moveTo(s, 500); if (!c) { console.log('miss', s); return; } await wait(rest);
    await p.evaluate(([x, y]) => window.__ring(x, y), [c.x, c.y]); await p.mouse.down(); await frame(); await p.mouse.up(); await frame(); };
  const tap = async (s, rest = 250) => { const c = await centre(s); if (!c) { console.log('miss', s); return; } await wait(rest);
    await p.evaluate(([x, y]) => window.__ring(x, y), [c.x, c.y]); try { await p.tap(s, { noWaitAfter: true, timeout: 2500 }); } catch (e) { console.log('tapfail', s); } await frame(); };
  const type = async (txt, perChar = 45) => { for (const ch of txt) { await p.keyboard.type(ch); await wait(perChar); } };

  if (!PHONE) {
    await p.mouse.move(mx, my);
    mark('hero'); await wait(500);
    await move(1250, 260, 1100); await move(1180, 620, 1000); await move(880, 330, 1000); await move(1130, 480, 900);
    await moveTo('.knopf--arbeiten', 700); await wait(400);
    mark('leistungen'); await move(1100, 640, 300); await go('#leistungen', 70, 1000); await wait(900);
    const leist = await p.$$eval('.leist', es => es.map(e => Math.round(e.getBoundingClientRect().top + scrollY)));
    await scrollTo(leist[0] - 110, 800); await moveTo('.leist:nth-child(1)', 500); await wait(700);
    await scrollTo(leist[2] - 110, 800); await moveTo('.leist:nth-child(3)', 500); await wait(700);
    mark('arbeiten'); await go('#arbeiten', 20, 1000); await wait(300);
    await scrollTo((await topOf('.reiter')) - 60, 600); await moveTo('.werk--edel .werk-bild', 500); await wait(600);
    mark('tabs'); for (const id of ['norvak', 'glut']) { await click('#reiter-' + id, 250); await wait(1100); }
    mark('preise'); await move(1250, 700, 300); await go('#betreuung', 40, 1000); await wait(400);
    await scrollTo((await topOf('.bet-karte')) - 60, 700); await moveTo('#b-abo', 500); await wait(900);
    mark('kontakt'); await go('#kontakt', 40, 1000); await wait(300);
    await scrollTo((await topOf('#kontaktformular')) - 140, 500);
    await click('#k-name', 150); await type('Anna Beispiel', 40);
    await moveTo('#kontaktformular button[type=submit]', 600); await wait(800);
    mark('ende');
  } else {
    mark('hero'); await wait(1800);
    mark('menu'); await tap('.menue-knopf', 150); await wait(1200); await tap('.menue-knopf', 200); await wait(400);
    mark('leistungen'); await go('#leistungen', 20, 1000); await wait(500);
    const L = await p.$$eval('.leist', es => es.map(e => Math.round(e.getBoundingClientRect().top + scrollY)));
    await scrollTo(L[1] - 40, 800); await wait(500);
    mark('arbeiten'); await go('#arbeiten', 20, 900); await wait(300);
    await scrollTo((await topOf('.reiter')) - 70, 500); await tap('#reiter-glut', 150); await wait(1000);
    mark('preise'); await go('#betreuung', 20, 1000); await wait(700);
    mark('kontakt'); await go('#kontakt', 20, 1000); await wait(800);
    mark('ende');
  }
  fs.writeFileSync(`${OUT}.json`, JSON.stringify({ frames: n, marks }));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
