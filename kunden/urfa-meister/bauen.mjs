// Baut alle Seiten der URFA-Meistervariante:   node bauen.mjs      (Test-Schema: SCHEMA=kalk node bauen.mjs)
// Inhalte stehen NUR in inhalt/seite.json (Fakten, Texte, Fotos) und inhalt/speisekarte.json (aus
// kunden/urfa-sofrasi übernommen, Preise unverändert). HTML in public/ nicht von Hand ändern.
import { readFileSync, writeFileSync } from 'node:fs';

const S = JSON.parse(readFileSync(new URL('./inhalt/seite.json', import.meta.url), 'utf8'));
const K = JSON.parse(readFileSync(new URL('./inhalt/speisekarte.json', import.meta.url), 'utf8'));
const OUT = new URL('./public/', import.meta.url);
const SCHEMA = process.env.SCHEMA ? ` data-schema="${process.env.SCHEMA}"` : '';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pr = (grund) => (grund ? ` data-pruefen="${esc(grund)}"` : '');
const P = S.pruefen, T = S.texte;
const TEL = esc(S.telefon_anzeige).replace(/ /g, '&nbsp;');
const TEL_A = `tel:${S.telefon_link}`;
const ROUTE = esc(S.route);
const ADRESSE = `${esc(S.strasse)}, ${S.plz} ${esc(S.ort)}`;
const ZEIT = `${S.zeiten.von} – ${S.zeiten.bis}&nbsp;Uhr`;
const TAGES = `${S.tagesgerichte.von} – ${S.tagesgerichte.bis}&nbsp;Uhr`;
const icon = (n, k = 'ic') => `<svg class="${k}" aria-hidden="true" focusable="false"><use href="/medien/icons.svg#i-${n}"></use></svg>`;
const pfeil = '<span class="pfeil" aria-hidden="true">→</span>';

// Ornament aus dem Logo: Linie – Raute – TEXT – Raute – Linie
const zier = (text, k = '') => `<p class="zier${k ? ` ${k}` : ''}"><span>${text}</span></p>`;

// ---------- Fotos ----------
// Quelle ist nur 1016 px breit (aus Screenshots): nie größer als nötig zeigen, nie hochrechnen.
function bild(name, sizes, { k = '', lcp = false, lazy = true, extra = '' } = {}) {
  const [h, alt] = S.fotos[name];
  const laden = lcp ? 'fetchpriority="high"' : lazy ? 'loading="lazy" decoding="async"' : 'decoding="async"';
  return `<img${k ? ` class="${k}"` : ''} src="/medien/${name}-1016.webp" srcset="/medien/${name}-640.webp 640w, /medien/${name}-1016.webp 1016w" sizes="${sizes}" width="1016" height="${h}" alt="${esc(alt)}" ${laden}${extra}>`;
}
const gast = (name) => (S.mit_gaesten.includes(name) ? pr(P.gaeste) : '');
// Kupferring einer Sini (runde Kupferplatte): Außenring, gepunktete Gravur, Innenring
const ring = `<svg class="ring" viewBox="0 0 200 200" aria-hidden="true" focusable="false"><circle cx="100" cy="100" r="99"/><circle class="ring-gravur" cx="100" cy="100" r="95.5"/><circle cx="100" cy="100" r="92"/></svg>`;

// ---------- Navigation ----------
const NAV = [
  ['index', '/', 'Start'],
  ['speisekarte', '/speisekarte.htm', 'Speisekarte'],
  ['galerie', '/galerie.htm', 'Galerie'],
  ['kontakt', '/kontakt.htm', 'Kontakt &amp; Anfahrt'],
];

const LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: S.name,
  url: `${S.basis}/`,
  image: `${S.basis}/medien/og-urfa-sofrasi.jpg`,
  telephone: S.telefon_ld,
  email: S.email,
  servesCuisine: ['Türkisch'],
  hasMenu: `${S.basis}/speisekarte.htm`,
  address: { '@type': 'PostalAddress', streetAddress: S.strasse, postalCode: S.plz, addressLocality: S.ort, addressCountry: 'DE' },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: S.zeiten.von, closes: S.zeiten.bis }],
}).replace(/</g, '\\u003c');

function seite(datei, { id, titel, beschreibung, inhalt, robots = '', ld = false, koerper = '', vorladen = '' }) {
  const kanon = `${S.basis}/${datei === 'index.html' ? '' : datei}`;
  const nav = NAV.map(([n, href, t]) => `      <li><a href="${href}"${n === id ? ' aria-current="page"' : ''}>${t}</a></li>`).join('\n');
  const html = `<!DOCTYPE html>
<html lang="de"${SCHEMA}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titel)}</title>
<meta name="description" content="${esc(beschreibung)}">
${robots ? `<meta name="robots" content="${robots}">\n` : ''}<link rel="canonical" href="${kanon}">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
<meta property="og:site_name" content="URFA SOFRASI">
<meta property="og:title" content="${esc(titel)}">
<meta property="og:description" content="${esc(beschreibung)}">
<meta property="og:url" content="${kanon}">
<meta property="og:image" content="${S.basis}/medien/og-urfa-sofrasi.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0c0e0a">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/marcellus-tr.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/manrope-tr.woff2" as="font" type="font/woff2" crossorigin>${vorladen}
<link rel="stylesheet" href="/css/marke.css">
<link rel="stylesheet" href="/css/stil.css">
<link rel="stylesheet" href="/css/bausteine.css">
<script>document.documentElement.classList.add('js')</script>
<script src="/js/bausteine.js" defer></script>
<script src="/js/seite.js" defer></script>${ld ? `\n<script type="application/ld+json">${LD}</script>` : ''}
</head>
<body${koerper ? ` class="${koerper}"` : ''}>
<a class="sprung" href="#inhalt">Zum Inhalt springen</a>
<header class="kopf">
  <div class="huelle kopf-in">
    <a class="marke" href="/"${id === 'index' ? ' aria-current="page"' : ''}><span class="marke-skyline" aria-hidden="true"></span><span class="marke-name">URFA SOFRASI</span><span class="unsichtbar"> – zur Startseite</span></a>
    <button class="menue-knopf" type="button" aria-expanded="false" aria-controls="nav">Menü</button>
    <nav class="nav blatt" id="nav" aria-label="Hauptnavigation">
      <ul>
${nav}
      <li class="nav-tel"><a class="knopf zweit" href="${TEL_A}">${icon('phone')}<span>${TEL}</span></a></li>
      </ul>
    </nav>
  </div>
</header>

<main id="inhalt">
${inhalt}
</main>

<footer class="fuss">
  <div class="huelle">
    <div class="fuss-marke">
      <span class="skyline skyline--fuss" aria-hidden="true"></span>
      <p class="fuss-name">URFA SOFRASI</p>
      ${zier(esc(S.untertitel), 'zier--mitte')}
    </div>
    <div class="fuss-raster">
      <div>
        <h2>Besuchen Sie uns</h2>
        <address>${esc(S.strasse)}<br>${S.plz} ${esc(S.ort)}<br>
          <a href="${TEL_A}">${TEL}</a><br>
          <a href="mailto:${S.email}"${pr(P.email)}>${S.email}</a></address>
      </div>
      <div>
        <h2>Öffnungszeiten</h2>
        <p${pr(P.zeiten)}>${S.zeiten.tage}<br>${ZEIT}</p>
        <p>Tagesgerichte<br>${TAGES}</p>
      </div>
      <div>
        <h2>Seiten</h2>
        <ul>
          <li><a href="/speisekarte.htm">Speisekarte</a></li>
          <li><a href="/galerie.htm">Galerie</a></li>
          <li><a href="/kontakt.htm">Kontakt &amp; Anfahrt</a></li>
          <li><a href="/impressum.htm">Impressum</a></li>
          <li><a href="/datenschutz.htm">Datenschutz</a></li>
        </ul>
      </div>
    </div>
    <p class="fuss-unten">© URFA SOFRASI · Eislingen/Fils</p>
  </div>
</footer>

<nav class="schnell" aria-label="Schnellzugriff">
  <a class="schnell-tel" href="${TEL_A}">${icon('phone')}<span class="schnell-text"><span class="schnell-wort">Anrufen</span><span class="schnell-nr">${TEL}</span></span></a>
  <a href="${ROUTE}" rel="noopener">${icon('pin')}<span>Route</span></a>
  <a href="/speisekarte.htm"${id === 'speisekarte' ? ' aria-current="page"' : ''}>${icon('menu')}<span>Karte</span></a>
</nav>
</body>
</html>
`;
  writeFileSync(new URL(datei, OUT), html);
}

// =====================================================================
// Startseite
// =====================================================================
const oeffnung = `<p class="status" data-status${pr(P.zeiten)}><span class="punkt" aria-hidden="true"></span><span class="status-text">${S.zeiten.kurz} ${ZEIT}</span></p>`;
const SOFRA = 'platte-mini-lahmacun-meze';

const held = `<section class="held" aria-labelledby="titel">
  <span class="skyline skyline--horizont" aria-hidden="true"></span>
  <div class="huelle held-raster">
    ${oeffnung}
    ${zier('<span lang="tr">Hoş geldiniz</span>', 'held-zier')}
    <h1 id="titel"><span class="wortmarke"><span>URFA</span> <span>SOFRASI</span></span> <span class="h1-unter">${esc(S.untertitel)} in Eislingen/Fils</span></h1>
    <div class="sofra">
      <figure class="sofra-haupt">
        ${bild(SOFRA, '(min-width: 64rem) 1016px, (min-width: 40rem) 700px, 540px', { lcp: true })}
      </figure>
      ${ring}
      <figure class="sofra-klein sofra-klein--1">${bild('grillplatte-urfa-sofrasi', '(min-width: 64rem) 420px, 300px', { lazy: false })}</figure>
      <figure class="sofra-klein sofra-klein--2">${bild('sofra-doener-meze', '(min-width: 64rem) 360px, 260px', { lazy: false })}</figure>
      <p class="sofra-titel" aria-hidden="true">${esc(S.fotos[SOFRA][2])}</p>
    </div>
    <div class="aktionen held-aktionen">
      <a class="knopf knopf--tel" href="${TEL_A}">${icon('phone')}<span><span class="knopf-klein">Anrufen</span>${TEL}</span></a>
      <a class="knopf zweit" href="/speisekarte.htm">Speisekarte ${pfeil}</a>
    </div>
    <p class="held-lead">${esc(T.lead)} <span${pr(P.portal)}>${esc(T.lead_mitnehmen)}</span>.</p>
    <dl class="held-fakten">
      <div><dt>Adresse</dt><dd><a href="${ROUTE}" rel="noopener">${ADRESSE}</a></dd></div>
      <div${pr(P.zeiten)}><dt>Geöffnet</dt><dd>${S.zeiten.kurz} ${ZEIT}</dd></div>
      <div><dt>Tagesgerichte</dt><dd>${TAGES}</dd></div>
    </dl>
  </div>
</section>`;

const tafelZeile = ([name, tr, de, preis, anker]) => `        <li><a href="/speisekarte.htm#${anker}">
          <span class="tafel-kopf"><span class="tafel-name"${tr ? ' lang="tr"' : ''}>${esc(name)}</span><span class="punkte" aria-hidden="true"></span><span class="tafel-preis">${preis.replace(' €', '&nbsp;€')}</span></span>
          <span class="tafel-de">${esc(de)}</span>
        </a></li>`;

const willkommen = `<section class="abschnitt willkommen" aria-labelledby="t-willkommen">
  <div class="huelle willkommen-raster">
    <h2 id="t-willkommen" class="zier-titel einblenden"><span lang="tr">Hoş geldiniz</span> <span>Willkommen</span></h2>
    <p class="gross-text einblenden">${T.willkommen_gross}</p>
    <p class="willkommen-text einblenden">${esc(T.willkommen)}</p>
  </div>
</section>`;

const tafel = `<section class="abschnitt tafel" aria-labelledby="t-tafel">
  <div class="huelle tafel-raster">
    <div class="tafel-bild einblenden">
      <figure class="sini">
        ${bild('sofra-platte-gemischt', '(min-width: 64rem) 1016px, 640px')}
        ${ring}
        <figcaption>${esc(S.fotos['sofra-platte-gemischt'][2])}</figcaption>
      </figure>
    </div>
    <div class="tafel-text">
      ${zier('Aus unserer Speisekarte')}
      <h2 id="t-tafel" class="einblenden">Was auf die <em>Sofra</em> kommt</h2>
      <p class="einblenden">${esc(T.grill_intro)}</p>
      <ol class="tafel-liste">
${S.tafel.map(tafelZeile).join('\n')}
      </ol>
      <a class="knopf" href="/speisekarte.htm">${icon('menu')}Ganze Speisekarte ${pfeil}</a>
    </div>
  </div>
</section>`;

const kachel = (name, k, sizes) => `      <figure class="kachel ${k} einblenden"${gast(name)}>
        ${bild(name, sizes)}
        <figcaption>${esc(S.fotos[name][2])}</figcaption>
      </figure>`;
const vitrine = `<section class="abschnitt vitrine" aria-labelledby="t-vitrine">
  <div class="huelle">
    <div class="kopfzeile">
      ${zier('Theke, Grill und Vitrine')}
      <h2 id="t-vitrine" class="einblenden">Frisch aus der <em>Vitrine</em></h2>
    </div>
    <div class="vitrine-raster">
${kachel('theke-grill-vitrine', 'kachel--gross', '(min-width: 64rem) 640px, 100vw')}
      <div class="kachel kachel--text einblenden">
        <p class="kachel-zeit">${TAGES}</p>
        <h3>Tagesgerichte</h3>
        <p>${esc(T.tagesgerichte)}</p>
      </div>
${kachel('ayran-hausgemacht', 'kachel--hoch', '(min-width: 64rem) 640px, 50vw')}
${kachel('tagesgerichte-auslage', 'kachel--breit', '(min-width: 64rem) 640px, 100vw')}
${kachel('teestation-urfa-sofrasi', '', '(min-width: 64rem) 640px, 50vw')}
    </div>
    <p class="mehr"><a class="text-link" href="/galerie.htm">Alle Bilder in der Galerie ${pfeil}</a></p>
  </div>
</section>`;

const restaurant = `<section class="abschnitt restaurant" aria-labelledby="t-restaurant">
  <div class="huelle restaurant-raster">
    <div class="restaurant-bilder">
      <figure class="restaurant-gross einblenden"${gast('innenraum-restaurant')}>${bild('innenraum-restaurant', '(min-width: 64rem) 720px, 100vw')}</figure>
      <figure class="restaurant-rund einblenden"${gast('terrasse-urfa-sofrasi')}>${bild('terrasse-urfa-sofrasi', '(min-width: 64rem) 640px, 480px')}${ring}</figure>
    </div>
    <div class="restaurant-text">
      ${zier('Zu Gast bei uns')}
      <h2 id="t-restaurant" class="einblenden">Drinnen am Grill, draußen unter <em>Schirmen</em></h2>
      <dl class="zahlen einblenden">
        <div><dt>Gäste im Restaurant</dt><dd>${S.plaetze.innen}</dd></div>
        <div><dt>Plätze auf der Terrasse</dt><dd>${S.plaetze.terrasse}</dd></div>
      </dl>
      <p class="einblenden">${esc(T.restaurant)}</p>
      <p class="einblenden">${esc(T.restaurant_schluss)}</p>
      <div class="aktionen">
        <a class="knopf zweit" href="${ROUTE}" rel="noopener">${icon('pin')}Route planen</a>
      </div>
    </div>
  </div>
</section>`;

const wissen = `<section class="abschnitt wissen" aria-labelledby="t-wissen">
  <div class="huelle">
    <div class="kopfzeile">
      ${zier('Rund um Ihren Besuch')}
      <h2 id="t-wissen" class="einblenden">Gut zu <em>wissen</em></h2>
    </div>
    <ul class="wissen-liste">
      <li class="einblenden"${pr(P.portal)}>
        ${icon('bag', 'ic ic--gross')}
        <h3>Zum Mitnehmen</h3>
        <p>${esc(T.mitnehmen)} <a href="${TEL_A}">${TEL}</a></p>
      </li>
      <li class="einblenden"${pr(P.portal)}>
        ${icon('party', 'ic ic--gross')}
        <h3>Feiern bei uns</h3>
        <p>${esc(T.feiern)}</p>
      </li>
      <li class="einblenden"${pr(P.legende)}>
        ${icon('menu', 'ic ic--gross')}
        <h3>Allergene &amp; Zusatzstoffe</h3>
        <p>${esc(T.legende)}</p>
      </li>
    </ul>
  </div>
</section>`;

const kontaktBlock = (hEbene, mitTitel) => `<div class="kontakt-karte">
      <p class="tel-titel">Telefon</p>
      <a class="riesen-tel" href="${TEL_A}">${TEL}</a>
      <div class="kontakt-spalten">
        <div>
          <${hEbene}>Adresse</${hEbene}>
          <address>URFA SOFRASI<br>${esc(S.strasse)}<br>${S.plz} ${esc(S.ort)}</address>
          <a class="knopf" href="${ROUTE}" rel="noopener">${icon('pin')}Route planen</a>
        </div>
        <div>
          <${hEbene}>Öffnungszeiten</${hEbene}>
          <table class="zeiten"${pr(P.zeiten)}>
            <tbody>
              <tr><th scope="row">${S.zeiten.tage}</th><td>${ZEIT}</td></tr>
              <tr><th scope="row">Tagesgerichte</th><td>${TAGES}</td></tr>
            </tbody>
          </table>
          <p class="status" data-status><span class="punkt" aria-hidden="true"></span><span class="status-text">${S.zeiten.kurz} ${ZEIT}</span></p>
        </div>
        <div>
          <${hEbene}>E-Mail</${hEbene}>
          <p${pr(P.email)}><a class="text-link" href="mailto:${S.email}">${S.email}</a></p>
          <p class="leise">${esc(T.gruppen)}</p>
        </div>
      </div>
      <span class="skyline skyline--karte" aria-hidden="true"></span>
    </div>`;

const kontaktStart = `<section class="abschnitt kontakt" aria-labelledby="t-kontakt">
  <div class="huelle">
    <div class="kopfzeile">
      ${zier('Kontakt &amp; Anfahrt')}
      <h2 id="t-kontakt" class="einblenden">Wir freuen uns auf <em>Ihren Besuch</em></h2>
    </div>
    ${kontaktBlock('h3')}
  </div>
</section>`;

seite('index.html', {
  id: 'index',
  titel: 'URFA SOFRASI Eislingen – Türkisches Restaurant, Grill & Döner',
  beschreibung: 'Türkisch-anatolisches Restaurant in Eislingen/Fils: Grillgerichte, Döner, Pide, Lahmacun und wechselnde Tagesgerichte. Mühlbachstraße 2, täglich geöffnet.',
  inhalt: [held, willkommen, tafel, vitrine, restaurant, wissen, kontaktStart].join('\n\n'),
  ld: true, koerper: 'seite-start',
});

// =====================================================================
// Speisekarte (Daten aus inhalt/speisekarte.json – Preise unverändert)
// =====================================================================
const TR = new Set(K.tuerkische_kategorien);
const TR_NAMEN = new Set(['İskender', 'Uludağ', 'Sütlaç']);
const falten = (s) => s.toLocaleLowerCase('de').replace(/ı/g, 'i').replace(/ß/g, 'ss').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

function gericht(g, kat) {
  const lang = TR.has(kat.id) || TR_NAMEN.has(g.name) ? ' lang="tr"' : '';
  const kennz = g.kennz ? `<sup title="Kennzeichnung: ${g.kennz}">${g.kennz}</sup>` : '';
  const menge = g.menge ? `<span class="menge">${g.menge}</span>` : '';
  const de = g.de ? `<span class="de">${g.de}</span>` : '';
  const suche = falten(`${g.nr} ${g.name} ${g.de} ${kat.titel} ${kat.tr || ''}`);
  return `          <li class="gericht"${pr(K.pruefen[g.nr])} data-suche="${esc(suche)}"><span class="nr">${g.nr}</span><span class="name"><span${lang}>${g.name}</span>${kennz}</span><span class="punkte" aria-hidden="true"></span><span class="preis">${g.preis}&nbsp;€${menge}</span>${de}</li>`;
}
function kategorie(kat) {
  const zeilen = [];
  for (const g of kat.gerichte) {
    if (kat.zwischen[g.nr]) {
      if (zeilen.length) zeilen.push('        </ul>');
      zeilen.push(`        <h3 class="zwischen">${kat.zwischen[g.nr]}</h3>`);
      zeilen.push('        <ul class="gerichte">');
    } else if (!zeilen.length) zeilen.push('        <ul class="gerichte">');
    zeilen.push(gericht(g, kat));
  }
  zeilen.push('        </ul>');
  const tr = kat.tr ? `<span class="kat-tr" lang="tr">${kat.tr}</span>` : '';
  return `      <section class="kat" id="${kat.id}" aria-labelledby="k-${kat.id}">
        <h2 id="k-${kat.id}">${tr}<span class="kat-titel">${kat.titel}</span></h2>${kat.notiz ? `\n        <p class="kat-notiz">${kat.notiz}</p>` : ''}
${zeilen.join('\n')}
      </section>`;
}
const ANZAHL = K.kategorien.reduce((n, k) => n + k.gerichte.length, 0);
const karte = `<div class="huelle seitenkopf seitenkopf--karte">
  ${zier('URFA SOFRASI')}
  <h1 class="uebergang-titel">Speisekarte</h1>
  <p class="seiten-intro">${esc(T.karte_intro)} <a class="text-link" href="${TEL_A}">${TEL}</a></p>
  <p class="seiten-intro" ${pr(P.portal).trim()}>Alle Gerichte gibt es auch zum Mitnehmen.</p>
  <a class="knopf zweit" href="/speisekarte.pdf" type="application/pdf">${icon('download')}Speisekarte als PDF</a>
</div>

<div class="werkzeug">
  <div class="huelle werkzeug-in">
    <div class="suche" role="search">
      <label class="unsichtbar" for="suche">Gericht suchen</label>
      ${icon('search')}
      <input id="suche" type="search" placeholder="Gericht suchen, z. B. Adana" autocomplete="off" enterkeyhint="search">
    </div>
    <nav class="chips" aria-label="Kategorien der Speisekarte">
${K.kategorien.map((k) => `      <a href="#${k.id}">${k.titel}</a>`).join('\n')}
    </nav>
  </div>
</div>

<div class="huelle karte">
  <p id="such-status" class="unsichtbar" role="status" aria-live="polite"></p>
  <p id="such-leer" class="such-leer" hidden>Kein Gericht gefunden. Versuchen Sie einen anderen Begriff – oder rufen Sie uns an: <a href="${TEL_A}">${TEL}</a>.</p>
  <div class="karte-spalten">
${K.kategorien.map(kategorie).join('\n')}
  </div>
  <div class="karte-fuss">
    <p>Alle Preise in Euro inklusive MwSt. · ${ANZAHL} Gerichte und Getränke</p>
    <p>Die hochgestellten Zahlen und Buchstaben kennzeichnen Zusatzstoffe und Allergene.</p>
    <p${pr(P.legende)}>Die Legende der Zusatzstoffe (1–7) und Allergene (A–N) folgt in Kürze. Fragen Sie gern bei uns nach.</p>
  </div>
</div>`;

seite('speisekarte.htm', {
  id: 'speisekarte',
  titel: 'Speisekarte – URFA SOFRASI Eislingen | Grill, Döner, Pide & Pizza',
  beschreibung: 'Die Speisekarte von URFA SOFRASI in Eislingen/Fils: Adana- und Urfa-Kebap, Grillplatten, Döner, Pide, Lahmacun, Pizza, Suppen, Künefe und Baklava – mit Preisen.',
  inhalt: karte, ld: true, koerper: 'seite-karte',
});

// =====================================================================
// Galerie (Baustein galerie, als Raster)
// =====================================================================
const galerieBild = (name, i) => `      <li${gast(name)}>
        <figure>
          <a class="galerie-bild" href="/medien/${name}-1016.webp" data-breite="1016" data-hoehe="${S.fotos[name][0]}">${bild(name, '(min-width: 64rem) 640px, (min-width: 40rem) 50vw, 100vw', { lazy: i > 1, lcp: i === 0 })}</a>
          <figcaption>${esc(S.fotos[name][2])}</figcaption>
        </figure>
      </li>`;
const galerie = `<div class="huelle seitenkopf">
  ${zier('Einblicke')}
  <h1 class="uebergang-titel">Galerie</h1>
  <p class="seiten-intro">Ein paar Eindrücke aus unserer Küche und unserem Restaurant. Ein Tipp auf ein Bild zeigt es groß.</p>
</div>
<div class="huelle galerie galerie--raster">
  <ul class="galerie-streifen">
${S.galerie.map(galerieBild).join('\n')}
  </ul>
  <dialog class="galerie-dialog" aria-label="Großansicht">
    <img src="/medien/${S.galerie[0]}-1016.webp" width="1016" height="${S.fotos[S.galerie[0]][0]}" alt="">
    <div class="galerie-dialog-fuss">
      <button class="galerie-knopf" type="button" data-dialog="zurueck" aria-label="Vorheriges Bild">←</button>
      <p class="galerie-zaehler" aria-live="polite">01 / ${String(S.galerie.length).padStart(2, '0')}</p>
      <div class="galerie-knoepfe">
        <button class="galerie-knopf" type="button" data-dialog="weiter" aria-label="Nächstes Bild">→</button>
        <button class="galerie-knopf" type="button" data-dialog="zu" aria-label="Großansicht schließen">×</button>
      </div>
    </div>
  </dialog>
</div>`;
seite('galerie.htm', {
  id: 'galerie',
  titel: 'Galerie – URFA SOFRASI Eislingen',
  beschreibung: 'Bilder aus dem URFA SOFRASI in Eislingen/Fils: Grillplatten, Döner, Meze, Theke, Teestation und unser Restaurant.',
  inhalt: galerie, koerper: 'seite-galerie',
});

// =====================================================================
// Kontakt (mit Formular aus der Vorlage: Origin-Prüfung, Honigtopf, Fehlerseite)
// =====================================================================
const kontakt = `<div class="huelle seitenkopf">
  ${zier('Kontakt &amp; Anfahrt')}
  <h1 class="uebergang-titel">Wir freuen uns auf <em>Ihren Besuch</em></h1>
  <p class="seiten-intro">in der ${esc(S.strasse)} in ${esc(S.ort)}.</p>
</div>
<div class="huelle kontakt-seite">
  ${kontaktBlock('h2')}
  <div class="kontakt-unten">
    <section class="anfahrt" aria-labelledby="t-anfahrt">
      <h2 id="t-anfahrt">Anfahrt</h2>
      <p>${esc(T.anfahrt)}</p>
      <p class="leise">${esc(T.ohne_karte)}</p>
    </section>
    <section class="nachricht" id="nachricht" aria-labelledby="t-nachricht"${pr(P.formular)}>
      <h2 id="t-nachricht">Nachricht schreiben</h2>
      <p class="leise">Für Fragen, die nicht eilen. Was schnell gehen soll, klären Sie am besten am Telefon: <a href="${TEL_A}">${TEL}</a>.</p>
      <form class="formular" method="post" action="/api/kontakt">
        <label>Name <input id="k-name" name="name" type="text" autocomplete="name" required maxlength="100"></label>
        <label>E-Mail <input id="k-email" name="email" type="email" autocomplete="email" required maxlength="254"></label>
        <label>Nachricht <textarea id="k-nachricht" name="nachricht" required minlength="5" maxlength="5000"></textarea></label>
        <div class="honig" aria-hidden="true"><label>Nicht ausfüllen <input id="k-url" name="firma_url" type="text" tabindex="-1" autocomplete="off"></label></div>
        <p class="hinweis">Wir verwenden Ihre Angaben nur, um Ihre Anfrage zu beantworten. Mehr dazu im <a href="/datenschutz.htm">Datenschutz</a>.</p>
        <p><button class="knopf" type="submit">Nachricht senden ${pfeil}</button></p>
      </form>
    </section>
  </div>
</div>`;
seite('kontakt.htm', {
  id: 'kontakt',
  titel: 'Kontakt & Anfahrt – URFA SOFRASI Eislingen/Fils',
  beschreibung: `So erreichen Sie URFA SOFRASI: ${S.strasse}, ${S.plz} ${S.ort}. Telefon ${S.telefon_anzeige}, Öffnungszeiten und Route.`,
  inhalt: kontakt, ld: true, koerper: 'seite-kontakt',
});

// =====================================================================
// Rechtliches: nur Platzhalter, Originaltext kommt vom Betreiber (nicht selbst formulieren)
// =====================================================================
const I = S.impressum_auszug;
seite('impressum.htm', {
  id: 'impressum', robots: 'noindex, follow', koerper: 'seite-recht',
  titel: 'Impressum – URFA SOFRASI Eislingen',
  beschreibung: `Impressum von URFA SOFRASI, ${S.strasse}, ${S.plz} ${S.ort}.`,
  inhalt: `<div class="huelle recht">
  ${zier('URFA SOFRASI')}
  <h1>Impressum</h1>
  <div class="platzhalter"${pr('Rechtstext nicht erfinden: Den vollständigen Impressumstext der bisherigen Seite 1:1 übernehmen und rechtlich prüfen lassen.')}>
    <p>PLATZHALTER – Den vollständigen Text von <strong>urfasofrasi-eislingen.de/impressum.htm</strong> hier unverändert einfügen.
    Die bisherige Website war für die Überarbeitung nicht abrufbar. Die folgenden Angaben stammen aus einem Suchmaschinen-Auszug und müssen abgeglichen werden.</p>
  </div>
  <h2>Angaben zum Betreiber</h2>
  <p>${esc(I.betreiber)}<br>Inhaberin: ${esc(I.inhaberin)}<br>${esc(S.strasse)}<br>${S.plz} ${esc(S.ort)}</p>
  <h2>Kontakt</h2>
  <p>Telefon: <a href="${TEL_A}">${TEL}</a><br>E-Mail: <a href="mailto:${S.email}">${S.email}</a></p>
  <h2>Steuerangaben</h2>
  <p>Steuernummer: ${esc(I.steuernummer)}</p>
</div>`,
});
seite('datenschutz.htm', {
  id: 'datenschutz', robots: 'noindex, follow', koerper: 'seite-recht',
  titel: 'Datenschutz – URFA SOFRASI Eislingen',
  beschreibung: 'Datenschutzerklärung von URFA SOFRASI Eislingen/Fils.',
  inhalt: `<div class="huelle recht">
  ${zier('URFA SOFRASI')}
  <h1>Datenschutz&shy;erklärung</h1>
  <div class="platzhalter"${pr('Rechtstext nicht erfinden: bestehende Datenschutzerklärung übernehmen und an die neue Technik anpassen lassen.')}>
    <p>PLATZHALTER – Die bestehende Datenschutzerklärung hier einfügen und an die neue Website anpassen lassen.</p>
    <p>Technische Fakten der neuen Website, die für die Erklärung wichtig sind:</p>
    <ul>
      <li>keine Cookies, kein Tracking, keine Analyse-Werkzeuge</li>
      <li>Schriften werden vom eigenen Server geladen (keine Google Fonts)</li>
      <li>keine eingebettete Karte; „Route planen“ ist ein normaler Link zu Google Maps</li>
      <li>Kontaktformular (kontakt.htm): Name, E-Mail und Nachricht werden per E-Mail-Dienst (Resend) an das Restaurant weitergeleitet und nicht auf der Website gespeichert</li>
      <li>Hosting bei Cloudflare Pages; Server-Protokolle je nach Anbieter</li>
    </ul>
  </div>
</div>`,
});

seite('404.html', {
  id: '404', robots: 'noindex', koerper: 'seite-recht',
  titel: 'Seite nicht gefunden – URFA SOFRASI',
  beschreibung: 'Diese Seite gibt es nicht (mehr).',
  inhalt: `<div class="huelle seitenkopf seitenkopf--mitte">
  ${zier('404', 'zier--mitte')}
  <h1>Seite nicht <em>gefunden</em></h1>
  <p class="seiten-intro">Diese Seite gibt es leider nicht (mehr).</p>
  <div class="aktionen"><a class="knopf" href="/">Zur Startseite</a><a class="knopf zweit" href="/speisekarte.htm">Zur Speisekarte</a></div>
</div>`,
});
seite('nachricht-gesendet.html', {
  id: 'danke', robots: 'noindex', koerper: 'seite-recht',
  titel: 'Nachricht gesendet – URFA SOFRASI',
  beschreibung: 'Ihre Nachricht an URFA SOFRASI ist angekommen.',
  inhalt: `<div class="huelle seitenkopf seitenkopf--mitte">
  ${zier('Danke', 'zier--mitte')}
  <h1>Ihre Nachricht ist <em>angekommen</em></h1>
  <p class="seiten-intro">Wir melden uns so bald wie möglich. Eilt es, rufen Sie uns an: <a href="${TEL_A}">${TEL}</a>.</p>
  <div class="aktionen"><a class="knopf" href="/">Zur Startseite</a></div>
</div>`,
});

// ---------- Sitemap ----------
const seiten = ['', 'speisekarte.htm', 'galerie.htm', 'kontakt.htm'];
writeFileSync(new URL('sitemap.xml', OUT), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${seiten.map((s) => `  <url><loc>${S.basis}/${s}</loc></url>`).join('\n')}
</urlset>
`);
console.log(`ok – 8 Seiten, Speisekarte mit ${ANZAHL} Positionen${SCHEMA ? ` (Schema ${process.env.SCHEMA})` : ''}`);
