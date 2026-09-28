// Statische Sicherheitsprüfung der ausgelieferten Dateien. Läuft in CI bei jedem PR.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const PUB = new URL('../public/', import.meta.url).pathname;
const headers = readFileSync(join(PUB, '_headers'), 'utf8');
const csp = headers.match(/Content-Security-Policy: (.+)/)?.[1] ?? '';
const html = readdirSync(PUB).filter((f) => f.endsWith('.html')).map((f) => [f, readFileSync(join(PUB, f), 'utf8')]);

test('Pflicht-Header sind gesetzt', () => {
  for (const h of ['Content-Security-Policy', 'Strict-Transport-Security', 'X-Content-Type-Options: nosniff',
    'Referrer-Policy', 'Permissions-Policy', 'X-Frame-Options: DENY']) assert.ok(headers.includes(h), `fehlt: ${h}`);
});

test('CSP ist streng', () => {
  assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval|\*/, 'CSP darf weder unsafe-* noch * enthalten');
  for (const d of ["default-src 'self'", "object-src 'none'", "frame-ancestors 'none'", "base-uri 'self'"]) assert.ok(csp.includes(d), `CSP fehlt: ${d}`);
});

test('Jedes Inline-Skript ist per Hash in der CSP freigegeben', () => {
  for (const [f, t] of html) {
    for (const [, code] of t.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
      const hash = createHash('sha256').update(code).digest('base64');
      assert.ok(csp.includes(`'sha256-${hash}'`), `${f}: Inline-Skript ohne Hash in der CSP: ${code.slice(0, 40)}`);
    }
  }
});

test('Keine fremden Skripte, keine Inline-Stile, keine iframes', () => {
  for (const [f, t] of html) {
    assert.doesNotMatch(t, /<script[^>]+src="https?:/, `${f}: fremdes Skript`);
    assert.doesNotMatch(t, /\sstyle="/, `${f}: Inline-Stil (blockiert die CSP)`);
    assert.doesNotMatch(t, /<iframe/, `${f}: iframe (Datenschutz, CSP)`);
    assert.doesNotMatch(t, /fonts\.googleapis|fonts\.gstatic/, `${f}: Google-Fonts-CDN (DSGVO)`);
    assert.doesNotMatch(t, /\son[a-z]+="/, `${f}: Inline-Event-Handler`);
  }
});

test('Keine Geheimnisse im Code', () => {
  const dateien = ['../wrangler.toml', '../functions/api/checkout.js', '../functions/api/kontakt.js', '../functions/api/stripe-webhook.js'];
  for (const d of dateien) {
    const t = readFileSync(new URL(d, import.meta.url), 'utf8');
    assert.doesNotMatch(t, /(sk|rk)_(live|test)_[A-Za-z0-9]{10,}|whsec_[A-Za-z0-9]{10,}|re_[A-Za-z0-9]{16,}/, `${d}: sieht nach einem Schlüssel aus`);
  }
});
