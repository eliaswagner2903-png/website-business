# Zeitleiste „Nachtfahrt“ Runde 2: aus den Wortzeiten (stimme2-final/woerter.json) die Bildzeiten und Ereignisframes
# ableiten. Eine Quelle für Bild (src/nachtfahrt/zeitleiste2.json → daten.ts) und Ton (geraeusche2.py).
# Regel: Ereignisframe = Frame, in dem das Bildereignis passiert (Reiterklick, Häkchen sitzt, Stempel trifft …);
# die Geräuschspur legt den lautesten Punkt der Datei genau darauf. Aufruf im Ordner scratchpad/video.
import json, os, sys
W = json.load(open('stimme2-final/woerter.json'))
F = lambda i: round(W[i]['s'] * 60)          # Wortbeginn als Frame
E = lambda i: round(W[i]['e'] * 60)          # Wortende als Frame
def wi(text, n=0):                           # Index des n-ten Worts mit diesem Text
    k = [i for i, w in enumerate(W) if w['w'] == text]
    return k[n]

DAUER = 3600
sk = {'zuenden': 30, 'erst': 36, 'kurs': F(wi('Kurs.')), 'dann': F(wi('Dann')), 'fahrt': F(wi('Fahrt!'))}
sk['weg'] = sk['fahrt'] + 84; sk['ende'] = sk['fahrt'] + 98
ihre = F(wi('Ihre'))
T = {
    'seekarteEnde': sk['ende'],
    'matchStart': sk['ende'] + 4, 'matchEnde': sk['ende'] + 42,       # Kajütenbild fliegt auf „Ihre Website“ ins Fenster
    'seiteEin': [sk['ende'] + 38, sk['ende'] + 58], 'driftAb': sk['ende'] + 60,
    'heroWort': [sk['ende'] + 46, sk['ende'] + 52, F(wi('Klar')), F(wi('auf')), F(wi('Kurs.', 1))],
    'heroAus': F(wi('Schnell')) - 70,
    'scroll3': F(wi('Werkstätten')),                                   # Desktop-Scrollfahrt beginnt auf „Werkstätten“
    'blende3': [F(wi('Werkstätten')), F(wi('Werkstätten')) + 30],      # Handy: weiche Blende hero → lei
    'blende3b': [F(wi('Klar', 1)) - 15, F(wi('Klar', 1)) - 1],         # Handy: lei → lei3 in der Pause vor „Klar“
    'blende4': [E(wi('lesbar.')) + 2, E(wi('lesbar.')) + 26],          # Pause nach „lesbar.“
    'blende4b': [E(wi('entwerfe,')) - 6, F(wi('baue')) - 1],           # Handy: Ablauf 01/02 → 03/04 zwischen „entwerfe“ und „baue“
    'blatt5': [E(wi('prüfe.')) + 1, F(wi('Uhrmacherei.'))],            # Blatt fertig auf „Uhrmacherei“
    'musterEin': [E(wi('prüfe.')) - 17, E(wi('prüfe.')) + 1],
    'reiter': {'edel': F(wi('Uhrmacherei.')), 'norvak': F(wi('Präzisionswerkzeuge.')), 'glut': F(wi('Restaurant.')), 'laut': F(wi('Studio.'))},
    'blende6': [E(wi('Idee.')) + 4, E(wi('Idee.')) + 28],              # Kompass nach „Idee.“
    'musterAus': [E(wi('Idee.')) + 4, E(wi('Idee.')) + 22],
    'pendel': [E(wi('Idee.')) + 30, F(wi('besteht:'))],                 # Nadel steht still auf „besteht“
    'haken': [F(wi('Tempo,')), F(wi('Barrierefreiheit,')), F(wi('Datenschutz')), F(wi('Sicherheit.'))],
    'glocke': E(wi('Sicherheit.')) + 6,                                # alle Prüfungen bestanden: Glasen
    'fensterAus': [E(wi('Sicherheit.')) + 4, F(wi('Gebaut.')) - 6],
    'merk': [F(wi('Gebaut.')), F(wi('Geprüft.')), F(wi('Gepflegt.'))],
    'merksatzAus': [E(wi('Gepflegt.')) + 8, F(wi('Und')) + 2],
    'kiel': [F(wi('Start?')), E(wi('Bord.')) + 6],
    'liste': [F(wi('Hosting,')), F(wi('Wartung,')), F(wi('Pflege,')), F(wi('Änderung,')), F(wi('vieles'))],
    'listeAus': [F(wi('Kein')) - 18, F(wi('Kein'))],
    'partner': F(wi('Partnerschaft')),
    'laterneAus': [E(wi('Reise.')) - 4, E(wi('Reise.')) + 16],
    'fensterBEin': [E(wi('Reise.')) + 18, E(wi('Reise.')) + 42],
    'markeEin': [E(wi('Reise.')) + 46, E(wi('Reise.')) + 66],
    'knopfEin': [F(wi('Gespräch.')) - 14, F(wi('Gespräch.')) + 6],     # Knopf steht auf „Gespräch“
}
T['ring'] = [T['knopfEin'][1] + 2, T['knopfEin'][1] + 58]
T['blende10'] = [T['ring'][1], T['ring'][1] + 36]
T['kuehlen'] = [T['ring'][1], T['ring'][1] + 50]
T['steht'] = T['ring'][1] + 55
# Ereignisse für die Geräuschspur (Frame, an dem das Bildereignis passiert)
EV = {
    'zuenden': sk['zuenden'] + 6, 'kursrose': sk['kurs'], 'kartenriss': sk['fahrt'], 'landung': T['matchEnde'],
    'glanz_handy': F(wi('Handy.')) + 4, 'glanz_aufgebaut': F(wi('aufgebaut.')) + 4, 'glanz_google': F(wi('Google')) + 4,
    'etappe1': F(wi('erzählen')) + 5, 'etappe2': F(wi('entwerfe,')) + 5, 'etappe3': F(wi('baue')) + 5, 'etappe4': F(wi('prüfe.')) + 5,
    'blatt': round(T['blatt5'][0] + 0.45 * (T['blatt5'][1] - T['blatt5'][0])),
    'reiter_norvak': T['reiter']['norvak'], 'reiter_glut': T['reiter']['glut'], 'reiter_laut': T['reiter']['laut'],
    'nadel_steht': T['pendel'][1],
    'haken1': T['haken'][0], 'haken2': T['haken'][1], 'haken3': T['haken'][2], 'haken4': T['haken'][3],
    'glocke': T['glocke'],
    'stempel1': T['merk'][0], 'stempel2': T['merk'][1], 'stempel3': T['merk'][2],
    'liste1': T['liste'][0], 'liste2': T['liste'][1], 'liste3': T['liste'][2], 'liste4': T['liste'][3], 'liste5': T['liste'][4],
    'partner': T['partner'], 'ring_zu': T['ring'][1],
}
# Glanzstreif: Mitte der Wischbewegung liegt auf dem Ereignis
T['glanz'] = [EV['glanz_handy'], EV['glanz_aufgebaut'], EV['glanz_google']]
T['etappe'] = [EV['etappe1'], EV['etappe2'], EV['etappe3'], EV['etappe4']]
ziel = sys.argv[1] if len(sys.argv) > 1 else '/home/user/website-business/werkzeuge/video-film/src/nachtfahrt/zeitleiste2.json'
json.dump({'dauer': DAUER, 'seekarte': sk, 'T': T, 'ereignisse': EV}, open(ziel, 'w'), ensure_ascii=False, indent=1)
print(json.dumps(EV))
