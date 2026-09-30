# GEO / KI-Suche (auch AEO, LLMO, AIO, „AI Search Visibility“)

> Schlüssel `geo` · setzt voraus: `seo`, `technical-seo`, `structured-data` · Quellen: Q-G19–Q-G22, Q-K01–Q-K14, Q-W13 · Stand 2026-09-29
> **Schnell veränderlich:** Nachrecherche alle 3 Monate (`wissen/quellen/AKTUALISIERUNG.md`).

## Begriffe (eine Aufgabe, viele Namen)
GEO, AEO, LLMO, AIO und „AI SEO“ meinen dasselbe: in Antworten von KI-Systemen (Google AI Overviews/AI Mode, ChatGPT-Suche, Claude,
Perplexity, Copilot) vorkommen und korrekt dargestellt werden. Google: „optimizing for generative AI search is … still SEO“ (Q-G20).
Nur „GEO“ ist als Forschungsbegriff definiert (Q-K11). Wir führen deshalb **ein** Fachgebiet.

## 1 Ziel
Die Website ist für die Such-Crawler aller großen KI-Anbieter zugänglich, ihre Kernfakten sind als Text eindeutig lesbar und stimmen überall
überein, damit ein KI-System, das nach so einem Betrieb gefragt wird, ihn finden, verstehen und richtig zitieren **kann**.

## 2 Warum relevant
Immer mehr Suchen enden in einer KI-Antwort. KI-Suchsysteme stützen sich auf Suchindizes (Googlebot für AI Overviews, OAI-SearchBot für
ChatGPT-Suche, Claude-SearchBot, PerplexityBot, Bingbot für Copilot). Wer dort fehlt oder gesperrt ist, kommt nicht vor (Q-G19, Q-K01–Q-K03).

## 3 Faktoren – was belegt ist und was nicht
| Faktor | Evidenz |
|---|---|
| Für den Such-Crawler des Anbieters zugänglich und indexiert (auch keine CDN/WAF-Sperre) | offiziell (Q-G19, Q-K01, Q-K02, Q-K03) |
| Snippets erlaubt (kein nosnippet/max-snippet:0 auf dem Hauptinhalt) | offiziell (Q-G19) |
| Kerninfos als Text, nicht nur in Tabs, PDFs, Bildern oder per JS | offiziell/Hersteller (Q-G19, Q-K05) |
| Eigene, konkrete Inhalte mit echter Erfahrung | offiziell (Q-G20, Q-G15) |
| Zitate, Zahlen, Quellenangaben | Labor-Studie (Q-K11); Folgestudie: die meisten Tricks wirkungslos (Q-K12) |
| Erwähnungen auf Drittseiten (Presse, Verzeichnisse, Bewertungen) | Preprint (Q-K13); lokal: Business Profile (Q-G20) |
| Einheitliche Angaben zum Betrieb überall im Netz („Entitätskonsistenz“) | plausibel, nicht direkt belegt |
| llms.txt, „Chunking“, KI-Spezialdateien, spezielles Schema | für Google ausdrücklich unnötig (Q-G20); llms.txt nur Vorschlag (Q-K09, Q-K10, Q-W13) |

## KI-Crawler (Stand 2026-09-29, zeitabhängig)
| User-Agent | Betreiber | Zweck | robots.txt | Unsere Standardregel |
|---|---|---|---|---|
| Googlebot | Google | Suche inkl. AI Overviews/AI Mode | ja | zulassen |
| Google-Extended | Google | nur Token: Gemini-Training/Grounding, **nicht** Suche | ja | Kundenentscheidung (Standard: zulassen) |
| Bingbot | Microsoft | Suche + Copilot | ja | zulassen |
| OAI-SearchBot | OpenAI | ChatGPT-Suche | ja | zulassen |
| GPTBot | OpenAI | Training | ja | Kundenentscheidung |
| ChatGPT-User | OpenAI | Abruf auf Nutzerwunsch | „may not apply“ | – |
| Claude-SearchBot | Anthropic | Suche | ja | zulassen |
| ClaudeBot | Anthropic | Training | ja | Kundenentscheidung |
| Claude-User | Anthropic | Abruf auf Nutzerwunsch | ja | zulassen |
| PerplexityBot | Perplexity | Suche | ja | zulassen |
| Perplexity-User | Perplexity | Abruf auf Nutzerwunsch | meist nein | – |
| Applebot / Applebot-Extended | Apple | Suche / nur Trainings-Token | ja | zulassen / Kundenentscheidung |

Quellen: Q-G22, Q-K01, Q-K02, Q-K03, Q-K08. Trainings-Crawler zu sperren hat laut Anbietern keinen Einfluss auf die Suche.
Achtung Cloudflare: Bot-/„AI Crawl“-Einstellungen der Domain können Such-Crawler blockieren, obwohl robots.txt sie erlaubt – nach Launch prüfen.

## 4 Beim Programmieren
- robots.txt ohne Sperren für die Such-Crawler; Trainings-Crawler nur auf ausdrücklichen Kundenwunsch sperren (dann eigene `User-agent`-Gruppen).
- Faktenblock im HTML: Name, was, wo, Telefon, Zeiten, Einzugsgebiet, Preise (falls freigegeben) als Text – nicht als Bild, nicht nur im PDF,
  nicht hinter Akkordeons, die ohne JS geschlossen und leer sind.
- Stammdaten aus einer Quelle (siehe `local-seo.md`), JSON-LD mit `sameAs` auf echte Profile.

## 5 Inhalte und Strukturen
„Über uns“ mit echten Fakten (Gründung, Meistertitel, Team, Zertifikate – nur Belegtes); häufige Kundenfragen direkt beantwortet;
Leistungen mit konkreten Angaben (Dauer, Ablauf, Preisrahmen, Gebiet).

## 6 Vermeiden
Garantie-Versprechen, llms.txt als „KI-Optimierung“ verkaufen, eine Seite je Frageformulierung (Fan-out, Verstoß gegen Scaled Content Abuse, Q-G20),
künstliche „Mentions“, Tools, die „KI-Rankings“ mit angeblich internen Daten messen (Q-G20).

## 7 Automatisch umsetzbar
robots.txt-Standard, Faktenblock aus Stammdaten, JSON-LD.

## 8 Automatisch prüfbar
Such-Crawler nicht gesperrt, keine Snippet-Sperren, Fakten als Text auf der Startseite, Hauptinhalt ohne JS vorhanden, NAP einheitlich.

## 9 Manuell prüfen
Cloudflare-Bot-Einstellungen nach Launch, Inhaltstiefe und Echtheit der Angaben, Kundenentscheidung zu Trainings-Crawlern.

## 10 Wie Claude die Umsetzung belegt
`QUALITAET.md` (ki-crawler, nosnippet, fakten-text, inhalt-ohne-js); in `abnahme.md` die Kundenentscheidung zu Trainings-Crawlern und nach Launch
ein `curl -A "OAI-SearchBot" -sI https://<domain>/` mit Status 200.

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| GEO-01 | Such-Crawler (Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot, Applebot) nicht sperren – weder in robots.txt noch in Cloudflare-Bot-Einstellungen | K | BA | SEMI-AUTO | ki-crawler | O Q-G19, O Q-K01, O Q-K02, O Q-K03 | zeitabh. |
| GEO-02 | Trainings-Crawler (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended): Entscheidung des Kunden dokumentieren (Standard: zulassen) | E | P | MANUAL | | O Q-K01, O Q-K02, O Q-G22, O Q-K08 | zeitabh. |
| GEO-03 | Snippets erlaubt: kein nosnippet, max-snippet:0 oder data-nosnippet auf dem Hauptinhalt | K | B | AUTO | nosnippet | O Q-G19 | zeitabh. |
| GEO-04 | Kernfakten (Name, Leistung, Ort, Kontakt, Zeiten) als Text im HTML, nicht nur in Bildern, PDFs, Tabs oder per JS | K | PB | AUTO | fakten-text, inhalt-ohne-js | O Q-G19, O Q-K05, O Q-G14 | zeitabh. |
| GEO-05 | Eindeutige Entität: gleicher Name, Adresse, Telefon auf allen Seiten und im JSON-LD; `sameAs` nur auf echte Profile | E | B | SEMI-AUTO | nap | O Q-G26, F Q-F08 | zeitabh. |
| GEO-06 | Eigene, überprüfbare Angaben (Zahlen, Erfahrung, Zertifikate, Quellen) statt Allgemeinplätzen – nur Belegtes | E | P | MANUAL | | O Q-G20, O Q-G15, S Q-K11 | zeitabh. |
| GEO-07 | Häufige Kundenfragen sichtbar und direkt beantworten, ohne eine Seite je Formulierung | E | P | MANUAL | | O Q-G20, O Q-K05 | zeitabh. |
| GEO-08 | Keine Garantie-Aussagen zu KI-Sichtbarkeit in Seite, Angebot und Bericht | K | PA | MANUAL | | O Q-G19, O Q-G20 | stabil |
| GEO-09 | llms.txt oder KI-Spezialdateien höchstens als Zusatz ohne Wirkungsversprechen | Z | B | MANUAL | | O Q-G20, O Q-W13, F Q-K09 | zeitabh. |
| GEO-10 | Nach Launch: Search Console (Bericht zu generativer KI) und Bing „AI Performance“ ansehen; keine Tools mit angeblichen Google-internen KI-Daten | Z | L | MANUAL | | O Q-G20, O Q-K06 | zeitabh. |

## Mythen und Unbelegtes
| Behauptung | Stand |
|---|---|
| „llms.txt ist Pflicht / verbessert das Ranking“ | Google: ignoriert (Q-G20); kein Anbieter bestätigt Auswertung in der Suche |
| „Schema.org sorgt dafür, dass ChatGPT dich empfiehlt“ | kein Beleg (Q-G19, Q-G20) |
| „KI bevorzugt FAQ-Blöcke / kurze Chunks“ | Bing empfiehlt Q&A ohne Messung (Q-K05), Google: Chunking unnötig (Q-G20) |
| „Google-Extended sperren blockt AI Overviews“ | falsch: AI Overviews laufen über Googlebot (Q-G22) |
| „GEO bringt +40 % Sichtbarkeit in ChatGPT“ | Laborwert (Q-K11), in Folgestudien nicht bestätigt (Q-K12, Q-K14) |
| „Tool X misst dein KI-Ranking“ | kein Drittanbieter hat Google-interne Daten (Q-G20) |

## Zeitabhängig (alle 3 Monate nachrecherchieren)
Crawler-Namen und -Zwecke (Q-K01–Q-K03, Q-K08), Google-KI-Doku inkl. Search-Console-Schalter (Q-G19–Q-G21), Bing-Steuerung (Q-K04, Q-K06),
Forschungslage (Q-K12–Q-K14), llms.txt-Status (Q-K09, Q-K10, Q-W13). Die Google-Seiten Q-G19 (Stand 12/2025) und Q-G20 (07/2026) sind nicht synchron.
