# Business-Plan OQ

> Stand **2026-10-06**, Auftrag A-093 (fortgeschrieben aus A-086 vom 05.10. und A-055 vom 30.09.). Neu seit 05.10.: eigene OQ-Seite fertig
> (Hero Lichtkegel, Farbwelt Graphit, Leistungen als Bento, neues Menü, Preiskarten mit Wahlleistungen, vier Musterseiten gezeigt; Konfigurator entfernt; PR #72, #75, #76),
> Betreuung ab 75 €/Monat für alle (A-086), Referenzauswertung Space Rocket Berlin (A-088), Zugriffsprüfung maxpruegner.com.
> Davor: Pilotpreis 1.490 € mit Abo (Mietmodell verworfen), Name OQ und Ort Eislingen (A-082), Merys Clean als erste echte Kundenseite (A-073–A-078),
> Qualitätssystem (A-051), Belastungsprobe OSG-Neubau (A-053/A-054). Laien-Fassung (Lagebericht in 8 Registern, alle Vorhaben):
> `ops/dokumentation/STAND-2026-09-30.pdf` plus Nachträge N001–N005.
> Quellen: Elias' Notizen (`wissen/notizen/`), Preisformeln und Konfigurator (`wissen/preismodell/`, PR #28),
> Trainingsplan, Generalprobe, Portfolio-Seite (PR #26, #29), `wartung/PAKETE.md`, `recht/LEITFADEN.md`.
> **Alle Euro-Beträge sind Platzhalter**, bis Elias sie festlegt. Was von mir (Stahl) vorgeschlagen und nicht von
> Elias entschieden ist, steht als *(Vorschlag)*.

## 1. Kurzfassung

**OQ („Ohne Quote“, ft. AI)** baut hochwertige Websites für kleine Betriebe und betreut sie danach im Monats-Abo.
Gebaut wird mit Claude Code und einem eigenen, geprüften Baukasten; deshalb dauert eine Seite Stunden statt Wochen,
erfüllt aber messbar einen Standard, den viele Agenturseiten nicht erreichen (Lighthouse 97–100, ohne Cookie-Banner,
ohne Tracking). Jeder Preis entsteht aus einer offenen Formel: Der Kunde sieht, **wofür** er zahlt.

| Kennzahl | Stand |
|---|---|
| Aufbauzeit gesamt | 25.09. bis 06.10. (12 Kalendertage): 37 sichtbare Sitzungen (7 im Vorprojekt, 30 Fäden in diesem Projekt), 247 Commits auf `main` im Business-Repo, PR-Nummern bis #76 *(Zählweise siehe Abschnitt 8; nicht mit den 224 vom 30.09. vergleichbar)* |
| Gebaute Seiten | **13** (Zählung unten): URFA SOFRASI (2 Varianten), Hairstyle by Ümit (3 Varianten im Brüder-Wettbewerb), 3 Musterseiten (Lotlinie, Lindgrund, Zwischenbild), URFA-Meistervariante, OSG-Neubau (8 Seiten; fiktive Fassung NORVAK), Merys Clean (echte Kundenseite, 16 Seiten, nicht öffentlich verlinkt) mit der fiktiven Fassung Klarwerk, und die eigene OQ-Seite (das ursprüngliche Portfolio, seit 30.09. mehrfach neu gebaut, einmal gezählt) |
| Werkzeuge | Claude-Setup (5 Agents, Hooks), 7 Brüder-Skills, Fernspäherkommando (Hfw + 6 Späher), Vorlage mit Baukasten, 12 Skills im Business-Repo |
| Bauzeit heute | 38 min (Restaurant mit 90 Gerichten), 33 min (Portfolio): **nur die Bauzeit einer Seite, möglich erst durch die 4 Tage Vorarbeit** |
| Bauzeit Meisterseite | Maßstab Hairstyle by Ümit (Bruder C): rund 16 Stunden vom Stil bis zum Feinschliff, 9 Prüfrunden (8 Jury-Runden), Jury 54 → 56 von 60, Lighthouse 99–100/100/100/100 |
| Qualität gemessen | Lighthouse mobil 97–100 in allen vier Kategorien; OSG-Neubau: SEO 83–85 → 100, Performance 40–44 → 98–100, Barrierefreiheit 64–73 → 100 |
| Qualitätssystem | 125 Regeln in 11 Fachgebieten (Stand 30.09., nicht neu gezählt) plus globalem Mindeststandard, 90 Primärquellen mit Prüfdatum; jeder Auftrag läuft Auftrag → Pflichtenheft → Bau → Abnahme |
| Größte Probe | OSG-Neubau (Industrie, 8 Seiten) in rund 10 Stunden, fremde Jury in 5 Runden: 63,75 → 75,75 von 100 (Ziel 75) |
| Preismodell | Formeln Sp, AM, BK, Profit-Chain als Entwurf; Spanne mit Platzhaltern von rund 2.000 € (Musterseite) bis rund 4.800 € (OSG) |
| Higgsfield | 15 Credits übrig *(am Konto geprüft 06.10.; verbraucht rechnerisch 54,75 von 69,75, Plan Basic)* |
| Umsatz | noch keiner; Verkauf kommt bewusst zuletzt |

Die ganze Bilanz mit Herkunft der Zahlen steht in Abschnitt 8.

## 2. Angebot

| Leistung | Was der Kunde bekommt | Preis |
|---|---|---|
| **Website (Sp)** | eigene Seite nach Absprache und Pflichtenheft, mobil zuerst, schnell, barrierearm, DSGVO-schonend | einmalig, per Formel |
| **Betreuungs-Abo (AM)**, optional | Elias schaut monatlich über die Seite und hält sie online (Hosting, SSL, Prüfung, Updates, Bericht); dazu wählbare Leistungen, z. B. Kundenfragen beantworten | monatlich: Grundbetreuung + Wahlleistungen (z. B. Kundenfragen +100 €) + Serverkosten; Liste in `wartung/PAKETE.md` |
| **Saison-Umgestaltung** | Seite zeitweise umgestaltet (z. B. Halloween-Aktion), danach Rückbau | per Formel, ab dem 2. Jahr günstiger |
| **Relaunch** für Bestandskunden | Umbau mit Treuerabatt | per Formel |
| **Später: Claude-Schablonen** | fertige Vorlagen, mit denen andere ein AI-Business aufbauen | zweites Standbein, erst nach den ersten Kunden |

Sicherheit in drei Stufen (Preismodell): **Standard** ist immer dabei (HTTPS, strenge Header, kein Tracking,
wöchentliche Prüfung). **Erhöht** fügt Spam-Schutz, Überwachung und Sicherungen hinzu. **Hoch** ist Pflicht bei
Zahlung, Buchung oder Kundendaten (Webhook-Prüfung, monatliche Tiefenprüfung durch das Fernspäherkommando).

## 3. Kunden und ihr Problem

*(Vorschlag, bis Elias die Zielgruppe festlegt.)* Kleine, lokale Betriebe, deren Kunden sie auf dem Handy über
Google finden: Restaurants, Praxen, Friseure, Handwerk, Manufakturen, Studios.

Ihr Problem, wie es sich an URFA SOFRASI gezeigt hat:

- Die alte Seite ist auf dem Handy langsam, schwer zu bedienen, und die wichtigsten Angaben (Anrufen, Weg,
  Öffnungszeiten, Angebot) fehlen im ersten Bildschirm.
- Baukasten-Seiten sehen austauschbar aus, laden Fremdskripte und brauchen ein Cookie-Banner.
- Agenturen sind teuer und langsam, und niemand kümmert sich nach dem Start um die Seite.
- Der Preis ist ein Rätsel: Man weiß nicht, wofür man bezahlt.

**Warum OQ:** schnell gebaut, messbar gut, ehrlich gerechnet und danach betreut. Der Name passt dazu: ohne Quote,
also ohne Verkaufsdruck und ohne Fantasiepreis.

## 4. Was OQ unterscheidet

1. **Offener Preis:** Punkte je Baustein, Gewichte je Kriterium; der Kunde sieht jede Zeile und ihren Grund.
2. **Pflichtenheft statt Spielwiese:** Aus dem Auftrag (`auftrag.md`) entsteht mit `/bestellung` das Pflichtenheft, danach der Bau
   (`/kundenseite-bauen`). Der Stil-Konfigurator auf der OQ-Seite wurde am 05.10. bewusst entfernt (A-087); das Preismodell bleibt als Rechner im Repo.
3. **Tempo in zwei Stufen** (Richtwerte, gemessen):

   | Stufe | Wann | Richtzeit | Beleg |
   |---|---|---|---|
   | Baukasten-Seite | Seite aus vorhandenen Bausteinen, eine Prüfrunde | unter 1 Stunde Bauzeit | URFA-Meistervariante 38 min, Portfolio 33 min |
   | Meisterseite | eigenes Design, neue Bausteine, Feinschliff bis „fast makellos“ | rund 1 Tag, etwa 9 Prüfrunden | Hairstyle by Ümit, Bruder C: 27.09. 02:33 bis 18:17 Uhr, 8 Jury-Runden, 54 → 56 von 60 Punkten |
   | Firmen-Neubau | mehrseitige Firmenseite (Shop-Anbindung, Finder, Karriere), fremde Jury bis zur Schwelle | rund 10 Stunden, 5 Jury-Runden | OSG-Neubau 30.09. etwa 00:15 bis 10:00 Uhr, 63,75 → 75,75 von 100 |

   Beide Werte gelten erst dank der rund 4 Tage Vorarbeit. Neue Bausteine (z. B. das Friseur-Erlebnis) liegen bei
   der Meisterseite. Wartezeit entsteht sonst nur durch Inhalte des Kunden. Die Stufe fließt über Design-Punkte und
   Untergrenze C in den Preis.
4. **Messbare Qualität:** Meisterstandard mit festen Grenzwerten, jede Seite wird vor der Abgabe geprüft und von
   einem eigenen Späher-Team „von außen“ aufgeklärt.
5. **Datenschutz als Verkaufsargument:** keine Cookies, kein Tracking, keine eingebetteten Karten, Schriften lokal.
   Der Kunde braucht kein Cookie-Banner.
6. **Visuals mit KI:** Bilder und kurze Filme mit Higgsfield, leistungsschonend eingebaut (Poster zuerst, bei
   „Bewegung reduzieren“ statisch). Kosten je Visual bekannt: Bild 0,25–1,25 Credits, 5-s-Film 6,25 Credits.

## 5. Kunden gewinnen

| Weg | Inhalt | Stand |
|---|---|---|
| **Eigene OQ-Seite** | erster Bildschirm „Gebaut. Gemessen. Betreut.“ (Lichtkegel), Farbwelt Graphit (warmes Dunkelgrau, Messing), Leistungen als Bento mit Schaubildern (neue Seite, Erneuerung, suchmaschinenoptimiert, KI-Suche, Tempo, Sicherheit), Menü mit Lichtkegel, vier Arbeiten mit Live-Vorschau (Lindgrund, NORVAK, Zeytin & Glut, Zwischenbild), Preiskarten, Kontakt | **gebaut** (A-081–A-092, PR #72, #75, #76; Elias 06.10.: „sieht super aus“; Lighthouse mobil 99–100/100/100/100). **Offen vor Livegang:** Domain, Geschäfts-E-Mail, Foto, Über-mich-Text, Impressum und Datenschutz vom Fachmann; Preise und Angaben sind mit `data-pruefen` markiert |
| **Preisrechner** | Preisrahmen für Kunden | **entfällt auf der Seite** (Konfigurator am 05.10. entfernt); Rechner `wissen/preismodell/rechner.html` bleibt Werkzeug für Elias |
| **Referenzen von außen** | Fremde Seiten auswerten, Muster übernehmen (`/referenz`) | Space Rocket Berlin ausgewertet (A-088, Bericht in `wissen/referenzen/eingang/`, ohne Screenshots, weil der Browser in der Cloud-Umgebung gesperrt ist); maxpruegner.com per Abruf erreichbar, nur Kurzüberblick |
| **Profit-Chain** | Empfehlung mit Abschluss → Gratismonate für den Empfehler (gedeckt aus dem Gewinn des Neukunden, höchstens 6) | Formel steht |
| **Rabatt für Bewertung** | 5 % für eine Google-Bewertung | ⚠ vermutlich gegen Googles Richtlinien und das Wettbewerbsrecht; *(Vorschlag)* umwandeln in 5 % für eine **Referenzfreigabe** (Logo, Zitat, Vorschau auf der OQ-Seite) |
| **Saisonpakete** | Aktionsseiten zu Halloween, Weihnachten usw. an Bestandskunden | Formel steht |
| **Gewinnspiel** | z. B. eine Seite oder ein Jahr Abo zu gewinnen | Idee; Teilnahmebedingungen vom Fachmann, nicht selbst formulieren |
| **Direkt ansprechen** *(Vorschlag)* | Betriebe mit schwacher Handy-Seite; Vorher/Nachher als Beweis (wie URFA) | erst nach Gewerbeanmeldung; nur mit Einwilligung per E-Mail oder Telefon (Werberecht) |
| **YouTube Kids + Claude + Higgsfield** | eigene Einnahmequelle, von Elias als Geldquelle markiert | eigenes Vorhaben neben OQ; für Kinderinhalte gelten strenge Regeln, vor dem Start prüfen |

Grundsatz aus der Profit-Chain: **Neukunden sind wichtiger als kurzfristiger Gewinn.** Wie viel ein Neukunde kosten
darf, sagt das Akquisebudget: höchstens 10 % des Kundenwerts (Sp-Marge + 36 Monate Abo-Marge).

## 6. Preismodell (Kurzform, Details in `wissen/preismodell/PREISFORMELN.md`)

| Größe | Formel | Platzhalter |
|---|---|---|
| **Sp** Seitenpreis | Konzept A: Punkte je Baustein × Gewicht × Punktwert × f_BK; B als Gegenprobe; C (Aufwand) als Untergrenze | Punktwert 35 €; Musterseiten 1.960–2.420 €, Friseur-Idee 3.660 €, OSG-Neubau rund 4.800 € (A 5.740 / B 3.890 / C 2.010) |
| Gewichte | Funktionen 30 · Design 20 · Visuals 20 · Umfang 15 · Inhalte 10 · Technik 5 | per Paarvergleich änderbar |
| **BK** Bekanntheit | 0,35 Reichweite + 0,25 Google + 0,25 Netzwerk + 0,15 Presse; Wirkung höchstens ±15 % | – |
| **AM** Abo | Fixkosten + Paketstunden × Stundensatz + Pflegepunkte × 3 € | Basis 45 €, Plus 95 €, Premium 225 € (Beispiele) |
| **Nk / K** | Neukunde: Willkommensrabatt bei Empfehlung; Bestandskunde: Treue 1 % je 3 Monate, höchstens 10 % | Summe aller Rabatte ≤ 15 %, nie unter C |
| Änderungen | Zuschlag 0 % vor Entwurf, 25 % nach Entwurf, 50 % nach Abnahme; 3 kleine gratis | ein Satz in den AGB statt Erinnerung |
| Anzahlung | 30 % + 10 % ohne Empfehlung + 10 % ab 3.000 €, höchstens 50 % | Rest bei Abnahme |
| AM-Anpassung | höchstens +5 % im Jahr | – |

Ein Angebot entsteht so: Agent stuft die Seite ein → Formel rechnet → **Elias bestätigt** Preis, Abo und
Zusammensetzung. Beides bleibt nachträglich änderbar.

**Preisstrategie (Elias 01.10., Leitfaden „Partnerschaft über Geld leben“, PR #55/#56):** Der Verdienst liegt in der **Masse betreuter
Seiten** und ihren Monatszahlungen (AM), nicht im Seitenpreis. Der Seitenpreis (Sp) ist intern sehr flexibel, bei einer guten Seite auch
500 € oder weniger denkbar; der Kunde erfährt das nicht, trotzdem wird Sp so hoch wie möglich verhandelt. **Stand 06.10.:** Pilotpreis
Website 1.490 € einmalig; Betreuung **ab 75 €/Monat für alle Kunden** (Elias 05.10., 12 Monate), dazu Wahlleistungen und Serverkosten.

## 7. Ablauf eines Auftrags

1. **Anfrage** über die OQ-Seite (Gespräch oder Nachricht).
2. **Angebot** aus der Formel, jede Zeile mit Grund; Elias bestätigt.
3. **Vertrag und Anzahlung** (Werkvertrag für die Seite, eigener Betreuungsvertrag fürs Abo, AV-Vertrag).
4. **Inhalte einsammeln:** Fakten, Fotos, Logo, Rechtstexte vom Kunden. Nichts wird erfunden.
5. **Pflichtenheft** mit `/bestellung`: Aus den bestellten Leistungen werden die passenden Regeln des Qualitätssystems.
6. **Bau** mit `/kundenseite-bauen`, Prüfung mit `/pruefen`, `/sicherheit` und bei großen Seiten einer Jury-Schleife, Vorschau für den Kunden.
7. **Abnahme** mit `/abnahme` (Quality Gate, jede Regel mit Beleg), dann Kundenabnahme, Restzahlung, Live-Schaltung auf Cloudflare Pages.
8. **Betreuung:** wöchentlicher Check, monatlicher Bericht, Tiefenprüfung laut Paket, Saison- und Relaunch-Angebote.

## 8. Was schon steht

### Der Weg bis hierher (Gesamtbilanz)

Die kurzen Bauzeiten stehen auf dieser Vorarbeit. Zahlen aus den Sitzungsdaten und der Git-Historie der Repos
(Zeilen bis 30.09.2026, 11 Uhr; alle Commits aller Branches einschließlich Zusammenführungen, Aufteilung Website-Business nach Commit-Datum).

| Abschnitt | Zeitraum | Sitzungen | Commits | Ergebnis |
|---|---|---|---|---|
| URFA SOFRASI (Repo `urfa`) | 25.–27.09. | 2 | 30 | erste echte Seite: Variante dunkel und hell, Speisekarte mit 90 Gerichten als HTML, Schnellleiste, Regeln und Stolperfallen; Lighthouse bis Performance 96, Barrierefreiheit 100 |
| Claude-Setup | 27.09. | 1 | 2 | Setup-Skript für jede Cloud-Sitzung, 5 Agents, Hooks (Secret-Schutz, Audit, Diff vor Push), MCPs |
| Brüder-Wettbewerb (Hairstyle by Ümit) | 26.–28.09. | 3 | 54 | drei Websites parallel im Wettbewerb, 7 Skills, Prüfwerkzeuge (Lighthouse, Kopf-Check, Vorschau-Test), `FEHLER.md` und `DESIGN-WISSEN.md`; Lighthouse 99/100/100/100 |
| Fernspäherkommando | 27.–28.09. | 1 | 5 | Hfw Fortenbacher und 6 Späher mit eigenem Browser für die Außenaufklärung |
| Website-Business (dieses Projekt) | 28.–29.09. | 4 | 97 | Vorlage mit Baukasten, 3 Musterseiten, Visual-Pipeline mit Higgsfield, Fremdprüfung, Generalprobe URFA, Portfolio, Wartung, Recht, Preismodell, dieser Plan |
| Website-Business, zweiter Abschnitt | 29.09. abends – 30.09. | 5 | 36 | Video-Auswertung (Scroll-Film), OQ-Seite überarbeitet mit Generator, Qualitätssystem (125 Regeln), OSG-Neubau mit Jury, Preis-Einstufung, NORVAK-Link |
| Website-Business, dritter Abschnitt | 01.–06.10. | 13 | 82 | Merys Clean (Neubau, Designüberarbeitung, Team-Rahmen, Mappe), Preisstrategie „Masse statt Seitenpreis“, System auf Englisch, OQ-Seite fertig (Angaben, Preise, Leistungen, Hero, Graphit, Menü), Betreuung ab 75 €, Space-Rocket-Referenz, Lagebericht-Nachträge N003–N005 |
| **Summe Stand 06.10.** | **12 Kalendertage** | **37 sichtbar** | **247 auf `main` im Business-Repo, dazu 91 in den Vorprojekt-Repos (Stand 30.09.)** | **13 Seiten, 5 Repos, 3 Agenten-Teams, PR-Nummern bis #76** |

*Zählweise 06.10.:* Commits mit `git log` auf `main` des Business-Repos (Merges eingeschlossen, flache Kopie, 247 Stück; je Tag: 28.09. 65, 29.09. 56, 30.09. 44, 01.10. 24, 02.10. 23, 03.10. 9, 04.10. 7, 05.10. 12, 06.10. 7). Dieses Verfahren ergibt für 28.–30.09. mehr (165) als die 133 der Tabelle oben, weil die frühere Zählung anders abgegrenzt war; die Summen sind deshalb nicht fortschreibbar. Die 91 Commits der Vorprojekt-Repos (urfa, Claude-Setup, Brüder-Repo, Fernspäherkommando) sind **nicht neu gezählt**; die Sitzung „Bruder C“ (Ümits Seite) arbeitet weiter. Sitzungen: 7 außerhalb dieses Projekts (Abfrage 06.10.) plus 30 Fäden in diesem Projekt; die 16 vom 30.09. stammen aus einer anderen Abgrenzung.

Rechenleistung der Vorarbeit vor diesem Projekt laut Sitzungsdaten: rund 2,5 Mio. erzeugte Tokens, rechnerischer
Gegenwert rund 277 US-Dollar (kein Rechnungsbetrag). Für dieses Projekt liegen keine vergleichbaren Summen vor.

Was daraus folgt: Der Baukasten ist eine Investition von mehreren Tagen, die sich über jede Kundenseite verteilt.
Im Preis steckt deshalb nicht nur die Bauzeit, sondern auch dieses Können (Konzept A/B nach Wert, nicht nach Minuten).

### Bestand

| Bereich | Ergebnis |
|---|---|
| Vorlage und Baukasten | statische Vorlage mit Cloudflare Functions (Stripe Checkout, Webhook, Kontakt), strenge CSP, Bausteine: Marke, Hero mit Video, Einblenden, Seitenwechsel, Menü, Bento, Galerie, 3D |
| Musterseiten | **Lotlinie** Physio (hell & ruhig, mit KI-Raumbild), **Zwischenbild** Motion-Studio (laut & modern), **Lindgrund** Uhren (dunkel & edel, KI-Werkstattfilm), **URFA SOFRASI** Meistervariante (echtes Restaurant, Generalprobe) |
| Eigene OQ-Seite | `kunden/elias-studio/`: Hero Lichtkegel, Farbwelt Graphit, Leistungen als Bento mit sechs Schaubildern, Menü mit Lichtkegel, vier Arbeiten mit Live-Vorschau, Ablauf mit Linienzeichnungen, Preiskarten (Seite ab 1.490 €, Betreuung ab 75 €/Monat, beschriebene Wahlleistungen), Kontaktformular; 27 Tests, Lighthouse mobil 99–100/100/100/100. Name OQ, Nachname Wagner, Ort Eislingen von Elias bestätigt; E-Mail, Foto, Über-mich-Text, Impressum, Datenschutz und Domain **offen** (siehe Abschnitt 13) |
| Erste echte Kundenseite | **Merys Clean** (Gebäudereinigung): 16 Seiten, Designüberarbeitung nach Logo und Arbeitskleidung (A-076–A-078, Jury 9+), Team-Rahmen, Mappe `vertrieb/merysclean/`; Preis, Telefon, E-Mail trägt Elias selbst ein; offen vom Kunden: Hauptnummer, WhatsApp, Zitate, Herkunft der Arbeitsfotos, Rechtstexte, Mail-Schlüssel. Nie als Artifact; vorzeigbar nur als fiktive Fassung Klarwerk |
| Referenzen | `wissen/referenzen/eingang/`: Auswertung Space Rocket Berlin (Struktur, Stil, Texte, Design-Tokens, 11 Kundenseiten) als Muster-Quelle |
| Qualität | Meisterstandard, Skills `/meisterpruefung`, `/pruefen`, `/sicherheit`; Fernspäherkommando für Außenprüfung |
| Visuals | Higgsfield angebunden, Pipeline für AVIF/WebP und WebM/MP4, nahtlose Schleifen, Preisliste der Modelle |
| Betreuung | `wartung/check.mjs` wöchentlich per GitHub Action, Paketentwurf, Wartungsoffizier |
| Preis | Formeln, Preisstrategie, Rechner `wissen/preismodell/rechner.html` (PR #28, gemergt) |
| Recht | Leitfaden zu Gewerbe, Umsatzsteuer, Buchhaltung, Verträgen und Pflichten der Kundenseiten |
| Qualitätssystem | `wissen/fachgebiete/` (SEO, Technical SEO, Local SEO, GEO, strukturierte Daten, CRO, Barrierefreiheit, Performance, Analytics, Sicherheit + GLOBAL), `wissen/quellen/`, Skills `/bestellung` und `/abnahme`, Werkzeuge mit 17 Tests (PR #37) |
| Belastungsprobe | OSG-Neubau `kunden/osg-germany/` mit Jury-Protokoll, Preis-Einstufung, SEO/GEO-Vergleich; vorzeigbar nur als fiktive Marke NORVAK, weil OSG eine echte Firma ist (PR #38, #39) |

## 9. Kosten und Tragfähigkeit

**Laufende Kosten** (Beträge von Elias einzutragen): Claude-Abo, Higgsfield-Abo, Domain(s), Buchhaltungsprogramm,
IT-Haftpflicht, Steuerberater, Geschäftskonto. Hosting auf Cloudflare Pages kostet für kleine Seiten in der Regel nichts.

**Rechenbeispiel mit den Platzhaltern** (keine Prognose, nur um die Logik zu zeigen):

| Kunden mit Abo | Abo-Einnahmen im Monat (ab 75 €, ohne Wahlleistungen) | Einmalumsatz bei Pilotpreis 1.490 € |
|---|---|---|
| 5 | 375 € | 7.450 € |
| 10 | 750 € | 14.900 € |
| 20 | 1.500 € | 29.800 € |

Folgerungen:

- Das Abo ist das Fundament: Es wächst mit jedem Kunden und trägt die Fixkosten. Ziel *(Vorschlag)*: Die Abos
  decken alle laufenden Kosten, bevor Werbung Geld kostet.
- Zum Pilotpreis 1.490 € sind es rund 17 Seiten im Jahr, bei Ø 2.100 € rund 12: dann ist die Grenze der Kleinunternehmerregelung (25.000 € Vorjahresumsatz) in Reichweite.
  Die Entscheidung dafür oder dagegen gehört ins erste Gespräch mit dem Steuerberater.
- Anschaffungen werden vorher geprüft und dokumentiert (Preis, Sinn, Kosten-Nutzen, Chance auf MwSt-Erstattung);
  Liste bisher leer.

## 10. Recht und Steuern (Kurzform, Details in `recht/LEITFADEN.md`)

- **Gewerbe** anmelden: Bau + Hosting + Abo gilt fast immer als Gewerbe, nicht als freier Beruf.
- Danach Fragebogen zur steuerlichen Erfassung in ELSTER; Kleinunternehmer ja/nein mit dem Steuerberater.
- Geschäftskonto, Buchhaltungsprogramm mit E-Rechnung, IT-Haftpflicht.
- Vertragsvorlagen vom Fachmann: Werkvertrag, Betreuungsvertrag, AV-Vertrag, AGB (inklusive Satz zum variablen Preis).
- Name „OQ“: vor Logo und Domain eine Markenrecherche (DPMA/EUIPO) machen lassen.

## 11. Risiken und Antworten

| Risiko | Antwort |
|---|---|
| Preise zu niedrig, weil der Bau so schnell geht | Preis nach Wert (Formel A/B), Aufwand nur als Untergrenze |
| Rabatte fressen die Marge | Rabattgrenze 15 %, Gratismonate aus dem Gewinn gedeckt, nie unter Untergrenze C |
| Rechtlicher Ärger (Bewertungsrabatt, Werbung, Gewinnspiel, Rechtstexte) | Bewertungsrabatt umwandeln, Rechtstexte nie selbst schreiben, Fachmann für AGB und Teilnahmebedingungen |
| Kunde liefert keine Inhalte | Anzahlung, klare Liste im Angebot, Platzhalter sichtbar markiert |
| Abhängigkeit von Claude und Higgsfield | alles Gebaute ist statisches HTML ohne Laufzeit-Abhängigkeit; Visuals als Dateien im Repo |
| Zu wenig Zeit bei vielen Kunden | Routine an Agenten, wöchentliche Wartung automatisch, Abo-Pakete mit festen Stunden |
| Studien echter Firmen ohne deren Auftrag (z. B. OSG) | nie öffentlich zeigen; im Portfolio nur als fiktive Marke (NORVAK), echte Fassung erst mit Freigabe der Firma |
| KI-Bilder wirken austauschbar (Jury-Befund OSG) | echte Fotos des Kunden bevorzugen, KI-Bilder als Ergänzung; im Angebot als eigener Posten |

## 12. Fahrplan

| Phase | Inhalt | Stand |
|---|---|---|
| **1 Können** | Maßstab, Baukasten, Showcases, Visuals, Fremdprüfung, Generalprobe, Portfolio; am 30.09. ergänzt um Qualitätssystem und Belastungsprobe OSG | ✅ erledigt |
| **2 Entscheiden** | Preisformel und Euro-Werte, Zielgruppe, Name/Marke, Pakete; Marktvergleich der Preise | ▶ jetzt (seit 29.09.; entschieden: Name OQ, Ort Eislingen, Pilotpreis 1.490 €, Betreuung ab 75 €; offen: Euro-Werte der Wahlleistungen, Zielgruppe, Gewerbe) |
| **3 OQ-Seite** | Eigene Seite mit echten Angaben, Leistungen, Preisen, Arbeiten, Referenzfreigaben | **gebaut** (A-081–A-092, Stand 06.10., PR #76 wartet auf Merge); Livegang wartet auf Domain, Geschäfts-E-Mail, Foto, Über-mich-Text und Rechtstexte von Elias |
| **4 Konten und Amt** | Steuerberater, Gewerbe, ELSTER, Konto, Versicherung, Verträge; Cloudflare, Stripe, Domain (`ops/HAENDE.md`) | vor dem ersten zahlenden Kunden |
| **5 Erste Kunden** | 2–3 Pilotkunden *(Vorschlag: URFA SOFRASI als erster, weil die Seite fertig ist)*, Referenzen sammeln, Ablauf nachschärfen | Merys Clean ist die erste echte Kundenseite (Mappe `vertrieb/merysclean/`, Preis trägt Elias ein; noch kein Vertrag, keine Zahlung); URFA weiter offen. Vorbereitet (A-056): Pilotangebot, Verkaufsmappe, Gesprächsleitfaden, Startklar-Liste in `vertrieb/`; Amtsweg parallel starten, weil die Steuernummer Wochen braucht |
| **6 Wachsen** | Profit-Chain aktiv, Saisonpakete, Abo-Stamm aufbauen; dann Claude-Schablonen als zweites Standbein | – |

## 13. Entscheidungen, die bei Elias liegen

> **Neu 30.09. (A-056, `vertrieb/ERSTKUNDE.md`):** Für den ersten zahlenden Kunden zählen nur vier davon, gebündelt als
> E1 Gewerbe + ELSTER jetzt starten, E2 Pilotpreis (1.490 € einmalig, dazu optional Abo mit Wahlleistungen; Stand 05.10.: **Betreuung ab 75 €/Monat für alle, auch Merys Clean und URFA (Elias, 05.10.), 12 Monate**; Mietmodell verworfen), E3 URFA persönlich ansprechen (= Nr. 8),
> E4 Kontakt und Name auf der Mappe (= Nr. 5). Die übrigen können bis nach dem ersten Kunden warten.

1. **Preisformel:** A als Hauptformel, B als Gegenprobe, C als Untergrenze – einverstanden?
2. **Euro-Werte** (Punktwert, Stundensatz, Paketpreise): als eigener Auftrag mit Marktvergleich festlegen?
3. **Bewertungsrabatt:** in Referenzfreigabe umwandeln oder rechtlich prüfen lassen?
4. **Zielgruppe:** lokale Betriebe wie oben, oder enger (z. B. nur Gastronomie und Friseure)?
5. **Name:** ~~OQ als Marke~~ entschieden (A-082, Name OQ, Ort Eislingen); Inhabername und Schreibweise nur noch bestätigen.
6. ~~Konfigurator~~ entfällt: auf der OQ-Seite am 05.10. entfernt (A-087). Offen bleibt nur, ob ein Preisrahmen später wieder angezeigt werden soll.
7. **Framer:** statt Higgsfield, zusätzlich oder gar nicht?
8. **Pilotkunde:** URFA SOFRASI ansprechen, sobald Phase 4 steht?
9. **Qualitätssystem im Alltag:** `qualitaet.mjs` in die automatische Prüfung (CI) aufnehmen und den Baustein „zaehler“ (Besucherzählung ohne Cookies) bauen (A-052)?
10. **OSG:** Studie ruht nach Runde 5. Weiterführen (Runde 6 mit den offenen Mängeln), als Verkaufsargument an OSG herantreten oder ruhen lassen?
11. **Livegang der OQ-Seite (neu 06.10.):** Domain wählen und kaufen, Geschäfts-E-Mail und Postfach einrichten (Anleitung `ops/HAENDE.md`), Foto und Über-mich-Text liefern, Impressum und Datenschutz vom Fachmann; erst dann kann die Seite öffentlich gehen. Die Preise auf der Seite (ab 1.490 €, ab 75 €/Monat) vor Livegang bestätigen.
12. **Gewerbe und Pilotpreis** (aus E1/E2, weiter offen): Gewerbe + ELSTER starten, Pilotpreis bestätigen, Kontakt auf der Merys-Clean-Mappe eintragen.

**Ehrlich als offen markiert (Stand 06.10.):** alle Euro-Beträge der Wahlleistungen und Serverkosten (Platzhalter); kein Umsatz, kein Vertrag, keine Zahlung; kein Gewerbe; Domain und Geschäfts-E-Mail fehlen; Higgsfield-Verbrauch zuletzt am Konto geprüft am 06.10. (15 Credits); Commits und Sitzungen der Vorprojekt-Repos seit 30.09. nicht neu gezählt.
