---
name: youtube-lernen
description: Learn from YouTube videos and add it to the knowledge base (wissen/youtube/) - single video, playlist, channel or several links. Use on "/youtube-lernen <url>", "lerne aus diesem Video", "analysiere diese Videos", "/youtube-playlist", "/youtube-channel".
---

# Learn from YouTube

1. Log the order (`python3 ops/log.py neu "YouTube lernen: <Thema/Url>" --bereich wissen`), branch `aufbau/<thema>` (never main).
2. Give the work to the agent `youtube-lernagent` (sonnet), with URL(s) and the learning goal ("what is relevant for website business" or similar). For a few simple videos, work yourself following `.claude/agents/youtube-lernagent.md`; spread several independent videos across several agent runs in parallel.
   - Playlist/channel: `python3 werkzeuge/youtube.py liste <url> --n 10`, name the selection, then learn per video.
   - Search on a topic: `liste "suche:<Begriff>" --n 8`, justify the selection.
3. After several videos on the same topic: update the concept file in `wissen/youtube/konzepte/` (commonalities, differences, contradictions; do not declare any creator the winner).
4. `python3 werkzeuge/youtube.py pruefen` and `index`, then `/sichern`.
5. Short report (format see agent). The full text lies in the knowledge file.
Errors: always problem / cause / alternative. No transcript → do not guess, ask Elias for the text.
