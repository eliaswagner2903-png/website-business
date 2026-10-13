# Promo film playbook (website promo for a customer or for ourselves)

Distilled from the Seitenkapitän film "Nachtfahrt" (A-110 / A-112, 11.–13.10.2026), approved by Elias on 13.10. 17:11
("spitze Version"). Use it for every promo film of a site. It is NOT the quick customer walkthrough; that one is
`/mnt/project-files/werkzeuge/video/README.md` (screen recording, ~1 min, no voice). This one is the cinematic promo with
voice, music, sound effects and animation. Reference implementation: `werkzeuge/video-film/` (Remotion), media in
`/mnt/project-files/seitenkapitaen/video/` (briefs 00–07) and `/mnt/project-files/videos/`.

## 0. Elias' standing rules (all videos)
- Show the finished film FIRST on a private review page (both formats), embed in the site only after his approval.
- Answer in German; keep the thread checklist live (one step in progress, update the moment a step ends).
- Everything must be intentional: pacing, loudness, speed, stress and cuts each have a stated reason.
- NOTHING may flicker or stutter. Frame-exact capture, automated check before delivery.
- Voice must not sound like an AI voice (human, rough, breaths); voice, pacing and music must fit together incl. loudness.
- The real site is never cropped or zoomed so it looks cut off. 16:9 (1920x1080) and 9:16 (1080x1920), 60 fps.
- No prices in the film or on the site (fixed price comes out of the conversation, Elias 13.10.). No ranking or AI-recommendation
  promises. Sample sites always labelled "Musterseite". One CTA: "Projekt besprechen".
- Facts only from the site content (`seite.json`) or the customer. Never invent figures, clients, quotes.
- Paid generation (ElevenLabs, Higgsfield) only with his OK; for the Seitenkapitän film credits were allowed. Never repeat a
  generation call to retry (it charges twice).
- Real customer sites are never published as an artifact without Elias' OK; fictional/own sites are fine (private).
- Never delete artifacts, never delete or replace existing files without a list and approval.

## 1. Message craft (what the marketing team did, and why)
- Start from the customer's real worry ("expensive, looks like a template, slow on the phone, nobody cares afterwards")
  and let every line answer one part of it.
- Hook in the first 3 s: one striking image plus one open sentence (burning sea chart, "Erst der Kurs. Dann die Fahrt.").
- Name the target group aloud so they recognise themselves (practices, workshops, restaurants).
- Show proof instead of claims: the real site, real sample pages; quality shown through strict, specific checks
  (four ticks: speed, accessibility, privacy, security) so the viewer concludes "high standards" himself; never say it.
- A memorable triad with the SAME initial letter ("Gebaut. Geprüft. Gepflegt."), stamped word by word.
- Partnership in the foreground at the end: stay aboard after launch; hosting, maintenance, care, any change, "and much
  more", monthly and optional, no amount named. "No order that ends. A partnership for the whole voyage."
- Smallest possible hurdle as the close: "Ihr Kurs beginnt mit einem Gespräch." (not "buy now").
- Theme (here nautical) is atmosphere, not costume: no pirates, skulls, "Ahoi". Calm, premium, 50-60 s.
- Captions = exactly the spoken words, read-along: the spoken word lights up, words already read STAY in the contrast
  colour of the site (brass), unread ones stay dim. Serves viewers without sound.

## 2. Team and order of work (each role does its normal job; all read the team standard first)
1. Marketing brief (audience, core message, concept options, hook, CTA, no-gos) -> `01-marketing-brief.md`
2. Script (beats, word budget ~65-75 German words per 30 s) -> `02-skript.md`; brand guardian check -> `02b-markenpruefung.md`
3. Director (`03-regie.md`), sound plan (`04-ton.md`), casting (`05-casting.md`)
4. Dramaturgy table BEFORE rendering (`06-dramaturgie.md`): voice direction per line, cut rhythm per beat, music levels
   per section, pause table with reasons, actual timeline.
5. Voice -> cut (timeline fixed) -> SFX -> captures -> animation/cut -> music LAST -> mix -> render -> checks -> review page.
   Music is generated last against the locked picture, because length changes would invalidate it.
Use cheap models for routine work, Opus for the thinking parts; Elias sometimes orders "everything on Opus" per project.

## 3. Voice (ElevenLabs, full connector; load the deferred tools with ToolSearch)
- Casting: describe the voice in Elias' words, `creative_design_voice` (3 previews, quality of own design was preferred
  by Elias twice) plus 3-4 library voices (`creative_list_voices`, German, filters deep/raspy). Same test text for all,
  published on a listening page; Elias picks by ear. Save the pick (`creative_save_designed_voice`).
- Take generation: `eleven_v3`, whole text in one go with audio tags per line ([driven], [warm, sincere], [emphatic]...),
  4 takes (~860 credits each for 60 s). Pick by pause structure and transcript (scribe), not by guess. Elias: first voice
  was monotone and boring -> deeper, smoky, more drive, tags for energy.
- Cut: shorten pauses, NEVER speed up speech. Keep one deliberate breath at rhetorical points. Light cabin reverb, -16 LUFS.
- Word timings: ElevenLabs forced alignment is up to 0.35 s off behind v3 tags. Re-detect word onsets from the audio
  (`ton/wortbeginn.py`) and check against the cut (within 5 ms). Word lists drive captions, picture and sound.
- A retake of a single line is fine (round 1 "Erst der Kurs" was heard as "Erster Kurs"): check the transcript for misheard
  words in every take.

## 4. One source of truth for time
`ton/zeitleiste2.py` derives every picture time and event frame from the word list into
`src/nachtfahrt/zeitleiste2.json`; the film code and the sound script both read it. Change the words -> rerun the chain.

## 5. Sound effects (and why Elias felt an offset in version 1)
- Generate varied effects (sea, wood, brass, stamp, bell, harbour); beds as long `duration_seconds` + `loop`; never one
  whoosh twice. Measure each file (`messung.json`: lufs, peak_s, silence at start).
- WRONG (v1): start the effect on the word. Generated files peak 0.3-1.5 s later, so it feels late.
- RIGHT (v2): put the loudest point (2 ms smoothed) of each effect exactly on the picture event frame (tab click, tick,
  stamp, chart tear, needle rests). Beds fade softly. Verify with `ton/synchronpruefung.py`: tolerance 1 frame; v2 was
  31/31 within one frame, max 5.8 ms.
- Remotion's AAC carries 2048 samples of encoder priming without an edit list -> audio 42.7 ms late. Fix losslessly after
  every render (`-itsoffset -0.0426667` remux), re-check offset 0.00 ms (details in README, "Runde 2" step 6).

## 6. Music
`eleven_music_v2_5`, instrumental, `duration_seconds` = film length, 2 takes (900 credits each). Brief: BPM ~96,
premium cinematic, tense build, clear hits on key words (swell on the hook, return after the pause, "Partnerschaft",
final hit on the CTA). Cut on beats, duck under the voice (sidechain), dip 3 kHz, -6 dB under dense overlays, final
-14 LUFS / -1 dBTP, LRA ~3.5. No stock "elevator music". Listen by ear before delivery; the pipeline only measures.

## 7. Capture of the site (frame-exact, never shard)
- ONE browser, fake clock (Playwright), all document animations paused and advanced 1/60 s per frame, CDP screenshots.
  Scroll-bound `view()` animations replaced by fixed values per frame; sub-pixel scroll via translate3d.
- Lock rAF effects (hero light) and set them per frame with the same formula. Serve over local HTTP, never file://.
- Per take: mp4 + marks.json + rects.json + checks; marks = start of each motion/hold; every hold +1 s reserve.
- Re-capture whenever site text changes (after prices were removed the six takes were redone; frame counts stayed equal).
- Flicker check (`aufnahme/pruefe4.py`): brightness flicker, diff jumps, duplicate frames, one-frame outliers must be 0
  outside planned jumps/clicks.

## 8. Cut and animation (Remotion)
- Site shown as a "window" on dark blurred cabin light; camera moves the whole window (<= 2 % scale, <= 0.4 deg tilt).
- Captures through `<Freeze frame={src}><OffthreadVideo/></Freeze>` so every film frame maps to one capture frame; tab
  clicks land on the spoken word.
- Keep every layer mounted and every filter set from frame 0, change only opacity; switching a filter/layer later makes
  Chrome re-rasterise -> visible flicker. x264 keyframe every 250 frames also showed: render with `NACHTFAHRT=1`
  (keyint 3600), `--color-space=bt709`, crf 16, preset slow, then `+faststart`.
- Overlays that worked: ticks that draw in on their word; triad stamped word by word; services line appearing item by item;
  glow ring closing around the CTA button; "Musterseite" label in every sample-page frame.
- Render with the headless_shell path (`/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`);
  concurrency not above CPU count.

## 9. Checks before showing
1. Flicker (`aufnahme/film-pruefung.py film.mp4 <planned cut frames>`): 0 unplanned jumps; check every flagged spot by eye.
2. Sync table (event frame vs peak) and global audio offset on the rendered mp4.
3. Loudness -14 LUFS / -1 dBTP; control stills at the key frames (look at them; text correct, no prices, labels present).
4. Honest weak-point list for Elias (never claim "listened" if only measured).

## 10. Delivery
- Review copies under 15 MB (artifact limit 16 MB/file): 2-pass x264 1750k + AAC 160k for 60 s at 1080p60. Private
  artifact page with both formats + posters (the app preview does not play mp4). Masters (~23 MB each) to
  `/mnt/project-files/seitenkapitaen/video/film/`. Large media stay out of git.
- Reply to Elias in German: link first, what is new, honest weak points. Then wait for his approval.
- After approval: put `film.mp4/film.webm/poster.webp/untertitel.vtt` in `public/medien/vorstellung/`, `node bauen.mjs`
  (see `kunden/elias-studio/VORSTELLUNG.md`), run tests, PR on the feature branch, Elias merges.

## 11. Cost reference (Seitenkapitän, ElevenLabs credits)
Voice casting previews ~1,000; one full voice take ~860 (x4); SFX ~3,500 incl. long beds; music 900 per take (x2);
round 1 total ~11,500, round 2 ~5,200 (voice 3,400 + music 1,800).

## 12. Pitfalls that cost time
- /mnt/project-files can drop with I/O errors (rclone): keep a working copy in scratchpad, copy back later.
- Plain chromium cannot render Remotion; word lists with audio-tag pseudo-words must be filtered.
- Repo files (`seite.json`) and tests contain prices by default: update tests when Elias removes them.
- A re-take or new text changes every time: always regenerate timeline -> sound -> render, never patch single frames.
