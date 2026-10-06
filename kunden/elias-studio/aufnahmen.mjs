// Lange Aufnahmen der Arbeiten für die Geräte im Abschnitt „Arbeiten“ (die echte Seite läuft im Gerät durch).
// node aufnahmen.mjs            → public/medien/arbeit-<id>-{desktop,handy}-lang-<breite>.{avif,webp}
// Quelle: showcase/<id>/public bzw. kunden/urfa-sofrasi/public, lokal mit echten Headern ausgeliefert.
// Nach Änderungen an einer Musterseite neu laufen lassen; Maße stehen in bauen.mjs (LANG).
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { playwright } from '../../werkzeuge/_playwright.mjs';

const sharp = createRequire(new URL('../../werkzeuge/package.json', import.meta.url))('sharp');
const WURZEL = fileURLToPath(new URL('../../', import.meta.url));
const ZIEL = fileURLToPath(new URL('./public/medien/', import.meta.url));
const ALLE = [['hell', 'showcase/hell/public'], ['laut', 'showcase/laut/public'], ['edel', 'showcase/edel/public'], ['urfa', 'kunden/urfa-sofrasi/public']];
// Klarwerk (fiktive Fassung der Merys-Clean-Seite, nur fiktive Marke!): Ordner mit der umhüllten Vorschau-Datei als index.html,
// gebaut nach kunden/merysclean/fiktiv/README.md. Aufruf: KLARWERK_ORDNER=/pfad node aufnahmen.mjs klarwerk
if (process.env.KLARWERK_ORDNER) ALLE.push(['klarwerk', process.env.KLARWERK_ORDNER]);
// NORVAK (fiktive Fassung der OSG-Studie, nur fiktive Marke!): public/ einer Kopie, gebaut nach kunden/osg-germany/fiktiv/README.md
// (umbauen.py + bauen.mjs, ohne artifact.py). Aufruf: NORVAK_ORDNER=/pfad/public node aufnahmen.mjs norvak
if (process.env.NORVAK_ORDNER) ALLE.push(['norvak', process.env.NORVAK_ORDNER]);
// Optional nur bestimmte Arbeiten aufnehmen: node aufnahmen.mjs klarwerk
const NUR = process.argv.slice(2);
const QUELLEN = NUR.length ? ALLE.filter(([id]) => NUR.includes(id)) : ALLE;
// [Viewport, Pixeldichte, Höhe in CSS-Pixeln, Ausgabebreiten]
const ARTEN = {
  desktop: [{ width: 1440, height: 900 }, 1, 3600, [800, 1440]],
  handy: [{ width: 390, height: 844 }, 2, 3400, [320, 600]],
};

const server = QUELLEN.map(([, ordner], i) => spawn('node', ['werkzeuge/gzserver.mjs', String(8190 + i), ordner], { cwd: WURZEL, stdio: 'ignore' }));
await new Promise((r) => setTimeout(r, 800));
const { chromium } = await playwright();
const browser = await chromium.launch();
try {
  for (const [i, [id]] of QUELLEN.entries()) {
    for (const [art, [viewport, dpr, hoehe, breiten]] of Object.entries(ARTEN)) {
      const handy = art === 'handy';
      const kontext = await browser.newContext({ viewport, deviceScaleFactor: dpr, isMobile: handy, hasTouch: handy, reducedMotion: 'reduce' });
      const p = await kontext.newPage();
      await p.goto(`http://localhost:${8190 + i}/`, { waitUntil: 'load' });
      await p.waitForTimeout(1500);
      // Einmal durchscrollen, damit Einblendungen und faules Laden fertig sind
      for (let y = 0; y < hoehe + 2000; y += 500) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(50); }
      await p.evaluate(() => scrollTo(0, 0));
      await p.waitForTimeout(700);
      // Die feste Handy-Kontaktleiste stünde sonst mitten in der Ganzseiten-Aufnahme (CSP verbietet addStyleTag)
      await p.evaluate(() => document.querySelectorAll('.schnell').forEach((e) => e.style.setProperty('display', 'none', 'important')));
      const bild = await p.screenshot({ fullPage: true });
      const meta = await sharp(bild).metadata();
      const h = Math.min(meta.height, hoehe * dpr);
      for (const b of breiten) {
        const stueck = sharp(bild).extract({ left: 0, top: 0, width: meta.width, height: h }).resize({ width: b });
        await stueck.clone().avif({ quality: 50, effort: 6 }).toFile(`${ZIEL}arbeit-${id}-${art}-lang-${b}.avif`);
        await stueck.clone().webp({ quality: 72, effort: 6 }).toFile(`${ZIEL}arbeit-${id}-${art}-lang-${b}.webp`);
      }
      console.log(`${id} ${art}: ${meta.width}×${h} → ${breiten.join('/')} px`);
      await kontext.close();
    }
  }
} finally {
  await browser.close();
  server.forEach((s) => s.kill());
}
