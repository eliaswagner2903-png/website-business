# Hosting auf Cloudflare Pages

Warum Cloudflare: kostenlose Stufe reicht für Kundenseiten, eingebauter Schutz gegen DDoS und Bots, HTTPS automatisch,
Functions für Stripe und Kontaktformular direkt neben der Seite, Turnstile als datensparsames Captcha.
Alternative für Kunden, die „Server in Deutschland“ verlangen: statische Seite bei einem deutschen Apache-Hoster
(`.htaccess` aus dem URFA-Repo), Formulare/Zahlung dann über einen eigenen kleinen Dienst. Das ist die Ausnahme.

## Einmalig (deine Hände, siehe `ops/HAENDE.md`)

1. Konto auf https://dash.cloudflare.com anlegen, 2-Faktor-Anmeldung einschalten.
2. **AV-Vertrag (DPA)** akzeptieren: Dashboard → Manage Account → Configurations → Privacy / DPA. Nötig für DSGVO.
3. Workers & Pages → Create → Pages → **Connect to Git** → Repo `website-business` auswählen.

## Pro Kundenseite

| Einstellung | Wert |
|---|---|
| Projektname | `slug` aus `kunden/<slug>/kunde.json` |
| Production branch | `main` |
| Root directory | `kunden/<slug>` |
| Build command | leer lassen (reine Dateien) |
| Build output directory | `public` |

Jeder andere Branch bekommt automatisch eine **Vorschau-URL** (`<branch>.<slug>.pages.dev`). Die schickst du dem Kunden
zur Freigabe; erst nach dem Merge in `main` ist die Änderung live.

Variablen (Settings → Variables and Secrets), für **Production** und **Preview** getrennt:

| Name | Art | Inhalt |
|---|---|---|
| `SEITE_URL` | Text | `https://www.kunde.de` (Preview: die pages.dev-Adresse) |
| `PRODUKTE` | Text | JSON mit Stripe-Preis-IDs, siehe `wrangler.toml` |
| `STRIPE_SECRET_KEY` | Secret | Restricted Key: nur „Checkout Sessions: Write“. Preview: nur Test-Key |
| `STRIPE_WEBHOOK_SECRET` | Secret | `whsec_…` vom Webhook-Endpunkt `https://www.kunde.de/api/stripe-webhook` |
| `RESEND_API_KEY`, `KONTAKT_AN`, `KONTAKT_VON` | Secret/Text | Kontaktformular |
| `TURNSTILE_SECRET` | Secret | optional, dann Widget + CSP-Eintrag ergänzen |

## Domain

Custom domains → `www.kunde.de` hinzufügen. Liegt die Domain beim Kunden: er setzt einen CNAME auf
`<slug>.pages.dev`. Besser: Domain-Verwaltung zu Cloudflare umziehen (Nameserver), dann setzt Cloudflare alles selbst.
Die Domain bleibt **immer auf den Namen des Kunden** registriert.

## Schutz einschalten (pro Domain, 5 Minuten)

- SSL/TLS → Modus **Full (strict)**, „Always Use HTTPS“ an, minimale TLS-Version 1.2.
- Security → WAF → **Rate limiting rule**: Pfad `/api/*`, 10 Anfragen pro Minute pro IP → Block. Schützt Formular und Checkout vor Missbrauch.
- Security → Bots → „Bot Fight Mode“ an.
- DNSSEC an (wenn die Domain bei Cloudflare liegt).

## Deploy ohne Git-Anbindung (Notfall)

```bash
cd kunden/<slug>
npx wrangler login
npx wrangler pages deploy public --project-name <slug>
```

Oder GitHub Actions: `.github/workflows/deploy.yml` (manuell starten, braucht `CLOUDFLARE_API_TOKEN` und
`CLOUDFLARE_ACCOUNT_ID` als Repo-Secrets).

## Claude-Anbindung

Cloudflare bietet offizielle MCP-Server für Claude (Dokumentation, Bindings, Logs, Analytics). Aktuelle Adressen:
https://developers.cloudflare.com/agents/model-context-protocol/ → „MCP servers for Cloudflare“. Anmeldung per OAuth.
Nie einen globalen API-Key hinterlegen, immer einen Token mit genau den nötigen Rechten.

## Kosten (Stand 09/2026, vor Angebot prüfen)

Pages und Functions: kostenlose Stufe mit Tageslimit für Function-Aufrufe, reicht für normale Kundenseiten.
Workers Paid ab ca. 5 US-$/Monat für das ganze Konto, wenn Limits erreicht werden. Domain ca. 10–20 €/Jahr.
Resend: kostenlose Stufe für wenige tausend Mails im Monat. Stripe: nur Gebühren pro Zahlung.
