# NORVAK – fiktive Portfolio-Fassung der OSG-Studie

Die OSG-Seite darf nicht als Link veröffentlicht werden (echte Firma). Für Elias' Portfolio gibt es deshalb eine Fassung
mit der erfundenen Marke **NORVAK Präzisionswerkzeuge GmbH** (Kantenberg). Ersetzt werden:
- Name, Logo, Adresse und Kennzahlen
- Firmengeschichte und Produktcodes
- Beschichtungen, Händler, Partner und Anwenderbericht

Aufbau, Texte, KI-Bilder und Funktionen bleiben gleich.

- Link (privat, Elias gibt frei): https://claude.ai/artifact/Fsqu6D63SxNHwWi1VcLbHC
- Bauen (immer in einer Kopie, die Skripte ändern ihren Ordner):

```sh
Z=$(mktemp -d) && cp -r ../bauen.mjs ../inhalt ../public "$Z"/ && cp umbauen.py artifact.py "$Z"/
cd "$Z" && python3 umbauen.py && node bauen.mjs && python3 artifact.py   # Ergebnis: artifact/ (Hauptseite norvak.html)
```

Danach prüfen, dass nichts mehr auf OSG verweist:
`grep -ril "osg\|göppingen\|osgeurope" public --include=*.html --include=*.css --include=*.js` muss leer sein.
Zum Veröffentlichen per Artifact-Tool `artifact/norvak.html` mit allen übrigen Dateien als `files` und `root=artifact` publizieren. Damit der Link gleich bleibt, `url` angeben.
