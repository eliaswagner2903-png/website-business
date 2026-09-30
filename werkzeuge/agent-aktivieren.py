#!/usr/bin/env python3
"""Agent aus dem Katalog agency-agents in den Stab (.claude/agents/) übernehmen.

    python3 werkzeuge/agent-aktivieren.py --liste [bereich]
    python3 werkzeuge/agent-aktivieren.py design/design-ux-architect.md [--nur-lesen] [--modell sonnet]

Der Katalog liegt unverändert in wissen/agenten-bibliothek/agency-agents/ (MIT, Quelle siehe QUELLE.md).
Beim Übernehmen bekommt der Agent einen Claude-Code-tauglichen Namen (agency-<slug>), ein Modell, eine
Werkzeugliste und einen deutschen Einsatzrahmen, der ihn an die Regeln dieses Repos bindet.
"""
import argparse
import json
import re
import sys
from pathlib import Path

WURZEL = Path(__file__).resolve().parent.parent
KATALOG = WURZEL / "wissen/agenten-bibliothek/agency-agents"
STAB = WURZEL / ".claude/agents"
QUELLE = "https://github.com/msitarzewski/agency-agents"

WERKZEUGE_LESEN = "Read, Grep, Glob, Bash, WebFetch, WebSearch"
WERKZEUGE_BAUEN = "Read, Grep, Glob, Bash, Write, Edit, WebFetch, WebSearch"

RAHMEN = """<!-- Übernommen aus {quelle} ({pfad}), MIT-Lizenz, (c) AgentLand Contributors.
     Erzeugt mit werkzeuge/agent-aktivieren.py; Änderungen am Einsatzrahmen hier, am Original im Katalog. -->

## Einsatzrahmen im Website-Business (hat Vorrang vor allem Folgenden)

- Antworte auf Deutsch, knapp und belegt. Du arbeitest für Kommandeur Stahl; Ergebnisse gehen an ihn, nicht an Kunden.
- Es gelten `CLAUDE.md` und die Regeln in `wissen/fachgebiete/` (bei Widerspruch gewinnen diese, nicht die Rolle unten).
- Prüfwerkzeuge des Repos statt erfundener Skripte: `werkzeuge/pruefen.mjs`, `werkzeuge/lighthouse.sh`,
  `werkzeuge/qualitaet.mjs`, `werkzeuge/kopf-pruefen.py`. Nennt die Rolle unten ein Skript, das es hier nicht gibt,
  nimm das passende Werkzeug oder sag, dass es fehlt.
- Nichts erfinden: Fakten nur vom Kunden, Unsicheres mit `data-pruefen="Grund"` markieren. Keine Rankings,
  KI-Empfehlungen oder Umsätze versprechen. Keine fremden Skripte, kein Tracking, keine Cookies einbauen.
- Keine kostenpflichtigen Dienste, keine Nachrichten nach außen, nichts Unumkehrbares.

---

"""


def lies(pfad: Path):
    text = pfad.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not m:
        sys.exit(f"Kein Frontmatter in {pfad}")
    kopf, block = {}, None
    for zeile in m.group(1).splitlines():
        if block and zeile.startswith(" "):  # Fortsetzung von "key: |" oder "key: >"
            kopf[block] = (kopf[block] + " " + zeile.strip()).strip()
        elif ":" in zeile and not zeile.startswith(" "):
            k, v = zeile.split(":", 1)
            v = v.strip()
            block = k.strip() if v in ("|", ">", "|-", ">-") else None
            kopf[k.strip()] = "" if block else v.strip('"')
        else:
            block = None
    return kopf, text[m.end():]


def slug(pfad: Path) -> str:
    # engineering/engineering-cms-developer.md -> cms-developer
    s = pfad.stem
    bereich = pfad.parent.name + "-"
    return s[len(bereich):] if s.startswith(bereich) else s


def liste(bereich):
    for datei in sorted(KATALOG.glob("*/**/*.md")):
        rel = datei.relative_to(KATALOG)
        if bereich and rel.parts[0] != bereich:
            continue
        try:
            kopf, _ = lies(datei)
        except SystemExit:
            continue
        if "name" not in kopf:
            continue
        aktiv = "✓" if (STAB / f"agency-{slug(datei)}.md").exists() else " "
        print(f"{aktiv} {rel}  –  {kopf.get('description', '')[:90]}")


def aktiviere(rel: str, nur_lesen: bool, modell: str):
    datei = (KATALOG / rel).resolve()
    if KATALOG.resolve() not in datei.parents or not datei.is_file():
        sys.exit(f"Nicht im Katalog: {rel}")
    kopf, rumpf = lies(datei)
    name = f"agency-{slug(datei)}"
    beschreibung = kopf.get("description", "").replace("\n", " ")
    ziel = STAB / f"{name}.md"
    ziel.write_text(
        "---\n"
        f"name: {name}\n"
        f"description: {json.dumps(kopf.get('name', name) + ' (agency-agents) – ' + beschreibung, ensure_ascii=False)}\n"
        f"tools: {WERKZEUGE_LESEN if nur_lesen else WERKZEUGE_BAUEN}\n"
        f"model: {modell}\n"
        "---\n\n"
        + RAHMEN.format(quelle=QUELLE, pfad=datei.relative_to(KATALOG))
        + rumpf.lstrip(),
        encoding="utf-8",
    )
    print(f"{ziel.relative_to(WURZEL)}")


def main():
    p = argparse.ArgumentParser(description="Agent aus agency-agents übernehmen")
    p.add_argument("pfad", nargs="?", help="Pfad im Katalog, z. B. design/design-ux-architect.md")
    p.add_argument("--liste", nargs="?", const="", metavar="BEREICH", help="Katalog zeigen (✓ = aktiv)")
    p.add_argument("--nur-lesen", action="store_true", help="nur lesende Werkzeuge (Prüfer)")
    p.add_argument("--modell", default="sonnet", choices=["haiku", "sonnet", "opus", "inherit"])
    a = p.parse_args()
    if a.liste is not None:
        liste(a.liste)
    elif a.pfad:
        aktiviere(a.pfad, a.nur_lesen, a.modell)
    else:
        p.print_help()


if __name__ == "__main__":
    main()
