// Seitenskript der Portfolio-Seite. Die Seite funktioniert vollständig ohne JavaScript.
// Menü, Einblenden und Seitenwechsel kommen aus js/bausteine.js (erzeugt von bausteine/einbauen.mjs), der Film aus js/kino.js.
(() => {
  // Startseite: Schnellleiste erst zeigen, wenn die Knöpfe im Hero aus dem Bild sind
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

  // Tag/Nacht: Schema „nacht“ aus marke.css, gemerkt im Browser (Kopf-Skript setzt es vor dem ersten Bild)
  function schema() {
    const knopf = document.querySelector('.schema-knopf');
    if (!knopf) return;
    const wurzel = document.documentElement;
    const farbe = document.querySelector('meta[name="theme-color"]');
    const zeigen = () => {
      const nacht = wurzel.getAttribute('data-schema') === 'nacht';
      knopf.setAttribute('aria-pressed', String(nacht));
      if (farbe) farbe.content = getComputedStyle(wurzel).getPropertyValue('--farbe-grund').trim();
    };
    knopf.addEventListener('click', () => {
      const nacht = wurzel.getAttribute('data-schema') !== 'nacht';
      if (nacht) wurzel.setAttribute('data-schema', 'nacht'); else wurzel.removeAttribute('data-schema');
      try { localStorage.setItem('oq-schema', nacht ? 'nacht' : 'licht'); } catch {}
      zeigen();
    });
    zeigen();
  }

  // Bühne: Reiter nach dem WAI-Muster „Tabs“ (Pfeiltasten, Pos1/Ende), Anker #arbeit-… öffnet den passenden Reiter
  function buehne() {
    const b = document.querySelector('.buehne');
    const reiter = b ? [...b.querySelectorAll('[role="tab"]')] : [];
    if (!reiter.length) return;
    const tafeln = reiter.map((r) => document.getElementById(r.getAttribute('aria-controls')));
    b.classList.add('buehne--aktiv');
    for (const [i, t] of tafeln.entries()) { t.setAttribute('role', 'tabpanel'); t.setAttribute('aria-labelledby', reiter[i].id); t.tabIndex = -1; }
    const waehle = (i, { fokus = false, rein = true } = {}) => {
      reiter.forEach((r, j) => { r.setAttribute('aria-selected', String(i === j)); r.tabIndex = i === j ? 0 : -1; });
      tafeln.forEach((t, j) => {
        t.hidden = i !== j;
        t.classList.toggle('werk--rein', rein && i === j);
      });
      if (fokus) reiter[i].focus();
      // schmale Reiterleiste: gewählten Reiter seitlich ins Bild holen (nur die Leiste scrollt, nie die Seite)
      if (rein) { const l = reiter[i].parentElement; l.scrollLeft = Math.max(0, reiter[i].offsetLeft - l.offsetLeft - 16); }
    };
    reiter.forEach((r, i) => {
      r.addEventListener('click', () => waehle(i));
      r.addEventListener('keydown', (e) => {
        const n = reiter.length;
        const ziel = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
        if (ziel === undefined) return;
        e.preventDefault();
        waehle(ziel, { fokus: true });
      });
    });
    const ausAnker = () => {
      const i = tafeln.findIndex((t) => `#${t.id}` === location.hash);
      if (i >= 0) { waehle(i, { rein: false }); b.scrollIntoView(); }
    };
    waehle(0, { rein: false });
    ausAnker();
    addEventListener('hashchange', ausAnker);
  }

  // Konfigurator: Vorschläge je Betrieb, Zahlung verlangt Sicherheit „Hoch“, Zusammenfassung oben und im Formular
  function konfigurator() {
    const k = document.querySelector('.konfig');
    const form = document.getElementById('kontaktformular');
    if (!k || !form) return;
    const felder = [...document.querySelectorAll('input[form="kontaktformular"]')];
    const titel = (input) => input.closest('label').querySelector('.wahl-titel').textContent;
    const regel = k.querySelector('.konfig-regel');
    const zusammen = [k.querySelector('.konfig-zusammen'), form.querySelector('.kontakt-auswahl')];

    function pruefeSicherheit() {
      const braucht = felder.some((f) => f.checked && f.dataset.sicher === 'hoch');
      const hoch = document.getElementById('k-sicherheit-hoch');
      for (const f of felder.filter((f) => f.name === 'sicherheit' && f !== hoch)) f.disabled = braucht;
      if (braucht && !hoch.checked) { hoch.checked = true; regel.hidden = false; }
      if (!braucht) regel.hidden = true;
    }
    function schreibe() {
      const gewaehlt = (name) => felder.filter((f) => f.name === name && f.checked).map(titel);
      const bausteine = gewaehlt('bausteine[]');
      const text = `Ihre Auswahl: <strong>${gewaehlt('stil')}</strong> in <strong>${gewaehlt('farbe')}</strong> für <strong>${gewaehlt('branche')}</strong>`
        + `, Sicherheit <strong>${gewaehlt('sicherheit')}</strong>`
        + (bausteine.length ? `, mit ${bausteine.map((b) => `<strong>${b}</strong>`).join(', ')}.` : '.');
      for (const z of zusammen) if (z) z.innerHTML = text;   // nur Titel aus dem eigenen HTML, keine Eingaben des Besuchers
    }
    k.addEventListener('change', (e) => {
      const f = e.target;
      if (f.name === 'branche') {
        const vorschlag = f.dataset.vorschlag.split(' ');
        for (const b of felder.filter((x) => x.name === 'bausteine[]' && !x.dataset.sicher)) b.checked = vorschlag.includes(b.id.replace('k-bausteine-', ''));
      }
      pruefeSicherheit();
      schreibe();
    });
    pruefeSicherheit();
    schreibe();
  }

  function start() {
    const pruefen = () => document.documentElement.classList.toggle('pruefmodus', location.hash === '#pruefen');
    pruefen();
    addEventListener('hashchange', pruefen);
    leiste();
    schema();
    buehne();
    konfigurator();
    // Doppelte Formular-Klicks verhindern
    for (const form of document.querySelectorAll('.formular')) {
      form.addEventListener('submit', () => { const b = form.querySelector('button'); if (b) { b.disabled = true; b.textContent = 'Einen Moment …'; } });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
