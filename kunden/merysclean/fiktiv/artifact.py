# Baut aus public/ (nach umbauen.py + node bauen.mjs) EINE in sich geschlossene HTML-Datei für die Artifact-Vorschau:
# CSS, Schriften (base64), Grafiken (SVG als data:) und JS eingebettet. Unterseiten liegen als <template> in derselben
# Datei und werden per Hash-Adresse (#/leistungen, #/angebot …) in <main> gezeigt. Das Formular sendet nichts,
# es führt zur Danke-Ansicht. Ausgabe wie bei OSG ohne Grundgerüst (Kopf + Körper), das Artifact setzt es selbst.
#   python3 artifact.py [ziel.html]      (Standard: artifact/klarwerk.html)
import base64, html, re, sys, pathlib, urllib.parse

D = pathlib.Path(__file__).parent; Q = D / 'public'
ZIEL = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else D / 'artifact' / 'klarwerk.html'
SEITEN = ['index', 'leistungen', 'unterhaltsreinigung', 'bueroreinigung', 'fensterreinigung', 'treppenhausreinigung',
          'sonderreinigung', 'privathaushalt', 'einsatzgebiet', 'ueber-uns', 'angebot', 'kontakt', 'impressum',
          'datenschutz', 'nachricht-gesendet']
VERBOTEN = ['merys', 'mustafa', 'safet', 'merita', 'krummäcker', 'krumm%c3%a4cker', 'eislingen', '0173 185', '1731853563',
            '07161 945', '71619454270', '73054', 'hrb 747382', '63083/11063', '100086714580225']


def daten_svg(pfad):
    return 'data:image/svg+xml,' + urllib.parse.quote(pathlib.Path(pfad).read_text().strip(), safe=' =:/;,()-.\'')  # " und # kodiert


def route(m):
    # href="/x?y#z" → href="#/x?y"; href="/" → "#/"; Startseite-Anker "/#a" → "#/"
    attr, wert = m.group(1), m.group(2)
    teil = re.match(r'/([^?#]*)(\?[^#]*)?', wert)
    name, frage = teil.group(1), teil.group(2) or ''
    return f'{attr}="#/{name}{frage}"'


def bearbeiten(t):
    t = re.sub(r'\s+data-pruefen="[^"]*"', '', t)                               # interne Prüfnotizen raus
    t = re.sub(r'src="/(medien|img)/([^"]+\.svg)"', lambda m: f'src="{daten_svg(Q / m.group(1) / m.group(2))}"', t)
    t = t.replace(' loading="lazy"', '')                                         # Grafiken sind eingebettet, nichts nachzuladen
    t = re.sub(r'(href)="(/(?!/)[^"]*)"', route, t)
    return t


def teile(name):
    t = (Q / f'{name}.html').read_text()
    titel = html.unescape(re.search(r'<title>([^<]*)</title>', t).group(1))
    klasse = (re.search(r'<body class="([^"]*)"', t) or [None, ''])[1]
    kopf = re.search(r'<header class="kopf">.*?</header>', t, re.S).group(0)
    aktiv = ' '.join(re.findall(r'href="(/[^"]*)"[^>]*aria-current="page"', kopf))
    main = re.search(r'<main id="inhalt">\n?(.*?)</main>', t, re.S).group(1)
    return t, titel, klasse, aktiv, main


start, titel0, klasse0, _, main0 = teile('index')
kopf_html = re.search(r'<head>(.*)</head>', start, re.S).group(1)
koerper = re.search(r'<body[^>]*>(.*)</body>', start, re.S).group(1)

# ---------- Kopf: Stil und Schriften eingebettet, keine externen Dateien ----------
css_name = re.search(r'href="/css/(mc\.[0-9a-f]+\.css)"', kopf_html).group(1)
css = (Q / 'css' / css_name).read_text()
css = re.sub(r'url\("\.\./fonts/([^"]+\.woff2)"\)',
             lambda m: 'url("data:font/woff2;base64,' + base64.b64encode((Q / 'fonts' / m.group(1)).read_bytes()).decode() + '")', css)
css += '''
/* Musterseite-Hinweis (nur Vorschau) */
.fk-hinweis { margin: 0; padding: .45rem 1rem; background: var(--farbe-tint); color: var(--farbe-text); font-size: 1rem; line-height: 1.4; text-align: center; border-bottom: 1px solid var(--farbe-linie); }
.fk-hinweis strong { font-weight: 600; }
'''
kopf_html = re.sub(r'<meta charset[^>]*>\s*|<meta name="viewport"[^>]*>\s*', '', kopf_html)
kopf_html = re.sub(r'<link rel="(canonical|preload|stylesheet)"[^>]*>\s*|<meta property="og:[^>]*>\s*', '', kopf_html)
kopf_html = re.sub(r'<script src="[^"]*" defer></script>\s*', '', kopf_html)
kopf_html = re.sub(r'<link rel="icon"[^>]*>', f'<link rel="icon" href="{daten_svg(Q / "favicon.svg")}" type="image/svg+xml">', kopf_html)
kopf_html = re.sub(r'(<meta name="theme-color"[^>]*>)', r'\1' + f'\n<style>{css}</style>', kopf_html)

# ---------- Unterseiten als Vorlagen ----------
vorlagen = []
for name in SEITEN[1:]:
    _, titel, klasse, aktiv, main = teile(name)
    aktiv_h = ' '.join('#' + a for a in aktiv.split()) if aktiv else ''
    vorlagen.append(f'<template data-seite="{name}" data-titel="{html.escape(titel)}" data-klasse="{klasse}" '
                    f'data-aktiv="{aktiv_h}">\n{bearbeiten(main)}</template>')

# ---------- Skripte: Bausteine + Seite, angepasst an Hash-Adressen ----------
js_b = (Q / 'js' / 'bausteine.js').read_text()
js_s = (Q / 'js' / 'seite.js').read_text()
js_s = js_s.replace("new URLSearchParams(location.search).get('leistung')",
                    "new URLSearchParams(location.search || location.hash.split('?')[1] || '').get('leistung')")
js_s, n = re.subn(r'function start\(\) \{ panel\(\); formular\(\); \}', 'function start() { panel(); formular(); }\n  window.fkFormular = formular;', js_s)
assert n == 1, 'seite.js: start() nicht gefunden'
ROUTER = r'''
/* Vorschau: Unterseiten per Hash-Adresse (#/angebot) in <main> zeigen; Formular sendet nichts. */
(() => {
  function start() {
    const main = document.getElementById('inhalt');
    if (!main) return;
    const vorlagen = {};
    document.querySelectorAll('template[data-seite]').forEach((t) => { vorlagen[t.dataset.seite] = t; });
    const START = { html: main.innerHTML, titel: document.title, klasse: '__KLASSE__', aktiv: '' };
    let jetzt = null;
    const setzeAktiv = (aktiv) => {
      const liste = aktiv ? aktiv.split(' ') : [];
      document.querySelectorAll('.kopf a[href^="#/"]').forEach((a) => {
        if (liste.includes(a.getAttribute('href').split('?')[0])) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
    };
    const zeige = (nutzer) => {
      const h = location.hash;
      if (h && !h.startsWith('#/')) { if (jetzt !== null) return; }
      const ziel = h.startsWith('#/') ? h : '#/';
      if (ziel === jetzt) return;
      jetzt = ziel;
      const name = ziel.slice(2).split('?')[0];
      const t = vorlagen[name];
      if (t) {
        main.replaceChildren(t.content.cloneNode(true));
        document.title = t.dataset.titel;
        document.body.className = t.dataset.klasse;
        setzeAktiv(t.dataset.aktiv);
      } else {
        main.innerHTML = START.html;
        document.title = START.titel;
        document.body.className = START.klasse;
        setzeAktiv('');
      }
      if (window.fkFormular) window.fkFormular();
      if (nutzer) {
        window.scrollTo(0, 0);
        main.setAttribute('tabindex', '-1');
        main.focus({ preventScroll: true });
      }
    };
    addEventListener('hashchange', () => zeige(true));
    document.addEventListener('submit', (e) => {
      if (e.defaultPrevented) return;
      e.preventDefault();
      location.hash = '#/nachricht-gesendet';
    });
    zeige(false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
'''.replace('__KLASSE__', klasse0)

# ---------- Körper ----------
hinweis = ('<p class="fk-hinweis" role="note"><strong>Musterseite – fiktives Unternehmen.</strong> '
           'Alle Angaben sind Platzhalter.</p>')
koerper = bearbeiten(koerper)
koerper = koerper.replace('<a class="sprung" href="#inhalt">Zum Inhalt springen</a>',
                          '<a class="sprung" href="#inhalt">Zum Inhalt springen</a>\n' + hinweis
                          + f'\n<script>document.body.className = "{klasse0}";</script>', 1)
assert hinweis in koerper, 'Sprunglink nicht gefunden'
koerper = (koerper.strip() + '\n\n'
           + '\n'.join(vorlagen) + f'\n<script>\n{js_b}\n{js_s}\n{ROUTER}</script>\n')
ergebnis = kopf_html.strip() + '\n' + koerper

# ---------- Prüfen: keine echten Angaben, keine Dateiverweise ----------
klein = ergebnis.lower()
treffer = [v for v in VERBOTEN if re.search(r'(?<![a-zäöü])' + re.escape(v), klein)]  # „Geislingen“ ist kein Treffer
assert not treffer, f'Echte Angaben im Ergebnis: {treffer}'
reste = re.findall(r'(?:src|href)="/(?!/)[^"]*"', ergebnis)
assert not reste, f'Wurzelpfade übrig: {reste[:5]}'
ZIEL.parent.mkdir(parents=True, exist_ok=True)
ZIEL.write_text(ergebnis)
print(f'{ZIEL}: {len(ergebnis.encode()) / 1e6:.2f} MB, {len(vorlagen)} Unterseiten')
