// Bausteine: erzeugte Dateien aktuell, Demos halten die CSP ein, Marke nur über Variablen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { erzeuge, auswahlAus } from '../bausteine/einbauen.mjs';

const WURZEL = new URL('../', import.meta.url).pathname;
const BAU = join(WURZEL, 'bausteine');
const csp = readFileSync(join(WURZEL, 'public/_headers'), 'utf8').match(/Content-Security-Policy: (.+)/)[1];
const demos = ['index.html', ...readdirSync(BAU).filter((d) => statSync(join(BAU, d)).isDirectory())
  .flatMap((d) => readdirSync(join(BAU, d)).filter((f) => f.endsWith('.html')).map((f) => join(d, f)))];

test('public/css/bausteine.css und public/js/bausteine.js sind aktuell (node bausteine/einbauen.mjs)', () => {
  const css = join(WURZEL, 'public/css/bausteine.css');
  if (!existsSync(css)) return;
  const soll = erzeuge(auswahlAus(css));
  assert.equal(readFileSync(css, 'utf8'), soll.css, 'bausteine.css veraltet → node bausteine/einbauen.mjs');
  assert.equal(readFileSync(join(WURZEL, 'public/js/bausteine.js'), 'utf8'), soll.js, 'bausteine.js veraltet → node bausteine/einbauen.mjs');
});

test('Baustein-Demos: keine Inline-Stile, Inline-Skripte nur per Hash, nichts Fremdes', () => {
  for (const d of demos) {
    const t = readFileSync(join(BAU, d), 'utf8');
    assert.doesNotMatch(t, /\sstyle="|\son[a-z]+="|<iframe|https?:\/\/(?!www\.w3\.org)[^"]*\.(js|css|woff2)/, `${d}: verstößt gegen die CSP-Regeln`);
    for (const [, code] of t.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
      assert.ok(csp.includes(`'sha256-${createHash('sha256').update(code).digest('base64')}'`), `${d}: Inline-Skript ohne Hash`);
    }
  }
});

test('Stil- und Baustein-CSS nutzen nur Marken-Variablen (keine Farbwerte, keine fremden Variablen)', () => {
  const erlaubt = /^--(_[a-z-]+|fortschritt|kino-(grund|text|leise|akzent)|werk-(hell|laut|edel|urfa)|muster-[a-z-]+|v-[a-z]+|farbe-(grund|flaeche|text|leise|linie|akzent|auf-akzent)|schrift-(display|text)|radius-(klein|gross)|tempo-(kurz|mittel|lang)|kurve-(standard|sanft|schliessen)|abstand-abschnitt)$/;
  const dateien = [join(WURZEL, 'public/css/stil.css'), ...readdirSync(BAU).map((d) => join(BAU, d, `${d}.css`)).filter(existsSync)];
  for (const f of dateien) {
    const t = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    assert.doesNotMatch(t, /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i, `${f}: fester Farbwert – gehört nach marke.css`);
    for (const [, a, b] of t.matchAll(/var\((--[\w-]+)|(?:^|[{;])\s*(--[\w-]+)\s*:/gm)) assert.match(a || b, erlaubt, `${f}: unbekannte Variable ${a || b}`);
  }
});
