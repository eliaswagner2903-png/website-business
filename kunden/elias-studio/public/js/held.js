// Hero „Lichtkegel“: der Kegel folgt dem Zeiger (Maus); ruht der Zeiger oder ist es ein Touchgerät, wandert er von selbst.
// Bei „Bewegung reduzieren“ und ohne JavaScript steht er still an der Vorgabe aus dem CSS (--licht-x/--licht-y).
// Läuft nur, solange der Hero im Bild ist. Die Position kommt per style.setProperty (kein Inline-Stil im HTML, CSP bleibt streng).
(() => {
  function start() {
    const held = document.querySelector('.held');
    if (!held) return;
    const ruhig = matchMedia('(prefers-reduced-motion: reduce)');
    let zuletzt = -Infinity;     // Zeitpunkt der letzten Mausbewegung
    let sichtbar = true, laeuft = false, t0 = 0;
    let x = null, y = null;      // aktuelle Position in px (weich nachgeführt)
    let zielX = 0, zielY = 0;

    const mass = () => held.getBoundingClientRect();
    const setze = () => {
      held.style.setProperty('--licht-x', `${Math.round(x)}px`);
      held.style.setProperty('--licht-y', `${Math.round(y)}px`);
    };
    const takt = (t) => {
      laeuft = false;
      if (ruhig.matches || !sichtbar) return;
      const r = mass();
      if (t - zuletzt > 2500) {  // Wandern: beginnt an der Vorgabe (60 % / 45 %), Weg aus zwei Sinuskurven
        if (!t0) t0 = t;
        const s = t - t0;
        zielX = r.width * (.6 + .3 * Math.sin(s / 2600));
        zielY = r.height * (.45 + .22 * Math.sin(s / 1900));
      }
      if (x === null) { x = r.width * .6; y = r.height * .45; }
      x += (zielX - x) * .12; y += (zielY - y) * .12;
      setze();
      laeuft = true; requestAnimationFrame(takt);
    };
    const an = () => { if (!laeuft && sichtbar && !ruhig.matches) { laeuft = true; requestAnimationFrame(takt); } };

    held.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch' || ruhig.matches) return;
      const r = mass();
      zuletzt = performance.now(); t0 = 0;
      zielX = e.clientX - r.left; zielY = e.clientY - r.top;
      an();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { sichtbar = e.isIntersecting; if (sichtbar) an(); }).observe(held);
    }
    ruhig.addEventListener('change', () => {
      if (ruhig.matches) { held.style.removeProperty('--licht-x'); held.style.removeProperty('--licht-y'); x = y = null; } else an();
    });
    an();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
