// Regeln der Portfolio-Seite: HTML ist aktuell gebaut, alle persönlichen Angaben sind Platzhalter mit data-pruefen,
// Musterseiten ehrlich gekennzeichnet, URFA nur als Entwurf, Preise nicht erfunden, Bilder vorhanden, Schriften lokal.
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
const markiert = (grund) => `data-pruefen="${grund.replace(/"/g, '&quot;')}"`;
const re = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('HTML ist aus inhalt/ gebaut und aktuell (node bauen.mjs)', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'portfolio-'));
  for (const d of ['bauen.mjs', 'inhalt']) cpSync(join(WURZEL, d), join(tmp, d), { recursive: true });
  cpSync(PUB, join(tmp, 'public'), { recursive: true });
  execFileSync(process.execPath, [join(tmp, 'bauen.mjs')], { env: { ...process.env, SCHEMA: '' } });
  for (const [f, t] of seiten) assert.equal(readFileSync(join(tmp, 'public', f), 'utf8'), t, `${f} ist veraltet: node bauen.mjs`);
  rmSync(tmp, { recursive: true });
});

test('Genau eine H1 pro Seite, lang="de"', () => {
  for (const [f, t] of seiten) {
    assert.equal((t.match(/<h1[\s>]/g) || []).length, 1, `${f}: H1`);
    assert.match(t, /<html lang="de"/, `${f}: lang`);
  }
});

test('Persönliche Angaben sind Platzhalter mit data-pruefen – nichts erfunden', () => {
  const P = S.pruefen;
  for (const k of ['studio', 'nachname', 'ort', 'telefon', 'email', 'foto', 'ueber', 'preis_website', 'preis_abo', 'formular']) {
    assert.ok(start.includes(markiert(P[k])), `Startseite: ${k} nicht markiert`);
  }
  // jeder sichtbare tel:/mailto:-Link trägt die Markierung
  for (const [f, t] of seiten) {
    for (const [a] of t.matchAll(/<a [^>]*href="(?:tel|mailto):[^"]*"[^>]*>/g)) assert.match(a, /data-pruefen=/, `${f}: Kontakt-Link ohne Markierung: ${a}`);
  }
  assert.match(start, /\[Studioname\]|>Studioname</, 'Arbeitstitel [Studioname] nicht sichtbar');
  for (const f of ['impressum.html', 'datenschutz.html']) assert.match(alle[f], /class="platzhalter" data-pruefen="Rechtstext nicht erfinden/, `${f}: kein Platzhalter`);
});

test('Preise sind nicht erfunden: kein Euro-Betrag, nur „auf Anfrage“ mit Markierung', () => {
  for (const [f, t] of seiten) assert.doesNotMatch(t, /\d\s*(?:&nbsp;)?(?:€|EUR|Euro)/, `${f}: Preis mit Betrag`);
  const abo = [...start.matchAll(new RegExp(`${re(markiert(S.pruefen.preis_abo))}>[^<]*auf Anfrage`, 'g'))].length;
  assert.equal(abo, 6, 'Abo-Preise: je Paket in Tabelle und Karte markiert');
  assert.match(start, new RegExp(`${re(markiert(S.pruefen.preis_website))}>Preis auf Anfrage`));
});

test('Arbeiten: Musterseiten gekennzeichnet, URFA als Entwurf mit Freigabe-Vermerk, Vorschaubilder vorhanden', () => {
  for (const a of S.arbeiten) {
    assert.match(start, new RegExp(`id="arbeit-${a.id}"`), `${a.id}: fehlt`);
    for (const art of ['desktop', 'handy']) {
      for (const typ of ['avif', 'webp']) {
        const f = join(PUB, 'medien', `arbeit-${a.id}-${art}-${art === 'desktop' ? 1016 : 320}.${typ}`);
        assert.ok(existsSync(f), `${f} fehlt`);
        assert.ok(statSync(f).size < 120 * 1024, `${f} zu groß`);
      }
    }
    assert.ok(a.werte.perf >= 95 && a.werte.kb > 0, `${a.id}: Messwerte fehlen`);
  }
  for (const n of ['hell', 'laut', 'edel']) assert.match(start, new RegExp(`id="arbeit-${n}"[\\s\\S]*?Musterseite – `), `${n}: nicht als Musterseite gekennzeichnet`);
  assert.match(start, new RegExp(`<span class="werk-art" ${re(markiert(S.pruefen.urfa))}>Entwurf für ein echtes Restaurant`));
  assert.doesNotMatch(start, /URFA[^<]{0,80}(Kunde|live|online seit)/i, 'URFA darf nicht als Live-Kunde erscheinen');
  assert.match(start, /fetchpriority="high"|loading="lazy"/);
  // Hero-Bilder nie lazy (LCP/erster Bildschirm)
  const held = start.match(/<section class="held"[\s\S]*?<\/section>/)[0];
  assert.doesNotMatch(held, /loading="lazy"/, 'Bild im ersten Bildschirm lazy');
});

test('Formular: Honigtopf, POST an die eigene Function, Datenschutz-Hinweis', () => {
  assert.match(start, /<form class="formular" method="post" action="\/api\/kontakt">/);
  assert.match(start, /name="firma_url"[^>]*tabindex="-1"/);
  assert.match(start, /href="\/datenschutz\.html">Datenschutz/);
  assert.match(readFileSync(join(WURZEL, 'functions/api/kontakt.js'), 'utf8'), /zurueck: '\/#kontakt'/);
});

test('Schriften lokal: höchstens drei Vorlade-Dateien mit crossorigin, nichts Fremdes, zweites Schema (P4)', () => {
  for (const [f, t] of seiten) {
    const pre = [...t.matchAll(/<link rel="preload"[^>]*>/g)].map((m) => m[0]);
    assert.ok(pre.length <= 3, `${f}: ${pre.length} Preloads`);
    for (const p of pre) { assert.match(p, /crossorigin/); assert.ok(existsSync(join(PUB, p.match(/href="\/([^"]+)"/)[1])), `${f}: ${p} fehlt`); }
    assert.doesNotMatch(t.replace(/<link rel="canonical"[^>]*>|<meta property="og:[^>]*>/g, ''), /<(link|script|img|source)[^>]+(href|src|srcset)="https?:/, `${f}: fremde Quelle`);
    for (const [, src] of t.matchAll(/(?:src|srcset)="(\/medien\/[^" ]+)/g)) assert.ok(existsSync(join(PUB, src)), `${f}: ${src} fehlt`);
  }
  const marke = readFileSync(join(PUB, 'css/marke.css'), 'utf8');
  assert.doesNotMatch(marke, /https?:\/\//);
  assert.match(marke, /\[data-schema="nacht"\]/, 'zweites Schema fehlt (P4)');
});
