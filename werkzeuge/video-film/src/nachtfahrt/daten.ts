// „Nachtfahrt“: Zeitleiste, Wörter, Rechtecke der Aufnahmen, Layouts (beide Formate).
// Grundsatz: die Stimme ist fest, das Bild folgt ihr. Alle Zeiten in Filmframes (60 fps).
import { Easing } from "remotion";
import woerter from "../../public/nachtfahrt/woerter.json";
import rectsD from "../../public/nachtfahrt/D-A.rects.json";
import rectsP from "../../public/nachtfahrt/P-A.rects.json";

export const FPS = 60;
export const DAUER = 3030; // 50,5 s
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
export type Tafel = { a: number; b: number; br: Record<Fmt, number | null>; dezent?: boolean };
export const TAFELN: Tafel[] = [
  { a: 0, b: 5, br: { "169": 3, "916": 3 }, dezent: true }, // Erst der Kurs. / Dann die Fahrt.
  { a: 6, b: 10, br: { "169": null, "916": 8 } }, // Ihre Website. Klar auf Kurs.
  { a: 11, b: 15, br: { "169": null, "916": 14 } }, // Für Praxen, Werkstätten und Restaurants.
  { a: 16, b: 21, br: { "169": null, "916": 20 } }, // Schnell auf dem Handy. Klar aufgebaut.
  { a: 22, b: 27, br: { "169": null, "916": 26 } }, // Für Google und KI-Assistenten gut lesbar.
  { a: 28, b: 32, br: { "169": null, "916": 30 } }, // Sie erzählen von Ihrem Betrieb.
  { a: 33, b: 38, br: { "169": null, "916": 36 } }, // Ich entwerfe, baue und messe nach.
  { a: 39, b: 40, br: { "169": null, "916": 40 } }, // Uhrmacherei. Präzisionswerkzeuge.
  { a: 41, b: 42, br: { "169": null, "916": null } }, // Restaurant. Studio.
  { a: 43, b: 48, br: { "169": null, "916": 45 } }, // Vier Musterseiten, jede mit eigener Idee.
  { a: 49, b: 55, br: { "169": 53, "916": 53 } }, // Jede Seite wird nachgemessen, / bevor sie ablegt.
  // L7 „Gebaut. Gemessen. Betreut.“ trägt die große Einblendung selbst
  { a: 59, b: 68, br: { "169": 66, "916": 64 } }, // Nach dem Start bleibe ich / an Bord, wenn Sie wollen.
  { a: 69, b: 74, br: { "169": null, "916": 71 } }, // Als Partner / für die ganze Reise.
  { a: 75, b: 80, br: { "169": null, "916": 78 } }, // Ihr Kurs beginnt / mit einem Gespräch.
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

// ---------------- Zeitleiste (Filmframes) ----------------
export const T = {
  seekarteEnde: 400, // Seekarte F0–400 endet auf dem Kajütenbild (Skala 1,00)
  matchStart: 406, // nach 6 Frames Übergabe von der Seekarte
  matchEnde: 446, // Kajütenbild liegt passgenau auf dem Hero-Bild im Fenster
  seiteEin: [442, 462] as [number, number], // Seiten-UI blendet über dem gelandeten Bild ein
  driftAb: 464,
  // Beat 3: Desktop-Scrollfahrt beginnt auf „Werkstätten“ (9,70 s) und endet 46 F vor „Handy“
  scroll3: 582,
  blende3: [582, 612] as [number, number], // Handy: Sprung → weiche Blende, ebenfalls auf „Werkstätten“
  blende3b: [778, 794] as [number, number], // Handy: lei → lei3 in der Pause vor „Klar“
  blende4: [1030, 1054] as [number, number], // Pause nach „lesbar.“ (17,08 s) vor „Sie“ (17,87 s)
  blende4b: [1215, 1235] as [number, number], // Handy: Ablauf 01/02 → 03/04 auf „entwerfe“
  blatt5: [1374, 1400] as [number, number], // Logbuch-Blatt wird umgeschlagen, fertig auf „Uhrmacherei“
  reiter: { edel: 1400, norvak: Math.round(24.49 * FPS), glut: Math.round(26.15 * FPS), laut: Math.round(27.21 * FPS) },
  blende6: [1854, 1878] as [number, number], // nach „Idee.“ (30,87 s)
  pendel: [1880, Math.round(32.66 * FPS)] as [number, number], // Nadel steht still auf „nachgemessen“
  glocke: Math.round(35.7 * FPS),
  fensterAus: [2150, 2190] as [number, number],
  merksatzAus: [2380, 2410] as [number, number],
  laterneAus: [2690, 2714] as [number, number], // nach „Reise.“ (44,83 s) erst ins Dunkel …
  fensterBEin: [2716, 2740] as [number, number], // … dann der Hafen, nie zwei Bilder übereinander
  markeEin: [2744, 2764] as [number, number],
  knopfEin: [2862, 2882] as [number, number], // ≈ 47,9 s, Knopf steht auf „Gespräch“ (47,95 s)
  ring: [2884, 2940] as [number, number], // Glutpunkt zieht die Linie um den Knopf, Kreis schließt sich bei 49,0 s
  blende10: [2940, 2976] as [number, number],
  kuehlen: [2940, 2990] as [number, number],
  steht: 2995,
};

/** Quellbild (Frame der Aufnahme) für einen Filmframe: a + (f - f0), begrenzt */
export const lauf = (f: number, f0: number, a: number, lo: number, hi: number) => Math.round(Math.min(hi, Math.max(lo, a + (f - f0))));

// Handy Ablauf, Ansicht B: Bild der Fahrt 1218–1482, in dem 03 und 04 zwischen Kopf- und Fußleiste stehen (scrollY ≈ 4030)
export const P_ABLAUF_B = (() => {
  let best = 1218, d = 1e9;
  for (let i = 1218; i <= 1482; i++) { const x = Math.abs(scrollY("P", i) - 4030); if (x < d) { d = x; best = i; } }
  return best;
})();
