#!/usr/bin/env bash
# Lighthouse mobil mit Kompression, 3 Läufe je Seite.  werkzeuge/lighthouse.sh vorlage/public [port=8080]
# Vorher: cd werkzeuge && npm install ; node werkzeuge/gzserver.mjs 8080 vorlage/public &
set -u; ordner=$1; port=${2:-8080}; cd "$(dirname "$0")/.."
CH=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome 2>/dev/null | head -1); export CHROME_PATH=${CHROME_PATH:-$CH}
mkdir -p werkzeuge/ausgabe
for s in ${SEITEN:-$(ls "$ordner" | grep -E '\.html?$')}; do for i in 1 2 3; do
  werkzeuge/node_modules/.bin/lighthouse "http://localhost:$port/$s" --quiet --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=werkzeuge/ausgabe/lh.json >/dev/null 2>&1
  node -e '
const d=require("./werkzeuge/ausgabe/lh.json"),a=d.audits,k=d.categories;
const lcp=(a["lcp-breakdown-insight"]?.details?.items||[])[1]?.selector||"";
console.log(process.argv[1].padEnd(22),"Perf",Math.round(k.performance.score*100),"A11y",Math.round(k.accessibility.score*100),"BP",Math.round(k["best-practices"].score*100),"SEO",Math.round(k.seo.score*100),"| LCP",a["largest-contentful-paint"].displayValue,"TBT",a["total-blocking-time"].displayValue,"CLS",a["cumulative-layout-shift"].displayValue,"| LCP-Element:",lcp)' "$s#$i"
done; done
