---
name: pruefen
description: Komplette Qualitätsprüfung einer Kundenseite oder der Vorlage - Tests, HTML, Kopf, Überlauf 320-1920 px, Konsolenfehler, ohne JavaScript, Bewegung reduzieren, Tippflächen, Lighthouse mobil mit Kompression und echten Sicherheits-Headern. Nutzen vor jedem Commit oder bei "/pruefen".
---

# Prüfen

Ordner `S` = `vorlage` oder `kunden/<slug>`. Einmalig: `cd werkzeuge && npm install`.
Server im Hintergrund (eigener Befehl): `node werkzeuge/gzserver.mjs 8080 $S/public` – liefert gzip und die Header
aus `_headers`, CSP-Verstöße erscheinen deshalb als Konsolenfehler.

1. `cd $S && npm test` → alle Tests grün (API + Sicherheit).
2. `werkzeuge/node_modules/.bin/html-validate -c werkzeuge/.htmlvalidate.json $S/public/*.html` → 0 Fehler.
3. `python3 werkzeuge/kopf-pruefen.py $S/public` → 0 Fehler.
4. `node werkzeuge/pruefen.mjs $S/public 8080` → Überlauf, Konsole, H1, Tippflächen, ohne JS, reduzierte Bewegung.
   Screenshots in `werkzeuge/ausgabe/` einmal ansehen (390 und 1440).
5. `bash werkzeuge/lighthouse.sh $S/public 8080` (einzelne Seite: `SEITEN=index.html`) → Perf ≥ 95, A11y/BP/SEO 100, CLS ≈ 0.
6. Ergebnis als Tabelle melden, neue Fehler in `wissen/FEHLER.md` anhängen.
