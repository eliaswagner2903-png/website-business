// Regeln für Merys Clean: HTML aus inhalt/ gebaut und aktuell, nur belegte Fakten, offene Angaben markiert,
// JSON-LD nur mit sichtbaren Werten, keine Bewertungen/Preise, Links ohne .html, alte Adressen umgeleitet.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdtempSync, cpSync, rmSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const WURZEL = new URL('../', import.meta.url).pathname;
const PUB = join(WURZEL, 'public');
const seiten = readdirSync(PUB).filter((f) => /\.html$/.test(f)).map((f) => [f, readFileSync(join(PUB, f), 'utf8')]);
const alle = Object.fromEntries(seiten);
const S = JSON.parse(readFileSync(join(WURZEL, 'inhalt/seite.json'), 'utf8'));
const start = alle['index.html'];
const NOINDEX = ['impressum.html', 'datenschutz.html', '404.html', 'nachricht-gesendet.html'];
const text = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ');

test('HTML, Sitemap, robots.txt und _redirects sind aus inhalt/ gebaut und aktuell (node bauen.mjs)', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'mc-'));
  for (const d of ['bauen.mjs', 'inhalt']) cpSync(join(WURZEL, d), join(tmp, d), { recursive: true });
  cpSync(PUB, join(tmp, 'public'), { recursive: true });
  execFileSync(process.execPath, [join(tmp, 'bauen.mjs')]);
  for (const [f, t] of seiten) assert.equal(readFileSync(join(tmp, 'public', f), 'utf8'), t, `${f} ist veraltet: node bauen.mjs`);
  for (const f of ['sitemap.xml', 'robots.txt', '_redirects']) assert.equal(readFileSync(join(tmp, 'public', f), 'utf8'), readFileSync(join(PUB, f), 'utf8'), `${f} veraltet`);
  rmSync(tmp, { recursive: true });
});

test('Genau eine H1 pro Seite, lang="de", Überschriften ohne Sprung', () => {
  for (const [f, t] of seiten) {
    assert.equal((t.match(/<h1[\s>]/g) || []).length, 1, `${f}: H1`);
    assert.match(t, /<html lang="de"/);
    let vorher = 1;
    for (const [, n] of t.matchAll(/<h([1-6])[\s>]/g)) { assert.ok(+n <= vorher + 1, `${f}: Sprung auf h${n}`); vorher = +n; }
  }
});

test('Fakten: eine Rufnummer in tel:-Links (Festnetz nur auf Kontakt), E-Mail gleich, keine Preise, keine Bewertungen', () => {
  for (const [f, t] of seiten) {
    assert.ok(t.includes(`href="tel:${S.telefon_link}"`), `${f}: Telefon fehlt`);
    for (const [, n] of t.matchAll(/href="tel:([^"]+)"/g)) assert.ok(n === S.telefon_link || (f === 'kontakt.html' && n === S.festnetz_link), `${f}: abweichende Nummer ${n}`);
    for (const [, m] of t.matchAll(/href="mailto:([^"]+)"/g)) assert.equal(m, S.email);
    assert.ok(text(t).includes(`${S.strasse} ${S.plz} ${S.ort}`), `${f}: Adresse fehlt im Fuß`);
    assert.doesNotMatch(t, /\d\s*(?:&nbsp;)?(?:€|EUR\b|Euro)/, `${f}: Preis`);
    assert.doesNotMatch(text(t), /lorem|ipsum|TODO|XXX|5-Sterne|Marktführer|Minderheitsbesitz|Hoffmann|Moscato/i, `${f}: Blindtext oder ungeprüfte Aussage`);
    assert.doesNotMatch(t, /aggregateRating|"review"/, `${f}: Bewertungen im Markup`);
  }
});

test('Offene Angaben sind markiert: Hauptnummer, WhatsApp, Erfahrung, Familie, Team-Zitate, Bildrechte, Gebiet, Rechtstexte', () => {
  const p = (t) => [...t.matchAll(/data-pruefen="([^"]+)"/g)].map((m) => m[1]).join(' | ');
  assert.match(p(alle['kontakt.html']), /Hauptnummer/);
  assert.match(p(alle['kontakt.html']), /WhatsApp/);
  assert.match(p(start), /20 jährige Erfahrung|Familienunternehmen/);
  assert.match(p(start), /Zitat von Safet Mustafa/);
  assert.match(p(start), /Zitat von Merita Mustafa/);
  assert.match(p(start), /Einsatzgebiet bestätigen/);
  assert.match(p(alle['ueber-uns.html']), /20 jährige Erfahrung/);
  for (const f of ['impressum.html', 'datenschutz.html']) assert.match(p(alle[f]), /Rechtstext nicht erfinden/);
  // jedes Bild außer Logo und Siegel steht in einem Element mit Bildrechte-/Einwilligungs-Hinweis
  for (const [f, t] of seiten) {
    for (const m of t.matchAll(/<picture>[\s\S]*?<\/picture>/g)) {
      if (/\/medien\/siegel-/.test(m[0])) continue;
      const davor = t.slice(Math.max(0, m.index - 600), m.index);
      assert.match(davor.slice(davor.lastIndexOf('<figure') > -1 ? davor.lastIndexOf('<figure') : davor.lastIndexOf('<div')), /data-pruefen="[^"]*(Bildrechte|Einwilligung|Nutzungsrecht)/, `${f}: Bild ohne Rechte-Hinweis`);
    }
  }
});

test('Leistungen: je Leistung eine Seite mit Für wen, Ablauf, FAQ; in Navigation und Fuß verlinkt', () => {
  for (const l of S.leistungen) {
    const t = alle[`${l.url}.html`];
    assert.ok(t, `${l.url}.html fehlt`);
    assert.ok(t.includes('id="wen-titel"') && t.includes('id="ablauf-titel"') && t.includes('class="faq-eintrag"'), `${l.url}: Abschnitt fehlt`);
    assert.equal((t.match(/class="faq-eintrag"/g) || []).length, l.faq.length);
    assert.ok(start.includes(`<a href="/${l.url}">`), `${l.url}: nicht im Menü`);
  }
});

test('JSON-LD: Betrieb nur auf der Startseite, jeder Textwert sichtbar, Öffnungszeiten wie im Text', () => {
  for (const [f, t] of seiten) {
    const m = t.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!m) { assert.ok(NOINDEX.includes(f), `${f}: JSON-LD fehlt`); continue; }
    const d = JSON.parse(m[1]);
    assert.equal(d['@context'], 'https://schema.org');
    if (f !== 'index.html') assert.doesNotMatch(m[1], /ProfessionalService/, `${f}: Betrieb doppelt`);
    const sicht = text(t) + ' ' + (t.match(/<title>([^<]*)/)[1]);
    const lauf = (o, k) => {
      if (Array.isArray(o)) return o.forEach((x) => lauf(x, k));
      if (o && typeof o === 'object') return Object.entries(o).forEach(([kk, v]) => !/^(@|url|item|logo|image|sameAs|telephone|email|opens|closes|dayOfWeek|addressCountry)/.test(kk) && lauf(v, kk));
      if (typeof o === 'string') assert.ok(sicht.includes(o), `${f}: JSON-LD ${k} „${o}“ nicht sichtbar`);
    };
    lauf(d['@graph']);
  }
  const b = JSON.parse(start.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'][0];
  assert.equal(b['@type'], 'ProfessionalService');
  assert.equal(b.telephone, S.telefon_link);
  assert.ok(text(start).includes('Mo–Fr 08:00–16:00 Uhr'));
  assert.deepEqual(b.openingHoursSpecification[0].dayOfWeek, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
});

test('Bilder: Quellen vorhanden, ≤ 300 KB, alt/width/height; nur ein LCP-Bild je Seite, sonst unter dem ersten Bildschirm lazy', () => {
  for (const [f, t] of seiten) {
    for (const [, set] of t.matchAll(/srcset="([^"]+)"/g)) for (const teil of set.split(',')) {
      const d = join(PUB, teil.trim().split(' ')[0]);
      assert.ok(existsSync(d) && statSync(d).size <= 300 * 1024, `${f}: ${d}`);
    }
    let sofort = 0; // im ersten Bildschirm (z. B. erste Kartenreihe auf /leistungen): ohne lazy, höchstens 3 je Seite
    for (const [img] of t.matchAll(/<img [^>]+>/g)) {
      assert.match(img, /alt="[^"]*"/); assert.match(img, /width="\d+"/); assert.match(img, /height="\d+"/);
      if (/\/medien\//.test(img) && !/loading="lazy"|fetchpriority="high"/.test(img)) sofort++;
    }
    assert.ok(sofort <= 3, `${f}: ${sofort} Bilder ohne lazy/fetchpriority`);
    assert.ok((t.match(/fetchpriority="high"/g) || []).length <= 1);
  }
});

test('Links: ohne .html, Ziele und Anker vorhanden, aktuelle Seite markiert, noindex nur für Rechtliches/Fehler/Danke', () => {
  const sitemap = readFileSync(join(PUB, 'sitemap.xml'), 'utf8');
  for (const [f, t] of seiten) {
    const noindex = /<meta name="robots" content="noindex">/.test(t);
    assert.equal(noindex, NOINDEX.includes(f), `${f}: noindex`);
    const url = `${S.basis}/${f === 'index.html' ? '' : f.replace(/\.html$/, '')}`;
    assert.equal(sitemap.includes(`<loc>${url}</loc>`), !noindex, `${f}: Sitemap`);
    assert.doesNotMatch(t, /href="\/[a-z0-9-]+\.html/, `${f}: interner Link mit .html`);
    for (const [, h, a] of t.matchAll(/href="\/([a-z0-9-]*)(?:\?[^"#]*)?(?:#([a-z0-9-]+))?"/g)) {
      const ziel = alle[`${h || 'index'}.html`];
      assert.ok(ziel || ['favicon'].includes(h), `${f}: toter Link /${h}`);
      if (a) assert.ok(ziel.includes(`id="${a}"`), `${f}: Anker /${h}#${a} fehlt`);
    }
    for (const [, a] of t.matchAll(/href="#([a-z0-9-]+)"/g)) assert.ok(t.includes(`id="${a}"`), `${f}: Anker #${a}`);
    if (!NOINDEX.includes(f) && f !== 'index.html' && f !== 'angebot.html') {
      assert.match(t, new RegExp(`href="/${f.replace('.html', '')}"[^>]*aria-current="page"`), `${f}: aktuelle Seite nicht markiert`);
    }
  }
});

test('Alte Adressen werden dauerhaft umgeleitet, Ziele existieren, kein Kreis', () => {
  const r = readFileSync(join(PUB, '_redirects'), 'utf8').split('\n').filter((z) => z && !z.startsWith('#')).map((z) => z.trim().split(/\s+/));
  const quellen = r.map(([a]) => a);
  for (const alt of ['/reinigung/', '/service/', '/contacts/', '/ueber-uns/', '/kontakt/', '/impressum/', '/datenschutzerklaerung/', '/datenschutz/']) assert.ok(quellen.includes(alt), `${alt} fehlt`);
  for (const [a, b, code] of r) {
    assert.equal(code, '301');
    assert.ok(b === '/' || alle[`${b.slice(1)}.html`] || b === '/sitemap.xml', `${a} → ${b}: Ziel fehlt`);
    assert.ok(!quellen.includes(b), `${a} → ${b}: Kreis`);
  }
});

test('Formular: Honigtopf, Pflichtfelder, Datenschutz-Checkbox, POST an /api/kontakt, Muster gültig', () => {
  const t = alle['angebot.html'];
  assert.match(t, /<form class="formular" id="formular" action="\/api\/kontakt" method="post"/);
  assert.match(t, /<input id="firma_url" name="firma_url" type="text" tabindex="-1" autocomplete="off">/);
  for (const n of ['leistung', 'objektart', 'ort', 'name', 'telefon', 'datenschutz']) assert.match(t, new RegExp(`name="${n}"[^>]*required`), `${n} nicht Pflicht`);
  for (const n of ['flaeche', 'rhythmus', 'rueckruf', 'email', 'nachricht']) assert.match(t, new RegExp(`name="${n}"`), `${n} fehlt`);
  for (const [, p] of t.matchAll(/pattern="([^"]+)"/g)) assert.doesNotThrow(() => new RegExp(p, 'v'), `pattern ${p}`);
  const tel = new RegExp(`^(?:${t.match(/name="telefon"[^>]*pattern="([^"]+)"/)[1]})$`, 'v');
  assert.ok(tel.test('0173 185 35 63') && tel.test('+49 7161 9454270') && !tel.test('abc'));
  for (const [f, h] of seiten) assert.doesNotMatch(h, /<iframe|google\.com\/maps\/embed|maps\.googleapis/, `${f}: eingebettete Karte`);
});
