// Baut alle Seiten von Merys Clean:   node bauen.mjs
// Inhalte stehen NUR in inhalt/seite.json (Fakten von merysclean.de, Stand 2026-10-01). HTML in public/ nie von Hand ändern.
// Schreibt außerdem public/sitemap.xml, public/robots.txt, public/_redirects und das CSS-Bündel public/css/mc.<hash>.css.
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';

const S = JSON.parse(readFileSync(new URL('./inhalt/seite.json', import.meta.url), 'utf8'));
const OUT = new URL('./public/', import.meta.url);

// ---------- Helfer ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nb = (s) => esc(s).replace(/ /g, '&nbsp;');                       // Telefonnummer bricht nie um (FEHLER 7)
const pr = (grund) => (grund ? ` data-pruefen="${esc(grund)}"` : '');    // offene Angabe für den Kunden
const TEL = nb(S.telefon_anzeige);
const TEL_A = `tel:${S.telefon_link}`;
const FEST = nb(S.festnetz_anzeige);
const FEST_A = `tel:${S.festnetz_link}`;
const MAIL_A = `mailto:${S.email}`;
const pfeil = '<span class="pfeil" aria-hidden="true">→</span>';
const extern = '<span class="unsichtbar"> (externe Seite)</span>';
// Einziges Inline-Skript (Hash in public/_headers): Klasse js vor dem ersten Zeichnen.
export const KOPF_SKRIPT = "document.documentElement.classList.add('js')";

const ic = (pfad, klasse = 'ic') => `<svg class="${klasse}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${pfad}</svg>`;
const ICON = {
  tel: ic('<path d="M6.6 3.5h2.6l1.4 4.2-2 1.5a12 12 0 0 0 6.2 6.2l1.5-2 4.2 1.4v2.6a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"/>'),
  post: ic('<path d="M3.5 6.5h17v11h-17z"/><path d="m3.5 7 8.5 6.5L20.5 7"/>'),
  whatsapp: ic('<path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6Z"/><path d="M9.3 8.6c.2-.4.6-.5 1-.3l.8 1.6-.6.9a5 5 0 0 0 2.6 2.6l.9-.6 1.6.8c.2.4.1.8-.3 1a3 3 0 0 1-2.4.3 6.6 6.6 0 0 1-3.9-3.9 3 3 0 0 1 .3-2.4Z"/>'),
  ort: ic('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21Z"/><circle cx="12" cy="10" r="2.3"/>'),
  uhr: ic('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  haken: ic('<path d="m5 12.5 4.2 4.2L19 7"/>', 'ic ic-haken'),
  route: ic('<path d="M5 19c4-1 3-6 7-7s4-5 7-7"/><circle cx="5" cy="19" r="1.6"/><circle cx="19" cy="5" r="1.6"/>'),
};

// Eigene Bildzeichen (24er-Raster, Strich 1,6, runde Enden). Seit A-078 ganz weiß gezeichnet (class "a" bleibt als Detail-Markierung),
// grün ist nur der gestrichelte Rand. Gezeigt als „Aufnäher“ (.patch): schwarzer Kreis,
// gestrichelte Naht, Zeichen in Creme. Nur dort, wo ein Zeichen etwas erklärt (Leistungen, Zusagen, Ablauf, Gründe).
const a = (d) => `<path class="a" d="${d}"/>`;
const STERN = (x, y, r) => { const f = (n) => +(n * r).toFixed(2); return `M${x} ${y - r}c${f(.12)} ${f(.76)} ${f(.54)} ${f(1.18)} ${f(1.3)} ${f(1.3)}-${f(.76)} ${f(.12)}-${f(1.18)} ${f(.54)}-${f(1.3)} ${f(1.3)}-${f(.12)}-${f(.76)}-${f(.54)}-${f(1.18)}-${f(1.3)}-${f(1.3)} ${f(.76)}-${f(.12)} ${f(1.18)}-${f(.54)} ${f(1.3)}-${f(1.3)}z`; };
const Z = {
  // Leistungen
  unterhaltsreinigung: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3"/>' + a(STERN(12, 15, 3)),
  bueroreinigung: '<path d="M4.5 20.5v-15a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v15M14.5 9.5h4a1 1 0 0 1 1 1v10M3 20.5h18M8 8.5h.01M11 8.5h.01M8 12h.01M11 12h.01M8 15.5h.01M11 15.5h.01"/>' + a(STERN(18.5, 5, 2.4)),
  fensterreinigung: '<rect x="3.5" y="3.5" width="10.5" height="16" rx="1"/><path d="M8.75 3.5v16M3.5 11.5h10.5"/>' + a('M13 18.5 18.5 13M15.75 15.75l4 4'),
  treppenhausreinigung: '<path d="M3.5 20.5h5v-4h4v-4h4v-4h4"/>' + a('M3.5 14 15.5 3.5'),
  sonderreinigung: '<path d="M12 3.8 20 8v8.6l-8 4.2-8-4.2V8z"/><path d="m4 8 8 4.3L20 8M12 12.3v8.5"/>' + a('m8 5.9 8 4.2'),
  privathaushalt: '<path d="M3.5 11 12 4l8.5 7M6 9v11.5h12V9"/>' + a('M10 20.5v-5.5h4v5.5'),
  // Zusagen und Ablauf
  lupe: '<circle cx="10.5" cy="10.5" r="6"/>' + a('m15 15 5.5 5.5'),
  dokument: '<path d="M6 3.5h7.5l4.5 4.5v12.5H6z"/><path d="M13.5 3.5V8H18"/>' + a('m9 14.2 2 2 4-4'),
  schild: '<path d="M12 3.5 5 6.2v5.6c0 4.4 3 7.6 7 8.7 4-1.1 7-4.3 7-8.7V6.2z"/>' + a('m9 12 2.2 2.2 4-4.2'),
  person: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20.5c.7-4 3.5-6.4 7-6.4s6.3 2.4 7 6.4"/>' + a('m9.6 14.4 2.4 2.3 2.4-2.3'),
  anfrage: '<path d="M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7.5l-4 3.5v-3.5a1.5 1.5 0 0 1-1.5-1.5z"/>' + a('M8.5 9h7M8.5 12h4.5'),
  glanz: `<path d="${STERN(10.5, 11.5, 6.5)}"/>` + a(STERN(18, 17.5, 2.6)),
  schluessel: '<circle cx="8" cy="15.5" r="4"/><path d="m10.9 12.7 8.6-8.7M16.5 7l2.5 2.5"/>' + a('M14 9.5l2 2'),
  // Wegweiser
  start: '<path d="M3.5 11 12 4l8.5 7M6 9.5v11h12v-11"/>' + a('M10 20.5v-5h4v5'),
  raster: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/>' + a('M13 16.5h7M16.5 13v7'),
  ort: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21Z"/>' + a('M12 7.7a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 0 1 0-4.6'),
  telefon: '<path d="M6.6 3.5h2.6l1.4 4.2-2 1.5a12 12 0 0 0 6.2 6.2l1.5-2 4.2 1.4v2.6a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"/>' + a('M15 3.8a5.5 5.5 0 0 1 5.2 5.2'),
  medaille: '<circle cx="12" cy="9" r="5.5"/><path d="m8.7 13.4-1.4 7.1 4.7-2.3 4.7 2.3-1.4-7.1"/>' + a(STERN(12, 9, 2.4)),
  blatt: '<path d="M5 19.5C5 11 10.5 5 19.5 4.5c.5 9.5-5 15-14.5 15z"/>' + a('M5 19.5c3.2-4.6 6.3-7.6 10-10'),
};
const zeichen = (name, klasse = '') => `<span class="patch${klasse ? ` ${klasse}` : ''}" aria-hidden="true"><svg class="patch-ic" viewBox="0 0 24 24" focusable="false">${Z[name]}</svg></span>`;
const ZUSAGE_Z = ['lupe', 'dokument', 'schild', 'person'];
const ABLAUF_Z = ['anfrage', 'lupe', 'dokument', 'glanz'];
const GRUND_Z = ['schild', 'person', 'schluessel', 'medaille', 'blatt', 'dokument'];

// ---------- Bilder (AVIF + WebP, Breiten aus seite.json, nie hochskaliert) ----------
function bild(b, sizes, { lazy = true, prio = false, klasse = '' } = {}) {
  const set = (t) => b.breiten.map((x) => `/medien/${b.name}-${x}.${t} ${x}w`).join(', ');
  const laden = prio ? ' fetchpriority="high" decoding="async"' : lazy ? ' loading="lazy" decoding="async"' : ' decoding="async"';
  const mitte = b.breiten[Math.min(1, b.breiten.length - 1)];
  return `<picture${klasse ? ` class="${klasse}"` : ''}><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><img src="/medien/${b.name}-${mitte}.webp" srcset="${set('webp')}" sizes="${sizes}" width="${b.w}" height="${b.h}" alt="${esc(b.alt)}"${laden}></picture>`;
}

// ---------- Navigation ----------
const LEI = S.leistungen;
const NAV = [['leistungen', 'Leistungen'], ['einsatzgebiet', 'Einsatzgebiet'], ['ueber-uns', 'Über uns'], ['kontakt', 'Kontakt']];
const SEITEN = []; // indexierte Adressen für die Sitemap

function kopfzeile(aktiv) {
  const eintrag = ([h, t]) => {
    const an = aktiv === h || (h === 'leistungen' && LEI.some((l) => l.url === aktiv)) ? ' aria-current="page"' : '';
    if (h !== 'leistungen') return `        <li><a href="/${h}"${an}>${t}</a></li>`;
    return `        <li class="nav-leistungen"><a class="nav-oben" href="/leistungen"${an}>Leistungen</a>
          <div class="panel">
            <ul class="nav-unter">
${LEI.map((l) => `              <li><a href="/${l.url}"${aktiv === l.url ? ' aria-current="page"' : ''}>${zeichen(l.id, 'patch--klein')}<span class="nav-unter-text"><span class="nav-unter-name">${esc(l.name)}</span><span class="nav-unter-kurz">${esc(l.kurz)}</span></span></a></li>`).join('\n')}
            </ul>
            <div class="panel-seite">
              <p class="panel-titel">Jede Leistung beginnt mit einer kostenlosen Besichtigung.</p>
              <p class="panel-text">Wir sehen uns Ihr Objekt an und schicken Ihnen danach ein unverbindliches Angebot.</p>
              <a class="knopf knopf--stick" href="/angebot">Besichtigung anfragen</a>
              <a class="textlink textlink--hell" href="/leistungen">Alle Leistungen im Überblick ${pfeil}</a>
            </div>
          </div>
        </li>`;
  };
  return `<div class="leiste">
  <div class="huelle leiste-in">
    <p>${ICON.uhr}<span>${esc(S.zeiten_text)}</span></p>
    <p>${ICON.ort}<span>${esc(S.strasse)}, ${esc(S.ort)}</span></p>
    <p class="leiste-rechts"><a href="${S.whatsapp_link}" rel="noopener"${pr(S.whatsapp_pruefen)}>${ICON.whatsapp}WhatsApp${extern}</a><a href="${MAIL_A}">${ICON.post}${esc(S.email)}</a></p>
  </div>
</div>
<header class="kopf">
  <div class="huelle kopf-in">
    <a class="marke" href="/"><img src="/img/logo-hell.svg" width="128" height="52" alt="Merys Clean – Dienstleistungen, Gebäudereinigung"><span class="unsichtbar"> – zur Startseite</span></a>
    <nav class="nav blatt" id="nav" aria-label="Hauptnavigation">
      <ul>
${NAV.map(eintrag).join('\n')}
        <li class="nur-blatt blatt-wege"><a class="knopf knopf--stick" href="/angebot">Kostenloses Angebot anfragen</a><a class="knopf zweit knopf--hell" href="${TEL_A}">${ICON.tel}<span>Anrufen&nbsp;${TEL}</span></a><span class="blatt-klein"><a href="${S.whatsapp_link}" rel="noopener">${ICON.whatsapp}WhatsApp${extern}</a><a href="${MAIL_A}">${ICON.post}E-Mail</a></span><span class="blatt-zeit">${ICON.uhr}${esc(S.zeiten_text)}</span></li>
      </ul>
    </nav>
    <div class="kopf-wege">
      <a class="kopf-tel" href="${TEL_A}">${ICON.tel}<span class="kopf-tel-nr">${TEL}</span><span class="unsichtbar kopf-tel-wort"> anrufen</span></a>
      <a class="knopf knopf--stick kopf-angebot" href="/angebot"${aktiv === 'angebot' ? ' aria-current="page"' : ''}>Angebot<span class="kopf-angebot-lang"> anfragen</span></a>
    </div>
    <button class="menue-knopf" type="button" aria-expanded="false" aria-controls="nav">Menü</button>
  </div>
</header>`;
}

function fusszeile() {
  return `<footer class="fuss">
  <div class="huelle">
    <div class="fuss-raster">
      <div class="fuss-marke">
        <img src="/img/logo-hell.svg" width="148" height="60" alt="Merys Clean" loading="lazy" decoding="async">
        <p class="fuss-claim">Gebäudereinigung aus Eislingen/Fils für Göppingen und die Region.</p>
      </div>
      <div>
        <h2 class="fuss-titel">Kontakt</h2>
        <address class="fuss-adresse">${esc(S.firma_lang)}<br>${esc(S.strasse)}<br>${esc(S.plz)} ${esc(S.ort)}</address>
        <ul class="fuss-liste">
          <li><a href="${TEL_A}">${ICON.tel}${TEL}</a></li>
          <li><a href="${MAIL_A}">${ICON.post}${esc(S.email)}</a></li>
          <li><span class="fuss-zeit">${ICON.uhr}${esc(S.zeiten_text)}</span></li>
        </ul>
      </div>
      <div>
        <h2 class="fuss-titel">Leistungen</h2>
        <ul class="fuss-liste">
${LEI.map((l) => `          <li><a href="/${l.url}">${esc(l.name)}</a></li>`).join('\n')}
        </ul>
      </div>
      <div>
        <h2 class="fuss-titel">Unternehmen</h2>
        <ul class="fuss-liste">
          <li><a href="/angebot">Angebot anfragen</a></li>
          <li><a href="/einsatzgebiet">Einsatzgebiet</a></li>
          <li><a href="/ueber-uns">Über uns</a></li>
          <li><a href="/kontakt">Kontakt</a></li>
          <li><a href="${S.facebook}" rel="noopener">Facebook${extern}</a></li>
          <li><a href="${S.instagram}" rel="noopener">Instagram${extern}</a></li>
        </ul>
      </div>
    </div>
    <div class="fuss-unten">
      <p>© 2026 ${esc(S.firma_lang)}</p>
      <p class="fuss-recht"><a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a></p>
    </div>
  </div>
</footer>`;
}

// ---------- CSS-Bündel (eine Anfrage statt drei, Name mit Inhalts-Hash) ----------
const CSS_QUELLEN = ['marke.css', 'stil.css', 'bausteine.css'];
let CSS_DATEI = '';
function cssBuendeln() {
  for (const f of readdirSync(new URL('css/', OUT))) if (/^mc\.[0-9a-f]{10}\.css$/.test(f)) unlinkSync(new URL(`css/${f}`, OUT));
  const inhalt = CSS_QUELLEN.map((f) => `/* ===== ${f} ===== */\n${readFileSync(new URL(`css/${f}`, OUT), 'utf8')}`).join('\n');
  CSS_DATEI = `mc.${createHash('sha256').update(inhalt).digest('hex').slice(0, 10)}.css`;
  writeFileSync(new URL(`css/${CSS_DATEI}`, OUT), inhalt);
}

// ---------- Rahmen jeder Seite ----------
// Wegweiser am Ende jeder Unterseite: die Hauptziele (ohne die aktuelle Seite), damit man weiter- und zurückfindet
const WEGE = [
  ['index.html', '/', 'Startseite', 'Alles über Merys Clean auf einen Blick', 'start'],
  ['leistungen.html', '/leistungen', 'Alle Leistungen', 'Von Unterhalts- bis Sonderreinigung', 'raster'],
  ['einsatzgebiet.html', '/einsatzgebiet', 'Einsatzgebiet', 'Eislingen, Göppingen und die Region', 'ort'],
  ['ueber-uns.html', '/ueber-uns', 'Über uns', 'Das Team und was uns wichtig ist', 'person'],
  ['kontakt.html', '/kontakt', 'Kontakt', 'Telefon, E-Mail, Adresse und Zeiten', 'telefon'],
  ['angebot.html', '/angebot', 'Angebot anfragen', 'Kostenlos und unverbindlich', 'dokument'],
];
const wegweiser = (datei) => `<section class="abschnitt abschnitt--eng wegweiser" aria-labelledby="wegweiser-titel">
  <div class="huelle">
    <h2 id="wegweiser-titel" class="wegweiser-titel">Wohin als Nächstes?</h2>
    <ul class="wegweiser-liste">
${WEGE.filter(([d]) => d !== datei).map(([, href, titel, text, z]) => `      <li><a href="${href}">${zeichen(z, 'patch--klein')}<span><strong>${titel}</strong> <span class="wegweiser-text">${text}</span></span>${pfeil}</a></li>`).join('\n')}
    </ul>
  </div>
</section>`;

const OG = { name: 'team-gruppe-1024', w: 1024, h: 546, alt: S.team_gruppe.alt };
function seite(datei, { titel, beschreibung, inhalt, aktiv = '', robots = '', jsonld = null, klasse = '', preload = '' }) {
  const pfad = datei === 'index.html' ? '' : datei.replace(/\.html$/, '');
  const kanon = `${S.basis}/${pfad}`;
  if (!robots) SEITEN.push(kanon);
  // Seiten ohne eigene Daten: schlichte WebPage, die zum Betrieb gehört (ersetzt die frühere Brotkrumen-Liste)
  if (!jsonld && !robots) jsonld = [{ '@type': 'WebPage', name: titel, url: kanon, isPartOf: { '@id': `${S.basis}/#website` }, about: { '@id': ID } }];
  const ld = jsonld ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': jsonld }).replace(/</g, '\\u003c')}</script>\n` : '';
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titel)}</title>
<meta name="description" content="${esc(beschreibung)}">
${robots ? `<meta name="robots" content="${robots}">\n` : ''}${datei === '404.html' ? '' : `<link rel="canonical" href="${kanon}">\n`}<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
<meta property="og:site_name" content="${esc(S.firma)}">
<meta property="og:title" content="${esc(titel)}">
<meta property="og:description" content="${esc(beschreibung)}">
<meta property="og:url" content="${kanon}">
<meta property="og:image" content="${S.basis}/medien/${OG.name}.webp">
<meta property="og:image:width" content="${OG.w}">
<meta property="og:image:height" content="${OG.h}">
<meta property="og:image:alt" content="${esc(OG.alt)}">
<meta name="theme-color" content="#121412">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/instrument-serif-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/instrument-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/${CSS_DATEI}">
${preload}<script>${KOPF_SKRIPT}</script>
<script src="/js/bausteine.js" defer></script>
<script src="/js/seite.js" defer></script>
${ld}</head>
<body${klasse ? ` class="${klasse}"` : ''}>
<a class="sprung" href="#inhalt">Zum Inhalt springen</a>
${kopfzeile(aktiv)}

<main id="inhalt">
${(datei === 'index.html' ? inhalt : `${inhalt}\n\n${wegweiser(datei)}`).replace(/([^\s<>;]+) ?(<span class="pfeil" aria-hidden="true">→<\/span>)/g, '<span class="nw">$1&nbsp;$2</span>')}
</main>

${fusszeile()}

<nav class="schnell" aria-label="Schnellzugriff">
  <a class="knopf zweit knopf--hell" href="${TEL_A}">${ICON.tel}<span>Anrufen</span></a>
  <a class="knopf knopf--stick" href="/angebot">Angebot anfragen</a>
</nav>
</body>
</html>
`;
  writeFileSync(new URL(datei, OUT), html.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n'));
}

// ---------- Wiederkehrende Abschnitte ----------
const ueber = (text, hell = false) => `<p class="ueberzeile${hell ? ' ueberzeile--hell' : ''}">${text}</p>`;
const schwung = (klasse = 'schwung') => `<svg class="${klasse}" viewBox="0 0 400 60" aria-hidden="true" focusable="false" preserveAspectRatio="none"><path d="M4 44C90 58 250 58 396 8"/></svg>`;

const zweiWege = (zusatz = '') => `<div class="wege">
        <a class="knopf gross" href="/angebot${zusatz}">Kostenloses Angebot anfragen</a>
        <a class="knopf zweit gross" href="${TEL_A}">${ICON.tel}<span>Anrufen <span class="wege-nr">${TEL}</span></span></a>
      </div>`;

const zusagen = (klasse = '') => `<section class="vertrauen${klasse}" aria-labelledby="vertrauen-titel">
  <div class="huelle">
    <h2 id="vertrauen-titel" class="unsichtbar">Was Sie bei Merys Clean bekommen</h2>
    <ul class="vertrauen-liste">
${S.zusagen.map((z, i) => `      <li>${zeichen(ZUSAGE_Z[i], 'patch--klein')}<span><strong>${esc(z.titel)}</strong> ${esc(z.text)}</span></li>`).join('\n')}
    </ul>
  </div>
</section>`;

const ablauf = (titel = 'So läuft es ab') => `<section class="abschnitt ablauf dunkel" aria-labelledby="ablauf-titel">
  <div class="huelle">
    <div class="abschnitt-kopf einblenden">
      ${ueber('Ablauf', true)}
      <h2 id="ablauf-titel">${titel}</h2>
      <p class="abschnitt-text">Von der ersten Anfrage bis zur festen Reinigung: Sie wissen vorher, was gereinigt wird und was es kostet.</p>
    </div>
    <ol class="schritte">
${S.ablauf.map((s, i) => `      <li class="schritt einblenden">${zeichen(ABLAUF_Z[i], 'patch--gross')}<h3>${esc(s.titel)}</h3><p>${esc(s.text)}</p></li>`).join('\n')}
    </ol>
  </div>
</section>`;

const garantie = () => `<section class="abschnitt garantie" aria-labelledby="garantie-titel">
  <div class="huelle garantie-in">
    <div class="garantie-siegel einblenden"><div class="medaille" data-kippen><p class="siegel">${zeichen('schild')}<span class="siegel-zahl">100&nbsp;%</span><span class="siegel-wort">Zufriedenheit garantiert</span></p><span class="medaille-glanz" aria-hidden="true"></span></div></div>
    <div class="garantie-text einblenden">
      ${ueber('Zufriedenheits&shy;garantie')}
      <h2 id="garantie-titel">${esc(S.garantie.titel)}</h2>
      <p>${esc(S.garantie.text)}</p>
      <p class="garantie-tel">Reklamation am Telefon: <a href="${TEL_A}">${TEL}</a></p>
    </div>
  </div>
</section>`;

const faq = (eintraege, titel = 'Häufige Fragen', id = 'fragen') => `<section class="abschnitt faq" aria-labelledby="${id}-titel">
  <div class="huelle faq-in">
    <div class="abschnitt-kopf einblenden">
      ${ueber('Fragen und Antworten')}
      <h2 id="${id}-titel">${titel}</h2>
      <p class="abschnitt-text">Ihre Frage ist nicht dabei? Rufen Sie an: <a href="${TEL_A}">${TEL}</a>, Mo–Fr 8–16 Uhr.</p>
    </div>
    <div class="faq-liste">
${eintraege.map((e) => `      <details class="faq-eintrag"${pr(e.pruefen)}><summary>${esc(e.f)}</summary><p>${esc(e.a)}</p></details>`).join('\n')}
    </div>
  </div>
</section>`;

const anfrageBand = (titel = 'Kostenloses Angebot für Ihr Objekt', text = 'Erzählen Sie uns kurz, was gereinigt werden soll. Wir melden uns, vereinbaren die kostenlose Besichtigung und schicken Ihnen ein unverbindliches Angebot.') => `<section class="abschnitt anfrage" aria-labelledby="anfrage-titel">
  <div class="huelle anfrage-in dunkel einblenden">
    <svg class="anfrage-schwung" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M-20 280C200 320 520 290 740 170S960 30 1040 10"/></svg>
    <div class="anfrage-text">
      ${ueber('Nächster Schritt', true)}
      <h2 id="anfrage-titel">${titel}</h2>
      <p class="abschnitt-text">${text}</p>
      <ul class="anfrage-punkte">
        <li>${ICON.haken}Kostenlose Besichtigung</li>
        <li>${ICON.haken}Unverbindliches Angebot</li>
        <li>${ICON.haken}Mo–Fr 8–16&nbsp;Uhr erreichbar</li>
      </ul>
    </div>
    <div class="anfrage-fach">
      <a class="knopf knopf--stick gross" href="/angebot"><span>Angebot online anfragen ${pfeil}</span></a>
      <p class="anfrage-oder">oder direkt</p>
      <a class="anfrage-tel" href="${TEL_A}">${ICON.tel}<span><span class="anfrage-klein">Anrufen</span>${TEL}</span></a>
      <p class="anfrage-mehr"><a href="${S.whatsapp_link}" rel="noopener"${pr(S.whatsapp_pruefen)}>${ICON.whatsapp}WhatsApp${extern}</a><a href="${MAIL_A}">${ICON.post}${esc(S.email)}</a></p>
    </div>
  </div>
</section>`;

// ---------- Karte Einsatzgebiet (eigene SVG, Orte nach Koordinaten, schematisch) ----------
function karte(id = 'karte') {
  // Schematisch: Projektion um den Firmensitz mit Wurzel-Verzerrung (nahe Orte im Filstal bekommen Platz, ferne rücken heran).
  const K = S.karte; const sitz = K.orte.find((o) => o.sitz);
  const xy = (o) => {
    const dx = (o.lon - sitz.lon) * 0.659, dy = sitz.lat - o.lat; const r = Math.hypot(dx, dy); const f = r ? Math.sqrt(r) / r : 0;
    return [Math.round((dx * f + 0.58) * 560 + 130), Math.round((dy * f + 0.65) * 560 + 50)];
  };
  const [sx, sy] = xy(sitz);
  // Lage der Beschriftung, unabhängig von der Schriftgröße (dominant-baseline statt fester Abstände)
  const LAGE = { n: ['middle', 0, -12, 'auto'], s: ['middle', 0, 13, 'hanging'], o: ['start', 12, 0, 'central'], w: ['end', -12, 0, 'central'],
    no: ['start', 8, -10, 'auto'], sw: ['end', -8, 10, 'hanging'] };
  const wege = K.orte.filter((o) => !o.sitz).map((o) => { const [x, y] = xy(o); const mx = (sx + x) / 2 + (y - sy) * 0.16, my = (sy + y) / 2 - (x - sx) * 0.16; return `<path d="M${sx} ${sy}Q${Math.round(mx)} ${Math.round(my)} ${x} ${y}"/>`; }).join('');
  const punkte = K.orte.map((o) => { const [x, y] = xy(o); const [a, dx, dy, b] = LAGE[o.label]; return `<g class="ort${o.sitz ? ' ort--sitz' : ''}${o.klein ? ' ort--klein' : ''}"><circle cx="${x}" cy="${y}" r="${o.sitz ? 9 : 6}"/><text x="${x + dx}" y="${y + dy}" text-anchor="${a}" dominant-baseline="${b}">${esc(o.kurz || o.name)}</text></g>`; }).join('');
  return `<figure class="karte"${pr(K.pruefen)}>
      <svg class="karte-svg" viewBox="0 0 800 730" role="img" aria-label="Schematische Karte des Einsatzgebiets: Firmensitz Eislingen/Fils in der Mitte, Orte von Stuttgart im Westen bis Ulm im Südosten und Schwäbisch Hall im Norden">
        <g class="karte-wege">${wege}</g>
        ${punkte}
      </svg>
      <figcaption>Schematisch, nicht maßstäblich. Firmensitz grün hervorgehoben.</figcaption>
    </figure>`;
}
const gebietText = () => `<div class="gebiet-gruppen">
${S.karte.gruppen.map((g) => `      <div class="gebiet-gruppe"><h3>${esc(g.titel)}</h3><p>${g.orte.map((o) => esc(o)).join(', ')}${g.titel === 'Filstal' ? `, <span${pr(S.karte.ohne_karte[0].pruefen)}>${esc(S.karte.ohne_karte[0].name)}</span>` : ''}</p></div>`).join('\n')}
    </div>`;

// ---------- Team ----------
const portraet = (p, gross = false) => `<figure class="portraet${gross ? ' portraet--gross' : ''} einblenden">
        <div class="portraet-bild"${pr(p.bild.pruefen)}>${bild(p.bild, gross ? '(min-width: 64rem) 26rem, (min-width: 40rem) 45vw, 88vw' : '(min-width: 64rem) 22rem, (min-width: 40rem) 45vw, 88vw')}</div>
        <figcaption>
          <span class="portraet-name">${esc(p.name)}</span>
          <span class="portraet-rolle"${pr(p.rolle_pruefen)}>${esc(p.rolle)}</span>
          <blockquote class="portraet-zitat" data-pruefen="${esc(p.zitat_pruefen)}"><p>„Hier steht bald ein persönlicher Satz von ${esc(p.name.split(' ')[0])}.“</p></blockquote>
        </figcaption>
      </figure>`;

// ---------- JSON-LD ----------
const ID = `${S.basis}/#betrieb`;
const betrieb = () => ({
  '@type': S.schema_typ || 'ProfessionalService', '@id': ID, name: S.firma, legalName: S.firma_lang, url: `${S.basis}/`,
  logo: `${S.basis}/img/logo.svg`, image: `${S.basis}/medien/team-gruppe-1024.webp`,
  telephone: S.telefon_link, email: S.email,
  address: { '@type': 'PostalAddress', streetAddress: S.strasse, postalCode: S.plz, addressLocality: S.ort, addressCountry: S.land },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: S.zeiten.tage, opens: S.zeiten.von, closes: S.zeiten.bis }],
  // nur Orte, die auf der Startseite als Text stehen (Satz zum Einsatzgebiet, H1, Kartenbeschriftung)
  areaServed: S.karte.orte.filter((o) => `${S.gebiet_satz} ${S.hero.h1_vor}${S.hero.h1_schwung} ${S.karte.orte.map((x) => x.kurz || x.name).join(' ')}`.includes(o.name)).map((o) => ({ '@type': 'City', name: o.name })),
  sameAs: [S.facebook, S.instagram],
});

// =====================================================================
// Seiten
// =====================================================================
cssBuendeln();

// ---------- Startseite ----------
{
  const H = S.hero;
  const inhalt = `<section class="held" aria-labelledby="titel">
  <div class="huelle held-in">
    <div class="held-text">
      ${ueber(esc(H.ueberzeile))}
      <h1 id="titel">${esc(H.h1_vor)}<span class="mit-schwung">${esc(H.h1_schwung)}${schwung('schwung schwung--h1')}</span></h1>
      <p class="held-lead">${esc(H.lead)}</p>
      ${zweiWege()}
      <ul class="held-zusagen">
        <li class="held-zusage">${zeichen('schild', 'patch--klein')}<span><strong>Zufriedenheitsgarantie</strong> Reklamation binnen 24&nbsp;Stunden, Nachreinigung kostenlos</span></li>
        <li class="held-zusage">${zeichen('lupe', 'patch--klein')}<span><strong>Kostenlose Besichtigung</strong> vor jedem Angebot</span></li>
      </ul>
    </div>
    <figure class="held-bild"${pr(S.team_frei.pruefen)}>
      <div class="buehne" data-kippen>
        <div class="buehne-bogen" aria-hidden="true"></div>
        <svg class="buehne-schwung" viewBox="0 0 1000 760" aria-hidden="true" focusable="false"><path class="buehne-schwung-flaeche" d="M70 640C-10 420 170 170 520 128c180-22 330 18 430 96-112-52-256-74-420-52C228 214 70 418 70 640Z"/><path class="buehne-schwung-linie" d="M40 690C-60 430 150 120 520 84c170-16 320 22 440 104"/></svg>
        <div class="buehne-team">${bild(S.team_frei, '(min-width: 64rem) 40rem, 100vw', { lazy: false, prio: true })}</div>
      </div>
      <figcaption>Das Team von Merys Clean in Arbeitskleidung</figcaption>
    </figure>
  </div>
</section>

${zusagen()}

<section class="abschnitt haltung" aria-labelledby="haltung-titel">
  <div class="huelle">
    <h2 id="haltung-titel" class="unsichtbar">Was Sie von uns erwarten können</h2>
    <p class="haltung-text"><span class="haltung-teil">Feste Kräfte, die Ihre Räume <em>kennen</em>.</span> <span class="haltung-teil">Ein Ansprechpartner, der <em>erreichbar</em> ist.</span> <span class="haltung-teil">Und passt etwas nicht, melden Sie sich binnen <em>24&nbsp;Stunden</em>: Wir reinigen kostenlos nach.</span></p>
  </div>
</section>

<section class="abschnitt leistungen-start" aria-labelledby="leistungen-titel">
  <div class="huelle">
    <div class="abschnitt-kopf einblenden">
      ${ueber('Leistungen')}
      <h2 id="leistungen-titel">Reinigung für Gewerbe und Zuhause</h2>
      <p class="abschnitt-text">Regelmäßig oder einmalig, für Firmen, Hausverwaltungen und Privathaushalte. Jede Leistung beginnt mit einer kostenlosen Besichtigung.</p>
    </div>
    <div class="leistungen-raster">
      <ul class="leistung-zeilen">
${LEI.map((l, i) => `        <li class="einblenden${i === 0 ? ' ist-aktiv' : ''}"><a class="leistung-zeile" href="/${l.url}" data-bild="${i}">${zeichen(l.id)}<span class="leistung-name">${esc(l.name)}</span><span class="leistung-kurz">${esc(l.kurz)}</span>${pfeil}</a></li>`).join('\n')}
      </ul>
      <div class="leistungen-bilder" aria-hidden="true">
${LEI.map((l, i) => `        <figure class="leistungen-bild${i === 0 ? ' ist-aktiv' : ''}"${pr(l.bild.pruefen)}>${bild({ ...l.bild, alt: '' }, '(min-width: 64rem) 30rem, 96vw')}<span class="leistungen-bild-name">${esc(l.name)}</span></figure>`).join('\n')}
      </div>
    </div>
    <p class="weiter-link"><a class="textlink" href="/leistungen">Alle Leistungen im Überblick ${pfeil}</a></p>
  </div>
</section>

${ablauf()}

${garantie()}

<section class="abschnitt team-start" aria-labelledby="team-titel">
  <div class="huelle">
    <div class="team-kopf einblenden">
      ${ueber('Wer zu Ihnen kommt')}
      <h2 id="team-titel">Ein Team mit <span class="akzent-wort">Namen</span> und Gesicht</h2>
      <p class="abschnitt-text"><span${pr(S.familie.pruefen)}>${esc(S.familie.text)}</span>: Bei uns haben Sie einen persönlichen Ansprechpartner und feste Reinigungskräfte, die wiederkehrend zu Ihnen kommen.</p>
      <p><a class="textlink" href="/ueber-uns">Mehr über uns ${pfeil}</a></p>
    </div>
    <div class="portraets">
      ${S.team.map((p, i) => portraet(p, i === 0)).join('\n      ')}
    </div>
  </div>
</section>

<section class="abschnitt gebiet-start" aria-labelledby="gebiet-titel">
  <div class="huelle gebiet-in">
    <div class="gebiet-text einblenden">
      ${ueber('Einsatzgebiet')}
      <h2 id="gebiet-titel">Zu Hause in Eislingen, unterwegs in der Region</h2>
      <p class="abschnitt-text"${pr(S.karte.pruefen)}>${esc(S.gebiet_satz)}</p>
      <p><a class="textlink" href="/einsatzgebiet">Alle Orte ansehen ${pfeil}</a></p>
    </div>
    ${karte('karte-start')}
  </div>
</section>

${faq(S.faq_allgemein)}

${anfrageBand()}`;
  seite('index.html', {
    titel: 'Gebäudereinigung Eislingen & Göppingen | Merys Clean',
    beschreibung: 'Merys Clean aus Eislingen/Fils: Unterhalts-, Büro-, Fenster- und Treppenhausreinigung für Göppingen und Umgebung. Kostenlose Besichtigung, unverbindliches Angebot.',
    inhalt, klasse: 'seite-start',
    jsonld: [betrieb(), { '@type': 'WebSite', '@id': `${S.basis}/#website`, name: S.firma, url: `${S.basis}/`, publisher: { '@id': ID } }],
  });
}

// ---------- Kopf einer Unterseite ----------
// Rechte Spalte im Seitenkopf ohne Bild: ein eingenähtes schwarzes Fach (direkt erreichen bzw. wie es weitergeht)
const fachDirekt = () => `<aside class="seitenkopf-fach" aria-label="Direkt erreichen">
      <p class="fach-titel">Direkt erreichen</p>
      <a class="anfrage-tel" href="${TEL_A}">${ICON.tel}<span><span class="anfrage-klein">Mo–Fr&nbsp;8–16&nbsp;Uhr</span>${TEL}</span></a>
      <p class="anfrage-mehr"><a href="${S.whatsapp_link}" rel="noopener"${pr(S.whatsapp_pruefen)}>${ICON.whatsapp}WhatsApp${extern}</a><a href="${MAIL_A}">${ICON.post}${esc(S.email)}</a></p>
      <p class="fach-ort">${ICON.ort}<span>${esc(S.strasse)}, ${esc(S.plz)} ${esc(S.ort)}</span></p>
    </aside>`;
const fachAblauf = () => `<aside class="seitenkopf-fach" aria-label="So geht es weiter">
      <p class="fach-titel">So geht es weiter</p>
      <ul class="fach-schritte">
${S.ablauf.slice(1, 4).map((a, i) => `        <li>${zeichen(ABLAUF_Z[i + 1], 'patch--klein')}<span><strong>${esc(a.titel)}</strong> ${esc(a.text)}</span></li>`).join('\n')}
      </ul>
    </aside>`;

const seitenKopf = ({ ueberText, h1, lead, extra = '', bildHtml = '', bildPruefen = '', fach = '' }) => `<section class="seitenkopf${bildHtml || fach ? ' seitenkopf--bild' : ''}" aria-labelledby="titel">
  <div class="huelle seitenkopf-in">
    <div class="seitenkopf-text">
      ${ueber(ueberText)}
      <h1 id="titel">${h1}</h1>
      <p class="seitenkopf-lead">${lead}</p>
${extra ? `      ${extra}\n` : ''}    </div>
${bildHtml ? `    <figure class="seitenkopf-bild"${pr(bildPruefen)}>${bildHtml}</figure>\n` : ''}${fach ? `    ${fach}\n` : ''}  </div>
</section>`;

// ---------- Leistungen (Übersicht) ----------
{
  const inhalt = `${seitenKopf({ ueberText: 'Leistungen', h1: 'Unsere Leistungen', lead: 'Regelmäßige und einmalige Reinigung für Firmen, Hausverwaltungen und Privathaushalte in Eislingen, Göppingen und Umgebung. Den Umfang legen wir nach einer kostenlosen Besichtigung gemeinsam mit Ihnen fest.', extra: zweiWege(), fach: fachDirekt() })}

<section class="abschnitt" aria-labelledby="alle-titel">
  <div class="huelle">
    <h2 id="alle-titel" class="unsichtbar">Alle Leistungen</h2>
    <ul class="leistung-karten">
${LEI.map((l, i) => `      <li class="leistung-karte">
        <div class="leistung-karte-bild"${pr(l.bild.pruefen)}>${bild(l.bild, '(min-width: 64rem) 24rem, (min-width: 40rem) 45vw, 92vw', { lazy: i > 2 })}${zeichen(l.id)}</div>
        <h3><a href="/${l.url}">${esc(l.name)}</a></h3>
        <p>${esc(l.lead)}</p>
        <p class="leistung-karte-mehr" aria-hidden="true">Mehr erfahren ${pfeil}</p>
      </li>`).join('\n')}
    </ul>
  </div>
</section>

<section class="abschnitt weitere" aria-labelledby="weitere-titel">
  <div class="huelle weitere-in">
    <div>
      ${ueber('Auf Anfrage')}
      <h2 id="weitere-titel">Weitere Leistungen</h2>
      <p class="abschnitt-text">Diese Leistungen gehören ebenfalls zu unserem Angebot. Sprechen Sie uns an, wir klären den Umfang bei der Besichtigung.</p>
    </div>
    <ul class="chips"${pr(S.weitere_pruefen)}>
${S.weitere_leistungen.map((w) => `      <li>${esc(w)}</li>`).join('\n')}
    </ul>
  </div>
</section>

${ablauf()}

${anfrageBand()}`;
  seite('leistungen.html', {
    titel: 'Leistungen: Gebäudereinigung Eislingen & Göppingen | Merys Clean',
    beschreibung: 'Unterhaltsreinigung, Büro- und Gewerbereinigung, Fenster-, Treppenhaus-, Umzugs- und Bauendreinigung sowie Reinigung für Privathaushalte rund um Göppingen.',
    inhalt, aktiv: 'leistungen',
    jsonld: [{ '@type': 'ItemList', name: 'Unsere Leistungen', itemListElement: LEI.map((l, i) => ({ '@type': 'ListItem', position: i + 1, name: l.name, url: `${S.basis}/${l.url}` })) }],
  });
}

// ---------- Je Leistung eine Seite ----------
for (const l of LEI) {
  const andere = LEI.filter((x) => x !== l);
  const inhalt = `${seitenKopf({ ueberText: 'Leistung', h1: esc(l.h1), lead: esc(l.lead), extra: zweiWege(`?leistung=${l.id}`), bildHtml: bild(l.bild, '(min-width: 64rem) 34rem, 94vw', { lazy: false, prio: true }) + zeichen(l.id, 'patch--gross'), bildPruefen: l.bild.pruefen })}

${zusagen(' vertrauen--seite')}

<section class="abschnitt fuer-wen" aria-labelledby="wen-titel">
  <div class="huelle fuer-wen-in">
    <div class="abschnitt-kopf einblenden">
      ${ueber('Für wen')}
      <h2 id="wen-titel">Für wen sich diese Leistung eignet</h2>
    </div>
    <ul class="haken-liste einblenden"${pr(l.wen_pruefen)}>
${l.wen.map((w) => `      <li>${ICON.haken}<span>${esc(w)}</span></li>`).join('\n')}
    </ul>
  </div>
</section>

${ablauf()}

${faq(l.faq, `Fragen zur ${esc(l.name)}`)}

<section class="abschnitt andere" aria-labelledby="andere-titel">
  <div class="huelle">
    <h2 id="andere-titel" class="h3-gross">Weitere Leistungen</h2>
    <ul class="andere-liste">
${andere.map((x) => `      <li><a href="/${x.url}"><span>${esc(x.name)} ${pfeil}</span></a></li>`).join('\n')}
    </ul>
  </div>
</section>

${anfrageBand()}`;
  seite(`${l.url}.html`, {
    titel: l.titel, beschreibung: l.beschreibung, inhalt, aktiv: l.url,
    jsonld: [{ '@type': 'Service', name: l.name, serviceType: l.name, provider: { '@id': ID }, areaServed: [{ '@type': 'City', name: 'Eislingen/Fils' }, { '@type': 'City', name: 'Göppingen' }] }],
  });
}

// ---------- Einsatzgebiet ----------
{
  const inhalt = `${seitenKopf({ ueberText: 'Einsatzgebiet', h1: 'Einsatzgebiet rund um Eislingen und Göppingen', lead: esc(S.gebiet_satz), fach: fachDirekt() })}

<section class="abschnitt abschnitt--eng gebiet-seite" aria-labelledby="orte-titel">
  <div class="huelle gebiet-in">
    ${karte('karte-gebiet')}
    <div class="gebiet-text">
      <h2 id="orte-titel" class="h3-gross">Orte, in denen wir reinigen</h2>
      ${gebietText()}
      <p class="gebiet-hinweis">Ihr Ort ist nicht dabei? Fragen Sie trotzdem: <a href="${TEL_A}">${TEL}</a> oder über das <a href="/angebot">Anfrageformular</a>.</p>
      <p class="gebiet-sitz">${ICON.ort}<span>Firmensitz: ${esc(S.strasse)}, ${esc(S.plz)} ${esc(S.ort)} · <a href="${S.route_link}" rel="noopener">Route planen${extern}</a></span></p>
    </div>
  </div>
</section>

${anfrageBand()}`;
  seite('einsatzgebiet.html', {
    titel: 'Einsatzgebiet: Göppingen, Stuttgart, Ulm & Umgebung | Merys Clean',
    beschreibung: 'Merys Clean reinigt von Eislingen/Fils aus im Filstal, Richtung Stuttgart und Esslingen, im Remstal, auf der Ostalb bis Schwäbisch Hall und in Ulm. Karte und Ortsliste.',
    inhalt, aktiv: 'einsatzgebiet',
  });
}

// ---------- Über uns ----------
{
  const inhalt = `${seitenKopf({ ueberText: 'Über uns', h1: 'Über Merys Clean', lead: esc(S.team_text), bildHtml: bild(S.team_gruppe, '(min-width: 64rem) 34rem, 94vw', { lazy: false, prio: true }), bildPruefen: S.team_gruppe.pruefen })}

<section class="abschnitt ueber-text" aria-labelledby="mehr-titel">
  <div class="huelle ueber-text-in einblenden">
    ${ueber('Mehr als nur ein Reinigungsunternehmen')}
    <h2 id="mehr-titel">Ein Ansprechpartner, <span class="akzent-wort">feste</span> Kräfte, klare Absprachen</h2>
    <p class="gross-text"><span${pr(S.erfahrung.pruefen)}>${esc(S.erfahrung.text)}</span>: Darauf baut unser Reinigungsservice auf. Sie bekommen flexible Lösungen für Ihr Unternehmen oder Ihren Privathaushalt und einen persönlichen Ansprechpartner, der Sie über die gesamte Zeit betreut.</p>
  </div>
</section>

<section class="abschnitt team-seite" aria-labelledby="team-titel">
  <div class="huelle">
    <div class="team-kopf einblenden">
      ${ueber('Team')}
      <h2 id="team-titel">Die Menschen hinter Merys Clean</h2>
      <p class="abschnitt-text"><span${pr(S.familie.pruefen)}>${esc(S.familie.text)}</span>. Die Geschäftsleitung kennt jedes Objekt, das wir betreuen.</p>
    </div>
    <div class="portraets">
      ${S.team.map((p, i) => portraet(p, i === 0)).join('\n      ')}
    </div>
  </div>
</section>

<section class="abschnitt gruende" aria-labelledby="gruende-titel">
  <div class="huelle">
    <div class="abschnitt-kopf einblenden">
      ${ueber('Warum Merys Clean')}
      <h2 id="gruende-titel">Warum Kunden uns beauftragen</h2>
    </div>
    <ul class="gruende-liste">
${S.gruende.map((g, i) => `      <li class="einblenden"${pr(g.pruefen)}>${zeichen(GRUND_Z[i])}<h3>${esc(g.titel)}</h3><p>${esc(g.text)}</p></li>`).join('\n')}
    </ul>
  </div>
</section>

${garantie()}

${anfrageBand()}`;
  seite('ueber-uns.html', {
    titel: 'Über uns: Team und Werte | Merys Clean Eislingen',
    beschreibung: 'Merys Clean aus Eislingen/Fils: Safet und Merita Mustafa mit Team. Persönlicher Ansprechpartner, feste Reinigungskräfte und Zufriedenheitsgarantie mit kostenloser Nachreinigung.',
    inhalt, aktiv: 'ueber-uns',
  });
}

// ---------- Angebot anfragen (Formular) ----------
const F = S.formular;
const option = (w, gewaehlt = false) => `<option${gewaehlt ? ' selected' : ''}>${esc(w)}</option>`;
export const LEISTUNG_OPTIONEN = [...LEI.map((l) => l.name), 'Weitere Leistung oder noch unklar'];
{
  const feld = (id, label, eingabe, { pflicht = false, hilfe = '' } = {}) => `<div class="feld">
          <label for="${id}">${label}${pflicht ? ' <span class="pflicht" aria-hidden="true">*</span>' : ' <span class="optional">(freiwillig)</span>'}</label>
          ${hilfe ? `<p class="feld-hilfe" id="${id}-hilfe">${hilfe}</p>\n          ` : ''}${eingabe}
        </div>`;
  const auswahl = (id, name, liste, { pflicht = false, leer = 'Bitte wählen', vorwahl = '' } = {}) => `<select id="${id}" name="${name}"${pflicht ? ' required' : ''}>${leer ? `<option value="">${leer}</option>` : ''}${liste.map((w) => option(w, w === vorwahl)).join('')}</select>`;
  const formular = `<form class="formular" id="formular" action="/api/kontakt" method="post" data-pruefen="${esc(F.empfaenger_pruefen)}">
      <p class="formular-hinweis">Pflichtfelder sind mit <span class="pflicht">*</span> markiert.</p>
      <fieldset>
        <legend>Ihr Objekt</legend>
        ${feld('leistung', 'Welche Leistung?', `<select id="leistung" name="leistung" required><option value="">Bitte wählen</option>${LEI.map((l) => `<option data-id="${l.id}">${esc(l.name)}</option>`).join('')}${option(LEISTUNG_OPTIONEN.at(-1))}</select>`, { pflicht: true })}
        ${feld('objektart', 'Art des Objekts', auswahl('objektart', 'objektart', F.objektarten, { pflicht: true }), { pflicht: true })}
        <div class="feld-reihe">
        ${feld('flaeche', 'Fläche in m²', '<input id="flaeche" name="flaeche" type="text" inputmode="numeric" pattern="[0-9]{1,6}" maxlength="6" autocomplete="off" aria-describedby="flaeche-hilfe">', { hilfe: 'ungefähr genügt' })}
        ${feld('ort', 'PLZ und Ort', '<input id="ort" name="ort" type="text" required maxlength="80" autocomplete="address-level2">', { pflicht: true })}
        </div>
        ${feld('rhythmus', 'Wie oft soll gereinigt werden?', auswahl('rhythmus', 'rhythmus', F.rhythmen, { leer: '', vorwahl: 'Noch offen' }))}
      </fieldset>
      <fieldset>
        <legend>So erreichen wir Sie</legend>
        ${feld('name', 'Ihr Name', '<input id="name" name="name" type="text" required maxlength="100" autocomplete="name">', { pflicht: true })}
        <div class="feld-reihe">
        ${feld('telefon', 'Telefon für den Rückruf', '<input id="telefon" name="telefon" type="tel" required maxlength="40" pattern="\\+?[0-9 \\(\\)\\/\\-]{5,40}" autocomplete="tel">', { pflicht: true })}
        ${feld('email', 'E-Mail', '<input id="email" name="email" type="email" maxlength="254" autocomplete="email">')}
        </div>
        ${feld('rueckruf', 'Wann passt ein Rückruf?', auswahl('rueckruf', 'rueckruf', F.rueckruf, { leer: '' }))}
        ${feld('nachricht', 'Was sollen wir noch wissen?', '<textarea id="nachricht" name="nachricht" rows="4" maxlength="5000" aria-describedby="nachricht-hilfe"></textarea>', { hilfe: 'z. B. Wunschtermin, Besonderheiten, Zugang' })}
      </fieldset>
      <div class="honigtopf" aria-hidden="true"><label for="firma_url">Dieses Feld bitte leer lassen</label><input id="firma_url" name="firma_url" type="text" tabindex="-1" autocomplete="off"></div>
      <div class="feld feld-check" data-pruefen="Einwilligungstext mit der Datenschutzerklärung abstimmen (Generator/Anwalt)">
        <input id="datenschutz" name="datenschutz" type="checkbox" value="ja" required>
        <label for="datenschutz">Ich bin einverstanden, dass Merys Clean meine Angaben zur Bearbeitung dieser Anfrage verwendet. Details stehen in der <a href="/datenschutz">Datenschutzerklärung</a>. <span class="pflicht" aria-hidden="true">*</span></label>
      </div>
      <div class="formular-senden">
        <button class="knopf gross" type="submit">Anfrage senden</button>
        <p class="formular-antwort"${pr(F.antwort_pruefen)}>Wir melden uns zu unseren Bürozeiten (Mo–Fr 8–16 Uhr).</p>
      </div>
    </form>`;
  const inhalt = `${seitenKopf({ ueberText: 'Angebot anfragen', h1: 'Kostenloses Angebot anfragen', lead: 'Ein paar Angaben genügen. Wir rufen Sie zurück, vereinbaren einen Termin für die kostenlose Besichtigung und schicken Ihnen danach ein unverbindliches Angebot.', fach: fachAblauf() })}

<section class="abschnitt abschnitt--eng formular-abschnitt" aria-labelledby="formular-titel">
  <div class="huelle formular-raster">
    <div class="formular-spalte">
      <h2 id="formular-titel" class="h3-gross">Ihre Anfrage</h2>
      ${formular}
    </div>
    <aside class="formular-seite" aria-labelledby="direkt-titel">
      <div class="direkt">
        <h2 id="direkt-titel" class="h3-gross">Lieber direkt?</h2>
        <ul class="direkt-liste">
          <li><a href="${TEL_A}">${ICON.tel}<span><span class="direkt-klein">Anrufen,&nbsp;Mo–Fr&nbsp;8–16&nbsp;Uhr</span>${TEL}</span></a></li>
          <li><a href="${S.whatsapp_link}" rel="noopener"${pr(S.whatsapp_pruefen)}>${ICON.whatsapp}<span><span class="direkt-klein">Nachricht schreiben</span>WhatsApp${extern}</span></a></li>
          <li><a href="${MAIL_A}">${ICON.post}<span><span class="direkt-klein">E-Mail</span>${esc(S.email)}</span></a></li>
        </ul>
      </div>
    </aside>
  </div>
</section>`;
  seite('angebot.html', {
    titel: 'Kostenloses Angebot anfragen | Merys Clean Gebäudereinigung',
    beschreibung: 'Angebot für Unterhalts-, Büro-, Fenster- oder Treppenhausreinigung anfragen: Objekt, Fläche und Ort angeben, Rückruf erhalten, kostenlose Besichtigung vereinbaren.',
    inhalt, aktiv: 'angebot',
  });
}

// ---------- Kontakt ----------
{
  const inhalt = `${seitenKopf({ ueberText: 'Kontakt', h1: 'Kontakt', lead: 'Rufen Sie uns an, schreiben Sie uns oder schicken Sie direkt eine Anfrage. Wir sind Montag bis Freitag von 8 bis 16 Uhr für Sie da.', extra: zweiWege(), bildHtml: bild(S.team_gruppe, '(min-width: 64rem) 34rem, 94vw', { lazy: false, prio: true }), bildPruefen: S.team_gruppe.pruefen })}

<section class="abschnitt abschnitt--eng kontakt" aria-labelledby="daten-titel">
  <div class="huelle kontakt-raster">
    <div class="kontakt-karte">
      <h2 id="daten-titel" class="h3-gross">${esc(S.firma)}</h2>
      <address>${esc(S.firma_lang)}<br>${esc(S.strasse)}<br>${esc(S.plz)} ${esc(S.ort)}</address>
      <p><a class="textlink" href="${S.route_link}" rel="noopener">${ICON.route}Route planen${extern}</a></p>
    </div>
    <div class="kontakt-karte">
      <h2 class="h3-gross">Telefon und E-Mail</h2>
      <ul class="kontakt-liste">
        <li${pr(S.telefon_pruefen)}><span class="kontakt-klein">Mobil</span><a href="${TEL_A}">${TEL}</a></li>
        <li><span class="kontakt-klein">Festnetz</span><a href="${FEST_A}">${FEST}</a></li>
        <li><span class="kontakt-klein">E-Mail</span><a href="${MAIL_A}">${esc(S.email)}</a></li>
        <li${pr(S.whatsapp_pruefen)}><span class="kontakt-klein">WhatsApp</span><a href="${S.whatsapp_link}" rel="noopener">Nachricht schreiben${extern}</a></li>
      </ul>
    </div>
    <div class="kontakt-karte">
      <h2 class="h3-gross">Bürozeiten</h2>
      <dl class="zeiten">
        <div><dt>Montag bis Freitag</dt><dd>08:00–16:00 Uhr</dd></div>
        <div><dt>Samstag, Sonntag</dt><dd>geschlossen</dd></div>
      </dl>
      <p class="kontakt-klein">Anfragen über das Formular können Sie jederzeit senden.</p>
    </div>
    <div class="kontakt-karte">
      <h2 class="h3-gross">Social Media</h2>
      <ul class="kontakt-liste">
        <li><a href="${S.facebook}" rel="noopener">Facebook${extern}</a></li>
        <li><a href="${S.instagram}" rel="noopener">Instagram: @merys_clean${extern}</a></li>
      </ul>
    </div>
  </div>
</section>

${anfrageBand()}`;
  seite('kontakt.html', {
    titel: 'Kontakt: Merys Clean in Eislingen/Fils',
    beschreibung: 'Merys Clean, In den Krummäckern 40, 73054 Eislingen/Fils. Telefon 0173 185 35 63, E-Mail info@merysclean.de, erreichbar Montag bis Freitag 8 bis 16 Uhr.',
    inhalt, aktiv: 'kontakt',
  });
}

// ---------- Rechtliches (Gerüst, keine selbst geschriebenen Rechtstexte) ----------
const RECHT = 'Rechtstext nicht erfinden: aus Generator (z. B. eRecht24) oder vom Anwalt einsetzen lassen';
seite('impressum.html', {
  titel: 'Impressum | Merys Clean', beschreibung: 'Impressum der Merys Clean UG (haftungsbeschränkt), Eislingen/Fils.', robots: 'noindex', inhalt: `${seitenKopf({ ueberText: 'Rechtliches', h1: 'Impressum', lead: 'Angaben übernommen aus dem Impressum auf merysclean.de (Stand 01.10.2026).' })}

<section class="abschnitt abschnitt--eng">
  <div class="huelle text-spalte">
    <h2 class="h3-gross">Anbieter</h2>
    <p>${esc(S.firma_lang)}<br>${esc(S.strasse)}<br>${esc(S.plz)} ${esc(S.ort)}</p>
    <h2 class="h3-gross">Vertreten durch</h2>
    <p>Geschäftsführer: ${esc(S.gf)}</p>
    <h2 class="h3-gross">Kontakt</h2>
    <p><span${pr(S.telefon_pruefen)}>Telefon: <a href="${TEL_A}">${TEL}</a></span><br>E-Mail: <a href="${MAIL_A}">${esc(S.email)}</a></p>
    <h2 class="h3-gross">Register und Steuer</h2>
    <p><span data-pruefen="Registergericht fehlt auf der alten Seite: ergänzen">Handelsregister: ${esc(S.hrb)}</span><br>Steuernummer: ${esc(S.steuernr)}</p>
    <p class="platzhalter" data-pruefen="${RECHT}: Registergericht, ggf. USt-IdNr., Angaben nach § 5 DDG und zur Verbraucherstreitbeilegung (der alte Text nennt noch § 5 TMG und die eingestellte OS-Plattform)">Weitere Pflichtangaben folgen aus dem Impressum-Generator.</p>
  </div>
</section>` });

seite('datenschutz.html', {
  titel: 'Datenschutz | Merys Clean', beschreibung: 'Datenschutzerklärung der Website von Merys Clean, Eislingen/Fils.', robots: 'noindex', inhalt: `${seitenKopf({ ueberText: 'Rechtliches', h1: 'Datenschutz', lead: 'Die Datenschutzerklärung wird vor dem Start aus einem Generator erstellt. Hier stehen die Punkte, die sie für diese Website abdecken muss.' })}

<section class="abschnitt abschnitt--eng">
  <div class="huelle text-spalte">
    <p class="platzhalter" data-pruefen="${RECHT}">Vollständige Datenschutzerklärung aus dem Generator einsetzen.</p>
    <h2 class="h3-gross">Verantwortliche Stelle</h2>
    <p>${esc(S.firma_lang)}, ${esc(S.strasse)}, ${esc(S.plz)} ${esc(S.ort)}, E-Mail: <a href="${MAIL_A}">${esc(S.email)}</a></p>
    <h2 class="h3-gross">Was die Erklärung abdecken muss</h2>
    <ul class="text-liste" data-pruefen="Checkliste für den Generator, kein Rechtstext">
      <li>Hosting über Cloudflare Pages (Server-Logdaten)</li>
      <li>Anfrageformular: Versand der Angaben per E-Mail über Resend, Speicherdauer, Rechtsgrundlage</li>
      <li>Anfragen per Telefon, E-Mail und WhatsApp</li>
      <li>Links zu Facebook und Instagram (keine eingebundenen Inhalte, kein Tracking)</li>
      <li>Keine Cookies, keine Analyse-Werkzeuge, Schriften vom eigenen Server</li>
      <li>Rechte der Betroffenen und zuständige Aufsichtsbehörde</li>
    </ul>
  </div>
</section>` });

seite('404.html', {
  titel: 'Seite nicht gefunden | Merys Clean', beschreibung: 'Diese Seite gibt es nicht (mehr). Hier geht es weiter zu den Leistungen, zur Anfrage und zum Kontakt.', robots: 'noindex', inhalt: `${seitenKopf({ ueberText: 'Fehler 404', h1: 'Diese Seite gibt es nicht', lead: 'Vielleicht hat sich die Adresse geändert. Hier finden Sie, was Sie suchen:', extra: zweiWege() })}` });

seite('nachricht-gesendet.html', {
  titel: 'Anfrage gesendet | Merys Clean', beschreibung: 'Danke für Ihre Anfrage bei Merys Clean. Wir melden uns zu unseren Bürozeiten.', robots: 'noindex', inhalt: `${seitenKopf({ ueberText: 'Danke', h1: 'Ihre Anfrage ist angekommen', lead: 'Vielen Dank. Wir melden uns zu unseren Bürozeiten (Mo–Fr 8–16 Uhr) und vereinbaren mit Ihnen einen Termin für die kostenlose Besichtigung.', extra: `<p class="seitenkopf-lead">Eilt es? Rufen Sie an: <a href="${TEL_A}">${TEL}</a></p>` })}` });

// ---------- Sitemap, robots.txt, Weiterleitungen ----------
writeFileSync(new URL('sitemap.xml', OUT), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SEITEN.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`);
writeFileSync(new URL('robots.txt', OUT), `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${S.basis}/sitemap.xml
`);
// Alte Adressen von merysclean.de (WordPress) → neue Seiten. Ziele ohne .html (Pages leitet /x.html selbst auf /x um).
const UMLEITUNGEN = [
  ['/home/', '/'], ['/index.php', '/'],
  ['/reinigung/', '/leistungen'], ['/reinigung', '/leistungen'],
  ['/service/', '/leistungen'], ['/service', '/leistungen'],
  ['/contacts/', '/angebot'], ['/contacts', '/angebot'],
  ['/ueber-uns/', '/ueber-uns'], ['/kontakt/', '/kontakt'], ['/impressum/', '/impressum'],
  ['/datenschutzerklaerung/', '/datenschutz'], ['/datenschutzerklaerung', '/datenschutz'], ['/datenschutz/', '/datenschutz'],
  ['/sitemap_index.xml', '/sitemap.xml'], ['/page-sitemap.xml', '/sitemap.xml'],
];
writeFileSync(new URL('_redirects', OUT), `# Alte Adressen von merysclean.de (WordPress, Stand 01.10.2026) → neue Seiten, dauerhaft (301). Erzeugt von bauen.mjs.
# /service/ und /contacts/ waren auf der alten Seite tote Links (404), wurden aber von Startseite und Über uns verlinkt.
${UMLEITUNGEN.map(([a, b]) => `${a.padEnd(26)} ${b.padEnd(14)} 301`).join('\n')}
`);
console.log(`✓ ${SEITEN.length} indexierte Seiten + Rechtliches/404/Danke, CSS ${CSS_DATEI}`);
