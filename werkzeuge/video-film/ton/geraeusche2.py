# Geräuschspur Runde 2 (13.10.2026): jedes Ereignisgeräusch liegt mit seinem LAUTESTEN PUNKT genau auf dem Bildereignis.
# Ereignisframes aus src/nachtfahrt/zeitleiste2.json (ton/zeitleiste2.py). Der Peak wird am fertig bearbeiteten Clip
# (Tonhöhe, Zuschnitt) selbst gemessen (Betrag, 2 ms geglättet), nicht aus messung.json übernommen.
# Teppiche (*-lang-*) blenden weich ein und aus. Pegel relativ zur Stimme (-16 LUFS).
# Aufruf im Ordner scratchpad/video: python3 <repo>/ton/geraeusche2.py  → mix2/sfx.wav, mix2/sfx-plan.json
import json, os, subprocess, numpy as np
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
Z = json.load(open(os.path.join(REPO, 'src/nachtfahrt/zeitleiste2.json')))
EV, DAUER = Z['ereignisse'], Z['dauer'] / 60
M = {x['datei']: x for x in json.load(open('sfx/messung.json'))}
SR, V = 48000, -16.0
os.makedirs('mix2', exist_ok=True)

# (Ereignis, Datei, Pegel rel. Stimme dB, Tonhöhe Halbtöne, max. Dauer s)
EREIGNIS = [
    ('zuenden', '01-glut-4.mp3', -17, 0, None), ('kursrose', '01-glut-1.mp3', -14, 0, None),
    ('kartenriss', '02-karte-1.mp3', -9, 0, None), ('kartenriss', '02-karte-3.mp3', -16, -2, None),
    ('landung', '04-holz-3.mp3', -23, 0, None),
    ('glanz_handy', '06a-messing-1.mp3', -19, -2, None), ('glanz_aufgebaut', '06a-messing-2.mp3', -19, 0, None), ('glanz_google', '06a-messing-3.mp3', -20, 2, None),
    ('etappe1', '07-leuchtfeuer-1.mp3', -19, 0, None), ('etappe2', '07-leuchtfeuer-4.mp3', -20, 0, None),
    ('etappe3', '07-leuchtfeuer-1.mp3', -19, 2, None), ('etappe4', '07-leuchtfeuer-4.mp3', -19, 3, None),
    ('blatt', '08-seite-2.mp3', -15, 0, None),
    ('reiter_norvak', '08-seite-1.mp3', -15, 0, None), ('reiter_glut', '08-seite-3.mp3', -15, 0, None), ('reiter_laut', '08-seite-1.mp3', -15, 2, None),
    ('nadel_steht', '09-kompass-4.mp3', -15, 0, None),
    ('haken1', '06b-stempel-1.mp3', -19, 3, None), ('haken2', '06b-stempel-2.mp3', -19, 3, None),
    ('haken3', '06b-stempel-1.mp3', -19, 5, None), ('haken4', '06b-stempel-2.mp3', -18, 5, None),
    ('glocke', '11-glocke-3.mp3', -15, 0, None),
    ('stempel1', '06b-stempel-3.mp3', -11, 0, None), ('stempel2', '06b-stempel-3.mp3', -11, -2, None), ('stempel3', '06b-stempel-3.mp3', -10, -4, None),
    ('liste1', '06a-messing-4.mp3', -25, 0, 1.2), ('liste2', '06a-messing-4.mp3', -25, 2, 1.2), ('liste3', '06a-messing-4.mp3', -25, 4, 1.2),
    ('liste4', '06a-messing-4.mp3', -25, 5, 1.2), ('liste5', '06a-messing-4.mp3', -24, 7, 1.6),
    ('partner', '07-leuchtfeuer-2.mp3', -21, 0, 3.0),
    ('ring_zu', '07-leuchtfeuer-3.mp3', -17, 0, 2.5),
]
s = lambda k: (Z['T'][k] if isinstance(Z['T'][k], (int, float)) else Z['T'][k][0]) / 60
# Teppiche: (Datei, Pegel, von s, bis s, Einblenden, Ausblenden)
TEPPICH = [
    ('kajuete-lang-1.mp3', -27, s('seekarteEnde') - 1.2, DAUER, 1.5, 1.2),
    ('wellen-lang-3.mp3', -26, s('seekarteEnde') - 0.6, s('blende6') + 0.4, 2.0, 0.9),
    ('meer-lang-3.mp3', -20, s('blende6') - 0.2, s('merksatzAus') + 0.2, 0.8, 1.2),
    ('hafen-lang-1.mp3', -23, s('merksatzAus') - 0.3, DAUER, 1.5, 1.2),
]

def lade(datei, ton=0, ab=0.0, bis=None):
    af = f'aresample={SR},aformat=channel_layouts=stereo'
    if ton: r = 2 ** (ton / 12); af += f',asetrate={SR * r:.0f},aresample={SR},atempo={1 / r:.5f}'
    af += f',atrim=start={ab:.4f}' + (f':end={bis:.4f}' if bis else '')
    roh = subprocess.run(['ffmpeg', '-v', 'error', '-i', 'sfx/' + datei, '-af', af, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(roh, np.float32).reshape(-1, 2).astype(np.float64)

def peak(x):  # Index des lautesten Punkts (Betrag, 2 ms geglättet)
    a = np.abs(x).max(1); k = int(0.002 * SR)
    return int(np.argmax(np.convolve(a, np.ones(k) / k, 'same')))

N = int(round(DAUER * SR)); spur = np.zeros((N, 2)); plan = []
for name, datei, rel, ton, dmax in EREIGNIS:
    m = M[datei]; x = lade(datei, ton, m.get('stille_anfang_s') or 0, None)
    if dmax: x = x[:int(dmax * SR)]
    n = len(x); x[-int(0.03 * SR):] *= np.linspace(1, 0, int(0.03 * SR))[:, None]  # Ende weich
    g = 10 ** (max(-20, min(32, (V + rel) - m['lufs'])) / 20)
    p = peak(x); t_ev = EV[name] / 60; start = int(round(t_ev * SR)) - p
    a0 = max(0, start); spur[a0:start + n] += g * x[a0 - start:min(n, N - start)]
    plan.append({'ereignis': name, 'frame': EV[name], 'datei': datei, 'ton': ton, 'peak_clip_s': round(p / SR, 4), 'einsatz_s': round(start / SR, 4), 'gain_db': round(20 * np.log10(g), 1)})
ereignisse = spur.copy()  # nur Ereignisgeräusche (für die Synchronprüfung)
for datei, rel, von, bis, fi, fo in TEPPICH:
    m = M[datei]; x = lade(datei); d = int((bis - von) * SR)
    x = np.tile(x, (d // len(x) + 1, 1))[:d]  # Schleife (Dateien sind schleifenfest gemessen)
    hk = np.ones(d); a, b = int(fi * SR), int(fo * SR)
    hk[:a] = np.sin(np.linspace(0, np.pi / 2, a)) ** 2; hk[-b:] = np.cos(np.linspace(0, np.pi / 2, b)) ** 2
    g = 10 ** (((V + rel) - m['lufs']) / 20); i0 = int(von * SR)
    spur[i0:i0 + d] += g * x * hk[:, None]
    plan.append({'teppich': datei, 'von_s': round(von, 2), 'bis_s': round(bis, 2)})
# Sicherheitsbegrenzung ohne Pumpen: nur falls nötig linear absenken
mx = np.abs(spur).max()
if mx > 0.7: spur *= 0.7 / mx
for x, ziel in ((spur, 'mix2/sfx.wav'), (ereignisse * min(1, 0.7 / mx), 'mix2/sfx-ereignisse.wav')):
    pcm = (np.clip(x, -1, 1) * 32767).astype('<i2').tobytes()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', '-', ziel], input=pcm, check=True)
json.dump({'skalierung': round(min(1, 0.7 / mx), 3), 'plan': plan}, open('mix2/sfx-plan.json', 'w'), ensure_ascii=False, indent=1)
print('ok, Spitze', round(mx, 3))
