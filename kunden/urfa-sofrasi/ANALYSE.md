# URFA SOFRASI – Analyse, Konzept & Prüfliste

Leitlinie: **Gleiche Website, gleiche Identität – moderner, übersichtlicher, schneller.**

> **Grundlage der Analyse:** Die bisherige Website war aus der Arbeitsumgebung nicht abrufbar, weil die Netzwerkrichtlinie die Domain sperrt. Analysiert wurden deshalb
> die vier Screenshots der mobilen Ansicht (Startseite, Restaurant-Abschnitt, Speisekarte),
> die Speisekarte als PDF (Stand 14.05.2025) sowie öffentlich auffindbare Angaben (Suchmaschinen-Auszüge, Branchenportale).
> Alles, was nicht aus diesen Quellen sicher belegt ist, ist als **Platzhalter** oder **PRÜFEN** markiert (siehe unten).

---

## Phase 1 – Analyse der bestehenden Website

### 1. Was funktioniert bereits gut?
- **Dunkler Grundton**: Die Gerichte wirken auf Schwarz warm und appetitlich.
- **Grüner Akzent und Serifen-Versalien** („WILLKOMMEN“, „DÖNER GERICHTE“) ergeben einen klaren Wiedererkennungswert.
- **Echte, authentische Fotos**: die Grillplatte, der gedeckte Tisch mit Döner und Meze sowie die kupferne Teestation mit eingraviertem Logo.
- **Vollständige Speisekarte mit Preisen**, zweisprachig (Türkisch/Deutsch) und durchnummeriert, also gut zum Bestellen per Telefon.
- Ein persönlicher, bodenständiger Ton („Kommen Sie vorbei und überzeugen Sie sich selbst“).

### 2. Was wirkt veraltet?
- Die Optik eines Website-Baukastens (Ordnerstruktur `index_htm_files`, feste Breiten).
- Zentrierter Fließtext mit stark gesperrter Laufweite („D I e  t ü r k i s c h e  K ü c h e …“), der schwer zu lesen ist.
- Die Speisekarte ist eine sehr lange Liste ohne Sprungmarken und ohne Suche.
- Mehrere Schrift- und Textstile im selben Abschnitt (gesperrt und normal, zentriert und linksbündig).

### 3. Was muss erhalten bleiben?
- Der Name und die Schreibweise **URFA SOFRASI**, das Logo (Skyline-Grafik) und die Farbwelt Schwarz/Grün.
- Der Claim **„Willkommen in der kulinarischen Vielfalt Anatoliens“** und das grüne Ornament.
- Der Abschnitt „Restaurant“ mit dem grünen Balken unter der Überschrift.
- Alle Gerichte, Nummern und Preise.
- Die Seitenstruktur **Start – Speisekarte – Galerie – Kontakt – Impressum** und die bisherigen Adressen (`galerie.htm`, `kontakt.htm`, `impressum.htm`).

### 4. Was sollte verbessert werden?
- Rechtschreibung und Grammatik im Willkommenstext (siehe Phase 6).
- Wichtige Informationen gehören nach oben: Adresse, Öffnungszeiten, Telefon und Route.
- Die Speisekarte braucht Kategorien zum Anspringen, eine Suche, bündige Preise und eine einheitliche Schreibweise.
- Die Bildformate müssen einheitlich werden und die Ladezeiten kurz.

### 5. Welche Inhalte fehlen?
- Öffnungszeiten, Adresse und Route direkt auf der Startseite
- Hinweise auf Speisen zum Mitnehmen und auf Feiern
- Die **Legende zu den Allergen- und Zusatzstoff-Kennzeichnungen**, die in der PDF fehlt
- Strukturierte Daten für Google, Meta-Beschreibungen und Open-Graph-Vorschau

### 6. Was funktioniert auf Smartphones schlecht?
- Der fixierte Header ist halbtransparent, der Text darunter scheint durch und ist schwer lesbar (in den Screenshots sichtbar).
- Die Logo-Grafik neben dem Schriftzug ist auf dem Handy winzig und grau, also kaum erkennbar.
- Telefonnummer und Route sind nicht sofort erreichbar.
- In der Speisekarte brechen lange Zeilen unsauber um (z. B. Nr. 48: der Preis steht in der zweiten Zeile). Bei rund 100 Positionen muss man sehr viel scrollen.
- Der gesperrte Fließtext wirkt auf kleinen Bildschirmen unruhig.

### 7. Was wirkt optisch unruhig?
- Die Einrückung der Preisspalte variiert (Nr. 23–38 vs. Nr. 40–48 vs. Nr. 50–58).
- Die grünen Balken unter den Überschriften sind unterschiedlich lang, die Abstände zwischen den Kategorien uneinheitlich.
- Fließtext ist teils zentriert, teils linksbündig.

### Abweichungen zwischen alter Website und PDF-Speisekarte
| Website (Screenshot) | PDF (Stand 05/2025) | Umgesetzt |
|---|---|---|
| Pizzen Nr. 50–58, Extras Nr. 58 | Pizzen Nr. 51–58, Extras Nr. 59 | PDF |
| Lahmacun im Teller (Nr. 49/50) fehlt | vorhanden | PDF |
| „Paca / Fleischsuppe“ | „Kelle Paça / Fleischsuppe“ | PDF |

→ Die PDF ist der neuere Stand und wurde als Quelle verwendet.

---

## Phase 2 – Verbesserungskonzept

1. **Gleiche Identität**: dunkler, warmer Hintergrund, Grün als einzige Akzentfarbe, elegante Serifenschrift für Überschriften (Cormorant Garamond) und leichte, gut lesbare Grotesk für Text (Lato). Im Hintergrund liegt ein feines Muster aus Burg und Baum des Logos in einem diagonalen Gitter; die Linien enden kurz vor den Symbolen. Die Skyline steht außerdem wie früher in der Kopfzeile, und alle Abschnitte haben denselben Hintergrund. Die Farbe lässt sich in `style.css` über `--monogramm` steuern. Beide Schriften liegen lokal auf dem eigenen Server, es wird also keine Verbindung zu Google aufgebaut.
2. **Startseite, die in 5 Sekunden alles beantwortet**: Hero mit Foto, Claim, H1 („türkisch-anatolische Küche in Eislingen“), Buttons *Speisekarte* und *Anrufen*, darunter Adresse und Öffnungszeiten.
   Danach folgen Willkommen, beliebte Gerichte mit Preisen, Restaurant, „Gut zu wissen“ (Tagesgerichte, Mitnehmen, Feiern), Kontakt und Footer.
3. **Mobile first**: Am unteren Bildschirmrand gibt es eine feste Leiste mit **Anrufen / Route / Speisekarte**, dazu große Tippflächen (mindestens 44 px), Schriftgröße 17 px und keinen horizontalen Seiten-Scroll.
4. **Speisekarte als HTML-Seite** statt nur als PDF, mit Suche (findet „sis“ auch in „Şiş“), Kategorie-Sprungleiste, bündigen Preisen und dezenten Allergen-Kennzeichnungen. Das PDF bleibt zum Download erhalten.
5. **Technik**: reines HTML/CSS, etwa 2 KB JavaScript ohne Bibliotheken, WebP-Bilder mit `srcset`, Lazy Loading und reservierten Bildmaßen gegen Layout-Sprünge.
6. **SEO**: Title und Description je Seite, saubere H1/H2-Struktur, Restaurant-Daten nach schema.org, Open Graph, `sitemap.xml` und `robots.txt`.

## Phase 3 – Prioritäten

| Prio | Maßnahme | Status |
|---|---|---|
| **A** | Telefon anklickbar, Route, Öffnungszeiten oben / mobile Schnellleiste | ✅ |
| **A** | Speisekarte lesbar, durchsuchbar, Preise unverändert | ✅ |
| **A** | Rechtschreibung/Grammatik aller Texte | ✅ |
| **A** | Responsive ohne Überlauf (360 px bis 1920 px) | ✅ |
| **A** | Allergen-Legende ergänzen | ⚠️ Betreiber muss liefern |
| **A** | Impressum/Datenschutz übernehmen | ⚠️ Platzhalter, Originaltext einsetzen |
| **B** | Bilder optimiert (WebP, srcset, Lazy Loading, Alt-Texte) | ✅ |
| **B** | Lokale SEO: Title/Description, strukturierte Daten, Sitemap | ✅ |
| **B** | Hinweise Mitnehmen / Feiern / Tagesgerichte | ✅ (teils PRÜFEN) |
| **B** | Schriften lokal statt Google Fonts (DSGVO) | ✅ |
| **C** | Originalfotos der Galerie übernehmen | ✅ 12 von 15 (aus Screenshots) |
| **C** | Originalfotos in voller Auflösung, Fotos einzelner Gerichte | 🔲 Bildplätze vorbereitet |
| **C** | Original-Logo im Header und als Hintergrundmuster | ✅ |
| **C** | Google-Unternehmensprofil mit neuer Website abgleichen (Öffnungszeiten!) | 🔲 |

---

## Wo ich bewusst von der Aufgabenstellung abgewichen bin

1. **Keine Stockfotos aus dem Internet.**
   *Problem:* Die Bilddienste (Unsplash, Pexels, Wikimedia) waren aus der Arbeitsumgebung gesperrt. Außerdem zeigen Stockfotos fremde Gerichte: Ein „Adana Kebap“ aus einer Bilddatenbank sieht anders aus als bei URFA SOFRASI und würde das Gericht falsch darstellen.
   *Lösung:* Nur die echten Fotos des Restaurants werden verwendet. Die Gerichte-Kacheln funktionieren auch ohne Foto, und für eigene Fotos sind Bildplätze vorbereitet (siehe README).
2. **Bildauflösung.** Alle Fotos wurden aus den gesendeten Screenshots gewonnen (1016 px breit). Auf dem Handy reicht das gut aus, auf großen Monitoren sind sie etwas weich. → **Bitte die Originaldateien schicken**, dann tausche ich sie aus.
3. **Keine eingebettete Google-Karte.** Eine eingebettete Karte überträgt beim Seitenaufruf Daten an Google und braucht eine Einwilligung (Cookie-Banner). Stattdessen gibt es den Button „Route planen“, der Google Maps bzw. die Karten-App öffnet. Das ist datenschutzfreundlich und auf dem Handy sogar praktischer.
4. **Kategorie-Leiste der Speisekarte scrollt auf dem Handy seitlich.** Die Anforderung „keine horizontalen Scrollbereiche“ ist bei 11 Kategorien nicht sinnvoll: In mehreren Zeilen würde die Leiste ein Drittel des Bildschirms verdecken. Die Leiste scrollt deshalb *in sich*, die Seite selbst scrollt nie seitlich (automatisch geprüft).
5. **Alte Adressen bleiben erhalten** (`galerie.htm`, `kontakt.htm`, `impressum.htm`), damit bestehende Google-Einträge und Links weiter funktionieren. Neu hinzugekommen sind `speisekarte.htm` und `datenschutz.htm`. `index.htm` wird per `.htaccess` auf die Startseite umgeleitet.
6. **Nicht alle Galeriebilder übernommen.** Von den 15 Bildern der bisherigen Galerie sind 12 auf der neuen Seite. Weggelassen habe ich:
   - das **Geburtstagsfoto**: Die Gäste sind klar erkennbar, dafür bräuchte es ihre Einwilligung. Außerdem ist es dunkel und unscharf.
   - die **Platte mit den stehenden Spießen**: dunkel, mit einem Flaschendeckel im Vordergrund
   - die **vier Grillteller**: schräg aufgenommen und schwächer als die übrigen Grillfotos. Mit 12 Bildern bleibt das Raster außerdem ohne Lücke.
7. **„Willkommen“ steht nicht mehr ganz oben.** Der Claim „Willkommen in der kulinarischen Vielfalt Anatoliens“ eröffnet weiterhin die Seite, jetzt über der Hauptüberschrift. Den längeren Willkommenstext gibt es gleich danach. Ganz oben stehen, was es gibt, wo das Restaurant ist und wann es geöffnet hat: Das suchen Besucher, die über Google Maps kommen, als Erstes.

---

## Prüfliste für den Betreiber

Tipp: Wird eine Seite mit **`#pruefen`** am Ende der Adresse aufgerufen (z. B. `speisekarte.htm#pruefen`), werden alle unsicheren Stellen gelb markiert und mit Begründung angezeigt.

### Unsichere Angaben
- [ ] **Öffnungszeiten**: „Mo–So 10:00–23:00 Uhr“ stammt laut Suchmaschine von der bisherigen Website, bei Google stehen teils 11–22 Uhr. Die Angabe steht an 4 Stellen und in den strukturierten Daten.
- [ ] **„Alle Gerichte auch zum Mitnehmen“** und **„Feiern (Hochzeit, Geburtstag, Firmenfeier), individuelle Menüs“**: Diese Angaben stammen aus Branchenportalen, die vermutlich den alten Website-Text übernommen haben.
- [ ] **E-Mail** `info@urfasofrasi-eislingen.de`: aus einem Suchmaschinen-Auszug der Kontaktseite.
- [ ] **Domain**: Die Seite geht von `https://www.urfasofrasi-eislingen.de/` aus (Canonical, Sitemap, Open Graph).

- [ ] **Fotos mit Gästen** (Gastraum, Terrasse): Sind die Personen einverstanden bzw. nicht erkennbar? Sonst die Gesichter unkenntlich machen oder die Fotos austauschen.

### Speisekarte – nur markiert, nichts geändert
- [ ] **Nr. 13** Urfa Sofrası für 4 Personen kostet 98,00 €. Das Muster wäre 4 × 25 € = 100 €. Ist der Rabatt gewollt?
- [ ] **Nr. 61** Güveç (Lamm) kostet 8,00 €, Saç Kavurma (Lamm) dagegen 20,00 €. Stimmt der Preis?
- [ ] **Nr. 10** Tavuk Kanat hat keine Kennzeichnungen, alle anderen Grillgerichte haben 1,2,3.
- [ ] **Nr. 90** Kaffee steht in der PDF unter „Dosen (inkl. Pfand & Becher)“. Stimmt die Rubrik?
- [ ] **Nr. 68** Kelle Paça ist eigentlich eine Kopf-/Fußsuppe, die Übersetzung „Fleischsuppe“ wurde belassen.
- [ ] **Nummerierung**: Die alte Website und die PDF weichen voneinander ab (siehe Tabelle oben).

### Korrigierte Schreibweisen (Preise unverändert)
„Sütlac“ → **Sütlaç**, „Urfa Sofrasi“ (Nr. 13) → **Urfa Sofrası** (einheitlich), „Uludag“ → **Uludağ**, „Tonbalığı“ → **Ton Balığı**, „Frikadellen mit Kartoffel“ → **Kartoffeln**, „Döner Teller“ → **Döner-Teller**, „Döner Box“ → **Döner-Box**. Türkische Gerichtnamen sind großgeschrieben (Kuru Fasulye, İzmir Köfte, Saç Kavurma …). Bei „Dondurmalı Künefe“ lautet die Übersetzung jetzt „Künefe mit Eis“ statt „Eis auf Engelshaar mit Käsefüllung“.

### Rechtliches – bitte manuell prüfen lassen (keine Rechtsberatung)
- [ ] **Legende der Kennzeichnungen fehlt.** Die PDF nutzt die Zahlen 1–7 und die Buchstaben A–N, erklärt sie aber nirgends. Die Kennzeichnung von Allergenen und Zusatzstoffen braucht eine Erklärung. Die Legende muss vom Betreiber kommen und wurde bewusst **nicht geraten**, weil die Nummerierung von Betrieb zu Betrieb verschieden ist.
- [ ] **Impressum**: Den Originaltext 1:1 übernehmen. Dabei prüfen:
  - Rechtsgrundlage heute § 5 **DDG**, nicht mehr § 5 TMG
  - Ein etwaiger Link zur EU-Online-Streitbeilegungsplattform ist veraltet, die Plattform wurde im Juli 2025 eingestellt.
  - Die Steuernummer muss nicht veröffentlicht werden. Eine USt-IdNr. ist anzugeben, falls vorhanden.
- [ ] **Datenschutzerklärung**: Bestehenden Text übernehmen und an die neue Technik anpassen. Die neue Seite nutzt keine Cookies, kein Tracking, keine Google Fonts und keine eingebettete Karte.

---

## Phase 6 – Textkorrekturen (Auswahl)

| Vorher | Nachher / Grund |
|---|---|
| „DIe türkische Küche wir allein durch …“ | „Die … wird …“, der Satz ist neu gegliedert |
| „ausgefallenen Rezepturen“ (auf der Website „augefallenen“) | entfernt, weil werblich und ohne Beleg; stattdessen „großes, preiswertes Angebot“ |
| „näher bringen“ | „näherbringen“ |
| „eine Sitzgelegenheit auf unsere Terrasse“ | „auf unserer Terrasse“ |
| „Schnell-restaurant“ (Silbentrennung) | entfernt, der Name steht einheitlich als URFA SOFRASI |
| „…wünschen Ihnen interessante Eindrücke auf unserer Website“ | als Floskel gestrichen |
| „stilvoll eingerichtet“ | „gemütlich eingerichtet“ (weniger werblich; gern zurückändern) |

Neue Texte (Hero, „Beliebte Gerichte“, „Gut zu wissen“, Kontakt) enthalten nur Angaben aus Speisekarte, alter Website oder den markierten Quellen.

## Phase 5–9 – Prüfergebnisse

| Prüfung | Ergebnis |
|---|---|
| Viewports 360, 390, 768, 1440, 1920 px | kein horizontaler Überlauf, keine Ladefehler (automatisiert mit Playwright) |
| Lighthouse mobil – Startseite | Performance 99 · Barrierefreiheit 100 · Best Practices 100 · SEO 100 |
| Lighthouse mobil – Speisekarte | Performance 100 · Barrierefreiheit 100 · Best Practices 100 · SEO 100 |
| Seitengewicht | Startseite ca. 216 KB, Speisekarte ca. 131 KB (inkl. Schriften) |
| HTML-Validierung (html-validate) | keine Fehler |
| Tastatur | Skip-Link, sichtbarer Fokus, Menü per Escape schließbar |
| Suche Speisekarte | „sis“ → 4 Şiş-Gerichte, „iskender“ → İskender, „KUNEFE“ → 2 Treffer |

Die Lighthouse-Hinweise „Caching/Kompression“ betreffen den Server. Dafür liegt eine passende `.htaccess` bei.
