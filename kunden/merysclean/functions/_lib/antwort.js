// Gemeinsame Helfer für alle API-Routen.

export const weiter = (ziel, status = 303) =>
  new Response(null, { status, headers: { Location: ziel, 'Cache-Control': 'no-store' } });

export const fehler = (text, status = 400) =>
  new Response(text, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });

// Fehler, die ein Mensch nach einem normalen Formular-POST sieht: kleine gestaltete HTML-Seite statt reinem Text.
// Die Meldung wird HTML-escaped. Kein Inline-Stil/-Skript; eigene CSP, weil Cloudflare Pages die Regeln aus
// public/_headers NICHT auf Antworten von Functions anwendet.
export const escHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const FEHLER_CSP = "default-src 'none'; style-src 'self'; font-src 'self'; img-src 'self'; base-uri 'none'; "
  + "form-action 'none'; frame-ancestors 'none'";

// ausweg: festes HTML vom Aufrufer (nie Nutzereingaben), z. B. Telefon und E-Mail
export function fehlerSeite(text, status = 400, { zurueck = '/#kontakt', koerper = '', haupt = 'huelle einfach', ausweg = '' } = {}) {
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Nachricht nicht gesendet</title>
<meta name="description" content="Die Nachricht konnte nicht gesendet werden.">
<meta name="robots" content="noindex">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/css/marke.css">
<link rel="stylesheet" href="/css/stil.css">
</head>
<body${koerper ? ` class="${escHtml(koerper)}"` : ''}>
<main id="inhalt">
  <div class="${escHtml(haupt)}">
    <h1>Nachricht nicht gesendet</h1>
    <p>${escHtml(text)}</p>
    <p><a class="knopf" href="${escHtml(zurueck)}">Zurück zum Formular</a></p>
${ausweg ? `    <p>${ausweg}</p>\n` : ''}
  </div>
</main>
</body>
</html>
`;
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Content-Security-Policy': FEHLER_CSP,
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  });
}

// Die eigene Adresse kommt aus der Konfiguration, nie aus dem Host-Header der Anfrage.
export function seitenUrl(env) {
  const url = env.SEITE_URL;
  if (!url || !/^https:\/\/[^/]+$/.test(url) && !/^http:\/\/localhost(:\d+)?$/.test(url)) {
    throw new Error('SEITE_URL fehlt oder ist ungültig (z. B. https://www.beispiel.de, ohne / am Ende)');
  }
  return url;
}

// Schutz gegen Formular-Absendungen von fremden Seiten (CSRF): Origin muss die eigene Seite sein.
export function gleicheHerkunft(request, env) {
  const origin = request.headers.get('Origin');
  return origin === seitenUrl(env);
}
