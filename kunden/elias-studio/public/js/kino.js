// Kino: Scroll-Film „Werkbank“ – die Scrollposition bestimmt die Filmzeit (wissen/lehren/scroll-film.md).
// Poster bleibt, bis der Film geladen ist und das erste gesprungene Bild steht. Kein Film bei „Bewegung reduzieren“
// oder „Daten sparen“. Film als Blob, damit Springen auch ohne Byte-Range-Anfragen geht (CSP: media-src 'self' blob:).
(() => {
  function start() {
    const kino = document.querySelector('.kino');
    const video = kino && kino.querySelector('.kino-film');
    if (!video) return;
    const verbindung = navigator.connection || {};
    const ruhig = matchMedia('(prefers-reduced-motion: reduce)');
    if (ruhig.matches || verbindung.saveData) return;

    let bereit = false, ziel = 0, laeuft = false, sichtbar = true, url = '';

    // Fortschritt 0…1 über die ganze Höhe des Kinos (ohne die letzte Bühnenhöhe)
    const fortschritt = () => {
      const r = kino.getBoundingClientRect();
      const weg = r.height - Math.max(innerHeight, 34 * 16);
      return weg > 0 ? Math.min(1, Math.max(0, -r.top / weg)) : 0;
    };

    function takt() {
      laeuft = false;
      const f = fortschritt();
      kino.style.setProperty('--fortschritt', f.toFixed(4));
      if (!bereit) return;
      ziel = f * Math.max(0, video.duration - 0.05);
      // Sprünge bündeln: solange der Browser noch springt, nur den neuesten Wert merken
      if (!video.seeking && Math.abs(video.currentTime - ziel) > 0.01) video.currentTime = ziel;
    }
    const anstossen = () => { if (!laeuft && sichtbar) { laeuft = true; requestAnimationFrame(takt); } };
    video.addEventListener('seeked', () => {
      if (!kino.classList.contains('kino--film')) kino.classList.add('kino--film');
      if (Math.abs(video.currentTime - ziel) > 0.01) anstossen();
    });

    new IntersectionObserver(([e]) => { sichtbar = e.isIntersecting; if (sichtbar) anstossen(); }).observe(kino);
    addEventListener('scroll', anstossen, { passive: true });
    anstossen();

    // Erst nach „geladen“ holen, damit der Film nie mit dem ersten Bildschirm konkurriert
    const holen = () => {
      const handy = matchMedia('(max-width: 47.99rem), (pointer: coarse)').matches;
      // H.264 wo möglich (Safari/iOS), sonst VP9 (z. B. Chromium ohne H.264)
      const mp4 = video.canPlayType('video/mp4; codecs="avc1.4d401f"') !== '';
      const quelle = `${kino.dataset[handy ? 'filmHandy' : 'filmComputer']}.${mp4 ? 'mp4' : 'webm'}`;
      fetch(quelle).then((r) => { if (!r.ok) throw new Error(r.status); return r.blob(); }).then((b) => {
        url = URL.createObjectURL(b);
        video.src = url;
        video.addEventListener('loadeddata', () => { bereit = true; video.currentTime = 0.001; anstossen(); }, { once: true });
        video.load();
      }).catch(() => {});   // Poster bleibt stehen, kein erneuter Versuch
      // iOS: erst nach einer Berührung lässt sich im Video springen
      addEventListener('touchstart', () => { const p = video.play(); if (p) p.then(() => video.pause()).catch(() => {}); }, { once: true, passive: true });
    };
    if (document.readyState === 'complete') setTimeout(holen, 200); else addEventListener('load', () => setTimeout(holen, 200), { once: true });

    ruhig.addEventListener('change', (e) => { if (e.matches) { kino.classList.remove('kino--film'); bereit = false; } });
    addEventListener('pagehide', () => { if (url) URL.revokeObjectURL(url); }, { once: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
