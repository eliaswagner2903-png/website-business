import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import desk from "../public/desk2.json";
import phone from "../public/phone2.json";

// Cut 2 (2026-10-11, after Elias' feedback): ~33 s, punchy, no subtitles, captions only in free space, nothing cropped.
// One timeline, two layouts: 16:9 (1920x1080) and 9:16 (1080x1920).
export const FPS = 60;
const s = (x: number) => Math.round(x * FPS);
const DM: Record<string, number> = Object.fromEntries(desk.marks.map((m: { name: string; frame: number }) => [m.name, m.frame]));
const PM: Record<string, number> = Object.fromEntries(phone.marks.map((m: { name: string; frame: number }) => [m.name, m.frame]));
const C = { bg: "#15130f", cream: "#efe6d6", muted: "#b9ad99", brass: "#cfae6a", line: "rgba(239,230,214,.14)" };
const pad = (n: number) => String(n).padStart(5, "0");
const ease = Easing.bezier(0.45, 0, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const MUSIC: string | null = null; // set once the ElevenLabs track exists

// ---------------- timeline (film frames) ----------------
const VO = [
  { file: "n1.wav", at: 18 },   // Ihr Betrieb ist einzigartig. Ihre Website sollte es auch sein.
  { file: "n2.wav", at: 300 },  // Ich baue Websites mit Charakter. Schnell auf dem Handy. Klar im Aufbau. Und gefunden ...
  { file: "n3.wav", at: 800 },  // Für die Uhrmacherei. Für den Werkzeugbau. Fürs Restaurant. Fürs Studio.
  { file: "n4.wav", at: 1140 }, // Neu gebaut oder erneuert. Einmal bezahlt. Betreuung, wenn Sie möchten.
  { file: "n5.wav", at: 1650 }, // Ihre neue Website beginnt mit einem Gespräch. Ich freue mich auf Sie.
];
const T = {
  hero: 282, phone: 300 + 142, lei: 300 + 220, show: 790, preise: 1112, kontakt: 1430, outro: 1640, end: 1980,
};
export const TOTAL = T.end;
const SHOW = [
  { key: "edel", name: "Lindgrund", art: "Uhrmacherei", at: 790 },
  { key: "norvak", name: "NORVAK", art: "Werkzeugbau", at: 800 + 89 },
  { key: "glut", name: "ZEYTIN & GLUT", art: "Restaurant", at: 800 + 172 },
  { key: "laut", name: "Zwischenbild", art: "Motion-Design-Studio", at: 800 + 240 },
];
const showAt = (f: number) => { let i = 0; for (let k = 0; k < SHOW.length; k++) if (f >= SHOW[k].at) i = k; return i; };
// what the window shows: a frame of the desktop capture or a showcase page
const screenAt = (f: number): { src: string; long?: string; y?: number; t?: number } => {
  if (f < T.lei) return { src: `desk2/${pad(Math.min(DM.leistungen - 1, 20 + Math.max(0, f - T.hero)))}.jpg` };
  if (f < T.show) return { src: `desk2/${pad(Math.min(DM.arbeiten - 1, DM.leistungen + (f - T.lei)))}.jpg` };
  if (f < T.preise) {
    const i = showAt(f), t = f - SHOW[i].at, len = (SHOW[i + 1]?.at ?? T.preise) - SHOW[i].at;
    return { src: "", long: SHOW[i].key, y: interpolate(t, [4, len], [0, 980], { ...clamp, easing: Easing.out(Easing.cubic) }), t };
  }
  if (f < T.kontakt) return { src: `desk2/${pad(Math.min(DM.kontakt - 1, DM.preise + 10 + (f - T.preise)))}.jpg` };
  return { src: `desk2/${pad(Math.min(DM.ende - 1, DM.kontakt + 40 + (f - T.kontakt)))}.jpg` };
};
const phoneAt = (f: number): { src: string; long?: string; y?: number } => {
  if (f < T.phone) return { src: `phone2/${pad(Math.min(PM.menu - 1, Math.max(0, f - T.hero)))}.jpg` };
  if (f < T.lei) return { src: `phone2/${pad(Math.min(phone.frames - 1, PM.menu - 10 + (f - T.phone)))}.jpg` };
  if (f < T.show) return { src: `phone2/${pad(Math.min(PM.arbeiten - 1, PM.leistungen + (f - T.lei)))}.jpg` };
  if (f < T.preise) { const i = showAt(f), t = f - SHOW[i].at; return { src: "", long: SHOW[i].key, y: interpolate(t, [10, 90], [0, 1300], { ...clamp, easing: Easing.out(Easing.cubic) }) }; }
  if (f < T.kontakt) return { src: `phone2/${pad(Math.min(PM.kontakt - 1, PM.preise + (f - T.preise)))}.jpg` };
  return { src: `phone2/${pad(Math.min(phone.frames - 1, PM.kontakt + (f - T.kontakt)))}.jpg` };
};
// impacts: punch-in pulse + boom
const HITS = [118, T.hero, T.phone, T.lei, ...SHOW.map((x) => x.at), T.preise, T.kontakt, T.outro];
const punch = (f: number) => HITS.reduce((a, h) => a + (f >= h && f < h + 24 ? Math.sin(((f - h) / 24) * Math.PI) * Math.exp(-(f - h) / 10) : 0), 0);

// captions live in free space only (never over the page): [text, from, to, accent?]
const CAPS: [string, number, number, boolean?][] = [
  ["Websites mit Charakter.", 304, T.phone - 4],
  ["Schnell auf dem Handy.", T.phone + 4, T.lei - 2, true],
  ["Klar im Aufbau.", T.lei + 6, 300 + 307],
  ["Gefunden. Bei Google und KI.", 300 + 309, T.show - 6, true],
  ["Neu gebaut oder erneuert.", 1144, 1140 + 128],
  ["Einmal bezahlt.", 1140 + 130, 1140 + 200, true],
  ["Betreuung nach Wahl.", 1140 + 202, T.kontakt - 4],
  ["Erzählen Sie von Ihrem Betrieb.", T.kontakt + 8, T.outro - 6, true],
];

// ---------------- layouts ----------------
type Box = { x: number; y: number; w: number };
type Lay = { W: number; H: number; winFull: Box; winSide: Box; phoneSide: Box; phoneBig: Box; cap: { x: number; y: number; w: number; size: number; align: "left" | "center" } };
const LAY: Record<"h" | "v", Lay> = {
  h: { W: 1920, H: 1080, winFull: { x: 264, y: 44, w: 1392 }, winSide: { x: 70, y: 150, w: 1180 }, phoneSide: { x: 1420, y: 150, w: 360 }, phoneBig: { x: 560, y: 70, w: 420 },
    cap: { x: 1310, y: 420, w: 560, size: 66, align: "left" } },
  v: { W: 1080, H: 1920, winFull: { x: 30, y: 300, w: 1020 }, winSide: { x: 30, y: 170, w: 1020 }, phoneSide: { x: 600, y: 900, w: 400 }, phoneBig: { x: 540, y: 840, w: 440 },
    cap: { x: 60, y: 1020, w: 450, size: 62, align: "left" } },
};
const lerpBox = (a: Box, b: Box, t: number): Box => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, w: a.w + (b.w - a.w) * t });

// ---------------- fonts ----------------
const useFonts = () => {
  const [h] = React.useState(() => delayRender("fonts"));
  React.useEffect(() => {
    const faces = [
      new FontFace("IS", `url(${staticFile("instrument-serif.woff2")})`),
      new FontFace("IS", `url(${staticFile("instrument-serif-kursiv.woff2")})`, { style: "italic" }),
      new FontFace("Geist", `url(${staticFile("geist.woff2")})`, { weight: "100 900" }),
    ];
    Promise.all(faces.map((x) => x.load())).then((l) => { l.forEach((x) => document.fonts.add(x)); continueRender(h); });
  }, [h]);
};

// ---------------- pieces ----------------
const Back: React.FC<{ f: number }> = ({ f }) => {
  const x = 50 + 18 * Math.sin(f / 120), y = 30 + 10 * Math.sin(f / 170);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 55% 50% at ${x}% ${y}%, rgba(232,196,120,.22), transparent 70%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 70% at 50% 115%, rgba(140,100,50,.22), transparent 60%)" }} />
    </AbsoluteFill>
  );
};
const Grain: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.07 }}>
    <svg width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={Math.floor(f / 3) % 40} /></filter><rect width="100%" height="100%" filter="url(#n)" /></svg>
  </AbsoluteFill>
);

// intro: a wall of the showcase pages drifting in 3D, light cone sweeping over it, big words on the beats
const Intro: React.FC<{ f: number; v: boolean }> = ({ f, v }) => {
  if (f > T.hero + 30) return null;
  const imgs = ["arbeit-edel-desktop-lang-1440.webp", "arbeit-norvak-desktop-lang-1440.webp", "arbeit-glut-desktop-lang-1440.webp", "arbeit-laut-desktop-lang-1440.webp"];
  const out = interpolate(f, [T.hero - 16, T.hero + 14], [0, 1], clamp);
  const lx = interpolate(f, [0, T.hero], [15, 85]);
  const w1 = spring({ frame: f - 20, fps: FPS, config: { damping: 14, stiffness: 140 } });
  const w2 = spring({ frame: f - 112, fps: FPS, config: { damping: 11, stiffness: 180 } });
  const w3 = spring({ frame: f - 158, fps: FPS, config: { damping: 15, stiffness: 140 } });
  const w4 = spring({ frame: f - 196, fps: FPS, config: { damping: 12, stiffness: 160 } });
  const first = interpolate(f, [150, 160], [1, 0], clamp);
  const big = v ? 128 : 150;
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <AbsoluteFill style={{ perspective: 1600, WebkitMaskImage: `radial-gradient(ellipse 38% 60% at ${lx}% 45%, black 20%, rgba(0,0,0,.18) 75%)` }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", transformStyle: "preserve-3d", transform: `translate(-50%,-50%) rotateX(24deg) rotateZ(-8deg) translateY(${-f * 1.6}px) scale(${1.05 + f * 0.0008})` }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 520px)", gap: 28 }}>
            {[0, 1, 2].flatMap((r) => imgs.map((src, i) => (
              <Img key={r + src} src={staticFile(src)} style={{ width: 520, borderRadius: 12, opacity: 0.85, transform: `translateY(${((i + r) % 2) * 160}px)` }} />
            )))}
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(21,19,15,.35), rgba(21,19,15,.85))" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: 60 }}>
        <div style={{ opacity: first }}>
          <p style={{ margin: 0, fontFamily: "Geist", fontSize: v ? 52 : 46, color: C.cream, opacity: w1, transform: `translateY(${(1 - w1) * 40}px)` }}>Ihr Betrieb ist</p>
          <p style={{ margin: 0, fontFamily: "IS", fontStyle: "italic", fontSize: big * 1.15, lineHeight: 1, color: C.brass, opacity: w2, transform: `scale(${0.6 + 0.4 * w2})`, filter: `blur(${(1 - w2) * 12}px)` }}>einzigartig.</p>
        </div>
        <div style={{ position: "absolute", opacity: 1 - first }}>
          <p style={{ margin: 0, fontFamily: "Geist", fontSize: v ? 52 : 46, color: C.cream, opacity: w3, transform: `translateY(${(1 - w3) * 40}px)` }}>Ihre Website</p>
          <p style={{ margin: 0, fontFamily: "IS", fontSize: big, lineHeight: 1.02, color: C.cream, opacity: w4, transform: `scale(${0.7 + 0.3 * w4})` }}>sollte es auch <em style={{ color: C.brass }}>sein.</em></p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Browser: React.FC<{ f: number; L: Lay }> = ({ f, L }) => {
  if (f < T.hero - 20 || f > T.outro + 40) return null;
  const sc = screenAt(f);
  const side = Math.max(
    interpolate(f, [T.hero + 30, T.hero + 60, T.phone - 10, T.phone + 10], [0, 1, 1, 0], { ...clamp, easing: ease }),
    interpolate(f, [T.lei - 10, T.lei + 20, T.show - 20, T.show], [0, 1, 1, 0], { ...clamp, easing: ease }),
    interpolate(f, [T.show, T.show + 1, T.preise - 1, T.preise], [0, 1, 1, 1], clamp) * (f < T.preise ? 1 : 0),
    interpolate(f, [T.preise, T.preise + 25, T.outro - 20, T.outro], [0, 1, 1, 0], { ...clamp, easing: ease }),
  );
  const b = lerpBox(L.winFull, L.winSide, side);
  const fin = spring({ frame: f - (T.hero - 20), fps: FPS, config: { damping: 15, stiffness: 120 } });
  const fout = interpolate(f, [T.outro - 10, T.outro + 30], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  // behind the phone close-up the window steps back
  const back = interpolate(f, [T.phone - 6, T.phone + 14, T.lei - 14, T.lei + 6], [0, 1, 1, 0], { ...clamp, easing: ease });
  // showcase pages flip in on each beat
  let flip = 0;
  if (f >= T.show && f < T.preise) { const t = f - SHOW[showAt(f)].at; flip = -70 * (1 - Easing.out(Easing.cubic)(Math.min(1, t / 18))); }
  const p = punch(f);
  const scale = b.w / 1392, H = Math.round(1392 * 900 / 1440), BAR = 40;
  const ry = -40 * (1 - fin) + flip + 3 * Math.sin(f / 90) + 10 * fout + (L.W > L.H ? 4 * side : 0);
  const rx = 22 * (1 - fin) + 2;
  return (
    <AbsoluteFill style={{ perspective: 2400, opacity: Math.min(1, fin * 1.5) * (1 - fout) * (1 - 0.55 * back) }}>
      <div style={{ position: "absolute", left: b.x, top: b.y, width: 1392, height: H + BAR, transformOrigin: "0 0",
        transform: `scale(${scale * (1 + 0.025 * p) * (1 - 0.12 * back)}) translateZ(${-900 * (1 - fin)}px) rotateY(${ry}deg) rotateX(${rx}deg)` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, overflow: "hidden", background: "#0e0d0b", boxShadow: `0 60px 140px rgba(0,0,0,.7), 0 0 0 1px ${C.line}` }}>
          <div style={{ height: BAR, display: "flex", alignItems: "center", gap: 9, padding: "0 18px", background: "#1d1a16", borderBottom: `1px solid ${C.line}` }}>
            {["#e0675a", "#e2b04f", "#6dbf6a"].map((c) => <i key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c, opacity: 0.85 }} />)}
          </div>
          <div style={{ width: 1392, height: H, overflow: "hidden", position: "relative" }}>
            {sc.long
              ? <Img src={staticFile(`arbeit-${sc.long}-desktop-lang-1440.webp`)} style={{ width: 1392, display: "block", transform: `translateY(${-(sc.y ?? 0)}px)` }} />
              : <Img src={staticFile(sc.src)} style={{ width: 1392, height: H, display: "block" }} />}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Phone: React.FC<{ f: number; L: Lay }> = ({ f, L }) => {
  const v = L.H > L.W;
  const big = interpolate(f, [T.phone - 8, T.phone + 16, T.lei - 12, T.lei + 8], [0, 1, 1, 0], { ...clamp, easing: ease });
  const sideOn = Math.max(
    interpolate(f, [T.show + 6, T.show + 26, T.preise - 8, T.preise + 2], [0, 1, 1, 0], clamp),
    v ? interpolate(f, [T.hero + 20, T.hero + 50, T.outro - 20, T.outro], [0, 1, 1, 0], clamp) * (1 - interpolate(f, [T.phone - 10, T.phone, T.lei, T.lei + 10], [0, 1, 1, 0], clamp)) : 0,
  );
  if (big <= 0.001 && sideOn <= 0.001) return null;
  const isBig = big > 0.001;
  const box = isBig ? L.phoneBig : L.phoneSide;
  const on = isBig ? big : sideOn;
  const ph = phoneAt(f);
  const w = box.w, h = Math.round(w * 844 / 390), bez = Math.round(w * 0.035);
  const rot = isBig ? -12 * (1 - big) + 4 * Math.sin(f / 50) : -10 + 3 * Math.sin(f / 60);
  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      <div style={{ position: "absolute", left: box.x, top: box.y, width: w + 2 * bez, height: h + 2 * bez, padding: bez, borderRadius: w * 0.15, background: "linear-gradient(145deg,#2c2924,#0d0c0a)",
        boxShadow: "0 60px 120px rgba(0,0,0,.7), inset 0 0 0 2px rgba(239,230,214,.12)", opacity: on,
        transform: `translateY(${(1 - on) * 220}px) rotateY(${rot}deg) rotateZ(${(1 - on) * 8}deg) scale(${1 + 0.03 * punch(f)})` }}>
        <div style={{ width: w, height: h, borderRadius: w * 0.12, overflow: "hidden", background: "#000", position: "relative" }}>
          {ph.long
            ? <Img src={staticFile(`arbeit-${ph.long}-handy-lang-600.webp`)} style={{ width: w, display: "block", transform: `translateY(${-(ph.y ?? 0) * w / 372}px)` }} />
            : <Img src={staticFile(ph.src)} style={{ width: w, height: h, display: "block" }} />}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Captions: React.FC<{ f: number; L: Lay }> = ({ f, L }) => {
  const c = CAPS.find(([, a, b]) => f >= a && f < b);
  if (!c) return null;
  const [txt, a, b, acc] = c;
  const sp = spring({ frame: f - a, fps: FPS, config: { damping: 13, stiffness: 170 } });
  const o = interpolate(f, [b - 8, b], [1, 0], clamp);
  const words = txt.split(" ");
  return (
    <div style={{ position: "absolute", left: L.cap.x, top: L.cap.y, width: L.cap.w, textAlign: L.cap.align, opacity: o }}>
      <span style={{ display: "block", width: 64 * sp, height: 4, background: C.brass, marginBottom: 22, borderRadius: 2 }} />
      <p style={{ margin: 0, fontFamily: "IS", fontSize: L.cap.size, lineHeight: 1.04, color: acc ? C.brass : C.cream, textShadow: "0 8px 30px rgba(0,0,0,.6)" }}>
        {words.map((w, i) => {
          const k = spring({ frame: f - a - i * 4, fps: FPS, config: { damping: 14, stiffness: 180 } });
          return <span key={i} style={{ display: "inline-block", marginRight: "0.25em", opacity: k, transform: `translateY(${(1 - k) * 36}px)`, filter: `blur(${(1 - k) * 6}px)` }}>{w}</span>;
        })}
      </p>
    </div>
  );
};

// showcase label: what kind of page this is (sits in free space under the caption column)
const ShowLabel: React.FC<{ f: number; L: Lay }> = ({ f, L }) => {
  if (f < T.show || f >= T.preise) return null;
  const i = showAt(f), sh = SHOW[i], t = f - sh.at, len = (SHOW[i + 1]?.at ?? T.preise) - sh.at;
  const a = spring({ frame: t - 4, fps: FPS, config: { damping: 12, stiffness: 200, mass: 0.7 } });
  const o = interpolate(t, [len - 6, len], [1, 0], clamp);
  const v = L.H > L.W;
  return (
    <div style={{ position: "absolute", left: 70, top: v ? 1060 : 945, padding: "18px 28px 20px", borderRadius: 16, background: "rgba(21,19,15,.9)", border: "1px solid rgba(207,174,106,.55)",
      boxShadow: "0 30px 70px rgba(0,0,0,.55)", opacity: a * o, transform: `scale(${0.7 + 0.3 * a})`, transformOrigin: "left center" }}>
      <p style={{ margin: 0, fontFamily: "Geist", fontSize: 20, letterSpacing: "0.24em", textTransform: "uppercase", color: C.brass, fontWeight: 600 }}>{sh.art}</p>
      <p style={{ margin: "6px 0 0", fontFamily: "IS", fontSize: 54, color: C.cream, lineHeight: 1 }}>{sh.name}</p>
    </div>
  );
};

const Outro: React.FC<{ f: number; v: boolean }> = ({ f, v }) => {
  if (f < T.outro) return null;
  const t = f - T.outro;
  const a = spring({ frame: t - 6, fps: FPS, config: { damping: 16 } });
  const b = spring({ frame: t - 22, fps: FPS, config: { damping: 13, stiffness: 150 } });
  const c = spring({ frame: t - 150, fps: FPS, config: { damping: 15 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: v ? "0 70px" : "0 200px" }}>
      <p style={{ fontFamily: "Geist", fontSize: 24, letterSpacing: "0.32em", textTransform: "uppercase", color: C.brass, margin: 0, fontWeight: 600, opacity: a }}>Websites für Betriebe</p>
      <h2 style={{ fontFamily: "IS", fontWeight: 400, fontSize: v ? 104 : 118, lineHeight: 1.02, color: C.cream, margin: "26px 0 34px", opacity: b, transform: `scale(${0.85 + 0.15 * b})`, filter: `blur(${(1 - b) * 10}px)` }}>
        Ihre neue Website beginnt mit <em style={{ color: C.brass }}>einem Gespräch.</em>
      </h2>
      <div style={{ opacity: c, transform: `translateY(${(1 - c) * 24}px)` }}>
        <span style={{ display: "inline-block", padding: "16px 34px", borderRadius: 999, background: C.cream, color: C.bg, fontFamily: "Geist", fontSize: 28, fontWeight: 600 }}>Projekt anfragen →</span>
      </div>
    </AbsoluteFill>
  );
};

const Flash: React.FC<{ f: number }> = ({ f }) => {
  const h = [T.hero, T.show, T.outro].find((x) => f >= x && f < x + 10);
  if (h === undefined) return null;
  return <AbsoluteFill style={{ background: "#fff3dc", opacity: 0.22 * (1 - (f - h) / 10), mixBlendMode: "screen" }} />;
};

export const Film2: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  useFonts();
  const f = useCurrentFrame();
  const L = LAY[vertical ? "v" : "h"];
  const fade = Math.max(interpolate(f, [TOTAL - 30, TOTAL - 1], [0, 1], clamp), interpolate(f, [0, 12], [1, 0], clamp));
  // tiny camera shake on impacts
  const p = punch(f), sx = Math.sin(f * 2.3) * 5 * p, sy = Math.cos(f * 1.7) * 4 * p;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <Back f={f} />
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px)` }}>
        <Intro f={f} v={vertical} />
        <Browser f={f} L={L} />
        <Phone f={f} L={L} />
        <Captions f={f} L={L} />
        <ShowLabel f={f} L={L} />
        <Outro f={f} v={vertical} />
      </AbsoluteFill>
      <Flash f={f} />
      <Grain f={f} />
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />

      {MUSIC && <Audio src={staticFile(MUSIC)} volume={(fr) => interpolate(fr, [0, 20, TOTAL - 90, TOTAL - 5], [0, 0.55, 0.55, 0], clamp)} />}
      {VO.map((v) => <Sequence key={v.file} from={v.at}><Audio src={staticFile(v.file)} volume={1} /></Sequence>)}
      {HITS.map((h, i) => <Sequence key={"h" + i} from={h - 2}><Audio src={staticFile(i === 0 || h === T.outro ? "hit.wav" : "swoosh.wav")} volume={i === 0 || h === T.outro ? 0.6 : 0.4} /></Sequence>)}
    </AbsoluteFill>
  );
};
