# Technical SEO (Crawling, Indexierung, Architektur)

> Schlüssel `technical-seo` · Quellen: Q-G04, Q-G07–Q-G14 · Stand 2026-09-29

## 1 Ziel
Suchmaschinen und KI-Suchsysteme können jede gewünschte Seite finden, abrufen, rendern und genau einer Adresse zuordnen;
unerwünschte Seiten bleiben bewusst draußen.

## 2 Warum relevant
Was nicht gecrawlt und indexiert ist, kann weder ranken noch in AI Overviews oder ChatGPT-Suche erscheinen (Q-G19, Q-K01).
Fehler hier machen jede Inhaltsarbeit wertlos.

## 3 Faktoren (belegt)
- robots.txt steuert Crawling, **nicht** Indexierung; noindex nur per Meta/Header und nie zugleich per robots.txt sperren (Q-G08, Q-G09).
- Canonical absolut, eindeutig, selbstreferenzierend; nicht per robots.txt oder noindex kanonisieren (Q-G07).
- Sitemap: absolute URLs, nur kanonische, indexierte Seiten; `priority`/`changefreq` werden ignoriert, `lastmod` nur wenn korrekt (Q-G10).
- Permanente Weiterleitungen serverseitig (301/308); Google folgt bis zu 10 Sprüngen; 404/410 gleich (Q-G11, Q-G12).
- Mobile-first: gleiche Inhalte, Daten und Metadaten auf Handy und Computer (Q-G13).
- Nur `<a href>` ist crawlbar; Inhalte im Ausgangs-HTML, SSR/Vorrendern bevorzugt (Q-G04, Q-G14).

## 4 Beim Programmieren
- `bauen.mjs` erzeugt `sitemap.xml` aus denselben Seitendaten wie die Canonicals; noindex-Seiten (Impressum, Datenschutz, Danke) fehlen dort.
- `robots.txt`: `User-agent: *` / `Allow: /` / `Sitemap: https://<domain>/sitemap.xml`.
- Cloudflare Pages entfernt `.html` per 308 (`/seite.html` → `/seite`): Canonicals und Links einheitlich wählen; bestehende `.htm`-Adressen
  bleiben unverändert und werden über `_redirects` abgesichert.
- Statisches HTML aus dem Generator; kein clientseitiges Nachladen von Hauptinhalt.

## 5 Inhalte und Strukturen
Flache Architektur (jede Seite ≤ 2 Klicks von der Startseite), sprechende Pfade, eine Hauptdomain.

## 6 Vermeiden
`Disallow: /` für alle, `noindex` in robots.txt, relative Canonicals, Canonical auf weiterleitende Adressen, Soft-404 (leere Seite mit 200),
Links nur per `onclick`, Inhalte, die auf dem Handy fehlen.

## 7 Automatisch umsetzbar
Sitemap, robots.txt, Canonicals, noindex-Metatags, `_redirects` aus dem Generator.

## 8 Automatisch prüfbar
robots.txt, Sitemap-Format und -Abdeckung, Canonicals, noindex-Liste, crawlbare Links, Inhalt ohne JS, 404-Seite.

## 9 Manuell prüfen
Domain-Weiterleitungen (www/ohne, http→https) nach dem Launch, Anmeldung in Search Console und Bing Webmaster Tools.

## 10 Wie Claude die Umsetzung belegt
`QUALITAET.md`; nach Launch in `abnahme.md`: `curl -sI http://<domain>/` und `curl -sI https://www.<domain>/` mit Status und Ziel, Screenshot der
eingereichten Sitemap in der Search Console.

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| TEC-01 | robots.txt erlaubt das Crawling, nennt die Sitemap absolut, enthält kein noindex | K | B | AUTO | robots-txt | O Q-G08, O Q-G09, O Q-G10 | stabil |
| TEC-02 | sitemap.xml enthält genau die indexierten Seiten (kanonische https-URLs), keine noindex-Seiten, ohne priority/changefreq | K | B | AUTO | sitemap, sitemap-abdeckung | O Q-G10 | stabil |
| TEC-03 | Jede indexierte Seite hat genau ein absolutes, selbstreferenzierendes https-Canonical auf der eigenen Domain | K | B | AUTO | canonical | O Q-G07 | stabil |
| TEC-04 | noindex nur für Impressum, Datenschutz, Danke-, Fehler- und Abbruchseiten; Startseite nie | K | B | AUTO | noindex-bewusst | O Q-G09 | stabil |
| TEC-05 | Nur crawlbare Links (`<a href>`), Hauptinhalt im Ausgangs-HTML | K | B | AUTO | links-leer, inhalt-ohne-js | O Q-G04, O Q-G14 | stabil |
| TEC-06 | Unbekannte Adressen liefern die 404-Seite mit Status 404 (keine Soft-404) | E | B | AUTO | seite-404 | O Q-G12 | stabil |
| TEC-07 | Handy und Computer zeigen dieselben Inhalte, Daten und Metadaten | K | B | MANUAL | | O Q-G13 | stabil |
| TEC-08 | Eine Hauptdomain: http → https und www/ohne per 301/308; alte Adressen per `_redirects` | K | PL | MANUAL | | O Q-G07, O Q-G11 | stabil |
| TEC-09 | Semantische Struktur: header, nav, main, footer; Listen und Tabellen nur für ihren Zweck | E | B | SEMI-AUTO | ext-html-validate | O Q-W07 | stabil |
| TEC-10 | Nach Launch: Search Console und Bing Webmaster Tools (Konto des Kunden), Sitemap einreichen, Indexierung prüfen | E | L | MANUAL | | O Q-G10, O Q-K06 | zeitabh. |
| TEC-11 | IndexNow für Bing & Co. nur als Zusatz (Google nutzt es nicht) | Z | A | MANUAL | | O Q-K07 | zeitabh. |

## Mythen und Unbelegtes
- „`priority` in der Sitemap steuert das Crawling“ – ignoriert (Q-G10).
- „Disallow entfernt Seiten aus dem Index“ – falsch, dafür noindex (Q-G08, Q-G09).
- „Weiterleitungen mindestens ein Jahr behalten“ – steht so nicht in der Google-Doku (Q-G11); wir behalten sie dauerhaft, weil es nichts kostet.

## Zeitabhängig / nicht recherchiert
HTTP-Status-Details (Q-G12). **hreflang** (mehrsprachige Seiten) ist noch nicht recherchiert: bei erstem mehrsprachigem Kunden nachholen.
