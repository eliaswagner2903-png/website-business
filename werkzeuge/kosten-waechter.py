#!/usr/bin/env python3
"""Kosten-Wächter (PreToolUse-Hook): bezahlte Erzeugung nur mit Elias' Freigabe (CLAUDE.md, Regel 7).

Greift bei allen Werkzeugen von Higgsfield und ElevenLabs, gleich unter welchem Servernamen sie eingebunden sind
(„Higgsfield“, „higgsfield“, „ElevenLabs-8672b025“, „claude_ai_Higgsfield“ …), und verlangt eine Bestätigung im
normalen Freigabedialog („ask“) – mit Werkzeug, Modell und Dauer in der Begründung. Im Zweifel fragt er.
Still (Exit 0 ohne Ausgabe) nur bei
  - ausdrücklich freien Werkzeugen (FREI: lesen, hochladen, warten, anzeigen),
  - reinen Kostenabfragen (tool_input.params.get_cost = true) bei Werkzeugen, deren Schema sie kennt (MIT_GET_COST);
    andere Werkzeuge ignorieren das Feld, dort wird trotzdem bezahlt,
  - fremden Werkzeugen und kaputter Eingabe.
Still heißt nicht „erlaubt“: der normale Berechtigungsablauf gilt weiter. Gibt nie „allow“ aus und blockiert nie.

Eingetragen in .claude/settings.json (PreToolUse). Selbsttest: python3 werkzeuge/test_kosten_waechter.py
"""
import json
import re
import sys

# mcp__<Server>__<Werkzeug>; der Servername enthält „higgsfield“ oder „elevenlabs“ in beliebiger Schreibung,
# auch mit Vor- oder Nachsilbe (claude.ai-Connector, Plugin, zweiter Connector).
NAME = re.compile(r"^mcp__.*?(higgsfield|elevenlabs).*?__(.+)$", re.IGNORECASE)

# Ausdrücklich gratis. Alles andere auf diesen Servern fragt, auch neue Werkzeuge. Bewusst kein „get_*“ oder „show_*“:
# get_katana_config verbraucht einen Gratislauf, show_characters trainiert eine Figur.
FREI = {
    "higgsfield": re.compile(
        r"balance|transactions|models_explore|jobs_wait|job_display|show_generations|show_generation_by_ids|"
        r"show_medias|show_plans_and_credits|media_(upload|confirm|import_url|upload_widget)|"
        r"get_(preferences|presets|preset_instructions|workflow_instructions|workflow_bundle_file|project|folder)|"
        r"(list|search)_\w+|\w+_status"),
    "elevenlabs": re.compile(
        r"creative_(list|get)_\w+|creative_show_flow_results|creative_create_flow|"
        r"creative_(create|finalize)_asset_upload|creative_attach_reference_file|get_more_tools"),
}

# Bekannt bezahlt: Begründung mit Hinweis auf die Kostenabfrage. Unbekannte Werkzeuge fragen ebenfalls.
BEZAHLT = {
    "higgsfield": {
        "generate_image", "generate_image_batch", "generate_video", "generate_video_batch",
        "generate_audio", "generate_audio_batch", "generate_3d", "execute_preset", "motion_control",
        "upscale_image", "upscale_video", "outpaint_image", "reframe", "remove_background", "relight_image",
        "voice_change", "dubbing", "create_voice", "create_voice_from_confirmed_audio",
        "ai_influencer_generate", "build_ai_influencer", "shorts_studio_create", "ads_studio_generate",
        "scene_builder_3d_generate_angles", "scene_builder_3d_generate_video", "apps_invoke",
    },
    "elevenlabs": {
        "creative_generate_image", "creative_generate_video", "creative_generate_speech",
        "creative_generate_in_flow", "creative_run_flow_nodes", "creative_edit_image",
        "creative_design_voice", "creative_transcribe_audio",
    },
}
# Kostenabfrage laut Werkzeug-Schema (Stand 02.11.2026). Nur hier ist params.get_cost eine echte Abfrage; die
# Stapel-Werkzeuge (*_batch) verbieten sie ausdrücklich, apps_invoke hat kein params.
MIT_GET_COST = {"generate_image", "generate_video", "generate_audio", "generate_3d", "reframe", "upscale_image",
                "outpaint_image"}
MIT_ESTIMATE_ONLY = BEZAHLT["elevenlabs"] - {"creative_design_voice"}
GRUND_BEZAHLT = "Bezahlte Erzeugung (Regel 7): nur mit Elias' ausdrücklicher Freigabe – was, wie viele Credits, wofür."
GRUND_UNBEKANNT = ("Nicht als gratis bekannt (Regel 7): dieses Werkzeug kann Credits kosten oder etwas auslösen – "
                   "kostet es etwas, nur mit Elias' ausdrücklicher Freigabe.")


def als_dict(wert):
    """params kommt als Objekt oder als JSON-Text (Higgsfield erlaubt beides); sonst leer."""
    if isinstance(wert, str):
        try:
            wert = json.loads(wert)
        except ValueError:
            return {}
    return wert if isinstance(wert, dict) else {}


def kostenhinweis(server, werkzeug):
    """Wie sich die Kosten vorher gratis klären lassen – nur, was das Schema des Werkzeugs hergibt."""
    if server == "higgsfield" and werkzeug in MIT_GET_COST:
        return "Kosten vorher gratis mit params.get_cost: true prüfen."
    if server == "higgsfield" and werkzeug.endswith("_batch"):
        return "Im Stapel gibt es keine Kostenabfrage – jeden Auftrag vorher einzeln mit params.get_cost: true prüfen."
    if server == "elevenlabs" and werkzeug in MIT_ESTIMATE_ONLY:
        return "Kosten vorher mit estimate_only: true prüfen."
    return "Dieses Werkzeug hat keine Kostenabfrage."


def angaben(eingabe):
    """Modell, Dauer, Anzahl – aus tool_input.params (Higgsfield) oder direkt aus tool_input (ElevenLabs)."""
    p = als_dict(eingabe.get("params")) or eingabe
    teile = []
    if p.get("model") or p.get("model_id"):
        teile.append(f"Modell: {p.get('model') or p.get('model_id')}")
    if p.get("duration") is not None:
        teile.append(f"Dauer: {p['duration']} s")
    if p.get("count") or p.get("generations_count"):
        teile.append(f"Anzahl: {p.get('count') or p.get('generations_count')}")
    if isinstance(eingabe.get("requests"), list):
        teile.append(f"Stapel: {len(eingabe['requests'])} Aufträge")
    if eingabe.get("estimate_only") is True:
        teile.append("nur Kostenschätzung (estimate_only)")
    return teile


def pruefe(daten):
    """Hook-Antwort („ask“) für jeden nicht ausdrücklich freien Aufruf der beiden Server, sonst None (= still)."""
    name = daten.get("tool_name")
    treffer = NAME.match(name) if isinstance(name, str) else None
    if not treffer:
        return None
    server, werkzeug = treffer.group(1).lower(), treffer.group(2)
    if FREI[server].fullmatch(werkzeug):
        return None
    eingabe = daten.get("tool_input")
    eingabe = eingabe if isinstance(eingabe, dict) else {}
    if server == "higgsfield" and werkzeug in MIT_GET_COST and als_dict(eingabe.get("params")).get("get_cost") is True:
        return None  # reine Kostenabfrage, gratis
    grund = (f"{GRUND_BEZAHLT} {kostenhinweis(server, werkzeug)}" if werkzeug in BEZAHLT[server]
             else GRUND_UNBEKANNT)
    grund += " " + " · ".join([f"Werkzeug: {name}", *angaben(eingabe)])
    return {"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "ask",
                                   "permissionDecisionReason": grund}}


def main():
    try:
        daten = json.loads(sys.stdin.buffer.read())
    except (OSError, ValueError):
        return 0  # kaputte Eingabe: nie blockieren, nichts ausgeben
    antwort = pruefe(daten) if isinstance(daten, dict) else None
    if antwort:
        print(json.dumps(antwort))  # nur dieses JSON auf stdout; ASCII-sicher dank \u-Escapes
    return 0


if __name__ == "__main__":
    sys.exit(main())
