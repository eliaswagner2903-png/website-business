# Sicherheit (Security-Basics für statische Seiten mit Functions)

> Schlüssel `sicherheit` · Quellen: Q-M01–Q-M06, Q-P03 · Stand 2026-09-29
> Die Grundlinie (Header, CSP, keine Fremdskripte, Honigtopf) steht im **globalen Standard** (GLB-14 bis GLB-17) und gilt immer.
> Dieses Fachgebiet vertieft, wenn der Kunde Sicherheit höher stuft oder Formulare, Buchung oder Zahlung hat. Werkzeuge: `/sicherheit`, Agent `security-auditor`.

## 1 Ziel
Keine ausnutzbaren Schwachstellen im eigenen Code, keine Geheimnisse im Umlauf, Formulare und Zahlungen missbrauchssicher.

## 2 Warum relevant
Ein gehackter oder spammender Betrieb verliert Vertrauen und Sichtbarkeit; Zahlungen und Kundendaten haften.

## 3 Faktoren
HTTP-Header nach OWASP (HSTS, nosniff, Referrer-Policy, Permissions-Policy, frame-ancestors, COOP) (Q-M01) · strikte CSP mit Hash/Nonce, `object-src 'none'`,
`base-uri` (Q-M02) · `_headers` gilt nicht für Functions-Antworten (Q-M03) · security.txt (Q-M04) · Spamschutz serverseitig prüfen (Q-M06) ·
Stripe nur per Checkout, Webhook-Signatur (Vorlage).

## 4 Beim Programmieren
Vorlage übernehmen (`vorlage/functions/`, Tests in `tests/sicherheit.test.mjs`) · Functions setzen eigene Sicherheits-Header · Eingaben an der Grenze prüfen
(Längen, Typen, Origin) · Geheimnisse nur als Cloudflare-Secrets · keine unnötigen Abhängigkeiten.

## 5 Inhalte und Strukturen
`/.well-known/security.txt` mit Kontakt und Ablaufdatum (< 1 Jahr) · Datenschutzerklärung nennt Dienstleister (Cloudflare, Stripe, Resend).

## 6 Vermeiden
`unsafe-inline`/`unsafe-eval`, `*` in der CSP, CSP nur als `<meta>` (kein frame-ancestors), Preise aus dem Browser, Geheimnisse im Repo, Fremd-Widgets.

## 7–10 Automatik und Beleg
Automatisch: Header-/CSP-Prüfung, Geheimnis-Suche, Tests der Seite, security.txt. Manuell: `security-auditor`-Lauf, `npm audit`, Rate-Limit-Regel in Cloudflare.
Beleg: `QUALITAET.md` + Meldung des `security-auditor` (Datei in `werkzeuge/ausgabe/`) in `abnahme.md`.

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| SEC-01 | `/sicherheit` (Agent security-auditor) ohne Mängel KRIT/HOCH | K | A | MANUAL | | P Q-P03 | stabil |
| SEC-02 | CSP streng: `default-src 'self'`, `object-src 'none'`, `base-uri`, `form-action` gesetzt | E | B | AUTO | csp-streng | F Q-M02 | zeitabh. |
| SEC-03 | Formulare: Origin-Prüfung, Längengrenzen, Honigtopf, Rate-Limit-Regel in Cloudflare | K | B | SEMI-AUTO | ext-tests, formular-honigtopf | P Q-P03, O Q-M06 | stabil |
| SEC-04 | Zahlungen nur über Stripe Checkout, Preis serverseitig, Webhook mit Signaturprüfung (falls Zahlung) | K | B | SEMI-AUTO | ext-tests | P Q-P03 | stabil |
| SEC-05 | Keine Geheimnisse in `public/`, `functions/` oder im Repo | K | B | AUTO | geheimnisse | P Q-P03 | stabil |
| SEC-06 | Functions-Antworten setzen eigene Sicherheits-Header (`_headers` gilt dort nicht) | E | B | SEMI-AUTO | ext-tests | O Q-M03 | zeitabh. |
| SEC-07 | Abhängigkeiten minimal, `npm audit --omit=dev` ohne hoch/kritisch | E | A | MANUAL | | P Q-P03 | zeitabh. |
| SEC-08 | `/.well-known/security.txt` mit Contact und Expires | Z | B | AUTO | security-txt | O Q-M04 | stabil |
| SEC-09 | Bei Spam: Turnstile mit serverseitiger Prüfung (Widget allein schützt nicht) | Z | B | MANUAL | | O Q-M06 | zeitabh. |

## Zeitabhängig
OWASP-Empfehlungen (Q-M01, Q-M02), Cloudflare-Pages-Verhalten (Q-M03), Turnstile (Q-M06).
