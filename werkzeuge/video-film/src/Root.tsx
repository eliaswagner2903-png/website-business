import { Composition } from "remotion";
import { Film, FPS, TOTAL } from "./Film";
import { Vertical } from "./Vertical";
import { Film2, TOTAL as TOTAL2 } from "./Film2";
import { SeekarteKompositionen } from "./Seekarte";
import { NachtfahrtKompositionen } from "./Nachtfahrt";

export const Root = () => (
  <>
    <Composition id="OQFilm" component={Film} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
    <Composition id="OQVertical" component={Vertical} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
    <Composition id="Promo" component={Film2} durationInFrames={TOTAL2} fps={60} width={1920} height={1080} defaultProps={{ vertical: false }} />
    <Composition id="PromoVertical" component={Film2} durationInFrames={TOTAL2} fps={60} width={1080} height={1920} defaultProps={{ vertical: true }} />
    <SeekarteKompositionen />
    <NachtfahrtKompositionen />
  </>
);
