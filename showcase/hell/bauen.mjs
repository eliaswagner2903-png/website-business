// Baut alle Seiten aus inhalt.json:  node bauen.mjs     (zweites Farbschema zum Test: SCHEMA=salbei node bauen.mjs)
// HTML in public/ nicht von Hand ändern – Texte stehen in inhalt.json, Gestaltung in public/css/.
import { readFileSync, writeFileSync } from 'node:fs';

const I = JSON.parse(readFileSync(new URL('./inhalt.json', import.meta.url), 'utf8'));
const P = I.praxis;
const OUT = new URL('./public/', import.meta.url);
const SCHEMA = process.env.SCHEMA ? ` data-schema="${process.env.SCHEMA}"` : '';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pr = (grund) => (grund ? ` data-pruefen="${esc(grund)}"` : '');
const tel = esc(P.telefon).replace(/ /g, '&nbsp;');
const icon = (n, k = 'ic') => `<svg class="${k}" aria-hidden="true" focusable="false"><use href="#i-${n}"></use></svg>`;
const FIKTIV = 'Ausgedacht (Demo-Seite)';

const NAV = [
  ['index', '/', 'Start', 'Worum es geht'],
  ['leistungen', '/leistungen.html', 'Leistungen', 'Dauer, Preise, Fragen'],
  ['praxis', '/praxis.html', 'Praxis & Team', 'Räume und Menschen'],
  ['termin', '/termin.html', 'Termin & Kontakt', 'Buchen, anrufen, finden'],
];

// ---------- Strukturierte Daten (JSON-LD) ----------
// Nur Angaben, die sichtbar auf der Seite stehen; 
// JSON-LD wird nicht ausgeführt, braucht also keinen CSP-Hash; "<" wird maskiert, damit nichts das Skript-Element schließt.
const ldJson = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
const TAG = { Montag: 'Mo', Dienstag: 'Tu', Mittwoch: 'We', Donnerstag: 'Th', Freitag: 'Fr', Samstag: 'Sa', Sonntag: 'Su' };
const uhr = (h, m) => `${h.padStart(2, '0')}:${m}`;
// "Montag bis Donnerstag" + "7:00 – 20:00 Uhr" → "Mo-Th 07:00-20:00"; "nach Vereinbarung" fällt weg.
const oeffnung = P.zeiten.flatMap(([tage, zeit]) => {
  const z = zeit.match(/^(\d{1,2}):(\d{2}) – (\d{1,2}):(\d{2}) Uhr$/);
  const t = tage.split(' bis ').map((x) => TAG[x]);
  return z && t.every(Boolean) ? [`${t.join('-')} ${uhr(z[1], z[2])}-${uhr(z[3], z[4])}`] : [];
});
const [plz, ...ortTeile] = P.plz_ort.split(' ');
const LD = ldJson({
  '@context': 'https://schema.org',
  '@type': 'Physiotherapy',
  name: `${P.name} ${P.zusatz}`,
  url: `${P.domain}/`,
  telephone: P.telefon,
  email: P.mail,
  address: { '@type': 'PostalAddress', streetAddress: P.strasse, postalCode: plz, addressLocality: ortTeile.join(' ') },
  openingHours: oeffnung,
});

// ---------- Bausteine ----------
const kopf = (id, { titel, beschreibung, kursiv = false }) => `<!DOCTYPE html>
<html lang="de"${SCHEMA}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titel)}</title>
<meta name="description" content="${esc(beschreibung)}">
<link rel="canonical" href="${P.domain}${id === 'index' ? '/' : `/${id}.html`}">
<meta property="og:title" content="${esc(titel)}">
<meta property="og:description" content="${esc(beschreibung)}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#f6f0e7">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/fraunces-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/figtree-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>${kursiv ? `
<link rel="preload" href="/fonts/fraunces-latin-wght-italic.woff2" as="font" type="font/woff2" crossorigin>` : ''}
<link rel="stylesheet" href="/css/marke.css">
<link rel="stylesheet" href="/css/stil.css">
<script>document.documentElement.classList.add('js')</script>
<script src="/js/seite.js" defer></script>${id === 'index' ? `
<script type="application/ld+json">${LD}</script>` : ''}
</head>`;

const SPRITE = `<svg class="sprite" aria-hidden="true" focusable="false">
  <symbol id="i-tel" viewBox="0 0 24 24"><path d="M6.6 3.5h2.6l1.5 4.2-2 1.3a11 11 0 0 0 6.3 6.3l1.3-2 4.2 1.5v2.6a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 4.6 5.6a2 2 0 0 1 2-2.1Z"/></symbol>
  <symbol id="i-kalender" viewBox="0 0 24 24"><path d="M5 6h14v13H5zM5 10h14M9 3.5v4M15 3.5v4"/></symbol>
  <symbol id="i-ort" viewBox="0 0 24 24"><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/></symbol>
  <symbol id="i-pfeil" viewBox="0 0 24 24"><path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><path d="M4 6h16v12H4zM4.5 6.5 12 13l7.5-6.5"/></symbol>
  <symbol id="i-zu" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></symbol>
  <symbol id="i-lot" viewBox="0 0 24 32"><path d="M12 1v22"/><path class="voll" d="M12 22l-4.2 5 4.2 4.5 4.2-4.5z"/></symbol>
</svg>`;

const kopfzeile = (id) => `<a class="sprung" href="#inhalt">Zum Inhalt springen</a>
<header class="kopf">
  <div class="huelle kopf-innen">
    <a class="marke" href="/"${id === 'index' ? ' aria-current="page"' : ''}>${icon('lot', 'marke-lot')}<span class="marke-name">${esc(P.name)}</span><span class="marke-zusatz">${esc(P.zusatz)}</span></a>
    <nav class="nav" aria-label="Hauptnavigation">
      <ul>
${NAV.map(([k, href, name]) => `        <li><a href="${href}"${k === id ? ' aria-current="page"' : ''}>${esc(name)}${k === id ? '<span class="nav-marke" aria-hidden="true"></span>' : ''}</a></li>`).join('\n')}
      </ul>
    </nav>
    <button class="menue-knopf" type="button" aria-haspopup="dialog" aria-controls="menue" data-menue-auf>Menü</button>
  </div>
</header>`;

const menue = (id) => `<dialog class="menue" id="menue" aria-labelledby="menue-titel">
  <div class="menue-griff" aria-hidden="true"></div>
  <div class="menue-kopf">
    <p class="menue-titel" id="menue-titel">Menü</p>
    <button class="menue-zu" type="button" data-menue-zu>${icon('zu')}<span class="nur-lesbar">Menü schließen</span></button>
  </div>
  <nav aria-label="Menü">
    <ol class="menue-liste">
${NAV.map(([k, href, name, unter], i) => `      <li><a href="${href}"${k === id ? ' aria-current="page"' : ''}><span class="menue-nr">0${i + 1}</span><span class="menue-name">${esc(name)}</span><span class="menue-unter">${esc(unter)}</span></a></li>`).join('\n')}
    </ol>
  </nav>
  <div class="menue-fuss">
    <a class="knopf knopf-voll" href="${esc(P.termin_link)}" rel="noopener"${pr('Platzhalter: Cal.com-Link der echten Praxis eintragen')}>${icon('kalender')}Termin online buchen</a>
    <a class="knopf knopf-rand" href="${P.telefon_link}"${pr(FIKTIV)}>${icon('tel')}${tel}</a>
  </div>
</dialog>`;

const fuss = () => `<footer class="fuss">
  <div class="huelle fuss-raster">
    <div class="fuss-marke">
      <p class="fuss-name">${icon('lot', 'marke-lot')}${esc(P.name)}</p>
      <p>${esc(P.zusatz)} in ${esc(P.ort)}</p>
    </div>
    <address class="fuss-adresse"${pr(FIKTIV)}>
      ${esc(P.strasse)}<br>${esc(P.plz_ort)}<br>
      <a href="${P.telefon_link}">${tel}</a><br>
      <a href="mailto:${P.mail}">${esc(P.mail)}</a>
    </address>
    <div class="fuss-zeiten"${pr(FIKTIV)}>
${P.zeiten.map(([t, z]) => `      <p><span>${esc(t)}</span> ${esc(z)}</p>`).join('\n')}
    </div>
    <ul class="fuss-links">
      <li><a href="/impressum.html">Impressum</a></li>
      <li><a href="/datenschutz.html">Datenschutz</a></li>
    </ul>
  </div>
</footer>`;

const leiste = () => `<nav class="schnell" aria-label="Schnellzugriff">
  <a class="schnell-termin" href="${esc(P.termin_link)}" rel="noopener"${pr('Platzhalter: Cal.com-Link')}>${icon('kalender')}Termin buchen</a>
  <a class="schnell-rund" href="${P.telefon_link}"${pr(FIKTIV)}>${icon('tel')}<span>Anrufen</span></a>
  <a class="schnell-rund" href="${esc(P.route_link)}" rel="noopener"${pr(FIKTIV)}>${icon('ort')}<span>Route</span></a>
</nav>`;

const seite = (id, main, opt = {}) => `${kopf(id, { ...I.seiten[id], ...opt })}
<body class="seite-${id}">
${SPRITE}
${kopfzeile(id)}
<main id="inhalt">
<div id="pruefen" hidden></div>
${main}
</main>
${fuss()}
${leiste()}
${menue(id)}
</body>
</html>
`;

const ueber = (text) => `<p class="ueberzeile">${esc(text)}</p>`;

// Zeichnung: Mensch im Profil am Lot. Nur Striche, eingefärbt über die Marke.
const PUNKTE = [['Ohr', 94], ['Schulter', 166], ['Hüfte', 318], ['Knie', 448], ['Knöchel', 556]];
const lotZeichnung = (kurz = false) => `<svg class="lot" viewBox="0 0 420 600" role="img" aria-label="Zeichnung: ein Mensch im Profil, daneben ein Lot mit fünf Messpunkten von Ohr bis Knöchel">
      <g class="lot-raster"><path d="M60 94H372M60 166H372M60 318H372M60 448H372M60 556H372"/></g>
      <g class="lot-figur">
        <circle cx="219" cy="90" r="31"/>
        <path d="M200 121c-1 20-18 34-17 70 1 34 17 52 13 84-3 26-19 34-15 62 4 32 14 50 13 74 0 20 7 30 5 46-2 18-10 28-8 50 2 22 7 36 5 60v8"/>
        <path d="M233 120c4 22 18 34 18 64 0 32-11 50-11 78 0 28-6 40-6 62 0 34-5 58-6 86-1 18-6 28-6 44 0 30-3 58-4 86 13 7 34 9 47 18-17 5-52 4-68 4"/>
        <path d="M214 172c-9 28-12 52-9 78 3 26 12 46 17 66"/>
        <path d="M249 86l8 11-6 3"/>
      </g>
      <path class="lot-boden" d="M140 590H300"/>
      <g class="lot-linie"><path d="M210 24V548"/><path class="lot-gewicht" d="M210 548l-8 13 8 14 8-14z"/></g>
      <g class="lot-marken">
        <path d="M204 94H104M204 166H104M204 318H104M204 448H104M204 556H104"/>
${PUNKTE.map(([n, y]) => `        <text x="98" y="${y + 4}">${n}</text>`).join('\n')}
      </g>
      <g class="lot-punkte">${PUNKTE.map(([, y], i) => `<circle class="p${i + 1}" cx="210" cy="${y}" r="6"/>`).join('')}</g>
    </svg>`;

// Grundriss der (ausgedachten) Praxis
const grundriss = () => `<svg class="grundriss" viewBox="0 0 600 400" role="img" aria-label="Grundriss der Praxis: Eingang und Empfang links, Flur mit drei Behandlungsräumen oben, Trainingsraum unten rechts, links unten WC und Raum 4">
      <g class="gr-flaechen">
        <rect class="gr-training" x="220" y="220" width="360" height="160"/>
        <rect class="gr-flur" x="220" y="170" width="360" height="50"/>
      </g>
      <g class="gr-waende">
        <path d="M20 70V20H580V380H20V130"/>
        <path d="M220 20V175M220 215V380"/>
        <path d="M220 170H290M325 170H410M445 170H530M565 170H580"/>
        <path d="M340 20V170M460 20V170"/>
        <path d="M220 220H370M425 220H580"/>
        <path d="M20 250H40M78 250H130M168 250H220M110 250V380"/>
      </g>
      <g class="gr-tueren"><path d="M290 170a35 35 0 0 1 35-35M410 170a35 35 0 0 1 35-35M530 170a35 35 0 0 1 35-35M370 220a55 55 0 0 0 55 -55"/></g>
      <g class="gr-text">
        <text x="120" y="120">Empfang</text><text x="120" y="148" class="klein">und Warten</text>
        <text x="280" y="100">Raum 1</text><text x="400" y="100">Raum 2</text><text x="520" y="100">Raum 3</text>
        <text x="400" y="296">Trainingsraum</text><text x="400" y="322" class="klein">60 m² · Geräte · Spiegel</text>
        <text x="65" y="318">WC</text><text x="65" y="344" class="klein">barrierefrei</text>
        <text x="165" y="318">Raum 4</text><text x="165" y="344" class="klein">Lymphe</text>
      </g>
      <g class="gr-eingang"><path d="M-4 100H22"/><circle cx="20" cy="100" r="7"/><text x="36" y="80">Eingang</text><text x="36" y="58" class="klein">ebenerdig</text></g>
    </svg>`;

// ---------- Startseite ----------
const H = I.held, A = I.ablauf, G = I.gruende, R = I.praxisraum;
const startseite = seite('index', `
<section class="held" aria-labelledby="titel">
  <div class="huelle held-raster">
    <div class="held-text">
      ${ueber(H.ueberzeile)}
      <h1 id="titel">${esc(H.titel_vor)} <em>${esc(H.titel_wort)}</em> ${esc(H.titel_nach)}</h1>
      <p class="held-lead">${esc(H.text)}</p>
      <div class="aktionen">
        <a class="knopf knopf-voll" href="/termin.html#buchen">Termin online buchen${icon('pfeil')}</a>
        <a class="tel-gross" href="${P.telefon_link}"${pr(FIKTIV)}><span class="nur-lesbar">Anrufen: </span>${tel}</a>
      </div>
      <ul class="held-fakten">
        <li>Kasse und privat</li>
        <li${pr(FIKTIV)}>${esc(P.zeiten_kurz)}</li>
        <li${pr(FIKTIV)}><a href="${esc(P.route_link)}" rel="noopener">${icon('ort')}${esc(P.strasse)}</a></li>
      </ul>
    </div>
    <figure class="held-bild">
      ${lotZeichnung()}
      <figcaption>Befund am Lot: Liegen Ohr, Schulter, Hüfte, Knie und Knöchel auf einer Linie?</figcaption>
    </figure>
  </div>
</section>

<section class="abschnitt ablauf" aria-labelledby="t-ablauf">
  <div class="huelle">
    <div class="abschnitt-kopf auftauchen">
      ${ueber('Der erste Termin')}
      <h2 id="t-ablauf">${esc(A.titel)}</h2>
      <p>${esc(A.text)}</p>
    </div>
    <div class="zeitband" aria-hidden="true">
${A.schritte.map((s, i) => `      <span class="zeit-seg m${s.minuten}"><b>0${i + 1}</b><span>${s.minuten} Min.</span></span>`).join('\n')}
    </div>
    <div class="skala" aria-hidden="true"><span>0</span><span>10</span><span>20</span><span>30</span><span>40</span><span>45 Min.</span></div>
    <ol class="schritte">
${A.schritte.map((s, i) => `      <li class="schritt auftauchen"><p class="schritt-nr">0${i + 1} <span>· ${s.minuten} Minuten</span></p><h3>${esc(s.titel)}</h3><p>${esc(s.text)}</p></li>`).join('\n')}
    </ol>
  </div>
</section>

<section class="abschnitt gruende" aria-labelledby="t-gruende">
  <div class="huelle gruende-raster">
    <div class="abschnitt-kopf gruende-kopf">
      ${ueber('Wobei wir helfen')}
      <h2 id="t-gruende">${esc(G.titel)}</h2>
      <p>${esc(G.text)}</p>
      <p><a class="pfeil-link" href="/leistungen.html">Alle Leistungen mit Dauer und Preis${icon('pfeil')}</a></p>
      <p class="gruende-hinweis">${esc(G.hinweis)} <a class="tel-zeile" href="${P.telefon_link}"${pr(FIKTIV)}>${icon('tel')}${tel}</a></p>
    </div>
    <ul class="saetze">
${G.liste.map((g, i) => `      <li class="auftauchen${[' gross', '', ' gross', '', ''][i]}" data-tiefe="${[0, 3, 1, 4, 2][i]}"><a href="/leistungen.html#${g.anker}"><span class="satz">${esc(g.satz)}</span><span class="satz-ziel">${esc(g.leistung)}${icon('pfeil')}</span></a></li>`).join('\n')}
    </ul>
  </div>
</section>

<section class="abschnitt raum" aria-labelledby="t-raum">
  <div class="huelle raum-raster">
    <figure class="raum-plan auftauchen-bild">
      ${grundriss()}
      <figcaption>Grundriss, nicht maßstabsgetreu</figcaption>
    </figure>
    <div class="raum-text">
      <figure class="raum-foto auftauchen-bild"${pr('KI-Bild (Higgsfield), kein Foto der Praxis: vor Launch durch echtes Foto ersetzen')}>
        <picture>
          <source type="image/avif" srcset="/medien/raum-lot-480.avif 480w, /medien/raum-lot-768.avif 768w, /medien/raum-lot-1024.avif 1024w" sizes="(min-width: 60rem) 36vw, calc(100vw - 2.5rem)">
          <img src="/medien/raum-lot-768.webp" srcset="/medien/raum-lot-480.webp 480w, /medien/raum-lot-768.webp 768w, /medien/raum-lot-1024.webp 1024w" sizes="(min-width: 60rem) 36vw, calc(100vw - 2.5rem)" width="1024" height="688" loading="lazy" decoding="async" alt="Ecke einer Behandlungsliege mit terrakottafarbenem Handtuch, dahinter hängt ein Messinglot vor einer hellen Wand; Sonnenlicht fällt auf den Holzboden.">
        </picture>
      </figure>
      ${ueber('Die Praxis')}
      <h2 id="t-raum">${esc(R.titel)}</h2>
      <p>${esc(R.text)}</p>
      <dl class="fakten">
${R.fakten.map(([z, t]) => `        <div class="auftauchen"><dt>${esc(z)}</dt><dd>${esc(t)}</dd></div>`).join('\n')}
      </dl>
      <p><a class="pfeil-link" href="/praxis.html">Praxis und Team ansehen${icon('pfeil')}</a></p>
    </div>
  </div>
</section>

${abschluss()}
`, { kursiv: true });

function abschluss() {
  return `<section class="abschnitt abschluss" aria-labelledby="t-abschluss">
  <div class="huelle abschluss-raster">
    <div class="abschluss-text">
      ${ueber('Termin')}
      <h2 id="t-abschluss">Buchen Sie online oder rufen Sie an.</h2>
      <p>Online sehen Sie alle freien Zeiten der nächsten vier Wochen. Am Telefon erreichen Sie Jonas während der Öffnungszeiten.</p>
      <a class="knopf knopf-voll" href="${esc(P.termin_link)}" rel="noopener"${pr('Platzhalter: Cal.com-Link der echten Praxis eintragen')}>${icon('kalender')}Freie Termine ansehen</a>
    </div>
    <div class="abschluss-kontakt">
      <a class="tel-riesig" href="${P.telefon_link}"${pr(FIKTIV)}><span class="tel-klein">Anrufen</span>${tel}</a>
      <dl class="zeiten"${pr(FIKTIV)}>
${P.zeiten.map(([t, z]) => `        <div><dt>${esc(t)}</dt><dd>${esc(z)}</dd></div>`).join('\n')}
      </dl>
    </div>
  </div>
</section>`;
}

// ---------- Leistungen ----------
const L = I.leistungen;
const leistungen = seite('leistungen', `
<section class="seitenkopf" aria-labelledby="titel">
  <div class="huelle">
    ${ueber('Leistungen')}
    <h1 id="titel">Was wir behandeln – und wie lange es dauert.</h1>
    <p class="held-lead">${esc(L.einleitung)}</p>
    <ul class="sprungliste">
${L.gruppen.map((g, i) => `      <li><a href="#gruppe-${i + 1}">${esc(g.titel)}</a></li>`).join('\n')}
      <li><a href="#fragen">Häufige Fragen</a></li>
    </ul>
  </div>
</section>
${L.gruppen.map((g, i) => `
<section class="abschnitt gruppe" id="gruppe-${i + 1}" aria-labelledby="t-gruppe-${i + 1}">
  <div class="huelle gruppe-raster">
    <div class="gruppe-kopf">
      <p class="gruppe-nr" aria-hidden="true">0${i + 1}</p>
      <h2 id="t-gruppe-${i + 1}">${esc(g.titel)}</h2>
      <p class="gruppe-hinweis">${esc(g.hinweis)}</p>
    </div>
    <ul class="preisliste">
${g.eintraege.map((e) => `      <li id="${e.id}" class="auftauchen"${pr(e.pruefen)}>
        <div class="preis-zeile"><h3>${esc(e.name)}</h3><span class="punkte" aria-hidden="true"></span><p class="preis-wert"><span class="dauer">${esc(e.dauer)}</span>${e.preis ? `<span class="preis"${pr('Preis ausgedacht')}>${esc(e.preis)}</span>` : ''}</p></div>
        <p>${esc(e.text)}</p>
      </li>`).join('\n')}
    </ul>
  </div>
</section>`).join('')}

<section class="abschnitt fragen" id="fragen" aria-labelledby="t-fragen">
  <div class="huelle gruppe-raster">
    <div class="gruppe-kopf">
      <p class="gruppe-nr" aria-hidden="true">?</p>
      <h2 id="t-fragen">Häufige Fragen</h2>
    </div>
    <div class="faq">
${L.fragen.map((f, i) => `      <details${i === 0 ? ' open' : ''}${pr(f.pruefen)}><summary>${esc(f.frage)}</summary><p>${esc(f.antwort)}</p></details>`).join('\n')}
    </div>
  </div>
</section>

${abschluss()}
`);

// ---------- Praxis & Team ----------
const T = I.team;
const praxis = seite('praxis', `
<section class="seitenkopf" aria-labelledby="titel">
  <div class="huelle">
    ${ueber('Praxis & Team')}
    <h1 id="titel">${esc(R.titel)}.</h1>
    <p class="held-lead">${esc(R.text)}</p>
  </div>
</section>

<section class="abschnitt plan" aria-labelledby="t-plan">
  <div class="huelle plan-raster">
    <figure class="raum-plan gross">
      ${grundriss()}
      <figcaption>Grundriss, nicht maßstabsgetreu. Alle Türen mindestens 90 cm breit.</figcaption>
    </figure>
    <div class="plan-text">
      <h2 id="t-plan">Rundgang in drei Sätzen</h2>
      <p>Hinter der Eingangstür sitzt Jonas am Empfang, daneben warten Sie auf dem Sofa am Fenster. Die Behandlungsräume 1 bis 3 gehen vom Flur ab und haben eine Tür, die man zumachen kann. Im Trainingsraum stehen Zugapparat, Beinpresse, Laufband und eine lange Spiegelwand.</p>
      <dl class="fakten">
${R.fakten.map(([z, t]) => `        <div><dt>${esc(z)}</dt><dd>${esc(t)}</dd></div>`).join('\n')}
      </dl>
    </div>
  </div>
</section>

<section class="abschnitt team" aria-labelledby="t-team">
  <div class="huelle">
    <div class="abschnitt-kopf">
      ${ueber('Team')}
      <h2 id="t-team">${esc(T.titel)}</h2>
      <p>${esc(T.text)}</p>
    </div>
    <ul class="personen">
${T.personen.map((p) => `      <li class="person auftauchen"${pr('Ausgedachte Person (Demo)')}>
        <p class="monogramm" aria-hidden="true"><span>${esc(p.kuerzel)}</span></p>
        <div class="person-text">
          <h3>${esc(p.name)} <span class="rolle">${esc(p.rolle)}</span></h3>
          <p class="schwerpunkt">${esc(p.schwerpunkt)}</p>
          <p>${esc(p.satz)}</p>
        </div>
      </li>`).join('\n')}
    </ul>
  </div>
</section>

<section class="abschnitt anfahrt" aria-labelledby="t-anfahrt">
  <div class="huelle anfahrt-raster">
    <div>
      ${ueber('Anfahrt')}
      <h2 id="t-anfahrt">So finden Sie uns</h2>
    </div>
    <div class="anfahrt-text"${pr(FIKTIV)}>
      <p class="adresse-gross">${esc(P.strasse)}<br>${esc(P.plz_ort)}</p>
      <p>${esc(P.anfahrt)}</p>
      <p><a class="knopf knopf-rand" href="${esc(P.route_link)}" rel="noopener">${icon('ort')}Route planen</a></p>
    </div>
  </div>
</section>
`);

// ---------- Termin & Kontakt ----------
const K = I.termin;
const termin = seite('termin', `
<section class="seitenkopf" aria-labelledby="titel">
  <div class="huelle">
    ${ueber('Termin & Kontakt')}
    <h1 id="titel">Ein Termin, zwei Wege.</h1>
    <p class="held-lead">${esc(K.text)}</p>
  </div>
</section>

<section class="abschnitt wege" aria-labelledby="t-buchen">
  <div class="huelle wege-raster">
    <div class="weg weg-online" id="buchen">
      <p class="weg-nr" aria-hidden="true">01</p>
      <h2 id="t-buchen">Online buchen</h2>
      <p>${esc(K.buchen_text)}</p>
      <p class="woche-legende"><span class="w-frei">frei</span><span class="w-belegt">belegt</span><span class="w-hinweis">Beispielwoche, keine echten Zeiten</span></p>
      <ul class="woche" aria-hidden="true">
        <li><b>Mo</b><span class="belegt"></span><span class="frei"></span><span class="belegt"></span></li>
        <li><b>Di</b><span class="frei"></span><span class="belegt"></span><span class="frei"></span></li>
        <li><b>Mi</b><span class="belegt"></span><span class="belegt"></span><span class="belegt"></span></li>
        <li><b>Do</b><span class="frei"></span><span class="frei"></span><span class="belegt"></span></li>
        <li><b>Fr</b><span class="frei"></span><span class="belegt"></span></li>
      </ul>
      <p><a class="knopf knopf-voll" href="${esc(P.termin_link)}" rel="noopener"${pr('Platzhalter: Cal.com-Link der echten Praxis eintragen')}>${icon('kalender')}Freie Termine ansehen</a></p>
    </div>
    <div class="weg weg-telefon">
      <p class="weg-nr" aria-hidden="true">02</p>
      <h2>Anrufen</h2>
      <p>Während der Öffnungszeiten nimmt Jonas ab. Sind wir gerade alle an der Liege, rufen wir am selben Tag zurück.</p>
      <a class="tel-riesig" href="${P.telefon_link}"${pr(FIKTIV)}><span class="tel-klein">Telefon</span>${tel}</a>
      <p><a class="pfeil-link" href="mailto:${P.mail}"${pr(FIKTIV)}>${icon('mail')}${esc(P.mail)}</a></p>
    </div>
  </div>
</section>

<section class="abschnitt infos" aria-labelledby="t-zeiten">
  <div class="huelle infos-raster">
    <div class="info-block">
      <h2 id="t-zeiten">Öffnungszeiten</h2>
      <dl class="zeiten"${pr(FIKTIV)}>
${P.zeiten.map(([t, z]) => `        <div><dt>${esc(t)}</dt><dd>${esc(z)}</dd></div>`).join('\n')}
      </dl>
    </div>
    <div class="info-block">
      <h2>Adresse</h2>
      <p class="adresse-gross"${pr(FIKTIV)}>${esc(P.strasse)}<br>${esc(P.plz_ort)}</p>
      <p>${esc(P.anfahrt)}</p>
      <p><a class="knopf knopf-rand" href="${esc(P.route_link)}" rel="noopener">${icon('ort')}Route planen</a></p>
    </div>
    <div class="info-block">
      <h2>Zum ersten Termin mitbringen</h2>
      <ul class="haken">
${K.mitbringen.map((m) => `        <li>${esc(m)}</li>`).join('\n')}
      </ul>
    </div>
  </div>
</section>
`);

// ---------- Rechtliches, 404 ----------
const platzhalter = (id, titel, h1) => `${kopf(id, { titel: `${titel} – Lotlinie`, beschreibung: `${titel} der Physiotherapie-Praxis Lotlinie.` })}
<body class="seite-recht">
${SPRITE}
${kopfzeile(id)}
<main id="inhalt">
<div id="pruefen" hidden></div>
<section class="seitenkopf" aria-labelledby="titel">
  <div class="huelle schmal">
    ${ueber('Rechtliches')}
    <h1 id="titel">${h1}</h1>
    <p class="held-lead" data-pruefen="Rechtstext fehlt: aus Generator 1:1 übernehmen, nie selbst formulieren">Platzhalter. Bei einer echten Praxis steht hier der Text aus einem Rechtstext-Generator (zum Beispiel eRecht24 oder IT-Recht Kanzlei), unverändert übernommen.</p>
    <p>Diese Seite ist eine Demo. Die Praxis Lotlinie gibt es nicht; deshalb gibt es hier auch keinen verantwortlichen Betreiber, den wir nennen könnten.</p>
    <p><a class="knopf knopf-rand" href="/">Zur Startseite</a></p>
  </div>
</section>
</main>
${fuss()}
${leiste()}
${menue(id)}
</body>
</html>
`;

const nichtGefunden = `${kopf('404', { titel: 'Seite nicht gefunden – Lotlinie', beschreibung: 'Diese Seite gibt es nicht. Von hier geht es zurück zur Startseite, zu den Leistungen oder zum Termin.' })}
<body class="seite-recht">
${SPRITE}
${kopfzeile('404')}
<main id="inhalt">
<div id="pruefen" hidden></div>
<section class="seitenkopf" aria-labelledby="titel">
  <div class="huelle schmal">
    ${ueber('Fehler 404')}
    <h1 id="titel">Hier ist die Linie zu Ende.</h1>
    <p class="held-lead">Diese Seite gibt es nicht (mehr). Vielleicht hilft einer dieser Wege weiter:</p>
    <ul class="sprungliste">
${NAV.map(([, href, name]) => `      <li><a href="${href}">${esc(name)}</a></li>`).join('\n')}
    </ul>
  </div>
</section>
</main>
${fuss()}
${leiste()}
${menue('404')}
</body>
</html>
`;

const dateien = {
  'index.html': startseite, 'leistungen.html': leistungen, 'praxis.html': praxis, 'termin.html': termin,
  'impressum.html': platzhalter('impressum', 'Impressum', 'Impressum'),
  'datenschutz.html': platzhalter('datenschutz', 'Datenschutz', 'Datenschutz&shy;erklärung'),
  '404.html': nichtGefunden,
};
for (const [name, html] of Object.entries(dateien)) writeFileSync(new URL(name, OUT), html);
const heute = new Date().toISOString().slice(0, 10);
writeFileSync(new URL('sitemap.xml', OUT), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${['/', '/leistungen.html', '/praxis.html', '/termin.html'].map((u) => `  <url><loc>${P.domain}${u}</loc><lastmod>${heute}</lastmod></url>`).join('\n')}
</urlset>
`);
console.log(`${Object.keys(dateien).length} Seiten gebaut${SCHEMA ? ` (Schema ${process.env.SCHEMA})` : ''}.`);
