// Baut alle Seiten der Portfolio-Seite:   node bauen.mjs      
// Inhalte stehen NUR in inhalt/seite.json. HTML in public/ nicht von Hand ändern.
// Alles Persönliche (Studioname, Nachname, Ort, Telefon, E-Mail, Foto, Preise, Rechtstexte) ist Platzhalter mit data-pruefen.
import { readFileSync, writeFileSync } from 'node:fs';

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
// Einziges Inline-Skript (CSP-Hash in public/_headers, Test prüft ihn): Klasse js setzen. Die Seite ist durchgehend dunkel, kein Schema-Schalter.
const KOPF_SKRIPT = "document.documentElement.classList.add('js')";
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

// ---------- Navigation ----------
const NAV = [['#leistungen', 'Leistungen'], ['#arbeiten', 'Arbeiten'], ['#betreuung', 'Betreuung'], ['#kontakt', 'Kontakt']];

function seite(datei, { titel, beschreibung, inhalt, robots = '', start = false }) {
  const kanon = `${S.basis}/${datei === 'index.html' ? '' : datei}`;
  const h = (anker) => (start ? anker : `/${anker}`);
  const nav = NAV.map(([a, t]) => `        <li><a href="${h(a)}">${t}</a></li>`).join('\n');
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
<meta property="og:image:alt" content="„Gebaut. Gemessen. Betreut.“ in großer Schrift auf dunklem Grund, ein Lichtkegel macht Ausschnitte der Arbeiten sichtbar">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#1c1a17">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/instrument-serif.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/instrument-serif-kursiv.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/geist.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/marke.css">
<link rel="stylesheet" href="/css/stil.css">
<link rel="stylesheet" href="/css/bausteine.css">
<script>${KOPF_SKRIPT}</script>
<script src="/js/bausteine.js" defer></script>
<script src="/js/seite.js" defer></script>
${start ? '<script src="/js/held.js" defer></script>' : ''}
</head>
<body${start ? ' class="seite-start"' : ''}>
<a class="sprung" href="#inhalt">Zum Inhalt springen</a>
<header class="kopf">
  <div class="huelle kopf-in">
    <a class="marke" href="/"><span class="marke-klammer" aria-hidden="true">[</span><span${pr(P.studio)}>${esc(S.studio)}</span><span class="marke-klammer" aria-hidden="true">]</span><span class="unsichtbar"> – zur Startseite</span></a>
    <button class="menue-knopf" type="button" aria-expanded="false" aria-controls="nav">Menü</button>
    <nav class="nav blatt" id="nav" aria-label="Hauptnavigation">
      <ul>
${nav}
        <li><a class="knopf" href="${h('#kontakt')}">Projekt anfragen ${pfeil}</a></li>
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

<footer class="fuss">
  <div class="huelle">
    <div class="fuss-band">
      <p class="fuss-frage">Ihre Seite beginnt mit <em>einem Gespräch</em>.</p>
      <a class="knopf" href="${h('#kontakt')}">Projekt anfragen ${pfeil}</a>
    </div>
    <div class="fuss-raster">
      <div class="fuss-marke">
        <p class="fuss-name"><span aria-hidden="true">[</span><span${pr(P.studio)}>${esc(S.studio)}</span><span aria-hidden="true">]</span></p>
        <p>Websites mit Betreuung für Praxen, Werkstätten, Restaurants und Studios.</p>
      </div>
      <div>
        <h2 class="fuss-titel">Kontakt</h2>
        <ul class="fuss-liste">
          <li><a href="mailto:${S.email}"${pr(P.email)}>${S.email}</a></li>
          ${TELZ(`<li><a href="${TEL_A}"${pr(P.telefon)}>${TEL}</a></li>`)}
          <li><span${pr(P.ort)}>${esc(S.ort)}</span></li>
        </ul>
      </div>
      <div>
        <h2 class="fuss-titel">Seite</h2>
        <ul class="fuss-liste">
          <li><a href="${h('#arbeiten')}">Arbeiten</a></li>
          <li><a href="${h('#betreuung')}">Betreuung</a></li>
          <li><a href="${h('#kontakt')}">Kontakt</a></li>
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
// Startseite
// =====================================================================
const A = S.arbeiten;
const ueber = (text, k = '') => `<p class="ueberzeile${k ? ` ${k}` : ''}">${text}</p>`;

// ---------- Hero „Lichtkegel“ (Variante C, Elias 05.10.): Mosaik aus den Arbeiten, ein Lichtkegel macht sie sichtbar ----------
// Die H1 ist reiner Text (LCP). Das Mosaik ist Dekor (alt="", aria-hidden): je Spalte eine lange Aufnahme (Handy: Handy-Aufnahme 200 px,
// ab 48rem Desktop-Aufnahme 560 px, jeweils AVIF mit WebP-Rückfall, klein erzeugt mit node mosaik.mjs). Ohne JS und bei „Bewegung reduzieren“ steht der Kegel still (js/held.js).
const MOSAIK = [['hell'], ['laut'], ['edel']];
const mosaikBild = (id) => {
  const d = (typ) => `/medien/mosaik-${id}-desktop.${typ}`;
  const h = (typ) => `/medien/mosaik-${id}-handy.${typ}`;
  return `<picture><source media="(min-width: 48rem)" type="image/avif" srcset="${d('avif')}" width="560" height="1190"><source media="(min-width: 48rem)" type="image/webp" srcset="${d('webp')}" width="560" height="1190"><source type="image/avif" srcset="${h('avif')}" width="200" height="1483"><img src="${h('webp')}" width="200" height="1483" alt="" decoding="async"></picture>`;
};
const held = `<section class="held" aria-labelledby="titel">
  <div class="held-mosaik" aria-hidden="true">
    <div class="held-raster">
${MOSAIK.map((spalte) => `      <div>${spalte.map(mosaikBild).join('')}</div>`).join('\n')}
    </div>
  </div>
  <div class="huelle held-in">
    ${ueber('Websites für Betriebe')}
    <h1 id="titel"><span>Gebaut.</span> <span>Gemessen.</span> <span>Betreut.</span></h1>
    <div class="held-fuss">
      <p class="held-satz">${esc(S.hero.lead)}</p>
      <div class="aktionen held-aktionen">
        <a class="knopf" href="#arbeiten">Arbeiten ansehen ${pfeil}</a>
        <a class="knopf zweit" href="#kontakt">Projekt anfragen</a>
      </div>
    </div>
    <p class="held-hinweis nur-js" aria-hidden="true">Zeiger bewegen, das Licht folgt</p>
  </div>
</section>`;

// ---------- Arbeiten: Bühne mit Reitern (ohne JS stehen alle fünf untereinander) ----------
const WERTE = [['perf', 'Performance'], ['a11y', 'Barrierefreiheit'], ['bp', 'Best Practices'], ['seo', 'SEO']];
const werk = (a) => {
  const link = a.link
    ? `<p class="werk-link"><a class="knopf" href="${esc(a.link)}" target="_blank" rel="noopener"${pr(P.link)}>${esc(a.name)} öffnen ${raus}</a></p>`
    : '';
  const w = a.werte;
  const werte = w ? `
      <p class="werk-werte-titel">Lighthouse mobil, gemessen</p>
      <dl class="werk-werte">
${WERTE.map(([k, t]) => `        <div><dt>${t}</dt><dd>${w[k]}</dd></div>`).join('\n')}
      </dl>` : '';
  return `  <article class="werk werk--${a.id}" id="arbeit-${a.id}" aria-labelledby="w-${a.id}" data-reiter="${a.id}">
    <div class="werk-bild">
      <div class="rahmen rahmen--desktop marken">
        <span class="rahmen-leiste" aria-hidden="true"><span class="rahmen-punkte"></span><span class="rahmen-adresse">${esc(a.name.toLowerCase())} · ${esc(a.art.toLowerCase())}</span></span>
        <div class="fenster">${aufnahme(a, 'desktop', '(min-width: 64rem) 64vw, 1px')}</div>
      </div>
      <div class="rahmen rahmen--handy"><div class="fenster">${aufnahme(a, 'handy', '(min-width: 64rem) 200px, (min-width: 48rem) 26vw, 72vw')}</div></div>
    </div>
    <div class="werk-schild">
      <p class="werk-nr"><span>${a.nr}</span> <span class="werk-art">${esc(a.art_lang)} · ${esc(a.leitmotiv)}</span></p>
      <h3 id="w-${a.id}">${esc(a.name)}</h3>
      ${a.entscheidung ? `<p class="werk-entscheidung"${pr(P.entscheidung)}>${esc(a.entscheidung)}</p>` : ''}
      <p class="werk-satz">${esc(a.satz)}</p>
      <ul class="werk-punkte">
${a.punkte.map((t) => `        <li>${esc(t)}</li>`).join('\n')}
      </ul>${werte}
      ${link}
    </div>
  </article>`;
};

const arbeiten = `<section class="abschnitt arbeiten" id="arbeiten" aria-labelledby="t-arbeiten">
  <div class="huelle">
    <div class="kopfzeile">
      ${ueber('Arbeiten')}
      <h2 id="t-arbeiten" class="einblenden">Fünf Betriebe, fünf <em>Welten</em>.</h2>
      <p class="einblenden">${esc(S.arbeiten_kopf)}</p>
    </div>
    <div class="buehne">
      <div class="buehne-reiter nur-js" role="tablist" aria-label="Arbeit wählen">
${A.map((a, i) => `        <button class="reiter reiter--${a.id}" type="button" role="tab" id="reiter-${a.id}" aria-controls="arbeit-${a.id}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''}><span class="reiter-nr">${a.nr}</span><span class="reiter-name">${esc(a.name)}</span><span class="reiter-branche">${esc(a.branche)}</span></button>`).join('\n')}
      </div>
      <div class="werke">
${A.map(werk).join('\n')}
      </div>
    </div>
  </div>
</section>`;

// ---------- Leistungen: Bento mit sechs kleinen Schaubildern (Runde 3, 2026-10-05) ----------
// Jede Karte zeigt in einem handgebauten Schaubild, was die Leistung tut (HTML/CSS, kein Bild, kein Icon-Satz).
// Die Schaubilder sind Dekor (aria-hidden), der echte Text steht daneben im HTML. Ohne JS und bei „Bewegung reduzieren“
// zeigen sie ihren Endzustand; mit JS spielen sie einmal, sobald sie im Bild sind (js/seite.js → .mini--an).
// Beispielinhalte (ihr-betrieb.de, Adressen, Fragen) sind erkennbar Muster, keine Aussagen über echte Betriebe.
const haken = '<i class="haken"></i>';
const MINI = {
  neu: `<div class="mn-fenster">
        <div class="mn-leiste"><span class="mn-punkte"></span><span class="mn-adresse">ihr-betrieb.de</span></div>
        <div class="mn-seite">
          <span class="mn-raster">${'<i></i>'.repeat(6)}</span>
          <span class="mn-nav"><b></b><i></i><i></i><i></i></span>
          <span class="mn-links">
            <span class="mn-spec">H1 · Instrument Serif</span>
            <span class="mn-titel">Ihr Betrieb,<br>Ihr <em>Leitmotiv</em>.</span>
            <span class="mn-zeilen"><i></i><i></i></span>
            <span class="mn-knopf-zeile"><span class="mn-knopf">Termin anfragen</span><span class="mn-mass">44 px</span></span>
          </span>
          <span class="mn-bild"><svg viewBox="0 0 120 120" preserveAspectRatio="xMidYMax slice" focusable="false"><circle class="strich" pathLength="1" cx="80" cy="52" r="14"/><path class="strich" pathLength="1" d="M0 96 C 26 70, 46 70, 66 86 S 104 92, 120 70"/><path class="strich" pathLength="1" d="M0 112 C 30 96, 60 100, 120 92"/></svg></span>
        </div>
      </div>`,
  alt: `<span class="ma-kopf"><span>alte Adresse</span><span>neue Adresse</span></span>
      ${[['/angebot.php', '/angebot'], ['/team.html', '/team'], ['/kontakt.php', '/kontakt']].map(([v, n]) => `<span class="ma-zeile"><span class="ma-von">${v}</span><span class="ma-pfeil"></span><span class="ma-nach">${n}</span><span class="ma-code">301</span></span>`).join('\n      ')}
      <span class="ma-fuss">${haken}Keine Adresse läuft ins Leere</span>`,
  seo: `<span class="ms-suche"><span class="ms-lupe"></span><span class="ms-anfrage">Physiotherapie in der Nähe</span></span>
      <span class="ms-treffer">
        <span class="ms-quelle"><b></b>ihr-betrieb.de › leistungen</span>
        <span class="ms-titel">Ihr Betrieb – Leistungen und Termine</span>
        <span class="ms-text">Öffnungszeiten, Anfahrt und Leistungen auf einen Blick.</span>
        <span class="ms-chips"><i>Ort</i><i>Öffnungszeiten</i><i>Telefon</i></span>
      </span>`,
  geo: `<span class="mg-code"><span><b>"@type"</b>: "Physiotherapy",</span><span><b>"openingHours"</b>: "Sa 09:00-12:00"</span></span>
      <span class="mg-frage">Hat die Praxis samstags geöffnet?</span>
      <span class="mg-stapel">
        <span class="mg-tippt"><i></i><i></i><i></i></span>
        <span class="mg-antwort"><span class="mg-funke"></span><span>Ja, samstags von 9 bis 12 Uhr – so steht es auf der Website der Praxis.</span><span class="mg-quelle">Quelle: ihr-betrieb.de</span></span>
      </span>`,
  tempo: `<span class="mt-ring"><svg viewBox="0 0 80 80" focusable="false"><circle class="mt-bahn" cx="40" cy="40" r="34"/><circle class="mt-wert" pathLength="100" cx="40" cy="40" r="34"/></svg><span class="mt-zahl">95<small>+</small></span></span>
      <span class="mt-titel"><span class="mt-taste">Tab</span>durch die Seite</span>
      <span class="mt-reihe"><i>Start</i><i>Leistungen</i><i>Kontakt</i><span class="mt-fokus"></span></span>
      <span class="mt-checks"><i>${haken}Tastatur</i><i>${haken}Kontrast AA</i><i>${haken}Alt-Texte</i></span>`,
  sicher: `<span class="mz-status"><b></b>HTTP 200 · Antwort-Header</span>
      ${[['content-security-policy', "default-src 'self'"], ['strict-transport-security', 'max-age=31536000'], ['x-frame-options', 'DENY']].map(([k, v]) => `<span class="mz-zeile"><b>${k}</b><span>${esc(v)}</span>${haken}</span>`).join('\n      ')}
      <span class="mz-null"><span><b>0</b>Cookies</span><span><b>0</b>fremde Skripte</span></span>`,
};
const L = S.leistungen;
const leistungen = `<section class="abschnitt leistungen" id="leistungen" aria-labelledby="t-leistungen"${pr(P.leistungen)}>
  <div class="huelle">
    <div class="kopfzeile">
      ${ueber('Leistungen')}
      <h2 id="t-leistungen" class="einblenden">Mehr als eine <em>neue Seite</em>.</h2>
      <p class="einblenden">${esc(L.kopf)}</p>
    </div>
    <ul class="bento">
${L.karten.map((k) => `      <li class="leist leist--${k.id} einblenden">
        <div class="mini mini--${k.id}" aria-hidden="true">
      ${MINI[k.id]}
        </div>
        <div class="leist-text"><h3>${esc(k.titel)}</h3><p>${esc(k.text)}</p></div>
      </li>`).join('\n')}
    </ul>
  </div>
</section>`;

const B = S.betreuung;
const betreuung = `<section class="abschnitt betreuung" id="betreuung" aria-labelledby="t-betreuung">
  <div class="huelle">
    <div class="kopfzeile">
      ${ueber('Seite und Betreuung')}
      <h2 id="t-betreuung" class="einblenden">Die Seite einmal. Die Betreuung <em>nach Wahl</em>.</h2>
      <p class="einblenden">${esc(B.kopf)}</p>
    </div>
    <div class="bet-paar">
      <section class="bet-karte einblenden" aria-labelledby="b-seite">
        <h3 id="b-seite">${esc(B.seite.titel)}</h3>
        <p>${esc(B.seite.text)}</p>
        <ul class="bet-liste">
${(B.seite.enthalten || []).map((w) => `          <li>${esc(w)}</li>`).join('\n')}
        </ul>
        <p class="preis"><span class="preis-wert"${pr(P.preis_website)}>${esc(S.preis_website_anzeige)}</span></p>
      </section>
      <section class="bet-karte bet-karte--abo einblenden" aria-labelledby="b-abo">
        <h3 id="b-abo">${esc(B.abo.titel)}</h3>
        <p>${esc(B.abo.text)}</p>
        <ul class="bet-wahl">
${B.abo.wahl.map((w) => `          <li>${esc(w)}</li>`).join('\n')}
        </ul>
        <p class="bet-hinweis">${esc(B.abo.hinweis)}</p>
        <p class="preis"><span class="preis-wert"${pr(P.preis_abo)}>${esc(S.preis_abo_anzeige)}</span></p>
      </section>
    </div>
  </div>
</section>`;

const AB = S.ablauf;
// Ablauf: je Schritt eine Linienzeichnung (Dekor), die sich einmal zeichnet, wenn sie ins Bild kommt; statisch ohne JS/Bewegung.
const ZEICHNUNG = [
  // Gespräch: zwei Sprechblasen
  '<path class="strich" pathLength="1" d="M10 14h52a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8H30l-10 9v-9h-2a8 8 0 0 1-8-8V22a8 8 0 0 1 8-8Z"/><path class="strich" pathLength="1" d="M78 30h24a8 8 0 0 1 8 8v14a8 8 0 0 1-8 8h-2v8l-9-8H78a8 8 0 0 1-8-8"/><circle class="punkt" cx="28" cy="31" r="2.6"/><circle class="punkt" cx="40" cy="31" r="2.6"/><circle class="punkt" cx="52" cy="31" r="2.6"/>',
  // Vorschlag: Blatt mit Zeilen und Farbmuster des Leitmotivs
  '<path class="strich" pathLength="1" d="M30 6h46l14 14v48H30Z"/><path class="strich" pathLength="1" d="M76 6v14h14"/><path class="strich" pathLength="1" d="M40 32h34M40 42h40M40 52h24"/><circle class="punkt punkt--gross" cx="98" cy="58" r="9"/><circle class="strich" pathLength="1" cx="108" cy="46" r="7"/>',
  // Bau und Messung: Fenster mit Messbogen
  '<path class="strich" pathLength="1" d="M8 10h104v56H8Z"/><path class="strich" pathLength="1" d="M8 20h104"/><path class="strich" pathLength="1" d="M38 56a22 22 0 0 1 44 0"/><path class="strich strich--akzent" pathLength="1" d="M60 56 75 41"/><circle class="punkt" cx="60" cy="56" r="3"/>',
  // Start: Adresszeile mit Schloss, Signal „online“
  '<path class="strich" pathLength="1" d="M10 30h86a10 10 0 0 1 0 20H10a10 10 0 0 1 0-20Z"/><path class="strich" pathLength="1" d="M17 41h8v6h-8Zm1.5 0v-3a2.5 2.5 0 0 1 5 0v3"/><path class="strich" pathLength="1" d="M34 40h44"/><circle class="punkt punkt--gut" cx="102" cy="18" r="4"/><path class="strich" pathLength="1" d="M93 9a13 13 0 0 1 18 0M89 4a19 19 0 0 1 26 0"/>',
];
const ablauf = `<section class="abschnitt ablauf" id="ablauf" aria-labelledby="t-ablauf"${pr(P.ablauf)}>
  <div class="huelle">
    <div class="kopfzeile">
      ${ueber(AB.ueber)}
      <h2 id="t-ablauf" class="einblenden">${AB.titel}</h2>
    </div>
    <ol class="schritte">
${AB.schritte.map((st, i) => `      <li class="schritt einblenden"><span class="schritt-kopf" aria-hidden="true"><span class="schritt-zahl">${String(i + 1).padStart(2, '0')}</span><svg class="schritt-bild mini" viewBox="0 0 120 72" focusable="false">${ZEICHNUNG[i] || ''}</svg></span><h3>${esc(st.titel)}</h3><p>${esc(st.text)}</p></li>`).join('\n')}
    </ol>
  </div>
</section>`;

const FR = S.fragen;
const fragen = `<section class="abschnitt fragen" id="fragen" aria-labelledby="t-fragen"${pr(P.fragen)}>
  <div class="huelle fragen-raster">
    <div class="fragen-kopf">
      ${ueber(FR.ueber)}
      <h2 id="t-fragen" class="einblenden">${FR.titel}</h2>
    </div>
    <div class="fragen-liste">
${FR.liste.map(([q, a]) => `      <details class="frage"><summary>${esc(q)}<span class="frage-zeichen" aria-hidden="true"></span></summary><p>${esc(a)}</p></details>`).join('\n')}
    </div>
  </div>
</section>`;

const kontakt = `<section class="abschnitt kontakt" id="kontakt" aria-labelledby="t-kontakt">
  <div class="huelle kontakt-raster">
    <div class="kontakt-text">
      ${ueber('Kontakt')}
      <h2 id="t-kontakt" class="einblenden">Erzählen Sie mir von Ihrem <em>Betrieb</em>.</h2>
      <p class="einblenden">${esc(S.kontakt.text)}</p>
      <ul class="wege">
        <li><span class="wege-art">E-Mail</span><a href="mailto:${S.email}"${pr(P.email)}>${S.email}</a></li>
        ${TELZ(`<li><span class="wege-art">Telefon</span><a href="${TEL_A}"${pr(P.telefon)}>${TEL}</a></li>`)}
        <li><span class="wege-art">Ort</span><span${pr(P.ort)}>${esc(S.ort)}</span></li>
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
  beschreibung: 'Schnelle Websites ohne Tracking, gebaut für das Handy, auf Wunsch betreut. Fünf Arbeiten: Physiotherapie, Motion-Studio, Uhrmacherei, Restaurant, Gebäudereinigung.',
  inhalt: [held, leistungen, arbeiten, ablauf, betreuung, fragen, kontakt].join('\n\n'),
  start: true,
});

// =====================================================================
// Rechtliches: nur Platzhalter (nicht selbst formulieren)
// =====================================================================
// Wegweiser statt Brotkrumen (Erkenntnis aus Klarwerk/Merys-Clean-Arbeit, kunden/merysclean/DESIGN.md): am Ende jeder Unterseite
// vier Ziele mit weißem Symbol im Rand und Nahtlinie.
const WEGE = [['/', 'Startseite', 'Zurück zum Anfang', ICON.haus], ['/#arbeiten', 'Arbeiten', 'Fünf Musterseiten ansehen', ICON.arbeiten], ['/#betreuung', 'Betreuung', 'Seite und Betreuung', ICON.schild], ['/#kontakt', 'Kontakt', 'Projekt anfragen', ICON.post]];
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
