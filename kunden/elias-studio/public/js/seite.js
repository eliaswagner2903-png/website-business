// Seitenskript der Portfolio-Seite. Die Seite funktioniert vollständig ohne JavaScript.
// Menü, Einblenden und Seitenwechsel kommen aus js/bausteine.js (erzeugt von bausteine/einbauen.mjs), der Film aus js/kino.js.
(() => {
  // Nacht (Standard) / Licht: Schema „licht“ aus marke.css, gemerkt im Browser (Kopf-Skript setzt es vor dem ersten Bild)
  function schema() {
    const knopf = document.querySelector('.schema-knopf');
    if (!knopf) return;
    const wurzel = document.documentElement;
    const farbe = document.querySelector('meta[name="theme-color"]');
    const zeigen = () => {
      const nacht = wurzel.getAttribute('data-schema') !== 'licht';
      knopf.setAttribute('aria-pressed', String(nacht));
      if (farbe) farbe.content = getComputedStyle(wurzel).getPropertyValue('--farbe-grund').trim();
    };
    knopf.addEventListener('click', () => {
      const licht = wurzel.getAttribute('data-schema') !== 'licht';
      if (licht) wurzel.setAttribute('data-schema', 'licht'); else wurzel.removeAttribute('data-schema');
      try { localStorage.setItem('oq-schema', licht ? 'licht' : 'nacht'); } catch {}
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

  // Konfigurator: Vorschläge je Business, Regler 1–5 mit Stufentext, Zahlung verlangt Sicherheit ≥ 4, Zusammenfassung oben und im Formular
  function konfigurator() {
    const k = document.querySelector('.konfig');
    const form = document.getElementById('kontaktformular');
    if (!k || !form) return;
    const felder = [...document.querySelectorAll('input[form="kontaktformular"]')];
    const regler = felder.filter((f) => f.type === 'range');
    const titel = (input) => input.closest('label').querySelector('.wahl-titel').textContent;
    const stufen = (r) => [...r.closest('fieldset').querySelectorAll('.stufen-liste li')];
    const bereich = (r) => r.closest('fieldset').querySelector('legend').lastChild.textContent.trim();
    const regel = k.querySelector('.konfig-regel');
    const sicherheit = document.getElementById('k-stufe-sicherheit');
    const zusammen = [k.querySelector('.konfig-zusammen'), form.querySelector('.kontakt-auswahl')];
    const summe = k.querySelector('.einstufung-summe');
    const modell = k.querySelector('.vorschau-seite');

    function zeigeRegler(r) {
      const n = Number(r.value);
      const li = stufen(r);
      li.forEach((l, i) => l.classList.toggle('ist', i === n - 1));
      const name = li[n - 1].querySelector('strong').textContent;
      r.setAttribute('aria-valuetext', `Stufe ${n} von 5: ${name}`);
      r.style.setProperty('--anteil', `${(n - 1) * 25}%`);
      const reihe = k.querySelector(`.einstufung-reihe[data-stufe="${r.id.replace('k-stufe-', '')}"]`);
      if (reihe) reihe.dataset.wert = n;
      const id = r.id.replace('k-stufe-', '');
      modell.dataset[id] = n;
      const siegel = k.querySelector(`.siegel--${id === 'sicherheit' ? 'schutz' : id} b`);
      if (siegel) siegel.textContent = n;
      return `${bereich(r)} <strong>${n}</strong> (${name})`;
    }
    function pruefeSicherheit() {
      const mindestens = Math.max(1, ...felder.filter((f) => f.checked && f.dataset.sicher).map((f) => Number(f.dataset.sicher)));
      if (Number(sicherheit.value) < mindestens) sicherheit.value = mindestens;
      regel.hidden = mindestens === 1;
    }
    function schreibe() {
      const gewaehlt = (name) => felder.filter((f) => f.name === name && f.checked).map(titel);
      const bausteine = gewaehlt('bausteine[]');
      const einstufung = regler.map(zeigeRegler);
      if (summe) summe.textContent = `${regler.reduce((a, r) => a + Number(r.value), 0)} von ${regler.length * 5}`;
      const text = `Ihre Auswahl: <strong>${gewaehlt('branche')}</strong>, Farbe <strong>${gewaehlt('farbe')}</strong>, Schrift <strong>${gewaehlt('stil')}</strong>. `
        + `Ihre Einstufung: ${einstufung.join(', ')}.`
        + (bausteine.length ? ` Funktionen: ${bausteine.map((b) => `<strong>${b}</strong>`).join(', ')}.` : '');
      for (const z of zusammen) if (z) z.innerHTML = text;   // nur Texte aus dem eigenen HTML, keine Eingaben des Besuchers
    }
    const neu = (e) => {
      const f = e.target;
      if (e.type === 'change' && f.name === 'branche') {
        const vorschlag = f.dataset.vorschlag.split(' ');
        for (const b of felder.filter((x) => x.name === 'bausteine[]' && !x.dataset.sicher)) b.checked = vorschlag.includes(b.id.replace('k-bausteine-', ''));
      }
      pruefeSicherheit();
      schreibe();
    };
    k.addEventListener('change', neu);
    k.addEventListener('input', neu);
    pruefeSicherheit();
    schreibe();
  }

  // Generator: ein Schritt nach dem anderen an festem Ort (Reiter nach dem WAI-Muster „Tabs“, dazu Zurück/Weiter)
  function generator() {
    const g = document.querySelector('.generator');
    const reiter = g ? [...g.querySelectorAll('[role="tab"]')] : [];
    if (!reiter.length) return;
    const tafeln = reiter.map((r) => document.getElementById(r.getAttribute('aria-controls')));
    const bereich = g.querySelector('.gen-bereich');
    const zurueck = g.querySelector('.gen-zurueck');
    const weiter = g.querySelector('.gen-weiter');
    const stand = g.querySelector('.gen-stand-text');
    const n = reiter.length;
    let jetzt = 0;
    g.classList.add('generator--gefuehrt');
    tafeln.forEach((t, i) => { t.setAttribute('role', 'tabpanel'); t.setAttribute('aria-labelledby', reiter[i].id); });
    const waehle = (i, { fokus = false, rollen = true } = {}) => {
      reiter[jetzt].classList.add('gen-tab--fertig');
      jetzt = i;
      reiter.forEach((r, j) => { r.setAttribute('aria-selected', String(i === j)); r.tabIndex = i === j ? 0 : -1; });
      tafeln.forEach((t, j) => { t.hidden = i !== j; });
      zurueck.disabled = i === 0;
      weiter.firstChild.textContent = i === n - 1 ? 'Zur Anfrage ' : 'Weiter ';
      stand.textContent = `${i + 1} von ${n}`;
      g.style.setProperty('--gen-anteil', ((i + 1) / n).toFixed(3));
      if (fokus) reiter[i].focus();
      // Reiterleiste seitlich nachführen; die Seite nur zurückholen, wenn der Schritt oben unter Reiter/Modell verschwunden ist
      const l = reiter[i].parentElement;
      l.scrollLeft = Math.max(0, reiter[i].offsetLeft - l.offsetLeft - 48);
      if (rollen) {
        const oben = parseFloat(getComputedStyle(bereich).scrollMarginTop) || 0;
        if (bereich.getBoundingClientRect().top < oben - 1) bereich.scrollIntoView({ block: 'start' });
      }
    };
    reiter.forEach((r, i) => {
      r.addEventListener('click', () => waehle(i));
      r.addEventListener('keydown', (e) => {
        const ziel = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
        if (ziel === undefined) return;
        e.preventDefault();
        waehle(ziel, { fokus: true });
      });
    });
    zurueck.addEventListener('click', () => waehle(Math.max(0, jetzt - 1)));
    weiter.addEventListener('click', () => {
      if (jetzt < n - 1) { waehle(jetzt + 1); return; }
      reiter[jetzt].classList.add('gen-tab--fertig');
      document.getElementById('kontakt').scrollIntoView();
      document.getElementById('k-name').focus({ preventScroll: true });
    });
    waehle(0, { rollen: false });
  }

  function start() {
    const pruefen = () => document.documentElement.classList.toggle('pruefmodus', location.hash === '#pruefen');
    pruefen();
    addEventListener('hashchange', pruefen);
    schema();
    buehne();
    generator();
    konfigurator();
    // Formular: eigene deutsche Meldungen je Feld (statt Browser-Sprechblase), dann doppelte Klicks verhindern
    const meldung = (f) => {
      const v = f.validity;
      if (v.valid) return '';
      if (f.type === 'email' && !v.valueMissing) return 'Diese E-Mail-Adresse scheint nicht zu stimmen.';
      if (f.name === 'name') return 'Bitte geben Sie Ihren Namen an.';
      if (f.type === 'email') return 'Bitte geben Sie Ihre E-Mail-Adresse an.';
      if (v.tooShort) return 'Bitte schreiben Sie ein paar Worte mehr.';
      return 'Bitte schreiben Sie kurz, worum es geht.';
    };
    const zeige = (f) => {
      const text = meldung(f);
      let el = document.getElementById(`${f.id}-fehler`);
      if (!el) {
        el = document.createElement('span');
        el.id = `${f.id}-fehler`; el.className = 'feld-fehler';
        f.insertAdjacentElement('afterend', el);
        f.setAttribute('aria-describedby', el.id);
      }
      el.textContent = text;
      if (text) f.setAttribute('aria-invalid', 'true'); else f.removeAttribute('aria-invalid');
      return !text;
    };
    for (const form of document.querySelectorAll('.formular')) {
      form.noValidate = true;
      const felder = [...form.querySelectorAll('input[required], textarea[required]')];
      for (const f of felder) f.addEventListener('input', () => { if (f.hasAttribute('aria-invalid')) zeige(f); });
      form.addEventListener('submit', (e) => {
        const falsch = felder.filter((f) => !zeige(f));
        if (falsch.length) { e.preventDefault(); falsch[0].focus(); return; }
        const b = form.querySelector('button'); if (b) { b.disabled = true; b.textContent = 'Einen Moment …'; }
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
