---
name: youtube-wissen
description: Gespeichertes YouTube-Wissen (wissen/youtube/) nutzen - suchen, vergleichen, mit neuen Videos abgleichen, auf eine Aufgabe anwenden. Nutzen bei "was weißt du über …", "/youtube-suche", "/youtube-vergleich", "/youtube-revise", "nutze mein gespeichertes Wissen über … für diese Seite".
---

# YouTube-Wissen abrufen

Nie alles laden. Ablauf: Aufgabe → Suche → wenige Quellen lesen → einbinden.
1. `python3 werkzeuge/youtube.py suche <Begriffe der Aufgabe> --n 5` (leer = noch kein Wissen, das offen sagen, nichts erfinden).
2. Nur die Treffer lesen (zuerst Konzepte, dann Quellen). Quellen mit Art (BEHAUPTUNG/MEINUNG …) und Zeitstempel nennen; Creator-Aussagen nie als Tatsache weitergeben.
3. Bei Kundenseiten gilt immer `wissen/fachgebiete/` (Regeln) vor YouTube-Wissen; Widersprüche ansprechen.
4. **Vergleich** (`/youtube-vergleich`): Treffer mehrerer Videos gegenüberstellen (Gemeinsames, Unterschiede, Widersprüche, Bedingungen), ggf. Konzeptdatei aktualisieren.
5. **Abgleich** (`/youtube-revise`): neues Video gegen `suche`-Treffer prüfen, Konzeptdatei ergänzen, Dopplungen statt neuem Text verlinken.
6. Änderungen an Wissensdateien: `pruefen` + `index`.
