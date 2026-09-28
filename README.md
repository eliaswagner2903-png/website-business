# Website-Business

Werkstatt für High-End-Kundenwebsites: bauen mit Claude Code, hosten auf Cloudflare, betreuen im Monats-Abo.

## Schnellstart

```bash
cd werkzeuge && npm install && cd ..                 # Prüfwerkzeuge
cd vorlage && npm test && cd ..                      # 12 Tests: Stripe, Kontakt, CSP, Geheimnisse
node werkzeuge/gzserver.mjs 8080 vorlage/public      # Vorlage lokal mit echten Sicherheits-Headern
python3 ops/log.py liste --offen                     # offene Aufträge
```

Neue Kundenseite: in Claude `/neuer-kunde`. Alles Weitere steht in [`CLAUDE.md`](CLAUDE.md).

## Stand der Vorlage

| Prüfung | Ergebnis |
|---|---|
| Lighthouse mobil (Startseite) | Performance 100 · Barrierefreiheit 100 · Best Practices 100 · SEO 100 |
| Breiten 320–1920 px, ohne JS, reduzierte Bewegung | ohne Befund |
| Tests (Webhook-Signatur, Checkout-Whitelist, CSRF, Honigtopf, CSP, Geheimnisse) | 12 von 12 grün |

## Wegweiser

- [`hosting/CLOUDFLARE.md`](hosting/CLOUDFLARE.md) – Hosting, Domain, Schutz, Variablen
- [`wartung/PAKETE.md`](wartung/PAKETE.md) – Abo-Pakete und Wartungsplan
- [`recht/LEITFADEN.md`](recht/LEITFADEN.md) – Gewerbe, Steuern, Buchhaltung, Verträge
- [`ops/HAENDE.md`](ops/HAENDE.md) – was du selbst erledigen musst
- [`ops/WIE-ICH-ARBEITE.md`](ops/WIE-ICH-ARBEITE.md) – wie Claude funktioniert
