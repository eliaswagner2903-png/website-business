// POST /api/stripe-webhook – Stripe meldet hier bezahlte Bestellungen und Abo-Änderungen.
// Nur Ereignisse mit gültiger Signatur werden angenommen (STRIPE_WEBHOOK_SECRET, beginnt mit whsec_).
// Bestellungen gelten erst hier als bezahlt, nie über die Danke-Seite (die kann jeder aufrufen).
import { signaturPruefen } from '../_lib/stripe.js';
import { fehler } from '../_lib/antwort.js';

export async function onRequestPost({ request, env }) {
  const roh = await request.text(); // roh lesen: jede Umformung würde die Signatur brechen
  const ok = await signaturPruefen(roh, request.headers.get('Stripe-Signature'), env.STRIPE_WEBHOOK_SECRET);
  if (!ok) return fehler('Signatur ungültig', 400);

  let ereignis;
  try { ereignis = JSON.parse(roh); } catch { return fehler('Kein JSON', 400); }

  switch (ereignis.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
      // Hier die Bestellung ausführen: Bestätigung schicken, Termin freischalten, Download freigeben …
      // Idempotent bauen: Stripe kann dasselbe Ereignis mehrfach senden (ereignis.id merken).
      console.log('bezahlt', ereignis.id, ereignis.data?.object?.metadata?.produkt);
      break;
    case 'customer.subscription.deleted':
      console.log('abo beendet', ereignis.id);
      break;
    default:
      break; // unbekannte Ereignisse bestätigen, sonst wiederholt Stripe sie tagelang
  }
  return new Response('ok', { status: 200 });
}
