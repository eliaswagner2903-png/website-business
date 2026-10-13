// Eigener Einstieg für „Nachtfahrt“: rendert ohne die Aufnahmen der alten Filme (public/desk3 usw.).
// npx remotion render src/index-nachtfahrt.ts Nachtfahrt169 out.mp4 ...
import { registerRoot } from "remotion";
import { NachtfahrtKompositionen } from "./Nachtfahrt";

registerRoot(NachtfahrtKompositionen);
