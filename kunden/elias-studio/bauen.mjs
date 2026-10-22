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
// Inline-Skript (CSP-Hash in public/_headers, Test prüft ihn): Klasse js setzen, auf jeder Seite. Die Seite ist durchgehend hell, kein Schema-Schalter.
const KOPF_SKRIPT = "document.documentElement.classList.add('js')";

// ---------- Wortmarke (Logo C): WAGNER fett, SEITEN fein und kursiv, eine Zeile tiefer; das Eselsohr ist die einzige Farbfläche ----------
const WORTMARKE = '<span class="wz" aria-hidden="true"><span class="wz-wagner">Wagner</span><span class="wz-seiten">Seiten</span></span>';

// ---------- Linien-Icons (Dekor, aria-hidden): ruhig, eine Strichstärke, Farbe folgt dem Akzent ----------
const SYM = {
  neu: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M4 9.5h16M12 12.5v4M10 14.5h4"/>',
  alt: '<path d="M19 8a7.5 7.5 0 0 0-13-1.5M5 4v3h3M5 16a7.5 7.5 0 0 0 13 1.5M19 20v-3h-3"/>',
  seo: '<circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 5 5"/>',
  geo: '<path d="M5 6.5h14v9H12l-4 3.5v-3.5H5z"/><path d="M9 10h6M9 12.5h3.5"/>',
  tempo: '<path d="M5 17a8 8 0 1 1 14 0"/><path d="m12 13 3.5-4.5"/><circle cx="12" cy="13.5" r="1"/>',
  sicher: '<path d="M12 3.5 5 6v5.5c0 4.2 2.8 7.2 7 9 4.2-1.8 7-4.8 7-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  gespraech: '<path d="M4.5 6h11v7h-6l-3 2.5V13h-2z"/><path d="M17.5 9.5H20v7h-1.5v2L16 16.5h-4"/>',
  vorschlag: '<path d="M6 4h8l4 4v12H6z"/><path d="M14 4v4h4M9 13h6M9 16h4"/>',
  pruefung: '<path d="M9 4.5h6v2H9z"/><path d="M7 5.5H5.5V20h13V5.5H17"/><path d="m9 13 2 2 4-4"/>',
  start: '<path d="M6 20V4"/><path d="M6 5h11l-2.5 3.5L17 12H6"/>',
  mail: '<rect x="3.5" y="6" width="17" height="12" rx="1.5"/><path d="m4 7 8 6 8-6"/>',
  ort: '<path d="M12 20.5s6-5.5 6-10a6 6 0 0 0-12 0c0 4.5 6 10 6 10z"/><circle cx="12" cy="10.5" r="2"/>',
};
const sym = (n, k = '') => `<svg class="sym${k ? ` ${k}` : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${SYM[n]}</svg>`;

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
<meta property="og:image:alt" content="Wagner Seiten: Wortmarke auf Creme und drei Musterseiten in verschiedenen Stilen">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#f4efe3">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/marke.css">
<link rel="stylesheet" href="/css/stil.css">
<link rel="stylesheet" href="/css/bausteine.css">
<link rel="stylesheet" href="/css/auftritt.css">
<script>${KOPF_SKRIPT}</script>

<script src="/js/bausteine.js" defer></script>
<script src="/js/seite.js" defer></script>
</head>
<body${start ? ' class="seite-start"' : ''}>
<a class="sprung" href="#inhalt">Zum Inhalt springen</a>
<header class="kopf">
  <div class="huelle kopf-in">
    <a class="marke" href="/"><span class="marke-name"${pr(P.studio)}>${WORTMARKE}<span class="unsichtbar">${esc(S.studio)} – zur Startseite</span></span></a>
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
      <p class="fuss-frage">Ihre Seite beginnt mit <em>einem Gespräch</em>.</p>
      <a class="knopf" href="${h('#kontakt')}">Projekt besprechen ${pfeil}</a>
    </div>
    <div class="fuss-raster">
      <div class="fuss-marke">
        <p class="fuss-name"${pr(P.studio)}>${WORTMARKE}<span class="unsichtbar">${esc(S.studio)}</span></p>
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
          <li><a href="${h('#leistungen')}">Leistungen</a></li>
          <li><a href="${h('#arbeiten')}">Arbeiten</a></li>
          <li><a href="${h('#betreuung')}">Website und Betreuung</a></li>
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
// Startseite – Wagner Seiten (Umbau 22.10.2026): Creme, Grün, Anthrazit, schlicht. Angebot und Arbeiten stehen im Vordergrund, kein Thema.
// Hero (Name + drei Musterseiten) → Leistungen → Ablauf → Arbeiten → Preise → Fragen → Kontakt (einziger dunkler Block).
// =====================================================================
const A = S.arbeiten; // gezeigt, in dieser Reihenfolge; S.arbeiten_ruhend wird nicht gebaut
const ANZAHL = ['Null', 'Eine', 'Zwei', 'Drei', 'Vier', 'Fünf', 'Sechs', 'Sieben'][A.length] || String(A.length);
const ueber = (text, k = '') => `<p class="ueberzeile${k ? ` ${k}` : ''}">${text}</p>`;
const W = pr(P.wortlaut); // neue Überschriften (Umbau 11.10.) sind Vorschläge

// ---------- Hero: Name (Logo C) und drei Musterseiten als Handy-Rahmen, Inhalt statt Stimmung ----------
const H = S.hero;
const SCHAU = ['edel', 'glut', 'norvak'];
const schau = SCHAU.map((id, i) => {
  const a = A.find((x) => x.id === id);
  return `      <figure class="schau schau--${i + 1}">
        <div class="rahmen rahmen--handy"><div class="fenster">${aufnahme(a, 'handy', '(min-width: 64rem) 190px, 28vw', { lazy: false, prio: i === 0 })}</div></div>
        <figcaption><strong>${esc(a.name)}</strong><span>${esc(a.branche)}</span></figcaption>
      </figure>`;
}).join('\n');
const held = `<section class="held" aria-labelledby="titel">
  <div class="huelle held-raster">
    <div class="held-in">
      ${ueber(esc(H.dach))}
      <h1 id="titel"${pr(P.studio)}><span class="wz wz--gross"><span class="wz-wagner">Wagner</span><span class="wz-seiten">Seiten</span></span></h1>
      <p class="held-claim"${W}>${H.titel}</p>
      <p class="held-satz">${esc(H.lead)}</p>
      <div class="aktionen held-aktionen">
        <a class="knopf" href="#kontakt">Projekt besprechen ${pfeil}</a>
        <a class="knopf zweit" href="#arbeiten">Arbeiten ansehen</a>
      </div>
      <p class="held-zeile">${esc(H.unterzeile)}</p>
    </div>
    <div class="held-schau" role="group" aria-label="Drei Musterseiten in verschiedenen Stilen">
${schau}
    </div>
  </div>
</section>`;

// ---------- Leistungen: sechs Karten, nummeriert nach ihrer Reihenfolge ----------
const L = S.leistungen;
// Bilder der Leistungskarten (Higgsfield, 22.10.): fünf mit kurzem Clip (Standbild bis zum Start, ohne Bewegung auch ohne JavaScript), eins als Standbild
const LEISTUNG_CLIP = new Set(['neu', 'alt', 'seo', 'geo', 'tempo']);
const leistungBild = (id) => `<div class="plakette-bild" aria-hidden="true">${LEISTUNG_CLIP.has(id)
  ? `<video muted loop playsinline preload="none" poster="/medien/leistung-${id}.webp" width="720" height="540"><source src="/medien/leistung-${id}.mp4" type="video/mp4"></video>`
  : `<img src="/medien/leistung-${id}.webp" alt="" width="720" height="540" loading="lazy">`}</div>`;

const leistungen = `<section class="abschnitt leistungen" id="leistungen" aria-labelledby="t-leistungen"${pr(P.leistungen)}>
  <div class="huelle">
    <div class="kopfzeile">
      ${ueber(esc(L.ueber))}
      <h2 id="t-leistungen" class="einblenden"${W}>${L.titel}</h2>
      <p class="einblenden">${esc(L.kopf)}</p>
    </div>
    <ul class="plaketten">
${L.karten.map((k, i) => `      <li class="plakette einblenden">
        ${leistungBild(k.id)}
        <div class="plakette-kopf">${sym(k.id)}<p class="plakette-nr" aria-hidden="true">${String(i + 1).padStart(2, '0')}</p></div>
        <h3>${esc(k.titel)}</h3>
        <p>${esc(k.text)}</p>
        <p class="fachwort">Fachbegriff: ${esc(k.kurz)}</p>
      </li>`).join('\n')}
    </ul>
  </div>
</section>`;

// ---------- Ablauf: vier Schritte, nummeriert (die Reihenfolge ist die Information) ----------
const AB = S.ablauf;
const ablauf = `<section class="abschnitt ablauf" id="ablauf" aria-labelledby="t-ablauf"${pr(P.ablauf)}>
  <div class="huelle">
    <div class="kopfzeile">
      ${ueber(esc(AB.ueber))}
      <h2 id="t-ablauf" class="einblenden">${AB.titel}</h2>
    </div>
    <div class="kurs">
      <ol class="schritte">
${AB.schritte.map((st, i) => `        <li class="schritt einblenden"><span class="etappe" aria-hidden="true"><span class="etappe-nr">${String(i + 1).padStart(2, '0')}</span><span class="etappe-linie"></span></span>${sym(['gespraech', 'vorschlag', 'pruefung', 'start'][i], 'sym--schritt')}<h3>${esc(st.titel)}</h3><p>${esc(st.text)}</p></li>`).join('\n')}
      </ol>
    </div>
  </div>
</section>`;

// ---------- Arbeiten: Reiter mit den Musterseiten (ohne JS stehen alle untereinander) ----------
const messung = (w) => `
      <dl class="werk-werte">
        <div><dt>Tempo auf dem Handy</dt><dd>${w.perf} von 100</dd></div>
        <div><dt>Barrierefreiheit</dt><dd>${w.a11y} von 100</dd></div>
        <div><dt>Gewicht der Startseite</dt><dd>${w.kb} KB</dd></div>
      </dl>`;
const werk = (a) => {
  const link = a.link
    ? `<p class="werk-link"><a class="oeffnen" href="${esc(a.link)}" target="_blank" rel="noopener" data-teleport${pr(P.link)}><span class="oeffnen-text"><span class="oeffnen-klein">Live ansehen</span><span class="oeffnen-gross">${esc(a.name)} betreten</span></span><span class="oeffnen-zeichen" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M7 17 17 7M9 7h8v8"/></svg></span><span class="unsichtbar"> (öffnet die Musterseite)</span></a></p>`
    : '';
  return `  <article class="werk werk--${a.id}" id="arbeit-${a.id}" aria-labelledby="w-${a.id}" data-reiter="${a.id}">
    <div class="werk-bild">
      ${a.link ? `<a class="werk-bild-link" href="${esc(a.link)}" target="_blank" rel="noopener" data-teleport tabindex="-1" aria-hidden="true"><span class="werk-bild-hinweis">Betreten ${raus}</span></a>` : ''}
      <div class="rahmen rahmen--desktop">
        <span class="rahmen-leiste" aria-hidden="true"><span class="rahmen-punkte"></span><span class="rahmen-adresse">${esc(a.name.toLowerCase())} · ${esc(a.art.toLowerCase())}</span></span>
        <div class="fenster">${aufnahme(a, 'desktop', '(min-width: 64rem) 58vw, 1px')}</div>
      </div>
      <div class="rahmen rahmen--handy"><div class="fenster">${aufnahme(a, 'handy', '(min-width: 64rem) 200px, (min-width: 48rem) 26vw, 72vw')}</div></div>
    </div>
    <div class="werk-schild">
      <p class="werk-nr"><span>Arbeit ${a.nr}</span> · <span class="werk-art">${esc(a.art_lang)} · ${esc(a.branche)}</span></p>
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

// ---------- Preise: zwei Karten, der Preis steht oben ----------
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

// ---------- Kontakt: der einzige dunkle Block der Seite (Anthrazit) ----------
const K = S.kontakt;
const kontakt = `<section class="abschnitt kontakt" id="kontakt" aria-labelledby="t-kontakt">
  <div class="huelle kontakt-raster">
    <div class="kontakt-text">
      ${ueber(esc(K.ueber))}
      <h2 id="t-kontakt" class="einblenden">${K.titel}</h2>
      <p class="einblenden">${esc(K.text)}</p>
      <ul class="wege">
        <li><span class="wege-art">${sym('mail', 'sym--klein')}E-Mail</span><a href="mailto:${S.email}"${pr(P.email)}>${S.email}</a></li>
        ${TELZ(`<li><span class="wege-art">Telefon</span><a href="${TEL_A}"${pr(P.telefon)}>${TEL}</a></li>`)}
        <li><span class="wege-art">${sym('ort', 'sym--klein')}Ort</span><span${pr(P.ort)}>${esc(S.ort)}</span></li>
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
  inhalt: [held, leistungen, ablauf, arbeiten, betreuung, fragen, kontakt].join('\n\n'),
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
