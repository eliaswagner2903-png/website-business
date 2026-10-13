# OQ promo film (Remotion)

Promo video of Elias' own site (order A-109, 2026-10-11). Code only; media (voice, sound effects, rendered films)
lives in `/mnt/project-files/videos/oq-eigene-seite/` and `/mnt/project-files/werkzeuge/video/oq-film/`.

## Capture (frame-exact, never stutters)

`aufnahme/cap3.js` is the current one (cap2 with slower scrolls, round 3): `MODE=desk node cap3.js desk3` (1440x900, mouse) and
`MODE=phone node cap3.js phone3` (390x844, touch), site served on `127.0.0.1:8766` from
`kunden/elias-studio/public`. Writes one JPEG per 1/60 s plus `<out>.json` with marks.

Lessons (why v1 stuttered):
- Never shard one run over several browsers: their state drifts (lazy images, observers), interleaved frames jump.
- The hero light (`js/held.js`) is a rAF lerp; under Playwright's fake clock rAF fires unevenly. cap2 blocks held.js
  and moves the light itself per frame (same formula).
- CDP `Page.captureScreenshot` returns CSS-pixel size even with deviceScaleFactor; `clip.scale` gives more pixels but
  is ~6x slower.

`capture.js`, `capHero.js`, `capHandy.js`, `timing.js` are the v1 scripts (kept for reference).

## Edit

- `src/Film2.tsx` = round 2: ~33 s, compositions `Promo` (1920x1080) and `PromoVertical` (1080x1920), same timeline,
  captions only in free space, no zoom into the page (nothing cropped). Needs in `public/`: `desk2/`, `phone2/`,
  `desk2.json`, `phone2.json`, `n1..n5.wav` (voice), `hit.wav`, `swoosh.wav`, fonts, `arbeit-*-{desktop-lang-1440,handy-lang-600}.webp`.
- `src/Film.tsx` + `src/Vertical.tsx` = round 1 (1:38), superseded.
- Render: `npx remotion render src/index.ts Promo out/promo.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell --concurrency=4`
  (the normal chromium fails: old headless removed; concurrency must not exceed the CPU count).

## Voice and sound

ElevenLabs "Commercial Voice – Confident, Warm & Persuasive" (Axaki7xNO0GjrRrnO2GF), eleven_v4, flow GmebMb8ZWLeQmTpO2k8L:
1. Ihr Betrieb ist einzigartig. Ihre Website sollte es auch sein.
2. Ich baue Websites mit Charakter. Schnell auf dem Handy. Klar im Aufbau. Damit Kunden Sie finden: bei Google und in ChatGPT. (round 3: this sentence re-spoken and spliced in)
3. Für die Uhrmacherei. Für den Werkzeugbau. Fürs Restaurant. Fürs Studio.
4. Neu gebaut oder erneuert. Einmal bezahlt. Betreuung, wenn Sie möchten.
5. Ihre neue Website beginnt mit einem Gespräch. Ich freue mich auf Sie.

Music: Elias rejected the Pixabay stock tracks ("Fahrstuhl-Musik") and Spotify is not licensed for ads. He chose
ElevenLabs music (needs the full connector `https://api.elevenlabs.io/v1/mcp`). Mix it into the music-free renders with
ffmpeg (sidechain ducking under the voice), no re-render needed.

## Round 3 (2026-10-11)

- Captions are exactly the spoken words and read along (karaoke): `src/words3.ts` holds per-word film frames from the
  ElevenLabs transcription (eleven_scribe_v1) of voice take a; each word lights up brass while spoken.
- Showcase pages scroll slowly (420 px desktop, 520 px phone per page, sine ease); less shake, softer flips, no flashes
  except the outro.
- Sound effects: a different ElevenLabs effect per moment (`public/sfx3/`, FLAC copies in the project folder), each
  started early by its measured peak time so the peak lands on the cut. Needs `desk3/`, `phone3/`, `desk3.json`,
  `phone3.json` in `public/`.

## Seitenkapitän „Nachtfahrt“: Eröffnung Seekarte (2026-10-12)

`src/Seekarte.tsx`: compositions `Seekarte169` (1920x1080) and `Seekarte916` (1080x1920), 400 frames @ 60 fps, 0 credits.
Time marks exported as `SEEKARTE` (ignite 42, „Erst“ 47, „Kurs“ 148, „Dann“ 226, „Fahrt“ 290, chart gone 384, end 400)
plus `kajueteSkala(f)` for the cut. Spec: `seitenkapitaen/video/03-regie.md` §4.
- Textures are precomputed once with a fixed seed: `python3 seekarte/texturen.py` → `public/seekarte/` (paper+ink WebP,
  burn mask m 16 bit, gradient/fray, geometry JSON). Cabin images b1/b2 are copied there too.
- Render without the old film's capture assets via the separate entry `src/index-seekarte.ts`:
  `npx remotion still src/index-seekarte.ts Seekarte169 out.png --frame=150 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
- Flicker check: `python3 seekarte/flimmern.py clip.mp4` (frame diffs, A-B-A metric, jump list).
- Lessons: keep every layer mounted and every filter set from frame 0 (switching a filter, blend layer or SVG on later
  re-samples the whole chart → visible jump); x264 keyframes (every 250 frames) show up as small whole-frame diffs.

## Seitenkapitän „Nachtfahrt“: Werbefilm (2026-10-13)

`src/Nachtfahrt.tsx` (+ `src/nachtfahrt/daten.ts`): compositions `Nachtfahrt169` (1920x1080) and `Nachtfahrt916` (1080x1920),
3030 frames @ 60 fps (50.5 s), one timeline; opens with `Seekarte` unchanged. Separate entry `src/index-nachtfahrt.ts`.
- Needs in `public/nachtfahrt/` (git-ignored): `D-A.mp4`, `P-A.mp4` + `*.rects.json` (frame-exact captures), stills
  `{D,P}-{A,B,C}-0.webp` (frame 0 of each capture, lossless), `hafen.webp` (b4 master), `woerter.json`, `ton.wav`, `schriften/`.
- Captures are shown frame-exact via `<Freeze frame={src}><OffthreadVideo/></Freeze>`: every film frame maps to one capture
  frame (holds = repeated identical frames, tab clicks land exactly on the spoken word).
- Stills for checking: `node aufnahme/stills.mjs Nachtfahrt169 <dir> 400 760 1469`; flicker check of the finished film:
  `python3 aufnahme/film-pruefung.py film.mp4 <planned cut frames>`.
- Render with `NACHTFAHRT=1 npx remotion render src/index-nachtfahrt.ts Nachtfahrt169 out.mp4 --codec=h264 --crf=16
  --pixel-format=yuv420p --color-space=bt709 --audio-codec=aac --audio-bitrate=192k --x264-preset=slow`, then remux
  with `-movflags +faststart`. `NACHTFAHRT=1` sets a long GOP (keyint 3600, `remotion.config.ts`): the default keyframe
  every 250 frames showed as a small full-frame jump in the dark noise. Without `--color-space=bt709` the output is yuvj420p.

## Seitenkapitän „Nachtfahrt“: Runde 2 (2026-10-13)

New voice (take C, "Rauchiger Kapitän"), tighter cut, 60.0 s (3600 frames), new captures, peak-aligned sound.
Pipeline (run in `scratchpad/video`, scripts in `ton/`, comments German):
1. `stimmschnitt2.py` – cuts take C (pauses shortened per `06-dramaturgie.md` §7, speech never sped up) → `stimme2-final/`
   (`stimme.wav`, `woerter.json`). Word onsets are re-detected from the audio (`wortbeginn.py`): the forced alignment
   was up to 0.35 s off behind the v3 audio tags.
2. `zeitleiste2.py` – derives every picture time and event frame from the words → `src/nachtfahrt/zeitleiste2.json`.
   `daten.ts` and `Seekarte.tsx` read it; so does the sound. One source of truth: change words → rerun 2–4.
3. `geraeusche2.py` – SFX: the loudest point of each processed clip (2 ms smoothed) sits exactly on its event frame;
   beds fade softly → `mix2/sfx.wav` + `mix2/sfx-ereignisse.wav` (events only, for checking).
4. `endmix2.py musik2/musik2-A.mp3` – music cut on beats (two-bar jump before the end), ducking, -14 LUFS / -1 dBTP → `mix2/ton.wav`
   (copy to `public/nachtfahrt/ton2.wav`).
5. `synchronpruefung.py mix2/sfx-ereignisse.wav mix2/ton.wav film.mp4 out.json` – event peak vs frame plus the global
   offset of the rendered film's audio (12 correlation windows). Tolerance 1 frame.
6. Remotion's AAC track carries 2048 samples of encoder priming without an edit list → audio +42.7 ms late. Fix losslessly
   after the render (edit list, no re-encode), then re-run step 5 (expect offset 0.00 ms):
   `ffmpeg -i film.mp4 -itsoffset -0.0426667 -i film.mp4 -map 0:v -map 1:a -c copy -movflags +faststart fix.mp4`
7. Review copies under 15 MB for 60 s: 2-pass x264 1750k + AAC 160k (2100k gives about 17 MB).
- Captures round 2 live in `public/nachtfahrt/r2/` (`D-A.mp4`, `P-A.mp4`, rects, `{D,P}-{A,B,C}-0.webp`), same frame
  marks as round 1; P-B sits 76 css-px higher (compass needle overlay moved 190 video px, clipped to below the header).
- New overlays: check line (L6, four ticks land on their words), "Gebaut. Geprüft. Gepflegt." stamped on the words,
  service line (L8, "Hosting · Wartung · Pflege · Änderungen · und vieles mehr"). Seekarte: lamp flicker removed,
  brightness filter always set; 16:9 first subtitle moved left off the scale bar.
- Render as above with `Nachtfahrt169`/`Nachtfahrt916`, `--jpeg-quality=100`, outputs `film/nachtfahrt2-*.mp4`.
