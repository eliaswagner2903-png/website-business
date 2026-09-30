---
titel: 25 Tricks to Level Up Claude Design in 13 Mins
url: https://www.youtube.com/watch?v=_SVU3oC4JX8
video_id: _SVU3oC4JX8
kanal: Jay E | RoboNuggets
datum: 2026-09-27
dauer: 13:32
sprache: en
kategorien: [webdesign, claude, ai, frontend]
tags: [claude-design, designsystem, schriften, komponenten, animation, icons, svg, gsap, tonalitaet, referenzbibliothek]
gelernt: 2026-09-30
transkript: manuell (von Elias aus YouTube kopiert, vollständig, mit Kapiteln)
visuell: nicht geprüft (Video zeigt laut Creator viele KI-Animationen; Bildabruf in der Cloud nicht möglich)
---
# 25 Tricks für besseres Design mit Claude (Jay E, RoboNuggets, 2026)

Zweites Lernvideo. 25 Tipps in drei Stufen (einfach, mittel, fortgeschritten), meist Ressourcen und Arbeitsweisen rund um „Claude Design“ und Claude Code. Fassung 2: gegen das von Elias eingefügte vollständige Transkript korrigiert (Fassung 1 nutzte fehlerhafte Auto-Untertitel).

## Zusammenfassung
Eine Liste von Tricks, wie man KI-Design weniger „vibe-coded“ aussehen lässt: Designsystem zuerst, eigene Schriften, eigene Texte, fertige Komponenten statt Neuerfinden, SVG/Icons, GSAP für Bewegung, zuletzt Regler-Skill, Animationen aus dem Transkript und eine eigene Design-Bibliothek. Die Stärke ist die Fülle nützlicher Ressourcen. Schwächen: nur Nennungen, keine Messwerte oder Ergebnisvergleiche im Ton, dazu Werbung für die eigene Community [04:25] und einen Bilddienst, den der Creator selbst nutzt [05:16]. Auch das eingefügte Transkript enthält Hörfehler (z. B. „Al“ für AI, „clog code“, „GAP“).

## Kernideen
- [00:32] **EMPFEHLUNG** Zuerst ein Designsystem anlegen (Farben, Schriften, Bausteine), auch aus Deck, Website oder Screenshot ableiten lassen.
- [02:45] **MEINUNG** „Das schnellste Zeichen für ein vibe-coded Design ist die Schrift“, weil Anfänger Claudes Standardschrift lassen. Eigene Schrift (Fontshare, Fontesk, Paarungen über FontJoy) hebt es ab.
- [03:26] **EMPFEHLUNG** Texte nicht nach KI klingen lassen: Claude die fünf Top-Anbieter der Branche studieren lassen, Textmuster ins Designsystem einbauen. Dazu ein Tonalitäts-Skill [06:49].
- [07:22] **BEHAUPTUNG** Fertige, agentenfreundliche Komponentenbibliotheken (21st.dev, React Bits, Canvas UI) sparen Tokens, weil Claude „einen bewährten Abschnitt“ einsetzt statt neu zu entwerfen.
- [08:39] **EMPFEHLUNG** Grafiken als SVG anfordern: skaliert ohne Unschärfe, von Hand umfärbbar, animierbar.
- [10:36] **EMPFEHLUNG** Für Bewegung und Interaktion GSAP (GreenSock Animation Platform) verwenden; scrollgesteuerte Abschnitte, Text-Reveals.

## Methoden
Stufe Einfach (Kapitel [00:32]):
1. [00:32] Designsystem in Claude Design (claude.ai/design → Designsysteme → anlegen): Geschäft beschreiben, Schriften, Logos, Assets; oder aus Deck/Website/Screenshot ableiten.
2. [01:09] Galerie „styles.referero.design“ mit über 2.000 lesbaren Designsystemen (u. a. Mercury, Linear, Apple): eines kopieren, in Claude einfügen, Wünsche ergänzen.
3. [01:33] Claude aus der Galerie (oder jeder anderen) per Link die drei zur Branche passendsten heraussuchen lassen.
4. [01:57] Designsysteme direkt in Claude Code oder Cowork als eigenen Skill bauen (Beispiel /duolingo für Inhalte im Duolingo-Stil); Claude Design im Browser kommt nicht an Dateien auf dem eigenen Rechner.
5. [02:45] Schriften: Fontshare, Fontesk (beide gratis), FontJoy für Überschrift/Fließtext-Paare; Schriftdatei ins Designsystem legen.
6. [03:26] Texte: Branchen-Top-5 analysieren, Muster ins Designsystem.
7. [03:52] Designsysteme mischen (Schrift aus A, Farbe und Bewegung aus B).

Stufe Mittel (Kapitel [04:25]):
8. [05:07] Bilder/Videos: Claude Design erzeugt sie nicht selbst; per Claude Code einen Generator anbinden. Der Creator nutzt „KAI“ (Schreibweise laut Transkript), pay-per-use.
9. [05:35] Früheres Projekt als Ausgangspunkt: URL eines fertigen Claude-Design-Projekts in neue Sitzung geben; in Claude Code den Namen der früheren Sitzung nennen.
10. [05:51] Eigene Referenzbibliothek (Dribbble, Awwwards, X); der Creator hat dafür die Chrome-Erweiterung „Rubric References“ gebaut (Seite + Screenshot + Notiz).
11. [06:24] „Impeccable“: Design-Skill mit Befehlen, der Hierarchie, Abstände, Typografie, Barrierefreiheit, Leerzustände prüft und korrigiert („entschlackt“ KI-Look).
12. [06:49] Tonalitäts-Skill: Liste verbotener Wörter, eigene Sprechweise, eigene Formulierungen; fertige Regelwerke nutzbar (ASD-STE100, Googles Developer Documentation Style Guide, Apples Schreibstil) [07:13].
13. [07:22] 21st.dev (UI-Komponenten, Open-Source-Community, für Agenten gemacht).
14. [07:48] React Bits (react-bits.dev): „kantigere“ Komponenten, animierter Text, Glas-Karten, Cursor-Effekte; Code kopieren, an Claude geben oder ins Designsystem aufnehmen.
15. [08:05] Canvas UI (canvasui.dev): 35 Effekte (liquid glass, shatter, particle reveal), kostenlos.
16. [08:20] Icons: ganzes Paket in einem Stil von Iconify oder Flaticon laden und Claude als Vorlage geben.
17. [08:39] SVG verlangen (Icons, Illustrationen, Diagramme).
18. [09:06] Lordicon (lordicon.com): animierte Icons als Lottie-Datei, viele gratis.
19. [09:40] Creators Toolbox (creatorstoolbox.com, Bereich Ressourcen): über 150 freie Ressourcen (animierte Komponenten, Three.js-Effekte, SVG-Icons, Logo-Galerien, Mockup-Kits).

Stufe Fortgeschritten (Kapitel [10:12]):
20. [10:12] Apples Human Interface Guidelines (frei verfügbar: Layout, Schriftgrößen, Tippflächen, Farbe) als Skill, damit Claude die Regeln befolgt statt zu raten.
21. [10:36] GSAP für hochwertige Bewegung und Scroll-Interaktion.
22. [10:52] `/design` in Claude Code (laut Creator jetzt offizieller Befehl): Idee oder Screenshot → Canvas mit bearbeitbaren Zeichenflächen, kennt Arbeitsbereich, Regeln, Gedächtnis.
23. [11:34] Tweaks-Panel: in Claude Design eingebaut (Regler für Schrift, Abstände, Farbe); in Claude Code einen eigenen Tweak-Skill bauen, der ein Reglerpanel auf jede HTML-Seite legt und die Werte zurückschreibt. Befehlsname im Transkript „/take“, vermutlich Hörfehler für „Tweak“.
24. [11:52] Transkript → Motion Graphics: Transkript mit Wort-Zeitstempeln (gratis per Whisper), Claude findet Stellen für Animationen, baut Clips per „Hyperframes“; Bonus: vorhandenes Designsystem nutzen, damit es nicht nach „vibe-coded AI“ aussieht [12:24].
25. [12:40] Eigenes „Design-Betriebssystem“: kleine Micro-App, in der jedes fertige Design und jedes erzeugte Bild/Video indexiert ist; Beispiel des Creators: Elementbibliothek mit 3D-Assets, Bewegungen, SVG-Icons in Markenstil.

## Werkzeuge
- Claude Design (claude.ai/design), Claude Code (`/design`), Claude Cowork, Fontshare, Fontesk, FontJoy, styles.referero.design, 21st.dev, React Bits, Canvas UI, Iconify, Flaticon, Lordicon (Lottie), GSAP, Impeccable, Apple Human Interface Guidelines, Whisper, Hyperframes, Creators Toolbox, Rubric References (eigene Erweiterung des Creators).
- Bezahl/Partner: Bild-/Video-Generator „KAI“ [05:16], Community „RoboNuggets“ mit Kursen [04:25] (Werbung; Affiliate-Hinweise in der Beschreibung).

## Beispiele
- [00:46] Aus Deck, Website oder Screenshot ein Designsystem ziehen lassen (Farben, Schriften, Komponenten).
- [02:20] Skill „/duolingo“, der Inhalte im Duolingo-Stil erzeugt.
- [08:20] Canvas-UI-Effekte „liquid glass, shatter, particle reveal“.
- [12:40] Elementbibliothek des Creators (3D-Assets, Bewegungen, SVG-Icons).

## Handlungsempfehlungen
- [02:45] **EMPFEHLUNG** Schriften sind bei uns schon lokal (`@fontsource`); Fontshare/Fontesk-Schriften herunterladen und selbst hosten, nie per fremdem CDN laden → passt zur Datenschutzregel.
- [03:26] **EMPFEHLUNG** Branchen-Textmuster als Teil des Auftrags (`/bestellung`) prüfen, aber keine Texte kopieren (Regel „Nichts erfinden“, Urheberrecht).
- [06:49] **EMPFEHLUNG** Tonalitäts-Skill je Kunde (Verbotswörter, Stil) als Baustein für Kundentexte prüfen.
- [06:24] **EMPFEHLUNG** Impeccable-Idee (Hierarchie, Barrierefreiheit, Leerzustände) mit unserem `/pruefen` vergleichen; nichts installieren ohne Prüfung.
- [10:36] **EMPFEHLUNG** GSAP nur nach Gewichts-Budget prüfen (Meisterstandard), sonst leichtere Alternative.
- [10:12] **EMPFEHLUNG** Apples Human Interface Guidelines (Tippflächen, Schriftgrößen) als Gegenprobe zu unseren Mobilregeln (≥ 44 px, ≥ 16 px) ansehen.
- [05:51] **EMPFEHLUNG** Eigene Referenzbibliothek: deckt sich mit `wissen/referenzen/` (Muster, Referenzliste).

## Aussagen des Creators
- [02:45] „Schrift verrät vibe-coded Design am schnellsten“ – **MEINUNG**, ohne Beleg.
- [07:22] Komponentenbibliotheken „sparen Tokens“ – **BEHAUPTUNG**, nicht gemessen.
- [05:16] Der genannte Generator sei „einer der billigsten Anbieter“ und biete „die meisten großen Bild- und Videomodelle“ – **BEHAUPTUNG** mit Eigeninteresse (Partnerlinks in der Beschreibung).
- [10:52] GSAP sei die Bibliothek, „die viele Top-Agenturen nutzen“ – **BEHAUPTUNG**, plausibel, nicht belegt.
- [10:52] Claude Code habe jetzt einen offiziellen `/design`-Befehl – **BEHAUPTUNG**, in unserer Umgebung nicht geprüft.
- [00:00] Eigene Fachkunde („über zehn Jahre mit bekannten Marken“) – **BEHAUPTUNG**, nicht geprüft.
- [04:25] Werbung für die eigene Community und Kurse – Rauschen, nicht gelernt.

## Wichtige Zeitstempel
- [00:32] Einfach (1–7) · [04:25] Mittel (8–19) · [10:12] Fortgeschritten (20–25) · [13:09] Schluss

## Visuelles
Nicht geprüft. Der Creator sagt, alle gezeigten Animationen im Video seien KI-erzeugt; was genau zu sehen war (Beispielseiten, Oberflächen), fehlt daher in dieser Datei. Bildabruf in der Cloud scheiterte wegen YouTube-Sperre. Bei Bedarf lokal Frames nachziehen und hier ergänzen.

## Relevanz für unsere Arbeit
- Hoch für Kundenseiten und Präsentation: Designsystem zuerst, eigene Schrift, eigene Texte, SVG statt Bitmap, Referenzbibliothek (deckt sich mit unserem Referenzsystem `wissen/referenzen/`).
- **Konflikte mit unseren Regeln:** fremde Bibliotheken (21st.dev, React Bits, Canvas UI, Lordicon/Lottie, GSAP) bringen Skripte und Gewicht; unsere Regeln verlangen keine fremden Skripte, Gewichts-Budget, Performance ≥ 95. Nur gebündelt und geprüft verwenden. Bezahldienste nur mit Elias' Freigabe.
- Anregung: `/design` und Tweaks existieren laut Creator; ob sie in unserer Umgebung vorhanden sind, ist nicht geprüft.
- Werkzeugnamen und Adressen stammen aus gesprochenem Text; vor Gebrauch prüfen (besonders der Bilddienst „KAI“).

## Verknüpfungen
- Konzept: [Designsystem und Bausteine für KI-Design](../konzepte/designsystem-ki.md) – Beziehung: neu, ergänzt unsere Referenz- und Regelsammlung
- Verwandte Quellen: [Landingpage-Aufbau (Neil Patel)](landingpage-aufbau-neil-patel-hcPxMuxh5Tc.md) – anderer Schwerpunkt (Überzeugung statt Gestaltung)
- Regeln: `wissen/fachgebiete/performance.md`, `wissen/fachgebiete/GLOBAL.md`
