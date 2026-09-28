// Lindgrund (Demo) – kleines Seitenskript. Ohne JavaScript ist alles sichtbar und bedienbar;
// das Skript ergänzt nur: Einfaden beim Scrollen, Formular-Zustand und die 3D-Uhr (nachgeladen).
function start() {
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)');

  // Einfaden: nur Elemente, die beim ersten Beobachten NICHT im Bild sind, werden versteckt.
  const ein = document.querySelectorAll('[data-ein]');
  if (!ruhig.matches && 'IntersectionObserver' in window && ein.length) {
    const gesehen = new WeakSet();
    const io = new IntersectionObserver((eintraege) => {
      for (const e of eintraege) {
        const el = e.target;
        if (!gesehen.has(el)) { gesehen.add(el); if (e.isIntersecting) { io.unobserve(el); continue; } el.classList.add('ein-wartet'); continue; }
        if (!e.isIntersecting) continue;
        io.unobserve(el);
        const geschw = [...el.parentElement.children].filter((k) => k.hasAttribute('data-ein'));
        el.style.setProperty('--verzug', `${Math.min(geschw.indexOf(el), 5) * 85}ms`);
        el.classList.add('ein-los'); el.classList.remove('ein-wartet');
        el.addEventListener('transitionend', () => { el.classList.remove('ein-los'); el.style.removeProperty('--verzug'); }, { once: true });
      }
    }, { rootMargin: '0px 0px -8% 0px' });
    ein.forEach((el) => io.observe(el));
  }

  // Formular: Doppelklick verhindern, Zustand „wird gesendet“ zeigen
  for (const form of document.querySelectorAll('form.formular')) {
    form.addEventListener('submit', () => {
      const b = form.querySelector('button[type="submit"]');
      if (b) { b.disabled = true; b.textContent = 'Wird gesendet …'; }
    });
  }

  uhr3d(ruhig);
}

// Pixeldichte deckeln: nie über 2, und die Leinwand nie größer als 1100 Pixel – auf kleinen Geräten
// bringt mehr nichts Sichtbares, kostet aber Rechenzeit.
function grenzDpr(breite) { return Math.max(1, Math.min(devicePixelRatio || 1, 2, 1100 / Math.max(breite, 1))); }

// 3D-Uhr: erst nach dem Laden, nur wenn sichtbar, ohne „Bewegung reduzieren“ und ohne „Daten sparen“.
function uhr3d(ruhig) {
  const fig = document.querySelector('[data-uhr]');
  const bild = fig && fig.querySelector('.buehne__bild');
  if (!bild || ruhig.matches || navigator.connection?.saveData) return;

  let gestartet = false, sichtbar = false, sende = null, scrollt = false, ruhe = 0;
  const laufen = () => sende && sende({ typ: 'laufen', an: sichtbar && !scrollt && !document.hidden && !ruhig.matches });
  // Beim Scrollen hält die Uhr kurz still: Scrollen hat Vorrang, danach läuft sie ohne Sprung weiter.
  addEventListener('scroll', () => {
    if (!scrollt) { scrollt = true; laufen(); }
    clearTimeout(ruhe); ruhe = setTimeout(() => { scrollt = false; laufen(); }, 200);
  }, { passive: true });
  const io = new IntersectionObserver(([e]) => { sichtbar = e.isIntersecting; if (sichtbar && bereitZumLaden) los(); laufen(); });
  let bereitZumLaden = false;
  io.observe(bild);
  document.addEventListener('visibilitychange', laufen);
  ruhig.addEventListener?.('change', laufen);

  const nachLaden = () => setTimeout(() => {
    const weiter = () => { bereitZumLaden = true; if (sichtbar) los(); };
    'requestIdleCallback' in window ? requestIdleCallback(weiter, { timeout: 1500 }) : weiter();
  }, 700);
  document.readyState === 'complete' ? nachLaden() : addEventListener('load', nachLaden, { once: true });

  async function los() {
    if (gestartet) return; gestartet = true;
    const r = bild.getBoundingClientRect();
    const opt = { breite: Math.round(r.width), hoehe: Math.round(r.height), dpr: grenzDpr(r.width), messen: location.search.includes('messen') };
    const c = document.createElement('canvas');
    c.className = 'uhr-leinwand'; c.setAttribute('aria-hidden', 'true');
    bild.append(c);
    const melde = (m) => {
      if (m.typ === 'bereit') {
        fig.classList.add('uhr-live');
        c.addEventListener('transitionend', () => fig.classList.add('uhr-fertig'), { once: true });
      } else if (m.typ === 'fps') window.uhrFps = m.wert;
      else if (m.typ === 'fehler') aufgeben();
    };
    const aufgeben = () => { c.remove(); fig.classList.remove('uhr-live', 'uhr-fertig'); sende = null; };
    try {
      if ('transferControlToOffscreen' in c && 'Worker' in window) {
        const w = new Worker('/js/uhr-worker.js');
        const off = c.transferControlToOffscreen();
        w.onmessage = (e) => melde(e.data);
        w.onerror = aufgeben;
        sende = (m) => w.postMessage(m);
        w.postMessage({ typ: 'start', canvas: off, opt, laufen: sichtbar && !document.hidden }, [off]);
      } else {
        const { erstelle } = await import('/js/uhr-haupt.js');
        const s = erstelle(c, opt, melde);
        sende = (m) => { if (m.typ === 'laufen') s.laufen(m.an); else if (m.typ === 'groesse') s.groesse(m.w, m.h, m.dpr); else if (m.typ === 'zeiger') s.zeiger(m.x, m.y); };
        laufen();
      }
    } catch { aufgeben(); return; }

    // Größe folgt dem Rahmen (Drehen des Handys, Fenster ändern)
    new ResizeObserver(([e]) => {
      const { width: w, height: h } = e.contentRect;
      if (sende && w && (Math.round(w) !== opt.breite)) { opt.breite = Math.round(w); sende({ typ: 'groesse', w: Math.round(w), h: Math.round(h), dpr: grenzDpr(w) }); }
    }).observe(bild);

    // Zeiger-Reaktion nur mit feinem Zeiger (Maus), gedämpft in der Szene
    if (matchMedia('(pointer: fine)').matches) {
      const held = fig.closest('.held') || fig; let x = 0, y = 0, geplant = false;
      held.addEventListener('pointermove', (e) => {
        x = (e.clientX / innerWidth) * 2 - 1; y = (e.clientY / innerHeight) * 2 - 1;
        if (!geplant) { geplant = true; requestAnimationFrame(() => { geplant = false; sende && sende({ typ: 'zeiger', x, y }); }); }
      });
      held.addEventListener('pointerleave', () => sende && sende({ typ: 'zeiger', x: 0, y: 0 }));
    }
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
