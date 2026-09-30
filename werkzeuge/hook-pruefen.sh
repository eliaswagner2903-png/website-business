#!/usr/bin/env bash
# PostToolUse-Hook (Edit/Write): prüft bearbeitete Seiten sofort (html-validate + Kopf-Regeln).
# Bei _headers und Functions laufen die Tests der Seite. Fehler gehen an Claude zurück (Exit 2), sonst still.
f=$(python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("tool_input",{}).get("file_path",""))' 2>/dev/null)
cd "$(dirname "$0")/.." || exit 0
case "$f" in
  */public/*.html)
    v=werkzeuge/node_modules/.bin/html-validate; [ -x "$v" ] || v=true; rc=0
    out=$("$v" -c werkzeuge/.htmlvalidate.json "$f" 2>&1) || { echo "html-validate meldet Fehler in $f:" >&2; echo "$out" | head -30 >&2; rc=2; }
    kopf=$(python3 werkzeuge/kopf-pruefen.py "$f" 2>&1) || { echo "Kopf-Prüfung meldet Fehler (Regeln in CLAUDE.md):" >&2; echo "$kopf" >&2; rc=2; }
    seite=${f%%/public/*}; if grep -q '<script>' "$f"; then out=$(cd "$seite" && node --test tests/sicherheit.test.mjs 2>&1) || { echo "Sicherheitstest (CSP-Hash?) schlägt fehl:" >&2; echo "$out" | grep -E '^not ok|fehlt|ohne Hash' >&2; rc=2; }; fi
    exit $rc;;
  */public/_headers|*/functions/*.js)
    seite=${f%%/public/*}; seite=${seite%%/functions/*}
    [ -d "$seite/tests" ] || exit 0
    out=$(cd "$seite" && node --test tests/*.test.mjs 2>&1) || { echo "Tests in $seite schlagen fehl:" >&2; echo "$out" | grep -E '^not ok|Error|assert' | head -20 >&2; exit 2; }
    exit 0;;
  */wissen/youtube/*.md)
    case "$f" in */index.md|*/README.md|*/VORLAGE.md) exit 0;; esac
    out=$(python3 werkzeuge/youtube.py pruefen "$f" 2>&1) || { echo "YouTube-Wissensdatei mit Mängeln (Format: wissen/youtube/VORLAGE.md):" >&2; echo "$out" | grep -E '^MANGEL|^   -' >&2; exit 2; }
    exit 0;;
esac
exit 0
