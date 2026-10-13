import React from "react";
import { AbsoluteFill, Composition, Easing, Img, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from "remotion";
import geo169 from "../public/seekarte/geo-169.json";
import geo916 from "../public/seekarte/geo-916.json";
import Z from "./nachtfahrt/zeitleiste2.json";

// Eröffnung „Nachtfahrt“ (Seitenkapitän): die brennende Seekarte, prozedural, 0 Credits.
// Vorgaben: video/03-regie.md §4, Zeiten nach der echten Stimme (06-dramaturgie.md §6), 60 fps.
// Grundsatz: NICHTS FLIMMERT. Alle Texturen sind vorgerechnet (seekarte/texturen.py, fester Seed),
// jeder Frame ist eine reine Funktion der Framenummer (kein Zufall, kein Zustand zwischen Frames).

export const FPS = 60;
/** Zeitmarken in Frames (Stimme ist fest, Bild folgt ihr). Für den Schnitt exportiert.
 *  Runde 2 (13.10.): aus nachtfahrt/zeitleiste2.json (ton/zeitleiste2.py, Wortzeiten Take C) – straffer Auftakt. */
export const SEEKARTE = {
  zuenden: Z.seekarte.zuenden, // Glutpunkt zündet
  erst: Z.seekarte.erst, // Glutpunkt beginnt zu ziehen (kurz vor „Erst“)
  kurs: Z.seekarte.kurs, // „Kurs“: Glutpunkt erreicht die Kompassrose, Aufglüh-Puls
  dann: Z.seekarte.dann, // „Dann“
  fahrt: Z.seekarte.fahrt, // „Fahrt!“: Karte öffnet sich entlang der Linie
  weg: Z.seekarte.weg, // Karte ganz weg
  ende: Z.seekarte.ende, // Szene endet auf dem Kajütenbild, danach Flug ins Seitenfenster
} as const;
export const SEEKARTE_DAUER = SEEKARTE.ende;
/** Kajütenbild am Szenenende: Skalierung 1,00, keine Belichtungsänderung → der Schnitt kann nahtlos übernehmen. */
export const kajueteSkala = (f: number) => interpolate(f, [SEEKARTE.fahrt, SEEKARTE.ende], [1.08, 1.0], { ...clamp, easing: kamera });

type Geo = typeof geo169;
type Format = "169" | "916";
const GEO: Record<Format, Geo> = { "169": geo169, "916": geo916 as Geo };
const BILD: Record<Format, string> = { "169": "seekarte/b1-kajuete-quer.webp", "916": "seekarte/b2-kajuete-hoch.webp" };
// Lampe im Kajütenbild (Anteil der Bildbreite/-höhe), dort flutet das Licht beim Öffnen
const LAMPE_BILD: Record<Format, [number, number]> = { "169": [0.935, 0.44], "916": [0.95, 0.56] };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const kamera = Easing.bezier(0.45, 0, 0.2, 1); // wie Film2
const zug = Easing.bezier(0.5, 0, 0.3, 1); // Glutpunkt: ein Zug, bremst ins Ziel
const brand = Easing.bezier(0.55, 0, 0.25, 1); // Brandkante: langsamer Anfang
const glatt = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const mischen = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t);
const rgb = (c: number[]) => `rgb(${c.map((v) => Math.round(v)).join(",")})`;
const HEISS = [255, 179, 71], MITTEL = [224, 154, 58], GOLD = [207, 174, 106], KERN = [255, 241, 196], SCHEIN = [255, 122, 26];

// ---------------- Kurslinie: Position und Durchgangsframe je Stützpunkt ----------------
const fortschritt = (f: number) => zug(Math.min(1, Math.max(0, (f - SEEKARTE.erst) / (SEEKARTE.kurs - SEEKARTE.erst))));
const punktAuf = (g: Geo, u: number): [number, number] => {
  const n = g.kurs.length - 1, x = Math.min(n, Math.max(0, u * n)), i = Math.min(n - 1, Math.floor(x)), t = x - i;
  return [g.kurs[i][0] + (g.kurs[i + 1][0] - g.kurs[i][0]) * t, g.kurs[i][1] + (g.kurs[i + 1][1] - g.kurs[i][1]) * t];
};
// Frame (mit Bruchteil), in dem der Glutpunkt den Anteil u der Linie passiert
const durchgang = (u: number) => {
  let lo: number = SEEKARTE.erst, hi: number = SEEKARTE.kurs;
  for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (fortschritt(m) < u) lo = m; else hi = m; }
  return (lo + hi) / 2;
};
const SCHRITT = 2; // jeder 2. Stützpunkt = ein Segment (≈ 4,5 px)
const SEGMENTE = (g: Geo) => {
  const out: { a: [number, number]; b: [number, number]; ua: number; ub: number; fp: number; m: number }[] = [];
  const n = g.kurs.length - 1;
  for (let i = 0; i < n; i += SCHRITT) {
    const j = Math.min(n, i + SCHRITT);
    out.push({ a: g.kurs[i] as [number, number], b: g.kurs[j] as [number, number], ua: i / n, ub: j / n, fp: durchgang(j / n), m: Math.min(g.mKurs[i], g.mKurs[j]) });
  }
  return out;
};
const SEG: Record<Format, ReturnType<typeof SEGMENTE>> = { "169": SEGMENTE(geo169), "916": SEGMENTE(geo916 as Geo) };

// Brandschwelle T(f) in Einheiten der Maske m
const schwelle = (g: Geo, f: number) => interpolate(f, [SEEKARTE.fahrt, SEEKARTE.weg], [g.mmin - 0.004, g.mmax + 0.04], { ...clamp, easing: brand });
const anfang = (f: number) => glatt(SEEKARTE.fahrt - 1, SEEKARTE.fahrt + 8, f);
const trennung = (f: number) => interpolate(f, [SEEKARTE.fahrt + 6, SEEKARTE.ende], [0, 1], { ...clamp, easing: kamera });

// ---------------- Funken: feste Liste (Seed), höchstens 4 gleichzeitig ----------------
const prng = (seed: number) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const FUNKEN = (() => {
  const r = prng(4711), out: { b: number; life: number; rise: number; dx: number; size: number; ph: number }[] = [];
  for (let b = SEEKARTE.erst + 4; b < SEEKARTE.kurs + 14; b += 10 + Math.floor(r() * 4)) out.push({ b, life: 30 + Math.floor(r() * 12), rise: 20 + r() * 20, dx: (r() - 0.5) * 14, size: 0.9 + r() * 0.7, ph: r() * 6.28 });
  return out;
})();

// ---------------- Texturen laden (einmal, dann unverändert) ----------------
type Daten = { cw: number; ch: number; karte: Uint8ClampedArray; m: Float32Array; seite: Float32Array; g: Float32Array; franse: Float32Array; vari: Float32Array; ganzA: ImageData; ganzB: ImageData };
const cache: Partial<Record<Format, Promise<Daten>>> = {};
const pixel = async (url: string) => {
  const blob = await (await fetch(url)).blob();
  const bmp = await createImageBitmap(blob, { colorSpaceConversion: "none", premultiplyAlpha: "none" });
  const c = new OffscreenCanvas(bmp.width, bmp.height), x = c.getContext("2d", { willReadFrequently: true })!;
  x.drawImage(bmp, 0, 0);
  return x.getImageData(0, 0, bmp.width, bmp.height);
};
const laden = (fmt: Format): Promise<Daten> => (cache[fmt] ??= (async () => {
  const g = GEO[fmt];
  const [k, fe, ra] = await Promise.all([pixel(staticFile(`seekarte/karte-${fmt}.webp`)), pixel(staticFile(`seekarte/feld-${fmt}.png`)), pixel(staticFile(`seekarte/rand-${fmt}.png`))]);
  const n = k.width * k.height, m = new Float32Array(n), seite = new Float32Array(n), gr = new Float32Array(n), franse = new Float32Array(n), vari = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    m[i] = (fe.data[o] * 256 + fe.data[o + 1]) / 65535;
    seite[i] = fe.data[o + 2] / 255;
    gr[i] = Math.exp(g.glo + (ra.data[o] / 255) * (g.ghi - g.glo));
    vari[i] = ra.data[o + 1] / 255;
    franse[i] = ra.data[o + 2] / 255;
  }
  // unversehrte Hälften (vor dem Öffnen jeden Frame identisch → einmal gerechnet)
  const ganzA = new ImageData(k.width, k.height), ganzB = new ImageData(k.width, k.height);
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    for (let c = 0; c < 3; c++) { ganzA.data[o + c] = k.data[o + c]; ganzB.data[o + c] = k.data[o + c]; }
    ganzA.data[o + 3] = Math.round(seite[i] * 255);
    ganzB.data[o + 3] = seite[i] < 1 ? 255 : 0;
  }
  return { cw: k.width, ch: k.height, karte: k.data, m, seite, g: gr, franse, vari, ganzA, ganzB };
})());

// ---------------- Brandkante je Frame (reine Funktion von T) ----------------
const KOHLE = [42, 26, 14], BRAUN = [107, 74, 38];
// an: 0→1 in den ersten Frames nach „Fahrt“ – Bräunung, Kohle und Glut blenden ein statt aufzuspringen
const brennen = (d: Daten, T: number, an: number, a: ImageData, b: ImageData, ga: ImageData, gb: ImageData) => {
  const { karte, m, seite, g, franse, vari } = d, n = d.cw * d.ch;
  const A = a.data, B = b.data, GA = ga.data, GB = gb.data;
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    const dpx = (m[i] - T) / g[i]; // Abstand zur Brandkante in px (+ = Papier steht noch)
    if (dpx > 40) { // weit weg: Papier unverändert
      const s = seite[i];
      A[o] = B[o] = karte[o]; A[o + 1] = B[o + 1] = karte[o + 1]; A[o + 2] = B[o + 2] = karte[o + 2];
      A[o + 3] = s * 255; B[o + 3] = s < 1 ? 255 : 0; GA[o + 3] = GB[o + 3] = 0;
      continue;
    }
    if (dpx < -14) { A[o + 3] = B[o + 3] = GA[o + 3] = GB[o + 3] = 0; continue; }
    const fr = franse[i] - 0.5;
    const alpha = Math.min(1, Math.max(0, dpx + 0.5));
    let r = karte[o], gg = karte[o + 1], bb = karte[o + 2];
    // gebräuntes Papier vor der Kante (≈ 20 px)
    const braun = (1 - glatt(6, 32 + fr * 10, dpx)) * 0.6 * an;
    r += (BRAUN[0] * 0.55 - r) * braun * 0.55; gg += (BRAUN[1] * 0.5 - gg) * braun * 0.6; bb += (BRAUN[2] * 0.45 - bb) * braun * 0.7;
    // Kohleband 8–10 px, zerfranst
    const kb = (1 - glatt(7 + fr * 6, 10.5 + fr * 6, dpx)) * an;
    r += (KOHLE[0] - r) * kb; gg += (KOHLE[1] - gg) * kb; bb += (KOHLE[2] - bb) * kb;
    // Glutsaum ≈ 3 px direkt an der Kante, #ffb347 → #ff7a1a
    const vg = 0.55 + 0.6 * vari[i]; // Glut nicht überall gleich stark
    const gs = (1 - glatt(0.6, 2.6 + fr * 1.5, dpx)) * Math.min(1, vg) * an;
    const tt = Math.min(1, Math.max(0, dpx / 3));
    const hr = 255, hg = 179 + (122 - 179) * tt, hb = 71 + (26 - 71) * tt;
    r += (hr - r) * gs; gg += (hg - gg) * gs; bb += (hb - bb) * gs;
    const s = seite[i];
    A[o] = B[o] = r; A[o + 1] = B[o + 1] = gg; A[o + 2] = B[o + 2] = bb;
    A[o + 3] = alpha * s * 255; B[o + 3] = s < 1 ? alpha * 255 : 0;
    // Schein (wird per CSS weichgezeichnet, screen)
    const sch = Math.exp(-(((dpx - 0.5) / 3.4) ** 2)) * (0.85 + 0.3 * fr) * vg * 0.8 * an;
    GA[o] = GB[o] = 255; GA[o + 1] = GB[o + 1] = 140; GA[o + 2] = GB[o + 2] = 40;
    GA[o + 3] = sch * s * 255; GB[o + 3] = sch * (1 - s) * 255;
  }
};

// ---------------- Ebene: Karte in zwei Hälften (Canvas) ----------------
const puffer: Partial<Record<Format, ImageData[]>> = {};
const Haelften: React.FC<{ fmt: Format; f: number; daten: Daten | null }> = ({ fmt, f, daten }) => {
  const g = GEO[fmt];
  const refs = [React.useRef<HTMLCanvasElement>(null), React.useRef<HTMLCanvasElement>(null), React.useRef<HTMLCanvasElement>(null), React.useRef<HTMLCanvasElement>(null)];
  const T = schwelle(g, f);
  React.useLayoutEffect(() => {
    if (!daten || refs.some((r) => !r.current)) return;
    const ctx = refs.map((r) => r.current!.getContext("2d")!);
    if (f < SEEKARTE.fahrt) {
      // unversehrte Karte: nur neu setzen, wenn die Leinwand nicht schon genau diesen Inhalt hat
      if (refs[0].current!.dataset.inhalt !== "ganz") {
        ctx[0].putImageData(daten.ganzA, 0, 0); ctx[1].putImageData(daten.ganzB, 0, 0);
        ctx[2].clearRect(0, 0, daten.cw, daten.ch); ctx[3].clearRect(0, 0, daten.cw, daten.ch);
        refs[0].current!.dataset.inhalt = "ganz";
      }
      return;
    }
    refs[0].current!.dataset.inhalt = "brand";
    // Puffer werden je Frame vollständig neu beschrieben (jeder Alphawert) → kein Zustand wirkt nach
    const im = (puffer[fmt] ??= [0, 1, 2, 3].map(() => new ImageData(daten.cw, daten.ch)));
    brennen(daten, T, anfang(f), im[0], im[1], im[2], im[3]);
    im.forEach((x, i) => ctx[i].putImageData(x, 0, 0));
  }, [daten, f, T]);
  const weg = f >= SEEKARTE.weg + 2; // danach unsichtbar, aber gemountet
  const sep = trennung(f);
  const [nx, ny] = g.normale; // zeigt zur Seite A
  const mid = punktAuf(g, 0.5);
  const ux = g.rose[0] - g.start[0], uy = g.rose[1] - g.start[1], ul = Math.hypot(ux, uy);
  // Hälften weichen je 35 px auseinander und kippen um 6° zum Betrachter (Achse = Linie), Schatten wächst.
  // 0,05° Grundneigung ab Frame 0: der 3D-Abtastweg ist von Anfang an derselbe (sonst Sprung beim Losfahren)
  const hälfte = (sgn: 1 | -1): React.CSSProperties => ({
    position: "absolute", left: -g.P, top: -g.P, width: g.CW, height: g.CH,
    transformOrigin: `${mid[0]}px ${mid[1]}px`,
    transform: `translate(${sgn * nx * 35 * sep}px, ${sgn * ny * 35 * sep}px) rotate3d(${ux / ul}, ${uy / ul}, 0, ${-sgn * (0.05 + 6 * sep)}deg)`,
    // Filter immer gesetzt (anfangs unsichtbar): ein später zugeschalteter Filter würde die Karte neu abtasten → Sprung
    filter: `drop-shadow(0 ${(14 * sep).toFixed(3)}px ${(28 * sep).toFixed(3)}px rgba(0,0,0,${(0.55 * sep).toFixed(4)}))`,
    willChange: "transform, filter",
  });
  const cv: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: g.CW, height: g.CH };
  const schein: React.CSSProperties = { ...cv, filter: "blur(7px)", mixBlendMode: "screen", opacity: 0.6 };
  return (
    <AbsoluteFill style={{ perspective: 2600, opacity: weg ? 0 : 1 }}>
      <div style={hälfte(-1)}><canvas ref={refs[1]} width={g.CW} height={g.CH} style={cv} /><canvas ref={refs[3]} width={g.CW} height={g.CH} style={schein} /></div>
      <div style={hälfte(1)}><canvas ref={refs[0]} width={g.CW} height={g.CH} style={cv} /><canvas ref={refs[2]} width={g.CW} height={g.CH} style={schein} /></div>
    </AbsoluteFill>
  );
};

// ---------------- Ebene: Glutpunkt, Messinglinie, Funken, Nachglühen (SVG) ----------------
const Glut: React.FC<{ fmt: Format; f: number }> = ({ fmt, f }) => {
  const g = GEO[fmt], seg = SEG[fmt], T = schwelle(g, f);
  // Ebenen bleiben immer gemountet (gleicher Compositing-Weg in jedem Frame → kein Sprung beim Ein-/Ausblenden)
  const aktiv = f >= SEEKARTE.zuenden && f <= SEEKARTE.fahrt + 40;
  const u = fortschritt(f);
  const [ex, ey] = punktAuf(g, u);
  // Helligkeit des Glutpunkts: zünden, ziehen, Puls am Ziel, dann sanft zum Nachglühen
  const zund = interpolate(f, [SEEKARTE.zuenden, SEEKARTE.erst + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const puls = f >= SEEKARTE.kurs && f < SEEKARTE.kurs + 10 ? Math.sin(((f - SEEKARTE.kurs) / 10) * Math.PI) : 0;
  const nach = interpolate(f, [SEEKARTE.kurs + 10, SEEKARTE.kurs + 80], [1, 0.32], { ...clamp, easing: kamera });
  const wieder = interpolate(f, [SEEKARTE.fahrt - 14, SEEKARTE.fahrt + 2], [0, 0.55], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const aus = interpolate(f, [SEEKARTE.fahrt + 4, SEEKARTE.fahrt + 30], [1, 0], clamp);
  const leben = 1 + 0.035 * Math.sin(f * 0.13) + 0.02 * Math.sin(f * 0.29 + 1.3); // ruhiges Atmen, kein Flackern
  const hell = aktiv ? zund * Math.min(1, nach + wieder) * aus * leben : 0;
  const gross = 1 + 0.3 * puls;
  // Linie: Segmente, die der Punkt passiert hat; Farbe nach Alter (0,6 s: heiß → #e09a3a → Gold)
  const sichtbar = aktiv ? seg.filter((s) => u > s.ua && T < s.m + 0.002) : [];
  const teile = sichtbar.map((s) => {
    const alter = f - s.fp;
    let h = 1 - glatt(0, 36, alter);
    // vor der Brandfront glüht die Linie wieder auf
    if (f >= SEEKARTE.fahrt) h = Math.max(h, (1 - glatt(0, 0.02, s.m - T)) * anfang(f));
    const c = h > 0.5 ? mischen(MITTEL, HEISS, (h - 0.5) * 2) : mischen(GOLD, MITTEL, h * 2);
    // letztes Segment endet genau am Glutpunkt
    const b = u < s.ub && u > s.ua ? [ex, ey] : s.b;
    // Schein: heiß stark, danach bleibt ein warmer Rest, der langsam (≈ 2 s) abklingt
    const w = Math.max(h * 0.7, 0.26 * (1 - glatt(0, 120, alter)) * aus);
    return { a: s.a, b, h, c, w };
  });
  const d = (p: { a: number[]; b: number[] }) => `M${p.a[0].toFixed(2)},${p.a[1].toFixed(2)}L${p.b[0].toFixed(2)},${p.b[1].toFixed(2)}`;
  const nachglut = interpolate(f, [SEEKARTE.kurs - 8, SEEKARTE.kurs + 6, Math.min(SEEKARTE.kurs + 120, SEEKARTE.fahrt - 30), SEEKARTE.fahrt - 14, SEEKARTE.fahrt + 2], [0, 1, 0.42, 0.38, 0.8], clamp) * aus;
  const box = { position: "absolute" as const, left: -g.P, top: -g.P, width: g.CW, height: g.CH, overflow: "visible" as const };
  return (
    <>
      {/* eingebrannte Spur: dunkler Hof unter der Messinglinie */}
      <svg style={{ ...box, filter: "blur(1.4px)" }} viewBox={`0 0 ${g.CW} ${g.CH}`}>
        <g fill="none" stroke="#2e1a0a" strokeLinecap="round" strokeWidth={5} opacity={0.5}>{teile.map((p, i) => <path key={i} d={d(p)} />)}</g>
      </svg>
      <svg style={box} viewBox={`0 0 ${g.CW} ${g.CH}`}>
        {teile.map((p, i) => <path key={i} d={d(p)} fill="none" stroke={rgb(p.c)} strokeWidth={1.6 + 0.8 * p.h} strokeLinecap="round" />)}
      </svg>
      {/* Schein der heißen Linie, Glutpunkt, Funken, Nachglühen am Ziel */}
      <svg style={{ ...box, mixBlendMode: "screen" }} viewBox={`0 0 ${g.CW} ${g.CH}`}>
        <defs>
          <filter id={`w${fmt}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={4} /></filter>
          <filter id={`s${fmt}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={8} /></filter>
          <radialGradient id={`h${fmt}`}><stop offset="0" stopColor="#ffc46a" stopOpacity={0.85} /><stop offset="0.3" stopColor="#ff8a2a" stopOpacity={0.34} /><stop offset="1" stopColor="#ff7a1a" stopOpacity={0} /></radialGradient>
          <radialGradient id={`n${fmt}`}><stop offset="0" stopColor="#ffb347" stopOpacity={0.6} /><stop offset="0.45" stopColor="#ff7a1a" stopOpacity={0.22} /><stop offset="1" stopColor="#ff7a1a" stopOpacity={0} /></radialGradient>
        </defs>
        <circle cx={g.rose[0]} cy={g.rose[1]} r={g.roseR * (0.62 + 0.12 * puls)} fill={`url(#n${fmt})`} opacity={aktiv ? nachglut : 0} />
        <g filter={`url(#w${fmt})`} fill="none" strokeLinecap="round">
          {teile.filter((p) => p.w > 0.01).map((p, i) => <path key={i} d={d(p)} stroke="#ff7a1a" strokeWidth={8} opacity={p.w} />)}
        </g>
        <g opacity={hell}>
          <circle cx={ex} cy={ey} r={70 * gross} fill={`url(#h${fmt})`} />
          <circle cx={ex} cy={ey} r={20 * gross} fill={rgb(SCHEIN)} opacity={0.55} filter={`url(#s${fmt})`} />
          <circle cx={ex} cy={ey} r={9 * gross} fill={rgb(HEISS)} opacity={0.9} filter={`url(#w${fmt})`} />
          <circle cx={ex} cy={ey} r={3.6 * gross} fill={rgb(KERN)} />
        </g>
        {FUNKEN.map((s, i) => {
          const t = (f - s.b) / s.life;
          if (!aktiv || t <= 0 || t >= 1) return null;
          const [sx, sy] = punktAuf(g, fortschritt(s.b));
          const k = Easing.out(Easing.quad)(t);
          const x = sx + s.dx * k + 2.5 * Math.sin(s.ph + t * 5), y = sy - s.rise * k;
          const op = Math.min(1, t * 8) * (1 - t) ** 1.5 * zund;
          return <circle key={i} cx={x} cy={y} r={s.size * (1 - 0.4 * t)} fill={rgb(mischen(KERN, SCHEIN, t))} opacity={op} />;
        })}
      </svg>
    </>
  );
};

// ---------------- Szene ----------------
export const Seekarte: React.FC<{ fmt: Format }> = ({ fmt }) => {
  const f = useCurrentFrame();
  const g = GEO[fmt];
  const [daten, setDaten] = React.useState<Daten | null>(null);
  const [h] = React.useState(() => delayRender(`seekarte-${fmt}`));
  React.useEffect(() => { laden(fmt).then((x) => { setDaten(x); continueRender(h); }); }, [fmt, h]);
  // Kamera: kaum merkliches Heranrücken an die Rose bis die Karte weg ist
  const zoom = interpolate(f, [0, SEEKARTE.weg], [1, 1.025], { ...clamp, easing: kamera });
  const ox = ((g.rose[0] - g.P) / g.W) * 100, oy = ((g.rose[1] - g.P) / g.H) * 100;
  // Aufblenden aus #0d0b08. Deckkraft nie genau 0: sonst wechselt Chrome den Compositing-Weg und tastet die ganze
  // Karte neu ab (messbarer Sprung). Runde 2: kein Lampenflackern mehr (wirkte als Helligkeitspumpen).
  const schwarz = interpolate(f, [0, 18], [1, 0], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const flacker = 0;
  // Kajüte: 1,08 → 1,00, Lampenlicht flutet (+≈0,3 Belichtung) und ist am Szenenende wieder neutral
  const flut = interpolate(f, [SEEKARTE.fahrt + 10, SEEKARTE.fahrt + 60, SEEKARTE.ende], [0, 1, 0], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const [lx, ly] = LAMPE_BILD[fmt];
  return (
    <AbsoluteFill style={{ background: "#0d0b08", overflow: "hidden" }}>
      {f >= SEEKARTE.fahrt - 2 && (
        <AbsoluteFill style={{ transform: `scale(${kajueteSkala(f)})`, transformOrigin: `${lx * 100}% ${ly * 100}%` }}>
          <Img src={staticFile(BILD[fmt])} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${(1 + 0.23 * flut).toFixed(5)})` /* Filter immer gesetzt: Zuschalten tastet neu ab */ }} />
          <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 70% at ${lx * 100}% ${ly * 100}%, rgba(255,214,150,${0.2 * flut}), rgba(255,190,110,0) 70%)`, mixBlendMode: "screen" }} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${ox}% ${oy}%` }}>
        <Haelften fmt={fmt} f={f} daten={daten} />
        <Glut fmt={fmt} f={f} />
        <AbsoluteFill style={{ background: "#0d0b08", opacity: Math.max(0.002, flacker) }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#0d0b08", opacity: Math.max(0.002, schwarz) }} />
    </AbsoluteFill>
  );
};

/** Beide Formate, je 400 Frames @ 60 fps. */
export const SeekarteKompositionen: React.FC = () => (
  <>
    <Composition id="Seekarte169" component={Seekarte} durationInFrames={SEEKARTE_DAUER} fps={FPS} width={1920} height={1080} defaultProps={{ fmt: "169" as Format }} />
    <Composition id="Seekarte916" component={Seekarte} durationInFrames={SEEKARTE_DAUER} fps={FPS} width={1080} height={1920} defaultProps={{ fmt: "916" as Format }} />
  </>
);
