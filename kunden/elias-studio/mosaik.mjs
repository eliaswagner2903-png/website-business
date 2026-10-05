// Kleine Mosaik-Bilder für den Hero „Lichtkegel“ (Dekor, im Licht nur gedämpft sichtbar, daher stark verkleinert).
// node mosaik.mjs  → public/medien/mosaik-<id>-{desktop,handy}.{avif,webp}
// Quelle sind die vorhandenen langen Aufnahmen der Arbeiten (arbeit-<id>-…-lang-…), nur der obere Teil, schmaler und stärker komprimiert.
// Warum: die vollen Aufnahmen (je ≈ 50 KB) machten das Mosaik zum LCP-Element und den ersten Bildschirm schwer.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const sharp = createRequire(new URL('../../werkzeuge/package.json', import.meta.url))('sharp');
const MEDIEN = fileURLToPath(new URL('./public/medien/', import.meta.url));
const IDS = ['hell', 'laut', 'edel'];
// [Art, Quelle (Breite), Zielbreite, Anteil der Quellhöhe von oben]
const ARTEN = { desktop: [800, 560, 0.85], handy: [320, 200, 0.85] };
for (const id of IDS) {
  for (const [art, [von, nach, anteil]] of Object.entries(ARTEN)) {
    const quelle = `${MEDIEN}arbeit-${id}-${art}-lang-${von}.webp`;
    const { width, height } = await sharp(quelle).metadata();
    const roh = await sharp(quelle).extract({ left: 0, top: 0, width, height: Math.round(height * anteil) }).resize({ width: nach }).toBuffer();
    const meta = await sharp(roh).metadata();
    const avif = await sharp(roh).avif({ quality: 32, effort: 6 }).toFile(`${MEDIEN}mosaik-${id}-${art}.avif`);
    const webp = await sharp(roh).webp({ quality: 55, effort: 6 }).toFile(`${MEDIEN}mosaik-${id}-${art}.webp`);
    console.log(`${id}-${art} ${meta.width}×${meta.height}  avif ${Math.round(avif.size / 102.4) / 10} KB  webp ${Math.round(webp.size / 102.4) / 10} KB`);
  }
}
