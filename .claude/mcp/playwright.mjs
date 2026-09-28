#!/usr/bin/env node
// Startet den Playwright-MCP-Server — das Browser-Werkzeug der Späher.
//
// Läuft lokal ohne Zutun (Playwright lädt sein Chromium selbst) und in der
// Claude-Code-Cloud (vorinstalliertes Chromium, ausgehender Proxy mit eigener CA).
//
// Optionale Umgebungsvariablen:
//   PLAYWRIGHT_MCP_EXECUTABLE_PATH  eigener Browser-Pfad
//   FERNSPAEHER_CA_BUNDLE           PEM-Bundle, dessen CAs Chromium zusätzlich
//                                   vertrauen soll (z. B. Firmen-/Agent-Proxy)
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { X509Certificate, createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = [
  '-y', '@playwright/mcp@0.0.82',
  '--headless',
  '--isolated',
  '--browser', 'chromium',
  '--viewport-size', '1440,900',
  '--output-dir', '.fernspaeher-output',
];

// Browser: vorinstalliertes Chromium bevorzugen (Versionsunabhängig)
const exe = [process.env.PLAYWRIGHT_MCP_EXECUTABLE_PATH, '/opt/pw-browsers/chromium']
  .filter(Boolean)
  .find((p) => existsSync(p));
if (exe) args.push('--executable-path', exe);

// Ausgehenden Proxy an den Browser durchreichen
const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
if (proxy) {
  args.push('--proxy-server', proxy);
  const noProxy = process.env.NO_PROXY || process.env.no_proxy;
  if (noProxy) args.push('--proxy-bypass', noProxy);
}

// Proxy-CA gezielt vertrauen (per SPKI-Pin), statt Zertifikatsfehler pauschal
// zu ignorieren — echte Zertifikatsfehler der Zielseite bleiben sichtbar.
const browserArgs = [];
const caBundle = [process.env.FERNSPAEHER_CA_BUNDLE, '/root/.ccr/ca-bundle.crt']
  .filter(Boolean)
  .find((p) => existsSync(p));
if (caBundle && proxy) {
  const pems = readFileSync(caBundle, 'utf8')
    .match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g) ?? [];
  const pins = pems.map((pem) => {
    const spki = new X509Certificate(pem).publicKey.export({ type: 'spki', format: 'der' });
    return createHash('sha256').update(spki).digest('base64');
  });
  if (pins.length) browserArgs.push(`--ignore-certificate-errors-spki-list=${pins.join(',')}`);
}

// Container laufen als root → Chromium braucht --no-sandbox
if (process.getuid && process.getuid() === 0) args.push('--no-sandbox');

if (browserArgs.length) {
  const cfg = join(mkdtempSync(join(tmpdir(), 'fernspaeher-')), 'playwright-mcp.json');
  writeFileSync(cfg, JSON.stringify({ browser: { launchOptions: { args: browserArgs } } }));
  args.push('--config', cfg);
}

const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', args, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});
child.on('exit', (code) => process.exit(code ?? 0));
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => child.kill(sig));
