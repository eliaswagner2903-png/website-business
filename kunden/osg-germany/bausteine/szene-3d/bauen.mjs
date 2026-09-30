// Bündelt quelle/szene.js mit den benötigten three.js-Teilen (Tree-Shaking) zu szene-3d.modul.js.
// node vorlage/bausteine/szene-3d/bauen.mjs   (esbuild und three liegen in werkzeuge/node_modules)
import path from 'node:path'; import fs from 'node:fs'; import zlib from 'node:zlib'; import { fileURLToPath, pathToFileURL } from 'node:url';
const hier = path.dirname(fileURLToPath(import.meta.url));
const nm = path.resolve(hier, '../../../werkzeuge/node_modules');
const { build } = await import(pathToFileURL(path.join(nm, 'esbuild/lib/main.js')).href);
const ziel = path.join(hier, 'szene-3d.modul.js');
await build({
  entryPoints: [path.join(hier, 'quelle/szene.js')], outfile: ziel, bundle: true, format: 'esm', minify: true,
  target: ['es2020'], nodePaths: [nm], legalComments: 'none',
  banner: { js: '/* szene-3d – enthält three.js (MIT-Lizenz, (c) 2010-2026 three.js authors) */' },
});
const roh = fs.readFileSync(ziel), gz = zlib.gzipSync(roh, { level: 9 }).length, br = zlib.brotliCompressSync(roh).length;
const three = JSON.parse(fs.readFileSync(path.join(nm, 'three/package.json'))).version;
console.log(`szene-3d.modul.js  ${(roh.length / 1024).toFixed(1)} KB roh · ${(gz / 1024).toFixed(1)} KB gzip · ${(br / 1024).toFixed(1)} KB brotli  (three ${three}, Grenze 180 KB)`);
if (gz > 180 * 1024) { console.error('Budget überschritten (> 180 KB gzip)'); process.exit(1); }
