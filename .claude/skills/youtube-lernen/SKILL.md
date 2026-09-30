---
name: youtube-lernen
description: Aus YouTube-Videos lernen und ins Wissen (wissen/youtube/) aufnehmen - einzelnes Video, Playlist, Kanal oder mehrere Links. Nutzen bei "/youtube-lernen <url>", "lerne aus diesem Video", "analysiere diese Videos", "/youtube-playlist", "/youtube-channel".
---

# YouTube lernen

1. Auftrag loggen (`python3 ops/log.py neu "YouTube lernen: <Thema/Url>" --bereich wissen`), Branch `aufbau/<thema>` (nie main).
2. Arbeit an den Agent `youtube-lernagent` (sonnet) geben, mit URL(s) und dem Lernziel („was für Website-Business relevant ist“ o. ä.). Bei wenigen einfachen Videos selbst nach `.claude/agents/youtube-lernagent.md` arbeiten; mehrere unabhängige Videos parallel auf mehrere Agent-Läufe verteilen.
   - Playlist/Kanal: `python3 werkzeuge/youtube.py liste <url> --n 10`, Auswahl nennen, dann je Video lernen.
   - Suche zu einem Thema: `liste "suche:<Begriff>" --n 8`, Auswahl begründen.
3. Nach mehreren Videos zum selben Thema: Konzeptdatei in `wissen/youtube/konzepte/` aktualisieren (Gemeinsames, Unterschiede, Widersprüche; keinen Creator zum Sieger erklären).
4. `python3 werkzeuge/youtube.py pruefen` und `index`, dann `/sichern`.
5. Kurzbericht (Format siehe Agent). Volltext liegt in der Wissensdatei.
Fehler: immer Problem / Ursache / Alternative. Kein Transkript → nicht raten, Elias um den Text bitten.
