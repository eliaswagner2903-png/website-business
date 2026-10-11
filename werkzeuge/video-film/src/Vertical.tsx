import React from "react";
import { AbsoluteFill, OffthreadVideo, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { FPS, TOTAL, VO } from "./Film";

// 9:16 cut for Reels / TikTok / Shorts: the finished 16:9 film, cropped to its stage and stacked with big captions.
const C = { bg: "#15130f", cream: "#efe6d6", muted: "#b9ad99", brass: "#cfae6a" };
const CROP = { x: 110, y: 0, w: 1700, h: 990 };   // drops empty side margins and the small burnt-in subtitles
const W = 1080, SC = W / CROP.w, VH = Math.round(CROP.h * SC), TOP = 560;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const s = (sec: number) => Math.round(sec * FPS);

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

const Caption: React.FC<{ f: number }> = ({ f }) => {
  for (const v of VO) {
    const end = v.at + s(v.dur);
    if (f < v.at || f > end) continue;
    const part = Math.min(v.text.length - 1, Math.floor(((f - v.at) / (end - v.at)) * v.text.length));
    const fade = interpolate(f, [v.at, v.at + 10, end - 10, end], [0, 1, 1, 0]);
    return (
      <div style={{ position: "absolute", left: 70, right: 70, top: TOP + VH + 90, textAlign: "center", opacity: fade }}>
        <span style={{ fontFamily: "Geist", fontSize: 46, lineHeight: 1.35, color: C.cream, fontWeight: 500 }}>{v.text[part]}</span>
      </div>
    );
  }
  return null;
};

export const Vertical: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  const a = spring({ frame: f - 20, fps: FPS, config: { damping: 18 } });
  const fade = Math.max(interpolate(f, [TOTAL - 40, TOTAL - 1], [0, 1], clamp), interpolate(f, [0, 20], [1, 0], clamp));
  const film = staticFile("film.mp4");
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      {/* blurred, dimmed copy fills the tall frame */}
      <AbsoluteFill style={{ filter: "blur(60px) brightness(.35) saturate(1.2)", transform: "scale(1.3)" }}>
        <OffthreadVideo src={film} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", opacity: a, transform: `translateY(${(1 - a) * 30}px)` }}>
        <p style={{ margin: 0, fontFamily: "Geist", fontSize: 30, letterSpacing: "0.3em", textTransform: "uppercase", color: C.brass, fontWeight: 600 }}>Websites für Betriebe</p>
        <p style={{ margin: "18px 0 0", fontFamily: "IS", fontSize: 80, lineHeight: 1, color: C.cream }}>
          Gebaut. <em style={{ color: C.brass }}>Gemessen.</em> Betreut.
        </p>
      </div>
      <div style={{ position: "absolute", left: 0, top: TOP, width: W, height: VH, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
        <OffthreadVideo src={film} style={{ position: "absolute", width: 1920 * SC, height: 1080 * SC, left: -CROP.x * SC, top: -CROP.y * SC }} />
      </div>
      <Caption f={f} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center", opacity: a }}>
        <span style={{ display: "inline-block", padding: "12px 28px", border: "1px solid rgba(207,174,106,.6)", borderRadius: 999, color: "#e7cc8f", fontFamily: "Geist", fontSize: 26, letterSpacing: "0.16em", textTransform: "uppercase" }}>Erste Version · Vorschau</span>
      </div>
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
    </AbsoluteFill>
  );
};
