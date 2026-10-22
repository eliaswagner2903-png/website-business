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

test('Preise: kein Betrag auf der Seite (Elias 13.10.: Festpreis entsteht im Gespräch), Angaben markiert', () => {
  for (const [f, t] of seiten) assert.doesNotMatch(t, /\d[\d.]*\s*(?:&nbsp;)?(?:€|EUR|Euro)/, `${f}: Betrag sichtbar`);
  assert.match(start, new RegExp(`${re(markiert(S.pruefen.preis_website))}>Festpreis nach dem Gespräch<`), 'Website: markierte Angabe');
  assert.match(start, new RegExp(`${re(markiert(S.pruefen.preis_abo))}>Leistungen nach Ihrer Wahl<`), 'Betreuung: markierte Angabe');
});

test('Arbeiten: gezeigte Musterseiten (nur fiktive Marken), Vorschaubilder und Messwerte vorhanden', () => {
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
    else assert.fail(`${a.id}: Messwerte fehlen (gezeigte Arbeiten sind nachgemessen)`);
  }
  for (const a of S.arbeiten) assert.match(start, new RegExp(`id="arbeit-${a.id}"[\\s\\S]*?Musterseite[ ·<]`), `${a.id}: nicht als Musterseite benannt`);
  // Reihenfolge (Elias 06.10.): nicht mit dem hellen, kontrastreichen Lotlinie beginnen; ruhende Arbeiten stehen nicht auf der Seite
  assert.notEqual(S.arbeiten[0].id, 'hell', 'Die Arbeiten beginnen mit Lotlinie');
  const reihe = [...start.matchAll(/<article class="werk werk--(\w+)"/g)].map((m) => m[1]);
  assert.deepEqual(reihe, S.arbeiten.map((a) => a.id), 'Reihenfolge auf der Seite weicht von seite.json ab');
  for (const a of S.arbeiten_ruhend || []) assert.doesNotMatch(start, new RegExp(`id="arbeit-${a.id}"`), `${a.id}: ruhend, aber gezeigt`);
  // Nur fiktive Firmen: keine echten Namen, Orte oder Telefonnummern aus Kundenprojekten, weder im Text noch in Dateinamen
  const echt = /urfa|sofrasi|\bOSG\b|ümit|uemit|hairstyle|mühlbach|7161/i;
  for (const [f, t] of seiten) assert.doesNotMatch(t, echt, `${f}: echter Firmenbezug`);
  assert.doesNotMatch(JSON.stringify(S), echt, 'seite.json: echter Firmenbezug');
  // Eislingen ist Elias’ eigener Ort (04.10.), darf aber nie in den Texten der Arbeiten stehen
  assert.doesNotMatch(JSON.stringify(S.arbeiten), /eislingen/i, 'Eislingen in den Arbeiten');
  assert.deepEqual(readdirSync(join(PUB, 'medien')).filter((f) => echt.test(f)), [], 'echter Firmenname in Dateinamen');
  assert.match(start, /fetchpriority="high"|loading="lazy"/);
  // Erster Bildschirm ist der Hero (Umbau 22.10.): Name als Wortmarke, drei Musterseiten als Handy-Bilder, das erste ist das LCP-Element.
  const held = start.match(/<section class="held"[\s\S]*?<\/section>/)[0];
  assert.match(held, /<h1 id="titel"[^>]*><span class="wz wz--gross"><span class="wz-wagner">Wagner<\/span><span class="wz-seiten">Seiten<\/span><\/span><\/h1>/, 'H1 nicht im Hero');
  assert.match(held, /<p class="held-claim"[^>]*>Ihre Seite, <em>ruhig gemacht<\/em>\.<\/p>/, 'Aussage fehlt');
  assert.doesNotMatch(held, /held-mosaik|mosaik-|kapitaen-/, 'altes Hero-Bild');
  assert.equal((held.match(/<figure class="schau /g) || []).length, 3, 'drei Musterseiten im Hero');
  assert.equal((held.match(/fetchpriority="high"/g) || []).length, 1, 'Hero-Bild ohne Vorrang');
  assert.match(held, /class="knopf" href="#kontakt">Projekt besprechen/, 'Hauptknopf fehlt');
  assert.match(held, /class="knopf zweit" href="#arbeiten">Arbeiten ansehen/, 'zweiter Knopf fehlt');
  // erste Arbeit auf der Bühne nicht lazy, Links nur zu den drei Musterseiten, alle mit Vorschau-Link
  for (const a of S.arbeiten) {
    const werk = start.match(new RegExp(`<article class="werk werk--${a.id}"[\\s\\S]*?</article>`))[0];
    assert.match(werk, new RegExp(`href="${re(a.link)}" target="_blank" rel="noopener" data-teleport ${re(markiert(S.pruefen.link))}`), `${a.id}: Link fehlt`);
  }
});

test('Formular: Honigtopf, POST an die eigene Function, Datenschutz-Hinweis', () => {
  assert.match(start, /<form class="formular" id="kontaktformular" method="post" action="\/api\/kontakt">/);
  assert.match(start, /name="firma_url"[^>]*tabindex="-1"/);
  assert.match(start, /href="\/datenschutz\.html">Datenschutz/);
  assert.match(readFileSync(join(WURZEL, 'functions/api/kontakt.js'), 'utf8'), /zurueck: '\/#kontakt'/);
});

test('Schriften lokal: höchstens drei Vorlade-Dateien mit crossorigin, nichts Fremdes', () => {
  for (const [f, t] of seiten) {
    const pre = [...t.matchAll(/<link rel="preload"[^>]*as="font"[^>]*>/g)].map((m) => m[0]);
    assert.ok(pre.length <= 3, `${f}: ${pre.length} Schrift-Preloads`);
    for (const p of pre) { assert.match(p, /crossorigin/); assert.ok(existsSync(join(PUB, p.match(/href="\/([^"]+)"/)[1])), `${f}: ${p} fehlt`); }
    assert.doesNotMatch(t.replace(/<link rel="canonical"[^>]*>|<meta property="og:[^>]*>/g, ''), /<(link|script|img|source)[^>]+(href|src|srcset)="https?:/, `${f}: fremde Quelle`);
    for (const [, src] of t.matchAll(/(?:src|srcset)="(\/medien\/[^" ]+)/g)) assert.ok(existsSync(join(PUB, src)), `${f}: ${src} fehlt`);
  }
  const marke = readFileSync(join(PUB, 'css/marke.css'), 'utf8');
  assert.doesNotMatch(marke, /https?:\/\//);
  assert.match(marke, /inter\.woff2/);
  assert.match(marke, /inter-kursiv\.woff2/);
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

test('Hero: Wortmarke und drei Musterseiten, keine alten Bilder, Vorstellung und Seefahrt-Rest sind weg', () => {
  assert.doesNotMatch(start, /<video|held\.js|held-mosaik|held-karte|id="vorstellung"|vorstellung\.js|kompass|kapitaen-|Seekarte|Kajüte/i, 'Rest des alten Auftritts');
  const held = start.match(/<section class="held"[\s\S]*?<\/section>/)[0];
  for (const [, src] of held.matchAll(/(\/medien\/arbeit-[^" ,]+)/g)) {
    assert.ok(existsSync(join(PUB, src)), `${src} fehlt`);
    assert.ok(statSync(join(PUB, src)).size < 190 * 1024, `${src} zu groß`);
  }
  assert.ok(!existsSync(join(PUB, 'js/vorstellung.js')) && !existsSync(join(PUB, 'css/kapitaen.css')), 'alte Dateien noch da');
  const css = readFileSync(join(PUB, 'css/stil.css'), 'utf8') + readFileSync(join(PUB, 'css/auftritt.css'), 'utf8');
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test('Ein Design (Stil „Edel“: Creme, Grün, Anthrazit), kein Schema-Schalter, Vorschaubild vorhanden', () => {
  for (const [f, t] of seiten) assert.doesNotMatch(t, /schema-knopf|oq-schema|data-schema=/, `${f}: Rest des Schemaschalters`);
  const marke = readFileSync(join(PUB, 'css/marke.css'), 'utf8');
  assert.match(marke, /--farbe-grund: #f4efe3;/, 'Grund ist nicht Creme');
  assert.match(marke, /--farbe-akzent: #23703f;/, 'Akzent ist nicht Grün');
  assert.match(marke, /--dunkel-grund: #26292d;/, 'Kontaktblock ist nicht Anthrazit');
  assert.doesNotMatch(marke, /data-schema=/, 'alte Schemata in marke.css');
  assert.match(start, /<meta name="theme-color" content="#f4efe3">/);
  assert.ok(existsSync(join(PUB, 'medien/og-startseite.jpg')), 'og:image fehlt');
  for (const [f, t] of seiten) assert.match(t, /og:image" content="[^"]*\/medien\/og-startseite\.jpg"/, `${f}: og:image`);
});

test('Kontrast WCAG AA (Text, Nebentext, Akzent, Knöpfe ≥ 4,5 : 1)', () => {
  const marke = readFileSync(join(PUB, 'css/marke.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const f = Object.fromEntries([...marke.match(/:root \{([^}]*)\}/)[1].matchAll(/--(farbe-[\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const hell = (h) => { const n = parseInt(h.slice(1), 16); return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); };
  const k = (a, b) => { const [x, y] = [hell(a), hell(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const paare = [['text', 'grund'], ['text', 'flaeche'], ['text', 'flaeche-hoch'], ['leise', 'grund'], ['leise', 'flaeche'], ['leise', 'flaeche-hoch'],
    ['akzent', 'grund'], ['akzent', 'flaeche-hoch'], ['auf-akzent', 'akzent'], ['grund', 'text'], ['fehler', 'flaeche']];
  for (const [v, h] of paare) assert.ok(k(f[`farbe-${v}`], f[`farbe-${h}`]) >= 4.5, `${v} auf ${h} nur ${k(f[`farbe-${v}`], f[`farbe-${h}`]).toFixed(2)} : 1`);
});

test('Leistungen als Karten: sechs, nummeriert, Fachbegriff klein, keine Platzierungsversprechen', () => {
  const sek = start.match(/<section class="abschnitt leistungen"[\s\S]*?<\/section>/)[0];
  const karten = [...sek.matchAll(/<li class="plakette einblenden">([\s\S]*?)<\/li>\n/g)];
  assert.equal(karten.length, 6, 'sechs Leistungskarten');
  for (const [, inhalt] of karten) {
    assert.match(inhalt, /<p class="plakette-nr" aria-hidden="true">0\d<\/p>/, 'Nummer fehlt');
    assert.match(inhalt, /<h3>[^<]+<\/h3>\s*<p>[^<]+<\/p>\s*<p class="fachwort">Fachbegriff: [^<]+<\/p>/, 'Text fehlt');
    assert.doesNotMatch(inhalt, /<img |Platz 1|#1\b|Top-?Platzierung|garantiert/i, 'Bild oder Versprechen');
  }
  for (const k of S.leistungen.karten) assert.ok(sek.includes(`<h3>${k.titel.replace(/&/g, '&amp;')}</h3>`), `${k.id}: Titel fehlt`);
  // Ablauf: Etappen-Ziffern sind Dekor (die Liste zählt selbst), die Schritte echter Text
  assert.equal((start.match(/<span class="etappe" aria-hidden="true">/g) || []).length, S.ablauf.schritte.length);
  assert.doesNotMatch(start, /class="boje"|class="kurs-linie"/, 'alte Bojen');
});

test('Arbeiten: Entscheidungssatz je Arbeit, neu formuliert und markiert', () => {
  for (const a of S.arbeiten) {
    assert.ok(a.entscheidung, `${a.id}: Entscheidungssatz fehlt`);
    const werk = start.match(new RegExp(`<article class="werk werk--${a.id}"[\\s\\S]*?</article>`))[0];
    assert.ok(werk.includes(`<p class="werk-entscheidung" ${markiert(S.pruefen.entscheidung)}>`), `${a.id}: Entscheidungssatz nicht markiert`);
  }
});

test('Menü ohne Messskala, Leistungsnamen ohne Klammer-Kürzel, Wahlleistungen beschrieben', () => {
  const menue = readFileSync(join(WURZEL, 'bausteine/menue-kreis/menue-kreis.css'), 'utf8');
  assert.doesNotMatch(menue, /repeating-linear-gradient|counter\(nav/, 'Messskala oder Nummern im Handy-Menü');
  for (const [, , z] of S.nav) assert.ok(z, 'Menüeintrag ohne Zusatzzeile');
  for (const k of S.leistungen.karten) {
    assert.doesNotMatch(k.titel, /\(/, `${k.id}: Titel mit Klammer-Kürzel`);
    assert.ok(k.kurz, `${k.id}: Etikett fehlt`);
  }
  const wahl = start.match(/<ul class="bet-wahl"[\s\S]*?<\/ul>/)[0];
  assert.equal((wahl.match(/<li><strong>[^<]+<\/strong><span>[^<]+<\/span><\/li>/g) || []).length, S.betreuung.abo.wahl.length, 'Wahlleistung ohne Beschreibung');
  assert.match(wahl, new RegExp(re(markiert(S.pruefen.wahl))), 'Beschreibungen der Wahlleistungen nicht markiert');
});

test('Marke Wagner Seiten: Name, Domain und Mail stehen durchgehend, nichts vom alten Namen', () => {
  for (const [f, tx] of seiten) {
    assert.match(tx, /Wagner Seiten|class="wz-wagner">Wagner/, `${f}: Name fehlt`);
    assert.doesNotMatch(tx, /\[OQ\]|>OQ<|\bOQ\b|WEBWERKSTATT|Seitenkapit|seitenkapitaen/i, `${f}: alter Name`);
  }
  assert.match(start, /hallo@wagnerseiten\.de/);
  assert.match(start, /rel="canonical" href="https:\/\/www\.wagnerseiten\.de\/"/);
  assert.doesNotMatch(readFileSync(join(PUB, 'css/bausteine.css'), 'utf8'), /\[OQ\]/, 'Wasserzeichen im Menü');
});

test('Keine Vorstellungs-Überblendung mehr (der alte Film zeigt den alten Auftritt)', () => {
  for (const [f, tx] of seiten) assert.doesNotMatch(tx, /class="intro|data-vorstellung-oeffnen|intro-offen/, `${f}: Vorstellung noch da`);
});
