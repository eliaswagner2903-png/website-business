// Baut aus STAND-<datum>.html je Register ein eigenes PDF (eigene Seitenzahlen, Daumenleiste)
// und fügt alle zu einem Gesamt-PDF zusammen.
// Aufruf: node ops/dokumentation/baue-pdf.cjs [STAND-2026-09-30]
// Braucht Playwright (global installiert) und python3 mit pymupdf zum Zusammenfügen.
const path = require('path');
const { execFileSync } = require('child_process');
const http = require('http');
const fs = require('fs');

const globaleModule = execFileSync('npm', ['root', '-g']).toString().trim();
const { chromium } = require(path.join(globaleModule, 'playwright'));

const ordner = __dirname;
const name = process.argv[2] || 'STAND-2026-09-30';
const ziel = path.join(ordner, 'register');
fs.mkdirSync(ziel, { recursive: true });

const REGISTER = [
  ['0', 'Deckblatt und Registerverzeichnis'],
  ['A', 'Überblick'], ['B', 'Chronik'], ['C', 'Projekte'], ['D', 'Arbeitsweise und Qualität'],
  ['E', 'Wissen und Lehren'], ['F', 'Geld'], ['G', 'Plan und Entscheidungen'], ['H', 'Anhang'],
  ['L', 'Einleger'],
];

// Über HTTP ausliefern, nicht über file:// (Fehler 38 der Fehlerliste)
const server = http.createServer((req, res) => {
  const datei = path.join(ordner, decodeURIComponent(req.url.split('?')[0]));
  if (!datei.startsWith(ordner) || !fs.existsSync(datei)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  fs.createReadStream(datei).pipe(res);
});

(async () => {
  await new Promise((ok) => server.listen(0, ok));
  const url = `http://localhost:${server.address().port}/${name}.html`;
  const browser = await chromium.launch();
  const dateien = [];
  for (const [bu, titel] of REGISTER) {
    const seite = await browser.newPage();
    await seite.goto(url, { waitUntil: 'load' });
    await seite.evaluate((bu) => {
      document.querySelectorAll('[data-reg]').forEach((el) => { if (el.dataset.reg !== bu) el.remove(); });
    }, bu);
    const fuss = bu === '0' || bu === 'L'
      ? '@page{@bottom-left{content:none}}'
      : `@page{@bottom-left{content:"Register ${bu} · ${titel} · Seite ${bu}-" counter(page);font:8.5pt Helvetica,Arial,sans-serif;color:#333}
         @bottom-right{content:"Lagebericht OQ · Stand 30.09.2026";font:8.5pt Helvetica,Arial,sans-serif;color:#333}}
         @page:first{@bottom-left{content:none}@bottom-right{content:none}}`;
    await seite.addStyleTag({ content: fuss });
    const datei = path.join(ziel, `${bu}-${titel.replace(/[^A-Za-zÄÖÜäöüß]+/g, '-').replace(/-$/, '')}.pdf`);
    await seite.pdf({ path: datei, format: 'A4', preferCSSPageSize: true, printBackground: true });
    dateien.push(datei);
    await seite.close();
  }
  await browser.close();
  server.close();
  const gesamt = path.join(ordner, `${name}.pdf`);
  execFileSync('python3', ['-c', `
import os, sys, pymupdf
mm = 72 / 25.4
REG = "ABCDEFGH"
out = pymupdf.open()
for f in sys.argv[2:]:
    doc = pymupdf.open(f)
    bu = os.path.basename(f)[0]
    if bu in REG:
        # Daumenleiste am rechten Rand: aktives Register schwarz, die anderen als Rahmen
        for seite in doc:
            w = seite.rect.width
            for i, b in enumerate(REG):
                r = pymupdf.Rect(w - 15 * mm, (16 + i * 29) * mm, w - 5 * mm, (16 + i * 29 + 25) * mm)
                an = b == bu
                seite.draw_rect(r, color=(0, 0, 0), fill=(0, 0, 0) if an else (1, 1, 1), width=0.8)
                seite.insert_textbox(r + (0, 8.5 * mm, 0, 0), b, fontsize=13, fontname="hebo",
                                     color=(1, 1, 1) if an else (0, 0, 0), align=1)
        doc.saveIncr() if doc.can_save_incrementally() else doc.save(f + ".tmp") or os.replace(f + ".tmp", f)
    out.insert_pdf(doc)
out.set_metadata({"title": "Lagebericht OQ – Stand 30.09.2026", "author": "Kommandeur Stahl (Claude) für Elias Wagner"})
out.save(sys.argv[1], garbage=3, deflate=True)
print(len(out), "Seiten")
`, gesamt, ...dateien], { stdio: 'inherit' });
})();
