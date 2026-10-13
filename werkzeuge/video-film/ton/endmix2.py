# Endmischung Runde 2 nach 06-dramaturgie.md §7.4: Musik je Abschnitt gepegelt, Akzente frei (Fahrt!, Merksatz,
# Partnerschaft, Gespräch), leise unter der Prüfzeile; Ducking per Sidechain aus der Stimme (wie endmix.py),
# EQ-Senke 2–4 kHz in der Musik, Ziel -14 LUFS / -1 dBTP (Zwei-Pass, linear).
# Musik: ElevenLabs Music v2.5, Take A (96 BPM, 2 Takte = 5,0 s). Schnitt auf Schlägen (gemessene Einsätze):
#  Film 0–55,94 s = Musik ab 2,19 s: Anschwellen 5,52 liegt auf „Fahrt!“ (3,33), Musikpause 42,6–44,9 fällt auf
#  „… Gepflegt. / Und nach dem Start?“, Wiedereinsatz 45,64 auf „Gehe ich nicht von Bord“ (43,45), Akzent 55,5 auf
#  „(Eine) Partnerschaft“ (53,3). Dann Sprung über genau zwei Takte (58,13 → 63,13, beides Schlageinsätze), damit
#  der Schlussschlag 65,04 auf den Knopf „Gespräch“ (57,85) fällt und der echte Ausklang das Filmende trägt.
# Aufruf im Ordner scratchpad/video: python3 <repo>/ton/endmix2.py musik2/musik2-A.mp3  → mix2/ton.wav
import json, os, subprocess, sys
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
Z = json.load(open(os.path.join(REPO, 'src/nachtfahrt/zeitleiste2.json')))
MUSIK = sys.argv[1]
SCHNITT = [(2.19, 58.13), (63.13, 79.8)]  # (von, bis) in Sekunden der Musikdatei, aneinandergesetzt
XF = 0.04
T = Z['dauer'] / 60
s = lambda k, i=0: (Z['T'][k] if isinstance(Z['T'][k], (int, float)) else Z['T'][k][i]) / 60
fa = Z['seekarte']['fahrt'] / 60
# Stützpunkte (s, dB relativ zur Grundlautheit -28 LUFS)
P = [(0, -8), (fa - 0.4, -7), (fa, +1), (fa + 1.6, 0), (s('blende6', 0), 0), (s('blende6', 1), -6), (s('fensterAus', 0), -6),
     (s('merk', 0) - 0.3, +1), (s('merksatzAus', 1), +1), (s('merksatzAus', 1) + 0.6, -1), (s('partner') - 0.3, -1), (s('partner'), +1),
     (s('knopfEin', 1) - 0.4, +1), (s('knopfEin', 1), +3), (T, +3)]
def expr():
    e = f'{P[-1][1]}'
    for (t0, g0), (t1, g1) in reversed(list(zip(P, P[1:]))):
        e = f'if(lt(t,{t1:.3f}),{g0}+({g1}-({g0}))*(t-{t0:.3f})/{max(1e-3, t1 - t0):.3f},{e})'
    return f'pow(10,({e})/20)'
os.makedirs('mix2', exist_ok=True)
teile = ';'.join(f'[0:a]aresample=48000,atrim={a - (XF / 2 if k else 0):.4f}:{b + XF / 2:.4f},asetpts=PTS-STARTPTS[m{k}]' for k, (a, b) in enumerate(SCHNITT))
kette = '[m0]' + ''.join(f'[m{k}]acrossfade=d={XF}:c1=qsin:c2=qsin' + (f'[x{k}];[x{k}]' if k < len(SCHNITT) - 1 else '[geschnitten]') for k in range(1, len(SCHNITT)))
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', MUSIK, '-filter_complex', teile + ';' + kette, '-map', '[geschnitten]',
                '-ar', '48000', '-c:a', 'pcm_s24le', 'mix2/musik-schnitt.wav'], check=True)
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', 'mix2/musik-schnitt.wav', '-af', 'loudnorm=I=-28:TP=-6:LRA=11,aresample=48000',
                '-ar', '48000', 'mix2/musik-norm.wav'], check=True)
fc = (
    f"[1:a]aformat=channel_layouts=stereo,atrim=0:{T},asetpts=PTS-STARTPTS,highpass=f=50,equalizer=f=3000:t=q:w=1:g=-3,"
    f"volume='{expr()}':eval=frame,apad=whole_dur={T}[mus];"
    f"[0:a]aformat=channel_layouts=stereo,atrim=0:{T},apad=whole_dur={T},asplit=2[v][vsc];"
    f"[mus][vsc]sidechaincompress=threshold=0.03:ratio=5:attack=20:release=350:makeup=1[musd];"
    f"[2:a]aformat=channel_layouts=stereo,apad=whole_dur={T}[sfx];"
    f"[v][musd][sfx]amix=inputs=3:normalize=0,atrim=0:{T},afade=t=out:st={T - 0.6}:d=0.6[mix]"
)
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', 'stimme2-final/stimme.wav', '-i', 'mix2/musik-norm.wav', '-i', 'mix2/sfx.wav',
                '-filter_complex', fc, '-map', '[mix]', '-ar', '48000', '-c:a', 'pcm_s24le', 'mix2/roh.wav'], check=True)
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', 'mix2/roh.wav', '-af', 'loudnorm=I=-14:TP=-1.0:LRA=11:print_format=json', '-f', 'null', '-'],
                   capture_output=True, text=True).stderr
j = json.loads(r[r.rfind('{'):r.rfind('}') + 1])
af = (f"loudnorm=I=-14:TP=-1.0:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:"
      f"measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', 'mix2/roh.wav', '-af', af + ',aresample=48000', '-ar', '48000', '-c:a', 'pcm_s16le', 'mix2/ton.wav'], check=True)
r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', 'mix2/ton.wav', '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
print('\n'.join(l for l in r.splitlines()[-14:] if any(k in l for k in ('I:', 'LRA:', 'Peak:'))))
