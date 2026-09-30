// Tests des Qualitätssystems: Regeln sind vollständig verdrahtet, Aufträge werden richtig verstanden.
// node --test werkzeuge/tests/*.test.mjs
import test from 'node:test'; import assert from 'node:assert/strict';
import fs from 'node:fs'; import path from 'node:path';
import { REPO, FG, ladeWissen, leseAuftrag, erstellePlan, verbindlichkeit } from '../regeln.mjs';

const W = ladeWissen();
const plan = text => erstellePlan(leseAuftrag(text, W), W);
const prio = (p, k) => p.aktiv[k]?.prio;
const alleRegeln = Object.values(W.gebiete).flatMap(g => g.regeln);

test('Wissen: alle Fachgebiete mit Regeln, globale Regeln nur in GLOBAL.md', () => {
  assert.ok(Object.keys(W.gebiete).length >= 11);
  for (const g of Object.values(W.gebiete)) assert.ok(g.regeln.length >= 5, `${g.key} hat zu wenige Regeln`);
  assert.ok(W.gebiete.global.regeln.every(r => r.stufe === 'G'));
});

test('Jede Prüf-ID einer Regel gibt es in qualitaet.mjs', () => {
  const src = fs.readFileSync(path.join(REPO, 'werkzeuge/qualitaet.mjs'), 'utf8');
  const ids = new Set([...src.matchAll(/^\s+'?([a-z0-9-]+)'?: \(\) =>/gm), ...src.matchAll(/erg\['([a-z0-9-]+)'\]/g)].map(m => m[1]));
  const fehlt = alleRegeln.flatMap(r => r.pruefung.filter(p => !ids.has(p)).map(p => `${r.id}: ${p}`));
  assert.deepEqual(fehlt, []);
});

test('Jede Quellen-ID im Beleg steht im Quellenregister, keine Regel ohne Beleg', () => {
  const q = fs.readFileSync(path.join(REPO, 'wissen/quellen/QUELLEN.md'), 'utf8');
  const bekannt = new Set([...q.matchAll(/^\| (Q-[A-Z]\d{2}) \|/gm)].map(m => m[1]));
  for (const r of alleRegeln) {
    const ids = r.beleg.match(/Q-[A-Z]\d{2}/g) || [];
    assert.ok(ids.length, `${r.id} ohne Quelle`);
    for (const id of ids) assert.ok(bekannt.has(id), `${r.id}: ${id} fehlt im Register`);
  }
});

test('Auftrag im Format von Elias (Werte in eigener Zeile, Prioritätenblock)', () => {
  const p = plan(`Kunde:\nUrfa Sofrası\n\nBranche:\nRestaurant\n\nOrt:\nEislingen\n\nWebsite:\nJa\n\nSEO:\nJa\n\nLocal SEO:\nJa\n\nGEO:\nJa\n\nTechnical SEO:\nJa\n\nCRO:\nJa\n\nPerformance:\nJa\n\nAccessibility:\nJa\n\nPrioritäten:\n\nLocal SEO: sehr hoch\nSEO: hoch\nGEO: hoch\nPerformance: hoch\nCRO: mittel\n\nBesondere Wünsche:\nModern, hochwertig, mobil optimiert.`);
  assert.equal(p.auftrag.kunde, 'Urfa Sofrası'); assert.equal(p.auftrag.ort, 'Eislingen');
  assert.equal(p.auftrag.brancheInfo.typ, 'Restaurant');
  assert.deepEqual([prio(p, 'local-seo'), prio(p, 'seo'), prio(p, 'geo'), prio(p, 'performance'), prio(p, 'cro'), prio(p, 'technical-seo'), prio(p, 'accessibility')], [5, 4, 4, 4, 3, 3, 3]);
  assert.equal(prio(p, 'structured-data'), 3, 'Local SEO hebt Strukturierte Daten auf MITTEL');
  assert.equal(p.aktiv.analytics, undefined); assert.deepEqual(p.auftrag.unklar, []);
  assert.match(p.auftrag.wuensche.join(' '), /mobil optimiert/);
});

test('Freier Satz: Branche, Ort, Prioritäten, Verneinung', () => {
  const p = plan('Baue eine Website für einen lokalen Friseur in Eislingen. Local SEO hoch, GEO hoch, CRO mittel. Keine Analytics.');
  assert.equal(p.auftrag.brancheInfo.typ, 'HairSalon'); assert.equal(p.auftrag.ort, 'Eislingen');
  assert.deepEqual([prio(p, 'local-seo'), prio(p, 'geo'), prio(p, 'cro')], [4, 4, 3]);
  assert.equal(p.aktiv.analytics, undefined);
  assert.equal(prio(p, 'seo'), 3, 'GEO setzt SEO voraus');
});

test('Begriffe werden zusammengeführt: AEO/LLMO/KI-Suche = GEO, WCAG = Barrierefreiheit', () => {
  const p = plan('AEO: hoch\nLLMO: optional\nWCAG: Ja\nCore Web Vitals: niedrig');
  assert.equal(prio(p, 'geo'), 4); assert.equal(prio(p, 'accessibility'), 3); assert.equal(prio(p, 'performance'), 2);
});

test('Konfigurator-Stufen 1–5 und Zahlung heben Sicherheit', () => {
  const p = plan('Kunde: Test\nSicherheit: Stufe 2 von 5 (Standard)\nGestaltung: Stufe 3 von 5 (Eigenes Design)\nFunktionen: Online-Shop mit Zahlung');
  assert.equal(prio(p, 'sicherheit'), 4);
  assert.equal(p.auftrag.konfigurator.Gestaltung, 'Stufe 3 von 5 (Eigenes Design)');
});

test('Prioritäten-Matrix und globaler Standard', () => {
  assert.equal(verbindlichkeit(1, 'K'), 'Kann'); assert.equal(verbindlichkeit(1, 'E'), null);
  assert.equal(verbindlichkeit(3, 'E'), 'Soll'); assert.equal(verbindlichkeit(5, 'Z'), 'Soll'); assert.equal(verbindlichkeit(1, 'G'), 'Muss');
  const leer = plan('Kunde: Nur Website');
  assert.equal(leer.regeln.length, W.gebiete.global.regeln.length, 'ohne Leistungen nur der globale Standard');
  assert.ok(leer.regeln.every(r => r.verbindlich === 'Muss'));
  const opt = plan('GEO: optional');
  assert.ok(opt.regeln.filter(r => r.bereich === 'geo').every(r => r.verbindlich === 'Kann'));
  assert.ok(opt.regeln.filter(r => r.bereich === 'global').length === W.gebiete.global.regeln.length, 'OPTIONAL schwächt den globalen Standard nicht');
});

test('Branchen: kurze Stichwörter nur als ganzes Wort, Mehrfachtypen', () => {
  const b = t => leseAuftrag(`Branche: ${t}`, W).brancheInfo?.typ;
  assert.equal(b('Barrierefreie Physiotherapie-Praxis'), 'Physiotherapy');
  assert.equal(b('Cocktailbar'), 'BarOrPub');
  assert.equal(b('Sanitär und Heizung'), 'Plumber, HVACBusiness');
  assert.equal(b('Friseursalon'), 'HairSalon');
  assert.equal(b('Hersteller von Präzisions-Zerspanungswerkzeugen (B2B, Industrie)'), 'Organization');
});

test('Vorlage des Auftrags ist leer gültig und liefert nur den globalen Standard', () => {
  const p = plan(fs.readFileSync(path.join(REPO, 'vorlage/auftrag.md'), 'utf8'));
  assert.equal(Object.keys(p.aktiv).length, 0); assert.deepEqual(p.auftrag.unklar, []);
});

test('Jede Fachgebiet-Datei beantwortet die 10 Fragen und nennt Mythen/Zeitabhängiges', () => {
  for (const g of Object.values(W.gebiete)) {
    const t = fs.readFileSync(path.join(FG, g.datei), 'utf8');
    if (g.key === 'global') continue;
    for (const h of ['## 1 Ziel', '## 2 Warum relevant', '## Regeln', 'Zeitabhängig']) assert.ok(t.includes(h), `${g.datei}: „${h}“ fehlt`);
    assert.ok(/## (7|7–10)/.test(t), `${g.datei}: Automatik-Abschnitt fehlt`);
  }
});

// Fälle aus dem Review 2026-09-30: nichts darf still falsch aktiviert oder abgeschaltet werden
test('Verneinungen im Format „Schlüssel: Wert“', () => {
  for (const v of ['Nein, danke', 'nein (später)', 'keine', 'nicht wichtig', 'ohne']) assert.equal(plan(`Analytics: ${v}`).aktiv.analytics, undefined, v);
  assert.equal(plan('SEO:\nNein, danke').aktiv.seo, undefined);
});

test('Priorität: erstes Wort gilt, Zweifel werden gemeldet', () => {
  let p = plan('SEO: hoch, aber nicht kritisch');
  assert.equal(prio(p, 'seo'), 4); assert.equal(p.auftrag.unklar.length, 1);
  p = plan('GEO: Ja, kann warten');
  assert.equal(prio(p, 'geo'), 3, '„kann“ ist kein Prioritätswort');
  p = plan('Local SEO: hoch, ohne Doorway-Seiten');
  assert.equal(prio(p, 'local-seo'), 4); assert.match(p.auftrag.unklar.join(), /Verneinung/);
  assert.equal(plan('Local SEO: sehr hoch').auftrag.unklar.length, 0, '„sehr hoch“ ist nicht mehrdeutig');
});

test('Freitext: Verneinung nur direkt am Fachgebiet', () => {
  assert.equal(prio(plan('Local SEO hoch ohne Doorway-Seiten'), 'local-seo'), 4);
  assert.equal(plan('Bitte ohne Tracking und keine Analytics.').aktiv.analytics, undefined);
});

test('Sicherheit nur bei echter Zahlung/Login', () => {
  assert.equal(plan('Funktionen: Workshops online buchen').aktiv.sicherheit, undefined);
  assert.equal(plan('Funktionen: Barbershop-Termine, kein Login').aktiv.sicherheit, undefined);
  assert.equal(prio(plan('Funktionen: Gutscheine mit Online-Zahlung'), 'sicherheit'), 4);
});

test('Nach-Launch-Regeln (Phase L) gibt es und sie liegen nicht in der Abnahme', () => {
  const L = alleRegeln.filter(r => r.phase.includes('L')).map(r => r.id);
  for (const id of ['TEC-08', 'TEC-10', 'ANA-05', 'LOC-06', 'LOC-08', 'PERF-10', 'GEO-10']) assert.ok(L.includes(id), id);
  assert.ok(alleRegeln.every(r => !(r.phase.includes('A') && r.phase.includes('L'))));
});

test('Quality Gate auf einer absichtlich fehlerhaften Mini-Seite', { timeout: 120e3 }, async () => {
  const { spawnSync } = await import('node:child_process'); const os = await import('node:os');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-')); fs.cpSync(path.join(REPO, 'werkzeuge/tests/fixtures/mini'), tmp, { recursive: true });
  try {
    const r = spawnSync(process.execPath, [path.join(REPO, 'werkzeuge/qualitaet.mjs'), tmp, '--still'], { encoding: 'utf8' });
    assert.equal(r.status, 1, 'Muss offen → Exit 1');
    const q = fs.readFileSync(path.join(tmp, 'QUALITAET.md'), 'utf8'); const zeile = id => q.split('\n').find(z => z.includes(`| ${id} |`)) || '';
    assert.match(q, /Urteil: NICHT BESTANDEN/);
    assert.match(zeile('GLB-02'), /^\| ✗/, 'maximum-scale=0.5 sperrt Zoom');
    assert.match(zeile('SEC-02'), /^\| ✗/, 'ohne CSP nie bestanden');
    assert.match(zeile('LOC-01'), /^\| ✗.*kein LocalBusiness/, 'ohne JSON-LD kein N/A');
    assert.match(q, /Platzhalter „www\.beispiel\.de“/);
    assert.match(q, /fremde Herkünfte: https:\/\/cdn\.fremd\.invalid/);
    assert.match(q, /index\.html: 1 Bilder außerhalb des ersten Bildschirms ohne loading="lazy"/);
    assert.match(q, /tote Links: https:\/\/www\.beispiel\.de\/fehlt\.html/, 'toter Link auf eigener Domain');
    assert.doesNotMatch(zeile('GLB-06'), /shop\/konto/, '„Fremde Pfade“ aus dem Auftrag gelten nicht als tot');
    assert.doesNotMatch(zeile('SEC-01'), /^\| ✓/, '„ok“ ist kein Beleg');
    assert.match(zeile('TEC-10'), /^\| ↻/, 'nach Launch blockiert nicht');
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
});
