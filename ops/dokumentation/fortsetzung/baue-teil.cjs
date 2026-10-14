// Baut eine Fortsetzung als PDF: node ops/dokumentation/fortsetzung/baue-teil.cjs teil-2.html Ziel.pdf
const path = require('path'), http = require('http'), fs = require('fs');
const { execFileSync } = require('child_process');
const { chromium } = require(path.join(execFileSync('npm', ['root', '-g']).toString().trim(), 'playwright'));
const wurzel = path.resolve(__dirname, '..');
const [quelle, ziel] = process.argv.slice(2);
const server = http.createServer((q, a) => {
  const d = path.join(wurzel, decodeURIComponent(q.url.split('?')[0]));
  if (!d.startsWith(wurzel) || !fs.existsSync(d)) { a.writeHead(404); return a.end(); }
  a.writeHead(200, { 'Content-Type': d.endsWith('.css') ? 'text/css' : 'text/html; charset=utf-8' });
  fs.createReadStream(d).pipe(a);
}).listen(0, async () => {
  const b = await chromium.launch();
  const s = await b.newPage();
  await s.goto(`http://127.0.0.1:${server.address().port}/fortsetzung/${quelle}`, { waitUntil: 'load' });
  await s.pdf({ path: ziel, format: 'A4', preferCSSPageSize: true, printBackground: true });
  await b.close(); server.close();
});
