# Medien – Quellen, Modelle, Credits

Alle Bilder und der Film sind **KI-Visualisierungen** (Higgsfield). Auf der Seite sind sie mit „KI-Visualisierung“ und
`data-pruefen` markiert: Vor einer Veröffentlichung müssen sie durch OSG-Fotografie ersetzt oder von OSG freigegeben werden.
Logo und Zeichen (`osg-logo.svg`, `osg-zeichen.svg`, `profil.svg`) stammen von de.osgeurope.com.

| Datei(en) in `public/medien/` | Einsatz | Modell, Einstellung | Credits |
|---|---|---|---|
| `schaftfraeser-hero-*` | Startseite, Hero-Poster | GPT Image 2.5 (Flare), 16:9, high, 2K – Makro eines beschichteten VHM-Schaftfräsers auf dunklem Grund | 2,75 |
| `bohren-*`, `gewinden-*`, `fraesen-*`, `toolmanagement-*` | Bento Startseite, Bericht, Service | GPT Image 2.5 (Flare), Stapel à 4 Bilder, 2K | 4,00 |
| `schaftfraeser-film.webm/.mp4` | Startseite, Hero-Film (5 s, nach dem Laden, nicht bei reduzierter Bewegung) | Kling 3.0, 16:9, 5 s, aus dem Hero-Bild; WebM mit VP9 CRF 42 neu kodiert (118 KB), MP4 295 KB | 6,25 |
| `produkte-*` | Kopf Produkte | GPT Image 2.5 (Flare), 3:2, medium, 2K – vier VHM-Werkzeuge auf gebürstetem Stahl | 1,00 |
| `branchen-*` | Kopf Industrielösungen | GPT Image 2.5 (Flare), 3:2, medium, 2K – Kugelkopffräser an einem Titan-Laufrad im 5-Achs-Zentrum | 1,00 |
| `karriere-*` | Kopf Karriere | GPT Image 2.5 (Flare), 3:2, medium, 2K – Hände setzen einen Fräser ins Einstellgerät (kein Gesicht) | 1,00 |

**Summe A-053: 16,00 Credits** (13,00 im ersten Bau, 3,00 nach Jury Runde 1). Kontostand vorher 54,5, danach 38,5.

Bildpipeline: `node werkzeuge/bilder.mjs <png> public/medien --name=<name> --breiten=480,800,1200` (AVIF + WebP);
Hero mit `--hero` (640/1016/1600/2400). Originale liegen nicht im Repo.
