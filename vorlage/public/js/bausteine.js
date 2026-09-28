/* Erzeugt von bausteine/einbauen.mjs – nicht von Hand ändern. Bausteine: einblenden, seitenwechsel, menue-blatt, bento, hero-video */

/* ===== einblenden/einblenden.js ===== */
// Baustein einblenden – Rückfall für Browser ohne CSS-Scroll-Timeline (z. B. Firefox).
// Erster Observer-Aufruf liefert die Lage ohne erzwungenes Layout: was schon im Bild ist, bleibt sichtbar.
// Später hereinkommende Elemente gleiten mit festem Tempo ein (Geschwister 85 ms versetzt), danach werden
// die Klassen wieder entfernt (sonst blockieren sie Hover-Effekte). Test: Adresse mit ?rueckfall öffnen.
(() => {
  function start() {
    const wurzel = document.documentElement;
    if (new URLSearchParams(location.search).has('rueckfall')) wurzel.classList.add('einblenden-rueckfall');
    const css = window.CSS && CSS.supports('animation-timeline: view()') && !wurzel.classList.contains('einblenden-rueckfall');
    if (css || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const gesehen = new WeakSet();
    const fertig = (el) => { el.classList.remove('einblenden--los'); el.style.transitionDelay = ''; };
    const beobachter = new IntersectionObserver((eintraege) => {
      let reihe = 0;
      for (const e of eintraege) {
        const el = e.target;
        if (!gesehen.has(el)) {             // erster Aufruf: nur merken, wo es steht
          gesehen.add(el);
          if (e.isIntersecting) beobachter.unobserve(el); else el.classList.add('einblenden--wartet');
          continue;
        }
        if (!e.isIntersecting) continue;
        beobachter.unobserve(el);
        el.style.transitionDelay = `${Math.min(reihe++, 5) * 85}ms`;
        el.classList.add('einblenden--los');
        el.classList.remove('einblenden--wartet');
        el.addEventListener('transitionend', () => fertig(el), { once: true });
        setTimeout(() => fertig(el), 1600);  // falls transitionend ausbleibt
      }
    }, { rootMargin: '0px 0px -8% 0px' });
    for (const el of document.querySelectorAll('.einblenden')) beobachter.observe(el);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

/* ===== menue-blatt/menue-blatt.js ===== */
// Baustein menue-blatt – Handy-Menü als Blatt von unten.
// Erwartet: <button class="menue-knopf" aria-expanded="false" aria-controls="nav">Menü</button> und
// <nav class="nav blatt" id="nav">…</nav> im Kopf. Ohne JS bleibt die Navigation als Zeile sichtbar.
// Geschlossen: Blatt inert. Offen: alles außer Knopf und Blatt inert, Fokus auf den ersten Eintrag,
// Escape/Schleier/Link schließt, Wischen nach unten schließt, Fokus zurück zum Knopf.
(() => {
  function start() {
    const knopf = document.querySelector('.menue-knopf');
    const blatt = knopf && document.getElementById(knopf.getAttribute('aria-controls'));
    if (!blatt) return;
    const handy = matchMedia('(max-width: 47.99rem)');
    const beschriftung = knopf.textContent;
    const schleier = document.createElement('div');
    schleier.className = 'blatt-schleier';
    document.body.append(schleier);
    let offen = false;
    let gesperrt = [];

    const setze = (auf, fokusZurueck) => {
      if (auf === offen) return;
      offen = auf;
      blatt.classList.toggle('blatt--offen', auf);
      schleier.classList.toggle('blatt-schleier--an', auf);
      document.documentElement.classList.toggle('menue-offen', auf);
      knopf.setAttribute('aria-expanded', String(auf));
      knopf.textContent = auf ? 'Schließen' : beschriftung;
      if (auf) {
        blatt.inert = false;
        // alles außer Knopf und Blatt sperren (auch Skip-Link, Fuß, Schnellleiste)
        const kopf = blatt.closest('header') || blatt.parentElement;
        gesperrt = [...document.body.children, ...kopf.querySelectorAll('.huelle > *')]
          .filter((el) => el !== schleier && !el.contains(blatt) && el !== knopf && !el.inert);
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
    schleier.addEventListener('click', () => setze(false, true));
    blatt.addEventListener('click', (e) => { if (e.target.closest('a')) setze(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && offen) setze(false, true); });

    // Wischen nach unten schließt (nur wenn das Blatt oben steht). Das Blatt folgt dem Finger per transform.
    let y0 = null, dy = 0, t0 = 0;
    blatt.addEventListener('touchstart', (e) => {
      if (!offen || blatt.scrollTop > 0) return;
      y0 = e.touches[0].clientY; dy = 0; t0 = e.timeStamp;
    }, { passive: true });
    blatt.addEventListener('touchmove', (e) => {
      if (y0 === null) return;
      dy = Math.max(0, e.touches[0].clientY - y0);
      if (dy > 6) {
        e.preventDefault();
        blatt.classList.add('blatt--zieht');
        blatt.style.transform = `translateY(${dy}px)`;
      }
    }, { passive: false });
    blatt.addEventListener('touchend', (e) => {
      if (y0 === null) return;
      const schnell = dy / Math.max(1, e.timeStamp - t0) > 0.5;
      blatt.classList.remove('blatt--zieht');
      blatt.style.transform = '';
      if (dy > 90 || (schnell && dy > 30)) setze(false, true);
      y0 = null;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

/* ===== hero-video/hero-video.js ===== */
// Baustein hero-video – Video erst nach dem Poster.
// <figure class="held-video" data-webm="…webm" data-mp4="…mp4"> <img class="held-video-poster" fetchpriority="high" …>
//   <button class="held-video-knopf" type="button" aria-pressed="false" hidden><span class="unsichtbar">Video anhalten</span></button>  (aria-pressed="true" = angehalten)
// Lädt nicht bei „Bewegung reduzieren“, „Daten sparen“ (Save-Data) oder ohne data-webm/data-mp4.
// Startet erst nach window.load + Leerlauf und nur, wenn der Rahmen sichtbar ist. Pausiert außerhalb des Bildes,
// bei verstecktem Tab und auf Knopfdruck (WCAG 2.2.2: bewegte Inhalte > 5 s brauchen einen Halt-Knopf).
(() => {
  function start() {
    for (const rahmen of document.querySelectorAll('.held-video[data-webm], .held-video[data-mp4]')) vorbereiten(rahmen);
  }

  function vorbereiten(rahmen) {
    const ruhig = matchMedia('(prefers-reduced-motion: reduce)');
    const sparen = navigator.connection && navigator.connection.saveData;
    if (ruhig.matches || sparen) return;

    let film = null, sichtbar = false, angehalten = false, bereit = false;
    const knopf = rahmen.querySelector('.held-video-knopf');

    const steuern = () => {
      if (!film) return;
      if (sichtbar && !document.hidden && !angehalten && !ruhig.matches) film.play().catch(() => {});
      else film.pause();
    };
    const laden = () => {
      if (film || !sichtbar) return;
      film = document.createElement('video');
      film.className = 'held-video-film';
      film.muted = true; film.defaultMuted = true; film.loop = true; film.playsInline = true;
      film.setAttribute('playsinline', ''); film.setAttribute('aria-hidden', 'true'); film.preload = 'auto';
      for (const [attr, typ] of [['webm', 'video/webm'], ['mp4', 'video/mp4']]) {
        if (!rahmen.dataset[attr]) continue;
        const quelle = document.createElement('source');
        quelle.src = rahmen.dataset[attr]; quelle.type = typ;
        film.append(quelle);
      }
      film.addEventListener('playing', () => rahmen.classList.add('held-video--laeuft'), { once: true });
      rahmen.querySelector('.held-video-poster')?.after(film);
      if (!film.isConnected) rahmen.prepend(film);
      if (knopf) knopf.hidden = false;
      steuern();
    };

    new IntersectionObserver(([e]) => {
      sichtbar = e.isIntersecting;
      if (bereit) { laden(); steuern(); }
    }, { threshold: 0.15 }).observe(rahmen);
    document.addEventListener('visibilitychange', steuern);
    ruhig.addEventListener('change', () => { if (ruhig.matches) { angehalten = true; steuern(); } });
    knopf?.addEventListener('click', () => {
      angehalten = !angehalten;
      knopf.setAttribute('aria-pressed', String(angehalten));
      steuern();
    });

    // erst nach dem Laden der Seite und im Leerlauf – das Poster bleibt das LCP-Element
    const los = () => {
      const weiter = () => { bereit = true; laden(); };
      if ('requestIdleCallback' in window) requestIdleCallback(weiter, { timeout: 2500 }); else setTimeout(weiter, 600);
    };
    if (document.readyState === 'complete') los(); else addEventListener('load', los, { once: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
