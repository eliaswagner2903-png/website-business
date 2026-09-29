---
name: neuer-kunde
description: Eine neue Kundenseite aus der Vorlage anlegen - Ordner kunden/<slug>, Stammdaten, Branch, Wartungseintrag, Auftragslog. Nutzen bei "/neuer-kunde", "neuer Kunde", "neue Website für …".
---

# Neue Kundenseite

1. Slug festlegen: klein, Bindestriche, eindeutig (z. B. `urfa-sofrasi`). Auftrag loggen (`/auftrag`, Bereich `kunde-<slug>`).
2. Branch: `git switch -c kunde/<slug>`.
3. Kopieren: `cp -r vorlage kunden/<slug>` (ohne `node_modules`), dann `kunden/<slug>/kunde.json`,
   `wrangler.toml` (`name`, `SEITE_URL`, `PRODUKTE`) und Titel/Texte ausfüllen. Nur bestätigte Fakten, Rest `data-pruefen`.
3a. **Klärungsfragen vor dem Design** (auch wenn der Auftrag klar scheint): Wer ist die Zielgruppe? Welche Stimmung
   (3 Adjektive)? Was ist der eine nächste Schritt für Besucher (anrufen, reservieren, anfragen)? Gibt es ein
   Produkt oder einen Moment, der sich als Hero-Bild/-Film eignet? Welche Seiten gefallen dem Kunden? Antworten in
   `kunde.json` bzw. `kunden/<slug>/brief.md`. (Aus Referenz-Video Metics Media, A-045.)
4. Design: Tokens in `public/css/stil.css` anpassen. Für Varianten das Brüder-Verfahren nutzen (2–3 Varianten, Kunde wählt).
   Vorher `wissen/FEHLER.md`, `wissen/DESIGN-WISSEN.md`, `wissen/STOLPERFALLEN-URFA.md` lesen.
5. Schriften lokal: `npm i @fontsource-variable/<schrift>` und die woff2-Dateien nach `public/fonts/` kopieren.
6. Visuals: Agent `visual-higgsfield`.
7. `wartung/kunden.json` ergänzen (`aktiv: false` bis zum Launch).
8. `/pruefen` und `/sicherheit`, dann `/sichern` (PR mit Vorschau-Link aus Cloudflare).
