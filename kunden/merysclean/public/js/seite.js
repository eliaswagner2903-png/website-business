// Merys Clean – kleine Helfer. Ohne JavaScript funktioniert alles (Menü als Zeile, Panel per Fokus, Formular mit
// Browser-Prüfung); dieses Skript verbessert nur: Escape schließt das Leistungen-Panel, Vorauswahl der Leistung aus
// ?leistung=…, Fehlermeldungen als Text direkt am Feld, Zustand „wird gesendet“, Bühne und Siegel kippen leicht mit
// dem Zeiger, das Leistungsbild wechselt mit der gezeigten oder durchscrollten Zeile.
(() => {
  function panel() {
    const li = document.querySelector('.nav-leistungen');
    if (!li) return;
    const oben = li.querySelector('.nav-oben');
    li.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !matchMedia('(min-width: 64rem)').matches) return;
      li.classList.add('panel--zu');
      oben.focus();
    });
    const auf = () => li.classList.remove('panel--zu');
    li.addEventListener('mouseleave', auf);
    li.addEventListener('focusout', (e) => { if (!li.contains(e.relatedTarget)) auf(); });
  }

  const MELDUNG = {
    leistung: 'Bitte wählen Sie eine Leistung.',
    objektart: 'Bitte wählen Sie die Art des Objekts.',
    flaeche: 'Bitte nur Ziffern angeben, zum Beispiel 120.',
    ort: 'Bitte Postleitzahl und Ort angeben.',
    name: 'Bitte geben Sie Ihren Namen an.',
    telefon: 'Bitte eine Telefonnummer angeben (Ziffern, Leerzeichen, +, / oder -).',
    email: 'Bitte eine gültige E-Mail-Adresse angeben oder das Feld leer lassen.',
    datenschutz: 'Bitte bestätigen Sie, dass wir Ihre Angaben verwenden dürfen.',
  };

  function formular() {
    const form = document.getElementById('formular');
    if (!form) return;
    const knopf = form.querySelector('button[type="submit"]');
    const knopfText = knopf.textContent;

    // Vorauswahl aus dem Link einer Leistungsseite (/angebot?leistung=fensterreinigung)
    const id = new URLSearchParams(location.search).get('leistung');
    const wahl = id && form.querySelector(`#leistung option[data-id="${CSS.escape(id)}"]`);
    if (wahl) wahl.selected = true;

    form.noValidate = true; // eigene Meldungen statt Browser-Blasen (die Prüfung selbst bleibt die des Browsers)
    const fehlerAus = (feld) => {
      feld.removeAttribute('aria-invalid');
      document.getElementById(`${feld.id}-fehler`)?.remove();
      const hilfe = document.getElementById(`${feld.id}-hilfe`) ? `${feld.id}-hilfe` : '';
      if (hilfe) feld.setAttribute('aria-describedby', hilfe); else feld.removeAttribute('aria-describedby');
    };
    const fehlerAn = (feld) => {
      fehlerAus(feld);
      const p = document.createElement('p');
      p.className = 'feld-fehler';
      p.id = `${feld.id}-fehler`;
      p.textContent = MELDUNG[feld.name] || 'Bitte prüfen Sie dieses Feld.';
      const ziel = feld.type === 'checkbox' ? feld.closest('.feld') : feld.parentElement;
      ziel.append(p);
      feld.setAttribute('aria-invalid', 'true');
      feld.setAttribute('aria-describedby', [feld.getAttribute('aria-describedby'), p.id].filter(Boolean).join(' '));
    };
    form.addEventListener('input', (e) => { if (e.target.validity?.valid) fehlerAus(e.target); });
    form.addEventListener('change', (e) => { if (e.target.validity?.valid) fehlerAus(e.target); });
    form.addEventListener('submit', (e) => {
      const falsch = [...form.elements].filter((f) => f.willValidate && f.name !== 'firma_url' && !f.validity.valid);
      [...form.elements].forEach((f) => f.willValidate && f.validity.valid && fehlerAus(f));
      if (falsch.length) {
        e.preventDefault();
        falsch.forEach(fehlerAn);
        falsch[0].focus();
        return;
      }
      knopf.setAttribute('aria-busy', 'true');
      knopf.textContent = 'Wird gesendet …';
      setTimeout(() => { knopf.disabled = true; }, 0); // erst nach dem Absenden sperren: verhindert Doppelklicks
    });
    // Zurück aus dem Verlauf (bfcache): Knopf wieder bedienbar
    addEventListener('pageshow', () => { knopf.disabled = false; knopf.removeAttribute('aria-busy'); knopf.textContent = knopfText; });
  }

  // [data-kippen]: dreht sich höchstens 5° zum Zeiger (nur Maus, nicht bei „Bewegung reduzieren“). Ruhig: Werte nur je Bild.
  function kippen() {
    if (!matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
    for (const el of document.querySelectorAll('[data-kippen]')) {
      const flaeche = el.closest('section') || el;
      let rahmen = 0;
      flaeche.addEventListener('pointermove', (e) => {
        if (rahmen) return;
        rahmen = requestAnimationFrame(() => {
          rahmen = 0;
          const r = el.getBoundingClientRect();
          const x = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / (r.width / 2)));
          const y = Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / (r.height / 2)));
          el.classList.add('kippt');
          el.style.setProperty('--_ry', `${(x * 5).toFixed(2)}deg`);
          el.style.setProperty('--_rx', `${(-y * 4).toFixed(2)}deg`);
          el.style.setProperty('--_glanz', (x * 30).toFixed(1));
        });
      });
      flaeche.addEventListener('pointerleave', () => { el.style.setProperty('--_rx', '0deg'); el.style.setProperty('--_ry', '0deg'); el.style.setProperty('--_glanz', '0'); });
    }
  }

  // Startseite: die aktive Leistung wird zum schwarzen Band und ihr Bild wischt herein. Aktiv wird, was gezeigt oder
  // fokussiert wird, sonst die Zeile, die beim Scrollen durch die Mitte des Bildschirms läuft.
  function leistungsbilder() {
    const bilder = document.querySelectorAll('.leistungen-bild');
    const zeilen = [...document.querySelectorAll('.leistung-zeilen > li')];
    if (!bilder.length || !zeilen.length) return;
    // Handy und Tablet: jede Zeile hat ihr eigenes festes Bild – kein Wechselbild, das beim Wischen flackert
    if (!matchMedia('(min-width: 64rem)').matches) return;
    const aktiv = (i) => {
      zeilen.forEach((z, j) => z.classList.toggle('ist-aktiv', j === i));
      bilder.forEach((b, j) => b.classList.toggle('ist-aktiv', j === i));
    };
    const zeige = (e) => { const z = e.target.closest('.leistung-zeilen > li'); if (z) aktiv(zeilen.indexOf(z)); };
    const liste = document.querySelector('.leistung-zeilen');
    let zeiger = false;
    liste.addEventListener('pointerover', zeige);
    liste.addEventListener('focusin', zeige);
    liste.addEventListener('pointerenter', () => { zeiger = true; });
    liste.addEventListener('pointerleave', () => { zeiger = false; });
    if (!('IntersectionObserver' in window)) return;
    // Scrollen übernimmt nicht, solange Zeiger oder Tastaturfokus in der Liste sind
    const io = new IntersectionObserver((eintraege) => {
      if (zeiger || liste.contains(document.activeElement)) return;
      for (const e of eintraege) if (e.isIntersecting) aktiv(zeilen.indexOf(e.target));
    }, { rootMargin: '-45% 0px -45% 0px' });
    zeilen.forEach((z) => io.observe(z));
  }

  // Schnellleiste (Handy): erst einblenden, wenn die Knöpfe im Seitenkopf aus dem Bild sind, damit sie nichts verdeckt
  function schnellleiste() {
    const leiste = document.querySelector('.schnell');
    const wege = document.querySelector('main .wege');
    if (!leiste) return;
    if (!wege || !('IntersectionObserver' in window)) { leiste.classList.remove('ist-versteckt'); return; }
    leiste.classList.add('ist-versteckt');
    new IntersectionObserver(([e]) => {
      leiste.classList.toggle('ist-versteckt', e.isIntersecting || e.boundingClientRect.top > 0);
    }).observe(wege);
  }

  function start() { panel(); formular(); kippen(); leistungsbilder(); schnellleiste(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
