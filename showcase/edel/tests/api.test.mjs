import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost as kontakt, pruefeFelder } from '../functions/api/kontakt.js';

const ENV = {
  SEITE_URL: 'https://www.beispiel.de',
};
const echtesFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = echtesFetch; });

const formAnfrage = (url, felder, origin = ENV.SEITE_URL) =>
  new Request(url, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(felder) });

// Showcase ohne Zahlung: Checkout und Webhook entfernt, nur das Anfrageformular bleibt.

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
});
