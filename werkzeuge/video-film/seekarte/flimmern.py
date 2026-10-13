#!/usr/bin/env python3
"""Flimmerprüfung eines gerenderten Clips: Differenz aufeinanderfolgender Frames.

Misst je Frame (Graustufen, volle Auflösung):
  d[t]   = mittlere |F[t] - F[t-1]|                       (Bewegung insgesamt)
  hin[t] = mittleres max(0, min(|F[t]-F[t-1]|, |F[t]-F[t+1]|) - |F[t+1]-F[t-1]|)
           → „hin und zurück“ (A-B-A): echtes Flimmern, unabhängig von gewollter gleichmäßiger Bewegung
  Sprung: d[t] > 3 × Median der Nachbarn (±4 Frames) und > 0,6 Graustufen
Aufruf: python3 seekarte/flimmern.py clip.mp4 [Marken z. B. 148,290]
"""
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
    marken = [int(x) for x in sys.argv[2].split(",")] if len(sys.argv) > 2 else []
    d, hin, prev2, prev = [0.0], [0.0], None, None
    for i, f in enumerate(frames(pfad)):
        if prev is not None:
            d.append(float(np.abs(f - prev).mean()))
        if prev2 is not None:
            a, b, c = np.abs(prev - prev2), np.abs(prev - f), np.abs(f - prev2)
            hin.append(float(np.maximum(0, np.minimum(a, b) - c).mean()))
        prev2, prev = prev, f
    hin.append(0.0)
    d, hin = np.array(d), np.array(hin)
    spruenge = []
    for t in range(1, len(d)):
        nb = np.concatenate([d[max(1, t - 4):t], d[t + 1:t + 5]])
        if len(nb) and d[t] > 3 * max(np.median(nb), 0.05) and d[t] > 0.6:
            spruenge.append(t)
    print(f"{pfad}: {len(d)} Frames")
    print(f"  Bewegung d: Median {np.median(d):.3f}, Max {d.max():.3f} bei F{int(d.argmax())}")
    print(f"  Hin-und-zurück (Flimmern): Median {np.median(hin):.4f}, Max {hin.max():.4f} bei F{int(hin.argmax())}")
    print(f"  Sprünge: {spruenge if spruenge else 'keine'}  (geplante Marken: {marken})")
    for a, b in ((0, 42), (42, 150), (150, 290), (290, 384), (384, len(d))):
        if a < len(d):
            seg = slice(a, min(b, len(d)))
            print(f"  F{a:>3}–{min(b, len(d)) - 1:>3}: d Ø {d[seg].mean():.3f} max {d[seg].max():.3f} | hin Ø {hin[seg].mean():.4f} max {hin[seg].max():.4f}")
    np.savetxt(pfad + ".diff.txt", np.stack([d, hin], 1), fmt="%.4f")


if __name__ == "__main__":
    main()
