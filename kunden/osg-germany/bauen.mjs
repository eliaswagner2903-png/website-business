// Baut alle Seiten der OSG-Neugestaltung:   node bauen.mjs      (Test-Schema: SCHEMA=nacht node bauen.mjs)
// Inhalte stehen NUR in inhalt/seite.json (Fakten von de.osgeurope.com, Stand 2026-09-30). HTML in public/ nie von Hand ändern.
// Schreibt außerdem public/css/finder.css (Filterregeln des Werkzeugfinders, reines CSS – funktioniert ohne JavaScript)
// und public/sitemap.xml.
import { readFileSync, writeFileSync } from 'node:fs';

const S = JSON.parse(readFileSync(new URL('./inhalt/seite.json', import.meta.url), 'utf8'));
const OUT = new URL('./public/', import.meta.url);
const SCHEMA = process.env.SCHEMA ? ` data-schema="${process.env.SCHEMA}"` : '';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nb = (s) => esc(s).replace(/ /g, '&nbsp;').replace(/-/g, '&#8209;');
const TEL = nb(S.telefon_anzeige);
const TEL_A = `tel:${S.telefon_link}`;
const raus = '<span class="pfeil" aria-hidden="true">↗</span>';
const pfeil = '<span class="pfeil" aria-hidden="true">→</span>';
const extern = (href, text, k = 'textlink') => `<a class="${k}" href="${esc(href)}" rel="noopener">${text}${raus}<span class="unsichtbar"> (öffnet de.osgeurope.com)</span></a>`;
// Einziges Inline-Skript (Hash in public/_headers): Klasse js vor dem ersten Bild.
const KOPF_SKRIPT = "document.documentElement.classList.add('js')";
const KI = 'KI-Visualisierung – vor Veröffentlichung durch OSG-Fotografie ersetzen oder freigeben lassen';
const ueber = (nr, text) => `<p class="ueberzeile"><span class="ueberzeile-nr">${nr}</span>${text}</p>`;
const ICON = {
  tel: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.6 3.5h2.6l1.4 4.2-2 1.5a12 12 0 0 0 6.2 6.2l1.5-2 4.2 1.4v2.6a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"/></svg>',
  post: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.5 6.5h17v11h-17z"/><path d="m3.5 7 8.5 6.5L20.5 7"/></svg>',
  ort: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21Z"/><circle cx="12" cy="10" r="2.3"/></svg>',
};

// ---------- Bilder (AVIF + WebP aus werkzeuge/bilder.mjs) ----------
const BILD_B = { klein: [480, 800, 1200], hero: [640, 1016, 1600, 2400] };
function bild(name, alt, sizes, { art = 'klein', w = 1200, h = 896, lazy = true, klasse = '' } = {}) {
  const b = BILD_B[art];
  const set = (t) => b.map((x) => `/medien/${name}-${x}.${t} ${x}w`).join(', ');
  const laden = lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high" decoding="async"';
  return `<picture${klasse ? ` class="${klasse}"` : ''}><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><img src="/medien/${name}-${b[1]}.webp" srcset="${set('webp')}" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(alt)}"${laden}></picture>`;
}
const kiHinweis = (text = 'KI-Visualisierung') => `<figcaption class="ki-hinweis" data-pruefen="${esc(KI)}">${text}</figcaption>`;

// ---------- Rahmen jeder Seite ----------
const NAV = [['produkte.html', 'Produkte'], ['industrieloesungen.html', 'Industrielösungen'], ['service.html', 'Service'], ['ueber-uns.html', 'Über OSG'], ['karriere.html', 'Karriere'], ['kontakt.html', 'Kontakt']];
const SEITEN = [];

function seite(datei, { titel, beschreibung, inhalt, robots = '', start = false, extraCss = [], jsonld = '' }) {
  const kanon = `${S.basis}/${datei === 'index.html' ? '' : datei}`;
  if (!robots) SEITEN.push(kanon);
  const nav = NAV.map(([h, t]) => `        <li><a href="/${h}"${h === datei ? ' aria-current="page"' : ''}>${t}</a></li>`).join('\n');
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
${start ? `<meta property="og:image" content="${S.basis}/medien/schaftfraeser-hero-1600.webp">\n` : ''}<meta name="theme-color" content="#0b1016">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/archivo.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/marke.css">
<link rel="stylesheet" href="/css/stil.css">
<link rel="stylesheet" href="/css/bausteine.css">
${extraCss.map((c) => `<link rel="stylesheet" href="/css/${c}">\n`).join('')}${start ? '<link rel="preload" href="/medien/schaftfraeser-hero-1600.avif" as="image" type="image/avif" media="(min-width: 64rem)">\n' : ''}<script>${KOPF_SKRIPT}</script>
<script src="/js/bausteine.js" defer></script>
<script src="/js/seite.js" defer></script>
${jsonld ? `<script type="application/ld+json">${jsonld}</script>\n` : ''}</head>
<body${start ? ' class="seite-start"' : ''}>
<a class="sprung" href="#inhalt">Zum Inhalt springen</a>
<div class="leiste">
  <div class="huelle leiste-in">
    <p class="leiste-text">${esc(S.firma)} · ${esc(S.ort)}</p>
    <ul class="leiste-links">
      <li><a href="${TEL_A}">${ICON.tel}<span>${TEL}</span></a></li>
      <li>${extern(S.shop, 'Online-Shop', 'leiste-link')}</li>
      <li>${extern(`${S.shop}/customer/account/login/`, 'Anmelden', 'leiste-link')}</li>
    </ul>
  </div>
</div>
<header class="kopf">
  <div class="huelle kopf-in">
    <a class="marke" href="/"><img src="/medien/osg-logo.svg" width="171" height="60" alt="OSG – shaping your dreams"><span class="unsichtbar"> – zur Startseite</span></a>
    <button class="menue-knopf" type="button" aria-expanded="false" aria-controls="nav">Menü</button>
    <nav class="nav blatt" id="nav" aria-label="Hauptnavigation">
      <ul>
${nav}
        <li class="nur-blatt">${extern(S.shop, 'Online-Shop')}</li>
        <li><a class="knopf" href="/kontakt.html#formular">Beratung anfragen</a></li>
      </ul>
    </nav>
  </div>
</header>

<main id="inhalt">
${inhalt}
</main>

<footer class="fuss nacht">
  <div class="huelle">
    <div class="fuss-kopf">
      <p class="fuss-satz">Präzision beginnt an der Schneide.</p>
      <a class="knopf" href="/kontakt.html#formular">Beratung anfragen</a>
    </div>
    <div class="fuss-raster">
      <div>
        <h2 class="fuss-titel">${esc(S.firma)}</h2>
        <address class="fuss-adresse">${esc(S.strasse)}<br>D-${esc(S.plz)} ${esc(S.ort)}<br>${esc(S.land)}</address>
        <ul class="fuss-liste">
          <li><span class="fuss-vor">Tel.</span>&nbsp;<a href="${TEL_A}">${TEL}</a></li>
          <li><span>Fax ${nb(S.fax_anzeige)}</span></li>
          <li><a href="mailto:${S.email}">${S.email}</a></li>
        </ul>
      </div>
      <div>
        <h2 class="fuss-titel">Produkte</h2>
        <ul class="fuss-liste">
${S.bereiche.map((b) => `          <li><a href="/produkte.html#${b.id}">${esc(b.name)}</a></li>`).join('\n')}
        </ul>
      </div>
      <div>
        <h2 class="fuss-titel">Unternehmen</h2>
        <ul class="fuss-liste">
          <li><a href="/industrieloesungen.html">Industrielösungen</a></li>
          <li><a href="/service.html">Service und Academy</a></li>
          <li><a href="/ueber-uns.html">Über OSG</a></li>
          <li><a href="/karriere.html">Karriere</a></li>
          <li><a href="/kontakt.html">Kontakt</a></li>
        </ul>
      </div>
      <div>
        <h2 class="fuss-titel">Rechtliches</h2>
        <ul class="fuss-liste">
          <li><a href="/impressum.html">Impressum</a></li>
          <li><a href="/datenschutz.html">Datenschutz</a></li>
          <li>${extern(`${S.basis}/allgemeine-geschaftsbedingungen`, 'AGB', '')}</li>
          <li>${extern(`${S.basis}/rucknahmebedingungen`, 'Rücknahmebedingungen', '')}</li>
          <li><a href="https://osg-gmbh.personiowhistleblowing.com/" rel="noopener">Hinweisgebersystem${raus}<span class="unsichtbar"> (externe Seite)</span></a></li>
        </ul>
      </div>
    </div>
    <p class="fuss-hinweis">© 2026 ${esc(S.firma)}. Neugestaltungs-Studie auf Grundlage der Inhalte von de.osgeurope.com (Stand 30.09.2026) – nicht die offizielle Website der OSG GmbH.</p>
  </div>
</footer>

<nav class="schnell" aria-label="Schnellzugriff">
  <a class="knopf zweit" href="${TEL_A}">${ICON.tel}<span>Anrufen</span></a>
  <a class="knopf" href="/kontakt.html#formular">Beratung anfragen</a>
</nav>
</body>
</html>
`;
  writeFileSync(new URL(datei, OUT), html);
}

// Kopf einer Unterseite (dunkles Band mit H1)
const seitenKopf = (nr, ueberText, h1, lead, extra = '') => `<section class="seitenkopf nacht" aria-labelledby="titel">
  <div class="huelle seitenkopf-in">
    ${ueber(nr, ueberText)}
    <h1 id="titel">${h1}</h1>
    <p class="lead">${lead}</p>
${extra ? `    ${extra}\n` : ''}  </div>
  <div class="skala" aria-hidden="true"></div>
</section>`;

const ctaBand = (titel, text) => `<section class="cta nacht" aria-labelledby="cta-titel">
  <div class="huelle cta-in">
    <div>
      <h2 id="cta-titel">${titel}</h2>
      <p>${text}</p>
    </div>
    <div class="cta-wege">
      <div class="cta-tel-block"><p class="cta-tel-klein">Anwendungstechnik und Vertrieb</p><a class="cta-tel" href="${TEL_A}">${TEL}</a></div>
      <div class="knopf-reihe">
        <a class="knopf" href="/kontakt.html#formular">Beratung anfragen</a>
        <a class="knopf zweit" href="mailto:${S.email}">${ICON.post}<span>E-Mail schreiben</span></a>
      </div>
    </div>
  </div>
</section>`;

// =====================================================================
// Werkzeugfinder (Startseite): reines CSS über :has(), JavaScript meldet nur die Trefferzahl an Screenreader
// =====================================================================
// Anliegen im Formular – dieselbe Liste prüft functions/api/kontakt.js (Test vergleicht beide)
const ANLIEGEN = ['Anwendungsberatung', 'Angebot und Preise', 'Micro Toolmanagement', 'OSG Academy und Workshops', 'Sonstiges'];
const V = S.verfahren, W = S.werkstoffe, SER = S.serien;
const vName = Object.fromEntries(V.map((v) => [v.id, v.name]));
const wName = Object.fromEntries(W.map((w) => [w.id, w.name]));
const treffer = (v, w) => SER.filter((s) => (v === 'alle' || s.verfahren === v) && (w === 'alle' || s.werkstoffe.includes(w)));
const serienWort = (n) => (n === 1 ? '1 Serie passt' : `${n} Serien passen`);

// Suche im Shop (GET an die Katalogsuche von de.osgeurope.com, Feldname q wie im bestehenden Shop)
function shopSuche(id, beschriftung = 'Artikel, EDP-Nummer oder Serie im Shop suchen') {
  return `<form class="shopsuche" action="${S.basis}/catalogsearch/result/" method="get" role="search">
      <label for="${id}">${beschriftung}</label>
      <div class="shopsuche-zeile"><input id="${id}" name="q" type="search" maxlength="128" required placeholder="z. B. A-TAP" enterkeyhint="search"><button class="knopf" type="submit">Suchen<span class="unsichtbar"> (öffnet de.osgeurope.com)</span></button></div>
    </form>`;
}

function finderCss() {
  const r = ['/* Erzeugt von bauen.mjs – nicht von Hand ändern. Werkzeugfinder: Filter, Trefferzahl und Leerzustand. */'];
  for (const v of V) r.push(`.finder:has(#fv-${v.id}:checked) .serie:not(.v-${v.id}) { display: none; }`);
  for (const w of W) {
    r.push(`.finder:has(#fw-${w.id}:checked) .serie:not(.w-${w.id}) { display: none; }`);
    r.push(`.finder:has(#fw-${w.id}:checked) .wchip--${w.id} { color: var(--farbe-auf-akzent); background: var(--farbe-akzent); border-color: var(--farbe-akzent); }`);
  }
  for (const v of ['alle', ...V.map((x) => x.id)]) {
    for (const w of ['alle', ...W.map((x) => x.id)]) {
      const sel = `.finder:has(#fv-${v}:checked):has(#fw-${w}:checked)`;
      if (!(v === 'alle' && w === 'alle')) r.push(`${sel} .zahl--${v}-${w} { display: inline; }`);
      if (!treffer(v, w).length) r.push(`${sel} .finder-leer { display: block; }`);
    }
  }
  r.push('.finder:has(.finder-wahl input:not([value="alle"]):checked) .zahl--alle-alle { display: none; }');
  writeFileSync(new URL('css/finder.css', OUT), `${r.join('\n')}\n`);
}

const chipGruppe = (name, id, legende, liste) => `<fieldset class="finder-wahl">
        <legend>${legende}</legend>
        <div class="chips">
          <input type="radio" id="${id}-alle" name="${name}" value="alle" checked><label for="${id}-alle">Alle</label>
${liste.map((x) => `          <input type="radio" id="${id}-${x.id}" name="${name}" value="${x.id}"><label for="${id}-${x.id}">${esc(x.name)}</label>`).join('\n')}
        </div>
      </fieldset>`;

function serieKarte(s) {
  return `<li class="serie v-${s.verfahren} ${s.werkstoffe.map((w) => `w-${w}`).join(' ')}">
          <p class="serie-verfahren">${vName[s.verfahren]}</p>
          <h3 class="serie-name">${esc(s.name)}</h3>
          <p class="serie-art">${esc(s.art)}</p>
          <p class="serie-spanne">${esc(s.spanne)}</p>
          <ul class="wchips" aria-label="Geeignete Werkstoffe">${s.werkstoffe.map((w) => `<li class="wchip wchip--${w}">${esc(wName[w])}</li>`).join('')}</ul>
          <a class="serie-link" href="/produkte.html#serie-${s.id}">Serie ${esc(s.name.replace(/ Serie$/, ''))} ansehen ${pfeil}</a>
        </li>`;
}

function finder() {
  finderCss();
  const zahlen = [`<span class="zahl zahl--alle-alle">Alle ${SER.length} Serien</span>`];
  for (const v of ['alle', ...V.map((x) => x.id)]) {
    for (const w of ['alle', ...W.map((x) => x.id)]) {
      if (v === 'alle' && w === 'alle') continue;
      zahlen.push(`<span class="zahl zahl--${v}-${w}">${serienWort(treffer(v, w).length)}</span>`);
    }
  }
  return `<section class="abschnitt finder" id="finder" aria-labelledby="finder-titel">
  <div class="huelle">
    <div class="abschnitt-kopf">
      ${ueber('01', 'Werkzeugfinder')}
      <h2 id="finder-titel" class="einblenden">Welche Serie passt zu Ihrem Werkstoff?</h2>
      <p class="einblenden">Bearbeitung und Werkstoff wählen – der Finder zeigt die passenden OSG-Serien, sofort und ohne Anmeldung.</p>
    </div>
    <div class="finder-form">
      ${chipGruppe('verfahren', 'fv', '1 · Bearbeitung', V)}
      ${chipGruppe('werkstoff', 'fw', '2 · Werkstoff', W)}
    </div>
    <p class="finder-stand"><span class="finder-zahl">${zahlen.join('')}</span><span class="finder-quelle">Auswahl nach den Werkstoffangaben der Serien</span></p>
    <p class="unsichtbar" id="finder-ansage" aria-live="polite"></p>
    <ul class="serien">
        ${SER.map(serieKarte).join('\n        ')}
    </ul>
    <div class="finder-leer">
      <p class="finder-leer-titel">Für diese Kombination zeigt der Finder keine Serie.</p>
      <p>Das heißt nicht, dass es kein Werkzeug gibt: Die Anwendungstechnik findet die passende Lösung – bis hin zum Sonderwerkzeug.</p>
      <a class="knopf" href="/kontakt.html#formular">Anwendung schildern</a>
    </div>
    <p class="finder-fuss">Schnittwerte und Sonderlösungen: <a class="textlink" href="/kontakt.html#formular">Anwendungsberatung anfragen</a> · alle Artikel mit EDP-Nummer und Verfügbarkeit ${extern(S.shop, 'im Online-Shop')}</p>
    ${shopSuche('suche-finder', 'Artikel schon bekannt? Direkt im Shop suchen')}
  </div>
</section>`;
}

// =====================================================================
// Startseite
// =====================================================================
function startseite() {
  const held = `<section class="held nacht" aria-labelledby="titel">
  <figure class="held-video held-medien" data-webm="/medien/schaftfraeser-film.webm" data-mp4="/medien/schaftfraeser-film.mp4">
    ${bild('schaftfraeser-hero', 'Beschichteter Vollhartmetall-Schaftfräser mit vier gewendelten Schneiden in Nahaufnahme, blaues Streiflicht auf den Spannuten', '(min-width: 64rem) 100vw, 100vw', { art: 'hero', w: 2400, h: 1357, lazy: false, klasse: 'held-bild' }).replace('<img ', '<img class="held-video-poster" ')}
    <button class="held-video-knopf" type="button" aria-pressed="false" hidden><span class="unsichtbar">Video anhalten</span></button>
    ${kiHinweis()}
  </figure>
  <div class="huelle held-in">
    <div class="held-text">
      ${ueber('OSG', 'Präzisionswerkzeuge aus Göppingen')}
      <h1 id="titel">Präzision beginnt an der Schneide.</h1>
      <p class="lead">Gewindebohrer, Bohrer, Fräser und Wendeschneidplatten vom weltweit größten Hersteller von Schaftwerkzeugen – mit Anwendungstechnik, Academy und Werkzeugmanagement in Göppingen.</p>
      <div class="knopf-reihe">
        <a class="knopf" href="#finder">Werkzeug finden</a>
        <a class="knopf zweit" href="/kontakt.html#formular">Anwendungsberatung anfragen</a>
      </div>
      <p class="held-shop">Sie kennen Ihre EDP-Nummer? ${extern(S.shop, 'Direkt zum Online-Shop')}</p>
    </div>
  </div>
  <div class="huelle">
    <dl class="kennzahlen">
${S.kennzahlen.map((k) => `      <div><dt>${esc(k.text)}</dt><dd>${esc(k.wert)}</dd></div>`).join('\n')}
    </dl>
  </div>
</section>`;

  const bereiche = `<section class="abschnitt" id="produkte" aria-labelledby="produkte-titel">
  <div class="huelle">
    <div class="abschnitt-kopf abschnitt-kopf--zeile">
      <div>
        ${ueber('02', 'Produkte')}
        <h2 id="produkte-titel" class="einblenden">Sechs Bereiche. Ein Anspruch an die Schneide.</h2>
      </div>
      <a class="textlink" href="/produkte.html">Alle Produkte und Serien ${pfeil}</a>
    </div>
    <ul class="bento">
${S.bereiche.map((b, i) => b.bild ? `      <li class="bento-kachel bento-kachel--bild bento-kachel--${i + 1} einblenden">
        <figure>${bild(b.bild, b.alt, i === 0 ? '(min-width: 64rem) 50vw, 100vw' : '(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw')}${kiHinweis()}</figure>
        <div class="bento-text">
          <p class="bento-nr">0${i + 1}</p>
          <h3><a href="/produkte.html#${b.id}">${esc(b.name)}</a></h3>
          <p>${esc(b.text)}</p>
        </div>
      </li>` : `      <li class="bento-kachel bento-kachel--text einblenden">
        <p class="bento-nr">0${i + 1}</p>
        <h3><a href="/produkte.html#${b.id}">${esc(b.name)}</a></h3>
        <p>${esc(b.text)}</p>
        <div class="skala skala--klein" aria-hidden="true"></div>
      </li>`).join('\n')}
    </ul>
    <div class="abrand einblenden">
      <div class="abrand-kopf">
        <p class="abrand-marke" aria-hidden="true">A</p>
        <div>
          <h3>A Brand – die leistungsstärksten OSG-Werkzeuge in einer Linie</h3>
          <p>${esc(S.a_brand.text)}</p>
        </div>
      </div>
      <ul class="abrand-linien">
${S.a_brand.linien.map(([n, t]) => `        <li><span class="abrand-name">${esc(n)}</span><span>${esc(t)}</span></li>`).join('\n')}
      </ul>
    </div>
  </div>
</section>`;

  const B = S.bericht;
  const bericht = `<section class="abschnitt bericht nacht" aria-labelledby="bericht-titel">
  <div class="huelle bericht-in">
    <figure class="bericht-bild einblenden">
      ${bild('fraesen', 'Beschichteter Schaftfräser bearbeitet ein Titanbauteil in einer CNC-Maschine, Späne und Kühlmitteltropfen fliegen', '(min-width: 64rem) 45vw, 100vw')}
      ${kiHinweis('KI-Visualisierung, nicht das Bauteil aus dem Bericht')}
    </figure>
    <div class="bericht-text">
      ${ueber('03', `Anwenderbericht · ${esc(B.kunde)}`)}
      <h2 id="bericht-titel" class="einblenden">${esc(B.titel)}</h2>
      <p class="einblenden">${esc(B.text)}</p>
      <div class="balken einblenden" role="img" aria-label="Standzeit von ${B.vorher} auf ${B.nachher} Minuten gesteigert">
        <div class="balken-zeile"><span class="balken-name">Vorher</span><span class="balken-spur"><span class="balken-wert balken-wert--vorher"></span></span><span class="balken-zahl">${B.vorher} min</span></div>
        <div class="balken-zeile"><span class="balken-name">Mit OSG</span><span class="balken-spur"><span class="balken-wert balken-wert--nachher"></span></span><span class="balken-zahl balken-zahl--stark">${B.nachher} min</span></div>
      </div>
      <p class="bericht-gross"><span>${B.vorher} → ${B.nachher}</span> ${esc(B.einheit)}</p>
      <ul class="haken">
${B.plus.map((p) => `        <li>${esc(p)}</li>`).join('\n')}
      </ul>
      <p class="quelle">Quelle: ${esc(B.quelle)} · ${extern(B.link, 'Bericht lesen')}</p>
    </div>
  </div>
</section>`;

  const branchen = `<section class="abschnitt" id="industrie" aria-labelledby="industrie-titel">
  <div class="huelle">
    <div class="abschnitt-kopf abschnitt-kopf--zeile">
      <div>
        ${ueber('04', 'Industrielösungen')}
        <h2 id="industrie-titel" class="einblenden">Werkzeuge für das Bauteil, nicht nur für die Maschine.</h2>
      </div>
      <a class="textlink" href="/industrieloesungen.html">Alle Industrielösungen ${pfeil}</a>
    </div>
    <ol class="branchen">
${S.branchen.map((b, i) => `      <li class="branche einblenden">
        <a href="/industrieloesungen.html#${b.id}">
          <span class="branche-nr">${String(i + 1).padStart(2, '0')}</span>
          <span class="branche-name">${esc(b.name)}</span>
          <span class="branche-satz">${esc(b.satz)}</span>
          <span class="branche-teile">${esc(b.teaser)}</span>
          ${pfeil}
        </a>
      </li>`).join('\n')}
    </ol>
  </div>
</section>`;

  const T = S.toolmanagement;
  const service = `<section class="abschnitt service" aria-labelledby="service-titel">
  <div class="huelle">
    <div class="abschnitt-kopf">
      ${ueber('05', 'Service')}
      <h2 id="service-titel" class="einblenden">Mehr als Werkzeug: Kreislauf, Wissen, Software.</h2>
    </div>
    <div class="service-raster">
      <article class="kreislauf einblenden">
        <h3>Micro Toolmanagement</h3>
        <p>${esc(T.text)}</p>
        <ol class="kreis">
${T.schritte.map(([n, t], i) => `          <li class="kreis-schritt kreis-schritt--${i + 1}"><span class="kreis-nr">${i + 1}</span><span class="kreis-name">${esc(n)}</span><span class="kreis-text">${esc(t)}</span></li>`).join('\n')}
        </ol>
        <p class="kreislauf-preis">${esc(T.abrechnung)}</p>
        <a class="textlink" href="/service.html#toolmanagement">So funktioniert der Werkzeugkreislauf ${pfeil}</a>
      </article>
      <article class="termine einblenden">
        <h3>OSG Academy und Workshops</h3>
        <ol class="termin-liste">
${S.termine.map((t) => `          <li class="termin">
            <time datetime="${t.datum}"><span class="termin-tag">${t.tag}</span><span class="termin-monat">${t.monat}</span></time>
            <div><p class="termin-titel">${esc(t.titel)}</p><p class="termin-ort">${esc(t.ort)}${t.zeit ? ` · ${esc(t.zeit)}` : ''}</p>${extern(t.link, 'Programm und Anmeldung')}</div>
          </li>`).join('\n')}
        </ol>
        <a class="textlink" href="/service.html#academy">Alle Termine und Downloads ${pfeil}</a>
      </article>
    </div>
  </div>
</section>`;

  const org = {
    '@type': 'Organization', name: S.firma, url: `${S.basis}/`,
    logo: `${S.basis}/medien/osg-logo.svg`, email: S.email, telephone: S.telefon_anzeige,
    address: { '@type': 'PostalAddress', streetAddress: S.strasse, postalCode: S.plz, addressLocality: S.ort, addressCountry: 'DE' },
  };
  const web = { '@type': 'WebSite', name: 'OSG Germany', url: `${S.basis}/` };
  seite('index.html', {
    titel: 'OSG Germany – Gewindebohrer, Bohrer und Fräser aus Göppingen',
    beschreibung: 'Präzisionswerkzeuge von OSG: Gewindebohrer, Bohrer, Fräser, WSP-Werkzeuge, Reibahlen und Gewindelehren – mit Werkzeugfinder, Anwendungsberatung und Micro Toolmanagement.',
    start: true, extraCss: ['finder.css'],
    jsonld: JSON.stringify({ '@context': 'https://schema.org', '@graph': [org, web] }).replace(/</g, '\\u003c'),
    inhalt: [held, finder(), bereiche, bericht, branchen, service, ctaBand('Sprechen Sie mit der Anwendungstechnik.', 'Werkstoff, Bauteil, Maschine – schildern Sie Ihre Bearbeitung. Wir empfehlen Serie, Schnittwerte oder ein Sonderwerkzeug.')].join('\n\n'),
  });
}

// =====================================================================
// Produkte
// =====================================================================
function produkte() {
  const serie = (s) => `<article class="serie-detail" id="serie-${s.id}" aria-labelledby="h-${s.id}">
      <header class="serie-detail-kopf">
        <p class="serie-verfahren">${vName[s.verfahren]} · ${esc(s.spanne)}</p>
        <h3 id="h-${s.id}">${esc(s.name)}</h3>
        <p class="serie-art">${esc(s.art)}</p>
      </header>
      <p class="serie-kurz">${esc(s.kurz)}</p>
${s.merkmale.length ? `      <h4>Merkmale</h4>
      <ol class="merkmale">
${s.merkmale.map((m) => `        <li>${esc(m)}</li>`).join('\n')}
      </ol>` : ''}
      <h4>Werkstoffe</h4>
      <p class="werkstoffe-text">${esc(s.werkstoffe_text)}</p>
${s.aufstellung.length ? `      <h4>Aufstellung</h4>
      <table class="tabelle">
        <thead><tr><th scope="col">Typ</th><th scope="col">Ausführung und Abmessungen</th></tr></thead>
        <tbody>
${s.aufstellung.map(([a, b]) => `          <tr><th scope="row">${esc(a)}</th><td>${esc(b)}</td></tr>`).join('\n')}
        </tbody>
      </table>` : ''}
      <p class="serie-wege">${extern(s.link, `${esc(s.name)} im Shop: Flyer, Film, Artikel`)} <a class="textlink" href="/kontakt.html#formular">Beratung zur ${esc(s.name)} ${pfeil}</a></p>
    </article>`;
  const inhalt = `${seitenKopf('P', 'Produkte', 'Werkzeuge für Gewinden, Bohren und Fräsen', 'Sechs Produktbereiche, dazu die A Brand und die Marken der OSG-Gruppe. Jeder Artikel mit EDP-Nummer und Verfügbarkeit im Online-Shop.', `<p class="seitenkopf-wege"><a class="knopf" href="/#finder">Werkzeugfinder öffnen</a> ${extern(S.shop, 'Zum Online-Shop', 'knopf zweit')}</p>
    ${shopSuche('suche-produkte')}`)}

<section class="abschnitt" aria-labelledby="bereiche-titel">
  <div class="huelle">
    <h2 id="bereiche-titel">Produktbereiche</h2>
    <ul class="bereich-liste">
${S.bereiche.map((b, i) => `      <li class="bereich" id="${b.id}">
        <p class="bereich-nr">0${i + 1}</p>
        <div><h3>${esc(b.name)}</h3><p>${esc(b.text)}</p></div>
        ${extern(b.shop, `${esc(b.kurz)}: alle Artikel im Shop`)}
      </li>`).join('\n')}
    </ul>
  </div>
</section>

<section class="abschnitt abschnitt--flaeche" aria-labelledby="serien-titel">
  <div class="huelle serien-layout">
    <nav class="serien-nav" aria-label="Serien auf dieser Seite">
      <h2 id="serien-titel">Serien im Detail</h2>
      <ul>
${SER.map((s) => `        <li><a href="#serie-${s.id}"><span>${esc(s.name)}</span><span class="serien-nav-v">${vName[s.verfahren]}</span></a></li>`).join('\n')}
      </ul>
    </nav>
    <div class="serien-detail-liste">
    ${SER.map(serie).join('\n    ')}
    </div>
  </div>
</section>

<section class="abschnitt" aria-labelledby="abrand-titel">
  <div class="huelle">
    <div class="abrand">
      <div class="abrand-kopf">
        <p class="abrand-marke" aria-hidden="true">A</p>
        <div>
          <h2 id="abrand-titel">A Brand</h2>
          <p>${esc(S.a_brand.text)}</p>
        </div>
      </div>
      <ul class="abrand-linien">
${S.a_brand.linien.map(([n, t]) => `        <li><span class="abrand-name">${esc(n)}</span><span>${esc(t)}</span></li>`).join('\n')}
      </ul>
      <p>${extern(S.a_brand.link, 'Mehr zur A Brand')}</p>
    </div>
    <h2 class="marken-titel">Weitere Marken der OSG-Gruppe</h2>
    <ul class="marken">
${S.marken.map((m) => `      <li>${extern(m.link, esc(m.name), 'marke-link')}</li>`).join('\n')}
    </ul>
  </div>
</section>

${ctaBand('Welche Serie für Ihr Bauteil?', 'Schildern Sie Werkstoff, Bearbeitung und Maschine – die Anwendungstechnik antwortet mit einer konkreten Empfehlung.')}`;
  seite('produkte.html', {
    titel: 'Produkte – Gewindebohrer, Bohrer, Fräser | OSG Germany',
    beschreibung: 'OSG-Produktbereiche und Serien im Detail: AE-VM, AE-H, ADF, AD/ADO, ADO-SUS und A-TAP mit Merkmalen, Werkstoffen und Abmessungen.',
    inhalt,
  });
}

// =====================================================================
// Industrielösungen
// =====================================================================
function industrie() {
  const inhalt = `${seitenKopf('I', 'Industrielösungen', 'Industrielösungen', 'Sechs Branchen, typische Bauteile und die Werkzeuge, die OSG dafür einsetzt – bis hin zu Sonderwerkzeugen über den Außendienst.', `<nav class="sprungleiste" aria-label="Branchen auf dieser Seite"><ul>${S.branchen.map((b) => `<li><a href="#${b.id}">${esc(b.name)}</a></li>`).join('')}</ul></nav>`)}

<div class="huelle branchen-seite">
${S.branchen.map((b, i) => `  <section class="branche-block" id="${b.id}" aria-labelledby="h-${b.id}">
    <div class="branche-block-kopf">
      <p class="branche-nr">${String(i + 1).padStart(2, '0')}</p>
      <h2 id="h-${b.id}">${esc(b.name)}</h2>
      <p class="branche-satz">${esc(b.satz)}</p>
      <p>${esc(b.text)}</p>
      ${extern(b.link, `Produkte für ${esc(b.name)} im Shop`)}
    </div>
    <table class="tabelle">
      <thead><tr><th scope="col">Bauteil</th><th scope="col">Werkzeuge</th></tr></thead>
      <tbody>
${b.bauteile.map(([t, w]) => `        <tr><th scope="row">${esc(t)}</th><td>${esc(w)}</td></tr>`).join('\n')}
      </tbody>
    </table>
  </section>`).join('\n')}
</div>

${ctaBand('Ihr Bauteil steht nicht dabei?', 'Für Sonderwerkzeuge wenden Sie sich an Ihren OSG-Außendienst oder direkt an die Anwendungstechnik in Göppingen.')}`;
  seite('industrieloesungen.html', {
    titel: 'Industrielösungen – Automotive bis Medizintechnik | OSG',
    beschreibung: 'OSG-Werkzeuge für Automotive, Luft- und Raumfahrt, Energie, Schwerindustrie, Werkzeug- und Formenbau und Medizintechnik – nach Bauteil geordnet.',
    inhalt,
  });
}

// =====================================================================
// Service
// =====================================================================
function service() {
  const T = S.toolmanagement;
  const inhalt = `${seitenKopf('S', 'Service', 'Service, Academy und Downloads', 'Werkzeugkreislauf mit Cost-per-Part, Workshops in der OSG Academy, Kataloge und Software – und ein Händlernetz in ganz Deutschland.')}

<section class="abschnitt" id="toolmanagement" aria-labelledby="tm-titel">
  <div class="huelle zwei-spalten">
    <div>
      ${ueber('01', 'Micro Toolmanagement')}
      <h2 id="tm-titel">Ein geschlossener Werkzeugkreislauf.</h2>
      <p class="lead-klein">${esc(T.text)}</p>
      <ol class="schritte">
${T.schritte.map(([n, t], i) => `        <li><span class="schritt-nr">${i + 1}</span><div><h3>${esc(n)}</h3><p>${esc(t)}</p></div></li>`).join('\n')}
      </ol>
    </div>
    <div class="tm-seite">
      <figure class="tm-bild">${bild('toolmanagement', 'Werkzeugschrank mit Schrumpffuttern und Hartmetallwerkzeugen, dahinter ein Einstellgerät zum Vermessen', '(min-width: 64rem) 40vw, 100vw', { lazy: false })}${kiHinweis()}</figure>
      <div class="kasten">
        <h3>OSG übernimmt</h3>
        <ul class="haken">
${T.uebernimmt.map((u) => `          <li>${esc(u)}</li>`).join('\n')}
        </ul>
        <p class="kasten-preis">${esc(T.abrechnung)}</p>
        ${extern(T.link, 'Micro Toolmanagement im Detail')}
      </div>
    </div>
  </div>
</section>

<section class="abschnitt abschnitt--flaeche" id="academy" aria-labelledby="academy-titel">
  <div class="huelle">
    ${ueber('02', 'OSG Academy')}
    <h2 id="academy-titel">Workshops und Seminare</h2>
    <p class="lead-klein">Praxis-Workshops in der OSG Academy in Göppingen und bei Partnern – mit Fachvorträgen, Live-Demonstrationen und Aufzeichnungen der Web-Seminare.</p>
    <ol class="termin-liste termin-liste--gross">
${S.termine.map((t) => `      <li class="termin">
        <time datetime="${t.datum}"><span class="termin-tag">${t.tag}</span><span class="termin-monat">${t.monat} 2026</span></time>
        <div><h3 class="termin-titel">${esc(t.titel)}</h3><p class="termin-ort">${esc(t.ort)}${t.zeit ? ` · ${esc(t.zeit)}` : ''}</p>${extern(t.link, 'Programm und Anmeldung')}</div>
      </li>`).join('\n')}
    </ol>
    <p>${extern(`${S.basis}/events`, 'Alle Messen, Workshops und Aufzeichnungen')}</p>
  </div>
</section>

<section class="abschnitt" id="downloads" aria-labelledby="dl-titel">
  <div class="huelle">
    ${ueber('03', 'Downloads')}
    <h2 id="dl-titel">Kataloge, Software, Zertifikate</h2>
    <ul class="downloads">
${S.downloads.map((d) => `      <li><a href="${esc(d.link)}" rel="noopener"><span class="dl-name">${esc(d.name)}${raus}</span><span class="dl-text">${esc(d.text)}</span><span class="unsichtbar"> (öffnet de.osgeurope.com)</span></a></li>`).join('\n')}
    </ul>
  </div>
</section>

<section class="abschnitt abschnitt--flaeche" id="haendler" aria-labelledby="hn-titel">
  <div class="huelle">
    ${ueber('04', 'Händlernetz')}
    <h2 id="hn-titel">OSG-Werkzeuge im Fachhandel</h2>
    <ul class="haendler">
${S.haendler.map((h) => `      <li>${esc(h)}</li>`).join('\n')}
    </ul>
    <p>${extern(`${S.basis}/dealernetwork/`, 'Händler mit Adressen')}</p>
  </div>
</section>

${ctaBand('Werkzeugkreislauf für Ihre Fertigung?', 'Wir besprechen, wie Micro Toolmanagement mit Cost-per-Part in Ihre Werkzeugversorgung passt.')}`;
  seite('service.html', {
    titel: 'Service – Toolmanagement, Academy, Downloads | OSG',
    beschreibung: 'Micro Toolmanagement mit Cost-per-Part-Abrechnung, Workshops der OSG Academy, Hauptkatalog, ThreadPro-Software, Zertifikate und Händlernetz.',
    inhalt,
  });
}

// =====================================================================
// Über OSG
// =====================================================================
function ueberUns() {
  const K = S.konzern, G = S.gmbh;
  const inhalt = `${seitenKopf('U', 'Über OSG', 'Über OSG', esc(K.einleitung))}

<section class="abschnitt" aria-labelledby="name-titel">
  <div class="huelle zwei-spalten">
    <div>
      ${ueber('01', 'Der Name')}
      <h2 id="name-titel">Drei Buchstaben, eine Herkunft.</h2>
      <p>OSG ist Firmenname und Handelsmarke zugleich.</p>
      <dl class="buchstaben">
${K.name.map(([b, t]) => `        <div><dt>${b}</dt><dd>${esc(t)}</dd></div>`).join('\n')}
      </dl>
    </div>
    <div>
      ${ueber('02', 'OSG Corporation')}
      <h2>Kennzahlen des Konzerns</h2>
      <table class="tabelle">
        <tbody>
${K.zahlen.map(([a, b]) => `          <tr><th scope="row">${esc(a)}</th><td>${esc(b)}</td></tr>`).join('\n')}
        </tbody>
      </table>
      <p>${esc(K.kern)}</p>
      <p>${esc(K.qualitaet)}</p>
    </div>
  </div>
</section>

<section class="abschnitt nacht" aria-labelledby="gmbh-titel">
  <div class="huelle">
    ${ueber('03', 'OSG GmbH in Deutschland')}
    <h2 id="gmbh-titel">Seit ${esc(G.gruendung)} in Deutschland.</h2>
    <dl class="fakten">
      <div><dt>Standorte</dt><dd>${esc(G.standorte)}</dd></div>
      <div><dt>Gründung</dt><dd>${esc(G.gruendung)}</dd></div>
      <div><dt>Zertifikate</dt><dd>${G.zertifikate.map(esc).join('<br>')}</dd></div>
      <div><dt>Kundenauszeichnungen</dt><dd>${G.auszeichnungen.map(esc).join('<br>')}</dd></div>
    </dl>
    <p class="lead-klein">${esc(G.holding)}</p>
  </div>
</section>

<section class="abschnitt" aria-labelledby="gruppe-titel">
  <div class="huelle">
    ${ueber('04', 'Gruppenmitglieder')}
    <h2 id="gruppe-titel">Die OSG-Gruppe in Europa</h2>
    <ul class="gruppe">
${G.gruppe.map((g) => `      <li>${esc(g)}</li>`).join('\n')}
    </ul>
  </div>
</section>

${ctaBand('Mit OSG arbeiten', 'Als Kunde mit der Anwendungstechnik – oder im Team in Göppingen.')}`;
  seite('ueber-uns.html', {
    titel: 'Über OSG – weltweit größter Hersteller von Schaftwerkzeugen',
    beschreibung: 'OSG Corporation seit 1938, Netzwerk in 33 Ländern; OSG GmbH in Göppingen und Bad Homburg seit 2002, ISO 9001 und ISO 14001, Teil der OSG Germany Holding.',
    inhalt,
  });
}

// =====================================================================
// Karriere
// =====================================================================
function karriere() {
  const K = S.karriere;
  const inhalt = `${seitenKopf('K', 'Karriere', 'Karriere bei OSG', 'Werde Teil eines wachsenden, internationalen Unternehmens – in Göppingen, mit Kolleginnen und Kollegen in 33 Ländern.', extern(K.jobs, 'Offene Stellen in der Jobbörse', 'knopf'))}

<section class="abschnitt" aria-labelledby="benefits-titel">
  <div class="huelle">
    ${ueber('01', 'Benefits')}
    <h2 id="benefits-titel">Was OSG bietet</h2>
    <ul class="benefits">
${K.benefits.map((b, i) => `      <li><span class="benefit-nr">${String(i + 1).padStart(2, '0')}</span>${esc(b)}</li>`).join('\n')}
    </ul>
  </div>
</section>

<section class="abschnitt abschnitt--flaeche" aria-labelledby="wb-titel">
  <div class="huelle zwei-spalten">
    <div>
      ${ueber('02', 'Weiterbildung')}
      <h2 id="wb-titel">Lernen in der OSG Academy</h2>
      <p class="lead-klein">${esc(K.weiterbildung)}</p>
    </div>
    <div class="kasten">
      <h3>Bewerben</h3>
      <p>Alle offenen Stellen und Ausbildungsplätze stehen in der Jobbörse.</p>
      ${extern(K.jobs, 'Zur Jobbörse', 'knopf')}
      <p class="kasten-klein">Fragen vorab: <a href="${TEL_A}">${TEL}</a></p>
    </div>
  </div>
</section>`;
  seite('karriere.html', {
    titel: 'Karriere bei OSG in Göppingen – Jobs und Benefits',
    beschreibung: 'Arbeiten bei OSG in Göppingen: 30 Tage Urlaub, Sonderzahlung, Altersvorsorge, JobRad, Weiterbildung in der OSG Academy. Offene Stellen in der Jobbörse.',
    inhalt,
  });
}

// =====================================================================
// Kontakt
// =====================================================================
function kontakt() {
  const inhalt = `${seitenKopf('K', 'Kontakt', 'Kontakt zu OSG', 'Anwendungsberatung, Angebot, Toolmanagement oder Academy: Schreiben Sie uns oder rufen Sie an.')}

<section class="abschnitt" aria-labelledby="wege-titel">
  <div class="huelle kontakt-raster">
    <div class="kontakt-wege">
      <h2 id="wege-titel">So erreichen Sie uns</h2>
      <div class="cta-tel-block cta-tel--hell"><p class="cta-tel-klein">Telefon</p><a class="cta-tel" href="${TEL_A}">${TEL}</a></div>
      <ul class="kontakt-liste">
        <li>${ICON.post}<a href="mailto:${S.email}">${S.email}</a></li>
        <li>${ICON.tel}<span>Fax ${nb(S.fax_anzeige)}</span></li>
        <li>${ICON.ort}<address>${esc(S.firma)}<br>${esc(S.strasse)}<br>D-${esc(S.plz)} ${esc(S.ort)}</address></li>
      </ul>
      <p><a class="textlink" href="${esc(S.route)}" rel="noopener">Route auf OpenStreetMap${raus}<span class="unsichtbar"> (externe Karte)</span></a></p>
      <p class="kontakt-klein">Bestellungen, Verfügbarkeiten und Konto: ${extern(S.shop, 'Online-Shop')}</p>
    </div>
    <form class="formular" id="formular" method="post" action="/api/kontakt" aria-labelledby="formular-titel">
      <h2 id="formular-titel">Anfrage senden</h2>
      <p class="formular-hinweis">Felder mit * sind Pflicht.</p>
      <div class="feld"><label for="f-name">Name *</label><input id="f-name" name="name" type="text" autocomplete="name" required maxlength="100"></div>
      <div class="feld"><label for="f-firma">Firma</label><input id="f-firma" name="firma" type="text" autocomplete="organization" maxlength="120"></div>
      <div class="feld"><label for="f-email">E-Mail *</label><input id="f-email" name="email" type="email" autocomplete="email" required maxlength="254"></div>
      <div class="feld"><label for="f-anliegen">Anliegen</label>
        <select id="f-anliegen" name="anliegen">
${ANLIEGEN.map((a) => `          <option>${esc(a)}</option>`).join('\n')}
        </select>
      </div>
      <div class="feld"><label for="f-nachricht">Nachricht *</label><textarea id="f-nachricht" name="nachricht" rows="6" required minlength="5" maxlength="5000" aria-describedby="f-nachricht-hilfe"></textarea><p class="feld-hilfe" id="f-nachricht-hilfe">Hilfreich: Werkstoff, Bearbeitung, Bauteil, Maschine, Stückzahl.</p></div>
      <div class="honigtopf" aria-hidden="true"><label for="f-web">Website</label><input id="f-web" name="firma_url" type="text" tabindex="-1" autocomplete="off"></div>
      <p class="formular-hinweis">Wir verwenden Ihre Angaben nur für die Antwort. Mehr in der <a href="/datenschutz.html">Datenschutzerklärung</a>.</p>
      <button class="knopf" type="submit">Anfrage senden</button>
    </form>
  </div>
</section>`;
  seite('kontakt.html', {
    titel: 'Kontakt – OSG GmbH in Göppingen',
    beschreibung: 'OSG GmbH, Karl-Ehmann-Str. 25, 73037 Göppingen: Telefon +49 7161 6064-0, info@osg-germany.de – Anwendungsberatung, Angebot, Toolmanagement und Academy.',
    inhalt,
  });
}

// =====================================================================
// Rechtliches, Fehler, Danke
// =====================================================================
function rechtliches() {
  const I = S.impressum;
  seite('impressum.html', {
    titel: 'Impressum – OSG GmbH', beschreibung: 'Impressum der OSG GmbH, Göppingen.', robots: 'noindex',
    inhalt: `${seitenKopf('§', 'Rechtliches', 'Impressum', 'Angaben übernommen aus dem Impressum auf de.osgeurope.com (Stand 30.09.2026).')}
<section class="abschnitt"><div class="huelle text-spalte">
  <h2>Anbieter</h2>
  <p>${I.zeilen.map(esc).join('<br>')}</p>
  <h2>Geschäftsführer</h2>
  <p>${esc(I.gf)}</p>
  <h2>Register und Steuer</h2>
  <p>Registergericht: ${esc(I.register)}<br>Umsatzsteuer-Identifikationsnummer: ${esc(I.ust)}</p>
  <p class="platzhalter" data-pruefen="Rechtstext nicht erfinden: vollständiges Impressum (inkl. Verantwortliche, Bankverbindung) von OSG bestätigen lassen">Vollständiges Impressum: bisher unter de.osgeurope.com/impressum (Stand 30.09.2026); die alte Adresse leitet künftig hierher.</p>
</div></section>`,
  });
  seite('datenschutz.html', {
    titel: 'Datenschutz – OSG GmbH', beschreibung: 'Datenschutzerklärung der OSG GmbH.', robots: 'noindex',
    inhalt: `${seitenKopf('§', 'Rechtliches', 'Datenschutz', 'Diese Neugestaltung setzt keine Cookies, lädt keine fremden Schriften oder Skripte und zählt keine Besuche.')}
<section class="abschnitt"><div class="huelle text-spalte">
  <p class="platzhalter" data-pruefen="Rechtstext nicht erfinden: Datenschutzerklärung von OSG (bzw. Generator) einsetzen, inkl. Kontaktformular">Die geltende Datenschutzerklärung stellt OSG als PDF bereit: ${extern(`${S.basis}/media/pdf/Privacy%20Notice_DE_DE.pdf`, 'Datenschutzhinweise (PDF)')}</p>
</div></section>`,
  });
  seite('404.html', {
    titel: 'Seite nicht gefunden – OSG Germany', beschreibung: 'Diese Seite gibt es nicht (mehr).', robots: 'noindex',
    inhalt: `${seitenKopf('404', 'Fehler', 'Diese Seite gibt es nicht.', 'Vielleicht hilft einer dieser Wege weiter.')}
<section class="abschnitt"><div class="huelle">
  <ul class="wege-liste">
    <li><a class="knopf" href="/#finder">Werkzeugfinder</a></li>
    <li><a class="knopf zweit" href="/produkte.html">Produkte</a></li>
    <li><a class="knopf zweit" href="/kontakt.html">Kontakt</a></li>
  </ul>
</div></section>`,
  });
  seite('nachricht-gesendet.html', {
    titel: 'Anfrage gesendet – OSG Germany', beschreibung: 'Ihre Anfrage ist bei OSG angekommen.', robots: 'noindex',
    inhalt: `${seitenKopf('✓', 'Kontakt', 'Danke – Ihre Anfrage ist angekommen.', 'Die Anwendungstechnik meldet sich per E-Mail bei Ihnen.')}
<section class="abschnitt"><div class="huelle">
  <p>Eilt es? Rufen Sie an: <a href="${TEL_A}">${TEL}</a></p>
  <ul class="wege-liste">
    <li><a class="knopf" href="/">Zur Startseite</a></li>
    <li><a class="knopf zweit" href="/service.html#academy">Termine der OSG Academy</a></li>
  </ul>
</div></section>`,
  });
}

startseite();
produkte();
industrie();
service();
ueberUns();
karriere();
kontakt();
rechtliches();
writeFileSync(new URL('sitemap.xml', OUT), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SEITEN.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`);
