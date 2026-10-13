// Frame-genaue Aufnahme v4 für das Werbevideo „Nachtfahrt“ (Regie 03-regie.md, Abschnitt 3). Basis: cap3.js.
// Aufruf: node cap4.js [ID ...]   (ID = D-A D-B D-C P-A P-B P-C, ohne Angabe alle nacheinander in EINEM Browser)
// Umgebung: URL (Standard http://localhost:8123/), TMP (Einzelbilder, Scratch), META (Ziel für <ID>.marks.json / <ID>.rects.json).
//
// Grundsätze (gegen Ruckeln/Flimmern):
//  - EIN Browser, die Aufnahmen laufen nacheinander, nie parallel und nie aufgeteilt.
//  - Playwright-Uhr (clock.install, danach pauseAt): Seitenzeit steht still und rückt nur pro Bild um 1/60 s vor.
//  - Alle CSS-/Web-Animationen der Dokument-Zeitleiste werden pausiert und pro Bild von uns um 1/60 s vorgestellt
//    (neue Animationen beginnen bei 0, nicht bei einer zufälligen Echtzeit). Scroll-gebundene Animationen (view())
//    hängen am Scrollstand und laufen daher von selbst gleichmäßig.
//  - Das Lampenlicht im Hero (js/held.js, rAF-Lerp) wird gesperrt und hier pro Bild mit derselben Formel gesetzt.
//  - Bilder eager + decode, Schriften geladen; vor dem Start einmal die ganze Seite durchgescrollt (alle Schriften/Bilder warm),
//    danach alle endlichen Animationen auf Endstand (Hero steht fertig).
//  - Ein Screenshot pro Bild (page.screenshot, JPEG q95, Pixel = CSS-Pixel x DSF). Kein Mauszeiger im Bild, Klicks mit Messingring.
//  - Wächter: erscheint der Inhalt von #betreuung (Preise, `#betreuung .huelle`) im Viewport, bricht die Aufnahme ab.
//    (Der obere Innenabstand des Abschnitts, ca. 109 px Desktop / 60 px Handy, ohne Text darf am Bildrand sichtbar sein: Regie-Mitte der Kompass-Einstellung.)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const URL = process.env.URL || 'http://localhost:8123/index.html';
const TMP = process.env.TMP || '/tmp/claude-0/-home-user-website-business/7eb3e817-07c9-5aa5-bd86-e370d0ae475c/scratchpad/aufnahme-tmp';
const META = process.env.META || '/mnt/project-files/seitenkapitaen/video/aufnahme';
const FPS = 60, DT = 1000 / FPS;
const JPEG_Q = 95;

// ---------- Rechtecke, die pro Bild mitgeschrieben werden (Schlüssel -> Selektor / Funktion) ----------
// Wert 'all:' = alle Treffer nummeriert (key.1 ...). Wörter der H1 über Range.
const RECT_DEFS = {
  titel: '#titel',
  held: '.held',
  kopf: '.kopf',
  'cta.kopf': '.kopf .nav .knopf',
  'cta.hero': '.held-aktionen .knopf',
  'cta.leiste': '.handy-leiste .knopf',
  leiste: '.handy-leiste',
  'plakette': 'all:.plaketten .plakette',
  'plakette.icon': 'all:.plaketten .plakette .instrument',
  'plakette.h3': 'all:.plaketten .plakette h3',
  'schritt': 'all:.schritte .schritt',
  'schritt.nr': 'all:.schritte .etappe-nr',
  'schritt.linie': 'all:.schritte .etappe-linie',
  'schritt.h3': 'all:#ablauf h3',
  'reiter.leiste': '.buehne-reiter',
  'reiter.edel': '#reiter-edel', 'reiter.norvak': '#reiter-norvak', 'reiter.glut': '#reiter-glut', 'reiter.laut': '#reiter-laut',
  'werk.edel': '#arbeit-edel', 'werk.norvak': '#arbeit-norvak', 'werk.glut': '#arbeit-glut', 'werk.laut': '#arbeit-laut',
  'musterseite.edel': '#arbeit-edel .werk-nr', 'musterseite.norvak': '#arbeit-norvak .werk-nr',
  'musterseite.glut': '#arbeit-glut .werk-nr', 'musterseite.laut': '#arbeit-laut .werk-nr',
  'musterseite.art.edel': '#arbeit-edel .werk-art', 'musterseite.art.norvak': '#arbeit-norvak .werk-art',
  'musterseite.art.glut': '#arbeit-glut .werk-art', 'musterseite.art.laut': '#arbeit-laut .werk-art',
  zw: '.zwischenbild',
  'zw.bild': '.zwischenbild-bild',
  'zw.satz': '.zwischenbild-satz',
  'zw.dach': '.zwischenbild .ueberzeile',
  't-kontakt': '#t-kontakt',
  kontakt: '#kontakt',
};

// ---------- Skript, das vor jedem Seitenstart in die Seite kommt ----------
const INIT = `(() => {
  try { localStorage.setItem('seitenkapitaen-vorstellung', '1'); } catch (e) {}
  const M = new WeakMap();
  let settled = false;
  const L = { x: null, y: null, tx: 0, ty: 0, t: 0, w0: 0 };
  // Hero-Licht: gleiche Formel wie js/held.js im Leerlauf (Zeiger ruht -> wandert), pro Bild genau ein Schritt
  const light = () => { const h = document.querySelector('.held'); if (!h) return; const r = h.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    if (!L.w0) L.w0 = L.t || 1; const s = L.t - L.w0;
    L.tx = r.width * (.6 + .3 * Math.sin(s / 2600)); L.ty = r.height * (.45 + .22 * Math.sin(s / 1900));
    if (L.x === null) { L.x = r.width * .6; L.y = r.height * .45; }
    L.x += (L.tx - L.x) * .12; L.y += (L.ty - L.y) * .12;
    h.style.setProperty('--licht-x', L.x.toFixed(1) + 'px'); h.style.setProperty('--licht-y', L.y.toFixed(1) + 'px'); };
  // Vor dem Start: endliche Animationen auf Endstand, unendliche am aktuellen Stand anhalten
  window.__settle = () => { syncSL(); for (const a of document.getAnimations()) { if (a.timeline !== document.timeline || SKIP.has(a)) continue;
      try { const et = a.effect.getComputedTiming().endTime; if (isFinite(et)) a.finish(); } catch (e) {}
      try { a.pause(); } catch (e) {} M.set(a, a.currentTime || 0); } settled = true; };
  // Scroll-gebundene Animationen (view(): Einblenden, Linien, Kompass-Gleiten) laufen im Browser teils auf dem Compositor und
  // flackern im Standbild zwischen zwei Werten (Compositor-/Hauptthread-Rundung, 1-Bild-Ausreißer). Darum je eine Spiegel-Animation auf der
  // Dokument-Zeitleiste (pausiert, Stand = Fortschritt des Originals, den wir pro Bild vom Hauptthread lesen), die die Eigenschaft überlagert.
  // Lösung: Original abbrechen, den Fortschritt über eine Sonde (gleiche Zeitleiste/Bereich, harmlose Eigenschaft) lesen und das Ergebnis
  // pro Bild als feste Inline-Werte schreiben (commitStyles). Danach gibt es keine laufende Scroll-Animation mehr, die flackern könnte.
  const SKIP = new WeakSet(), SLS = [];
  const syncSL = () => {
    for (const a of document.getAnimations()) {
      if (a.timeline === document.timeline || SKIP.has(a)) continue;
      const eff = a.effect, tgt = eff && eff.target; if (!tgt) continue;
      const tm = eff.getTiming(), kf = eff.getKeyframes(), pseudo = eff.pseudoElement || undefined;
      const pe = new KeyframeEffect(tgt, [{ '--sl-probe': '0' }, { '--sl-probe': '1' }], { fill: 'both' });
      const probe = new Animation(pe, a.timeline);
      try { probe.rangeStart = a.rangeStart; probe.rangeEnd = a.rangeEnd; } catch (e) {}
      probe.play(); SKIP.add(probe); SKIP.add(a); SLS.push({ tgt, kf, pseudo, easing: tm.easing, pe });
      a.cancel();
    }
    for (const m of SLS) {
      if (!m.tgt.isConnected || m.pseudo) continue;
      const p = m.pe.getComputedTiming().progress;
      const w = m.tgt.animate(m.kf, { duration: 1000, fill: 'both', easing: m.easing }); SKIP.add(w); w.pause();
      try { w.currentTime = (p == null ? 0 : p) * 1000; w.commitStyles(); } catch (e) {}
      w.cancel();
    }
  };
  window.__adv = (dt) => { L.t += dt; syncSL();
    for (const a of document.getAnimations()) { if (a.timeline !== document.timeline || SKIP.has(a)) continue;
      if (!M.has(a)) { M.set(a, 0); try { a.pause(); } catch (e) {} }
      const t = M.get(a) + dt; M.set(a, t); try { a.currentTime = t; } catch (e) {} }
    light(); };
  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.style.scrollBehavior = 'auto';
    const st = document.createElement('style'); st.textContent = 'html{overflow-anchor:none}'; document.head.append(st); // Scrollanker aus: Seitenstand bleibt beim Reiterwechsel
    // Teilpixel-Scroll: Chrome rastet window.scrollTo auf ganze CSS-Pixel (Ruckeln bei langsamer Fahrt). Ganzzahlanteil per scrollTo,
    // der Rest per translate3d auf main/footer (Kopfleiste und feste Leiste bleiben stehen). Ebenen von Anfang an fest eingerichtet.
    for (const e of document.querySelectorAll('main, footer')) { e.style.willChange = 'transform'; e.style.transform = 'translate3d(0,0,0)'; }
    window.__res = 0;
    window.__scroll = (y) => { const f = Math.floor(y), r = y - f; window.scrollTo({ top: f, behavior: 'instant' }); window.__res = r;
      for (const e of document.querySelectorAll('main, footer')) e.style.transform = 'translate3d(0,' + (-r).toFixed(3) + 'px,0)'; };
    for (const i of document.images) { i.loading = 'eager'; i.decoding = 'sync'; }
    const r = document.createElement('div'); r.id = '__r';
    r.style.cssText = 'position:fixed;z-index:2147483646;pointer-events:none;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;border:2px solid rgba(232,196,120,.9);opacity:0;left:-99px;top:-99px';
    document.body.append(r);
    window.__ring = (x, y) => { r.style.left = x + 'px'; r.style.top = y + 'px';
      r.animate([{ opacity: .95, transform: 'scale(.35)' }, { opacity: 0, transform: 'scale(1.25)' }], { duration: 520, easing: 'ease-out' }); };
  });
  // Messung pro Bild: Scrollstand, Wächter, Rechtecke
  const DEFS = ${JSON.stringify(RECT_DEFS)};
  const rc = (e) => { if (!e) return null; const rs = e.getClientRects(); if (!rs.length) return null; const r = e.getBoundingClientRect();
    if (!r.width && !r.height) return null; return [+r.left.toFixed(1), +r.top.toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)]; };
  window.__euro = null;
  window.__probe = () => {
    if (!window.__euro) window.__euro = [...document.querySelectorAll('body *')].filter((e) => !e.closest('script,style,noscript,header,nav') &&
      [...e.childNodes].some((n) => n.nodeType === 3 && /€/.test(n.data)));
    const euro = window.__euro.some((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight; });
    const out = {};
    for (const [k, sel] of Object.entries(DEFS)) {
      if (sel.startsWith('all:')) { [...document.querySelectorAll(sel.slice(4))].forEach((e, i) => { out[k + '.' + (i + 1)] = rc(e); }); }
      else out[k] = rc(document.querySelector(sel));
    }
    const h1 = document.getElementById('titel');
    if (h1) { const w = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT); let n, i = 0;
      while ((n = w.nextNode())) { for (const m of n.data.matchAll(/\\S+/g)) { const g = document.createRange(); g.setStart(n, m.index); g.setEnd(n, m.index + m[0].length);
        const b = g.getBoundingClientRect(); out['titel.wort.' + (++i)] = b.width ? [+b.left.toFixed(1), +b.top.toFixed(1), +b.width.toFixed(1), +b.height.toFixed(1)] : null; } } }
    const bt = document.querySelector('#betreuung .huelle') || document.getElementById('betreuung'); const bb = bt ? bt.getBoundingClientRect() : null;
    return { y: scrollY + (window.__res || 0), euro, bet: bb ? [bb.top, bb.bottom] : null, intro: /intro-(offen|geht)/.test(document.documentElement.className) || (document.getElementById('vorstellung') && getComputedStyle(document.getElementById('vorstellung')).display !== 'none'),
      h: innerHeight, w: innerWidth, dpr: devicePixelRatio, r: out };
  };
})();`;

// ---------- Aufnahmedefinitionen ----------
const sine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
const SHOTS = {
  'D-A': { W: 1600, H: 900, DSF: 1.25, phone: false, run: async (c) => {
    const { p } = c;
    c.mark('hero'); await c.wait(7.0 + 1);
    // lei: erste Plakette
    // Regie: -40 in 1,4 s. Kopfleiste (73 px) läge über Reihe 1, Strecke 1227 px in 1,4 s = 877 px/s > 650 (Regel Desktop): Reihe 1 bei y=86, 2,0 s
    c.mark('lei'); await c.scrollTo((await c.topOf('.plakette')) - 86, 2.0); await c.wait(2.0 + 1);
    c.mark('lei2'); await c.scrollBy(330, 2.2); await c.wait(1.2 + 1);
    c.mark('ablauf'); await c.scrollTo((await c.topOf('#ablauf')) - 40, 1.4); await c.wait(6.0 + 1);
    c.mark('arbeiten'); await c.scrollTo((await c.topOf('#reiter-edel')) - 70, 1.8); c.mark('tab-edel'); await c.wait(1.5 + 1);
    await c.click('#reiter-norvak', 'tab-norvak'); await c.wait(1.5 + 1);
    await c.click('#reiter-glut', 'tab-glut'); await c.wait(1.5 + 1);
    await c.click('#reiter-laut', 'tab-laut'); await c.wait(3.5 + 1);
    c.mark('ende');
  } },
  'D-B': { W: 1600, H: 900, DSF: 1.25, phone: false, run: async (c) => {
    await c.jump((await c.topOf('.zwischenbild')) - 98, 1.0); c.mark('zw'); await c.wait(7.0 + 1); c.mark('ende');
  } },
  'D-C': { W: 1600, H: 900, DSF: 1.25, phone: false, run: async (c) => {
    await c.jump((await c.topOf('#t-kontakt')) - 170, 1.0); c.mark('kontakt'); await c.wait(9.0 + 1); c.mark('ende');
  } },
  // Runde 3 (Elias 13.10. abends): feste Seiten-UI gehört nicht in den Film. Die Handy-Leiste unten ist immer ausgeblendet,
  // die Kopfleiste nach dem Hero (Umschalten in den verworfenen Bildern eines Sprungs). Jedes Thema steht mittig und ganz im Bild
  // (sichtbar 0–580 css-px, Mitte 290). Bildzahlen, Dauern und Marken wie Runde 2, damit der Schnitt unverändert bleibt.
  'P-A': { W: 390, H: 580, DSF: 2.5, phone: true, run: async (c) => {
    const mitte = async (von, bis) => { const a = await c.topOf(von), b = await c.bottomOf(bis || von); return a - (580 - (b - a)) / 2; };
    const pl = (n) => `.plaketten .plakette:nth-child(${n})`;
    c.mark('hero'); await c.wait(7.0 + 1);
    await c.kopf(false);
    await c.jump(await mitte(pl(1)), 0.5); c.mark('lei'); await c.wait(1.6 + 1);
    await c.scrollTo(await mitte(pl(3)), 2.0); c.mark('lei3'); await c.wait(1.0 + 1);
    c.mark('lei2'); await c.scrollTo(await mitte(pl(4)), 1.4); await c.wait(1.5 + 1);
    { const a = await c.topOf('#t-ablauf'), b = await c.bottomOf('.schritte .schritt:nth-child(2)'); console.log('    Ablauf-Spanne', Math.round(b - a)); await c.jump(b - a <= 560 ? a - (580 - (b - a)) / 2 : a - 12, 0.5); } c.mark('ablauf'); await c.wait(0.8 + 1);
    await c.scrollTo(await mitte('.schritte .schritt:nth-child(3)', '.schritte .schritt:nth-child(4)'), 4.4); c.mark('ablauf4'); await c.wait(1.0 + 1);
    // arbeiten: Gerätebild (Musterseite) mittig und ganz im Bild
    await c.jump(await mitte('#arbeit-edel .werk-bild'), 0.5); c.mark('arbeiten'); c.mark('tab-edel'); await c.wait(1.5 + 1);
    for (const t of ['norvak', 'glut', 'laut']) { await c.clickScript('#reiter-' + t, 'tab-' + t); await c.wait((t === 'laut' ? 3.5 : 1.5) + 1); }
    c.mark('ende');
  } },
  'P-B': { W: 390, H: 580, DSF: 2.5, phone: true, run: async (c) => {
    // Kompassbild, Überzeile „Gebaut. Geprüft. Gepflegt.“ und Satz zusammen mittig (561 px)
    await c.kopf(false);
    const a = await c.topOf('.zwischenbild-bild img'), b = await c.bottomOf('.zwischenbild-satz');
    await c.jump(a - (580 - (b - a)) / 2, 1.0); c.mark('zw'); await c.wait(7.0 + 1); c.mark('ende');
  } },
  'P-C': { W: 390, H: 580, DSF: 2.5, phone: true, run: async (c) => {
    await c.kopf(false);
    await c.jump((await c.topOf('.kontakt-text .ueberzeile')) - 40, 1.0); c.mark('kontakt'); await c.wait(9.0 + 1); c.mark('ende');
  } },
};

async function aufnahme(browser, id) {
  const S = SHOTS[id];
  const out = path.join(TMP, id); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
  fs.mkdirSync(META, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: S.W, height: S.H }, deviceScaleFactor: S.DSF, ...(S.phone ? { isMobile: true, hasTouch: true } : {}) });
  await ctx.route('**/js/held.js', (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
  await ctx.addInitScript(INIT);
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', (e) => errors.push(String(e))); p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await p.clock.install({ time: new Date('2026-10-11T10:00:00') });
  await p.goto(URL, { waitUntil: 'load' });
  // Vorlauf in Echtzeit: Bilder eager, ganze Seite einmal durchscrollen (Schriften, Bilder, Beobachter), Reiter durchschalten, zurück an den Anfang
  await p.evaluate(async () => { await document.fonts.ready; });
  await p.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 30000 }).catch(() => {});
  const dbg = async () => {};
  const total = await p.evaluate(() => document.documentElement.scrollHeight);
  await dbg('geladen');
  for (let y = 0; y <= total; y += S.H * 0.6) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(120); }
  await dbg('nach scroll');
  for (const t of ['norvak', 'glut', 'laut', 'edel']) { await p.evaluate((t) => { document.getElementById('reiter-' + t).click(); }, t); await p.waitForTimeout(250); }
  await p.evaluate(async () => { await Promise.all([...document.images].map((i) => i.decode().catch(() => {}))); await document.fonts.ready; });
  // Rückweg in Schritten nach oben: die feste Handy-Leiste (IntersectionObserver auf #kontakt) braucht den Durchgang, sonst bleibt sie nach einem Sprung vom Seitenende ausgeblendet
  for (let y = total; y > 0; y -= S.H * 0.6) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(120); }
  await p.evaluate(() => { for (const e of document.querySelectorAll('.werk--rein')) e.classList.remove('werk--rein'); window.scrollTo(0, 0); });
  await dbg('nach rueckscroll');
  await p.waitForTimeout(2500);
  await dbg('nach 2.5s');
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(500);
  await dbg('vor settle');
  if (S.phone) await p.addStyleTag({ content: '.handy-leiste{display:none!important}.film-ohne-kopf .kopf{visibility:hidden!important}' });
  await p.evaluate(() => window.__settle());
  await dbg('nach settle');
  const now = await p.evaluate(() => Date.now());
  await p.clock.pauseAt(new Date(now + 5000));
  await dbg('nach pause');
  console.log(id, 'Seite', total, 'px hoch; Fehler im Vorlauf:', errors.length);

  let n = 0; const marks = [], events = []; const scrollLog = [];
  const track = {}; // key -> Liste [frame, x,y,w,h | null] (Wert gilt ab frame bis zum nächsten Eintrag)
  const last = {}; const ys = [];
  const mark = (name) => { marks.push({ name, frame: n, sec: +(n / FPS).toFixed(3) }); console.log(`  ${String(n).padStart(5)} ${(n / FPS).toFixed(2).padStart(6)} s  ${name}`); };
  const event = (type, extra) => events.push({ type, frame: n, ...extra });
  const same = (a, b) => (a === null && b === null) || (a && b && a.every((v, i) => Math.abs(v - b[i]) < 0.05));
  let info;
  const frame = async (save = true) => {
    await p.clock.runFor(DT);
    info = await p.evaluate((dt) => { window.__adv(dt); return window.__probe(); }, DT);
    if (info.intro) throw new Error('Overlay/Intro sichtbar (Frame ' + n + ')');
    if (info.euro) throw new Error('Wächter: Eurobetrag im Bild bei Frame ' + n);
    if (info.bet && info.bet[1] > 0 && info.bet[0] < info.h) throw new Error('Wächter: #betreuung (Preise) im Bild bei Frame ' + n + ' (top ' + info.bet[0].toFixed(0) + ', scroll ' + info.y.toFixed(0) + ')');
    if (!save) { await p.screenshot({ type: 'jpeg', quality: 20 }); return; }
    for (const [k, v] of Object.entries(info.r)) {
      if (!(k in last) || !same(last[k], v)) { (track[k] ||= []).push(v ? [n, ...v] : [n, null]); last[k] = v; }
    }
    ys.push(+info.y.toFixed(2));
    const buf = await p.screenshot({ type: 'jpeg', quality: JPEG_Q });
    fs.writeFileSync(path.join(out, String(n).padStart(5, '0') + '.jpg'), buf); n++;
  };
  const wait = async (sec) => { const k = Math.round(sec * FPS); for (let i = 0; i < k; i++) await frame(); };
  const topOf = (s) => p.evaluate((s) => { const e = document.querySelector(s); return e ? e.getBoundingClientRect().top + scrollY + (window.__res || 0) : NaN; }, s);
  const setY = (v) => p.evaluate((v) => window.__scroll(v), v);
  const curY = () => p.evaluate(() => scrollY + (window.__res || 0));
  const scrollTo = async (y, sec) => {
    const y0 = await curY(); const k = Math.round(sec * FPS);
    console.log(`    Scroll ${y0.toFixed(0)} -> ${y.toFixed(0)} = ${(y - y0).toFixed(0)} px in ${sec} s (Ø ${((y - y0) / sec).toFixed(0)} px/s)`);
    scrollLog.push({ frame: n, von: +y0.toFixed(1), nach: +y.toFixed(1), sek: sec, schnitt_px_s: +((y - y0) / sec).toFixed(1) });
    event('scroll', { von: y0, nach: y, dauer: k });
    for (let i = 1; i <= k; i++) { await setY(y0 + (y - y0) * sine(i / k)); await frame(); }
  };
  const scrollBy = async (dy, sec) => scrollTo((await curY()) + dy, sec);
  // Sprung: Position setzen, Einschwingzeit verwerfen (Bilder werden aufgenommen, aber nicht gespeichert)
  const jump = async (y, discard) => {
    console.log(`    Sprung -> ${y.toFixed(0)}, ${discard} s Einschwingen verworfen`);
    await setY(y); const k = Math.round(discard * FPS); for (let i = 0; i < k; i++) await frame(false);
    event('sprung', { nach: y });
  };
  const centre = (s) => p.evaluate((s) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, s);
  // Mausklick (Desktop): Zeiger unsichtbar; hinfahren (Hover), kurz warten, Messingring + Klick im selben Bild
  const click = async (s, name) => {
    const c = await centre(s); await p.mouse.move(c.x, c.y); await wait(0.35);
    await p.evaluate(([x, y]) => window.__ring(x, y), [c.x, c.y]); mark(name); event('klick', { ziel: s });
    await p.mouse.down(); await p.mouse.up(); await frame();
  };
  // Handy: Klick per Skript (Reiter außer Bild); Seitenstand danach so nachführen, dass das Label wieder auf y=Ziel liegt (im Seitenwechsel verdeckt)
  const clickScript = async (s, name, labelSel, labelY) => {
    mark(name); event('tab', { ziel: s });
    await p.evaluate((s) => document.querySelector(s).click(), s);
    if (labelSel) { await frame(false); const dy = await p.evaluate(([sel, ly]) => { const e = document.querySelector(sel); return e ? e.getBoundingClientRect().top - ly : 0; }, [labelSel, labelY]);
      if (Math.abs(dy) > 1) { console.log('    Label-Nachführung', dy.toFixed(1), 'px'); await setY((await curY()) + dy); } }
    await frame();
  };
  const bottomOf = (s) => p.evaluate((s) => { const e = document.querySelector(s); return e ? e.getBoundingClientRect().bottom + scrollY + (window.__res || 0) : NaN; }, s);
  // Kopfleiste ein/aus (nur in verworfenen Bildern eines Sprungs umschalten)
  const kopf = (an) => p.evaluate((an) => document.documentElement.classList.toggle('film-ohne-kopf', !an), an);
  const c = { p, mark, wait, topOf, bottomOf, kopf, scrollTo, scrollBy, jump, click, clickScript, frame };
  try {
    await S.run(c);
  } finally {
    // Teilergebnis immer schreiben (zum Nachsehen bei Abbruch)
    const base = path.join(META, id);
    fs.writeFileSync(base + '.marks.json', JSON.stringify({ id, fps: FPS, frames: n, viewport: { w: S.W, h: S.H, dsf: S.DSF }, marks, events, scroll: scrollLog }, null, 1));
    fs.writeFileSync(base + '.rects.json', JSON.stringify({ id, fps: FPS, frames: n, viewport: { w: S.W, h: S.H, dsf: S.DSF },
      format: 'rects[key] = Liste [frame, x, y, w, h] (CSS-Pixel im Viewport; oder [frame, null] = nicht sichtbar). Der Wert gilt ab frame bis zum nächsten Eintrag.',
      scrollY: ys, rects: track }));
  }
  if (errors.length) console.log('  Seitenfehler:', [...new Set(errors)].slice(0, 5));
  console.log(`${id}: ${n} Bilder = ${(n / FPS).toFixed(2)} s`);
  await ctx.close();
}

(async () => {
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : ['D-A', 'D-B', 'D-C', 'P-A', 'P-B', 'P-C'];
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  try { for (const id of ids) await aufnahme(browser, id); } finally { await browser.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
