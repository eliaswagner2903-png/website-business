// Eigener Einstieg nur für die Seekarte: rendert ohne die Aufnahmen der alten Filme (public/desk3 usw.).
// npx remotion still src/index-seekarte.ts Seekarte169 --frame=150 ...
import { registerRoot } from "remotion";
import { SeekarteKompositionen } from "./Seekarte";

registerRoot(SeekarteKompositionen);
