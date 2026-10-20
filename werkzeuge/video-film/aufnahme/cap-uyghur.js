// Frame-genaue Aufnahme für den Werbefilm UYGHUR HAUS (A-118). Basis: cap4.js („Nachtfahrt“), gleiche Grundsätze:
// EIN Browser, Playwright-Uhr (pro Bild 1/60 s), alle Dokument-Animationen pausiert und von uns vorgestellt, Teilpixel-Scroll,
// ein Screenshot pro Bild, Klicks mit Goldring statt Mauszeiger.
// Aufruf: node cap-uyghur.js [ID ...]   (D-START D-KARTE D-RES D-BESUCH P-START P-KARTE P-RES P-BESUCH; ohne Angabe alle)
// Umgebung: BASE (Seite, Standard http://127.0.0.1:8771/), TMP (Einzelbilder), META (Ziel für <ID>.marks.json / <ID>.rects.json),
//           PLAN (JSON mit Haltezeiten in s und der Wok-Phase wokT0 in ms; fehlt er, gelten die Vorgaben unten).
//
// Besonderheiten dieser Seite:
//  - Wok-Animation im Hero (6 s Schleife, CSS): alle unendlichen Animationen starten bei currentTime = wokT0, damit der Film
//    die Phase kennt (Übergabe von der großen Wok-Zeichnung im Vorspann auf die Startseite).
//  - Platzhalter (Telefon/E-Mail) sind für den Film ausgeblendet; das Halal-Siegel darf nie ins Bild (Wächter bricht ab).
//  - Seiteneigenes weiches Scrollen (reservierung.js ruft scrollTo mit behavior 'smooth') wird abgefangen und hier als
//    gleichmäßige Fahrt nachgespielt, sonst springt das Bild.
//  - Kategorie-Leiste der Speisekarte klebt oben: beim Teilpixel-Scroll wird sie gegengeschoben (sonst zittert sie um < 1 px).
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.env.BASE || 'http://127.0.0.1:8771/';
const TMP = process.env.TMP || '/tmp/claude-0/-home-user/f52310a3-f0fe-50b5-9470-5811c1d82ed8/scratchpad/uh/aufnahme';
const META = process.env.META || '/mnt/project-files/vertrieb/uyghur-haus/video/aufnahme';
const PLAN = Object.assign({
  wokT0: 0, // ms: Stand der Wok-Schleife im ersten gespeicherten Bild jeder Startseiten-Aufnahme
  hero: 10, hero2: 3, ueber: 9, karte: 2.2, karteHero: 3, filter: 2.5, empfehlung: 2.5, teilen: 4, tee: 3.5,
  res: 2.3, schritt: 1.4, danke: 4.5, besuch: 9, besuchHover: 3.0,
  // Fahrten (s) und kurze Halte; Vorgaben = bisherige feste Werte. ton/zeitleiste-uyghur.py schreibt sie passend zur Stimme.
  fUeber: 1.6, fTeaser: 1.4, teaserHalt: 1.0, fChips: 1.2, chipsHalt: 1.2, filterAuf: 0.9, fEmpf: 2.2, fTeilen: 2.6, fTee: 1.6,
  fRes: 1.2, kalHalt: 0.6, tapWarten: 0.35, resWarten: 0.35,
  // Handy: ohne Hover-Warten liefe der nächste Tipp mitten in den Schrittwechsel (≈ 0,3 s) – daher länger stehen lassen
  schrittHandy: 0.45,
}, process.env.PLAN ? JSON.parse(fs.readFileSync(process.env.PLAN, 'utf8')) : {});
// Heute = Montag, 2. November 2026, 10:00 (Berlin): Kalender zeigt einen ganzen Monat mit Beispielbelegung
const HEUTE = new Date('2026-11-02T10:00:00+01:00');
const FPS = 60, DT = 1000 / FPS;
const JPEG_Q = 95;

// Rechtecke, die pro Bild mitgeschrieben werden ('all:' = alle Treffer nummeriert). Gilt für alle Seiten; fehlt ein Element, steht null.
const RECT_DEFS = {
  kopf: '.site-header', wok: '.wok-art', hero: '.hero', wortmarke: '.hero #h1', tagline: '.tagline',
  'ueber.kopf': '.sec-ueber .sec-head', 'ueber.text': '.about-text', 'ueber.bild': '.about-img',
  'teaser.kopf': '.sec-teaser .sec-head', karte: 'all:.sec-teaser .dish-card', 'teaser.knopf': '.sec-teaser .btn',
  'besuch.kopf': '.sec-visit .sec-head', 'besuch.karten': 'all:.sec-visit .card', zeiten: '.sec-visit .hours', adresse: '.sec-visit address', route: '.sec-visit .btn',
  'menu.titel': '.menu-head h1', chips: '.chips', chip: 'all:.chips a', filter: 'details.filter', 'filter.status': '.filter-status',
  g3: '#gericht-3', g4: '#gericht-4', g5: '#gericht-5', 'g5.rec': '#gericht-5 .rec', 'g5.thumb': '#gericht-5 .thumb',
  g20: '#gericht-20', 'g20.port': '#gericht-20 .portion', 'g20.preis': '#gericht-20 .dish-head .price', g21: '#gericht-21', 'g21.meta': '#gericht-21 .meta', g23: '#gericht-23',
  'tee.kopf': '.more-h', tee: '.more li:first-child',
  'res.titel': '.h1-plain', 'res.karte': '#res-card', 'res.danke': '#s6-h', 'res.sum': '#sum',
};
// Wörter im ersten Absatz „Über uns“ (Range-Rechtecke) für die Hervorhebung im Takt der Stimme
const WORDS = { 'w.seide': 'Seidenstraße', 'w.lamm': 'Lamm', 'w.rind': 'Rind', 'w.kreuz': 'Kreuzkümmel', 'w.chili': 'Chili' };

const INIT = (wokT0) => `(() => {
  const M = new WeakMap();
  window.__settle = () => { for (const a of document.getAnimations()) { if (a.timeline !== document.timeline) continue;
      let et = Infinity; try { et = a.effect.getComputedTiming().endTime; } catch (e) {}
      if (isFinite(et)) { try { a.finish(); } catch (e) {} try { a.pause(); } catch (e) {} M.set(a, a.currentTime || 0); continue; }
      try { a.pause(); a.currentTime = ${wokT0}; } catch (e) {} M.set(a, ${wokT0}); } };
  window.__adv = (dt) => { for (const a of document.getAnimations()) { if (a.timeline !== document.timeline) continue;
      if (!M.has(a)) { M.set(a, 0); try { a.pause(); } catch (e) {} }
      const t = M.get(a) + dt; M.set(a, t); try { a.currentTime = t; } catch (e) {} } };
  // Weiches Scrollen der Seite abfangen: Ziel merken, die Aufnahme fährt es selbst
  window.__want = null;
  const st0 = window.scrollTo.bind(window);
  window.scrollTo = function (a, b) { if (a && typeof a === 'object' && a.behavior === 'smooth') { window.__want = a.top; return; } return st0(a, b); };
  document.addEventListener('click', (e) => { const a = e.target.closest && e.target.closest('.chips a'); if (a) e.preventDefault(); }, true);
  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.style.scrollBehavior = 'auto';
    const st = document.createElement('style');
    st.textContent = 'html{overflow-anchor:none;scroll-behavior:auto!important}.placeholder{display:none!important}*{caret-color:transparent}';
    document.head.append(st);
    for (const e of document.querySelectorAll('main, footer')) { e.style.willChange = 'transform'; e.style.transform = 'translate3d(0,0,0)'; }
    const chips = document.querySelector('.chips'), mh = document.querySelector('.menu-hero');
    window.__res = 0;
    window.__scroll = (y) => { const f = Math.floor(y), r = y - f; st0({ top: f, behavior: 'instant' }); window.__res = r;
      for (const e of document.querySelectorAll('main, footer')) e.style.transform = 'translate3d(0,' + (-r).toFixed(3) + 'px,0)';
      if (chips && mh) { const nat = mh.getBoundingClientRect().bottom + r; chips.style.transform = nat <= 0.5 ? 'translate3d(0,' + r.toFixed(3) + 'px,0)' : ''; } };
    for (const i of document.images) { i.loading = 'eager'; i.decoding = 'sync'; }
    const r = document.createElement('div'); r.id = '__r';
    r.style.cssText = 'position:fixed;z-index:2147483646;pointer-events:none;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;border:2px solid rgba(242,210,122,.92);opacity:0;left:-99px;top:-99px';
    document.body.append(r);
    window.__ring = (x, y) => { r.style.left = x + 'px'; r.style.top = y + 'px';
      r.animate([{ opacity: .95, transform: 'scale(.35)' }, { opacity: 0, transform: 'scale(1.25)' }], { duration: 520, easing: 'ease-out' }); };
  });
  const DEFS = ${JSON.stringify(RECT_DEFS)}, WORDS = ${JSON.stringify(WORDS)};
  const rc = (e) => { if (!e) return null; if (!e.getClientRects().length) return null; const r = e.getBoundingClientRect();
    if (!r.width && !r.height) return null; return [+r.left.toFixed(1), +r.top.toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)]; };
  const wortRect = (p, w) => { const tw = document.createTreeWalker(p, NodeFilter.SHOW_TEXT); let n;
    while ((n = tw.nextNode())) { const m = new RegExp('(^|[^\\\\p{L}])(' + w + ')(?![\\\\p{L}])', 'u').exec(n.data);
      if (m) { const g = document.createRange(); const i = m.index + m[1].length; g.setStart(n, i); g.setEnd(n, i + w.length);
        const b = g.getBoundingClientRect(); return b.width ? [+b.left.toFixed(1), +b.top.toFixed(1), +b.width.toFixed(1), +b.height.toFixed(1)] : null; } }
    return null; };
  window.__probe = () => {
    const out = {};
    for (const [k, sel] of Object.entries(DEFS)) {
      if (sel.startsWith('all:')) [...document.querySelectorAll(sel.slice(4))].forEach((e, i) => { out[k + '.' + (i + 1)] = rc(e); });
      else out[k] = rc(document.querySelector(sel));
    }
    const p1 = document.querySelector('.about-text p');
    if (p1) for (const [k, w] of Object.entries(WORDS)) out[k] = wortRect(p1, w);
    const im = (e) => { if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < innerHeight; };
    const ph = [...document.querySelectorAll('.placeholder')].some((e) => getComputedStyle(e).display !== 'none' && im(e));
    return { y: scrollY + (window.__res || 0), halal: im(document.querySelector('.halal-seal')), ph, want: window.__want, h: innerHeight, w: innerWidth, r: out };
  };
})();`;

// ---------- Aufnahmen ----------
const sine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
const D = { W: 1600, H: 900, DSF: 1.25, phone: false };
const P = { W: 390, H: 580, DSF: 2.5, phone: true };
const MAX = 'max.mustermann@example.com';

// Reservierung (beide Formate): Samstag 7.11., 12:30, 4 Personen, Familienfeier
const reservieren = async (c, S) => {
  const H = S.H;
  await c.goTop((await c.topOf('.sec-head')) - (S.phone ? 24 : 40));
  c.mark('res'); await c.wait(PLAN.res);
  // Karte ganz ins Bild (oben 12 px), Kalender vollständig sichtbar
  c.mark('res.fahrt'); await c.scrollTo((await c.topOf('#res-card')) - 12, PLAN.fRes); c.mark('kalender');
  await c.wait(PLAN.kalHalt);
  const w = { warten: PLAN.resWarten }, schritt = S.phone ? Math.max(PLAN.schritt, PLAN.schrittHandy) : PLAN.schritt;
  await c.tap('.day[data-date="2026-11-07"]', 'tag', w); await c.wait(schritt);
  const slot = await c.p.evaluate(() => ['12:30', '13:00', '12:00', '13:30'].find((t) => { const b = document.querySelector(`.slot[data-t="${t}"]`); return b && b.getAttribute('aria-disabled') !== 'true'; }));
  console.log('    Uhrzeit', slot);
  await c.tap(`.slot[data-t="${slot}"]`, 'uhrzeit', w); await c.wait(schritt);
  await c.tap('.pbtn[data-n="4"]', 'personen', w); await c.wait(schritt);
  await c.tap('#name', 'kontakt', w); await c.type('Max Mustermann');
  await c.tap('#telefon', 'telefon', w); await c.type('0123 4567890');
  await c.tap('#email', 'email', w); await c.type(MAX, 2); await c.wait(0.2);
  await c.tap('.step[data-step="4"] button[type="submit"]', 'weiter', w); await c.wait(0.5);
  await c.tap('label[for="anlass-2"]', 'anlass', w); await c.wait(0.3);
  await c.tap('label[for="einwilligung"]', 'einwilligung', { x: 0.06, ...w }); await c.wait(0.3);
  await c.tap('#senden', 'senden', w); await c.wait(PLAN.danke);
  c.mark('ende');
};

const SHOTS = {
  'D-START': { ...D, url: 'index.html', start: true, run: async (c) => {
    c.mark('hero'); await c.wait(PLAN.hero);
    c.mark('ueber.fahrt'); await c.scrollTo((await c.topOf('.sec-ueber .sec-head')) - 64, PLAN.fUeber); c.mark('ueber'); await c.wait(PLAN.ueber);
    { const a = await c.topOf('.sec-teaser .sec-head'), b = await c.bottomOf('.sec-teaser .btn');
      c.mark('teaser.fahrt'); await c.scrollTo(a - (D.H - (b - a)) / 2, PLAN.fTeaser); c.mark('teaser'); await c.wait(PLAN.teaserHalt); }
    for (let i = 1; i <= 4; i++) { await c.hover(`.sec-teaser .dish-card:nth-child(${i})`, 'karte.' + i); await c.wait(PLAN.karte); }
    await c.tap('.sec-teaser .btn', 'klick.karte'); await c.wait(1.0);
    c.mark('ende');
  } },
  'P-START': { ...P, url: 'index.html', start: true, run: async (c) => {
    c.mark('hero'); await c.wait(PLAN.hero);
    // kleine Fahrt: Kopfleiste raus, Wok oben, Wortmarke darunter
    if (PLAN.hero2 > 0) { c.mark('hero2.fahrt'); await c.scrollTo(await c.topOf('.wok-art'), 1.0); c.mark('hero2'); await c.wait(PLAN.hero2); }
    c.mark('ueber.fahrt'); await c.scrollTo((await c.topOf('.sec-ueber .sec-head')) - 24, PLAN.fUeber); c.mark('ueber'); await c.wait(PLAN.ueber);
    c.mark('teaser.fahrt'); await c.scrollTo((await c.topOf('.sec-teaser .sec-head')) - 16, PLAN.fTeaser); c.mark('teaser'); await c.wait(PLAN.teaserHalt);
    for (let i = 1; i <= 4; i++) {
      const s = `.sec-teaser .dish-card:nth-child(${i})`;
      if ((await c.bottomOf(s)) - (await c.curY()) > P.H - 16) { await c.scrollTo((await c.bottomOf(s)) - (P.H - 16), 0.6); }
      c.mark('karte.' + i); await c.wait(PLAN.karte);
    }
    await c.ensure('.sec-teaser .btn', 0.6);
    await c.tap('.sec-teaser .btn', 'klick.karte'); await c.wait(1.0);
    c.mark('ende');
  } },
  'D-KARTE': { ...D, url: 'speisekarte.html', run: async (c) => karte(c, D) },
  'P-KARTE': { ...P, url: 'speisekarte.html', run: async (c) => karte(c, P) },
  'D-RES': { ...D, url: 'reservierung.html', run: async (c) => reservieren(c, D) },
  'P-RES': { ...P, url: 'reservierung.html', run: async (c) => reservieren(c, P) },
  'D-BESUCH': { ...D, url: 'index.html', run: async (c) => {
    const a = await c.topOf('.sec-visit .sec-head'), b = await c.bottomOf('.sec-visit .cards');
    await c.goTop(a - (D.H - (b - a)) / 2);
    c.mark('besuch'); await c.wait(PLAN.besuchHover);
    await c.hover('.sec-visit .btn', 'route'); await c.wait(PLAN.besuch - PLAN.besuchHover);
    c.mark('ende');
  } },
  'P-BESUCH': { ...P, url: 'index.html', run: async (c) => {
    const a = await c.topOf('.sec-visit .sec-head'), b = await c.bottomOf('.sec-visit .cards');
    await c.goTop(b - a <= P.H - 24 ? a - (P.H - (b - a)) / 2 : (await c.topOf('#besuch')) - 16);
    c.mark('besuch'); await c.wait(PLAN.besuch); c.mark('ende');
  } },
};

// Speisekarte (beide Formate): Titel, Leiste klebt, Allergen-Filter (F = Soja blendet 4 Gerichte aus), Empfehlung, Teilen, Tee
async function karte(c, S) {
  const chipsH = await c.p.evaluate(() => document.querySelector('.chips').getBoundingClientRect().height);
  const unter = (sel, abstand) => c.topOf(sel).then((t) => t - chipsH - abstand);
  c.mark('karte'); await c.wait(PLAN.karteHero);
  const nat = await c.p.evaluate(() => document.querySelector('.menu-hero').getBoundingClientRect().bottom + scrollY);
  c.mark('chips.fahrt'); await c.scrollTo(nat, PLAN.fChips); c.mark('chips'); await c.wait(PLAN.chipsHalt);
  await c.tap('.filter summary', 'filter.auf'); await c.wait(PLAN.filterAuf);
  await c.ensure('.filter-opts label:nth-child(6)', 0.5);
  await c.tap('.filter-opts label:nth-child(6)', 'filter.F', { x: 0.08 }); await c.wait(PLAN.filter);
  c.mark('empfehlung.fahrt'); await c.scrollTo(await unter('#gericht-5', S.phone ? 16 : 120), PLAN.fEmpf); c.mark('empfehlung'); await c.wait(PLAN.empfehlung);
  c.mark('teilen.fahrt'); await c.scrollTo(await unter('#gericht-20', S.phone ? 12 : 60), PLAN.fTeilen); c.mark('teilen'); await c.wait(PLAN.teilen);
  await c.chipSichtbar('#getraenke');
  await c.tap('.chips a[href="#getraenke"]', 'chip.getraenke');
  c.mark('tee.fahrt'); await c.scrollTo(await unter('.more-h', S.phone ? 120 : 220), PLAN.fTee); c.mark('tee'); await c.wait(PLAN.tee);
  c.mark('ende');
}

async function aufnahme(browser, id) {
  const S = SHOTS[id];
  const out = path.join(TMP, id); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
  fs.mkdirSync(META, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: S.W, height: S.H }, deviceScaleFactor: S.DSF, timezoneId: 'Europe/Berlin', locale: 'de-DE',
    ...(S.phone ? { isMobile: true, hasTouch: true } : {}) });
  await ctx.addInitScript(INIT(S.start ? PLAN.wokT0 : 0));
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', (e) => errors.push(String(e))); p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await p.clock.install({ time: HEUTE });
  await p.goto(BASE + S.url, { waitUntil: 'load' });
  // Vorlauf in Echtzeit: Schriften, Bilder (eager + decode), einmal ganz durchscrollen, zurück nach oben
  await p.evaluate(async () => { await document.fonts.ready; });
  await p.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 30000 }).catch(() => {});
  const total = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= total; y += S.H * 0.6) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(100); }
  await p.evaluate(async () => { await Promise.all([...document.images].map((i) => i.decode().catch(() => {}))); await document.fonts.ready; window.scrollTo(0, 0); });
  await p.waitForTimeout(800);
  if (!S.phone) await p.mouse.move(S.W - 3, S.H - 3); // Zeiger in eine ruhige Ecke (kein Hover im Bild)
  await p.evaluate(() => window.__settle());
  const now = await p.evaluate(() => Date.now());
  await p.clock.pauseAt(new Date(now + 5000));
  console.log(id, 'Seite', total, 'px hoch; Fehler im Vorlauf:', errors.length);

  let n = 0; const marks = [], events = [], scrollLog = [];
  const track = {}, last = {}, ys = [];
  const mark = (name) => { marks.push({ name, frame: n, sec: +(n / FPS).toFixed(3) }); console.log(`  ${String(n).padStart(5)} ${(n / FPS).toFixed(2).padStart(6)} s  ${name}`); };
  const event = (type, extra) => events.push({ type, frame: n, ...extra });
  const same = (a, b) => (a === null && b === null) || (a && b && a.every((v, i) => Math.abs(v - b[i]) < 0.05));
  let info;
  const frame = async (save = true) => {
    await p.clock.runFor(DT);
    info = await p.evaluate((dt) => { window.__adv(dt); return window.__probe(); }, DT);
    if (info.halal) throw new Error('Wächter: Halal-Siegel im Bild bei Frame ' + n);
    if (info.ph) throw new Error('Wächter: Platzhalter im Bild bei Frame ' + n);
    if (!save) { await p.screenshot({ type: 'jpeg', quality: 20 }); return; }
    for (const [k, v] of Object.entries(info.r)) if (!(k in last) || !same(last[k], v)) { (track[k] ||= []).push(v ? [n, ...v] : [n, null]); last[k] = v; }
    ys.push(+info.y.toFixed(2));
    const buf = await p.screenshot({ type: 'jpeg', quality: JPEG_Q });
    fs.writeFileSync(path.join(out, String(n).padStart(5, '0') + '.jpg'), buf); n++;
  };
  const wait = async (sec) => { const k = Math.round(sec * FPS); for (let i = 0; i < k; i++) await frame(); };
  const topOf = (s) => p.evaluate((s) => { const e = document.querySelector(s); return e ? e.getBoundingClientRect().top + scrollY + (window.__res || 0) : NaN; }, s);
  const bottomOf = (s) => p.evaluate((s) => { const e = document.querySelector(s); return e ? e.getBoundingClientRect().bottom + scrollY + (window.__res || 0) : NaN; }, s);
  const setY = (v) => p.evaluate((v) => window.__scroll(v), v);
  const curY = () => p.evaluate(() => scrollY + (window.__res || 0));
  const maxY = () => p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const scrollTo = async (y, sec) => {
    y = Math.max(0, Math.min(await maxY(), y));
    const y0 = await curY(); const k = Math.max(1, Math.round(sec * FPS));
    console.log(`    Scroll ${y0.toFixed(0)} -> ${y.toFixed(0)} = ${(y - y0).toFixed(0)} px in ${sec} s (Ø ${((y - y0) / sec).toFixed(0)} px/s)`);
    scrollLog.push({ frame: n, von: +y0.toFixed(1), nach: +y.toFixed(1), sek: sec });
    event('scroll', { von: y0, nach: y, dauer: k });
    for (let i = 1; i <= k; i++) { await setY(y0 + (y - y0) * sine(i / k)); await frame(); }
  };
  // Startstand ohne Fahrt (vor dem ersten gespeicherten Bild; die Seite steht dort schon still)
  const goTop = async (y) => { await setY(Math.max(0, y)); for (let i = 0; i < 30; i++) await frame(false); console.log(`    Start bei ${y.toFixed(0)}`); };
  const centre = (s, fx = 0.5) => p.evaluate(([s, fx]) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return { x: r.left + r.width * fx, y: r.top + r.height / 2 }; }, [s, fx]);
  // Element ganz ins Bild holen (weiche Fahrt), falls es unten oder oben herausragt
  const ensure = async (s, sec = 0.5) => {
    const r = await p.evaluate((s) => { const b = document.querySelector(s).getBoundingClientRect(); return [b.top, b.bottom]; }, s);
    if (r[1] > S.H - 24) await scrollTo((await curY()) + r[1] - (S.H - 24), sec);
    else if (r[0] < 12) await scrollTo((await curY()) + r[0] - 12, sec);
  };
  // Seite wollte weich scrollen (reservierung.js): hier gleichmäßig nachfahren
  const folge = async () => { if (info && info.want != null) { const t = info.want; await p.evaluate(() => { window.__want = null; }); await scrollTo(t, 0.5); } };
  // Klick/Tipp: Desktop Zeiger hin (Hover), kurz warten, Goldring + Klick im selben Bild; Handy Ring + Klick per Skript
  const tap = async (s, name, o = {}) => {
    await ensure(s);
    const c = await centre(s, o.x ?? 0.5);
    if (!S.phone) { await p.mouse.move(c.x, c.y); await wait(o.warten ?? PLAN.tapWarten); }
    await p.evaluate(([x, y]) => window.__ring(x, y), [c.x, c.y]); mark(name); event('klick', { ziel: s });
    if (!S.phone) { await p.mouse.down(); await p.mouse.up(); } else await p.evaluate((s) => { const e = document.querySelector(s); if (e.focus) e.focus({ preventScroll: true }); e.click(); }, s);
    await frame(); await folge();
  };
  const hover = async (s, name) => { const c = await centre(s); await p.mouse.move(c.x, c.y); mark(name); event('hover', { ziel: s }); await frame(); };
  // Tippen: pro Bild `proBild` Zeichen
  const type = async (text, proBild = 1) => { for (let i = 0; i < text.length; i += proBild) { await p.keyboard.insertText(text.slice(i, i + proBild)); await frame(); } };
  // Handy: Kategorie-Chip waagrecht ins Bild holen (die Leiste scrollt seitlich)
  const chipSichtbar = (hash) => p.evaluate((h) => { const a = document.querySelector(`.chips a[href="${h}"]`), ul = a.closest('ul'); const r = a.getBoundingClientRect();
    if (r.right > innerWidth - 8 || r.left < 8) ul.scrollLeft += r.left - (innerWidth - r.width) / 2; }, hash);
  const c = { p, mark, wait, topOf, bottomOf, curY, scrollTo, goTop, ensure, tap, hover, type, chipSichtbar, frame };
  try {
    await S.run(c);
  } finally {
    const base = path.join(META, id);
    fs.writeFileSync(base + '.marks.json', JSON.stringify({ id, url: S.url, fps: FPS, frames: n, plan: PLAN, viewport: { w: S.W, h: S.H, dsf: S.DSF }, marks, events, scroll: scrollLog }, null, 1));
    fs.writeFileSync(base + '.rects.json', JSON.stringify({ id, fps: FPS, frames: n, viewport: { w: S.W, h: S.H, dsf: S.DSF },
      format: 'rects[key] = Liste [frame, x, y, w, h] (CSS-Pixel im Viewport; oder [frame, null] = nicht sichtbar). Der Wert gilt ab frame bis zum nächsten Eintrag.',
      scrollY: ys, rects: track }));
  }
  if (errors.length) console.log('  Seitenfehler:', [...new Set(errors)].slice(0, 5));
  console.log(`${id}: ${n} Bilder = ${(n / FPS).toFixed(2)} s`);
  await ctx.close();
}

(async () => {
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : ['D-START', 'D-KARTE', 'D-RES', 'D-BESUCH', 'P-START', 'P-KARTE', 'P-RES', 'P-BESUCH'];
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  try { for (const id of ids) await aufnahme(browser, id); } finally { await browser.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
