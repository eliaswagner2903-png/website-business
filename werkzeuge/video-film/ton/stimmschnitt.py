# Sprecherschnitt nach 06-dramaturgie.md: Zeilen aus Take D (+ Zeile 1 aus Nachaufnahme l1-c), Pausen bewusst gesetzt.
import json, subprocess
W = [w for w in json.load(open('stimme1/take-D.words.json'))['words'] if w['type'] == 'word']
def span(a, b):
    s = W[a]['start']; e = W[b]['end']
    ps = W[a-1]['end'] if a > 0 else 0; ne = W[b+1]['start'] if b+1 < len(W) else e + .4
    return max(ps + (s-ps)*.5, s-.12), min(e + (ne-e)*.5, e+.22)
Z = [('L2',5,14),('L3',15,26),('L4',27,37),('L5',38,47),('L6',48,54),('L7',55,57),('L8a',58,67),('L8b',68,73),('L9',74,79)]
segs = [('pause',0.6)]
L1 = [(0.00,1.16),(1.48,2.52),(4.12,4.92),(6.02,6.80)]; P1 = [0.22,0.55,0.20]
for i,(a,b) in enumerate(L1):
    segs.append(('stimme1/l1-c.mp3',a,b,'L1'))
    if i < 3: segs.append(('pause',P1[i]))
gap = {'L1':1.05,'L2':0.3,'L3':0.45,'L4':0.3,'L5':0.45,'L6':1.2,'L7':0.5,'L8a':0.25,'L8b':0.6,'L9':1.2}
segs.append(('pause',gap['L1']))
CAP = 0.38
for name,a,b in Z:
    grp=[[a]]
    for i in range(a+1,b+1):
        if W[i]['start']-W[i-1]['end'] > CAP+0.1: grp.append([i])
        else: grp[-1].append(i)
    for j,g in enumerate(grp):
        s,e = span(g[0],g[-1]); segs.append(('stimme1/take-D.mp3',s,e,name))
        if j < len(grp)-1: segs.append(('pause',max(0.05, CAP-0.3)))
    segs.append(('pause',gap[name]))
inputs=[]; parts=[]; t=0.0; plan=[]
for sg in segs:
    if sg[0]=='pause':
        parts.append(f'anullsrc=r=48000:cl=mono,atrim=0:{sg[1]:.3f}[p{len(parts)}]'); t+=sg[1]; continue
    f,a,b,n = sg
    if f not in inputs: inputs.append(f)
    k=inputs.index(f)
    parts.append(f'[{k}:a]aresample=48000,pan=mono|c0=c0,atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.015,afade=t=out:st={b-a-0.03:.3f}:d=0.03[p{len(parts)}]')
    plan.append({'zeile':n,'quelle':f,'von':round(a,3),'bis':round(b,3),'film_start':round(t,3)}); t+=b-a
fc=';'.join(parts)+';'+''.join(f'[p{i}]' for i in range(len(parts)))+f'concat=n={len(parts)}:v=0:a=1[o]'
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y']+sum([['-i',f] for f in inputs],[])+['-filter_complex',fc,'-map','[o]','-c:a','pcm_s16le','stimme-final/stimme-trocken.wav'],check=True)
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i','stimme-final/stimme-trocken.wav','-af','aecho=0.8:0.5:28|47:0.10|0.06,loudnorm=I=-16:TP=-1.5:LRA=7','-ar','48000','stimme-final/stimme.wav'],check=True)
json.dump({'laenge':round(t,3),'segmente':plan},open('stimme-final/schnitt.json','w'),ensure_ascii=False,indent=1)
# Wortzeiten im Film (Schreibweise wie im Drehbuch)
P=plan; out=[]
l1=[s for s in P if s['zeile']=='L1']
for tx,k,a,b in [('Erst',0,0.18,1.08),('der',1,1.56,1.80),('Kurs.',1,1.86,2.43),('Dann',2,4.22,4.84),('die',3,6.10,6.30),('Fahrt.',3,6.34,6.78)]:
    s=l1[k]; o=s['film_start']-s['von']; out.append({'z':'L1','w':tx,'s':round(a+o,3),'e':round(b+o,3)})
fix={'Website':'Website.','klar':'Klar','Handy,':'Handy.','aufgebaut,':'aufgebaut.','Uhrmacherei,':'Uhrmacherei.','Präzisionswerkzeuge,':'Präzisionswerkzeuge.','Restaurant,':'Restaurant.','Gebaut,':'Gebaut.','gemessen,':'Gemessen.','betreut.':'Betreut.','Gespräch':'Gespräch.'}
for s in P:
    if s['zeile']=='L1': continue
    o=s['film_start']-s['von']
    for w in W:
        if w['start']>=s['von']-1e-6 and w['end']<=s['bis']+1e-6:
            tx=fix.get(w['text'],w['text'])
            if s['zeile']=='L2' and tx=='Kurs': tx='Kurs.'
            if s['zeile'] in('L2','L3') and tx=='für': tx='Für'
            out.append({'z':s['zeile'][:2],'w':tx,'s':round(w['start']+o,3),'e':round(w['end']+o,3)})
json.dump(out,open('stimme-final/woerter.json','w'),ensure_ascii=False,indent=0)
print('Laenge',round(t,2)); print(' '.join(w['w'] for w in out))
