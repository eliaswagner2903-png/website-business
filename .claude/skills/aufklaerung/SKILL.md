---
name: aufklaerung
description: Fully reconnoiter a website with the Fernspäherkommando (design, technology, security by observation only, function, SEO) and deliver a dossier. Use on "/aufklaerung <url>", for competitor analysis before an offer, or for an in-depth check of a customer site.
---

# Reconnaissance by the Fernspäherkommando

Taken over from the repo Fernsp-herkommando-Fortenbacher-; Kommandeur Stahl leads here in place of Hfw Fortenbacher:

1. Set the target URL. Security is purely observational – no scanning, no attacking.
2. Deploy the five scouts in parallel with the same URL (agent tool):
   `uffz-schnoerkel` (design), `osg-snats` (technology/performance/a11y), `gefr-gummihals` (security),
   `osg-fritte` (function), `hptgefr-duden` (content/SEO). Leave out subjects that do not fit and give the reason.
3. Hand all finding blocks unchanged to `fw-gezi-golem` → one dossier.
4. Dossier + commander's assessment to the user; for our own customer site, log defects as orders.

The scouts start their browser via `.claude/mcp/playwright.mjs` (folder must be trusted). If the browser fails,
they work "from outside" – this must be stated in the dossier.
