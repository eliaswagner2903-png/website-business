// POST /api/kontakt – Angebotsanfrage von /angebot, funktioniert ohne JavaScript.
// Schutz: gleiche Herkunft (Origin), Größengrenze beim Lesen, verstecktes Honigtopf-Feld, Längen- und Listenprüfung,
// Datenschutz-Einwilligung Pflicht. Rate-Limit per Cloudflare-Regel (siehe abnahme.md SEC-03).
// Versand über Resend. Ohne Einrichtung wird nichts versendet (503) – nie still verschluckt.
//
//   RESEND_API_KEY (Secret: npx wrangler pages secret put RESEND_API_KEY)
//   KONTAKT_AN     (Empfänger, Variable in wrangler.toml bzw. im Pages-Dashboard)
//   KONTAKT_VON    (bei Resend verifizierte Absenderadresse)
//   SEITE_URL      (https://merysclean.de, ohne / am Ende)
import { weiter, fehler, fehlerSeite, seitenUrl, gleicheHerkunft } from '../_lib/antwort.js';

// Ausweg auf der Fehlerseite: feste Kontaktwege (kein Nutzereingabe-HTML)
const FORMULAR = {
  zurueck: '/angebot#formular', haupt: 'huelle einfach',
  ausweg: 'Ihre Eingaben bleiben erhalten, wenn Sie im Browser zurückgehen. Oder direkt: <a href="tel:+491731853563">0173 185 35 63</a> (Mo–Fr 8–16 Uhr) · <a href="mailto:info@merysclean.de">info@merysclean.de</a>',
};
const zeige = (text, status) => fehlerSeite(text, status, FORMULAR);

// Gleiche Listen wie im Formular (bauen.mjs aus inhalt/seite.json); ein Test vergleicht beide. Fremde Werte → Ersatzwert.
export const LEISTUNGEN = ['Unterhaltsreinigung', 'Büro- und Gewerbereinigung', 'Fenster- und Glasreinigung', 'Treppenhausreinigung',
  'Umzugs-, Bauend- und Sonderreinigung', 'Reinigung für Privathaushalte', 'Weitere Leistung oder noch unklar'];
export const OBJEKTARTEN = ['Büro oder Praxis', 'Geschäft oder Gewerbe', 'Industrie oder Halle', 'Treppenhaus oder Wohnanlage',
  'Wohnung oder Haus', 'Schule oder Kita', 'Baustelle', 'Sonstiges'];
export const RHYTHMEN = ['Einmalig', 'Mehrmals pro Woche', 'Wöchentlich', 'Alle zwei Wochen', 'Monatlich', 'Noch offen'];
export const RUECKRUF = ['Egal, Hauptsache bald', 'Vormittags (8–12 Uhr)', 'Nachmittags (12–16 Uhr)', 'Lieber per E-Mail antworten'];

const EMAIL = /^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[a-z]{2,}$/i;
const TELEFON = /^\+?[0-9 ()/-]{5,40}$/;
const ohneSteuerzeichen = (s) => s.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim();
const ausListe = (wert, liste, ersatz) => (liste.includes(wert) ? wert : ersatz);

export function pruefeFelder(form) {
  const f = (n) => ohneSteuerzeichen(String(form.get(n) ?? ''));
  if (f('firma_url')) return { spam: true };
  const d = {
    leistung: f('leistung'), objektart: f('objektart'), flaeche: f('flaeche'), ort: f('ort'),
    rhythmus: ausListe(f('rhythmus'), RHYTHMEN, 'Noch offen'), rueckruf: ausListe(f('rueckruf'), RUECKRUF, 'Egal, Hauptsache bald'),
    name: f('name'), telefon: f('telefon'), email: f('email'), nachricht: f('nachricht'),
  };
  if (/[\r\n]/.test(d.name + d.email + d.telefon + d.ort + d.flaeche)) return { spam: true }; // Kopfzeilen-Einschleusung
  if (!LEISTUNGEN.includes(d.leistung)) return { fehler: 'Bitte wählen Sie eine Leistung aus der Liste.' };
  if (!OBJEKTARTEN.includes(d.objektart)) return { fehler: 'Bitte wählen Sie die Art des Objekts aus der Liste.' };
  if (d.flaeche && !/^[0-9]{1,6}$/.test(d.flaeche)) return { fehler: 'Bitte die Fläche nur in Ziffern angeben (zum Beispiel 120).' };
  if (!d.ort || d.ort.length > 80) return { fehler: 'Bitte Postleitzahl und Ort angeben (höchstens 80 Zeichen).' };
  if (!d.name || d.name.length > 100) return { fehler: 'Bitte einen Namen angeben (höchstens 100 Zeichen).' };
  if (!TELEFON.test(d.telefon)) return { fehler: 'Bitte eine Telefonnummer nur mit Ziffern, Leerzeichen, +, / und - angeben.' };
  if (d.email && !EMAIL.test(d.email)) return { fehler: 'Bitte eine gültige E-Mail-Adresse angeben oder das Feld leer lassen.' };
  if (d.nachricht.length > 5000) return { fehler: 'Die Nachricht darf höchstens 5000 Zeichen lang sein.' };
  if (f('datenschutz') !== 'ja') return { fehler: 'Bitte bestätigen Sie die Einwilligung zur Verarbeitung Ihrer Angaben.' };
  return { daten: d };
}

// Größer ist keine echte Anfrage: beim Einlesen abbrechen, auch ohne Content-Length
const MAX_BYTES = 32 * 1024;
async function leseFormular(request) {
  if (Number(request.headers.get('Content-Length') || 0) > MAX_BYTES) return 'zu gross';
  const leser = request.body?.getReader();
  if (!leser) return null;
  const teile = []; let n = 0;
  for (;;) {
    const { done, value } = await leser.read();
    if (done) break;
    n += value.byteLength;
    if (n > MAX_BYTES) { await leser.cancel(); return 'zu gross'; }
    teile.push(value);
  }
  return new Response(new Blob(teile), { headers: { 'Content-Type': request.headers.get('Content-Type') || '' } }).formData().catch(() => null);
}

export async function onRequestPost({ request, env }) {
  let basis;
  try { basis = seitenUrl(env); } catch (e) { return fehler(e.message, 500); }
  if (!gleicheHerkunft(request, env)) return zeige('Die Anfrage kam nicht von dieser Website und wurde abgelehnt. Bitte das Formular direkt auf der Seite verwenden.', 403);

  const form = await leseFormular(request);
  if (form === 'zu gross') return zeige('Die Anfrage ist zu groß. Bitte kürzen Sie die Nachricht.', 413);
  if (!form) return zeige('Das Formular kam unvollständig an. Bitte erneut versuchen.', 400);
  const erg = pruefeFelder(form);
  if (erg.spam) return weiter(`${basis}/nachricht-gesendet`); // Bots bekommen keinen Hinweis
  if (erg.fehler) return zeige(erg.fehler, 400);

  if (!env.RESEND_API_KEY || !env.KONTAKT_AN || !env.KONTAKT_VON) return zeige('Der Versand ist noch nicht eingerichtet. Bitte rufen Sie uns an.', 503);

  const d = erg.daten;
  const zeilen = [
    `Leistung: ${d.leistung}`, `Objekt: ${d.objektart}`, `Fläche: ${d.flaeche ? `${d.flaeche} m²` : '–'}`, `PLZ/Ort: ${d.ort}`,
    `Rhythmus: ${d.rhythmus}`, '', `Name: ${d.name}`, `Telefon: ${d.telefon}`, `E-Mail: ${d.email || '–'}`, `Rückruf: ${d.rueckruf}`,
    '', d.nachricht || '(keine Nachricht)', '', 'Einwilligung Datenschutz: ja',
  ];
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST', signal: AbortSignal.timeout(8000),
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.KONTAKT_VON, to: [env.KONTAKT_AN], ...(d.email ? { reply_to: d.email } : {}),
      subject: `Angebotsanfrage: ${d.leistung} – ${d.ort}`,
      text: zeilen.join('\n'),
    }),
  }).catch((e) => ({ ok: false, status: e.name })); // Zeitüberschreitung oder Netzfehler → 502
  if (!r.ok) { console.error('kontakt', r.status); return zeige('Senden fehlgeschlagen. Bitte später erneut versuchen oder rufen Sie uns an.', 502); }
  return weiter(`${basis}/nachricht-gesendet`);
}
