// Lotlinie – kleines Zusatzskript. Ohne JavaScript bleibt alles sichtbar und bedienbar
// (Navigation steht dann als Zeile im Kopf, Einblenden läuft über CSS).
function start() {
  const html = document.documentElement;
  html.classList.add('js');
  if (location.hash === '#pruefen') html.classList.add('pruefmodus');

  // Menü-Blatt: natives <dialog> – Fokusfalle, Escape und „inert“ für den Rest der Seite gibt es dadurch gratis.
  const menue = document.getElementById('menue');
  const knopf = document.querySelector('[data-menue-auf]');
  if (menue && knopf && typeof menue.showModal === 'function') {
    knopf.addEventListener('click', () => { menue.showModal(); knopf.setAttribute('aria-expanded', 'true'); });
    menue.addEventListener('close', () => { knopf.setAttribute('aria-expanded', 'false'); knopf.focus(); });
    menue.addEventListener('click', (e) => {
      if (e.target === menue || e.target.closest('[data-menue-zu]')) menue.close();
    });
    // Nach unten wischen schließt das Blatt
    let y0 = null;
    menue.addEventListener('touchstart', (e) => { y0 = menue.scrollTop === 0 ? e.touches[0].clientY : null; }, { passive: true });
    menue.addEventListener('touchend', (e) => { if (y0 !== null && e.changedTouches[0].clientY - y0 > 70) menue.close(); y0 = null; }, { passive: true });
    // Blatt schließen, wenn das Fenster breit genug für die normale Navigation wird
    matchMedia('(min-width: 56rem)').addEventListener('change', (m) => { if (m.matches && menue.open) menue.close(); });
  } else if (knopf) {
    knopf.hidden = true; // sehr alte Browser: Navigation bleibt im Kopf sichtbar
    html.classList.remove('js');
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
