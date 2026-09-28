// Erzeugt alle HTML-Seiten der Demo „Zwischenbild“ aus inhalt.mjs.
//   node bauen.mjs           → schreibt public/*.html
//   import { seiten } from './bauen.mjs'  → liefert { datei: html } (für den Test „gebaut = aktuell“)
// HTML nie von Hand ändern, sondern hier bzw. in inhalt.mjs.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { studio, start, projekte, handwerk, leistungen, ablauf, kontakt } from './inhalt.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nr = (i) => String(i + 1).padStart(2, '0');
const r = (n) => Math.round(n * 10) / 10;

// ---------- Kurven: Zwischenbilder nach cubic-bezier verteilen ----------
function bezier([x1, y1, x2, y2]) {
  const b = (a, c, s) => 3 * a * s * (1 - s) ** 2 + 3 * c * s * s * (1 - s) + s ** 3;
  return (u) => { let lo = 0, hi = 1; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; b(x1, x2, m) < u ? (lo = m) : (hi = m); } return b(y1, y2, (lo + hi) / 2); };
}

// ---------- Plakate der (ausgedachten) Projekte als SVG, t = Zeitpunkt 0…1 ----------
function zufall(saat) { let x = saat; return () => ((x = (x * 16807) % 2147483647) / 2147483647); }

const plakate = {
  brausewerk(t, f) {
    const z = zufall(7); let blasen = '';
    for (let i = 0; i < 16; i++) {
      const x = 120 + z() * 560, r0 = 6 + z() * 22, y = ((720 - z() * 600 - t * 260) % 640 + 640) % 640 + 80;
      blasen += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(r0)}" fill="none" stroke="${f.zwei}" stroke-width="4" opacity="${r(0.35 + z() * 0.6)}"/>`;
    }
    let zacken = ''; const n = 21, R = 170, ri = 150;
    for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2, rr = i % 2 ? ri : R; zacken += `${i ? 'L' : 'M'}${r(Math.cos(a) * rr)},${r(Math.sin(a) * rr)}`; }
    const hub = -t * 70, dreh = t * 38;
    return `<rect width="800" height="800" fill="${f.grund}"/>${blasen}
<g transform="translate(400 ${r(500 + hub)}) rotate(${r(dreh)})"><path d="${zacken}Z" fill="${f.eins}"/><circle r="118" fill="none" stroke="${f.grund}" stroke-width="5"/></g>
<text x="400" y="${r(512 + hub)}" text-anchor="middle" class="p-breit" font-size="64" fill="${f.grund}">MOLL</text>
<text x="400" y="262" text-anchor="middle" class="p-schmal" font-size="150" fill="${f.zwei}">Brause</text>`;
  },
  hallenbad(t, f) {
    let kacheln = ''; const n = 12, g = 800 / n;
    for (let c = 0; c < n; c++) {
      const welle = 5.2 + 2.3 * Math.sin(c * 0.62 + t * Math.PI * 1.5);
      for (let z = 0; z < n; z++) {
        const d = Math.abs(z - welle), an = d < 0.7 ? f.eins : d < 1.6 ? '#2f78b8' : '#0f5597';
        kacheln += `<rect x="${r(c * g + 3)}" y="${r(z * g + 3)}" width="${r(g - 6)}" height="${r(g - 6)}" rx="4" fill="${an}"/>`;
      }
    }
    return `<rect width="800" height="800" fill="${f.grund}"/>${kacheln}
<rect x="96" y="470" width="608" height="178" rx="8" fill="${f.grund}"/>
<text x="400" y="548" text-anchor="middle" class="p-breit" font-size="70" fill="${f.zwei}">WIEDER</text>
<text x="400" y="626" text-anchor="middle" class="p-breit" font-size="70" fill="${f.eins}">OFFEN</text>`;
  },
  rauschen(t, f) {
    let balken = ''; const n = 34;
    const pegel = (i) => Math.abs(Math.sin(i * 0.47 + t * 4) * 0.7 + Math.sin(i * 1.3 - t * 3) * 0.3);
    for (let i = 0; i < n; i++) { const h = 30 + pegel(i) * 250; balken += `<rect x="${r(90 + i * 18.4)}" y="${r(330 - h / 2)}" width="10" height="${r(h)}" rx="5" fill="${f.eins}"/>`; }
    const stufen = ['s1', 's2', 's3', 's4', 's5'];
    const wort = 'RAUSCHEN'.split('').map((b, i) => `<tspan class="${stufen[Math.min(4, Math.floor(pegel(i * 4.2) * 5))]}">${b}</tspan>`).join('');
    return `<rect width="800" height="800" fill="${f.grund}"/>${balken}
<text x="400" y="600" text-anchor="middle" class="p-welle" font-size="96" fill="${f.zwei}">${wort}</text>`;
  },
};
const plakat = (p, t, beschreibung) =>
  `<svg class="plakat" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(beschreibung)}">${plakate[p.slug](t, p.farben)}</svg>`;

// ---------- Optischer Randausgleich ----------
// Linke Vorbreite der ersten Glyphe (gemessen mit measureText, Archivo 800 / 125 %), in 1/1000 em.
// Große Zeilen rücken um diesen Betrag nach links, damit Stämme bündig mit der Spitze des „W“ stehen.
const VORBREITE = { L: 78, D: 78, H: 78, B: 78, b: 62, l: 62, k: 62, h: 62, S: 46, d: 31, a: 31, s: 31, e: 31, z: 15 };
const lsb = (text) => { const v = VORBREITE[String(text).trim()[0]]; return v ? ` lsb-${v}` : ''; };

// ---------- Bausteine ----------
const icon = {
  tel: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5h3l1.4 4.3-2 1.5a12 12 0 0 0 5.7 5.7l1.5-2 4.3 1.4v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  pfeil: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  zurueck: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H6M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  menue: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  zu: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
};
const pruefTel = 'data-pruefen="Ausgedachte Telefonnummer (Demo)"';
const pruefMail = 'data-pruefen="Ausgedachte Adresse, Domain .example (Demo)"';
const telLink = (klasse = '', mitIcon = false) => `<a class="${klasse}" href="${studio.telefonLink}" ${pruefTel}>${mitIcon ? `${icon.tel}<span class="kopf-tel-nr">` : ''}${studio.telefonAnzeige.replace(/ /g, '&nbsp;')}${mitIcon ? '</span>' : ''}</a>`;
const mailLink = (klasse = '') => `<a class="${klasse}" href="mailto:${studio.email}" ${pruefMail}>${studio.email.replace('@', '<wbr>@')}</a>`;
const navPunkte = [['/#arbeiten', 'Arbeiten'], ['/#handwerk', 'Handwerk'], ['/#leistungen', 'Leistungen'], ['/#ablauf', 'Ablauf'], ['/#kontakt', 'Kontakt']];

function kopf({ titel, beschreibung, pfad, robots = 'index, follow' }) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titel)}</title>
<meta name="description" content="${esc(beschreibung)}">
<meta name="robots" content="${robots}">
<meta name="theme-color" content="#f1ede4">
<meta property="og:title" content="${esc(titel)}">
<meta property="og:description" content="${esc(beschreibung)}">
<meta property="og:type" content="website">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/archivo-latin-wdth.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/jetbrains-mono-basis.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/marke.css">
<link rel="stylesheet" href="/css/stil.css">
<script>document.documentElement.classList.add('js')</script>
<script src="/js/seite.js" defer></script>
</head>
<body data-seite="${pfad}">
<div id="pruefen"></div>
<a class="sprung" href="#inhalt">Zum Inhalt springen</a>
<p class="demo-band"><span class="demo-band-marke">Demo</span> <span>${esc(studio.demoHinweis)}</span></p>
<header class="kopf">
  <a class="wortmarke" href="/" aria-label="${esc(studio.name)}, zur Startseite">${studio.wortmarke[0]}<span class="wortmarke-strich">/</span>${studio.wortmarke[1]}</a>
  <nav class="nav" aria-label="Hauptnavigation">
    <ul>${navPunkte.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul>
  </nav>
  ${telLink('kopf-tel', true)}
</header>
`;
}

function fuss() {
  return `<footer class="fuss">
  <div class="huelle fuss-raster">
    <p class="fuss-marke" aria-hidden="true">${studio.wortmarke[0]}<span class="wortmarke-strich">/</span>${studio.wortmarke[1]}</p>
    <p class="fuss-demo"><span class="demo-band-marke">Demo</span> ${esc(studio.demoLang)}</p>
    <ul class="fuss-links">
      ${navPunkte.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}
    </ul>
    <ul class="fuss-links">
      <li><a href="/impressum.html">Impressum</a></li>
      <li><a href="/datenschutz.html">Datenschutz</a></li>
    </ul>
    <p class="fuss-klein">© 2026 ${esc(studio.name)} – ein ausgedachtes Studio. Gebaut als Beispiel für Typografie und Bewegung im Web.</p>
  </div>
</footer>
<div class="schnell">
  <a class="knopf schnell-haupt" href="/#kontakt">Projekt anfragen</a>
  <a class="schnell-rund" href="${studio.telefonLink}" ${pruefTel}>${icon.tel}<span class="nur-lesbar">Anrufen:&nbsp;${studio.telefonAnzeige.replace(/ /g, '&nbsp;')}</span></a>
  <button class="schnell-rund menue-knopf" type="button" aria-expanded="false" aria-controls="menue">${icon.menue}<span class="nur-lesbar">Menü</span></button>
</div>
<div class="blatt" id="menue" role="dialog" aria-modal="true" aria-label="Menü" hidden>
  <div class="blatt-schleier" data-zu></div>
  <div class="blatt-flaeche">
    <div class="blatt-kopf"><span class="marke-klein">Menü</span><button class="schnell-rund blatt-zu" type="button" data-zu>${icon.zu}<span class="nur-lesbar">Menü schließen</span></button></div>
    <ul class="blatt-liste">
      ${navPunkte.map(([h, t], i) => `<li><a href="${h}"><span class="blatt-nr">${nr(i)}</span>${t}</a></li>`).join('\n      ')}
    </ul>
    <p class="blatt-kontakt">${telLink()} · ${mailLink()}</p>
  </div>
</div>
</body>
</html>
`;
}

const abschnittKopf = (nummer, name, titelHtml, id) =>
  `<div class="abschnitt-kopf"><p class="marke-klein"><span class="marke-klein-nr">${nummer}</span> ${name}</p><h2 id="${id}" class="rand${lsb(titelHtml)}">${titelHtml}</h2></div>`;

// ---------- Startseite ----------
function startseite() {
  const zl = start.zeitleiste, letzte = zl.bilder - 1;
  const striche = Array.from({ length: zl.bilder }, (_, i) => {
    const x = r((i / letzte) * 100);
    return `<line x1="${x}%" x2="${x}%" y1="0" y2="${i % 12 === 0 ? 16 : 9}"/>`;
  }).join('');
  const rauten = zl.schluessel.map((b, i) => `<svg class="raute raute--${i + 1}" x="${r((b / letzte) * 100)}%" y="34" overflow="visible"><rect x="-8" y="-8" width="16" height="16" transform="rotate(45)"/></svg>`).join('');
  // Zeilenanfänge je Gerät bestimmen (h = Handy, c = Computer) und dort den Randausgleich setzen
  const anfang = { h: true, c: true };
  const h1 = start.h1.map((s, i, alle) => {
    const klassen = ['stueck', s.clip ? 'clip' : '', ...['h', 'c'].filter((g) => anfang[g] && !s.clip).map((g) => `anfang-${g}`)].filter(Boolean).join(' ') + (s.clip ? '' : lsb(s.t));
    anfang.h = (s.umbruch || '').includes('h'); anfang.c = (s.umbruch || '').includes('c');
    const stueck = s.clip
      ? `<span class="${klassen}"><span class="clip-wort">${s.t.split('').map((b) => `<span class="b">${b}</span>`).join('')}</span></span>`
      : `<span class="${klassen}">${esc(s.t)}</span>`;
    const br = s.umbruch ? `<br class="br-${s.umbruch}">` : '';
    return stueck + br + (i < alle.length - 1 ? ' ' : '');
  }).join('');

  const werke = projekte.map((p, i) => `
      <li class="werk werk--${i + 1}" data-projekt="${p.slug}">
        <a class="werk-link" href="/projekt-${p.slug}.html">
          <div class="poster poster--${p.slug}">${plakat(p, 0.15, `Plakatmotiv ${p.kunde}: ${p.kurz}`)}</div>
          <div class="werk-text">
            <p class="werk-meta">${nr(i)} · ${esc(p.leistung)} · ${p.jahr}</p>
            <h3 class="werk-titel rand${lsb(p.kunde)} titel--${p.slug}">${esc(p.kunde)}</h3>
            <p>${esc(p.kurz)}</p>
          </div>
          <span class="werk-pfeil" aria-hidden="true">${icon.pfeil}</span>
        </a>
      </li>`).join('');

  const labor = handwerk.kurven.map((k, i) => {
    const f = bezier(k.wert), N = 13, B = 44, S = 1000;
    const bilder = Array.from({ length: N }, (_, j) => {
      const x = r(f(j / (N - 1)) * (S - B)), schluessel = j === 0 || j === N - 1;
      return `<rect class="${schluessel ? 'bild-schluessel' : 'bild-zwischen'}" x="${x}" y="10" width="${B}" height="${B}" rx="4"/>`;
    }).join('');
    const [x1, y1, x2, y2] = k.wert.map((v) => v * 60);
    return `
        <li class="spur">
          <div class="spur-kopf">
            <svg class="spur-kurve" viewBox="-4 -4 68 68" aria-hidden="true"><path class="spur-achse" d="M0 0V60H60"/><path d="M0 60C${r(x1)} ${r(60 - y1)} ${r(x2)} ${r(60 - y2)} 60 0"/></svg>
            <div><h4 class="spur-name">${esc(k.name)}</h4><p class="spur-wert"><code>${esc(k.css)}</code></p></div>
          </div>
          <svg class="spur-bilder" viewBox="0 0 ${S} 64" preserveAspectRatio="none" role="img" aria-label="${esc(`${k.name}: 13 Bilder, verteilt nach ${k.css}`)}" data-kurve="${esc(k.css)}">
            <line class="spur-linie" x1="0" x2="${S}" y1="32" y2="32"/>${bilder}<rect class="bild-live" x="0" y="10" width="${B}" height="${B}" rx="4"/>
          </svg>
          <p class="spur-urteil">${esc(k.urteil)}</p>
        </li>`;
  }).join('');

  return kopf({ titel: start.titel, beschreibung: start.beschreibung, pfad: 'start' }) + `
<main id="inhalt">
  <section class="held" aria-labelledby="titel">
    <p class="ueberzeile"><span class="timecode" aria-hidden="true"><span class="timecode-text">${start.zeitcode}</span></span> <span>${esc(start.ueberzeile)}</span></p>
    <h1 id="titel" class="held-titel">${h1}</h1>
    <div class="held-unten">
      <p class="lead">${esc(start.lead)}</p>
      <div class="aktionen">
        <a class="knopf" href="#kontakt">Projekt anfragen ${icon.pfeil}</a>
        <a class="knopf knopf--rand" href="#arbeiten">Arbeiten ansehen</a>
      </div>
    </div>
    <figure class="zeitleiste">
      <div class="zeitleiste-spur">
        <svg class="zeitleiste-svg" width="100%" height="48" aria-hidden="true"><g class="striche">${striche}</g>${rauten}</svg>
        <span class="abspielkopf" aria-hidden="true"></span>
      </div>
      <figcaption>${esc(zl.text)}</figcaption>
    </figure>
  </section>

  <section class="abschnitt arbeiten" id="arbeiten" aria-labelledby="t-arbeiten">
    <div class="huelle">
      ${abschnittKopf('01', 'Arbeiten', 'Drei Projekte, drei Arten von Bewegung.', 't-arbeiten')}
      <ul class="werke">${werke}
        <li class="werk werk--frei">
          <a class="werk-link werk-link--frei" href="#kontakt">
            <p class="werk-meta">04 · euer Projekt</p>
            <p class="werk-frei-titel">Hier fehlt noch eure Marke.</p>
            <p>Für Herbst 2026 haben wir noch Platz für zwei Projekte.</p>
            <span class="werk-pfeil" aria-hidden="true">${icon.pfeil}</span>
          </a>
        </li>
      </ul>
    </div>
  </section>

  <section class="abschnitt handwerk" id="handwerk" aria-labelledby="t-handwerk">
    <div class="huelle">
      <p class="dehnwort" aria-hidden="true"><span class="dehnwort-a">zwischen</span><span class="dehnwort-b">bild</span></p>
      <div class="handwerk-text">
        ${abschnittKopf('02', 'Handwerk', esc(handwerk.titel), 't-handwerk')}
        <p class="lead">${esc(handwerk.text)}</p>
      </div>
      <div class="labor">
        <div class="labor-kopf">
          <h3 class="labor-titel">${esc(handwerk.laborTitel)}</h3>
          <p>${esc(handwerk.laborText)}</p>
          <button class="knopf knopf--hell labor-start" type="button" hidden>Alle drei abspielen</button>
          <p class="labor-still" hidden>Bei euch ist „Bewegung reduzieren“ eingestellt. Darum zeigen wir die Kurven als Standbild.</p>
        </div>
        <ol class="spuren">${labor}
        </ol>
      </div>
    </div>
  </section>

  <section class="abschnitt leistungen" id="leistungen" aria-labelledby="t-leistungen">
    <div class="huelle">
      ${abschnittKopf('03', 'Leistungen', esc(leistungen.titel), 't-leistungen')}
      <ol class="leistungsliste">
        ${leistungen.liste.map((l, i) => `<li class="leistung">
          <span class="leistung-nr">${nr(i)}</span>
          <h3 class="leistung-name">${esc(l.name)}</h3>
          <p class="leistung-text">${esc(l.text)}</p>
          <p class="leistung-daten"><span>${esc(l.dauer)}</span> <span class="leistung-preis" data-pruefen="Ausgedachter Richtpreis (Demo)">${esc(l.preis).replace(/ /g, '&nbsp;')}</span></p>
        </li>`).join('\n        ')}
      </ol>
      <p class="hinweis">${esc(leistungen.hinweis)}</p>
    </div>
  </section>

  <section class="abschnitt ablauf" id="ablauf" aria-labelledby="t-ablauf">
    <div class="huelle">
      ${abschnittKopf('04', 'Ablauf', esc(ablauf.titel), 't-ablauf')}
      <p class="lead">${esc(ablauf.text)}</p>
      <ol class="schritte">
        ${ablauf.schritte.map((s) => `<li class="schritt"><span class="schritt-raute" aria-hidden="true"></span><p class="schritt-wann">${esc(s.wann)}</p><h3 class="schritt-was">${esc(s.was)}</h3><p>${esc(s.text)}</p></li>`).join('\n        ')}
      </ol>
    </div>
  </section>

  <section class="abschnitt kontakt" id="kontakt" aria-labelledby="t-kontakt">
    <div class="huelle">
      ${abschnittKopf('05', 'Kontakt', esc(kontakt.titel), 't-kontakt')}
      <p class="lead">${esc(kontakt.text)}</p>
      <p class="kontakt-mail">${mailLink('gross-link')}</p>
      <div class="baukasten" hidden>
        <fieldset><legend>Worum geht es?</legend>
          ${kontakt.themen.map((t) => `<label class="chip"><input type="checkbox" name="thema" value="${esc(t)}"><span>${esc(t)}</span></label>`).join('')}
        </fieldset>
        <fieldset><legend>Wann soll es losgehen?</legend>
          ${kontakt.zeitraum.map((t, i) => `<label class="chip"><input type="radio" name="zeitraum" value="${esc(t)}"${i === 1 ? ' checked' : ''}><span>${esc(t)}</span></label>`).join('')}
        </fieldset>
        <p><a class="knopf knopf--dunkel baukasten-senden" href="mailto:${studio.email}" ${pruefMail}>E-Mail vorbereiten ${icon.pfeil}</a></p>
        <p class="baukasten-vorschau" aria-live="polite"></p>
      </div>
      <dl class="kontakt-daten">
        <div><dt>Telefon</dt><dd>${telLink()}</dd></div>
        <div><dt>Studio</dt><dd data-pruefen="Ausgedachte Adresse (Demo)">${studio.adresse.map(esc).join('<br>')}</dd></div>
        <div><dt>Erreichbar</dt><dd>${esc(studio.zeiten)}</dd></div>
      </dl>
    </div>
  </section>
</main>
` + fuss();
}

// ---------- Projektseiten ----------
function projektseite(p, i) {
  const naechstes = projekte[(i + 1) % projekte.length];
  const bilder = [0, 1 / 3, 2 / 3, 1].map((t, j) => `
        <li class="bildfolge-bild"><div class="bildfolge-rahmen">${plakat(p, t, `${p.kunde}, Schlüsselbild ${j + 1}`)}</div><p class="werk-meta">Schlüsselbild ${j + 1} · ${(t * 3).toFixed(1).replace('.', ',')} s</p></li>`).join('');
  return kopf({ titel: `${p.kunde} – Projekt von Zwischenbild (Demo)`, beschreibung: `Demo-Projekt eines ausgedachten Studios: ${p.leistung} für ${p.kunde} (${p.branche}, erfunden). ${p.kurz}`, pfad: `projekt-${p.slug}` }) + `
<main id="inhalt" class="projekt">
  <div class="huelle">
    <p class="zurueck"><a class="knopf knopf--rand knopf--klein" href="/#arbeiten">${icon.zurueck} Alle Arbeiten</a></p>
    <div class="projekt-held">
      <div class="projekt-kopf">
        <p class="marke-klein"><span class="marke-klein-nr">${nr(i)}</span> ${esc(p.leistung)}</p>
        <h1 class="projekt-titel rand${lsb(p.kunde)} titel--${p.slug}">${esc(p.kunde)}</h1>
        <p class="lead">${esc(p.kurz)}</p>
        <dl class="projekt-fakten">
          <div><dt>Kunde</dt><dd data-pruefen="Ausgedachter Kunde (Demo)">${esc(p.branche)} (erfunden)</dd></div>
          <div><dt>Jahr</dt><dd>${p.jahr}</dd></div>
          <div><dt>Dauer</dt><dd>${esc(p.dauer)}</dd></div>
        </dl>
      </div>
      <div class="poster poster--gross poster--${p.slug}">${plakat(p, 0.15, `Plakatmotiv ${p.kunde}: ${p.kurz}`)}</div>
    </div>

    <div class="projekt-teile">
      <section class="projekt-teil" aria-labelledby="t-aufgabe"><h2 id="t-aufgabe"><span class="marke-klein-nr">A</span> Aufgabe</h2><p>${esc(p.aufgabe)}</p></section>
      <section class="projekt-teil" aria-labelledby="t-idee"><h2 id="t-idee"><span class="marke-klein-nr">B</span> Idee</h2><p>${esc(p.idee)}</p></section>
      <section class="projekt-teil" aria-labelledby="t-umsetzung"><h2 id="t-umsetzung"><span class="marke-klein-nr">C</span> Umsetzung</h2><p>${esc(p.umsetzung)}</p></section>
    </div>

    <section class="bildfolge" aria-labelledby="t-bildfolge">
      <h2 id="t-bildfolge" class="bildfolge-titel">Vier Schlüsselbilder</h2>
      <ol class="bildfolge-liste">${bilder}
      </ol>
    </section>

    <section class="geliefert" aria-labelledby="t-geliefert">
      <h2 id="t-geliefert">Geliefert</h2>
      <ul>${p.geliefert.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>
    </section>

    <a class="naechstes" href="/projekt-${naechstes.slug}.html">
      <span class="marke-klein">Nächstes Projekt</span>
      <span class="naechstes-name rand${lsb(naechstes.kunde)}">${esc(naechstes.kunde)} ${icon.pfeil}</span>
    </a>
  </div>
</main>
` + fuss();
}

// ---------- Einfache Seiten ----------
function textseite(datei, titel, h1, inhalt, robots) {
  return kopf({ titel: `${titel} – Zwischenbild (Demo)`, beschreibung: `${titel} der Demo-Seite des ausgedachten Studios Zwischenbild.`, pfad: datei, robots }) + `
<main id="inhalt" class="textseite">
  <div class="huelle">
    <h1 class="textseite-titel rand${lsb(h1)}">${h1}</h1>
    ${inhalt}
    <p><a class="knopf" href="/">Zur Startseite</a></p>
  </div>
</main>
` + fuss();
}
const platzhalter = (was) => `<p class="lead" data-pruefen="Rechtstext fehlt">Platzhalter: Diese Seite gehört zu einem ausgedachten Studio. Für eine echte Website wird der ${was} aus einem Rechtstext-Generator (z. B. eRecht24 oder IT-Recht Kanzlei) 1:1 übernommen, nie selbst formuliert.</p>`;

export function seiten() {
  const s = {
    'index.html': startseite(),
    'impressum.html': textseite('impressum', 'Impressum', 'Impressum', platzhalter('Impressumstext')),
    'datenschutz.html': textseite('datenschutz', 'Datenschutz', 'Datenschutz', platzhalter('Datenschutztext') + '<p>Diese Demo setzt keine Cookies, lädt keine fremden Schriften oder Skripte und zählt keine Besuche.</p>'),
    '404.html': textseite('404', 'Seite nicht gefunden', 'Dieses Bild fehlt in der Folge.', '<p class="lead">Die Adresse gibt es nicht (mehr). Vielleicht hilft die Startseite weiter.</p>', 'noindex'),
  };
  projekte.forEach((p, i) => { s[`projekt-${p.slug}.html`] = projektseite(p, i); });
  return s;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ziel = new URL('./public/', import.meta.url);
  for (const [datei, html] of Object.entries(seiten())) writeFileSync(new URL(datei, ziel), html);
  console.log(`gebaut: ${Object.keys(seiten()).join(', ')}`);
}
