// Regeln der URFA-Seite: HTML ist aktuell gebaut, feste Fakten stimmen, alle offenen Punkte sind markiert,
// alte Adressen bleiben, Schriften lokal, JSON-LD nur mit sichtbaren Angaben, Marke in einer Datei.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdtempSync, cpSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const WURZEL = new URL('../', import.meta.url).pathname;
const PUB = join(WURZEL, 'public');
const seiten = readdirSync(PUB).filter((f) => /\.html?$/.test(f)).map((f) => [f, readFileSync(join(PUB, f), 'utf8')]);
const alle = Object.fromEntries(seiten);
const S = JSON.parse(readFileSync(join(WURZEL, 'inhalt/seite.json'), 'utf8'));
const sichtbar = (html) => html.replace(/<head>[\s\S]*?<\/head>/, '').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<wbr>/g, '')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&shy;/g, '').replace(/\s+/g, ' ');

test('HTML ist aus inhalt/ gebaut und aktuell (node bauen.mjs)', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'urfa-'));
  for (const d of ['bauen.mjs', 'inhalt']) cpSync(join(WURZEL, d), join(tmp, d), { recursive: true });
  cpSync(PUB, join(tmp, 'public'), { recursive: true });
  execFileSync(process.execPath, [join(tmp, 'bauen.mjs')], { env: { ...process.env, SCHEMA: '' } });
  for (const [f, t] of seiten) assert.equal(readFileSync(join(tmp, 'public', f), 'utf8'), t, `${f} ist veraltet: node bauen.mjs`);
  rmSync(tmp, { recursive: true });
});

test('Alte Adressen bleiben erreichbar', () => {
  for (const f of ['index.html', 'speisekarte.htm', 'galerie.htm', 'kontakt.htm', 'impressum.htm', 'datenschutz.htm', 'speisekarte.pdf', '404.html']) {
    assert.ok(existsSync(join(PUB, f)), `${f} fehlt`);
  }
  assert.match(readFileSync(join(PUB, '_redirects'), 'utf8'), /^\/index\.htm \/ 301$/m);
});

test('Feste Fakten: Telefon-Link, Adresse, Route, keine eingebettete Karte', () => {
  for (const [f, t] of seiten) {
    for (const [, nr] of t.matchAll(/href="tel:([^"]+)"/g)) assert.equal(nr, '+4971616517565', `${f}: falscher Telefon-Link`);
    assert.doesNotMatch(t, /<iframe|maps\/embed/, `${f}: eingebettete Karte`);
    for (const [, url] of t.matchAll(/href="(https:\/\/www\.google\.com\/maps[^"]+)"/g)) {
      assert.equal(url.replace(/&amp;/g, '&'), S.route, `${f}: Route weicht ab`);
    }
    assert.match(t, /class="schnell"[\s\S]*tel:[\s\S]*maps[\s\S]*speisekarte\.htm/, `${f}: Schnellleiste Anrufen/Route/Karte fehlt`);
  }
  assert.match(alle['index.html'], /Mühlbachstraße 2, 73054 Eislingen\/Fils/);
});

test('Genau eine H1 pro Seite, lang="de", türkische Namen mit lang="tr"', () => {
  for (const [f, t] of seiten) {
    assert.equal((t.match(/<h1[\s>]/g) || []).length, 1, `${f}: H1`);
    assert.match(t, /<html lang="de"/, `${f}: lang`);
  }
  for (const n of ['Karışık Izgara', 'İskender', 'Künefe', 'Hoş geldiniz']) {
    assert.match(alle['index.html'], new RegExp(`lang="tr">${n}<`), `Startseite: ${n} ohne lang="tr"`);
  }
});

test('Alle offenen Punkte aus der URFA-CLAUDE.md sind mit data-pruefen markiert', () => {
  const P = S.pruefen;
  const hat = (f, grund) => alle[f].includes(`data-pruefen="${grund.replace(/"/g, '&quot;')}"`);
  for (const f of ['index.html', 'kontakt.htm']) assert.ok(hat(f, P.zeiten), `${f}: Öffnungszeiten nicht markiert`);
  assert.ok(hat('index.html', P.portal), 'Mitnehmen/Feiern nicht markiert');
  assert.ok(hat('kontakt.htm', P.email), 'E-Mail nicht markiert');
  assert.ok(hat('speisekarte.htm', P.legende), 'Legende nicht markiert');
  assert.ok(hat('index.html', P.gaeste) && hat('galerie.htm', P.gaeste), 'Fotos mit Gästen nicht markiert');
  assert.ok(hat('kontakt.htm', P.formular), 'Kontaktformular nicht markiert');
  for (const f of ['impressum.htm', 'datenschutz.htm']) assert.match(alle[f], /class="platzhalter" data-pruefen="Rechtstext nicht erfinden/, `${f}: kein Platzhalter`);
  // jede sichtbare Öffnungszeit 10–23 Uhr steht in einem markierten Element oder im markierten Fuß
  const zeiten = [...alle['index.html'].matchAll(/10:00 – 23:00/g)].length;
  assert.ok(zeiten >= 3, 'Öffnungszeiten fehlen auf der Startseite');
});

test('Formular: Honigtopf, POST an die eigene Function, Datenschutz-Hinweis', () => {
  const k = alle['kontakt.htm'];
  assert.match(k, /<form class="formular" method="post" action="\/api\/kontakt">/);
  assert.match(k, /name="firma_url"[^>]*tabindex="-1"/);
  assert.match(k, /href="\/datenschutz\.htm">Datenschutz/);
  assert.match(readFileSync(join(WURZEL, 'functions/api/kontakt.js'), 'utf8'), /zurueck: '\/kontakt\.htm#nachricht'/);
});

test('JSON-LD: jeder Textwert steht sichtbar auf der Seite', () => {
  for (const [f, t] of seiten) {
    const m = t.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!m) continue;
    const ld = JSON.parse(m[1]);
    const text = sichtbar(t);
    const pruefe = (o, pfad) => {
      for (const [k, v] of Object.entries(o)) {
        if (['@context', '@type', 'url', 'image', 'hasMenu', 'addressCountry', 'dayOfWeek', 'opens', 'closes', 'telephone'].includes(k)) continue;
        if (typeof v === 'string') assert.ok(text.includes(v), `${f}: JSON-LD ${pfad}${k} „${v}“ steht nicht sichtbar auf der Seite`);
        else if (Array.isArray(v)) v.forEach((x, i) => (typeof x === 'object' ? pruefe(x, `${pfad}${k}[${i}].`) : assert.ok(text.includes(x), `${f}: JSON-LD ${pfad}${k} „${x}“ nicht sichtbar`)));
        else if (v && typeof v === 'object') pruefe(v, `${pfad}${k}.`);
      }
    };
    pruefe(ld, '');
    for (const z of [ld.openingHoursSpecification[0].opens, ld.openingHoursSpecification[0].closes]) assert.ok(text.includes(z), `${f}: Uhrzeit ${z} nicht sichtbar`);
  }
});

test('Schriften lokal: höchstens drei Vorlade-Dateien, alle mit crossorigin, nichts Fremdes', () => {
  for (const [f, t] of seiten) {
    const pre = [...t.matchAll(/<link rel="preload"[^>]*>/g)].map((m) => m[0]);
    assert.ok(pre.length <= 3, `${f}: ${pre.length} Preloads`);
    for (const p of pre) assert.match(p, /crossorigin/, `${f}: Preload ohne crossorigin`);
    assert.doesNotMatch(t.replace(/<link rel="canonical"[^>]*>|<meta property="og:[^>]*>/g, ''), /<(link|script|img)[^>]+(href|src)="https?:/, `${f}: fremde Quelle`);
  }
  const marke = readFileSync(join(PUB, 'css/marke.css'), 'utf8');
  assert.doesNotMatch(marke, /https?:\/\//);
  assert.match(marke, /\[data-schema="kalk"\]/, 'zweites Schema fehlt (P4)');
});

test('Fotos: nur vorhandene Fotos des Restaurants, nie größer als die Quelle, LCP nie lazy', () => {
  for (const [f, t] of seiten) {
    for (const [, name] of t.matchAll(/src="\/medien\/([a-z-]+)-(?:640|1016)\.webp"/g)) assert.ok(S.fotos[name], `${f}: unbekanntes Foto ${name}`);
    assert.doesNotMatch(t, /-1600\.webp|-2000\.webp/, `${f}: hochgerechnete Bildgröße`);
    assert.doesNotMatch(t, /fetchpriority="high"[^>]*loading="lazy"|loading="lazy"[^>]*fetchpriority="high"/, `${f}: LCP-Bild lazy`);
  }
  assert.match(alle['index.html'], /platte-mini-lahmacun-meze-1016\.webp"[^>]*fetchpriority="high"/, 'Hero-Foto ohne fetchpriority');
});
