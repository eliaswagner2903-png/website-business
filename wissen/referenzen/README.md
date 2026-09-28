# Referenzen – was andere Websites gut machen

Hier landen die Aufklärungsberichte von **Hfw Fortenbacher** (Fernspäherkommando) über fremde Websites. Stahl wertet
sie aus und nimmt das Übertragbare ins eigene System auf. **Es wird nichts kopiert:** keine Texte, Bilder, Logos oder
Code von fremden Seiten. Übernommen werden Ideen, Muster und Maßstäbe, jeweils neu umgesetzt.

## Ablauf

1. **Eingang:** Der Bericht (Dossier) kommt unverändert nach `eingang/<JJJJ-MM-TT>-<domain>.md`. Wer ihn bringt,
   ist egal: Fortenbacher aus seinem Repo, Elias per Datei, oder `/aufklaerung` hier im Repo.
2. **Auswertung** (`/referenz`): Stahl füllt `VORLAGE.md` aus, speichert sie als `ausgewertet/<gleicher Name>.md`
   und verschiebt das Dossier mit dorthin.
3. **Übernahme:** Jedes übertragbare Muster bekommt eine Zeile in `MUSTER.md` mit Ziel:
   - `DESIGN-WISSEN` – Gestaltungsregel, Tempo, Typografie
   - `MEISTERSTANDARD` – neuer oder strengerer Maßstab
   - `BAUKASTEN` – neuer Baustein in `vorlage/bausteine/` (dann als eigener Auftrag loggen)
   - `FEHLER` – was die fremde Seite falsch macht und wir vermeiden
4. **Referenzliste:** Die Seite kommt in `REFERENZLISTE.md`, damit man sie bei künftigen Projekten nach Branche
   und Stil wiederfindet (z. B. „edle Handwerksseite als Vorbild zeigen“).

## Regeln

- Nur beobachten, was öffentlich im Browser sichtbar ist. Kein Scannen, kein Angreifen.
- Messwerte (Lighthouse, Gewicht, fps) mit Datum; fremde Seiten ändern sich.
- Ein Muster gilt erst als übernommen, wenn es im Ziel (Datei oder Baustein) wirklich steht – dann Status `drin`.
- Schwächen der fremden Seite sind genauso wertvoll wie Stärken: als `FEHLER` festhalten.
