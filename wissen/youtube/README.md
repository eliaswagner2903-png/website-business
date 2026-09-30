# YouTube-Lernsystem

Macht aus YouTube-Videos dauerhaft nutzbares Wissen. Nichts Fremdes kopieren: gespeichert werden eigene Auszüge, Zeitstempel, Quellenlinks.

## Installation (was neu ist)
- `werkzeuge/youtube.py` (ein Skript, nur Python-Standardbibliothek) plus zwei Pakete: `yt-dlp` (Metadaten, Untertitel, Video für Bilder) und `youtube-transcript-api` (Rückfall). Kein Konto, kein API-Schlüssel, kein MCP.
  Einrichten: `python3 -m pip install -r werkzeuge/youtube-requirements.txt`. Frames nutzen `ffmpeg` (liegt beim Playwright-Setup dabei).
- Agent `youtube-lernagent` (sonnet), Skills `/youtube-lernen`, `/youtube-wissen`, Hook-Zweig in `werkzeuge/hook-pruefen.sh`, Test `werkzeuge/tests/youtube.test.mjs`.
- **Entscheidung (kurz):** Ein MCP bringt hier nichts, was yt-dlp nicht kann, und wäre eine zusätzliche Abhängigkeit. yt-dlp ist aktiv gepflegt (Version 2026.08 im Test), braucht keine Schlüssel und liefert Metadaten, Kapitel und Untertitel in einem Aufruf. `youtube-transcript-api` springt ein, wenn yt-dlp keine Untertitel bekommt (im Test war es seinerseits zeitweise von YouTube blockiert, deshalb zwei Wege).

## Ablauf
URL → `holen` (Metadaten, Kapitel, Transkript nach `werkzeuge/ausgabe/youtube/<id>/`, nicht im Git) → optional `frames` → Analyse durch `youtube-lernagent` → Wissensdatei → `pruefen` → `index`.

## Benutzung
- Ein Video: „Lerne aus diesem Video: <URL>“ oder `/youtube-lernen <URL>`.
- Mehrere/Playlist/Kanal/Thema: `/youtube-lernen <Playlist-URL>`, `/youtube-lernen suche: Landingpage Conversion` (max. 10 je Lauf).
- Wissen nutzen: „Was weißt du über Landingpages?“, `/youtube-wissen` (Suche, Vergleich `/youtube-vergleich`, Abgleich `/youtube-revise`).
- Werkzeug direkt: `python3 werkzeuge/youtube.py holen|liste|frames|pruefen|suche|index`.

## Wissensablage
`wissen/youtube/<kategorie>/<kurztitel>-<video_id>.md` (Format `VORLAGE.md`), `konzepte/` (Positionen mehrerer Videos, Unterschiede, Widersprüche), `index.md` (automatisch, mit Schlagwort-Verknüpfungen).
Kategorien: webdesign, ux, frontend, backend, ai, claude, marketing, sales, business, seo, content, video, automation, recht, sonstiges (mehrere erlaubt, erste = Ordner).
Aussagen tragen Zeitstempel und Art (FAKT, BEHAUPTUNG, MEINUNG, ERFAHRUNG, EMPFEHLUNG, SCHLUSSFOLGERUNG). Zwei unterschiedliche Empfehlungen bleiben beide stehen, mit Bedingung. Regeln in `wissen/fachgebiete/` haben Vorrang; YouTube-Wissen ändert sie nie von selbst.

## Abruf durch Claude
Bei Aufgaben zuerst `suche <Begriffe>`, dann nur die Treffer lesen (Skill `youtube-wissen`). Die Suche gewichtet Titel, Schlagwörter, Kategorien höher als Fließtext; einfache Wortstämme, keine Vektorsuche.

## Fehlerbehebung
| Problem | Ursache | Alternative |
|---|---|---|
| Kein Transkript | Video ohne Untertitel oder YouTube blockiert die Anfrage | später wiederholen; Text von Elias einfügen lassen; nur Beschreibung und Bilder |
| 429 / „Sign in to confirm“ | Rate-Limit oder Bot-Schutz der IP | Minuten warten, weniger Videos je Lauf, lokal statt Cloud ausführen |
| Video privat/gelöscht | nicht abrufbar | anderes Video |
| `frames`: nur 3 Vorschaubilder | Videodatei kann in der Cloud-Umgebung nicht geladen werden (403/Hänger bei googlevideo) | lokal auf Elias' Gerät mit Remote Control ausführen, dann freie Zeitpunkte möglich |
| Sehr lange Videos | >25.000 Wörter | `roh.md` kapitelweise lesen |

## Grenzen (getestet, Stand 2026-09-30)
- Sprecherwechsel liefert YouTube nicht; automatische Untertitel enthalten Erkennungsfehler.
- Freie Frames zu beliebigen Zeiten konnten in der Cloud-Umgebung **nicht** getestet werden (Videoabruf scheitert); der Rückfall auf die 3 YouTube-Vorschaubilder funktioniert.
- Keine automatische Bilderkennung im Skript: Bilder sieht Claude selbst an.

## Spätere Erweiterungen
Spracherkennung (Whisper) für Videos ohne Untertitel (lokal, kostet Rechenzeit), Frames lokal per Remote Control, Suche mit Vektoren erst ab vielen Videos, Regelvorschläge aus Konzepten an `wissen/fachgebiete/` (nur mit Freigabe).
