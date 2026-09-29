// POST /api/kontakt – Kontaktformular ohne JavaScript.
// Schutz: gleiche Herkunft, verstecktes Honigtopf-Feld, Längenprüfung, optional Cloudflare Turnstile.
// Versand über Resend (EU-Region wählbar). Ohne RESEND_API_KEY wird nichts versendet (503).
//
//   RESEND_API_KEY (Secret), KONTAKT_AN (Empfänger), KONTAKT_VON (verifizierte Absenderadresse)
//   TURNSTILE_SECRET (Secret, optional – wenn gesetzt, ist Turnstile Pflicht)
import { weiter, fehler, fehlerSeite, seitenUrl, gleicheHerkunft } from '../_lib/antwort.js';

// Wohin „Zurück zum Formular“ führt und welche Klassen die Fehlerseite bekommt (Anker des Formulars auf der Seite).
const FORMULAR = { zurueck: '/#kontakt' };
const zeige = (text, status) => fehlerSeite(text, status, FORMULAR);

const EMAIL = /^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[a-z]{2,}$/i;
const ohneSteuerzeichen = (s) => s.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim();

// Auswahl aus dem Konfigurator (optional): nur bekannte Werte, alles andere fällt still weg.
// Die Stufennamen stehen auch in inhalt/seite.json; der Test prüft, dass beide gleich sind.
const KONFIG = {
  branche: ['praxis', 'handwerk', 'gastro', 'studio'],
  farbe: ['terrakotta', 'kobalt', 'salbei', 'messing'],
  stil: ['hell', 'laut', 'edel'],
  bausteine: ['termin', 'speisekarte', 'galerie', 'formular', 'zahlung', 'film', 'dreid'],
};
export const STUFEN = {
  sicherheit: ['Sicherheit', 'Grundschutz', 'Geprüft', 'Überwacht', 'Abgesichert', 'Höchste Stufe'],
  design: ['Gestaltung', 'Vorlage', 'Angepasst', 'Eigenes Design', 'Eigenes Design plus', 'Markenauftritt'],
  umfang: ['Umfang', 'Eine Seite', 'Bis 3 Seiten', 'Bis 5 Seiten', 'Bis 8 Seiten', 'Mehr als 8 Seiten'],
  bewegung: ['Bewegung', 'Ruhig', 'Dezent', 'Lebendig', 'Film', 'Kino'],
  inhalte: ['Texte und Bilder', 'Alles von Ihnen', 'Geglättet', 'Geschrieben', 'Mit Bildern', 'Komplett'],
  betreuung: ['Betreuung', 'Übergabe', 'Sicher', 'Mit Bericht', 'Mit Änderungen', 'Vorrang'],
};
export function konfigAuswahl(form) {
  const aus = {};
  for (const [feld, erlaubt] of Object.entries(KONFIG)) {
    const werte = form.getAll(feld === 'bausteine' ? 'bausteine[]' : feld).map(String).filter((w) => erlaubt.includes(w));
    if (werte.length) aus[feld] = [...new Set(werte)].join(', ');
  }
  for (const [id, [titel, ...namen]] of Object.entries(STUFEN)) {
    const n = String(form.get(`stufe_${id}`) ?? '');
    if (/^[1-5]$/.test(n)) aus[titel] = `Stufe ${n} von 5 (${namen[n - 1]})`;
  }
  return aus;
}

export function pruefeFelder(form) {
  const f = (n) => ohneSteuerzeichen(String(form.get(n) ?? ''));
  const daten = { name: f('name'), email: f('email'), nachricht: f('nachricht') };
  if (f('firma_url')) return { spam: true };
  if (!daten.name || daten.name.length > 100) return { fehler: 'Bitte einen Namen angeben (höchstens 100 Zeichen).' };
  if (!EMAIL.test(daten.email)) return { fehler: 'Bitte eine gültige E-Mail-Adresse angeben.' };
  if (daten.nachricht.length < 5 || daten.nachricht.length > 5000) return { fehler: 'Die Nachricht muss 5 bis 5000 Zeichen lang sein.' };
  if (/[\r\n]/.test(daten.name) || /[\r\n]/.test(daten.email)) return { spam: true };
  return { daten };
}

async function turnstileOk(env, token, ip) {
  if (!env.TURNSTILE_SECRET) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token });
  if (ip) body.set('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  return (await r.json().catch(() => ({}))).success === true;
}

export async function onRequestPost({ request, env }) {
  let basis;
  try { basis = seitenUrl(env); } catch (e) { return fehler(e.message, 500); }
  if (!gleicheHerkunft(request, env)) return zeige('Die Anfrage kam nicht von dieser Website und wurde abgelehnt. Bitte das Formular direkt auf der Seite verwenden.', 403);

  const form = await request.formData().catch(() => null);
  if (!form) return zeige('Das Formular kam unvollständig an. Bitte erneut versuchen.', 400);
  const erg = pruefeFelder(form);
  if (erg.spam) return weiter(`${basis}/nachricht-gesendet.html`); // Bots bekommen keinen Hinweis
  if (erg.fehler) return zeige(erg.fehler, 400);

  if (!(await turnstileOk(env, form.get('cf-turnstile-response'), request.headers.get('CF-Connecting-IP')))) {
    return zeige('Die Sicherheitsprüfung ist fehlgeschlagen. Bitte die Seite neu laden.', 400);
  }
  if (!env.RESEND_API_KEY || !env.KONTAKT_AN || !env.KONTAKT_VON) return zeige('Der Versand ist noch nicht eingerichtet.', 503);

  const { name, email, nachricht } = erg.daten;
  const konfig = Object.entries(konfigAuswahl(form)).map(([k, v]) => `${k}: ${v}`).join('\n');
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.KONTAKT_VON, to: [env.KONTAKT_AN], reply_to: email,
      subject: `Anfrage über die Website von ${name}`,
      text: `Name: ${name}\nE-Mail: ${email}\n\n${nachricht}${konfig ? `\n\nAuswahl im Konfigurator:\n${konfig}` : ''}`,
    }),
  });
  if (!r.ok) { console.error('kontakt', r.status); return zeige('Senden fehlgeschlagen. Bitte später erneut versuchen.', 502); }
  return weiter(`${basis}/nachricht-gesendet.html`);
}
