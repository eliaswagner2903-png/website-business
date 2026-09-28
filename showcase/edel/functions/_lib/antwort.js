// Gemeinsame Helfer für alle API-Routen.

export const weiter = (ziel, status = 303) =>
  new Response(null, { status, headers: { Location: ziel, 'Cache-Control': 'no-store' } });

export const fehler = (text, status = 400) =>
  new Response(text, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });

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
