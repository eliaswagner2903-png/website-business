// Seitenskript URFA SOFRASI. Die Seite funktioniert vollständig ohne JavaScript.
// Menü, Einblenden, Galerie kommen aus js/bausteine.js (erzeugt von bausteine/einbauen.mjs).
(() => {
  // Öffnungszeiten (unbestätigt, data-pruefen): täglich 10–23 Uhr. Ortszeit selbst aus UTC rechnen –
  // Intl mit timeZone kostet ~75 ms Blockierzeit (DESIGN-WISSEN 5).
  const AUF = 10 * 60, ZU = 23 * 60;
  function ortszeitMinuten(d = new Date()) {
    // Mitteleuropa: Sommerzeit vom letzten Sonntag im März bis zum letzten Sonntag im Oktober (je 1 Uhr UTC)
    const j = d.getUTCFullYear();
    const letzterSonntag = (m) => { const t = new Date(Date.UTC(j, m + 1, 0, 1)); t.setUTCDate(t.getUTCDate() - t.getUTCDay()); return t; };
    const sommer = d >= letzterSonntag(2) && d < letzterSonntag(9);
    return (d.getUTCHours() * 60 + d.getUTCMinutes() + (sommer ? 120 : 60)) % 1440;
  }
  function status() {
    const m = ortszeitMinuten();
    const offen = m >= AUF && m < ZU;
    const text = offen ? 'Jetzt geöffnet · bis 23:00 Uhr' : m < AUF ? 'Geschlossen · öffnet um 10:00 Uhr' : 'Geschlossen · morgen ab 10:00 Uhr';
    for (const el of document.querySelectorAll('[data-status]')) {
      el.classList.toggle('status--offen', offen);
      const t = el.querySelector('.status-text');
      if (t) t.textContent = text;
    }
  }

  // Speisekarte: Suche (findet „sis“ auch in „Şiş“) und aktive Kategorie
  const falten = (s) => s.toLocaleLowerCase('de').replace(/ı/g, 'i').replace(/ß/g, 'ss').normalize('NFD')
    .replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();

  function suche() {
    const feld = document.getElementById('suche');
    if (!feld) return;
    const gerichte = [...document.querySelectorAll('.gericht')];
    const kats = [...document.querySelectorAll('.kat')];
    const leer = document.getElementById('such-leer');
    const meldung = document.getElementById('such-status');
    let warten;
    const filtern = () => {
      const q = falten(feld.value);
      let treffer = 0;
      for (const g of gerichte) { const an = !q || g.dataset.suche.includes(q); g.hidden = !an; if (an) treffer++; }
      for (const k of kats) {
        k.hidden = !!q && !k.querySelector('.gericht:not([hidden])');
        for (const z of k.querySelectorAll('.zwischen')) {
          const liste = z.nextElementSibling;
          z.hidden = !!q && !(liste && liste.querySelector('.gericht:not([hidden])'));
        }
      }
      leer.hidden = !q || treffer > 0;
      clearTimeout(warten);
      warten = setTimeout(() => { meldung.textContent = q ? `${treffer} ${treffer === 1 ? 'Gericht' : 'Gerichte'} gefunden` : ''; }, 400);
    };
    feld.addEventListener('input', filtern);
    feld.addEventListener('keydown', (e) => { if (e.key === 'Escape' && feld.value) { feld.value = ''; filtern(); } });
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== feld && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); feld.focus(); }
    });
    // Klick auf eine Kategorie leert die Suche, damit das Ziel sichtbar ist
    for (const a of document.querySelectorAll('.chips a')) a.addEventListener('click', () => { if (feld.value) { feld.value = ''; filtern(); } });
  }

  function chips() {
    const leiste = document.querySelector('.chips');
    if (!leiste || !('IntersectionObserver' in window)) return;
    const links = new Map([...leiste.querySelectorAll('a')].map((a) => [a.hash.slice(1), a]));
    const sichtbar = new Set();
    let aktiv = null;
    const setze = (id) => {
      if (!id || id === aktiv) return;
      aktiv = id;
      for (const [k, a] of links) a.classList.toggle('chip--aktiv', k === id);
      const a = links.get(id);
      // offsetLeft bezieht sich auf .chips (position: relative), FEHLER 28
      leiste.scrollTo({ left: a.offsetLeft - 16, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    };
    // Aktiv ist die Kategorie, deren Überschrift zuletzt die Leselinie passiert hat (FEHLER 29)
    const beob = new IntersectionObserver((eintraege) => {
      for (const e of eintraege) e.isIntersecting ? sichtbar.add(e.target.id) : sichtbar.delete(e.target.id);
      const reihe = [...links.keys()].filter((id) => sichtbar.has(id));
      if (reihe.length) setze(reihe[0]);
    }, { rootMargin: '-30% 0px -60% 0px' });
    for (const id of links.keys()) { const k = document.getElementById(id); if (k) beob.observe(k); }
    if (location.hash && links.has(location.hash.slice(1))) setze(location.hash.slice(1));
  }

  // Startseite: Schnellleiste erst zeigen, wenn der Anruf-Knopf im Hero nicht mehr sichtbar ist
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
    if (location.hash === '#pruefen') document.documentElement.classList.add('pruefmodus');
    addEventListener('hashchange', () => document.documentElement.classList.toggle('pruefmodus', location.hash === '#pruefen'));
    status();
    setInterval(status, 60000);
    leiste();
    suche();
    chips();
    // Doppelte Formular-Klicks verhindern
    for (const form of document.querySelectorAll('.formular')) {
      form.addEventListener('submit', () => { const b = form.querySelector('button'); if (b) { b.disabled = true; b.textContent = 'Einen Moment …'; } });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
