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
