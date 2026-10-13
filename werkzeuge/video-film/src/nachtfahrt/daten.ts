// „Nachtfahrt“: Zeitleiste, Wörter, Rechtecke der Aufnahmen, Layouts (beide Formate).
// Grundsatz: die Stimme ist fest, das Bild folgt ihr. Alle Zeiten in Filmframes (60 fps).
// Runde 2 (13.10.2026): Stimme Take C „Rauchiger Kapitän“, Wortzeiten woerter2.json; Zeitleiste und Ereignisframes
// kommen aus zeitleiste2.json (ton/zeitleiste2.py) – dieselbe Quelle nutzt die Geräuschspur (Peak auf Ereignisframe).
import { Easing } from "remotion";
import woerter from "../../public/nachtfahrt/woerter2.json";
import Z from "./zeitleiste2.json";
import rectsD from "../../public/nachtfahrt/r2/D-A.rects.json";
import rectsP from "../../public/nachtfahrt/r2/P-A.rects.json";

export const FPS = 60;
export const DAUER = Z.dauer; // 60,0 s
export type Fmt = "169" | "916";
export type Q = "D" | "P"; // Desktop- bzw. Handy-Aufnahme
export const qVon = (fmt: Fmt): Q => (fmt === "169" ? "D" : "P");

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const kamera = Easing.bezier(0.45, 0, 0.2, 1); // Vorgabe für jede Kamerafahrt
export const zug = Easing.bezier(0.5, 0, 0.3, 1); // Glutpunkt: ein Zug, bremst ins Ziel
export const glatt = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// ---------------- Farben ----------------
export const C = {
  grund: "#0d0b08",
  messing: "#c9954a",
  pergament: "#ebe1cc",
  heiss: "#ffb347",
  kern: "#fff1c4",
  schein: "#ff7a1a",
};

// ---------------- Wörter (woerter.json, Sekunden Filmzeit) ----------------
export type Wort = { z: string; w: string; s: number; e: number };
export const W: Wort[] = woerter as Wort[];
/** Wortbeginn/-ende in Filmframes (mit Bruchteil, keine Rundung) */
export const ws = (i: number) => W[i].s * FPS;
export const we = (i: number) => W[i].e * FPS;

// Untertitel-Tafeln: [erstes Wort, letztes Wort, Umbruch 16:9, Umbruch 9:16] (Umbruch = Index des ersten Worts der 2. Zeile)
// art: „pruef“ = Prüfzeile mit Häkchen (L6), „leist“ = Leistungszeile (L8) – Einblendung statt wörtlichem Untertitel
export type Tafel = { a: number; b: number; br: Record<Fmt, number | null>; dezent?: boolean; art?: "pruef" | "leist" };
/** Index des n-ten Worts mit genau diesem Text (Satzzeichen inklusive) */
export const wi = (text: string, n = 0) => {
  const k = W.map((w, i) => (w.w === text ? i : -1)).filter((i) => i >= 0);
  if (k[n] === undefined) throw new Error(`Wort fehlt: ${text} #${n}`);
  return k[n];
};
const tafel = (a: string, b: string, br169: string | null, br916: string | null, x: Partial<Tafel> = {}, na = 0, nb = 0): Tafel =>
  ({ a: wi(a, na), b: wi(b, nb), br: { "169": br169 ? wi(br169) : null, "916": br916 ? wi(br916) : null }, ...x });
export const TAFELN: Tafel[] = [
  tafel("Erst", "Fahrt!", "Dann", "Dann", { dezent: true }), // Erst der Kurs. / Dann die Fahrt!
  tafel("Ihre", "Kurs.", null, "Klar", {}, 0, 1), // Ihre Website. / Klar auf Kurs.
  { ...tafel("Für", "Restaurants.", null, null), br: { "169": null, "916": wi("und") } }, // Für Praxen, Werkstätten / und Restaurants.
  { ...tafel("Schnell", "aufgebaut.", null, null), br: { "169": null, "916": wi("Klar", 1) } }, // Schnell auf dem Handy. / Klar aufgebaut.
  { ...tafel("Für", "lesbar.", null, null, {}, 1), br: { "169": null, "916": wi("gut") } }, // Für Google und KI-Assistenten / gut lesbar.
  tafel("Sie", "Betrieb.", null, "von"), // Sie erzählen / von Ihrem Betrieb.
  tafel("Ich", "prüfe.", null, "baue"), // Ich entwerfe, / baue und prüfe.
  tafel("Uhrmacherei.", "Präzisionswerkzeuge.", null, "Präzisionswerkzeuge."),
  tafel("Restaurant.", "Studio.", null, null),
  { ...tafel("Vier", "Idee.", null, null), br: { "169": null, "916": wi("jede") } }, // Vier Musterseiten, / jede mit eigener Idee.
  { ...tafel("Keine", "besteht:", null, null), br: { "169": null, "916": wi("bevor") } }, // Keine Seite legt ab, / bevor sie jede Prüfung besteht:
  tafel("Tempo,", "Sicherheit.", null, null, { art: "pruef" }), // Prüfzeile: ✓ Tempo ✓ Barrierefreiheit ✓ Datenschutz ✓ Sicherheit
  // L7 „Gebaut. Geprüft. Gepflegt.“ trägt die große Einblendung selbst
  tafel("Und", "Bord.", "Gehe", "Gehe"), // Und nach dem Start? / Gehe ich nicht von Bord.
  tafel("Hosting,", "mehr.", null, null, { art: "leist" }), // Hosting · Wartung · Pflege · Änderungen · und vieles mehr
  tafel("Kein", "endet.", null, null), // Kein Auftrag, der endet.
  { ...tafel("Eine", "Reise.", null, null), br: { "169": null, "916": wi("für") } }, // Eine Partnerschaft / für die ganze Reise.
  { ...tafel("Ihr", "Gespräch.", null, null), br: { "169": null, "916": wi("mit", 1) } }, // Ihr Kurs beginnt / mit einem Gespräch.
];

// ---------------- Rechtecke der Aufnahmen (CSS-px im Viewport, Schrittliste je Element) ----------------
type Schritte = Record<string, (number | null)[][]>;
const RECTS: Record<Q, { rects: Schritte; scrollY: number[] }> = {
  D: rectsD as unknown as { rects: Schritte; scrollY: number[] },
  P: rectsP as unknown as { rects: Schritte; scrollY: number[] },
};
export type R = [number, number, number, number];
export const rect = (q: Q, key: string, src: number): R | null => {
  const L = RECTS[q].rects[key];
  let e = L[0];
  for (const x of L) {
    if ((x[0] as number) <= src) e = x;
    else break;
  }
  return e[1] == null ? null : [e[1] as number, e[2] as number, e[3] as number, e[4] as number];
};
export const scrollY = (q: Q, src: number) => RECTS[q].scrollY[Math.max(0, Math.min(RECTS[q].scrollY.length - 1, src))];

// ---------------- Aufnahme-Geometrie ----------------
// Videopixel und CSS-Viewport der Aufnahmen (README aufnahme-fertig)
export const AUF: Record<Q, { vw: number; vh: number; cw: number; ch: number }> = {
  D: { vw: 2000, vh: 1124, cw: 1600, ch: 1124 / 1.25 },
  P: { vw: 974, vh: 1450, cw: 390, ch: 580 },
};

// ---------------- Layouts ----------------
export type Box = { x: number; y: number; w: number };
export type Lay = {
  W: number; H: number;
  A: Box; // Seitenfenster Beat 2–6
  B: Box; // Seitenfenster Beat 9–10 (Platz für Wortmarke + Knopf)
  band: { top: number; bottom: number; size: number; maxW: number };
  marke: { x: number; y: number; w: number; align: "left" | "center"; groesse: number };
  knopf: { x: number; y: number; w: number; h: number; schrift: number };
};
export const LAY: Record<Fmt, Lay> = {
  "169": {
    W: 1920, H: 1080,
    A: { x: 304, y: 78, w: 1312 },
    B: { x: 120, y: 120, w: 1088 },
    band: { top: 842, bottom: 1040, size: 46, maxW: 1560 },
    marke: { x: 1290, y: 300, w: 520, align: "left", groesse: 76 },
    knopf: { x: 1290, y: 486, w: 372, h: 72, schrift: 27 },
  },
  "916": {
    W: 1080, H: 1920,
    A: { x: 150, y: 230, w: 780 },
    B: { x: 220, y: 150, w: 640 },
    // 9:16: unten 300 px und rechts 120 px frei (Plattform-UI)
    band: { top: 1428, bottom: 1612, size: 54, maxW: 880 },
    marke: { x: 60, y: 1146, w: 960, align: "center", groesse: 60 },
    knopf: { x: 320, y: 1262, w: 440, h: 84, schrift: 31 },
  },
};
/** Fensterhöhe zur Breite (Seitenverhältnis der Aufnahme) */
export const hoehe = (q: Q, w: number) => (w * AUF[q].vh) / AUF[q].vw;

// ---------------- Zeitleiste (Filmframes, aus zeitleiste2.json) ----------------
type ZT = typeof Z.T;
type Paar = [number, number];
export const T = Z.T as unknown as Omit<ZT, "seiteEin" | "blende3" | "blende3b" | "blende4" | "blende4b" | "blatt5" | "musterEin" | "blende6" | "musterAus" | "pendel" | "fensterAus" | "merksatzAus" | "kiel" | "listeAus" | "laterneAus" | "fensterBEin" | "markeEin" | "knopfEin" | "ring" | "blende10" | "kuehlen"> & {
  seiteEin: Paar; blende3: Paar; blende3b: Paar; blende4: Paar; blende4b: Paar; blatt5: Paar; musterEin: Paar; blende6: Paar; musterAus: Paar;
  pendel: Paar; fensterAus: Paar; merksatzAus: Paar; kiel: Paar; listeAus: Paar; laterneAus: Paar; fensterBEin: Paar; markeEin: Paar;
  knopfEin: Paar; ring: Paar; blende10: Paar; kuehlen: Paar;
};
/** Ereignisframes (Bildereignis = Peak des Geräuschs) */
export const EV = Z.ereignisse;

/** Quellbild (Frame der Aufnahme) für einen Filmframe: a + (f - f0), begrenzt */
export const lauf = (f: number, f0: number, a: number, lo: number, hi: number) => Math.round(Math.min(hi, Math.max(lo, a + (f - f0))));

// Handy Ablauf, Ansicht B: Bild der Fahrt 1218–1482, in dem 03 und 04 zwischen Kopf- und Fußleiste stehen
// (Runde 1 scrollY ≈ 4030; Runde 2 liegt der Ablauf 29 px höher → 4001)
export const P_ABLAUF_B = (() => {
  let best = 1218, d = 1e9;
  for (let i = 1218; i <= 1482; i++) { const x = Math.abs(scrollY("P", i) - 4001); if (x < d) { d = x; best = i; } }
  return best;
})();
