// Merys Clean – kleine Helfer. Ohne JavaScript funktioniert alles (Menü als Zeile, Panel per Fokus, Formular mit
// Browser-Prüfung); dieses Skript verbessert nur: Escape schließt das Leistungen-Panel, Vorauswahl der Leistung aus
// ?leistung=…, Fehlermeldungen als Text direkt am Feld, Zustand „wird gesendet“.
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

  function start() { panel(); formular(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
