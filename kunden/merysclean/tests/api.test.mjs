import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { onRequestPost as kontakt, pruefeFelder, LEISTUNGEN, OBJEKTARTEN, RHYTHMEN, RUECKRUF } from '../functions/api/kontakt.js';
import { fehlerSeite } from '../functions/_lib/antwort.js';

const ENV = { SEITE_URL: 'https://merysclean.de' };
const VERSAND = { ...ENV, RESEND_API_KEY: 're_test', KONTAKT_AN: 'info@beispiel.invalid', KONTAKT_VON: 'web@beispiel.invalid' };
const echtesFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = echtesFetch; });

const GUT = { leistung: 'Unterhaltsreinigung', objektart: 'Büro oder Praxis', flaeche: '120', ort: '73033 Göppingen', rhythmus: 'Wöchentlich',
  rueckruf: 'Vormittags (8–12 Uhr)', name: 'Anna Muster', telefon: '07161 123456', email: 'anna@beispiel.invalid', nachricht: 'Bitte Rückruf.', datenschutz: 'ja' };
const anfrage = (felder, origin = ENV.SEITE_URL) => new Request('https://x/api/kontakt', { method: 'POST',
  headers: { Origin: origin, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(felder) });
const f = (o) => new URLSearchParams(o);

test('Felder: Honigtopf, Pflichtfelder, Listen, Einwilligung, Kopfzeilen-Einschleusung', () => {
  assert.ok(pruefeFelder(f(GUT)).daten);
  assert.equal(pruefeFelder(f({ ...GUT, firma_url: 'x' })).spam, true);
  assert.equal(pruefeFelder(f({ ...GUT, name: 'A\nBcc: x@y.de' })).spam, true);
  for (const k of ['leistung', 'objektart', 'ort', 'name', 'telefon', 'datenschutz']) assert.ok(pruefeFelder(f({ ...GUT, [k]: '' })).fehler, `${k} Pflicht`);
  assert.ok(pruefeFelder(f({ ...GUT, leistung: '<script>' })).fehler);
  assert.ok(pruefeFelder(f({ ...GUT, flaeche: 'groß' })).fehler);
  assert.ok(pruefeFelder(f({ ...GUT, telefon: 'ruf an!' })).fehler);
  assert.ok(pruefeFelder(f({ ...GUT, email: 'keine-mail' })).fehler);
  assert.ok(pruefeFelder(f({ ...GUT, email: '', flaeche: '' })).daten, 'E-Mail und Fläche sind freiwillig');
  assert.equal(pruefeFelder(f({ ...GUT, rhythmus: 'jeden Tag' })).daten.rhythmus, 'Noch offen');
});

test('Listen im Formular sind dieselben wie in der Function', () => {
  const html = readFileSync(new URL('../public/angebot.html', import.meta.url), 'utf8');
  const optionen = (id) => [...html.match(new RegExp(`<select id="${id}"[^>]*>([\\s\\S]*?)</select>`))[1].matchAll(/<option(?: [^>]*)?>([^<]+)<\/option>/g)].map((m) => m[1].replace(/&amp;/g, '&')).filter((t) => t !== 'Bitte wählen');
  assert.deepEqual(optionen('leistung'), LEISTUNGEN);
  assert.deepEqual(optionen('objektart'), OBJEKTARTEN);
  assert.deepEqual(optionen('rhythmus'), RHYTHMEN);
  assert.deepEqual(optionen('rueckruf'), RUECKRUF);
});

test('Gültige Anfrage wird an KONTAKT_AN geschickt, Antwort an den Absender, Weiterleitung auf die Danke-Seite', async () => {
  let mail, signal;
  globalThis.fetch = async (url, opt) => { mail = JSON.parse(opt.body); signal = opt.signal; return new Response('{}', { status: 200 }); };
  const r = await kontakt({ request: anfrage(GUT), env: VERSAND });
  assert.equal(r.status, 303);
  assert.equal(r.headers.get('Location'), 'https://merysclean.de/nachricht-gesendet');
  assert.deepEqual(mail.to, ['info@beispiel.invalid']);
  assert.equal(mail.reply_to, 'anna@beispiel.invalid');
  assert.equal(mail.subject, 'Angebotsanfrage: Unterhaltsreinigung – 73033 Göppingen');
  assert.match(mail.text, /Fläche: 120 m²/);
  assert.ok(signal, 'Versand ohne Zeitlimit');
  globalThis.fetch = async (url, opt) => { mail = JSON.parse(opt.body); return new Response('{}', { status: 200 }); };
  await kontakt({ request: anfrage({ ...GUT, email: '' }), env: VERSAND });
  assert.equal(mail.reply_to, undefined, 'ohne E-Mail kein reply_to');
});

test('Fremde Herkunft 403, ohne Einrichtung 503, Versandfehler 502, zu groß 413 – jeweils gestaltete Seite mit Ausweg', async () => {
  globalThis.fetch = async () => new Response('{}', { status: 500 });
  const gross = new ReadableStream({ start(c) { for (let i = 0; i < 40; i++) c.enqueue(new TextEncoder().encode('x'.repeat(1024))); c.close(); } });
  const faelle = [
    [anfrage(GUT, 'https://boese.example'), VERSAND, 403],
    [anfrage(GUT), ENV, 503],
    [anfrage({ ...GUT, telefon: '' }), VERSAND, 400],
    [anfrage(GUT), VERSAND, 502],
    [new Request('https://x/api/kontakt', { method: 'POST', headers: { Origin: ENV.SEITE_URL, 'Content-Type': 'application/x-www-form-urlencoded' }, body: gross, duplex: 'half' }), VERSAND, 413],
  ];
  for (const [req, env, status] of faelle) {
    const r = await kontakt({ request: req, env });
    assert.equal(r.status, status);
    assert.equal(r.headers.get('Content-Type'), 'text/html; charset=utf-8');
    assert.match(r.headers.get('Content-Security-Policy'), /default-src 'none'/);
    const html = await r.text();
    assert.ok(html.includes('href="/angebot#formular"'), 'Rückweg zum Formular');
    assert.match(html, /tel:\+491731853563/);
    assert.doesNotMatch(html, /\sstyle=|<script/);
  }
});

test('Spam bekommt keinen Hinweis', async () => {
  const r = await kontakt({ request: anfrage({ ...GUT, firma_url: 'http://spam' }), env: VERSAND });
  assert.equal(r.status, 303);
});

test('fehlerSeite escaped Meldung und Rückweg', async () => {
  const html = await fehlerSeite('<img src=x onerror="alert(1)">', 400, { zurueck: '/"><script>' }).text();
  assert.doesNotMatch(html, /<img|<script/);
});
