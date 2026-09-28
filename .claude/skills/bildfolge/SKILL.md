---
name: bildfolge
description: Eine Animation (Menü, Laden der Seite, Übergang) als exakte Bildfolge aufnehmen und beurteilen, ob sie ruhig und angenehm ist. Nutzen bei neuen oder geänderten Animationen oder bei Rückmeldungen wie "erschreckt", "zu schnell", "unruhig".
---

# Bildfolge einer Animation

1. Server läuft (`node werkzeuge/gzserver.mjs 8080 $S/public`).
2. Aufnehmen:
   - Menü o. Ä.: `node werkzeuge/bildfolge.mjs http://localhost:8080/index.html ".menue-knopf" 390 700`
     (Selektor zum Antippen, Breite, vorher gescrollte Höhe)
   - Laden der Seite: `node werkzeuge/bildfolge.mjs http://localhost:8080/index.html laden 390`
3. `werkzeuge/ausgabe/bildfolge.png` ansehen (0–1500 ms nebeneinander) und beurteilen:
   - Nach 150 ms höchstens ein Viertel der Bewegung → sonst Kurve mit leisem Start (`cubic-bezier(.45,.05,.25,1)`)
     und längere Dauer.
   - Große Flächen geben den Bildschirm **nach und nach** frei, die Seite bleibt als Kontext sichtbar.
   - Nichts springt, nichts blitzt, Inhalte erscheinen, wenn die Fläche sie erreicht.
   - Im ersten Bildschirm ist das größte Element (LCP) ab dem ersten Bild sichtbar.
4. Bild dem Nutzer schicken, wenn es um eine Rückmeldung von ihm geht; Erkenntnis in `wissen/DESIGN-WISSEN.md` oder `wissen/FEHLER.md` anhängen.
