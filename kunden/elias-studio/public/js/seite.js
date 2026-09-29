// Seitenskript der Portfolio-Seite. Die Seite funktioniert vollständig ohne JavaScript.
// Menü, Einblenden und Seitenwechsel kommen aus js/bausteine.js (erzeugt von bausteine/einbauen.mjs).
(() => {
  // Startseite: Schnellleiste erst zeigen, wenn die Knöpfe im Hero aus dem Bild sind
  function leiste() {
    const leiste = document.querySelector('.seite-start .schnell');
    const ziel = document.querySelector('.held-aktionen');
    if (!leiste || !ziel || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(([e]) => {
      const weg = e.isIntersecting || e.boundingClientRect.top > 0;
      leiste.classList.toggle('schnell--weg', weg);
      leiste.inert = weg;
    }).observe(ziel);
  }

  function start() {
    const pruefen = () => document.documentElement.classList.toggle('pruefmodus', location.hash === '#pruefen');
    pruefen();
    addEventListener('hashchange', pruefen);
    leiste();
    // Doppelte Formular-Klicks verhindern
    for (const form of document.querySelectorAll('.formular')) {
      form.addEventListener('submit', () => { const b = form.querySelector('button'); if (b) { b.disabled = true; b.textContent = 'Einen Moment …'; } });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
