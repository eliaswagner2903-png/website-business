import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { onRequestPost as kontakt, pruefeFelder, ANLIEGEN } from '../functions/api/kontakt.js';
import { fehlerSeite } from '../functions/_lib/antwort.js';

const ENV = {
  SEITE_URL: 'https://www.beispiel.de',
};
const echtesFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = echtesFetch; });

const formAnfrage = (url, felder, origin = ENV.SEITE_URL) =>
  new Request(url, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(felder) });

test('Kontakt: Honigtopf, Kopfzeilen-Einschleusung, gültige Nachricht', async () => {
  const f = (o) => new URLSearchParams(o);
  assert.equal(pruefeFelder(f({ name: 'A', email: 'a@b.de', nachricht: 'Hallo du', firma_url: 'x' })).spam, true);
  assert.ok(pruefeFelder(f({ name: 'A', email: 'keine-mail', nachricht: 'Hallo du' })).fehler);
  assert.ok(pruefeFelder(f({ name: 'A\nBcc: x@y.de', email: 'a@b.de', nachricht: 'Hallo du' })).spam);
  assert.ok(pruefeFelder(f({ name: 'Anna', email: 'anna@beispiel.de', nachricht: 'Hallo, bitte Rückruf.' })).daten);

  const env = { ...ENV, RESEND_API_KEY: 're_x', KONTAKT_AN: 'info@beispiel.de', KONTAKT_VON: 'web@beispiel.de' };
  let mail;
  globalThis.fetch = async (url, opt) => { mail = JSON.parse(opt.body); return new Response('{}', { status: 200 }); };
  const r = await kontakt({ request: formAnfrage('https://x/api/kontakt', { name: 'Anna', email: 'anna@beispiel.de', nachricht: 'Hallo, bitte Rückruf.' }), env });
  assert.equal(r.status, 303);
  assert.equal(mail.reply_to, 'anna@beispiel.de');
  assert.deepEqual(mail.to, ['info@beispiel.de']);
});

test('Kontakt ohne Versand-Einrichtung meldet 503 statt still zu verschlucken', async () => {
  const r = await kontakt({ request: formAnfrage('https://x/api/kontakt', { name: 'Anna', email: 'anna@beispiel.de', nachricht: 'Hallo, bitte Rückruf.' }), env: ENV });
  assert.equal(r.status, 503);
  assert.equal(r.headers.get('Content-Type'), 'text/html; charset=utf-8');
  assert.match(await r.text(), /noch nicht eingerichtet/);
});

test('Kontakt: Fehler, die ein Mensch sieht, kommen als gestaltete HTML-Seite mit Rückweg', async () => {
  globalThis.fetch = async () => new Response('{}', { status: 500 });
  const env = { ...ENV, RESEND_API_KEY: 're_x', KONTAKT_AN: 'info@beispiel.de', KONTAKT_VON: 'web@beispiel.de' };
  const gut = { name: 'Anna', email: 'anna@beispiel.de', nachricht: 'Hallo, bitte Rückruf.' };
  const faelle = [
    [formAnfrage('https://x/api/kontakt', { ...gut, email: 'keine-mail' }), 400],
    [formAnfrage('https://x/api/kontakt', gut, 'https://boese.example'), 403],
    [formAnfrage('https://x/api/kontakt', gut), 502],
  ];
  for (const [anfrage, status] of faelle) {
    const r = await kontakt({ request: anfrage, env });
    assert.equal(r.status, status);
    assert.equal(r.headers.get('Content-Type'), 'text/html; charset=utf-8');
    assert.equal(r.headers.get('Cache-Control'), 'no-store');
    assert.match(r.headers.get('Content-Security-Policy'), /default-src 'none'.*style-src 'self'/);
    const html = await r.text();
    assert.match(html, /^<!DOCTYPE html>\n<html lang="de">/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /<link rel="stylesheet" href="\/css\/stil\.css">/);
    assert.ok(html.includes('<a class="knopf" href="/kontakt#formular">Zurück zum Formular</a>'), 'Rückweg zum Formular fehlt');
    assert.doesNotMatch(html, /\sstyle=|<script/, 'kein Inline-Stil/-Skript (CSP)');
  }
});

test('fehlerSeite escaped die Meldung und den Rückweg', async () => {
  const r = fehlerSeite(`<img src=x onerror="alert(1)"> & 'x'`, 400, { zurueck: '/"><script>' });
  assert.equal(r.status, 400);
  assert.equal(r.headers.get('Content-Type'), 'text/html; charset=utf-8');
  const html = await r.text();
  assert.ok(html.includes('<p>&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#39;x&#39;</p>'));
  assert.doesNotMatch(html, /<img|<script/);
  assert.ok(html.includes('href="/&quot;&gt;&lt;script&gt;"'));
});

test('Kontakt: Firma und Anliegen reisen mit, fremdes Anliegen wird „Sonstiges“, Liste gleich wie im Formular', async () => {
  const f = (o) => new URLSearchParams(o);
  const d = pruefeFelder(f({ name: 'Anna', firma: 'Muster GmbH', email: 'anna@beispiel.de', anliegen: 'Micro Toolmanagement', nachricht: 'Bitte Rückruf.' })).daten;
  assert.equal(d.firma, 'Muster GmbH'); assert.equal(d.anliegen, 'Micro Toolmanagement');
  assert.equal(pruefeFelder(f({ name: 'A', email: 'a@b.de', anliegen: '<script>', nachricht: 'Hallo du' })).daten.anliegen, 'Sonstiges');
  assert.ok(pruefeFelder(f({ name: 'A', firma: 'x\nBcc: y', email: 'a@b.de', nachricht: 'Hallo du' })).spam);
  assert.equal(pruefeFelder(f({ name: 'A', email: 'a@b.de', telefon: '+49 7161 6064-0', nachricht: 'Hallo du' })).daten.telefon, '+49 7161 6064-0');
  assert.ok(pruefeFelder(f({ name: 'A', email: 'a@b.de', telefon: 'ruf an!', nachricht: 'Hallo du' })).fehler, 'Telefon nur Ziffern');
  const html = readFileSync(new URL('../public/kontakt.html', import.meta.url), 'utf8');
  const optionen = [...html.matchAll(/<option>([^<]+)<\/option>/g)].map((m) => m[1]);
  assert.deepEqual(optionen, ANLIEGEN);
  const env = { ...ENV, RESEND_API_KEY: 're_x', KONTAKT_AN: 'info@beispiel.de', KONTAKT_VON: 'web@beispiel.de' };
  let mail;
  globalThis.fetch = async (url, opt) => { mail = JSON.parse(opt.body); return new Response('{}', { status: 200 }); };
  await kontakt({ request: formAnfrage('https://x/api/kontakt', { name: 'Anna', firma: 'Muster GmbH', email: 'anna@beispiel.de', anliegen: 'Angebot und Preise', nachricht: 'Hallo, bitte Angebot.' }), env });
  assert.equal(mail.subject, 'Angebot und Preise: Anfrage von Anna (Muster GmbH)');
});

test('Kontakt: zu große Anfrage bricht beim Lesen ab (auch ohne Content-Length), Versand mit Zeitlimit, Ausweg auf der Fehlerseite', async () => {
  const gross = new ReadableStream({ start(c) { for (let i = 0; i < 40; i++) c.enqueue(new TextEncoder().encode('x'.repeat(1024))); c.close(); } });
  const req = new Request('https://x/api/kontakt', { method: 'POST', headers: { Origin: ENV.SEITE_URL, 'Content-Type': 'application/x-www-form-urlencoded' }, body: gross, duplex: 'half' });
  const r = await kontakt({ request: req, env: ENV });
  assert.equal(r.status, 413);
  const html = await r.text();
  assert.match(html, /tel:\+49716160640/);
  assert.match(html, /mailto:info@osg-germany\.de/);

  const env = { ...ENV, RESEND_API_KEY: 're_x', KONTAKT_AN: 'info@beispiel.de', KONTAKT_VON: 'web@beispiel.de' };
  let signal;
  globalThis.fetch = async (url, opt) => { signal = opt.signal; throw new DOMException('Zeit abgelaufen', 'TimeoutError'); };
  const r2 = await kontakt({ request: formAnfrage('https://x/api/kontakt', { name: 'Anna', email: 'anna@beispiel.de', nachricht: 'Hallo, bitte Rückruf.' }), env });
  assert.ok(signal, 'Resend-Aufruf ohne Zeitlimit');
  assert.equal(r2.status, 502);
});
