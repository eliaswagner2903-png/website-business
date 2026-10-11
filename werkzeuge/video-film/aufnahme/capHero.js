// Frame-exact capture of the OQ page: fake clock + paused Web Animations, advanced by exactly 1/60 s per frame.
// Every frame is a screenshot, so nothing stutters regardless of how slow the cloud browser renders.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const OUT = process.argv[2] || 'hero'; fs.mkdirSync(OUT, { recursive: true });
const SH = +(process.env.SHARD||0), NS = +(process.env.NSHARDS||1);
const W = 1440, H = 900, DSF = 1.5, FPS = 60, DT = 1000 / FPS;
const INIT = `(() => {
  const M = new WeakMap();
  window.__adv = (dt) => { for (const a of document.getAnimations()) { if (a.timeline !== document.timeline) continue;
    if (!M.has(a)) { M.set(a, a.currentTime || 0); a.pause(); }
    const t = M.get(a) + dt; M.set(a, t); try { a.currentTime = t; } catch (e) {} } };
  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.style.scrollBehavior = 'auto';
    const c = document.createElement('div'); c.id = '__z';
    c.style.cssText = 'position:fixed;left:-50px;top:-50px;z-index:2147483647;pointer-events:none;width:26px;height:26px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.5))';
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
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DSF });
  await ctx.addInitScript(INIT);
  const p = await ctx.newPage();
  await p.clock.install({ time: new Date('2026-10-11T10:00:00') });
  await p.goto('http://127.0.0.1:8766/index.html', { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  const cdp = await ctx.newCDPSession(p);
  let n = 0, mx = 980, my = 620; const marks = [];
  const mark = (name) => { marks.push({ name, frame: n }); if (SH === 0) console.log(n, (n / FPS).toFixed(2), name); };
  const frame = async () => { await p.clock.runFor(DT); await p.evaluate(dt => window.__adv(dt), DT);
    if (n % NS === SH) { const r = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 93 }); fs.writeFileSync(`${OUT}/${String(n).padStart(5, '0')}.jpg`, Buffer.from(r.data, 'base64')); } n++; };
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const wait = async ms => { for (let i = 0; i < Math.round(ms / DT); i++) await frame(); };
  const scrollTo = async (y, ms = 1000) => { const y0 = await p.evaluate(() => scrollY); const k = Math.round(ms / DT);
    for (let i = 1; i <= k; i++) { await p.evaluate(v => window.scrollTo(0, v), y0 + (y - y0) * ease(i / k)); await frame(); } };
  const topOf = s => p.evaluate(s => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : 0; }, s);
  const go = async (s, off = 60, ms = 1000) => scrollTo(Math.max(0, (await topOf(s)) - off), ms);
  const move = async (x, y, ms = 600) => { const x0 = mx, y0 = my, k = Math.round(ms / DT);
    for (let i = 1; i <= k; i++) { const e = ease(i / k); mx = x0 + (x - x0) * e; my = y0 + (y - y0) * e; await p.mouse.move(mx, my); await frame(); } };
  const centre = async s => p.evaluate(s => { const e = typeof s === 'string' ? document.querySelector(s) : s; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, s);
  const moveTo = async (s, ms = 600) => { const c = await centre(s); if (c) await move(c.x, c.y, ms); return c; };
  const click = async (s, rest = 350) => { const c = await moveTo(s, 550); if (!c) { console.log('miss', s); return; } await wait(rest);
    await p.evaluate(([x, y]) => window.__ring(x, y), [c.x, c.y]); await p.mouse.down(); await frame(); await p.mouse.up(); await frame(); };
  const type = async (txt, perChar = 55) => { for (const ch of txt) { await p.keyboard.type(ch); await wait(perChar); } };

  await p.mouse.move(mx, my);
  mark('hero'); await wait(1500);
  for (const [x, y, ms, d] of [[1040, 260, 1000, 450], [1290, 190, 1100, 500], [1330, 470, 1100, 500], [1080, 640, 1000, 450], [860, 420, 1000, 400], [1180, 330, 900, 300]]) { await move(x, y, ms); await wait(d); }
  await moveTo('.knopf--arbeiten', 700); await wait(700);
  mark('heroende');
  fs.writeFileSync('hero.json', JSON.stringify({ frames: n }));
  await b.close(); return;
  mark('menu'); await moveTo('#nav li:nth-child(1) a', 650); await wait(450); await moveTo('#nav li:nth-child(2) a', 400); await wait(450);
  await moveTo('#nav li:nth-child(3) a', 400); await wait(350); await move(1100, 640, 500);
  mark('leistungen'); await go('#leistungen', 70, 1100); await wait(1300);
  const leist = await p.$$eval('.leist', es => es.map(e => Math.round(e.getBoundingClientRect().top + scrollY)));
  await scrollTo(leist[0] - 110, 900); await wait(1300);
  await moveTo('.leist:nth-child(3)', 600); await wait(300);
  await scrollTo(leist[2] - 110, 900); await wait(1200);
  await scrollTo(leist[4] - 110, 900); await moveTo('.leist:nth-child(5)', 500); await wait(1000);
  mark('arbeiten'); await go('#arbeiten', 20, 1100); await wait(900);
  await scrollTo((await topOf('.reiter')) - 60, 700); await wait(400);
  await moveTo('.werk--edel .werk-bild', 600); await wait(900);
  mark('tabs');
  for (const id of ['norvak', 'laut', 'glut']) { await click('#reiter-' + id, 300); await wait(1450); }
  await moveTo('.werk--glut .werk-werte', 600); await wait(300);
  await scrollTo((await topOf('.werk--glut .werk-schild')) - 100, 900); await wait(1100);
  mark('ablauf'); await move(1250, 700, 400); await go('#ablauf', 60, 1100); await wait(1900);
  mark('preise'); await go('#betreuung', 40, 1100); await wait(1200);
  await scrollTo((await topOf('.bet-karte')) - 60, 800); await moveTo('#b-abo', 600); await wait(1100);
  mark('fragen'); await go('#fragen', 40, 1100); await wait(400);
  await scrollTo((await topOf('.fragen-liste')) - 120, 500);
  await click('.frage:nth-child(3) summary', 300); await wait(1500);
  await click('.frage:nth-child(1) summary', 250); await wait(1400);
  mark('kontakt'); await go('#kontakt', 40, 1100); await wait(600);
  await scrollTo((await topOf('#kontaktformular')) - 140, 600);
  await click('#k-name', 200); await type('Anna Beispiel', 45);
  await click('#k-email', 150); await type('anna@praxis-beispiel.de', 35);
  await click('#k-nachricht', 150); await type('Wir brauchen eine neue Seite für unsere Praxis.', 32); await wait(500);
  await moveTo('#kontaktformular button[type=submit]', 600); await wait(900);
  mark('fuss'); await scrollTo(await p.evaluate(() => document.documentElement.scrollHeight), 1100); await wait(1400);
  mark('oben'); await move(1200, 700, 300); await scrollTo(0, 1600); await wait(1200);
  mark('ende');
  if (SH === 0) fs.writeFileSync(`${OUT}/../marks.json`, JSON.stringify({ fps: FPS, frames: n, marks }, null, 1));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
