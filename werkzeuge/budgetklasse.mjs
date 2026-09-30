// Gewichts-Klassen des Meisterstandards (P2). Die Grenze hängt am Zweck der Seite, nicht an einer festen Zahl.
// Klasse steht in kunde.json ("budgetklasse") neben dem public-Ordner oder wird per --klasse=... übergeben.
import fs from 'node:fs'; import path from 'node:path';
export const KLASSEN = {
  // Informationsseite (Handwerk, Gastro, Praxis): Nutzer will schnell Zeiten, Telefon, Karte
  schlank: { gesamt: 500, js: 60, jsNachgeladen: 180, css: 30, schrift: 120, schriftDateien: 3, anfragen: 25, fps: 55, perf: 95, bildMax: 300 },
  // Markenauftritt mit Bewegung, 3D, Konfigurator, Scroll-Effekten (JS erlaubt, wenn es Nutzen bringt)
  erlebnis: { gesamt: 1200, js: 200, jsNachgeladen: 600, css: 60, schrift: 250, schriftDateien: 5, anfragen: 40, fps: 55, perf: 90, bildMax: 500 },
  // Kino-Auftritt: Scroll-Film, große 3D-Szenen, Produkt-Showcase (schwere Medien erst nach Poster und „geladen“)
  kino: { gesamt: 2500, js: 350, jsNachgeladen: 1500, css: 100, schrift: 400, schriftDateien: 6, anfragen: 60, fps: 50, perf: 85, bildMax: 500 },
};
export function leseKlasse(ordner, arg) {
  const pruefe = (k) => { if (!KLASSEN[k]) throw new Error(`Unbekannte Gewichtsklasse „${k}“ (schlank, erlebnis, kino)`); return k; };
  if (arg) return pruefe(arg);
  for (const d of [path.resolve(ordner, '..'), path.resolve(ordner)]) {
    try { const k = JSON.parse(fs.readFileSync(path.join(d, 'kunde.json'), 'utf8')).budgetklasse; if (k) return pruefe(k); } catch { /* keine Angabe */ }
  }
  return 'schlank';
}
