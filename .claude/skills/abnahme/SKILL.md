---
name: abnahme
description: Quality Gate einer Kundenseite gegen den Kundenauftrag - prüft den globalen Mindeststandard und jede bestellte Leistung (SEO, Local SEO, GEO, Schema, CRO, Performance, Barrierefreiheit, Analytics, Sicherheit) automatisch und per belegter Bestätigung, behebt Fehler und prüft erneut. Nutzen bevor eine Seite als fertig gemeldet wird, bei "/abnahme", "Quality Gate", "ist die Seite fertig?".
---

# Abnahme (Quality Gate)

Eine Seite ist erst fertig, wenn `QUALITAET.md` **BESTANDEN** (oder BESTANDEN MIT HINWEISEN, Soll-Punkte begründet) zeigt.
Nie „fertig“ melden ohne diesen Bericht.

1. **Prüfen:** `node werkzeuge/qualitaet.mjs kunden/<slug> --voll` (Lighthouse, Budget, Breiten: einige Minuten; nach jeder
   Behebung reicht zuerst der schnelle Lauf ohne `--voll`). Ohne `auftrag.md` gilt nur der globale Standard – dann zuerst `/bestellung`.
2. **Jeden Fehler (✗) abarbeiten:**
   1. Problem dokumentieren (Regel-ID, Seite, Befund aus dem Bericht).
   2. Ursache bestimmen (Generator? Daten? Vorlage? Werkzeug irrt?).
   3. Beheben – an der Quelle (Inhalts-JSON, `bauen.mjs`, `marke.css`), nicht im erzeugten HTML.
   4. Erneut prüfen.
   5. Erst dann gilt die Zeile als bestanden. Irrt das Werkzeug (Fehlalarm): Prüfung in `werkzeuge/qualitaet.mjs` korrigieren,
      Beispiel als Test ergänzen, in `wissen/FEHLER.md` notieren – nie die Regel stillschweigend übergehen.
3. **Manuelle Punkte (○, ◐)** in `kunden/<slug>/abnahme.md` prüfen und mit `[x]` + Beleg bestätigen: Screenshot-Pfad, Datei:Zeile,
   Messwert oder Aussage des Kunden mit Datum. Ohne nachprüfbaren Beleg zählt es nicht („ok“ reicht nicht, das Werkzeug prüft das). Punkte, die nur der Kunde oder Elias klären kann
   (Unternehmensprofil, Freigabe der Texte, BFSG-Einordnung, Trainings-Crawler), gesammelt dem Nutzer vorlegen.
   Nicht zutreffend (z. B. nur ein Standort) = bestätigen mit Beleg „trifft nicht zu, weil …“. ◐ heißt auch: das Werkzeug fand
   nichts zu prüfen (z. B. kein JSON-LD) – das ist kein Bestehen.
   Ohne `--voll` endet ein sonst sauberer Lauf mit VORLÄUFIG; erst der volle Lauf kann BESTANDEN ergeben.
4. **Sichtprüfung:** `/meisterpruefung` (W1–W7, Zustands-Screenshots) – Beleg für GLB-24, CRO-09, A11Y-01.
5. **Sicherheit** bei Formular/Buchung/Zahlung oder bestellter Sicherheit: `/sicherheit` – Beleg für SEC-01.
6. **Melden** im Format des Berichts, gruppiert wie `QUALITAET.md`:
   ```
   GLOBAL         ✓ 24/24
   LOCAL SEO      ✓ 9/11 · offen: LOC-06 Unternehmensprofil (Kunde), LOC-08 Bewertungen (Kunde)
   GEO / KI-SUCHE ✓ …
   Urteil: BESTANDEN MIT HINWEISEN · Muss offen 0 · Soll offen 2 (begründet)
   ```
   Keine Ranking- oder KI-Versprechen im Bericht (GEO-08).
7. `/sichern` – `auftrag.md`, `PFLICHTENHEFT.md`, `abnahme.md`, `QUALITAET.md` werden mit der Seite versioniert.

## Nach dem Launch (Wartung)
Regeln mit Phase **L** (↻ im Bericht: TEC-08 Weiterleitungen, TEC-10/ANA-05 Search Console, LOC-06 Unternehmensprofil, LOC-08 Bewertungen,
PERF-10 Feldwerte, GEO-10 KI-Berichte) blockieren die Abnahme nicht. Im ersten Wartungslauf prüfen und in `abnahme.md` belegen.
GEO-01 (Cloudflare-Bot-Einstellungen) vor dem Launch im Cloudflare-Projekt prüfen.
