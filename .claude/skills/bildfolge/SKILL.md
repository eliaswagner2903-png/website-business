---
name: bildfolge
description: Record an animation (menu, page load, transition) as an exact frame sequence and judge whether it is calm and pleasant. Use for new or changed animations or for feedback such as "erschreckt", "zu schnell", "unruhig".
---

# Frame sequence of an animation

1. Server is running (`node werkzeuge/gzserver.mjs 8080 $S/public`).
2. Record:
   - Menu etc.: `node werkzeuge/bildfolge.mjs http://localhost:8080/index.html ".menue-knopf" 390 700`
     (selector to tap, width, height scrolled beforehand)
   - Page load: `node werkzeuge/bildfolge.mjs http://localhost:8080/index.html laden 390`
3. Look at `werkzeuge/ausgabe/bildfolge.png` (0–1500 ms side by side) and judge:
   - After 150 ms at most a quarter of the movement → otherwise use a curve with a gentle start (`cubic-bezier(.45,.05,.25,1)`)
     and a longer duration.
   - Large surfaces release the screen **gradually**, the page stays visible as context.
   - Nothing jumps, nothing flashes, content appears when the surface reaches it.
   - On the first screen the largest element (LCP) is visible from the first frame.
4. Send the image to the user if it concerns feedback from him; append the insight to `wissen/DESIGN-WISSEN.md` or `wissen/FEHLER.md`.
