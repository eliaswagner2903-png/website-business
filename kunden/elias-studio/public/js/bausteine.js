/* Erzeugt von bausteine/einbauen.mjs – nicht von Hand ändern. Bausteine: einblenden, menue-kreis, seitenwechsel */

/* ===== einblenden/einblenden.js ===== */
// Baustein einblenden – Rückfall für Browser ohne CSS-Scroll-Timeline (z. B. Firefox).
// Erster Observer-Aufruf liefert die Lage ohne erzwungenes Layout: was schon im Bild ist, bleibt sichtbar.
// Später hereinkommende Elemente gleiten mit festem Tempo ein (Geschwister 85 ms versetzt), danach werden
// die Klassen wieder entfernt (sonst blockieren sie Hover-Effekte). Test: Adresse mit ?rueckfall öffnen.
(() => {
  function start() {
    const wurzel = document.documentElement;
    if (new URLSearchParams(location.search).has('rueckfall')) wurzel.classList.add('einblenden-rueckfall');
    const css = window.CSS && CSS.supports('animation-timeline: view()') && !wurzel.classList.contains('einblenden-rueckfall');
    if (css || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const gesehen = new WeakSet();
    const fertig = (el) => { el.classList.remove('einblenden--los'); el.style.transitionDelay = ''; };
    const beobachter = new IntersectionObserver((eintraege) => {
      let reihe = 0;
      for (const e of eintraege) {
        const el = e.target;
        if (!gesehen.has(el)) {             // erster Aufruf: nur merken, wo es steht
          gesehen.add(el);
          if (e.isIntersecting) beobachter.unobserve(el); else el.classList.add('einblenden--wartet');
          continue;
        }
        if (!e.isIntersecting) continue;
        beobachter.unobserve(el);
        el.style.transitionDelay = `${Math.min(reihe++, 5) * 85}ms`;
        el.classList.add('einblenden--los');
        el.classList.remove('einblenden--wartet');
        el.addEventListener('transitionend', () => fertig(el), { once: true });
        setTimeout(() => fertig(el), 1600);  // falls transitionend ausbleibt
      }
    }, { rootMargin: '0px 0px -8% 0px' });
    for (const el of document.querySelectorAll('.einblenden')) beobachter.observe(el);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

/* ===== menue-kreis/menue-kreis.js ===== */
// Baustein menue-kreis – Handy-Menü als Kreis, der aus dem Menü-Knopf wächst.
// Erwartet: <button class="menue-knopf" aria-expanded="false" aria-controls="nav">Menü</button> und
// <nav class="nav blatt" id="nav">…</nav> im Kopf. Ohne JS bleibt die Navigation als Zeile sichtbar.
// Geschlossen: Fläche inert. Offen: alles außer Knopf, Logo und Fläche inert, Fokus auf den ersten
// Eintrag, Escape/Link/Knopf schließt, Fokus zurück zum Knopf. Der Kreis geht von der Knopfmitte aus.
(() => {
  function start() {
    const knopf = document.querySelector('.menue-knopf');
    const blatt = knopf && document.getElementById(knopf.getAttribute('aria-controls'));
    if (!blatt) return;
    const handy = matchMedia('(max-width: 47.99rem)');
    const beschriftung = knopf.textContent;
    let offen = false;
    let gesperrt = [];

    const kreis = () => {
      const r = knopf.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const w = document.documentElement.clientWidth, h = innerHeight;
      blatt.style.setProperty('--kx', `${Math.round(x)}px`);
      blatt.style.setProperty('--ky', `${Math.round(y)}px`);
      blatt.style.setProperty('--kr', `${Math.ceil(Math.hypot(Math.max(x, w - x), Math.max(y, h - y)))}px`);
    };

    const setze = (auf, fokusZurueck) => {
      if (auf === offen) return;
      offen = auf;
      if (auf) kreis();
      blatt.classList.toggle('blatt--offen', auf);
      document.documentElement.classList.toggle('menue-offen', auf);
      knopf.setAttribute('aria-expanded', String(auf));
      knopf.textContent = auf ? 'Schließen' : beschriftung;
      if (auf) {
        blatt.inert = false;
        // alles außer Kopfzeile-Bedienung und Fläche sperren (auch Skip-Link, Fuß)
        const kopf = blatt.closest('header') || blatt.parentElement;
        const frei = (el) => el === blatt || el === knopf || el.matches('.marke') || el.contains(blatt);
        gesperrt = [...document.body.children, ...kopf.querySelectorAll('.huelle > *')].filter((el) => !frei(el) && !el.inert);
        gesperrt.forEach((el) => { el.inert = true; });
        const erster = blatt.querySelector('a, button');
        if (erster) erster.focus({ preventScroll: true });
      } else {
        gesperrt.forEach((el) => { el.inert = false; });
        gesperrt = [];
        blatt.inert = handy.matches;
        if (fokusZurueck) knopf.focus({ preventScroll: true });
      }
    };

    blatt.inert = handy.matches;
    handy.addEventListener('change', () => { setze(false); blatt.inert = handy.matches; });
    knopf.addEventListener('click', () => setze(!offen, true));
    blatt.addEventListener('click', (e) => { if (e.target.closest('a')) setze(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && offen) setze(false, true); });
    addEventListener('resize', () => { if (offen) kreis(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
