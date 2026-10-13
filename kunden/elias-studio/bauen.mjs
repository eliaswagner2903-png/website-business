// Baut alle Seiten der Portfolio-Seite:   node bauen.mjs      
// Inhalte stehen NUR in inhalt/seite.json. HTML in public/ nicht von Hand ändern.
// Alles Persönliche (Studioname, Nachname, Ort, Telefon, E-Mail, Foto, Preise, Rechtstexte) ist Platzhalter mit data-pruefen.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const S = JSON.parse(readFileSync(new URL('./inhalt/seite.json', import.meta.url), 'utf8'));
const OUT = new URL('./public/', import.meta.url);
const SCHEMA = process.env.SCHEMA ? ` data-schema="${process.env.SCHEMA}"` : '';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const P = S.pruefen;
const pr = (grund) => (grund ? ` data-pruefen="${esc(grund)}"` : '');
const TEL = esc(S.telefon_anzeige).replace(/ /g, '&nbsp;');
const TEL_A = `tel:${S.telefon_link}`;
// Ohne Telefonnummer (Elias, 04.10.) entfallen alle Telefonzeilen
const TELZ = (html, leer = '') => (S.telefon_link ? html : leer);
const STUDIO = `<span class="platzhalter-wort"${pr(P.studio)}>${esc(S.studio)}</span>`;
const pfeil = '<span class="pfeil" aria-hidden="true">→</span>';
const raus = '<span class="pfeil" aria-hidden="true">↗</span>';
// Inline-Skripte (CSP-Hashes in public/_headers, Test prüft sie): (1) Klasse js setzen, auf jeder Seite. Die Seite ist durchgehend dunkel, kein Schema-Schalter.
// (2) nur Startseite: Klasse intro-offen setzen, wenn die Vorstellung beim ersten Besuch laufen soll (noch nicht gesehen, kein Anker in der Adresse,
// nicht bei „Bewegung reduzieren“ oder „Daten sparen“; ?intro=1 erzwingt sie). So steht sie vor dem ersten Bild und die Seite blitzt nicht auf.
// Der Speicher-Schlüssel steht auch in js/vorstellung.js.
const KOPF_SKRIPT = "document.documentElement.classList.add('js')";
const INTRO_SKRIPT = "try{var d=document.documentElement,w=location.search.indexOf('intro=1')>-1;if(w||(!localStorage.getItem('seitenkapitaen-vorstellung')&&!location.hash&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!(navigator.connection&&navigator.connection.saveData)))d.classList.add('intro-offen')}catch(e){}";

// ---------- Seitenkapitän: Kompass (Marke), Kompassrose (Hero, Vorstellung) ----------
// Alles Dekor (aria-hidden), reine Linien in currentColor/Messing. Nichts Verspieltes: keine Anker, keine Piraten, ein Kompass und eine Route.
const KOMPASS_MARKE = '<svg class="marke-kompass" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><circle class="mk-ring" cx="16" cy="16" r="13.6"/><path class="mk-stern" d="M16 2.6 18.5 13.5 29.4 16 18.5 18.5 16 29.4 13.5 18.5 2.6 16 13.5 13.5Z"/><path class="mk-nord" d="M16 2.6 18.5 13.5 16 16 13.5 13.5Z"/></svg>';
function kompassRose(klasse = '', { route = false } = {}) {
  const r = (x) => Math.round(x * 100) / 100;
  let ticks = '';
  for (let i = 0; i < 72; i++) {
    const w = (i * 5 * Math.PI) / 180, lang = i % 18 === 0 ? 26 : i % 9 === 0 ? 16 : i % 3 === 0 ? 9 : 5;
    ticks += `M${r(300 + Math.sin(w) * (232 - lang))} ${r(300 - Math.cos(w) * (232 - lang))}L${r(300 + Math.sin(w) * 232)} ${r(300 - Math.cos(w) * 232)}`;
  }
  const spitze = (w, l, b) => { const a = (w * Math.PI) / 180, q = a + Math.PI / 2; return `M${r(300 + Math.sin(a) * l)} ${r(300 - Math.cos(a) * l)}L${r(300 + Math.sin(q) * b)} ${r(300 - Math.cos(q) * b)}L300 300L${r(300 - Math.sin(q) * b)} ${r(300 + Math.cos(q) * b)}Z`; };
  const haupt = [0, 90, 180, 270].map((w) => spitze(w, w % 180 ? 150 : 205, 17)).join('');
  const neben = [45, 135, 225, 315].map((w) => spitze(w, 108, 11)).join('');
  return `<svg class="kompass${klasse ? ` ${klasse}` : ''}" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
    <g class="k-aussen"><circle class="k-ring" cx="300" cy="300" r="244"/><circle class="k-ring k-ring--fein" cx="300" cy="300" r="232"/><path class="k-ticks" d="${ticks}"/></g>
    <g class="k-innen"><circle class="k-ring k-ring--fein" cx="300" cy="300" r="118"/><path class="k-neben" d="${neben}"/><path class="k-haupt" d="${haupt}"/><path class="k-nord" d="${spitze(0, 205, 17)}"/><circle class="k-nabe" cx="300" cy="300" r="5"/></g>${route ? `
    <g class="route"><path class="route-linie" pathLength="1" d="M490 -150C440 -40 480 50 440 130S330 240 300 300"/><g class="route-punkte"><circle cx="458" cy="58" r="5"/><circle cx="392" cy="184" r="5"/></g></g>` : ''}
  </svg>`;
}

const ICON = {
  tel: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.6 3.5h2.6l1.4 4.2-2 1.5a12 12 0 0 0 6.2 6.2l1.5-2 4.2 1.4v2.6a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"/></svg>',
  haus: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 11 12 4l8 7v8.5h-5.5V14h-5v5.5H4z"/></svg>',
  arbeiten: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 5h7v7H4zM13 5h7v4h-7zM13 11h7v8h-7zM4 14h7v5H4z"/></svg>',
  schild: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3.5 5 6v5.5c0 4.2 2.8 7.2 7 9 4.2-1.8 7-4.8 7-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/></svg>',
  post: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.5 6.5h17v11h-17z"/><path d="m3.5 7 8.5 6.5L20.5 7"/></svg>',
};

// ---------- Lange Aufnahmen der Arbeiten (node aufnahmen.mjs: AVIF + WebP) ----------
// Desktop 1440 px breit, oberste 3600 px → 800/1440; Handy 390 px (DPR 2), oberste 3400 px → 320/600.
// Im Gerät läuft die Aufnahme langsam durch (CSS), bei „Bewegung reduzieren“ steht der Anfang.
const LANG = { desktop: { b: [800, 1440], h: (b) => Math.round(b * 3600 / 1440) }, handy: { b: [320, 600], h: (b) => Math.round(b * 6800 / 780) } };
function aufnahme(a, art, sizes, { lazy = true, prio = false } = {}) {
  const m = LANG[art];
  const set = (typ) => m.b.map((b) => `/medien/arbeit-${a.id}-${art}-lang-${b}.${typ} ${b}w`).join(', ');
  const b0 = m.b[0];
  const text = esc(art === 'desktop' ? a.alt_desktop : a.alt_handy);
  const laden = lazy ? ' loading="lazy" decoding="async"' : prio ? ' decoding="async" fetchpriority="high"' : ' decoding="async"';
  return `<picture><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><img src="/medien/arbeit-${a.id}-${art}-lang-${b0}.webp" srcset="${set('webp')}" sizes="${sizes}" width="${b0}" height="${m.h(b0)}" alt="${text}"${laden}></picture>`;
}

// ---------- Vorstellung (Unternehmensvideo): Überblendung beim ersten Besuch, danach per Knopf ----------
// Untertitel sind im Film eingebrannt; die VTT-Spur ist nur zuschaltbar (nicht default), sonst stehen sie doppelt da (Elias 13.10.).
// Modus „film“: sobald public/medien/vorstellung/film.mp4 oder film.webm liegt (dazu poster.webp, optional untertitel.vtt) – einfach Dateien tauschen
// und node bauen.mjs ausführen. Modus „platzhalter“: animierte Titelsequenz aus Linien (Kompass, Route, Name), bis das echte Video da ist.
const V = S.vorstellung;
const VD = new URL('./public/medien/vorstellung/', import.meta.url);
const hatDatei = (n) => existsSync(new URL(n, VD));
const FILM = hatDatei('film.mp4') || hatDatei('film.webm');
const VP = '/medien/vorstellung';
// Platzhalter: dieselbe Kajüte wie im Hero (gleiche Dateien, schon im Speicher). Beim Schließen liegt darunter genau dieses Bild – kein Bruch.
const introBild = () => `<picture class="intro-bild" aria-hidden="true"><source media="(min-width: 48rem)" type="image/avif" srcset="/medien/kapitaen-kajuete-quer-1280.avif 1280w, /medien/kapitaen-kajuete-quer-1920.avif 1920w, /medien/kapitaen-kajuete-quer-2560.avif 2560w" sizes="100vw"><source media="(min-width: 48rem)" type="image/webp" srcset="/medien/kapitaen-kajuete-quer-1280.webp 1280w, /medien/kapitaen-kajuete-quer-1920.webp 1920w, /medien/kapitaen-kajuete-quer-2560.webp 2560w" sizes="100vw"><source type="image/avif" srcset="/medien/kapitaen-kajuete-hoch-720.avif 720w, /medien/kapitaen-kajuete-hoch-1080.avif 1080w" sizes="100vw"><img src="/medien/kapitaen-kajuete-hoch-720.webp" srcset="/medien/kapitaen-kajuete-hoch-720.webp 720w, /medien/kapitaen-kajuete-hoch-1080.webp 1080w" sizes="100vw" width="720" height="1273" alt="" decoding="async"></picture>`;
const vorstellung = `<div class="intro" id="vorstellung" role="dialog" aria-modal="true" aria-label="Vorstellung von ${esc(S.studio)}" data-modus="${FILM ? 'film' : 'platzhalter'}" data-dauer="${V.platzhalter_dauer}">
  <div class="intro-grund">
${FILM
    ? `    <video class="intro-film" playsinline muted preload="none"${hatDatei('film-hoch.mp4') ? ` data-hoch="${VP}/film-hoch.mp4"${hatDatei('poster-hoch.webp') ? ` data-poster-hoch="${VP}/poster-hoch.webp"` : ''}` : ''}${hatDatei('poster.webp') ? ` poster="${VP}/poster.webp"` : ''}>
${hatDatei('film.webm') ? `      <source src="${VP}/film.webm" type="video/webm">\n` : ''}${hatDatei('film.mp4') ? `      <source src="${VP}/film.mp4" type="video/mp4">\n` : ''}${hatDatei('untertitel.vtt') ? `      <track kind="captions" src="${VP}/untertitel.vtt" srclang="de" label="Deutsch">\n` : ''}    </video>`
    : `    ${introBild()}
    <div class="intro-buehne" aria-hidden="true">
      <svg class="intro-netz" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" focusable="false"><path class="netz-linie" pathLength="1" d="M0 150H1000M0 300H1000M0 450H1000M250 0V600M500 0V600M750 0V600"/><path class="netz-bogen" pathLength="1" d="M-20 520C220 400 420 470 620 330S900 120 1020 140"/></svg>
      ${kompassRose('intro-rose')}
    </div>`}
  </div>
${FILM ? '' : `  <div class="intro-mitte">
    <p class="intro-marke" aria-hidden="true">${KOMPASS_MARKE}<span>${esc(S.studio)}</span></p>
    <p class="intro-zeile">${esc(S.hero.unterzeile)}</p>
  </div>
`}  <div class="intro-leiste">
${FILM ? '' : '    <p class="intro-hinweis">Platzhalter: Hier läuft später das Vorstellungsvideo.</p>\n'}    <button class="intro-ton" type="button" aria-pressed="false" hidden>Ton an</button>
    <button class="intro-weiter" type="button">Überspringen <span aria-hidden="true">→</span></button>
  </div>
  <span class="intro-fortschritt" aria-hidden="true"></span>
</div>`;

// ---------- Navigation ----------
// Einträge stehen in inhalt/seite.json (nav: Anker, Name, Zusatzzeile). Die Zusatzzeile erscheint nur im Handy-Blatt.
const NAV = S.nav;

function seite(datei, { titel, beschreibung, inhalt, robots = '', start = false }) {
  const kanon = `${S.basis}/${datei === 'index.html' ? '' : datei}`;
  const h = (anker) => (start ? anker : `/${anker}`);
  const nav = NAV.map(([a, t, z]) => `        <li><a href="${h(a)}"><span class="nav-name">${esc(t)}</span><span class="nav-zusatz">${esc(z)}</span></a></li>`).join('\n');
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
<meta property="og:title" content="${esc(titel)}">
<meta property="og:description" content="${esc(beschreibung)}">
<meta property="og:url" content="${kanon}">
<meta property="og:image" content="${S.basis}/medien/og-startseite.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Kajüte eines Segelschiffs bei Nacht: Öllampe, Messingkompass und Seekarte auf dem Kartentisch, dahinter das Meer im Mondlicht">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0f1011">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/cormorant-garamond.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/jost.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/marke.css">
<link rel="stylesheet" href="/css/stil.css">
<link rel="stylesheet" href="/css/bausteine.css">
<link rel="stylesheet" href="/css/kapitaen.css">
<script>${KOPF_SKRIPT}</script>
${start ? `<script>${INTRO_SKRIPT}</script>\n` : ''}
<script src="/js/bausteine.js" defer></script>
<script src="/js/seite.js" defer></script>
${start ? '<script src="/js/vorstellung.js" defer></script>' : ''}
</head>
<body${start ? ' class="seite-start"' : ''}>
<a class="sprung" href="#inhalt">Zum Inhalt springen</a>
${start ? vorstellung + '\n' : ''}<header class="kopf">
  <div class="huelle kopf-in">
    <a class="marke" href="/">${KOMPASS_MARKE}<span class="marke-name"${pr(P.studio)}>${esc(S.studio)}</span><span class="unsichtbar"> – zur Startseite</span></a>
    <button class="menue-knopf" type="button" aria-expanded="false" aria-controls="nav">Menü</button>
    <nav class="nav blatt" id="nav" aria-label="Hauptnavigation">
      <ul>
${nav}
        <li><a class="knopf" href="${h('#kontakt')}">Projekt besprechen ${pfeil}</a></li>
      </ul>
      <div class="blatt-fuss">
        <p class="blatt-fuss-titel">Direkt erreichbar</p>
        <a href="mailto:${S.email}"${pr(P.email)}>${S.email}</a>
        ${TELZ(`<a href="${TEL_A}"${pr(P.telefon)}>${TEL}</a>`, "")}
      </div>
    </nav>
  </div>
</header>

<main id="inhalt">
${inhalt}
</main>
${start ? `<div class="handy-leiste nur-handy"><a class="knopf" href="#kontakt">Projekt besprechen ${pfeil}</a><a class="knopf zweit" href="mailto:${S.email}"${pr(P.email)}>E-Mail</a></div>\n` : ''}
<footer class="fuss">
  <div class="huelle">
    <div class="fuss-band">
      <p class="fuss-frage">Ihr Kurs beginnt mit <em>einem Gespräch</em>.</p>
      <a class="knopf" href="${h('#kontakt')}">Projekt besprechen ${pfeil}</a>
    </div>
    <div class="fuss-raster">
      <div class="fuss-marke">
        <p class="fuss-name">${KOMPASS_MARKE}<span${pr(P.studio)}>${esc(S.studio)}</span></p>
        <p>Websites mit Betreuung für Praxen, Werkstätten, Restaurants und Studios.</p>
      </div>
      <div>
        <h2 class="fuss-titel">Kontakt</h2>
        <ul class="fuss-liste">
          <li><a href="mailto:${S.email}"${pr(P.email)}>${S.email}</a></li>
          ${TELZ(`<li><a href="${TEL_A}"${pr(P.telefon)}>${TEL}</a></li>`)}
          <li><span${pr(P.ort)}>Heimathafen ${esc(S.ort)}</span></li>
        </ul>
      </div>
      <div>
        <h2 class="fuss-titel">Seite</h2>
        <ul class="fuss-liste">
          <li><a href="${h('#leistungen')}">Leistungen</a></li>
          <li><a href="${h('#arbeiten')}">Arbeiten</a></li>
          <li><a href="${h('#betreuung')}">Website und Betreuung</a></li>
          <li><a href="${h('#kontakt')}">Kontakt</a></li>
          <li><a href="/?intro=1" data-vorstellung-oeffnen>${esc(V.knopf)}</a></li>
        </ul>
      </div>
    </div>
    <div class="fuss-unten">
      <p>© ${new Date().getFullYear()} <span${pr(P.studio)}>${esc(S.studio)}</span></p>
      <ul class="fuss-rechts">
        <li><a href="/impressum.html">Impressum</a></li>
        <li><a href="/datenschutz.html">Datenschutz</a></li>
        <li><a href="#inhalt">Nach oben <span aria-hidden="true">↑</span></a></li>
      </ul>
    </div>
  </div>
</footer>

</body>
</html>
`;
  writeFileSync(new URL(datei, OUT), html.replace(/^[ \t]+\n/gm, "")); // leere Zeilen ohne Telefon entfernen
}

// =====================================================================
// Startseite – Stil 1 „Nachtschiff“ (Umbau 11.10.2026 nach Drehbuch /mnt/project-files/seitenkapitaen/drehbuch-seitenumbau.md)
// Eine ruhige Überfahrt: Kajüte (Hero) → An Bord (Leistungen) → Der Kurs (Ablauf) → Logbuch (Arbeiten) → Kompass (Zwischenbild)
// → Die Fahrt (Preise) → Vor der Abfahrt (Fragen) → Im Hafen (Kontakt). Das Seefahrt-Thema gibt nur Stimmung; jede Überschrift sagt
// in einfachen Worten, worum es geht. Bilder: Higgsfield (node bilder.mjs), Instrumente und Seekarte: SVG/CSS.
// =====================================================================
const A = S.arbeiten; // gezeigt, in dieser Reihenfolge; S.arbeiten_ruhend wird nicht gebaut
const ANZAHL = ['Null', 'Eine', 'Zwei', 'Drei', 'Vier', 'Fünf', 'Sechs', 'Sieben'][A.length] || String(A.length);
const ueber = (text, k = '') => `<p class="ueberzeile${k ? ` ${k}` : ''}">${text}</p>`;
const W = pr(P.wortlaut); // neue Überschriften (Umbau 11.10.) sind Vorschläge

// ---------- Bilder: AVIF mit WebP-Rückfall, Breiten wie in bilder.mjs ----------
const BILD = {
  'kajuete-quer': [[1280, 1920, 2560], 1280, 724],
  'kajuete-hoch': [[720, 1080], 720, 1273],
  kompass: [[960, 1600], 960, 543],
  hafen: [[960, 1600], 960, 543],
};
const satz = (name, typ) => BILD[name][0].map((b) => `/medien/kapitaen-${name}-${b}.${typ} ${b}w`).join(', ');
const quelle = (name, media = '') => {
  const [, w, h] = BILD[name];
  const m = media ? ` media="${media}"` : '';
  return `<source${m} type="image/avif" srcset="${satz(name, 'avif')}" sizes="100vw" width="${w}" height="${h}"><source${m} type="image/webp" srcset="${satz(name, 'webp')}" sizes="100vw" width="${w}" height="${h}">`;
};
const bild = (name, { klasse, alt = '', prio = false } = {}) => {
  const [, w, h] = BILD[name];
  const laden = prio ? ' fetchpriority="high" decoding="async"' : ' loading="lazy" decoding="async"';
  return `<picture class="${klasse}">${quelle(name)}<img src="/medien/kapitaen-${name}-${w}.webp" width="${w}" height="${h}" alt="${esc(alt)}"${laden}></picture>`;
};

// ---------- Hero „Kajüte“: das Bild ist der erste Eindruck (LCP), die Botschaft steht als Text daneben ----------
// Computer: Kajüte quer, Text links im Dunkel. Handy: Kajüte hoch als Band oben, Text darunter. Bild ist Stimmung, kein Inhalt (alt="").
const H = S.hero;
const held = `<section class="held" aria-labelledby="titel">
  <picture class="held-bild">${quelle('kajuete-quer', '(min-width: 48rem)')}${quelle('kajuete-hoch')}<img src="/medien/kapitaen-kajuete-hoch-720.webp" width="720" height="1273" alt="" fetchpriority="high" decoding="async"></picture>
  <div class="huelle held-in">
    ${ueber(esc(H.dach))}
    <h1 id="titel"${W}>${H.titel}</h1>
    <p class="held-satz">${esc(H.lead)}</p>
    <div class="aktionen held-aktionen">
      <a class="knopf" href="#kontakt">Projekt besprechen ${pfeil}</a>
      <a class="knopf zweit" href="#arbeiten">Arbeiten ansehen</a>
    </div>
    <div class="held-fuss">
      <p class="held-zeile">${esc(H.unterzeile)}</p>
      <button class="film-knopf nur-js" type="button" data-vorstellung-oeffnen aria-controls="vorstellung"><span class="film-knopf-zeichen" aria-hidden="true"><svg viewBox="0 0 32 22" focusable="false"><rect class="rahmen" x=".75" y=".75" width="30.5" height="20.5" rx="2"/><path class="dreieck" d="M13 6.5v9l7.5-4.5z"/></svg></span><span class="film-knopf-text">${esc(V.knopf)}</span></button>
    </div>
  </div>
</section>`;

// ---------- Leistungen „An Bord“: sechs Messingplaketten, je ein Instrument als feine Strichzeichnung (Dekor) ----------
const INSTRUMENT = {
  neu: '<circle cx="24" cy="24" r="19"/><circle cx="24" cy="24" r="15.5" class="fein"/><path d="M24 6.5 27 21 41.5 24 27 27 24 41.5 21 27 6.5 24 21 21Z"/><path d="M24 6.5 27 21 24 24 21 21Z" class="voll"/>',
  alt: '<circle cx="24" cy="7.5" r="2.6"/><path d="M22.6 9.8 13 42M25.4 9.8 35 42"/><path d="M14.6 31.5c6.2 3.6 12.6 3.6 18.8 0" class="fein"/>',
  seo: '<path d="M7 31.5 33.5 19.6l2.6 5.8L9.6 37.3Z"/><path d="m33.5 19.6 6.6-3 2.6 5.8-6.6 3"/><path d="m21 32-5.5 11.5M21 32l5.5 11.5" class="fein"/>',
  geo: '<path d="M24 13c-5.5-3.8-12.5-4.3-18-2.3v26c5.5-2 12.5-1.5 18 2.3 5.5-3.8 12.5-4.3 18-2.3v-26c-5.5-2-12.5-1.5-18 2.3Z"/><path d="M24 13v26"/><path d="M10 17.5c3.3-.8 6.6-.5 10 .9M10 23.5c3.3-.8 6.6-.5 10 .9M28 18.4c3.4-1.4 6.7-1.7 10-.9" class="fein"/>',
  tempo: '<path d="M13 6.5h22M13 41.5h22"/><path d="M16 6.5c0 10.5 16 11 16 17.5S16 31 16 41.5M32 6.5c0 10.5-16 11-16 17.5s16 7 16 17.5"/><path d="M19.5 38.5c1.6-3 7.4-3 9 0Z" class="voll"/>',
  sicher: '<path d="M13 21.5h22v19H13Z"/><path d="M17.5 21.5v-5.5a6.5 6.5 0 0 1 13 0v5.5"/><path d="M24 28v5.5" class="fein"/><circle cx="24" cy="28" r="1.8" class="voll"/>',
};
const L = S.leistungen;
const leistungen = `<section class="abschnitt leistungen" id="leistungen" aria-labelledby="t-leistungen"${pr(P.leistungen)}>
  <div class="huelle">
    <div class="kopfzeile">
      ${ueber(esc(L.ueber))}
      <h2 id="t-leistungen" class="einblenden"${W}>${L.titel}</h2>
      <p class="einblenden">${esc(L.kopf)}</p>
    </div>
    <ul class="plaketten">
${L.karten.map((k) => `      <li class="plakette einblenden">
        <svg class="instrument" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${INSTRUMENT[k.id]}</svg>
        <h3>${esc(k.titel)}</h3>
        <p>${esc(k.text)}</p>
        <p class="fachwort">Fachbegriff: ${esc(k.kurz)}</p>
      </li>`).join('\n')}
    </ul>
  </div>
</section>`;

// ---------- Ablauf „Der Kurs“: vier Bojen auf einer Seekarte, verbunden durch die Kurslinie ----------
// Karte und Linie sind Dekor (CSS/SVG). Die Linie zeichnet sich beim Scrollen (Scroll-Timeline), sonst steht sie fertig da.
const AB = S.ablauf;
const ablauf = `<section class="abschnitt ablauf" id="ablauf" aria-labelledby="t-ablauf"${pr(P.ablauf)}>
  <div class="seekarte" aria-hidden="true"></div>
  <div class="huelle">
    <div class="kopfzeile">
      ${ueber(esc(AB.ueber))}
      <h2 id="t-ablauf" class="einblenden">${AB.titel}</h2>
    </div>
    <div class="kurs">
      <ol class="schritte">
${AB.schritte.map((st, i) => `        <li class="schritt einblenden"><span class="etappe" aria-hidden="true"><span class="etappe-nr">${String(i + 1).padStart(2, '0')}</span><span class="etappe-linie"></span></span><h3>${esc(st.titel)}</h3><p>${esc(st.text)}</p></li>`).join('\n')}
      </ol>
    </div>
  </div>
</section>`;

// ---------- Arbeiten „Aus dem Logbuch“: Reiter mit den Musterseiten (ohne JS stehen alle untereinander) ----------
const messung = (w) => `
      <dl class="werk-werte">
        <div><dt>Tempo auf dem Handy</dt><dd>${w.perf} von 100</dd></div>
        <div><dt>Barrierefreiheit</dt><dd>${w.a11y} von 100</dd></div>
        <div><dt>Gewicht der Startseite</dt><dd>${w.kb} KB</dd></div>
      </dl>`;
const werk = (a) => {
  const link = a.link
    ? `<p class="werk-link"><a class="oeffnen" href="${esc(a.link)}" target="_blank" rel="noopener"${pr(P.link)}><span class="oeffnen-text"><span class="oeffnen-klein">Live im Browser</span><span class="oeffnen-gross">${esc(a.name)} ansehen</span></span><span class="oeffnen-zeichen" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M7 17 17 7M9 7h8v8"/></svg></span><span class="unsichtbar"> (öffnet in neuem Tab)</span></a></p>`
    : '';
  return `  <article class="werk werk--${a.id}" id="arbeit-${a.id}" aria-labelledby="w-${a.id}" data-reiter="${a.id}">
    <div class="werk-bild">
      ${a.link ? `<a class="werk-bild-link" href="${esc(a.link)}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"><span class="werk-bild-hinweis">Seite öffnen ${raus}</span></a>` : ''}
      <div class="rahmen rahmen--desktop">
        <span class="rahmen-leiste" aria-hidden="true"><span class="rahmen-punkte"></span><span class="rahmen-adresse">${esc(a.name.toLowerCase())} · ${esc(a.art.toLowerCase())}</span></span>
        <div class="fenster">${aufnahme(a, 'desktop', '(min-width: 64rem) 58vw, 1px')}</div>
      </div>
      <div class="rahmen rahmen--handy"><div class="fenster">${aufnahme(a, 'handy', '(min-width: 64rem) 200px, (min-width: 48rem) 26vw, 72vw')}</div></div>
    </div>
    <div class="werk-schild">
      <p class="werk-nr"><span>Eintrag ${a.nr}</span> · <span class="werk-art">${esc(a.art_lang)} · ${esc(a.branche)}</span></p>
      <h3 id="w-${a.id}">${esc(a.name)}</h3>
      ${a.entscheidung ? `<p class="werk-entscheidung"${pr(P.entscheidung)}>${esc(a.entscheidung)}</p>` : ''}
      <p class="werk-satz">${esc(a.satz)}</p>
      <ul class="werk-punkte">
${a.punkte.map((t) => `        <li>${esc(t)}</li>`).join('\n')}
      </ul>${a.werte ? messung(a.werte) : ''}
      ${link}
    </div>
  </article>`;
};
const arbeiten = `<section class="abschnitt arbeiten" id="arbeiten" aria-labelledby="t-arbeiten">
  <div class="huelle">
    <div class="kopfzeile">
      ${ueber(esc(S.arbeiten_ueber))}
      <h2 id="t-arbeiten" class="einblenden"${W}>${S.arbeiten_titel.replace('{n}', ANZAHL).replace('{n_klein}', ANZAHL.toLowerCase())}</h2>
      <p class="einblenden">${esc(S.arbeiten_kopf)}</p>
    </div>
    <div class="buehne">
      <div class="buehne-reiter nur-js" role="tablist" aria-label="Arbeit wählen">
${A.map((a, i) => `        <button class="reiter reiter--${a.id}" type="button" role="tab" id="reiter-${a.id}" aria-controls="arbeit-${a.id}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''}><span class="reiter-name">${esc(a.name)}</span><span class="reiter-branche">${esc(a.branche)}</span></button>`).join('\n')}
      </div>
      <div class="werke">
${A.map(werk).join('\n')}
      </div>
    </div>
  </div>
</section>`;

// ---------- Zwischenbild „Kompass“: ein ruhiger Filmmoment zwischen Arbeiten und Preisen ----------
const ZB = S.zwischenbild;
const zwischenbild = `<section class="zwischenbild" aria-label="Unser Versprechen">
  ${bild('kompass', { klasse: 'zwischenbild-bild' })}
  <div class="huelle zwischenbild-in">
    ${ueber(esc(ZB.ueber))}
    <p class="zwischenbild-satz einblenden"${W}>${esc(ZB.satz)}</p>
  </div>
</section>`;

// ---------- Preise „Die Fahrt“: zwei Messingplaketten, der Preis steht oben ----------
const B = S.betreuung;
const betreuung = `<section class="abschnitt betreuung" id="betreuung" aria-labelledby="t-betreuung">
  <div class="huelle">
    <div class="kopfzeile">
      ${ueber(esc(B.ueber))}
      <h2 id="t-betreuung" class="einblenden"${W}>${B.titel}</h2>
      <p class="einblenden">${esc(B.kopf)}</p>
    </div>
    <div class="bet-paar">
      <section class="bet-karte einblenden" aria-labelledby="b-seite">
        <p class="preis"><span class="preis-wert"${pr(P.preis_website)}>${esc(S.preis_website_anzeige)}</span><span class="preis-titel">${esc(B.seite.preis_art)}</span></p>
        <h3 id="b-seite">${esc(B.seite.titel)}</h3>
        <p>${esc(B.seite.text)}</p>
        <ul class="bet-liste">
${(B.seite.enthalten || []).map(([n, t]) => `          <li><strong>${esc(n)}</strong><span>${esc(t)}</span></li>`).join('\n')}
        </ul>
      </section>
      <section class="bet-karte bet-karte--abo einblenden" aria-labelledby="b-abo">
        <p class="preis"><span class="preis-wert"${pr(P.preis_abo)}>${esc(S.preis_abo_anzeige)}</span><span class="preis-titel">${esc(B.abo.preis_art)}</span></p>
        <h3 id="b-abo">${esc(B.abo.titel)}</h3>
        <p>${esc(B.abo.text)}</p>
        <p class="bet-wahl-titel">Zusätzlich wählbar</p>
        <ul class="bet-wahl"${pr(P.wahl)}>
${B.abo.wahl.map(([n, t]) => `          <li><strong>${esc(n)}</strong><span>${esc(t)}</span></li>`).join('\n')}
        </ul>
        <p class="bet-hinweis">${esc(B.abo.hinweis)}</p>
      </section>
    </div>
  </div>
</section>`;

const FR = S.fragen;
const fragen = `<section class="abschnitt fragen" id="fragen" aria-labelledby="t-fragen"${pr(P.fragen)}>
  <div class="huelle fragen-raster">
    <div class="fragen-kopf">
      ${ueber(esc(FR.ueber))}
      <h2 id="t-fragen" class="einblenden">${FR.titel}</h2>
      <p class="fragen-hinweis">Ihre Frage ist nicht dabei? <a href="#kontakt">Schreiben Sie mir</a>, ich antworte persönlich.</p>
    </div>
    <div class="fragen-liste">
${FR.liste.map(([q, a]) => `      <details class="frage"><summary><span class="frage-text">${esc(q)}</span><span class="frage-zeichen" aria-hidden="true"></span></summary><p>${esc(a)}</p></details>`).join('\n')}
    </div>
  </div>
</section>`;

// ---------- Kontakt „Im Hafen“: Hafen zur blauen Stunde als Band, darunter das Formular ----------
const K = S.kontakt;
const kontakt = `<section class="abschnitt kontakt" id="kontakt" aria-labelledby="t-kontakt">
  ${bild('hafen', { klasse: 'kontakt-bild' })}
  <div class="huelle kontakt-raster">
    <div class="kontakt-text">
      ${ueber(esc(K.ueber))}
      <h2 id="t-kontakt" class="einblenden">${K.titel}</h2>
      <p class="einblenden">${esc(K.text)}</p>
      <ul class="wege">
        <li><span class="wege-art">E-Mail</span><a href="mailto:${S.email}"${pr(P.email)}>${S.email}</a></li>
        ${TELZ(`<li><span class="wege-art">Telefon</span><a href="${TEL_A}"${pr(P.telefon)}>${TEL}</a></li>`)}
        <li><span class="wege-art">Heimathafen</span><span${pr(P.ort)}>${esc(S.ort)}</span></li>
      </ul>
    </div>
    <div class="kontakt-form"${pr(P.formular)}>
      <form class="formular" id="kontaktformular" method="post" action="/api/kontakt">
        <label>Name <input id="k-name" name="name" type="text" autocomplete="name" required maxlength="100"></label>
        <label>E-Mail <input id="k-email" name="email" type="email" autocomplete="email" required maxlength="254"></label>
        <label>Worum geht es? <textarea id="k-nachricht" name="nachricht" required minlength="5" maxlength="5000"></textarea></label>
        <div class="honig" aria-hidden="true"><label>Nicht ausfüllen <input id="k-url" name="firma_url" type="text" tabindex="-1" autocomplete="off"></label></div>
        <p class="hinweis">Ich verwende Ihre Angaben nur, um Ihre Anfrage zu beantworten. Mehr dazu im <a href="/datenschutz.html">Datenschutz</a>.</p>
        <p><button class="knopf" type="submit">Nachricht senden ${pfeil}</button></p>
      </form>
    </div>
  </div>
</section>`;

seite('index.html', {
  titel: `${S.studio} – Websites für Praxen und Betriebe`,
  beschreibung: `Schnelle, klar aufgebaute Websites für Praxen, Werkstätten und Restaurants, ohne Tracking und auf Wunsch betreut. Musterseiten: ${A.map((a) => a.branche).join(', ')}.`,
  inhalt: [held, leistungen, ablauf, arbeiten, zwischenbild, betreuung, fragen, kontakt].join('\n\n'),
  start: true,
});

// =====================================================================
// Rechtliches: nur Platzhalter (nicht selbst formulieren)
// =====================================================================
// Wegweiser statt Brotkrumen (Erkenntnis aus Klarwerk/Merys-Clean-Arbeit, kunden/merysclean/DESIGN.md): am Ende jeder Unterseite
// vier Ziele mit weißem Symbol im Rand und Nahtlinie.
const WEGE = [['/', 'Startseite', 'Zurück zum Anfang', ICON.haus], ['/#arbeiten', 'Arbeiten', `${ANZAHL} Musterseiten ansehen`, ICON.arbeiten], ['/#betreuung', 'Preise', 'Website und Betreuung', ICON.schild], ['/#kontakt', 'Kontakt', 'Projekt anfragen', ICON.post]];
const wegweiser = `<nav class="wegweiser" aria-labelledby="t-wegweiser">
    <h2 id="t-wegweiser" class="wegweiser-titel">Wohin als <em>Nächstes</em>?</h2>
    <ul>
${WEGE.map(([href, name, satz, ic]) => `      <li><a href="${href}"><span class="wegweiser-zeichen">${ic}</span><span class="wegweiser-text"><strong>${name}</strong><span>${satz}</span></span></a></li>`).join('\n')}
    </ul>
  </nav>`;
const einfach = (inhalt) => `<div class="huelle einfach">
${inhalt}
  ${wegweiser}
</div>`;
seite('impressum.html', {
  robots: 'noindex, follow',
  titel: `Impressum – ${S.studio}`,
  beschreibung: `Impressum von ${S.studio}.`,
  inhalt: einfach(`  ${ueber(STUDIO)}
  <h1>Impressum</h1>
  <div class="platzhalter"${pr('Rechtstext nicht erfinden: Impressum aus einem Generator oder vom Anwalt einfügen (Name, Anschrift, Kontakt, ggf. USt-IdNr.).')}>
    <p>PLATZHALTER – Hier kommt das Impressum hin. Es wird nicht selbst formuliert, sondern aus einem Generator übernommen oder anwaltlich erstellt.</p>
  </div>`),
});
seite('datenschutz.html', {
  robots: 'noindex, follow',
  titel: `Datenschutz – ${S.studio}`,
  beschreibung: `Datenschutzerklärung von ${S.studio}.`,
  inhalt: einfach(`  ${ueber(STUDIO)}
  <h1>Datenschutz&shy;erklärung</h1>
  <div class="platzhalter"${pr('Rechtstext nicht erfinden: Datenschutzerklärung aus einem Generator oder vom Anwalt einfügen.')}>
    <p>PLATZHALTER – Hier kommt die Datenschutzerklärung hin. Technische Fakten dieser Website, die dafür wichtig sind:</p>
    <ul>
      <li>keine Cookies, kein Tracking, keine Analyse-Werkzeuge</li>
      <li>Schriften und Bilder kommen vom eigenen Server (keine Google Fonts)</li>
      <li>Kontaktformular: Name, E-Mail und Nachricht werden per E-Mail-Dienst (Resend) weitergeleitet und nicht auf der Website gespeichert</li>
      <li>Hosting bei Cloudflare Pages; Server-Protokolle je nach Anbieter</li>
    </ul>
  </div>`),
});
seite('404.html', {
  robots: 'noindex',
  titel: `Seite nicht gefunden – ${S.studio}`,
  beschreibung: 'Diese Seite gibt es nicht (mehr).',
  inhalt: einfach(`  ${ueber('404')}
  <h1>Diese Seite gibt es <em>nicht</em>.</h1>
  <p>Vielleicht hilft der Weg zurück zu den Arbeiten.</p>
  <div class="aktionen"><a class="knopf" href="/#arbeiten">Zu den Arbeiten</a><a class="knopf zweit" href="/">Zur Startseite</a></div>`),
});
seite('nachricht-gesendet.html', {
  robots: 'noindex',
  titel: `Nachricht gesendet – ${S.studio}`,
  beschreibung: 'Ihre Nachricht ist angekommen.',
  inhalt: einfach(`  ${ueber('Danke')}
  <h1>Ihre Nachricht ist <em>angekommen</em>.</h1>
  <p>Ich melde mich so bald wie möglich bei Ihnen.</p>
  <div class="aktionen"><a class="knopf" href="/">Zur Startseite</a></div>`),
});

writeFileSync(new URL('sitemap.xml', OUT), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${S.basis}/</loc></url>
</urlset>
`);
console.log(`ok – 5 Seiten, ${A.length} Arbeiten${SCHEMA ? ` (Schema ${process.env.SCHEMA})` : ''}`);
