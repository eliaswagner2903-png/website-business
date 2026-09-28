// Kleines Zusatzskript. Die Seite funktioniert vollständig ohne JavaScript.
function start() {
  document.documentElement.classList.add('js');

  const knopf = document.querySelector('.menue-knopf');
  const nav = document.getElementById('nav');
  if (knopf && nav) {
    const setze = (offen) => { nav.classList.toggle('offen', offen); knopf.setAttribute('aria-expanded', String(offen)); };
    knopf.addEventListener('click', () => setze(!nav.classList.contains('offen')));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setze(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setze(false); });
  }

  if (location.hash === '#pruefen') document.documentElement.classList.add('pruefmodus');

  // Doppelte Zahlungs-Klicks verhindern
  for (const form of document.querySelectorAll('form[data-einmal]')) {
    form.addEventListener('submit', () => { const b = form.querySelector('button'); if (b) { b.disabled = true; b.textContent = 'Einen Moment …'; } });
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
