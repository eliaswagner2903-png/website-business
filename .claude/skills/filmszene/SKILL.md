---
name: filmszene
description: Take one scene of an AI film (promo film "Traum", later customer films) from sketch to finished clip without spending credits unapproved - scene, keyframes (incl. twins) and clips from script and timeline, ChatGPT card for Elias, sketch check by the kontinuitaet agent, Higgsfield job with free cost query and generation only after Elias' explicit OK, seam check, last frame as the next start image, sound events, order log. Use on "/filmszene", "Szene 3 machen", "Skizze prüfen", "nächster Clip", when Elias sends sketches or a clip is due.
---

# One film scene: sketch → keyframe → clip (no credits without approval)

`$F` = film folder (now `kunden/elias-studio/werbefilm-traum`; a later film `kunden/<slug>/werbefilm-<name>` with the same
files), tools in `werkzeuge/video-film/traum/` (arguments: `--help`). Background: `$F/00-grundlagen.md` §3 (rules) and §5
(keyframe chain). `01-drehbuch.md` and `zeitleiste.json` are the single source for content and times – never duplicate their content.
Start where the work stands: new scene → 1, sketches from Elias → 3, approved keyframes → 4, new clip → 5.

**Fixed rule (CLAUDE.md rule 7):** paid generation (Higgsfield, ElevenLabs) only after Elias' explicit OK in this
conversation for exactly this job, asked beforehand: what, how many credits, what for. An OK passed on by an agent or an
earlier session does not count. Cost queries are free. Never send a call twice. The hook `werkzeuge/kosten-waechter.py`
asks again before every paid call; it does not replace his OK.

## 1. Scene
1. Elias names the scene or clip ("Szene 3" = the third scene; IDs as `zeitleiste.py liste` prints them), otherwise ask.
   "Nächster Clip" = the first clip in film order without a finished, seam-checked clip (status in `$F/03-higgsfield.md`).
2. `python3 werkzeuge/video-film/traum/zeitleiste.py liste $F/zeitleiste.json` (scenes) and `… clips $F/zeitleiste.json` (start/end keyframe, duration); the
   scene in `$F/01-drehbuch.md` (world, level, picture, camera, transitions, website share, sound, purpose).
3. Overview for Elias (German, short): scene and time, keyframes with their twins (partner across the world border),
   clips, status of each (sketch / original / clip).

## 2. ChatGPT card
1. The scene's card from `$F/02-chatgpt-briefing.md` **unchanged** in a code block to paste (in a new ChatGPT chat the
   briefing's general part first). Only style, effect, mood, context, red thread – add no picture prescription (layout,
   object list, camera values). A gap in the card is fixed in the briefing, not in this message.
2. Twin keyframe: Elias attaches the approved partner image in ChatGPT as reference.

## 3. Check sketches
1. Sketches from Elias: working copies in the scratchpad, named `<keyframe-id>-v<n>`; approved ones are kept as WebP
   (rule 8) where `03-higgsfield.md` keeps the keyframes; never overwrite an older version.
2. Deploy the agent `kontinuitaet` with film folder, scene, files with their keyframe IDs and the approved twin partners.
   It answers per image "passt" / "nachbessern: …" plus a short feedback for ChatGPT.
3. To Elias: the verdict and the feedback as one block to paste into ChatGPT, in the spirit of the briefing (effect and
   mood, never pixels). Repeat until every keyframe of the scene "passt"; Elias has the last word.

## 4. Higgsfield job (only with OK)
1. Job from `$F/03-higgsfield.md`: model, prompt, start and end image, duration (format and sound as noted there).
   Images: a Higgsfield keyframe by its job ID (as `value`), a local file via `media_upload` → PUT → `media_confirm`.
2. Before asking: keyframe originals come before the clip, a clip only when both its keyframes "passt" (`kontinuitaet`
   checks originals too); start image = the real last frame of the previous clip (5.4; first clip: its keyframe), never a newly painted one;
   readable website parts only from real page captures; astronaut in the picture → the suit bible's prompt wording verbatim.
3. Free: `balance`, then the same call with `params.get_cost: true`.
4. Ask Elias, e.g. „Chef, Freigabe erbeten: Clip <ID> (<Szene>, <Keyframe> → <Keyframe>), `<modell>`, <Dauer> s, Ton aus –
   <x> Credits laut Kostenabfrage, Guthaben <y>. Wofür: <ein Satz>. Freigeben?“
5. Only after his explicit OK: send exactly this job, once. Other model, prompt, duration or count = a new question.
   Error or timeout: first `jobs_wait` / `show_generations`, never resend blindly.
6. Record in `03-higgsfield.md`: job ID, model, prompt version, credits, date (cost trail and usage rights). Download as
   in `visual-einbauen` §5; large media stay out of git (PLAYBOOK §10).

## 5. After the clip
1. Seams: `python3 werkzeuge/video-film/traum/kette-pruefen.py naehte <clips in film order>` (previous → new → next, if present).
2. `kontinuitaet` with the clip, its neighbours and the seam result: morph instead of cross-fade, suit drift, flicker, 9:16 centre.
3. Not passed: remedies from `00-grundlagen.md` §5 (intermediate keyframe half/half; "continuous camera motion, no pause"
   with the same direction and speed in both clips; overlap 2–4 frames in the cut). A new generation = a new question (4.4).
4. Passed: `python3 werkzeuge/video-film/traum/kette-pruefen.py letztes-bild <clip> <bild>` → start image of the next clip;
   note it in `03-higgsfield.md`. If that clip crosses a world border, `kontinuitaet` checks this frame against the twin first.

## 6. Sound and log
1. Note the scene's sound events from `$F/04-ton.md` (what, frame from `zeitleiste.json`, model): they are generated later
   against the locked picture (PLAYBOOK §5–6), again only with OK. Check on which frame each picture event really happens
   in the clip (the sound peak goes there); a deviation is corrected only in `zeitleiste.json` (the hook checks it).
2. Order log (skill `auftrag`): `python3 ops/log.py neu "Traum <Szene>: …" --bereich video`; waiting for Elias →
   `status <ID> blockiert "…"`; done → `fertig <ID> "…"` with the credits actually spent. Then `/sichern`.
