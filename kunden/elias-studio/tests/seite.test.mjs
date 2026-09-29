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
  assert.ok(start.includes(`${markiert(P.studio)}>${S.studio}<`), 'Arbeitstitel nicht sichtbar markiert');
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
  const kino = start.match(/<section class="kino"[\s\S]*?<\/section>/)[0];
  assert.match(kino, /werkbank-anfang-1280\.webp"[^>]*fetchpriority="high"/, 'Poster im ersten Bildschirm nicht bevorzugt');
  assert.doesNotMatch(kino.match(/<picture class="kino-bild kino-bild--anfang">[\s\S]*?<\/picture>/)[0], /loading="lazy"/, 'Poster lazy');
  // erste Arbeit auf der Bühne nicht lazy, Links nur zu den drei Musterseiten, URFA ohne Link (Freigabe fehlt)
  for (const a of S.arbeiten) {
    const werk = start.match(new RegExp(`<article class="werk werk--${a.id}"[\\s\\S]*?</article>`))[0];
    if (a.id === 'urfa') assert.doesNotMatch(werk, /href="https:/, 'URFA ohne Freigabe verlinkt');
    else assert.match(werk, new RegExp(`href="${re(a.link)}" target="_blank" rel="noopener" ${re(markiert(S.pruefen.link))}`), `${a.id}: Link fehlt`);
  }
});

test('Formular: Honigtopf, POST an die eigene Function, Datenschutz-Hinweis', () => {
  assert.match(start, /<form class="formular" id="kontaktformular" method="post" action="\/api\/kontakt">/);
  assert.match(start, /name="firma_url"[^>]*tabindex="-1"/);
  assert.match(start, /href="\/datenschutz\.html">Datenschutz/);
  assert.match(readFileSync(join(WURZEL, 'functions/api/kontakt.js'), 'utf8'), /zurueck: '\/#kontakt'/);
});

test('Schriften lokal: höchstens drei Vorlade-Dateien mit crossorigin, nichts Fremdes, zweites Schema (P4)', () => {
  for (const [f, t] of seiten) {
    const pre = [...t.matchAll(/<link rel="preload"[^>]*as="font"[^>]*>/g)].map((m) => m[0]);
    assert.ok(pre.length <= 3, `${f}: ${pre.length} Schrift-Preloads`);
    for (const p of pre) { assert.match(p, /crossorigin/); assert.ok(existsSync(join(PUB, p.match(/href="\/([^"]+)"/)[1])), `${f}: ${p} fehlt`); }
    assert.doesNotMatch(t.replace(/<link rel="canonical"[^>]*>|<meta property="og:[^>]*>/g, ''), /<(link|script|img|source)[^>]+(href|src|srcset)="https?:/, `${f}: fremde Quelle`);
    for (const [, src] of t.matchAll(/(?:src|srcset)="(\/medien\/[^" ]+)/g)) assert.ok(existsSync(join(PUB, src)), `${f}: ${src} fehlt`);
  }
  const marke = readFileSync(join(PUB, 'css/marke.css'), 'utf8');
  assert.doesNotMatch(marke, /https?:\/\//);
  assert.match(marke, /\[data-schema="nacht"\]/, 'zweites Schema fehlt (P4)');
});

test('Konfigurator: alle Felder am Formular, Werte wie in der Function erlaubt, Vorschau-Regeln für jede Wahl', async () => {
  const { konfigAuswahl } = await import('../functions/api/kontakt.js');
  const css = readFileSync(join(PUB, 'css/stil.css'), 'utf8');
  const K = S.konfigurator;
  const gruppen = { stil: K.stile, farbe: K.farben, branche: K.branchen, sicherheit: K.sicherheit, bausteine: K.bausteine };
  for (const [name, liste] of Object.entries(gruppen)) {
    for (const w of liste) {
      assert.match(start, new RegExp(`<input type="(radio|checkbox)" id="k-${name}-${w.id}" name="${name}${name === 'bausteine' ? '\\[\\]' : ''}" value="${w.id}" form="kontaktformular"`), `${name}/${w.id} fehlt`);
      const fd = new FormData(); fd.append(name === 'bausteine' ? 'bausteine[]' : name, w.id);
      assert.equal(konfigAuswahl(fd)[name], w.id, `${name}/${w.id} wird von der Function verworfen`);
    }
  }
  // Vorschau: jede Wahl außer der Grundeinstellung hat eine :has()-Regel
  for (const s of K.stile.slice(1)) assert.match(css, new RegExp(`#k-stil-${s.id}:checked`), `Stil ${s.id} ohne Vorschau`);
  for (const f of K.farben.slice(1)) assert.match(css, new RegExp(`#k-farbe-${f.id}:checked`), `Farbe ${f.id} ohne Vorschau`);
  for (const b of K.branchen) assert.match(css, new RegExp(`#k-branche-${b.id}:checked\\) \\.nach-branche--${b.id}`), `Branche ${b.id} ohne Vorschau`);
  for (const b of K.bausteine) assert.match(css, new RegExp(`#k-bausteine-${b.id}:checked\\) \\.vb--${b.id}`), `Baustein ${b.id} ohne Vorschau`);
  // Fremde Werte fallen still weg
  const boese = new FormData(); boese.append('stil', '<script>'); boese.append('bausteine[]', 'galerie'); boese.append('bausteine[]', 'x');
  assert.deepEqual(konfigAuswahl(boese), { bausteine: 'galerie' });
});

test('Kino: Film nur für Computer ≤ 12 MB und Handy ≤ 5 MB (P2), beide Formate, CSP erlaubt blob:', () => {
  for (const [datei, grenze] of [['werkbank-film-1280', 12], ['werkbank-film-960', 5]]) {
    for (const typ of ['mp4', 'webm']) {
      const f = join(PUB, 'medien', `${datei}.${typ}`);
      assert.ok(existsSync(f), `${f} fehlt`);
      assert.ok(statSync(f).size < grenze * 1024 * 1024, `${f} über ${grenze} MB`);
    }
  }
  assert.match(start, /<video class="kino-film" muted playsinline preload="none"/);
  assert.doesNotMatch(start, /<video[^>]*autoplay/);
  assert.match(readFileSync(join(PUB, '_headers'), 'utf8'), /media-src 'self' blob:/);
});
