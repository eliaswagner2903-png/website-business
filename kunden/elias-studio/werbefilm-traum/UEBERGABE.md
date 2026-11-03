# Übergabe an das Projekt „website-business“ (Auftrag A-124, Stand 03.11.2026)

**Aufgabe:** Werbefilm „Vor dem Aufwachen“ für Wagner Seiten von der Planung in die Herstellung führen. Die Planung ist fertig; bisher wurde **kein Credit** ausgegeben.

## Lesereihenfolge
1. `README.md` – Überblick, Ablauf, Handgriffe
2. `00-grundlagen.md` – Auftrag von Elias (Abschnitt 1, verbindlich), Regeln (3), Technik und Kosten (5)
3. `01-drehbuch.md` – Drehbuch (gezielt lesen, ca. 117.000 Zeichen), Zeiten nur aus `zeitleiste.json`
4. `02-chatgpt-briefing.md`, `03-higgsfield.md`, `04-ton.md`
5. `referenzen/` – Referenzbilder für ChatGPT (README dort)
6. Privates Storyboard: https://claude.ai/artifact/Bgvves4D1n3DrzHkFnvTbC (erzeugt mit `python3 werkzeuge/video-film/traum/storyboard.py`)

## Nächste Schritte (Reihenfolge)
1. Elias macht den Haken-Test (3–5 Unbeteiligte) und trifft die Entscheidungen 1–7 (Drehbuch §11), vor allem Quellen der Seiten (5) und Bildrate (4).
2. Elias erstellt ChatGPT-Skizzen mit Master-Briefing + Referenzbildern und schickt sie per `/filmszene` zurück. Der Agent `kontinuitaet` prüft jede Skizze, Rückmeldung an ChatGPT im Geist des Briefings.
3. Bezahlte Tore 0–6 nach Drehbuch §9: erst Kostenabfrage (`get_cost`, gratis), dann Elias' ausdrückliche Freigabe, dann erzeugen, nie doppelt senden; Nähte mit `kette-pruefen.py naehte` prüfen.
4. Ton nach `04-ton.md` (Musik zuletzt), Schnitt in Remotion, Prüfseite privat, Einbau erst nach Freigabe.

## Regeln, die nie verhandelt werden
Regel 0 (Würde, nichts Täuschendes), Regel 7 (Credits nur mit Freigabe; der Hook `werkzeuge/kosten-waechter.py` fragt nach, wirkt ab neuer Sitzung), keine Preise, keine Ranking-/KI-Versprechen, Musterseiten kenntlich, keine echten Personen, genau eine Handlungsaufforderung „Projekt besprechen“.

## Stand der Werkzeuge
Tests: `python3 -m unittest discover -s werkzeuge/video-film/traum -p 'test_*.py'` und `python3 werkzeuge/test_kosten_waechter.py`. Ungetestet: der Hook in einer echten Sitzung. Pull Request: https://github.com/eliaswagner2903-png/website-business/pull/110
