#!/usr/bin/env python3
"""Flimmer-/Ruckelprüfung einer cap4-Aufnahme und Kontrollbilder.
Aufruf: python3 pruefe4.py <ID> [--frames DIR] [--meta DIR] [--kontrolle DIR]
Prüft pro Bild gegen das Vorbild:
  1. Helligkeitsflackern: Mittelwert-Luma eines Bildes weicht von der Mitte seiner Nachbarn ab (Spitze, die zurückgeht).
  2. Differenz-Ausreißer: mittlere Abweichung zum Vorbild (MAD) springt auf das Mehrfache der Nachbarschaft (Sprung, Ruckler).
  3. Doppelbilder: MAD ~ 0, obwohl Nachbarn in Bewegung sind (Bild wiederholt -> Ruckeln).
  4. Scroll-Gleichmaß: im Bild gemessene senkrechte Verschiebung gegen die Sollverschiebung aus scrollY (rects.json).
Geplante Ereignisse (Sprung, Klick/Reiterwechsel, Scroll-Start/-Ende) werden mit +-3 Bildern ausgenommen und getrennt gezählt.
"""
import argparse, json, os, sys, glob
import numpy as np
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument('id')
ap.add_argument('--frames', default='/tmp/claude-0/-home-user-website-business/7eb3e817-07c9-5aa5-bd86-e370d0ae475c/scratchpad/aufnahme-tmp')
ap.add_argument('--meta', default='/mnt/project-files/seitenkapitaen/video/aufnahme')
ap.add_argument('--kontrolle', default='/mnt/project-files/seitenkapitaen/video/aufnahme/kontrolle')
ap.add_argument('--nokontrolle', action='store_true')
a = ap.parse_args()

fdir = os.path.join(a.frames, a.id)
files = sorted(glob.glob(os.path.join(fdir, '*.jpg')))
marks = json.load(open(os.path.join(a.meta, a.id + '.marks.json')))
rects = json.load(open(os.path.join(a.meta, a.id + '.rects.json')))
N = len(files)
assert N == marks['frames'] == rects['frames'], (N, marks['frames'], rects['frames'])
dsf = marks['viewport']['dsf']; VH = marks['viewport']['h']
ys = np.array(rects['scrollY'])

L = np.zeros(N); MAD = np.zeros(N); SH = np.full(N, np.nan); RES = np.full(N, np.nan)
prev_small = None; prev_prof = None; prev2_small = None; MAD2 = np.zeros(N)
r0 = int(130 * dsf); r1 = int((VH - 120) * dsf)  # Zeilenband für Verschiebungsmessung (ohne Kopfleiste/feste Leiste)
for i, f in enumerate(files):
    im = Image.open(f).convert('L')
    sm = np.asarray(im.reduce(4), dtype=np.float32)
    L[i] = sm.mean()
    if prev_small is not None:
        MAD[i] = np.abs(sm - prev_small).mean()
    if prev2_small is not None:
        MAD2[i - 1] = np.abs(sm - prev2_small).mean()  # Abstand Bild i-2 zu Bild i, gehört zu Bild i-1
    prev2_small = prev_small; prev_small = sm
    full = np.asarray(im, dtype=np.float32)
    w = full.shape[1]
    prof = full[:, int(w * .08):int(w * .92)].mean(axis=1)
    if prev_prof is not None and abs(ys[i] - ys[i - 1]) > 0.01:
        # Verschiebung zwischen prof(i-1) und prof(i) (Inhalt wandert um -dy*dsf nach oben): SSD über ganzzahlige Verschiebungen + Parabel
        exp = (ys[i] - ys[i - 1]) * dsf
        m = int(abs(exp)) + 4
        seg = prof[r0:r1]
        best = None; costs = []
        for s in range(-m, m + 1):  # Inhalt des neuen Bildes = altes Bild verschoben um -s  (s>0: Seite scrollt abwärts)
            a0 = prev_prof[r0 + s:r1 + s] if r0 + s >= 0 and r1 + s <= len(prev_prof) else None
            if a0 is None: costs.append(np.inf); continue
            costs.append(float(np.mean((seg - a0) ** 2)))
        k = int(np.argmin(costs))
        if 0 < k < len(costs) - 1 and np.isfinite(costs[k - 1]) and np.isfinite(costs[k + 1]):
            c0, c1, c2 = costs[k - 1], costs[k], costs[k + 1]
            den = c0 - 2 * c1 + c2
            off = 0.5 * (c0 - c2) / den if den > 1e-9 else 0.0
        else:
            off = 0.0
        SH[i] = (k - m) + off
        RES[i] = costs[k]
    prev_prof = prof
    if i % 500 == 0: print('  gelesen', i, '/', N, flush=True)

# --- Ausnahmefenster um geplante Ereignisse ---
excl = np.zeros(N, bool)
for e in marks['events']:
    fr = e['frame']
    if e['type'] in ('sprung', 'klick', 'tab'):
        excl[max(0, fr - 3):min(N, fr + 8)] = True
    if e['type'] == 'scroll':  # Anfang/Ende der Fahrt: Beschleunigung, Erscheinen/Verschwinden von Elementen
        excl[max(0, fr - 2):min(N, fr + 4)] = True
        excl[max(0, fr + e['dauer'] - 3):min(N, fr + e['dauer'] + 4)] = True
excl[:4] = True

def local_med(x, i, w=5):
    lo, hi = max(1, i - w), min(len(x), i + w + 1)
    v = np.concatenate([x[lo:i], x[i + 1:hi]])
    return float(np.median(v)) if len(v) else 0.0

flag_luma, flag_spike, flag_dup = [], [], []
dl = np.zeros(N)
for i in range(1, N - 1):
    dl[i] = L[i] - (L[i - 1] + L[i + 1]) / 2
mad_dl = np.median(np.abs(dl[1:-1] - np.median(dl[1:-1]))) + 1e-6
for i in range(2, N - 1):
    if excl[i]: continue
    m = local_med(MAD, i)
    if abs(dl[i]) > max(0.35, 6 * mad_dl) and (L[i] - L[i - 1]) * (L[i + 1] - L[i]) < 0:
        flag_luma.append((i, round(float(dl[i]), 3)))
    if MAD[i] > max(3 * m, m + 0.6):
        flag_spike.append((i, round(float(MAD[i]), 3), round(m, 3)))
    if m > 0.3 and MAD[i] < 0.2 * m:
        flag_dup.append((i, round(float(MAD[i]), 4), round(m, 3)))

# Einzelbild-Ausreißer: Bild i weicht von beiden Nachbarn ab, die Nachbarn untereinander aber kaum (ein Bild blitzt kurz anders auf)
flag_blip = []
for i in range(1, N - 1):
    if excl[i]: continue
    lo = min(MAD[i], MAD[i + 1])
    if lo > 0.02 and MAD2[i] < 0.35 * lo: flag_blip.append((i, round(float(MAD[i]), 3), round(float(MAD2[i]), 3)))

# Restfehler nach Verschiebungsausgleich (Helligkeitsflackern/Sprünge während der Fahrt, unabhängig vom Inhalt)
flag_res = []
for i in range(3, N - 3):
    if excl[i] or np.isnan(RES[i]): continue
    nb = [RES[j] for j in range(i - 4, i + 5) if j != i and not np.isnan(RES[j])]
    pass
res_stats = None
if (~np.isnan(RES)).any():
    r_ = RES[~np.isnan(RES) & ~excl]
    res_stats = {'median': round(float(np.median(r_)), 3), 'p99': round(float(np.percentile(r_, 99)), 3), 'max': round(float(r_.max()), 3)} if len(r_) else None

# geplante Ausnahmen separat melden: Sprünge/Klicks der Aufnahme
planned = [(e['frame'], e['type']) for e in marks['events'] if e['type'] in ('sprung', 'klick', 'tab')]

# --- Scroll-Gleichmaß: Messung gegen Soll ---
dy = np.diff(ys, prepend=ys[0]) * dsf          # Soll in Gerätepixeln
ok = ~np.isnan(SH) & (np.abs(dy) > 0.01) & ~excl
err = np.abs(SH[ok] - dy[ok])
# Eingabe-Gleichmaß: zweite Differenz von scrollY (Beschleunigung) innerhalb der Fahrten
acc = np.abs(np.diff(ys, 2)) if N > 2 else np.array([0.0])
scroll_acc = []
for e in marks['events']:
    if e['type'] != 'scroll': continue
    s0, s1 = e['frame'] + 2, e['frame'] + e['dauer'] - 1
    if s1 > s0 + 2: scroll_acc.append(float(np.abs(np.diff(ys[s0:s1], 2)).max()))

# Ruckel-Kennzahl der Fahrten: Verhältnis gemessene Verschiebung zu Soll
ratio = None
if ok.sum():
    ratio = {'frames': int(ok.sum()), 'abw_median_px': round(float(np.median(err)), 3), 'abw_p99_px': round(float(np.percentile(err, 99)), 3), 'abw_max_px': round(float(err.max()), 3)}

res = {
    'id': a.id, 'frames': N, 'luma_flackern': flag_luma, 'diff_spruenge': flag_spike, 'doppelbilder': flag_dup,
    'einzelbild_ausreisser': flag_blip, 'rest_fehler_mse_nach_ausgleich': res_stats,
    'geplante_ereignisse_ausgenommen': planned,
    'luma_min': round(float(L.min()), 2), 'luma_max': round(float(L.max()), 2),
    'luma_2diff_max_abs': round(float(np.abs(dl[2:-1][~excl[2:-1]]).max()) if (~excl[2:-1]).any() else 0.0, 3),
    'mad_max': round(float(MAD[~excl].max()), 3) if (~excl).any() else 0,
    'mad_median': round(float(np.median(MAD[~excl])), 4) if (~excl).any() else 0,
    'scroll_verschiebung': ratio,
    'scroll_beschleunigung_max_css_px_pro_bild2': [round(x, 4) for x in scroll_acc],
}
print(json.dumps(res, ensure_ascii=False))
json.dump(res, open(os.path.join(a.meta, a.id + '.pruefung.json'), 'w'), ensure_ascii=False)
np.save(os.path.join(a.frames, a.id + '.mad.npy'), np.vstack([L, MAD, SH, RES]))

# --- Kontrollbilder (6-10 je Aufnahme) ---
if not a.nokontrolle:
    os.makedirs(a.kontrolle, exist_ok=True)
    picks = {}
    for m in marks['marks']:
        picks.setdefault(min(N - 1, m['frame']), m['name'])
    # Zusatz: Mitte von Fahrten, kurz vor/nach Klick und letztes Bild
    for e in marks['events']:
        if e['type'] == 'scroll': picks.setdefault(e['frame'] + e['dauer'] // 2, 'fahrt-mitte')
        if e['type'] in ('klick', 'tab'): picks.setdefault(min(N - 1, e['frame'] + 20), 'nach-klick')
    picks.setdefault(N - 1, 'letztes')
    items = sorted(picks.items())
    if len(items) > 10:  # ausdünnen: Marken-Namen mit Vorrang
        items = [x for x in items if x[1] not in ('fahrt-mitte',)] + [x for x in items if x[1] == 'fahrt-mitte'][:2]
        items = sorted(items)[:10]
    for fr, name in items:
        im = Image.open(files[fr]); sc = 1100 / max(im.size)
        im = im.resize((round(im.width * sc), round(im.height * sc)), Image.LANCZOS)
        out = os.path.join(a.kontrolle, f'{a.id}_{fr:05d}_{name}.webp')
        im.save(out, 'WEBP', quality=82); print('  Kontrolle', out)
