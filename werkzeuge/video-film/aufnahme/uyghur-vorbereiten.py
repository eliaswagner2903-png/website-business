# Bereitet den Werbefilm UYGHUR HAUS (A-118) vor: Schriften und Hintergrundtextur der Seite nach public/uyghur/
# (git-ignoriert) und die Wok-Zeichnung + Monogramm der Seite als Text nach src/uyghur/zeichnungen.ts (unverändert übernommen).
# Aufruf: python3 aufnahme/uyghur-vorbereiten.py <Seitenordner>   (z. B. /mnt/project-files/vertrieb/uyghur-haus/site)
import os, re, shutil, sys
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = sys.argv[1]
ziel = os.path.join(REPO, 'public/uyghur'); os.makedirs(os.path.join(ziel, 'schriften'), exist_ok=True)
for f in ('playfair-display-latin-600-normal.woff2', 'playfair-display-latin-ext-600-normal.woff2', 'playfair-display-latin-600-italic.woff2',
          'mulish-latin-400-normal.woff2', 'mulish-latin-700-normal.woff2', 'mulish-latin-ext-400-normal.woff2', 'mulish-latin-ext-700-normal.woff2',
          'pinyon-script-latin-400-normal.woff2'):
    shutil.copy(os.path.join(SITE, 'fonts', f), os.path.join(ziel, 'schriften', f))
shutil.copy(os.path.join(SITE, 'img/bg-hero.webp'), os.path.join(ziel, 'bg-hero.webp'))
html = open(os.path.join(SITE, 'index.html'), encoding='utf-8').read()
wok = re.search(r'<svg width="1200" height="900" class="wok-art".*?</svg>', html, re.S).group(0)
# Titel/Beschreibung (Barrierefreiheit der Seite) braucht der Film nicht; Größe übernimmt der Film
wok = re.sub(r'<title id="wk-t">.*?</title>\s*<desc id="wk-d">.*?</desc>\s*', '', wok, flags=re.S)
wok = wok.replace('<svg width="1200" height="900" class="wok-art"', '<svg class="wok-art" width="100%" height="100%"').replace(' role="img" aria-labelledby="wk-t wk-d"', '')
mono = re.search(r'<symbol id="monogram-u" viewBox="0 0 120 136">(.*?)</symbol>', html, re.S).group(1).strip()
raute = re.search(r'<symbol id="divider-diamond" viewBox="0 0 400 24">(.*?)</symbol>', html, re.S).group(1).strip()
js = lambda x: '`' + x.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${') + '`'
open(os.path.join(REPO, 'src/uyghur/zeichnungen.ts'), 'w', encoding='utf-8').write(
    '// Aus der Seite UYGHUR HAUS übernommen (index.html), erzeugt von aufnahme/uyghur-vorbereiten.py – nicht von Hand ändern.\n'
    f'export const WOK_SVG = {js(wok)};\n'
    f'/** Monogramm „U“ (viewBox 0 0 120 136) */\nexport const MONOGRAMM = {js(mono)};\n'
    f'/** Trenner mit Raute (viewBox 0 0 400 24) */\nexport const RAUTE = {js(raute)};\n')
print('ok', len(wok), 'Zeichen Wok')
