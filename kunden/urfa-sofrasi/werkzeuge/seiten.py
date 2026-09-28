#!/usr/bin/env python3
"""Erzeugt alle HTML-Seiten von Variante 1 (dunkles Thema) im Hauptordner.

    python3 werkzeuge/seiten.py

Inhalte (Speisekarte, Preise, Texte) stehen nur hier. Nach Änderungen das Skript ausführen,
die HTML-Dateien nicht von Hand bearbeiten. Preise 1:1 aus speisekarte.pdf (Stand 05/2025).
"""
import html
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public"
BASE = "https://www.urfasofrasi-eislingen.de/"
PHONE_DISPLAY = "07161&nbsp;651&nbsp;75&nbsp;65"
PHONE_TEL = "+4971616517565"
EMAIL = "info@urfasofrasi-eislingen.de"
ROUTE = "https://www.google.com/maps/dir/?api=1&destination=URFA+SOFRASI,+M%C3%BChlbachstra%C3%9Fe+2,+73054+Eislingen%2FFils"
HOURS_PRUEFEN = "Öffnungszeiten stammen aus der bisherigen Website (laut Suchmaschine: Mo–So 10–23 Uhr); Google nennt teils 11–22 Uhr. Bitte bestätigen."
GAESTE_PRUEFEN = "Auf dem Foto sind Gäste zu sehen. Sind sie einverstanden bzw. nicht erkennbar? Sonst Foto austauschen oder Personen unkenntlich machen."
PORTAL_PRUEFEN = "Angabe aus Branchenportalen übernommen (vermutlich Text der alten Website). Bitte bestätigen."


def icon(name, cls=""):
    c = f' class="{cls}"' if cls else ""
    return f'<svg{c} aria-hidden="true" focusable="false"><use href="assets/img/icons.svg#{name}"></use></svg>'


# Fotos: Name -> (Höhe bei 1016 px Breite, Beschreibung, kurze Bildunterschrift)
FOTOS = {
    "grillplatte-urfa-sofrasi": (452, "Gemischte Grillplatte mit Adana-Spieß, Hähnchenspießen, Reis, Lahmacun und Salat", "Gemischte Grillplatte"),
    "sofra-platte-gemischt": (535, "Große gemischte Platte mit Grillfleisch, Lahmacun, Salat und Rucola", "Platte für die ganze Runde"),
    "platte-mini-lahmacun-meze": (535, "Platte mit kleinen Lahmacun, Grillfleisch und einer Schale Meze", "Mini-Lahmacun und Meze"),
    "grillplatte-mit-brot": (535, "Grillplatte mit Fladenbrot, Bulgur, gegrilltem Gemüse und Salat", "Grillplatte mit frischem Brot"),
    "meze-teller": (535, "Meze-Teller mit verschiedenen Vorspeisen, Joghurt-Dips, Salat und Gurkendekoration", "Meze-Teller"),
    "sofra-doener-meze": (535, "Döner mit Pommes, Bulgur, Rotkohl und verschiedenen Meze", "Döner mit Beilagen und Meze"),
    "tagesgerichte-auslage": (535, "Auslage mit Reis, Bulgur, Sigara Böreği, gegrilltem Gemüse und Zwiebeln", "Aus unserer Auslage"),
    "theke-grill-vitrine": (535, "Theke mit Vitrine voller Spieße und Beilagen, dahinter die kupferne Grillhaube", "Theke und Grill"),
    "ayran-hausgemacht": (535, "Ayran-Spender mit frischem Ayran neben der Grillvitrine", "Frischer, hausgemachter Ayran"),
    "teestation-urfa-sofrasi": (535, "Kupferne Teestation mit URFA-SOFRASI-Schriftzug", "Unsere Teestation"),
    "innenraum-restaurant": (535, "Gastraum von URFA SOFRASI mit Tischen, Pflanzen und der kupfernen Grillhaube im Hintergrund", "Unser Gastraum"),
    "terrasse-urfa-sofrasi": (535, "Terrasse vor dem Restaurant mit Sonnenschirmen und Olivenbäumchen", "Unsere Terrasse"),
}
MIT_GAESTEN = {"innenraum-restaurant", "terrasse-urfa-sofrasi"}


def pic(name, sizes, cls="", eager=False, attrs=""):
    h, alt, _ = FOTOS[name]
    load = {True: 'fetchpriority="high"', "normal": 'decoding="async"'}.get(eager, 'loading="lazy" decoding="async"')
    c = f' class="{cls}"' if cls else ""
    return (f'<img{c} src="assets/img/{name}-1016.webp" srcset="assets/img/{name}-640.webp 640w, assets/img/{name}-1016.webp 1016w" '
            f'sizes="{sizes}" width="1016" height="{h}" alt="{html.escape(alt)}" {load}{attrs}>')


def zier(text, cls=""):
    """Kleine Überzeile im Stil des Logos: Linie, Raute, Text."""
    c = f" {cls}" if cls else ""
    return f'<p class="zier{c}">{text}</p>'


NAV = [("index.html", "Start", "Willkommen im URFA SOFRASI", "sofra-doener-meze"),
       ("speisekarte.htm", "Speisekarte", "Alle Gerichte mit Preisen und Suche", "grillplatte-urfa-sofrasi"),
       ("galerie.htm", "Galerie", "Küche, Theke und Terrasse", "theke-grill-vitrine"),
       ("kontakt.htm", "Kontakt &amp; Anfahrt", "Mühlbachstraße 2, Eislingen/Fils", "teestation-urfa-sofrasi")]
ROEMISCH = ["I", "II", "III", "IV"]
CUR = ' aria-current="page"'


def kopf(current):
    links = "\n".join(f'          <li><a href="{h}"{CUR if h == current else ""}>{t}</a></li>' for h, t, _, _ in NAV)
    eintraege = "\n".join(
        f'''          <li><a href="{h}"{CUR if h == current else ""}>
            <span class="menue-nr" aria-hidden="true">{ROEMISCH[i]}</span>
            <span class="menue-titel">{t}</span>
            <span class="menue-unter">{u}</span>
            <span class="menue-bild" aria-hidden="true" data-bild="assets/img/{b}-640.webp"></span>
          </a></li>''' for i, (h, t, u, b) in enumerate(NAV))
    return f'''<a class="skip-link" href="#inhalt">Zum Inhalt springen</a>
  <header class="kopf">
    <div class="wrap kopf-in">
      <a class="marke" href="index.html" aria-label="URFA SOFRASI – zur Startseite">
        <img src="assets/img/logo-skyline.svg" alt="" width="1100" height="245" loading="lazy">
        <span>URFA SOFRASI</span>
      </a>
      <nav class="navi" aria-label="Hauptnavigation">
        <ul>
{links}
        </ul>
        <span class="navi-linie" aria-hidden="true"></span>
      </nav>
      <a class="kopf-tel" href="tel:{PHONE_TEL}">{icon("i-phone")}<span>{PHONE_DISPLAY}</span></a>
      <button class="menue-knopf" type="button" aria-expanded="false" aria-controls="menue">
        <span class="striche" aria-hidden="true"></span><span class="menue-wort">Menü</span>
      </button>
    </div>
  </header>

  <div class="menue" id="menue" inert>
    <div class="menue-schleier" data-zu></div>
    <div class="menue-blatt" role="dialog" aria-modal="true" aria-label="Menü">
      <button class="menue-zu" type="button" data-zu aria-label="Menü schließen"><span class="menue-griff"></span></button>
      <nav aria-label="Menü">
        <ol class="menue-liste">
{eintraege}
        </ol>
      </nav>
      <div class="menue-fuss">
        <p class="status" data-status data-pruefen="{HOURS_PRUEFEN}"><span class="punkt" aria-hidden="true"></span><span class="status-text">Täglich 10:00 – 23:00 Uhr</span></p>
        <a class="menue-tel" href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a>
        <a class="menue-adresse" href="{ROUTE}" rel="noopener">{icon("i-pin")}Mühlbachstraße 2, 73054 Eislingen/Fils</a>
      </div>
    </div>
  </div>'''


FUSS = f'''  <footer class="fuss">
    <div class="wrap">
      <div class="fuss-marke">
        <img src="assets/img/skyline-720.webp" alt="" width="720" height="147" loading="lazy" decoding="async">
        <p class="fuss-name">URFA SOFRASI</p>
        {zier("Türkisch-anatolische Küche", "mitte eng")}
      </div>
      <div class="fuss-raster">
        <div>
          <h2>Besuchen Sie uns</h2>
          <address>
            Mühlbachstraße 2<br>73054 Eislingen/Fils<br>
            <a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a><br>
            <a href="mailto:{EMAIL}">{EMAIL}</a>
          </address>
        </div>
        <div>
          <h2>Öffnungszeiten</h2>
          <p data-pruefen="{HOURS_PRUEFEN}">Montag – Sonntag<br>10:00 – 23:00 Uhr</p>
          <p>Tagesgerichte<br>11:00 – 18:00 Uhr</p>
        </div>
        <div>
          <h2>Seiten</h2>
          <ul>
            <li><a href="speisekarte.htm">Speisekarte</a></li>
            <li><a href="galerie.htm">Galerie</a></li>
            <li><a href="kontakt.htm">Kontakt &amp; Anfahrt</a></li>
            <li><a href="impressum.htm">Impressum</a></li>
            <li><a href="datenschutz.htm">Datenschutz</a></li>
          </ul>
        </div>
      </div>
      <p class="fuss-unten">© URFA SOFRASI · Eislingen/Fils</p>
    </div>
  </footer>

  <nav class="schnell" aria-label="Schnellzugriff">
    <a class="schnell-tel" href="tel:{PHONE_TEL}">{icon("i-phone")}<span class="schnell-wort">Anrufen</span><span class="schnell-nr">{PHONE_DISPLAY}</span></a>
    <a href="{ROUTE}" rel="noopener">{icon("i-pin")}<span>Route</span></a>
    <a href="speisekarte.htm">{icon("i-menu")}<span>Karte</span></a>
  </nav>

  <script src="assets/js/main.js" defer></script>'''


def page(fname, title, desc, body, current=None, jsonld=None, robots=None, preload=None, body_cls=""):
    ld = f'\n  <script type="application/ld+json">\n{json.dumps(jsonld, ensure_ascii=False, indent=2)}\n  </script>' if jsonld else ""
    rb = f'\n  <meta name="robots" content="{robots}">' if robots else ""
    pl = "".join(f'\n  <link rel="preload" as="image" href="{p[0]}" imagesrcset="{p[1]}" imagesizes="{p[2]}" fetchpriority="high">' for p in (preload or []))
    base_tag = '\n  <base href="/">' if fname == "404.html" else ""
    canonical = BASE if fname == "index.html" else BASE + fname
    bc = f' class="{body_cls}"' if body_cls else ""
    doc = f'''<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">{base_tag}
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <script>document.documentElement.classList.add("js")</script>
  <title>{html.escape(title)}</title>
  <meta name="description" content="{html.escape(desc)}">{rb}
  <link rel="canonical" href="{canonical}">
  <meta name="theme-color" content="#0f0e0c">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="de_DE">
  <meta property="og:site_name" content="URFA SOFRASI">
  <meta property="og:title" content="{html.escape(title)}">
  <meta property="og:description" content="{html.escape(desc)}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="{BASE}assets/img/og-urfa-sofrasi.jpg">
  <meta property="og:image:width" content="1016">
  <meta property="og:image:height" content="535">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preload" href="assets/fonts/cormorant-garamond-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/lato-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>{pl}
  <link rel="stylesheet" href="assets/css/style.css">{ld}
</head>
<body{bc}>
  {kopf(current)}

  <main id="inhalt">
{body}
  </main>

{FUSS}
</body>
</html>
'''
    (OUT / fname).write_text(doc, encoding="utf-8")


RESTAURANT_LD = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "URFA SOFRASI",
    "url": BASE,
    "image": BASE + "assets/img/og-urfa-sofrasi.jpg",
    "telephone": "+49 7161 6517565",
    "email": EMAIL,
    "servesCuisine": ["Türkisch", "Anatolisch", "Grill", "Döner"],
    "priceRange": "€",
    "hasMenu": BASE + "speisekarte.htm",
    "address": {"@type": "PostalAddress", "streetAddress": "Mühlbachstraße 2", "postalCode": "73054",
                "addressLocality": "Eislingen/Fils", "addressRegion": "Baden-Württemberg", "addressCountry": "DE"},
    "openingHoursSpecification": [{"@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "10:00", "closes": "23:00"}],
}


def fotos_json(namen):
    """Weitere Fotos als Daten; main.js legt sie erst an und lädt sie, wenn sie gebraucht werden."""
    return html.escape(json.dumps([{"n": n, "t": FOTOS[n][2], "a": FOTOS[n][1]} for n in namen], ensure_ascii=False))


def diashow(fotos, cls, takt, versatz=0, sizes="", eager_first=False):
    """Bogenfenster mit mehreren Fotos; main.js blendet sie nacheinander über (ohne JS: nur das erste Foto)."""
    erstes = pic(fotos[0], sizes, "an", eager=eager_first, attrs=f' data-titel="{html.escape(FOTOS[fotos[0]][2])}"')
    pruef = f' data-pruefen="{GAESTE_PRUEFEN}"' if MIT_GAESTEN & set(fotos) else ""
    c = f" {cls}" if cls else ""
    return (f'<figure class="bogen diashow{c}" data-takt="{takt}" data-versatz="{versatz}" data-fotos="{fotos_json(fotos[1:])}"{pruef}>\n'
            f'            {erstes}\n          </figure>')


# ------------------------------------------------------------------ Startseite
BOGEN_SIZES = "(min-width: 1100px) 300px, (min-width: 700px) 42vw, calc(50vw - 24px)"
SKYLINE = ('<img class="hero-skyline" src="assets/img/skyline-1400.webp" '
           'srcset="assets/img/skyline-720.webp 720w, assets/img/skyline-1400.webp 1400w" '
           'sizes="(min-width: 1100px) 520px, calc(100vw - 48px)" width="1400" height="286" alt="" fetchpriority="high">')

TAFEL = [
    ("Urfa Sofrası", True, "Gemischte Grillplatte für 2, 3 oder 4 Personen", "ab 50,00 €", "grill", "grillplatte-urfa-sofrasi"),
    ("Karışık Izgara", True, "Gemischte Grillplatte", "25,00 €", "grill", None),
    ("Adana &amp; Urfa Kebap", True, "Hackfleischspieß – Adana scharf, Urfa mild gewürzt", "je 17,00 €", "grill", None),
    ("Döner", False, "Im Fladenbrot, im Yufka, als Box oder als Teller", "ab 8,00 €", "doener-teller", "sofra-doener-meze"),
    ("İskender", True, "Der Klassiker unter den Dönergerichten", "19,00 €", "doener-teller", None),
    ("Pide &amp; Lahmacun", True, "Aus dem Ofen – mit Hackfleisch, Käse, Spinat, Sucuk oder Döner", "ab 8,00 €", "pide", "platte-mini-lahmacun-meze"),
    ("Künefe", True, "Engelshaar-Teig mit Käsefüllung – auch mit Eis", "ab 7,50 €", "dessert", None),
]


def tafel_zeile(name, tr, de, preis, anker, bild):
    lang = ' lang="tr"' if tr else ""
    db = f' data-bild="{bild}"' if bild else ""
    return (f'''            <li><a href="speisekarte.htm#{anker}"{db}>
              <span class="tafel-zeile"><span class="tafel-name"{lang}>{name}</span><span class="punkte" aria-hidden="true"></span><span class="tafel-preis">{preis}</span></span>
              <span class="tafel-de">{de}</span>
            </a></li>''')


TAFEL_SIZES = "(min-width: 960px) 440px, 78vw"
tafel_bilder = "            " + pic("grillplatte-urfa-sofrasi", TAFEL_SIZES, "an", attrs=' data-fuer="grillplatte-urfa-sofrasi"')

STREIFEN = ["sofra-platte-gemischt", "meze-teller", "grillplatte-mit-brot", "theke-grill-vitrine",
            "ayran-hausgemacht", "tagesgerichte-auslage", "teestation-urfa-sofrasi", "terrasse-urfa-sofrasi"]


def streifen_karte(name):
    pruef = f' data-pruefen="{GAESTE_PRUEFEN}"' if name in MIT_GAESTEN else ""
    return (f'''          <li class="streifen-karte"{pruef}>
            <a href="assets/img/{name}-1016.webp" data-lightbox>
              <span class="bogen">{pic(name, "(min-width: 900px) 260px, 62vw")}</span>
              <span class="streifen-titel">{FOTOS[name][2]}</span>
            </a>
          </li>''')


index_body = f'''    <section class="hero" aria-labelledby="hero-titel">
      <div class="wrap hero-raster">
        <div class="hero-mitte">
          <p class="status hero-status" data-status data-pruefen="{HOURS_PRUEFEN}"><span class="punkt" aria-hidden="true"></span><span class="status-text">Täglich 10:00 – 23:00 Uhr</span></p>
          {SKYLINE}
          <h1 id="hero-titel"><span class="wortmarke">URFA SOFRASI</span> <span class="zier mitte eng untertitel">Türkisch-anatolische Küche<span class="visually-hidden"> in Eislingen/Fils</span></span></h1>
          <p class="lead">Grillspezialitäten, Döner, Pide und Lahmacun sowie wechselnde Tagesgerichte – im Restaurant, auf der Terrasse oder zum Mitnehmen.</p>
          <div class="knoepfe">
            <a class="knopf knopf-voll" href="tel:{PHONE_TEL}" data-hero-tel>{icon("i-phone")}<span>{PHONE_DISPLAY}</span></a>
            <a class="knopf knopf-rand" href="speisekarte.htm">Speisekarte ansehen{icon("i-chevron", "pfeil")}</a>
          </div>
          <p class="hero-adresse"><a href="{ROUTE}" rel="noopener">{icon("i-pin")}Mühlbachstraße 2, 73054 Eislingen/Fils</a></p>
        </div>
        <div class="hero-bogen hero-bogen-links">
          {diashow(["grillplatte-urfa-sofrasi", "sofra-platte-gemischt", "meze-teller", "platte-mini-lahmacun-meze"], "", 6800, 0, BOGEN_SIZES, eager_first=True)}
        </div>
        <div class="hero-bogen hero-bogen-rechts">
          {diashow(["sofra-doener-meze", "theke-grill-vitrine", "tagesgerichte-auslage", "teestation-urfa-sofrasi"], "", 6800, 3400, BOGEN_SIZES)}
        </div>
      </div>
    </section>

    <section class="abschnitt willkommen" aria-labelledby="willkommen">
      <div class="wrap schmal">
        <h2 id="willkommen" class="zier mitte"><span><span lang="tr">Hoş geldiniz</span> · Willkommen</span></h2>
        <p class="gross-text" data-woerter>Zwischen <em>Europa und Asien</em> gelegen, hat die türkische Küche über Jahrhunderte vieles aufgenommen: Einflüsse aus der Mittelmeerküche ebenso wie aus der indischen, armenischen und arabischen Küche. Diese <em>Vielfalt</em> möchten wir Ihnen in unserem Restaurant näherbringen.</p>
        <p class="willkommen-text">Genießen Sie unser großes, preiswertes Angebot und entdecken Sie mitten in Eislingen die Esskultur Anatoliens. Wir freuen uns auf Ihren Besuch!</p>
      </div>
    </section>

    <section class="abschnitt tafel" aria-labelledby="gerichte">
      <div class="wrap tafel-raster">
        <div class="tafel-bild einblenden">
          <figure class="bogen bogen-doppel" data-tafelbild data-fotos="{fotos_json(["sofra-doener-meze", "platte-mini-lahmacun-meze"])}">
{tafel_bilder}
          </figure>
        </div>
        <div class="tafel-text">
          {zier("Aus unserer Speisekarte")}
          <h2 id="gerichte">Beliebte <em>Gerichte</em></h2>
          <p class="abschnitt-intro">Alle Grillgerichte servieren wir mit Reis, Salat, Brot und Soße.</p>
          <ol class="tafel-liste">
{chr(10).join(tafel_zeile(*t) for t in TAFEL)}
          </ol>
          <a class="knopf knopf-voll" href="speisekarte.htm">{icon("i-menu")}Zur ganzen Speisekarte</a>
        </div>
      </div>
    </section>

    <section class="abschnitt gast" aria-labelledby="restaurant">
      <div class="wrap gast-raster">
        <div class="gast-bilder">
          <figure class="bogen gast-gross einblenden" data-pruefen="{GAESTE_PRUEFEN}">{pic("innenraum-restaurant", "(min-width: 900px) 420px, 70vw")}</figure>
          <figure class="bogen gast-klein einblenden" data-pruefen="{GAESTE_PRUEFEN}">{pic("terrasse-urfa-sofrasi", "(min-width: 900px) 240px, 42vw")}</figure>
        </div>
        <div class="gast-text">
          {zier("Zu Gast bei uns")}
          <h2 id="restaurant">Unser <em>Restaurant</em></h2>
          <p>Unser gemütlich eingerichtetes Restaurant bietet Platz für bis zu 70 Gäste. In den warmen Monaten finden auf unserer Terrasse weitere 40 Gäste einen Platz.</p>
          <dl class="zahlen">
            <div><dt>Gäste im Restaurant</dt><dd data-zaehlen="70">70</dd></div>
            <div><dt>Plätze auf der Terrasse</dt><dd data-zaehlen="40">40</dd></div>
          </dl>
          <p>Kommen Sie vorbei und überzeugen Sie sich selbst – bis bald im URFA SOFRASI!</p>
          <div class="knoepfe">
            <a class="knopf knopf-rand" href="{ROUTE}" rel="noopener">{icon("i-pin")}Route planen</a>
            <a class="knopf knopf-text" href="galerie.htm">Galerie ansehen{icon("i-chevron", "pfeil")}</a>
          </div>
        </div>
      </div>
    </section>

    <section class="abschnitt arkaden-abschnitt" aria-labelledby="angebot">
      <div class="wrap">
        <div class="kopf-mitte">
          {zier("Rund um Ihren Besuch", "mitte")}
          <h2 id="angebot">Gut zu <em>wissen</em></h2>
        </div>
        <ul class="arkaden">
          <li class="arkade einblenden">
            <p class="arkade-zier">11:00 – 18:00 Uhr</p>
            <h3>Tagesgerichte</h3>
            <p>Regelmäßig wechselnde Tagesgerichte gibt es <strong>zwischen 11:00 und 18:00 Uhr</strong> zu günstigen Preisen. Fragen Sie einfach nach, was es gerade gibt.</p>
          </li>
          <li class="arkade einblenden" data-pruefen="{PORTAL_PRUEFEN}">
            <p class="arkade-zier">Alle Gerichte</p>
            <h3>Zum Mitnehmen</h3>
            <p>Alle Gerichte bekommen Sie auch zum Mitnehmen. Rufen Sie gern vorher an: <a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a>.</p>
          </li>
          <li class="arkade einblenden" data-pruefen="{PORTAL_PRUEFEN}">
            <p class="arkade-zier">Hochzeit · Geburtstag · Firmenfeier</p>
            <h3>Feiern bei uns</h3>
            <p>Ob Hochzeit, Geburtstag oder Firmenfeier: Unser Restaurant steht Ihnen auch für Veranstaltungen zur Verfügung. Das Menü stellen wir gern individuell mit Ihnen zusammen.</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="abschnitt einblicke" aria-labelledby="einblicke">
      <div class="wrap kopf-zeile">
        <div>
          {zier("Einblicke")}
          <h2 id="einblicke">Frisch vom <em>Grill</em></h2>
        </div>
        <div class="kopf-zeile-rechts">
          <p>Aus der Vitrine, vom Grill und von unserer Terrasse.</p>
          <div class="streifen-pfeile" hidden>
            <button type="button" class="rund" data-streifen="-1" aria-label="Vorherige Fotos">{icon("i-chevron", "links")}</button>
            <button type="button" class="rund" data-streifen="1" aria-label="Nächste Fotos">{icon("i-chevron")}</button>
          </div>
        </div>
      </div>
      <ul class="streifen" aria-label="Fotos aus dem Restaurant">
{chr(10).join(streifen_karte(n) for n in STREIFEN)}
      </ul>
      <div class="wrap"><a class="knopf knopf-text" href="galerie.htm">Alle Bilder ansehen{icon("i-chevron", "pfeil")}</a></div>
    </section>

    <section class="abschnitt kontakt-abschnitt" aria-labelledby="kontakt">
      <div class="wrap">
        <div class="kontakt-panel einblenden">
          {zier("Kontakt &amp; Anfahrt")}
          <h2 id="kontakt">Wir freuen uns auf <em>Ihren Besuch</em></h2>
          <p class="tel-label">Telefon</p>
          <a class="riesen-tel" href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a>
          <div class="kontakt-spalten">
            <div>
              <h3>Adresse</h3>
              <address>URFA SOFRASI<br>Mühlbachstraße 2<br>73054 Eislingen/Fils</address>
              <a class="knopf knopf-voll klein" href="{ROUTE}" rel="noopener">{icon("i-pin")}Route planen</a>
            </div>
            <div>
              <h3>Öffnungszeiten</h3>
              <table class="zeiten" data-pruefen="{HOURS_PRUEFEN}">
                <tbody>
                <tr><th scope="row">Montag – Sonntag</th><td>10:00 – 23:00 Uhr</td></tr>
                <tr><th scope="row">Tagesgerichte</th><td>11:00 – 18:00 Uhr</td></tr>
                </tbody>
              </table>
              <p class="status" data-status><span class="punkt" aria-hidden="true"></span><span class="status-text"></span></p>
            </div>
            <div>
              <h3>E-Mail</h3>
              <p><a href="mailto:{EMAIL}">{EMAIL}</a></p>
              <p class="leise">Für Feiern und größere Gruppen sprechen Sie uns gern direkt an.</p>
            </div>
          </div>
          <img class="panel-skyline" src="assets/img/skyline-1400.webp" srcset="assets/img/skyline-720.webp 720w, assets/img/skyline-1400.webp 1400w" sizes="(min-width: 1000px) 900px, 100vw" width="1400" height="286" alt="" loading="lazy" decoding="async">
        </div>
      </div>
    </section>'''

page("index.html",
     "URFA SOFRASI Eislingen – Türkisches Restaurant, Grill & Döner",
     "Türkisch-anatolisches Restaurant in Eislingen/Fils: Grillgerichte, Döner, Pide, Lahmacun und wechselnde Tagesgerichte. Mühlbachstraße 2 – auch zum Mitnehmen.",
     index_body, "index.html", RESTAURANT_LD, body_cls="seite-start")

# ------------------------------------------------------------------ Speisekarte
# (nr, türkisch/name, deutsch, codes, preis, menge)  – Preise 1:1 aus Speisekarte.pdf (Stand 14.05.2025)
M = []
def cat(cid, title, tr=None, note=None, items=(), subs=None, col=0):
    M.append(dict(id=cid, title=title, tr=tr, note=note, items=list(items), subs=subs or {}))

cat("grill", "Grillgerichte", "Izgara", "Alle Grillgerichte mit Beilage (Reis, Salat, Brot, Soße).", [
    ("01", "Karışık Izgara", "Gemischte Grillplatte", "1,2,3,G", "25,00"),
    ("02", "Adana Kebap", "Hackfleischspieß, scharf", "1,2,3", "17,00"),
    ("03", "Urfa Kebap", "Hackfleischspieß", "1,2,3", "17,00"),
    ("04", "Tavuk Şiş", "Hähnchenspieß", "1,2,3,G", "17,00"),
    ("05", "Kuzu Şiş", "Lammspieß", "1,2,3,G", "19,00"),
    ("06", "Tavuk Pirzola", "Hähnchenkotelett", "1,2,3,G", "17,00"),
    ("07", "Kuzu Pirzola", "Lammkotelett", "1,2,3,G", "23,00"),
    ("08", "Beyti Kebap", "Hackfleischspieß Spezial", "1,2,3,4,G", "19,00"),
    ("09", "Dana Şiş", "Kalbfleischspieß", "1,2,3,G", "19,00"),
    ("10", "Tavuk Kanat", "Hähnchenflügel", "", "17,00"),
    ("11", "Urfa Sofrası", "Gemischte Grillplatte für 2 Personen", "1,2,3,A,G", "50,00"),
    ("12", "Urfa Sofrası", "Gemischte Grillplatte für 3 Personen", "1,2,3,A,G", "75,00"),
    ("13", "Urfa Sofrası", "Gemischte Grillplatte für 4 Personen", "1,2,3,A,G", "98,00"),
])
cat("duerum", "Grill-Dürüm", "Dürüm", "Vom Grill, gerollt im Yufka-Fladen.", [
    ("16", "Adana Dürüm", "Hackfleischspieß im Yufka, scharf", "1,2,3,A", "10,00"),
    ("17", "Urfa Dürüm", "Hackfleischspieß im Yufka", "1,2,3,A", "10,00"),
    ("18", "Tavuk Dürüm", "Hähnchenspieß im Yufka", "1,2,3,G", "10,00"),
    ("19", "Kuzu Şiş Dürüm", "Lammspieß im Yufka", "1,2,3,G", "11,00"),
])
cat("doener-teller", "Dönergerichte", "Döner Tabağı", "Alle Gerichte mit Beilage (Reis, Salat, Brot, Soße).", [
    ("23", "Döner-Teller mit Reis", "", "1,2,3,G", "17,00"),
    ("24", "Döner-Teller mit Pommes", "", "1,2,3,E,G", "17,00"),
    ("25", "Döner-Teller mit Salat", "", "1,2,3,G", "15,00"),
    ("26", "Döner-Teller mit Gemüse", "", "1,2,3,G", "18,00"),
    ("27", "Döner-Teller klein mit Pommes", "", "1,2,3,E,G", "14,00"),
    ("28", "Döner-Teller klein mit Reis", "", "1,2,3,G", "14,00"),
    ("29", "Döner-Teller klein mit Salat", "", "1,2,3,G", "13,00"),
    ("30", "İskender", "", "A,G", "19,00"),
    ("31", "Döner-Teller vegetarisch", "Reis, Gemüse, Salat, Brot", "G", "13,00"),
])
cat("doener-brot", "Döner im Brot", None, None, [
    ("32", "Döner im Fladenbrot", "", "1,2,3,A,C,G,N", "9,00"),
    ("33", "Döner im Yufka", "", "1,2,3,A,C,G", "11,00"),
    ("34", "Döner vegetarisch", "", "4,A,C,G,N", "8,00"),
    ("35", "Döner-Box", "", "1,2,3,E,G", "8,00"),
    ("36", "Pommes klein", "", "E,G", "4,00"),
    ("37", "Pommes groß", "", "E,G", "5,00"),
    ("38", "Extra Käse", "", "G", "1,00"),
], subs={"36": "Beilagen &amp; Extras"})
cat("pide", "Pide &amp; Lahmacun", "Pide / Hamur İşleri", "Frisch aus dem Ofen.", [
    ("40", "Kıymalı Pide", "Pide mit Hackfleisch", "2,3,A,C,G", "10,00"),
    ("41", "Peynirli Pide", "Pide mit Käse", "2,3,4,A,C,G,M", "10,00"),
    ("42", "Kaşarlı Pide", "Pide mit Hartkäse", "2,3,4,A,C,G,M", "11,00"),
    ("43", "Ispanaklı Peynirli Pide", "Pide mit Spinat und Käse", "2,3,4,A,C,G,M", "12,00"),
    ("44", "Sucuklu Pide", "Pide mit Knoblauchwurst", "2,3,4,A,C,G", "11,00"),
    ("45", "Karışık Pide", "Pide mit Spinat, Käse und Ei", "2,3,4,A,C,G,M", "12,00"),
    ("46", "Dönerli Pide", "Pide mit Döner", "2,3,4,A,C,G", "10,00"),
    ("47", "Lahmacun", "Türkische Pizza mit Salat", "2,3,4,A,C,G", "8,00"),
    ("48", "Lahmacun Spezial", "Türkische Pizza mit Salat und Dönerfleisch", "2,3,4,A,C,G", "12,00"),
    ("49", "Lahmacun im Teller", "mit Salat", "2,3,4,A,C,G", "10,00"),
    ("50", "Lahmacun im Teller", "mit Salat und Dönerfleisch", "2,3,4,A,C,G", "14,00"),
])
cat("pizza", "Pizzen", "Pizzalar", None, [
    ("51", "Margherita", "", "A,C,G,M", "10,00"),
    ("52", "Salami", "", "1,2,3,A,C,G,M", "12,00"),
    ("53", "Tonno", "mit Thunfisch und Zwiebeln", "A,C,D,G,M", "12,00"),
    ("54", "Pizza Kebap", "mit Dönerfleisch", "2,3,A,C,G,M", "12,00"),
    ("55", "Funghi", "mit Champignons", "2,3,A,C,G,M", "12,00"),
    ("56", "Pizza Vegetarisch", "", "A,C,G,M", "12,00"),
    ("57", "Pizza Sucuk", "mit Knoblauchwurst", "1,2,3,A,C,G,M", "12,00"),
    ("58", "Diavolo", "mit Peperoni und Oliven", "5,A,C,G,M", "12,00"),
    ("59", "Extra-Zutat", "je weitere Zutat", "", "1,00"),
])
cat("hausgerichte", "Hausgerichte", "Ev Yemekleri",
    "Außerdem: regelmäßig wechselnde Tagesgerichte zwischen 11:00 und 18:00 Uhr.", [
    ("60", "Kuru Fasulye", "Weiße Bohnen mit Fleisch", "2,3,4", "8,00"),
    ("61", "Güveç", "Lammfleisch mit Gemüse", "2,3,4", "8,00"),
    ("62", "Sebze", "Gemüse der Saison", "", "6,00"),
    ("63", "İzmir Köfte", "Frikadellen mit Kartoffeln", "2,3,4", "8,00"),
    ("64", "Saç Kavurma", "Gebratenes Lammfleisch mit Reis", "2,3,4", "20,00"),
    ("65", "Reis", "", "", "4,00"),
])
cat("suppen", "Suppen", "Çorba", None, [
    ("66", "Mercimek", "Linsensuppe", "3", "7,00"),
    ("67", "İşkembe", "Kuttelsuppe", "2,3,C,G,A", "8,00"),
    ("68", "Kelle Paça", "Fleischsuppe", "", "8,00"),
])
cat("salate", "Salate", "Salatalar", None, [
    ("70", "Çoban Salatası", "Hirtensalat", "", "7,00"),
    ("71", "Mevsim Salatası", "Grüner Salat", "", "7,00"),
    ("72", "Antep Ezme", "Scharf gewürzter Salat", "", "4,00"),
    ("73", "Ton Balığı Salatası", "Thunfischsalat", "D", "8,00"),
    ("74", "Extra Meze", "Vorspeisenteller", "", "6,00"),
])
cat("dessert", "Süßspeisen", "Tatlılar", None, [
    ("75", "Sütlaç", "Milchreis", "G", "3,00"),
    ("76", "Baklava", "", "A", "4,00"),
    ("77", "Künefe", "Engelshaar-Teig mit Käsefüllung", "A,G", "7,50"),
    ("78", "Dondurmalı Künefe", "Künefe mit Eis", "A,G", "8,50"),
    ("79", "Halka Tatlı", "Spritzkringel in Sirup", "A", "2,00"),
])
cat("getraenke", "Getränke", "İçecekler", None, [
    ("80", "Cola", "", "2,6,7", "3,00", "0,33 l"),
    ("81", "Fanta", "", "2,7", "3,00", "0,33 l"),
    ("82", "Spezi", "", "2,6,7", "3,00", "0,33 l"),
    ("83", "Apfelschorle", "", "", "3,00", "0,33 l"),
    ("84", "Sprite", "", "7", "3,00", "0,33 l"),
    ("85", "Uludağ", "", "", "3,00", "0,33 l"),
    ("86", "Mineralwasser", "", "", "3,00", "0,33 l"),
    ("87", "Stilles Wasser", "", "", "3,00", "0,33 l"),
    ("88", "Ayran", "", "", "2,00", "0,20 l"),
    ("90", "Kaffee", "", "", "3,50", "0,20 l"),
    ("91", "Ayran", "frisch und hausgemacht", "", "3,50", "0,40 l"),
    ("93", "Cola", "", "2,6,7", "3,50", "0,33 l"),
    ("94", "Fanta", "", "2,7", "3,50", "0,33 l"),
    ("95", "Spezi", "", "2,6,7", "3,50", "0,33 l"),
    ("96", "Sprite", "", "7", "3,50", "0,33 l"),
    ("97", "Cola Zero", "", "2,6,7", "3,50", "0,33 l"),
    ("98", "Cola Light", "", "2,6,7", "3,50", "0,33 l"),
    ("99", "Lift", "", "", "3,50", "0,33 l"),
], subs={"80": "Dosen (inkl. Pfand &amp; Becher)", "93": "Glas / Flasche"})

TURKISH = {"grill", "duerum", "pide", "hausgerichte", "suppen", "salate", "dessert"}
FLAGS = {
    "13": "Preis 98,00 € weicht vom Muster 25 € pro Person ab (2 P. = 50 €, 3 P. = 75 €). Absicht (Rabatt)?",
    "10": "Keine Zusatzstoff-/Allergenangabe – alle anderen Grillgerichte haben 1,2,3. Bitte prüfen.",
    "61": "Güveç (Lamm) für 8,00 € – deutlich günstiger als Saç Kavurma (20,00 €). Preis bitte bestätigen.",
    "68": "Kelle Paça ist eine Kopf-/Fußsuppe. Übersetzung „Fleischsuppe“ bewusst so belassen?",
    "90": "Kaffee steht in der PDF unter „Dosen inkl. Pfand & Becher“. Richtige Rubrik?",
    "49": "Auf der alten Website fehlen Nr. 49/50, und die Pizzen sind dort als 50–58 nummeriert. Hier gilt die neuere PDF (Stand 05/2025).",
}



def item_html(it, cid):
    nr, name, de, codes, price = it[:5]
    size = it[5] if len(it) > 5 else None
    lang = ' lang="tr"' if cid in TURKISH or name in ("İskender", "Uludağ", "Sütlaç") else ""
    de_html = f'<span class="de">{de}</span>' if de else ""
    code_html = f'<sup title="Kennzeichnung: {codes}">{codes}</sup>' if codes else ""
    size_html = f'<span class="size">{size}</span>' if size else ""
    flag = f' data-pruefen="{html.escape(FLAGS[nr])}"' if nr in FLAGS else ""
    return (f'            <li class="menu-item"{flag}><span class="nr">{nr}</span>'
            f'<span class="name"><span{lang}>{name}</span>{code_html}</span><span class="punkte" aria-hidden="true"></span>'
            f'<span class="price">{price} €{size_html}</span>{de_html}</li>')


def cat_html(c):
    rows = []
    for it in c["items"]:
        if it[0] in c["subs"]:
            if rows:
                rows.append("          </ul>")
            rows.append(f'          <h3 class="menu-sub">{c["subs"][it[0]]}</h3>')
            rows.append('          <ul class="menu-list">')
        elif not rows:
            rows.append('          <ul class="menu-list">')
        rows.append(item_html(it, c["id"]))
    rows.append("          </ul>")
    tr = f'<span class="tr" lang="tr">{c["tr"]}</span>' if c["tr"] else ""
    note = f'\n          <p class="cat-note">{c["note"]}</p>' if c["note"] else ""
    return (f'        <section class="menu-cat" id="{c["id"]}" aria-labelledby="h-{c["id"]}">\n'
            f'          <h2 id="h-{c["id"]}">{tr}<span class="cat-titel">{c["title"]}</span></h2>{note}\n' + "\n".join(rows) + "\n        </section>")


ANZAHL = sum(len(c["items"]) for c in M)
chips = "\n".join(f'          <a href="#{c["id"]}">{c["title"]}</a>' for c in M)
menu_body = f'''    <div class="wrap seiten-kopf">
      {zier("URFA SOFRASI")}
      <h1>Speise<em>karte</em></h1>
      <p class="seiten-intro">Grillgerichte, Döner, Pide, Pizza, Hausgerichte und Süßspeisen – alle Gerichte auch zum Mitnehmen. Bestellungen und Fragen gern telefonisch unter <a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a>.</p>
      <a class="knopf knopf-rand klein" href="speisekarte.pdf" type="application/pdf">{icon("i-download")}Speisekarte als PDF</a>
    </div>

    <div class="menu-tools">
      <div class="wrap menu-tools-in">
        <div class="menu-search" role="search">
          <label class="visually-hidden" for="menu-search">Gericht suchen</label>
          {icon("i-search")}
          <input id="menu-search" type="search" placeholder="Gericht suchen, z. B. Adana" autocomplete="off" enterkeyhint="search">
          <kbd class="taste" aria-hidden="true">/</kbd>
        </div>
        <nav class="menu-cats" aria-label="Kategorien der Speisekarte">
{chips}
          <span class="chip-pille" aria-hidden="true"></span>
        </nav>
      </div>
    </div>

    <div class="wrap menu-body">
      <p id="menu-status" class="visually-hidden" role="status" aria-live="polite"></p>
      <p id="menu-empty" class="menu-empty" hidden>Kein Gericht gefunden. Versuchen Sie einen anderen Begriff – oder rufen Sie uns an: <a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a>.</p>
      <div class="menu-cols">
{chr(10).join(cat_html(c) for c in M)}
      </div>
      <div class="menu-legal">
        <p>Alle Preise in Euro inklusive MwSt. · {ANZAHL} Gerichte und Getränke</p>
        <p>Die hochgestellten Zahlen und Buchstaben kennzeichnen Zusatzstoffe und Allergene.</p>
        <p class="placeholder" data-pruefen="Die Speisekarte (PDF) enthält keine Legende zu den Kennzeichnungen. Diese ist gesetzlich erforderlich und muss vom Betreiber geliefert werden – bitte nicht raten.">Die Legende der Zusatzstoffe (1–7) und Allergene (A–N) folgt in Kürze. Fragen Sie gern bei uns nach.</p>
      </div>
    </div>'''

page("speisekarte.htm",
     "Speisekarte – URFA SOFRASI Eislingen | Grill, Döner, Pide & Pizza",
     "Die Speisekarte von URFA SOFRASI in Eislingen/Fils: Adana- und Urfa-Kebap, Grillplatten, Döner, Pide, Lahmacun, Pizza, Suppen, Künefe und Baklava – mit Preisen.",
     menu_body, "speisekarte.htm", RESTAURANT_LD, body_cls="seite-karte")

# ------------------------------------------------------------------ Galerie
GALERIE = ["sofra-platte-gemischt", "platte-mini-lahmacun-meze", "grillplatte-urfa-sofrasi", "grillplatte-mit-brot",
           "meze-teller", "sofra-doener-meze", "tagesgerichte-auslage", "theke-grill-vitrine",
           "ayran-hausgemacht", "teestation-urfa-sofrasi", "innenraum-restaurant", "terrasse-urfa-sofrasi"]


def galerie_kachel(name, i=99):
    pruef = f' data-pruefen="{GAESTE_PRUEFEN}"' if name in MIT_GAESTEN else ""
    eager = True if i == 0 else "normal" if i < 3 else False
    return (f'''        <li{pruef}><figure>
          <a class="bogen" href="assets/img/{name}-1016.webp" data-lightbox>{pic(name, "(min-width: 1000px) 380px, (min-width: 600px) 45vw, calc(50vw - 22px)", eager=eager)}</a>
          <figcaption>{FOTOS[name][2]}</figcaption>
        </figure></li>''')


gal_body = f'''    <div class="wrap seiten-kopf mitte">
      {zier("Einblicke", "mitte")}
      <h1><em>Galerie</em></h1>
      <p class="seiten-intro">Ein paar Eindrücke aus unserer Küche und unserem Restaurant.</p>
    </div>
    <div class="wrap">
      <ul class="galerie">
{chr(10).join(galerie_kachel(n, i) for i, n in enumerate(GALERIE))}
      </ul>
    </div>'''
page("galerie.htm", "Galerie – URFA SOFRASI Eislingen",
     "Bilder aus dem URFA SOFRASI in Eislingen/Fils: Grillplatten, Döner, Meze und unser Restaurant.",
     gal_body, "galerie.htm", body_cls="seite-galerie")

# ------------------------------------------------------------------ Kontakt
kontakt_body = f'''    <div class="wrap seiten-kopf mitte">
      {zier("Kontakt &amp; Anfahrt", "mitte")}
      <h1>Wir freuen uns auf <em>Ihren Besuch</em></h1>
      <p class="seiten-intro">in der Mühlbachstraße 2 in Eislingen/Fils.</p>
    </div>
    <div class="wrap">
      <div class="kontakt-panel">
        <p class="tel-label">Telefon</p>
        <a class="riesen-tel" href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a>
        <div class="kontakt-spalten">
          <div>
            <h2>Adresse</h2>
            <address>URFA SOFRASI<br>Mühlbachstraße 2<br>73054 Eislingen/Fils</address>
            <a class="knopf knopf-voll klein" href="{ROUTE}" rel="noopener">{icon("i-pin")}Route planen</a>
          </div>
          <div>
            <h2>Öffnungszeiten</h2>
            <table class="zeiten" data-pruefen="{HOURS_PRUEFEN}">
              <tbody>
              <tr><th scope="row">Montag – Sonntag</th><td>10:00 – 23:00 Uhr</td></tr>
              <tr><th scope="row">Tagesgerichte</th><td>11:00 – 18:00 Uhr</td></tr>
              </tbody>
            </table>
            <p class="status" data-status><span class="punkt" aria-hidden="true"></span><span class="status-text"></span></p>
          </div>
          <div>
            <h2>E-Mail</h2>
            <p><a href="mailto:{EMAIL}">{EMAIL}</a></p>
            <a class="knopf knopf-rand klein" href="mailto:{EMAIL}">{icon("i-mail")}E-Mail schreiben</a>
          </div>
        </div>
        <div class="anfahrt">
          <h2>Anfahrt</h2>
          <p>Das Restaurant liegt in der Mühlbachstraße 2 in Eislingen/Fils. Mit einem Tipp auf „Route planen“ öffnet sich die Wegbeschreibung in Google Maps bzw. in Ihrer Karten-App.</p>
          <p class="leise">Bewusst ohne eingebettete Karte: So werden beim Aufruf dieser Seite keine Daten an Google übertragen. Für Feiern und größere Gruppen sprechen Sie uns gern direkt an.</p>
        </div>
        <img class="panel-skyline" src="assets/img/skyline-1400.webp" srcset="assets/img/skyline-720.webp 720w, assets/img/skyline-1400.webp 1400w" sizes="(min-width: 1000px) 900px, 100vw" width="1400" height="286" alt="" loading="lazy" decoding="async">
      </div>
    </div>'''
page("kontakt.htm", "Kontakt & Anfahrt – URFA SOFRASI Eislingen/Fils",
     "So erreichen Sie URFA SOFRASI: Mühlbachstraße 2, 73054 Eislingen/Fils. Telefon 07161 651 75 65, Öffnungszeiten und Route.",
     kontakt_body, "kontakt.htm", RESTAURANT_LD, body_cls="seite-kontakt")

# ------------------------------------------------------------------ Impressum, Datenschutz, 404
imp_body = f'''    <div class="wrap legal">
      {zier("URFA SOFRASI")}
      <h1>Impressum</h1>
      <div class="placeholder" data-pruefen="Rechtstext nicht erfinden: Den vollständigen Impressumstext der bisherigen Seite 1:1 übernehmen und rechtlich prüfen lassen.">
        PLATZHALTER – Den vollständigen Text von <strong>urfasofrasi-eislingen.de/impressum.htm</strong> hier unverändert einfügen.
        Die bisherige Website war für die Überarbeitung nicht abrufbar. Die folgenden Angaben stammen aus einem Suchmaschinen-Auszug und müssen abgeglichen werden.
      </div>
      <h2>Angaben zum Betreiber</h2>
      <p>URFASOFRASI SCHNELLRESTAURANT<br>Inhaberin: Dilek Batmis<br>Mühlbachstraße 2<br>73054 Eislingen/Fils</p>
      <h2>Kontakt</h2>
      <p>Telefon: <a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a><br>E-Mail: <a href="mailto:{EMAIL}">{EMAIL}</a></p>
      <h2>Steuerangaben</h2>
      <p>Steuernummer: 63115/19876</p>
    </div>'''
page("impressum.htm", "Impressum – URFA SOFRASI Eislingen", "Impressum von URFA SOFRASI, Mühlbachstraße 2, 73054 Eislingen/Fils.",
     imp_body, None, robots="noindex, follow", body_cls="seite-recht")

ds_body = f'''    <div class="wrap legal">
      {zier("URFA SOFRASI")}
      <h1>Datenschutzerklärung</h1>
      <div class="placeholder" data-pruefen="Rechtstext nicht erfinden: bestehende Datenschutzerklärung übernehmen und an die neue Technik anpassen lassen.">
        PLATZHALTER – Die bestehende Datenschutzerklärung hier einfügen und an die neue Website anpassen lassen.
        <br><br>Technische Fakten der neuen Website, die für die Erklärung wichtig sind:
        <ul>
          <li>keine Cookies, kein Tracking, keine Analyse-Tools</li>
          <li>Schriften werden lokal vom eigenen Server geladen (keine Google Fonts)</li>
          <li>keine eingebettete Karte; „Route planen“ ist ein normaler Link zu Google Maps</li>
          <li>Kontakt nur per Telefon/E-Mail, kein Kontaktformular</li>
          <li>Server-Logfiles je nach Hosting-Anbieter</li>
        </ul>
      </div>
    </div>'''
page("datenschutz.htm", "Datenschutz – URFA SOFRASI Eislingen", "Datenschutzerklärung von URFA SOFRASI Eislingen/Fils.",
     ds_body, None, robots="noindex, follow", body_cls="seite-recht")

nf = f'''    <div class="wrap seiten-kopf mitte nicht-gefunden">
      {zier("404", "mitte")}
      <h1>Seite nicht <em>gefunden</em></h1>
      <p class="seiten-intro">Diese Seite gibt es leider nicht (mehr).</p>
      <div class="knoepfe mitte"><a class="knopf knopf-voll" href="index.html">Zur Startseite</a><a class="knopf knopf-rand" href="speisekarte.htm">Zur Speisekarte</a></div>
    </div>'''
page("404.html", "Seite nicht gefunden – URFA SOFRASI", "Diese Seite existiert nicht.", nf, None, robots="noindex")
print(f"ok – {ANZAHL} Einträge in der Speisekarte")
