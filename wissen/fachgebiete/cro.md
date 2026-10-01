# CRO und UX (Anfragen, Nutzerführung, Vertrauen, Reputation)

> Key `cro` · Sources: Q-F01–Q-F07, Q-G15, Q-G32, Q-R08, Q-M05, Q-P01 · As of 2026-09-29

## 1 Ziel
Visitors become calls, reservations, appointment bookings and inquiries – without tricks, through clear guidance, complete details and trust.

## 2 Warum relevant
A well-found site without a clear next step brings the customer nothing. Evidenced: short, clearly labelled forms are much more
successful (NN/g: 78 % vs. 42 % success on the first attempt, Q-F01); contact pages need phone, address, email (Q-F02); trust comes from
design quality, open details, current content and links to external evidence (Q-F03, Q-F06).

## 3 Faktoren
One main goal per page · visible call to action on the first screen · complete contact routes · short forms · real evidence
(photos, master title, years, references) · open details (prices/price range, process, area) · readable structure (Q-F04).

## 4 Beim Programmieren
- Main button with a verb („Tisch reservieren“, „Termin buchen“, „Jetzt anrufen“), contrast against the surroundings (Q-F07), on the first screen at 390 and 1440 px.
- Fixed quick bar on the phone (call, route, inquiry) – already mandatory per `CLAUDE.md`.
- Form: ≤ 6 visible fields, one column, visible labels (no placeholder as label), `autocomplete`, required fields marked,
  error message as text at the field, response time stated, thank-you page with next step.
- `tel:+49…` (Q-M05), `mailto:` only in addition to the form.

## 5 Inhalte und Strukturen
Hero: who, what, where, next step · services with concrete benefit · evidence (team, work, certificates) · testimonials/reviews only real and
with source · contact with all routes and hours · every page ends with the next step.

## 6 Vermeiden
Several equally strong main buttons, pop-ups/interstitials, mandatory phone number in the form without reason, invented reviews or numbers,
embedded third-party review widgets (third-party scripts), color myths („red converts best“, Q-F07), F-pattern as a layout goal (Q-F04).

## 7 Automatisch umsetzbar
Quick bar, form building block from the template, thank-you page, CTA pattern in the generator.

## 8 Automatisch prüfbar
Call to action on the first screen (browser, 390 and 1440 px), contact route on every page, number of fields, labels.

## 9 Manuell prüfen
Is the main goal chosen correctly? Is the evidence real and approved? Does the site look trustworthy (W1, W7 in the Meisterstandard)?

## 10 Wie Claude die Umsetzung belegt
`QUALITAET.md` (cta-sichtbar with the found button text); state screenshots from `/meisterpruefung` (focus, error, thank-you) as paths in `abnahme.md`.

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| CRO-01 | Define one main goal per page; call to action on the first screen on phone (390 px) and computer (1440 px) | K | PB | AUTO | cta-sichtbar | F Q-F02, P Q-P01 | stabil |
| CRO-02 | All contact routes: phone (`tel:+49`), email, address, form or booking; fixed quick bar on the phone; contact route on every page | K | B | SEMI-AUTO | kontakt-jede-seite | F Q-F02, O Q-M05, P Q-P03 | stabil |
| CRO-03 | Forms: ≤ 6 visible fields, one column, visible labels, required fields marked, errors as text, response time stated | K | B | SEMI-AUTO | formular-felder, formular-label | F Q-F01, F Q-F02, F Q-F05 | stabil |
| CRO-04 | Trust evidence only real and approved: photos of team/premises/work, master title, certificates, years, references | K | P | MANUAL | | F Q-F03, F Q-F06, O Q-G15 | stabil |
| CRO-05 | Open details: prices or price range (with the customer's consent), process, service area, hours | E | P | MANUAL | | F Q-F03 | stabil |
| CRO-06 | Reviews/testimonials only real, with source and a note on whether and how authenticity is verified (§ 5b UWG); link to the profile instead of a third-party widget | E | PB | MANUAL | | G Q-R08, O Q-G32 | stabil |
| CRO-07 | Navigation short and unambiguously named (rule of thumb ≤ 7 main items); every page ends with the next step | E | P | MANUAL | | F Q-F03, P Q-P01 | stabil |
| CRO-08 | Readably structured: core info first, short paragraphs, subheadings, lists | E | P | MANUAL | | F Q-F04 | stabil |
| CRO-09 | States designed: focus, error, sending, thank-you page with next step | E | B | MANUAL | | P Q-P01 | stabil |
| CRO-10 | Main button with a verb and clear contrast against the surroundings (no „miracle color“) | E | B | MANUAL | | F Q-F07 | stabil |
| CRO-11 | After launch: count inquiries and call clicks (see `analytics.md`) and review with the customer after 4–8 weeks | Z | A | MANUAL | | P Q-P03 | stabil |

## Mythen und Unbelegtes
- „Red/orange buttons convert better“ – myth, contrast counts (Q-F07).
- „F-pattern as a layout template“ – misunderstanding, it is a warning sign (Q-F04).
- „A honeypot is enough as spam protection“ – practical knowledge, not a primary source; we combine honeypot + origin check + rate limit (see `sicherheit.md`).

## Zeitabhängig
Legal situation on reviews (Q-R08) and Google review policy (Q-G32); form studies are stable.
