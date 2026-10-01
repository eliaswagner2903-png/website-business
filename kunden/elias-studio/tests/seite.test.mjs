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

test('Konfigurator: alle Felder am Formular, Werte wie in der Function erlaubt, Vorschau-Regeln für jede Wahl', async () => {
  const { konfigAuswahl, STUFEN } = await import('../functions/api/kontakt.js');
  const css = readFileSync(join(PUB, 'css/stil.css'), 'utf8');
  const K = S.konfigurator;
  const gruppen = { branche: K.branchen, farbe: K.farben, stil: K.stile, bausteine: K.bausteine };
  for (const [name, liste] of Object.entries(gruppen)) {
    for (const w of liste) {
      assert.match(start, new RegExp(`<input type="(radio|checkbox)" id="k-${name}-${w.id}" name="${name}${name === 'bausteine' ? '\\[\\]' : ''}" value="${w.id}" form="kontaktformular"`), `${name}/${w.id} fehlt`);
      const fd = new FormData(); fd.append(name === 'bausteine' ? 'bausteine[]' : name, w.id);
      assert.equal(konfigAuswahl(fd)[name], w.id, `${name}/${w.id} wird von der Function verworfen`);
    }
  }
  // Reihenfolge nach Elias: Business, Farbe, Schrift, dann die Regler (Sicherheit zuerst)
  const legenden = [...start.matchAll(/<legend><span class="feld-nr">(\d+)<\/span> ([^<]+)<\/legend>/g)].map((m) => m[2]);
  assert.deepEqual(legenden.slice(0, 4), ['Ihr Business', 'Farbe', 'Schrift und Stil', 'Sicherheit']);
  // Generator: je Schritt ein Reiter, der auf sein Feld zeigt
  legenden.forEach((_, i) => assert.match(start, new RegExp(`role="tab" id="gt-${i + 1}" aria-controls="gs-${i + 1}"[\\s\\S]*<fieldset class="schritt-feld[^"]*" id="gs-${i + 1}">`), `Reiter/Feld ${i + 1} fehlt`));
  // Jeder Bereich: Regler 1–5 am Formular, fünf Stufen, gleiche Namen wie in der Function
  assert.deepEqual(K.stufen.map((s) => s.id), Object.keys(STUFEN));
  for (const st of K.stufen) {
    assert.match(start, new RegExp(`<input class="regler-feld" type="range" id="k-stufe-${st.id}" name="stufe_${st.id}" min="1" max="5" step="1" value="${st.start}" form="kontaktformular">`), `Regler ${st.id} fehlt`);
    assert.equal(st.stufen.length, 5, `${st.id}: nicht fünf Stufen`);
    assert.deepEqual([st.name, ...st.stufen.map(([n]) => n)], STUFEN[st.id], `${st.id}: Namen weichen von der Function ab`);
    const fd = new FormData(); fd.append(`stufe_${st.id}`, '3');
    assert.equal(konfigAuswahl(fd)[st.name], `Stufe 3 von 5 (${st.stufen[2][0]})`);
  }
  // Vorschau: jede Wahl außer der Grundeinstellung hat eine :has()-Regel
  for (const s of K.stile.slice(1)) assert.match(css, new RegExp(`#k-stil-${s.id}:checked`), `Stil ${s.id} ohne Vorschau`);
  for (const f of K.farben.slice(1)) assert.match(css, new RegExp(`#k-farbe-${f.id}:checked`), `Farbe ${f.id} ohne Vorschau`);
  for (const b of K.branchen) assert.match(css, new RegExp(`#k-branche-${b.id}:checked\\) \\.nach-branche--${b.id}`), `Branche ${b.id} ohne Vorschau`);
  for (const b of K.bausteine) assert.match(css, new RegExp(`#k-bausteine-${b.id}:checked\\) \\.vb--${b.id}`), `Baustein ${b.id} ohne Vorschau`);
  // Fremde Werte fallen still weg
  const boese = new FormData();
  for (const [k, v] of [['stil', '<script>'], ['bausteine[]', 'galerie'], ['bausteine[]', 'x'], ['stufe_sicherheit', '9'], ['stufe_design', '2<b>'], ['stufe_umfang', '0']]) boese.append(k, v);
  assert.deepEqual(konfigAuswahl(boese), { bausteine: 'galerie' });
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
