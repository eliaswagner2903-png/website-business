// Macht aus einem public/-Ordner eine Kopie, die unter jeder Adresse läuft (z. B. als Claude-Artifact-Vorschaulink).
//   node werkzeuge/vorschau-link.mjs <public-ordner> <ziel-ordner>
// Warum: Unsere Seiten verlinken wurzelbezogen (/css/…, /medien/…). Liegt die Seite nicht an der Wurzel einer Domain,
// laufen diese Pfade ins Leere. Das Werkzeug schreibt sie in HTML, CSS und JS auf relative Pfade um:
//   href="/"            → href="index.html"
//   href="/#kontakt"    → href="index.html#kontakt"
//   src="/medien/a.webp" → src="medien/a.webp" (je nach Tiefe mit ../)
// Nur Pfade, deren erster Teil im Ordner wirklich existiert, werden angefasst (keine fremden Adressen, kein //cdn).
// Nicht kopiert: _headers, _redirects (gelten nur auf Cloudflare). Das Original bleibt unverändert.
import fs from 'node:fs'; import path from 'node:path';

const [quelle, ziel] = process.argv.slice(2).map((p) => p && path.resolve(p));
if (!quelle || !ziel) { console.error('Aufruf: node werkzeuge/vorschau-link.mjs <public-ordner> <ziel-ordner>'); process.exit(1); }
if (ziel.startsWith(quelle + path.sep) || ziel === quelle) { console.error('Ziel darf nicht im Quellordner liegen'); process.exit(1); }

const oben = new Set(fs.readdirSync(quelle));
const TEXT = /\.(html?|css|m?js|svg|webmanifest)$/i;
let dateien = 0, ersetzt = 0;

function relativ(pfad, von) {
  // pfad: "/css/a.css#x" (wurzelbezogen), von: Ordner der Datei relativ zur Wurzel
  const m = pfad.match(/^\/([^?#]*)([?#].*)?$/);
  let teil = m[1], rest = m[2] || '';
  if (teil === '' ) teil = 'index.html';
  const r = path.posix.relative(von || '.', teil) || teil;
  return r + rest;
}

function umschreiben(text, von) {
  // 1) Attribute und CSS-url(): "/…", '/…', url(/…)
  // 2) srcset-Listen: "/a.webp 640w, /b.webp 1016w"
  return text.replace(/(["'(,\s])(\/(?!\/)[^"'()\s,]*)/g, (ganz, vor, pfad) => {
    const erster = pfad.slice(1).split(/[/?#]/)[0];
    const startseite = pfad === '/' || pfad.startsWith('/#') || pfad.startsWith('/?');
    if (startseite ? !/["']/.test(vor) : !oben.has(erster)) return ganz;   // "/" allein nur in Anführungszeichen (sonst Division)
    // Nur in Attributwerten/Strings, nicht in Kommentaren wie "// text" (durch (?!\/) schon ausgeschlossen)
    ersetzt++;
    return vor + relativ(pfad, von);
  });
}

function kopiere(q, z, von) {
  fs.mkdirSync(z, { recursive: true });
  for (const e of fs.readdirSync(q, { withFileTypes: true })) {
    if (!von && (e.name === '_headers' || e.name === '_redirects')) continue;
    const qp = path.join(q, e.name), zp = path.join(z, e.name);
    if (e.isDirectory()) { kopiere(qp, zp, path.posix.join(von, e.name)); continue; }
    dateien++;
    // CSS-url() gilt relativ zur CSS-Datei; Pfade in JS (fetch, Worker, img.src) relativ zur Seite – unsere Seiten
    // liegen alle an der Wurzel, darum für JS die Wurzel als Bezug.
    if (TEXT.test(e.name)) fs.writeFileSync(zp, umschreiben(fs.readFileSync(qp, 'utf8'), /\.m?js$/i.test(e.name) ? '' : von));
    else fs.copyFileSync(qp, zp);
  }
}

fs.rmSync(ziel, { recursive: true, force: true });
kopiere(quelle, ziel, '');
console.log(`ok – ${dateien} Dateien nach ${ziel}, ${ersetzt} Pfade relativ gemacht`);
