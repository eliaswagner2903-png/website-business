// Bilder der Seitenkapitän-Seite (Higgsfield, 11.10.2026, Stil 1 „Nachtschiff“) in Webgrößen umrechnen.
// node bilder.mjs [Quellordner]   → public/medien/kapitaen-<name>-<breite>.{avif,webp} und medien/og-startseite.jpg
// Quelle: die Originale (WebP, 2688 px) liegen außerhalb des Repos in /mnt/project-files/seitenkapitaen/bilder/.
// Gleiche Breiten wie in bauen.mjs (BILD). AVIF zuerst, WebP als Rückfall; Hero mobil ≤ 120 KB, Computer ≤ 220 KB (Drehbuch, Ladezeit-Regeln).
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const sharp = createRequire(new URL('../../werkzeuge/package.json', import.meta.url))('sharp');
const QUELLE = process.argv[2] || '/mnt/project-files/seitenkapitaen/bilder';
const MEDIEN = fileURLToPath(new URL('./public/medien/', import.meta.url));

// [Ausgabename, Quelldatei, Breiten, AVIF-Qualität, WebP-Qualität]
const BILDER = [
  ['kajuete-quer', 'b1-kajuete-quer', [1280, 1920, 2560], 55, 74],
  ['kajuete-hoch', 'b2-kajuete-hoch', [720, 1080], 55, 74],
  ['kompass', 'b3-kompass', [960, 1600], 50, 70],
  ['hafen', 'b4-hafen', [960, 1600], 50, 70],
];
for (const [name, quelle, breiten, qa, qw] of BILDER) {
  for (const b of breiten) {
    const bild = sharp(`${QUELLE}/${quelle}.webp`).resize({ width: b });
    const a = await bild.clone().avif({ quality: qa, effort: 7 }).toFile(`${MEDIEN}kapitaen-${name}-${b}.avif`);
    const w = await bild.clone().webp({ quality: qw, effort: 6 }).toFile(`${MEDIEN}kapitaen-${name}-${b}.webp`);
    console.log(`${name}-${b} ${a.width}×${a.height}  avif ${Math.round(a.size / 1024)} KB  webp ${Math.round(w.size / 1024)} KB`);
  }
}
// Vorschaubild für geteilte Links: Kajüte, 1200 × 630
const og = await sharp(`${QUELLE}/b1-kajuete-quer.webp`).resize({ width: 1200, height: 630, fit: 'cover', position: 'right' }).jpeg({ quality: 78, mozjpeg: true }).toFile(`${MEDIEN}og-startseite.jpg`);
console.log(`og-startseite.jpg ${Math.round(og.size / 1024)} KB`);
