// Inhalt und Kennzeichnung: gebaute Seiten aktuell, ausgedachte Daten markiert.
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

test('Kein sichtbares Demo-Band und kein Demo-Hinweis im Fuß', () => {
  for (const [f, html] of Object.entries(gebaut)) {
    assert.doesNotMatch(html, /class="(demo-band|fuss-demo|demo-band-marke)"/, `${f}: Demo-Kennzeichnung sichtbar`);
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

test('JSON-LD (Organization) auf der Startseite, nur aus sichtbaren Angaben', () => {
  ldPruefen(gebaut['index.html'], 'index.html', 'Organization');
});

test('Canonical auf jeder Seite, Sitemap aktuell und in robots.txt verlinkt', async () => {
  const { sitemap } = await import('../bauen.mjs');
  const karte = readFileSync(new URL('sitemap.xml', PUB), 'utf8');
  assert.equal(karte, sitemap(), 'sitemap.xml ist veraltet (npm run bauen)');
  for (const [f, html] of Object.entries(gebaut)) {
    const c = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
    assert.ok(c, `${f}: canonical fehlt`);
    assert.equal(c, `https://zwischenbild.example/${f === 'index.html' ? '' : f}`);
    if (f !== '404.html') assert.ok(karte.includes(`<loc>${c}</loc>`), `${f} fehlt in der Sitemap`);
  }
  assert.doesNotMatch(karte, /404/, '404 gehört nicht in die Sitemap');
  assert.match(readFileSync(new URL('robots.txt', PUB), 'utf8'), /^Sitemap: https:\/\/zwischenbild\.example\/sitemap\.xml$/m);
});

test('Handy: Menü-Knopf steht im Kopf (nicht nur in der Schnellleiste, die erst nach dem Scrollen kommt)', () => {
  for (const [f, html] of Object.entries(gebaut)) {
    const kopf = html.match(/<header class="kopf">[\s\S]*?<\/header>/)?.[0] ?? '';
    assert.match(kopf, /<button class="kopf-menue menue-knopf" type="button" aria-expanded="false" aria-controls="menue">/, `${f}: Menü-Knopf im Kopf fehlt`);
  }
});
