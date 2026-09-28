#!/usr/bin/env python3
"""Auftragslog: jeder Auftrag eine Zeile JSON in ops/auftraege.jsonl.

    python3 ops/log.py neu "Auftrag in einem Satz" [--von Elias] [--bereich front1]
    python3 ops/log.py fertig A-007 "Ergebnis in einem Satz" [--ausfuehrung "..."] [--ref PR#3]
    python3 ops/log.py status A-007 blockiert "Grund"
    python3 ops/log.py liste [--offen] [--n 15]
    python3 ops/log.py suche stripe
    python3 ops/log.py zeige A-007
    python3 ops/log.py kurz            (für den SessionStart-Hook: offene + letzte 5)

Felder: id, datum, von, bereich, auftrag, ausfuehrung, ergebnis, status (offen|laeuft|erledigt|blockiert), ref.
"""
import argparse
import json
import sys
from datetime import date
from pathlib import Path

DATEI = Path(__file__).with_name("auftraege.jsonl")
FELDER = ["id", "datum", "von", "bereich", "auftrag", "ausfuehrung", "ergebnis", "status", "ref"]
STATUS = {"offen", "laeuft", "erledigt", "blockiert"}


def laden():
    if not DATEI.exists():
        return []
    return [json.loads(z) for z in DATEI.read_text(encoding="utf-8").splitlines() if z.strip()]


def speichern(eintraege):
    text = "".join(json.dumps(e, ensure_ascii=False, separators=(",", ":")) + "\n" for e in eintraege)
    DATEI.write_text(text, encoding="utf-8")


def finde(eintraege, aid):
    for e in eintraege:
        if e["id"] == aid:
            return e
    sys.exit(f"Auftrag {aid} nicht gefunden")


def zeile(e):
    zeichen = {"erledigt": "✓", "laeuft": "✱", "blockiert": "!", "offen": "○"}.get(e["status"], "?")
    text = f"{zeichen} {e['id']} {e['datum']} [{e['bereich']}] {e['auftrag']}"
    if e.get("ergebnis"):
        text += f"  → {e['ergebnis']}"
    if e.get("ref"):
        text += f"  ({e['ref']})"
    return text


def main():
    p = argparse.ArgumentParser(description="Auftragslog")
    u = p.add_subparsers(dest="befehl", required=True)
    n = u.add_parser("neu"); n.add_argument("auftrag"); n.add_argument("--von", default="Elias")
    n.add_argument("--bereich", default="allgemein"); n.add_argument("--status", default="laeuft", choices=sorted(STATUS))
    f = u.add_parser("fertig"); f.add_argument("id"); f.add_argument("ergebnis")
    f.add_argument("--ausfuehrung", default=""); f.add_argument("--ref", default="")
    s = u.add_parser("status"); s.add_argument("id"); s.add_argument("status", choices=sorted(STATUS)); s.add_argument("grund", nargs="?", default="")
    l = u.add_parser("liste"); l.add_argument("--offen", action="store_true"); l.add_argument("--n", type=int, default=15)
    su = u.add_parser("suche"); su.add_argument("wort")
    z = u.add_parser("zeige"); z.add_argument("id")
    u.add_parser("kurz")
    a = p.parse_args()

    eintraege = laden()
    if a.befehl == "neu":
        nummer = max((int(e["id"][2:]) for e in eintraege), default=0) + 1
        e = dict.fromkeys(FELDER, "")
        e.update(id=f"A-{nummer:03d}", datum=date.today().isoformat(), von=a.von, bereich=a.bereich,
                 auftrag=a.auftrag, status=a.status)
        eintraege.append(e); speichern(eintraege); print(e["id"])
    elif a.befehl == "fertig":
        e = finde(eintraege, a.id)
        e.update(status="erledigt", ergebnis=a.ergebnis)
        if a.ausfuehrung:
            e["ausfuehrung"] = a.ausfuehrung
        if a.ref:
            e["ref"] = a.ref
        speichern(eintraege); print(zeile(e))
    elif a.befehl == "status":
        e = finde(eintraege, a.id); e["status"] = a.status
        if a.grund:
            e["ergebnis"] = a.grund
        speichern(eintraege); print(zeile(e))
    elif a.befehl == "liste":
        auswahl = [e for e in eintraege if not a.offen or e["status"] != "erledigt"]
        print("\n".join(zeile(e) for e in auswahl[-a.n:]) or "keine Einträge")
    elif a.befehl == "suche":
        w = a.wort.lower()
        print("\n".join(zeile(e) for e in eintraege if w in json.dumps(e, ensure_ascii=False).lower()) or "nichts gefunden")
    elif a.befehl == "zeige":
        print(json.dumps(finde(eintraege, a.id), ensure_ascii=False, indent=2))
    elif a.befehl == "kurz":
        offen = [e for e in eintraege if e["status"] != "erledigt"]
        letzte = [e for e in eintraege if e["status"] == "erledigt"][-5:]
        print("Auftragslog (ops/auftraege.jsonl) – offen:")
        print("\n".join(zeile(e) for e in offen) or "  keine")
        print("zuletzt erledigt:")
        print("\n".join(zeile(e) for e in letzte) or "  keine")
        print("Regel: jeden neuen Auftrag mit `python3 ops/log.py neu …` anlegen und mit `fertig` abschließen.")


if __name__ == "__main__":
    main()
