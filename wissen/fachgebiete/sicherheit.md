# Sicherheit (Security-Basics für statische Seiten mit Functions)

> Key `sicherheit` · Sources: Q-M01–Q-M06, Q-P03 · As of 2026-09-29
> The baseline (headers, CSP, no third-party scripts, honeypot) is in the **global standard** (GLB-14 to GLB-17) and always applies.
> This area goes deeper when the customer rates security higher or has forms, booking or payment. Tools: `/sicherheit`, agent `security-auditor`.

## 1 Ziel
No exploitable vulnerabilities in our own code, no secrets in circulation, forms and payments safe against abuse.

## 2 Warum relevant
A hacked or spamming business loses trust and visibility; payments and customer data carry liability.

## 3 Faktoren
HTTP headers per OWASP (HSTS, nosniff, Referrer-Policy, Permissions-Policy, frame-ancestors, COOP) (Q-M01) · strict CSP with hash/nonce, `object-src 'none'`,
`base-uri` (Q-M02) · `_headers` does not apply to Functions responses (Q-M03) · security.txt (Q-M04) · verify spam protection server-side (Q-M06) ·
Stripe only via Checkout, webhook signature (template).

## 4 Beim Programmieren
Take over the template (`vorlage/functions/`, tests in `tests/sicherheit.test.mjs`) · Functions set their own security headers · validate input at the boundary
(lengths, types, origin) · secrets only as Cloudflare secrets · no unnecessary dependencies.

## 5 Inhalte und Strukturen
`/.well-known/security.txt` with contact and expiry date (< 1 year) · privacy policy names service providers (Cloudflare, Stripe, Resend).

## 6 Vermeiden
`unsafe-inline`/`unsafe-eval`, `*` in the CSP, CSP only as `<meta>` (no frame-ancestors), prices from the browser, secrets in the repo, third-party widgets.

## 7–10 Automatik und Beleg
Automatic: header/CSP check, secret search, site tests, security.txt. Manual: `security-auditor` run, `npm audit`, rate-limit rule in Cloudflare.
Evidence: `QUALITAET.md` + report of the `security-auditor` (file in `werkzeuge/ausgabe/`) in `abnahme.md`.

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| SEC-01 | `/sicherheit` (agent security-auditor) without KRIT/HOCH findings | K | A | MANUAL | | P Q-P03 | stabil |
| SEC-02 | Strict CSP: `default-src 'self'`, `object-src 'none'`, `base-uri`, `form-action` set | E | B | AUTO | csp-streng | F Q-M02 | zeitabh. |
| SEC-03 | Forms: origin check, length limits, honeypot, rate-limit rule in Cloudflare | K | B | SEMI-AUTO | ext-tests, formular-honigtopf | P Q-P03, O Q-M06 | stabil |
| SEC-04 | Payments only via Stripe Checkout, price server-side, webhook with signature verification (if payment) | K | B | SEMI-AUTO | ext-tests | P Q-P03 | stabil |
| SEC-05 | No secrets in `public/`, `functions/` or the repo | K | B | AUTO | geheimnisse | P Q-P03 | stabil |
| SEC-06 | Functions responses set their own security headers (`_headers` does not apply there) | E | B | SEMI-AUTO | ext-tests | O Q-M03 | zeitabh. |
| SEC-07 | Dependencies minimal, `npm audit --omit=dev` without high/critical | E | A | MANUAL | | P Q-P03 | zeitabh. |
| SEC-08 | `/.well-known/security.txt` with Contact and Expires | Z | B | AUTO | security-txt | O Q-M04 | stabil |
| SEC-09 | In case of spam: Turnstile with server-side verification (the widget alone does not protect) | Z | B | MANUAL | | O Q-M06 | zeitabh. |

## Zeitabhängig
OWASP recommendations (Q-M01, Q-M02), Cloudflare Pages behavior (Q-M03), Turnstile (Q-M06).
