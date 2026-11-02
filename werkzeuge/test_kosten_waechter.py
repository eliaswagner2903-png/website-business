#!/usr/bin/env python3
"""Selbsttest für den Kosten-Wächter (werkzeuge/kosten-waechter.py) und seinen Eintrag in .claude/settings.json.

    python3 werkzeuge/test_kosten_waechter.py
"""
import json
import re
import subprocess
import sys
import unittest
from pathlib import Path

WURZEL = Path(__file__).resolve().parent.parent
SKRIPT = WURZEL / "werkzeuge" / "kosten-waechter.py"
EINSTELLUNGEN = WURZEL / ".claude" / "settings.json"
# Dieselben bezahlten Werkzeuge unter anderen Servernamen: lokal kleingeschrieben, Zusatz mit Unterstrich,
# claude.ai-Connector in der lokalen CLI, Plugin-Server
ANDERE_SERVER = ("mcp__higgsfield__generate_video", "mcp__ElevenLabs_2__creative_generate_speech",
                 "mcp__claude_ai_Higgsfield__generate_video", "mcp__plugin_film_higgsfield__generate_video")


def hook(eingabe):
    """Startet den Hook wie Claude Code (JSON auf stdin) und liefert (Exit-Code, stdout)."""
    text = eingabe if isinstance(eingabe, str) else json.dumps(
        {"session_id": "test", "hook_event_name": "PreToolUse", "tool_use_id": "t1", **eingabe})
    lauf = subprocess.run([sys.executable, str(SKRIPT)], input=text, capture_output=True, text=True, timeout=10)
    return lauf.returncode, lauf.stdout


def aufruf(name, **tool_input):
    return {"tool_name": name, "tool_input": tool_input}


class KostenWaechter(unittest.TestCase):
    def fragt(self, eingabe):
        code, aus = hook(eingabe)
        self.assertEqual(code, 0)
        self.assertTrue(aus.isascii(), "stdout soll ASCII-sicher sein")
        antwort = json.loads(aus)["hookSpecificOutput"]
        self.assertEqual(antwort["hookEventName"], "PreToolUse")
        self.assertEqual(antwort["permissionDecision"], "ask")
        return antwort["permissionDecisionReason"]

    def still(self, eingabe):
        self.assertEqual(hook(eingabe), (0, ""))

    def test_higgsfield_video_ohne_get_cost_fragt(self):
        grund = self.fragt(aufruf("mcp__Higgsfield__generate_video",
                                  params={"model": "kling_o3_flf", "duration": 5, "prompt": "Probe"}))
        for teil in ("Regel 7", "Elias", "get_cost", "mcp__Higgsfield__generate_video", "Modell: kling_o3_flf",
                     "Dauer: 5 s"):
            self.assertIn(teil, grund)

    def test_higgsfield_video_mit_get_cost_still(self):
        self.still(aufruf("mcp__Higgsfield__generate_video", params={"model": "kling_o3_flf", "get_cost": True}))
        self.still(aufruf("mcp__Higgsfield__generate_video", params='{"model": "kling_o3_flf", "get_cost": true}'))

    def test_get_cost_nur_bei_echtem_true(self):
        for wert in (False, "true", 1):
            with self.subTest(get_cost=wert):
                self.fragt(aufruf("mcp__Higgsfield__generate_video", params={"model": "x", "get_cost": wert}))

    def test_get_cost_still_nur_wo_das_schema_es_kennt(self):
        for werkzeug in ("generate_image", "generate_audio", "generate_3d", "reframe", "upscale_image",
                         "outpaint_image"):
            with self.subTest(werkzeug=werkzeug):
                self.still(aufruf(f"mcp__Higgsfield__{werkzeug}", params={"get_cost": True}))
        # Ohne Kostenabfrage im Schema wird get_cost ignoriert und trotzdem bezahlt: fragen
        faelle = {
            "mcp__Higgsfield__generate_video_batch": dict(
                params={"get_cost": True}, requests=[{"index": 0, "params": {"model": "kling_o3_flf", "duration": 5}}]),
            "mcp__Higgsfield__generate_image_batch": dict(requests=[{"index": 0, "params": {"get_cost": True}}]),
            "mcp__Higgsfield__apps_invoke": dict(params={"get_cost": True}, app_id="a", action="render",
                                                 manifest_revision="1", arguments={}),
            "mcp__Higgsfield__upscale_video": dict(params={"get_cost": True, "provider": "topaz", "video_id": "v"}),
            "mcp__ElevenLabs__creative_generate_speech": dict(params={"get_cost": True}, prompt="Hallo"),
        }
        for name, eingabe in faelle.items():
            with self.subTest(name=name):
                self.fragt(aufruf(name, **eingabe))
        grund = self.fragt(aufruf("mcp__Higgsfield__generate_video_batch", params={"get_cost": True}, requests=[]))
        self.assertIn("Im Stapel gibt es keine Kostenabfrage", grund)

    def test_andere_servernamen_fragen(self):
        for name in ANDERE_SERVER:
            with self.subTest(name=name):
                self.assertIn(name, self.fragt(aufruf(name, params={"model": "kling_o3_flf"}, prompt="Probe")))
        self.still(aufruf("mcp__claude_ai_Higgsfield__generate_video", params={"model": "x", "get_cost": True}))
        self.still(aufruf("mcp__higgsfield__balance"))

    def test_unbekannte_werkzeuge_fragen(self):
        for name in ("mcp__Higgsfield__neues_werkzeug", "mcp__Higgsfield__virality_predictor",
                     "mcp__Higgsfield__video_analysis_create", "mcp__Higgsfield__show_characters",
                     "mcp__Higgsfield__get_katana_config", "mcp__ElevenLabs__creative_neues_werkzeug"):
            with self.subTest(name=name):
                self.assertIn("Nicht als gratis bekannt", self.fragt(aufruf(name)))

    def test_elevenlabs_sprache_fragt(self):
        grund = self.fragt(aufruf("mcp__ElevenLabs__creative_generate_speech", prompt="Hallo", model_id="eleven_v4",
                                  voice_id="v1", context="Probe"))
        for teil in ("mcp__ElevenLabs__creative_generate_speech", "Modell: eleven_v4", "estimate_only"):
            self.assertIn(teil, grund)

    def test_elevenlabs_zweitserver_sprache_fragt(self):
        grund = self.fragt(aufruf("mcp__ElevenLabs-8672b025__creative_generate_speech", prompt="Hallo",
                                  model_id="eleven_v4", voice_id="v1", context="Probe"))
        self.assertIn("mcp__ElevenLabs-8672b025__creative_generate_speech", grund)

    def test_stapel_nennt_anzahl(self):
        grund = self.fragt(aufruf("mcp__Higgsfield__generate_image_batch",
                                  requests=[{"index": 0, "params": {"model": "a"}}, {"index": 1, "params": {}}]))
        self.assertIn("Stapel: 2 Aufträge", grund)

    def test_harmlose_werkzeuge_still(self):
        for name in ("mcp__Higgsfield__models_explore", "mcp__Higgsfield__balance", "mcp__Higgsfield__jobs_wait",
                     "mcp__Higgsfield__media_upload", "mcp__Higgsfield__show_generations",
                     "mcp__Higgsfield__list_voices", "mcp__Higgsfield__shorts_studio_status",
                     "mcp__ElevenLabs__creative_list_voices", "mcp__ElevenLabs-8672b025__creative_get_flow_run_status",
                     "mcp__ElevenLabs__creative_create_flow", "mcp__Canva__generate-design",
                     "mcp__github__create_branch", "Bash"):
            with self.subTest(name=name):
                self.still(aufruf(name))

    def test_kaputte_eingabe_still(self):
        for text in ("{kaputt", "", "[]", "null", '{"tool_name": 7}'):
            with self.subTest(text=text):
                self.still(text)

    @staticmethod
    def matcher():
        gruppen = json.loads(EINSTELLUNGEN.read_text(encoding="utf-8"))["hooks"]["PreToolUse"]
        gruppe = next(g for g in gruppen if any("kosten-waechter.py" in h["command"] for h in g["hooks"]))
        return re.compile(gruppe["matcher"])  # Claude Code: unverankerter JS-Regex, hier gleichwertig

    def test_matcher_in_settings_trifft_die_server(self):
        muster = self.matcher()
        for name in ("mcp__Higgsfield__generate_video", "mcp__ElevenLabs__creative_generate_speech",
                     "mcp__ElevenLabs-8672b025__creative_generate_speech"):
            self.assertTrue(muster.search(name), name)
        for name in ("Bash", "Edit", "mcp__Canva__generate-design", "mcp__github__create_branch"):
            self.assertFalse(muster.search(name), name)

    def test_matcher_in_settings_trifft_andere_servernamen(self):
        """Das Skript erkennt die Server unter jedem Namen – aber nur, wenn der Matcher ihm den Aufruf übergibt."""
        muster = self.matcher()
        for name in ANDERE_SERVER:
            self.assertTrue(muster.search(name), f"{name} läuft am Wächter vorbei: Matcher in .claude/settings.json "
                            'erweitern, z. B. "mcp__.*([Hh]iggsfield|[Ee]leven[Ll]abs)" (nur mit Elias\' OK)')


if __name__ == "__main__":
    unittest.main()
