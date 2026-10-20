# Bewegung je Aufnahmebild (Uyghur Haus, A-118): mittlere absolute Helligkeitsänderung zum Vorbild (Graustufen, 1/4 Größe).
# Grundlage der „elastischen Halte“ in ton/zeitleiste-uyghur.py: Bilder ohne Bewegung dürfen verlängert oder ausgelassen
# werden, bewegte Bilder laufen 1:1. Aufruf: python3 aufnahme/bewegung.py public/uyghur/*.mp4 → src/uyghur/bewegung.json
import json, os, subprocess, sys, numpy as np
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
aus = {}
for pfad in sys.argv[1:]:
    w, h = map(int, subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', pfad],
                                   capture_output=True, text=True).stdout.strip().split(','))
    w4, h4 = w // 4, h // 4
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', pfad, '-vf', f'scale={w4}:{h4}:flags=area', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], stdout=subprocess.PIPE)
    vor, d = None, []
    while True:
        b = p.stdout.read(w4 * h4)
        if len(b) < w4 * h4: break
        x = np.frombuffer(b, np.uint8).astype(np.int16)
        d.append(0.0 if vor is None else round(float(np.abs(x - vor).mean()), 3)); vor = x
    aus[os.path.basename(pfad)[:-4]] = d
    print(os.path.basename(pfad), len(d), 'Bilder, bewegt (>0,15):', sum(v > 0.15 for v in d))
json.dump(aus, open(os.path.join(REPO, 'src/uyghur/bewegung.json'), 'w'), separators=(',', ':'))
