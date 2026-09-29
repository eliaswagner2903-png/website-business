// Baut rechner.html aus rechner.vorlage.html + modell.mjs (eine Quelle für Formeln): node baue-rechner.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const hier = new URL('.', import.meta.url);
const modell = readFileSync(new URL('modell.mjs', hier), 'utf8').replace(/^export /gm, '');
const vorlage = readFileSync(new URL('rechner.vorlage.html', hier), 'utf8');
writeFileSync(new URL('rechner.html', hier), vorlage.replace('/*MODELL*/', () => modell));
console.log('rechner.html gebaut');
