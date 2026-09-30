# Weg zum ersten zahlenden Kunden

> Auftrag A-056, Stand **2026-09-30**. Plan von Stahl auf Elias' Anweisung „überlege und folge einem Plan, damit wir
> einen großen Schritt näher zum ersten zahlenden Kunden sind“. Euro-Beträge sind Vorschläge, bis Elias entscheidet.

## 1. Lage: Wo der Engpass liegt

Das Können ist belegt: 11 Seiten, Lighthouse 97–100, fremde Jury 75,75/100. Am Können liegt es nicht mehr.
Es fehlen vier Dinge, und nur eines davon braucht lange:

| Engpass | Warum er bremst | Dauer |
|---|---|---|
| **Steuernummer** | Ohne sie keine ordentliche Rechnung (§ 34a UStDV). Kommt erst nach Gewerbeanmeldung und ELSTER-Fragebogen vom Finanzamt. | **einige Wochen**, deshalb der kritische Pfad |
| Ein fester Preis | Formel und Euro-Werte sind Platzhalter; einem Wirt kann man keine Formel zeigen. | sofort lösbar (Pilotangebot) |
| Ein Kunde, der „ja“ sagt | Noch niemand wurde gefragt. | ein Gespräch |
| Unterlagen fürs Gespräch | Es gab keine Mappe, die ein Betreiber in 2 Minuten versteht. | sofort lösbar (Verkaufsmappe) |

**Folgerung:** Der größte Schritt ist, zwei Dinge **gleichzeitig** anzustoßen: den Amtsweg (weil er Wochen läuft)
und das erste Gespräch (weil die Seite schon fertig ist). Bis die Steuernummer kommt, ist der Kunde gewonnen und
die Seite abgestimmt.

## 2. Der Pilotkunde: URFA SOFRASI

Warum gerade URFA SOFRASI (Mühlbachstraße 2, Eislingen/Fils):

- Die neue Seite ist **fertig** (Meistervariante, `kunden/urfa-meister/`). Der Kunde sieht das Ergebnis, bevor er
  irgendetwas zusagt. Kein anderer Kandidat hat das.
- Der Unterschied ist **gemessen**, heute, an der echten alten Seite (Lighthouse mobil, je 3 bzw. 2 Läufe):

  | | alte Seite (live) | neue Seite |
  |---|---|---|
  | Leistung (Google-Prüfwert) | 70–76 | 98 |
  | Suchmaschinen-Grundlagen | 91 (keine Seitenbeschreibung) | 100 |
  | Barrierefreiheit / Best Practices | 98 / 96 | 100 / 100 |
  | Größtes Element sichtbar nach | 4,5–5,5 s | 2,3–2,4 s |
  | Datenmenge Startseite | 1,24 MB | 0,27 MB |

  Messweg: alte Seite live über das Internet, neue Seite lokal mit echten Headern; beide mit Lighthouse-Mobilprofil
  (simulierte Drosselung, damit vergleichbar). Screenshots: `vertrieb/urfa-sofrasi/bilder/`.
- Das Risiko für den Betreiber ist null: Er zahlt erst, wenn die Seite online ist.

Zweiter Kandidat, falls URFA ablehnt: **Hairstyle by Ümit** (drei fertige Varianten aus dem Brüder-Wettbewerb).

## 3. Der Plan in 5 Zügen

| Zug | Was | Wer | Stand |
|---|---|---|---|
| 1 | Pilotangebot mit festen Preisen (Marktvergleich) | Stahl | ✅ `vertrieb/PILOTANGEBOT.md`, `vertrieb/MARKTPREISE.md` |
| 2 | Verkaufsmappe URFA (Vorher/Nachher, Zahlen, Angebot) und Gesprächsleitfaden | Stahl | ✅ `vertrieb/urfa-sofrasi/` |
| 3 | Startklar-Liste: kürzester Weg bis zur ersten Rechnung | Stahl | ✅ `vertrieb/STARTKLAR.md` |
| 4 | **Gewerbe anmelden + ELSTER-Fragebogen** (startet die Wochen-Uhr) | **Elias** | offen, Entscheidung E1 |
| 5 | **Gespräch mit dem Betreiber** von URFA, persönlich, Mappe ausgedruckt dabei | **Elias** | offen, Entscheidung E3 |

Danach (sobald „ja“ und Steuernummer da): Inhalte bestätigen lassen (Öffnungszeiten, E-Mail, Allergen-Legende,
Impressum und Datenschutz vom Betreiber), Cloudflare-Konto, Domain umstellen, `/abnahme`, Rechnung, Livegang.

## 4. Was bewusst nicht passiert ist

- Niemand wurde kontaktiert, nichts angemeldet, nichts bezahlt.
- Keine Rechtstexte oder Vertragstexte formuliert; Vertragsmuster kommen aus seriöser Quelle (`STARTKLAR.md`).
- Die Mappe ist ein **Entwurf** für Elias und wird erst nach seinem OK gezeigt.
