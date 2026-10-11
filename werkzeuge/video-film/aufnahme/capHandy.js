// Frame-exact capture of the OQ page: fake clock + paused Web Animations, advanced by exactly 1/60 s per frame.
// Every frame is a screenshot, so nothing stutters regardless of how slow the cloud browser renders.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const OUT = process.argv[2] || 'handy'; fs.mkdirSync(OUT, { recursive: true });
const SH = +(process.env.SHARD||0), NS = +(process.env.NSHARDS||1);
const W = 390, H = 844, DSF = 2, FPS = 60, DT = 1000 / FPS;
const INIT = `(() => {
  const M = new WeakMap();
  window.__adv = (dt) => { for (const a of document.getAnimations()) { if (a.timeline !== document.timeline) continue;
    if (!M.has(a)) { M.set(a, a.currentTime || 0); a.pause(); }
    const t = M.get(a) + dt; M.set(a, t); try { a.currentTime = t; } catch (e) {} } };
  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.style.scrollBehavior = 'auto';
    const c = document.createElement('div'); c.id = '__z';
    c.style.cssText = 'display:none;position:fixed;left:-50px;top:-50px;z-index:2147483647;pointer-events:none;width:26px;height:26px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.5))';
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
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DSF, isMobile: true, hasTouch: true });
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

  const tapEl = async (sel, rest = 300) => { const c = await centre(sel); if (!c) { console.log('miss', sel); return; } await wait(rest);
    await p.evaluate(([x, y]) => window.__ring(x, y), [c.x, c.y]); try { await p.tap(sel, { noWaitAfter: true, timeout: 2500 }); } catch (e) { console.log('tapfail', sel); } await frame(); };
  mark('hero'); await wait(1300);
  mark('menu'); await tapEl('.menue-knopf', 200); await wait(1500); await tapEl('.menue-knopf', 250); await wait(500);
  mark('scroll'); await go('#leistungen', 20, 1200); await wait(700);
  const L = await p.$$eval('.leist', es => es.map(e => Math.round(e.getBoundingClientRect().top + scrollY)));
  await scrollTo(L[1] - 40, 900); await wait(500); await scrollTo(L[3] - 40, 900); await wait(400);
  mark('arbeiten'); await go('#arbeiten', 20, 1000); await wait(400);
  await scrollTo((await topOf('.reiter')) - 70, 600); await tapEl('#reiter-glut', 200); await wait(1100);
  mark('preise'); await go('#betreuung', 20, 1100); await wait(800);
  mark('ende');
  fs.writeFileSync('handy.json', JSON.stringify({ frames: n, marks }));
  await b.close(); return;
  if (SH === 0) fs.writeFileSync(`${OUT}/../marks.json`, JSON.stringify({ fps: FPS, frames: n, marks }, null, 1));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
