// Werbefilm UYGHUR HAUS (A-118): Wörter, Zeitleiste, Ansichten der Aufnahmen, Layouts (beide Formate).
// Grundsatz wie „Nachtfahrt“: die Stimme ist fest, das Bild folgt ihr. Alle Zeiten in Filmframes (60 fps).
// zeitleiste.json kommt aus ton/zeitleiste-uyghur.py (film) – dieselbe Quelle nutzt die Geräuschspur (Peak auf Ereignisframe).
import { Easing } from "remotion";
import woerter from "./woerter.json";
import Z from "./zeitleiste.json";

export const FPS = 60;
export const DAUER = Z.dauer; // 60,0 s
export type Fmt = "169" | "916";
export type Q = "D" | "P"; // Computer- bzw. Handy-Aufnahme
export const qVon = (fmt: Fmt): Q => (fmt === "169" ? "D" : "P");

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const kamera = Easing.bezier(0.45, 0, 0.2, 1); // Vorgabe für jede Kamerafahrt
export const glatt = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// ---------------- Farben der Seite (style.css :root) ----------------
export const C = {
  ink: "#0D0C0B",
  ink2: "#16130F",
  cream: "#F3EBDD",
  creamDim: "#B9AE9C",
  gold: "#D9A441",
  goldHi: "#F2D27A",
  goldLo: "#8A6420",
};
export const RGB = { cream: [243, 235, 221], gold: [217, 164, 65], goldHi: [242, 210, 122], creamDim: [185, 174, 156] };

// ---------------- Wörter (Sekunden Filmzeit) ----------------
export type Wort = { z: string; w: string; s: number; e: number };
export const W: Wort[] = woerter as Wort[];
export const ws = (i: number) => W[i].s * FPS;
export const we = (i: number) => W[i].e * FPS;
/** Index des n-ten Worts mit genau diesem Text (Satzzeichen inklusive) */
export const wi = (text: string, n = 0) => {
  const k = W.map((w, i) => (w.w === text ? i : -1)).filter((i) => i >= 0);
  if (k[n] === undefined) throw new Error(`Wort fehlt: ${text} #${n}`);
  return k[n];
};

// ---------------- Untertitel-Tafeln ----------------
// [erstes Wort, letztes Wort, Umbruch] (Umbruch = Index des ersten Worts der 2. Zeile). Lange Sätze im Hochformat geteilt.
export type Tafel = { a: number; b: number; br: number | null };
type Wahl = [string, number?];
const w_ = ([t, n]: Wahl) => wi(t, n ?? 0);
const tf = (a: Wahl, b: Wahl, br: Wahl | null = null): Tafel => ({ a: w_(a), b: w_(b), br: br ? w_(br) : null });
export const TAFELN: Record<Fmt, Tafel[]> = {
  "169": [
    tf(["Schon"], ["gegessen?"]),
    tf(["Dann"], ["Zeit."]),
    tf(["Willkommen"], ["Haus."]),
    tf(["Unsere"], ["Seidenstraße."]),
    tf(["Und"], ["Rind."]),
    tf(["Laghmen,"], ["Pfanne."]),
    tf(["Polo"], ["Rosinen."]),
    tf(["Manta,"], ["Teigtaschen."]),
    tf(["Und", 1], ["Spieß."]),
    tf(["Unsere", 1], ["online:"]),
    tf(["über"], ["Empfehlungen."], ["mit", 1]),
    tf(["Bei"], ["geteilt."]),
    tf(["Die"], ["drei."]),
    tf(["Und", 2], ["Tisch."]),
    tf(["Ihren"], ["hier:"]),
    tf(["Tag,"], ["Personen."]),
    tf(["Wir"], ["Bestätigung."]),
    // L8 „Würzig. Warm. Willkommen.“ trägt die große Einblendung selbst
    tf(["Uyghur", 1], ["Göppingen."]),
    tf(["Täglich"], ["zwölf."]),
    tf(["Wir", 1], ["Sie."]),
  ],
  "916": [
    tf(["Schon"], ["gegessen?"], ["uigurisch"]),
    tf(["Dann"], ["Zeit."]),
    tf(["Willkommen"], ["Haus."], ["im"]),
    tf(["Unsere"], ["Seidenstraße."], ["von"]),
    tf(["Und"], ["man:"]),
    tf(["Kreuzkümmel,"], ["Rind."], ["Lamm"]),
    tf(["Laghmen,"], ["Pfanne."], ["heiß"]),
    tf(["Polo"], ["Rosinen."], ["und", 1]),
    tf(["Manta,"], ["Teigtaschen."], ["gefüllte"]),
    tf(["Und", 1], ["Spieß."]),
    tf(["Unsere", 1], ["online:"], ["finden"]),
    tf(["über"], ["Gerichte,"]),
    tf(["mit", 1], ["Empfehlungen."], ["unseren"]),
    tf(["Bei"], ["geteilt."]),
    tf(["Die"], ["drei."], ["reichen"]),
    tf(["Und", 2], ["Tisch."], ["für", 1]),
    tf(["Ihren"], ["hier:"], ["Sie", 1]),
    tf(["Tag,"], ["Personen."]),
    tf(["Wir"], ["Bestätigung."], ["zur"]),
    tf(["Uyghur", 1], ["Göppingen."], ["Lange"]),
    tf(["Täglich"], ["zwölf."]),
    tf(["Wir", 1], ["Sie."]),
  ],
};

// ---------------- Aufnahmen ----------------
// Videopixel (gerade Maße, 1 px Rand beschnitten), CSS-Viewport und Pixeldichte der Aufnahmen
export const AUF: Record<Q, { vw: number; vh: number; cw: number; ch: number; dpr: number }> = {
  D: { vw: 2000, vh: 1124, cw: 1600, ch: 900, dpr: 1.25 },
  P: { vw: 974, vh: 1450, cw: 390, ch: 580, dpr: 2.5 },
};
/** Fensterhöhe zur Breite */
export const hoehe = (q: Q, w: number) => (w * AUF[q].vh) / AUF[q].vw;
/** CSS-Pixel der Aufnahme → Fensterpixel bei Fensterbreite w */
export const kCss = (q: Q, w: number) => (AUF[q].dpr * w) / AUF[q].vw;

export type Ansicht = { key: string; shot: string; von: number; bis: number; ein: [number, number] | null; src: number[] };
export type Ueber = { art: "ziel" | "glanz" | "strich" | "ring"; key: string; f: number; ansicht: string; r: [number, number, number, number] };
type Format = { ansichten: Ansicht[]; ueber: Ueber[]; ereignisse: Record<string, number> };
const FORM = Z.formate as unknown as Record<Q, Format>;
export const ANSICHTEN = (q: Q) => FORM[q].ansichten;
export const UEBER = (q: Q) => FORM[q].ueber;
export const ziel = (q: Q) => FORM[q].ueber.find((u) => u.art === "ziel")!.r;
export const ansichtBis = (q: Q, key: string) => FORM[q].ansichten.find((a) => a.key === key)!.bis;

// ---------------- Zeitleiste (Filmframes) ----------------
type Paar = [number, number];
export const T = Z.T as unknown as {
  zuenden: number; schwung1: number; schwung2: number; wurf: number; kuss: number; landung: number; startEin: number;
  rueckfahrt: Paar; wortmarke: number; karten: number[]; klickKarte: number; tag: number; uhrzeit: number; personen: number;
  merksatz: number[]; route: number; adresse: number; zeiten: number; knopf: number;
  blendeKarte: Paar; blendeEmpf: Paar; blendeTeilen: Paar; blendeTee: Paar; blendeRes: Paar; blendeDanke: Paar;
  fensterAus: Paar; merksatzAus: Paar; fensterBEin: Paar; markeEin: Paar; wokAus: Paar; fensterAEin: Paar;
};
export const WOK_OFF = Z.wokOff; // s: Filmzeit t ↔ Schleifenphase (t − WOK_OFF) mod 6

// ---------------- Layouts ----------------
export type Box = { x: number; y: number; w: number; oben?: number }; // oben: CSS-Pixel der Aufnahme, die oben wegfallen
export type Lay = {
  W: number; H: number;
  A: Box; // Seitenfenster (Start bis Reservierung)
  B: Box; // Seitenfenster Schlussbild
  band: { top: number; bottom: number; size: number; maxW: number };
  wok: { x: number; y: number; s: number }; // große Wok-Zeichnung im Vorspann (linke obere Ecke der viewBox, Skala)
  label: { right: number; top: number; size: number; topEnde?: number }; // topEnde: Lage im Schlussbild (Handyformat)
};
export const LAY: Record<Fmt, Lay> = {
  "169": {
    W: 1920, H: 1080,
    A: { x: 304, y: 78, w: 1312 },
    // oben: Rest des Fotos der Reservierung über „Besuch“ ausblenden; tiefer gesetzt, damit die Mitte beim Markenblock bleibt
    B: { x: 120, y: 174, w: 1088, oben: 120 },
    band: { top: 842, bottom: 1040, size: 46, maxW: 1560 },
    // Inhalt der Zeichnung ≈ x −20…960, y 160…870 (viewBox 1200×900): mittig über dem Untertitelband
    wok: { x: 466, y: -128, s: 1.05 },
    label: { right: 304, top: 30, size: 17 },
  },
  "916": {
    W: 1080, H: 1920,
    // Handyfilm: Handybildschirm randlos über die ganze Breite, Untertitel im Streifen darunter
    A: { x: 0, y: 0, w: 1080 },
    B: { x: 150, y: 70, w: 780, oben: 10 }, // oben: angeschnittene Dachzeile „Besuch“ ausblenden
    band: { top: 1672, bottom: 1900, size: 64, maxW: 1040 },
    wok: { x: 32, y: 244, s: 1.08 },
    // im Streifen zwischen Handybildschirm (endet bei 1608) und Untertiteln – nie über Seiteninhalt
    // im Schlussbild steht dort der Markenblock, dann wandert es in den Streifen über Fenster B (Wechsel während des Merksatzes)
    label: { right: 28, top: 1624, size: 24, topEnde: 22 },
  },
};
