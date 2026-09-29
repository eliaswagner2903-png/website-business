#!/usr/bin/env python3
"""Übernimmt die Speisekarte (Nummern, Namen, Kennzeichnungen, Preise, Prüfhinweise) aus der maßgeblichen Quelle
kunden/urfa-sofrasi/werkzeuge/seiten.py nach inhalt/speisekarte.json – nur DATEN, ohne das fremde Skript auszuführen
(FEHLER.md Nr. 32). Preise werden nicht angefasst.

    python3 werkzeuge/speisekarte-uebernehmen.py

Der Test tests/speisekarte.test.mjs beweist danach, dass jede Position (Nr., Name, Preis, Menge, Kennzeichnung)
exakt mit kunden/urfa-sofrasi/public/speisekarte.htm übereinstimmt.
"""
import ast
import json
from pathlib import Path

HIER = Path(__file__).resolve().parent.parent
QUELLE = HIER.parent / "urfa-sofrasi" / "werkzeuge" / "seiten.py"
ZIEL = HIER / "inhalt" / "speisekarte.json"

baum = ast.parse(QUELLE.read_text(encoding="utf-8"))
kategorien, pruefen, tuerkisch = [], {}, []
for knoten in baum.body:
    if isinstance(knoten, ast.Expr) and isinstance(knoten.value, ast.Call) and getattr(knoten.value.func, "id", "") == "cat":
        c = knoten.value
        pos = [ast.literal_eval(a) for a in c.args]
        kw = {k.arg: ast.literal_eval(k.value) for k in c.keywords}
        cid, titel = pos[0], pos[1]
        tr = pos[2] if len(pos) > 2 else kw.get("tr")
        notiz = pos[3] if len(pos) > 3 else kw.get("note")
        items = pos[4] if len(pos) > 4 else kw.get("items", [])
        subs = kw.get("subs", {})
        kategorien.append({
            "id": cid, "titel": titel, "tr": tr, "notiz": notiz,
            "zwischen": subs,
            "gerichte": [{"nr": it[0], "name": it[1], "de": it[2], "kennz": it[3], "preis": it[4],
                          **({"menge": it[5]} if len(it) > 5 else {})} for it in items],
        })
    elif isinstance(knoten, ast.Assign) and getattr(knoten.targets[0], "id", "") == "FLAGS":
        pruefen = ast.literal_eval(knoten.value)
    elif isinstance(knoten, ast.Assign) and getattr(knoten.targets[0], "id", "") == "TURKISH":
        tuerkisch = sorted(ast.literal_eval(knoten.value))

assert len(kategorien) == 11, len(kategorien)
anzahl = sum(len(k["gerichte"]) for k in kategorien)
ZIEL.parent.mkdir(exist_ok=True)
ZIEL.write_text(json.dumps({
    "quelle": "kunden/urfa-sofrasi/werkzeuge/seiten.py (= speisekarte.pdf, Stand 05/2025) – nicht von Hand ändern",
    "tuerkische_kategorien": tuerkisch,
    "pruefen": pruefen,
    "kategorien": kategorien,
}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(f"ok – {len(kategorien)} Kategorien, {anzahl} Positionen → {ZIEL.relative_to(HIER)}")
