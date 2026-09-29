# Auswertung: Video „How to Build $10K Websites in Minutes (Claude AI)“ (https://youtu.be/snErQUyqwCU)

Quelle: YouTube-Video von **Metics Media** (Ersteller: Caleb), gebracht von Elias am 2026-09-29 · Ausgewertet von:
Stahl · Auftrag A-045 · Browser: nein

**Worauf die Auswertung beruht (ehrlich):** Das Video selbst war aus der Cloud nicht abrufbar (YouTube sperrt
Rechenzentrums-Adressen, kein Transkript, keine Beschreibung). Ausgewertet wurden:

1. Titel, Kanal und Vorschaubild des Videos (oEmbed, `i.ytimg.com`) – das Vorschaubild zeigt eine seiner Seiten.
2. Zwei schriftliche Zusammenfassungen des Videos (income-reality-check.pages.dev, growwstacks.com) und weitere
   Artikel/Videos zum selben Vorgehen (Chase AI „scroll-world“, AlphaSignal, SozAI-Transkript).
3. **Die Primärquelle des Vorgehens:** die öffentliche Anleitung des Higgsfield-Website-Skills
   (`github.com/higgsfield-ai/skills`, `higgsfield-websites/references/`: `scroll-scrub.md`, `design-recipe.md`,
   `wow-catalog.md`) und das Skill-Repo `github.com/cth9191/scroll-world`. Genau diese Werkzeuge nutzt er.

Was Caleb Wort für Wort sagt, kennen wir also nicht; was er **baut und womit**, ist durch mehrere Quellen belegt.

## Steckbrief

| | |
|---|---|
| Thema | Hochwertig wirkende Marken-Websites mit KI in Minuten bauen |
| Werkzeuge | Claude (Code) + ein fertiger „10K-Websites-Skill“ (Anleitung für Claude: Nische recherchieren, Texte schreiben, Seite bauen) + **Higgsfield** (Bilder und Film, per MCP) + **Hostinger** (statisches Hosting) |
| Beispielseiten | Kaffeemarke, Parfümmarke („Sillage“, im Vorschaubild), Tech-Firma, Jeans-Label – jeweils mit Hero-Film, der beim Scrollen abläuft (Kaffee fließt in die Tasse, Tropfen wird zur Flasche) |
| Stil | dunkel, edel, ein warmer Akzent, großes Produkt in der Mitte, sehr wenig Text |
| Warum interessant | Zeigt, welcher **eine** Effekt Kunden heute „nach 10.000 $“ aussieht, und wie man ihn billig herstellt |

## Was er macht, Schritt für Schritt

1. **Skill laden** statt frei zu prompten: Claude bekommt eine feste Bauanleitung (Recherche → Texte → Aufbau).
2. **Klärungsfragen** an den Nutzer (Marke, Stimmung, Zielgruppe) und eine Nischen-Recherche.
3. **Ein Leitbild/Storyboard** erzeugen (Higgsfield, GPT Image), das Farben und Licht festlegt.
4. **Einen Film** daraus erzeugen (Higgsfield, z. B. Seedance/Kling): eine durchgehende, langsame Bewegung.
5. **Film an die Scrollposition koppeln** (Einzelbilder mit ffmpeg bzw. direkt die MP4 steuern).
6. Seite mit wenigen, großen Kapiteln über dem Film, ein Akzent, ein Hauptknopf („Reserve your bottle“).
7. Hochladen als ZIP zu Hostinger (Inhalt des Ordners zippen, damit `index.html` oben liegt).

## Bewertung (1–5, Maßstab W1–W7; beurteilt am Vorschaubild und den Beschreibungen, nicht an einer echten Seite)

| Kriterium | Note | Was gut ist | Was schwach ist |
|---|---|---|---|
| W1 Erster Eindruck | 5 | Produkt taucht aus dem Dunkel auf, sofort klar, was verkauft wird | – |
| W2 Eigenständigkeit | 3 | Film ist maßgeschneidert | Alle Seiten folgen demselben Rezept (dunkel + Warmton + Held mittig) |
| W3 Typografie | 4 | Logo mit weiter Laufweite, ruhige Navigation | nicht prüfbar im Detail |
| W4 Komposition | 4 | Held mittig, viel Luft, 3 Navigationspunkte + 1 Knopf | – |
| W5 Bewegung | 5 | **ein** Signatur-Effekt, vom Besucher gesteuert | Gewicht (Film mehrere MB) |
| W6 Handwerk | ? | – | Zustände, Formulare, Barrierefreiheit werden im Video nicht gezeigt |
| W7 Glaubwürdigkeit | 2 | – | erfundene Marken, KI-Texte; beim echten Kunden unbrauchbar ohne echte Inhalte |
| Technik / Performance | 2 | statisch, schnell zu hosten | mehrere MB Film; Lighthouse ≥ 95 nicht belegt |

## Übertragbar

| Muster | Warum es wirkt | Wie wir es umsetzen | Ziel | Aufwand |
|---|---|---|---|---|
| Scroll-Film im Hero | Besucher steuert einen Produktfilm selbst → wirkt wie Agentur-Produktion | `wissen/lehren/scroll-film.md`, Baustein A-046 (eigener Code, Poster zuerst, Handy-Fassung) | BAUKASTEN | groß |
| „Drehbuch-Vertrag“ für den Film | Ohne Schnitt, dunkler Grund, ein Held mittig, Anfang ≠ Ende – sonst sieht Scrubbing kaputt aus | als Prüfliste in der Lehre und im Visual-Offizier | DESIGN-WISSEN | klein |
| Storyboard vor Video | Ein Bild (6 Felder) legt Look fest, bevor teure Video-Credits fließen | Schritt im Visual-Offizier | DESIGN-WISSEN | klein |
| Ein Signatur-Effekt pro Seite | Ein starker Effekt wirkt edel, fünf mittlere wirken billig | Regel in DESIGN-WISSEN | DESIGN-WISSEN | klein |
| Hero-Disziplin | höchstens 4 Textelemente im ersten Bildschirm, Knopf sichtbar | Regel in DESIGN-WISSEN | DESIGN-WISSEN | klein |
| KI-Erkennungsmerkmale vermeiden | Kunden erkennen „KI-Seiten“ an wiederkehrenden Mustern | Liste in DESIGN-WISSEN | DESIGN-WISSEN | klein |
| Klärungsfragen vor dem Bau | bessere Treffer im ersten Wurf, weniger Korrekturschleifen | neuer Schritt in `/neuer-kunde` (Fragenliste vor dem Design) | WORKFLOW | klein |

## Nicht übernehmen

- **Versprechen „10.000 $ in Minuten“:** Der Bau war nie der Engpass, der Verkauf ist es (so auch die Kritik in
  income-reality-check). Passt zu unserer Reihenfolge: erst Können, dann Verkauf.
- **Erfundene Marken und KI-Texte** für echte Kunden (unsere Regel: nichts erfinden).
- **Film ohne Gewichtsgrenze, ohne Poster, ohne „Bewegung reduzieren“** – bei uns Pflicht.
- **Fremde Skills/Code 1:1** – wir bauen den Baustein selbst (A-046).

## Fazit

Die Seiten wirken nicht wegen vieler Effekte hochwertig, sondern wegen **eines** maßgeschneiderten Produktfilms auf
dunkler, ruhiger Bühne, den der Besucher selbst abspielt, dazu radikal wenig Text und ein Akzent. Für uns taugt das
als Vorbild für einen „Kino-Hero“ in Showcases und bei Produktmarken (Gastronomie, Kosmetik, Handwerk mit Produkt).
