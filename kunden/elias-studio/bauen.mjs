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
const NAV = [['#arbeiten', 'Arbeiten'], ['#konfigurator', 'Konfigurator'], ['#betreuung', 'Betreuung'], ['#kontakt', 'Kontakt']];

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
${start ? '<link rel="preload" href="/medien/tisch-anfang-1280.avif" as="image" type="image/avif" media="(min-width: 48rem)">\n<link rel="preload" href="/medien/tisch-anfang-640.avif" as="image" type="image/avif" media="(max-width: 47.99rem)">\n' : ''}<link rel="stylesheet" href="/css/stil.css">
<link rel="stylesheet" href="/css/bausteine.css">
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
        <li><a href="${h('#konfigurator')}">Konfigurator</a></li>
        <li><a href="${h('#betreuung')}">Betreuung</a></li>
        <li><a href="${h('#kontakt')}">Kontakt</a></li>
        <li><a href="/impressum.html">Impressum</a></li>
        <li><a href="/datenschutz.html">Datenschutz</a></li>
      </ul>
    </div>
${start ? '    <p class="fuss-hinweis">URFA SOFRASI ist ein Entwurf für ein echtes Restaurant in Eislingen/Fils.</p>' : ''}
  </div>
</footer>

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

// ---------- Hero = Kino: Scroll-Film „Werktisch“ (Higgsfield, wissen/lehren/scroll-film.md) ----------
// Erster Bildschirm: heller Werktisch in Eiche und Waldgrün, beim Scrollen geht das Handy an und zeigt eine Seite.
// Die Bühne klebt, die Kapitel laufen als normales HTML darüber. Ohne JS, bei „Bewegung reduzieren“ oder
// „Daten sparen“ bleibt das Standbild stehen (js/kino.js lädt dann keinen Film).
const filmBild = (art, lcp) => `<picture class="kino-bild kino-bild--${art}"><source type="image/avif" srcset="/medien/tisch-${art}-640.avif 640w, /medien/tisch-${art}-1280.avif 1280w" sizes="(min-width: 64rem) 74vw, 100vw"><img src="/medien/tisch-${art}-1280.webp" srcset="/medien/tisch-${art}-640.webp 640w, /medien/tisch-${art}-1280.webp 1280w" sizes="(min-width: 64rem) 74vw, 100vw" width="1280" height="716" alt=""${lcp ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></picture>`;
const KAP = S.kino;
const held = `<section class="kino" aria-labelledby="titel" data-film-computer="/medien/tisch-film-1280" data-film-handy="/medien/tisch-film-960">
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
        ${ueber('Websites für Betriebe', 'ueberzeile--kino')}
        <h1 id="titel">Websites, die man nicht <em>wegklickt</em>.</h1>
        <p class="held-lead">Schnell, ohne Tracking, für Praxen, Werkstätten und Restaurants.</p>
        <div class="aktionen held-aktionen">
          <a class="knopf" href="#arbeiten">Arbeiten ansehen ${pfeil}</a>
          <a class="knopf zweit" href="#kontakt">Projekt anfragen</a>
        </div>
        <p class="kino-hinweis nur-js" aria-hidden="true"><span class="kino-hinweis-linie"></span>Scrollen</p>
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
const werk = (a) => {
  const urfa = a.id === 'urfa';
  const link = a.link
    ? `<p class="werk-link"><a class="knopf" href="${esc(a.link)}" target="_blank" rel="noopener"${pr(P.link)}>${esc(a.name)} öffnen ${raus}</a></p>`
    : `<p class="werk-link werk-link--offen"${pr(P.urfa)}>Link folgt nach Freigabe durch das Restaurant</p>`;
  return `  <article class="werk werk--${a.id}" id="arbeit-${a.id}" aria-labelledby="w-${a.id}" data-reiter="${a.id}">
    <div class="werk-bild">
      <div class="rahmen rahmen--desktop marken">
        <span class="rahmen-leiste" aria-hidden="true"><span class="rahmen-punkte"></span><span class="rahmen-adresse">${esc(a.name.toLowerCase())} · ${esc(a.art.toLowerCase())}</span></span>
        <div class="fenster">${aufnahme(a, 'desktop', '(min-width: 64rem) 64vw, 1px')}</div>
      </div>
      <div class="rahmen rahmen--handy"><div class="fenster">${aufnahme(a, 'handy', '(min-width: 64rem) 200px, (min-width: 48rem) 26vw, 72vw')}</div></div>
    </div>
    <div class="werk-schild">
      <p class="werk-nr"><span>${a.nr}</span> <span class="werk-art"${urfa ? pr(P.urfa) : ''}>${esc(a.art_lang)}</span></p>
      <h3 id="w-${a.id}">${esc(a.name)}</h3>
      <p class="werk-satz">${esc(a.satz)}</p>
      ${link}
    </div>
  </article>`;
};

const arbeiten = `<section class="abschnitt arbeiten" id="arbeiten" aria-labelledby="t-arbeiten">
  <div class="huelle">
    <div class="kopfzeile">
      ${ueber('Arbeiten')}
      <h2 id="t-arbeiten" class="einblenden">Vier Betriebe, vier <em>Welten</em>.</h2>
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

// ---------- Konfigurator (wissen/preismodell/KONFIGURATOR.md): Auswahl und Einstufung reisen mit dem Kontaktformular ----------
// Ablauf nach Elias: Business, Farbe, Schrift, dann jeder Bereich als Regler 1–5, den der Kunde selbst einstuft.
// Alle Felder hängen per form="kontaktformular" am Formular unten; die Vorschau färbt sich allein per CSS (:has),
// js/seite.js ergänzt Vorschläge je Branche, die Sicherheitsregel bei Zahlung, die Stufentexte und die Zusammenfassung.
const K = S.konfigurator;
const wahl = (name, id, inhalt, { typ = 'radio', an = false, extra = '' } = {}) =>
  `<label class="wahl wahl--${name}"><input type="${typ}" id="k-${name}-${id}" name="${typ === 'checkbox' ? `${name}[]` : name}" value="${id}" form="kontaktformular"${an ? ' checked' : ''}${extra}>${inhalt}</label>`;
const feld = (nr, titel, inhalt, klasse = '') => `          <fieldset class="schritt-feld${klasse}" id="gs-${nr}">
            <legend><span class="feld-nr">${nr}</span> ${titel}</legend>
${inhalt}
          </fieldset>`;
const regler = (st) => `            <p class="stufe-frage">${esc(st.frage)}</p>
            <div class="regler">
              <label class="unsichtbar" for="k-stufe-${st.id}">${esc(st.name)}, Stufe 1 bis 5</label>
              <input class="regler-feld" type="range" id="k-stufe-${st.id}" name="stufe_${st.id}" min="1" max="5" step="1" value="${st.start}" form="kontaktformular">
              <span class="regler-skala" aria-hidden="true">${[1, 2, 3, 4, 5].map((n) => `<span>${n}</span>`).join('')}</span>
            </div>
            <ol class="stufen-liste">
${st.stufen.map(([name, text], i) => `              <li${i + 1 === st.start ? ' class="ist"' : ''}><span class="stufe-nr">Stufe ${i + 1}</span> <strong>${esc(name)}</strong> ${esc(text)}</li>`).join('\n')}
            </ol>`;
// [Titel, Reiter-Kurzname, Inhalt, Zusatzklasse]
const SCHRITTE = [
  ['Ihr Business', 'Business', `            <div class="wahl-reihe wahl-reihe--branche">
${K.branchen.map((b, i) => `              ${wahl('branche', b.id, `<span class="wahl-titel">${esc(b.name)}</span>`, { an: i === 0, extra: ` data-vorschlag="${b.vorschlag.join(' ')}"` })}`).join('\n')}
            </div>`],
  ['Farbe', 'Farbe', `            <div class="wahl-reihe wahl-reihe--farbe">
${K.farben.map((f, i) => `              ${wahl('farbe', f.id, `<span class="farbfleck farbfleck--${f.id}" aria-hidden="true"></span><span class="wahl-titel">${esc(f.name)}</span>`, { an: i === 0 })}`).join('\n')}
            </div>`],
  ['Schrift und Stil', 'Schrift', `            <div class="wahl-reihe wahl-reihe--stil">
${K.stile.map((s, i) => `              ${wahl('stil', s.id, `<span class="schriftprobe schriftprobe--${s.id}" aria-hidden="true">${esc(s.probe)}</span><span class="wahl-titel">${esc(s.name)}</span><span class="wahl-text">${esc(s.text)}, ${esc(s.beispiel)}</span>`, { an: i === 0 })}`).join('\n')}
            </div>`],
  ...K.stufen.map((st) => [esc(st.name), esc(st.kurz || st.name), regler(st), ' schritt-feld--stufe']),
  ['Funktionen', 'Funktionen', `            <div class="wahl-reihe wahl-reihe--bausteine">
${K.bausteine.map((b) => `              ${wahl('bausteine', b.id, `<span class="haken" aria-hidden="true"></span><span class="wahl-titel">${esc(b.name)}</span>`, { typ: 'checkbox', an: K.branchen[0].vorschlag.includes(b.id), extra: b.sicher ? ` data-sicher="${b.sicher}"` : '' })}`).join('\n')}
            </div>
            <p class="feld-hinweis nur-js">Zu Ihrem Business passende Funktionen sind vorgeschlagen und lassen sich abwählen.</p>
            <p class="feld-hinweis konfig-regel" hidden>Zahlungen brauchen mindestens Sicherheitsstufe 4, der Regler geht deshalb nicht darunter.</p>`],
];
// Mini-Seite im Gerät: eine echte kleine Website, die Business, Farbe, Schrift, Stufen und Funktionen sofort übernimmt.
// Texte je Business aus seite.json (branchen[].satz/lead/knopf), Funktionen als echte Bausteine (nur sichtbar, wenn gewählt).
const nb = (feld) => K.branchen.map((b) => `<span class="nach-branche nach-branche--${b.id}">${esc(b[feld])}</span>`).join('');
const miniSeite = `            <p class="vorschau-kopf"><span class="vorschau-logo"><span class="vorschau-zeichen"></span>${nb('muster')}</span><span class="vorschau-nav">${K.muster_nav.map((t) => `<i>${esc(t)}</i>`).join('')}</span></p>
            <p class="vorschau-ueber">${nb('name')}</p>
            <p class="vorschau-titel">${nb('satz')}</p>
            <p class="vorschau-lead">${nb('lead')}</p>
            <p class="vorschau-knoepfe"><span class="vorschau-knopf">${nb('knopf')}</span><span class="vorschau-knopf vorschau-knopf--zweit">Anrufen</span></p>
            <p class="vorschau-bild"><span class="vorschau-ring"></span><span class="vorschau-bild-text">Ihr Foto</span><span class="vb vb--film vorschau-play">▶ Film</span><span class="vb vb--dreid vorschau-wuerfel"><i></i><i></i><i></i></span></p>
            <div class="vorschau-bausteine">
              <p class="vb vb--termin mini-karte"><span class="mini-titel">Nächster freier Termin</span><span class="mini-chips"><i>Di 9:30</i><i>Di 16:00</i><i>Mi 8:15</i></span></p>
              <p class="vb vb--speisekarte mini-karte"><span class="mini-titel">Heute auf der Karte</span><span class="mini-zeile">Linsensuppe <b>6,50</b></span><span class="mini-zeile">Ofengemüse <b>12,90</b></span></p>
              <p class="vb vb--galerie mini-galerie"><i></i><i></i><i></i></p>
              <p class="vb vb--formular mini-karte"><span class="mini-titel">Anfrage</span><span class="mini-feld">Name</span><span class="mini-feld">Ihre Nachricht</span></p>
              <p class="vb vb--zahlung mini-karte mini-karte--zeile"><span class="mini-titel">Gutschein kaufen</span><span class="mini-schloss">sicher bezahlen</span></p>
            </div>
            <p class="vorschau-siegel"><span class="siegel siegel--schutz">Schutz <b>2</b>/5</span><span class="siegel siegel--betreuung">Betreuung <b>2</b>/5</span></p>`;
const konfig = `<section class="abschnitt konfig" id="konfigurator" aria-labelledby="t-konfig">
  <div class="huelle">
    <div class="kopfzeile">
      ${ueber('Konfigurator')}
      <h2 id="t-konfig" class="einblenden">Ihr eigener <em>Website-Generator</em>.</h2>
      <p class="einblenden">Business, Farbe, Schrift, dann jeden Bereich von 1 bis 5.</p>
    </div>
    <div class="generator">
      <div class="gen-reiter nur-js" role="tablist" aria-label="Schritte des Generators">
${SCHRITTE.map(([, kurz], i) => `        <button class="gen-tab" type="button" role="tab" id="gt-${i + 1}" aria-controls="gs-${i + 1}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''}><span class="gen-tab-nr">${i + 1}</span><span class="gen-tab-name">${kurz}</span></button>`).join('\n')}
      </div>
      <div class="konfig-vorschau" aria-hidden="true">
        <div class="vorschau-geraet">
          <div class="vorschau-seite">
${miniSeite}
          </div>
        </div>
        <div class="einstufung nur-js">
          <p class="einstufung-kopf"><span>Ihre Einstufung</span><span class="einstufung-summe"></span></p>
${K.stufen.map((st) => `          <p class="einstufung-reihe" data-stufe="${st.id}" data-wert="${st.start}"><span>${esc(st.name)}</span><span class="punkte">${'<i></i>'.repeat(5)}</span></p>`).join('\n')}
        </div>
      </div>
      <div class="gen-bereich"${pr(P.stufen)}>
        <div class="gen-schritte">
${SCHRITTE.map(([titel, , inhalt, klasse], i) => feld(i + 1, titel, inhalt, klasse)).join('\n')}
        </div>
        <div class="gen-steuer nur-js">
          <button class="knopf zweit gen-zurueck" type="button">Zurück</button>
          <p class="gen-stand"><span class="gen-stand-text">1 von ${SCHRITTE.length}</span><span class="gen-balken"><span></span></span></p>
          <button class="knopf gen-weiter" type="button">Weiter ${pfeil}</button>
        </div>
        <label class="ganz-schalter nur-js"><input type="checkbox" id="k-ganz"><span class="ganz-knopf" aria-hidden="true"></span><span>Farbe und Schrift auf diese ganze Seite anwenden</span></label>
      </div>
    </div>
    <div class="konfig-fuss">
      <p class="konfig-zusammen nur-js" aria-live="polite"></p>
      <p class="konfig-preis"${pr(P.konfigurator)}>Preis: nach dem ersten Gespräch, jede Position mit ihrer Stufe und ihrem Grund</p>
      <a class="knopf" href="#kontakt">Mit dieser Einstufung anfragen ${pfeil}</a>
    </div>
  </div>
</section>`;

const B = S.betreuung;
const betreuung = `<section class="abschnitt betreuung" id="betreuung" aria-labelledby="t-betreuung">
  <div class="huelle">
    <div class="kopfzeile">
      ${ueber('Preis und Betreuung')}
      <h2 id="t-betreuung" class="einblenden">Die Seite einmal. Die Betreuung <em>nach Wahl</em>.</h2>
    </div>
    <div class="bet-paar">
      <section class="bet-karte einblenden" aria-labelledby="b-seite">
        <h3 id="b-seite">${esc(B.seite.titel)}</h3>
        <p>${esc(B.seite.text)}</p>
        <ul class="bet-liste">
${(B.seite.enthalten || []).map((w) => `          <li>${esc(w)}</li>`).join('\n')}
        </ul>
        <p class="preis"><span class="preis-wert"${pr(P.preis_website)}>Preis auf Anfrage</span></p>
      </section>
      <section class="bet-karte bet-karte--abo einblenden" aria-labelledby="b-abo">
        <h3 id="b-abo">${esc(B.abo.titel)}</h3>
        <p>${esc(B.abo.text)}</p>
        <ul class="bet-wahl">
${B.abo.wahl.map((w) => `          <li>${esc(w)}</li>`).join('\n')}
        </ul>
        <p class="bet-hinweis">${esc(B.abo.hinweis)}</p>
        <p class="preis"><span class="preis-wert"${pr(P.preis_abo)}>Preis auf Anfrage</span></p>
      </section>
    </div>
  </div>
</section>`;

const kontakt = `<section class="abschnitt kontakt" id="kontakt" aria-labelledby="t-kontakt">
  <div class="huelle kontakt-raster">
    <div class="kontakt-text">
      ${ueber('Kontakt')}
      <h2 id="t-kontakt" class="einblenden">Erzählen Sie mir von Ihrem <em>Betrieb</em>.</h2>
      <p class="einblenden">Ein paar Sätze reichen. Ich melde mich mit einem Vorschlag.</p>
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
  titel: `${S.studio} – Websites für Praxen und Betriebe`,
  beschreibung: 'Schnelle Websites ohne Tracking, gebaut für das Handy, auf Wunsch betreut. Vier Arbeiten: Physiotherapie, Motion-Studio, Uhrmacherei, Restaurant.',
  inhalt: [held, arbeiten, konfig, betreuung, kontakt].join('\n\n'),
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
