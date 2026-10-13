import React from "react";
import {
  AbsoluteFill, Audio, Composition, Freeze, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, Easing,
} from "remotion";
import { getLength, getPointAtLength } from "@remotion/paths";
import { Seekarte, SEEKARTE } from "./Seekarte";
import {
  AUF, C, DAUER, FPS, Fmt, LAY, Lay, P_ABLAUF_B, Q, R, T, TAFELN, Tafel, W, clamp, glatt, hoehe, kamera, lauf, qVon, rect, scrollY, we, wi, ws, zug,
} from "./nachtfahrt/daten";

// Werbefilm „Nachtfahrt“ (Seitenkapitän), Runde 2: 60,0 s, 16:9 und 9:16 auf einer Zeitleiste (Stimme Take C).
// Regeln: nichts flimmert (jeder Frame ist eine reine Funktion der Framenummer, Filter/Masken ab dem Einhängen
// fest gesetzt, Deckkraft statt Umschalten), die Seite wird nie angeschnitten oder hineingezoomt, nur eine Bewegung
// pro Moment, Bewegungen beginnen auf betonten Wörtern oder in Pausen.

const nf = (p: string) => staticFile(`nachtfahrt/${p}`);
// Seitenaufnahmen Runde 2 (neue Seitentexte, scratchpad/aufnahme-r2): gleiche Bildzahlen und Marken wie Runde 1
const AUFN = "r2/";
// Tonspur Runde 2: Endmischung (ton2.wav, ton/endmix2.py); solange sie fehlt, nur die Stimme
const TON = "ton2.wav";
// Deckkraft nie genau 1: Chrome wechselt sonst beim Erreichen von 1 den Compositing-Weg (Ebene wird neu abgetastet → Sprung)
const dk = (x: number) => Math.min(0.995, Math.max(0, x));
const rampe = (f: number, [a, b]: [number, number]) => interpolate(f, [a, b], [0, 1], clamp);
const sinRampe = (f: number, [a, b]: [number, number]) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
const rgba = (c: number[], a: number) => `rgba(${c.map((v) => Math.round(v)).join(",")},${a.toFixed(4)})`;
const mischen = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t);
const MESSING = [201, 149, 74], PERG = [235, 225, 204], HEISS = [255, 179, 71], KERN = [255, 241, 196];

// ---------------- Schriften (lokal) ----------------
const useSchriften = () => {
  const [h] = React.useState(() => delayRender("schriften"));
  React.useEffect(() => {
    const ff = [
      new FontFace("Cormorant", `url(${nf("schriften/cormorant-garamond.woff2")})`, { weight: "500" }),
      new FontFace("Cormorant", `url(${nf("schriften/cormorant-garamond-kursiv.woff2")})`, { weight: "500", style: "italic" }),
      new FontFace("Jost", `url(${nf("schriften/jost.woff2")})`, { weight: "400" }),
      new FontFace("Jost", `url(${nf("schriften/jost-mittel.woff2")})`, { weight: "500" }),
    ];
    Promise.all(ff.map((x) => x.load())).then((l) => { l.forEach((x) => (document.fonts as unknown as { add: (x: FontFace) => void }).add(x)); continueRender(h); });
  }, [h]);
};

// ---------------- Hintergrund: dunkles, unscharfes Kajütenlicht (fest, ab Frame 0) ----------------
const Kajuete: React.FC<{ fmt: Fmt }> = ({ fmt }) => (
  <AbsoluteFill style={{ background: C.grund }}>
    <Img src={staticFile(fmt === "169" ? "seekarte/b1-kajuete-quer.webp" : "seekarte/b2-kajuete-hoch.webp")}
      style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.1)", filter: "blur(30px) brightness(0.3) saturate(0.85)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 45%, rgba(13,11,8,0) 40%, rgba(13,11,8,0.75) 100%)" }} />
  </AbsoluteFill>
);

// ---------------- Aufnahme: genau ein Bild der Aufnahme (Freeze = framegenaue Zeitzuordnung) ----------------
const Aufnahme: React.FC<{ q: Q; src: number; w: number }> = ({ q, src, w }) => (
  <Freeze frame={src}>
    <OffthreadVideo src={nf(`${AUFN}${q}-A.mp4`)} muted style={{ position: "absolute", left: 0, top: 0, width: w, height: hoehe(q, w), display: "block" }} />
  </Freeze>
);

// Überlagerung in CSS-px der Aufnahme (skaliert mit dem Fenster)
const CssEbene: React.FC<{ q: Q; w: number; children: React.ReactNode }> = ({ q, w, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: AUF[q].cw, height: AUF[q].ch, transform: `scale(${w / AUF[q].cw})`, transformOrigin: "0 0" }}>{children}</div>
);
// Zuschnitt unter der Kopfleiste (73 px), damit nichts über der Seiten-UI liegt. Handy Runde 3: Kopf- und Fußleiste sind nach
// dem Hero ausgeblendet (aufnahme/cap4.js), dort gilt die ganze Höhe.
const Zwischen: React.FC<{ q: Q; children: React.ReactNode }> = ({ q, children }) => {
  const y0 = q === "D" ? 73 : 0, y1 = AUF[q].ch;
  return <div style={{ position: "absolute", left: 0, top: y0, width: AUF[q].cw, height: y1 - y0, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: -y0, width: AUF[q].cw, height: AUF[q].ch }}>{children}</div>
  </div>;
};

// ================= Catches =================

// Beat 2: Hero-Titel Wort für Wort aus dem Halbdunkel, im Takt der Stimme
const HERO_WORT_T = T.heroWort; // „Ihre Website.“ sobald das Fenster steht, dann „Klar“ „auf“ „Kurs.“ exakt
const Halbdunkel: React.FC<{ q: Q; src: number; f: number }> = ({ q, src, f }) => {
  if (f > T.heroAus) return null;
  return <>{HERO_WORT_T.map((t, i) => {
    const r = rect(q, `titel.wort.${i + 1}`, src);
    if (!r) return null;
    const licht = glatt(t - 2, t + 16, f);
    const p = q === "D" ? 10 : 5;
    return <div key={i} style={{ position: "absolute", left: r[0] - p, top: r[1] - p * 0.4, width: r[2] + 2 * p, height: r[3] + p * 0.8,
      background: "rgb(13,13,13)", filter: `blur(${q === "D" ? 9 : 4}px)`, opacity: 0.84 * (1 - licht) }} />;
  })}</>;
};

// Beat 3: Glanzstreif (45°, 0,5 s) über die passende Messingplakette; t = Ereignisframe = Streif in der Mitte
const Glanz: React.FC<{ r: R; t: number; f: number; rund?: number }> = ({ r, t, f, rund = 6 }) => {
  if (f < t - 17 || f > t + 29) return null;
  const u = interpolate(f, [t - 15, t + 15], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const rand = Math.sin(Math.PI * interpolate(f, [t - 15, t + 25], [0, 1], clamp));
  const bw = Math.max(90, r[2] * 0.42);
  return (
    <div style={{ position: "absolute", left: r[0], top: r[1], width: r[2], height: r[3], overflow: "hidden", borderRadius: rund,
      boxShadow: `inset 0 0 0 1px rgba(201,149,74,${(0.55 * rand).toFixed(4)})` }}>
      <div style={{ position: "absolute", top: -r[3], height: r[3] * 3, width: bw, left: -bw - r[3] + u * (r[2] + 2 * bw + 2 * r[3]) - bw / 2,
        transform: "rotate(45deg)", mixBlendMode: "screen",
        background: "linear-gradient(90deg, rgba(255,226,170,0) 0%, rgba(255,226,170,0.07) 30%, rgba(255,236,196,0.30) 50%, rgba(255,226,170,0.07) 70%, rgba(255,226,170,0) 100%)" }} />
    </div>
  );
};

// Glutpunkt wie in der Seekarte: Kern, Hitze, Schein
const Glutpunkt: React.FC<{ x: number; y: number; s: number; hell: number; id: string }> = ({ x, y, s, hell, id }) => (
  <g opacity={hell}>
    <defs>
      <radialGradient id={`gp${id}`}><stop offset="0" stopColor="#ffc46a" stopOpacity={0.85} /><stop offset="0.3" stopColor="#ff8a2a" stopOpacity={0.32} /><stop offset="1" stopColor="#ff7a1a" stopOpacity={0} /></radialGradient>
    </defs>
    <circle cx={x} cy={y} r={26 * s} fill={`url(#gp${id})`} />
    <circle cx={x} cy={y} r={5 * s} fill={rgba(HEISS, 0.9)} />
    <circle cx={x} cy={y} r={2.2 * s} fill={rgba(KERN, 1)} />
  </g>
);

// Beat 4: Rückruf der Glutlinie – Messinglinie läuft 01→04, jede Nummer glimmt auf ihrem Wort
const ETAPPE_T = T.etappe; // Glühen am stärksten (= Ereignisframe): „erzählen“, „entwerfe“, „baue“, „prüfe“
const Glutlinie: React.FC<{ pts: [number, number][]; nrs: [number, number][]; abfahrt: number[]; f: number; s: number; id: string }> = ({ pts, nrs, abfahrt, f, s, id }) => {
  // Kopfposition: steht auf Stopp i, fährt ab abfahrt[i] und erreicht Stopp i+1 genau auf dessen Wort
  let kopf = pts[0], erreicht = 0;
  for (let i = 0; i < 3; i++) {
    if (f >= ETAPPE_T[i + 1]) { kopf = pts[i + 1]; erreicht = i + 1; continue; }
    if (f > abfahrt[i]) { const u = zug(Math.min(1, (f - abfahrt[i]) / (ETAPPE_T[i + 1] - abfahrt[i]))); kopf = [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u]; }
    break;
  }
  const zuend = glatt(ETAPPE_T[0] - 14, ETAPPE_T[0] - 4, f);
  const kuehl = interpolate(f, [ETAPPE_T[3] + 20, ETAPPE_T[3] + 70], [1, 0.35], clamp);
  const d = [pts[0], ...pts.slice(1, erreicht + 1), kopf].map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join("");
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <defs><radialGradient id={`ng${id}`}><stop offset="0" stopColor="#ffb347" stopOpacity={0.55} /><stop offset="0.5" stopColor="#c9954a" stopOpacity={0.18} /><stop offset="1" stopColor="#c9954a" stopOpacity={0} /></radialGradient></defs>
      {nrs.map((n, i) => {
        const t = ETAPPE_T[i];
        const g = f < t - 7 ? 0 : interpolate(f, [t - 7, t, t + 55], [0, 1, 0.42], clamp);
        return <circle key={i} cx={n[0]} cy={n[1]} r={58 * s} fill={`url(#ng${id})`} opacity={g * zuend} style={{ mixBlendMode: "screen" }} />;
      })}
      <path d={d} fill="none" stroke="#ff9a3a" strokeWidth={5 * s} strokeLinecap="round" opacity={0.22 * zuend} style={{ filter: `blur(${3 * s}px)` }} />
      <path d={d} fill="none" stroke={C.messing} strokeWidth={1.7 * s} strokeLinecap="round" opacity={0.95 * zuend} />
      <Glutpunkt x={kopf[0]} y={kopf[1]} s={s} hell={zuend * kuehl} id={id} />
    </svg>
  );
};

// Beat 6: Kompassnadel (Überlagerung) pendelt aus und rastet auf „nachgemessen“ in der echten Nadel ein
// Geometrie in Videopixeln der Zwischenbild-Aufnahme: Drehpunkt, Ausrichtung im Kreisraum (y / 0,68 = Perspektive)
const NADEL: Record<Q, { p: [number, number]; phi: number; len: number; b: number; ell: number }> = {
  D: { p: [1375, 584], phi: -58.97, len: 388, b: 24, ell: 0.68 },
  // Handy Runde 3: P-B zeigt Kompass, Überzeile und Satz mittig (Ziel 67,5 css-px höher als Runde 2) → Kompass 168,75 Videopixel tiefer
  P: { p: [690, 413.75], phi: -59.77, len: 238, b: 15, ell: 0.68 },
};
const pendel = (f: number) => {
  const [a, b] = T.pendel, A = 24;
  if (f <= a) return A;
  if (f >= b) return 0;
  const u = (f - a) / (b - a), huelle = 1 - u * u * (3 - 2 * u);
  return A * huelle * Math.cos(2 * Math.PI * u);
};
const Nadel: React.FC<{ q: Q; f: number }> = ({ q, f }) => {
  const N = NADEL[q], th = pendel(f);
  const blitz = interpolate(f, [T.pendel[1] - 2, T.pendel[1] + 6, T.pendel[1] + 70], [0.7, 1, 0], clamp);
  const sichtbar = f < T.pendel[1] ? 0.7 : blitz;
  const tr = `translate(${N.p[0]},${N.p[1]}) scale(1,${N.ell}) rotate(${(N.phi + th).toFixed(4)})`;
  const L = N.len, B = N.b;
  // Spitze für den Glockenfunken (35,7 s)
  const rad = ((N.phi) * Math.PI) / 180, tip: [number, number] = [N.p[0] + L * Math.cos(rad), N.p[1] + L * Math.sin(rad) * N.ell];
  const funke = interpolate(f, [T.glocke - 2, T.glocke + 6, T.glocke + 40], [0, 1, 0], clamp);
  const s = q === "D" ? 1 : 0.62;
  return (
    <svg viewBox={`0 0 ${AUF[q].vw} ${AUF[q].vh}`} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "visible" }}>
      {/* nur zwischen Kopfleiste (73 css-px) und Handy-Fußleiste (510 css-px): die Nadel liegt nie über der Seiten-UI */}
      <defs><clipPath id={`nk${q}`}><rect x={0} y={(q === "D" ? 73 : 0) * AUF[q].vw / AUF[q].cw} width={AUF[q].vw} height={(AUF[q].ch - (q === "D" ? 73 : 0)) * AUF[q].vw / AUF[q].cw} /></clipPath></defs>
      <g clipPath={`url(#nk${q})`}><g transform={tr} opacity={sichtbar}>
        <polygon points={`${L},0 0,${B} ${-L},0 0,${-B}`} fill="none" stroke="#ffcf87" strokeWidth={6 * s} strokeLinejoin="round" opacity={0.25} vectorEffect="non-scaling-stroke" style={{ filter: "blur(3px)" }} />
        <polygon points={`${L},0 0,${B} ${-L},0 0,${-B}`} fill="none" stroke={C.messing} strokeWidth={2.2 * s} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        <line x1={0} y1={0} x2={L} y2={0} stroke="#ffd9a0" strokeWidth={1.2 * s} opacity={0.8} vectorEffect="non-scaling-stroke" />
      </g></g>
      {/* Glockenfunke an der Nadelspitze; Handy: Spitze liegt unter der Kopfleiste → Funke am Drehpunkt */}
      <Glutpunkt x={q === "D" ? tip[0] : N.p[0]} y={q === "D" ? tip[1] : N.p[1]} s={1.4 * s} hell={funke} id={`nf${q}`} />
    </svg>
  );
};

// ================= Ansichten im Seitenfenster =================
type Inhalt = { video: number } | { bild: string };
type Ansicht = { key: string; ein: [number, number]; bis: number; wisch?: boolean; inhalt: (f: number) => Inhalt; ueber?: (f: number, src: number, w: number) => React.ReactNode };

const REITER_SRC: Record<Q, { edel: number; norvak: number; glut: number; laut: number; ende: number }> = {
  D: { edel: 1660, norvak: 1827, glut: 1999, laut: 2171, ende: 2441 },
  P: { edel: 1604, norvak: 1752, glut: 1903, laut: 2054, ende: 2324 },
};
// Reiterwechsel: der Klickframe der Aufnahme liegt genau auf dem Wortbeginn
const reiterSrc = (q: Q, f: number) => {
  const M = REITER_SRC[q], R5 = T.reiter;
  if (f < R5.norvak) return lauf(f, T.blatt5[0], M.edel, M.edel, M.norvak - 1);
  if (f < R5.glut) return lauf(f, R5.norvak, M.norvak, M.norvak, M.glut - 1);
  if (f < R5.laut) return lauf(f, R5.glut, M.glut, M.glut, M.laut - 1);
  return lauf(f, R5.laut, M.laut, M.laut, M.ende);
};

const glutD = (src: number) => {
  const nr = [1, 2, 3, 4].map((k) => rect("D", `schritt.nr.${k}`, src)!);
  const y = nr[0][1] + nr[0][3] + 12;
  return { pts: nr.map((r) => [r[0] + r[2] / 2, y] as [number, number]), nrs: nr.map((r) => [r[0] + r[2] / 2, r[1] + r[3] / 2] as [number, number]) };
};
// Handy: Linie senkrecht am linken Rand, Dokumentkoordinaten (P-A Bild 0 = scrollY 0) minus Scroll der Ansicht
const glutP = (src: number) => {
  const sy = scrollY("P", src);
  const nr = [1, 2, 3, 4].map((k) => rect("P", `schritt.nr.${k}`, 0)!);
  return { pts: nr.map((r) => [9, r[1] + r[3] / 2 - sy] as [number, number]), nrs: nr.map((r) => [r[0] + r[2] / 2, r[1] + r[3] / 2 - sy] as [number, number]) };
};

const ANSICHTEN: Record<Q, Ansicht[]> = {
  D: [
    // Scrollfahrt hero → lei (Aufnahme ab Marke lei 480) beginnt auf „Werkstätten“
    { key: "hero", ein: [T.seekarteEnde, T.seekarteEnde], bis: T.blende4[1], inhalt: (f) => ({ video: lauf(f, T.scroll3, 480, 298, 779) }),
      ueber: (f, src) => <>
        <Halbdunkel q="D" src={src} f={f} />
        <Zwischen q="D">
          <Glanz r={rect("D", "plakette.5", src)!} t={T.glanz[0]} f={f} />
          <Glanz r={rect("D", "plakette.1", src)!} t={T.glanz[1]} f={f} />
          <Glanz r={rect("D", "plakette.3", src)!} t={T.glanz[2]} f={f} />
        </Zwischen>
      </> },
    { key: "ablauf", ein: T.blende4, bis: T.blatt5[1], inhalt: (f) => ({ video: lauf(f, T.blende4[0], 1130, 1130, 1547) }),
      ueber: (f, src) => { const g = glutD(src); return <Zwischen q="D"><Glutlinie {...g} abfahrt={[ETAPPE_T[0] + 10, ETAPPE_T[1] + 10, ETAPPE_T[2] + 6]} f={f} s={1} id="d" /></Zwischen>; } },
    { key: "reiter", ein: T.blatt5, bis: T.blende6[1], wisch: true, inhalt: (f) => ({ video: reiterSrc("D", f) }) },
    { key: "kompass", ein: T.blende6, bis: 99999, inhalt: () => ({ bild: `${AUFN}D-B-0.webp` }), ueber: (f) => <Nadel q="D" f={f} /> },
  ],
  P: [
    { key: "hero", ein: [T.seekarteEnde, T.seekarteEnde], bis: T.blende3[1], inhalt: (f) => ({ video: lauf(f, T.seekarteEnde, 298, 298, 479) }), ueber: (f, src) => <Halbdunkel q="P" src={src} f={f} /> },
    { key: "lei", ein: T.blende3, bis: T.blende3b[1], inhalt: (f) => ({ video: lauf(f, T.blende3[0], 482, 482, 635) }),
      ueber: (f, src) => <Zwischen q="P"><Glanz r={rect("P", "plakette.1", src)!} t={T.glanz[0]} f={f} /></Zwischen> },
    { key: "lei3", ein: T.blende3b, bis: T.blende4[1], inhalt: (f) => ({ video: lauf(f, T.blende3b[0], 760, 760, 875) }),
      ueber: (f, src) => <Zwischen q="P">
        <Glanz r={rect("P", "plakette.3", src)!} t={T.glanz[1]} f={f} />
        <Glanz r={rect("P", "plakette.h3.3", src)!.map((v, i) => (i === 0 ? v - 8 : i === 1 ? v - 6 : i === 2 ? v + 16 : v + 12)) as R} t={T.glanz[2]} f={f} rund={4} />
      </Zwischen> },
    { key: "ablaufA", ein: T.blende4, bis: T.blende4b[1], inhalt: (f) => ({ video: lauf(f, T.blende4[0], 1112, 1112, 1217) }),
      ueber: (f, src) => <Zwischen q="P"><Glutlinie {...glutP(src)} abfahrt={[ETAPPE_T[0] + 10, ETAPPE_T[1] + 10, ETAPPE_T[2] + 6]} f={f} s={0.5} id="pa" /></Zwischen> },
    { key: "ablaufB", ein: T.blende4b, bis: T.blatt5[1], inhalt: () => ({ video: P_ABLAUF_B }),
      ueber: (f, src) => <Zwischen q="P"><Glutlinie {...glutP(src)} abfahrt={[ETAPPE_T[0] + 10, ETAPPE_T[1] + 10, ETAPPE_T[2] + 6]} f={f} s={0.5} id="pb" /></Zwischen> },
    { key: "reiter", ein: T.blatt5, bis: T.blende6[1], wisch: true, inhalt: (f) => ({ video: reiterSrc("P", f) }) },
    { key: "kompass", ein: T.blende6, bis: 99999, inhalt: () => ({ bild: `${AUFN}P-B-0.webp` }), ueber: (f) => <Nadel q="P" f={f} /> },
  ],
};

// Blattwechsel (Logbuch): weiche Kante läuft von rechts nach links, Maske ist ab dem Einhängen immer gesetzt
const wischMaske = (f: number, [a, b]: [number, number]) => {
  const p = interpolate(f, [a, b], [-22, 100], { ...clamp, easing: kamera });
  return `linear-gradient(to left, #000 ${p.toFixed(3)}%, rgba(0,0,0,0) ${(p + 22).toFixed(3)}%)`;
};

const Fensterinhalt: React.FC<{ q: Q; f: number; w: number; liste: Ansicht[] }> = ({ q, f, w, liste }) => (
  <>
    {liste.map((a) => {
      if (f < a.ein[0] - 1 || f > a.bis + 1) return null;
      const op = a.ein[1] > a.ein[0] && !a.wisch ? rampe(f, a.ein) : 1;
      const inh = a.inhalt(f);
      const src = "video" in inh ? inh.video : 0;
      const maske = a.wisch ? wischMaske(f, a.ein) : undefined;
      return (
        <div key={a.key} style={{ position: "absolute", inset: 0, opacity: f > a.bis ? 0 : dk(op), WebkitMaskImage: maske, maskImage: maske }}>
          {"video" in inh ? <Aufnahme q={q} src={inh.video} w={w} /> : <Img src={nf(inh.bild)} style={{ position: "absolute", left: 0, top: 0, width: w, height: hoehe(q, w) }} />}
          {a.ueber && (a.key === "kompass" ? a.ueber(f, src, w) : <CssEbene q={q} w={w}>{a.ueber(f, src, w)}</CssEbene>)}
        </div>
      );
    })}
  </>
);

// Lichtkante des umgeschlagenen Blatts (nur während des Wischens sichtbar)
const Blattkante: React.FC<{ f: number; w: number; h: number }> = ({ f, w, h }) => {
  if (f < T.blatt5[0] - 1 || f > T.blatt5[1] + 1) return null;
  const p = interpolate(f, T.blatt5, [-22, 100], { ...clamp, easing: kamera });
  const x = w * (1 - (p + 11) / 100);
  const a = Math.sin(Math.PI * rampe(f, T.blatt5)) * 0.5;
  return <div style={{ position: "absolute", top: 0, height: h, left: x - 40, width: 80, opacity: a, mixBlendMode: "screen",
    background: "linear-gradient(90deg, rgba(201,149,74,0) 0%, rgba(232,190,120,0.35) 50%, rgba(201,149,74,0) 100%)" }} />;
};

// Beat 5: „Musterseite“ in jedem Bild lesbar (das Seitenlabel ist im Desktop nur ≈ 13 px)
const Musterseite: React.FC<{ fmt: Fmt; f: number }> = ({ fmt, f }) => {
  const op = rampe(f, T.musterEin) * (1 - rampe(f, T.musterAus));
  if (op <= 0) return null;
  const R5 = T.reiter, wechsel = [R5.edel, R5.norvak, R5.glut, R5.laut];
  const v = fmt === "916", gr = v ? 30 : 23;
  return (
    <div style={{ position: "absolute", left: 0, top: v ? hoehe("P", LAY["916"].A.w) + 22 : -48, width: v ? LAY["916"].A.w : undefined, justifyContent: v ? "center" : undefined,
      display: "flex", alignItems: "center", gap: 16, opacity: dk(op), whiteSpace: "nowrap" }}>
      <span style={{ display: "inline-block", width: 44, height: 1.5, background: C.messing }} />
      <span style={{ fontFamily: "Jost", fontWeight: 500, fontSize: gr, letterSpacing: "0.24em", color: C.messing, textTransform: "uppercase" }}>Musterseite</span>
      <span style={{ position: "relative", display: "inline-block", width: gr * 3.2, height: gr * 1.4 }}>
        {wechsel.map((t, i) => {
          const naechst = wechsel[i + 1] ?? 99999;
          const o = (i === 0 ? 1 : rampe(f, [t, t + 12])) * (1 - rampe(f, [naechst, naechst + 12]));
          return <span key={i} style={{ position: "absolute", left: 0, top: 0, fontFamily: "Cormorant", fontStyle: "italic", fontWeight: 500, fontSize: gr * 1.35, lineHeight: 1, color: C.pergament, opacity: dk(o) }}>{`0${i + 1}`}<span style={{ opacity: 0.5 }}> / 04</span></span>;
        })}
      </span>
    </div>
  );
};

// Seitenfenster: 14 px Radius, weicher Schatten; die Kamera bewegt nur das ganze Fenster
// Hochformat (voll): randloser Handybildschirm über die ganze Breite, ohne Rahmen und Schatten; Zoom nur von oben Mitte
const Fenster: React.FC<{ q: Q; box: { x: number; y: number; w: number }; op: number; skala: number; neig: number; voll?: boolean; children: React.ReactNode; aussen?: React.ReactNode }> = ({ q, box, op, skala, neig, voll, children, aussen }) => {
  const h = hoehe(q, box.w), r = voll ? 0 : 14;
  return (
    <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: h, opacity: dk(op), transform: `scale(${skala.toFixed(6)}) rotate(${neig.toFixed(5)}deg)`, transformOrigin: voll ? "50% 0%" : "50% 50%" }}>
      {!voll && <div style={{ position: "absolute", inset: 0, borderRadius: r, boxShadow: "0 40px 110px rgba(0,0,0,0.62), 0 8px 24px rgba(0,0,0,0.4)" }} />}
      <div style={{ position: "absolute", inset: 0, borderRadius: r, overflow: "hidden", background: "#0e0f10" }}>{children}</div>
      {!voll && <div style={{ position: "absolute", inset: 0, borderRadius: r, boxShadow: "inset 0 0 0 1px rgba(235,225,204,0.08)" }} />}
      {aussen}
    </div>
  );
};

// Kameradrift Fenster A: ein einziger langsamer Zug (Skala ≤ 1,5 %, Neigung ≤ 0,25°), Anfang/Ende ohne Ruck
const driftA = (f: number) => {
  const u = interpolate(f, [T.driftAb, T.fensterAus[1]], [0, 1], clamp);
  return { skala: 1 + 0.015 * (0.5 - 0.5 * Math.cos(Math.PI * u)), neig: 0.25 * Math.sin(Math.PI * u) ** 2 * (u < 0.5 ? 1 : 1) - 0.0 };
};

// ---------------- Beat 2: Kajütenbild landet passgenau auf dem Hero-Bild ----------------
// Desktop: Hero-Bild 2560×1448 cover in 1600×828 ab y=73, object-position 72 % 50 % → Bild x 0, y 34,5, b 1600, h 905; sichtbar y 73–Fensterende
// Handy: 1080×1910 cover in 390×359,6 ab y=73, object-position 60 % 78 % → Bild x 0, y −184,5, b 390, h 689,7; sichtbar y 73–432,6
const MATCH: Record<Q, { bild: number[]; clip: number[] }> = {
  D: { bild: [0, 34.5, 1600, 905], clip: [0, 73, 1600, AUF.D.ch] },
  P: { bild: [0, -184.5, 390, 689.7], clip: [0, 73, 390, 432.6] },
};
const Kajuetenmatch: React.FC<{ fmt: Fmt; f: number }> = ({ fmt, f }) => {
  if (f < T.seekarteEnde || f > 478) return null;
  const L = LAY[fmt], q = qVon(fmt), k = L.A.w / AUF[q].cw;
  const t = interpolate(f, [T.matchStart, T.matchEnde], [0, 1], { ...clamp, easing: kamera });
  // Start: Bild wie am Ende der Seekarte (objectFit cover, Skala 1,00)
  const ar = fmt === "169" ? 2688 / 1520 : 1520 / 2688, bw0 = Math.max(L.W, L.H * ar), bh0 = bw0 / ar;
  const b0 = [(L.W - bw0) / 2, (L.H - bh0) / 2, bw0, bh0], c0 = [0, 0, L.W, L.H];
  const M = MATCH[q];
  const b1 = [L.A.x + M.bild[0] * k, L.A.y + M.bild[1] * k, M.bild[2] * k, M.bild[3] * k];
  const c1 = [L.A.x + M.clip[0] * k, L.A.y + M.clip[1] * k, (M.clip[2] - M.clip[0]) * k, (M.clip[3] - M.clip[1]) * k];
  const m = (a: number[], b: number[]) => a.map((v, i) => v + (b[i] - v) * t);
  const b = m(b0, b1), c = m(c0, c1);
  // Übergabe von der Seekarte: 6 Frames Überblendung (beide Ebenen zeigen dasselbe Bild, Chrome rendert sie minimal verschieden hell)
  const ein = dk(interpolate(f, [T.seekarteEnde, T.seekarteEnde + 6], [0, 1], clamp));
  return (
    <AbsoluteFill style={{ opacity: ein, clipPath: `inset(${c[1].toFixed(3)}px ${(L.W - c[0] - c[2]).toFixed(3)}px ${(L.H - c[1] - c[3]).toFixed(3)}px ${c[0].toFixed(3)}px round ${(14 * t).toFixed(3)}px)` }}>
      <Img src={staticFile(fmt === "169" ? "seekarte/b1-kajuete-quer.webp" : "seekarte/b2-kajuete-hoch.webp")}
        style={{ position: "absolute", left: 0, top: 0, width: bw0, height: bh0, transformOrigin: "0 0", transform: `translate(${b[0].toFixed(3)}px, ${b[1].toFixed(3)}px) scale(${(b[2] / bw0).toFixed(6)})` }} />
    </AbsoluteFill>
  );
};

// ---------------- Beat 7: Merksatz „Gebaut. Geprüft. Gepflegt.“ – drei eingeprägte Messinglettern ----------------
// Jedes Wort wird auf seinen Wortbeginn eingeprägt: Aufsetzen endet genau im Ereignisframe (= Stempel-Peak), dann Lichtfunke
const MERK = [wi("Gebaut."), wi("Geprüft."), wi("Gepflegt.")];
const Merksatz: React.FC<{ fmt: Fmt; f: number }> = ({ fmt, f }) => {
  if (f < T.fensterAus[0] || f > T.merksatzAus[1] + 1) return null;
  const v = fmt === "916", aus = 1 - sinRampe(f, T.merksatzAus);
  const gr = v ? 150 : 118;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: v ? "column" : "row", gap: v ? 18 : 86, paddingBottom: v ? 300 : 40, opacity: dk(aus) }}>
      {MERK.map((i, n) => {
        const t = T.merk[n];
        const da = interpolate(f, [t - 8, t - 1], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
        const sitz = interpolate(f, [t - 8, t], [1.07, 1], { ...clamp, easing: Easing.in(Easing.quad) }); // setzt auf wie ein Stempel
        const funke = interpolate(f, [t, t + 40], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
        const letzt = n === 2;
        const glimm = letzt ? interpolate(f, [t + 30, t + 70], [0, 0.85], { ...clamp, easing: Easing.inOut(Easing.sin) }) : 0;
        return (
          <div key={i} style={{ position: "relative", opacity: dk(da), transform: `scale(${sitz.toFixed(5)})` }}>
            <div style={{ position: "absolute", inset: "-40% -18%", background: "radial-gradient(ellipse 50% 50% at 50% 55%, rgba(255,170,80,0.32), rgba(201,149,74,0) 70%)", opacity: glimm }} />
            <div style={{ position: "relative", filter: "drop-shadow(0 3px 1px rgba(0,0,0,0.75)) drop-shadow(0 -1px 0 rgba(255,236,200,0.22))" }}>
              <span style={{ display: "block", fontFamily: "Cormorant", fontWeight: 500, fontSize: gr, lineHeight: 1.05, letterSpacing: "0.01em", color: "transparent",
                backgroundImage: "linear-gradient(100deg, rgba(255,240,205,0) 40%, rgba(255,244,214,0.95) 50%, rgba(255,240,205,0) 60%), linear-gradient(180deg, #f2d6a0 0%, #d9a85a 38%, #b07d3c 70%, #d8aa66 100%)",
                backgroundSize: "320% 100%, 100% 100%", backgroundPosition: `${(100 - 100 * funke).toFixed(3)}% 0, 0 0`, WebkitBackgroundClip: "text", backgroundClip: "text" }}>{W[i].w}</span>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------- Beat 8: Laterne, Kielwasser bis zum Horizont, zwei Lichtkreise auf „Partner“ ----------------
const HAFEN = { w: 2688, h: 1520 };
const LATERNE: Record<Fmt, { kiel: string; a: [number, number]; b0: number; b1: number; r: number; flamme: [number, number] }> = {
  // Lichtkreise: A = Hof der Laterne, B gleitet vom Wasser her heran und überlagert ihn
  "169": { kiel: "M1276.8,1293.6 C1209.6,1008 991.2,806.4 873.6,732.5", a: [2405, 600], b0: 2405 - 420, b1: 2405 - 150, r: 120, flamme: [2405, 588] },
  "916": { kiel: "M1999,1084 C1968,910 1872,823 1777,784", a: [2405, 600], b0: 2405 - 330, b1: 2405 - 120, r: 95, flamme: [2405, 588] },
};
const KIEL_T = T.kiel; // ab „Start?“ bis „Bord.“
const Laterne: React.FC<{ fmt: Fmt; f: number }> = ({ fmt, f }) => {
  if (f < T.merksatzAus[0] - 1 || f > T.laterneAus[1] + 1) return null;
  const L = LAY[fmt], G = LATERNE[fmt];
  const op = sinRampe(f, T.merksatzAus) * (1 - sinRampe(f, T.laterneAus));
  const u = interpolate(f, [T.merksatzAus[0], T.laterneAus[1]], [0, 1], clamp);
  // Ausschnitt (≤ 1,4×): Laterne rechts (16:9) bzw. vor der rechten Sicherheitszone (9:16), langsamer Zug ohne Ruck
  let w: number, h: number, z: number, u0: number, v0: number;
  if (fmt === "169") { w = L.W; h = (w * HAFEN.h) / HAFEN.w; z = 1.34 + 0.06 * kamera(u); u0 = 0.985 - 1 / z; v0 = 0.343 - (0.42 * L.H) / (h * z); }
  else { w = L.W / 0.318; h = (w * HAFEN.h) / HAFEN.w; z = 1.0 + 0.04 * kamera(u); u0 = 0.897 - 760 / (w * z); v0 = Math.max(0, 0.343 - 690 / (h * z)); }
  const tx = -u0 * w * z, ty = -v0 * h * z;
  const atem = 0.1 + 0.06 * Math.sin((2 * Math.PI * (f - T.merksatzAus[0])) / 120); // Flamme atmet, 2 s
  const len = getLength(G.kiel);
  const p = interpolate(f, KIEL_T, [0, 1], { ...clamp, easing: zug });
  const kopf = getPointAtLength(G.kiel, Math.max(0.01, p * len))!;
  const kopfHell = interpolate(f, [KIEL_T[0] - 4, KIEL_T[0] + 4], [0, 1], clamp) * interpolate(p, [0.6, 1], [1, 0], clamp);
  const linie = interpolate(f, [KIEL_T[1], KIEL_T[1] + 90], [1, 0.55], clamp);
  const tP = T.partner; // „Partnerschaft“
  const kreis = interpolate(f, [tP - 2, tP + 20], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const bx = interpolate(f, [tP, tP + 50], [G.b0, G.b1], { ...clamp, easing: zug });
  const sk = fmt === "169" ? 1 : 0.85; // Linienstärken in Bildpixeln
  return (
    <AbsoluteFill style={{ opacity: dk(op), overflow: "hidden", background: C.grund }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: `translate(${tx.toFixed(3)}px, ${ty.toFixed(3)}px) scale(${z.toFixed(6)})`, transformOrigin: "0 0" }}>
        <Img src={nf("hafen.webp")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        <svg viewBox={`0 0 ${HAFEN.w} ${HAFEN.h}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <radialGradient id={`fl${fmt}`}><stop offset="0" stopColor="#ffd08a" stopOpacity={1} /><stop offset="0.4" stopColor="#ff9a3a" stopOpacity={0.45} /><stop offset="1" stopColor="#ff7a1a" stopOpacity={0} /></radialGradient>
            <linearGradient id={`kw${fmt}`} gradientUnits="userSpaceOnUse" x1={0} y1={fmt === "169" ? 1294 : 1084} x2={0} y2={fmt === "169" ? 732 : 784}>
              <stop offset="0" stopColor="#d9a556" stopOpacity={0.95} /><stop offset="0.75" stopColor="#c9954a" stopOpacity={0.45} /><stop offset="1" stopColor="#c9954a" stopOpacity={0} />
            </linearGradient>
            <radialGradient id={`lk${fmt}`}><stop offset="0" stopColor="#ffcf87" stopOpacity={0.42} /><stop offset="0.7" stopColor="#d9a556" stopOpacity={0.2} /><stop offset="1" stopColor="#c9954a" stopOpacity={0.02} /></radialGradient>
          </defs>
          <circle cx={G.flamme[0]} cy={G.flamme[1]} r={150} fill={`url(#fl${fmt})`} opacity={atem} style={{ mixBlendMode: "screen" }} />
          <path d={G.kiel} fill="none" stroke="#ff9a3a" strokeWidth={9 * sk} strokeLinecap="round" opacity={0.25 * linie} pathLength={1} strokeDasharray={`${p} 2`} style={{ filter: "blur(4px)" }} />
          <path d={G.kiel} fill="none" stroke={`url(#kw${fmt})`} strokeWidth={3.2 * sk} strokeLinecap="round" opacity={linie} pathLength={1} strokeDasharray={`${p} 2`} />
          <Glutpunkt x={kopf.x} y={kopf.y} s={2.2 * sk * (1 - 0.6 * p)} hell={kopfHell} id={`kw${fmt}`} />
          <g opacity={kreis} style={{ mixBlendMode: "screen" }}>
            <circle cx={G.a[0]} cy={G.a[1]} r={G.r} fill={`url(#lk${fmt})`} stroke="#e2b36a" strokeOpacity={0.3} strokeWidth={1.6 * sk} />
            <circle cx={bx} cy={G.a[1]} r={G.r} fill={`url(#lk${fmt})`} stroke="#e2b36a" strokeOpacity={0.3} strokeWidth={1.6 * sk} />
          </g>
        </svg>
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 55% 45%, rgba(13,11,8,0) 50%, rgba(13,11,8,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

// ---------------- Beat 9–10: Hafen, Wortmarke, einziger CTA mit Glutring ----------------
const Wortmarke: React.FC<{ fmt: Fmt; f: number }> = ({ fmt, f }) => {
  const L = LAY[fmt], M = L.marke, op = sinRampe(f, T.markeEin);
  if (op <= 0) return null;
  const v = fmt === "916";
  return (
    <div style={{ position: "absolute", left: M.x, top: M.y, width: M.w, textAlign: M.align, opacity: dk(op), color: C.pergament, fontFamily: "Cormorant", fontWeight: 500 }}>
      {v ? (
        <div style={{ fontSize: M.groesse, lineHeight: 1.1 }}>Seitenkapitän <span style={{ color: C.messing }}>·</span> <em style={{ color: C.messing }}>Eislingen</em></div>
      ) : (
        <>
          <div style={{ fontSize: M.groesse, lineHeight: 1.05 }}>Seitenkapitän</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14 }}>
            <span style={{ display: "inline-block", width: 44, height: 1.5, background: C.messing }} />
            <em style={{ fontSize: M.groesse * 0.56, color: C.messing, lineHeight: 1 }}>Eislingen</em>
          </div>
        </>
      )}
    </div>
  );
};

const Knopf: React.FC<{ fmt: Fmt; f: number }> = ({ fmt, f }) => {
  const K = LAY[fmt].knopf, op = sinRampe(f, T.knopfEin);
  if (op <= 0) return null;
  // Ring: abgerundetes Rechteck 12 px außerhalb, Start oben Mitte, im Uhrzeigersinn
  const m = 12, x0 = K.x - m, y0 = K.y - m, x1 = K.x + K.w + m, y1 = K.y + K.h + m, r = 14, xm = (x0 + x1) / 2;
  const d = `M${xm},${y0} L${x1 - r},${y0} A${r},${r} 0 0 1 ${x1},${y0 + r} L${x1},${y1 - r} A${r},${r} 0 0 1 ${x1 - r},${y1} L${x0 + r},${y1} A${r},${r} 0 0 1 ${x0},${y1 - r} L${x0},${y0 + r} A${r},${r} 0 0 1 ${x0 + r},${y0} Z`;
  const len = getLength(d);
  const p = interpolate(f, T.ring, [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const kopf = getPointAtLength(d, Math.max(0.01, Math.min(len - 0.01, p * len)))!;
  const kuehl = rampe(f, T.kuehlen);
  const farbe = mischen(HEISS, MESSING, kuehl);
  const kopfHell = interpolate(f, [T.ring[0] - 4, T.ring[0] + 4], [0, 1], clamp) * interpolate(f, [T.ring[1] - 4, T.ring[1] + 16], [1, 0], clamp);
  const schein = (0.4 * (1 - kuehl) + 0.08) * (p > 0 ? 1 : 0);
  return (
    <>
      <div style={{ position: "absolute", left: K.x, top: K.y, width: K.w, height: K.h, opacity: dk(op), borderRadius: 4, background: C.messing, color: "#16120c",
        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Jost", fontWeight: 500, fontSize: K.schrift, letterSpacing: "0.02em",
        boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>Projekt besprechen&nbsp;&nbsp;→</div>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
        <path d={d} fill="none" stroke="#ff9a3a" strokeWidth={7} pathLength={1} strokeDasharray={`${p} 2`} opacity={schein} style={{ filter: "blur(4px)" }} />
        <path d={d} fill="none" stroke={rgba(farbe, 1)} strokeWidth={2.2} pathLength={1} strokeDasharray={`${p} 2`} strokeLinecap="round" />
        <Glutpunkt x={kopf.x} y={kopf.y} s={1.1} hell={kopfHell} id={`kn${fmt}`} />
      </svg>
    </>
  );
};

// ---------------- Untertitel: wortgleich, mitlesend ----------------
// Zwei Tafeln sind Einblendungen in Cormorant statt wörtlicher Untertitel (Runde 2):
//  „pruef“ (L6): Prüfzeile – vier Häkchen setzen sich je auf ihr Wort (Ereignisframe = Häkchen sitzt = Geräusch-Peak)
//  „leist“ (L8): Leistungszeile „Hosting · Wartung · Pflege · Änderungen · und vieles mehr“, jedes Glied auf sein Wort
const PRUEF = ["Tempo", "Barrierefreiheit", "Datenschutz", "Sicherheit"];
const LEIST = ["Hosting", "Wartung", "Pflege", "Änderungen", "und vieles mehr"];

const Haken: React.FC<{ t: number; f: number; gr: number }> = ({ t, f, gr }) => {
  // Kreis + Haken: Strich zieht in 7 Frames und sitzt genau auf t, dann ein kurzer Lichtring
  const zug = interpolate(f, [t - 7, t], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const da = interpolate(f, [t - 9, t - 3], [0.35, 1], clamp);
  const ring = interpolate(f, [t, t + 20], [0, 1], clamp);
  const d = gr * 0.78;
  return (
    <svg width={d} height={d} viewBox="0 0 40 40" style={{ overflow: "visible", flex: "none", marginRight: gr * 0.26, transform: `translateY(${(gr * 0.04).toFixed(2)}px)` }}>
      <circle cx={20} cy={20} r={18} fill={rgba(MESSING, 0.16 * zug)} stroke={rgba(MESSING, da)} strokeWidth={2} />
      <circle cx={20} cy={20} r={18 + 14 * ring} fill="none" stroke={rgba(KERN, 0.55 * (1 - ring) * (ring > 0 ? 1 : 0))} strokeWidth={1.5} />
      <path d="M11.5,20.5 L17.5,26.5 L29,14" fill="none" stroke={rgba(mischen(MESSING, KERN, 0.35 * (1 - ring)), 1)} strokeWidth={3.2}
        strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${zug.toFixed(4)} 2`} />
    </svg>
  );
};

const Pruefzeile: React.FC<{ fmt: Fmt; f: number }> = ({ fmt, f }) => {
  const v = fmt === "916", gr = v ? 68 : 52;
  const reihen = v ? [[0, 1], [2, 3]] : [[0, 1, 2, 3]];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: v ? 10 : 0 }}>
      {reihen.map((r, k) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: v ? 40 : 46 }}>
          {r.map((i) => {
            const t = T.haken[i], an = glatt(t - 3, t + 3, f);
            return (
              <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                <Haken t={t} f={f} gr={gr} />
                <span style={{ fontFamily: "Cormorant", fontWeight: 500, fontSize: gr, lineHeight: 1.1, color: rgba(mischen(PERG, MESSING, an), 0.72 + 0.28 * an) }}>{PRUEF[i]}</span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const Leistungszeile: React.FC<{ fmt: Fmt; f: number }> = ({ fmt, f }) => {
  const v = fmt === "916", gr = v ? 66 : 54;
  const reihen = v ? [[0, 1, 2], [3, 4]] : [[0, 1, 2, 3, 4]];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: v ? 6 : 0 }}>
      {reihen.map((r, k) => (
        <div key={k} style={{ display: "flex", alignItems: "baseline", whiteSpace: "nowrap" }}>
          {r.map((i, j) => {
            // Glied erscheint auf seinem Wort: hebt sich 10 px, Ereignisframe t = voll da, kurzer Messingschimmer
            const t = T.liste[i];
            const da = interpolate(f, [t - 6, t], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
            const glanz = interpolate(f, [t, t + 30], [1, 0], clamp) * (f >= t - 6 ? 1 : 0);
            const punkt = i > 0 && j > 0 ? da : 0;
            const letzt = i === 4;
            return (
              <React.Fragment key={i}>
                {(i > 0 && (j > 0 || !v)) && <span style={{ color: rgba(MESSING, dk(punkt)), fontFamily: "Cormorant", fontSize: gr, margin: `0 ${(gr * 0.36).toFixed(1)}px` }}>·</span>}
                <span style={{ fontFamily: "Cormorant", fontWeight: 500, fontStyle: letzt ? "italic" : "normal", fontSize: gr, lineHeight: 1.12, opacity: dk(da),
                  transform: `translateY(${(10 * (1 - da)).toFixed(3)}px)`, display: "inline-block",
                  color: rgba(mischen(letzt ? MESSING : PERG, KERN, 0.5 * glanz), 1) }}>{LEIST[i]}</span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const Untertitel: React.FC<{ fmt: Fmt; f: number }> = ({ fmt, f }) => {
  const L = LAY[fmt];
  return (
    <>
      {TAFELN.map((t: Tafel, n) => {
        const ein = ws(t.a) - 12;
        const naechst = TAFELN[n + 1] ? ws(TAFELN[n + 1].a) - 12 : 1e9;
        const aus = Math.min(we(t.b) + 24, naechst);
        if (f < ein - 1 || f > aus + 1) return null;
        const op = interpolate(f, [ein, ein + 15, aus - 12, aus], [0, 1, 1, 0], clamp) * (t.dezent ? 0.72 : 1);
        const br = t.br[fmt];
        const gr = L.band.size * (t.dezent ? 0.88 : 1);
        // Beat 1 (16:9): Untertitel nach links unten, der Maßstabsbalken der Seekarte liegt unter der Bildmitte
        const versatz = fmt === "916" ? 0 : t.dezent ? -400 : 0;
        return (
          <div key={n} style={{ position: "absolute", left: (L.W - L.band.maxW) / 2 + versatz, top: L.band.top, width: L.band.maxW, height: L.band.bottom - L.band.top,
            display: "flex", alignItems: "center", justifyContent: "center", opacity: dk(op), textShadow: "0 2px 14px rgba(0,0,0,0.75)" }}>
            {t.art === "pruef" ? <Pruefzeile fmt={fmt} f={f} /> : t.art === "leist" ? <Leistungszeile fmt={fmt} f={f} /> : (
              <p style={{ margin: 0, textAlign: "center", fontFamily: "Jost", fontWeight: 400, fontSize: gr, lineHeight: 1.28, letterSpacing: "0.005em" }}>
                {W.slice(t.a, t.b + 1).map((w, k) => {
                  const i = t.a + k, s = ws(i), e = we(i);
                  // Elias 13.10.: gelesene Wörter bleiben in der Kontrastfarbe der Seite (Messing), das gesprochene leuchtet voll
                  const gelesen = glatt(s - 2, s + 3, f);
                  const jetzt = gelesen * (1 - glatt(e, e + 9, f));
                  const c = mischen(PERG, MESSING, gelesen);
                  return <React.Fragment key={i}>{br === i && <br />}<span style={{ color: rgba(c, 0.7 + 0.15 * gelesen + 0.15 * jetzt) }}>{w.w}</span>{k < t.b - t.a && br !== i + 1 ? " " : ""}</React.Fragment>;
                })}
              </p>
            )}
          </div>
        );
      })}
    </>
  );
};

// ================= Film =================
export const Nachtfahrt: React.FC<{ fmt: Fmt }> = ({ fmt }) => {
  useSchriften();
  const f = useCurrentFrame();
  const L: Lay = LAY[fmt], q = qVon(fmt);
  const opA = rampe(f, T.seiteEin) * (1 - sinRampe(f, T.fensterAus));
  const voll = fmt === "916";
  const d0 = f >= T.seekarteEnde ? driftA(f) : { skala: 1, neig: 0 };
  const d = voll ? { skala: d0.skala, neig: 0 } : d0;
  const opB = sinRampe(f, T.fensterBEin);
  const uB = interpolate(f, [T.fensterBEin[0], T.steht], [0, 1], clamp);
  const skB = 1 + 0.01 * (0.5 - 0.5 * Math.cos(Math.PI * uB));
  const hA = hoehe(q, L.A.w);
  return (
    <AbsoluteFill style={{ background: C.grund, overflow: "hidden" }}>
      <Kajuete fmt={fmt} />
      <Sequence durationInFrames={SEEKARTE.ende + 6} layout="none"><Seekarte fmt={fmt} /></Sequence>
      <Kajuetenmatch fmt={fmt} f={f} />
      {f >= T.seiteEin[0] - 1 && f <= T.fensterAus[1] + 1 && (
        <Fenster q={q} box={L.A} op={opA} skala={d.skala} neig={d.neig} voll={voll} aussen={<Musterseite fmt={fmt} f={f} />}>
          <Fensterinhalt q={q} f={f} w={L.A.w} liste={ANSICHTEN[q]} />
          <Blattkante f={f} w={L.A.w} h={hA} />
        </Fenster>
      )}
      <Merksatz fmt={fmt} f={f} />
      <Laterne fmt={fmt} f={f} />
      {f >= T.fensterBEin[0] - 1 && (
        <>
          <Fenster q={q} box={L.B} op={opB} skala={skB} neig={0} voll={voll}>
            {f <= T.blende10[1] + 1 && <Img src={nf(`${AUFN}${q}-C-0.webp`)} style={{ position: "absolute", left: 0, top: 0, width: L.B.w, height: hoehe(q, L.B.w), opacity: f > T.blende10[1] ? 0 : dk(1) }} />}
            {f >= T.blende10[0] - 1 && <Img src={nf(`${AUFN}${q}-A-0.webp`)} style={{ position: "absolute", left: 0, top: 0, width: L.B.w, height: hoehe(q, L.B.w), opacity: dk(sinRampe(f, T.blende10)) }} />}
            {/* Hochformat: Abdunklung unten, damit Wortmarke und Knopf auf dem randlosen Bildschirm lesbar stehen */}
            {voll && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "80%", background: "linear-gradient(180deg, rgba(13,11,8,0) 0%, rgba(13,11,8,0.94) 20%, rgba(13,11,8,0.985) 32%, rgba(13,11,8,0.985) 100%)", opacity: dk(sinRampe(f, T.markeEin)) }} />}
          </Fenster>
          <Wortmarke fmt={fmt} f={f} />
          <Knopf fmt={fmt} f={f} />
        </>
      )}
      <Untertitel fmt={fmt} f={f} />
      <Audio src={nf(TON)} />
    </AbsoluteFill>
  );
};

export const NachtfahrtKompositionen: React.FC = () => (
  <>
    <Composition id="Nachtfahrt169" component={Nachtfahrt} durationInFrames={DAUER} fps={FPS} width={1920} height={1080} defaultProps={{ fmt: "169" as Fmt }} />
    <Composition id="Nachtfahrt916" component={Nachtfahrt} durationInFrames={DAUER} fps={FPS} width={1080} height={1920} defaultProps={{ fmt: "916" as Fmt }} />
  </>
);
