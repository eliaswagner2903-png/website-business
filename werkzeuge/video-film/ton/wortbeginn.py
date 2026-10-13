# Wortbeginne einer Stimmaufnahme nachschärfen (Runde 2, 13.10.2026).
# Die erzwungene Ausrichtung (take-C.words.json) liegt bis zu 0,35 s daneben, besonders hinter Audio-Tags.
# Verfahren: Pegelhüllkurve (5 ms, Sprachband 150–6000 Hz); Kandidat = Anstieg um ≥ 8 dB über das Minimum der
# vorigen 60 ms auf ≥ -38 dB. Nach einer echten Pause (< -48 dB ≥ 80 ms) gilt das Pausenende.
# Eine Pause gehört dem ersten Wort, dessen Ausrichtung nach ihrem Beginn liegt (Wortbeginn = Pausenende), sonst der Anstieg nächst (Ausrichtung − 0,08 s)
# im Fenster [−0,40; +0,12] s, sonst Ausrichtung − 0,08 s; Wortbeginne bleiben streng aufsteigend.
import json, subprocess, numpy as np

def huelle(pfad, hop=0.005, sr=48000):
    roh = subprocess.run(['ffmpeg', '-v', 'error', '-i', pfad, '-ac', '1', '-ar', str(sr), '-af', 'highpass=f=150,lowpass=f=6000',
                          '-f', 's16le', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(roh, np.int16).astype(float) / 32768
    h = int(hop * sr); n = len(x) // h
    e = np.sqrt((x[:n * h].reshape(n, h) ** 2).mean(1) + 1e-12)
    return 20 * np.log10(e), hop

def pausen(db, hop, schwelle=-48, mind=0.08):
    q = db < schwelle; out = []; i = 0
    while i < len(q):
        if q[i]:
            j = i
            while j < len(q) and q[j]: j += 1
            if (j - i) * hop >= mind: out.append((i * hop, j * hop))
            i = j
        else: i += 1
    return out

def wortbeginne(pfad, woerter):
    db, hop = huelle(pfad)
    P = pausen(db, hop)
    k = int(0.06 / hop)
    kand = [i * hop for i in range(k, len(db)) if db[i] >= -38 and db[i] - db[i - k:i].min() >= 8 and db[i - 1] - db[i - k:i].min() < 8]
    # Jede Pause gehört dem ersten Wort, dessen Ausrichtung nach Pausenbeginn − 0,1 s liegt (spätere Pause gewinnt)
    nach_pause = {}
    for (x, b) in P:
        for n, w in enumerate(woerter):
            if w['start'] > x - 0.1:
                if b < w['start'] + 0.45: nach_pause[n] = b
                break
    out = []; vor = -1.0
    for n, w in enumerate(woerter):
        a = w['start']; ziel = a - 0.08
        if n in nach_pause: s = nach_pause[n]; quelle = 'pause'
        else:
            grenze = min([nach_pause[k] for k in nach_pause if k > n] or [1e9]) - 0.08
            c = [t for t in kand if max(vor + 0.08, a - 0.40) <= t <= min(a + 0.12, grenze)]
            if c: s = min(c, key=lambda t: abs(t - ziel)); quelle = 'anstieg'
            else: s = min(max(ziel, vor + 0.08), grenze); quelle = 'versatz'
        out.append({**w, 's': round(s, 3), 'quelle': quelle}); vor = s
    # Wortende: nächster Wortbeginn bzw. Beginn einer dazwischen liegenden Pause
    for n, w in enumerate(out):
        nxt = out[n + 1]['s'] if n + 1 < len(out) else w['end']
        p = [a for (a, b) in P if w['s'] + 0.05 < a < nxt]
        w['e'] = round(min(p) if p else nxt - 0.01, 3)
    return out, P, db, hop
