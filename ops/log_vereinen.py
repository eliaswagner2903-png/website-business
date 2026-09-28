#!/usr/bin/env python3
"""Hält das Auftragslog nach einem Merge sauber: jede Auftrags-ID genau einmal.

GitHub ignoriert beim Mergen im Browser den union-Treiber aus .gitattributes. Deshalb vor dem Merge eines PRs
lokal `git merge origin/main` ausführen und danach `python3 ops/log_vereinen.py && git add ops/auftraege.jsonl`.
- Bei Konflikt: beide Seiten nach ID vereinen.
- Ohne Konflikt (lokal hat union gemergt): doppelte IDs bereinigen.
Bei gleicher ID gewinnt der weiter fortgeschrittene Status (erledigt > blockiert > laeuft > offen),
bei gleichem Status der Eintrag mit mehr Inhalt.
`--pruefen` ändert nichts und endet mit Fehler, wenn eine ID doppelt vorkommt (für CI).
"""
import json, subprocess, sys

PFAD = 'ops/auftraege.jsonl'
RANG = {'offen': 0, 'laeuft': 1, 'blockiert': 2, 'erledigt': 3}

def besser(a, b):
    ea, eb = json.loads(a), json.loads(b)
    return a if (RANG.get(ea.get('status'), 0), len(a)) >= (RANG.get(eb.get('status'), 0), len(b)) else b

def seite(n):
    r = subprocess.run(['git', 'show', f':{n}:{PFAD}'], capture_output=True, text=True)
    return None if r.returncode else r.stdout.splitlines()

def vereinen(zeilen):
    eintraege = {}
    for z in zeilen:
        if not z.strip(): continue
        i = json.loads(z)['id']
        eintraege[i] = besser(eintraege[i], z) if i in eintraege else z
    return eintraege

if '--pruefen' in sys.argv:
    ids = [json.loads(z)['id'] for z in open(PFAD) if z.strip()]
    doppelt = sorted({i for i in ids if ids.count(i) > 1})
    if doppelt: sys.exit(f'Doppelte Auftrags-IDs: {", ".join(doppelt)} → python3 ops/log_vereinen.py')
    print(f'Auftragslog sauber: {len(ids)} Aufträge, keine doppelte ID'); sys.exit()

main, eigen = seite(3), seite(2)
zeilen = (main + eigen) if main is not None and eigen is not None else open(PFAD).read().splitlines()
eintraege = vereinen(zeilen)
with open(PFAD, 'w') as f:
    f.write('\n'.join(eintraege[k] for k in sorted(eintraege)) + '\n')
print(f'{len(eintraege)} Aufträge vereint, letzter: {max(eintraege)}')
