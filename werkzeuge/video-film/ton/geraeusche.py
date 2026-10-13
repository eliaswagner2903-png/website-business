# Geräuschspur nach 04-ton.md, auf die Ist-Zeitleiste der Stimme (06-dramaturgie.md §6) umgerechnet.
# Pegel relativ zur Stimme (-16 LUFS). Einsatz = Wortbeginn; Stille am Dateianfang wird abgezogen.
import json, subprocess
M = {x['datei']: x for x in json.load(open('sfx/messung.json'))}
T = 50.5
V = -16.0
E = [
 (0.55,'01-glut-3.mp3',-14,{}), (2.30,'01-glut-1.mp3',-18,{}),
 (4.86,'02-karte-1.mp3',-10,{}), (5.05,'02-karte-3.mp3',-17,{}),
 (4.60,'kajuete-lang-1.mp3',-27,{'loop_bis':T,'fade_in':1.5,'fade_out':1.2}),
 (6.20,'04-holz-1.mp3',-21,{}), (19.60,'04-holz-2.mp3',-23,{}), (40.90,'04-holz-1.mp3',-21,{'pitch':-3}),
 (6.00,'wellen-lang-3.mp3',-25,{'loop_bis':31.8,'fade_in':2.0,'fade_out':0.8}),
 (11.94,'06a-messing-1.mp3',-17,{'pitch':-2}), (13.22,'06a-messing-2.mp3',-17,{}), (14.70,'06a-messing-3.mp3',-17,{'pitch':2}),
 (17.99,'07-leuchtfeuer-1.mp3',-20,{'dauer':1.4}), (20.05,'07-leuchtfeuer-2.mp3',-20,{'dauer':1.4}),
 (20.99,'07-leuchtfeuer-4.mp3',-20,{'dauer':1.4}), (21.99,'07-leuchtfeuer-1.mp3',-20,{'pitch':2,'dauer':1.4}),
 (23.30,'08-seite-2.mp3',-16,{}), (24.46,'08-seite-1.mp3',-16,{}), (26.12,'08-seite-3.mp3',-16,{}), (27.18,'08-seite-4.mp3',-16,{}),
 (30.60,'09-kompass-3.mp3',-15,{}),
 (31.20,'meer-lang-3.mp3',-12,{'fade_in':0.6,'fade_out':1.2,'dauer':6.6}),
 (35.70,'11-glocke-3.mp3',-16,{}),
 (36.78,'06b-stempel-2.mp3',-14,{}), (37.68,'06b-stempel-1.mp3',-14,{'pitch':-2}), (38.74,'06b-stempel-3.mp3',-14,{'pitch':-4}),
 (44.00,'hafen-lang-1.mp3',-22,{'loop_bis':T,'fade_in':1.5,'fade_out':1.2}),
 (47.90,'07-leuchtfeuer-3.mp3',-17,{'dauer':2.5}),
]
ins, fc, labels = [], [], []
for i,(t,f,rel,x) in enumerate(E):
    m = M[f]; ins += ['-i', 'sfx/'+f]
    gain = max(-20, min(32, (V+rel) - m['lufs']))
    on = m.get('stille_anfang_s') or 0
    ch = f'[{i}:a]aresample=48000,aformat=channel_layouts=stereo'
    if x.get('pitch'): r = 2**(x['pitch']/12); ch += f',asetrate={48000*r:.0f},aresample=48000,atempo={1/r:.4f}'
    ch += f',atrim=start={on:.3f}'
    if 'loop_bis' in x:
        d = x['loop_bis']-t; ch += f',aloop=loop=-1:size=2e9,atrim=0:{d:.3f}'
    elif x.get('dauer'): ch += f',atrim=0:{x["dauer"]:.3f}'
    ch += ',asetpts=PTS-STARTPTS'
    if x.get('fade_in'): ch += f',afade=t=in:d={x["fade_in"]}'
    if x.get('fade_out'):
        d = (x['loop_bis']-t) if 'loop_bis' in x else x.get('dauer', m['dauer']-on)
        ch += f',afade=t=out:st={max(0,d-x["fade_out"]):.3f}:d={x["fade_out"]}'
    ch += f',volume={gain:.1f}dB,adelay={int(t*1000)}|{int(t*1000)}[e{i}]'
    fc.append(ch); labels.append(f'[e{i}]')
fc.append(''.join(labels)+f'amix=inputs={len(labels)}:normalize=0:dropout_transition=0,atrim=0:{T},alimiter=limit=0.7[o]')
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y',*ins,'-filter_complex',';'.join(fc),'-map','[o]','-ar','48000','mix/sfx.wav'],check=True)
print('ok')
