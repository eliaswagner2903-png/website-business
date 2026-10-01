#!/usr/bin/env bash
# PostToolUse hook (Edit/Write): checks edited pages immediately (html-validate + head rules).
# For _headers and functions the site's tests run. Errors go back to Claude (exit 2), otherwise silent.
f=$(python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("tool_input",{}).get("file_path",""))' 2>/dev/null)
cd "$(dirname "$0")/.." || exit 0
case "$f" in
  */public/*.html)
    v=werkzeuge/node_modules/.bin/html-validate; [ -x "$v" ] || v=true; rc=0
    out=$("$v" -c werkzeuge/.htmlvalidate.json "$f" 2>&1) || { echo "html-validate reports errors in $f:" >&2; echo "$out" | head -30 >&2; rc=2; }
    kopf=$(python3 werkzeuge/kopf-pruefen.py "$f" 2>&1) || { echo "Head check reports errors (rules in CLAUDE.md):" >&2; echo "$kopf" >&2; rc=2; }
    seite=${f%%/public/*}; if grep -q '<script>' "$f"; then out=$(cd "$seite" && node --test tests/sicherheit.test.mjs 2>&1) || { echo "Security test (CSP hash?) fails:" >&2; echo "$out" | grep -E '^not ok|fehlt|ohne Hash' >&2; rc=2; }; fi
    exit $rc;;
  */public/_headers|*/functions/*.js)
    seite=${f%%/public/*}; seite=${seite%%/functions/*}
    [ -d "$seite/tests" ] || exit 0
    out=$(cd "$seite" && node --test tests/*.test.mjs 2>&1) || { echo "Tests in $seite fail:" >&2; echo "$out" | grep -E '^not ok|Error|assert' | head -20 >&2; exit 2; }
    exit 0;;
  */wissen/youtube/*.md)
    case "$f" in */index.md|*/README.md|*/VORLAGE.md) exit 0;; esac
    out=$(python3 werkzeuge/youtube.py pruefen "$f" 2>&1) || { echo "YouTube knowledge file has defects (format: wissen/youtube/VORLAGE.md):" >&2; echo "$out" | grep -E '^MANGEL|^   -' >&2; exit 2; }
    exit 0;;
esac
exit 0
