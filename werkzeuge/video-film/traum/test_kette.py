"""Selbsttests für kette-pruefen.py: kleine Testclips (1 s, 24 B/s, 320×180) mit ffmpeg in einem temporären Ordner.

    python3 -m unittest discover -s werkzeuge/video-film/traum -p 'test_*.py'

Testbild: weichgezeichnetes testsrc, das gleichmäßig 1 px je Bild seitwärts läuft (Bewegung Ø ≈ 3 je Bild).
  a         Bilder 0–23 der Fahrt
  fortlauf  Bilder 24–47 derselben Fahrt (Naht = ein normaler Bildschritt)
  kette     beginnt mit dem letzten Bild von a (über letztes-bild) und fährt weiter (Keyframe-Kette, doppeltes Bild)
  stand     das letzte Bild von a als Standbild (Stopp-und-los)
  sprung    eine einfarbige Fläche (harter Schnitt)
  farbstich wie kette, aber Farbton um 90° gedreht und kräftiger (hue): Helligkeit gleich, die Farben springen
  blass     wie kette, aber leicht entsättigt (hue=s=0.9): kleiner Farbsprung
"""
import argparse
import importlib.util
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

import numpy as np

SKRIPT = Path(__file__).resolve().parent / "kette-pruefen.py"
_spec = importlib.util.spec_from_file_location("kette_pruefen", SKRIPT)
kp = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(kp)
FAHRT = "scroll=horizontal=0.00315"      # 1 px je Bild bei 320 px Breite
X264 = ["-pix_fmt", "yuv420p", "-c:v", "libx264", "-crf", "18"]


def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-nostdin", "-y", *map(str, args)], check=True)


def kette(*args):
    return subprocess.run([sys.executable, str(SKRIPT), *map(str, args)], capture_output=True, text=True, check=False)


def grau(bild):
    return kp.erste_bilder(bild, 1, "format=gray")[0]


@unittest.skipUnless(shutil.which("ffmpeg") and shutil.which("ffprobe"), "ffmpeg/ffprobe fehlen")
class Kette(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls._tmp = tempfile.TemporaryDirectory()
        d = cls.d = Path(cls._tmp.name)
        ffmpeg("-f", "lavfi", "-i", "testsrc=size=320x180:rate=24", "-vf", "gblur=sigma=6", "-frames:v", 1,
               d / "basis.png")
        bild = ["-loop", 1, "-framerate", 24, "-i"]
        ffmpeg(*bild, d / "basis.png", "-vf", FAHRT, "-frames:v", 24, *X264, d / "a.mp4")
        ffmpeg(*bild, d / "basis.png", "-vf", f"{FAHRT},trim=start_frame=24:end_frame=48,setpts=PTS-STARTPTS",
               "-frames:v", 24, *X264, d / "fortlauf.mp4")
        r = kette("letztes-bild", d / "a.mp4", d / "a-letztes.png")
        assert r.returncode == 0, r.stderr
        ffmpeg(*bild, d / "a-letztes.png", "-vf", FAHRT, "-frames:v", 24, *X264, d / "kette.mp4")
        ffmpeg(*bild, d / "a-letztes.png", "-frames:v", 24, *X264, d / "stand.mp4")
        for name, farbe in (("farbstich", "hue=h=90:s=1.6"), ("blass", "hue=s=0.9")):
            ffmpeg(*bild, d / "a-letztes.png", "-vf", f"{FAHRT},{farbe}", "-frames:v", 24, *X264, d / f"{name}.mp4")
        ffmpeg("-f", "lavfi", "-i", "color=c=0x3060a0:size=320x180:rate=24:duration=1", *X264, d / "sprung.mp4")

    @classmethod
    def tearDownClass(cls):
        cls._tmp.cleanup()

    def naehte(self, *clips):
        return kette("naehte", *(self.d / f"{c}.mp4" for c in clips))

    def test_nahtlos_keyframe_kette(self):
        r = self.naehte("a", "kette")
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertIn("→ nahtlos", r.stdout)
        self.assertIn("Bewegung stockt an der Naht", r.stdout)     # Endbild = Startbild: im Schnitt ein Bild weglassen

    def test_nahtlos_fortlaufend(self):
        r = self.naehte("a", "fortlauf")
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertIn("→ nahtlos", r.stdout)
        self.assertIn("→ gleichmäßig", r.stdout)

    def test_sprung(self):
        r = self.naehte("a", "sprung")
        self.assertEqual(r.returncode, 1, r.stdout + r.stderr)
        self.assertIn("→ Sprung", r.stdout)

    def test_kette_aus_drei_clips(self):
        r = self.naehte("a", "kette", "sprung")
        self.assertEqual(r.returncode, 1, r.stdout + r.stderr)
        self.assertIn("Ergebnis: 2 Nähte – 1 nahtlos, 0 sichtbar, 1 Sprung", r.stdout)

    def test_farbstich_ist_sprung(self):
        r = self.naehte("a", "farbstich")
        self.assertEqual(r.returncode, 1, r.stdout + r.stderr)
        # Helligkeit und Aufbau wären nahtlos – nur die Farbe springt
        self.assertRegex(r.stdout, r"Differenz Ø [0-3],\d\d · SSIM 0,9\d\d · Farbe Ø \d+,\d\d → Sprung")

    def test_leichter_farbstich_ist_sichtbar(self):
        r = self.naehte("a", "blass")
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertRegex(r.stdout, r"Differenz Ø [0-3],\d\d · SSIM 0,9\d\d · Farbe Ø \d,\d\d → sichtbar")

    def test_stopp_und_los(self):
        r = self.naehte("a", "stand")
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertIn("Stopp-und-los – Clip n+1 beginnt im Stand", r.stdout)

    def test_schwellen_als_parameter(self):
        r = kette("naehte", self.d / "a.mp4", self.d / "fortlauf.mp4", "--nahtlos-diff", "1")
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertIn("→ sichtbar", r.stdout)
        self.assertIn("nahtlos Ø ≤ 1,0", r.stdout)
        r = kette("naehte", self.d / "a.mp4", self.d / "farbstich.mp4", "--sprung-farbe", "200")
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertIn("→ sichtbar", r.stdout)
        self.assertIn("Farbe Ø > 200,0", r.stdout)

    def test_letztes_und_erstes_bild_genau(self):
        bilder = list(kp._bilder(self.d / "a.mp4", "format=gray"))           # alle 24 Bilder, volle Größe
        self.assertEqual(len(bilder), 24)
        for n, nachbar, befehl in ((23, 22, "letztes-bild"), (0, 1, "erstes-bild")):
            with self.subTest(befehl):
                ziel = self.d / f"{befehl}.png"
                r = kette(befehl, self.d / "a.mp4", ziel)
                self.assertEqual(r.returncode, 0, r.stderr)
                self.assertIn("(320×180 px)", r.stdout)
                self.assertLess(kp.differenz(grau(ziel), bilder[n]), 0.5)          # genau dieses Bild, kaum Rundweg
                self.assertGreater(kp.differenz(grau(ziel), bilder[nachbar]), 2.0)  # und nicht das Nachbarbild

    def test_ziel_wird_nicht_still_ersetzt(self):
        ziel = self.d / "schutz.png"
        self.assertEqual(kette("erstes-bild", self.d / "a.mp4", ziel).returncode, 0)
        r = kette("erstes-bild", self.d / "a.mp4", ziel)
        self.assertEqual(r.returncode, 2)
        self.assertIn("PROBLEM: Ziel gibt es schon", r.stderr)
        self.assertEqual(kette("erstes-bild", self.d / "a.mp4", ziel, "--ueberschreiben").returncode, 0)

    def test_kontaktbogen(self):
        ziel = self.d / "bogen.jpg"
        r = kette("kontaktbogen", self.d / "a.mp4", ziel, "--n", "6")
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("Bildnummern 0, 5, 9, 14, 18, 23", r.stdout)
        masse = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=width,height", "-of", "csv=p=0",
                                str(ziel)], capture_output=True, text=True, check=False).stdout.strip()
        self.assertEqual(masse, "960,360")              # 3 × 2 Kacheln zu 320 × 180

    def test_bedienfehler(self):
        self.assertEqual(kette("naehte", self.d / "a.mp4").returncode, 2)
        r = kette("naehte", self.d / "a.mp4", self.d / "fehlt.mp4")
        self.assertEqual(r.returncode, 2)
        self.assertIn("PROBLEM: Datei nicht gefunden", r.stderr)
        r = kette("naehte", self.d / "a.mp4", self.d / "kette.mp4", "--nahtlos-farbe", "20", "--sprung-farbe", "10")
        self.assertEqual(r.returncode, 2)
        self.assertIn("PROBLEM: Schwellen widersprechen sich", r.stderr)


class Masse(unittest.TestCase):
    def test_gleiche_bilder(self):
        a = np.random.default_rng(1).integers(0, 256, (144, 256), dtype=np.uint8)
        self.assertAlmostEqual(kp.ssim(a, a), 1.0, places=9)
        self.assertEqual(kp.differenz(a, a), 0.0)

    def test_fremde_bilder(self):
        zufall = np.random.default_rng(2)
        a = zufall.integers(0, 256, (144, 256), dtype=np.uint8)
        b = zufall.integers(0, 256, (144, 256), dtype=np.uint8)
        self.assertLess(kp.ssim(a, b), 0.2)
        self.assertGreater(kp.differenz(a, b), 60)

    def test_farbabstand(self):
        a = np.random.default_rng(3).integers(40, 200, (144, 256, 3), dtype=np.uint8)
        self.assertEqual(kp.farbabstand(a, a), 0.0)
        self.assertAlmostEqual(kp.farbabstand(a, a + 20), 0.0, places=9)          # nur heller: zählt nicht als Farbe
        warm = (a.astype(np.int16) + (10, 0, -10)).astype(np.uint8)                 # R +10, B −10: Weißabgleich
        self.assertAlmostEqual(kp.farbabstand(a, warm), 5.802, places=3)          # (|ΔCb| 6,146 + |ΔCr| 5,458) / 2

    def test_urteil_und_bewegung(self):
        s = argparse.Namespace(nahtlos_diff=4, nahtlos_ssim=0.9, sprung_diff=20, sprung_ssim=0.6, nahtlos_farbe=2,
                               sprung_farbe=10)
        self.assertEqual(kp.urteil(1.0, 0.98, 0.5, s), "nahtlos")
        self.assertEqual(kp.urteil(8.0, 0.85, 0.5, s), "sichtbar")
        self.assertEqual(kp.urteil(25.0, 0.95, 0.5, s), "Sprung")
        self.assertEqual(kp.urteil(5.0, 0.5, 0.5, s), "Sprung")
        self.assertEqual(kp.urteil(1.0, 0.98, 5.0, s), "sichtbar")               # nur die Farbe weicht ab
        self.assertEqual(kp.urteil(1.0, 0.98, 12.0, s), "Sprung")
        self.assertTrue(kp.bewegung(3.0, 0.2, 3.1, 20).startswith("Bewegung stockt"))
        self.assertTrue(kp.bewegung(3.3, 1.2, 3.3, 20).startswith("Bewegung stockt"))
        self.assertTrue(kp.bewegung(0.0, 0.6, 36.0, 20).startswith("Schnitt zwischen den ersten zwei Bildern"))
        self.assertTrue(kp.bewegung(3.0, 3.1, 0.05, 20).startswith("Stopp-und-los – Clip n+1 beginnt im Stand"))
        self.assertTrue(kp.bewegung(0.05, 0.1, 0.08, 20).startswith("ruhig"))
        self.assertEqual(kp.bewegung(3.0, 3.2, 3.1, 20), "gleichmäßig")


if __name__ == "__main__":
    unittest.main()
