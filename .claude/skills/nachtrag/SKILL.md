---
name: nachtrag
description: File new results as a dated addendum (Nachtrag) in the paper status report (Lagebericht, registers A–H) without changing existing material, so that Elias sees the whole development in the binder. Use on "/nachtrag", in the daily addendum routine and when Elias wants a new state to print.
---

# Addendum to the status report

The status report (Lagebericht) in `ops/dokumentation/` is a growing binder. **Nothing is replaced or rewritten**: the
base stock (`STAND-2026-09-30.html`) and all earlier addenda stay as they are. New material comes as an addendum
behind the matching register. That way Elias sees the development. Rules for all sheets: German, no code, for laypeople,
only black/white/gray, small b/w graphics as inline SVG when they help.

## 1. What is new?

- Last number and last date: `tail -1 ops/dokumentation/nachtraege/verzeichnis.jsonl`.
- New since then: order log (`python3 ops/log.py liste`) with status `erledigt` or a changed state after that date,
  merged PRs, new threads in the project, sessions in the other repos (`list_sessions`), new decisions by Elias.
- Nothing noteworthy new → create **no** addendum and report nothing.

## 2. Classify

| Register | New material belongs here if … |
|---|---|
| A Überblick | the short version (key figures, state) changes noticeably |
| B Chronik | always: new sessions and orders with date and result |
| C Projekte | new or changed sites, customers, undertakings |
| D Arbeitsweise und Qualität | new procedures, checks, jury results, build times |
| E Wissen und Lehren | new lessons, new errors, new references |
| F Geld | prices, costs, credits, decisions on euro values |
| G Plan und Entscheidungen | position in the plan, decisions made or new, next steps |
| H Anhang | new links and storage locations |

An addendum usually touches B and G, plus the registers for which it has content.

## 3. Write

File `ops/dokumentation/nachtraege/N###-JJJJ-MM-TT.html` (next number, three digits). Structure per register:

```html
<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Nachtrag N001</title>
<link rel="stylesheet" href="../druck.css"></head><body><div class="blatt">
<div data-reg="B">
  <div class="nachtrag-kopf"><span class="nr">Nachtrag N001</span><span>01.10.2026 · Register B</span></div>
  <section><h2><span class="nr">B4</span>Titel</h2> … <p class="verweis">Ergänzt B2 · Alle Arbeitssitzungen</p></section>
</div>
…
</div></body></html>
```

- Section numbers continue within the register (after B3 comes B4, also across several addenda).
- `verweis` names which earlier section the addendum supplements or supersedes. Never delete superseded material,
  say so here instead: "Stand von G2 überholt: Entscheidung 1 ist gefallen …".
- In G always the current position in the 6-phase plan (graphic as in the base stock, image "Wir sind hier").
- Figures only with a source (log, Git, report), keep marking euro values as placeholders until Elias fixes them.

Append an entry to the index (one line):
`{"nr":"N001","datum":"2026-10-01","register":["B","C","G"],"titel":"…","auftraege":["A-056"]}`

## 4. Build, check, deliver

1. `node ops/dokumentation/baue-pdf.cjs` builds the base stock, the addendum index, `nachtraege/pdf/<Bu>-N###.pdf`
   and `ORDNER-KOMPLETT.pdf`.
2. Look at every new page as an image (pymupdf `get_pixmap`): nothing cut off, thumb strip clear.
3. Copy the new PDFs to `/mnt/project-files/berichte/lagebericht-nachtraege/`, `ORDNER-KOMPLETT.pdf` to
   `/mnt/project-files/berichte/`.
4. Log entry (`/auftrag`), branch `aufbau/nachtrag-N###`, `/sichern`.
5. Report briefly to Elias: which sheets belong behind which register, with the PDFs attached. The new
   addendum index (register/0b) replaces the old sheet behind the register index; that is the only
   sheet that gets replaced.
