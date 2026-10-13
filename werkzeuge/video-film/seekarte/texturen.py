#!/usr/bin/env python3
"""Seekarte (Eröffnung „Nachtfahrt“): alle statischen Texturen vorrechnen – einmal, mit festem Seed.

Erzeugt je Format (169 = 1920x1080, 916 = 1080x1920) in public/seekarte/:
  karte-<f>.webp  Papier + Tinte (Küsten, Wasserlinien, Rhumbenlinien, 16er-Rose, Rahmen, Maßstab ohne Zahlen)
  feld-<f>.png    R,G = Brandmaske m (16 bit), B = Seite der Kurslinie (Hälfte A, antialiased)
  rand-<f>.png    R = |grad m| (log, 8 bit), G = langsame Glutvariation, B = feines Rauschen fürs Kohleband
  geo-<f>.json    Geometrie für Remotion (Kurslinie, Rose, Start, m entlang der Linie)
Alles hängt nur vom Seed ab → jede Remotion-Seite liest pro Frame exakt dieselben Pixel (nichts flimmert).
Keine Schrift, keine Ortsnamen: Land ist erfundene Form ohne Bezeichnung.
Nur numpy + Pillow. Aufruf: python3 seekarte/texturen.py
"""
import json
import math
import os

import numpy as np
from PIL import Image, ImageDraw

HIER = os.path.dirname(os.path.abspath(__file__))
AUS = os.path.join(HIER, "..", "public", "seekarte")
SS = 4  # Überabtastung für Polygone/Linien (Kantenglättung)


def hexf(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)], dtype=np.float32)


# ---------------- Rauschen (Wertrauschen, bikubisch, mit Seed) ----------------
def wertrauschen(rng, w, h, zelle):
    gw, gh = max(2, int(w / zelle) + 3), max(2, int(h / zelle) + 3)
    g = rng.random((gh, gw)).astype(np.float32)
    im = Image.fromarray(g, "F").resize((int(gw * zelle), int(gh * zelle)), Image.BICUBIC)
    a = np.asarray(im, dtype=np.float32)
    ox, oy = int(rng.integers(0, int(zelle) + 1)), int(rng.integers(0, int(zelle) + 1))
    return a[oy:oy + h, ox:ox + w]


def fbm(rng, w, h, zelle, oktaven=5, gain=0.5):
    s, amp, norm = np.zeros((h, w), np.float32), 1.0, 0.0
    for _ in range(oktaven):
        s += amp * wertrauschen(rng, w, h, max(2.0, zelle))
        norm += amp
        amp *= gain
        zelle /= 2
    s /= norm
    return (s - s.min()) / (s.max() - s.min() + 1e-9)


def boxblur(a, r):
    """3x Boxfilter ≈ Gauß (Radius r in px)."""
    r = int(max(1, r))
    for _ in range(3):
        for ax in (0, 1):
            p = np.pad(a, [(r + 1, r) if i == ax else (0, 0) for i in (0, 1)], mode="edge")
            c = np.cumsum(p, axis=ax, dtype=np.float64)
            if ax == 0:
                a = ((c[2 * r + 1:] - c[:-2 * r - 1]) / (2 * r + 1)).astype(np.float32)
            else:
                a = ((c[:, 2 * r + 1:] - c[:, :-2 * r - 1]) / (2 * r + 1)).astype(np.float32)
    return a


def isolinie(feld, stufe, breite, gx=None, gy=None):
    """Antialiasierte Linie entlang feld == stufe, Breite in px (analytisch über den Gradienten)."""
    if gx is None:
        gy, gx = np.gradient(feld)
    g = np.sqrt(gx * gx + gy * gy) + 1e-6
    d = np.abs(feld - stufe) / g
    return np.clip(breite / 2 + 0.5 - d, 0, 1)


def runter(im_l):
    """Überabgetastete L-Ebene → Deckung 0..1 in Zielgröße."""
    w, h = im_l.size
    return np.asarray(im_l.resize((w // SS, h // SS), Image.BOX), dtype=np.float32) / 255


def bilinear(a, x, y):
    h, w = a.shape
    x = np.clip(x, 0, w - 1.001)
    y = np.clip(y, 0, h - 1.001)
    x0, y0 = np.floor(x).astype(np.int32), np.floor(y).astype(np.int32)
    fx, fy = x - x0, y - y0
    return (a[y0, x0] * (1 - fx) * (1 - fy) + a[y0, x0 + 1] * fx * (1 - fy)
            + a[y0 + 1, x0] * (1 - fx) * fy + a[y0 + 1, x0 + 1] * fx * fy)


def bezier(p0, p1, p2, p3, n=2000):
    t = np.linspace(0, 1, n)[:, None]
    return ((1 - t) ** 3) * p0 + 3 * ((1 - t) ** 2) * t * p1 + 3 * (1 - t) * t * t * p2 + t ** 3 * p3


def gleichabstand(pts, n):
    seg = np.sqrt(((pts[1:] - pts[:-1]) ** 2).sum(1))
    s = np.concatenate([[0], np.cumsum(seg)])
    ziel = np.linspace(0, s[-1], n)
    return np.stack([np.interp(ziel, s, pts[:, 0]), np.interp(ziel, s, pts[:, 1])], 1), s[-1]


def abstand_polylinie(px, py, pts, bogen):
    """Abstand jedes Punkts zur Polylinie + Bogenlänge des nächsten Punkts."""
    best = np.full(px.shape, 1e9, np.float32)
    sbest = np.zeros(px.shape, np.float32)
    for i in range(len(pts) - 1):
        a, b = pts[i], pts[i + 1]
        ab = b - a
        L2 = float(ab @ ab) + 1e-9
        t = np.clip(((px - a[0]) * ab[0] + (py - a[1]) * ab[1]) / L2, 0, 1)
        dx, dy = px - (a[0] + t * ab[0]), py - (a[1] + t * ab[1])
        d = np.sqrt(dx * dx + dy * dy)
        m = d < best
        best[m] = d[m]
        sbest[m] = (bogen[i] + t * (bogen[i + 1] - bogen[i]))[m]
    return best, sbest


# ---------------- Formate ----------------
FORMATE = {
    "169": dict(W=1920, H=1080, P=110, seed=1871,
                start=(0.18, 0.70), rose=(0.70, 0.36), rose_r=150,
                c1=(330, -10), c2=(-380, 150),
                rose2=(0.40, 0.17), rose2_r=0,
                lampe=(0.86, -0.12),
                land=[(0.02, 0.98, 0.30), (0.10, 0.90, 0.18), (0.30, 1.04, 0.16), (0.03, 0.10, 0.20),
                      (0.20, 0.02, 0.15), (0.97, 0.80, 0.16), (0.90, 1.02, 0.14), (1.00, 0.30, 0.08),
                      (0.55, 0.13, 0.03), (0.47, 0.62, 0.03), (0.88, 0.58, 0.03)],
                massstab=(0.60, 0.86, 300), falten=[("v", 0.5), ("h", 0.5)]),
    "916": dict(W=1080, H=1920, P=110, seed=2093,
                start=(0.20, 0.80), rose=(0.64, 0.34), rose_r=165,
                c1=(250, -170), c2=(-90, 330),
                rose2=(0.30, 0.20), rose2_r=0,
                lampe=(0.92, -0.06),
                land=[(0.00, 0.97, 0.36), (0.18, 1.04, 0.20), (0.02, 0.62, 0.13), (0.06, 0.06, 0.26),
                      (0.35, 0.00, 0.17), (1.02, 0.66, 0.20), (0.96, 1.00, 0.16), (1.02, 0.12, 0.10),
                      (0.36, 0.52, 0.045), (0.78, 0.86, 0.05)],
                massstab=(0.50, 0.92, 240), falten=[("h", 1 / 3), ("h", 2 / 3), ("v", 0.5)]),
}

TINTE = hexf("#3a2614")
MESSING_TINTE = hexf("#8a6a34")
PERG_HELL, PERG_DUNKEL, RAND = hexf("#dcc79c"), hexf("#b8995f"), hexf("#6b4a26")


def rose_zeichnen(dr, cx, cy, r, s, lilie):
    """16er-Kompassrose (überabgetastet, Faktor s). Halbe Spitzen gefüllt (klassische Schattierung)."""
    S = lambda v: v * s  # noqa: E731
    # Ringe
    for rr, w in ((r, 1.6), (r - 9, 0.9), (r * 0.30, 0.9), (r * 0.27, 0.6)):
        dr.ellipse([S(cx - rr), S(cy - rr), S(cx + rr), S(cy + rr)], outline=255, width=max(1, int(S(w))))
    # Teilung zwischen den Außenringen: 64 Striche, jeder vierte lang
    for k in range(64):
        a = k * math.tau / 64
        l = 9 if k % 4 == 0 else 4.5
        x0, y0 = cx + math.cos(a) * r, cy + math.sin(a) * r
        x1, y1 = cx + math.cos(a) * (r - l), cy + math.sin(a) * (r - l)
        dr.line([S(x0), S(y0), S(x1), S(y1)], fill=255, width=max(1, int(S(0.7))))
    # Spitzen: 8 kleine, 4 Zwischen, 4 Haupt (Haupt zuletzt, liegen oben)
    def spitze(winkel, laenge, breite):
        a = math.radians(winkel - 90)  # 0° = Nord
        tip = (cx + math.cos(a) * laenge, cy + math.sin(a) * laenge)
        l = (cx + math.cos(a - math.pi / 2) * breite, cy + math.sin(a - math.pi / 2) * breite)
        rr = (cx + math.cos(a + math.pi / 2) * breite, cy + math.sin(a + math.pi / 2) * breite)
        c = (cx, cy)
        # erst freistellen (darunterliegende Spitzen verschwinden), dann eine Hälfte füllen
        dr.polygon([S(c[0]), S(c[1]), S(l[0]), S(l[1]), S(tip[0]), S(tip[1]), S(rr[0]), S(rr[1])], fill=0)
        dr.polygon([S(c[0]), S(c[1]), S(l[0]), S(l[1]), S(tip[0]), S(tip[1])], fill=255)
        dr.line([S(c[0]), S(c[1]), S(l[0]), S(l[1]), S(tip[0]), S(tip[1])], fill=255, width=max(1, int(S(0.9))), joint="curve")
        dr.line([S(c[0]), S(c[1]), S(tip[0]), S(tip[1]), S(rr[0]), S(rr[1]), S(c[0]), S(c[1])],
                fill=255, width=max(1, int(S(0.9))), joint="curve")
        return tip
    for k in range(8):
        spitze(22.5 + k * 45, r * 0.52, r * 0.055)
    for k in range(4):
        spitze(45 + k * 90, r * 0.74, r * 0.085)
    tips = [spitze(k * 90, r - 11 if k else r * 0.62, r * 0.11) for k in range(4)]
    # Mitte
    dr.ellipse([S(cx - 3.2), S(cy - 3.2), S(cx + 3.2), S(cy + 3.2)], fill=255)
    # Nord-Lilie (Messing-Tinte) über der Nordspitze
    ty = cy - r * 0.58
    L = r * 0.34
    def kurve(pts):
        lilie.polygon([(S(x), S(y)) for x, y in pts], fill=255)
    # Mittelblatt
    mid = []
    for i in range(41):
        t = i / 40
        y = ty - t * L
        w = L * 0.20 * math.sin(math.pi * t) ** 0.8 * (1 - 0.35 * t)
        mid.append((cx - w, y))
    mid += [(cx + (cx - x), y) for x, y in reversed(mid)]
    kurve(mid)
    # Seitenblätter (geschwungen nach außen und unten)
    for sgn in (-1, 1):
        pts = []
        for i in range(41):
            t = i / 40
            a = math.pi * (0.95 - 1.15 * t)
            rad = L * 0.42 * (1 - 0.25 * t)
            pts.append((cx + sgn * (L * 0.05 + rad * (1 - math.cos(a)) * 0.55), ty - L * 0.38 + rad * -math.sin(a) * 0.75))
        inner = [(cx + sgn * (L * 0.05 + (x - cx) * sgn * 0.62), y + L * 0.06) for x, y in reversed(pts)]
        kurve(pts + inner)
    # Band
    lilie.rectangle([S(cx - L * 0.30), S(ty - L * 0.22), S(cx + L * 0.30), S(ty - L * 0.14)], fill=255)
    return tips


def baue(name, p):
    W, H, P = p["W"], p["H"], p["P"]
    CW, CH = W + 2 * P, H + 2 * P  # Leinwand mit Überstand (Hälften kippen, ohne Kanten zu zeigen)
    rng = np.random.default_rng(p["seed"])
    yy, xx = np.mgrid[0:CH, 0:CW].astype(np.float32)
    fx, fy = xx - P, yy - P  # Bildkoordinaten
    F = lambda u, v: np.array([u * W + P, v * H + P], np.float32)  # noqa: E731

    # ---- Kurslinie (Bezier) und ihre Verlängerung über den Bildrand (Trennlinie der Hälften) ----
    S0, R0 = F(*p["start"]), F(*p["rose"])
    C1, C2 = S0 + np.array(p["c1"], np.float32), R0 + np.array(p["c2"], np.float32)
    kurs, L = gleichabstand(bezier(S0, C1, C2, R0), 480)
    t0 = (S0 - C1) / np.linalg.norm(S0 - C1)
    t1 = (R0 - C2) / np.linalg.norm(R0 - C2)
    weit = 3 * max(CW, CH)
    vor = np.stack([S0 + t0 * weit * k for k in np.linspace(1, 0, 60)[:-1]])
    nach = np.stack([R0 + t1 * weit * k for k in np.linspace(0, 1, 60)[1:]])
    lang = np.concatenate([vor, kurs, nach])
    bogen = np.concatenate([[0], np.cumsum(np.sqrt(((lang[1:] - lang[:-1]) ** 2).sum(1)))])
    s_rose = bogen[len(vor) + len(kurs) - 1]

    # Abstand (Viertelauflösung, glatt → hochskalieren)
    q = 4
    qy, qx = np.mgrid[0:CH // q + 1, 0:CW // q + 1].astype(np.float32) * q
    d_q, s_q = abstand_polylinie(qx, qy, lang, bogen)
    def hoch(a):
        return np.asarray(Image.fromarray(a, "F").resize((a.shape[1] * q, a.shape[0] * q), Image.BICUBIC), np.float32)[:CH, :CW]
    d = hoch(d_q)
    # Abstand nur zur eigentlichen Kurslinie (für Landkorridor)
    dk_q, _ = abstand_polylinie(qx, qy, kurs[::4], np.zeros(len(kurs[::4])))
    dk = hoch(dk_q)
    s_near = hoch(s_q)

    # ---- Land: fbm + Schwerpunkte, Korridor um Kurs und Rose bleibt Wasser ----
    n_land = fbm(rng, CW, CH, 260, 6, 0.52)
    B = np.zeros((CH, CW), np.float32)
    for u, v, r in p["land"]:
        c = F(u, v)
        rr = r * max(W, H)
        B += np.exp(-(((xx - c[0]) ** 2 + (yy - c[1]) ** 2) / (rr * rr)))
    dr_rose = np.sqrt((xx - R0[0]) ** 2 + (yy - R0[1]) ** 2)
    feld_land = B * 1.05 + (n_land - 0.5) * 0.95 + (fbm(rng, CW, CH, 60, 4) - 0.5) * 0.45 - 0.55
    feld_land -= 1.4 * np.exp(-(dk / 95) ** 2)
    feld_land -= 1.6 * np.clip(1 - (dr_rose - p["rose_r"]) / 90, 0, 1)
    ds_start = np.sqrt((xx - S0[0]) ** 2 + (yy - S0[1]) ** 2)
    feld_land -= 1.2 * np.exp(-(ds_start / 60) ** 2)
    land = (feld_land > 0).astype(np.float32)
    land_w = boxblur(land, 1)  # leicht geglättet: Küstenlinie als Isolinie 0.5
    kueste = isolinie(land_w, 0.5, 1.5)
    wasserlinien = np.zeros_like(kueste)
    for r_b, st, op, br in ((6, 0.30, 0.62, 0.85), (10, 0.18, 0.46, 0.8), (15, 0.10, 0.32, 0.75), (22, 0.05, 0.20, 0.7)):
        lb = boxblur(land, r_b)
        wl = isolinie(lb, st, br) * op * (1 - land)
        wasserlinien = 1 - (1 - wasserlinien) * (1 - wl)
    # Land: feine Schattierung entlang der Küste landeinwärts (zwei zarte Innenlinien)
    huegel_c = np.zeros_like(kueste)
    for r_b, st, op in ((5, 0.72, 0.30), (9, 0.86, 0.16)):
        lb = boxblur(land, r_b)
        huegel_c = 1 - (1 - huegel_c) * (1 - isolinie(lb, st, 0.7) * op * land)

    # ---- Polygon-/Linientinte (überabgetastet) ----
    sep = Image.new("L", (CW * SS, CH * SS), 0)
    lil = Image.new("L", (CW * SS, CH * SS), 0)
    ds, dl = ImageDraw.Draw(sep), ImageDraw.Draw(lil)
    # Rahmen mit Gradteilung (ohne Zahlen)
    a1, a2 = 34, 46
    for ins, w in ((a1, 2.0), (a2, 0.9), (a2 + 4, 0.6)):
        ds.rectangle([(P + ins) * SS, (P + ins) * SS, (P + W - ins) * SS, (P + H - ins) * SS], outline=255, width=int(w * SS))
    step = 48
    for kante in range(4):
        laenge = W - 2 * a1 if kante < 2 else H - 2 * a1
        for k in range(int(laenge // step)):
            if k % 2:
                continue
            u0, u1 = a1 + k * step, min(a1 + (k + 1) * step, (W if kante < 2 else H) - a1)
            if kante == 0:
                box = [P + u0, P + a1, P + u1, P + a1 + 6]
            elif kante == 1:
                box = [P + u0, P + H - a1 - 6, P + u1, P + H - a1]
            elif kante == 2:
                box = [P + a1, P + u0, P + a1 + 6, P + u1]
            else:
                box = [P + W - a1 - 6, P + u0, P + W - a1, P + u1]
            ds.rectangle([v * SS for v in box], fill=255)
    # Maßstabsleiste (ohne Zahlen)
    mu, mv, ml = p["massstab"]
    mx, my = P + mu * W - ml / 2, P + mv * H
    seg = ml / 6
    for k in range(6):
        for row in range(2):
            if (k + row) % 2 == 0:
                ds.rectangle([(mx + k * seg) * SS, (my + row * 5) * SS, (mx + (k + 1) * seg) * SS, (my + (row + 1) * 5) * SS], fill=255)
    ds.rectangle([mx * SS, my * SS, (mx + ml) * SS, (my + 10) * SS], outline=255, width=int(0.8 * SS))
    for k in range(7):
        ds.line([(mx + k * seg) * SS, (my - 4) * SS, (mx + k * seg) * SS, (my + 14) * SS], fill=255, width=int(0.8 * SS))
    for k in range(1, 5):  # Unterteilung des ersten Feldes
        x = mx - k * seg / 5
        ds.line([x * SS, my * SS, x * SS, (my + 5) * SS], fill=255, width=int(0.6 * SS))
    ds.line([(mx - seg) * SS, my * SS, mx * SS, my * SS], fill=255, width=int(0.6 * SS))
    ds.line([(mx - seg) * SS, (my + 5) * SS, mx * SS, (my + 5) * SS], fill=255, width=int(0.6 * SS))
    # Startmarke: kleiner Doppelkreis
    for rr, w in ((7, 0.9), (2.2, 2.2)):
        ds.ellipse([(S0[0] - rr) * SS, (S0[1] - rr) * SS, (S0[0] + rr) * SS, (S0[1] + rr) * SS], outline=255, width=int(w * SS))
    # Rose
    rose_maske = Image.new("L", (CW * SS, CH * SS), 0)
    ImageDraw.Draw(rose_maske).ellipse([(R0[0] - p["rose_r"]) * SS, (R0[1] - p["rose_r"]) * SS, (R0[0] + p["rose_r"]) * SS, (R0[1] + p["rose_r"]) * SS], fill=255)
    rose_zeichnen(ds, R0[0], R0[1], p["rose_r"], SS, dl)
    sep_c, lil_c, rose_in = runter(sep), runter(lil), runter(rose_maske)

    # Rhumbenlinien: 16 Geraden durch die Rose + 16 durch einen zweiten Knoten (ohne Rose)
    rh = np.zeros((CH, CW), np.float32)
    knoten = [R0, F(*p["rose2"])]
    for ki, c in enumerate(knoten):
        for k in range(16):
            a = k * math.pi / 16
            ux, uy = math.cos(a), math.sin(a)
            dist = np.abs((xx - c[0]) * uy - (yy - c[1]) * ux)
            cov = np.clip(0.6 / 2 + 0.5 - dist, 0, 1)
            rh = np.maximum(rh, cov)
    innen_rahmen = ((fx > a2 + 4) & (fx < W - a2 - 4) & (fy > a2 + 4) & (fy < H - a2 - 4)).astype(np.float32)
    rh *= innen_rahmen * (1 - rose_in) * 0.22 * 1.6  # 0,6 px Linie deckt ≈ 0,6 → auf ≈22 % Tonwert

    deck = 1 - (1 - kueste) * (1 - wasserlinien) * (1 - rh) * (1 - sep_c) * (1 - huegel_c)
    # Federzittern: Tinte leicht verschieben (≈ feDisplacementMap Skala 1,5)
    jx = (fbm(rng, CW, CH, 28, 3) - 0.5) * 1.5
    jy = (fbm(rng, CW, CH, 28, 3) - 0.5) * 1.5
    deck = bilinear(deck, xx + jx, yy + jy)
    lil_c = bilinear(lil_c, xx + jx, yy + jy)
    # Tinte nicht ganz gleichmäßig (Federdruck)
    druck = 0.85 + 0.15 * fbm(rng, CW, CH, 120, 3)

    # ---- Papier ----
    wolken = fbm(rng, CW, CH, 340, 6, 0.55)
    # Fasern: kurze, anisotrope Rauschstriche in zwei Richtungen (nicht durchgehend → keine „Zeilen“)
    def faser(winkel, lx, ly):
        gross = int(max(CW, CH) * 1.5)
        g = rng.random((int(gross / ly) + 2, int(gross / lx) + 2)).astype(np.float32)
        im = Image.fromarray(g, "F").resize((gross, gross), Image.BICUBIC).rotate(winkel, Image.BILINEAR)
        o = (gross - CW) // 2, (gross - CH) // 2
        return np.asarray(im, np.float32)[o[1]:o[1] + CH, o[0]:o[0] + CW]
    fasern = faser(14, 22, 2.2) * 0.55 + faser(-31, 16, 2.0) * 0.45
    fasern = (fasern - fasern.mean()) / (fasern.std() + 1e-6)
    zahn = rng.random((CH, CW)).astype(np.float32)
    zahn = boxblur(zahn, 1)
    zahn = (zahn - zahn.mean()) / (zahn.std() + 1e-6)

    t = np.clip(0.5 + (wolken - 0.5) * 1.6, 0, 1)
    albedo = PERG_DUNKEL[None, None] * (1 - t[..., None]) * 0.35 + PERG_HELL[None, None] * (1 - 0.35 * (1 - t[..., None]))
    albedo = albedo * (1 + 0.06 * (wolken[..., None] - 0.5) * 2) * (1 + 0.03 * 0.33 * fasern[..., None]) * (1 + 0.012 * zahn[..., None])
    # Stockflecken
    for _ in range(5):
        cx, cy = P + rng.random() * W, P + rng.random() * H
        if np.hypot(cx - R0[0], cy - R0[1]) < p["rose_r"] * 1.3:
            cx = P + W - (cx - P)
        r = 10 + rng.random() * 30
        dd = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / r
        dd = dd * (0.8 + 0.4 * wolken)
        fleck = np.clip(1 - dd, 0, 1) ** 0.7 * 0.08 + np.exp(-((dd - 0.95) / 0.08) ** 2) * 0.06
        albedo *= (1 - fleck[..., None] * np.array([0.8, 1.0, 1.4], np.float32))
    # Falten (Licht-/Schattenpaar)
    for art, pos in p["falten"]:
        if art == "v":
            dd = fx - pos * W
        else:
            dd = fy - pos * H
        albedo *= (1 - 0.05 * np.exp(-(dd / 2.0) ** 2) + 0.025 * np.exp(-((dd - 3.5) / 3.0) ** 2) - 0.015 * np.exp(-((dd + 6) / 8) ** 2))[..., None]
    # Land: leicht wärmerer Ton
    land_s = boxblur(land, 2)
    albedo *= (1 - 0.05 * land_s[..., None] * np.array([0.6, 0.9, 1.4], np.float32))
    # Ränder gealtert → #6b4a26
    rand_d = np.minimum.reduce([fx, fy, W - fx, H - fy])
    rand_n = rand_d + (fbm(rng, CW, CH, 60, 4) - 0.5) * 40
    rand_t = np.clip(1 - rand_n / 55, 0, 1) ** 1.8
    albedo = albedo * (1 - rand_t[..., None]) + RAND[None, None] * rand_t[..., None]
    # Tinte
    k = (deck * druck * 0.70)[..., None]
    farbe = albedo * (1 - k) + TINTE[None, None] * k
    kl = (lil_c * druck * 0.85)[..., None]
    farbe = farbe * (1 - kl) + MESSING_TINTE[None, None] * kl
    # Licht: Lampenkegel oben rechts, Abfall zu den Ecken auf 25 %, leichte Wölbung
    L0 = F(*p["lampe"])
    dl_ = np.sqrt((xx - L0[0]) ** 2 + (yy - L0[1]) ** 2)
    dfar = np.sqrt((P - L0[0]) ** 2 + (P + H - L0[1]) ** 2)
    licht = 0.13 + 0.87 * np.exp(-(dl_ / (0.56 * dfar)) ** 2.0)
    licht *= 1 + 0.04 * np.exp(-(((fx - W / 2) / W) ** 2 + ((fy - H / 2) / H) ** 2) * 3)
    licht = licht * (1 - 0.5 * np.clip((-rand_d) / P, 0, 1))  # Überstand dunkel
    # Lampenlicht ist warm: im Abfall verliert Blau schneller als Rot (dunkle Ecken werden braun, nicht grau)
    warm = np.array([1.0, 0.93, 0.80], np.float32)
    rgb = farbe * (licht[..., None] ** np.array([0.95, 1.08, 1.32], np.float32)) * warm
    # sehr feines festes Korn gegen Banding (statisch!)
    korn = (rng.random((CH, CW)).astype(np.float32) - 0.5) * (1.6 / 255)
    rgb = np.clip(rgb + korn[..., None], 0, 1)
    os.makedirs(AUS, exist_ok=True)
    Image.fromarray((rgb * 255 + 0.5).astype(np.uint8), "RGB").save(os.path.join(AUS, f"karte-{name}.webp"), quality=94, method=6)

    # ---- Brandmaske m ----
    dmax = float(d.max())
    dn = np.clip(d / dmax, 0, 1)
    n_brand = fbm(rng, CW, CH, 150, 6, 0.55)
    rampe = np.clip(d / 40, 0, 1)
    s_rel = np.abs(s_near - s_rose) / float(np.linalg.norm([CW, CH]))
    m = 0.75 * dn ** 0.9 + 0.25 * (0.5 + (n_brand - 0.5) * 0.55) * rampe + 0.12 * np.clip(s_rel, 0, 1) * np.exp(-d / 160)
    m = boxblur(m, 1)
    gy, gx = np.gradient(m)
    g = np.sqrt(gx * gx + gy * gy)
    g = np.maximum(boxblur(g, 2), 2e-5)
    # Seite A (Polygon: verlängerte Linie + weit entfernte Punkte auf einer Seite)
    seite = Image.new("L", (CW * SS, CH * SS), 0)
    chord = lang[-1] - lang[0]
    nrm = np.array([chord[1], -chord[0]]) / np.linalg.norm(chord)
    poly = [tuple(v * SS) for v in lang] + [tuple((lang[-1] + nrm * weit) * SS), tuple((lang[0] + nrm * weit) * SS)]
    ImageDraw.Draw(seite).polygon(poly, fill=255)
    seite_c = runter(seite)
    m16 = np.clip(np.round(m * 65535), 0, 65535).astype(np.uint32)
    feld = np.stack([(m16 >> 8), (m16 & 255), np.round(seite_c * 255)], -1).astype(np.uint8)
    Image.fromarray(feld, "RGB").save(os.path.join(AUS, f"feld-{name}.png"), optimize=True)
    # |grad m| logarithmisch in 8 bit (2 % Stufen reichen für px-Breiten), G = langsame Glutvariation, B = Fransen
    glo, ghi = float(np.log(g.min())), float(np.log(g.max()))
    g8 = np.round((np.log(g) - glo) / (ghi - glo) * 255)
    franse = fbm(rng, CW, CH, 10, 3, 0.6)
    variation = fbm(rng, CW, CH, 90, 3, 0.5)
    rnd = np.stack([g8, np.round(variation * 255), np.round(franse * 255)], -1).astype(np.uint8)
    Image.fromarray(rnd, "RGB").save(os.path.join(AUS, f"rand-{name}.png"), optimize=True)

    # m entlang der Kurslinie (für das Wiederaufglühen der Messinglinie vor der Brandfront)
    ki = np.clip(np.round(kurs).astype(int), 0, [CW - 1, CH - 1])
    m_kurs = m[ki[:, 1], ki[:, 0]]
    geo = dict(W=W, H=H, P=P, CW=CW, CH=CH, L=float(L), glo=glo, ghi=ghi, mmax=float(m.max()), mmin=float(m.min()),
               start=[float(v) for v in S0], rose=[float(v) for v in R0], roseR=p["rose_r"],
               lampe=[float(v) for v in L0], normale=[float(v) for v in nrm],
               kurs=[[round(float(x), 2), round(float(y), 2)] for x, y in kurs],
               mKurs=[round(float(v), 5) for v in m_kurs])
    with open(os.path.join(AUS, f"geo-{name}.json"), "w") as fh:
        json.dump(geo, fh, separators=(",", ":"))
    print(name, "fertig", CW, CH, "L=%.0f" % L, "mmax=%.3f" % m.max())


if __name__ == "__main__":
    import sys
    for n in (sys.argv[1:] or FORMATE.keys()):
        baue(n, FORMATE[n])
