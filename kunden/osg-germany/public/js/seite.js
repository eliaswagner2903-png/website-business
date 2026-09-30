// Zusatzskript der OSG-Neugestaltung. Die Seite funktioniert vollständig ohne JavaScript:
// Der Werkzeugfinder filtert per CSS (:has), das Formular ist ein normales POST-Formular.
// Hier nur Verbesserungen: Trefferzahl für Screenreader, Standzeit-Balken beim Hereinscrollen, Sende-Zustand.
function start() {
  const wurzel = document.documentElement;
  wurzel.classList.add('js');
  if (location.hash === '#pruefen') wurzel.classList.add('pruefmodus');

  // Werkzeugfinder: sichtbare Trefferzahl in die Live-Region spiegeln (CSS zeigt sie, Screenreader hören sie)
  const finder = document.querySelector('.finder');
  const ansage = document.getElementById('finder-ansage');
  if (finder && ansage) {
    finder.addEventListener('change', () => {
      requestAnimationFrame(() => {
        const zahl = [...finder.querySelectorAll('.zahl')].find((z) => z.offsetParent !== null);
        const leer = finder.querySelector('.finder-leer');
        ansage.textContent = leer && leer.offsetParent !== null ? 'Keine Serie für diese Kombination. Die Anwendungstechnik hilft weiter.' : (zahl ? zahl.textContent : '');
      });
    });
  }

  // Standzeit-Balken wachsen einmal, wenn sie ins Bild kommen (bei „Bewegung reduzieren“ stehen sie sofort)
  const balken = document.querySelector('.balken');
  if (balken && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const beob = new IntersectionObserver(([e]) => {
      if (e.boundingClientRect.top > innerHeight * 0.85 && !balken.dataset.gesehen) { balken.classList.add('balken--warten'); balken.dataset.gesehen = '1'; return; }
      if (e.isIntersecting && e.intersectionRatio > 0.6) { balken.classList.remove('balken--warten'); beob.disconnect(); }
    }, { threshold: [0, 0.6, 1] });
    beob.observe(balken);
  }

  // Formular: Doppelklick verhindern, Zustand „wird gesendet“ zeigen
  for (const form of document.querySelectorAll('form.formular')) {
    form.addEventListener('submit', () => {
      const knopf = form.querySelector('button[type="submit"]');
      form.classList.add('formular--sendet');
      if (knopf) { knopf.disabled = true; knopf.textContent = 'Wird gesendet …'; }
    });
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
