# Endmischung Werbefilm UYGHUR HAUS (20.10.2026, A-118), Methode wie endmix2.py („Nachtfahrt“): Musik zuletzt,
# geschnitten und gepegelt, per Sidechain aus der Stimme abgesenkt, EQ-Senke um 3 kHz, Ziel -14 LUFS / -1 dBTP
# (Zwei-Pass, linear).
# Musik: ElevenLabs Music, Take 1 (100 BPM). Aufnahme 0–4,83 s = Eröffnungsakkord mit Ausklang, ab 4,83 s Ensemble.
#  Teil A: Aufnahme ab 0 mit Versatz (zeitleiste.json → musik.versatz), damit das Ensemble auf „Willkommen“ einsetzt;
#          Einblenden 0,6–1,2 s (die Zündung gehört dem Anfang allein); Ausstieg 0,25 s auf „Würzig.“ (Merksatz nur
#          mit Stimme und Rahmentrommel).
#  Teil B: Wiedereinsatz mit dem Ensemble-Einsatz (Aufnahme 4,80 s) auf „Uyghur Haus“ im Schlussbild, Ausklang bis Filmende.
# Aufruf im Ordner vertrieb/uyghur-haus/video:  python3 <repo>/ton/endmix-uyghur.py <ausgabeordner>  (dort sfx.wav)
#  → <aus>/ton.wav (48 kHz, 16 bit, Stereo), <aus>/musik-schnitt.wav
import json, os, subprocess, sys, numpy as np
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
Z = json.load(open(os.path.join(REPO, 'src/uyghur/zeitleiste.json')))
MU = Z['musik']; T = Z['dauer'] / 60
AUS = sys.argv[1] if len(sys.argv) > 1 else 'mix'
SR = 48000
B_SRC = 4.80  # Wiedereinsatz: 30 ms vor dem Ensemble-Schlag der Aufnahme
B_FILM = MU['wieder'] - (MU['einsatz_src'] - B_SRC)

def lade(p):
    roh = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(roh, np.float32).reshape(-1, 2).astype(np.float64)

def lufs(p):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', p, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float([l for l in r.splitlines() if l.strip().startswith('I:')][-1].split()[1])

def schreibe(x, p, fmt='pcm_s24le'):
    roh = np.clip(x, -1, 1).astype('<f4').tobytes()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', fmt, p], input=roh, check=True)

def blende(n, t0, t1, auf):  # sin²-Blende als Gewichtskurve über die ganze Spur
    t = np.arange(n) / SR; u = np.clip((t - t0) / (t1 - t0), 0, 1); w = np.sin(u * np.pi / 2) ** 2
    return w if auf else 1 - w

os.makedirs(AUS, exist_ok=True)
m = lade('musik/take-1.mp3'); N = int(round(T * SR)); spur = np.zeros((N, 2))
# Teil A
a0 = int(round(MU['versatz'] * SR)); a_ende = int(round((MU['aus'] + 0.25) * SR))
nA = min(a_ende - a0, len(m)); a = m[:nA] * (blende(nA, 0.6 - MU['versatz'], 1.2 - MU['versatz'], True) * blende(nA, MU['aus'] - MU['versatz'], MU['aus'] - MU['versatz'] + 0.25, False))[:, None]
spur[a0:a0 + nA] += a
# Teil B
b0 = int(round(B_FILM * SR)); i0 = int(round(B_SRC * SR)); nB = N - b0
b = m[i0:i0 + nB].copy(); nB = len(b)
b *= (blende(nB, 0, 0.02, True) * blende(nB, MU['ausklang'][0] - B_FILM, MU['ausklang'][1] - B_FILM, False))[:, None]
spur[b0:b0 + nB] += b
schreibe(spur, os.path.join(AUS, 'musik-schnitt.wav'))
# Grundlautheit -27 LUFS (linear), Schlussbild +1 dB
g = 10 ** ((-27 - lufs(os.path.join(AUS, 'musik-schnitt.wav'))) / 20)
pegel = np.ones(N); pegel[b0:] = 10 ** (1 / 20)
schreibe(spur * g * pegel[:, None], os.path.join(AUS, 'musik-norm.wav'))

fc = (
    f"[1:a]aformat=channel_layouts=stereo,highpass=f=50,equalizer=f=3000:t=q:w=1:g=-3,apad=whole_dur={T}[mus];"
    f"[0:a]aformat=channel_layouts=stereo,atrim=0:{T},apad=whole_dur={T},asplit=2[v][vsc];"
    f"[mus][vsc]sidechaincompress=threshold=0.03:ratio=5:attack=20:release=350:makeup=1[musd];"
    f"[2:a]aformat=channel_layouts=stereo,apad=whole_dur={T}[sfx];"
    f"[v][musd][sfx]amix=inputs=3:normalize=0,atrim=0:{T},afade=t=out:st={T - 0.4}:d=0.4[mix]"
)
roh = os.path.join(AUS, 'roh.wav'); ton = os.path.join(AUS, 'ton.wav')
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', 'stimme-final/stimme.wav', '-i', os.path.join(AUS, 'musik-norm.wav'),
                '-i', os.path.join(AUS, 'sfx.wav'), '-filter_complex', fc, '-map', '[mix]', '-ar', str(SR), '-c:a', 'pcm_s24le', roh], check=True)
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', roh, '-af', 'loudnorm=I=-14:TP=-1.0:LRA=11:print_format=json', '-f', 'null', '-'],
                   capture_output=True, text=True).stderr
j = json.loads(r[r.rfind('{'):r.rfind('}') + 1])
af = (f"loudnorm=I=-14:TP=-1.0:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:"
      f"measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', roh, '-af', af + ',aresample=48000', '-ar', str(SR), '-c:a', 'pcm_s16le', ton], check=True)
os.remove(roh)
r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', ton, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
print('Musik Grundpegel', round(20 * np.log10(g), 1), 'dB; Teil B ab', round(B_FILM, 3), 's')
print('\n'.join(l for l in r.splitlines()[-14:] if any(k in l for k in ('I:', 'LRA:', 'Peak:'))))
