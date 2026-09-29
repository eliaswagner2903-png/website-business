// Statischer Server MIT gzip und den Headern aus public/_headers (wie Cloudflare Pages).
// node werkzeuge/gzserver.mjs [port=8080] [ordner=vorlage/public]
// So fallen CSP-Verstöße schon lokal als Konsolenfehler auf, und Cache-Header je Pfad lassen sich prüfen.
//   - _headers: alle passenden Blöcke gelten (genauer Pfad oder Präfix-Glob wie /fonts/*), doppelte Header werden
//     wie bei Cloudflare mit Komma verbunden, "! Name" entfernt einen Header.
//   - Unbekannter Pfad: 404.html mit Status 404 (falls vorhanden), sonst "404".
//   - Nur für HTTP: HSTS und upgrade-insecure-requests werden bewusst entfernt (sonst erzwingt der Browser https).
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = +(process.argv[2] || 8080);
const root = path.resolve(repo, process.argv[3] || 'vorlage/public');
const T = { '.html':'text/html; charset=utf-8', '.htm':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.mjs':'text/javascript',
  '.svg':'image/svg+xml', '.webp':'image/webp', '.avif':'image/avif', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.woff2':'font/woff2',
  '.pdf':'application/pdf', '.json':'application/json', '.txt':'text/plain; charset=utf-8', '.xml':'application/xml', '.mp4':'video/mp4', '.webm':'video/webm' };

// _headers in Blöcke zerlegen: [{ muster, setzen: [[name, wert]], weg: [name] }]
const bloecke = [];
try {
  let b = null;
  for (const z of fs.readFileSync(path.join(root, '_headers'), 'utf8').split('\n')) {
    if (!z.trim() || z.trim().startsWith('#')) continue;
    if (/^\S/.test(z)) { b = { muster: z.trim(), setzen: [], weg: [] }; bloecke.push(b); continue; }
    if (!b) continue;
    const t = z.trim();
    if (t.startsWith('!')) b.weg.push(t.slice(1).trim().toLowerCase());
    else if (t.includes(':')) { const i = t.indexOf(':'); b.setzen.push([t.slice(0, i).trim(), t.slice(i + 1).trim()]); }
  }
} catch {}
const passt = (muster, pfad) => {
  if (/^https?:/.test(muster)) return false; // Regeln für fremde Hosts gelten lokal nicht
  const re = new RegExp('^' + muster.split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');
  return re.test(pfad);
};
function kopfFuer(pfad) {
  const h = new Map(); // Kleinbuchstaben-Name → [Originalname, Wert]
  for (const b of bloecke) {
    if (!passt(b.muster, pfad)) continue;
    for (const [n, w] of b.setzen) { const k = n.toLowerCase(); h.set(k, h.has(k) ? [h.get(k)[0], `${h.get(k)[1]}, ${w}`] : [n, w]); }
    for (const k of b.weg) h.delete(k);
  }
  h.delete('strict-transport-security');
  if (h.has('content-security-policy')) {
    const [n, w] = h.get('content-security-policy');
    h.set('content-security-policy', [n, w.split(';').map((s) => s.trim()).filter((s) => s && s !== 'upgrade-insecure-requests').join('; ')]);
  }
  return Object.fromEntries([...h.values()]);
}
const lesen = (f) => { try { return fs.statSync(f).isFile() ? fs.readFileSync(f) : null; } catch { return null; } };

http.createServer((q, r) => {
  let u; try { u = decodeURIComponent(q.url.split('?')[0]); } catch { r.writeHead(400); return r.end(); }
  const pfad = u; if (u.endsWith('/')) u += 'index.html';
  let f = path.join(root, u); if (!f.startsWith(root + path.sep)) { r.writeHead(403); return r.end(); }
  let d = lesen(f), status = 200;
  if (!d && !path.extname(f)) { const g = lesen(f + '.html'); if (g) { d = g; f += '.html'; } } // /seite → seite.html wie Pages
  const h = kopfFuer(pfad);
  if (!d) {
    const nf = lesen(path.join(root, '404.html'));
    if (!nf) { r.writeHead(404, h); return r.end('404'); }
    d = nf; f = path.join(root, '404.html'); status = 404;
  }
  const t = T[path.extname(f).toLowerCase()] || 'application/octet-stream';
  h['Content-Type'] = t;
  if (!Object.keys(h).some((k) => k.toLowerCase() === 'cache-control')) h['Cache-Control'] = 'max-age=3600';
  if (/text|javascript|svg|json|xml/.test(t) && /gzip/.test(q.headers['accept-encoding'] || '')) { h['Content-Encoding'] = 'gzip'; d = zlib.gzipSync(d, { level: 9 }); }
  r.writeHead(status, h); r.end(d);
}).listen(port, () => console.log(`gzip-Server: http://localhost:${port}/  (Wurzel: ${root})`));
