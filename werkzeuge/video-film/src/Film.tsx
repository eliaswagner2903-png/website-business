import React from "react";
import {
  AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, Easing,
} from "remotion";
import timing from "../public/timing.json";
import heroInfo from "../public/hero.json";
import handyInfo from "../public/handy.json";

// ================= timeline =================
export const FPS = 60;
const s = (sec: number) => Math.round(sec * FPS);
const M: Record<string, number> = Object.fromEntries(timing.marks.map((m: { name: string; frame: number }) => [m.name, m.frame]));

const INTRO = 270;                         // title + 3D cards, window flies in
const H = heroInfo.frames as number;       // hero clip: cursor sweeps over the showcase mosaic
const A0 = M.menu, A1 = M.ablauf;          // desktop capture part A: menu, services, works + tabs
const B0 = M.ablauf, B1 = M.fuss;          // part B: process, prices, FAQ, contact form
const PAGE = 210;                          // one showcase page in the trip
const SHOW = [
  { key: "edel", name: "Lindgrund", art: "Uhrmacherei", addr: "lindgrund · musterseite", music: "motivational-day-112790.mp3", from: 22 },
  { key: "norvak", name: "NORVAK", art: "Präzisionswerkzeuge", addr: "norvak · musterseite", music: "the-upbeat-inspiring-corporate-142313.mp3", from: 30 },
  { key: "glut", name: "ZEYTIN & GLUT", art: "Restaurant", addr: "zeytin-glut · musterseite", music: "motivational-day-112790.mp3", from: 75 },
  { key: "laut", name: "Zwischenbild", art: "Studio für Motion-Design", addr: "zwischenbild · musterseite", music: "the-upbeat-inspiring-corporate-142313.mp3", from: 68 },
];
const TRIP = PAGE * SHOW.length;
const HANDY_FROM = 60;                     // phone clip: skip the first second
const HANDY = Math.min((handyInfo.frames as number) - HANDY_FROM, s(9.5));
const OUTRO_LEN = 400;

// film-frame starts of each segment
const T_HERO = INTRO;
const T_A = T_HERO + H;
const T_TRIP = T_A + (A1 - A0);
const T_B = T_TRIP + TRIP;
const T_HANDY = T_B + (B1 - B0);
const T_OUTRO = T_HANDY + HANDY;
export const TOTAL = T_OUTRO + OUTRO_LEN;

// desktop capture frame -> film frame
const g = (rec: number) => (rec < A1 ? T_A + (rec - A0) : T_B + (rec - B0));

type Seg = { kind: "intro" | "hero" | "rec" | "trip" | "handy" | "outro"; i: number };
const segAt = (f: number): Seg => {
  if (f < T_HERO) return { kind: "intro", i: f };
  if (f < T_A) return { kind: "hero", i: f - T_HERO };
  if (f < T_TRIP) return { kind: "rec", i: A0 + (f - T_A) };
  if (f < T_B) return { kind: "trip", i: f - T_TRIP };
  if (f < T_HANDY) return { kind: "rec", i: B0 + (f - T_B) };
  if (f < T_OUTRO) return { kind: "handy", i: f - T_HANDY };
  return { kind: "outro", i: f - T_OUTRO };
};

const C = { bg: "#15130f", cream: "#efe6d6", muted: "#b9ad99", brass: "#cfae6a", line: "rgba(239,230,214,.14)" };
const pad = (n: number) => String(n).padStart(5, "0");
const ease = Easing.bezier(0.45, 0, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ================= voice (warm narrator) =================
export type Line = { file: string; at: number; dur: number; text: string[] };
export const VO: Line[] = [
  { file: "vo1.wav", at: s(0.45), dur: 4.25, text: ["Websites für Betriebe. Gebaut. Gemessen. Betreut."] },
  { file: "vo2.wav", at: T_HERO + s(0.9), dur: 8.4, text: ["Ich baue Websites für Praxen, Werkstätten und Restaurants.", "Schnell auf dem Handy, klar im Aufbau – und mit eigenem Charakter."] },
  { file: "vo3.wav", at: g(M.leistungen + 12), dur: 11.7, text: ["Mein Angebot für Sie: neue Websites nach Maß,", "die Erneuerung bestehender Seiten, Suchmaschinenoptimierung und Barrierefreiheit.", "Damit Sie gefunden werden – auch von KI-Assistenten."] },
  { file: "vo4.wav", at: T_TRIP - s(3.75), dur: 3.55, text: ["Jeder Betrieb bekommt seine eigene Welt. Schauen Sie mal."] },
  { file: "vo5.wav", at: T_B + s(0.5), dur: 3.85, text: ["Vom ersten Gespräch bis zum Start: vier klare Schritte."] },
  { file: "vo6.wav", at: g(M.preise + 50), dur: 3.95, text: ["Die Seite zahlen Sie einmal. Die Betreuung danach ist freiwillig."] },
  { file: "vo7.wav", at: g(M.kontakt + 18), dur: 1.8, text: ["Erzählen Sie mir von Ihrem Betrieb."] },
  { file: "vo8.wav", at: T_OUTRO + s(1.2), dur: 3.91, text: ["Ihre neue Seite beginnt mit einem Gespräch.", "Ich freue mich auf Sie."] },
];
// 0..1 how much the music is ducked under the voice
const duck = (f: number) => {
  let w = 0;
  for (const v of VO) {
    const a = v.at - 16, b = v.at + s(v.dur) + 4;
    w = Math.max(w, interpolate(f, [a - 24, a, b, b + 36], [0, 1, 1, 0], clamp));
  }
  return w;
};
const LOUD = 0.6, LOW = 0.14;
// main theme: plays on the OQ page, fades out while a showcase or the phone scene has its own track
const mainVolume = (f: number) => {
  const away = Math.max(
    interpolate(f, [T_TRIP - 20, T_TRIP + 10, T_B - 10, T_B + 25], [0, 1, 1, 0], clamp),
    interpolate(f, [T_HANDY - 20, T_HANDY + 10, T_OUTRO - 10, T_OUTRO + 25], [0, 1, 1, 0], clamp),
  );
  const lvl = interpolate(duck(f), [0, 1], [LOUD, LOW]);
  const fadeIn = interpolate(f, [0, 40], [0, 1], clamp);
  const fadeOut = interpolate(f, [TOTAL - 160, TOTAL - 5], [1, 0], clamp);
  return lvl * (1 - away) * fadeIn * fadeOut;
};
// a showcase's own track inside its window, with short crossfades
const segVolume = (len: number, gain: number) => (f: number) =>
  gain * interpolate(f, [0, 18, len - 14, len + 14], [0, 1, 1, 0], clamp);

// ================= camera over the page (story frames) =================
type K = { f: number; sc: number; ox: number; oy: number; ry: number; rx: number };
const KF: K[] = [
  { f: T_HERO - 100, sc: 1, ox: 0.5, oy: 0.5, ry: -7, rx: 5 },
  { f: T_HERO + s(1.6), sc: 1.25, ox: 0.97, oy: 0.42, ry: -3, rx: 1 },     // push in on the light cone over the showcase mosaic
  { f: T_HERO + s(7.2), sc: 1.0, ox: 0.5, oy: 0.5, ry: -1, rx: 1 },
  { f: g(M.menu), sc: 1.3, ox: 0.82, oy: 0.04, ry: 0, rx: 0 },
  { f: g(M.leistungen), sc: 1, ox: 0.5, oy: 0.5, ry: 3, rx: 2 },
  { f: g(M.leistungen) + s(4), sc: 1.1, ox: 0.5, oy: 0.55, ry: -2, rx: 1 },
  { f: g(M.arbeiten), sc: 1, ox: 0.5, oy: 0.5, ry: 4, rx: 2 },
  { f: g(M.tabs) - 20, sc: 1.2, ox: 0.4, oy: 0.35, ry: 0, rx: 0 },
  { f: g(M.ablauf - 1) - s(1.3), sc: 1.08, ox: 0.7, oy: 0.6, ry: -2, rx: 0 },
  { f: T_TRIP, sc: 1, ox: 0.5, oy: 0.5, ry: 0, rx: 0 },
  { f: T_B, sc: 1, ox: 0.5, oy: 0.5, ry: -5, rx: 3 },
  { f: g(M.preise), sc: 1.12, ox: 0.6, oy: 0.65, ry: 2, rx: 0 },
  { f: g(M.fragen), sc: 1.16, ox: 0.66, oy: 0.45, ry: -1, rx: 0 },
  { f: g(M.kontakt) + s(1.2), sc: 1.2, ox: 0.72, oy: 0.5, ry: 0, rx: 0 },
  { f: T_HANDY - 40, sc: 1, ox: 0.5, oy: 0.5, ry: 2, rx: 2 },
];
const camAt = (f: number): K => {
  const T = 55;
  let cur = KF[0];
  for (let i = 1; i < KF.length; i++) {
    const k = KF[i];
    if (f < k.f) break;
    const t = ease(Math.min(1, (f - k.f) / T));
    if (t < 1) {
      return { f: k.f, sc: cur.sc + (k.sc - cur.sc) * t, ox: cur.ox + (k.ox - cur.ox) * t, oy: cur.oy + (k.oy - cur.oy) * t, ry: cur.ry + (k.ry - cur.ry) * t, rx: cur.rx + (k.rx - cur.rx) * t };
    }
    cur = k;
  }
  return cur;
};

// ================= chapters =================
const CHAPTERS: [string, string, number][] = [
  ["01", "Startseite", T_HERO + 30], ["02", "Leistungen", g(M.leistungen)], ["03", "Musterseiten", g(M.arbeiten)], ["04", "Ablauf", T_B + 10],
  ["05", "Preise", g(M.preise)], ["06", "Häufige Fragen", g(M.fragen)], ["07", "Kontakt", g(M.kontakt)], ["08", "Auf dem Handy", T_HANDY + 20],
];

// ================= fonts =================
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

// ================= pieces =================
const Background: React.FC<{ f: number }> = ({ f }) => {
  const x = 50 + 14 * Math.sin(f / 170), y = 22 + 8 * Math.sin(f / 230);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 55% at ${x}% ${y}%, rgba(232,196,120,.20), transparent 70%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 80% at 50% 120%, rgba(120,90,50,.18), transparent 60%)" }} />
    </AbsoluteFill>
  );
};
const Grain: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.08 }}>
    <svg width="1920" height="1080">
      <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={Math.floor(f / 3) % 40} /></filter>
      <rect width="100%" height="100%" filter="url(#n)" />
    </svg>
  </AbsoluteFill>
);
const Vignette = () => <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse 75% 70% at 50% 48%, transparent 55%, rgba(0,0,0,.55) 100%)" }} />;

const Cards: React.FC<{ f: number; spread: number; opacity: number }> = ({ f, spread, opacity }) => {
  const imgs = ["mosaik-edel-desktop.webp", "mosaik-glut-desktop.webp", "mosaik-norvak-desktop.webp"];
  return (
    <AbsoluteFill style={{ perspective: 1800, opacity }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", transformStyle: "preserve-3d", transform: `rotateX(8deg) rotateY(${f * 0.35}deg)` }}>
        {imgs.map((src, i) => (
          <div key={src} style={{
            position: "absolute", width: 300, height: 560, left: -150, top: -280, borderRadius: 14, overflow: "hidden",
            transform: `rotateY(${i * 120}deg) translateZ(${420 * spread}px) translateY(${18 * Math.sin(f / 40 + i * 2)}px)`,
            boxShadow: "0 40px 80px rgba(0,0,0,.6)", border: "1px solid rgba(239,230,214,.18)", backfaceVisibility: "hidden",
          }}>
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Title: React.FC<{ f: number }> = ({ f }) => {
  const word = (txt: string, at: number, italic = false) => {
    const sp = spring({ frame: f - at, fps: FPS, config: { damping: 16, stiffness: 120 } });
    return <span style={{ display: "inline-block", marginRight: 26, opacity: sp, transform: `translateY(${(1 - sp) * 60}px)`, filter: `blur(${(1 - sp) * 10}px)`, fontStyle: italic ? "italic" : "normal", color: italic ? C.brass : C.cream }}>{txt}</span>;
  };
  const out = interpolate(f, [175, 215], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const sub = spring({ frame: f - 85, fps: FPS, config: { damping: 20 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - out, transform: `scale(${1 + out * 0.25})`, filter: `blur(${out * 8}px)` }}>
      <p style={{ fontFamily: "Geist", fontSize: 22, letterSpacing: "0.32em", textTransform: "uppercase", color: C.brass, opacity: sub, margin: 0, fontWeight: 600 }}>Websites für Betriebe</p>
      <h1 style={{ fontFamily: "IS", fontWeight: 400, fontSize: 148, lineHeight: 1.05, margin: "24px 0", textShadow: "0 10px 40px rgba(0,0,0,.6)" }}>
        {word("Gebaut.", 12)}{word("Gemessen.", 30, true)}{word("Betreut.", 48)}
      </h1>
      <p style={{ fontFamily: "Geist", fontSize: 30, color: C.muted, opacity: sub, transform: `translateY(${(1 - sub) * 20}px)`, margin: 0 }}>Für Praxen, Werkstätten und Restaurants</p>
    </AbsoluteFill>
  );
};

// ---------- desktop window ----------
const WIN_W = 1392, SCR_H = Math.round((WIN_W * 900) / 1440), BAR = 40;
const LONG_H = Math.round((3600 * WIN_W) / 1440);

// one showcase page: flips in, scrolls down, flips out
const tripState = (i: number) => {
  const p = Math.min(SHOW.length - 1, Math.floor(i / PAGE)), t = i - p * PAGE;
  const flipIn = interpolate(t, [0, 26], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const flipOut = interpolate(t, [PAGE - 22, PAGE], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const scroll = interpolate(t, [20, PAGE - 10], [0, 1150], { ...clamp, easing: ease });
  return { p, t, flipIn, flipOut, scroll };
};

const Screen: React.FC<{ seg: Seg; f: number }> = ({ seg, f }) => {
  const cam = camAt(f);
  let content: React.ReactNode;
  if (seg.kind === "trip") {
    const st = tripState(seg.i);
    content = <Img src={staticFile(`arbeit-${SHOW[st.p].key}-desktop-lang-1440.webp`)} style={{ width: WIN_W, height: LONG_H, display: "block", transform: `translateY(${-st.scroll}px)` }} />;
  } else {
    const src = seg.kind === "intro" ? "hero/00000.jpg"
      : seg.kind === "hero" ? `hero/${pad(Math.min(H - 1, seg.i))}.jpg`
      : seg.kind === "rec" ? `frames/${pad(seg.i)}.jpg`
      : `frames/${pad(B1 - 1)}.jpg`;
    content = (
      <div style={{ width: "100%", height: "100%", transform: `scale(${cam.sc})`, transformOrigin: `${cam.ox * 100}% ${cam.oy * 100}%` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", display: "block", filter: seg.kind === "hero" ? "brightness(1.14) contrast(1.04)" : undefined }} />
      </div>
    );
  }
  return <div style={{ position: "relative", width: WIN_W, height: SCR_H, overflow: "hidden", background: "#0e0d0b" }}>{content}</div>;
};

const Window: React.FC<{ f: number }> = ({ f }) => {
  const seg = segAt(f);
  const cam = camAt(f);
  const fin = spring({ frame: f - 172, fps: FPS, config: { damping: 22, stiffness: 70, mass: 1.1 } });
  // phone scene: window slides back and to the left, outro: recedes in 3D
  const ph = interpolate(f, [T_HANDY - 10, T_HANDY + 40, T_OUTRO - 30, T_OUTRO + 10], [0, 1, 1, 0.0], { ...clamp, easing: ease });
  const fo = spring({ frame: f - T_OUTRO, fps: FPS, config: { damping: 24, stiffness: 60 } });
  // trip: card flips between pages, desktop shifts left to make room for the phone
  let flip = 0, shift = 0, addr = "ihre-website.de · Vorschau";
  if (seg.kind === "trip") {
    const st = tripState(seg.i);
    flip = st.t < PAGE / 2 ? -88 * st.flipIn : 88 * st.flipOut;
    addr = SHOW[st.p].addr;
  }
  // flip out of the OQ page into the trip and back in afterwards
  if (seg.kind === "rec" && f < T_TRIP && f > T_TRIP - 22) flip = 88 * Easing.in(Easing.cubic)((f - (T_TRIP - 22)) / 22);
  if (seg.kind === "rec" && f >= T_B && f < T_B + 26) flip = -88 * (1 - Easing.out(Easing.cubic)((f - T_B) / 26));
  shift = interpolate(f, [T_TRIP - 30, T_TRIP + 20, T_B - 20, T_B + 30], [0, 1, 1, 0], { ...clamp, easing: ease });

  const drift = Math.sin(f / 95) * 0.7;
  const z = -1800 * (1 - fin) - 500 * fo - 900 * ph - 160 * shift;
  const ry = cam.ry * (1 - fo) + -48 * (1 - fin) + 26 * fo + 28 * ph + drift + flip + 6 * shift;
  const rx = cam.rx * (1 - fo) + 34 * (1 - fin) + 4 * fo;
  const tx = -430 * fo - 520 * ph - 230 * shift;
  const op = Math.min(1, fin * 1.6) * (1 - 0.35 * ph);
  return (
    <AbsoluteFill style={{ perspective: 2200, opacity: op }}>
      <div style={{ position: "absolute", left: (1920 - WIN_W) / 2, top: 40, width: WIN_W, height: SCR_H + BAR,
        transform: `translateX(${tx}px) translateZ(${z}px) rotateY(${ry}deg) rotateX(${rx}deg)`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 16, overflow: "hidden", background: "#0e0d0b", boxShadow: `0 60px 120px rgba(0,0,0,.65), 0 0 0 1px ${C.line}` }}>
          <div style={{ height: BAR, display: "flex", alignItems: "center", gap: 9, padding: "0 18px", background: "#1d1a16", borderBottom: `1px solid ${C.line}` }}>
            {["#e0675a", "#e2b04f", "#6dbf6a"].map((c) => <i key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c, opacity: 0.85 }} />)}
            <div style={{ margin: "0 auto", padding: "5px 60px", borderRadius: 8, background: "rgba(239,230,214,.07)", fontFamily: "Geist", fontSize: 15, color: C.muted }}>{addr}</div>
          </div>
          <Screen seg={seg} f={f} />
        </div>
        <div style={{ position: "absolute", inset: 0, borderRadius: 16, pointerEvents: "none", background: `linear-gradient(${115 + ry * 2}deg, rgba(255,255,255,${0.05 + Math.min(0.12, Math.abs(ry) * 0.003)}) 0%, transparent 35%)` }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- phone mockup ----------
const PH_W = 372, PH_H = Math.round((PH_W * 844) / 390);
const Phone: React.FC<{ src: string; y?: number; long?: boolean; style?: React.CSSProperties }> = ({ src, y = 0, long, style }) => (
  <div style={{ position: "absolute", width: PH_W + 24, height: PH_H + 24, borderRadius: 58, background: "linear-gradient(145deg,#2c2924,#0d0c0a)", padding: 12,
    boxShadow: "0 60px 120px rgba(0,0,0,.7), inset 0 0 0 2px rgba(239,230,214,.12)", ...style }}>
    <div style={{ width: PH_W, height: PH_H, borderRadius: 46, overflow: "hidden", position: "relative", background: "#000" }}>
      <Img src={staticFile(src)} style={long ? { width: PH_W, display: "block", transform: `translateY(${-y}px)` } : { width: PH_W, height: PH_H, display: "block" }} />
      <div style={{ position: "absolute", top: 10, left: "50%", width: 112, height: 30, marginLeft: -56, borderRadius: 20, background: "#000" }} />
    </div>
  </div>
);

// phone next to the desktop during the showcase trip
const TripPhone: React.FC<{ f: number }> = ({ f }) => {
  const seg = segAt(f);
  if (seg.kind !== "trip") return null;
  const st = tripState(seg.i);
  const a = spring({ frame: st.t - 10, fps: FPS, config: { damping: 18, stiffness: 90 } });
  const out = st.flipOut;
  const y = interpolate(st.t, [30, PAGE - 10], [0, 1500], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      <Phone src={`arbeit-${SHOW[st.p].key}-handy-lang-600.webp`} long y={y}
        style={{ left: 1390, top: 150, transform: `translateY(${(1 - a) * 260 + out * 120}px) rotateY(${-14 + (1 - a) * -30}deg) rotateZ(${(1 - a) * 6}deg)`, opacity: a * (1 - out) }} />
    </AbsoluteFill>
  );
};

// the OQ page itself on a phone, turning slowly in 3D
const HandyScene: React.FC<{ f: number }> = ({ f }) => {
  const i = f - T_HANDY;
  if (i < -30 || i > HANDY + 40) return null;
  const a = spring({ frame: i, fps: FPS, config: { damping: 20, stiffness: 70 } });
  const out = interpolate(i, [HANDY - 20, HANDY + 30], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const fr = HANDY_FROM + Math.max(0, Math.min(HANDY - 1, i));
  return (
    <AbsoluteFill style={{ perspective: 1600 }}>
      <Phone src={`handy/${pad(fr)}.jpg`} style={{ left: 960 - (PH_W + 24) / 2 + 120, top: 1080 / 2 - (PH_H + 24) / 2,
        transform: `translateZ(${(1 - a) * -900 - out * 600}px) rotateY(${(1 - a) * 50 - 12 + Math.sin(i / 70) * 6 - out * 40}deg) rotateX(${4 + (1 - a) * 10}deg)`, opacity: a * (1 - out) }} />
    </AbsoluteFill>
  );
};

// pop-up card naming the showcase business
const ShowLabel: React.FC<{ f: number }> = ({ f }) => {
  const seg = segAt(f);
  if (seg.kind !== "trip") return null;
  const st = tripState(seg.i), sh = SHOW[st.p];
  const a = spring({ frame: st.t - 16, fps: FPS, config: { damping: 13, stiffness: 160, mass: 0.8 } });
  const b = interpolate(st.t, [PAGE - 30, PAGE - 8], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 110, top: 780, padding: "20px 30px 22px", borderRadius: 18, background: "rgba(21,19,15,.88)", border: "1px solid rgba(207,174,106,.5)",
      boxShadow: "0 30px 70px rgba(0,0,0,.55)", opacity: a * (1 - b), transform: `scale(${0.75 + 0.25 * a}) translateY(${(1 - a) * 30 - b * 20}px)`, transformOrigin: "left bottom" }}>
      <p style={{ margin: 0, fontFamily: "Geist", fontSize: 18, letterSpacing: "0.24em", textTransform: "uppercase", color: C.brass, fontWeight: 600 }}>Musterseite {String(st.p + 1).padStart(2, "0")}</p>
      <p style={{ margin: "6px 0 2px", fontFamily: "IS", fontSize: 58, color: C.cream, lineHeight: 1 }}>{sh.name}</p>
      <p style={{ margin: 0, fontFamily: "Geist", fontSize: 24, color: C.muted }}>{sh.art}</p>
    </div>
  );
};

const Chapter: React.FC<{ f: number; nr: string; name: string; at: number }> = ({ f, nr, name, at }) => {
  if (f < at || f > at + 180) return null;
  const a = spring({ frame: f - at, fps: FPS, config: { damping: 18, stiffness: 140 } });
  const b = interpolate(f, [at + 150, at + 175], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 120, top: 860, display: "flex", alignItems: "center", gap: 18, padding: "16px 28px 16px 22px", borderRadius: 14,
      background: "rgba(21,19,15,.82)", border: "1px solid rgba(207,174,106,.45)", boxShadow: "0 20px 50px rgba(0,0,0,.5)",
      opacity: a * (1 - b), transform: `translateX(${(1 - a) * -60 - b * 40}px) perspective(800px) rotateY(${(1 - a) * 25}deg)` }}>
      <span style={{ fontFamily: "IS", fontStyle: "italic", fontSize: 40, color: C.brass, lineHeight: 1 }}>{nr}</span>
      <span style={{ width: 1, height: 34, background: "rgba(207,174,106,.5)" }} />
      <span style={{ fontFamily: "Geist", fontSize: 26, color: C.cream, letterSpacing: "0.04em", fontWeight: 500 }}>{name}</span>
    </div>
  );
};

const Subtitles: React.FC<{ f: number }> = ({ f }) => {
  for (const v of VO) {
    const end = v.at + s(v.dur);
    if (f < v.at || f > end) continue;
    const part = Math.min(v.text.length - 1, Math.floor(((f - v.at) / (end - v.at)) * v.text.length));
    const fade = interpolate(f, [v.at, v.at + 10, end - 10, end], [0, 1, 1, 0]);
    return (
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, display: "flex", justifyContent: "center", opacity: fade }}>
        <span style={{ fontFamily: "Geist", fontSize: 30, color: C.cream, background: "rgba(14,13,11,.8)", padding: "10px 24px", borderRadius: 10, border: `1px solid ${C.line}` }}>{v.text[part]}</span>
      </div>
    );
  }
  return null;
};

const Outro: React.FC<{ f: number }> = ({ f }) => {
  const t = f - T_OUTRO;
  const a = spring({ frame: t - 25, fps: FPS, config: { damping: 18 } });
  const b = spring({ frame: t - 70, fps: FPS, config: { damping: 18 } });
  const c = spring({ frame: t - 110, fps: FPS, config: { damping: 18 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 1040, paddingRight: 120 }}>
      <p style={{ fontFamily: "Geist", fontSize: 20, letterSpacing: "0.3em", textTransform: "uppercase", color: C.brass, margin: 0, fontWeight: 600, opacity: a, transform: `translateY(${(1 - a) * 30}px)` }}>Websites für Betriebe</p>
      <h2 style={{ fontFamily: "IS", fontWeight: 400, fontSize: 92, lineHeight: 1.04, color: C.cream, margin: "22px 0 30px", opacity: b, transform: `translateY(${(1 - b) * 40}px)`, filter: `blur(${(1 - b) * 8}px)` }}>
        Ihre neue Seite beginnt mit <em style={{ color: C.brass }}>einem Gespräch.</em>
      </h2>
      <div style={{ opacity: c, transform: `translateY(${(1 - c) * 20}px)` }}>
        <span style={{ display: "inline-block", padding: "10px 22px", border: "1px solid rgba(207,174,106,.6)", borderRadius: 999, color: "#e7cc8f", fontFamily: "Geist", fontSize: 20, letterSpacing: "0.16em", textTransform: "uppercase" }}>Erste Version · Vorschau</span>
      </div>
    </AbsoluteFill>
  );
};

// ================= film =================
export const Film: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  const introCards = interpolate(f, [0, 30, 170, 215], [0, 0.55, 0.55, 0], clamp);
  const cardSpread = interpolate(f, [0, 60, 170, 230], [0.6, 1, 1, 2.2], { ...clamp, easing: ease });
  const outroCards = interpolate(f, [T_OUTRO + 20, T_OUTRO + 90], [0, 0.32], clamp);
  const fade = Math.max(interpolate(f, [TOTAL - 40, TOTAL - 1], [0, 1], clamp), interpolate(f, [0, 20], [1, 0], clamp));
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <Background f={f} />
      {f < 240 && <Cards f={f} spread={cardSpread} opacity={introCards} />}
      {f >= T_OUTRO && <div style={{ position: "absolute", inset: 0, transform: "translateX(480px)" }}><Cards f={f} spread={1.1} opacity={outroCards} /></div>}
      {f < 240 && <Title f={f} />}
      {f >= 160 && <Window f={f} />}
      <TripPhone f={f} />
      <HandyScene f={f} />
      {f >= T_OUTRO && <Outro f={f} />}
      <ShowLabel f={f} />
      {CHAPTERS.map(([nr, name, at]) => <Chapter key={nr} f={f} nr={nr} name={name} at={at} />)}
      <Subtitles f={f} />
      <Vignette />
      <Grain f={f} />
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />

      {/* ---- sound ---- */}
      <Audio src={staticFile("musik.mp3")} volume={(fr) => mainVolume(fr)} />
      {SHOW.map((sh, i) => (
        <Sequence key={"m" + sh.key} from={T_TRIP + i * PAGE - 8} durationInFrames={PAGE + 24}>
          <Audio src={staticFile(sh.music)} startFrom={s(sh.from)} volume={segVolume(PAGE + 8, 0.55)} />
        </Sequence>
      ))}
      <Sequence from={T_HANDY - 10} durationInFrames={HANDY + 40}>
        <Audio src={staticFile("the-upbeat-inspiring-corporate-142313.mp3")} startFrom={s(12)} volume={segVolume(HANDY + 20, 0.4)} />
      </Sequence>
      {VO.map((v) => <Sequence key={v.file} from={v.at}><Audio src={staticFile(v.file)} volume={1} /></Sequence>)}
      <Sequence from={168}><Audio src={staticFile("whoosh.mp3")} volume={0.55} /></Sequence>
      {SHOW.map((sh, i) => <Sequence key={"w" + sh.key} from={T_TRIP + i * PAGE - 14}><Audio src={staticFile("whoosh.mp3")} volume={0.45} /></Sequence>)}
      <Sequence from={T_B - 14}><Audio src={staticFile("whoosh.mp3")} volume={0.45} /></Sequence>
      <Sequence from={T_HANDY - 14}><Audio src={staticFile("whoosh.mp3")} volume={0.5} /></Sequence>
      <Sequence from={T_OUTRO - 6}><Audio src={staticFile("whoosh.mp3")} volume={0.45} /></Sequence>
      {CHAPTERS.slice(1, 7).map(([nr, , at]) => <Sequence key={"cw" + nr} from={at - 8}><Audio src={staticFile("whoosh.mp3")} volume={0.18} /></Sequence>)}
      {(timing.clicks as number[]).filter((c) => c < B1).map((c) => <Sequence key={"c" + c} from={g(c)}><Audio src={staticFile("click.wav")} volume={0.5} /></Sequence>)}
    </AbsoluteFill>
  );
};
