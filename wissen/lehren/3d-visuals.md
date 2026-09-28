# Lehren aus Stufe 2 (3D-Baustein) und Stufe 4 (Visual-Pipeline)

Stand 2026-09-28, Branch `aufbau/3d-visuals`. Gilt für `vorlage/bausteine/szene-3d/`, `werkzeuge/poster-rendern.mjs`,
`werkzeuge/bilder.mjs` und den Skill `/visual-einbauen`.

## Echtzeit-3D im Web

1. **Das Standbild ist der Kern, nicht der Rückfall.** Wer das Poster mit demselben Renderer, derselben Kamera und
   demselben Startzustand rendert (`poster-rendern.mjs`, Modus `?standbild`), bekommt einen Übergang, den man nicht
   sieht (gemessen: mittlere Abweichung 2,3/255 am Computer, 4,5 am Handy; Bildfolge zeigt acht gleiche Bilder). Jede andere Quelle für das
   Poster (Screenshot, gemaltes Bild) ergibt einen Sprung.
2. **Reihenfolge des Überblendens:** Leinwand zeichnet das Standbild → `opacity` 0 → 1 über 0,9 s → **erst danach**
   Poster ausblenden und Bewegung starten. Wer die Bewegung sofort startet, sieht einen Ruck, obwohl das Bild passt.
3. **Nur-Software-Renderer erkennen, bevor man 139 KB lädt.** `WEBGL_debug_renderer_info` →
   `/swiftshader|llvmpipe|softpipe|basic render|software|mesa offscreen/i`. Kostet ~24 ms (nur Kontext anlegen) und
   verhindert den Totalschaden: three.js braucht in Software für den Szenenaufbau **8 s** statt ~0,2 s.
   Ein Zeichentest mit echtem Shader war zwar genauer, kostete aber allein 100 ms (bei 4× Drosselung 400 ms TBT) –
   Lighthouse fiel dadurch von 100 auf 86. **Erst der Name, dann erst messen.**
4. **Probelauf statt Vertrauen:** Szene 0,6 s mit 1 % Deckkraft über dem Poster zeichnen und die Bildrate messen.
   `opacity: 0` genügt nicht – dann überspringt der Browser die Zeichenarbeit und die Messung lügt.
5. **Wächter über echte Zeitfenster**, nicht über gedeckelte `dt`-Werte (`Math.min(dt, 0.05)` verfälscht jede
   Mittelung: 1 fps sieht aus wie 20 fps). Reihenfolge der Notbremsen: Pixeldichte senken → Standbild.
   Urteil „zu langsam“ im `sessionStorage` merken, sonst quält sich jede weitere Szene neu.
6. **Kantenglättung (MSAA) nur unter devicePixelRatio 2.** Bei 3 Gerätepixeln pro CSS-Pixel sieht man sie nicht,
   sie kostet aber ein Vielfaches. Klarlack (`clearcoat`) ist der zweitteuerste Schalter – beides zusammen war in
   Software der Unterschied zwischen 2 und 12 fps.
7. **Licht:** Metall lebt allein von der Umgebung (`RoomEnvironment` über `PMREMGenerator`), Keramik und Stein wirken
   darin flach. Lösung: Umgebung auf ~0,5 dämpfen und **ein** gerichtetes Licht von oben links dazu – Form und
   Glanzkante entstehen erst dadurch. `NeutralToneMapping` hält die Markenfarbe näher am CSS-Wert als ACES/AgX.
8. **Farben aus CSS lesen** über ein 1×1-Canvas (`fillStyle` + `getImageData`): funktioniert für `#hex`, `oklch()`,
   `color-mix()` und jede Variable, ohne eigenen Farbparser.
9. **Prozedurale Objekte statt fremder Modelle:** keine zusätzliche Anfrage, keine Lizenzfrage, Farbe frei wählbar.
   Nach einer `LatheGeometry` oder verformten Kugel `mergeVertices` + `computeVertexNormals`, sonst sieht man die
   Naht am Umlauf als harte Kante. Keine Zufallszahlen in der Form – sonst passt das Poster beim nächsten Rendern nicht.
10. **`compileAsync` ohne `KHR_parallel_shader_compile`** (verbreitet) läuft synchron: der Aufruf blockiert. Deshalb
    darf er erst nach `load` und im Leerlauf passieren, nie beim ersten Zeichnen der Seite.

## Messen in dieser Umgebung

11. **Die Claude-Cloud hat keinen Grafikchip** (ANGLE/SwiftShader). Jede fps-Zahl für WebGL ist dort wertlos:
    Szene ~2 fps, obwohl eine leere WebGL-Schleife 61 fps schafft. Konsequenz: Schalter zum Erzwingen
    (`?szene3d=an`) nur für Screenshots und Bildfolgen, und im Bericht immer dazuschreiben, was gemessen wurde.
12. **`werkzeuge/budget.mjs` kannte nur JS im ersten Aufruf.** Neu: `jsNachgeladen` (alles, was nach `load` angefragt
    wird, Grenze 180 KB) – sonst meldet das Budget bei jeder 3D-Seite fälschlich einen Verstoß.
13. **`werkzeuge/bildfolge.mjs`** kann jetzt `"warte:<selektor>"` als Auslöser: für Übergänge, die von selbst starten.
14. Sechs Agenten auf vier Kernen: Lighthouse und fps schwanken stark (einmal Performance 0 durch Zeitüberschreitung).
    Immer drei Läufe ansehen und im Zweifel einzeln nachmessen.

## Bildpipeline

15. `werkzeuge/bilder.mjs` (sharp) macht AVIF (q 55) + WebP (q 78) in 640/1016/1600 px und gibt das fertige
    `<picture>` aus. **Nie hochskalieren:** ist das Original kleiner, wird die Originalbreite die größte Stufe.
16. `.rotate()` ohne Argument übernimmt die EXIF-Ausrichtung; die Maße müssen dann getauscht werden, sonst stehen
    falsche `width`/`height` im Snippet (und das ergibt CLS).
17. AVIF braucht in sharp `heif` mit `alias: avif` – vorhanden. **ffmpeg fehlt und ist hier nicht installierbar**,
    Video ist deshalb nur dokumentiert (README des Bausteins), nicht gebaut.
18. Neue npm-Pakete gehören ins Haupt-`werkzeuge/` (`npm install --no-save --no-package-lock`, FEHLER.md Nr. 48)
    **und** in `werkzeuge/package.json`: `esbuild`, `sharp`, `three`.

## Organisatorisch

19. **Higgsfield:** Keine Werkzeuge aufrufen, die Credits kosten. Vor jeder Generierung Elias fragen (was, ungefähre
    Credits, wozu). Steht auch im Skill `/visual-einbauen`.
