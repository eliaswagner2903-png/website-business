import { Config } from "@remotion/cli/config";
import path from "path";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// Ensure shared lib/ imports resolve packages from this project's node_modules
// Without this, imports like `@remotion/transitions` in lib/transitions/ fail
// because webpack resolves them relative to lib/, not the project root.
Config.overrideWebpackConfig((config) => {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      modules: [
        path.resolve(__dirname, "node_modules"),
        ...(config.resolve?.modules || ["node_modules"]),
      ],
    },
  };
});

// „Nachtfahrt“: Schlüsselbilder (alle 250 F) zeigten sich als kleiner Ganzbild-Sprung im Rauschen.
// Nur mit NACHTFAHRT=1: nur ein Schlüsselbild am Anfang (+ echte Szenenwechsel), keyint 3600, andere Filme unverändert.
Config.overrideFfmpegCommand(({ args }) => {
  if (process.env.NACHTFAHRT !== "1") return args;
  const i = args.indexOf("-crf");
  if (i < 0) return args;
  return [...args.slice(0, i), "-x264-params", "keyint=3600:min-keyint=60", ...args.slice(i)];
});
