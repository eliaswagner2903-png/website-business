import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const py = (...a) => spawnSync('python3', ['werkzeuge/youtube.py', ...a], { encoding: 'utf8' });

test('alle YouTube-Wissensdateien bestehen die Prüfung', () => {
  const r = py('pruefen');
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

test('ungültige URL ergibt Problem/Ursache/Alternative, ohne Netz', () => {
  const r = py('holen', 'kein-link');
  assert.equal(r.status, 1);
  for (const w of ['PROBLEM:', 'URSACHE:', 'ALTERNATIVE:']) assert.match(r.stderr, new RegExp(w));
});

test('Suche ohne Treffer erfindet nichts', () => {
  assert.match(py('suche', 'xyzunbekanntesthema').stdout, /Kein gespeichertes Wissen/);
});
