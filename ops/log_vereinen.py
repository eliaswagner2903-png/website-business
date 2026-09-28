#!/usr/bin/env python3
"""Löst einen Merge-Konflikt im Auftragslog: vereint beide Seiten nach Auftrags-ID.

GitHub ignoriert beim Mergen im Browser den union-Treiber aus .gitattributes. Deshalb vor dem Merge eines PRs
lokal `git merge origin/main` ausführen und bei Konflikt: `python3 ops/log_vereinen.py && git add ops/auftraege.jsonl`.
Bei gleicher ID gewinnt main (dort stehen die neueren Status), nur fehlende IDs kommen vom eigenen Branch.
"""
import json, subprocess, sys

PFAD = 'ops/auftraege.jsonl'
def seite(n):
    r = subprocess.run(['git', 'show', f':{n}:{PFAD}'], capture_output=True, text=True)
    if r.returncode: sys.exit(f'Kein Konflikt in {PFAD} (Stufe {n} fehlt).')
    return r.stdout.splitlines()

eintraege = {}
for zeile in seite(3):  # main
    eintraege[json.loads(zeile)['id']] = zeile
for zeile in seite(2):  # eigener Branch
    eintraege.setdefault(json.loads(zeile)['id'], zeile)
with open(PFAD, 'w') as f:
    f.write('\n'.join(eintraege[k] for k in sorted(eintraege)) + '\n')
print(f'{len(eintraege)} Aufträge vereint, letzter: {max(eintraege)}')
