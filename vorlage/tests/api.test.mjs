import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { signaturPruefen, formKodieren, _hmacHex } from '../functions/_lib/stripe.js';
import { onRequestPost as checkout } from '../functions/api/checkout.js';
import { onRequestPost as webhook } from '../functions/api/stripe-webhook.js';
import { onRequestPost as kontakt, pruefeFelder } from '../functions/api/kontakt.js';

const ENV = {
  SEITE_URL: 'https://www.beispiel.de',
  STRIPE_SECRET_KEY: 'rk_test_x',
  STRIPE_WEBHOOK_SECRET: 'whsec_test',
  PRODUKTE: JSON.stringify({ beratung: { preis: 'price_123', modus: 'payment' } }),
};
const echtesFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = echtesFetch; });

const formAnfrage = (url, felder, origin = ENV.SEITE_URL) =>
  new Request(url, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(felder) });

test('formKodieren verschachtelt wie Stripe', () => {
  assert.equal(formKodieren({ mode: 'payment', line_items: [{ price: 'p', quantity: 1 }] }),
    'mode=payment&line_items%5B0%5D%5Bprice%5D=p&line_items%5B0%5D%5Bquantity%5D=1');
});

test('Signatur: gültig, falsch, zu alt, fehlend', async () => {
  const jetzt = 1_800_000_000, body = '{"id":"evt_1"}';
  const sig = await _hmacHex('whsec_test', `${jetzt}.${body}`);
  assert.equal(await signaturPruefen(body, `t=${jetzt},v1=${sig}`, 'whsec_test', jetzt), true);
  assert.equal(await signaturPruefen(body + ' ', `t=${jetzt},v1=${sig}`, 'whsec_test', jetzt), false);
  assert.equal(await signaturPruefen(body, `t=${jetzt},v1=${sig}`, 'whsec_test', jetzt + 301), false);
  assert.equal(await signaturPruefen(body, `t=${jetzt},v1=${sig}`, 'anderes', jetzt), false);
  assert.equal(await signaturPruefen(body, null, 'whsec_test', jetzt), false);
  assert.equal(await signaturPruefen(body, `t=abc,v1=${sig}`, 'whsec_test', jetzt), false);
});

test('Webhook lehnt ungültige Signatur ab und nimmt gültige an', async () => {
  const body = JSON.stringify({ id: 'evt_2', type: 'checkout.session.completed', data: { object: { metadata: { produkt: 'beratung' } } } });
  const t = Math.floor(Date.now() / 1000);
  const schlecht = await webhook({ request: new Request('https://x/api/stripe-webhook', { method: 'POST', body, headers: { 'Stripe-Signature': `t=${t},v1=00` } }), env: ENV });
  assert.equal(schlecht.status, 400);
  const sig = await _hmacHex(ENV.STRIPE_WEBHOOK_SECRET, `${t}.${body}`);
  const gut = await webhook({ request: new Request('https://x/api/stripe-webhook', { method: 'POST', body, headers: { 'Stripe-Signature': `t=${t},v1=${sig}` } }), env: ENV });
  assert.equal(gut.status, 200);
});

test('Checkout: bekanntes Produkt → 303 zu Stripe, Preis kommt vom Server', async () => {
  let gesendet;
  globalThis.fetch = async (url, opt) => { gesendet = { url, body: opt.body, auth: opt.headers.Authorization };
    return new Response(JSON.stringify({ url: 'https://checkout.stripe.com/c/pay/cs_test_1' }), { status: 200 }); };
  const r = await checkout({ request: formAnfrage('https://www.beispiel.de/api/checkout', { produkt: 'beratung', preis: 'price_BOESE' }), env: ENV });
  assert.equal(r.status, 303);
  assert.equal(r.headers.get('Location'), 'https://checkout.stripe.com/c/pay/cs_test_1');
  assert.match(gesendet.body, /price%5D=price_123/);
  assert.doesNotMatch(gesendet.body, /BOESE/);
  assert.match(gesendet.body, /success_url=https%3A%2F%2Fwww\.beispiel\.de%2Fdanke\.html/);
  assert.equal(gesendet.auth, 'Bearer rk_test_x');
});

test('Checkout: unbekanntes Produkt, fremde Herkunft, fremde Weiterleitung', async () => {
  globalThis.fetch = async () => { throw new Error('darf nicht aufgerufen werden'); };
  assert.equal((await checkout({ request: formAnfrage('https://x/api/checkout', { produkt: 'gibtsnicht' }), env: ENV })).status, 400);
  assert.equal((await checkout({ request: formAnfrage('https://x/api/checkout', { produkt: 'beratung' }, 'https://boese.example'), env: ENV })).status, 403);
  assert.equal((await checkout({ request: formAnfrage('https://x/api/checkout', { produkt: '__proto__' }), env: ENV })).status, 400);
  globalThis.fetch = async () => new Response(JSON.stringify({ url: 'https://boese.example/' }), { status: 200 });
  assert.equal((await checkout({ request: formAnfrage('https://x/api/checkout', { produkt: 'beratung' }), env: ENV })).status, 502);
});

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
