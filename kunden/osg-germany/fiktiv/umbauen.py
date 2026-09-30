# Macht aus der OSG-Studie die fiktive Marke NORVAK (Portfolio-Fassung). Arbeitet nur in diesem Ordner.
import json, re, math, pathlib

D = pathlib.Path(__file__).parent
S = json.loads((D / 'inhalt/seite.json').read_text())

# ---------- Produktcodes: jede OSG-Bezeichnung bekommt eine erfundene ----------
def rot(s, n=7):
    return ''.join(chr((ord(c) - 65 + n) % 26 + 65) if 'A' <= c <= 'Z' else c for c in s)

def neu_code(c):
    for alt, neu in (('AE-', 'NX-'), ('ADO', 'NDO'), ('ADF', 'NDF'), ('AD-', 'ND-'), ('AT-', 'NT-'), ('A-', 'N-')):
        if c.startswith(alt):
            return neu + c[len(alt):]
    if c in ('AD', 'ADO', 'ADF', 'AE'):
        return {'AD': 'ND', 'ADO': 'NDO', 'ADF': 'NDF', 'AE': 'NX'}[c]
    return rot(c)

CODE = re.compile(r'\b[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+\b|\b[A-Z]{2,}[0-9]*\b')
KEIN_CODE = {'CFK', 'VHM', 'ISO', 'NC', 'CNC', 'HRC', 'DLC', 'EDP', 'WSP', 'KI', 'SUS', 'GmbH', 'DE', 'OSG', 'HSP', 'EVO',
             'MORI', 'DMG', 'BASS', 'NEXAM', 'SOMTA', 'WEXO', 'FIUDI', 'BOSCH', 'DAIMLER', 'DUARISE', 'CAD', 'CAM', 'JobRad', 'PDF',
             'III', 'VIII', 'EX', 'CELL', 'O', 'OSAWA', 'SO'}
codes = set()
def sammeln(t):
    for c in CODE.findall(t):
        if c not in KEIN_CODE and not c.startswith('EX-CELL') and 'EX-CELL' not in c:
            codes.add(c)
for b in S['branchen']:
    for _, t in b['bauteile']: sammeln(t)
    sammeln(b['teaser'])
for s in S['serien']:
    for a, t in s['aufstellung']: sammeln(a); sammeln(t)
    sammeln(s['name'])
for b in S['bereiche']: sammeln(b['text'])
for n, _ in S['a_brand']['linien']: codes.add(n)
codes |= {'AE-VM', 'AE-H', 'ADF', 'AD', 'ADO', 'ADO-SUS', 'A-TAP', 'AE-VMS', 'WXL', 'PSE', 'PXD', 'PRC', 'PFB', 'PXM', 'DCT', 'PAO', 'PSEL'}
MAP = {c: neu_code(c) for c in codes}
MAP['A-END MILL'] = 'N-END MILL'; MAP['A-THREAD MILL'] = 'N-THREAD MILL'
ORDNUNG = sorted(MAP, key=len, reverse=True)
def codes_ersetzen(t):
    if not isinstance(t, str): return t
    for c in ORDNUNG:
        t = re.sub(r'(?<![A-Za-z0-9-])' + re.escape(c) + r'(?![A-Za-z0-9])', MAP[c], t)
    return t

# ---------- Allgemeine Ersetzungen (Reihenfolge wichtig) ----------
TEXT = [
    ('de.osgeurope.com', 'shop.norvak.example'),
    ('osg-germany.de', 'norvak.example'),
    ('OSG Corporation ist der weltweit größte Hersteller von Schaftwerkzeugen. Gegründet 1938, hat OSG einen langjährigen Ruf als Anbieter von Gesamtlösungen für Schneidwerkzeuge in der gesamten Fertigungsindustrie.',
     'NORVAK entwickelt und schleift Vollhartmetall-Werkzeuge seit 1964 – vom Gewindebohrer bis zum Sonderfräser, mit eigener Beschichtung und Anwendungstechnik im Haus.'),
    ('Seit 1938 entwickelt OSG Schneidwerkzeuge; für robuste Materialien wie CFK gelten sie als Industriestandard. Spezialwerkzeuge für den Flugzeugbau kommen auch von NEXAM Aircraft Cutting Tools aus der OSG-Gruppe.',
     'Seit Jahrzehnten entwickelt NORVAK Werkzeuge für Titan, Aluminium und CFK – mit eigener Diamantbeschichtung für Faserverbund.'),
    ('gewinden einen hohen Marktanteil', 'gewinden'),
    ('bei denen OSG weltweit einen hohen Marktanteil hat', 'mit denen NORVAK begonnen hat'),
    ('eines der vier Kernprodukte, mit denen NORVAK begonnen hat', 'das Werkzeug, mit dem NORVAK 1964 begonnen hat'),
    ('DUARISE', 'KRYON'), ('EgiAs', 'TIVEX'),
    ('OSG Shape IT', 'NORVAK Schliffbild'), ('Das Global Tooling Magazine von OSG, zuletzt die Sommerausgabe 2026.', 'Das Kundenmagazin von NORVAK, zweimal im Jahr.'),
    ('ThreadPro', 'GewindeCode'),
    ('OSG-Katalog Vol. VIII', 'NORVAK-Katalog 2026'),
    ('Micro Toolmanagement', 'Werkzeugkreislauf'),
    ('A Brand', 'N-Linie'),
    ('Göppingen', 'Kantenberg'),
    ('OSG', 'NORVAK'),
]
def text_ersetzen(t):
    if not isinstance(t, str): return t
    for a, b in TEXT: t = t.replace(a, b)
    return t

def laufen(x, f):
    if isinstance(x, dict): return {k: laufen(v, f) for k, v in x.items()}
    if isinstance(x, list): return [laufen(v, f) for v in x]
    return f(x)

# ---------- Firmendaten und Dritte: ausdrücklich erfunden ----------
S['_quelle'] = 'FIKTIV: Portfolio-Fassung der OSG-Studie. NORVAK, alle Personen, Zahlen, Produkte und Partner sind erfunden.'
S['basis'] = 'https://www.norvak.example'
S['shop'] = 'https://shop.norvak.example/'
S['firma'] = 'NORVAK Präzisionswerkzeuge GmbH'
S['strasse'] = 'Am Schleifwerk 12'; S['plz'] = '71999'; S['ort'] = 'Kantenberg'
S['telefon_anzeige'] = '+49 123 4567-0'; S['telefon_link'] = '+4912345670'; S['fax_anzeige'] = '+49 123 4567-99'
S['email'] = 'info@norvak.example'
S['route'] = 'https://www.norvak.example/anfahrt'
S['kennzahlen'] = [{'wert': '1964', 'text': 'gegründet als Schleiferei'}, {'wert': '14', 'text': 'Länder mit Vertrieb und Anwendungstechnik'},
                   {'wert': '480', 'text': 'Mitarbeitende an zwei Standorten'}, {'wert': '3', 'text': 'eigene Beschichtungsanlagen'}]
S['konzern'] = {
    'einleitung': 'NORVAK entwickelt und schleift Vollhartmetall-Werkzeuge seit 1964 – vom Gewindebohrer bis zum Sonderfräser, mit eigener Beschichtung und Anwendungstechnik im Haus.',
    'name': [['NOR', 'Norden – die Werkstatt lag am Nordrand von Kantenberg'], ['V', 'Vollhartmetall, seit 1981 der Kern des Programms'], ['AK', 'Anwendungstechnik und Kundennähe']],
    'kern': 'Vier Kernprodukte: Gewindebohrer, Bohrer, Schaftfräser und Sonderwerkzeuge nach Zeichnung.',
    'qualitaet': 'Alles entsteht im eigenen Haus – vom Hartmetall-Rohling über die Geometrie bis zur eigenen Beschichtung.',
    'zahlen': [['Umsatz 2025', '96 Mio. €'], ['Mitarbeitende', '480'], ['Werkzeuge pro Jahr', 'rund 1,2 Mio.'], ['Exportanteil', '58 %']],
}
S['gmbh'] = {
    'standorte': 'Kantenberg und Lindau am Brunnen', 'gruendung': '01.04.1964', 'zertifikate': ['ISO 9001:2015', 'ISO 14001:2015'],
    'auszeichnungen': ['Lieferantenpreis Antriebstechnik 2024', 'Innovationspreis Zerspanung 2023'],
    'holding': 'Seit 2019 gehört die Nachschleif-Tochter NORVAK Service zur Gruppe; seit 2022 fertigt das zweite Werk in Lindau am Brunnen Sonderwerkzeuge.',
    'gruppe': ['NORVAK Präzisionswerkzeuge GmbH', 'NORVAK Service GmbH', 'NORVAK Coating GmbH', 'NORVAK Tools Polska', 'NORVAK Tools Italia'],
}
S['marken'] = [{'name': 'NORVAK Service', 'link': 'https://www.norvak.example/service'}, {'name': 'NORVAK Coating', 'link': 'https://www.norvak.example/coating'}]
S['a_brand']['text'] = 'Mit der N-Linie vereint NORVAK seine leistungsstärksten Werkzeuge in einer Produktlinie – für Präzision, Prozesssicherheit und Leistung in der modernen Fertigung.'
S['a_brand']['link'] = 'https://www.norvak.example/n-linie'
S['bericht'].update({'kunde': 'ein Luftfahrtzulieferer aus Süddeutschland', 'quelle': 'Anwenderbericht (Beispiel)',
                     'text': 'Für ein sicherheitsrelevantes Titanbauteil reichte die vorhandene Werkzeuglösung nicht für einen zuverlässigen mannlosen Betrieb. Gemeinsam mit NORVAK entstand ein abgestimmter VHM-Sonderfräser.',
                     'link': 'https://www.norvak.example/berichte/titan'})
S['termine'] = [
    {'datum': '2026-10-08', 'tag': '08', 'monat': 'Okt', 'titel': 'Span im Griff. Prozesse im Fluss.', 'ort': 'Technikum Kantenberg', 'zeit': '9:00–15:00 Uhr', 'link': 'https://www.norvak.example/termine/span'},
    {'datum': '2026-10-15', 'tag': '15', 'monat': 'Okt', 'titel': 'Digitale Werkzeugorganisation mit nachgeschliffenen Werkzeugen', 'ort': 'NORVAK Academy, Kantenberg', 'zeit': '9:00–14:00 Uhr', 'link': 'https://www.norvak.example/termine/digital'},
    {'datum': '2026-11-26', 'tag': '26', 'monat': 'Nov', 'titel': 'Mikropräzision im Fokus – Grenzen verschieben', 'ort': 'Werk Lindau am Brunnen', 'zeit': '', 'link': 'https://www.norvak.example/termine/mikro'},
]
S['beitraege'] = [
    {'datum': '2026-09-21', 'anzeige': '21.09.2026', 'titel': 'Digitale Werkzeugorganisation mit nachgeschliffenen Werkzeugen', 'link': 'https://www.norvak.example/news/digital'},
    {'datum': '2026-09-18', 'anzeige': '18.09.2026', 'titel': 'Mikropräzision im Fokus – Grenzen verschieben', 'link': 'https://www.norvak.example/news/mikro'},
    {'datum': '2026-09-03', 'anzeige': '03.09.2026', 'titel': 'Werkzeugversorgung im geschlossenen Kreislauf', 'link': 'https://www.norvak.example/news/kreislauf'},
]
S['beitraege_alle'] = 'https://www.norvak.example/news'
S['newsletter'] = 'https://www.norvak.example/newsletter'
S['haendler'] = ['Brenner Werkzeugtechnik GmbH', 'Falkenhof Zerspanung KG', 'Hartwig & Sohn Industriebedarf', 'Kessler Präzisionshandel GmbH',
                 'Lorenz Werkzeuge + Maschinen', 'Maurer Schneidtechnik GmbH', 'Nordtal Industrieversorgung', 'Richter & Brandt Werkzeughandel',
                 'Seidel Zerspanungstechnik GmbH', 'Thalberg Werkzeugvertrieb', 'Vogt Hartmetall-Service', 'Winterstein Tool Consulting']
S['impressum'] = {'zeilen': ['NORVAK Präzisionswerkzeuge GmbH (fiktiv)', 'Am Schleifwerk 12', 'D-71999 Kantenberg', 'Telefon: +49 123 4567-0', 'info@norvak.example'],
                  'gf': 'Beispiel – fiktives Unternehmen', 'register': 'entfällt (fiktives Unternehmen)', 'ust': 'entfällt'}
S['profile'] = [{'name': n, 'link': f'https://www.norvak.example/{n.lower()}'} for n in ('LinkedIn', 'YouTube', 'Instagram', 'Facebook')]
S['karriere']['jobs'] = 'https://www.norvak.example/jobs'
for x in S['serien']: x['link'] = 'https://shop.norvak.example/serie/' + x['id']
for x in S['branchen']: x['link'] = 'https://www.norvak.example/branche/' + x['id']
for x in S['bereiche']: x['shop'] = 'https://shop.norvak.example/' + x['id']
for x in S['downloads']: x['link'] = 'https://www.norvak.example/downloads/' + re.sub(r'[^a-z0-9]+', '-', text_ersetzen(codes_ersetzen(x['name'])).lower()).strip('-')

S = laufen(S, codes_ersetzen)
S = laufen(S, text_ersetzen)
for s in S['serien']: s['id'] = re.sub(r'[^a-z0-9]+', '-', s['name'].replace(' Serie', '').lower()).strip('-')
txt = json.dumps(S, ensure_ascii=False, indent=2).replace('Das Werkzeugkreislauf von NORVAK verbindet alle Schritte zu einem geschlossenen Werkzeugkreislauf', 'Der Werkzeugkreislauf von NORVAK verbindet alle Schritte zu einem geschlossenen Kreislauf')
(D / 'inhalt/seite.json').write_text(txt)
# Kommentare in CSS/JS ohne OSG-Bezug; alte Bündel weg
for f in ['public/css/marke.css', 'public/css/stil.css', 'public/css/bausteine.css', 'public/js/seite.js', 'public/js/bausteine.js']:
    q = D / f; q.write_text(q.read_text().replace('(GET an de.osgeurope.com)', '(GET an den Shop)').replace('OSG', 'NORVAK'))
for q in (D / 'public/css').glob('osg.*.css'): q.unlink()
for q in (D / 'public').glob('*.html'): q.unlink()

# ---------- bauen.mjs ----------
B = (D / 'bauen.mjs').read_text()
B_ERS = [
    ('(öffnet de.osgeurope.com)', '(externe Seite)'),
    ('KI-Visualisierung – vor Veröffentlichung durch OSG-Fotografie ersetzen oder freigeben lassen', 'KI-Visualisierung (Portfolio-Studie, fiktives Unternehmen)'),
    ('/medien/osg-logo.svg" width="171" height="60" alt="OSG – shaping your dreams"', '/medien/norvak-logo.svg" width="171" height="60" alt="NORVAK Präzisionswerkzeuge"'),
    ('medien/osg-logo.svg', 'medien/norvak-logo.svg'),
    ('<li><a href="https://osg-gmbh.personiowhistleblowing.com/" rel="noopener">Hinweisgeber&shy;system${raus}<span class="unsichtbar"> (externe Seite)</span></a></li>', ''),
    ('Neugestaltungs-Studie auf Grundlage der Inhalte von de.osgeurope.com (Stand 30.09.2026) – nicht die offizielle Website der OSG GmbH.',
     'Portfolio-Studie: NORVAK ist ein fiktives Unternehmen. Namen, Zahlen, Produkte, Partner und Adressen sind erfunden.'),
    ('vom weltweit größten Hersteller von Schaftwerkzeugen', 'aus eigener Schleiferei und Beschichtung'),
    ('OSG ist Firmenname und Handelsmarke zugleich.', 'Der Name erzählt, wo alles begann.'),
    ('Drei Buchstaben, eine Herkunft.', 'Sechs Buchstaben, eine Werkstatt.'),
    ("ueber('02', 'OSG Corporation')", "ueber('02', 'Unternehmen')"),
    ('Kennzahlen des Konzerns', 'Kennzahlen'),
    ('OSG GmbH in Deutschland', 'Werke in Deutschland'),
    ('Die OSG-Gruppe in Europa', 'Die NORVAK-Gruppe'),
    ('Weitere Marken der OSG-Gruppe', 'Weitere Marken der NORVAK-Gruppe'),
    ('weltweit größter Hersteller von Schaftwerkzeugen', 'Vollhartmetall-Werkzeuge seit 1964'),
    ('OSG Corporation seit 1938, Netzwerk in 33 Ländern; OSG GmbH in Göppingen und Bad Homburg seit 2002, ISO 9001 und ISO 14001, Teil der OSG Germany Holding.',
     'NORVAK seit 1964: eigene Schleiferei und Beschichtung, Werke in Kantenberg und Lindau am Brunnen, ISO 9001 und ISO 14001.'),
    ('mit Kolleginnen und Kollegen in 33 Ländern', 'mit Kolleginnen und Kollegen in 14 Ländern'),
    ('OSG GmbH, Karl-Ehmann-Str. 25, 73037 Göppingen: Telefon +49 7161 6064-0, info@osg-germany.de', 'NORVAK, Am Schleifwerk 12, 71999 Kantenberg: Telefon +49 123 4567-0, info@norvak.example'),
    ("Angaben übernommen aus dem Impressum auf de.osgeurope.com (Stand 30.09.2026).", 'Fiktives Unternehmen – dieses Impressum ist ein Muster.'),
    ('OSG Germany', 'NORVAK'),
    ('de.osgeurope.com', 'shop.norvak.example'),
    ('Göppingen', 'Kantenberg'),
    ('Bad Homburg', 'Lindau am Brunnen'),
    ('OSG', 'NORVAK'),
    ('A Brand', 'N-Linie'),
    ('Micro Toolmanagement', 'Werkzeugkreislauf'),
    ('placeholder="z. B. A-TAP"', 'placeholder="z. B. N-TAP"'),
]
for a, b in B_ERS: B = B.replace(a, b)
# Code-Beispiele in bauen.mjs selbst (Kommentare, Platzhalter, Titel)
B = codes_ersetzen(B)
B = B.replace('^osg\\.', '^norvak\\.').replace('`osg.${', '`norvak.${')
(D / 'bauen.mjs').write_text(B)

# ---------- eigenes Zeichen: Querschnitt eines 4-Schneiden-Fräsers ----------
def fraeser(cx=45, cy=45, R=44, r=30, n=4, land=48):
    p = []
    for i in range(n):
        a0 = math.radians(i * 360 / n - 90); a1 = a0 + math.radians(land); a2 = math.radians((i + 1) * 360 / n - 90)
        P = lambda a: (cx + R * math.cos(a), cy + R * math.sin(a))
        x0, y0 = P(a0); x1, y1 = P(a1); x2, y2 = P(a2)
        p.append(('M' if i == 0 else 'L') + f'{x0:.1f},{y0:.1f}')
        p.append(f'A{R},{R} 0 0 1 {x1:.1f},{y1:.1f}')
        p.append(f'A{r},{r} 0 0 0 {x2:.1f},{y2:.1f}')
    return ''.join(p) + 'Z'
PFAD = fraeser()
M = D / 'public/medien'
(M / 'profil.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90"><path d="{PFAD}"/></svg>\n')
(D / 'public/favicon.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90"><path fill="#0a5aa8" d="{PFAD}"/><circle cx="45" cy="45" r="9" fill="#fff"/></svg>\n')
(M / 'norvak-logo.svg').write_text(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 171 60" role="img"><title>NORVAK</title>
<g transform="translate(2 7) scale(.51)"><path fill="#0a5aa8" d="{PFAD}"/><circle cx="45" cy="45" r="9" fill="#fff"/></g>
<text x="56" y="34" font-family="Arial Black, Arial, Helvetica, sans-serif" font-weight="900" font-size="23" letter-spacing="1" fill="#0b1b2e">NORVAK</text>
<text x="57" y="48" font-family="Arial, Helvetica, sans-serif" font-size="7.4" letter-spacing="1.1" fill="#51606f">PRÄZISIONSWERKZEUGE</text></svg>
''')
(M / 'osg-logo.svg').unlink(missing_ok=True)
print(len(MAP), 'Codes ersetzt, z. B.', list(MAP.items())[:8])
