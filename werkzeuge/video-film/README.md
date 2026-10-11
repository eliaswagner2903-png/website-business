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
2. Ich baue Websites mit Charakter. Schnell auf dem Handy. Klar im Aufbau. Und gefunden – bei Google und bei KI.
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
