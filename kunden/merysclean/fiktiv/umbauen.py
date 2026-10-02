# Macht aus der Merys-Clean-Seite die fiktive Musterfirma KLARWERK Gebäudereinigung (private Vorschau).
# Arbeitet nur in diesem Ordner (Kopie, siehe README.md): ändert inhalt/seite.json, bauen.mjs, CSS/JS-Kommentare
# und ersetzt alle Fotos und Logos durch eigene SVG-Grafiken ohne Menschen-Gesichter und ohne Firmenzeichen.
import json, re, pathlib

D = pathlib.Path(__file__).parent
P = D / 'public'
M = P / 'medien'

# ---------- Textersetzungen (Reihenfolge wichtig: lange vor kurzen) ----------
TEXT = [
    ('Angaben übernommen aus dem Impressum auf merysclean.de (Stand 01.10.2026).', 'Musterseite: Klarwerk ist ein fiktives Unternehmen, alle Angaben sind erfunden.'),
    ('Merys Clean UG (haftungsbeschränkt)', 'Klarwerk Gebäudereinigung (Musterfirma)'),
    ('Merys Clean – Dienstleistungen, Gebäudereinigung', 'Klarwerk Gebäudereinigung'),
    ('Hallo%20Merys%20Clean', 'Hallo%20Klarwerk'),
    ('Merys-Clean-Logo', 'Firmenlogo'),
    ('Merys Clean', 'Klarwerk'),
    ('https://merysclean.de', 'https://www.klarwerk.example'),
    ('merysclean.de', 'klarwerk.example'),
    ('@merys_clean', '@klarwerk_muster'),
    ('Merys', 'Klarwerk'),
    ('Safet und Merita Mustafa', 'Max Mustermann und Erika Musterfrau'),
    ('Safet Mustafa', 'Max Mustermann'),
    ('Merita Mustafa', 'Erika Musterfrau'),
    ('Mustafa', 'Mustermann'),
    ('In den Krummäckern 40', 'Musterstraße 1'),
    ('In+den+Kr%C3%BCmm%C3%A4ckern+40%2C+73054+Eislingen%2FFils', 'Musterstra%C3%9Fe+1%2C+73000+Musterstadt'),
    ('73054', '73000'),
    ('0173 185 35 63', '01234 567890'),
    ('491731853563', '491234567890'),
    ('07161 9454270', '01234 567891'),
    ('4971619454270', '491234567891'),
    ('Eislingen/Fils', 'Musterstadt'),
    ('Eislingen', 'Musterstadt'),
]


def ersetzen(t):
    for a, b in TEXT:
        t = t.replace(a, b)
    return t


# ---------- seite.json ----------
S = json.loads(ersetzen((D / 'inhalt/seite.json').read_text()))
S.update({
    'basis': 'https://www.klarwerk.example',
    'firma': 'Klarwerk Gebäudereinigung',
    'firma_lang': 'Klarwerk Gebäudereinigung (Musterfirma)',
    'email': 'info@klarwerk.example',
    'facebook': 'https://www.facebook.com/',
    'instagram': 'https://www.instagram.com/',
    'gf': 'Max Mustermann',
    'hrb': 'HRB 000000 (Muster)',
    'steuernr': '00000/00000 (Muster)',
})
S['_hinweis'] = 'FIKTIVE Musterfassung (fiktiv/umbauen.py). Alle Namen, Adressen und Nummern sind erfunden.'
S['_quelle'] = 'fiktiv'
S['karte']['orte'][0]['id'] = 'sitz'
ALT = {
    'buero-boden': 'Illustration: helles Büro mit Schreibtisch, Pflanze und Wischmopp auf glänzendem Parkett',
    'buero-dampf': 'Illustration: Großraumbüro mit Stühlen und einem Dampfreiniger, aus dem Dampfwolken steigen',
    'fenster-breit': 'Illustration: große, frisch geputzte Fensterfront mit Abzieher, dahinter eine Stadtsilhouette',
}
# KI-Stimmungsbilder (Higgsfield) zeigen keine Menschen und kein Firmenzeichen: sie bleiben als Rasterbild
RASTER = {'treppe', 'bau', 'haushalt'}
for l in S['leistungen']:
    if l.get('bild') and l['bild']['name'] not in RASTER:
        l['bild']['alt'] = ALT[l['bild']['name']]
TEAM = [('max', 'Max Mustermann', 'MM', 'Platzhalter-Grafik: Silhouette mit Monogramm MM für Max Mustermann'),
        ('erika', 'Erika Musterfrau', 'EM', 'Platzhalter-Grafik: Silhouette mit Monogramm EM für Erika Musterfrau')]
for p, (pid, name, _, alt) in zip(S['team'], TEAM):
    p['id'] = pid; p['name'] = name
    p['bild']['name'] = f'portraet-{pid}'; p['bild']['alt'] = alt
S['team_gruppe']['name'] = 'team-gruppe'
S['team_gruppe']['alt'] = 'Illustration: fünf stilisierte Figuren in Arbeitskleidung ohne Gesichter, Platzhalter für ein Teamfoto'
S['siegel']['alt'] = 'Siegel: 100 % Zufriedenheitsgarantie'
S['team_frei']['alt'] = 'Illustration: fünf Figuren ohne Gesichter in schwarzer Arbeitskleidung mit grünem Abzeichen, Platzhalter für das freigestellte Teamfoto'
(D / 'inhalt/seite.json').write_text(json.dumps(S, ensure_ascii=False, indent=2) + '\n')

# ---------- bauen.mjs ----------
B = ersetzen((D / 'bauen.mjs').read_text())
B = B.replace('Angaben übernommen aus dem Impressum auf klarwerk.example (Stand 01.10.2026).',
              'Musterseite: Klarwerk ist ein fiktives Unternehmen, alle Angaben sind erfunden.')
B = B.replace('Instagram: @klarwerk_muster', 'Instagram (Muster)')
B = B.replace('team-gruppe-1024.webp', 'team-gruppe.svg')
B = B.replace('<figcaption>Das Team von Klarwerk</figcaption>', '<figcaption>Das Team von Klarwerk (Platzhalter-Illustration)</figcaption>')
# Bilder: eine SVG-Datei je Motiv statt AVIF/WebP-Reihen
NEU_BILD = '''function bild(b, sizes, { lazy = true, prio = false, klasse = '' } = {}) {
  const laden = prio ? ' fetchpriority="high" decoding="async"' : lazy ? ' loading="lazy" decoding="async"' : ' decoding="async"';
  const datei = ['treppe', 'bau', 'haushalt'].includes(b.name) ? `${b.name}-800.webp` : `${b.name}.svg`;
  return `<picture${klasse ? ` class="${klasse}"` : ''}><img src="/medien/${datei}" width="${b.w}" height="${b.h}" alt="${esc(b.alt)}"${laden}></picture>`;
}
'''
B, n = re.subn(r'function bild\(b, sizes.*?\n}\n', lambda m: NEU_BILD, B, count=1, flags=re.S)
assert n == 1, 'bild() in bauen.mjs nicht gefunden'
(D / 'bauen.mjs').write_text(B)

# ---------- CSS/JS-Kommentare ----------
for f in list((P / 'css').glob('*.css')) + list((P / 'js').glob('*.js')):
    f.write_text(ersetzen(f.read_text()))

# ---------- Grafiken (Designsystem: Wand #f5f2eb, ein Grün #5fba46 (Logo), Creme #ece6da, Blau #1d5f9e, Dunkel #202020) ----------
for f in list(M.glob('*.webp')) + list(M.glob('*.avif')):
    if not (f.name.split('-')[0] in RASTER and f.name.endswith('-800.webp')):
        f.unlink()
SVG = 'xmlns="http://www.w3.org/2000/svg"'


def funke(x, y, s, farbe='#fff', deck=1):
    k = .16
    return (f'<path transform="translate({x} {y}) scale({s})" fill="{farbe}" opacity="{deck}" '
            f'd="M0-1C{k}-{k} {k}-{k} 1 0C{k} {k} {k} {k} 0 1C-{k} {k} -{k} {k} -1 0C-{k}-{k} -{k}-{k} 0-1Z"/>')


def figur(x, boden, s, farbe, schuerze):
    # Kopf als Kreis, Körper als gerundete Form, Schürze als hellere Fläche – bewusst ohne Gesicht
    return (f'<g transform="translate({x} {boden}) scale({s})">'
            f'<path fill="{farbe}" d="M-62 0C-64-120-52-196 0-196C52-196 64-120 62 0Z"/>'
            f'<path fill="{schuerze}" d="M-30 0V-128Q0-142 30-128V0Z" opacity=".9"/>'
            f'<circle cy="-246" r="42" fill="{farbe}"/></g>')


# Teambild (Startseite, Über uns): fünf Figuren vor heller Wand
team = f'''<svg {SVG} viewBox="0 0 1024 546">
<defs><linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef3e6"/><stop offset="1" stop-color="#dfe9d3"/></linearGradient></defs>
<rect width="1024" height="546" fill="url(#w)"/>
<circle cx="760" cy="150" r="250" fill="#fbfaf6" opacity=".55"/>
<rect y="452" width="1024" height="94" fill="#d9d3c6"/>
<path d="M0 452h1024" stroke="#c9c1b0" stroke-width="3"/>
<path d="M120 500C340 540 640 540 930 470" fill="none" stroke="#5fba46" stroke-width="10" stroke-linecap="round" opacity=".55"/>
{figur(250, 470, 1.05, '#1d5f9e', '#ece6da')}
{figur(780, 470, 1.05, '#55595a', '#ece6da')}
{figur(390, 476, 1.18, '#5fba46', '#fbfaf6')}
{figur(640, 476, 1.18, '#202020', '#5fba46')}
{figur(515, 482, 1.3, '#3d8a3f', '#fbfaf6')}
{funke(140, 120, 26, '#5fba46')}{funke(905, 90, 20, '#1d5f9e', .7)}{funke(880, 330, 14, '#5fba46', .8)}{funke(90, 330, 12, '#1d5f9e', .6)}
</svg>
'''
(M / 'team-gruppe.svg').write_text(team)

# Freigestelltes Team (Hero): fünf gesichtslose Figuren in schwarzer Arbeitskleidung, transparenter Hintergrund
def polo(x, boden, s, haar):
    return (f'<g transform="translate({x} {boden}) scale({s})">'
            f'<path fill="#121412" d="M-120 0C-124-170-100-262 0-268C100-262 124-170 120 0Z"/>'
            f'<path fill="#2a2e2a" d="M-26-266 0-236 26-266Z"/>'
            f'<circle cx="-56" cy="-196" r="13" fill="#5fba46"/>'
            f'<rect x="-22" y="-300" width="44" height="40" rx="14" fill="#cdbba6"/>'
            f'<ellipse cy="-350" rx="58" ry="66" fill="#d9c7b2"/>'
            f'<path fill="{haar}" d="M-58-352C-62-420 62-420 58-352C50-392-50-392-58-352Z"/></g>')

(M / 'team-frei.svg').write_text(f'''<svg {SVG} viewBox="0 0 1400 687">
{polo(260, 687, 1.18, '#3b2a20')}
{polo(1150, 687, 1.18, '#1d1d1d')}
{polo(720, 687, 1.12, '#6b4a2e')}
{polo(500, 687, 1.32, '#2b2b2b')}
{polo(930, 687, 1.3, '#b08850')}
</svg>
''')

# Porträts: Silhouette mit Monogramm, keine Gesichter
for (pid, _, mono, _), (grund, koerper) in zip(TEAM, [('#ece6da', '#5fba46'), ('#dde8f3', '#1d5f9e')]):
    (M / f'portraet-{pid}.svg').write_text(f'''<svg {SVG} viewBox="0 0 740 1024">
<rect width="740" height="1024" fill="{grund}"/>
<circle cx="370" cy="420" r="300" fill="#fbfaf6" opacity=".6"/>
<circle cx="370" cy="380" r="140" fill="{koerper}" opacity=".9"/>
<path fill="{koerper}" d="M70 1024C70 740 200 600 370 600S670 740 670 1024Z"/>
<text x="370" y="880" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="150" letter-spacing="8" fill="#fbfaf6">{mono}</text>
{funke(600, 170, 30, koerper, .8)}{funke(150, 260, 18, '#5fba46')}
</svg>
''')

# Büro mit Wischmopp
(M / 'buero-boden.svg').write_text(f'''<svg {SVG} viewBox="0 0 960 639">
<rect width="960" height="639" fill="#f5f2eb"/>
<rect x="560" y="60" width="300" height="250" rx="10" fill="#dde8f3"/><path d="M710 60v250M560 185h300" stroke="#fbfaf6" stroke-width="10"/>
<rect y="430" width="960" height="209" fill="#e3d6bd"/>
<path d="M0 470h960M0 520h960M0 580h960" stroke="#d6c6a6" stroke-width="3"/>
<ellipse cx="300" cy="560" rx="230" ry="34" fill="#fbfaf6" opacity=".6"/>
<rect x="520" y="300" width="340" height="22" rx="6" fill="#55595a"/>
<path d="M550 322l-20 190M830 322l20 190" stroke="#55595a" stroke-width="14" stroke-linecap="round"/>
<rect x="600" y="240" width="130" height="60" rx="6" fill="#202020"/><rect x="655" y="300" width="20" height="10" fill="#202020"/>
<rect x="770" y="250" width="50" height="50" rx="8" fill="#c9ccc5"/>
<path d="M795 250c-30-60 10-90 0-120M795 250c20-50 50-60 60-90M795 250c-50-30-60-70-90-80" fill="none" stroke="#5fba46" stroke-width="10" stroke-linecap="round"/>
<path d="M210 150L330 520" stroke="#c9ccc5" stroke-width="14" stroke-linecap="round"/>
<rect x="250" y="515" width="170" height="26" rx="8" fill="#5fba46" transform="rotate(-4 335 528)"/>
<rect x="90" y="340" width="90" height="90" rx="12" fill="#5fba46"/><path d="M90 360h90" stroke="#5fba46" stroke-width="8"/>
{funke(470, 520, 22)}{funke(160, 560, 14)}{funke(430, 590, 10)}{funke(690, 120, 18, '#1d5f9e', .6)}
</svg>
''')

# Großraumbüro mit Dampfreiniger
(M / 'buero-dampf.svg').write_text(f'''<svg {SVG} viewBox="0 0 960 639">
<rect width="960" height="639" fill="#eef3e6"/>
<g fill="#fbfaf6"><rect x="60" y="50" width="230" height="300" rx="8"/><rect x="330" y="50" width="230" height="300" rx="8"/><rect x="600" y="50" width="230" height="300" rx="8"/></g>
<rect y="420" width="960" height="219" fill="#55595a"/>
<path d="M0 470h960M0 540h960" stroke="#6b6f70" stroke-width="3"/>
<rect x="120" y="330" width="560" height="20" rx="6" fill="#d9d3c6"/><path d="M150 350v120M650 350v120" stroke="#d9d3c6" stroke-width="12" stroke-linecap="round"/>
<g fill="#1d5f9e"><rect x="200" y="380" width="110" height="26" rx="10"/><rect x="215" y="290" width="80" height="100" rx="18"/><rect x="480" y="380" width="110" height="26" rx="10"/><rect x="495" y="290" width="80" height="100" rx="18"/></g>
<path d="M255 406v80M535 406v80" stroke="#202020" stroke-width="10"/>
<rect x="730" y="470" width="150" height="110" rx="26" fill="#5fba46"/><rect x="760" y="440" width="90" height="40" rx="12" fill="#5fba46"/>
<path d="M760 460C640 420 640 330 720 280" fill="none" stroke="#202020" stroke-width="10" stroke-linecap="round"/>
<g fill="#fbfaf6" opacity=".85"><circle cx="725" cy="240" r="34"/><circle cx="760" cy="205" r="26"/><circle cx="700" cy="195" r="22"/><circle cx="740" cy="160" r="16"/></g>
{funke(410, 250, 20, '#5fba46')}{funke(870, 120, 16, '#1d5f9e', .7)}
</svg>
''')

# Breite Fensterfront mit Abzieher
fenster = ''.join(f'<rect x="{x}" y="60" width="330" height="560" rx="6" fill="url(#h)"/>' for x in (120, 480, 840, 1200))
tuerme = ''.join(f'<rect x="{x}" y="{y}" width="{b}" height="{620 - y}" fill="#1d5f9e" opacity="{o}"/>'
                 for x, y, b, o in ((150, 360, 90, .35), (260, 300, 70, .25), (520, 400, 120, .3), (660, 330, 80, .2),
                                    (880, 280, 110, .3), (1010, 380, 90, .22), (1230, 340, 100, .3), (1360, 420, 120, .22)))
(M / 'fenster-breit.svg').write_text(f'''<svg {SVG} viewBox="0 0 1600 667">
<defs><linearGradient id="h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9f1f8"/><stop offset="1" stop-color="#cfe0ee"/></linearGradient></defs>
<rect width="1600" height="667" fill="#55595a"/>
{fenster}
{tuerme}
<g stroke="#55595a" stroke-width="14">{''.join(f'<path d="M{x} 60v560"/>' for x in (450, 810, 1170))}</g>
<path d="M500 560L760 120" stroke="#fbfaf6" stroke-width="60" opacity=".35" stroke-linecap="round"/>
<path d="M880 520L1080 180" stroke="#fbfaf6" stroke-width="34" opacity=".3" stroke-linecap="round"/>
<g transform="rotate(-28 1000 330)"><rect x="940" y="300" width="160" height="22" rx="6" fill="#202020"/><rect x="1010" y="322" width="20" height="110" rx="8" fill="#5fba46"/></g>
{funke(720, 160, 30)}{funke(640, 260, 16)}{funke(1120, 210, 22)}{funke(300, 140, 14, '#fff', .8)}
</svg>
''')

# Siegel
(M / 'siegel.svg').write_text(f'''<svg {SVG} viewBox="0 0 480 505">
<path d="M40 30h40v40H40zM400 30h40v40h-40z" fill="#5fba46"/>
<path d="M70 20h340v380L240 485L70 400Z" fill="#3d8a3f"/>
<path d="M90 38h300v350L240 460L90 388Z" fill="none" stroke="#fbfaf6" stroke-width="3" stroke-dasharray="12 9"/>
<g fill="#fbfaf6" font-family="Arial, Helvetica, sans-serif" font-weight="700" text-anchor="middle">
<text x="240" y="200" font-size="92">100 %</text>
<text x="240" y="262" font-size="27" font-weight="400" letter-spacing="1">ZUFRIEDENHEITS</text>
<text x="240" y="318" font-size="48">GARANTIE</text></g>
{funke(170, 380, 16, '#fbfaf6')}{funke(240, 395, 24, '#fbfaf6')}{funke(310, 380, 16, '#fbfaf6')}
</svg>
''')

# Logo und Favicon: neutrales Text-Zeichen (Quadrat mit Funke + Wortmarke)
ZEICHEN = f'<rect x="4" y="22" width="86" height="86" rx="22" fill="#5fba46"/>{funke(47, 65, 30)}{funke(70, 42, 9, "#5fba46")}'
for name, schrift, unter in (('logo.svg', '#202020', '#55595a'), ('logo-hell.svg', '#fbfaf6', '#c9ccc5')):
    (P / 'img' / name).write_text(f'''<svg {SVG} viewBox="0 0 320 130" role="img"><title>Klarwerk Gebäudereinigung</title>
{ZEICHEN}
<text x="104" y="76" font-family="Georgia, 'Times New Roman', serif" font-size="50" fill="{schrift}">Klarwerk</text>
<text x="106" y="102" font-family="Arial, Helvetica, sans-serif" font-size="13.2" letter-spacing="2.4" fill="{unter}">GEBÄUDEREINIGUNG</text>
</svg>
''')
(P / 'favicon.svg').write_text(f'<svg {SVG} viewBox="0 18 94 94">{ZEICHEN}</svg>\n')
print('Klarwerk: seite.json, bauen.mjs, CSS/JS und', len(list(M.glob('*.svg'))), 'Grafiken umgebaut')
