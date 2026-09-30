# Betreuungs-Abo: Pakete und Wartungsplan

Die Website selbst wird einmalig berechnet (Werkvertrag). Das Abo ist ein eigener Dienstleistungsvertrag, monatlich
über Stripe Billing. Preise legst du fest; unten stehen die Kosten, die jedes Paket decken muss.

## Aufbau des Abos (Elias 2026-09-30)

Die Seite kostet **einmalig** (Sp). Der Kunde bekommt sie samt Bildern geschickt und kann sie selbst hosten. Das Abo ist
**optional**: Elias schaut monatlich über die Seite und hält sie online. Der Kunde wählt dazu Leistungen, der Monatspreis
steigt mit jeder Wahl. Ein Mietmodell ohne Einmalpreis gibt es nicht.

```
Monatspreis = Grundbetreuung + gewählte Wahlleistungen + Serverkosten
```

**Grundbetreuung** (immer im Abo, Pilotpreis 49 €/Monat): Hosting, Domain, SSL, E-Mail-Weiterleitung, wöchentliche
Prüfung (Erreichbarkeit, Header, Zertifikat), Sicherheits- und Abhängigkeits-Updates, monatlicher Kurzbericht.

**Wahlleistungen** (je Monat; nur Kundenfragen ist von Elias genannt, alle übrigen Werte Platzhalter):

| Wahlleistung | Was Elias tut | Aufschlag |
|---|---|---|
| Kundenfragen beantworten | übernimmt Anfragen vom Formular und beantwortet sie im Namen des Betriebs | **+100 €** *(Beispiel von Elias)* |
| Inhaltsänderungen | Texte, Preise, Bilder ändern, bis 1 bzw. 3 Stunden | +60 € / +150 € |
| Termine und Zahlungen betreuen | Online-Buchung und Stripe überwachen, Störungen beheben | +40 € |
| Tiefenprüfung | Fernspäherkommando prüft Design, Technik, SEO: quartalsweise / monatlich | +25 € / +60 € |
| Neue Visuals | 1× pro Quartal ein neues Bild oder kurzer Film | +50 € |
| Schnelle Antwort bei Störung | 4 Std. werktags statt 2 Werktage | +30 € |

**Serverkosten** kommen dazu (durchgereicht nach Verbrauch oder als Pauschale; Entscheidung offen, bei reinen
Cloudflare-Pages-Seiten meist 0 €).

## Kosten, die im Preis stecken müssen

Domain (ca. 1–2 €/Monat), Hosting (meist 0 €, bei Bedarf Cloudflare Paid anteilig), E-Mail-Versand, Higgsfield-Credits,
Claude-Abo anteilig, Versicherung anteilig, deine Arbeitszeit für Prüfung und Bericht. Faustregel: Das Abo soll auch
ohne Änderungswünsche deine feste Zeit pro Kunde decken.

## Wartungsplan

| Rhythmus | Was | Wie |
|---|---|---|
| wöchentlich | Erreichbarkeit, Header, Zertifikat, http→https, Rechtstexte erreichbar | `node wartung/check.mjs` (GitHub Action montags, Issue bei Befund) |
| wöchentlich | Update-PRs für Abhängigkeiten | Dependabot → Claude prüft mit `/pruefen` und `/sicherheit`, du mergst |
| monatlich | Bericht an den Kunden, Lighthouse | `/wartung` |
| laut Paket | Tiefenprüfung | `/aufklaerung https://kunde.de` (Fernspäherkommando) |
| bei Befund KRIT/HOCH | sofort beheben, Kunde informieren | Branch `fix/<slug>-…`, PR, Vorschau, Merge |

## Kundenfragen auf der Seite

Stufe 1 (jetzt): Kontaktformular → Mail an dich, Antwort innerhalb der Paket-Antwortzeit.
Stufe 2 (später): FAQ-Bereich pflegen, häufige Fragen daraus beantworten.
Stufe 3 (optional): Chat-Assistent mit Claude über eine Worker-Function, nur mit festem Wissensstand des Kunden,
klaren Grenzen und Hinweis im Datenschutz. Erst bauen, wenn ein Kunde es bezahlt.
