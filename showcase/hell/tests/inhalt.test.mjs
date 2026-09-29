// Showcase-Regeln: Seiten sind aktuell gebaut, jede Seite ist als Demo gekennzeichnet, Erfundenes ist markiert,
// Schriften sind lokal und die Marke steckt in einer Datei.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdtempSync, cpSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const WURZEL = new URL('../', import.meta.url).pathname;
const PUB = join(WURZEL, 'public');
const seiten = readdirSync(PUB).filter((f) => f.endsWith('.html')).map((f) => [f, readFileSync(join(PUB, f), 'utf8')]);
const I = JSON.parse(readFileSync(join(WURZEL, 'inhalt.json'), 'utf8'));

test('HTML ist aus inhalt.json gebaut und aktuell', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'lotlinie-'));
  cpSync(join(WURZEL, 'bauen.mjs'), join(tmp, 'bauen.mjs')); cpSync(join(WURZEL, 'inhalt.json'), join(tmp, 'inhalt.json'));
  cpSync(PUB, join(tmp, 'public'), { recursive: true });
  execFileSync(process.execPath, [join(tmp, 'bauen.mjs')], { env: { ...process.env, SCHEMA: '' } });
  for (const [f, t] of seiten) assert.equal(readFileSync(join(tmp, 'public', f), 'utf8'), t, `${f} ist veraltet: node bauen.mjs`);
  rmSync(tmp, { recursive: true });
});

test('Jede Seite ist als Demo gekennzeichnet (Band oben und Fuß)', () => {
  for (const [f, t] of seiten) {
    assert.match(t, /class="demo-band"/, `${f}: Demo-Band fehlt`);
    assert.match(t, /class="fuss-demo"/, `${f}: Demo-Hinweis im Fuß fehlt`);
  }
});

test('Adresse, Telefon und Termin-Link sind markiert und offensichtlich ausgedacht', () => {
  assert.match(I.praxis.plz_ort, /^00000 /); assert.match(I.praxis.telefon, /^0000 /); assert.match(I.praxis.mail, /\.example$/);
  for (const [f, t] of seiten) {
    for (const m of t.matchAll(/<a [^>]*href="(tel:[^"]+|https:\/\/cal\.com[^"]*)"[^>]*>/g)) {
      const umgebung = t.slice(Math.max(0, m.index - 400), m.index + m[0].length);
      assert.ok(/data-pruefen=/.test(m[0]) || /data-pruefen=[^>]*>[^<]*(<[^/][^>]*>[^<]*)*$/.test(umgebung) || /<(address|dl|div|li|p)[^>]*data-pruefen/.test(umgebung), `${f}: ${m[1]} ohne data-pruefen`);
    }
  }
});

test('Schriften nur lokal, höchstens drei Vorlade-Dateien, alle mit crossorigin', () => {
  for (const [f, t] of seiten) {
    const pre = [...t.matchAll(/<link rel="preload"[^>]*>/g)].map((m) => m[0]);
    assert.ok(pre.length <= 3, `${f}: ${pre.length} Preloads`);
    for (const p of pre) assert.match(p, /crossorigin/, `${f}: Preload ohne crossorigin`);
  }
  const marke = readFileSync(join(PUB, 'css/marke.css'), 'utf8');
  assert.doesNotMatch(marke, /https?:\/\//, 'marke.css lädt fremde Schriften');
});

test('Marke in einer Datei: stil.css nutzt keine eigenen Farbwerte', () => {
  const marke = readFileSync(join(PUB, 'css/marke.css'), 'utf8');
  for (const v of ['--farbe-grund', '--farbe-flaeche', '--farbe-text', '--farbe-leise', '--farbe-linie', '--farbe-akzent', '--farbe-auf-akzent',
    '--schrift-display', '--schrift-text', '--radius-klein', '--radius-gross', '--tempo-kurz', '--tempo-mittel', '--tempo-lang',
    '--kurve-standard', '--kurve-sanft', '--kurve-schliessen', '--abstand-abschnitt']) assert.ok(marke.includes(`${v}:`), `marke.css: ${v} fehlt`);
  assert.match(marke, /\[data-schema="salbei"\]/, 'zweites Schema fehlt');
  const stil = readFileSync(join(PUB, 'css/stil.css'), 'utf8').replace(/Prüfmodus \(#pruefen\)[\s\S]*$/, '');
  const hex = stil.match(/#[0-9a-f]{3,8}\b/gi) || [];
  assert.deepEqual(hex, [], `stil.css enthält feste Farben: ${hex.join(', ')}`);
});

// JSON-LD darf nichts behaupten, was nicht sichtbar auf der Seite steht (Fremdprüfung Stufe 5).
const sichtbarerText = (html) => html.replace(/<head>[\s\S]*?<\/head>/, '').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<wbr>/g, '')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ');
const OHNE_TEXTPRUEFUNG = new Set(['@context', '@type', '@id', 'url', 'image', 'openingHours', 'price', 'priceCurrency']);
function ldPruefen(html, datei, typ) {
  const bloecke = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  assert.equal(bloecke.length, 1, `${datei}: genau ein JSON-LD-Block erwartet`);
  const text = sichtbarerText(html), ohneLeer = text.replace(/\s/g, '');
  const typen = [];
  (function lauf(o, schluessel) {
    if (Array.isArray(o)) return o.forEach((x) => lauf(x, schluessel));
    if (o && typeof o === 'object') return Object.entries(o).forEach(([k, v]) => { if (k === '@type') typen.push(v); lauf(v, k); });
    if (schluessel === 'price') return assert.ok(ohneLeer.includes(`${o}€`), `${datei}: Preis ${o} € steht nicht auf der Seite`);
    if (OHNE_TEXTPRUEFUNG.has(schluessel)) return;
    for (const satz of String(o).split(/(?<=\.)\s+/)) assert.ok(text.includes(satz), `${datei}: JSON-LD „${satz}“ steht nicht sichtbar auf der Seite`);
  })(bloecke[0]);
  for (const t of [].concat(typ)) assert.ok(typen.includes(t), `${datei}: JSON-LD ohne @type ${t}`);
  assert.match(JSON.stringify(bloecke[0]), /Demo|ausgedacht/, `${datei}: JSON-LD nennt die Demo nicht`);
}

test('JSON-LD (Physiotherapy) auf der Startseite, nur aus sichtbaren Angaben', () => {
  const [, index] = seiten.find(([f]) => f === 'index.html');
  ldPruefen(index, 'index.html', 'Physiotherapy');
  for (const [f, t] of seiten) if (f !== 'index.html') assert.doesNotMatch(t, /ld\+json/, `${f}: JSON-LD nur auf der Startseite`);
});
