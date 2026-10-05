// Regeln der Portfolio-Seite: HTML ist aktuell gebaut, alle persönlichen Angaben sind Platzhalter mit data-pruefen,
// Musterseiten ehrlich gekennzeichnet, nur fiktive Marken, Preise nicht erfunden, Bilder vorhanden, Schriften lokal.
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
  for (const k of ['studio', 'ort', 'telefon', 'email', 'preis_website', 'preis_abo', 'formular']) {
    if (!P[k]) continue; // von Elias bestätigte Angabe (Ort, Telefon entfällt)
    assert.ok(start.includes(markiert(P[k])), `Startseite: ${k} nicht markiert`);
  }
  // jeder sichtbare tel:/mailto:-Link trägt die Markierung
  for (const [f, t] of seiten) {
    for (const [a] of t.matchAll(/<a [^>]*href="(?:tel|mailto):[^"]*"[^>]*>/g)) assert.match(a, /data-pruefen=/, `${f}: Kontakt-Link ohne Markierung: ${a}`);
  }
  assert.ok(start.includes(`${markiert(P.studio)}>${S.studio}<`), 'Arbeitstitel nicht sichtbar markiert');
  for (const f of ['impressum.html', 'datenschutz.html']) assert.match(alle[f], /class="platzhalter" data-pruefen="Rechtstext nicht erfinden/, `${f}: kein Platzhalter`);
});

test('Preise: nur die von Elias gesetzten Beträge (1.490 €, 75 €), markiert', () => {
  const erlaubt = /^(?:1\.490|75)$/;
  for (const [f, t] of seiten) for (const [, n] of t.matchAll(/(\d[\d.]*)\s*(?:&nbsp;)?(?:€|EUR|Euro)/g)) assert.match(n, erlaubt, `${f}: nicht gesetzter Preis ${n}`);
  assert.match(start, new RegExp(`${re(markiert(S.pruefen.preis_abo))}>ab 75`), 'Abo-Preis: markierte Angabe');
  assert.match(start, new RegExp(`${re(markiert(S.pruefen.preis_website))}>ab 1\\.490`), 'Website-Preis: markierte Angabe');
});

test('Arbeiten: fünf Musterseiten (nur fiktive Marken), Vorschaubilder und Messwerte vorhanden', () => {
  for (const a of S.arbeiten) {
    assert.match(start, new RegExp(`id="arbeit-${a.id}"`), `${a.id}: fehlt`);
    for (const art of ['desktop', 'handy']) {
      for (const typ of ['avif', 'webp']) {
        const f = join(PUB, 'medien', `arbeit-${a.id}-${art}-lang-${art === 'desktop' ? 800 : 320}.${typ}`);
        assert.ok(existsSync(f), `${f} fehlt`);
        assert.ok(statSync(f).size < 120 * 1024, `${f} zu groß`);
      }
    }
    if (a.werte) assert.ok(a.werte.perf >= 95 && a.werte.kb > 0, `${a.id}: Messwerte fehlen`);
    else assert.equal(a.id, 'klarwerk', `${a.id}: Messwerte fehlen (nur Klarwerk ist unvermessen)`);
  }
  for (const n of ['hell', 'laut', 'edel', 'glut', 'klarwerk']) assert.match(start, new RegExp(`id="arbeit-${n}"[\\s\\S]*?Musterseite[ ·<]`), `${n}: nicht als Musterseite benannt`);
  // Nur fiktive Firmen: keine echten Namen, Orte oder Telefonnummern aus Kundenprojekten, weder im Text noch in Dateinamen
  const echt = /urfa|sofrasi|\bOSG\b|ümit|uemit|hairstyle|mühlbach|7161/i;
  for (const [f, t] of seiten) assert.doesNotMatch(t, echt, `${f}: echter Firmenbezug`);
  assert.doesNotMatch(JSON.stringify(S), echt, 'seite.json: echter Firmenbezug');
  // Eislingen ist Elias’ eigener Ort (04.10.), darf aber nie in den Texten der Arbeiten stehen
  assert.doesNotMatch(JSON.stringify(S.arbeiten), /eislingen/i, 'Eislingen in den Arbeiten');
  assert.deepEqual(readdirSync(join(PUB, 'medien')).filter((f) => echt.test(f)), [], 'echter Firmenname in Dateinamen');
  assert.match(start, /fetchpriority="high"|loading="lazy"/);
  // Erster Bildschirm ist der helle Hero mit dem Lotlinie-Gerätepaar: dessen Bilder nie lazy (LCP ist die Überschrift, die Bilder dürfen ihr keine Bandbreite nehmen).
  // Erster Bildschirm ist das helle Kino (Werktisch in Waldgrün): sein Startbild ist das LCP-Bild, nie lazy.
  assert.match(start, /<section class="kino"[\s\S]*?<picture class="kino-bild kino-bild--anfang">[\s\S]*?fetchpriority="high"/, 'Kino-Startbild nicht bevorzugt');
  assert.match(start, /<section class="kino"[\s\S]*?<h1 id="titel">/, 'H1 nicht im Kino');
  // erste Arbeit auf der Bühne nicht lazy, Links nur zu den drei Musterseiten, alle mit Vorschau-Link
  for (const a of S.arbeiten) {
    const werk = start.match(new RegExp(`<article class="werk werk--${a.id}"[\\s\\S]*?</article>`))[0];
    assert.match(werk, new RegExp(`href="${re(a.link)}" target="_blank" rel="noopener" ${re(markiert(S.pruefen.link))}`), `${a.id}: Link fehlt`);
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
  assert.match(marke, /\[data-schema="licht"\]/, 'zweites Schema fehlt (P4)');
});

test('Kein Stil-Konfigurator: Abschnitt, Auswahlfelder und Anker sind weg, Kontaktformular bleibt', async () => {
  assert.doesNotMatch(start, /id="stile"|href="#stile"|class="[^"]*(konfig|stil-karte|stil-raster)|name="(stil|farbe)"|kontakt-auswahl/);
  assert.equal(S.stile, undefined);
  assert.equal(S.stile_kopf, undefined);
  assert.equal(S.pruefen.stile, undefined);
  const mod = await import('../functions/api/kontakt.js');
  assert.equal(mod.konfigAuswahl, undefined);
  assert.equal(mod.STILE, undefined);
  assert.doesNotMatch(readFileSync(join(PUB, 'js/seite.js'), 'utf8'), /\.konfig|stil-karte|kontakt-auswahl/);
  assert.doesNotMatch(readFileSync(join(PUB, 'css/stil.css'), 'utf8'), /\.(stil-|konfig|farbfleck|schriftprobe|wahl|kontakt-auswahl)/);
  for (const n of ['name', 'email', 'nachricht', 'firma_url']) assert.match(start, new RegExp(`<form class="formular" id="kontaktformular"[\\s\\S]*name="${n}"`));
});

test('Kein Selbstbau und keine offene Preismechanik auf der Seite', () => {
  for (const [f, t] of seiten) {
    const sichtbar = t.replace(/<script[\s\S]*?<\/script>/g, '').replace(/ data-pruefen="[^"]*"/g, '');
    assert.doesNotMatch(sichtbar, /Konfigurator|Website-Generator|stuft jeden Bereich|offen gerechnet|offenen Formel|Jede Position|erhöht den Monatspreis|konfig-preis/i, `${f}: alter Wortlaut`);
    assert.doesNotMatch(sichtbar, /type="range"|class="generator|vorschau-seite|einstufung|role="tab" id="gt-|name="bausteine|name="branche|name="stufe_/, `${f}: Selbstbau-Bedienung`);
  }
  assert.doesNotMatch(readFileSync(join(PUB, 'js/seite.js'), 'utf8'), /generator|regler|branche|bausteine\[/i);
  assert.doesNotMatch(readFileSync(join(PUB, 'css/stil.css'), 'utf8'), /\.generator|\.regler|\.vorschau-|\.einstufung|\.gen-|stufen-liste/);
  assert.doesNotMatch(start, /href="#konfigurator"/);
});

test('Kino: Film nur für Computer ≤ 12 MB und Handy ≤ 5 MB (P2), beide Formate, CSP erlaubt blob:', () => {
  for (const [datei, grenze] of [['tisch-film-1280', 12], ['tisch-film-960', 5]]) {
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
