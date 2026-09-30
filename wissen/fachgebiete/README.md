# Fachgebiete – Wissen, Regeln und Prüfungen für Kunden-Websites

> Aufgebaut mit A-051 (2026-09-29). Kette: **Recherche → Regel → Umsetzung → Prüfung.**
> Quellen: `wissen/quellen/QUELLEN.md` · Aktualisierung: `wissen/quellen/AKTUALISIERUNG.md` ·
> Abläufe: `/bestellung`, `/kundenseite-bauen`, `/abnahme` · Werkzeuge: `werkzeuge/auftrag-lesen.mjs` (Auftrag → Pflichtenheft), `werkzeuge/qualitaet.mjs` (Quality Gate).

## So wird es benutzt

1. Kundenauftrag steht in `kunden/<slug>/auftrag.md` (Vorlage `vorlage/auftrag.md`) oder als Satz („Friseur in Göppingen, Local SEO hoch, GEO hoch, CRO mittel“).
2. `/bestellung` → `node werkzeuge/auftrag-lesen.mjs kunden/<slug>` schreibt `PFLICHTENHEFT.md`: aktive Fachgebiete, Prioritäten,
   welche Dateien hier zu lesen sind, und jede Regel sortiert nach **Planen · Bauen · Abnahme**.
3. Gebaut wird nach `/kundenseite-bauen`, das Pflichtenheft ist das Briefing.
4. `/abnahme` → `node werkzeuge/qualitaet.mjs kunden/<slug> --voll` prüft jede aktive Regel, schreibt `QUALITAET.md`, verlangt für
   manuelle Punkte eine Bestätigung mit Beleg in `abnahme.md`. Erst „BESTANDEN“ heißt fertig.

## Fachgebiete (maschinenlesbar – die Werkzeuge lesen diese Tabelle)

| Schlüssel | Fachgebiet | Datei | Auch genannt | Setzt voraus |
|---|---|---|---|---|
| `global` | Globaler Mindeststandard | GLOBAL.md | Mindeststandard, Mobile, Mobile Optimization, Mobile-Optimierung, Responsive, Semantic HTML, Semantisches HTML | – |
| `seo` | SEO (On-Page, Inhalte) | seo.md | On-Page SEO, Onpage SEO, OnPage, Suchmaschinenoptimierung, Content, Content Strategy, Content-Strategie, Search Intent, Suchintention, Internal Linking, Interne Verlinkung, Image SEO, Bilder-SEO, Metadata, Metadaten | technical-seo |
| `technical-seo` | Technical SEO | technical-seo.md | Technisches SEO, Tech SEO, Technical, Indexierung, Crawling, Sitemap, Robots, Robots.txt, Canonicals, Canonical, Website Architecture, Seitenarchitektur | – |
| `local-seo` | Local SEO | local-seo.md | Lokales SEO, Lokale SEO, Local, Google Maps, Maps, Google Business Profile, Google Unternehmensprofil, GBP, Local Business, Entity Signals, Entitätssignale, NAP | structured-data, technical-seo |
| `structured-data` | Strukturierte Daten | structured-data.md | Structured Data, Schema, Schema.org, JSON-LD, Rich Results, Rich Snippets | – |
| `geo` | GEO / KI-Suche | geo.md | GEO, AEO, LLMO, AIO, AI SEO, AI Search, AI Search Visibility, KI-Suche, KI-Sichtbarkeit, Generative Engine Optimization, Answer Engine Optimization, Large Language Model Optimization, ChatGPT, Perplexity, AI Overviews | seo, technical-seo, structured-data |
| `cro` | CRO und UX | cro.md | Conversion, Conversion Rate Optimization, Conversion-Optimierung, UX, User Experience, Nutzerführung, Trust, Trust Signals, Vertrauen, Vertrauenssignale, Reputation, Bewertungen | – |
| `accessibility` | Barrierefreiheit | accessibility.md | Accessibility, A11y, WCAG, BFSG, Barrierefrei | – |
| `performance` | Performance | performance.md | Web Performance, Core Web Vitals, CWV, Ladezeit, Geschwindigkeit, Page Speed, PageSpeed, Speed | – |
| `analytics` | Analytics und Messung | analytics.md | Analytics, Webanalyse, Tracking, Conversion Tracking, Conversion-Tracking, Messung, Statistik, Reichweitenmessung | – |
| `sicherheit` | Sicherheit | sicherheit.md | Security, Security-Basics, Sicherheits-Basics, Websicherheit | – |

Neues Fachgebiet: Zeile ergänzen, Datei nach dem Muster unten anlegen, `node --test werkzeuge/tests/*.test.mjs` laufen lassen.

## Begriffe ohne eigene Datei (bewusst zusammengelegt, keine Doppelstruktur)

| Begriff | Wo es steht | Warum |
|---|---|---|
| GEO, AEO, LLMO, AIO, „AI SEO“ | `geo.md` | Gleiche Aufgabe (in KI-Antworten vorkommen). Google: „optimizing for generative AI search is … still SEO“ (Q-G20). Nur „GEO“ ist als Forschungsbegriff definiert (Q-K11). Unterschiede sind Marketing. |
| Content Strategy, Search Intent, Internal Linking, Image SEO, Metadaten | `seo.md` | Teile von On-Page-SEO; eigene Dateien würden sich wiederholen. |
| Sitemap, Robots, Canonicals, Website-Architektur | `technical-seo.md` | Crawling und Indexierung. |
| Local Business, Entity Signals, NAP, Google Business Profile | `local-seo.md` | Entität „Betrieb an einem Ort“; Schema-Details in `structured-data.md`. |
| UX, Trust Signals, Reputation | `cro.md` | Bei Firmenseiten entscheidet Nutzerführung und Vertrauen über Anfragen; E-E-A-T (Q-G15) ist kein Rankingfaktor, aber Vertrauen wirkt auf Menschen. |
| Mobile Optimization, Semantic HTML | `GLOBAL.md` | Immer Pflicht, nicht abwählbar (Mobile-first indexing, Q-G13). |
| Core Web Vitals | `performance.md` | Teil von Performance. |
| Conversion Tracking | `analytics.md` | Messung. |

## Regeln lesen

Jede Datei hat eine Regeltabelle mit genau diesen Spalten:

| Spalte | Werte | Bedeutung |
|---|---|---|
| ID | `SEO-01` … | fest, nie neu vergeben; gelöschte Regeln bleiben mit „(entfallen)“ stehen |
| Stufe | **G** global · **K** Kern · **E** empfohlen · **Z** Zusatz | G gilt immer; K/E/Z je nach Priorität (Matrix unten) |
| Phase | **P** planen · **B** bauen · **A** Abnahme · **L** nach Launch (Wartung, blockiert die Abnahme nicht) | wann die Regel greift (auch mehrere, z. B. `PB`) |
| Art | **AUTO** · **SEMI-AUTO** · **MANUAL** | AUTO: Werkzeug entscheidet · SEMI-AUTO: Werkzeug prüft, Mensch/Claude bestätigt mit Beleg · MANUAL: nur Bestätigung mit Beleg |
| Prüfung | Prüf-ID(s) aus `werkzeuge/qualitaet.mjs` | leer bei MANUAL |
| Beleg | Art + Quellen-ID, z. B. `O Q-G24` | O offiziell · G Gesetz · S Studie · F Fachquelle · P eigene Praxis |
| Stand | stabil · zeitabh. | zeitabhängige Regeln werden bei der Nachrecherche zuerst geprüft |

Regeln mit Beleg „unbelegt“ gibt es nicht: Unbelegtes steht nur im Abschnitt „Mythen und Unbelegtes“ der Datei.

## Prioritäten

Der Kunde (oder der Konfigurator-Regler 1–5) setzt je Fachgebiet eine Priorität:

| Priorität | Wörter im Auftrag | Regler | Kern (K) | Empfohlen (E) | Zusatz (Z) |
|---|---|---|---|---|---|
| KRITISCH | kritisch, sehr hoch, höchste, muss | 5 | Muss | Muss | Soll |
| HOCH | hoch, wichtig | 4 | Muss | Muss | Kann |
| MITTEL | mittel, normal, „Ja“ ohne Priorität | 3 | Muss | Soll | – |
| NIEDRIG | niedrig, gering | 2 | Soll | Kann | – |
| OPTIONAL | optional, wenn möglich | 1 | Kann | – | – |
| nicht bestellt | „Nein“ oder nicht genannt | – | – | – | – |

- **Muss** blockiert die Abnahme. **Soll** muss umgesetzt oder in `abnahme.md` begründet werden (Hinweis im Bericht). **Kann** nur, wenn es ohne Mehraufwand geht.
- **Globaler Standard (G) ist immer Muss** und durch keine Kundenoption abwählbar.
- **Voraussetzungen:** Ein aktives Fachgebiet hebt seine Grundlagen (Spalte „Setzt voraus“) auf mindestens min(eigene Priorität, MITTEL).
  Beispiel: Local SEO sehr hoch → Strukturierte Daten und Technical SEO mindestens MITTEL.
- **Zahlung oder Login** im Auftrag hebt Sicherheit auf mindestens HOCH (wie im Konfigurator).
- Lokaler Betrieb ohne Local SEO → das Pflichtenheft empfiehlt, es dem Kunden anzubieten, aktiviert es aber nicht (der Kunde legt den Umfang fest).

## Muster einer Fachgebiet-Datei

1 Ziel · 2 Warum relevant · 3 Faktoren · 4 Beim Programmieren · 5 Inhalte/Strukturen · 6 Vermeiden · 7 Automatisch umsetzbar ·
8 Automatisch prüfbar · 9 Manuell prüfen · 10 Wie Claude die Umsetzung belegt · Regeltabelle · Mythen und Unbelegtes · Zeitabhängig.

## Keine falschen Versprechen

Kein Text, kein Angebot und kein Bericht verspricht Rankings, Plätze oder KI-Empfehlungen. Erlaubt sind Aussagen über das, was
wir technisch sicherstellen („Die Seite ist für Google, Bing und die Such-Crawler von ChatGPT, Claude und Perplexity lesbar,
jede Angabe ist strukturiert“ – und erst nach belegter Abnahme von GEO-01 und LOC-06: „… auch in den Cloudflare-Einstellungen
nicht gesperrt und gleich wie im Unternehmensprofil“), nicht über das Ergebnis. Google selbst sagt:
gute Werte „doesn't guarantee“ Top-Rankings (Q-G18), und Aufnahme in KI-Antworten ist „not guaranteed“ (Q-G19).
