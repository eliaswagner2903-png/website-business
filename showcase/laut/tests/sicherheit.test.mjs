// Statische Sicherheitsprüfung der ausgelieferten Dateien (angepasst aus vorlage/: keine Functions, keine Formulare).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const PUB = new URL('../public/', import.meta.url).pathname;
const headers = readFileSync(join(PUB, '_headers'), 'utf8');
const csp = headers.match(/Content-Security-Policy: (.+)/)?.[1] ?? '';
const html = readdirSync(PUB).filter((f) => /\.html?$/.test(f)).map((f) => [f, readFileSync(join(PUB, f), 'utf8')]);
const css = readdirSync(join(PUB, 'css')).map((f) => readFileSync(join(PUB, 'css', f), 'utf8')).join('\n');

test('Pflicht-Header sind gesetzt', () => {
  for (const h of ['Content-Security-Policy', 'Strict-Transport-Security', 'X-Content-Type-Options: nosniff',
    'Referrer-Policy', 'Permissions-Policy', 'X-Frame-Options: DENY']) assert.ok(headers.includes(h), `fehlt: ${h}`);
});

test('CSP ist streng', () => {
  assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval|\*/, 'CSP darf weder unsafe-* noch * enthalten');
  for (const d of ["default-src 'self'", "object-src 'none'", "frame-ancestors 'none'", "base-uri 'self'", "form-action 'none'"]) assert.ok(csp.includes(d), `CSP fehlt: ${d}`);
});

test('Jedes Inline-Skript ist per Hash in der CSP freigegeben', () => {
  for (const [f, t] of html) {
    for (const [, code] of t.matchAll(/<script(?![^>]*\b(?:src=|type="application\/ld\+json"))[^>]*>([\s\S]*?)<\/script>/g)) {
      const hash = createHash('sha256').update(code).digest('base64');
      assert.ok(csp.includes(`'sha256-${hash}'`), `${f}: Inline-Skript ohne Hash in der CSP: ${code.slice(0, 40)}`);
    }
  }
});

test('Keine fremden Skripte, keine Inline-Stile, keine iframes, keine fremden Schriften', () => {
  for (const [f, t] of html) {
    assert.doesNotMatch(t, /<script[^>]+src="https?:/, `${f}: fremdes Skript`);
    assert.doesNotMatch(t, /\sstyle="/, `${f}: Inline-Stil (blockiert die CSP)`);
    assert.doesNotMatch(t, /<iframe/, `${f}: iframe (Datenschutz, CSP)`);
    assert.doesNotMatch(t, /fonts\.googleapis|fonts\.gstatic/, `${f}: Google-Fonts-CDN (DSGVO)`);
    assert.doesNotMatch(t, /\son[a-z]+="/, `${f}: Inline-Event-Handler`);
    assert.doesNotMatch(t, /<link[^>]+href="https?:/, `${f}: fremde Quelle im Kopf`);
  }
  assert.doesNotMatch(css, /url\(\s*["']?https?:/, 'CSS lädt fremde Dateien');
});
