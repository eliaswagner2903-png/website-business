// Stripe ohne SDK: nur fetch und Web Crypto, damit keine Abhängigkeit veralten kann.
// Kartendaten laufen nie über unseren Server – Stripe Checkout ist eine von Stripe gehostete Seite.

const API = 'https://api.stripe.com/v1';
const TOLERANZ_SEKUNDEN = 300; // Stripe-Empfehlung gegen Replay-Angriffe

// Verschachtelte Objekte in Stripes Formular-Kodierung: line_items[0][price]=…
export function formKodieren(obj, praefix = '', teile = []) {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const name = praefix ? `${praefix}[${k}]` : k;
    if (typeof v === 'object') formKodieren(v, name, teile);
    else teile.push(`${encodeURIComponent(name)}=${encodeURIComponent(String(v))}`);
  }
  return teile.join('&');
}

export async function stripeAufruf(schluessel, pfad, daten) {
  const antwort = await fetch(`${API}${pfad}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${schluessel}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Version': '2025-03-31.basil',
    },
    body: formKodieren(daten),
  });
  const json = await antwort.json();
  if (!antwort.ok) throw new Error(`Stripe ${antwort.status}: ${json?.error?.message ?? 'unbekannt'}`);
  return json;
}

async function hmacHex(geheimnis, text) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(geheimnis),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(text));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Zeitkonstanter Vergleich, damit die Laufzeit nichts über die Signatur verrät
function gleich(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

// Prüft den Header Stripe-Signature (t=…,v1=…) gegen den ROHEN Body.
export async function signaturPruefen(rohBody, header, geheimnis, jetzt = Math.floor(Date.now() / 1000)) {
  if (!header || !geheimnis) return false;
  const teile = header.split(',').map((t) => t.split('='));
  const t = teile.find(([k]) => k === 't')?.[1];
  const v1 = teile.filter(([k]) => k === 'v1').map(([, v]) => v);
  if (!t || !/^\d+$/.test(t) || v1.length === 0) return false;
  if (Math.abs(jetzt - Number(t)) > TOLERANZ_SEKUNDEN) return false;
  const erwartet = await hmacHex(geheimnis, `${t}.${rohBody}`);
  return v1.some((s) => gleich(s, erwartet));
}

export { hmacHex as _hmacHex };
