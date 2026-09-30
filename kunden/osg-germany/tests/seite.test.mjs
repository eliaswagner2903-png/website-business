// Regeln der OSG-Neugestaltung: HTML ist aktuell gebaut, Werkzeugfinder rechnet richtig, nur belegte Fakten,
// KI-Visuals gekennzeichnet, Medien im Budget, JSON-LD nur mit sichtbaren Werten, nichts Fremdes geladen.
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
const text = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<wbr>/g, '').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&#8209;|\u2011/g, '-').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ');

test('HTML und finder.css sind aus inhalt/ gebaut und aktuell (node bauen.mjs)', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'osg-'));
  for (const d of ['bauen.mjs', 'inhalt']) cpSync(join(WURZEL, d), join(tmp, d), { recursive: true });
  cpSync(PUB, join(tmp, 'public'), { recursive: true });
  execFileSync(process.execPath, [join(tmp, 'bauen.mjs')], { env: { ...process.env, SCHEMA: '' } });
  for (const [f, t] of seiten) assert.equal(readFileSync(join(tmp, 'public', f), 'utf8'), t, `${f} ist veraltet: node bauen.mjs`);
  for (const f of ['css/finder.css', 'sitemap.xml']) assert.equal(readFileSync(join(tmp, 'public', f), 'utf8'), readFileSync(join(PUB, f), 'utf8'), `${f} veraltet`);
  rmSync(tmp, { recursive: true });
});

test('Genau eine H1 pro Seite, lang="de", Überschriften ohne Sprung', () => {
  for (const [f, t] of seiten) {
    assert.equal((t.match(/<h1[\s>]/g) || []).length, 1, `${f}: H1`);
    assert.match(t, /<html lang="de"/, `${f}: lang`);
    let vorher = 1;
    for (const [, n] of t.matchAll(/<h([1-6])[\s>]/g)) { assert.ok(+n <= vorher + 1, `${f}: Sprung auf h${n}`); vorher = +n; }
  }
});

test('Werkzeugfinder: Trefferzahl je Kombination stimmt mit den Daten, Leerzustand nur ohne Treffer', () => {
  const css = readFileSync(join(PUB, 'css/finder.css'), 'utf8');
  const V = ['alle', ...S.verfahren.map((v) => v.id)], W = ['alle', ...S.werkstoffe.map((w) => w.id)];
  for (const v of V) {
    for (const w of W) {
      const n = S.serien.filter((s) => (v === 'alle' || s.verfahren === v) && (w === 'alle' || s.werkstoffe.includes(w))).length;
      const leer = css.includes(`.finder:has(#fv-${v}:checked):has(#fw-${w}:checked) .finder-leer`);
      assert.equal(leer, n === 0, `${v}/${w}: Leerzustand falsch`);
      if (v === 'alle' && w === 'alle') continue;
      const soll = n === 1 ? '1 Serie passt' : `${n} Serien passen`;
      assert.ok(start.includes(`<span class="zahl zahl--${v}-${w}">${soll}</span>`), `${v}/${w}: Zahl falsch`);
      assert.ok(css.includes(`.zahl--${v}-${w} { display: inline; }`), `${v}/${w}: Zahl nie sichtbar`);
    }
  }
  // jede Karte trägt genau ihre Klassen, jede Serie hat eine Detailseite
  for (const s of S.serien) {
    assert.ok(start.includes(`<li class="serie v-${s.verfahren} ${s.werkstoffe.map((w) => `w-${w}`).join(' ')}">`), `${s.id}: Klassen`);
    assert.ok(alle['produkte.html'].includes(`id="serie-${s.id}"`), `${s.id}: keine Detailseite`);
  }
  // Radios ohne JS bedienbar: jedes Feld hat ein Label
  for (const [, id] of start.matchAll(/<input type="radio" id="([^"]+)"/g)) assert.ok(start.includes(`<label for="${id}">`), `${id}: Label fehlt`);
});

test('Fakten: Telefon, Adresse und E-Mail überall gleich; keine Preise; Kennzahlen aus der Quelle', () => {
  for (const [f, t] of seiten) {
    assert.ok(t.includes(`href="tel:${S.telefon_link}"`), `${f}: Telefon fehlt`);
    for (const [, n] of t.matchAll(/href="tel:([^"]+)"/g)) assert.equal(n, S.telefon_link, `${f}: abweichende Nummer ${n}`);
    for (const [, m] of t.matchAll(/href="mailto:([^"]+)"/g)) assert.equal(m, S.email, `${f}: abweichende E-Mail ${m}`);
    assert.ok(text(t).includes(`${S.strasse} D-${S.plz} ${S.ort}`), `${f}: Adresse fehlt im Fuß`);
    assert.doesNotMatch(t, /\d\s*(?:&nbsp;)?(?:€|EUR\b|Euro)/, `${f}: Preis mit Betrag`);
    assert.doesNotMatch(text(t), /lorem|ipsum|TODO|XXX/i, `${f}: Blindtext`);
  }
  for (const k of S.kennzahlen) assert.ok(start.includes(`<dd>${k.wert}</dd>`), `Kennzahl ${k.wert}`);
  assert.match(S._quelle, /de\.osgeurope\.com.*2026-09-30/);
});

test('KI-Visuals sichtbar gekennzeichnet und markiert; data-pruefen nur für KI-Bilder und Rechtstexte', () => {
  for (const [f, t] of seiten) {
    const figuren = [...t.matchAll(/<figure[\s\S]*?<\/figure>/g)].map((m) => m[0]);
    for (const fig of figuren) if (/\/medien\/(schaftfraeser|bohren|gewinden|fraesen|toolmanagement)-/.test(fig)) assert.match(fig, /<figcaption class="ki-hinweis" data-pruefen="KI-Visualisierung/, `${f}: KI-Bild ohne Kennzeichnung`);
    for (const [, g] of t.matchAll(/data-pruefen="([^"]+)"/g)) assert.match(g, /^(KI-Visualisierung|Rechtstext nicht erfinden)/, `${f}: unerwartete offene Angabe: ${g}`);
  }
  assert.match(alle['datenschutz.html'], /class="platzhalter" data-pruefen="Rechtstext nicht erfinden/);
});

test('Hero: Poster ist LCP (nicht lazy, fetchpriority), Film ≤ 1,5 MB in WebM und MP4, kein Autoplay im HTML', () => {
  const held = start.match(/<section class="held[\s\S]*?<\/section>/)[0];
  assert.match(held, /<img class="held-video-poster" src="\/medien\/schaftfraeser-hero-1016\.webp"[^>]*fetchpriority="high"/);
  assert.doesNotMatch(held, /loading="lazy"/);
  for (const typ of ['webm', 'mp4']) {
    const f = join(PUB, 'medien', `schaftfraeser-film.${typ}`);
    assert.ok(existsSync(f) && statSync(f).size <= 1.5 * 1024 * 1024, `${f} fehlt oder zu groß`);
  }
  assert.doesNotMatch(start, /<video/);
  assert.match(held, /class="held-video-knopf"/, 'Halt-Knopf fehlt (WCAG 2.2.2)');
});

test('Bilder: alle Quellen vorhanden, ≤ 300 KB, mit alt/width/height; unter dem ersten Bildschirm lazy', () => {
  for (const [f, t] of seiten) {
    for (const [, src] of t.matchAll(/(?:src|srcset)="(\/medien\/[^" ,]+)/g)) assert.ok(existsSync(join(PUB, src)), `${f}: ${src} fehlt`);
    for (const [, set] of t.matchAll(/srcset="([^"]+)"/g)) {
      for (const teil of set.split(',')) {
        const d = join(PUB, teil.trim().split(' ')[0]);
        assert.ok(existsSync(d) && statSync(d).size <= 300 * 1024, `${f}: ${d} fehlt oder > 300 KB`);
      }
    }
    for (const [img] of t.matchAll(/<img [^>]+>/g)) assert.match(img, /alt="[^"]*"[\s\S]*width="\d+"[\s\S]*height="\d+"|width="\d+"[\s\S]*height="\d+"[\s\S]*alt="/, `${f}: ${img.slice(0, 60)}`);
    const nachHeld = f === 'index.html' ? t.split('<section class="abschnitt finder"')[1] : t.split('</section>').slice(1).join('');
    // Ausnahme: das eine LCP-Bild einer Unterseite, das auf breiten Bildschirmen im ersten Bildschirm steht (fetchpriority="high")
    for (const [img] of nachHeld.matchAll(/<img [^>]*\/medien\/(?!osg-)[^>]+>/g)) assert.match(img, /loading="lazy"|fetchpriority="high"/, `${f}: Bild unter dem Hero nicht lazy`);
    assert.ok((t.match(/fetchpriority="high"/g) || []).length <= 1, `${f}: mehr als ein Bild mit fetchpriority="high"`);
  }
});

test('JSON-LD: Organisation nur auf der Startseite, jeder Textwert sichtbar', () => {
  const m = start.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(m, 'JSON-LD fehlt');
  const daten = JSON.parse(m[1]);
  const sichtbar = text(start);
  const pruefe = (o) => {
    for (const [k, v] of Object.entries(o)) {
      if (k.startsWith('@') || /url|logo/.test(k)) continue;
      if (typeof v === 'object') pruefe(v);
      else if (k !== 'addressCountry') assert.ok(sichtbar.includes(String(v)) || (k === 'name' && v === 'OSG Germany' && /<title>OSG Germany/.test(start)), `JSON-LD ${k}: „${v}“ nicht sichtbar`);
    }
  };
  assert.equal(daten['@context'], 'https://schema.org');
  daten['@graph'].forEach(pruefe);
  for (const [f, t] of seiten) if (f !== 'index.html') assert.doesNotMatch(t, /application\/ld\+json/, `${f}: JSON-LD doppelt`);
});

test('Schriften lokal: eine Vorlade-Datei, höchstens drei Schriftdateien, zweites Schema (P4), nichts Fremdes', () => {
  const marke = readFileSync(join(PUB, 'css/marke.css'), 'utf8');
  const dateien = [...marke.matchAll(/url\("\.\.\/fonts\/([^"]+)"\)/g)].map((m) => m[1]);
  assert.ok(dateien.length <= 3);
  for (const d of dateien) assert.ok(existsSync(join(PUB, 'fonts', d)) && statSync(join(PUB, 'fonts', d)).size < 60 * 1024, `${d} fehlt oder zu groß`);
  assert.match(marke, /\[data-schema="nacht"\]/, 'zweites Schema fehlt (P4)');
  for (const [f, t] of seiten) {
    assert.equal([...t.matchAll(/<link rel="preload"[^>]*as="font"[^>]*crossorigin>/g)].length, 1, `${f}: Schrift-Preload`);
    assert.doesNotMatch(t.replace(/<link rel="canonical"[^>]*>|<meta property="og:[^>]*>/g, ''), /<(link|script|img|source|video)[^>]+(href|src|srcset)="https?:/, `${f}: fremde Quelle`);
  }
});

test('Navigation: aktuelle Seite markiert, alle Seiten in der Sitemap, noindex nur für Rechtliches/Fehler/Danke', () => {
  const sitemap = readFileSync(join(PUB, 'sitemap.xml'), 'utf8');
  for (const [f, t] of seiten) {
    const noindex = /<meta name="robots" content="noindex">/.test(t);
    assert.equal(noindex, ['impressum.html', 'datenschutz.html', '404.html', 'nachricht-gesendet.html'].includes(f), `${f}: noindex falsch`);
    const url = `${S.basis}/${f === 'index.html' ? '' : f}`;
    assert.equal(sitemap.includes(`<loc>${url}</loc>`), !noindex, `${f}: Sitemap`);
    if (['produkte.html', 'service.html', 'kontakt.html'].includes(f)) assert.match(t, new RegExp(`<a href="/${f}" aria-current="page">`));
    for (const [, h] of t.matchAll(/href="\/([a-z-]+\.html)(?:#([a-z0-9-]+))?"/g)) assert.ok(alle[h], `${f}: toter Link /${h}`);
    for (const [, h, a] of t.matchAll(/href="\/([a-z-]+\.html)#([a-z0-9-]+)"/g)) assert.ok(alle[h].includes(`id="${a}"`), `${f}: Anker /${h}#${a} fehlt`);
  }
});
