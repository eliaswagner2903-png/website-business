# Higgsfield-Visualtest (A-036, 2026-09-29)

Freigabe von Elias: höchstens 20 Credits. **Verbraucht: 7,50 Credits** (Guthaben 70 → 62,50).

| Auftrag | Modell | Credits | Ergebnis |
|---|---|---|---|
| 5 Bilder (3 Praxis, 2 Werkstatt; ein sechstes scheiterte am Ratenlimit, kostenlos) | `gpt_image_2_5`, 1k, „low“ | 1,25 | 1024×688 bzw. 1344×752, gute Qualität |
| Werkstatt-Schleife 5 s, Start- = Endbild | `kling3_0`, std, ohne Ton | 6,25 | 1280×716, 24 fps, Naht SSIM 0,996 |

## Eingebaut
- **hell** (Lotlinie, Abschnitt „Ebenerdig, hell und ohne Stufen“): Detail mit Liege und Messinglot, passt zur Marke.
  AVIF 7–30 KB, lazy. Lighthouse mobil 100/100/100/100.
- **edel** (Lindgrund, vor „Die Werkstatt besuchen“): Film über Baustein `hero-video` (`held-video--16x9`),
  WebM 89 KB, MP4 218 KB, Poster AVIF 14–39 KB. Startet erst sichtbar und nach dem Laden, pausiert per Knopf,
  außerhalb des Bildes und im Hintergrund. Bei „Bewegung reduzieren“ nur das Poster. Lighthouse mobil 99–100/100/100/100.

Beide sind sichtbar als KI-Bild gekennzeichnet und mit `data-pruefen` markiert. Für echte Kunden gilt weiter: eigene Fotos
zuerst; KI-Bilder nur für Stimmung, nie für Produkte, Räume oder Menschen, die es so nicht gibt.

## Quellen (Higgsfield-Konto, Nutzungsbedingungen von Higgsfield für kommerzielle Nutzung beachten)
- Praxis-Detail: Job `163328af-6ddd-4385-a10f-f6ee38ec555c`
- Werkstatt-Bild: Job `9685e7e8-5057-4195-9f2c-a41881d7ce9a`, Video: Job `c87cef15-0aa1-4a67-bb7f-ed451006a331`
- Nicht verwendet: Behandlungsraum `079e1ec9…`, Trainingsraum `38c17687…`, Uhrwerk-Makro `dc1b2e62…` (Rohdateien nicht im Repo)

Screenshots: `hell-raum-390.png`, `hell-raum-1440.png`, `edel-film-390.png`, `edel-film-1440.png`, `edel-film-390-ruhig.png`.
