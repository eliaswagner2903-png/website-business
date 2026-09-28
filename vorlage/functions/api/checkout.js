// POST /api/checkout  (Formularfeld: produkt)
// Erstellt eine Stripe-Checkout-Sitzung und leitet dorthin weiter. Funktioniert ohne JavaScript.
// Preise stehen NUR serverseitig in PRODUKTE, der Browser nennt nur den Namen: niemand kann den Preis ändern.
//
// Umgebungsvariablen (Cloudflare Pages → Settings → Variables):
//   STRIPE_SECRET_KEY  (Secret)   restricted key mit Schreibrecht nur auf Checkout Sessions
//   SEITE_URL                     https://www.kunde.de
//   PRODUKTE                      {"beratung":{"preis":"price_123","modus":"payment"},
//                                  "abo-basis":{"preis":"price_456","modus":"subscription"}}
import { stripeAufruf } from '../_lib/stripe.js';
import { weiter, fehler, seitenUrl, gleicheHerkunft } from '../_lib/antwort.js';

export async function onRequestPost({ request, env }) {
  let basis;
  try { basis = seitenUrl(env); } catch (e) { return fehler(e.message, 500); }
  if (!gleicheHerkunft(request, env)) return fehler('Fremde Herkunft abgelehnt', 403);

  const form = await request.formData().catch(() => null);
  const name = String(form?.get('produkt') ?? '');
  let produkte;
  try { produkte = JSON.parse(env.PRODUKTE || '{}'); } catch { return fehler('PRODUKTE ist kein gültiges JSON', 500); }
  if (!/^[a-z0-9-]{1,40}$/.test(name) || !Object.hasOwn(produkte, name)) return fehler('Unbekanntes Produkt', 400);

  const { preis, modus = 'payment' } = produkte[name];
  if (!/^price_[A-Za-z0-9]+$/.test(preis) || !['payment', 'subscription'].includes(modus)) {
    return fehler('Produkt falsch konfiguriert', 500);
  }

  try {
    const sitzung = await stripeAufruf(env.STRIPE_SECRET_KEY, '/checkout/sessions', {
      mode: modus,
      line_items: [{ price: preis, quantity: 1 }],
      success_url: `${basis}/danke.html?sitzung={CHECKOUT_SESSION_ID}`,
      cancel_url: `${basis}/abbruch.html`,
      locale: 'de',
      billing_address_collection: 'required',
      metadata: { produkt: name },
    });
    if (!/^https:\/\/checkout\.stripe\.com\//.test(sitzung.url)) return fehler('Unerwartete Antwort von Stripe', 502);
    return weiter(sitzung.url);
  } catch (e) {
    console.error('checkout', e.message);
    return fehler('Die Zahlung konnte gerade nicht gestartet werden. Bitte später erneut versuchen.', 502);
  }
}
