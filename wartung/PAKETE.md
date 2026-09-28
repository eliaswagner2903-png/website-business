# Betreuungs-Abo: Pakete und Wartungsplan

Die Website selbst wird einmalig berechnet (Werkvertrag). Das Abo ist ein eigener Dienstleistungsvertrag, monatlich
über Stripe Billing. Preise legst du fest; unten stehen die Kosten, die jedes Paket decken muss.

## Pakete (Entwurf, Preise offen)

| | Basis | Plus | Premium |
|---|---|---|---|
| Hosting, Domain, SSL, E-Mail-Weiterleitung | ✓ | ✓ | ✓ |
| Wöchentliche Prüfung (Erreichbarkeit, Header, Zertifikat) | ✓ | ✓ | ✓ |
| Sicherheits- und Abhängigkeits-Updates | ✓ | ✓ | ✓ |
| Monatlicher Kurzbericht | ✓ | ✓ | ✓ |
| Inhaltsänderungen pro Monat | – | bis 1 Std. | bis 3 Std. |
| Fernspäher-Tiefenprüfung (Design, Technik, SEO) | jährlich | quartalsweise | monatlich |
| Neue Visuals (Higgsfield) | – | – | 1× pro Quartal |
| Antwortzeit bei Störung | 2 Werktage | 1 Werktag | 4 Std. werktags |
| Online-Terminbuchung und Zahlungen betreuen | – | ✓ | ✓ |

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
