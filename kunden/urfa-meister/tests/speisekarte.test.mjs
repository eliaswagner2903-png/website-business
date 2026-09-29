// Preisabgleich (Beweis): Jede Position der neuen Speisekarte stimmt exakt mit der maßgeblichen Karte
// kunden/urfa-sofrasi/public/speisekarte.htm überein – Nummer, Name, Kennzeichnung, Preis, Menge, Beschreibung,
// Reihenfolge und Prüfhinweise. Dazu: die Preise der Startseite („ab 50,00 €“) folgen aus der Karte.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const hier = (p) => new URL(p, import.meta.url);
const QUELLE = hier('../../urfa-sofrasi/public/speisekarte.htm');
const NEU = hier('../public/speisekarte.htm');
const K = JSON.parse(readFileSync(hier('../inhalt/speisekarte.json'), 'utf8'));
const S = JSON.parse(readFileSync(hier('../inhalt/seite.json'), 'utf8'));

const text = (s = '') => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
// Liest alle Positionen einer Speisekarten-Seite, egal welche Klassennamen die Variante nutzt.
function positionen(html) {
  const re = /<li class="(?:menu-item|gericht)"([^>]*)><span class="nr">(\d+)<\/span><span class="name"><span[^>]*>(.*?)<\/span>(?:<sup[^>]*>(.*?)<\/sup>)?<\/span><span class="punkte"[^>]*><\/span><span class="(?:price|preis)">([\d,]+)(?:&nbsp;| )€(?:<span class="(?:size|menge)">(.*?)<\/span>)?<\/span>(?:<span class="de">(.*?)<\/span>)?<\/li>/g;
  return [...html.matchAll(re)].map(([, attr, nr, name, kennz = '', preis, menge = '', de = '']) => ({
    nr, name: text(name), kennz, preis, menge, de: text(de), pruefen: /data-pruefen=/.test(attr),
  }));
}

test('Quelle vorhanden (kunden/urfa-sofrasi bleibt die maßgebliche Karte)', () => {
  assert.ok(existsSync(QUELLE), 'kunden/urfa-sofrasi/public/speisekarte.htm fehlt');
});

test('Preisabgleich: alle Positionen identisch mit kunden/urfa-sofrasi (90 von 90)', () => {
  const alt = positionen(readFileSync(QUELLE, 'utf8'));
  const neu = positionen(readFileSync(NEU, 'utf8'));
  assert.equal(alt.length, 90, `Quelle: ${alt.length} Positionen gelesen`);
  assert.equal(neu.length, alt.length, `neue Karte: ${neu.length} Positionen`);
  for (let i = 0; i < alt.length; i++) assert.deepEqual(neu[i], alt[i], `Position ${alt[i].nr} weicht ab`);
});

test('JSON-Daten entsprechen der Quelle (Preise nicht angefasst)', () => {
  const alt = positionen(readFileSync(QUELLE, 'utf8'));
  const json = K.kategorien.flatMap((k) => k.gerichte);
  assert.deepEqual(json.map((g) => `${g.nr}|${g.preis}|${g.menge || ''}`), alt.map((a) => `${a.nr}|${a.preis}|${a.menge}`));
});

test('Startseite: Preise der beliebten Gerichte folgen aus der Karte', () => {
  const p = (nr) => K.kategorien.flatMap((k) => k.gerichte).find((g) => g.nr === nr).preis;
  const min = (...nr) => nr.map(p).sort((a, b) => parseFloat(a.replace(',', '.')) - parseFloat(b.replace(',', '.')))[0];
  const soll = {
    'Urfa Sofrası': `ab ${min('11', '12', '13')} €`,
    'Karışık Izgara': `${p('01')} €`,
    'Adana & Urfa Kebap': p('02') === p('03') ? `je ${p('02')} €` : null,
    Döner: `ab ${min('23', '24', '25', '26', '27', '28', '29', '31', '32', '33', '34', '35')} €`,
    'İskender': `${p('30')} €`,
    'Pide & Lahmacun': `ab ${min('40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50')} €`,
    Künefe: `ab ${min('77', '78')} €`,
  };
  for (const [name, , , preis] of S.tafel) assert.equal(preis, soll[name], `${name}: ${preis} ≠ ${soll[name]}`);
  const start = readFileSync(hier('../public/index.html'), 'utf8');
  for (const [, , , preis] of S.tafel) assert.ok(start.includes(preis.replace(' €', '&nbsp;€')), `Startseite zeigt ${preis} nicht`);
});

test('Jede Kategorie der Chip-Leiste hat ein Sprungziel', () => {
  const t = readFileSync(NEU, 'utf8');
  for (const [, id] of t.matchAll(/<nav class="chips"[\s\S]*?<\/nav>/g).next().value[0].matchAll(/href="#([\w-]+)"/g)) {
    assert.match(t, new RegExp(`<section class="kat" id="${id}"`), `Sprungziel #${id} fehlt`);
  }
});
