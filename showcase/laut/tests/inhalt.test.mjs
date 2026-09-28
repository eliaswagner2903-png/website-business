// Inhalt und Kennzeichnung: gebaute Seiten aktuell, überall als Demo erkennbar, ausgedachte Daten markiert.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { seiten } from '../bauen.mjs';

const PUB = new URL('../public/', import.meta.url);
const gebaut = seiten();

test('public/*.html entspricht bauen.mjs + inhalt.mjs (npm run bauen vergessen?)', () => {
  const vorhanden = readdirSync(PUB).filter((f) => f.endsWith('.html')).sort();
  assert.deepEqual(vorhanden, Object.keys(gebaut).sort(), 'Seitenliste weicht ab');
  for (const [f, html] of Object.entries(gebaut)) assert.equal(readFileSync(new URL(f, PUB), 'utf8'), html, `${f} ist veraltet`);
});

test('Jede Seite ist als Demo gekennzeichnet (Band oben und Fuß)', () => {
  for (const [f, html] of Object.entries(gebaut)) {
    assert.match(html, /class="demo-band"[^]*Demo-Seite – ausgedachtes Studio/, `${f}: Demo-Band fehlt`);
    assert.match(html, /class="fuss-demo"/, `${f}: Demo-Hinweis im Fuß fehlt`);
  }
});

test('Ausgedachte Kontaktdaten sind markiert und offensichtlich fiktiv', () => {
  for (const [f, html] of Object.entries(gebaut)) {
    for (const m of html.matchAll(/<a[^>]+href="(?:tel|mailto):[^"]*"[^>]*>/g)) assert.match(m[0], /data-pruefen=/, `${f}: ${m[0]} ohne data-pruefen`);
    for (const m of html.matchAll(/mailto:([^"?]+)/g)) assert.match(m[1], /\.example$/, `${f}: E-Mail nicht auf .example`);
  }
});

test('Genau eine H1 pro Seite, keine Pfeil-Zeichen außerhalb der Schrift', () => {
  for (const [f, html] of Object.entries(gebaut)) {
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${f}: H1-Anzahl`);
    assert.doesNotMatch(html.replace(/<[^>]+>/g, ''), /[→←↗]/, `${f}: Pfeilzeichen (nicht in der Schrift) – SVG-Pfeil nutzen`);
  }
});
