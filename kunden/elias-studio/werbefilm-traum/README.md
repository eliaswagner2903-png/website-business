# Werbefilm „Traum“ – Startseite des Filmordners (Auftrag A-124)

Stand 03.11.2026 · Film „Vor dem Aufwachen“, 16:9, 85,00 s, 60 B/s, Szenen S01–S19. Zeiten nur aus `zeitleiste.json`.

## Worum es geht

Ein Astronaut holt auf dem Mond Luft und fällt ohne Hartschnitt durch immer kürzere, fremdere Traumwelten – Werkstatt, Praxis,
Restaurant –, bis ein Kopfhörer zeigt, dass alles aus Elias' Websites besteht, und nur ein Cursor bleibt. Dann nimmt ein Mensch im
Morgengrauen die Kopfhörer ab, und die Karte sagt: „Jede Welt beginnt mit einer Seite.“

## Dateien des Ordners

| Datei | Zweck |
|---|---|
| `00-grundlagen.md` | Auftrag in Elias' Worten, Marke und Regeln, Technik, Keyframe-Kette |
| `01-drehbuch.md` | Drehbuch 1: Szenen, Nähte, Kopfhörer, Haken, Ende, Kurzfassungen, Credits, Tore, Handgriffe §10, Entscheidungen §11 |
| `02-chatgpt-briefing.md` | für ChatGPT: Gebrauchsanleitung, Master-Briefing, Karte je Szene |
| `03-higgsfield.md` | Originale: Keyframes, Prompt je Clip, Kosten, Auftragsprotokoll §11 |
| `04-ton.md` | Tonblatt ElevenLabs: Stimme, Prompt je Tonereignis (T01–T41), Musik, Mischung – Planung fertig, 7 offene Punkte in §10 |
| `zeitleiste.json` | einzige Quelle aller Zeiten: 19 Szenen, 26 Keyframes, 25 Clips, 41 Tonereignisse |
| `storyboard.html` | (noch nicht erzeugt) Arbeitsseite mit Kurve, Karten und Prompts zum Kopieren; erzeugt mit `python3 werkzeuge/video-film/traum/storyboard.py` |

## Ablauf in Schritten je Szene

Je Szene mit dem Skill `/filmszene` (z. B. `/filmszene S04`). Bezahlt wird erst ab Schritt 4, nur mit Elias' OK.

1. **ChatGPT-Karte:** Claude gibt die Karte aus `02-chatgpt-briefing.md` unverändert aus; Elias fügt sie im Film-Chat ein und hängt
   die freigegebenen Skizzen an, vor allem den Zwillingspartner jenseits der Naht.
2. **Skizzen:** zwei Varianten je Keyframe, gespeichert als `K04-v1.png` usw.; nie Filmmaterial, nur Plan und Animatik.
3. **`/filmszene` + Agent `kontinuitaet`:** `/filmszene S04 – Skizzen` mit den Dateien; Urteil je Bild „passt“ oder „nachbessern“
   samt Rückmeldeblock für ChatGPT. Elias hat das letzte Wort.
4. **Kostenabfrage + Freigabe:** gratis `balance`, dann derselbe Aufruf mit `get_cost: true`; dann die Frage an Elias (was, Modell, Sekunden, Credits, wofür).
   Nach dem OK geht genau dieser Auftrag einmal raus. Der Credit-Wächter-Hook fragt zusätzlich, ersetzt das OK aber nie.
5. **Clip:** erst die Keyframe-Originale, dann der Clip (`kling_o3_flf` pro, Startbild → Endbild); Eintrag in `03-higgsfield.md` §11.
6. **Nahtprüfung:** `kette-pruefen.py naehte` und `kontinuitaet`. Bei „Sprung“ oder Überblendung Halt: Zwischenbild oder Rückfall.
   Bestanden: `letztes-bild` wird Startbild des nächsten Clips.
7. **Ton:** Tonereignisse der Szene aus `04-ton.md`, ElevenLabs nur nach Freigabe; Musik zuletzt gegen das fertige Bild.
8. **Schnitt:** Remotion mit Website-Ebenen, Tracking (±2 px), Kennzeichen „Musterseite“, Karte; Prüfungen (Nähte, Flimmern,
   Blitzschutz, −14 LUFS / −1 dBTP); zuerst eine private Prüfseite, eingebaut erst nach Freigabe.

**Über alle Szenen gilt die Reihenfolge der Tore** (Drehbuch §9.5, jedes Tor eine Freigabe): 0 alles Gratis · 1 Anzug-Referenzbogen ·
2 alle Keyframes · 3 Probe C02, C03, C04, C06a, C06b, C08, C09, C10, C11 · 4 C01, C05, C07 und C18 · 5 Ton · 6 Schnitt und Prüfseite.

## Werkzeuge

```text
python3 werkzeuge/video-film/traum/zeitleiste.py pruefen kunden/elias-studio/werbefilm-traum/zeitleiste.json
python3 werkzeuge/video-film/traum/zeitleiste.py liste kunden/elias-studio/werbefilm-traum/zeitleiste.json
python3 werkzeuge/video-film/traum/zeitleiste.py clips kunden/elias-studio/werbefilm-traum/zeitleiste.json
python3 werkzeuge/video-film/traum/kette-pruefen.py naehte <clip1> <clip2> <clip3>
python3 werkzeuge/video-film/traum/kette-pruefen.py letztes-bild <clip> <ziel.png>
python3 werkzeuge/video-film/traum/storyboard.py
```

- `zeitleiste.py` – prüft die Zeitleiste (Exit 0 = in Ordnung), zeigt Szenen, Clips mit Credit-Schätzung, Kurve.
- `kette-pruefen.py` – Nähte an echten Clips (nahtlos / sichtbar / Sprung), exaktes letztes/erstes Bild, Kontaktbogen.
- Credit-Wächter-Hook `werkzeuge/kosten-waechter.py` – fragt vor jedem bezahlten Higgsfield- oder ElevenLabs-Aufruf nach.
- Skill `/filmszene` und Agent `kontinuitaet` – Szene von der Karte bis zum geprüften Clip. Anleitung: `werkzeuge/video-film/traum/README.md`.

## Kosten auf einen Blick

Schätzung, keine Freigabe; Einzelposten in `01-drehbuch.md` §9.4 und `03-higgsfield.md` §10, Clips aus `zeitleiste.py clips`.

- Higgsfield: **Plan 74,50 + Reserve 12,75 = Guthaben 87,25 Credits** (Stand 02.11.2026; vor Tor 1 gratis neu abfragen).
- Nachkauf separat, erst nach Abnahme (Entscheidung 6): 30 s quer = 5 Brücken-Clips à 3 s (A1–A5, Drehbuch §8.1) = 18,75 ·
  9:16 mit eigenen Brücken ≈ 32,50. ElevenLabs (eigenes Guthaben): ≈ 7.000 Credits, nur nach Freigabe.

## Handgriffe für Elias

Details in `01-drehbuch.md` §10 (Dreh) und §6 (Haken-Test); Liste auch in `ops/HAENDE.md`.

- [ ] **Leitmotiv und Stimmlage** festlegen bzw. wählen (Tor 0, vor allem anderen; `04-ton.md` §2, §8 und §10).
- [ ] **ChatGPT-Skizzen** nach der Gebrauchsanleitung in `02-chatgpt-briefing.md`.
- [ ] **Haken-Test mit Unbeteiligten** (gratis, vor dem ersten Credit; 3–5 Menschen, Handy, mit und ohne Ton).
- [ ] **Eigenes Material drehen** (etwa eine Stunde, blaue Stunde, kein Gesicht, nichts Privates im Bild).
- [ ] **Entscheidungen 1–7** treffen, Freigabe je Tor und je bezahltem Auftrag (Termine unten).
- [ ] **Ablageort der Originale** nennen, Download der Higgsfield-Dateien freigeben (`03-higgsfield.md` §11).
- [ ] **Domain `wagnerseiten.de` kaufen** (optional; ohne Kauf entfällt die Domainzeile auf der Karte).
- [ ] **Credits ggf. nachkaufen:** für Kurzfassungen oder wenn die Reserve schmilzt – erst nach Abnahme des Hauptfilms.

## Offene Entscheidungen

Fragen und Empfehlungen: `01-drehbuch.md` §11. Termine:

- **vor bzw. in Tor 0:** 1 Haken (nach dem Haken-Test) · 2 echte Hände oder „Der leere Platz“ (vor dem Dreh) · 3 Stimme und
  Stimmlage · 5 Lotlinie, Wortlaut auf dem Laptop, Quellen der 12 Seiten (Seitenaufnahmen und Skizzen S03 brauchen sie)
- **vor dem Dreh, spätestens vor dem Schnitt (Tor 6):** 7 N11/N12 – der Ausweich für N12 braucht eine eigene Einstellung im Dreh
- **an Tor 3:** 4 Bildrate (an C04, beide Fassungen nebeneinander)
- **nach Abnahme des Hauptfilms:** 6 Kurzfassungen

## Stand

03.11.2026: `00`–`03` und `zeitleiste.json` fertig (`pruefen`: in Ordnung, 0 Hinweise) · `04-ton.md` Planung fertig (7 offene Punkte §10) ·
`storyboard.html` noch nicht erzeugt · **0 Credits ausgegeben**, kein Auftrag an Higgsfield oder ElevenLabs · nächster Schritt:
Tor 0 (Leitmotiv, Seitenaufnahmen, Skizzen, Animatik, Haken-Test) · Domain `wagnerseiten.de` noch nicht gekauft.
