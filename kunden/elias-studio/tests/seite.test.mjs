// Regeln der Portfolio-Seite: HTML ist aktuell gebaut, alle persönlichen Angaben sind Platzhalter mit data-pruefen,
// Musterseiten ehrlich gekennzeichnet, nur fiktive Marken, Preise nicht erfunden, Bilder vorhanden, Schriften lokal.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdtempSync, cpSync, rmSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const WURZEL = new URL('../', import.meta.url).pathname;
const PUB = join(WURZEL, 'public');
const seiten = readdirSync(PUB).filter((f) => /\.html$/.test(f)).map((f) => [f, readFileSync(join(PUB, f), 'utf8')]);
const alle = Object.fromEntries(seiten);
const S = JSON.parse(readFileSync(join(WURZEL, 'inhalt/seite.json'), 'utf8'));
const start = alle['index.html'];
const markiert = (grund) => `data-pruefen="${grund.replace(/"/g, '&quot;')}"`;
const re = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('HTML ist aus inhalt/ gebaut und aktuell (node bauen.mjs)', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'portfolio-'));
  for (const d of ['bauen.mjs', 'inhalt']) cpSync(join(WURZEL, d), join(tmp, d), { recursive: true });
  cpSync(PUB, join(tmp, 'public'), { recursive: true });
  execFileSync(process.execPath, [join(tmp, 'bauen.mjs')], { env: { ...process.env, SCHEMA: '' } });
  for (const [f, t] of seiten) assert.equal(readFileSync(join(tmp, 'public', f), 'utf8'), t, `${f} ist veraltet: node bauen.mjs`);
  rmSync(tmp, { recursive: true });
});

test('Genau eine H1 pro Seite, lang="de"', () => {
  for (const [f, t] of seiten) {
    assert.equal((t.match(/<h1[\s>]/g) || []).length, 1, `${f}: H1`);
    assert.match(t, /<html lang="de"/, `${f}: lang`);
  }
});

test('Persönliche Angaben sind Platzhalter mit data-pruefen – nichts erfunden', () => {
  const P = S.pruefen;
  for (const k of ['studio', 'ort', 'telefon', 'email', 'preis_website', 'preis_abo', 'formular']) {
    if (!P[k]) continue; // von Elias bestätigte Angabe (Ort, Telefon entfällt)
    assert.ok(start.includes(markiert(P[k])), `Startseite: ${k} nicht markiert`);
  }
  // jeder sichtbare tel:/mailto:-Link trägt die Markierung
  for (const [f, t] of seiten) {
    for (const [a] of t.matchAll(/<a [^>]*href="(?:tel|mailto):[^"]*"[^>]*>/g)) assert.match(a, /data-pruefen=/, `${f}: Kontakt-Link ohne Markierung: ${a}`);
  }
  assert.ok(start.includes(`${markiert(P.studio)}>${S.studio}<`), 'Arbeitstitel nicht sichtbar markiert');
  for (const f of ['impressum.html', 'datenschutz.html']) assert.match(alle[f], /class="platzhalter" data-pruefen="Rechtstext nicht erfinden/, `${f}: kein Platzhalter`);
});

test('Preise: nur die von Elias gesetzten Beträge (1.490 €, 75 €), markiert', () => {
  const erlaubt = /^(?:1\.490|75)$/;
  for (const [f, t] of seiten) for (const [, n] of t.matchAll(/(\d[\d.]*)\s*(?:&nbsp;)?(?:€|EUR|Euro)/g)) assert.match(n, erlaubt, `${f}: nicht gesetzter Preis ${n}`);
  assert.match(start, new RegExp(`${re(markiert(S.pruefen.preis_abo))}>ab 75`), 'Abo-Preis: markierte Angabe');
  assert.match(start, new RegExp(`${re(markiert(S.pruefen.preis_website))}>ab 1\\.490`), 'Website-Preis: markierte Angabe');
});

test('Arbeiten: fünf Musterseiten (nur fiktive Marken), Vorschaubilder und Messwerte vorhanden', () => {
  for (const a of S.arbeiten) {
    assert.match(start, new RegExp(`id="arbeit-${a.id}"`), `${a.id}: fehlt`);
    for (const art of ['desktop', 'handy']) {
      for (const typ of ['avif', 'webp']) {
        const f = join(PUB, 'medien', `arbeit-${a.id}-${art}-lang-${art === 'desktop' ? 800 : 320}.${typ}`);
        assert.ok(existsSync(f), `${f} fehlt`);
        assert.ok(statSync(f).size < 120 * 1024, `${f} zu groß`);
      }
    }
    if (a.werte) assert.ok(a.werte.perf >= 95 && a.werte.kb > 0, `${a.id}: Messwerte fehlen`);
    else assert.equal(a.id, 'klarwerk', `${a.id}: Messwerte fehlen (nur Klarwerk ist unvermessen)`);
  }
  for (const n of ['hell', 'laut', 'edel', 'glut', 'klarwerk']) assert.match(start, new RegExp(`id="arbeit-${n}"[\\s\\S]*?Musterseite[ ·<]`), `${n}: nicht als Musterseite benannt`);
  // Nur fiktive Firmen: keine echten Namen, Orte oder Telefonnummern aus Kundenprojekten, weder im Text noch in Dateinamen
  const echt = /urfa|sofrasi|\bOSG\b|ümit|uemit|hairstyle|mühlbach|7161/i;
  for (const [f, t] of seiten) assert.doesNotMatch(t, echt, `${f}: echter Firmenbezug`);
  assert.doesNotMatch(JSON.stringify(S), echt, 'seite.json: echter Firmenbezug');
  // Eislingen ist Elias’ eigener Ort (04.10.), darf aber nie in den Texten der Arbeiten stehen
  assert.doesNotMatch(JSON.stringify(S.arbeiten), /eislingen/i, 'Eislingen in den Arbeiten');
  assert.deepEqual(readdirSync(join(PUB, 'medien')).filter((f) => echt.test(f)), [], 'echter Firmenname in Dateinamen');
  assert.match(start, /fetchpriority="high"|loading="lazy"/);
  // Erster Bildschirm ist der Hero „Lichtkegel“: die H1 (reiner Text) ist das LCP-Element, das Mosaik ist Dekor und darf ihr nie
  // Bandbreite mit Vorrang nehmen (kein fetchpriority="high", nur Bilder mit alt="" in einem aria-hidden-Rahmen).
  const held = start.match(/<section class="held"[\s\S]*?<\/section>/)[0];
  assert.match(held, /<h1 id="titel"><span>Gebaut\.<\/span> <span>Gemessen\.<\/span> <span>Betreut\.<\/span><\/h1>/, 'H1 nicht im Hero');
  assert.match(held, /<div class="held-mosaik" aria-hidden="true">/, 'Mosaik nicht aria-hidden');
  assert.doesNotMatch(held, /fetchpriority/, 'Mosaikbild mit Vorrang');
  for (const [img] of held.matchAll(/<img [^>]*>/g)) assert.match(img, /alt="" decoding="async"/, `Mosaikbild ohne alt="" oder decoding: ${img}`);
  assert.ok(held.match(/<img /g).length <= 3, 'Mosaik zu groß (höchstens drei Bilder)');
  assert.match(held, /href="#arbeiten">Arbeiten ansehen/, 'Hauptknopf fehlt');
  assert.match(held, /class="knopf zweit" href="#kontakt">Projekt anfragen/, 'zweiter Knopf fehlt');
  // erste Arbeit auf der Bühne nicht lazy, Links nur zu den drei Musterseiten, alle mit Vorschau-Link
  for (const a of S.arbeiten) {
    const werk = start.match(new RegExp(`<article class="werk werk--${a.id}"[\\s\\S]*?</article>`))[0];
    assert.match(werk, new RegExp(`href="${re(a.link)}" target="_blank" rel="noopener" ${re(markiert(S.pruefen.link))}`), `${a.id}: Link fehlt`);
  }
});

test('Formular: Honigtopf, POST an die eigene Function, Datenschutz-Hinweis', () => {
  assert.match(start, /<form class="formular" id="kontaktformular" method="post" action="\/api\/kontakt">/);
  assert.match(start, /name="firma_url"[^>]*tabindex="-1"/);
  assert.match(start, /href="\/datenschutz\.html">Datenschutz/);
  assert.match(readFileSync(join(WURZEL, 'functions/api/kontakt.js'), 'utf8'), /zurueck: '\/#kontakt'/);
});

test('Schriften lokal: höchstens drei Vorlade-Dateien mit crossorigin, nichts Fremdes, zweites Schema (P4)', () => {
  for (const [f, t] of seiten) {
    const pre = [...t.matchAll(/<link rel="preload"[^>]*as="font"[^>]*>/g)].map((m) => m[0]);
    assert.ok(pre.length <= 3, `${f}: ${pre.length} Schrift-Preloads`);
    for (const p of pre) { assert.match(p, /crossorigin/); assert.ok(existsSync(join(PUB, p.match(/href="\/([^"]+)"/)[1])), `${f}: ${p} fehlt`); }
    assert.doesNotMatch(t.replace(/<link rel="canonical"[^>]*>|<meta property="og:[^>]*>/g, ''), /<(link|script|img|source)[^>]+(href|src|srcset)="https?:/, `${f}: fremde Quelle`);
    for (const [, src] of t.matchAll(/(?:src|srcset)="(\/medien\/[^" ]+)/g)) assert.ok(existsSync(join(PUB, src)), `${f}: ${src} fehlt`);
  }
  const marke = readFileSync(join(PUB, 'css/marke.css'), 'utf8');
  assert.doesNotMatch(marke, /https?:\/\//);
  for (const s of ['graphit', 'kalk']) assert.match(marke, new RegExp(`\\[data-schema="${s}"\\]`), `Schema ${s} fehlt (P4)`);
  assert.doesNotMatch(marke, /kobalt/, 'altes Testschema kobalt');
});

test('Kein Stil-Konfigurator: Abschnitt, Auswahlfelder und Anker sind weg, Kontaktformular bleibt', async () => {
  assert.doesNotMatch(start, /id="stile"|href="#stile"|class="[^"]*(konfig|stil-karte|stil-raster)|name="(stil|farbe)"|kontakt-auswahl/);
  assert.equal(S.stile, undefined);
  assert.equal(S.stile_kopf, undefined);
  assert.equal(S.pruefen.stile, undefined);
  const mod = await import('../functions/api/kontakt.js');
  assert.equal(mod.konfigAuswahl, undefined);
  assert.equal(mod.STILE, undefined);
  assert.doesNotMatch(readFileSync(join(PUB, 'js/seite.js'), 'utf8'), /\.konfig|stil-karte|kontakt-auswahl/);
  assert.doesNotMatch(readFileSync(join(PUB, 'css/stil.css'), 'utf8'), /\.(stil-|konfig|farbfleck|schriftprobe|wahl|kontakt-auswahl)/);
  for (const n of ['name', 'email', 'nachricht', 'firma_url']) assert.match(start, new RegExp(`<form class="formular" id="kontaktformular"[\\s\\S]*name="${n}"`));
});

test('Kein Selbstbau und keine offene Preismechanik auf der Seite', () => {
  for (const [f, t] of seiten) {
    const sichtbar = t.replace(/<script[\s\S]*?<\/script>/g, '').replace(/ data-pruefen="[^"]*"/g, '');
    assert.doesNotMatch(sichtbar, /Konfigurator|Website-Generator|stuft jeden Bereich|offen gerechnet|offenen Formel|Jede Position|erhöht den Monatspreis|konfig-preis/i, `${f}: alter Wortlaut`);
    assert.doesNotMatch(sichtbar, /type="range"|class="generator|vorschau-seite|einstufung|role="tab" id="gt-|name="bausteine|name="branche|name="stufe_/, `${f}: Selbstbau-Bedienung`);
  }
  assert.doesNotMatch(readFileSync(join(PUB, 'js/seite.js'), 'utf8'), /generator|regler|branche|bausteine\[/i);
  assert.doesNotMatch(readFileSync(join(PUB, 'css/stil.css'), 'utf8'), /\.generator|\.regler|\.vorschau-|\.einstufung|\.gen-|stufen-liste/);
  assert.doesNotMatch(start, /href="#konfigurator"/);
});

test('Hero „Lichtkegel“: kein Film mehr, Kegel nur per Skript und CSS, still ohne JS und bei reduzierter Bewegung', () => {
  assert.doesNotMatch(start, /<video|kino|tisch-(film|anfang|ende)|werkbank-/, 'Rest des alten Kino-Heros');
  assert.doesNotMatch(readFileSync(join(PUB, '_headers'), 'utf8'), /media-src 'self' blob:/, 'blob: für den Film nicht mehr nötig');
  assert.match(start, /<script src="\/js\/held\.js" defer><\/script>/);
  const js = readFileSync(join(PUB, 'js/held.js'), 'utf8');
  assert.match(js, /prefers-reduced-motion: reduce/, 'held.js ignoriert „Bewegung reduzieren“ nicht');
  assert.match(js, /style\.setProperty\('--licht-x'/, 'Lichtposition nicht per setProperty');
  assert.doesNotMatch(js, /\.style\.(cssText|left|top|transform)|setAttribute\('style'|innerHTML/, 'held.js schreibt Inline-Stil am HTML vorbei');
  const css = readFileSync(join(PUB, 'css/stil.css'), 'utf8');
  assert.match(css, /\.held \{\s*--licht-x: 60%; --licht-y: 45%;/, 'feste Vorgabe des Kegels fehlt (Stand ohne JS)');
  // Mosaikbilder vorhanden und klein (Zeitkonto des ersten Bildschirms)
  for (const [, src] of start.match(/<section class="held"[\s\S]*?<\/section>/)[0].matchAll(/srcset="(\/medien\/[^" ]+)"/g)) assert.ok(statSync(join(PUB, src)).size < 40 * 1024, `${src} zu groß fürs Mosaik`);
});

test('Kein Schema-Schalter: Vorgabe „Mitternacht“, die Schemata „graphit“ und „kalk“ gibt es nur für Vorschauen', () => {
  for (const [f, t] of seiten) assert.doesNotMatch(t, /schema-knopf|oq-schema|localStorage|aria-pressed|data-schema=/, `${f}: Rest des Schemaschalters`);
  for (const d of ['js/seite.js', 'js/bausteine.js', 'css/stil.css', 'css/bausteine.css']) assert.doesNotMatch(readFileSync(join(PUB, d), 'utf8'), /schema-knopf|schema-zeichen|oq-schema|localStorage/, `${d}: Rest des Schemaschalters`);
  const marke = readFileSync(join(PUB, 'css/marke.css'), 'utf8');
  assert.match(marke, /--farbe-grund: #131826;/, 'Vorgabe ist nicht „Mitternacht“');
  assert.doesNotMatch(marke, /#0a0b0d/, 'altes Fast-Schwarz in marke.css');
  assert.doesNotMatch(marke, /data-schema="licht"|--gruen-|--kino-|--muster-/, 'alte Farbwelt in marke.css');
  assert.match(start, /<meta name="theme-color" content="#131826">/);
  assert.ok(existsSync(join(PUB, 'medien/og-startseite.jpg')), 'og:image fehlt');
  for (const [f, t] of seiten) assert.match(t, /og:image" content="[^"]*\/medien\/og-startseite\.jpg"/, `${f}: og:image`);
});

test('Kontrast WCAG AA in allen drei Schemata (Text, Nebentext, Akzent, Knöpfe ≥ 4,5 : 1)', () => {
  const marke = readFileSync(join(PUB, 'css/marke.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const block = (sel) => Object.fromEntries([...marke.match(new RegExp(`${re(sel)} \\{([^}]*)\\}`))[1].matchAll(/--(farbe-[\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const hell = (h) => { const n = parseInt(h.slice(1), 16); return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); };
  const k = (a, b) => { const [x, y] = [hell(a), hell(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const vorgabe = block(':root');
  for (const [name, sel] of [['mitternacht', null], ['graphit', ':root[data-schema="graphit"]'], ['kalk', ':root[data-schema="kalk"]']]) {
    const f = { ...vorgabe, ...(sel ? block(sel) : {}) };
    const paare = [['text', 'grund'], ['text', 'flaeche'], ['text', 'flaeche-hoch'], ['leise', 'grund'], ['leise', 'flaeche'], ['leise', 'flaeche-hoch'],
      ['akzent', 'grund'], ['akzent', 'flaeche-hoch'], ['auf-akzent', 'akzent'], ['grund', 'text'], ['fehler', 'flaeche']];
    for (const [v, h] of paare) assert.ok(k(f[`farbe-${v}`], f[`farbe-${h}`]) >= 4.5, `${name}: ${v} auf ${h} nur ${k(f[`farbe-${v}`], f[`farbe-${h}`]).toFixed(2)} : 1`);
  }
});

test('Leistungen als Bento: sechs Karten mit Schaubild (Dekor), echter Text im HTML, keine Platzierungsversprechen', () => {
  const sek = start.match(/<section class="abschnitt leistungen"[\s\S]*?<\/section>/)[0];
  const karten = [...sek.matchAll(/<li class="leist leist--(\w+) einblenden">([\s\S]*?)<\/li>\n/g)];
  assert.equal(karten.length, 6, 'sechs Leistungskarten');
  for (const [, id, inhalt] of karten) {
    assert.match(inhalt, new RegExp(`<div class="mini mini--${id}" aria-hidden="true">`), `${id}: Schaubild nicht aria-hidden`);
    assert.match(inhalt, /<div class="leist-text"><h3>[^<]+<\/h3><p>[^<]+<\/p><\/div>/, `${id}: Text fehlt`);
    assert.doesNotMatch(inhalt, /<img |Platz 1|#1\b|Top-?Platzierung|garantiert/i, `${id}: Bild oder Versprechen im Schaubild`);
  }
  for (const k of S.leistungen.karten) assert.ok(sek.includes(`<h3>${k.titel.replace(/&/g, '&amp;')}</h3>`), `${k.id}: Titel fehlt`);
  // Ablauf: Zeichnungen sind Dekor
  for (const [svg] of start.matchAll(/<svg class="schritt-bild[^>]*>/g)) assert.match(svg, /focusable="false"/);
  assert.match(start, /<span class="schritt-kopf" aria-hidden="true">/);
});

test('Arbeiten: Entscheidungssatz je Arbeit, neu formuliert und markiert', () => {
  for (const a of S.arbeiten) {
    assert.ok(a.entscheidung, `${a.id}: Entscheidungssatz fehlt`);
    const werk = start.match(new RegExp(`<article class="werk werk--${a.id}"[\\s\\S]*?</article>`))[0];
    assert.ok(werk.includes(`<p class="werk-entscheidung" ${markiert(S.pruefen.entscheidung)}>`), `${a.id}: Entscheidungssatz nicht markiert`);
  }
});
