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
  assert.equal(abo, 1, 'Abo-Preis: eine markierte Angabe (Grundbetreuung plus Wahlleistungen)');
  assert.match(start, new RegExp(`${re(markiert(S.pruefen.preis_website))}>Preis auf Anfrage`));
});

test('Arbeiten: vier Musterseiten (nur fiktive Marken), Vorschaubilder und Messwerte vorhanden', () => {
  for (const a of S.arbeiten) {
    assert.match(start, new RegExp(`id="arbeit-${a.id}"`), `${a.id}: fehlt`);
    for (const art of ['desktop', 'handy']) {
      for (const typ of ['avif', 'webp']) {
        const f = join(PUB, 'medien', `arbeit-${a.id}-${art}-lang-${art === 'desktop' ? 800 : 320}.${typ}`);
        assert.ok(existsSync(f), `${f} fehlt`);
        assert.ok(statSync(f).size < 120 * 1024, `${f} zu groß`);
      }
    }
    assert.ok(a.werte.perf >= 95 && a.werte.kb > 0, `${a.id}: Messwerte fehlen`);
  }
  for (const n of ['hell', 'laut', 'edel', 'glut']) assert.match(start, new RegExp(`id="arbeit-${n}"[\\s\\S]*?Musterseite[ ·<]`), `${n}: nicht als Musterseite benannt`);
  // Nur fiktive Firmen: keine echten Namen, Orte oder Telefonnummern aus Kundenprojekten, weder im Text noch in Dateinamen
  const echt = /urfa|sofrasi|eislingen|\bOSG\b|ümit|uemit|hairstyle|mühlbach|7161/i;
  for (const [f, t] of seiten) assert.doesNotMatch(t, echt, `${f}: echter Firmenbezug`);
  assert.doesNotMatch(JSON.stringify(S), echt, 'seite.json: echter Firmenbezug');
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

test('Stilvorschläge: Stil und Farbe am Formular, Werte wie in der Function erlaubt, je Stil Schriftprobe, Farben und Musterseite', async () => {
  const { konfigAuswahl, STILE } = await import('../functions/api/kontakt.js');
  const K = S.stile;
  // Wertebereich der Function = Inhalt der Seite (nur Stil und Farbe)
  assert.deepEqual(Object.keys(STILE), ['stil', 'farbe']);
  assert.deepEqual(K.stile.map((s) => s.id), STILE.stil);
  assert.deepEqual(K.farben.map((f) => f.id), STILE.farbe);
  assert.match(start, /<section class="abschnitt konfig" id="stile" aria-labelledby="t-stile">/);
  for (const s of K.stile) {
    const karte = start.match(new RegExp(`<li class="stil-karte stil-karte--${s.id}">[\\s\\S]*?</li>`))?.[0];
    assert.ok(karte, `${s.id}: Karte fehlt`);
    assert.match(karte, new RegExp(`<input type="radio" id="k-stil-${s.id}" name="stil" value="${s.id}" form="kontaktformular">`), `${s.id}: Stil-Radio`);
    assert.match(karte, new RegExp(`schriftprobe--${s.id}`), `${s.id}: Schriftprobe fehlt`);
    assert.ok(s.farben.length >= 3 && s.farben.length <= 4, `${s.id}: 3 bis 4 Farbvorschläge`);
    for (const f of s.farben) {
      assert.match(karte, new RegExp(`<input type="radio" id="k-farbe-${s.id}-${f}" name="farbe" value="${f}" form="kontaktformular">`), `${s.id}/${f} fehlt`);
      assert.ok(STILE.farbe.includes(f), `${f}: von der Function nicht erlaubt`);
    }
    // Musterseite: gleiche id wie bei den Arbeiten, Name, Link (markiert) und vorhandenes Bild
    const a = S.arbeiten.find((x) => x.id === s.id);
    assert.ok(a, `${s.id}: keine Musterseite`);
    assert.ok(karte.includes(a.name) && karte.includes('Musterseite'), `${s.id}: Musterseite nicht benannt`);
    assert.match(karte, new RegExp(`href="${re(a.link)}" target="_blank" rel="noopener" ${re(markiert(S.pruefen.link))}`), `${s.id}: Link fehlt`);
    assert.match(karte, new RegExp(`/medien/arbeit-${s.id}-handy-lang-320\\.webp`));
    assert.match(karte, /width="320" height="\d+" alt="[^"]+" loading="lazy"/, `${s.id}: Bild ohne Maße oder Alt`);
  }
  for (const f of K.farben) assert.match(readFileSync(join(PUB, 'css/stil.css'), 'utf8'), new RegExp(`\\.farbfleck--${f.id}\\b`), `Farbfleck ${f.id} ohne CSS`);
  // Die Function nimmt nur Stil und Farbe, alles andere fällt still weg
  const fd = new FormData(); fd.append('stil', 'laut'); fd.append('farbe', 'kobalt');
  assert.deepEqual(konfigAuswahl(fd), { Stil: 'Modern', Farbe: 'Kobalt' });
  const boese = new FormData();
  for (const [k, v] of [['stil', '<script>'], ['farbe', 'toString'], ['bausteine[]', 'galerie'], ['stufe_sicherheit', '3'], ['branche', 'praxis']]) boese.append(k, v);
  assert.deepEqual(konfigAuswahl(boese), {});
});

test('Kein Selbstbau und keine offene Preismechanik auf der Seite', () => {
  for (const [f, t] of seiten) {
    const sichtbar = t.replace(/<script[\s\S]*?<\/script>/g, '').replace(/ data-pruefen="[^"]*"/g, '');
    assert.doesNotMatch(sichtbar, /Konfigurator|Website-Generator|stuft jeden Bereich|offen gerechnet|offenen Formel|Jede Position|erhöht den Monatspreis|konfig-preis/i, `${f}: alter Wortlaut`);
    assert.doesNotMatch(sichtbar, /type="range"|class="generator|vorschau-seite|einstufung|role="tab" id="gt-|name="bausteine|name="branche|name="stufe_/, `${f}: Selbstbau-Bedienung`);
  }
  assert.doesNotMatch(readFileSync(join(PUB, 'js/seite.js'), 'utf8'), /generator|regler|branche|bausteine\[/i);
  assert.doesNotMatch(readFileSync(join(PUB, 'css/stil.css'), 'utf8'), /\.generator|\.regler|\.vorschau-|\.einstufung|\.gen-|stufen-liste/);
  // Navigation und Fuß nennen „Stile“
  assert.match(start, /<li><a href="#stile">Stile<\/a><\/li>/);
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
