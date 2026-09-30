// Strukturierte Daten der Startseite: nur sichtbare Angaben.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

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
}

test('JSON-LD (Store + Product L-40) auf der Startseite, nur aus sichtbaren Angaben', () => {
  const html = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
  ldPruefen(html, 'index.html', ['Store', 'Product', 'Offer']);
});
