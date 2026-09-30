// Zusatzskript der OSG-Neugestaltung. Die Seite funktioniert vollständig ohne JavaScript:
// Der Werkzeugfinder filtert per CSS (:has), das Formular ist ein normales POST-Formular.
// Hier nur Verbesserungen: Trefferzahl für Screenreader, Standzeit-Balken, Formular (Vorbelegung, Fehler am Feld, Sende-Zustand).
function start() {
  const wurzel = document.documentElement; // Klasse js setzt schon das Inline-Skript im Kopf
  if (location.hash === '#pruefen') wurzel.classList.add('pruefmodus');

  // Werkzeugfinder: sichtbare Trefferzahl in die Live-Region spiegeln (CSS zeigt sie, Screenreader hören sie)
  const finder = document.querySelector('.finder');
  const ansage = document.getElementById('finder-ansage');
  if (finder && ansage) {
    // Auswahl steht in der Adresse (?verfahren=…&werkstoff=…#finder): teilbar, bleibt beim Zurück erhalten (Jury R2)
    const q = new URLSearchParams(location.search);
    for (const [name, kurz] of [['verfahren', 'fv'], ['werkstoff', 'fw']]) {
      const r = document.getElementById(`${kurz}-${(q.get(name) || '').replace(/[^a-z-]/g, '')}`);
      if (r) r.checked = true;
    }
    finder.addEventListener('change', () => {
      const p = new URLSearchParams();
      for (const r of finder.querySelectorAll('input:checked')) if (r.value !== 'alle') p.set(r.name, r.value);
      history.replaceState(null, '', `${location.pathname}${p.size ? `?${p}` : ''}${location.hash}`);
      requestAnimationFrame(() => {
        const zahl = [...finder.querySelectorAll('.zahl')].find((z) => z.offsetParent !== null);
        const leer = finder.querySelector('.finder-leer');
        ansage.textContent = leer && leer.offsetParent !== null ? 'Keine Serie für diese Kombination. Die Anwendungstechnik hilft weiter.' : (zahl ? zahl.textContent : '');
      });
    });
  }

  // Standzeit-Balken wachsen einmal, wenn sie ins Bild kommen (bei „Bewegung reduzieren“ stehen sie sofort)
  const balken = document.querySelector('.balken');
  if (balken && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const beob = new IntersectionObserver(([e]) => {
      if (e.boundingClientRect.top > innerHeight * 0.85 && !balken.dataset.gesehen) { balken.classList.add('balken--warten'); balken.dataset.gesehen = '1'; return; }
      if (e.isIntersecting && e.intersectionRatio > 0.6) { balken.classList.remove('balken--warten'); beob.disconnect(); }
    }, { threshold: [0, 0.6, 1] });
    beob.observe(balken);
  }

  // Werkzeugfinder → Formular: die gewählte Bearbeitung und den Werkstoff mitnehmen
  for (const a of document.querySelectorAll('.finder-anfrage')) {
    a.addEventListener('click', () => {
      const wahl = [...document.querySelectorAll('.finder input:checked')].filter((r) => !/-alle$/.test(r.id))
        .map((r) => document.querySelector(`label[for="${r.id}"]`)?.textContent.trim()).filter(Boolean);
      if (wahl.length) a.href = `/kontakt?finder=${encodeURIComponent(wahl.join(', '))}#formular`;
    });
  }

  // Formular: Kontext aus der Adresse vorbelegen, eigene Fehlermeldungen am Feld, Sende-Zustand
  for (const form of document.querySelectorAll('form.formular')) {
    const q = new URLSearchParams(location.search);
    const text = form.elements.nachricht;
    const serie = (q.get('serie') || '').slice(0, 60); const finder = (q.get('finder') || '').slice(0, 120);
    if (text && !text.value && (serie || finder)) {
      text.value = serie ? `Anfrage zur ${serie}:\n` : `Werkzeugfinder – ${finder}:\n`;
      if (form.elements.anliegen) form.elements.anliegen.value = 'Anwendungsberatung';
      // Sichtbar oben im Formular, nicht nur im Nachrichtenfeld (Jury R2)
      const kontext = document.getElementById('formular-kontext');
      if (kontext) {
        kontext.textContent = serie ? `Ihre Anfrage zur ${serie}` : `Ihre Auswahl im Werkzeugfinder: ${finder}`;
        kontext.hidden = false;
      }
    }

    const MELDUNG = {
      name: 'Bitte geben Sie Ihren Namen an.',
      email: (f) => (f.validity.valueMissing ? 'Bitte geben Sie Ihre E-Mail-Adresse an.' : 'Bitte prüfen Sie die E-Mail-Adresse, z. B. name@firma.de.'),
      telefon: 'Bitte nur Ziffern, Leerzeichen, + und - verwenden.',
      nachricht: 'Bitte beschreiben Sie Ihr Anliegen in ein paar Worten.',
    };
    const zeige = (feld) => {
      const id = `${feld.id}-fehler`; let p = document.getElementById(id);
      const gut = feld.validity.valid;
      if (gut) feld.removeAttribute('aria-invalid'); else feld.setAttribute('aria-invalid', 'true');
      if (gut) { p?.remove(); feld.setAttribute('aria-describedby', (feld.getAttribute('aria-describedby') || '').replace(id, '').trim()); return true; }
      if (!p) {
        p = document.createElement('p'); p.id = id; p.className = 'feld-fehler'; feld.after(p);
        feld.setAttribute('aria-describedby', `${id} ${feld.getAttribute('aria-describedby') || ''}`.trim());
      }
      const m = MELDUNG[feld.name]; p.textContent = typeof m === 'function' ? m(feld) : (m || 'Bitte prüfen Sie dieses Feld.');
      return false;
    };
    form.noValidate = true;
    for (const feld of form.querySelectorAll('input:not([type="hidden"]):not([tabindex="-1"]), textarea')) {
      feld.addEventListener('blur', () => { if (feld.value) zeige(feld); });
      feld.addEventListener('input', () => { if (feld.hasAttribute('aria-invalid')) zeige(feld); });
    }
    form.addEventListener('submit', (e) => {
      const falsch = [...form.querySelectorAll('input:not([tabindex="-1"]), textarea')].filter((f) => !zeige(f));
      if (falsch.length) { e.preventDefault(); falsch[0].focus(); falsch[0].scrollIntoView({ block: 'center' }); return; }
      const knopf = form.querySelector('button[type="submit"]');
      form.classList.add('formular--sendet');
      if (knopf) { knopf.dataset.text ||= knopf.textContent; knopf.disabled = true; knopf.textContent = 'Wird gesendet …'; }
    });
    // Zurück aus dem Zwischenspeicher (z. B. von der Fehlerseite): Knopf wieder freigeben
    addEventListener('pageshow', () => {
      const knopf = form.querySelector('button[type="submit"]');
      form.classList.remove('formular--sendet');
      if (knopf?.dataset.text) { knopf.disabled = false; knopf.textContent = knopf.dataset.text; }
    });
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
