> **Stand 22.10.2026:** Die Vorstellungs-Überblendung ist mit dem Umbau auf „Wagner Seiten“ entfernt (der alte Film zeigt den Seitenkapitän-Auftritt). Der alte Film liegt im Projektordner (`seitenkapitaen/video/film/`) als Vorher-Material für den Spot; der Seitenstand von vorher ist als Git-Tag `vor-wagner-seiten-2026-10-22` gesichert. Ein neuer Film wird später wieder eingebaut (Code: Git-Verlauf, Tag).

# Vorstellungsvideo (Unternehmensvideo) tauschen

Die Startseite zeigt beim **ersten Besuch** eine Vorstellung als Überblendung (stumm, Knopf „Ton an“, „Überspringen“, Esc). Danach nicht mehr
automatisch, sondern per Knopf „Vorstellung ansehen“ (Hero und Fußzeile). Gemerkt wird im Browser (`localStorage`, Schlüssel
`seitenkapitaen-vorstellung`). Zum erneuten Testen: Adresse mit `?intro=1` öffnen.

Aktuell läuft eine **Platzhalter-Titelsequenz** (Linien, Kompass, Name, ca. 7 s, Wert `vorstellung.platzhalter_dauer` in `inhalt/seite.json`).

## Echtes Video einsetzen
1. Dateien nach `public/medien/vorstellung/` legen: `film.mp4` (H.264) und `film.webm` (VP9), `poster.webp`, optional `untertitel.vtt`.
2. `node bauen.mjs` – ist eine Datei da, wechselt die Seite selbst vom Platzhalter auf den Film.
3. Videoregeln: stumm startfähig (Ton läuft erst nach Klick), 16:9, möglichst 30–60 s, ≤ 8 MB. Letztes Bild ruhig, am besten der Schriftzug:
   Eingebaut 13.10.: film.mp4 (1920x1080, 9 MB), film-hoch.mp4 (9:16, 720x1280, 5 MB, Handy im Hochformat), Poster beider Formate, untertitel.vtt; WebM bewusst weggelassen (Speicher), bei nicht abspielbarem Format schließt die Vorstellung selbst.
   das Video blendet dann weich in die Seite über (Hintergrund blendet aus, Hero läuft an). Untertitel für Barrierefreiheit mitliefern.
4. Produktion: `werkzeuge/video/README.md` (Remotion-Pipeline, Bildaufnahme, Stimme). Musik erst nach freigegebenem Schnitt.

Technik: `js/vorstellung.js` (Ablauf), `css/kapitaen.css` (Optik), Erstbesuch-Prüfung als Inline-Skript im Kopf (CSP-Hash in `public/_headers`).
Lädt das Video nicht an (6 s) oder ist „Bewegung reduzieren“ / „Daten sparen“ aktiv, erscheint die Vorstellung nicht automatisch.
