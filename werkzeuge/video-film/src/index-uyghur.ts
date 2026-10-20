// Eigener Einstieg für den Werbefilm UYGHUR HAUS (A-118): rendert ohne die Aufnahmen der anderen Filme.
// npx remotion render src/index-uyghur.ts UyghurHaus169 out.mp4 ...
import { registerRoot } from "remotion";
import { UyghurHausKompositionen } from "./UyghurHaus";

registerRoot(UyghurHausKompositionen);
