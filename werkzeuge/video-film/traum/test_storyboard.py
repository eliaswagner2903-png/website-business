"""Selbsttests für storyboard.py: Parser der Blöcke und Seitenvertrag des Fragments (nur Standardbibliothek).

    python3 -m unittest discover -s werkzeuge/video-film/traum -p 'test_*.py'

beispiel_film(ordner) legt einen kleinen Beispiel-Film an (auch für die Sichtprüfung im Browser).
"""
import json
import re
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

HIER = Path(__file__).resolve().parent
sys.path.insert(0, str(HIER))
import storyboard as sb  # noqa: E402

BOESE = '<script>alert("x")</script> & <img src=x onerror=1>'


def beispiel_zeitleiste():
    """Gültige Zeitleiste: 9 Szenen in drei Ebenen, 24 B/s, 48 s, Höhepunkt S07, danach das Erwachen."""
    ebenen = [
        {"id": "E0", "name": "Mond", "welt": "Mondoberfläche", "musterseite": None, "website_anteil": 0.0,
         "atem_pro_min": 12, "farbe": "Grau"},
        {"id": "E1", "name": "Kino", "welt": "Kinosaal", "musterseite": "Lindgrund", "website_anteil": 0.25,
         "atem_pro_min": 15.6, "farbe": "Schwarz-Weiß"},
        {"id": "E2", "name": "Werkstatt", "welt": "Uhrmacherei", "musterseite": "Lindgrund", "website_anteil": 0.5,
         "atem_pro_min": 20.28, "farbe": "Grün"},
    ]
    plan = [("E0", 8, 3, "Auge hinter dem **Visier**"), ("E0", 6, 4, "Atem im Helm"), ("E1", 5, 5, "Projektorstrahl"),
            ("E1", 5, 6, "Leinwand öffnet sich"), ("E2", 4, 7, "Zifferblatt"), ("E2", 4, 8, "Zahnräder"),
            ("E2", 4, 10, "Der Cursor " + BOESE), ("E0", 6, 3, "Erwachen"), ("E0", 6, 2, "Schlusssatz")]
    szenen, t = [], 0
    for i, (eb, dauer, spannung, titel) in enumerate(plan, 1):
        szenen.append({"id": f"S{i:02d}", "ebene": eb, "start_s": t, "dauer_s": dauer, "spannung": spannung,
                       "titel": titel, "bild": f"Bild zu {titel}: *langsam*, nah.", "kamera": "langsame Fahrt",
                       "uebergang_heraus": "Morph in der Bewegung", "website_spur": "" if eb == "E0" else
                       "Lindgrund-Aufnahme, Ausschnitt", "ton": "Atem", "zweck": "festhalten", "zukunft": 1})
        t += dauer
    zeiten = [0, 8, 14, 19, 24, 28, 32, 36, 42, 48]
    keyframes = [{"id": f"K{i:02d}", "szene": szenen[min(i, 8)]["id"], "zeit_s": z, "inhalt": "…",
                  "zwilling_von": None} for i, z in enumerate(zeiten)]
    keyframes[-1]["szene"] = "S09"
    clips = []
    for i, (a, z) in enumerate(zip(keyframes, keyframes[1:]), 1):
        spanne = z["zeit_s"] - a["zeit_s"]
        c = {"id": f"C{i:02d}", "von": a["id"], "nach": z["id"], "dauer_s": spanne, "art": "welt",
             "quelle": "higgsfield", "modell": "kling_o3_flf", "kamera": "Fahrt", "morph": None}
        if i == 4:
            c.update(quelle="website-aufnahme", modell=None, art="aufnahme")
        if i == 2:
            c["modus"] = "std"
        clips.append(c)
    ton = [{"id": "T01", "zeit_s": 0.0, "art": "atem", "inhalt": "scharfes Einatmen", "ereignis": "Auge"},
           {"id": "T02", "zeit_s": 14.0, "art": "geraeusch", "inhalt": "Projektor", "ereignis": None},
           {"id": "T03", "zeit_s": 32.0, "art": "stille", "inhalt": "Stille", "ereignis": None},
           {"id": "T04", "zeit_s": 47.5, "art": "stimme", "inhalt": "…hörst du mich?", "ereignis": None}]
    return {"titel": "Traum", "fassung": "Drehbuch 1", "bildrate": 24, "formate": ["16:9", "9:16"], "dauer_s": 48,
            "faktoren": {"szenenlaenge": 0.7, "website_anteil": 2.0, "atem": 1.3}, "ebenen": ebenen,
            "szenen": szenen, "keyframes": keyframes, "clips": clips, "ton": ton}


def text_block(inhalt):
    return f"```text\n{inhalt}\n```\n"


def beispiel_film(ordner):
    """Schreibt Zeitleiste und Beispiel-Dokumente; absichtlich fehlen Karte S05, Clip C06 und Ton T04."""
    ordner = Path(ordner)
    ordner.mkdir(parents=True, exist_ok=True)
    (ordner / "zeitleiste.json").write_text(json.dumps(beispiel_zeitleiste(), ensure_ascii=False, indent=1),
                                            encoding="utf-8")
    (ordner / "01-drehbuch.md").write_text(
        "# Werbefilm „Traum“ – Drehbuch 1\n\nStand 02.11.2026\n\n## 1. Titel und Logline\n\n"
        "**Logline:** Ein Astronaut erwacht in einem Traum, der *Welt für Welt* zur Website wird.\n\n"
        "## 2. Kurve\n\nText.\n", encoding="utf-8")
    karten = "".join(f"### Karte S{i:02d}\n\nAnhängen: Partnerbild K0{i}. {'**' + BOESE + '**' if i == 7 else ''}\n\n"
                     + text_block(f"Szene {i}: Stimmung still, kühl, ein Atemzug.\n# keine Überschrift\n"
                                  "Zweite Zeile mit <b>Tag</b>.") for i in range(1, 10) if i != 5)
    (ordner / "02-chatgpt-briefing.md").write_text(
        "# Briefing\n\n## Master-Briefing\n\nIn **jeden** neuen Chat zuerst.\n\n"
        + text_block("Du bist Storyboard-Zeichner für einen Traumfilm.\nStil: ruhig, filmisch.")
        + "\n## Karten\n\n" + karten, encoding="utf-8")
    clips = "".join(f"### Clip C{i:02d}\n\n- Modell: `kling_o3_flf`, 16:9, Ton aus\n- Start: K{i - 1:02d}\n\n"
                    + text_block(f"Slow continuous dolly forward, clip {i}, no pause.") for i in range(1, 10)
                    if i not in (4, 6))
    (ordner / "03-higgsfield.md").write_text("# Higgsfield\n\n" + clips + "### Clip C77\n\n" + text_block("x"),
                                             encoding="utf-8")
    (ordner / "04-ton.md").write_text("# Ton\n\n### Ton T01\n\n" + text_block("Sharp inhale inside a helmet.")
                                      + "### Ton T02\n\n" + text_block("Old film projector rattling, close."),
                                      encoding="utf-8")
    (ordner / "00-grundlagen.md").write_text("## 5. Technik (Stand 02.11.2026)\n\n**Higgsfield** – Guthaben "
                                             "**87,25 Credits** (Plan basic).\n", encoding="utf-8")
    return ordner


class Parser(unittest.TestCase):
    def test_karten_und_hinweis(self):
        text = ("## Master-Briefing\n\nErklärung **fett**.\n\n```text\nGrundton\n```\n\n"
                "### Karte S03\n\nHinweis für Elias.\n\n```text\nZeile 1\n### keine Überschrift\n```\n"
                "Nachsatz.\n### Karte S04\n```text\nVier\n```\n### Karte S03\n```text\nDoppelt\n```\n")
        k = sb.karten(text, "Karte")
        self.assertEqual(list(k), ["S03", "S04"])
        self.assertEqual(k["S03"]["text"], "Zeile 1\n### keine Überschrift")
        self.assertEqual(k["S03"]["hinweis"], "Hinweis für Elias.")
        self.assertEqual(k["S04"]["hinweis"], "")
        m = sb.master_briefing(text)
        self.assertEqual((m["text"], m["hinweis"]), ("Grundton", "Erklärung **fett**."))

    def test_clip_einstellungen_und_textblock_bevorzugt(self):
        text = "### Clip C05\n\n- Modell: kling\n* Dauer 5 s\n\n```json\n{}\n```\n\n```text\nPrompt\n```\n"
        c = sb.karten(text, "Clip")["C05"]
        self.assertEqual(c["einstellungen"], ["Modell: kling", "Dauer 5 s"])
        self.assertEqual((c["text"], c["bloecke"]), ("Prompt", 2))

    def test_ohne_block(self):
        c = sb.karten("### Ton T07\n\nnur Text\n", "Ton")["T07"]
        self.assertIsNone(c["text"])

    def test_logline(self):
        for text, soll in (("# Titel\n\n**Logline:** Ein Traum.\n", "Ein Traum."),
                           ("# Titel\n\n### Logline\n\nZwei *Welten*.\n\n## Weiter\n", "Zwei *Welten*."),
                           ("# Titel\n\n## 1. Titel, Logline, Idee\n\nText\n", None),
                           ("Ohne Überschrift\n", None)):
            with self.subTest(text=text):
                self.assertEqual(sb.drehbuch_kopf(text)[1], soll)
        self.assertEqual(sb.drehbuch_kopf("# Werbefilm\n\nx")[0], "Werbefilm")

    def test_guthaben(self):
        self.assertEqual(sb.guthaben("(Stand 02.11.2026) – Guthaben **87,25 Credits**"), (87.25, "02.11.2026"))
        self.assertEqual(sb.guthaben("Guthaben 1.087,5 Credits"), (1087.5, None))
        self.assertIsNone(sb.guthaben("kein Wert"))

    def test_inline_escape(self):
        self.assertEqual(sb.inline("**a** <b> *c* `d`"),
                         "<strong>a</strong> &lt;b&gt; <em>c</em> <code>d</code>")
        self.assertNotIn("<script", sb.inline("**<script>x</script>**"))

    def test_seitentitel(self):
        self.assertEqual(sb.seitentitel({"titel": "„Traum“"}, {}), "Traum Storyboard")
        self.assertEqual(sb.seitentitel({}, {"titel": "Werbefilm „Traum“ – Drehbuch 1 (A-124)"}),
                         "Werbefilm Traum Storyboard")
        self.assertLessEqual(len(sb.seitentitel({"titel": "Ein sehr langer Filmtitel hier"}, {}).split()), 4)
        self.assertEqual(sb.seitentitel({"titel": "Der Traum vom Fliegen"}, {}), "Traum vom Fliegen Storyboard")
        self.assertEqual(sb.seitentitel({"titel": "Ein sehr langer Filmtitel hier"}, {}), "Filmtitel Storyboard")
        for titel in ("Der Traum vom Fliegen", "Ein Film über die Nacht im Kino", "a b c d e"):
            with self.subTest(titel=titel):
                worte = sb.seitentitel({"titel": titel}, {}).split()
                self.assertTrue(2 <= len(worte) <= 4, worte)
                self.assertNotIn(worte[-2].lower(), sb.FUELLWORTE)    # kein abgebrochener Rest wie „vom“

    def test_zwischenueberschrift_bleibt_im_abschnitt(self):
        text = ("# Higgsfield\n\n### Clip C01\n\n#### Einstellungen\n\n- Modell: kling\n\n```text\nPrompt eins\n```\n"
                "### Clip C02\n\n```text\nzwei\n```\n")
        k = sb.karten(text, "Clip")
        self.assertEqual(k["C01"]["text"], "Prompt eins")
        self.assertEqual(k["C01"]["einstellungen"], ["Modell: kling"])
        self.assertEqual(k["C02"]["text"], "zwei")
        m = sb.master_briefing("# B\n\n## Master-Briefing\n\n```text\nGrund\n```\n### Karte S01\n```text\nk\n```\n")
        self.assertEqual((m["text"], m["bloecke"]), ("Grund", 1))     # ### beendet das Master-Briefing weiter

    def test_hinweis_mit_liste(self):
        k = sb.karten("### Karte S01\n\nVorab:\n\n- Anhängen: K00 und K01\n\n```text\nx\n```\n", "Karte")["S01"]
        h = sb.hinweis_html(k)
        self.assertIn("Vorab:", h)
        self.assertIn("<li>Anhängen: K00 und K01</li>", h)
        self.assertNotIn("<li>", sb.hinweis_html(k, mit_liste=False))
        self.assertEqual(sb.hinweis_html(None), "")

    def test_ids_eindeutig(self):
        seite = sb.Seite()
        self.assertEqual([seite.id("szene", "S 1"), seite.id("szene", "S-1"), seite.id("szene", "S-1")],
                         ["szene-S-1", "szene-S-1-2", "szene-S-1-3"])
        self.assertNotEqual(seite.id("h-kurve"), "h-kurve")            # feste IDs sind reserviert


class Fragment(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.film = beispiel_film(Path(cls.tmp.name) / "film")
        cls.aus = Path(cls.tmp.name) / "storyboard.html"
        cls.lauf = subprocess.run([sys.executable, str(HIER / "storyboard.py"), "--film", str(cls.film),
                                   "--aus", str(cls.aus)], capture_output=True, text=True)
        cls.html = cls.aus.read_text(encoding="utf-8")

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def test_lauf_und_fehlende_ids(self):
        self.assertEqual(self.lauf.returncode, 0, self.lauf.stderr)
        for teil in ("Karte S05", "Clip C06", "Ton T04"):
            self.assertIn(teil, self.lauf.stderr)
        self.assertNotIn("Clip C04", self.lauf.stderr)     # Website-Aufnahme braucht keinen Prompt
        self.assertNotIn("Ton T03", self.lauf.stderr)      # Stille braucht keinen Prompt
        self.assertIn("Clip C77", self.lauf.stderr)        # steht nur im Dokument
        self.assertIn(sb.FEHLT, self.html)

    def test_fragment_ohne_geruest(self):
        klein = self.html.lower()
        for tag in ("!doctype", "html", "head", "body"):
            self.assertIsNone(re.search(rf"</?{tag}[\s>]", klein), tag)
        self.assertTrue(self.html.startswith("<title>Traum Storyboard</title>\n"
                                             '<meta name="claude:viewport-fit-sides" content="cover">'))
        self.assertLess(self.html.index("<style>"), self.html.index("<main"))
        self.assertLess(self.html.index("</main>"), self.html.index("<script>"))

    def test_tokens_auf_root(self):
        stil = self.html[self.html.index("<style>"):self.html.index("</style>")]
        self.assertRegex(stil, r":root\{[^}]*--bg:[^}]*color-scheme:dark")
        self.assertIn('@media (prefers-color-scheme: light){\n  :root:not([data-theme="dark"]){', stil)
        self.assertIn(':root[data-theme="light"]{', stil)
        self.assertRegex(stil, r"body\{[^}]*background:var\(--bg\)")
        ohne_root = re.sub(r":root[^{]*\{[^}]*\}", "", stil)
        self.assertIsNone(re.search(r"#[0-9a-fA-F]{3,8}\b", ohne_root), "Literalfarbe außerhalb der Tokens")
        self.assertIn("max(16px, env(safe-area-inset-left, 0px))", stil)

    def test_keine_externen_skripte(self):
        self.assertIsNone(re.search(r"<script[^>]+src", self.html))
        self.assertNotIn("<iframe", self.html)
        for url in re.findall(r'(?:href|src)="(https?://[^"]+)"', self.html):
            self.assertTrue(url.startswith("https://fonts.googleapis.com") or url == "https://fonts.gstatic.com",
                            url)
        for verboten in ("alert(", "confirm(", "prompt(", "window.print", " download"):
            self.assertNotIn(verboten, self.html[self.html.index("<script>"):])

    def test_escape(self):
        self.assertNotIn("<script>alert", self.html)
        self.assertNotIn("<img src=x", self.html)
        self.assertNotIn("<b>Tag</b>", self.html)
        self.assertIn("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;", self.html)
        self.assertIn("&lt;b&gt;Tag&lt;/b&gt;", self.html)
        self.assertIn("<strong>Visier</strong>", self.html)       # einfache Fettung im Feld „Bild“
        self.assertEqual(self.html.count("<script"), 1)

    def test_inhalt(self):
        h = self.html
        self.assertIn("Ein Astronaut erwacht", h)
        self.assertIn("87,25 Credits", h)
        self.assertEqual(h.count('<details class="karte"'), 9)
        self.assertEqual(len(re.findall(r'<details class="karte" id="szene-S\d\d" open>', h)), 9)  # ohne Klick lesbar
        self.assertEqual(h.count('<h3 class="s-titel">'), 9)           # Szenen als Überschrift für Screenreader
        self.assertNotIn("<h4><span", h)                               # Clip-/Ton-Köpfe sind h5
        self.assertIn('id="alle-oeffnen"', h)
        self.assertIn("00:32.00", h)                              # Zeitcode S07 bei 24 B/s
        self.assertIn("<svg class=\"kurve\"", h)
        self.assertLess(h.index('id="h-kurve"'), h.index('id="h-ablauf"'))
        self.assertLess(h.index('id="h-ablauf"'), h.index('id="h-master"'))
        self.assertLess(h.index('id="h-master"'), h.index('id="h-szenen"'))
        self.assertIn("Freigabe", h[h.index("<footer"):])

    def test_stabile_ids(self):
        h = self.html
        for i in ("kopieren-master", "text-master", "kopieren-karte-S01", "kopieren-clip-C01", "text-clip-C01",
                  "kopieren-ton-T01", "clip-C01", "ton-T01", "szene-S09"):
            self.assertIn(f'id="{i}"', h)
        self.assertNotIn('id="kopieren-1"', h)
        ids = re.findall(r'\bid="([^"]+)"', h)
        self.assertEqual(len(ids), len(set(ids)), "doppelte id")
        for ziel in re.findall(r'href="#([^"]+)"', h):
            self.assertIn(ziel, ids)

    def test_umbruch_kontrast_und_rueck(self):
        stil = self.html[self.html.index("<style>"):self.html.index("</style>")]
        self.assertRegex(stil, r"body\{[^}]*overflow-wrap:anywhere")
        self.assertRegex(stil, r"\.kopf h1\{[^}]*hyphens:auto")
        self.assertNotRegex(stil, r"\.rueck:empty\{[^}]*display:none")   # Live-Region bleibt im Baum
        self.assertIn(".kurve{display:block;width:100%;min-width:1000px", stil)
        self.assertIn('lang="de"', self.html)

        def tokens(block):
            return dict(re.findall(r"--([\w-]+):(#[0-9a-fA-F]{6})", block))

        def kontrast(a, b):
            def lum(h):
                c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
                c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
                return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
            la, lb = sorted((lum(a), lum(b)), reverse=True)
            return (la + 0.05) / (lb + 0.05)

        dunkel = tokens(re.search(r":root\{[^}]*\}", stil).group(0))
        hell = dunkel | tokens(re.search(r':root\[data-theme="light"\]\{[^}]*\}', stil).group(0))
        for name, t in (("dunkel", dunkel), ("hell", hell)):
            for vorne, hinten in (("akzent", "bg"), ("akzent", "flaeche"), ("akzent", "flaeche-2"),
                                  ("akzent-text", "akzent"), ("text-3", "flaeche-2"), ("text-3", "flaeche"),
                                  ("text-2", "flaeche-2"), ("warn", "warn-flaeche")):
                with self.subTest(thema=name, paar=(vorne, hinten)):
                    self.assertGreaterEqual(kontrast(t[vorne], t[hinten]), 4.5)

    def test_fuss_ohne_lokalen_pfad(self):
        fuss = self.html[self.html.index("<footer"):]
        self.assertNotIn(self.tmp.name, fuss)
        self.assertNotIn("/home/", fuss)

    def test_svg_formen_mit_fill(self):
        svg = self.html[self.html.index('<svg class="kurve"'):]
        svg = svg[:svg.index("</svg>")]
        for tag in re.findall(r"<(?:line|polyline|path)\b[^>]*>", svg):
            self.assertIn('fill="none"', tag)
        for tag in re.findall(r"<(?:rect|circle|text)\b[^>]*>", svg):
            self.assertRegex(tag, r'class="k-', tag)

    def test_svg_im_viewbox_bei_zu_kurzer_dauer(self):
        d = beispiel_zeitleiste()
        d["dauer_s"] = 30                                              # Szenen laufen bis 48 s
        svg = sb.kurve_svg(d)
        for wert in re.findall(r'\b(?:x|x1|x2|cx)="(-?[\d.]+)"', svg):
            self.assertTrue(0 <= float(wert) <= 1000, wert)
        for a, b in re.findall(r"(-?[\d.]+),(-?[\d.]+)", svg):
            self.assertTrue(0 <= float(a) <= 1000, a)
        breite = re.findall(r'<rect class="k-balken[^"]*" x="([\d.]+)" y="[\d.]+" width="([\d.]+)"', svg)
        self.assertTrue(all(float(x) + float(w) <= 1000 for x, w in breite))

    def test_fehlende_dateien(self):
        with tempfile.TemporaryDirectory() as leer:
            fragment, seite = sb.bauen(leer)
        self.assertIn("zeitleiste.json", seite.fehlend)
        self.assertIn("<title>Film Storyboard</title>", fragment)
        self.assertIn("Master-Briefing", " ".join(seite.fehlend))


def bauen_mit(aendern=None, dokumente=None):
    """Beispiel-Film in einem temporären Ordner, Zeitleiste über aendern(d) verändert, Dokumente über {datei: text}."""
    with tempfile.TemporaryDirectory() as tmp:
        film = beispiel_film(Path(tmp) / "film")
        if aendern:
            d = beispiel_zeitleiste()
            aendern(d)
            (film / "zeitleiste.json").write_text(json.dumps(d, ensure_ascii=False), encoding="utf-8")
        for name, text in (dokumente or {}).items():
            (film / name).write_text(text, encoding="utf-8")
        return sb.bauen(film)


class Robust(unittest.TestCase):
    def test_langes_wort(self):
        wort = "Traumwerkstatt" * 8 + "x" * 8                         # 120 Zeichen ohne Leerzeichen
        self.assertEqual(len(wort), 120)

        def lang(d):
            d["titel"] = wort
            d["szenen"][2].update(titel=wort, bild=f"https://example.org/{wort}", kamera=wort.replace("t", "_"))
        fragment, _ = bauen_mit(lang)
        self.assertIn(wort, fragment)
        stil = fragment[fragment.index("<style>"):fragment.index("</style>")]
        self.assertRegex(stil, r"body\{[^}]*overflow-wrap:anywhere")
        self.assertIn('<main class="blatt" lang="de">', fragment)
        self.assertRegex(fragment, r"<title>\S+ Storyboard</title>")

    def test_clip_mit_falschem_szenen_verweis(self):
        def falsch(d):
            d["keyframes"][2]["szene"] = "S99"
        fragment, seite = bauen_mit(falsch, {"03-higgsfield.md": "# leer\n"})
        self.assertIn('id="clip-C03"', fragment)
        self.assertIn("Clip C03 (03-higgsfield.md)", seite.fehlend)

    def test_eine_kaputte_szene(self):
        def kaputt(d):
            del d["szenen"][3]["spannung"]
        fragment, seite = bauen_mit(kaputt, {"03-higgsfield.md": "# leer\n"})
        self.assertIn("Szenen der Zeitleiste nicht lesbar", fragment)
        for i in ("clip-C01", "clip-C09", "ton-T01", "kopieren-karte-S01", "kopieren-ton-T02"):
            self.assertIn(f'id="{i}"', fragment)
        self.assertIn("Clip C01 (03-higgsfield.md)", seite.fehlend)
        self.assertIn("Ton T04 (04-ton.md)", seite.fehlend)
        ids = re.findall(r'\bid="([^"]+)"', fragment)
        self.assertEqual(len(ids), len(set(ids)))

    def test_listen_hinweis_auf_der_seite(self):
        briefing = ("# B\n\n## Master-Briefing\n\n- Neuer Chat\n\n```text\nGrund\n```\n\n"
                    "### Karte S01\n\n- Anhängen: K00 und K01\n\n```text\nKarte eins\n```\n")
        ton = "### Ton T01\n\n- Lautstärke leise\n\n```text\nInhale\n```\n"
        fragment, _ = bauen_mit(dokumente={"02-chatgpt-briefing.md": briefing, "04-ton.md": ton})
        for zeile in ("Neuer Chat", "Anhängen: K00 und K01", "Lautstärke leise"):
            self.assertIn(f"<li>{zeile}</li>", fragment)

    def test_zeitleiste_kein_json(self):
        with tempfile.TemporaryDirectory() as tmp:
            film = beispiel_film(Path(tmp) / "film")
            (film / "zeitleiste.json").write_text("{kaputt", encoding="utf-8")
            fragment, seite = sb.bauen(film)
        self.assertNotIn("zeitleiste.json", seite.fehlend)
        self.assertIn("zeitleiste.json nicht lesbar", fragment)
        self.assertIn("(nicht lesbar)", fragment[fragment.index("<footer"):])
        self.assertNotIn(tmp, fragment)
        self.assertTrue(any("nicht lesbar" in h for h in seite.hinweise))


if __name__ == "__main__":
    unittest.main()
