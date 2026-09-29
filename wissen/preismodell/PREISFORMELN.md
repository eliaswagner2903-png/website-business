# Preisformeln OQ – erste Konzepte (Entwurf)

> Stand 2026-09-29, Auftrag A-040. Grundlage: `wissen/notizen/` bzw. `/mnt/project-files/notizen/oq-notizen-2026-09-29*.md`.
> Nichts aus den Notizen wurde verworfen; alles hier ist ein **Vorschlag zum Prüfen**.
> **Alle Euro-Beträge sind Platzhalter ohne Marktbasis.** Sie zeigen nur, wie die Formeln rechnen. Die Beziehungen
> (Gewichte, Punkte, Faktoren) sind der eigentliche Inhalt.
> Rechnen: `node wissen/preismodell/tabellen.mjs` (alle Tabellen unten), `rechner.html` im Browser (Gewichte schieben).

## 0. Grundsatz: Jeder Preis hat einen Grund

1. Jede Seite wird in **Bausteine** zerlegt (Agent kategorisiert vor dem Angebot).
2. Jeder Baustein hat **Punkte** = seine Wertigkeit. Jede Kriteriengruppe hat ein **Gewicht** im Vergleich zu den anderen.
3. **BK** (Bekanntheit Kunde) verschiebt das Ergebnis um höchstens ±15 %.
4. **Profit-Chain** (Bewertung, Empfehlung, Treue) wirkt erst danach, als sichtbare Zeile.
5. **Elias bestätigt.** Eine Korrektur ist erlaubt, braucht aber eine eigene Zeile mit Grund
   (`Korrektur: −150 € · Grund: …`). So bleibt auch der korrigierte Preis begründet und später bearbeitbar.

Reihenfolge der Rechnung: `Bausteine → Punkte → Gewichte → BK → Express → Profit-Chain → Korrektur (Elias) → Endpreis`.

## 1. Die Kriterien und ihre Wertigkeit zueinander

| Rang | Kriterium | Gewicht | Warum so viel |
|---|---|---|---|
| 1 | **Funktionen** (Formular, Termin, Zahlung, Katalog, Editor) | **30 %** | Bringen dem Kunden direkt Umsatz, kosten am meisten Prüfung und später Pflege, haben das höchste Fehlerrisiko |
| 2 | **Design-Individualität** (Vorlage → eigenes Design → Markenauftritt) | **20 %** | Unterscheidet OQ von Baukästen; hier steckt Elias' Urteil |
| 2 | **Visuals und Erlebnis** (Bewegung, KI-Bild/Video, Video-Einstieg, 3D) | **20 %** | Der „High-End“-Teil; hoher Wirkungswert, Fremdkosten (Credits) |
| 4 | **Umfang** (weitere Seiten) | **15 %** | Mehr Seiten = mehr Arbeit, aber dank Generator nur mäßig mehr |
| 5 | **Inhalte erstellen** (Texte, Bilder beschaffen) | **10 %** | Echte Arbeit, aber oft vom Kunden geliefert |
| 6 | **Technik und Recht** (Sprachen, Einwilligung) | **5 %** | Selten, meist Pflichtaufwand ohne Zusatzwert |
| – | **Grundpaket** (Start, Impressum, Datenschutz, 404, Handy, SEO) | fest 20 Punkte | Immer gleich, darum ungewichtet |

Verhältnis in einem Satz: **eine Funktion wiegt anderthalbmal so viel wie Design oder Visuals, doppelt so viel wie
der Umfang und dreimal so viel wie Inhalte.**

**Selbst nachjustieren (Paarvergleich):** Jedes Kriterium gegen jedes andere stellen und fragen „Was ist dem Kunden mehr
wert?“. Sieger bekommt 1 Punkt, Gleichstand je ½. Punkte je Kriterium ÷ Gesamtpunkte = Anteil; auf runde Werte gebracht, jedes Kriterium mindestens 5 %. Mit meiner Einschätzung:

| | Fu | De | Vi | Um | In | Te | Summe | Anteil → Gewicht |
|---|---|---|---|---|---|---|---|---|
| Funktionen | – | 1 | 1 | 1 | 1 | 1 | 5 | 33 % → 30 % |
| Design | 0 | – | ½ | 1 | 1 | 1 | 3,5 | 23 % → 20 % |
| Visuals | 0 | ½ | – | 1 | 1 | 1 | 3,5 | 23 % → 20 % |
| Umfang | 0 | 0 | 0 | – | 1 | 1 | 2 | 13 % → 15 % |
| Inhalte | 0 | 0 | 0 | 0 | – | 1 | 1 | 7 % → 10 % |
| Technik | 0 | 0 | 0 | 0 | 0 | – | 0 | 0 % → 5 % (Mindestgewicht) |

### Punkte je Baustein (Wertigkeit innerhalb der Kriterien)

| Kriterium | Baustein | Punkte | Pflegepunkte (für AM) |
|---|---|---|---|
| Grundpaket | Start, Impressum, Datenschutz, 404, Handy, SEO-Basis | 20 | 0 |
| Umfang | je weitere Inhaltsseite | 4 | 0 |
| Funktionen | Kontaktformular | 4 | 1 |
| | Termin-Link (extern, z. B. Cal.com) | 3 | 0 |
| | eigene Online-Terminbuchung | 10 | 3 |
| | Online-Zahlung (Stripe) | 12 | 4 |
| | Katalog/Speisekarte mit Preisen | 6 | 1 |
| | Galerie | 3 | 0 |
| | Kunden-Editor (selbst pflegen) | 10 | 2 |
| Design | eigenes Design | 10 | 0 |
| | Premium-Design mit Markenauftritt | 18 | 0 |
| Visuals | Bewegung und Scroll-Effekte | 4 | 0 |
| | KI-Bild oder -Video je Stück (+ Credits als Fremdkosten) | 2 | 0 |
| | Video-Einstieg / Erlebnis-Story (z. B. Friseur mit Buch und Stempel) | 14 | 1 |
| | 3D-Szene | 16 | 2 |
| Inhalte | Texte schreiben je Seite | 2 | 0 |
| | Bildmaterial beschaffen/aufbereiten | 4 | 0 |
| Technik/Recht | weitere Sprache | 8 | 1 |
| | Einwilligung (Cookies, Karten, Tracking) | 4 | 1 |

## 2. BK – Bekanntheit Kunde

```
BK = 0,35·R + 0,25·G + 0,25·N + 0,15·P            (jeder Teilwert 0–10, BK also 0–10)
f_BK = 1 + 0,15 · (BK − 5) / 5                     (BK 0 → 0,85 · BK 5 → 1,00 · BK 10 → 1,15)
```

| Teilwert | Gewicht | 0 | 3 | 6 | 10 |
|---|---|---|---|---|---|
| **R** Reichweite online (Google-Bewertungen, Follower) | 35 % | keine | < 50 Bew. / < 1.000 | 50–300 / bis 10.000 | > 1.000 / > 100.000 |
| **G** Größe (Mitarbeiter, Standorte) | 25 % | allein | 2–5 | 6–20 | Kette / > 100 |
| **N** Netzwerk/Multiplikator (Verband, Verein, Innung) | 25 % | keins | kennt einige Betriebe | aktiv in Verband/Verein | Vorsitz, Branchenstimme |
| **P** Ruf und Presse | 15 % | keiner | lokal bekannt | regionale Presse | überregional |

Warum BK den Preis beeinflusst: Ein bekannter Kunde hat mehr Besucher, mehr Nutzen von der Seite und höhere
Ansprüche (Last, Sicherheit, Reaktionszeit). Ein unbekannter Kleinbetrieb bekommt dafür bis zu 15 % Nachlass.
Die Kappung bei ±15 % verhindert, dass Bekanntheit den Preis stärker bestimmt als die Leistung.

| Beispiel Lotlinie | BK | f_BK | Sp (Konzept A) |
|---|---|---|---|
| unbekannt (alle Teilwerte 1) | 1,0 | 0,88 | 1.820 € |
| wie Demo | 3,4 | 0,95 | 1.960 € |
| sehr bekannt | 8,6 | 1,11 | 2.290 € |

**Andere Richtung (zur Entscheidung):** BK könnte auch als **Referenzrabatt** wirken: Ein sehr bekannter Kunde ist
Werbung für OQ, also bekommt er Nachlass statt Aufschlag. Mein Vorschlag: Aufschlag über R, G, P (Nutzen), aber
ein hoher **N** (Multiplikator) führt zusätzlich in die Profit-Chain (siehe 5), damit beide Gedanken Platz haben.

## 3. Sp – drei Konzepte

### Konzept A: Punkte-Stückliste (additiv)

```
Sp = (Grundpunkte + Σ Punkte_Baustein · Gewicht_Kriterium / Standardgewicht) · Punktwert · f_BK · f_Express
Punktwert = 35 € (Platzhalter) · f_Express = 1,15 bei Lieferung unter einer Woche
```

- **Stärke:** Für den Kunden am klarsten („Ihre Seite: 59 Punkte à 35 €“). Passt direkt in den geplanten
  Seiten-Editor mit Preisrechner: jeder Klick auf einen Baustein zeigt sofort seine Punkte.
- **Schwäche:** Wächst ohne Grenze; eine riesige Seite wird linear teuer, obwohl der Generator viel spart.

### Konzept B: Gewichtete Bewertung (Noten 0–10)

```
Note_Kriterium = min(10, Punkte_Kriterium / Deckel · 10)
Score = Σ Note · Gewicht / 100                      (0–10)
Sp = (Sockel + Spanne · Score / 10) · f_BK · f_Express
Sockel = 600 €, Spanne = 4.400 € (Platzhalter) → Sp zwischen 600 € und 5.000 € vor BK
```

- **Stärke:** Die Gewichte (30/20/20/15/10/5) wirken direkt und sichtbar. Preis hat eine feste Ober- und Untergrenze,
  gut für Pakete („Ihre Seite liegt bei Score 4,1 von 10“).
- **Schwäche:** Schwerer zu erklären; ab dem Deckel bringt ein Baustein nichts mehr.

### Konzept C: Aufwand × Wert (multiplikativ)

```
Kosten = Stunden_Elias · Stundensatz + Fremdkosten (Credits, Domain, Kleinkram)
Sp = Kosten · (1 + Marge) · (1 + Branchenhebel) · f_BK
Stundensatz 60 €, Marge 30 % (Platzhalter) · Branchenhebel 0,1 (Imbiss) bis 0,4 (Luxus)
```

- **Stärke:** Deckt garantiert die eigenen Kosten.
- **Schwäche:** Mit Claude ist Elias' Zeit klein (Generalprobe URFA: 38 Minuten Bauzeit). Nach Aufwand verschenkt man
  den Wert; C liefert darum nur die **Untergrenze**.

### Vergleich an den Musterseiten

Bausteine nach Repo-Stand geschätzt, BK-Werte erfunden (Demos haben keine echte Bekanntheit).

| Beispiel | BK | f_BK | A Punkte | **A: Sp** | B Score | **B: Sp** | C Stunden | **C: Untergrenze** |
|---|---|---|---|---|---|---|---|---|
| Lotlinie Physio (hell) | 3,4 | 0,95 | 59 | 1.960 € | 2,6 | 1.670 € | 5,4 | 520 € |
| URFA SOFRASI Restaurant | 4,3 | 0,98 | 67 | 2.300 € | 3,3 | 2.030 € | 6,5 | 580 € |
| Zwischenbild Motion-Studio (laut) | 5,1 | 1,00 | 62 | 2.180 € | 3,1 | 1.980 € | 6,0 | 650 € |
| Lindgrund Uhren (edel) | 4,7 | 0,99 | 70 | 2.420 € | 4,1 | 2.400 € | 7,4 | 860 € |
| Friseur-Erlebnis (Idee) | 4,2 | 0,98 | 107 | 3.660 € | 6,5 | 3.390 € | 12,1 | 1.160 € |

Woraus sich der Preis zusammensetzt (Punkte je Kriterium, Konzept A, ohne Grundpaket):

| Beispiel | Funktionen | Design | Visuals | Umfang | Inhalte | Technik |
|---|---|---|---|---|---|---|
| Lotlinie | 3 (8 %) | 10 (26 %) | 6 (15 %) | 12 (31 %) | 8 (21 %) | 0 |
| URFA | 13 (28 %) | 10 (21 %) | 4 (9 %) | 12 (26 %) | 8 (17 %) | 0 |
| Zwischenbild | 0 | 18 (43 %) | 4 (10 %) | 12 (29 %) | 8 (19 %) | 0 |
| Lindgrund | 4 (8 %) | 18 (36 %) | 24 (48 %) | 0 | 4 (8 %) | 0 |
| Friseur-Erlebnis | 25 (29 %) | 18 (21 %) | 22 (25 %) | 12 (14 %) | 6 (7 %) | 4 (5 %) |

Was man daran sieht: Die Friseur-Idee ist mit Buchung, Zahlung und Video-Einstieg klar die teuerste; Lindgrund ist
kurz, aber durch 3D und Markenauftritt teurer als die längere Lotlinie. **A und B liegen nah beieinander** (Abstand
höchstens 15 %), C liegt weit darunter.

### Empfehlung

**A als Hauptformel** (erklärbar, passt in den Editor), **B als Gegenprobe** (weicht B mehr als 20 % ab, prüft Elias
die Einstufung) und **C als Untergrenze** (`Sp ≥ C`). Die Gewichte aus Abschnitt 1 steuern A und B gleichzeitig.

## 4. AM – Abo monatlich

```
AM = Fixkosten + Paketstunden · Stundensatz + Pflegepunkte · Pflegewert        (auf 5 € gerundet)
Fixkosten 7 €/Monat (Domain, Werkzeuge anteilig) · Pflegewert 3 € · Paketstunden: Basis 0,5 · Plus 1,5 · Premium 3,5
```

Pakete wie in `wartung/PAKETE.md`. Pflegepunkte kommen aus den Bausteinen: Was später gepflegt werden muss
(Zahlung, Buchung, Formular, 3D), kostet im Abo mehr. Alternative zum Vergleich: `AM = 2,5 % von Sp`.

### Theorie „Sp = AM“ geprüft

- **Wörtlich** (Einmalpreis = Monatsbeitrag) ergibt es keinen Sinn: Der Kunde zahlte jeden Monat den ganzen Seitenpreis.
- **Sinnvolle Lesart 1: gleiche Gleichung.** Sp und AM entstehen aus denselben Bausteinen (Punkte für Sp,
  Pflegepunkte für AM). So erklärt sich auch das Abo aus der Seite. **Umgesetzt oben.**
- **Sinnvolle Lesart 2: `Sp = n · AM`.** Die Zahl n = Sp ÷ AM sagt, nach wie vielen Monaten das Abo so viel eingebracht
  hat wie die Seite. Das ermöglicht ein **Mietmodell** (0 € Einmalpreis, dafür höheres AM mit Mindestlaufzeit n).
  Als Prüfgröße: n zwischen 12 und 36 wirkt ausgewogen; n > 36 heißt, das Abo ist im Verhältnis zur Seite billig.

| Beispiel | Paket | Pflegepunkte | **AM (Formel)** | AM (2,5 % von Sp) | n = Sp ÷ AM |
|---|---|---|---|---|---|
| Lotlinie | Plus | 0 | 95 € | 50 € | 20,6 |
| URFA | Basis | 2 | 45 € | 60 € | 51,1 |
| Zwischenbild | Plus | 0 | 95 € | 55 € | 22,9 |
| Lindgrund | Premium | 3 | 225 € | 60 € | 10,8 |
| Friseur-Erlebnis | Plus | 9 | 125 € | 90 € | 29,3 |

Befund: Die Formel folgt der Betreuungszeit (Premium teuer), die Prozent-Variante nur der Seitengröße. URFA mit
n = 51 zeigt, dass Basis für eine Seite mit Speisekarte eher zu günstig ist.

## 5. K und Nk, Profit-Chain

```
NkSp = Sp · (1 − 5 % Willkommen, nur bei Empfehlung) · (1 − 5 % Bewertung)
NkAM = AM
KSp  = Sp · (1 − Treue)          Treue = 1 % je volle 3 Abo-Monate, höchstens 10 %  (für Folgeaufträge)
KAM  = AM, abzüglich Gratismonate aus Empfehlungen
Gratismonate x = min(6, abrunden(20 % · Deckungsbeitrag_Neukunde_Jahr1 / KAM_Empfehler))
Deckungsbeitrag = NkSp · 70 % + 12 · NkAM · 60 %        (Margen geschätzt)
```

Der Grund für x: Der Empfehler bekommt ein Fünftel dessen zurück, was der neue Kunde im ersten Jahr übrig lässt.
So ist der Rabatt immer durch den Gewinn gedeckt, und größere Empfehlungen bringen mehr Gratismonate.

| Neukunde über Empfehlung | Sp | NkSp | mit Bewertung | Deckungsbeitrag J1 | Gratismonate Empfehler (KAM 95 €) |
|---|---|---|---|---|---|
| Lotlinie | 1.960 € | 1.860 € | 1.770 € | 1.986 € | 4 |
| URFA | 2.300 € | 2.190 € | 2.080 € | 1.857 € | 3 |
| Zwischenbild | 2.180 € | 2.070 € | 1.970 € | 2.133 € | 4 |
| Lindgrund | 2.420 € | 2.300 € | 2.190 € | 3.230 € | 6 |
| Friseur-Erlebnis | 3.660 € | 3.480 € | 3.310 € | 3.336 € | 6 |

**Wichtig vor dem Einsatz, Bewertungsrabatt:** Nach meinem Kenntnisstand verbieten Googles Richtlinien Anreize für
Bewertungen (Rabatt gegen Rezension), und nach deutschem Wettbewerbsrecht müssen „gekaufte“ Bewertungen offengelegt
werden. Das ist aus dem Gedächtnis, nicht frisch recherchiert, und muss geprüft werden. Mögliche Umformung, die den
Gedanken behält: 5 % für eine **Referenzfreigabe** (Logo, Zitat und Vorschau auf Elias' eigener Seite) oder ein
kurzes Feedback-Gespräch; um die Google-Bewertung wird ohne Gegenleistung gebeten.

## 6. Saison-Umgestaltung (z. B. Halloween)

```
S = (Änderungspunkte · (1 − Wiederverwendung) + 2 Rückbaupunkte) · Punktwert · (1 − Treue)
Wiederverwendung = 0 im ersten Jahr, 0,5 ab dem zweiten (Saisonvorlage liegt schon bereit)
```

Beispiel 12 Änderungspunkte (Aktionsbanner, Farbschema, Aktionsseite): Jahr 1 480 € · Jahr 2 265 € · Jahr 3 250 €.

## 7. Was als Nächstes zu entscheiden ist

1. Konzept A als Hauptformel, B als Gegenprobe, C als Untergrenze – einverstanden?
2. Gewichte 30/20/20/15/10/5 so lassen oder per Paarvergleich selbst setzen (Rechner hilft).
3. BK als Aufschlag (Vorschlag) oder als Referenzrabatt.
4. Bewertungsrabatt rechtlich prüfen lassen oder gleich in Referenzfreigabe umwandeln.
5. Euro-Werte (Punktwert, Stundensatz, Pakete) erst mit Marktvergleich festlegen; das ist ein eigener Auftrag.

Die offenen Punkte aus den Notizen (AGB-Hinweis vs. Erinnerung bei Änderungen, Vorauszahlung) bleiben offen; die
Formeln passen zu beiden Varianten, weil jede Änderung als Baustein mit Punkten neu gerechnet wird.
