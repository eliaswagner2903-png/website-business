"""Selbsttests für zeitleiste.py: gültige Beispiel-Zeitleiste und gezielt kaputte Varianten (nur Standardbibliothek).

    python3 -m unittest discover -s werkzeuge/video-film/traum -p 'test_*.py'
"""
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

HIER = Path(__file__).resolve().parent
sys.path.insert(0, str(HIER))
import zeitleiste as zl  # noqa: E402

SKRIPT = HIER / "zeitleiste.py"


def szene(sid, ebene, start, dauer, spannung, titel):
    return {"id": sid, "ebene": ebene, "start_s": start, "dauer_s": dauer, "titel": titel, "bild": "…",
            "kamera": "langsamer Schwenk", "uebergang_heraus": "Morph in der Bewegung", "website_spur": "",
            "ton": "Atem im Helm", "zweck": "festhalten", "spannung": spannung}


def beispiel():
    """Gültig, ohne Hinweise: drei Ebenen, Höhepunkt S05, danach das Erwachen (dort darf der Website-Anteil fallen).
    Szenenlänge je Ebene 4 → 3 → 2 s (×0,71), Website 0 → 25 → 50 % (×2), Atem 12 → 15,6 → 20,28/min (×1,3)."""
    return {
        "titel": "Testfilm", "fassung": "Probe", "bildrate": 24, "formate": ["16:9", "9:16"], "dauer_s": 20.0,
        "faktoren": {"szenenlaenge": 0.7, "website_anteil": 2.0, "atem": 1.3},
        "ebenen": [
            {"id": "E0", "name": "Mond", "welt": "Mondoberfläche", "musterseite": None, "website_anteil": 0.0,
             "atem_pro_min": 12, "farbe": "Grau"},
            {"id": "E1", "name": "Kino", "welt": "Kinosaal", "musterseite": "Nachtfalter", "website_anteil": 0.25,
             "atem_pro_min": 15.6, "farbe": "Schwarz-Weiß"},
            {"id": "E2", "name": "Blumen", "welt": "Blumenmeer", "musterseite": "Blütenwerk Lilou",
             "website_anteil": 0.5, "atem_pro_min": 20.28, "farbe": "Rosa"},
        ],
        "szenen": [szene("S01", "E0", 0.0, 3.0, 6, "Auge hinter dem Visier"), szene("S02", "E0", 3.0, 5.0, 4, "Atem"),
                   szene("S03", "E1", 8.0, 3.0, 6, "Kino"), szene("S04", "E2", 11.0, 2.0, 8, "Blüten"),
                   szene("S05", "E2", 13.0, 2.0, 10, "Cursor"), szene("S06", "E0", 15.0, 5.0, 2, "Erwachen")],
        "keyframes": [
            {"id": "K00", "szene": "S01", "zeit_s": 0.0, "inhalt": "Auge", "zwilling_von": None},
            {"id": "K01", "szene": "S02", "zeit_s": 5.0, "inhalt": "Atem", "zwilling_von": None},
            {"id": "K02", "szene": "S03", "zeit_s": 8.0, "inhalt": "Sterne", "zwilling_von": None},
            {"id": "K03", "szene": "S04", "zeit_s": 11.0, "inhalt": "Staub im Projektorstrahl", "zwilling_von": "K02"},
            {"id": "K04", "szene": "S05", "zeit_s": 15.0, "inhalt": "Cursor", "zwilling_von": None},
            {"id": "K05", "szene": "S06", "zeit_s": 20.0, "inhalt": "Zimmer", "zwilling_von": None},
        ],
        "clips": [
            {"id": "C01", "von": "K00", "nach": "K01", "dauer_s": 5, "art": "welt", "quelle": "higgsfield",
             "modell": "kling_o3_flf", "kamera": "Schwenk", "morph": None},
            {"id": "C02", "von": "K01", "nach": "K02", "dauer_s": 3, "art": "welt", "quelle": "higgsfield",
             "modell": "kling_o3_flf", "modus": "std", "kamera": "Fahrt", "morph": None},
            {"id": "C03", "von": "K02", "nach": "K03", "dauer_s": 3, "art": "morph", "quelle": "higgsfield",
             "modell": "kling_o3_flf", "kamera": "Schwenk", "morph": "Sterne → Staub"},
            {"id": "C04", "von": "K03", "nach": "K04", "dauer_s": 4.0, "art": "aufnahme", "quelle": "website-aufnahme",
             "modell": None, "kamera": "Scrollen", "morph": None},
            {"id": "C05", "von": "K04", "nach": "K05", "dauer_s": 5, "art": "echt", "quelle": "elias", "modell": None,
             "kamera": "Hand", "morph": None},
        ],
        "ton": [
            {"id": "T01", "zeit_s": 0.0, "art": "atem", "inhalt": "scharfes Einatmen", "ereignis": "Auge reißt auf"},
            {"id": "T02", "zeit_s": 8.0, "art": "geraeusch", "inhalt": "Projektor", "ereignis": None},
            {"id": "T03", "zeit_s": 15.0, "art": "stille", "inhalt": "Stille", "ereignis": None},
            {"id": "T04", "zeit_s": 19.5, "art": "stimme", "inhalt": "…hörst du mich?", "ereignis": None},
        ],
    }


class Pruefen(unittest.TestCase):
    def mangel(self, d, teil):
        b = zl.pruefe(d)
        self.assertTrue(any(teil in m for m in b.maengel), f"kein Mangel mit „{teil}“ in {b.maengel}")

    def nur_hinweis(self, d, teil):
        b = zl.pruefe(d)
        self.assertEqual(b.maengel, [])
        self.assertTrue(any(teil in h for h in b.hinweise), f"kein Hinweis mit „{teil}“ in {b.hinweise}")

    def test_beispiel_gueltig_ohne_hinweise(self):
        b = zl.pruefe(beispiel())
        self.assertEqual((b.maengel, b.hinweise), ([], []))
        self.assertAlmostEqual(b.gemessen["website_anteil"], 2.0)
        self.assertAlmostEqual(b.gemessen["atem"], 1.3)

    def test_luecke(self):
        d = beispiel()
        d["szenen"][2].update(start_s=8.5, dauer_s=2.5)          # S03 beginnt 0,5 s nach dem Ende von S02
        self.mangel(d, "Lücke von 0,500 s zwischen S02 (Ende 8,000 s) und S03 (Start 8,500 s)")

    def test_ueberlappung(self):
        d = beispiel()
        d["szenen"][1]["dauer_s"] = 5.5
        self.mangel(d, "Überlappung von 0,500 s zwischen S02")

    def test_falsche_summe(self):
        d = beispiel()
        d["dauer_s"] = 21.0
        self.mangel(d, "Summe der Szenendauern 20,000 s ≠ dauer_s 21,000 s")

    def test_toleranz(self):
        d = beispiel()
        d["szenen"][2]["start_s"] = 8.0004                        # unter 0,001 s: keine Lücke
        self.assertEqual(zl.pruefe(d).maengel, [])

    def test_unbekannter_keyframe(self):
        d = beispiel()
        d["clips"][1]["nach"] = "K99"
        self.mangel(d, "C02: nach K99 – diesen Keyframe gibt es nicht")

    def test_kling_zwei_sekunden(self):
        d = beispiel()
        d["clips"][0]["dauer_s"] = 2
        self.mangel(d, "C01: kling_o3_flf braucht eine ganze Dauer von 3 bis 15 s (ist 2 s)")

    def test_kling_dauer(self):
        for dauer, gut in ((5.5, False), (16, False), (3, True), (15, True), (5.0, True)):
            with self.subTest(dauer=dauer):
                d = beispiel()
                d["clips"][0]["dauer_s"] = dauer
                kling = [m for m in zl.pruefe(d).maengel if "kling_o3_flf braucht" in m]
                self.assertEqual(kling == [], gut, kling)

    def test_weitere_maengel(self):
        faelle = {
            "S01: Ebene E9 gibt es nicht": lambda d: d["szenen"][0].update(ebene="E9"),
            "doppelte IDs in „szenen“: S01": lambda d: d["szenen"][1].update(id="S01"),
            "K03: zwilling_von K77": lambda d: d["keyframes"][3].update(zwilling_von="K77"),
            "K03: zwilling_von zeigt auf sich selbst": lambda d: d["keyframes"][3].update(zwilling_von="K03"),
            "K00: Szene S99 gibt es nicht": lambda d: d["keyframes"][0].update(szene="S99"),
            "Keyframes nicht zeitlich aufsteigend: K01": lambda d: d["keyframes"][2].update(zeit_s=4.0),
            "K05: zeit_s 21,000 s liegt außerhalb": lambda d: d["keyframes"][5].update(zeit_s=21.0),
            "T04: zeit_s 20,500 s liegt außerhalb des Films": lambda d: d["ton"][3].update(zeit_s=20.5),
            "T02: art „geräusch“ unbekannt": lambda d: d["ton"][1].update(art="geräusch"),
            "C03: art „ueberblendung“ unbekannt": lambda d: d["clips"][2].update(art="ueberblendung"),
            "C04: quelle „playwright“ unbekannt": lambda d: d["clips"][3].update(quelle="playwright"),
            'C01: modus "turbo" unbekannt': lambda d: d["clips"][0].update(modus="turbo"),
            'C01: modus ["std"] unbekannt': lambda d: d["clips"][0].update(modus=["std"]),
            'C01: modus {"a": 1} unbekannt': lambda d: d["clips"][0].update(modus={"a": 1}),
            'C03: „modell“ muss Text oder null sein (ist {"x": 1})': lambda d: d["clips"][2].update(modell={"x": 1}),
            "S04: Pflichtfeld „dauer_s“ fehlt": lambda d: d["szenen"][3].pop("dauer_s"),
            "S02: „spannung“ muss eine Zahl sein": lambda d: d["szenen"][1].update(spannung="hoch"),
            "S05: spannung 11 liegt nicht zwischen 0 und 10": lambda d: d["szenen"][4].update(spannung=11),
            "E2: website_anteil 1.5 liegt nicht zwischen 0 und 1": lambda d: d["ebenen"][2].update(website_anteil=1.5),
            "S01: die erste Szene beginnt bei 0,500 s": lambda d: d["szenen"][0].update(start_s=0.5, dauer_s=2.5),
            "„bildrate“ muss eine Zahl größer 0 sein": lambda d: d.update(bildrate=0),
            "faktoren.atem muss eine Zahl größer 0 sein": lambda d: d["faktoren"].pop("atem"),
            "„clips“ fehlt oder ist keine Liste": lambda d: d.pop("clips"),
            "S01: „titel“ muss Text sein": lambda d: d["szenen"][0].update(titel=7),
        }
        for teil, aendern in faelle.items():
            with self.subTest(teil):
                d = beispiel()
                aendern(d)
                self.mangel(d, teil)

    def test_nur_hinweise(self):
        faelle = {
            "Website-Anteil fällt vor dem Höhepunkt S05: S03 25 % → S04 10 %":
                lambda d: d["ebenen"][2].update(website_anteil=0.1),
            "Szenenlängen-Faktor je Ebene gemessen ×0,71, geplant ×0,40":
                lambda d: d["faktoren"].update(szenenlaenge=0.4),
            "Website-Faktor je Ebene gemessen ×2,00, geplant ×3,00": lambda d: d["faktoren"].update(website_anteil=3.0),
            "Feld „zweck“ fehlt in szenen: S01": lambda d: d["szenen"][0].pop("zweck"),
            "Tonereignisse nicht bildgenau bei 24 B/s: T02": lambda d: d["ton"][1].update(zeit_s=8.01),
            "K02: 7,000 s liegt nicht in seiner Szene S03": lambda d: d["keyframes"][2].update(zeit_s=7.0),
            "Keyframe-Kette unterbrochen (harter Schnitt?): C03→C04 (K03 ≠ K02)":
                lambda d: d["clips"][3].update(von="K02"),
            "C01: 5 s Clip soll 8,00 s Film füllen": lambda d: d["keyframes"][1].update(zeit_s=8.0, szene="S03"),
            "Ebenen ohne Szene: E3": lambda d: d["ebenen"].append(dict(d["ebenen"][2], id="E3")),
        }
        for teil, aendern in faelle.items():
            with self.subTest(teil):
                d = beispiel()
                aendern(d)
                self.nur_hinweis(d, teil)

    def test_zusatzfelder_werden_toleriert(self):
        d = beispiel()
        d["notiz"] = "Fassung für Elias"
        d["faktoren"]["farbe"] = 1.1
        d["ebenen"][0]["leitmotiv"] = "Staub"
        d["szenen"][0]["varianten"] = ["A", "B"]
        d["keyframes"][0]["prompt"] = "…"
        d["clips"][0]["ton_an"] = False
        d["ton"][0]["lautstaerke_db"] = -12
        b = zl.pruefe(d)
        self.assertEqual((b.maengel, b.hinweise), ([], []))


class Hilfen(unittest.TestCase):
    def test_zeitcode(self):
        self.assertEqual(zl.zeitcode(0, 24), "00:00.00")
        self.assertEqual(zl.zeitcode(75.5, 24), "01:15.12")
        self.assertEqual(zl.zeitcode(3 + 23 / 24, 24), "00:03.23")
        self.assertEqual(zl.zeitcode(59.99, 24), "01:00.00")          # rundet aufs nächste Bild

    def test_kosten(self):
        k = zl.kosten(beispiel())
        self.assertEqual((k["clips"], k["sekunden"]), (3, 11))
        self.assertAlmostEqual(k["credits"], 5 * 1.25 + 3 * 1.00 + 3 * 1.25)        # pro, std, pro (Standard)
        d = beispiel()
        d["clips"][0]["modus"] = "4K"
        d["clips"][2]["modell"] = "kling4_0"
        k = zl.kosten(d)
        self.assertAlmostEqual(k["credits"], 5 * 6.00 + 3 * 1.00)
        self.assertEqual([c["id"] for c in k["ohne_satz"]], ["C03"])

    def test_balken(self):
        self.assertEqual(zl.balken(10, 10), "█" * 20)
        self.assertEqual(zl.balken(0, 10), " " * 20)
        self.assertEqual(zl.balken(0.001, 1).strip(), "▏")             # kleine Werte bleiben sichtbar
        self.assertEqual(zl.balken(5, 10).strip(), "█" * 10)

    def test_standardpfad(self):
        self.assertTrue((zl.WURZEL / "werkzeuge" / "video-film" / "traum" / "zeitleiste.py").is_file())
        self.assertEqual(zl.STANDARDPFAD.relative_to(zl.WURZEL).as_posix(),
                         "kunden/elias-studio/werbefilm-traum/zeitleiste.json")


class Aufruf(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)

    def lauf(self, befehl, d=None, text=None):
        pfad = Path(self.tmp.name) / "zeitleiste.json"
        pfad.write_text(text if text is not None else json.dumps(d, ensure_ascii=False), encoding="utf-8")
        return subprocess.run([sys.executable, str(SKRIPT), befehl, str(pfad)], capture_output=True, text=True,
                              check=False)

    def test_pruefen_in_ordnung(self):
        r = self.lauf("pruefen", beispiel())
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("in Ordnung", r.stdout)
        self.assertEqual(r.stderr, "")

    def test_pruefen_mit_mangel(self):
        d = beispiel()
        d["clips"][0]["dauer_s"] = 2
        r = self.lauf("pruefen", d)
        self.assertEqual(r.returncode, 1)
        zeilen = r.stderr.splitlines()
        self.assertTrue(zeilen and all(z.startswith(("MANGEL: ", "HINWEIS: ")) for z in zeilen), r.stderr)
        self.assertIn("MANGEL: C01: kling_o3_flf braucht eine ganze Dauer von 3 bis 15 s (ist 2 s)", zeilen)

    def test_pruefen_hinweis_ohne_exitfehler(self):
        d = beispiel()
        d["ebenen"][2]["website_anteil"] = 0.1
        r = self.lauf("pruefen", d)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("HINWEIS: Website-Anteil fällt vor dem Höhepunkt", r.stderr)

    def test_kaputtes_json_und_doppelter_schluessel(self):
        r = self.lauf("pruefen", text='{"titel": "x",')
        self.assertEqual(r.returncode, 1)
        self.assertIn("MANGEL: kein gültiges JSON", r.stderr)
        text = json.dumps(beispiel()).replace('"start_s": 3.0,', '"start_s": 3.0, "start_s": 3.0,', 1)
        r = self.lauf("pruefen", text=text)
        self.assertEqual(r.returncode, 1)
        self.assertIn("MANGEL: doppelter Schlüssel „start_s“ in S02", r.stderr)

    def test_fehlende_datei(self):
        r = subprocess.run([sys.executable, str(SKRIPT), "pruefen", str(Path(self.tmp.name) / "fehlt.json")],
                           capture_output=True, text=True, check=False)
        self.assertEqual(r.returncode, 1)
        self.assertIn("MANGEL: Datei nicht gefunden", r.stderr)

    def test_anzeigen(self):
        erwartet = {
            "liste": "S04    00:11.00  2,00 s      48  E2        50 %         8  Blüten",
            "markdown": "| S01 | 00:00.00 | 3,00 s | 72 | E0 Mond | 0 % | 6 | Auge hinter dem Visier |",
            "kurve": "◀ Höhepunkt",
            "clips": "Schätzung kling_o3_flf: pro 8 s × 1,25 = 10,00 · std 3 s × 1,00 = 3,00 → 13,00 Credits",
        }
        for befehl, teil in erwartet.items():
            with self.subTest(befehl):
                r = self.lauf(befehl, beispiel())
                self.assertEqual(r.returncode, 0, r.stderr)
                self.assertIn(teil, r.stdout)

    def test_anzeige_trotz_logikmangel(self):
        d = beispiel()
        d["dauer_s"] = 21.0
        r = self.lauf("liste", d)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("HINWEIS: die Zeitleiste hat 1 Mangel", r.stderr)

    def test_falsche_typen_mangel_statt_absturz(self):
        faelle = (("modus", 0, ["std"], 'MANGEL: C01: modus ["std"] unbekannt (erlaubt: pro, std, 4k)', "C01"),
                  ("modus", 0, {"a": 1}, 'MANGEL: C01: modus {"a": 1} unbekannt (erlaubt: pro, std, 4k)', "C01"),
                  ("modell", 2, {"x": 1}, 'MANGEL: C03: „modell“ muss Text oder null sein (ist {"x": 1})', "C03"),
                  ("modell", 2, ["a"], 'MANGEL: C03: „modell“ muss Text oder null sein (ist ["a"])', "C03"))
        for feld, i, wert, mangel, clip in faelle:
            with self.subTest(feld=feld, wert=wert):
                d = beispiel()
                d["clips"][i][feld] = wert
                r = self.lauf("pruefen", d)
                self.assertEqual(r.returncode, 1, r.stderr)
                self.assertIn(mangel, r.stderr.splitlines())
                r = self.lauf("clips", d)                        # Anzeige läuft weiter, „?“ statt Absturz
                self.assertEqual(r.returncode, 0, r.stderr)
                self.assertIn("HINWEIS: die Zeitleiste hat 1 Mangel", r.stderr)
                zeile = next(z for z in r.stdout.splitlines() if z.startswith(clip))
                self.assertIn(" ? ", zeile)

    def test_keine_anzeige_bei_kaputtem_aufbau(self):
        d = beispiel()
        del d["szenen"][0]["start_s"]
        r = self.lauf("liste", d)
        self.assertEqual(r.returncode, 1)
        self.assertIn("MANGEL: S01: Pflichtfeld „start_s“ fehlt", r.stderr)


if __name__ == "__main__":
    unittest.main()
