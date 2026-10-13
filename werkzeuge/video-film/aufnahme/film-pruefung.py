#!/usr/bin/env python3
"""Flimmerprüfung eines fertigen Films („Nachtfahrt“), Vorlage seekarte/flimmern.py.

Je Frame (Graustufen, volle Auflösung):
  d[t]    mittlere |F[t]-F[t-1]|                              (Bewegung)
  hin[t]  mittleres max(0, min(|F[t]-F[t-1]|, |F[t]-F[t+1]|) - |F[t+1]-F[t-1]|)   (A-B-A = echtes Flimmern)
  L[t]    mittlere Helligkeit; Helligkeitsflackern = L[t] weicht von beiden Nachbarn in dieselbe Richtung ab
Sprung: d[t] > 3 × Median der Nachbarn (±4) und > 0,6. Geplante Schnitte (Marken ±3 F) werden getrennt gezählt.
Aufruf: python3 film-pruefung.py film.mp4 [Marken z. B. 1469,1569,1633]
"""
import json
import subprocess
import sys

import numpy as np


def frames(pfad):
    info = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                           "-of", "csv=p=0", pfad], capture_output=True, text=True).stdout.strip().split(",")
    w, h = int(info[0]), int(info[1])
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", pfad, "-f", "rawvideo", "-pix_fmt", "gray", "-"], stdout=subprocess.PIPE)
    n = w * h
    while True:
        b = p.stdout.read(n)
        if len(b) < n:
            break
        yield np.frombuffer(b, np.uint8).reshape(h, w).astype(np.int16)


def main():
    pfad = sys.argv[1]
    marken = [int(x) for x in sys.argv[2].split(",")] if len(sys.argv) > 2 and sys.argv[2] else []
    d, hin, L, prev2, prev = [0.0], [0.0], [], None, None
    for f in frames(pfad):
        L.append(float(f.mean()))
        if prev is not None:
            d.append(float(np.abs(f - prev).mean()))
        if prev2 is not None:
            a, b, c = np.abs(prev - prev2), np.abs(prev - f), np.abs(f - prev2)
            hin.append(float(np.maximum(0, np.minimum(a, b) - c).mean()))
        prev2, prev = prev, f
    hin.append(0.0)
    d, hin, L = np.array(d), np.array(hin), np.array(L)
    N = len(d)
    geplant = np.zeros(N, bool)
    for m in marken:
        geplant[max(0, m - 3):min(N, m + 4)] = True
    spruenge, spruenge_geplant = [], []
    for t in range(1, N):
        nb = np.concatenate([d[max(1, t - 4):t], d[t + 1:t + 5]])
        if len(nb) and d[t] > 3 * max(np.median(nb), 0.05) and d[t] > 0.6:
            (spruenge_geplant if geplant[t] else spruenge).append((t, round(float(d[t]), 2)))
    # Helligkeitsflackern: Spitze, die zurückgeht
    hell = []
    for t in range(1, N - 1):
        dl = L[t] - (L[t - 1] + L[t + 1]) / 2
        if abs(dl) > 0.25 and (L[t] - L[t - 1]) * (L[t + 1] - L[t]) < 0 and not geplant[t]:
            hell.append((t, round(float(dl), 3)))
    hin_frei = hin.copy(); hin_frei[geplant] = 0
    flimmer = [(int(t), round(float(hin_frei[t]), 4)) for t in np.argsort(hin_frei)[::-1][:8]]
    res = {
        "film": pfad, "frames": N,
        "bewegung_median": round(float(np.median(d)), 4), "bewegung_max": [int(d.argmax()), round(float(d.max()), 3)],
        "hin_und_zurueck_median": round(float(np.median(hin)), 5), "hin_und_zurueck_max_ungeplant": flimmer[:3],
        "spruenge_ungeplant": spruenge, "spruenge_geplant": spruenge_geplant,
        "helligkeitsflackern": hell,
    }
    print(json.dumps(res, ensure_ascii=False, indent=1))
    np.savetxt(pfad + ".diff.txt", np.stack([d, hin, L], 1), fmt="%.4f")


if __name__ == "__main__":
    main()
