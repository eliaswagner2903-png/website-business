// Bewegungs-Kapitel der Startseite (Relaunch 19.11.2026). Nur eigene Datei, keine Bibliothek.
// Ohne dieses Skript oder bei „Bewegung reduzieren“ bleibt alles ruhig und vollständig sichtbar (kein html.kino).
(() => {
  const start = () => {
    if (window.__kinoAb) window.__kinoAb(); // erneuter Start (z. B. Vorschau-Router): alte Handler entfernen
    const wurzel = document.documentElement;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { initHelfer(); return; }
    wurzel.classList.add('kino');
    const klemm = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
    const weich = (t) => t * t * (3 - 2 * t);

    // ---------- 1. Hero: Beschlag abziehen ----------
    const hero = document.querySelector('.kh');
    const bild = hero && hero.querySelector('.kh-foto');
    let heroP = 0; // vom Scrollen (Computer) oder vom Ziehen
    let heroIntro = 0; // kleiner Auto-Zug nach dem Laden
    let heroZiehen = 0; // Handy/Zeiger
    const pin = () => matchMedia('(min-width: 64rem)').matches;
    const griff = hero && hero.querySelector('.kh-griff');
    if (hero) {
      const t0 = performance.now() + 700;
      const intro = (jetzt) => {
        const t = klemm((jetzt - t0) / 1600);
        heroIntro = (pin() ? 0.2 : 0.0) * weich(t);
        if (t < 1) requestAnimationFrame(intro);
        zeichnen();
      };
      requestAnimationFrame(intro);
      if (griff) {
        let zieht = false;
        const setze = (e) => {
          const r = bild.getBoundingClientRect();
          heroZiehen = klemm((e.clientX - r.left) / r.width);
          zeichnen();
        };
        griff.addEventListener('pointerdown', (e) => { zieht = true; griff.setPointerCapture(e.pointerId); setze(e); });
        griff.addEventListener('pointermove', (e) => { if (zieht) setze(e); });
        griff.addEventListener('pointerup', () => { zieht = false; });
        griff.addEventListener('pointercancel', () => { zieht = false; });
        griff.addEventListener('keydown', (e) => {
          const k = { ArrowRight: 0.08, ArrowLeft: -0.08, Home: -1, End: 1 }[e.key];
          if (k === undefined) return;
          e.preventDefault();
          heroZiehen = klemm(Math.max(aktuellHero(), 0) + k);
          zeichnen();
        });
      }
    }
    const aktuellHero = () => Math.max(heroP, heroIntro, heroZiehen);

    // ---------- 2. Haltungssatz ----------
    const tr = document.querySelector('.tr');
    const woerter = tr ? [...tr.querySelectorAll('.tr-text .w')] : [];

    // ---------- 3. Stapel ----------
    const karten = [...document.querySelectorAll('.stapel > li')];

    // ---------- 4. Ablauf waagerecht ----------
    const hz = document.querySelector('.hz');
    const spur = hz && hz.querySelector('.hz-spur');

    let geplant = false;
    function zeichnen() {
      if (geplant) return;
      geplant = true;
      requestAnimationFrame(() => { geplant = false; frame(); });
    }
    function frame() {
      const vh = innerHeight;
      if (hero) {
        if (pin()) {
          const r = hero.getBoundingClientRect();
          const gesamt = r.height - vh * 0.9;
          heroP = klemm(-r.top / Math.max(1, gesamt) * 1.25);
        } else {
          // Handy: kein Festhalten, der Beschlag verschwindet, während das Foto ins Bild kommt
          const r = bild.getBoundingClientRect();
          heroP = klemm((vh * 0.98 - r.top) / (r.height + vh * 0.2));
        }
        const p = aktuellHero();
        hero.style.setProperty('--p', p.toFixed(4));
        if (griff) griff.setAttribute('aria-valuenow', Math.round(p * 100));
        wurzel.classList.toggle('kh-fertig', p > 0.97);
      }
      if (tr && woerter.length) {
        const r = tr.getBoundingClientRect();
        const p = klemm((vh * 0.85 - r.top) / (r.height + vh * 0.35));
        const n = Math.round(p * 1.08 * woerter.length);
        woerter.forEach((w, i) => w.classList.toggle('an', i < n));
        tr.style.setProperty('--p', p.toFixed(3));
      }
      karten.forEach((li, i) => {
        const k = li.firstElementChild;
        const naechste = karten[i + 1];
        if (!naechste) { k.style.transform = ''; return; }
        const oben = li.getBoundingClientRect().top;
        const nTop = naechste.getBoundingClientRect().top;
        const d = klemm((nTop - oben) / Math.max(1, k.offsetHeight)); // 1 = frei, 0 = ganz überdeckt
        const s = 1 - 0.055 * (1 - d);
        k.style.transform = s < 0.9995 ? `scale(${s.toFixed(4)})` : '';
        k.style.filter = d < 1 ? `brightness(${(1 - 0.16 * (1 - d)).toFixed(3)})` : '';
      });
      if (hz && spur) {
        const r = hz.getBoundingClientRect();
        const p = klemm(-r.top / Math.max(1, r.height - vh));
        const weg = Math.max(0, spur.scrollWidth - spur.parentElement.clientWidth + 32);
        spur.style.setProperty('--hz-x', `${(-p * weg).toFixed(1)}px`);
        hz.style.setProperty('--p', p.toFixed(4));
      }
    }
    addEventListener('scroll', zeichnen, { passive: true });
    addEventListener('resize', zeichnen);
    window.__kinoAb = () => { removeEventListener('scroll', zeichnen); removeEventListener('resize', zeichnen); };
    zeichnen();
    initHelfer();
  };

  // ---------- 5. Anfrage-Helfer (ohne Preise; gibt die Angaben an /angebot weiter) ----------
  function initHelfer() {
    const f = document.querySelector('.konf-form');
    if (!f) return;
    const slider = f.querySelector('input[type=range]');
    const out = f.querySelector('output');
    const satz = document.querySelector('.konf-satz');
    const link = document.querySelector('.konf-erg .knopf');
    const wert = (n) => (f.querySelector(`input[name=${n}]:checked`) || {}).value || '';
    const aktual = () => {
      const o = f.querySelector('input[name=objekt]:checked');
      const leistung = o ? o.dataset.leistung : '';
      const objektart = o ? o.dataset.objektart : '';
      const rh = wert('rhythmus');
      const fl = slider.value;
      const flText = +fl >= +slider.max ? `über ${slider.max}` : `ca. ${fl}`;
      out.textContent = `${flText} m²`;
      slider.setAttribute('aria-valuetext', `${flText} Quadratmeter`);
      if (satz) satz.innerHTML = o ? `Ihre Anfrage: <strong>${o.nextElementSibling.textContent}</strong>, ${flText}&nbsp;m², <strong>${rh ? rh.toLowerCase() : 'Rhythmus noch offen'}</strong>.` : 'Wählen Sie links, was gereinigt werden soll. Wir übernehmen Ihre Angaben ins Formular.';
      const q = new URLSearchParams();
      if (leistung) q.set('leistung', leistung);
      if (objektart) q.set('objektart', objektart);
      if (o) q.set('flaeche', String(Math.min(+fl, +slider.max)));
      if (rh) q.set('rhythmus', rh);
      link.setAttribute('href', `/angebot${q.toString() ? `?${q}` : ''}#formular`);
    };
    f.addEventListener('input', aktual);
    aktual();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
