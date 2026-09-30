// POST /api/kontakt – Kontaktformular ohne JavaScript.
// Schutz: gleiche Herkunft, Größengrenze, verstecktes Honigtopf-Feld, Längenprüfung. Rate-Limit per Cloudflare-Regel (abnahme.md SEC-03).
// Versand über Resend (EU-Region wählbar). Ohne RESEND_API_KEY wird nichts versendet (503).
//
//   RESEND_API_KEY (Secret), KONTAKT_AN (Empfänger), KONTAKT_VON (verifizierte Absenderadresse)
import { weiter, fehler, fehlerSeite, seitenUrl, gleicheHerkunft } from '../_lib/antwort.js';

// Wohin „Zurück zum Formular“ führt und welche Klassen die Fehlerseite bekommt (Anker des Formulars auf der Seite).
const FORMULAR = { zurueck: '/kontakt#formular', haupt: 'huelle einfach' };
// Anliegen im Formular (gleiche Liste wie ANLIEGEN in bauen.mjs; ein Test vergleicht beide). Fremde Werte → „Sonstiges“.
export const ANLIEGEN = ['Anwendungsberatung', 'Angebot und Preise', 'Micro Toolmanagement', 'OSG Academy und Workshops', 'Sonstiges'];
const zeige = (text, status) => fehlerSeite(text, status, FORMULAR);

const EMAIL = /^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[a-z]{2,}$/i;
const ohneSteuerzeichen = (s) => s.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim();

export function pruefeFelder(form) {
  const f = (n) => ohneSteuerzeichen(String(form.get(n) ?? ''));
  const anliegen = ANLIEGEN.includes(f('anliegen')) ? f('anliegen') : 'Sonstiges';
  const daten = { name: f('name'), firma: f('firma'), email: f('email'), telefon: f('telefon'), anliegen, nachricht: f('nachricht') };
  if (f('firma_url')) return { spam: true };
  if (!daten.name || daten.name.length > 100) return { fehler: 'Bitte einen Namen angeben (höchstens 100 Zeichen).' };
  if (!EMAIL.test(daten.email)) return { fehler: 'Bitte eine gültige E-Mail-Adresse angeben.' };
  if (daten.firma.length > 120) return { fehler: 'Der Firmenname darf höchstens 120 Zeichen lang sein.' };
  if (daten.telefon && !/^\+?[0-9 ()/-]{5,40}$/.test(daten.telefon)) return { fehler: 'Bitte die Telefonnummer nur mit Ziffern, Leerzeichen, + und - angeben.' };
  if (daten.nachricht.length < 5 || daten.nachricht.length > 5000) return { fehler: 'Die Nachricht muss 5 bis 5000 Zeichen lang sein.' };
  if (/[\r\n]/.test(daten.name + daten.email + daten.firma + daten.telefon)) return { spam: true };
  return { daten };
}

// Größer ist keine echte Anfrage (5000 Zeichen Nachricht + Felder): vor dem Einlesen abweisen
const MAX_BYTES = 32 * 1024;

export async function onRequestPost({ request, env }) {
  let basis;
  try { basis = seitenUrl(env); } catch (e) { return fehler(e.message, 500); }
  if (!gleicheHerkunft(request, env)) return zeige('Die Anfrage kam nicht von dieser Website und wurde abgelehnt. Bitte das Formular direkt auf der Seite verwenden.', 403);

  if (Number(request.headers.get('Content-Length') || 0) > MAX_BYTES) return zeige('Die Anfrage ist zu groß. Bitte kürzen Sie die Nachricht.', 413);
  const form = await request.formData().catch(() => null);
  if (!form) return zeige('Das Formular kam unvollständig an. Bitte erneut versuchen.', 400);
  const erg = pruefeFelder(form);
  if (erg.spam) return weiter(`${basis}/nachricht-gesendet`); // Bots bekommen keinen Hinweis
  if (erg.fehler) return zeige(erg.fehler, 400);

  if (!env.RESEND_API_KEY || !env.KONTAKT_AN || !env.KONTAKT_VON) return zeige('Der Versand ist noch nicht eingerichtet.', 503);

  const { name, firma, email, telefon, anliegen, nachricht } = erg.daten;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.KONTAKT_VON, to: [env.KONTAKT_AN], reply_to: email,
      subject: `${anliegen}: Anfrage von ${name}${firma ? ` (${firma})` : ''}`,
      text: `Anliegen: ${anliegen}\nName: ${name}\nFirma: ${firma || '–'}\nE-Mail: ${email}\nTelefon: ${telefon || '–'}\n\n${nachricht}`,
    }),
  });
  if (!r.ok) { console.error('kontakt', r.status); return zeige('Senden fehlgeschlagen. Bitte später erneut versuchen.', 502); }
  return weiter(`${basis}/nachricht-gesendet`);
}
