---
name: meisterpruefung
description: Prüft eine Seite gegen den Meisterstandard (wissen/MEISTERSTANDARD.md) - Technik, Gewichts-Budget, Bewegung als Bildfolge, Anpassbarkeit und Wirkung mit unabhängiger Zweitnote. Nutzen, bevor eine Showcase- oder Kundenseite als fertig gilt, oder bei "/meisterpruefung".
---

# Meisterprüfung

Ordner `S` = `vorlage`, `showcase/<name>` oder `kunden/<slug>`. Server im Hintergrund:
`node werkzeuge/gzserver.mjs 8080 $S/public`.

1. **P1 Technik:** Skill `/pruefen` komplett (Tests, HTML, Kopf, Breiten, ohne JS, reduzierte Bewegung, Lighthouse).
2. **P2 Gewicht:** `node werkzeuge/budget.mjs $S/public 8080` für die Startseite und jede Seite mit 3D oder Video
   (dritter Parameter = Seite). Überschreitung → Ursache nennen und beheben, Grenzen nicht anheben.
3. **P3 Bewegung:** jede Animation einmal mit `/bildfolge` aufnehmen (Laden bei 390 und 1440, Menü, eigene Effekte).
4. **P4 Anpassbarkeit:** zweites Farbschema in `css/marke.css` einspielen, Schritte 1–2 für die Startseite erneut,
   danach zurückstellen. Gibt es noch keine `marke.css`: als Mangel melden.
5. **W Wirkung:** Screenshots 390 und 1440 (`werkzeuge/ausgabe/`) ansehen, W1–W7 benoten, je Note ein Satz Begründung.
   Zweitnote: `uffz-schnoerkel` mit den Screenshot-Pfaden und der Tabelle W1–W7 aus dem Standard ansetzen, ohne
   die eigenen Noten zu verraten. Bei mehr als 1 Abweichung zählt die strengere.
6. Ergebnis als Tabelle (P1–P4 bestanden/nicht, W1–W7 Note) melden, Screenshots Handy + Computer mitschicken.
   Mängel ins Auftragslog, neue Lehren nach `wissen/`.
