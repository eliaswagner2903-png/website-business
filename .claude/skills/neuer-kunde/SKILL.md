---
name: neuer-kunde
description: Eine neue Kundenseite aus der Vorlage anlegen - Ordner kunden/<slug>, Stammdaten, Branch, Wartungseintrag, Auftragslog. Nutzen bei "/neuer-kunde", "neuer Kunde", "neue Website für …".
---

# Neue Kundenseite

1. Slug festlegen: klein, Bindestriche, eindeutig (z. B. `urfa-sofrasi`). Auftrag loggen (`/auftrag`, Bereich `kunde-<slug>`).
2. Branch: `git switch -c kunde/<slug>`.
3. Kopieren: `cp -r vorlage kunden/<slug>` (ohne `node_modules`), dann `kunden/<slug>/kunde.json`,
   `wrangler.toml` (`name`, `SEITE_URL`, `PRODUKTE`) und Titel/Texte ausfüllen. Nur bestätigte Fakten, Rest `data-pruefen`.
4. Design: Tokens in `public/css/stil.css` anpassen. Für Varianten das Brüder-Verfahren nutzen (2–3 Varianten, Kunde wählt).
   Vorher `wissen/FEHLER.md`, `wissen/DESIGN-WISSEN.md`, `wissen/STOLPERFALLEN-URFA.md` lesen.
5. Schriften lokal: `npm i @fontsource-variable/<schrift>` und die woff2-Dateien nach `public/fonts/` kopieren.
6. Visuals: Agent `visual-higgsfield`.
7. `wartung/kunden.json` ergänzen (`aktiv: false` bis zum Launch).
8. `/pruefen` und `/sicherheit`, dann `/sichern` (PR mit Vorschau-Link aus Cloudflare).
