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
