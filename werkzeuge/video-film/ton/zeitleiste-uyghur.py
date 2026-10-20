# Zeitleiste Werbefilm UYGHUR HAUS (A-118). Eine Quelle für Aufnahme, Bild, Untertitel und Geräusche.
# Grundsatz wie „Nachtfahrt“: die Stimme ist fest, das Bild folgt ihr. Zeiten in Sekunden Filmzeit, Frames bei 60 fps.
#   python3 zeitleiste-uyghur.py plan  → aufnahme/plan.json  (Halte und Fahrten der Aufnahme, Wok-Phase)
#   python3 zeitleiste-uyghur.py film  → <repo>/werkzeuge/video-film/src/uyghur/zeitleiste.json (nach der Aufnahme)
# Aufruf im Ordner vertrieb/uyghur-haus/video.
import json, os, sys
import numpy as np

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open('stimme-final/woerter.json'))
FPS, DAUER = 60, 60.0

def wi(text, n=0):  # Index des n-ten Worts mit genau diesem Text
    k = [i for i, w in enumerate(W) if w['w'] == text]
    return k[n]
s = lambda text, n=0: W[wi(text, n)]['s']  # Wortbeginn (s)
e = lambda text, n=0: W[wi(text, n)]['e']  # Wortende (s)

# ---------------- Wok-Phase ----------------
# Die Wok-Zeichnung der Seite läuft in einer 6-s-Schleife (CSS): Schwünge 10–16 % und 20–26 %, Wurf 33–40 %,
# Essen in der Luft 40–62 %, Flammenkuss 48 %, Ruhe 74–100 %. Das Essen hebt auf „Zeit.“ ab.
SCHLEIFE = 6.0
WOK_OFF = s('Zeit.') - 0.40 * SCHLEIFE      # Filmzeit t ↔ Schleifenphase (t − WOK_OFF) mod 6
phase = lambda t: (t - WOK_OFF) % SCHLEIFE

# ---------------- Bildplan (Filmzeit in s) ----------------
B = {}
B['zuenden'] = 0.30                          # Funke, Gas zündet (Vorspann, noch vor dem ersten Wort)
B['schwung1'] = WOK_OFF + 0.10 * SCHLEIFE + 0.21   # Spitze des ersten Schwungs (13,5 %)
B['schwung2'] = WOK_OFF + 0.20 * SCHLEIFE + 0.21   # zweiter Schwung (23,5 %)
B['wurf'] = WOK_OFF + 0.395 * SCHLEIFE      # Wok reißt hoch, Essen fliegt (39,5 %)
B['kuss'] = WOK_OFF + 0.48 * SCHLEIFE        # Flamme leckt am Essen
B['landung'] = WOK_OFF + 0.62 * SCHLEIFE     # Essen zurück im Wok
B['startEin'] = 4.90                         # erstes Bild der Startseiten-Aufnahme (Rückfahrt aus der großen Zeichnung)
B['rueckfahrt'] = [s('Willkommen'), s('Uyghur') + 0.05]   # große Zeichnung fährt ins Seitenfenster
B['wortmarke'] = s('Uyghur')
B['ueberFahrt'] = e('Haus.') + 0.25
B['fUeber'] = 1.5
B['teaserFahrt'] = s('Rind.') + 0.19
B['fTeaser'] = 0.95
B['karten'] = [s('Laghmen,') + 0.15, s('Polo') + 0.05, s('Manta,') + 0.05, s('Kawap') + 0.05]
B['klickKarte'] = e('Spieß.') + 0.20
B['karteEin'] = B['klickKarte'] + 0.30       # Speisekarte erscheint (Blende 0,25 s)
B['chipsFahrt'] = s('Karte') + 0.15
B['fChips'] = 1.2
B['filterAuf'] = s('mit', 1)                    # Ring auf „mit Allergenen“
B['fEmpf'] = 0.9
B['teilenFahrt'] = s('Bei') - 0.18
B['fTeilen'] = 1.4
B['chipGetraenke'] = e('drei.') + 0.15
B['fTee'] = 1.0
B['resEin'] = e('Tisch.') + 0.42             # Reservierung erscheint in der Pause vor „Ihren Tisch“
B['tag'], B['uhrzeit'], B['personen'] = s('Tag,'), s('Uhrzeit,'), s('Personen.')
B['danke'] = s('Bestätigung.') + 0.10
B['merksatz'] = [s('Würzig.'), s('Warm.'), s('Willkommen.')]
B['besuchEin'] = e('Willkommen.') + 0.25
B['route'] = s('Göppingen.')
B['adresse'] = s('Lange')
B['zeiten'] = s('Täglich')
B['knopf'] = s('Wir', 1)

def plan():
    tap = 0.35
    p = {
        'wokT0': round((phase(B['startEin']) - 1 / FPS) * 1000, 3),
        'hero': round(B['ueberFahrt'] - B['startEin'], 3), 'hero2': 0,
        'fUeber': B['fUeber'], 'ueber': round(B['teaserFahrt'] - (B['ueberFahrt'] + B['fUeber']), 3),
        'fTeaser': B['fTeaser'], 'teaserHalt': 0.05, 'karte': 2.8,
        'karteHero': round(B['chipsFahrt'] - B['karteEin'], 3), 'fChips': B['fChips'],
        'chipsHalt': round(B['filterAuf'] - tap - (B['chipsFahrt'] + B['fChips']), 3), 'filterAuf': 0.5, 'filter': 0.25,
        'fEmpf': B['fEmpf'], 'empfehlung': 0.6, 'fTeilen': B['fTeilen'],
        'teilen': round(B['chipGetraenke'] - tap - (B['teilenFahrt'] + B['fTeilen']), 3), 'fTee': B['fTee'], 'tee': 2.0,
        'res': 0.55, 'fRes': 1.2, 'kalHalt': 0.6, 'resWarten': 0.2, 'schritt': 0.1, 'danke': 3.5,
        'besuchHover': round(B['route'] - B['besuchEin'], 3), 'besuch': round(DAUER + 0.5 - B['besuchEin'], 3),
    }
    os.makedirs('aufnahme', exist_ok=True)
    json.dump(p, open('aufnahme/plan.json', 'w'), indent=1)
    print(json.dumps(p))

# ======================= Film (nach der Aufnahme) =======================
# Jede Ansicht = eine Aufnahme mit Ankern (Filmzeit s, Aufnahmebild). Zwischen zwei Ankern gilt der „elastische Halt“:
# bewegte Bilder laufen 1:1, Unterschiede schlucken die Halte (Bilder, die ihrem Vorgänger gleichen, bewegung.json == 0).
# Reicht das nicht, läuft der Abschnitt gleichmäßig schneller (Zeitraffer, nur in der Reservierungs-Montage geplant).
# Zu schnelle Seitenfahrten (> ~700 px/s im Bild) werden zu Blenden: Ansicht A steht, Ansicht B blendet darüber ein.
BEW = json.load(open(os.path.join(REPO, 'src/uyghur/bewegung.json')))
F = lambda t: int(round(t * FPS))
WARN = []

def elastisch(shot, fa, ca, fb, cb):
    """Filmframes [fa, fb) → Aufnahmebilder; fb zeigt danach cb (nächster Abschnitt)."""
    d, n, L = BEW[shot], fb - fa, list(range(ca, cb))
    if n <= 0: raise ValueError(f'{shot}: Anker nicht aufsteigend ({fa}->{fb})')
    if n == len(L): return L, 1.0
    # Läufe gleicher Bilder: Positionen k (> 0) mit d[L[k]] == 0
    laeufe, k = [], 1
    while k < len(L):
        if d[L[k]] == 0:
            k0 = k
            while k < len(L) and d[L[k]] == 0: k += 1
            laeufe.append([k0, k])
        else: k += 1
    if n > len(L):
        if laeufe:
            k0, k1 = max(laeufe, key=lambda r: r[1] - r[0])
            return L[:k0] + [L[k0]] * (n - len(L)) + L[k0:], 1.0
        if d[cb - 1] > 0.02 if cb - 1 < len(d) else False: WARN.append(f'{shot} {ca}->{cb}: Halt auf bewegtem Bild {cb - 1}')
        return L + [cb - 1] * (n - len(L)), 1.0
    weg = set(); zuviel = len(L) - n
    for k0, k1 in sorted(laeufe, key=lambda r: r[0] - r[1]):  # längste Läufe zuerst, aus der Mitte
        mitte = list(range(k0, k1)); mitte.sort(key=lambda k: abs(k - (k0 + k1) / 2))
        for k in mitte:
            if len(weg) == zuviel: break
            weg.add(k)
    rest = [c for k, c in enumerate(L) if k not in weg]
    if len(rest) == n: return rest, 1.0
    idx = np.round(np.linspace(0, len(rest) - 1, n)).astype(int)
    return [rest[i] for i in idx], len(rest) / n

def ansicht(shot, anker, von, bis, ein=None, nach='lauf', key=None):
    f0, f1 = F(von), F(bis); fa = [F(t) for t, c in anker]
    assert f0 <= fa[0] and fa == sorted(fa), (shot, f0, fa)
    src, tempo = [anker[0][1]] * (fa[0] - f0), []
    for k in range(len(anker) - 1):
        x, r = elastisch(shot, fa[k], anker[k][1], fa[k + 1], anker[k + 1][1]); src += x
        if r > 1: tempo.append([fa[k], fa[k + 1], round(r, 2)])
    cL, n, N = anker[-1][1], f1 - fa[-1], len(BEW[shot])
    src += [min(cL + i, N - 1) for i in range(n)] if nach == 'lauf' else [cL] * n
    return {'key': key or shot, 'shot': shot, 'von': f0, 'bis': f1, 'ein': [F(ein[0]), F(ein[1])] if ein else None, 'src': src[:f1 - f0], 'tempo': tempo}

def ruhig(shot, c, n=10):
    """erstes Bild nach c, ab dem n Bilder lang nichts mehr läuft (Übergang fertig)"""
    d = BEW[shot]
    return next(k for k in range(c + 1, len(d) - n) if max(d[k + 1:k + 1 + n]) < 0.02)

def marks(shot):
    return {m['name']: m['frame'] for m in json.load(open(f'aufnahme/{shot}.marks.json'))['marks']}

RECTS = {}
def rect(shot, key, src):
    if shot not in RECTS: RECTS[shot] = json.load(open(f'aufnahme/{shot}.rects.json'))['rects']
    e = RECTS[shot][key][0]
    for x in RECTS[shot][key]:
        if x[0] <= src: e = x
        else: break
    return None if e[1] is None else [round(v, 2) for v in e[1:5]]

def film():
    T = dict(B)
    # Feinzeiten des Films (s); Wortzeiten aus woerter.json
    T['klickKarte'] = e('Spieß.') + 0.20
    T['blendeKarte'] = [T['klickKarte'] + 0.02, T['klickKarte'] + 0.37]
    T['blendeEmpf'] = [29.18, 29.55]
    T['blendeTeilen'] = [s('Bei') - 0.18, s('Bei') + 0.20]
    T['chipGetraenke'] = e('drei.') + 0.16
    T['blendeTee'] = [T['chipGetraenke'] + 0.15, T['chipGetraenke'] + 0.55]
    T['blendeRes'] = [e('Tisch.') + 0.26, e('Tisch.') + 0.61]
    T['blendeDanke'] = [s('Wir') + 0.14, s('Bestätigung.') - 0.04]
    T['fensterAus'] = [e('Bestätigung.') + 0.15, e('Bestätigung.') + 0.65]
    T['merksatz'] = [s('Würzig.'), s('Warm.'), s('Willkommen.')]
    T['merksatzAus'] = [e('Willkommen.') + 0.10, e('Willkommen.') + 0.50]
    T['fensterBEin'] = [e('Willkommen.') + 0.34, e('Willkommen.') + 0.79]
    T['markeEin'] = [s('Uyghur', 1) - 0.12, s('Uyghur', 1) + 0.38]
    T['knopf'] = s('Wir', 1)
    T['wokAus'] = [B['rueckfahrt'][1], B['rueckfahrt'][1] + 0.20]
    T['fensterAEin'] = [s('Willkommen'), s('Willkommen') + 0.45]
    out = {'dauer': F(DAUER), 'fps': FPS, 'wokOff': round(WOK_OFF, 4), 'T': {}, 'formate': {}}
    for q in ('D', 'P'):
        mS, mK, mR, mB = marks(f'{q}-START'), marks(f'{q}-KARTE'), marks(f'{q}-RES'), marks(f'{q}-BESUCH')
        S_, K_, R_, B_ = f'{q}-START', f'{q}-KARTE', f'{q}-RES', f'{q}-BESUCH'
        frei = lambda shot, c: next(k for k in range(c, len(BEW[shot])) if BEW[shot][k + 1] > 0.05)  # letztes Bild vor der nächsten Bewegung
        vorFahrt = lambda shot, c: c - 1  # Bild vor dem ersten Fahrtbild
        A = []
        # Start: Hero 1:1 ab startEin (Wok-Phase), Über-uns-Fahrt, Halt; Blende zur Auswahl; vier Karten, Klick
        A.append(ansicht(S_, [(B['startEin'], 0), (B['ueberFahrt'], mS['ueber.fahrt']), (B['ueberFahrt'] + B['fUeber'], mS['ueber']),
                              (B['teaserFahrt'], vorFahrt(S_, mS['teaser.fahrt']))], B['startEin'], B['teaserFahrt'] + 0.40, nach='halt', key='start'))
        A.append(ansicht(S_, [(B['teaserFahrt'] + 0.40, mS['teaser'])] + [(t, mS[f'karte.{i + 1}']) for i, t in enumerate(B['karten'])] +
                         [(T['klickKarte'], mS['klick.karte'] - 1)], B['teaserFahrt'], T['blendeKarte'][1], ein=(B['teaserFahrt'], B['teaserFahrt'] + 0.40), nach='halt', key='auswahl'))
        # Speisekarte: Chips, Allergen-Filter, Blende Empfehlung, Blende Teilen, Getränke-Chip, Blende Tee
        k0 = T['blendeKarte'][1]
        A.append(ansicht(K_, [(k0, 0), (B['chipsFahrt'], mK['chips.fahrt']), (B['chipsFahrt'] + B['fChips'], mK['chips']), (B['filterAuf'], mK['filter.auf']),
                              (s('und', 2), mK['filter.F']), (T['blendeEmpf'][0], vorFahrt(K_, mK['empfehlung.fahrt']))],
                         T['blendeKarte'][0], T['blendeEmpf'][1], ein=T['blendeKarte'], nach='halt', key='karte'))
        A.append(ansicht(K_, [(T['blendeEmpf'][1], mK['empfehlung']), (T['blendeTeilen'][0], vorFahrt(K_, mK['teilen.fahrt']))],
                         T['blendeEmpf'][0], T['blendeTeilen'][1], ein=T['blendeEmpf'], nach='halt', key='empfehlung'))
        A.append(ansicht(K_, [(T['blendeTeilen'][1], mK['teilen']), (T['chipGetraenke'], mK['chip.getraenke'])],
                         T['blendeTeilen'][0], T['blendeTee'][1], ein=T['blendeTeilen'], nach='halt', key='teilen'))
        A.append(ansicht(K_, [(T['blendeTee'][1], mK['tee'])], T['blendeTee'][0], T['blendeRes'][1], ein=T['blendeTee'], nach='halt', key='tee'))
        # Reservierung: Fahrt zum Kalender, Tag/Uhrzeit/Personen auf ihre Wörter, Halt im Kontaktschritt (vor dem ersten Tipp),
        # dann Blende auf die fertige Bestätigung („Danke“) zu „Wir melden uns zur Bestätigung“ (ruhiger als ein Zeitraffer)
        r0 = T['blendeRes'][1]
        tK = B['personen'] + (mR['kontakt'] - 1 - mR['personen']) / FPS
        A.append(ansicht(R_, [(r0, 0), (r0 + 0.55, mR['res.fahrt']), (r0 + 1.75, mR['kalender']), (B['tag'], mR['tag']), (B['uhrzeit'], mR['uhrzeit']),
                              (B['personen'], mR['personen']), (tK, mR['kontakt'] - 1)], T['blendeRes'][0], T['blendeDanke'][1], ein=T['blendeRes'], nach='halt', key='res'))
        cD = ruhig(R_, mR['senden'])
        A.append(ansicht(R_, [(T['blendeDanke'][1], cD)], T['blendeDanke'][0], T['fensterAus'][1], ein=T['blendeDanke'], key='danke'))
        # Schlussbild: Besuch (Öffnungszeiten, Adresse, Route)
        b0 = T['fensterBEin'][0]
        ank = [(b0, 0)] + ([(B['route'], mB['route'])] if 'route' in mB else [])
        A.append(ansicht(B_, ank, b0, DAUER, ein=T['fensterBEin'], key='besuch'))
        # Überlagerungen: Rechteck (CSS-px der Aufnahme) zum Zeitpunkt t
        def bei(key, t):
            f = F(t)
            for a in reversed(A):
                if a['von'] <= f < a['bis']: return a, a['src'][f - a['von']]
            raise ValueError(key)
        U = []
        def ueber(art, key, t, dauer=None):
            a, c = bei(key, t)
            r = rect(a['shot'], key, c)
            if r is None: WARN.append(f'{q}: {key} bei {t:.2f} s nicht sichtbar (Bild {c})'); return
            U.append({'art': art, 'key': key, 'f': F(t), 'ansicht': a['key'], 'r': r, **({'bis': F(t + dauer)} if dauer else {})})
        ueber('ziel', 'wok', B['rueckfahrt'][1])  # Zielrechteck der Rückfahrt (große Zeichnung → Startseite)
        ueber('glanz', 'wortmarke', s('Uyghur'))
        for k, w in (('w.seide', 'Seidenstraße.'), ('w.kreuz', 'Kreuzkümmel,'), ('w.chili', 'Chili,'), ('w.lamm', 'Lamm'), ('w.rind', 'Rind.')):
            ueber('strich', k, s(w))
        ueber('ring', 'g5.rec', s('Empfehlungen.') + 0.16)
        ueber('ring', 'g20.port', s('zwei'))
        ueber('ring', 'g21.meta', s('drei.'))
        ueber('ring', 'tee', s('Kanne'))
        ueber('ring', 'adresse', s('Lange'))
        ueber('ring', 'zeiten', s('Täglich'))
        # Ereignisframes (Geräusch-Peak = Bildereignis)
        ev = {'zuenden': F(B['zuenden']), 'wurf': F(B['wurf']), 'kuss': F(B['kuss']),
              'gewuerz1': F(s('Kreuzkümmel,')), 'gewuerz2': F(s('Chili,')),
              **{f'karte{i + 1}': F(t) for i, t in enumerate(B['karten'])}, 'klickKarte': F(T['klickKarte']), 'blattKarte': F(T['blendeKarte'][0] + 0.12),
              'filterAuf': F(B['filterAuf']), 'filterF': F(s('und', 2)), 'empfehlung': F(s('Empfehlungen.') + 0.16 + 0.30),
              'portion': F(s('zwei') + 0.30), 'chipGetraenke': F(T['chipGetraenke']), 'tee': F(s('Tee')), 'blattRes': F(T['blendeRes'][0] + 0.12),
              'tag': F(B['tag']), 'uhrzeit': F(B['uhrzeit']), 'personen': F(B['personen']), 'danke': F(T['blendeDanke'][1]),
              'merk1': F(T['merksatz'][0]), 'merk2': F(T['merksatz'][1]), 'merk3': F(T['merksatz'][2]),
              'adresse': F(s('Lange') + 0.30), 'zeiten': F(s('Täglich') + 0.30), 'knopf': F(T['knopf'] + 0.30)}
        if 'route' in mB: ev['route'] = F(B['route'])
        out['formate'][q] = {'ansichten': A, 'ueber': U, 'ereignisse': ev}
        for a in A:
            if a['tempo']: print(q, a['key'], 'Zeitraffer', a['tempo'])
    out['T'] = {k: ([F(x) for x in v] if isinstance(v, list) else F(v)) for k, v in T.items()}
    # Musik (Take 1): Einsatz des Ensembles (Aufnahme 4,83 s) auf „Willkommen“, Ausstieg auf „Würzig.“, Wiedereinsatz auf „Uyghur“ (Schluss)
    out['musik'] = {'einsatz_src': 4.83, 'versatz': round(s('Willkommen') - 0.02 - 4.83, 3), 'aus': round(s('Würzig.') - 0.02, 3),
                    'wieder': round(s('Uyghur', 1) - 0.02, 3), 'ausklang': [57.4, DAUER]}
    json.dump(W, open(os.path.join(REPO, 'src/uyghur/woerter.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
    ziel = os.path.join(REPO, 'src/uyghur/zeitleiste.json')
    json.dump(out, open(ziel, 'w'), ensure_ascii=False, separators=(',', ':'))
    print('ok', ziel, os.path.getsize(ziel), 'Bytes')
    for w in WARN: print('WARNUNG', w)

if __name__ == '__main__':
    {'plan': plan, 'film': film}[sys.argv[1]]()
