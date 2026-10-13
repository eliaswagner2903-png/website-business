// Standbilder einzelner Frames der „Nachtfahrt“ (ein Bundle, ein Browser): node aufnahme/stills.mjs <Komposition> <ausgabeOrdner> f1 f2 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
const [komp, aus, ...frames] = process.argv.slice(2);
const serveUrl = process.env.BUNDLE || await bundle({ entryPoint: path.resolve("src/index-nachtfahrt.ts") });
const browser = await openBrowser("chrome", { browserExecutable: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell" });
const composition = await selectComposition({ serveUrl, id: komp, puppeteerInstance: browser });
for (const f of frames) {
  const out = path.join(aus, `${komp}-${String(f).padStart(4, "0")}.png`);
  await renderStill({ composition, serveUrl, frame: Number(f), output: out, puppeteerInstance: browser, imageFormat: "png" });
  console.log(out);
}
await browser.close({ silent: true });
