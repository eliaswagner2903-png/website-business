import sys,subprocess,numpy as np
from PIL import Image,ImageFilter
rng=np.random.default_rng(7)
def tex(h,w,sig):
    n=rng.standard_normal((h,w)); F=np.fft.fft2(n)
    fy=np.fft.fftfreq(h)[:,None]; fx=np.fft.fftfreq(w)[None,:]
    F*=np.exp(-((fx*w)**2/(2*(w/sig)**2)+(fy*h)**2/(2*(h/sig*0.6)**2)))
    x=np.real(np.fft.ifft2(F)); x=(x-x.min())/(x.max()-x.min()); return x
TEX=(0.6*tex(1024,256,9)+0.4*tex(1024,256,22)); TEX=(TEX-TEX.min())/(TEX.max()-TEX.min())
def sm(a,b,x): t=np.clip((x-a)/(b-a),0,1); return t*t*(3-2*t)
def steam(frame,cx,base,wid,hgt,t,phase,amp=0.30):
    H,W,_=frame.shape
    x0=int(max(cx-wid*1.6,0)); x1=int(min(cx+wid*1.6,W)); y0=int(max(base-hgt,0)); y1=int(min(base+10,H))
    ys=np.arange(y0,y1); xs=np.arange(x0,x1)
    Y,X=np.meshgrid(ys,xs,indexing='ij')
    up=(base-Y)/hgt
    sway=np.sin(up*5+t*2*np.pi+phase)*wid*0.35*up
    ty=((Y*0.9+ (1-t)*1024*1.0+phase*40)%1024).astype(int)
    tx=(((X-cx+sway)*0.8+128+phase*20)%256).astype(int)
    n=TEX[ty,tx]
    n=sm(0.42,0.85,n)
    mask=np.exp(-((X-cx+sway*0.5)/(wid*(0.5+0.8*up)))**2)*sm(0,0.08,up)*np.exp(-up*2.2)*(up<1)
    a=(n*mask*amp)[...,None]
    reg=frame[y0:y1,x0:x1].astype(np.float32)
    col=np.array([246,240,230],np.float32)
    frame[y0:y1,x0:x1]=(reg*(1-a)+col*a).astype(np.uint8)
def sweep(frame,t,amp=0.12):
    H,W,_=frame.shape
    Y,X=np.mgrid[0:H,0:W].astype(np.float32)
    d=(X*0.6+Y*0.8)/ (W*0.6+H*0.8)
    c=(t*1.4-0.2)
    band=np.exp(-((d-c)/0.12)**2)
    reg=frame.astype(np.float32)+band[...,None]*amp*np.array([255,214,150],np.float32)
    frame[:]=np.clip(reg,0,255).astype(np.uint8)
def motes(frame,t,n=34,amp=0.55):
    H,W,_=frame.shape; r=np.random.default_rng(3)
    px=r.random(n)*W; py=r.random(n)*H; sp=r.random(n)*0.5+0.2; sz=r.random(n)*3+1.5; ph=r.random(n)*6.28
    img=Image.fromarray(frame); lay=np.zeros((H,W),np.float32)
    for i in range(n):
        x=(px[i]+np.sin(t*6.28+ph[i])*30)%W; y=(py[i]-t*sp[i]*H*0.35)%H
        r0=int(sz[i]*2.5); x0,x1=int(max(x-r0,0)),int(min(x+r0,W)); y0,y1=int(max(y-r0,0)),int(min(y+r0,H))
        if x1<=x0 or y1<=y0: continue
        Y,X=np.mgrid[y0:y1,x0:x1]; lay[y0:y1,x0:x1]+=np.exp(-((X-x)**2+(Y-y)**2)/(2*sz[i]**2))*(0.6+0.4*np.sin(t*12.56+ph[i]))
    lay=np.clip(lay,0,1)[...,None]*amp
    frame[:]=np.clip(frame.astype(np.float32)+lay*np.array([255,226,170],np.float32),0,255).astype(np.uint8)
def run(src,out,ow,oh,secs,fps,steams,zoom=0.06,light=True,mote=False,drift=(0,0)):
    im=Image.open(src).convert('RGB'); SW,SH=im.size
    N=int(secs*fps)
    p=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{ow}x{oh}','-r',str(fps),'-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','17','-preset','medium','-movflags','+faststart',out],stdin=subprocess.PIPE)
    for i in range(N):
        t=i/N; e=0.5-0.5*np.cos(np.pi*t)  # ease
        z=1+zoom*e
        cw=SW/z; ch=SH/z
        cx=SW/2+drift[0]*e*SW; cy=SH/2+drift[1]*e*SH
        box=(cx-cw/2,cy-ch/2,cx+cw/2,cy+ch/2)
        fr=np.array(im.resize((ow,oh),Image.BICUBIC,box=box))
        # steam coordinates are in output-frame space of the unzoomed image: map by zoom
        for (sx,sy,wd,hg,ph) in steams:
            ox=(sx*SW/ow-box[0])/cw*ow; oy=(sy*SH/oh-box[1])/ch*oh
            steam(fr,ox,oy,wd*z,hg*z,t,ph)
        if light: sweep(fr,t)
        if mote: motes(fr,t)
        p.stdin.write(fr.tobytes())
    p.stdin.close(); p.wait()
if __name__=='__main__':
    which=sys.argv[1]
    base='/tmp/claude-0/b/'
    if which=='tee':   run(base+'p5.png',base+'out/tee-story.mp4',1080,1920,7,30,[(520,640,110,520,0.0),(430,640,80,380,2.1)],zoom=0.07,light=True)
    if which=='gutschein': run(base+'p1.png',base+'out/gewinnspiel-titel.mp4',1080,1350,7,30,[(540,438,60,280,0.0),(697,458,60,260,1.7)],zoom=0.05,light=True,mote=True)
    if which=='tablett': run(base+'p2.png',base+'out/tablett.mp4',1080,1350,7,30,[(462,470,55,260,0.5),(977,606,55,260,2.4)],zoom=0.05,light=True,mote=True)
    if which=='boerek': run(base+'p6.png',base+'out/boerek-story.mp4',1080,1920,7,30,[(760,1000,90,360,0.9)],zoom=0.06,light=True,mote=True)
