// Findet Playwright: lokal installiert oder global vorinstalliert (Claude-Cloud-Umgebung).
export async function playwright() {
  for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright/index.mjs']) {
    try { return await import(p); } catch {}
  }
  throw new Error('Playwright nicht gefunden: npm i -D playwright (Browser nicht neu laden, Chromium ist vorinstalliert)');
}
