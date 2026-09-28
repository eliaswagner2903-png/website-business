// Statischer Server MIT gzip und den Sicherheits-Headern aus public/_headers (wie Cloudflare Pages).
// node werkzeuge/gzserver.mjs [port=8080] [ordner=vorlage/public]
// So fallen CSP-Verstöße schon lokal als Konsolenfehler auf.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = +(process.argv[2] || 8080);
const root = path.resolve(repo, process.argv[3] || 'vorlage/public');
const T = { '.html':'text/html; charset=utf-8', '.htm':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.mjs':'text/javascript',
  '.svg':'image/svg+xml', '.webp':'image/webp', '.avif':'image/avif', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.woff2':'font/woff2',
  '.pdf':'application/pdf', '.json':'application/json', '.txt':'text/plain; charset=utf-8', '.xml':'application/xml', '.mp4':'video/mp4', '.webm':'video/webm' };
// Nur den Block "/*" aus _headers übernehmen (reicht für die lokale Prüfung)
const kopf = {};
try {
  let aktiv = false;
  for (const z of fs.readFileSync(path.join(root, '_headers'), 'utf8').split('\n')) {
    if (/^\S/.test(z)) aktiv = z.trim() === '/*';
    else if (aktiv && z.includes(':')) { const i = z.indexOf(':'); kopf[z.slice(0, i).trim()] = z.slice(i + 1).trim(); }
  }
  delete kopf['Strict-Transport-Security']; delete kopf['Content-Security-Policy'];
} catch {}
const csp = (() => { try { return fs.readFileSync(path.join(root, '_headers'), 'utf8').match(/Content-Security-Policy: (.+)/)[1].replace(/; upgrade-insecure-requests/, ''); } catch { return null; } })();
http.createServer((q, r) => {
  let u = decodeURIComponent(q.url.split('?')[0]); if (u.endsWith('/')) u += 'index.html';
  const f = path.join(root, u); if (!f.startsWith(root)) { r.writeHead(403); return r.end(); }
  fs.readFile(f, (e, d) => {
    const h = Object.fromEntries(Object.entries(kopf).filter(([, v]) => v));
    if (csp) h['Content-Security-Policy'] = csp;
    if (e) { r.writeHead(404, h); return r.end('404'); }
    const t = T[path.extname(f).toLowerCase()] || 'application/octet-stream'; Object.assign(h, { 'Content-Type': t, 'Cache-Control': 'max-age=3600' });
    if (/text|javascript|svg|json|xml/.test(t) && /gzip/.test(q.headers['accept-encoding'] || '')) { h['Content-Encoding'] = 'gzip'; d = zlib.gzipSync(d, { level: 9 }); }
    r.writeHead(200, h); r.end(d);
  });
}).listen(port, () => console.log(`gzip-Server: http://localhost:${port}/  (Wurzel: ${root})`));
