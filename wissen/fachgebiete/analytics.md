# Analytics und Messung (inkl. Conversion Tracking)

> Schlüssel `analytics` · Quellen: Q-R04–Q-R07, Q-G10, Q-K06, Q-P03 · Stand 2026-09-29 · **Rechtliches ist keine Rechtsberatung.**

## 1 Ziel
Der Kunde erfährt, ob die Seite wirkt (Anfragen, Anrufe, Reservierungen, Suchklicks) – datensparsam und ohne Einwilligungsbanner, wo möglich.

## 2 Warum relevant
Ohne Messung kein Nachweis für das Abo und keine Verbesserung. Unser Standard (`CLAUDE.md`) ist „kein Tracking, keine Cookies, keine fremden Skripte“:
Das bleibt die Grundlinie; Messung wird so gebaut, dass sie diese Regel einhält.

## 3 Faktoren (Recht, Stand 2026-09)
- § 25 TDDDG: Speichern/Auslesen auf dem Endgerät nur mit Einwilligung, außer unbedingt erforderlich (Q-R04).
- DSK: keine pauschale Freigabe für Reichweitenmessung; am ehesten unkritisch ist reine Zählung ohne weitere Nutzerdaten (Rn. 88); schon das
  Laden fremder Skripte überträgt die IP (Rn. 101); vor Einwilligung nichts Einwilligungspflichtiges laden (Rn. 121) (Q-R05).
- GA4 mit Cookies, Google Ads Conversion, Meta Pixel: einwilligungspflichtig (Ableitung aus Q-R04/Q-R05); Consent Mode ändert sich häufig (Q-R07).
- Cloudflare Web Analytics: JS-Beacon ohne Cookies laut Hersteller (Q-R06) – aber fremdes Skript, CSP-Ausnahme nötig, behördlich nicht bestätigt.

## 4 Beim Programmieren (Standardlösung)
**Eigene, aggregierte Zählung:** Ereignisse (Formular gesendet, Buchung, optional Klick auf `tel:`) zählt eine Pages Function serverseitig als
Tageszähler (z. B. KV-Schlüssel `2026-10-01:formular`), ohne IP, ohne IDs, ohne Cookies, ohne Speichern im Browser. Formular-Zählung entsteht
im ohnehin vorhandenen `/api/kontakt` ohne zusätzliche Anfrage. Klick-Zählung per `navigator.sendBeacon` an die eigene Herkunft ist optional.
*(Baustein „zaehler“ ist noch nicht in `vorlage/` – als Auftrag geplant.)*
Suchdaten kommen kostenlos und cookielos aus Search Console und Bing Webmaster Tools.

## 5 Inhalte und Strukturen
Datenschutzerklärung nennt jede Messung (Text vom Generator/Kunden, nicht selbst formuliert). Bei Einwilligungslösung: Banner mit gleichwertigem „Ablehnen“.

## 6 Vermeiden
Tracking-Skripte „nur mal eben“, Banner, die trotzdem vorher laden, Fingerprinting, personenbezogene Daten im Zähler, Messung ohne Ziel.

## 7 Automatisch umsetzbar
Zählung in Functions, Monatsbericht im Wartungslauf.

## 8 Automatisch prüfbar
Tracking-Code im HTML, fremde Herkünfte (beide auch global).

## 9 Manuell prüfen
Messziele mit dem Kunden, Konten Search Console/Bing (Kunde ist Eigentümer), Datenschutztext, jede Abweichung vom Standard schriftlich.

## 10 Wie Claude die Umsetzung belegt
`QUALITAET.md` (tracking-skripte); in `abnahme.md` die festgelegten Messziele und die Entscheidung des Kunden mit Datum.

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| ANA-01 | Messziele mit dem Kunden festlegen (Anfrage, Anruf, Reservierung, Buchung, Route) | K | P | MANUAL | | P Q-P03 | stabil |
| ANA-02 | Standard: eigene, aggregierte, serverseitige Zählung ohne Cookies, IP oder IDs | K | B | MANUAL | | G Q-R04, O Q-R05 | zeitabh. |
| ANA-03 | Kein einwilligungspflichtiges Tracking (GA4, Ads, Meta Pixel, Hotjar …) ohne Consent-Lösung, schriftliche Kundenentscheidung und Datenschutztext | K | PB | AUTO | tracking-skripte | G Q-R04, O Q-R05, O Q-R07 | zeitabh. |
| ANA-04 | Cloudflare Web Analytics nur nach Entscheidung (fremdes Skript, CSP-Ausnahme, rechtlich nicht bestätigt) | E | P | MANUAL | | O Q-R06, O Q-R05 | zeitabh. |
| ANA-05 | Search Console und Bing Webmaster Tools im Konto des Kunden, Zugriff für uns (Umsetzung: TEC-10) | E | L | MANUAL | | O Q-G10, O Q-K06 | zeitabh. |
| ANA-06 | Datenschutzerklärung nennt jede Messung und jeden Dienst | K | A | MANUAL | | G Q-R04, O Q-R05 | zeitabh. |
| ANA-07 | Monatlicher Kurzbericht im Abo: Anfragen, Anrufe, Suchklicks, Auffälligkeiten | Z | A | MANUAL | | P Q-P03 | stabil |

## Mythen und Unbelegtes
- „Reichweitenmessung ist immer einwilligungsfrei“ – DSK lehnt das pauschal ab (Q-R05).
- „Cookielos = automatisch erlaubt“ – § 25 TDDDG betrifft jeden Zugriff auf das Endgerät, nicht nur Cookies (Q-R04).

## Zeitabhängig (alle 6 Monate)
DSK-Orientierungshilfe (Q-R05), Consent Mode (Q-R07), Cloudflare Web Analytics (Q-R06).
