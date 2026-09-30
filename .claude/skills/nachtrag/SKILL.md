---
name: nachtrag
description: Neue Ergebnisse als datierten Nachtrag in den Papier-Lagebericht (Register A–H) einheften, ohne Bestehendes zu ändern, damit Elias die ganze Entwicklung im Ordner sieht. Nutzen bei "/nachtrag", in der täglichen Nachtrags-Routine und wenn Elias einen neuen Stand zum Ausdrucken will.
---

# Nachtrag zum Lagebericht

Der Lagebericht in `ops/dokumentation/` ist ein wachsender Ordner. **Nichts wird ersetzt oder umgeschrieben**: Der
Grundbestand (`STAND-2026-09-30.html`) und alle früheren Nachträge bleiben, wie sie sind. Neues kommt als Nachtrag
hinter das passende Register. So sieht Elias die Entwicklung. Regeln für alle Blätter: Deutsch, ohne Code, für Laien,
nur Schwarz/Weiß/Grau, kleine SW-Grafiken als inline-SVG, wenn sie helfen.

## 1. Was ist neu?

- Letzte Nummer und letztes Datum: `tail -1 ops/dokumentation/nachtraege/verzeichnis.jsonl`.
- Neu seitdem: Auftragslog (`python3 ops/log.py liste`) mit Status `erledigt` oder geändertem Stand nach diesem Datum,
  gemergte PRs, neue Threads im Projekt, Sitzungen in den anderen Repos (`list_sessions`), neue Entscheidungen von Elias.
- Nichts Nennenswertes neu → **keinen** Nachtrag anlegen und nichts melden.

## 2. Einordnen

| Register | Neues gehört hierhin, wenn … |
|---|---|
| A Überblick | sich die Kurzfassung (Kennzahlen, Stand) spürbar ändert |
| B Chronik | immer: neue Sitzungen und Aufträge mit Datum und Ergebnis |
| C Projekte | neue oder geänderte Seiten, Kunden, Vorhaben |
| D Arbeitsweise und Qualität | neue Abläufe, Prüfungen, Jury-Ergebnisse, Bauzeiten |
| E Wissen und Lehren | neue Lehren, neue Fehler, neue Referenzen |
| F Geld | Preise, Kosten, Credits, Entscheidungen zu Euro-Werten |
| G Plan und Entscheidungen | Position im Plan, gefallene oder neue Entscheidungen, nächste Schritte |
| H Anhang | neue Links und Ablageorte |

Ein Nachtrag berührt meist B und G, dazu die Register, zu denen es Inhalt gibt.

## 3. Schreiben

Datei `ops/dokumentation/nachtraege/N###-JJJJ-MM-TT.html` (nächste Nummer, dreistellig). Aufbau je Register:

```html
<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Nachtrag N001</title>
<link rel="stylesheet" href="../druck.css"></head><body><div class="blatt">
<div data-reg="B">
  <div class="nachtrag-kopf"><span class="nr">Nachtrag N001</span><span>01.10.2026 · Register B</span></div>
  <section><h2><span class="nr">B4</span>Titel</h2> … <p class="verweis">Ergänzt B2 · Alle Arbeitssitzungen</p></section>
</div>
…
</div></body></html>
```

- Abschnittsnummern laufen im Register weiter (nach B3 kommt B4, auch über mehrere Nachträge).
- `verweis` nennt, welchen früheren Abschnitt der Nachtrag ergänzt oder überholt. Überholtes nie löschen,
  sondern hier sagen: „Stand von G2 überholt: Entscheidung 1 ist gefallen …“.
- In G immer die aktuelle Position im 6-Phasen-Plan (Grafik wie im Grundbestand, Bild „Wir sind hier“).
- Zahlen nur mit Quelle (Log, Git, Bericht), Euro-Werte weiter als Platzhalter kennzeichnen, bis Elias sie festlegt.

Eintrag ins Verzeichnis anhängen (eine Zeile):
`{"nr":"N001","datum":"2026-10-01","register":["B","C","G"],"titel":"…","auftraege":["A-056"]}`

## 4. Bauen, prüfen, abliefern

1. `node ops/dokumentation/baue-pdf.cjs` baut Grundbestand, Nachtragsverzeichnis, `nachtraege/pdf/<Bu>-N###.pdf`
   und `ORDNER-KOMPLETT.pdf`.
2. Jede neue Seite als Bild ansehen (pymupdf `get_pixmap`): nichts abgeschnitten, Daumenleiste frei.
3. Neue PDFs nach `/mnt/project-files/berichte/lagebericht-nachtraege/` kopieren, `ORDNER-KOMPLETT.pdf` nach
   `/mnt/project-files/berichte/`.
4. Log-Eintrag (`/auftrag`), Branch `aufbau/nachtrag-N###`, `/sichern`.
5. Elias kurz melden: welche Blätter hinter welches Register gehören, mit den PDFs als Anhang. Das neue
   Nachtragsverzeichnis (register/0b) ersetzt das alte Blatt hinter dem Registerverzeichnis; das ist das einzige
   Blatt, das ausgetauscht wird.
