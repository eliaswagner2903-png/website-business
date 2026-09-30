---
name: bestellung
description: Kundenauftrag lesen und in ein Pflichtenheft übersetzen - erkennt bestellte Leistungen (SEO, Local SEO, GEO/AEO/LLMO, Technical SEO, Schema, CRO, Performance, Barrierefreiheit, Analytics, Sicherheit) mit Priorität, lädt die passenden Regeln aus wissen/fachgebiete/ und ordnet sie nach Planen/Bauen/Abnahme. Nutzen VOR dem Bauen, bei "/bestellung", bei jedem Kundenauftrag ("Website für einen Friseur, Local SEO hoch, GEO hoch") und wenn eine bestehende Seite optimiert werden soll.
---

# Bestellung → Pflichtenheft

Ziel: Anforderungen wirken **ab der Planung**, nicht erst beim Prüfen. Regeln stehen nur in `wissen/fachgebiete/`; dieses Skill wendet sie an.

1. **Auftrag festhalten.** Kunde vorhanden: `kunden/<slug>/auftrag.md` (Vorlage `vorlage/auftrag.md`, kommt mit `/neuer-kunde` mit).
   Nur ein Satz vom Nutzer („Friseur in Eislingen, Local SEO hoch, GEO hoch, CRO mittel“): zuerst testen mit
   `node werkzeuge/auftrag-lesen.mjs --text "<Satz>" --kurz`, dann die Angaben in `auftrag.md` übertragen (Format der Vorlage) –
   der Auftrag ist die schriftliche Grundlage für Umfang und Preis. Konfigurator-Anfragen („Sicherheit: Stufe 4 von 5 (Hoch)“) direkt übernehmen.
   Auftrag loggen (`/auftrag`, Bereich `kunde-<slug>`).
2. **Pflichtenheft erzeugen:** `node werkzeuge/auftrag-lesen.mjs kunden/<slug>` → `kunden/<slug>/PFLICHTENHEFT.md`.
   Ausgabe prüfen: erkannte Branche und schema.org-Typ, Fachgebiete mit Priorität, abgeleitete Grundlagen, Hinweise.
3. **Hinweise klären, nicht raten.** „Nicht verstanden“, „Ort geraten“, „Branche nicht erkannt“, Empfehlungen (z. B. Local SEO für lokalen
   Betrieb, BFSG bei Online-Buchung) → Standardwahl treffen und nennen oder, wenn es den Umfang/Preis ändert, den Nutzer fragen. Nie eigenmächtig
   Leistungen aktivieren, die der Kunde nicht bestellt hat.
4. **Lesen:** die Dateien aus „Vor dem Bauen lesen“ im Pflichtenheft (nur die aktiven Fachgebiete, höchste Priorität zuerst), dazu wie immer
   `wissen/FEHLER.md`, `wissen/MEISTERSTANDARD.md`, `wissen/DESIGN-WISSEN.md`.
5. **Planen mit dem Pflichtenheft:** Jede Regel aus „Planen“ in den Bauplan übernehmen (Seitenliste aus Suchabsichten, Stammdaten-Quelle,
   Faktenblock, Hauptziel je Seite, Fragen an den Kunden). Offene Kundenangaben als `data-pruefen` markieren, nichts erfinden.
6. **Bauen:** `/kundenseite-bauen`; die Regeln aus „Bauen“ gelten während des Bauens, nicht danach. Zwischendurch
   `node werkzeuge/qualitaet.mjs kunden/<slug>` (schnell, ≈ 5 s) laufen lassen.
7. **Abnahme:** `/abnahme`.

## Bestehende Seite optimieren
Auftrag mit den gewünschten Leistungen anlegen → Schritt 2 → `node werkzeuge/qualitaet.mjs kunden/<slug> --voll` zeigt die Lücken →
nach Priorität beheben (Muss zuerst) → `/abnahme`.

## Keine falschen Versprechen
Im Pflichtenheft, im Angebot und in Antworten an Kunden nie Platzierungen oder KI-Empfehlungen zusagen (README „Keine falschen Versprechen“, GEO-08).
