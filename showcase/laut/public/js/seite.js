// Zwischenbild (Demo) – kleines Zusatzskript. Ohne JavaScript ist aller Inhalt da und die Navigation bedienbar.
function start() {
  const html = document.documentElement;
  html.classList.add('js');
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)');
  const feinerZeiger = matchMedia('(hover: hover) and (pointer: fine)');

  // ---------- Menü-Blatt (Handy) ----------
  const knopf = document.querySelector('.menue-knopf');
  const blatt = document.getElementById('menue');
  if (knopf && blatt) {
    let offen = false;
    const andere = () => [...document.body.children].filter((e) => e !== blatt && e.tagName !== 'SCRIPT');
    const oeffnen = () => {
      if (offen) return; offen = true;
      blatt.hidden = false;
      andere().forEach((e) => { e.inert = true; });
      knopf.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(() => requestAnimationFrame(() => blatt.classList.add('blatt--offen')));
      blatt.querySelector('.blatt-liste a')?.focus({ preventScroll: true });
    };
    const schliessen = (zurueck = true) => {
      if (!offen) return; offen = false;
      blatt.classList.remove('blatt--offen');
      andere().forEach((e) => { e.inert = false; });
      knopf.setAttribute('aria-expanded', 'false');
      const weg = () => { if (!offen) blatt.hidden = true; };
      ruhig.matches ? weg() : setTimeout(weg, 450);
      if (zurueck) knopf.focus({ preventScroll: true });
    };
    knopf.addEventListener('click', oeffnen);
    blatt.addEventListener('click', (e) => {
      if (e.target.closest('[data-zu]')) schliessen();
      else if (e.target.closest('a')) schliessen(false);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') schliessen(); });
    matchMedia('(min-width: 48rem)').addEventListener('change', (e) => { if (e.matches) schliessen(false); });
  }

  // ---------- Schnellleiste: erscheint, sobald die Knöpfe im ersten Bildschirm aus dem Bild sind ----------
  const schnell = document.querySelector('.schnell');
  const heldKnoepfe = document.querySelector('.held .aktionen');
  if (schnell) {
    if (!heldKnoepfe || !('IntersectionObserver' in window)) schnell.classList.add('schnell--da');
    else new IntersectionObserver(([e]) => { schnell.classList.toggle('schnell--da', !e.isIntersecting && e.boundingClientRect.top < 0); }).observe(heldKnoepfe);
  }

  // ---------- „zwischenbild“ dehnt sich einmal, wenn es ins Bild kommt ----------
  const dehnwort = document.querySelector('.dehnwort');
  if (dehnwort) {
    if (!('IntersectionObserver' in window) || ruhig.matches) dehnwort.classList.add('gedehnt');
    else {
      const io = new IntersectionObserver((eintraege) => {
        if (eintraege.some((e) => e.isIntersecting)) { dehnwort.classList.add('gedehnt'); io.disconnect(); }
      }, { threshold: 0.5 });
      io.observe(dehnwort);
    }
  }

  // ---------- Kurven-Labor ----------
  const labor = document.querySelector('.labor');
  if (labor) {
    const startKnopf = labor.querySelector('.labor-start');
    const still = labor.querySelector('.labor-still');
    const spuren = [...labor.querySelectorAll('.spur-bilder')];
    const zeigen = () => { startKnopf.hidden = ruhig.matches; still.hidden = !ruhig.matches; };
    zeigen(); ruhig.addEventListener('change', zeigen);
    let laeuft = false;
    const abspielen = () => {
      if (laeuft || ruhig.matches) return; laeuft = true;
      startKnopf.disabled = true; startKnopf.textContent = 'Läuft …';
      const animationen = spuren.map((svg) => {
        const live = svg.querySelector('.bild-live');
        const ziel = svg.viewBox.baseVal.width - live.width.baseVal.value;
        return live.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${ziel}px)` }],
          { duration: 1200, easing: svg.dataset.kurve, fill: 'forwards' });
      });
      Promise.all(animationen.map((a) => a.finished)).then(() => setTimeout(() => {
        animationen.forEach((a) => a.cancel());
        laeuft = false; startKnopf.disabled = false; startKnopf.textContent = 'Noch einmal abspielen';
      }, 900));
    };
    startKnopf.addEventListener('click', abspielen);
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { io.disconnect(); setTimeout(abspielen, 400); } }, { threshold: 0.6 });
      io.observe(labor.querySelector('.spuren'));
    }
  }

  // ---------- Anfrage-Baukasten: baut die E-Mail vor ----------
  const bau = document.querySelector('.baukasten');
  if (bau) {
    bau.hidden = false;
    const link = bau.querySelector('.baukasten-senden');
    const vorschau = bau.querySelector('.baukasten-vorschau');
    const adresse = link.getAttribute('href').replace('mailto:', '');
    const aktualisieren = () => {
      const themen = [...bau.querySelectorAll('[name=thema]:checked')].map((e) => e.value);
      const wann = bau.querySelector('[name=zeitraum]:checked')?.value || '';
      const betreff = `Anfrage: ${themen.length ? themen.join(', ') : 'Projekt'}`;
      const text = `Hallo Zwischenbild,\n\nwir möchten gern über ${themen.length ? themen.join(', ') : 'ein Projekt'} sprechen. Start: ${wann}.\n\nWorum es geht:\n`;
      link.href = `mailto:${adresse}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(text)}`;
      vorschau.textContent = `Betreff: ${betreff} · Start: ${wann}`;
    };
    bau.addEventListener('change', aktualisieren); aktualisieren();
  }

  // ---------- Zeiger: Plakate weichen dem Mauszeiger leicht aus (nur feiner Zeiger) ----------
  if (feinerZeiger.matches && !ruhig.matches) {
    for (const karte of document.querySelectorAll('.werk-link .poster')) {
      const plakat = karte.querySelector('.plakat'); let rahmen = null, bild = 0;
      karte.addEventListener('pointerenter', () => { rahmen = karte.getBoundingClientRect(); });
      karte.addEventListener('pointermove', (e) => {
        if (!rahmen || bild) return;
        const x = (e.clientX - rahmen.left) / rahmen.width - 0.5, y = (e.clientY - rahmen.top) / rahmen.height - 0.5;
        bild = requestAnimationFrame(() => { plakat.style.setProperty('--zx', x.toFixed(3)); plakat.style.setProperty('--zy', y.toFixed(3)); bild = 0; });
      });
      karte.addEventListener('pointerleave', () => { rahmen = null; plakat.style.removeProperty('--zx'); plakat.style.removeProperty('--zy'); });
    }
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
