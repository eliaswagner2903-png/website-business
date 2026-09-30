# Aktualisierung des Qualitätssystems

> Warum: Suchmaschinen-Richtlinien, KI-Suche, Crawler, Rich-Result-Typen und Rechtsauslegung ändern sich. Veraltete Regeln sind gefährlicher
> als fehlende, weil man ihnen vertraut.

## Rhythmus

| Bereich | Stabilität | Prüfen | Quellen |
|---|---|---|---|
| KI-Suche: Crawler, Google-KI-Doku, Search-Console-Schalter, llms.txt, Bing-Steuerung | sehr schnell | alle 3 Monate | Q-G19–Q-G22, Q-K01–Q-K10, Q-W13 |
| Rich-Result-Typen, Bewertungsregeln | schnell | alle 3–6 Monate | Q-G25, Q-G27, Q-G29 |
| Spam-Richtlinien, helpful content, Page Experience, Core Web Vitals | mittel | alle 6 Monate | Q-G15–Q-G18, Q-W01 |
| Datenschutz/Analytics (DSK, Consent Mode, Cloudflare), OWASP, BFSG-Auslegung, EN 301 549 | mittel | alle 6 Monate | Q-R03, Q-R05–Q-R07, Q-M01–Q-M03, Q-W10 |
| Grundlagen (Crawling, Canonical, Sitemap, WCAG 2.2, schema.org-Typen, Gesetze) | stabil | jährlich | alle „stabil“ |

`node werkzeuge/wissen-alter.mjs` zeigt fällige Quellen und die betroffenen Regeln; der Start-Hook meldet es in einer Zeile.

## Ablauf einer Nachrecherche (Auftrag loggen, Branch `aufbau/wissen-<datum>`)
1. `node werkzeuge/wissen-alter.mjs` → Liste.
2. Je Quelle die URL abrufen (Agent `researcher` für mehrere Quellen parallel), Aussage in Spalte „Stützt“ gegenprüfen.
3. Unverändert → „Stand“ und „Nächste Prüfung“ fortschreiben. Geändert → Regel in `wissen/fachgebiete/*.md` anpassen
   (ID bleibt; entfallene Regeln mit „(entfallen)“ markieren statt löschen), Quelle aktualisieren, Mythen-Abschnitt ergänzen.
4. Neue Prüfungen in `werkzeuge/qualitaet.mjs`, Tests `node --test werkzeuge/tests/*.test.mjs` grün.
5. Änderungen kurz in `wissen/FEHLER.md` („Ergänzungen“) oder im PR beschreiben; `/sichern`.

## Bekannte Lücken (bei Bedarf recherchieren)
- hreflang / mehrsprachige Seiten (Technical SEO)
- genaue Informationspflichten nach BFSG (Barrierefreiheit), Heilmittelwerberecht (Praxen)
- Baustein „zaehler“ (serverseitige Zählung) für `analytics.md` fehlt in `vorlage/`
