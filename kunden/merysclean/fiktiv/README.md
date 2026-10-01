# KLARWERK – fiktive Vorschau-Fassung der Merys-Clean-Seite

Die Merys-Clean-Seite darf nicht als Link veröffentlicht werden, weil es eine echte Firma ist. Für eine private Vorschau
(Claude-Artifact) gibt es deshalb eine Fassung mit der erfundenen **Klarwerk Gebäudereinigung (Musterfirma)** in
Musterstadt. Ersetzt werden:
- Name, Logo, Favicon, Adresse, Telefon, WhatsApp, E-Mail, Domain, Social-Links, Register- und Steuernummer
- Personen: Max Mustermann (Geschäftsinhaber) und Erika Musterfrau (Geschäftsführerin)
- **alle Fotos:** Es waren Stockfotos mit aufmontiertem Firmenlogo und echten Gesichtern. Sie werden durch eigene
  SVG-Grafiken im Designsystem ersetzt. Das Team erscheint als gesichtslose Figuren, die Porträts als Silhouette mit
  Monogramm. Siegel, Büro, Dampfreiniger und Fensterfront sind ebenfalls SVG-Grafiken.
- Der Firmensitz „Eislingen/Fils“ wird zu Musterstadt. Die übrigen Orte des Einsatzgebiets bleiben.

Aufbau, Texte und Funktionen bleiben gleich. Interne Prüfnotizen (`data-pruefen`) werden entfernt. Oben steht der
Hinweis „Musterseite – fiktives Unternehmen“.

Ergebnis ist **eine** HTML-Datei: CSS, Schriften (base64), Grafiken (SVG als `data:`) und JS sind eingebettet.
Unterseiten liegen als `<template>` in derselben Datei. Sie öffnen sich über Hash-Adressen (`#/leistungen`,
`#/angebot?leistung=…`). Das Formular prüft die Eingaben, sendet aber nichts und zeigt danach die Danke-Ansicht.
Die Datei enthält wie bei OSG Kopf und Körper ohne Grundgerüst, das Grundgerüst setzt das Artifact.

- Bauen (immer in einer Kopie, die Skripte ändern ihren Ordner):

```sh
Z=$(mktemp -d) && cp -r ../bauen.mjs ../inhalt ../public "$Z"/ && cp umbauen.py artifact.py "$Z"/
cd "$Z" && python3 umbauen.py && node bauen.mjs && python3 artifact.py /pfad/klarwerk/index.html
```

`artifact.py` bricht ab, wenn noch echte Angaben im Ergebnis stehen. Geprüft wird auf Merys, Mustafa, Vornamen,
Krummäcker, Eislingen, beide Telefonnummern, PLZ, HRB, Steuernummer und Facebook-ID. Wurzelpfade dürfen ebenfalls
nicht übrig bleiben. Lokal testen: Die Datei mit `<!DOCTYPE html>`, charset und viewport umhüllen und über HTTP
öffnen (FEHLER 41/65).
