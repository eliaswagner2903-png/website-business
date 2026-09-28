// Baustein galerie – Streifen-Knöpfe und Großansicht im nativen <dialog>.
// Erwartet je Galerie: .galerie-streifen mit a.galerie-bild[href=großes Bild] > img, optional .galerie-leiste
// mit [data-galerie="zurueck|weiter"] und .galerie-dialog mit img, [data-dialog="zurueck|weiter|zu"] und .galerie-zaehler.
// Ohne JS öffnen die Links einfach die große Bilddatei.
(() => {
  function start() {
    const ruhig = matchMedia('(prefers-reduced-motion: reduce)');
    for (const galerie of document.querySelectorAll('.galerie')) einrichten(galerie, ruhig);
  }

  function einrichten(galerie, ruhig) {
    const streifen = galerie.querySelector('.galerie-streifen');
    const links = [...galerie.querySelectorAll('.galerie-bild')];
    const dialog = galerie.querySelector('.galerie-dialog');
    if (!streifen || !links.length) return;
    const zwei = (n) => String(n).padStart(2, '0');

    // Streifen: zurück/weiter um eine Bildbreite, Knöpfe am Rand deaktivieren
    const zurueck = galerie.querySelector('[data-galerie="zurueck"]');
    const weiter = galerie.querySelector('[data-galerie="weiter"]');
    const schritt = (r) => {
      const breite = links[0].getBoundingClientRect().width + 12;
      streifen.scrollBy({ left: r * breite, behavior: ruhig.matches ? 'auto' : 'smooth' });
    };
    const raender = () => {
      const max = streifen.scrollWidth - streifen.clientWidth - 2;
      if (zurueck) zurueck.disabled = streifen.scrollLeft <= 2;
      if (weiter) weiter.disabled = streifen.scrollLeft >= max;
    };
    zurueck?.addEventListener('click', () => schritt(-1));
    weiter?.addEventListener('click', () => schritt(1));
    streifen.addEventListener('scroll', () => requestAnimationFrame(raender), { passive: true });
    raender();

    if (!dialog || typeof dialog.showModal !== 'function') return;
    const bild = dialog.querySelector('img');
    const zaehler = dialog.querySelector('.galerie-zaehler');
    let i = 0;
    const zeige = (n, blenden) => {
      i = (n + links.length) % links.length;
      const a = links[i], klein = a.querySelector('img');
      bild.src = a.href;
      bild.alt = klein ? klein.alt : '';
      if (a.dataset.breite) { bild.width = +a.dataset.breite; bild.height = +a.dataset.hoehe; }
      if (zaehler) zaehler.textContent = `${zwei(i + 1)} / ${zwei(links.length)}${bild.alt ? ' · ' + bild.alt : ''}`;
      if (blenden && !ruhig.matches) bild.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 280, easing: 'ease-out' });
    };
    links.forEach((a, n) => a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;   // neuer Tab bleibt möglich
      e.preventDefault();
      zeige(n, false);
      dialog.showModal();
    }));
    dialog.addEventListener('click', (e) => {
      const was = e.target.closest('[data-dialog]')?.dataset.dialog;
      if (was === 'zu' || e.target === dialog) dialog.close();
      else if (was === 'zurueck') zeige(i - 1, true);
      else if (was === 'weiter') zeige(i + 1, true);
    });
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') zeige(i - 1, true);
      if (e.key === 'ArrowRight') zeige(i + 1, true);
    });
    let x0 = null;
    dialog.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    dialog.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) zeige(i + (dx < 0 ? 1 : -1), true);
    });
    // Nach dem Schließen: Streifen zeigt das zuletzt angesehene Bild
    dialog.addEventListener('close', () => links[i].scrollIntoView({ block: 'nearest', inline: 'start', behavior: 'auto' }));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
