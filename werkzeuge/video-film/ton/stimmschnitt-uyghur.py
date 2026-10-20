# Sprecherschnitt Werbefilm Uyghur Haus (20.10.2026, A-118): Take C „Gastgeber A“ (eleven_v3), Pausen gestrafft,
# Sprache nie beschleunigt. Aufruf im Ordner vertrieb/uyghur-haus/video:  python3 <repo>/ton/stimmschnitt-uyghur.py
# Eingang: stimme/take-c.mp3 + stimme/take-c.blind.words.json (Scribe ohne Skriptvorgabe = echte Erkennung)
# Ausgabe: stimme-final/stimme.wav (48 kHz mono, -16 LUFS, leichter Raumklang), woerter.json (Filmzeit), schnitt.json
import json, os, subprocess, sys, tempfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from wortbeginn import huelle, pausen

QUELLE = 'stimme/take-c.mp3'
ASR = [w for w in json.load(open('stimme/take-c.blind.words.json'))['words'] if w.get('type') == 'word']

# Untertitel = gesprochene Wörter in Schreibweise der Seite (Skript ohne Audio-Tags)
SKRIPT = ('Schon mal uigurisch gegessen? Dann wird es Zeit. Willkommen im Uyghur Haus. '
          'Unsere Küche kommt von der alten Seidenstraße. Und das schmeckt man: Kreuzkümmel, Chili, Lamm und Rind. '
          'Laghmen, heiß aus der Pfanne. Polo mit Karotten und Rosinen. Manta, gefüllte Teigtaschen. Und Kawap vom Spieß. '
          'Unsere ganze Karte finden Sie online: über zwanzig Gerichte, mit Allergenen und unseren Empfehlungen. '
          'Bei uns wird gern geteilt. Die großen Gerichte reichen für zwei bis drei. Und dazu eine Kanne Tee für den ganzen Tisch. '
          'Ihren Tisch reservieren Sie direkt hier: Tag, Uhrzeit, Personen. Wir melden uns zur Bestätigung. '
          'Würzig. Warm. Willkommen. Uyghur Haus. Lange Straße 30, Göppingen. Täglich ab halb zwölf. Wir freuen uns auf Sie.').split()

# Erkennung „Uigur-Haus“ = zwei Untertitelwörter; Teilung bei 55 % der Wortdauer (Wortbeginn „Haus“ s. unten)
roh = []
for w in ASR:
    if w['text'].startswith('Uigur-Haus'):
        d = w['end'] - w['start']
        roh += [{**w, 'text': 'Uigur', 'end': w['start'] + d * .55}, {**w, 'text': 'Haus', 'start': w['start'] + d * .55}]
    else: roh.append(w)
assert len(roh) == len(SKRIPT), (len(roh), len(SKRIPT))

# Wortbeginn: nach echter Pause (< -48 dB ≥ 80 ms) das Pausenende, sonst Erkennungsbeginn − 0,02 s.
# (Geprüft an der Hüllkurve: die Erkennung ohne Skript liegt hier genauer als die 8-dB-Anstiege aus wortbeginn.py,
# z. B. „Göppingen“ 54,72 statt 54,43, „eine“ 37,30 statt 37,01.)
db, hop = huelle(QUELLE)
P = pausen(db, hop)
nach_pause = {}  # jede Pause gehört dem ersten Wort, dessen Erkennung nach ihrem Beginn liegt
for (a, b) in P:
    n = next((n for n, w in enumerate(roh) if w['start'] > a - 0.15), None)
    if n is not None and abs(b - roh[n]['start']) < 0.25: nach_pause[n] = b
W, vor = [], -1.0
for n, w in enumerate(roh):
    s = max(nach_pause.get(n, w['start'] - 0.02), vor + 0.06)
    W.append({'text': SKRIPT[n], 's': s}); vor = s
for n, w in enumerate(W):
    nxt = W[n + 1]['s'] if n + 1 < len(W) else roh[-1]['end'] + 0.05
    p = [a for (a, b) in P if w['s'] + 0.05 < a < nxt]
    w['e'] = min(p) if p else nxt - 0.01
os.makedirs('stimme-final', exist_ok=True)

ERST = 0.90  # Filmzeit des ersten Worts (vorher zündet die Gasflamme)
# Neue Pause (s) vom Sprechende des vorigen Worts bis zum Wortbeginn; Schlüssel = Wortindex.
# Was nicht hier steht, bleibt wie gesprochen (Aufzählungen, Reservierungsschritte, Merksatz).
PAUSE = {
    4: 1.15,    # gegessen? // Dann – Wok zischt, Haken der Frage wirkt nach
    12: 0.70,   # Uyghur Haus. // Unsere Küche
    19: 0.60,   # Seidenstraße. / Und das schmeckt man
    28: 0.65,   # Rind. // Laghmen – Wechsel zu den Gerichten
    33: 0.45,   # Pfanne. / Polo
    38: 0.50,   # Rosinen. / Manta
    45: 0.75,   # Spieß. // Unsere ganze Karte – Blatt zur Speisekarte
    59: 0.70,   # Empfehlungen. // Bei uns
    64: 0.50,   # geteilt. / Die großen
    81: 0.75,   # Tisch. // Ihren Tisch – Schnitt zur Reservierung
    90: 0.55,   # Personen. / Wir melden uns
    97: 0.95,   # Warm. / Willkommen (Merksatz bleibt getragen)
    98: 0.90,   # Willkommen. // Uyghur Haus – Schlussbild
    100: 0.55,  # Haus. / Lange Straße
    104: 0.60,  # Göppingen. / Täglich
    108: 0.90,  # zwölf. // Wir freuen uns auf Sie (leiser, persönlich)
}
VOR, NACH = 0.035, 0.09
LAENGE = 60.0

def sprechende(n):  # Beginn der ersten Pause nach Wortbeginn n
    return min([a for (a, b) in P if a > W[n]['s'] + 0.05] or [W[n]['e']])

segs, t = [], ERST - VOR
anf = W[0]['s'] - VOR
teil = sorted(PAUSE)
for k, n in enumerate(teil + [None]):
    ende = sprechende(n - 1) + NACH if n is not None else W[-1]['e'] + 0.45
    segs.append({'von': round(anf, 3), 'bis': round(ende, 3), 'film': round(t, 3)})
    t += ende - anf
    if n is None: break
    t += PAUSE[n] - NACH - VOR
    anf = W[n]['s'] - VOR

def film(x):  # Takezeit → Filmzeit
    for s in segs:
        if s['von'] - 1e-6 <= x <= s['bis'] + 1e-6: return x - s['von'] + s['film']
    raise ValueError(x)

parts, nxt = [], 0.0
for s in segs:
    if s['film'] > nxt + 1e-4: parts.append(f'anullsrc=r=48000:cl=mono,atrim=0:{s["film"] - nxt:.4f}[p{len(parts)}]')
    d = s['bis'] - s['von']
    parts.append(f'[0:a]aresample=48000,pan=mono|c0=c0,atrim={s["von"]:.4f}:{s["bis"]:.4f},asetpts=PTS-STARTPTS,'
                 f'afade=t=in:d=0.015,afade=t=out:st={d - 0.06:.4f}:d=0.06[p{len(parts)}]')
    nxt = s['film'] + d
parts.append(f'anullsrc=r=48000:cl=mono,atrim=0:{LAENGE - nxt:.4f}[p{len(parts)}]')
fc = ';'.join(parts) + ';' + ''.join(f'[p{i}]' for i in range(len(parts))) + f'concat=n={len(parts)}:v=0:a=1,apad=whole_dur={LAENGE},atrim=0:{LAENGE}[o]'
trocken = os.path.join(tempfile.mkdtemp(), 'stimme-trocken.wav')
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', QUELLE, '-filter_complex', fc, '-map', '[o]',
                '-c:a', 'pcm_s24le', trocken], check=True)
# Kleiner warmer Gastraum statt Kajüte: kurze frühe Reflexionen, sehr leise; dann linear auf -16 LUFS
hall = 'aecho=0.8:0.45:23|41:0.08|0.05'
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', trocken, '-af', hall + ',loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json',
                    '-f', 'null', '-'], capture_output=True, text=True).stderr
j = json.loads(r[r.rfind('{'):r.rfind('}') + 1])
ln = (f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:"
      f"measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', trocken, '-af', hall + ',' + ln + ',aresample=48000',
                '-ar', '48000', '-c:a', 'pcm_s16le', 'stimme-final/stimme.wav'], check=True)
os.remove(trocken)

ZEILEN = [('L1', 0), ('L2', 4), ('L3', 12), ('L4', 28), ('L5', 45), ('L6', 59), ('L7', 81), ('L8', 95), ('L9', 98)]
out, zi, z = [], 0, None
for n, w in enumerate(W):
    if zi < len(ZEILEN) and n == ZEILEN[zi][1]: z = ZEILEN[zi][0]; zi += 1
    e = min(w['e'], sprechende(n) if n + 1 < len(W) else w['e'])
    out.append({'z': z, 'w': w['text'], 's': round(film(w['s']), 3), 'e': round(film(e), 3)})
json.dump(out, open('stimme-final/woerter.json', 'w'), ensure_ascii=False, indent=0)
json.dump({'laenge': LAENGE, 'quelle': QUELLE, 'erst': ERST, 'segmente': segs}, open('stimme-final/schnitt.json', 'w'), ensure_ascii=False, indent=1)
for zz in [x[0] for x in ZEILEN]:
    ws = [o for o in out if o['z'] == zz]
    print(zz, f"{ws[0]['s']:6.2f}-{ws[-1]['e']:6.2f}", ' '.join(f"{o['w']}@{o['s']:.2f}" for o in ws))
