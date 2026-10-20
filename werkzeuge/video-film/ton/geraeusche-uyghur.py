# Geräuschspur Werbefilm UYGHUR HAUS (20.10.2026, A-118), Methode wie geraeusche2.py („Nachtfahrt“):
# jedes Ereignisgeräusch liegt mit seinem LAUTESTEN PUNKT genau auf dem Bildereignis (Peak am fertig bearbeiteten
# Ausschnitt gemessen). Flächige Geräusche ohne Spitze (Rieseln, Flammenrauschen, Zischen) setzen stattdessen mit
# ihrem Anfang kurz vor dem Ereignis ein. Ereignisframes aus src/uyghur/zeitleiste.json – beide Formate teilen eine
# Tonspur; „route“ gibt es nur im Computerfilm und bleibt deshalb stumm.
# Zündung: aus 01-zuenden-1 zwei Stücke, Zündklick (0,05 s) und das Fangen der Flamme (Spitze 1,25 s); im Film
# Klick vor der Flamme, Fauchen auf dem Aufflammen (Ton zuerst – Haken).
# Aufruf im Ordner vertrieb/uyghur-haus/video:  python3 <repo>/ton/geraeusche-uyghur.py <ausgabeordner>
#  → <aus>/sfx.wav, <aus>/sfx-ereignisse.wav (nur Ereignisse, für die Synchronprüfung), <aus>/sfx-plan.json
import json, os, subprocess, sys, numpy as np
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
Z = json.load(open(os.path.join(REPO, 'src/uyghur/zeitleiste.json')))
EV, DAUER = Z['formate']['P']['ereignisse'], Z['dauer'] / 60
W = json.load(open('stimme-final/woerter.json'))
FUNDUS = '/mnt/project-files/seitenkapitaen/video/sfx'  # Holz, Papier, Messing aus dem Seitenkapitän-Film
M = {x['datei']: x for x in json.load(open(os.path.join(FUNDUS, 'messung.json')))}
M.update({x['datei']: x for x in json.load(open('sfx/messung.json'))})
pfad = lambda d: 'sfx/' + d if os.path.exists('sfx/' + d) else os.path.join(FUNDUS, d)
AUS = sys.argv[1] if len(sys.argv) > 1 else 'mix'
SR, V = 48000, -16.0  # Stimme -16 LUFS
os.makedirs(AUS, exist_ok=True)
wort = lambda t, n=0: [w for w in W if w['w'] == t][n]

# (Name, Zeitpunkt s, Datei, Pegel rel. Stimme dB, Halbtöne, Ausschnitt (von, bis) s, Anker)
# Anker 'peak' = lautester Punkt auf dem Zeitpunkt; Zahl = Ausschnitt beginnt so viele s vor dem Zeitpunkt.
f = lambda k: EV[k] / 60
EREIGNIS = [
    ('zuendklick', f('zuenden') - 0.17, '01-zuenden-1.mp3', -16, 0, (0.0, 0.22), 'peak'),
    ('zuenden', f('zuenden'), '01-zuenden-1.mp3', -11, 0, (1.12, 2.0), 'peak'),
    ('wurf', f('wurf'), '02-wurf-1.mp3', -10, 0, (0.2, 1.3), 'peak'),
    ('kuss', f('kuss'), '01-zuenden-2.mp3', -20, -2, (0.35, 1.5), 0.08),
    ('gewuerz1', f('gewuerz1'), '03-gewuerz-1.mp3', -22, 0, (0.08, 0.85), 0.04),
    ('gewuerz2', f('gewuerz2'), '03-gewuerz-2.mp3', -22, 0, (0.0, 0.75), 0.04),
    ('heiss', wort('heiß')['s'], 'brutzeln-lang-2.mp3', -20, 0, (2.0, 3.3), 0.06),
    ('karte1', f('karte1'), '04-holz-3.mp3', -24, 0, None, 'peak'), ('karte2', f('karte2'), '04-holz-3.mp3', -24, 2, None, 'peak'),
    ('karte3', f('karte3'), '04-holz-3.mp3', -24, 4, None, 'peak'), ('karte4', f('karte4'), '04-holz-3.mp3', -24, 5, None, 'peak'),
    ('klickKarte', f('klickKarte'), '04-holz-3.mp3', -20, -2, None, 'peak'),
    ('blattKarte', f('blattKarte'), '08-seite-2.mp3', -16, 0, None, 'peak'),
    ('filterAuf', f('filterAuf'), '04-holz-3.mp3', -23, 3, None, 'peak'), ('filterF', f('filterF'), '04-holz-3.mp3', -23, 5, None, 'peak'),
    ('empfehlung', f('empfehlung'), '06a-messing-4.mp3', -24, 0, (0, 1.2), 'peak'),
    ('portion', f('portion'), '06a-messing-4.mp3', -24, 2, (0, 1.2), 'peak'),
    ('chipGetraenke', f('chipGetraenke'), '04-holz-3.mp3', -23, 2, None, 'peak'),
    ('tee', f('tee'), '04-tee-1.mp3', -15, 0, (1.4, 2.4), 'peak'),
    ('blattRes', f('blattRes'), '08-seite-3.mp3', -16, 0, None, 'peak'),
    ('tag', f('tag'), '04-holz-3.mp3', -22, 0, None, 'peak'), ('uhrzeit', f('uhrzeit'), '04-holz-3.mp3', -22, 2, None, 'peak'),
    ('personen', f('personen'), '04-holz-3.mp3', -22, 4, None, 'peak'),
    ('danke', f('danke'), '06-glocke-1.mp3', -20, -2, None, 'peak'),
    ('merk1', f('merk1'), '05-dap-1.mp3', -11, 0, None, 'peak'), ('merk2', f('merk2'), '05-dap-1.mp3', -11, -2, None, 'peak'),
    ('merk3', f('merk3'), '05-dap-1.mp3', -9, -4, None, 'peak'),
    ('adresse', f('adresse'), '06a-messing-4.mp3', -25, 2, (0, 1.2), 'peak'),
    ('zeiten', f('zeiten'), '06a-messing-4.mp3', -25, 4, (0, 1.2), 'peak'),
    ('knopf', f('knopf'), '06-glocke-2.mp3', -17, 0, None, 'peak'),  # Türglocke auf „Wir freuen uns auf Sie“
]
# Teppiche: (Datei, Pegel, von s, bis s, Einblenden, Ausblenden)
TEPPICH = [
    ('brutzeln-lang-1.mp3', -20, f('zuenden') - 0.05, 6.8, 0.4, 1.4),        # Öl im Wok bis zur Startseite
    ('gastraum-lang-1.mp3', -26, Z['T']['blendeTeilen'][0] / 60 - 0.4, Z['T']['blendeRes'][1] / 60 + 0.3, 1.2, 1.2),  # Teilen, Tee
    ('gastraum-lang-2.mp3', -27, Z['T']['fensterBEin'][0] / 60, DAUER, 1.2, 1.8),  # Schlussbild
]

def lade(datei, ton=0, ab=0.0, bis=None):
    af = f'aresample={SR},aformat=channel_layouts=stereo,atrim=start={ab:.4f}' + (f':end={bis:.4f}' if bis else '') + ',asetpts=PTS-STARTPTS'
    if ton: r = 2 ** (ton / 12); af += f',asetrate={SR * r:.0f},aresample={SR},atempo={1 / r:.5f}'
    roh = subprocess.run(['ffmpeg', '-v', 'error', '-i', pfad(datei), '-af', af, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(roh, np.float32).reshape(-1, 2).astype(np.float64)

def peak(x):  # Index des lautesten Punkts (Betrag der Mono-Summe wie in synchronpruefung.py, 2 ms geglättet)
    a = np.abs(x.mean(1)); k = int(0.002 * SR)
    return int(np.argmax(np.convolve(a, np.ones(k) / k, 'same')))

def rampen(x, ein, aus):
    a, b = int(ein * SR), int(aus * SR)
    if a: x[:a] *= np.sin(np.linspace(0, np.pi / 2, a))[:, None] ** 2
    if b: x[-b:] *= np.cos(np.linspace(0, np.pi / 2, b))[:, None] ** 2
    return x

N = int(round(DAUER * SR)); spur = np.zeros((N, 2)); plan = []
for name, t_ev, datei, rel, ton, schnitt, anker in EREIGNIS:
    m = M[datei]; ab, bis = schnitt if schnitt else (m.get('stille_anfang_s') or 0, None)
    x = lade(datei, ton, ab, bis)
    flaechig = anker != 'peak'
    x = rampen(x, 0.06 if flaechig else 0.004, 0.25 if flaechig else 0.03)
    g = 10 ** (max(-20, min(32, (V + rel) - m['lufs'])) / 20)
    p = peak(x) if not flaechig else int(anker * SR)
    start = int(round(t_ev * SR)) - p; n = len(x)
    a0 = max(0, start); spur[a0:start + n] += g * x[a0 - start:min(n, N - start)]
    plan.append({'ereignis': name, 'zeit_s': round(t_ev, 4), 'datei': datei, 'ton': ton, 'anker': 'peak' if not flaechig else f'-{anker}s',
                 'peak_clip_s': round(p / SR, 4), 'einsatz_s': round(start / SR, 4), 'gain_db': round(20 * np.log10(g), 1)})
ereignisse = spur.copy()
for datei, rel, von, bis, fi, fo in TEPPICH:
    m = M[datei]; x = lade(datei); d = int((bis - von) * SR)
    x = rampen(np.tile(x, (d // len(x) + 1, 1))[:d].copy(), fi, fo)
    g = 10 ** (((V + rel) - m['lufs']) / 20); i0 = int(von * SR)
    spur[i0:i0 + d] += g * x[:N - i0]
    plan.append({'teppich': datei, 'von_s': round(von, 2), 'bis_s': round(bis, 2), 'gain_db': round(20 * np.log10(g), 1)})
mx = np.abs(spur).max(); k = min(1, 0.7 / mx)  # Sicherheitsbegrenzung ohne Pumpen: nur falls nötig linear absenken
for x, ziel in ((spur, 'sfx.wav'), (ereignisse, 'sfx-ereignisse.wav')):
    pcm = (np.clip(x * k, -1, 1) * 32767).astype('<i2').tobytes()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', '-', os.path.join(AUS, ziel)], input=pcm, check=True)
json.dump({'skalierung': round(k, 3), 'stumm': ['route'], 'plan': plan}, open(os.path.join(AUS, 'sfx-plan.json'), 'w'), ensure_ascii=False, indent=1)
print('ok, Spitze', round(mx, 3), 'Skalierung', round(k, 3))
