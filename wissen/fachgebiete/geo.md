# GEO / KI-Suche (auch AEO, LLMO, AIO, „AI Search Visibility“)

> Key `geo` · requires: `seo`, `technical-seo`, `structured-data` · Sources: Q-G19–Q-G22, Q-K01–Q-K14, Q-W13 · As of 2026-09-29
> **Changes quickly:** re-research every 3 months (`wissen/quellen/AKTUALISIERUNG.md`).

## Begriffe (eine Aufgabe, viele Namen)
GEO, AEO, LLMO, AIO and „AI SEO“ mean the same thing: appearing in the answers of AI systems (Google AI Overviews/AI Mode, ChatGPT search, Claude,
Perplexity, Copilot) and being represented correctly. Google: „optimizing for generative AI search is … still SEO“ (Q-G20).
Only „GEO“ is defined as a research term (Q-K11). We therefore keep **one** area.

## 1 Ziel
The website is accessible to the search crawlers of all major AI providers, its core facts are clearly readable as text and consistent everywhere,
so that an AI system asked about such a business **can** find, understand and cite it correctly.

## 2 Warum relevant
More and more searches end in an AI answer. AI search systems rely on search indexes (Googlebot for AI Overviews, OAI-SearchBot for
ChatGPT search, Claude-SearchBot, PerplexityBot, Bingbot for Copilot). Whoever is missing or blocked there does not appear (Q-G19, Q-K01–Q-K03).

## 3 Faktoren – was belegt ist und was nicht
| Factor | Evidence |
|---|---|
| Accessible to the provider's search crawler and indexed (also no CDN/WAF block) | official (Q-G19, Q-K01, Q-K02, Q-K03) |
| Snippets allowed (no nosnippet/max-snippet:0 on the main content) | official (Q-G19) |
| Core info as text, not only in tabs, PDFs, images or via JS | official/vendor (Q-G19, Q-K05) |
| Own, concrete content with real experience | official (Q-G20, Q-G15) |
| Quotes, numbers, source citations | lab study (Q-K11); follow-up study: most tricks ineffective (Q-K12) |
| Mentions on third-party sites (press, directories, reviews) | preprint (Q-K13); local: Business Profile (Q-G20) |
| Consistent details about the business everywhere on the web („entity consistency“) | plausible, not directly evidenced |
| llms.txt, „chunking“, special AI files, special schema | explicitly unnecessary for Google (Q-G20); llms.txt only a proposal (Q-K09, Q-K10, Q-W13) |

## KI-Crawler (as of 2026-09-29, time-dependent)
| User-Agent | Operator | Purpose | robots.txt | Our default rule |
|---|---|---|---|---|
| Googlebot | Google | Search incl. AI Overviews/AI Mode | yes | allow |
| Google-Extended | Google | token only: Gemini training/grounding, **not** search | yes | customer decision (default: allow) |
| Bingbot | Microsoft | Search + Copilot | yes | allow |
| OAI-SearchBot | OpenAI | ChatGPT search | yes | allow |
| GPTBot | OpenAI | Training | yes | customer decision |
| ChatGPT-User | OpenAI | Fetch on user request | „may not apply“ | – |
| Claude-SearchBot | Anthropic | Search | yes | allow |
| ClaudeBot | Anthropic | Training | yes | customer decision |
| Claude-User | Anthropic | Fetch on user request | yes | allow |
| PerplexityBot | Perplexity | Search | yes | allow |
| Perplexity-User | Perplexity | Fetch on user request | mostly no | – |
| Applebot / Applebot-Extended | Apple | Search / training token only | yes | allow / customer decision |

Sources: Q-G22, Q-K01, Q-K02, Q-K03, Q-K08. According to the providers, blocking training crawlers has no influence on search.
Beware of Cloudflare: bot/„AI Crawl“ settings of the domain can block search crawlers even though robots.txt allows them – check after launch.

## 4 Beim Programmieren
- robots.txt without blocks for the search crawlers; block training crawlers only on explicit customer request (then separate `User-agent` groups).
- Fact block in the HTML: name, what, where, phone, hours, service area, prices (if approved) as text – not as an image, not only in the PDF,
  not behind accordions that are closed and empty without JS.
- Master data from one source (see `local-seo.md`), JSON-LD with `sameAs` to real profiles.

## 5 Inhalte und Strukturen
„Über uns“ with real facts (founding, master title, team, certificates – only what is evidenced); frequent customer questions answered directly;
services with concrete details (duration, process, price range, area).

## 6 Vermeiden
Guarantee promises, selling llms.txt as „AI optimization“, one page per question wording (fan-out, violates scaled content abuse policy, Q-G20),
artificial „mentions“, tools that measure „AI rankings“ with supposedly internal data (Q-G20).

## 7 Automatisch umsetzbar
robots.txt default, fact block from master data, JSON-LD.

## 8 Automatisch prüfbar
Search crawlers not blocked, no snippet blocks, facts as text on the home page, main content present without JS, NAP consistent.

## 9 Manuell prüfen
Cloudflare bot settings after launch, depth of content and authenticity of the details, customer decision on training crawlers.

## 10 Wie Claude die Umsetzung belegt
`QUALITAET.md` (ki-crawler, nosnippet, fakten-text, inhalt-ohne-js); in `abnahme.md` the customer decision on training crawlers and, after launch,
a `curl -A "OAI-SearchBot" -sI https://<domain>/` with status 200.

## Regeln

| ID | Regel | Stufe | Phase | Art | Prüfung | Beleg | Stand |
|---|---|---|---|---|---|---|---|
| GEO-01 | Do not block search crawlers (Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot, Applebot) – neither in robots.txt nor in Cloudflare bot settings | K | BA | SEMI-AUTO | ki-crawler | O Q-G19, O Q-K01, O Q-K02, O Q-K03 | zeitabh. |
| GEO-02 | Training crawlers (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended): document the customer's decision (default: allow) | E | P | MANUAL | | O Q-K01, O Q-K02, O Q-G22, O Q-K08 | zeitabh. |
| GEO-03 | Snippets allowed: no nosnippet, max-snippet:0 or data-nosnippet on the main content | K | B | AUTO | nosnippet | O Q-G19 | zeitabh. |
| GEO-04 | Core facts (name, service, place, contact, hours) as text in the HTML, not only in images, PDFs, tabs or via JS | K | PB | AUTO | fakten-text, inhalt-ohne-js | O Q-G19, O Q-K05, O Q-G14 | zeitabh. |
| GEO-05 | Unambiguous entity: same name, address, phone on all pages and in JSON-LD; `sameAs` only to real profiles | E | B | SEMI-AUTO | nap | O Q-G26, F Q-F08 | zeitabh. |
| GEO-06 | Own, verifiable details (numbers, experience, certificates, sources) instead of platitudes – only what is evidenced | E | P | MANUAL | | O Q-G20, O Q-G15, S Q-K11 | zeitabh. |
| GEO-07 | Answer frequent customer questions visibly and directly, without one page per wording | E | P | MANUAL | | O Q-G20, O Q-K05 | zeitabh. |
| GEO-08 | No guarantee statements about AI visibility in the site, offer and report | K | PA | MANUAL | | O Q-G19, O Q-G20 | stabil |
| GEO-09 | llms.txt or special AI files at most as an addition without promising an effect | Z | B | MANUAL | | O Q-G20, O Q-W13, F Q-K09 | zeitabh. |
| GEO-10 | After launch: look at Search Console (generative AI report) and Bing „AI Performance“; no tools with supposed Google-internal AI data | Z | L | MANUAL | | O Q-G20, O Q-K06 | zeitabh. |

## Mythen und Unbelegtes
| Claim | State |
|---|---|
| „llms.txt is mandatory / improves ranking“ | Google: ignored (Q-G20); no provider confirms using it in search |
| „Schema.org makes ChatGPT recommend you“ | no evidence (Q-G19, Q-G20) |
| „AI prefers FAQ blocks / short chunks“ | Bing recommends Q&A without measurement (Q-K05), Google: chunking unnecessary (Q-G20) |
| „Blocking Google-Extended blocks AI Overviews“ | false: AI Overviews run through Googlebot (Q-G22) |
| „GEO brings +40 % visibility in ChatGPT“ | lab value (Q-K11), not confirmed in follow-up studies (Q-K12, Q-K14) |
| „Tool X measures your AI ranking“ | no third party has Google-internal data (Q-G20) |

## Zeitabhängig (re-research every 3 months)
Crawler names and purposes (Q-K01–Q-K03, Q-K08), Google AI docs incl. Search Console switches (Q-G19–Q-G21), Bing controls (Q-K04, Q-K06),
state of research (Q-K12–Q-K14), llms.txt status (Q-K09, Q-K10, Q-W13). The Google pages Q-G19 (as of 12/2025) and Q-G20 (07/2026) are not in sync.
