---
name: referenz
description: Einen Aufklärungsbericht über eine fremde Website (z. B. von Hfw Fortenbacher) auswerten und das Übertragbare ins System aufnehmen. Nutzen bei "/referenz", wenn ein Dossier in wissen/referenzen/eingang/ liegt oder der Nutzer einen Bericht schickt.
---

# Referenz auswerten

1. Dossier nach `wissen/referenzen/eingang/<JJJJ-MM-TT>-<domain>.md` legen (unverändert), Auftrag loggen
   (`python3 ops/log.py neu "Referenz auswerten: <domain>" --bereich wissen`).
2. `wissen/referenzen/VORLAGE.md` kopieren nach `ausgewertet/<gleicher Name>.md` und ausfüllen. Noten streng nach
   den W-Kriterien aus `wissen/MEISTERSTANDARD.md`. Nur aus dem Dossier und eigener Beobachtung, nichts erfinden.
3. Den Abschnitt **Übertragbar** ernst nehmen: je Muster eine eigene Umsetzung beschreiben, nie Texte, Bilder
   oder Code übernehmen. Was gegen unsere Pflichten verstößt (Tracking, Cookies, fremde Skripte, Gewicht), gehört
   unter „Nicht übernehmen“.
4. Jedes Muster als Zeile in `MUSTER.md` (nächste freie ID `M-###`), Seite in `REFERENZLISTE.md`.
5. Kleine Regeln sofort ins Ziel übernehmen (`DESIGN-WISSEN.md`, `FEHLER.md`, `MEISTERSTANDARD.md`: nur anhängen,
   Quelle nennen) und Status `drin` setzen. Neue Bausteine als eigenen Auftrag loggen (Status `geplant`).
6. Dossier nach `ausgewertet/` verschieben, `/sichern`. Dem Nutzer: 3–5 wichtigste Muster in je einem Satz.
