// Baut alle Seiten der Portfolio-Seite:   node bauen.mjs      (Test-Schema: SCHEMA=nacht node bauen.mjs)
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
const STUDIO = `<span class="platzhalter-wort"${pr(P.studio)}>${esc(S.studio)}</span>`;
const pfeil = '<span class="pfeil" aria-hidden="true">→</span>';
const raus = '<span class="pfeil" aria-hidden="true">↗</span>';
// Einziges Inline-Skript (CSP-Hash in public/_headers, Test prüft ihn): Klasse js setzen, gespeichertes Schema vor dem ersten Bild.
const KOPF_SKRIPT = "(function(d){d.classList.add('js');try{if(localStorage.getItem('oq-schema')==='nacht')d.setAttribute('data-schema','nacht')}catch(e){}})(document.documentElement)";
const ICON = {
  tel: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.6 3.5h2.6l1.4 4.2-2 1.5a12 12 0 0 0 6.2 6.2l1.5-2 4.2 1.4v2.6a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"/></svg>',
  post: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.5 6.5h17v11h-17z"/><path d="m3.5 7 8.5 6.5L20.5 7"/></svg>',
};

// ---------- Vorschaubilder der Arbeiten (werkzeuge/bilder.mjs: AVIF + WebP) ----------
// Desktop-Aufnahme 1440×900 (DPR 2) → 640/1016/1600 px; Handy 390×844 (DPR 3) → 320/640 px.
const MASS = { desktop: { b: [640, 1016, 1600], h: (b) => Math.round(b * 900 / 1440) }, handy: { b: [320, 640], h: (b) => Math.round(b * 844 / 390) } };
function vorschau(a, art, sizes, { lazy = true, alt = true } = {}) {
  const m = MASS[art];
  const set = (typ) => m.b.map((b) => `/medien/arbeit-${a.id}-${art}-${b}.${typ} ${b}w`).join(', ');
  const b0 = m.b[art === 'desktop' ? 1 : 0];
  const text = alt ? esc(art === 'desktop' ? a.alt_desktop : a.alt_handy) : '';
  const laden = lazy ? ' loading="lazy" decoding="async"' : ' decoding="async"';
  return `<picture><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><img src="/medien/arbeit-${a.id}-${art}-${b0}.webp" srcset="${set('webp')}" sizes="${sizes}" width="${b0}" height="${m.h(b0)}" alt="${text}"${laden}></picture>`;
}
const HANDY_KLEIN = '(min-width: 64rem) 220px, 32vw';   // Kontaktbogen im Hero – dieselbe Datei wie im Werk (Cache)

// ---------- Navigation ----------
const NAV = [['#arbeiten', 'Arbeiten'], ['#konfigurator', 'Konfigurator'], ['#leistungen', 'Leistungen'], ['#betreuung', 'Betreuung'], ['#ablauf', 'Ablauf']];

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
<meta name="theme-color" content="#f3f2ee">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/instrument-serif.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/instrument-serif-kursiv.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/geist.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/marke.css">
<link rel="stylesheet" href="/css/stil.css">
<link rel="stylesheet" href="/css/bausteine.css">
${start ? '<link rel="preload" href="/medien/werkbank-anfang-1280.avif" as="image" type="image/avif" media="(min-width: 48rem)">\n<link rel="preload" href="/medien/werkbank-anfang-640.avif" as="image" type="image/avif" media="(max-width: 47.99rem)">' : ''}
<script>${KOPF_SKRIPT}</script>
<script src="/js/bausteine.js" defer></script>
<script src="/js/seite.js" defer></script>
${start ? '<script src="/js/kino.js" defer></script>' : ''}
</head>
<body${start ? ' class="seite-start"' : ''}>
<a class="sprung" href="#inhalt">Zum Inhalt springen</a>
<header class="kopf">
  <div class="huelle kopf-in">
    <a class="marke" href="/"><span class="marke-klammer" aria-hidden="true">[</span><span${pr(P.studio)}>${esc(S.studio)}</span><span class="marke-klammer" aria-hidden="true">]</span><span class="unsichtbar"> – zur Startseite</span></a>
    <button class="schema-knopf nur-js" type="button" aria-pressed="false"><span class="schema-zeichen" aria-hidden="true"></span><span class="unsichtbar">Dunkle Ansicht</span></button>
    <button class="menue-knopf" type="button" aria-expanded="false" aria-controls="nav">Menü</button>
    <nav class="nav blatt" id="nav" aria-label="Hauptnavigation">
      <ul>
${nav}
        <li><a class="knopf" href="${h('#kontakt')}">Projekt anfragen</a></li>
      </ul>
    </nav>
  </div>
</header>

<main id="inhalt">
${inhalt}
</main>

<footer class="fuss">
  <div class="huelle fuss-raster">
    <div class="fuss-marke">
      <p class="fuss-name"><span aria-hidden="true">[</span><span${pr(P.studio)}>${esc(S.studio)}</span><span aria-hidden="true">]</span></p>
      <p>Websites mit Betreuung für Praxen, Werkstätten, Restaurants und Studios.</p>
    </div>
    <div>
      <h2 class="fuss-titel">Kontakt</h2>
      <ul class="fuss-liste">
        <li><a href="mailto:${S.email}"${pr(P.email)}>${S.email}</a></li>
        <li><a href="${TEL_A}"${pr(P.telefon)}>${TEL}</a></li>
        <li><span${pr(P.ort)}>${esc(S.ort)}</span></li>
      </ul>
    </div>
    <div>
      <h2 class="fuss-titel">Seiten</h2>
      <ul class="fuss-liste">
        <li><a href="${h('#arbeiten')}">Arbeiten</a></li>
        <li><a href="/impressum.html">Impressum</a></li>
        <li><a href="/datenschutz.html">Datenschutz</a></li>
      </ul>
    </div>
    <p class="fuss-hinweis">Lotlinie, Zwischenbild und Lindgrund sind ausgedachte Marken für Musterseiten. URFA SOFRASI ist ein Entwurf für ein echtes Restaurant in Eislingen/Fils.</p>
  </div>
</footer>

<nav class="schnell" aria-label="Schnellzugriff">
  <a class="knopf" href="${h('#kontakt')}">Projekt anfragen</a>
  <a class="knopf zweit" href="${TEL_A}"${pr(P.telefon)}>${ICON.tel}<span>Anrufen</span></a>
</nav>
</body>
</html>
`;
  writeFileSync(new URL(datei, OUT), html);
}

// =====================================================================
// Startseite
// =====================================================================
const A = S.arbeiten;
const ueber = (text, k = '') => `<p class="ueberzeile${k ? ` ${k}` : ''}">${text}</p>`;

// ---------- Kino: Scroll-Film „Werkbank“ (Higgsfield, wissen/lehren/scroll-film.md) ----------
// Die Bühne klebt, die Kapitel laufen als normales HTML darüber. Ohne JS, bei „Bewegung reduzieren“ oder
// „Daten sparen“ bleibt das Standbild stehen (js/kino.js lädt dann keinen Film).
const filmBild = (art, lcp) => `<picture class="kino-bild kino-bild--${art}"><source type="image/avif" srcset="/medien/werkbank-${art}-640.avif 640w, /medien/werkbank-${art}-1280.avif 1280w" sizes="100vw"><img src="/medien/werkbank-${art}-1280.webp" srcset="/medien/werkbank-${art}-640.webp 640w, /medien/werkbank-${art}-1280.webp 1280w" sizes="100vw" width="1280" height="716" alt=""${lcp ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></picture>`;
const KAP = S.kino;
const held = `<section class="kino" aria-labelledby="titel" data-film-computer="/medien/werkbank-film-1280" data-film-handy="/medien/werkbank-film-960">
  <div class="kino-buehne" aria-hidden="true">
    ${filmBild('anfang', true)}
    ${filmBild('ende', false)}
    <video class="kino-film" muted playsinline preload="none" tabindex="-1"></video>
    <span class="kino-schleier"></span>
    <span class="kino-skala"><span class="kino-marke"></span></span>
  </div>
  <div class="kino-kapitel">
    <div class="kapitel kapitel--start">
      <div class="huelle kapitel-in">
        ${ueber('Websites mit Betreuung im Monats-Abo', 'ueberzeile--kino')}
        <h1 id="titel">Websites für Praxen, Werkstätten und Restaurants. Gebaut, gemessen und <em>betreut</em>.</h1>
        <p class="held-lead">Ich baue schnelle Websites ohne Tracking, die auf dem Handy funktionieren, und kümmere mich danach im Monats-Abo um Technik, Sicherheit und Änderungen.</p>
        <div class="aktionen held-aktionen">
          <a class="knopf" href="#arbeiten">Arbeiten ansehen ${pfeil}</a>
          <a class="knopf zweit" href="#konfigurator">Seite zusammenstellen</a>
        </div>
        <p class="kino-hinweis nur-js" aria-hidden="true"><span class="kino-hinweis-linie"></span>Scrollen spielt den Film ab</p>
      </div>
    </div>
${KAP.map((k, i) => `    <div class="kapitel" id="kino-${k.id}">
      <div class="huelle kapitel-in">
        <p class="kapitel-nr"><span>${String(i + 1).padStart(2, '0')}</span> / ${String(KAP.length).padStart(2, '0')}</p>
        <h2 class="kapitel-wort">${esc(k.wort)}</h2>
        <p class="kapitel-text">${esc(k.text)}</p>${k.werte ? `
        <dl class="kapitel-werte">
${k.werte.map(([w, t]) => `          <div><dt>${esc(t)}</dt><dd>${esc(w)}</dd></div>`).join('\n')}
        </dl>` : ''}
      </div>
    </div>`).join('\n')}
  </div>
</section>`;

// ---------- Arbeiten: Bühne mit Reitern (ohne JS stehen alle vier untereinander) ----------
const WERTE = [['perf', 'Performance'], ['a11y', 'Barrierefreiheit'], ['bp', 'Best Practices'], ['seo', 'SEO']];
const werk = (a, i) => {
  const urfa = a.id === 'urfa';
  const link = a.link
    ? `<p class="werk-link"><a class="knopf" href="${esc(a.link)}" target="_blank" rel="noopener"${pr(P.link)}>${esc(a.name)} öffnen ${raus}</a><span class="werk-link-hinweis">Die ganze Seite mit allen Unterseiten, in einem neuen Tab</span></p>`
    : `<p class="werk-link werk-link--offen"${pr(P.urfa)}>Öffentlicher Link folgt, sobald das Restaurant die Seite freigibt</p>`;
  return `  <article class="werk werk--${a.id}" id="arbeit-${a.id}" aria-labelledby="w-${a.id}" data-reiter="${a.id}">
    <div class="werk-bild">
      <div class="rahmen rahmen--desktop marken">
        <span class="rahmen-leiste" aria-hidden="true"><span class="rahmen-punkte"></span><span class="rahmen-adresse">${esc(a.name.toLowerCase())} · ${esc(a.art.toLowerCase())}</span></span>
        ${vorschau(a, 'desktop', '(min-width: 76rem) 760px, (min-width: 64rem) 62vw, calc(100vw - 2.5rem)', { lazy: i > 0 })}
      </div>
      <div class="rahmen rahmen--handy">${vorschau(a, 'handy', HANDY_KLEIN)}</div>
    </div>
    <div class="werk-schild">
      <p class="werk-nr"><span>${a.nr}</span> <span class="werk-art"${urfa ? pr(P.urfa) : ''}>${esc(a.art_lang)}</span></p>
      <h3 id="w-${a.id}">${esc(a.name)}</h3>
      <p class="werk-branche">${esc(a.branche)} · Leitmotiv: ${esc(a.leitmotiv)}</p>
      <p class="werk-satz">${esc(a.satz)}</p>
      <ul class="werk-punkte">
${a.punkte.map((p) => `        <li>${esc(p)}</li>`).join('\n')}
      </ul>
      <p class="werk-werte-titel">Messwerte der Startseite · Lighthouse mobil</p>
      <dl class="werk-werte">
${WERTE.map(([k, t]) => `        <div><dt>${t}</dt><dd>${a.werte[k]}</dd></div>`).join('\n')}
        <div><dt>Gewicht</dt><dd>${a.werte.kb}&nbsp;KB</dd></div>
      </dl>
      ${link}
    </div>
  </article>`;
};

const arbeiten = `<section class="abschnitt arbeiten" id="arbeiten" aria-labelledby="t-arbeiten">
  <div class="huelle">
    <div class="kopfzeile">
      ${ueber('Arbeiten')}
      <h2 id="t-arbeiten" class="einblenden">Vier Betriebe, vier <em>Welten</em>.</h2>
      <p class="einblenden">Drei Musterseiten mit ausgedachten Marken und ein Entwurf für ein echtes Restaurant. Jede Seite hat ein Leitmotiv aus der Welt des Betriebs, keine Vorlage, die nur umgefärbt wurde. Die Musterseiten lassen sich komplett öffnen.</p>
    </div>
    <div class="buehne">
      <div class="buehne-reiter nur-js" role="tablist" aria-label="Arbeit wählen">
${A.map((a, i) => `        <button class="reiter reiter--${a.id}" type="button" role="tab" id="reiter-${a.id}" aria-controls="arbeit-${a.id}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''}><span class="reiter-nr">${a.nr}</span><span class="reiter-name">${esc(a.name)}</span><span class="reiter-branche">${esc(a.branche)}</span></button>`).join('\n')}
      </div>
      <div class="werke">
${A.map(werk).join('\n')}
      </div>
    </div>
    <p class="messhinweis">${esc(S.messung)}</p>
  </div>
</section>`;

// ---------- Konfigurator (wissen/preismodell/KONFIGURATOR.md): Auswahl reist mit dem Kontaktformular ----------
// Alle Felder hängen per form="kontaktformular" am Formular unten; die Vorschau färbt sich allein per CSS (:has),
// js/seite.js ergänzt nur Vorschläge je Branche, die Sicherheitsregel bei Zahlung und die Zusammenfassung.
const K = S.konfigurator;
const wahl = (name, id, inhalt, { typ = 'radio', an = false, extra = '' } = {}) =>
  `<label class="wahl wahl--${name}"><input type="${typ}" id="k-${name}-${id}" name="${typ === 'checkbox' ? `${name}[]` : name}" value="${id}" form="kontaktformular"${an ? ' checked' : ''}${extra}>${inhalt}</label>`;
const konfig = `<section class="abschnitt konfig" id="konfigurator" aria-labelledby="t-konfig">
  <div class="huelle">
    <div class="kopfzeile">
      ${ueber('Konfigurator')}
      <h2 id="t-konfig" class="einblenden">Stellen Sie Ihre Seite in fünf <em>Schritten</em> zusammen.</h2>
      <p class="einblenden">Die Vorschau zeigt sofort, wie Stil und Farbe zusammen wirken. Ihre Auswahl geht mit Ihrer Anfrage mit, dann reden wir über genau diese Seite.</p>
    </div>
    <div class="konfig-raster">
      <div class="konfig-schritte">
        <fieldset class="schritt-feld">
          <legend><span class="feld-nr">1</span> Stil</legend>
          <div class="wahl-reihe wahl-reihe--stil">
${K.stile.map((s, i) => `            ${wahl('stil', s.id, `<span class="wahl-muster wahl-muster--${s.id}" aria-hidden="true"></span><span class="wahl-titel">${esc(s.name)}</span><span class="wahl-text">${esc(s.text)}, ${esc(s.beispiel)}</span>`, { an: i === 0 })}`).join('\n')}
          </div>
        </fieldset>
        <fieldset class="schritt-feld">
          <legend><span class="feld-nr">2</span> Farbe</legend>
          <div class="wahl-reihe wahl-reihe--farbe">
${K.farben.map((f, i) => `            ${wahl('farbe', f.id, `<span class="farbfleck farbfleck--${f.id}" aria-hidden="true"></span><span class="wahl-titel">${esc(f.name)}</span>`, { an: i === 0 })}`).join('\n')}
          </div>
        </fieldset>
        <fieldset class="schritt-feld">
          <legend><span class="feld-nr">3</span> Betrieb</legend>
          <div class="wahl-reihe wahl-reihe--branche">
${K.branchen.map((b, i) => `            ${wahl('branche', b.id, `<span class="wahl-titel">${esc(b.name)}</span>`, { an: i === 0, extra: ` data-vorschlag="${b.vorschlag.join(' ')}"` })}`).join('\n')}
          </div>
        </fieldset>
        <fieldset class="schritt-feld">
          <legend><span class="feld-nr">4</span> Bausteine</legend>
          <div class="wahl-reihe wahl-reihe--bausteine">
${K.bausteine.map((b) => `            ${wahl('bausteine', b.id, `<span class="haken" aria-hidden="true"></span><span class="wahl-titel">${esc(b.name)}</span>`, { typ: 'checkbox', an: K.branchen[0].vorschlag.includes(b.id), extra: b.sicher ? ` data-sicher="${b.sicher}"` : '' })}`).join('\n')}
          </div>
          <p class="feld-hinweis nur-js">Zum Betrieb passende Bausteine sind vorgeschlagen und lassen sich abwählen.</p>
        </fieldset>
        <fieldset class="schritt-feld">
          <legend><span class="feld-nr">5</span> Sicherheit</legend>
          <div class="wahl-reihe wahl-reihe--sicher">
${K.sicherheit.map((s, i) => `            ${wahl('sicherheit', s.id, `<span class="wahl-titel">${esc(s.name)}</span><span class="wahl-text">${esc(s.text)}</span>`, { an: i === 0 })}`).join('\n')}
          </div>
          <p class="feld-hinweis konfig-regel" hidden>Mit Zahlung ist mindestens Stufe „Hoch“ nötig. Ich habe sie für Sie gewählt.</p>
        </fieldset>
      </div>
      <div class="konfig-vorschau" aria-hidden="true">
        <div class="vorschau-geraet">
          <div class="vorschau-seite">
            <p class="vorschau-kopf"><span class="vorschau-logo">${K.branchen.map((b) => `<span class="nach-branche nach-branche--${b.id}">${esc(b.muster)}</span>`).join('')}</span><span class="vorschau-menue"></span></p>
            <p class="vorschau-ueber">Muster · ${K.branchen.map((b) => `<span class="nach-branche nach-branche--${b.id}">${esc(b.name)}</span>`).join('')}</p>
            <p class="vorschau-titel">${K.branchen.map((b) => `<span class="nach-branche nach-branche--${b.id}">${esc(b.satz)}</span>`).join('')}</p>
            <p class="vorschau-zeilen"><span></span><span></span><span></span></p>
            <p class="vorschau-knopf">Anfragen</p>
            <p class="vorschau-bausteine">${K.bausteine.map((b) => `<span class="vb vb--${b.id}">${esc(b.name)}</span>`).join('')}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="konfig-fuss">
      <p class="konfig-zusammen nur-js" aria-live="polite"></p>
      <p class="konfig-preis"${pr(P.konfigurator)}>Preis: nach dem ersten Gespräch, mit jeder Position und ihrem Grund</p>
      <a class="knopf" href="#kontakt">Mit dieser Auswahl anfragen ${pfeil}</a>
    </div>
  </div>
</section>`;

const leistungen = `<section class="abschnitt leistungen" id="leistungen" aria-labelledby="t-leistungen">
  <div class="huelle">
    <div class="kopfzeile">
      ${ueber('Leistungen')}
      <h2 id="t-leistungen" class="einblenden">Was jede Seite <em>kann</em>, bevor sie online geht.</h2>
      <p class="einblenden">Das sind keine Versprechen für die Werbung, sondern Prüfpunkte. Jede Seite wird vor der Übergabe dagegen gemessen – auch diese hier.</p>
    </div>
    <ul class="mass-liste">
${S.leistungen.map((l) => `      <li class="mass einblenden">
        <p class="mass-wert"><span class="mass-zahl">${esc(l.mass)}</span> <span class="mass-einheit">${esc(l.einheit)}</span></p>
        <h3>${esc(l.titel)}</h3>
        <p>${esc(l.text)}</p>
      </li>`).join('\n')}
    </ul>
    <div class="preiszeile einblenden">
      <p>Die Website wird einmalig berechnet, die Betreuung monatlich.</p>
      <p class="preis"><span class="preis-titel">Website</span> <span class="preis-wert"${pr(P.preis_website)}>Preis auf Anfrage</span></p>
    </div>
  </div>
</section>`;

const PK = S.pakete;
const GEMEINSAM = PK.zeilen.filter((z) => z.slice(1).every((v) => v === '✓'));
const EIGEN = PK.zeilen.filter((z) => !GEMEINSAM.includes(z));
const haken = (v) => (v === '✓' ? '<span class="ja" aria-hidden="true">✓</span><span class="unsichtbar">enthalten</span>' : v === '–' ? '<span class="nein" aria-hidden="true">–</span><span class="unsichtbar">nicht enthalten</span>' : esc(v));
const betreuung = `<section class="abschnitt betreuung" id="betreuung" aria-labelledby="t-betreuung">
  <div class="huelle">
    <div class="tafel">
      <div class="kopfzeile">
        ${ueber('Betreuung im Monats-Abo')}
        <h2 id="t-betreuung" class="einblenden">Nach dem Start geht die Arbeit <em>weiter</em>.</h2>
        <p class="einblenden">Abhängigkeiten brauchen Updates, Zertifikate laufen ab, Öffnungszeiten ändern sich. Im Abo prüfe ich Ihre Seite jede Woche automatisch und schicke Ihnen jeden Monat einen kurzen Bericht.</p>
      </div>
      <div class="pakete-tabelle">
        <table>
          <caption class="unsichtbar">Die drei Pakete im Vergleich</caption>
          <thead><tr><th scope="col"><span class="unsichtbar">Leistung</span></th>${PK.namen.map((n) => `<th scope="col">${n}</th>`).join('')}</tr></thead>
          <tbody>
${PK.zeilen.map(([t, ...w]) => `            <tr><th scope="row">${esc(t)}</th>${w.map((v) => `<td>${haken(v)}</td>`).join('')}</tr>`).join('\n')}
            <tr class="preis-reihe"><th scope="row">Preis pro Monat</th>${PK.namen.map(() => `<td${pr(P.preis_abo)}>auf Anfrage</td>`).join('')}</tr>
          </tbody>
        </table>
      </div>
      <div class="pakete-karten">
        <section class="paket paket--alle" aria-labelledby="p-alle">
          <h3 id="p-alle">In jedem Paket</h3>
          <ul>
${GEMEINSAM.map((z) => `            <li>${esc(z[0])}</li>`).join('\n')}
          </ul>
        </section>
${PK.namen.map((n, i) => `        <section class="paket" aria-labelledby="p-${i}">
          <h3 id="p-${i}">${n}</h3>
          <ul>
${EIGEN.filter((z) => z[i + 1] !== '–').map((z) => `            <li>${esc(z[0])}${z[i + 1] === '✓' ? '' : `: <strong>${esc(z[i + 1])}</strong>`}</li>`).join('\n') || '            <li>nur die Leistungen aus jedem Paket</li>'}
          </ul>
          <p class="paket-preis"${pr(P.preis_abo)}>Preis pro Monat: auf Anfrage</p>
        </section>`).join('\n')}
      </div>
    </div>
  </div>
</section>`;

const ablauf = `<section class="abschnitt ablauf" id="ablauf" aria-labelledby="t-ablauf">
  <div class="huelle">
    <div class="kopfzeile">
      ${ueber('Ablauf')}
      <h2 id="t-ablauf" class="einblenden">Vom ersten Gespräch bis zur <em>Betreuung</em>.</h2>
    </div>
    <ol class="schritte">
${S.ablauf.map((s, i) => `      <li class="schritt einblenden">
        <span class="schritt-marke" aria-hidden="true"></span>
        <p class="schritt-nr">Schritt ${i + 1}</p>
        <h3>${esc(s.titel)}</h3>
        <p>${esc(s.text)}</p>
      </li>`).join('\n')}
    </ol>
  </div>
</section>`;

const ueberMich = `<section class="abschnitt ueber" id="ueber" aria-labelledby="t-ueber">
  <div class="huelle ueber-raster">
    <figure class="ueber-foto marken"${pr(P.foto)}>
      <span class="ueber-foto-leer">Foto von Elias folgt</span>
    </figure>
    <div class="ueber-text">
      ${ueber('Über mich')}
      <h2 id="t-ueber" class="einblenden">Eine Person, ein <em>Maßstab</em>.</h2>
      <p class="einblenden">Hinter ${STUDIO} stehe ich, <span${pr(P.nachname)}>${esc(S.inhaber)}</span>, in <span${pr(P.ort)}>${esc(S.ort)}</span>. Sie sprechen vom ersten Gespräch bis zur Betreuung mit derselben Person.</p>
      <p class="einblenden platzhalter-text"${pr(P.ueber)}>[Hier ein paar Sätze von Elias: Werdegang, warum Websites, was ihn antreibt.]</p>
      <p class="einblenden">Jede Seite, die ich übergebe, durchläuft dieselbe Prüfung wie die vier Arbeiten oben. Die Messwerte bekommen Sie mit – bei der Abnahme und danach jeden Monat im Bericht.</p>
    </div>
  </div>
</section>`;

const kontakt = `<section class="abschnitt kontakt" id="kontakt" aria-labelledby="t-kontakt">
  <div class="huelle kontakt-raster">
    <div class="kontakt-text">
      ${ueber('Kontakt')}
      <h2 id="t-kontakt" class="einblenden">Erzählen Sie mir von Ihrem <em>Betrieb</em>.</h2>
      <p class="einblenden">Ein paar Sätze reichen: was Sie machen, für wen, und ob es schon eine Website gibt. Ich melde mich mit Fragen und einem Vorschlag für das erste Gespräch.</p>
      <ul class="wege">
        <li><span class="wege-art">E-Mail</span><a href="mailto:${S.email}"${pr(P.email)}>${S.email}</a></li>
        <li><span class="wege-art">Telefon</span><a href="${TEL_A}"${pr(P.telefon)}>${TEL}</a></li>
        <li><span class="wege-art">Ort</span><span${pr(P.ort)}>${esc(S.ort)}</span></li>
      </ul>
    </div>
    <div class="kontakt-form"${pr(P.formular)}>
      <form class="formular" id="kontaktformular" method="post" action="/api/kontakt">
        <label>Name <input id="k-name" name="name" type="text" autocomplete="name" required maxlength="100"></label>
        <label>E-Mail <input id="k-email" name="email" type="email" autocomplete="email" required maxlength="254"></label>
        <label>Worum geht es? <textarea id="k-nachricht" name="nachricht" required minlength="5" maxlength="5000"></textarea></label>
        <div class="honig" aria-hidden="true"><label>Nicht ausfüllen <input id="k-url" name="firma_url" type="text" tabindex="-1" autocomplete="off"></label></div>
        <p class="kontakt-auswahl nur-js" aria-live="polite"></p>
        <p class="hinweis">Ich verwende Ihre Angaben nur, um Ihre Anfrage zu beantworten. Mehr dazu im <a href="/datenschutz.html">Datenschutz</a>.</p>
        <p><button class="knopf" type="submit">Nachricht senden ${pfeil}</button></p>
      </form>
    </div>
  </div>
</section>`;

seite('index.html', {
  titel: `${S.studio} – Websites mit Betreuung für Praxen und Betriebe`,
  beschreibung: 'Schnelle Websites ohne Tracking, gebaut für das Handy und im Monats-Abo betreut. Vier Arbeiten mit Messwerten: Physiotherapie, Motion-Studio, Uhrmacherei, Restaurant.',
  inhalt: [held, arbeiten, konfig, leistungen, betreuung, ablauf, ueberMich, kontakt].join('\n\n'),
  start: true,
});

// =====================================================================
// Rechtliches: nur Platzhalter (nicht selbst formulieren)
// =====================================================================
const einfach = (inhalt) => `<div class="huelle einfach">
${inhalt}
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
