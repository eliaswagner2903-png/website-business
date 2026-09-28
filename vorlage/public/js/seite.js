// Kleines Zusatzskript der Seite. Die Seite funktioniert vollständig ohne JavaScript.
// Menü, Einblenden, Video usw. kommen aus js/bausteine.js (erzeugt von bausteine/einbauen.mjs).
function start() {
  document.documentElement.classList.add('js');
  if (location.hash === '#pruefen') document.documentElement.classList.add('pruefmodus');

  // Doppelte Zahlungs-Klicks verhindern
  for (const form of document.querySelectorAll('form[data-einmal]')) {
    form.addEventListener('submit', () => { const b = form.querySelector('button'); if (b) { b.disabled = true; b.textContent = 'Einen Moment …'; } });
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
