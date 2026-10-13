// Vorstellung (Unternehmensvideo): erster Besuch = Überblendung über der Startseite, danach nur per Knopf („Vorstellung ansehen“).
// Der Zustand „läuft“ (Klasse intro-offen an <html>) wird bei der Erstbesuch-Prüfung schon im Kopf gesetzt (Inline-Skript, CSP-Hash), damit die
// Seite nicht aufblitzt. Dieses Skript übernimmt dann: Merken, Bedienung, Ton, Überspringen und den weichen Übergang in die Seite.
// Zwei Modi (steht im HTML, data-modus): „film“ = echtes Video (Ton gleich an; sperrt der Browser, läuft er stumm und der Ton kommt bei der ersten Bedienung; kein Tonknopf, Lautstärke regelt das Gerät) · „platzhalter“ = animierte Titelsequenz mit Zeitgeber.
// Alle Werte setzt das Skript per Eigenschaft (style.setProperty, Web Animations) – kein Inline-Stil im HTML, die CSP bleibt streng.
(() => {
  const SCHLUESSEL = 'seitenkapitaen-vorstellung'; // gleicher Schlüssel wie im Kopf-Skript (bauen.mjs, INTRO_SKRIPT)
  const w = document.documentElement;
  const intro = document.getElementById('vorstellung');
  if (!intro) return;
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)');
  const film = intro.querySelector('.intro-film');
  const weiter = intro.querySelector('.intro-weiter');
  const marke = intro.querySelector('.intro-marke');
  const modusFilm = intro.dataset.modus === 'film' && film;

  let offen = false, schliesst = false, letzterFokus = null, zeitgeber = 0, haengt = 0;

  const merke = () => { try { localStorage.setItem(SCHLUESSEL, '1'); } catch { /* Speicher gesperrt: dann nur dieser Besuch */ } };
  const sperre = (an) => { for (const el of document.querySelectorAll('body > :not(#vorstellung):not(script)')) el.inert = an; };
  const kasten = (...teile) => { // gemeinsamer Rahmen mehrerer Elemente (Zeichen + Name der Marke)
    const r = teile.filter(Boolean).map((e) => e.getBoundingClientRect());
    const l = Math.min(...r.map((x) => x.left)), o = Math.min(...r.map((x) => x.top));
    return { left: l, top: o, width: Math.max(...r.map((x) => x.right)) - l, height: Math.max(...r.map((x) => x.bottom)) - o };
  };

  function fertig() {
    clearTimeout(zeitgeber); clearTimeout(haengt);
    intro.hidden = true;
    intro.classList.remove('intro--spielt');
    w.classList.remove('intro-geht');
    if (marke) marke.getAnimations().forEach((a) => a.cancel());
    sperre(false);
    if (film) { film.pause(); film.currentTime = 0; }
    offen = false; schliesst = false;
    if (letzterFokus && document.contains(letzterFokus)) letzterFokus.focus({ preventScroll: true });
    letzterFokus = null;
  }

  // Weicher Übergang: Seite wird sichtbar (Hero läuft an), der Name der Vorstellung wandert in die Kopfzeile
  function schliesse() {
    if (!offen || schliesst) return;
    schliesst = true;
    clearTimeout(zeitgeber); clearTimeout(haengt);
    sperre(false);
    w.classList.remove('intro-offen');
    w.classList.add('intro-geht');
    if (film) film.pause();
    if (ruhig.matches) { fertig(); return; }
    const ziel = document.querySelector('.kopf .marke');
    if (marke && ziel) {
      const von = kasten(marke.querySelector('.marke-kompass'), marke.querySelector('span'));
      const nach = kasten(ziel.querySelector('.marke-kompass'), ziel.querySelector('.marke-name'));
      const s = nach.width / von.width;
      marke.animate(
        [{ transform: 'none' }, { transform: `translate(${nach.left - von.left}px, ${nach.top - von.top}px) scale(${s})` }],
        { duration: 1150, easing: 'cubic-bezier(.45, .05, .25, 1)', fill: 'forwards' },
      ).finished.then(() => marke.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: 'forwards' })).catch(() => {});
    }
    setTimeout(fertig, 1500);
  }

  function oeffne() {
    if (offen) return;
    offen = true; schliesst = false;
    letzterFokus = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null;
    merke();
    // Animationen neu starten (beim zweiten Öffnen läuft die Titelsequenz wieder von vorn)
    intro.classList.remove('intro--spielt');
    intro.hidden = false;
    w.classList.remove('intro-geht');
    w.classList.add('intro-offen');
    void intro.offsetWidth;
    intro.classList.add('intro--spielt');
    if (marke) marke.getAnimations().forEach((a) => a.cancel());
    sperre(true);
    weiter.focus({ preventScroll: true });

    if (modusFilm) {
      setzeTon(false);
      // Hochformat (Handy): 9:16-Fassung statt Letterbox, einmalig umschalten
      if (film.dataset.hoch && !film.dataset.hochGesetzt && matchMedia('(orientation: portrait)').matches) {
        film.querySelectorAll('source').forEach((q) => q.remove());
        film.src = film.dataset.hoch;
        if (film.dataset.posterHoch) film.poster = film.dataset.posterHoch;
        film.dataset.hochGesetzt = '1';
        film.load();
      }
      film.currentTime = 0;
      // Lädt das Video nicht an (zu langsam, Fehler), gehört die Seite sofort dem Besucher
      haengt = setTimeout(schliesse, 6000);
      // Ton gleich mit: der Browser erlaubt es nach einem Klick (Knopf „Vorstellung ansehen“) oder bei bekannten Besuchern.
      // Sperrt er es (erster Besuch ohne Klick), läuft der Film stumm los und der Ton schaltet sich beim ersten Tippen, Klicken oder Tastendruck zu.
      film.play().catch(() => { setzeTon(true); return film.play(); }).catch(schliesse);
    } else {
      const sek = Number(intro.dataset.dauer) || 7;
      intro.style.setProperty('--intro-dauer', `${sek}s`);
      if (!ruhig.matches) zeitgeber = setTimeout(schliesse, sek * 1000); // bei „Bewegung reduzieren“ bleibt das Standbild, bis es übersprungen wird
    }
  }

  const setzeTon = (stumm) => { film.muted = stumm; };
  const tonBeiBedienung = () => { if (offen && !schliesst && film.muted) setzeTon(false); }; // erste Bedienung nach stummem Start schaltet den Ton zu
  weiter.addEventListener('click', schliesse);
  if (modusFilm) for (const ev of ['click', 'keydown', 'touchend']) document.addEventListener(ev, tonBeiBedienung, true);
  if (film) {
    film.addEventListener('playing', () => clearTimeout(haengt));
    film.addEventListener('ended', schliesse);
    film.addEventListener('error', schliesse, true);
    film.addEventListener('timeupdate', () => { if (film.duration) intro.style.setProperty('--fortschritt', String(film.currentTime / film.duration)); });
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && offen) schliesse(); });
  document.addEventListener('visibilitychange', () => { if (film && offen && !schliesst) { if (document.hidden) film.pause(); else film.play().catch(() => {}); } });
  document.addEventListener('click', (e) => {
    const knopf = e.target instanceof Element && e.target.closest('[data-vorstellung-oeffnen]');
    if (!knopf || offen) return;
    e.preventDefault();
    oeffne();
  });

  intro.dataset.bereit = '';
  // Erster Besuch: das Kopf-Skript hat intro-offen schon gesetzt, jetzt übernimmt dieses Skript
  if (w.classList.contains('intro-offen')) {
    w.classList.remove('intro-offen'); // oeffne() setzt den Zustand sauber neu
    oeffne();
    try { if (location.search.includes('intro=1')) history.replaceState(null, '', location.pathname + location.hash); } catch { /* Vorschau ohne History-Zugriff */ }
  }
})();
