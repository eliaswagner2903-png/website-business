---
name: visual-einbauen
description: Integrate a visual (photo, 3D scene, later Higgsfield image or video) into a page in a performance-friendly way - image pipeline AVIF/WebP with srcset, render the poster of the 3D scene, check budget and transition. Use on "Bild einbauen", "Hero-Visual", "3D-Objekt", new photos from the customer or before integrating Higgsfield material.
---

# Integrate a visual (goal: from draft to measured in under 30 min)

`$S` = site folder (e.g. `kunden/<slug>`), server: `node werkzeuge/gzserver.mjs <port> $S/public` (separate background command).

## 1. Photo / still image
`node werkzeuge/bilder.mjs <bild> $S/public/medien --name=<motiv> --sizes="…" --alt="…" [--hero]`
- produces AVIF + WebP at 640/1016/1600 px (never upscaled) and outputs the finished `<picture>` → paste it in.
- `--hero` only for the image on the first screen (LCP: `fetchpriority="high"`, never lazy). Adapt `sizes` to the layout.
- Only real photos of the customer, no stock photos (invent nothing). Alt text describes what can be seen.

## 2. 3D scene (`vorlage/bausteine/szene-3d/`, for integration see the README there)
1. `szene-3d.js`, `szene-3d.modul.js` to `public/js/`, `szene-3d.css` to `public/css/`, markup from `demo.html`.
2. Choose object/colors via `data-objekt`, `data-farbe="--farbe-akzent"`; colors come from `css/marke.css`.
3. Render the poster – after **every** change to object, color, aspect ratio:
   `node werkzeuge/poster-rendern.mjs http://localhost:<port>/index.html $S/public/medien`
4. Object changed? `node vorlage/bausteine/szene-3d/bauen.mjs` (re-bundles three.js, reports the size).

## 3. Check (mandatory)
- `node werkzeuge/budget.mjs $S/public <port> <seite>` – limits of the class from `kunde.json` (`schlank` 60/180 KB JS, `erlebnis` 200/600, `kino` 350/1500), fps ≥ 55.
- `SEITEN=<seite> bash werkzeuge/lighthouse.sh $S/public <port>` – the LCP element must be the poster/image.
- Transition: `node werkzeuge/bildfolge.mjs http://localhost:<port>/<seite> "warte:.szene-3d--bereit"` – no jump.
- "Reduce motion" and without JS: only the still image, nothing important missing.

## 4. Video (WebM + MP4) – building block `vorlage/bausteine/hero-video`
ffmpeg is available via npm: `npm i ffmpeg-static` in the scratchpad → `node_modules/ffmpeg-static/ffmpeg`.
```
ffmpeg -i roh.mp4 -an -vf scale=1280:-2 -c:v libvpx-vp9 -b:v 0 -crf 31 -row-mt 1 -cpu-used 1 -pix_fmt yuv420p film.webm
ffmpeg -i roh.mp4 -an -vf scale=1280:-2 -c:v libx264 -crf 22 -preset slow -pix_fmt yuv420p -movflags +faststart film.mp4
```
Loop 5–10 s, no sound, ≤ 1.5 MB. Poster = first frame of the video (step 1). Markup/JS/CSS from `hero-video`
(`held-video--16x9` for films further down, there the poster with `loading="lazy"`). With "reduce motion" and
"save data" only the poster remains, stop button 48 px (WCAG 2.2.2). Check the seam: SSIM first/last frame ≥ 0.99.

## 5. Higgsfield

**Fixed rule from Elias:** credits only with his explicit approval (state motif, model, credits beforehand).
Query the cost beforehand with `get_cost: true` (costs nothing). As of 2026-09-29:

| Model | Setting | Credits |
|---|---|---|
| `gpt_image_2_5` | 1k, quality "low" (default) | 0.25 |
| `recraft_v4_1` | 1k | 1.25 |
| `kling3_0` | 5 s, `mode: std`, `sound: off` | 6.25 |
| `kling3_0` | 6 s, `mode: std`, `sound: off` | 7.50 |
| `seedance_2_0_mini` | 4 s, 480p / 720p, no sound | 2 / 4 |
| `seedance1_5` | 4 s, 720p, no sound | 4.80 |
| `seedance_2_0` | 4 s, `mode: fast`, 720p, no sound | 10 |
| `seedance_2_0` | 8 s, `mode: std`, 1080p, no sound | 72 |
| `seedance_2_5` | 4 s, 480p, no sound | 12 |
| `seedance_2_5` | 5 s | 35 |

- **Seedance vs. Kling (A-048):** Seedance 2.x can do start/end frame plus image/video references and up to 15 s (2.5: 30 s)
  in one go: strong for long camera moves (scroll film). For short calm loops `kling3_0` is enough and cheaper.
  `seedance_2_0_mini` only 480p/720p: as a replacement for a 1080p Kling film it is a step backward.
- **Seamless loop:** with `kling3_0` use the same image as `start_image` and `end_image` (job ID as `value`),
  prompt "Locked-off static camera … nothing else moves" → calm movement, seam practically invisible.
- **Download:** results lie on `d8j0ntlcm91z4.cloudfront.net`. The domain must be in the environment's network
  allowlist; a change only takes effect in new sessions.
- Batch jobs can fail on the rate limit (429); failed entries cost nothing, resend them individually.
- Visibly label AI images (caption) and mark them with `data-pruefen`: never pass them off as a real photo of the customer.

Higgsfield delivers **raw material**; from then on the path is the same: image → step 1, video → step 4,
product/object view as a video instead of real-time 3D when no interaction is needed. Agent `visual-higgsfield`
generates variants and enters prompt/model/date in `kunden/<slug>/medien-quellen.md`.
