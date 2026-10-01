// Baustein menue-kreis – Handy-Menü als Kreis, der aus dem Menü-Knopf wächst.
// Erwartet: <button class="menue-knopf" aria-expanded="false" aria-controls="nav">Menü</button> und
// <nav class="nav blatt" id="nav">…</nav> im Kopf. Ohne JS bleibt die Navigation als Zeile sichtbar.
// Geschlossen: Fläche inert. Offen: alles außer Knopf, Logo, Schema-Schalter und Fläche inert, Fokus auf den ersten
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
        const frei = (el) => el === blatt || el === knopf || el.matches('.marke, .schema-knopf') || el.contains(blatt);
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
