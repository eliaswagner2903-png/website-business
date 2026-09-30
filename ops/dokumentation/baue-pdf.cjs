// Baut den ganzen Ordner „Lagebericht OQ“ als PDF:
//   Grundbestand   STAND-<datum>.html            → register/<Bu>-<Titel>.pdf und STAND-<datum>.pdf
//   Nachträge      nachtraege/N###-<datum>.html  → nachtraege/pdf/<Bu>-N###.pdf (nur die Register, die der Nachtrag enthält)
//   Verzeichnis    nachtraege/verzeichnis.jsonl  → register/0b-Nachtragsverzeichnis.pdf
//   Alles in Ordner-Reihenfolge (Grundbestand je Register, dahinter seine Nachträge) → ORDNER-KOMPLETT.pdf
// Aufruf: node ops/dokumentation/baue-pdf.cjs
// Braucht Playwright (global installiert) und python3 mit pymupdf.
const path = require('path');
const { execFileSync } = require('child_process');
const http = require('http');
const fs = require('fs');

const globaleModule = execFileSync('npm', ['root', '-g']).toString().trim();
const { chromium } = require(path.join(globaleModule, 'playwright'));

const ordner = __dirname;
const TITEL = {
  0: 'Deckblatt und Registerverzeichnis', A: 'Überblick', B: 'Chronik', C: 'Projekte',
  D: 'Arbeitsweise und Qualität', E: 'Wissen und Lehren', F: 'Geld', G: 'Plan und Entscheidungen',
  H: 'Anhang', L: 'Einleger',
};
const REIHENFOLGE = ['0', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'L'];
const dateiname = (t) => t.replace(/[^A-Za-zÄÖÜäöüß]+/g, '-').replace(/-$/, '');
const datumDE = (iso) => iso.split('-').reverse().join('.');
const schrift = 'font:8.5pt Helvetica,Arial,sans-serif;color:#333';

// Über HTTP ausliefern, nicht über file:// (Fehler 38 der Fehlerliste)
const TYPEN = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8' };
const server = http.createServer((req, res) => {
  const datei = path.join(ordner, decodeURIComponent(req.url.split('?')[0]));
  if (!datei.startsWith(ordner) || !fs.existsSync(datei)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPEN[path.extname(datei)] || 'application/octet-stream' });
  fs.createReadStream(datei).pipe(res);
});

async function drucke(browser, basis, relHtml, bu, fussLinks, ziel, ersteSeiteOhneFuss) {
  const seite = await browser.newPage();
  await seite.goto(`${basis}/${relHtml}`, { waitUntil: 'load' });
  const anzahl = await seite.evaluate((bu) => {
    document.querySelectorAll('[data-reg]').forEach((el) => { if (el.dataset.reg !== bu) el.remove(); });
    return document.querySelectorAll('[data-reg]').length;
  }, bu);
  if (!anzahl) { await seite.close(); return false; }
  let css = '@page{@bottom-left{content:none}}';
  if (fussLinks) {
    css = `@page{@bottom-left{content:"${fussLinks}" counter(page);${schrift}}
           @bottom-right{content:"Lagebericht OQ";${schrift}}}`;
    if (ersteSeiteOhneFuss) css += '@page:first{@bottom-left{content:none}@bottom-right{content:none}}';
  }
  await seite.addStyleTag({ content: css });
  await seite.pdf({ path: ziel, format: 'A4', preferCSSPageSize: true, printBackground: true });
  await seite.close();
  return true;
}

function verzeichnisHtml(eintraege) {
  const zeilen = eintraege.map((e) => `<tr><td>${e.nr}</td><td>${datumDE(e.datum)}</td><td>${e.register.join(', ')}</td>
    <td>${e.titel}</td><td>${(e.auftraege || []).join(', ')}</td><td class="abgeheftet"></td></tr>`).join('\n');
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Nachtragsverzeichnis</title>
<link rel="stylesheet" href="../druck.css"><style>.abgeheftet{width:18mm;border-left:.6pt solid #000}</style></head><body><div class="blatt">
<section data-reg="0"><h2>Nachtragsverzeichnis</h2>
<p>Der Ordner wächst mit der Arbeit. Nichts wird herausgenommen: Jeder neue Stand kommt als datierter Nachtrag hinter
das passende Register. So bleibt die ganze Entwicklung sichtbar. Die letzte Spalte ist zum Abhaken beim Einheften.</p>
<table><thead><tr><th>Nr.</th><th>Datum</th><th>Register</th><th>Inhalt</th><th>Aufträge</th><th>Abgeheftet</th></tr></thead>
<tbody>${zeilen}</tbody></table></section></div></body></html>`;
}

(async () => {
  await new Promise((ok) => server.listen(0, ok));
  const basis = `http://localhost:${server.address().port}`;
  const browser = await chromium.launch();
  fs.mkdirSync(path.join(ordner, 'register'), { recursive: true });
  fs.mkdirSync(path.join(ordner, 'nachtraege', 'pdf'), { recursive: true });

  // 1. Grundbestand (das älteste STAND-*.html)
  const stand = fs.readdirSync(ordner).filter((f) => /^STAND-.*\.html$/.test(f)).sort()[0];
  const grund = {};
  for (const bu of REIHENFOLGE) {
    const ziel = path.join(ordner, 'register', `${bu}-${dateiname(TITEL[bu])}.pdf`);
    const fuss = bu === '0' || bu === 'L' ? null : `Register ${bu} · ${TITEL[bu]} · Seite ${bu}-`;
    if (await drucke(browser, basis, stand, bu, fuss, ziel, true)) grund[bu] = ziel;
  }

  // 2. Nachtragsverzeichnis
  const eintraege = fs.readFileSync(path.join(ordner, 'nachtraege', 'verzeichnis.jsonl'), 'utf8')
    .split('\n').filter(Boolean).map((z) => JSON.parse(z));
  fs.writeFileSync(path.join(ordner, 'nachtraege', 'VERZEICHNIS.html'), verzeichnisHtml(eintraege));
  const verzeichnis = path.join(ordner, 'register', '0b-Nachtragsverzeichnis.pdf');
  await drucke(browser, basis, 'nachtraege/VERZEICHNIS.html', '0', null, verzeichnis, false);

  // 3. Nachträge
  const nachtraege = {};
  for (const e of eintraege.filter((e) => !e.register.includes('alle'))) {
    const html = `nachtraege/${e.nr}-${e.datum}.html`;
    for (const bu of e.register) {
      const ziel = path.join(ordner, 'nachtraege', 'pdf', `${bu}-${e.nr}.pdf`);
      const fuss = `Register ${bu} · Nachtrag ${e.nr} vom ${datumDE(e.datum)} · Blatt `;
      if (await drucke(browser, basis, html, bu, fuss, ziel, false)) (nachtraege[bu] ||= []).push(ziel);
    }
  }
  await browser.close();
  server.close();

  // 4. Daumenleiste zeichnen und zusammenfügen
  const ordnung = [];
  for (const bu of REIHENFOLGE) {
    if (grund[bu]) ordnung.push(grund[bu]);
    if (bu === '0') ordnung.push(verzeichnis);
    ordnung.push(...(nachtraege[bu] || []));
  }
  const grundGesamt = path.join(ordner, stand.replace('.html', '.pdf'));
  execFileSync('python3', ['-c', `
import json, os, sys, pymupdf
mm = 72 / 25.4
REG = "ABCDEFGH"
grund_gesamt, komplett, grund = sys.argv[1], sys.argv[2], set(json.loads(sys.argv[3]))
def daumen(f):
    bu = os.path.basename(f)[0]
    doc = pymupdf.open(f)
    if bu in REG and not doc[0].get_text("text", clip=pymupdf.Rect(doc[0].rect.width - 16 * mm, 15 * mm, doc[0].rect.width, 20 * mm)).strip():
        for seite in doc:
            w = seite.rect.width
            for i, b in enumerate(REG):
                r = pymupdf.Rect(w - 15 * mm, (16 + i * 29) * mm, w - 5 * mm, (16 + i * 29 + 25) * mm)
                an = b == bu
                seite.draw_rect(r, color=(0, 0, 0), fill=(0, 0, 0) if an else (1, 1, 1), width=0.8)
                seite.insert_textbox(r + (0, 8.5 * mm, 0, 0), b, fontsize=13, fontname="hebo",
                                     color=(1, 1, 1) if an else (0, 0, 0), align=1)
        doc.save(f + ".tmp", garbage=3, deflate=True); doc.close(); os.replace(f + ".tmp", f)
for f in sys.argv[4:]:
    daumen(f)
for ziel, liste in ((grund_gesamt, [f for f in sys.argv[4:] if f in grund]), (komplett, sys.argv[4:])):
    out = pymupdf.open()
    for f in liste:
        out.insert_pdf(pymupdf.open(f))
    out.set_metadata({"title": "Lagebericht OQ", "author": "Kommandeur Stahl (Claude) für Elias Wagner"})
    out.save(ziel, garbage=3, deflate=True)
    print(os.path.basename(ziel), len(out), "Seiten")
`, grundGesamt, path.join(ordner, 'ORDNER-KOMPLETT.pdf'), JSON.stringify(Object.values(grund)), ...ordnung],
  { stdio: 'inherit' });
})();
