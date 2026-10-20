import React from "react";
import {
  AbsoluteFill, Composition, Easing, Freeze, Img, OffthreadVideo, continueRender, delayRender, interpolate, staticFile, useCurrentFrame,
} from "remotion";
import {
  ANSICHTEN, Ansicht, C, DAUER, FPS, Fmt, LAY, Q, RGB, T, TAFELN, Tafel, UEBER, Ueber, W, WOK_OFF, ansichtBis, clamp, glatt, hoehe,
  kCss, kamera, qVon, we, ws, ziel,
} from "./uyghur/daten";
import { MONOGRAMM, RAUTE, WOK_SVG } from "./uyghur/zeichnungen";

// Werbefilm UYGHUR HAUS (A-118), Erste Version: 60,0 s, 16:9 und 9:16 auf einer Zeitleiste (Stimme „Gastgeber A“, Take C).
// Aus Sicht des Inhabers: Wok-Auftakt (Zeichnung der Seite), Küche, Gerichte, Speisekarte, Teilen, Reservierung, Merksatz, Besuch.
// Regeln wie „Nachtfahrt“: jeder Frame ist eine reine Funktion der Framenummer, Ebenen bleiben eingehängt und ändern nur die
// Deckkraft, die Seite wird nie angeschnitten oder hineingezoomt, eine Bewegung pro Moment, Bewegungen auf betonten Wörtern.

const uh = (p: string) => staticFile(`uyghur/${p}`);
// Deckkraft nie genau 1: Chrome wechselt sonst beim Erreichen von 1 den Compositing-Weg (Ebene wird neu abgetastet → Sprung)
const dk = (x: number) => Math.min(0.995, Math.max(0, x));
const rampe = (f: number, [a, b]: readonly [number, number] | number[]) => interpolate(f, [a, b], [0, 1], clamp);
const sinRampe = (f: number, [a, b]: readonly [number, number] | number[]) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
const rgba = (c: number[], a: number) => `rgba(${c.map((v) => Math.round(v)).join(",")},${a.toFixed(4)})`;
const mischen = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t);
const GOLDTEXT = "linear-gradient(180deg, #F2D27A 0%, #D9A441 55%, #8A6420 100%)";

// ---------------- Schriften der Seite (lokal) ----------------
const useSchriften = () => {
  const [h] = React.useState(() => delayRender("schriften"));
  React.useEffect(() => {
    const ff = [
      new FontFace("Playfair Display", `url(${uh("schriften/playfair-display-latin-600-normal.woff2")})`, { weight: "600" }),
      new FontFace("Playfair Display", `url(${uh("schriften/playfair-display-latin-600-italic.woff2")})`, { weight: "600", style: "italic" }),
      new FontFace("Mulish", `url(${uh("schriften/mulish-latin-400-normal.woff2")})`, { weight: "400" }),
      new FontFace("Mulish", `url(${uh("schriften/mulish-latin-700-normal.woff2")})`, { weight: "700" }),
    ];
    Promise.all(ff.map((x) => x.load())).then((l) => { l.forEach((x) => (document.fonts as unknown as { add: (x: FontFace) => void }).add(x)); continueRender(h); });
  }, [h]);
};

// ---------------- Hintergrund: Schwarz-Gold-Textur der Startseite, unscharf und dunkel (fest ab Frame 0) ----------------
const Grund: React.FC = () => (
  <AbsoluteFill style={{ background: C.ink }}>
    <Img src={uh("bg-hero.webp")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.12)", filter: "blur(26px) brightness(0.34) saturate(0.9)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 78% 72% at 50% 45%, rgba(13,12,11,0) 36%, rgba(13,12,11,0.82) 100%)" }} />
  </AbsoluteFill>
);

// ---------------- Aufnahme: genau ein Bild (Freeze = framegenaue Zuordnung) ----------------
const Aufnahme: React.FC<{ shot: string; src: number; w: number }> = ({ shot, src, w }) => (
  <Freeze frame={src}>
    <OffthreadVideo src={uh(`${shot}.mp4`)} muted style={{ position: "absolute", left: 0, top: 0, width: w, height: hoehe(shot[0] as Q, w), display: "block" }} />
  </Freeze>
);

// Ansichten: jede spätere Ansicht liegt oben und blendet über die stehende vorige ein
const Ansichten: React.FC<{ f: number; w: number; liste: Ansicht[] }> = ({ f, w, liste }) => (
  <>
    {liste.map((a) => {
      if (f < a.von || f >= a.bis) return null;
      const op = a.ein ? sinRampe(f, a.ein) : 1;
      return (
        <div key={a.key} style={{ position: "absolute", inset: 0, opacity: dk(op) }}>
          <Aufnahme shot={a.shot} src={a.src[f - a.von]} w={w} />
        </div>
      );
    })}
  </>
);

// ---------------- Hervorhebungen auf der Seite (Rechtecke aus der Aufnahme, CSS-px) ----------------
const Glanz: React.FC<{ u: Ueber; f: number; k: number }> = ({ u, f, k }) => {
  if (f < u.f - 8 || f > u.f + 50) return null;
  const p = interpolate(f, [u.f - 8, u.f + 46], [-0.6, 1.6], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const [x, y, w, h] = u.r.map((v) => v * k);
  return (
    <div style={{ position: "absolute", left: x - 10, top: y - 6, width: w + 20, height: h + 12, overflow: "hidden", mixBlendMode: "screen" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, width: (w + 20) * 0.38, left: (w + 20) * (p - 0.19),
        background: "linear-gradient(100deg, rgba(255,236,190,0) 0%, rgba(255,236,190,0.55) 50%, rgba(255,236,190,0) 100%)" }} />
    </div>
  );
};

const Strich: React.FC<{ u: Ueber; f: number; k: number; bis: number; dick: number }> = ({ u, f, k, bis, dick }) => {
  if (f < u.f - 1 || f > bis) return null;
  const zug = interpolate(f, [u.f, u.f + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const gluehen = interpolate(f, [u.f + 8, u.f + 40], [1, 0.35], clamp);
  const aus = 1 - rampe(f, [bis - 14, bis]);
  const [x, y, w, h] = u.r.map((v) => v * k);
  return (
    <div style={{ position: "absolute", left: x, top: y + h - dick * 0.2, width: w * zug, height: dick, borderRadius: dick, opacity: dk(aus),
      background: C.goldHi, boxShadow: `0 0 ${(8 * gluehen + 2).toFixed(2)}px ${rgba(RGB.goldHi, 0.75 * gluehen)}` }} />
  );
};

const Ring: React.FC<{ u: Ueber; f: number; k: number; bis: number; dick: number; pad: number }> = ({ u, f, k, bis, dick, pad }) => {
  const ende = Math.min(bis, u.f + 170);
  if (f < u.f - 1 || f > ende) return null;
  const zug = interpolate(f, [u.f, u.f + 18], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const puls = interpolate(f, [u.f + 16, u.f + 44], [0, 1], clamp);
  const ruhe = interpolate(f, [u.f + 30, u.f + 80], [1, 0.55], clamp) * (1 - rampe(f, [ende - 24, ende]));
  const [x0, y0, w0, h0] = u.r.map((v) => v * k);
  const x = x0 - pad, y = y0 - pad, w = w0 + 2 * pad, h = h0 + 2 * pad, r = Math.min(10, h / 2);
  return (
    <svg style={{ position: "absolute", left: x - 30, top: y - 30, width: w + 60, height: h + 60, overflow: "visible" }}>
      <rect x={30} y={30} width={w} height={h} rx={r} fill="none" stroke={rgba(RGB.goldHi, ruhe)} strokeWidth={dick} pathLength={1}
        strokeDasharray={`${zug.toFixed(4)} 2`} style={{ filter: `drop-shadow(0 0 ${(6 * ruhe).toFixed(2)}px ${rgba(RGB.gold, 0.8 * ruhe)})` }} />
      {puls > 0 && puls < 1 && (
        <rect x={30 - 14 * puls} y={30 - 14 * puls} width={w + 28 * puls} height={h + 28 * puls} rx={r + 14 * puls} fill="none"
          stroke={rgba(RGB.goldHi, 0.5 * (1 - puls))} strokeWidth={dick * 0.7} />
      )}
    </svg>
  );
};

const Markierungen: React.FC<{ q: Q; f: number; w: number; liste: Ansicht[] }> = ({ q, f, w, liste }) => {
  const k = kCss(q, w), v = q === "P", keys = liste.map((a) => a.key);
  return (
    <>
      {UEBER(q).filter((u) => keys.includes(u.ansicht)).map((u, i) => {
        const bis = ansichtBis(q, u.ansicht);
        if (u.art === "glanz") return <Glanz key={i} u={u} f={f} k={k} />;
        if (u.art === "strich") return <Strich key={i} u={u} f={f} k={k} bis={bis} dick={v ? 4 : 2.6} />;
        if (u.art === "ring") return <Ring key={i} u={u} f={f} k={k} bis={bis} dick={v ? 3.6 : 2.6} pad={(v ? 4 : 6) * k} />;
        return null;
      })}
    </>
  );
};

// ---------------- Seitenfenster ----------------
// 16:9: Fenster mit feiner Goldkante und weichem Schatten; die Kamera bewegt nur das ganze Fenster.
// 9:16 (voll): Handybildschirm randlos über die ganze Breite, ohne Rahmen und Schatten.
// oben: so viele CSS-Pixel der Aufnahme oben abschneiden (Fenster wird entsprechend niedriger, Inhalt samt Markierungen rückt mit)
const Fenster: React.FC<{ q: Q; box: { x: number; y: number; w: number; oben?: number }; op: number; skala: number; voll?: boolean; children: React.ReactNode }> = ({ q, box, op, skala, voll, children }) => {
  const schnitt = (box.oben ?? 0) * kCss(q, box.w), h = hoehe(q, box.w) - schnitt, r = voll ? 0 : 10;
  return (
    <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: h, opacity: dk(op), transform: `scale(${skala.toFixed(6)})`, transformOrigin: "50% 50%" }}>
      {!voll && <div style={{ position: "absolute", inset: 0, borderRadius: r, boxShadow: "0 40px 110px rgba(0,0,0,0.62), 0 8px 24px rgba(0,0,0,0.4)" }} />}
      <div style={{ position: "absolute", inset: 0, borderRadius: r, overflow: "hidden", background: C.ink }}>
        <div style={{ position: "absolute", left: 0, top: -schnitt, width: box.w, height: h + schnitt }}>{children}</div>
      </div>
      {!voll && <div style={{ position: "absolute", inset: 0, borderRadius: r, boxShadow: `inset 0 0 0 1px ${rgba(RGB.gold, 0.22)}` }} />}
    </div>
  );
};

// Kameradrift Fenster A (nur 16:9): ein einziger langsamer Zug (Skala ≤ 1,2 %), beginnt nach der Übergabe des Woks
const driftA = (f: number) => {
  const u = interpolate(f, [T.wokAus[1], T.fensterAus[1]], [0, 1], clamp);
  return 1 + 0.012 * (0.5 - 0.5 * Math.cos(Math.PI * u));
};

// ---------------- Vorspann: die Wok-Zeichnung der Seite, groß; Gas zündet, Schwünge, Wurf auf „Zeit.“ ----------------
// Die Zeichnung bringt ihre CSS-Animationen mit (6-s-Schleife). CSS-Animationen startet Chrome beim Rendern mit Remotion
// neu (Stand nach dem Setzen war im nächsten Bild wieder 0), daher werden sie einmalig in Web-Animationen übersetzt
// (gleiche Keyframes, Kurven und Verzögerungen) und die CSS-Animationen abgeschaltet. Pro Frame steht jede Animation auf
// der Phase der Filmzeit – dieselbe Phase hat die Startseiten-Aufnahme (wokT0), daher passt die Übergabe bildgenau.
const ZUEND = ".wfl, .wkt, .wgl, .wkg";
const PROPS = ["transform", "opacity"];
const alsWebAnimationen = (svg: SVGSVGElement): Animation[] => {
  const kf: Record<string, CSSKeyframesRule> = {};
  const lies = (rules: CSSRuleList) => {
    for (const r of Array.from(rules)) {
      if (r instanceof CSSKeyframesRule) kf[r.name] = r;
      else if (r instanceof CSSMediaRule) lies(r.cssRules);
    }
  };
  lies((svg.querySelector("style") as HTMLStyleElement).sheet!.cssRules);
  const liste: Animation[] = [];
  const ziele = Array.from(svg.querySelectorAll<SVGElement>("*")).map((el) => ({ el, cs: getComputedStyle(el) })).filter((x) => x.cs.animationName && x.cs.animationName !== "none");
  for (const { el, cs } of ziele) {
    const regel = kf[cs.animationName];
    if (!regel) continue;
    const kurve = cs.animationTimingFunction, verz = parseFloat(cs.animationDelay) * (cs.animationDelay.endsWith("ms") ? 1 : 1000);
    const frames: Keyframe[] = [];
    for (const k of Array.from(regel.cssRules) as CSSKeyframeRule[]) {
      const werte: Record<string, string> = {};
      for (const p of PROPS) { const v = k.style.getPropertyValue(p); if (v) werte[p] = v; }
      for (const o of k.keyText.split(",")) {
        const t = o.trim(), off = t === "from" ? 0 : t === "to" ? 1 : parseFloat(t) / 100;
        frames.push({ offset: off, easing: kurve, ...werte });
      }
    }
    frames.sort((a, b) => (a.offset as number) - (b.offset as number));
    liste.push(el.animate(frames, { duration: 6000, iterations: Infinity, delay: verz, fill: "both", easing: "linear" }));
  }
  for (const { el } of ziele) el.style.animation = "none";
  return liste;
};
const WokSzene: React.FC<{ fmt: Fmt; f: number }> = ({ fmt, f }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const anim = React.useRef<Animation[] | null>(null);
  const L = LAY[fmt], q = qVon(fmt);
  const t = Math.max(f, T.zuenden) / FPS; // vor dem Zünden steht die Schleife in der Ruhephase
  const phase = (((t - WOK_OFF) % 6) + 6) % 6;
  const zuend = interpolate(f, [T.zuenden - 1, T.zuenden + 4, T.zuenden + 7, T.zuenden + 12], [0, 0.85, 0.7, 1], clamp);
  React.useLayoutEffect(() => {
    const svg = ref.current?.querySelector("svg");
    if (!svg) return;
    if (!anim.current) {
      anim.current = alsWebAnimationen(svg);
      // Flammen und Glut in Hüllen legen, damit die Zündung ihre Deckkraft steuern kann (Web-Animationen bleiben am Element)
      svg.querySelectorAll(ZUEND).forEach((n) => {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "zuend");
        n.parentNode!.insertBefore(g, n);
        g.appendChild(n);
      });
    }
    for (const a of anim.current) { a.pause(); a.currentTime = 6000 + phase * 1000; }
    svg.querySelectorAll<SVGGElement>("g.zuend").forEach((g) => g.setAttribute("opacity", zuend.toFixed(4)));
  });
  if (f > T.wokAus[1] + 1) return null;
  // Lage der viewBox: Start (leichtes Heranfahren an die Flamme), dann Rückfahrt genau auf die Zeichnung der Startseite
  const z0 = 1 + 0.035 * kamera(interpolate(f, [0, T.rueckfahrt[0]], [0, 1], clamp));
  const P = { x: L.wok.x + 620 * L.wok.s, y: L.wok.y + 560 * L.wok.s };
  const a0 = { x: P.x - (P.x - L.wok.x) * z0, y: P.y - (P.y - L.wok.y) * z0, s: L.wok.s * z0 };
  const r = ziel(q), kk = kCss(q, L.A.w);
  const a1 = { x: L.A.x + r[0] * kk, y: L.A.y + r[1] * kk, s: (r[2] * kk) / 1200 };
  const u = interpolate(f, T.rueckfahrt, [0, 1], { ...clamp, easing: kamera });
  const x = a0.x + (a1.x - a0.x) * u, y = a0.y + (a1.y - a0.y) * u, s = a0.s * Math.pow(a1.s / a0.s, u);
  const op = 1 - sinRampe(f, T.wokAus);
  const schwarz = 1 - rampe(f, [0, 14]); // Auftakt aus Schwarz
  const bloom = interpolate(f, [T.zuenden - 1, T.zuenden + 3, T.zuenden + 40], [0, 1, 0], { ...clamp, easing: Easing.out(Easing.quad) });
  const bx = x + 620 * s, by = y + 690 * s;
  // Während der Rückfahrt die Ränder der Zeichnung weich auslaufen lassen (sonst wandert ein dunkler Kasten über die Seite);
  // am Ziel ist der Rand wieder scharf und deckt sich mit dem Kasten der Startseite.
  const feder = 150 * Math.sin(Math.PI * u);
  const maske = feder > 0.5
    ? `linear-gradient(to right, transparent, #000 ${feder}px, #000 ${1200 - feder}px, transparent), linear-gradient(to bottom, transparent, #000 ${feder}px, #000 ${900 - feder}px, transparent)`
    : undefined;
  return (
    <AbsoluteFill style={{ opacity: dk(op) }}>
      {/* Tinte hinter der Zeichnung, bis das Seitenfenster steht (sonst zeichnet sich der Rand der viewBox ab) */}
      <AbsoluteFill style={{ background: C.ink, opacity: dk(1 - sinRampe(f, [T.rueckfahrt[0], T.rueckfahrt[0] + 30])) }} />
      <div ref={ref} style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 900, transformOrigin: "0 0", transform: `translate(${x.toFixed(3)}px, ${y.toFixed(3)}px) scale(${s.toFixed(6)})`, maskImage: maske, maskComposite: "intersect" }}
        dangerouslySetInnerHTML={{ __html: WOK_SVG }} />
      {/* Zündung: kurzer warmer Lichtstoß über dem Brenner */}
      <div style={{ position: "absolute", left: bx - 520 * s, top: by - 420 * s, width: 1040 * s, height: 640 * s, opacity: dk(bloom * 0.9), mixBlendMode: "screen",
        background: "radial-gradient(ellipse 50% 50% at 50% 70%, rgba(255,190,90,0.55) 0%, rgba(255,120,30,0.18) 45%, rgba(255,120,30,0) 72%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: dk(schwarz) }} />
    </AbsoluteFill>
  );
};

// ---------------- Merksatz „Würzig. Warm. Willkommen.“ – drei Goldwörter, jedes auf seinen Wortbeginn (Rahmentrommel) ----------------
const MERK = ["Würzig.", "Warm.", "Willkommen."];
const Raute: React.FC<{ w: number; zug: number; op: number }> = ({ w, zug, op }) => (
  <svg viewBox="0 0 400 24" width={w} height={(w * 24) / 400} style={{ display: "block", color: C.gold, opacity: dk(op), clipPath: `inset(0 ${(50 * (1 - zug)).toFixed(3)}% 0 ${(50 * (1 - zug)).toFixed(3)}%)` }}
    dangerouslySetInnerHTML={{ __html: RAUTE }} />
);
const Merksatz: React.FC<{ fmt: Fmt; f: number }> = ({ fmt, f }) => {
  if (f < T.fensterAus[0] || f > T.merksatzAus[1] + 1) return null;
  const v = fmt === "916", aus = 1 - sinRampe(f, T.merksatzAus);
  const gr = v ? 136 : 104;
  const t0 = T.merksatz[0];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: v ? 40 : 34, paddingBottom: v ? 260 : 60, opacity: dk(aus) }}>
      <div style={{ display: "flex", flexDirection: v ? "column" : "row", alignItems: "center", gap: v ? 6 : 72 }}>
        {MERK.map((m, n) => {
          const t = T.merksatz[n];
          const da = interpolate(f, [t - 8, t - 1], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
          const sitz = interpolate(f, [t - 8, t], [1.07, 1], { ...clamp, easing: Easing.in(Easing.quad) }); // setzt auf wie ein Schlag
          const glanz = interpolate(f, [t, t + 40], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
          return (
            <div key={m} style={{ opacity: dk(da), transform: `scale(${sitz.toFixed(5)})`, filter: "drop-shadow(0 3px 2px rgba(0,0,0,0.7))" }}>
              <span style={{ display: "block", fontFamily: "Playfair Display", fontWeight: 600, fontSize: gr, lineHeight: 1.12, color: "transparent",
                backgroundImage: `linear-gradient(100deg, rgba(255,240,205,0) 40%, rgba(255,244,214,0.9) 50%, rgba(255,240,205,0) 60%), ${GOLDTEXT}`,
                backgroundSize: "320% 100%, 100% 100%", backgroundPosition: `${(100 - 100 * glanz).toFixed(3)}% 0, 0 0`, WebkitBackgroundClip: "text", backgroundClip: "text" }}>{m}</span>
            </div>
          );
        })}
      </div>
      <Raute w={v ? 520 : 440} zug={interpolate(f, [t0, t0 + 50], [0, 1], { ...clamp, easing: kamera })} op={rampe(f, [t0 - 6, t0 + 6])} />
    </AbsoluteFill>
  );
};

// ---------------- Schlussbild: Marke, Knopf „Tisch reservieren“ (Lichtring auf „Wir freuen uns auf Sie“), Instagram ----------------
const Marke: React.FC<{ fmt: Fmt; f: number }> = ({ fmt, f }) => {
  if (f < T.markeEin[0] - 1) return null;
  const v = fmt === "916";
  const ein = (a: number, d = 30) => sinRampe(f, [a, a + d]);
  const hebe = (a: number) => (1 - ein(a)) * 12;
  const m = T.markeEin[0], kn = T.knopf;
  const knEin = m + 50;
  const glanz = interpolate(f, [m + 4, m + 60], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const ring = interpolate(f, [kn - 4, kn + 22], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const puls = interpolate(f, [kn + 20, kn + 56], [0, 1], clamp);
  const leuchten = interpolate(f, [kn - 4, kn + 22, kn + 90], [0, 1, 0.6], clamp);
  const gr = v ? { mono: 56, marke: 64, tag: 27, knW: 520, knH: 96, knS: 34, insta: 25, gap: 14 } : { mono: 64, marke: 58, tag: 23, knW: 360, knH: 70, knS: 25, insta: 20, gap: 14 };
  const box: React.CSSProperties = v
    ? { position: "absolute", left: 0, width: 1080, top: 1254, display: "flex", flexDirection: "column", alignItems: "center", gap: gr.gap }
    : { position: "absolute", left: 1290, width: 540, top: 232, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: gr.gap };
  return (
    <div style={box}>
      <svg viewBox="0 0 120 136" width={gr.mono} height={(gr.mono * 136) / 120} style={{ color: C.gold, opacity: dk(ein(m)), transform: `translateY(${hebe(m).toFixed(2)}px)` }} dangerouslySetInnerHTML={{ __html: MONOGRAMM }} />
      <span style={{ fontFamily: "Playfair Display", fontWeight: 600, fontSize: gr.marke, letterSpacing: "0.08em", lineHeight: 1.1, whiteSpace: "nowrap", color: "transparent",
        backgroundImage: `linear-gradient(100deg, rgba(255,240,205,0) 40%, rgba(255,244,214,0.85) 50%, rgba(255,240,205,0) 60%), ${GOLDTEXT}`,
        backgroundSize: "320% 100%, 100% 100%", backgroundPosition: `${(100 - 100 * glanz).toFixed(3)}% 0, 0 0`, WebkitBackgroundClip: "text", backgroundClip: "text",
        opacity: dk(ein(m + 4)), transform: `translateY(${hebe(m + 4).toFixed(2)}px)` }}>UYGHUR HAUS</span>
      <span style={{ fontFamily: "Mulish", fontWeight: 400, fontSize: gr.tag, color: C.creamDim, letterSpacing: "0.02em", opacity: dk(ein(m + 12)), transform: `translateY(${hebe(m + 12).toFixed(2)}px)` }}>
        Uigurisches Restaurant · Göppingen
      </span>
      <div style={{ margin: v ? "4px 0 6px" : "6px 0 8px" }}>
        <Raute w={v ? 360 : 300} zug={interpolate(f, [m + 14, m + 54], [0, 1], { ...clamp, easing: kamera })} op={ein(m + 14, 16)} />
      </div>
      <div style={{ position: "relative", width: gr.knW, height: gr.knH, opacity: dk(ein(knEin)), transform: `translateY(${hebe(knEin).toFixed(2)}px)` }}>
        <div style={{ position: "absolute", inset: 0, background: C.gold, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 ${(26 * leuchten).toFixed(2)}px ${rgba(RGB.goldHi, 0.55 * leuchten)}` }}>
          <span style={{ fontFamily: "Mulish", fontWeight: 700, fontSize: gr.knS, letterSpacing: "0.04em", color: C.ink }}>Tisch reservieren</span>
        </div>
        <svg style={{ position: "absolute", left: -12, top: -12, width: gr.knW + 24, height: gr.knH + 24, overflow: "visible" }}>
          <rect x={1.5} y={1.5} width={gr.knW + 21} height={gr.knH + 21} rx={6} fill="none" stroke={rgba(RGB.goldHi, 0.95)} strokeWidth={2.5} pathLength={1}
            strokeDasharray={`${ring.toFixed(4)} 2`} opacity={ring > 0 ? 1 : 0} />
          {puls > 0 && puls < 1 && <rect x={1.5 - 16 * puls} y={1.5 - 16 * puls} width={gr.knW + 21 + 32 * puls} height={gr.knH + 21 + 32 * puls} rx={6 + 16 * puls} fill="none" stroke={rgba(RGB.goldHi, 0.5 * (1 - puls))} strokeWidth={2} />}
        </svg>
      </div>
      <span style={{ fontFamily: "Mulish", fontWeight: 400, fontSize: gr.insta, color: C.creamDim, letterSpacing: "0.03em", marginTop: v ? 2 : 4, opacity: dk(ein(knEin + 10)) }}>
        Instagram <span style={{ color: C.gold }}>@uyghurhaus</span>
      </span>
    </div>
  );
};

// ---------------- Untertitel: wortgleich, mitlesend ----------------
const Untertitel: React.FC<{ fmt: Fmt; f: number }> = ({ fmt, f }) => {
  const L = LAY[fmt], liste = TAFELN[fmt];
  return (
    <>
      {liste.map((t: Tafel, n) => {
        const ein = ws(t.a) - 12;
        const naechst = liste[n + 1] ? ws(liste[n + 1].a) - 12 : 1e9;
        const aus = Math.min(we(t.b) + 24, naechst);
        if (f < ein - 1 || f > aus + 1) return null;
        const op = interpolate(f, [ein, ein + 12, aus - 12, aus], [0, 1, 1, 0], clamp);
        return (
          <div key={n} style={{ position: "absolute", left: (L.W - L.band.maxW) / 2, top: L.band.top, width: L.band.maxW, height: L.band.bottom - L.band.top,
            display: "flex", alignItems: "center", justifyContent: "center", opacity: dk(op), textShadow: "0 2px 14px rgba(0,0,0,0.8)" }}>
            <p style={{ margin: 0, textAlign: "center", fontFamily: "Mulish", fontWeight: 400, fontSize: L.band.size, lineHeight: 1.28 }}>
              {W.slice(t.a, t.b + 1).map((w, k) => {
                const i = t.a + k, s = ws(i), e = we(i);
                // gelesene Wörter bleiben in Gold (Akzentfarbe der Seite), das gesprochene leuchtet voll
                const gelesen = glatt(s - 2, s + 3, f);
                const jetzt = gelesen * (1 - glatt(e, e + 9, f));
                const c = mischen(RGB.cream, RGB.gold, gelesen);
                return <React.Fragment key={i}>{t.br === i && <br />}<span style={{ color: rgba(c, 0.72 + 0.13 * gelesen + 0.15 * jetzt) }}>{w.w}</span>{k < t.b - t.a && t.br !== i + 1 ? " " : ""}</React.Fragment>;
              })}
            </p>
          </div>
        );
      })}
    </>
  );
};

// „Erste Version“ in jedem Bild
const Label: React.FC<{ fmt: Fmt; f: number }> = ({ fmt, f }) => {
  const l = LAY[fmt].label;
  // Kennzeichnung wie im Konzept: im ganzen Film „Erste Version“, im Schlussbild mit Absender (Wechsel während des Merksatzes)
  const r = sinRampe(f, T.fensterAus);
  const lagen: [number, number, string][] = [[l.top, 1 - r, "Erste Version"], [l.topEnde ?? l.top, r, "Erste Version · Vorschau von Seitenkapitän"]];
  return (
    <>
      {lagen.filter(([, op]) => op > 0.001).map(([top, op, text]) => (
        <div key={text} style={{ position: "absolute", right: l.right, top, opacity: dk(op), fontFamily: "Mulish", fontWeight: 700, fontSize: l.size, letterSpacing: "0.2em",
          textTransform: "uppercase", color: rgba(RGB.gold, 0.85), textShadow: "0 1px 6px rgba(0,0,0,0.85)", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "inline-block", width: l.size * 1.6, height: 1.5, background: rgba(RGB.gold, 0.7) }} />{text}
        </div>
      ))}
    </>
  );
};

// ================= Film =================
export const UyghurHaus: React.FC<{ fmt: Fmt }> = ({ fmt }) => {
  useSchriften();
  const f = useCurrentFrame();
  const L = LAY[fmt], q = qVon(fmt), voll = fmt === "916";
  const liste = ANSICHTEN(q);
  const listeA = liste.filter((a) => a.key !== "besuch"), listeB = liste.filter((a) => a.key === "besuch");
  const opA = sinRampe(f, T.fensterAEin) * (1 - sinRampe(f, T.fensterAus));
  const opB = sinRampe(f, T.fensterBEin);
  const uB = interpolate(f, [T.fensterBEin[0], DAUER], [0, 1], clamp);
  const skB = 1 + 0.01 * (0.5 - 0.5 * Math.cos(Math.PI * uB));
  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      <Grund />
      {f >= T.startEin - 1 && f <= T.fensterAus[1] + 1 && (
        <Fenster q={q} box={L.A} op={opA} skala={voll ? 1 : driftA(f)} voll={voll}>
          <Ansichten f={f} w={L.A.w} liste={listeA} />
          <Markierungen q={q} f={f} w={L.A.w} liste={listeA} />
        </Fenster>
      )}
      <WokSzene fmt={fmt} f={f} />
      <Merksatz fmt={fmt} f={f} />
      {f >= T.fensterBEin[0] - 1 && (
        <>
          <Fenster q={q} box={L.B} op={opB} skala={skB}>
            <Ansichten f={f} w={L.B.w} liste={listeB} />
            <Markierungen q={q} f={f} w={L.B.w} liste={listeB} />
          </Fenster>
          <Marke fmt={fmt} f={f} />
        </>
      )}
      <Untertitel fmt={fmt} f={f} />
      <Label fmt={fmt} f={f} />
    </AbsoluteFill>
  );
};

export const UyghurHausKompositionen: React.FC = () => (
  <>
    <Composition id="UyghurHaus169" component={UyghurHaus} durationInFrames={DAUER} fps={FPS} width={1920} height={1080} defaultProps={{ fmt: "169" as Fmt }} />
    <Composition id="UyghurHaus916" component={UyghurHaus} durationInFrames={DAUER} fps={FPS} width={1080} height={1920} defaultProps={{ fmt: "916" as Fmt }} />
  </>
);
