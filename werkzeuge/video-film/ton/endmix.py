# Endmischung nach 06-dramaturgie.md §4: Musik (Fassung 1) je Abschnitt gepegelt, Stille 31,3–36,4,
# Ducking per Sidechain aus der Stimme, EQ-Senke 2–4 kHz in der Musik, Ziel -14 LUFS / -1 dBTP.
import subprocess, json, sys
MUSIK = sys.argv[1] if len(sys.argv) > 1 else 'musik/musik-1.mp3'
T = 50.5
# Stützpunkte (Zeit s, Musikpegel dB relativ zur Grundlautheit -28 LUFS = 12 dB unter der Stimme)
P = [(0,-8),(3.4,-8),(6.4,0),(9.9,0),(11.6,-1),(22.8,-1),(23.3,+1),(30.6,+1),(31.25,-60),(36.35,-60),(36.6,-2),(39.6,-2),(40.4,0),(45.2,0),(45.8,+2),(T,+2)]
def expr():
    e = f'{P[-1][1]}'
    for (t0,g0),(t1,g1) in reversed(list(zip(P,P[1:]))):
        e = f'if(lt(t,{t1}),{g0}+({g1}-{g0})*(t-{t0})/{t1-t0},{e})'
    return f'pow(10,({e})/20)'
# Musik auf -28 LUFS normalisieren
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',MUSIK,'-af','loudnorm=I=-28:TP=-6:LRA=11,aresample=48000','-ar','48000','mix/musik-norm.wav'],check=True)
fc = (
 f"[1:a]aformat=channel_layouts=stereo,atrim=0:{T},asetpts=PTS-STARTPTS,highpass=f=60,equalizer=f=3000:t=q:w=1:g=-3,"
 f"volume='{expr()}':eval=frame,apad=whole_dur={T}[mus];"
 f"[0:a]aformat=channel_layouts=stereo,apad=whole_dur={T},asplit=2[v][vsc];"
 f"[mus][vsc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350:makeup=1[musd];"
 f"[2:a]apad=whole_dur={T}[sfx];"
 f"[v][musd][sfx]amix=inputs=3:normalize=0,atrim=0:{T},afade=t=out:st={T-0.8}:d=0.8[mix]"
)
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i','stimme-final/stimme.wav','-i','mix/musik-norm.wav','-i','mix/sfx.wav',
  '-filter_complex',fc,'-map','[mix]','-ar','48000','mix/roh.wav'],check=True)
# Zwei-Pass loudnorm auf -14 LUFS, -1 dBTP
r = subprocess.run(['ffmpeg','-hide_banner','-i','mix/roh.wav','-af','loudnorm=I=-14:TP=-1.0:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True).stderr
j = json.loads(r[r.rfind('{'):r.rfind('}')+1])
af = f"loudnorm=I=-14:TP=-1.0:LRA=9:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true"
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i','mix/roh.wav','-af',af+',aresample=48000','-ar','48000','mix/ton.wav'],check=True)
print('ok')
