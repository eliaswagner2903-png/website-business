# Synchronprüfung Runde 2: liegt jedes Ereignisgeräusch mit seinem lautesten Punkt auf dem Ereignisframe – im fertigen Film?
# 1) Ereignisspur (mix2/sfx-ereignisse.wav, ohne Teppiche): lautester Punkt (Betrag, 2 ms geglättet) im Fenster
#    ±150 ms um den Ereignisframe → Abweichung je Ereignis.
# 2) Fertiger Ton (mix2/ton.wav) bzw. Tonspur des gerenderten Films (mp4): Versatz gegenüber der Mischung, gemessen
#    per Kreuzkorrelation in 12 Fenstern à 2 s (fängt AAC-Vorlauf, Remotion-Versatz usw.). Die Ereignisspur ist
#    linear in die Mischung summiert; ein Versatz kann nur global entstehen.
#    Gesamtabweichung je Ereignis = (1) + (2). Toleranz 1 Frame = 16,7 ms.
# Aufruf: python3 synchronpruefung.py mix2/sfx-ereignisse.wav mix2/ton.wav [film.mp4] [ausgabe.json]
import json, os, subprocess, sys, numpy as np
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# ZEITLEISTE=<pfad> wählt einen anderen Film (Uyghur: src/uyghur/zeitleiste.json, Ereignisse des Handyfilms = gemeinsame Tonspur);
# FLAECHIG=a,b nennt Ereignisse ohne Spitze (Rieseln, Rauschen), die nur gelistet, nicht bewertet werden.
Z = json.load(open(os.environ.get('ZEITLEISTE') or os.path.join(REPO, 'src/nachtfahrt/zeitleiste2.json')))
EV = Z['ereignisse'] if 'ereignisse' in Z else Z['formate']['P']['ereignisse']
FLAECHIG = set(filter(None, os.environ.get('FLAECHIG', '').split(',')))
SR = 48000
def lade(p):
    roh = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(roh, np.float32).astype(np.float64)
args = [a for a in sys.argv[1:] if not a.endswith('.json')]
aus = next((a for a in sys.argv[1:] if a.endswith('.json')), None)
sfx, ton = lade(args[0]), lade(args[1])
film = lade(args[2]) if len(args) > 2 else None
versatz = 0.0
if film is not None:
    lags = []
    for t0 in np.linspace(3, len(ton) / SR - 5, 12):
        i = int(t0 * SR); a = ton[i:i + 2 * SR]; b = film[i - 4800:i + 2 * SR + 4800]
        c = np.correlate(b, a, 'valid'); lags.append((np.argmax(c) - 4800) / SR)
    versatz = float(np.median(lags)); streu = float(np.max(np.abs(np.array(lags) - versatz)))
    print(f'Tonspur Film ↔ Mischung: Versatz {versatz * 1000:+.2f} ms (Streuung {streu * 1000:.2f} ms, 12 Fenster)')
k = int(0.002 * SR); glatt = lambda x: np.convolve(np.abs(x), np.ones(k) / k, 'same')
zeilen, maxab = [], 0.0
print(f"{'Ereignis':16s} {'Frame':>5s} {'Zeit s':>7s} {'Peak':>9s} {'gesamt':>9s}")
for name, fr in sorted(EV.items(), key=lambda x: x[1]):
    t = fr / 60; i = int(round(t * SR)); w = int(0.15 * SR)
    p = (np.argmax(glatt(sfx[i - w:i + w])) - w) / SR; ges = p + versatz
    ok = bool(abs(ges) <= 1 / 60) or name in FLAECHIG
    if name not in FLAECHIG: maxab = max(maxab, abs(ges))
    zeilen.append({'ereignis': name, 'frame': fr, 'zeit_s': round(t, 3), 'peak_abw_ms': round(p * 1000, 1), 'gesamt_ms': round(ges * 1000, 1), 'ok': ok})
    print(f"{name:16s} {fr:5d} {t:7.3f} {p * 1000:+8.1f}ms {ges * 1000:+8.1f}ms {'flächig' if name in FLAECHIG else 'ok' if ok else 'ABWEICHUNG'}")
print(f'max. Abweichung {maxab * 1000:.1f} ms, {sum(z["ok"] for z in zeilen)}/{len(zeilen)} innerhalb 1 Frame')
if aus: json.dump({'film_versatz_ms': round(versatz * 1000, 2), 'max_abweichung_ms': round(maxab * 1000, 1), 'ereignisse': zeilen}, open(aus, 'w'), ensure_ascii=False, indent=1)
