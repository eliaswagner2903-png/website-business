// Bildpipeline: ein Eingabebild → AVIF + WebP in 640/1016/1600 px, dazu ein fertiges <picture>-Snippet.
// node werkzeuge/bilder.mjs <eingabe.jpg|png|webp|avif> <zielordner> [--name=terrasse] [--sizes="(min-width: 64rem) 50vw, 100vw"]
//                           [--alt="…"] [--breiten=640,1016,1600] [--hero] [--pfad=/medien/]
// --hero: Bild im ersten Bildschirm (LCP) → fetchpriority="high", nie lazy. Sonst loading="lazy" decoding="async".
// Nie hochskalieren: Breiten über der Originalbreite werden weggelassen (FEHLER.md Nr. 12), stattdessen das Original.
import fs from 'node:fs'; import path from 'node:path'; import sharp from 'sharp';
const args = process.argv.slice(2), frei = args.filter(a => !a.startsWith('--'));
const opt = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => { const [k, ...v] = a.slice(2).split('='); return [k, v.length ? v.join('=') : true]; }));
const [eingabe, ziel] = frei;
if (!eingabe || !ziel) { console.log('Aufruf: node werkzeuge/bilder.mjs <eingabe> <zielordner> [--name=…] [--sizes=…] [--alt=…] [--hero]'); process.exit(1); }
const name = opt.name || path.basename(eingabe, path.extname(eingabe)).toLowerCase().replace(/[^a-z0-9äöüß-]+/g, '-');
const pfad = (opt.pfad || '/medien/').replace(/\/?$/, '/');
const sizes = opt.sizes || '100vw';
const alt = opt.alt ?? '';
const quelle = sharp(eingabe, { failOn: 'error' }).rotate(); // rotate(): EXIF-Ausrichtung übernehmen, Metadaten fallen weg
const meta = await quelle.metadata();
const hoch = (meta.orientation || 1) >= 5; // 90°-gedreht laut EXIF
const W = hoch ? meta.height : meta.width, H = hoch ? meta.width : meta.height;
const gewuenscht = String(opt.breiten || '640,1016,1600').split(',').map(Number);
let breiten = gewuenscht.filter(b => b <= W);
if (W < Math.max(...gewuenscht)) breiten.push(W); // kleineres Original: in Originalbreite statt hochgerechnet
breiten = [...new Set(breiten)].sort((a, b) => a - b);
fs.mkdirSync(ziel, { recursive: true });
const zeilen = [], kb = f => (fs.statSync(f).size / 1024).toFixed(1);
for (const b of breiten) {
  const bild = quelle.clone().resize({ width: b, withoutEnlargement: true });
  const avif = path.join(ziel, `${name}-${b}.avif`), webp = path.join(ziel, `${name}-${b}.webp`);
  await bild.clone().avif({ quality: 55, effort: 6 }).toFile(avif);
  await bild.clone().webp({ quality: 78, effort: 6 }).toFile(webp);
  zeilen.push(`${String(b).padStart(5)} px  AVIF ${kb(avif).padStart(6)} KB · WebP ${kb(webp).padStart(6)} KB`);
}
const gross = breiten.at(-1), hoehe = Math.round(gross * H / W);
const set = typ => breiten.map(b => `${pfad}${name}-${b}.${typ} ${b}w`).join(', ');
const laden = opt.hero ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"';
const snippet = `<picture>
  <source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">
  <img src="${pfad}${name}-${breiten[Math.min(1, breiten.length - 1)]}.webp" srcset="${set('webp')}" sizes="${sizes}"
       width="${gross}" height="${hoehe}" ${laden} alt="${alt.replace(/"/g, '&quot;')}">
</picture>`;
console.log(`${eingabe}: ${W}×${H} → ${name}-*.avif/.webp in ${ziel}\n${zeilen.join('\n')}\n`);
if (!alt && !opt.deko) console.log('Hinweis: --alt fehlt. Aussagekräftigen Alt-Text ergänzen (oder --deko und alt="" für reine Dekoration).\n');
if (W < 1016) console.log(`Hinweis: Original nur ${W} px breit – nicht größer als ca. ${W} px zeigen, Original vom Kunden anfordern.\n`);
console.log(snippet);
