# Baut aus public/ eine Fassung mit relativen Pfaden für die Artifact-Veröffentlichung (ohne Pretty URLs, ohne Function).
import re, shutil, pathlib
D = pathlib.Path(__file__).parent; Q = D / 'public'; Z = D / 'artifact'
shutil.rmtree(Z, ignore_errors=True); Z.mkdir()
for p in ['medien', 'fonts', 'js']: shutil.copytree(Q / p, Z / p)
(Z / 'css').mkdir(); [shutil.copy(f, Z / 'css') for f in (Q / 'css').glob('norvak.*.css')]
shutil.copy(Q / 'favicon.svg', Z)
SEITEN = {p.stem for p in Q.glob('*.html')}
def pfad(m):
    attr, wert = m.group(1), m.group(2)
    if wert.startswith('/'):
        rest = wert[1:]
        teil = re.match(r'([^?#]*)(.*)', rest)
        name, anhang = teil.group(1), teil.group(2)
        if name == '': name = 'index.html'
        elif name in SEITEN: name += '.html'
        wert = name + anhang
    return f'{attr}="{wert}"'
for f in Q.glob('*.html'):
    t = f.read_text()
    t = re.sub(r'\b(href|src|action|poster|data-[a-z]+)="(/(?!/)[^"]*|/)"', pfad, t)
    t = re.sub(r'(srcset|imagesrcset)="([^"]*)"', lambda m: f'{m.group(1)}="' + m.group(2).replace('/medien/', 'medien/') + '"', t)
    t = t.replace('method="post" action="api/kontakt"', 'method="get" action="nachricht-gesendet.html"')
    (Z / f.name).write_text(t)
print(sorted(p.name for p in Z.glob('*.html')))

# ---------- Artifact-Anpassungen ----------
for f in Z.glob('*.html'):
    t = f.read_text()
    t = t.replace('href="index.html', 'href="start.html')
    t = re.sub(r'action="https://www\.norvak\.example/catalogsearch/result/"', 'action="produkte.html"', t)
    (Z / f.name).write_text(t)
(Z / 'index.html').rename(Z / 'start.html')
t = (Z / 'start.html').read_text()
kopf = re.search(r'<head>(.*)</head>', t, re.S).group(1)
koerper = re.search(r'<body[^>]*>(.*)</body>', t, re.S).group(1)
kopf = re.sub(r'<meta charset[^>]*>\s*|<meta name="viewport"[^>]*>\s*', '', kopf)
kopf = re.sub(r'<title>[^<]*</title>', '<title>NORVAK Präzisionswerkzeuge</title>', kopf)
(Z / 'norvak.html').write_text(kopf + '\n' + koerper)
print('Hauptseite norvak.html, Dateien:', sum(1 for _ in Z.rglob('*') if _.is_file()))
