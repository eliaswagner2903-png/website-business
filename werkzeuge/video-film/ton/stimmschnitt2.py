# Sprecherschnitt Runde 2 (13.10.2026): Take C „Rauchiger Kapitän“ (eleven_v3), Pausen gestrafft, Sprache nie
# beschleunigt. Regie: 06-dramaturgie.md §7. Aufruf im Ordner scratchpad/video:  python3 <repo>/ton/stimmschnitt2.py
# Ausgabe: stimme2-final/stimme.wav (48 kHz mono, -16 LUFS, leichter Kajütenhall), woerter.json (Filmzeit), schnitt.json
import json, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from wortbeginn import wortbeginne

QUELLE = 'stimme2/take-C.mp3'
ROH = [w for w in json.load(open('stimme2/take-C.words.json'))['words'] if not (w['text'].startswith('[') or w['text'].endswith(']'))]
W, P, _, _ = wortbeginne(QUELLE, ROH)
os.makedirs('stimme2-final', exist_ok=True)

ERST = 0.80  # Filmzeit des ersten Worts (Glutpunkt zündet vorher, Seekarte)
# Neue Pause (s) vom Sprechende des vorigen Worts bis zum Wortbeginn; Schlüssel = Wortbeginn im Take (s, gerundet).
# Was nicht hier steht, bleibt wie gesprochen. Begründung je Zeile in 06-dramaturgie.md §7.
PAUSE = {
    2.470: 0.75,   # Kurs. // Dann – Spannung, Glutlinie steht
    4.710: 1.05,   # Fahrt! // Ihre – Karte reißt, Kajüte fliegt ins Fenster
    10.495: 0.42,  # Restaurants. / Schnell
    17.525: 0.55,  # lesbar. / Sie
    20.275: 0.50,  # Betrieb. / Ich (Atem entfällt)
    23.185: 0.42,  # prüfe. / Uhrmacherei
    24.505: 0.36,  # Uhrmacherei. / Präzisionswerkzeuge (Reitertakt)
    26.260: 0.32,  # Präzisionswerkzeuge. / Restaurant
    28.960: 0.55,  # Studio. / Vier
    32.995: 0.62,  # Idee. // Keine – Wechsel auf den Kompass
    37.075: 0.42,  # besteht: / Tempo
    42.165: 0.62,  # Sicherheit. // Gebaut
    45.795: 0.62,  # Gepflegt. // Und nach dem Start?
    47.925: (0.12, 47.38),  # Start? (Atem) Gehe – rhetorische Pause mit hörbarem Atem
    49.855: 0.38,  # Bord. / Hosting
    55.910: 0.45,  # mehr. / Kein
    58.885: 0.60,  # endet. // Eine Partnerschaft
    62.060: 0.60,  # Reise. // Ihr Kurs – Schnitt in den Hafen
}
VOR, NACH = 0.035, 0.09  # Rand vor dem Wortbeginn / nach dem Sprechende (mit Blenden)

def sprechende(n):  # Beginn der ersten Pause nach Wortbeginn n
    s = W[n]['s']
    return min([a for (a, b) in P if a > s + 0.05] or [W[n]['end']])

# Schnittpunkte: an jedem Wort mit Eintrag in PAUSE wird geteilt
teil = [n for n, w in enumerate(W) if round(w['s'], 3) in PAUSE]
segs, t = [], ERST - VOR
anf = W[0]['s'] - VOR
for k, n in enumerate(teil + [None]):
    ende = sprechende(n - 1) + NACH if n is not None else W[-1]['e'] + 0.45
    segs.append({'von': round(anf, 3), 'bis': round(ende, 3), 'film': round(t, 3)})
    t += ende - anf
    if n is None: break
    p = PAUSE[round(W[n]['s'], 3)]
    gap, b_anf = (p if isinstance(p, tuple) else (p, None))
    b0 = (b_anf if b_anf else W[n]['s']) - VOR
    # Pause gemessen vom Sprechende (ohne NACH) bis zum Beginn des nächsten Teils (+VOR)
    t = max(t, t + gap - NACH - VOR)  # nie überlappen
    if b_anf: segs[-1]['atem_danach'] = True
    anf = b0

def film(x):  # Takezeit → Filmzeit
    for s in segs:
        if s['von'] - 1e-6 <= x <= s['bis'] + 1e-6: return x - s['von'] + s['film']
    raise ValueError(x)

LAENGE = 60.0
parts, nxt = [], 0.0
for i, s in enumerate(segs):
    if s['film'] > nxt + 1e-4: parts.append(f'anullsrc=r=48000:cl=mono,atrim=0:{s["film"] - nxt:.4f}[p{len(parts)}]')
    d = s['bis'] - s['von']
    parts.append(f'[0:a]aresample=48000,pan=mono|c0=c0,atrim={s["von"]:.4f}:{s["bis"]:.4f},asetpts=PTS-STARTPTS,'
                 f'afade=t=in:d=0.015,afade=t=out:st={d - 0.06:.4f}:d=0.06[p{len(parts)}]')
    nxt = s['film'] + d
parts.append(f'anullsrc=r=48000:cl=mono,atrim=0:{LAENGE - nxt:.4f}[p{len(parts)}]')
fc = ';'.join(parts) + ';' + ''.join(f'[p{i}]' for i in range(len(parts))) + f'concat=n={len(parts)}:v=0:a=1,apad=whole_dur={LAENGE},atrim=0:{LAENGE}[o]'
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', QUELLE, '-filter_complex', fc, '-map', '[o]',
                '-c:a', 'pcm_s24le', 'stimme2-final/stimme-trocken.wav'], check=True)
# Kajütenhall wie Runde 1, dann linear auf -16 LUFS (zweiter Durchgang, kein Pumpen)
hall = 'aecho=0.8:0.5:28|47:0.10|0.06'
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', 'stimme2-final/stimme-trocken.wav', '-af', hall + ',loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json',
                    '-f', 'null', '-'], capture_output=True, text=True).stderr
j = json.loads(r[r.rfind('{'):r.rfind('}') + 1])
ln = (f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:"
      f"measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', 'stimme2-final/stimme-trocken.wav', '-af', hall + ',' + ln + ',aresample=48000',
                '-ar', '48000', '-c:a', 'pcm_s16le', 'stimme2-final/stimme.wav'], check=True)

# Wortzeiten in Filmzeit, Format wie public/nachtfahrt/woerter.json ({z, w, s, e})
ZEILEN = [('L1', 'Erst'), ('L2', 'Ihre'), ('L3', 'Schnell'), ('L4', 'Sie'), ('L5', 'Uhrmacherei.'), ('L6', 'Keine'),
          ('L7', 'Gebaut.'), ('L8', 'Und'), ('L9', 'Ihr')]
out, z, zi = [], None, 0
for n, w in enumerate(W):
    if zi < len(ZEILEN) and w['text'] == ZEILEN[zi][1]: z = ZEILEN[zi][0]; zi += 1
    e = min(w['e'], sprechende(n) if n + 1 < len(W) else w['e'])
    out.append({'z': z, 'w': w['text'], 's': round(film(w['s']), 3), 'e': round(film(min(e, w['e'])), 3)})
json.dump(out, open('stimme2-final/woerter.json', 'w'), ensure_ascii=False, indent=0)
json.dump({'laenge': LAENGE, 'quelle': QUELLE, 'erst': ERST, 'segmente': segs}, open('stimme2-final/schnitt.json', 'w'), ensure_ascii=False, indent=1)
for zz in [x[0] for x in ZEILEN]:
    ws = [o for o in out if o['z'] == zz]
    print(zz, f"{ws[0]['s']:6.2f}-{ws[-1]['e']:6.2f}", ' '.join(f"{o['w']}@{o['s']:.2f}" for o in ws))
