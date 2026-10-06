// Seitenskript der Portfolio-Seite. Die Seite funktioniert vollständig ohne JavaScript.
// Menü, Einblenden und Seitenwechsel kommen aus js/bausteine.js (erzeugt von bausteine/einbauen.mjs), der Lichtkegel im Hero aus js/held.js.
(() => {
  // Bühne: Reiter nach dem WAI-Muster „Tabs“ (Pfeiltasten, Pos1/Ende), Anker #arbeit-… öffnet den passenden Reiter
  function buehne() {
    const b = document.querySelector('.buehne');
    const reiter = b ? [...b.querySelectorAll('[role="tab"]')] : [];
    if (!reiter.length) return;
    const tafeln = reiter.map((r) => document.getElementById(r.getAttribute('aria-controls')));
    b.classList.add('buehne--aktiv');
    for (const [i, t] of tafeln.entries()) { t.setAttribute('role', 'tabpanel'); t.setAttribute('aria-labelledby', reiter[i].id); t.tabIndex = -1; }
    const waehle = (i, { fokus = false, rein = true } = {}) => {
      reiter.forEach((r, j) => { r.setAttribute('aria-selected', String(i === j)); r.tabIndex = i === j ? 0 : -1; });
      tafeln.forEach((t, j) => {
        t.hidden = i !== j;
        t.classList.toggle('werk--rein', rein && i === j);
      });
      if (fokus) reiter[i].focus();
      // schmale Reiterleiste: gewählten Reiter seitlich ins Bild holen (nur die Leiste scrollt, nie die Seite)
      if (rein) { const l = reiter[i].parentElement; l.scrollLeft = Math.max(0, reiter[i].offsetLeft - l.offsetLeft - 16); }
    };
    reiter.forEach((r, i) => {
      r.addEventListener('click', () => waehle(i));
      r.addEventListener('keydown', (e) => {
        const n = reiter.length;
        const ziel = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
        if (ziel === undefined) return;
        e.preventDefault();
        waehle(ziel, { fokus: true });
      });
    });
    const ausAnker = () => {
      const i = tafeln.findIndex((t) => `#${t.id}` === location.hash);
      if (i >= 0) { waehle(i, { rein: false }); b.scrollIntoView(); }
    };
    waehle(0, { rein: false });
    ausAnker();
    addEventListener('hashchange', ausAnker);
  }

  // Menü am Computer: Marke gleitet zum Eintrag, der gelesen (Abschnitt in Bildmitte) oder berührt/fokussiert wird
  function menueMarke() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    const links = [...nav.querySelectorAll('a:not(.knopf)')].filter((a) => a.hash && document.querySelector(a.hash));
    if (!links.length) return;
    const marke = document.createElement('span');
    marke.className = 'nav-marke'; marke.setAttribute('aria-hidden', 'true');
    nav.prepend(marke);
    let aktuell = null, ueber = null;
    const setze = () => {
      const ziel = ueber || aktuell;
      if (!ziel || !matchMedia('(min-width: 48rem)').matches) { marke.classList.remove('nav-marke--an'); return; }
      const n = nav.getBoundingClientRect(), r = ziel.getBoundingClientRect();
      marke.style.setProperty('--_x', `${Math.round(r.left - n.left)}px`);
      marke.style.setProperty('--_b', `${Math.round(r.width)}px`);
      marke.classList.add('nav-marke--an');
    };
    for (const a of links) {
      a.addEventListener('pointerenter', () => { ueber = a; setze(); });
      a.addEventListener('pointerleave', () => { ueber = null; setze(); });
      a.addEventListener('focus', () => { ueber = a; setze(); });
      a.addEventListener('blur', () => { ueber = null; setze(); });
    }
    const abschnitte = [...document.querySelectorAll('main > section[id]')];
    const sichtbar = new Map();
    const wahl = () => {
      const oben = abschnitte.filter((sec) => sichtbar.get(sec)).pop();
      aktuell = oben ? links.find((a) => a.hash === `#${oben.id}`) || null : null;
      links.forEach((a) => (a === aktuell ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current')));
      setze();
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((eintraege) => {
        for (const e of eintraege) sichtbar.set(e.target, e.isIntersecting);
        wahl();
      }, { rootMargin: '-45% 0px -50% 0px' });
      abschnitte.forEach((sec) => io.observe(sec));
    }
    addEventListener('resize', setze);
  }

  // Schaubilder (Leistungen, Ablauf): spielen einmal, sobald sie im Bild sind. Ohne Beobachter oder bei
  // „Bewegung reduzieren“ bleibt die Klasse mini-js weg – dann gilt der ruhige Endzustand aus dem CSS.
  function minis() {
    const els = [...document.querySelectorAll('.mini')];
    if (!els.length || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('mini-js');
    const io = new IntersectionObserver((eintraege) => {
      for (const e of eintraege) if (e.isIntersecting) { e.target.classList.add('mini--an'); io.unobserve(e.target); }
    }, { threshold: 0.35 });
    els.forEach((el) => io.observe(el));
  }

  // Leistungskarten: ein weicher Lichtfleck folgt dem Zeiger (nur Maus; Position per setProperty, CSP bleibt streng)
  function kartenLicht() {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    for (const k of document.querySelectorAll('.leist')) {
      k.addEventListener('pointermove', (e) => {
        const r = k.getBoundingClientRect();
        k.style.setProperty('--_mx', `${Math.round(e.clientX - r.left)}px`);
        k.style.setProperty('--_my', `${Math.round(e.clientY - r.top)}px`);
      });
    }
  }

  function start() {
    minis();
    kartenLicht();
    const pruefen = () => document.documentElement.classList.toggle('pruefmodus', location.hash === '#pruefen');
    pruefen();
    addEventListener('hashchange', pruefen);
    menueMarke();
    buehne();
    // Formular: eigene deutsche Meldungen je Feld (statt Browser-Sprechblase), dann doppelte Klicks verhindern
    const meldung = (f) => {
      const v = f.validity;
      if (v.valid) return '';
      if (f.type === 'email' && !v.valueMissing) return 'Diese E-Mail-Adresse scheint nicht zu stimmen.';
      if (f.name === 'name') return 'Bitte geben Sie Ihren Namen an.';
      if (f.type === 'email') return 'Bitte geben Sie Ihre E-Mail-Adresse an.';
      if (v.tooShort) return 'Bitte schreiben Sie ein paar Worte mehr.';
      return 'Bitte schreiben Sie kurz, worum es geht.';
    };
    const zeige = (f) => {
      const text = meldung(f);
      let el = document.getElementById(`${f.id}-fehler`);
      if (!el) {
        el = document.createElement('span');
        el.id = `${f.id}-fehler`; el.className = 'feld-fehler';
        f.insertAdjacentElement('afterend', el);
        f.setAttribute('aria-describedby', el.id);
      }
      el.textContent = text;
      if (text) f.setAttribute('aria-invalid', 'true'); else f.removeAttribute('aria-invalid');
      return !text;
    };
    for (const form of document.querySelectorAll('.formular')) {
      form.noValidate = true;
      const felder = [...form.querySelectorAll('input[required], textarea[required]')];
      for (const f of felder) f.addEventListener('input', () => { if (f.hasAttribute('aria-invalid')) zeige(f); });
      form.addEventListener('submit', (e) => {
        const falsch = felder.filter((f) => !zeige(f));
        if (falsch.length) { e.preventDefault(); falsch[0].focus(); return; }
        const b = form.querySelector('button'); if (b) { b.disabled = true; b.textContent = 'Einen Moment …'; }
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
