# Analytics und Messung (inkl. Conversion Tracking)

> Key `analytics` · Sources: Q-R04–Q-R07, Q-G10, Q-K06, Q-P03 · As of 2026-09-29 · **Legal matters are not legal advice.**

## 1 Ziel
The customer learns whether the site works (inquiries, calls, reservations, search clicks) – data-minimal and without a consent banner where possible.

## 2 Warum relevant
Without measurement there is no proof for the subscription and no improvement. Our standard (`CLAUDE.md`) is „no tracking, no cookies, no third-party scripts“:
that remains the baseline; measurement is built so that it complies with this rule.

## 3 Faktoren (law, as of 2026-09)
- § 25 TDDDG: storing/reading on the end device only with consent unless strictly necessary (Q-R04).
- DSK (German data protection conference): no blanket clearance for audience measurement; least critical is pure counting without further user data (margin no. 88); even
  loading third-party scripts transmits the IP (no. 101); load nothing that requires consent before consent (no. 121) (Q-R05).
- GA4 with cookies, Google Ads conversion, Meta Pixel: consent required (derived from Q-R04/Q-R05); Consent Mode changes frequently (Q-R07).
- Cloudflare Web Analytics: JS beacon without cookies according to the vendor (Q-R06) – but a third-party script, needs a CSP exception, not confirmed by authorities.

## 4 Beim Programmieren (Standardlösung)
**Own, aggregated counting:** events (form submitted, booking, optionally click on `tel:`) are counted by a Pages Function server-side as
daily counters (e.g. KV key `2026-10-01:formular`), without IP, without IDs, without cookies, without storing in the browser. Form counting happens
in the already existing `/api/kontakt` without an extra request. Click counting via `navigator.sendBeacon` to the own origin is optional.
*(The „zaehler“ building block is not yet in `vorlage/` – planned as an order.)*
Search data comes free of charge and cookieless from Search Console and Bing Webmaster Tools.

## 5 Inhalte und Strukturen
The privacy policy names every measurement (text from the generator/customer, not written yourself). With a consent solution: banner with an equally prominent „reject“.

## 6 Vermeiden
Tracking scripts „just quickly“, banners that load anyway beforehand, fingerprinting, personal data in the counter, measurement without a goal.

## 7 Automatisch umsetzbar
Counting in functions, monthly report in the maintenance run.

## 8 Automatisch prüfbar
Tracking code in the HTML, third-party origins (both also global).

## 9 Manuell prüfen
Measurement goals with the customer, Search Console/Bing accounts (the customer is the owner), privacy text, every deviation from the standard in writing.

## 10 Wie Claude die Umsetzung belegt
`QUALITAET.md` (tracking-skripte); in `abnahme.md` the defined measurement goals and the customer's decision with date.

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| ANA-01 | Define measurement goals with the customer (inquiry, call, reservation, booking, route) | K | P | MANUAL | | P Q-P03 | stabil |
| ANA-02 | Standard: own, aggregated, server-side counting without cookies, IP or IDs | K | B | MANUAL | | G Q-R04, O Q-R05 | zeitabh. |
| ANA-03 | No tracking that requires consent (GA4, Ads, Meta Pixel, Hotjar …) without a consent solution, written customer decision and privacy text | K | PB | AUTO | tracking-skripte | G Q-R04, O Q-R05, O Q-R07 | zeitabh. |
| ANA-04 | Cloudflare Web Analytics only after a decision (third-party script, CSP exception, legally unconfirmed) | E | P | MANUAL | | O Q-R06, O Q-R05 | zeitabh. |
| ANA-05 | Search Console and Bing Webmaster Tools in the customer's account, access for us (implementation: TEC-10) | E | L | MANUAL | | O Q-G10, O Q-K06 | zeitabh. |
| ANA-06 | Privacy policy names every measurement and every service | K | A | MANUAL | | G Q-R04, O Q-R05 | zeitabh. |
| ANA-07 | Monthly short report in the subscription: inquiries, calls, search clicks, anomalies | Z | A | MANUAL | | P Q-P03 | stabil |

## Mythen und Unbelegtes
- „Audience measurement never needs consent“ – the DSK rejects this across the board (Q-R05).
- „Cookieless = automatically allowed“ – § 25 TDDDG covers every access to the end device, not only cookies (Q-R04).

## Zeitabhängig (alle 6 Monate)
DSK guidance (Q-R05), Consent Mode (Q-R07), Cloudflare Web Analytics (Q-R06).
