import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost as kontakt, pruefeFelder } from '../functions/api/kontakt.js';
import { fehlerSeite } from '../functions/_lib/antwort.js';

const ENV = {
  SEITE_URL: 'https://www.beispiel.de',
};
const echtesFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = echtesFetch; });

const formAnfrage = (url, felder, origin = ENV.SEITE_URL) =>
  new Request(url, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(felder) });

// Portfolio ohne Zahlung: Checkout und Webhook entfernt, nur das Kontaktformular (/#kontakt) bleibt.

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
    assert.ok(html.includes('<a class="knopf" href="/#kontakt">Zurück zum Formular</a>'), 'Rückweg zum Formular fehlt');
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

test('Kontakt: mit KV-Bindung höchstens 5 Nachrichten pro IP und Stunde, danach 429', async () => {
  const speicher = new Map();
  const env = { ...ENV, RESEND_API_KEY: 're_x', KONTAKT_AN: 'info@beispiel.de', KONTAKT_VON: 'web@beispiel.de',
    KONTAKT_LIMIT: { get: async (k) => speicher.get(k) ?? null, put: async (k, v) => { speicher.set(k, v); } } };
  let mails = 0;
  globalThis.fetch = async () => { mails++; return new Response('{}', { status: 200 }); };
  const senden = (ip) => {
    const a = formAnfrage('https://x/api/kontakt', { name: 'Anna', email: 'anna@beispiel.de', nachricht: 'Hallo, bitte Rückruf.' });
    a.headers.set('CF-Connecting-IP', ip);
    return kontakt({ request: a, env });
  };
  for (let i = 0; i < 5; i++) assert.equal((await senden('203.0.113.7')).status, 303);
  assert.equal((await senden('203.0.113.7')).status, 429);
  assert.equal((await senden('203.0.113.8')).status, 303, 'andere IP bleibt frei');
  assert.equal(mails, 6, 'beim Limit wird keine Mail verschickt');
});
