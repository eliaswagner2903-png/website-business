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
