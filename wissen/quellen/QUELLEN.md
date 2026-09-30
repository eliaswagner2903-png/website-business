# Quellenregister des Qualitätssystems

> Jede Regel in `wissen/fachgebiete/` verweist in der Spalte **Beleg** auf eine ID aus dieser Liste.
> Recherche am 2026-09-29 mit vier parallelen Rechercheuren (A-051). Jede Quelle wurde abgerufen, wichtige Stellen
> sind am Originaltext geprüft. Wo nur eine Sekundärquelle erreichbar war, steht das in der Spalte „Art“.
>
> **Art:** O = offiziell (Suchmaschine, KI-Anbieter, W3C, schema.org, IETF, Behörde) · G = Gesetz · S = Studie ·
> F = Fachquelle (MDN, OWASP, NN/g, Fachpresse) · P = eigene Praxis/Messung (wissen/FEHLER.md, MEISTERSTANDARD).
> **Stabilität:** stabil = Grundlagen, die sich selten ändern (Prüfung jährlich) · zeitabh. = Richtlinien, Produkte,
> KI-Verhalten, Schwellenwerte (Prüfung alle 3–6 Monate). `node werkzeuge/wissen-alter.mjs` listet fällige Zeilen.

## Google Search Central

| ID | Quelle | URL | Stand | Stützt | Art | Stabilität | Nächste Prüfung |
|---|---|---|---|---|---|---|---|
| Q-G01 | SEO Starter Guide | https://developers.google.com/search/docs/fundamentals/seo-starter-guide | 2025-12-10 | keine meta keywords, keine Wortzahl, Keywords in Domain/URL kaum Wirkung, E-E-A-T kein Rankingfaktor, Überschriften-Reihenfolge für Google egal, Duplikate kanonisieren | O | stabil | 2027-09-29 |
| Q-G02 | Title links | https://developers.google.com/search/docs/appearance/title-link | 2025-12-10 | eigener beschreibender Titel je Seite, keine Längengrenze, kein Keyword-Stapeln; Quellen für Titel-Link (title, h1, og:title, WebSite) | O | stabil | 2027-09-29 |
| Q-G03 | Snippets / meta description | https://developers.google.com/search/docs/appearance/snippet | 2026-04-20 | Description je Seite einzigartig, keine Längengrenze, nosnippet / max-snippet / data-nosnippet | O | stabil | 2027-09-29 |
| Q-G04 | Link best practices | https://developers.google.com/search/docs/crawling-indexing/links-crawlable | 2025-12-10 | nur `<a href>` ist crawlbar; beschreibender Ankertext statt „hier klicken“; jede wichtige Seite von mindestens einer anderen verlinkt | O | stabil | 2027-09-29 |
| Q-G05 | Google Images best practices | https://developers.google.com/search/docs/appearance/google-images | 2026-03-02 | beschreibender alt, beschreibende Dateinamen, `<img>` statt CSS-Hintergrund, srcset mit src-Fallback, Formate | O | stabil | 2027-09-29 |
| Q-G06 | Lazy loading (Search) | https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading | 2025-12-10 | Inhalte dürfen nicht von Klick/Scroll abhängen, Google interagiert nicht | O | stabil | 2027-09-29 |
| Q-G07 | Consolidate duplicate URLs | https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls | 2026-07-10 | Canonical absolut, nicht per robots.txt/noindex kanonisieren, keine widersprüchlichen Signale | O | stabil | 2027-09-29 |
| Q-G08 | robots.txt intro | https://developers.google.com/search/docs/crawling-indexing/robots/intro | 2025-12-10 | robots.txt verhindert keine Indexierung | O | stabil | 2027-09-29 |
| Q-G09 | Block indexing (noindex) | https://developers.google.com/search/docs/crawling-indexing/block-indexing | 2025-12-10 | noindex per Meta/X-Robots-Tag, Seite nicht zugleich per robots.txt sperren, kein noindex in robots.txt | O | stabil | 2027-09-29 |
| Q-G10 | Build and submit a sitemap | https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap | 2026-07-08 | absolute URLs, UTF-8, priority/changefreq ignoriert, lastmod nur wenn korrekt, Sitemap-Zeile in robots.txt | O | stabil | 2027-09-29 |
| Q-G11 | Redirects | https://developers.google.com/search/docs/crawling-indexing/301-redirects | 2026-04-14 | serverseitige permanente Weiterleitungen (301/308) bevorzugt | O | stabil | 2027-09-29 |
| Q-G12 | HTTP status codes | https://developers.google.com/search/docs/crawling-indexing/http-network-errors | 2026-02-04 | 404/410 gleich, Soft-404, max. 10 Weiterleitungen | O | zeitabh. | 2027-03-29 |
| Q-G13 | Mobile-first indexing | https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing | 2025-12-10 | mobile Fassung wird indexiert; gleiche Inhalte, Daten, Meta auf Handy und Computer | O | stabil | 2027-09-29 |
| Q-G14 | JavaScript SEO basics | https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics | 2026-03-04 | Rendern in Phasen, SSR/Prerendering empfohlen, noindex im Ausgangs-HTML | O | stabil | 2027-09-29 |
| Q-G15 | Creating helpful, reliable, people-first content | https://developers.google.com/search/docs/fundamentals/creating-helpful-content | 2025-12-10 | people-first, Trust am wichtigsten, Who/How/Why, keine Wortzahl, Datum ohne Änderung hilft nicht | O | zeitabh. | 2027-03-29 |
| Q-G16 | Spam policies | https://developers.google.com/search/docs/essentials/spam-policies | 2026-08-28 | Doorway-Seiten je Stadt, Ortslisten = Keyword-Stuffing, scaled content abuse, back button hijacking (seit 2026-06-15) | O | zeitabh. | 2027-03-29 |
| Q-G17 | Using generative AI content | https://developers.google.com/search/docs/fundamentals/using-gen-ai-content | 2025-12-10 | KI-Texte erlaubt, verboten ist Masse ohne Mehrwert; Metadaten müssen stimmen | O | zeitabh. | 2027-03-29 |
| Q-G18 | Page experience | https://developers.google.com/search/docs/appearance/page-experience | 2026-09-22 | Core Web Vitals werden von Rankingsystemen genutzt, Relevanz geht vor, kein Garant | O | zeitabh. | 2027-03-29 |
| Q-G19 | AI features and your website | https://developers.google.com/search/docs/appearance/ai-features | 2025-12-10 | keine Zusatzanforderungen für AI Overviews/AI Mode; Voraussetzung indexiert + Snippet erlaubt; kein spezielles Schema; Steuerung per Googlebot/Snippet-Regeln | O | zeitabh. | 2026-12-29 |
| Q-G20 | Optimizing for generative AI features | https://developers.google.com/search/docs/fundamentals/ai-optimization-guide | 2026-07-10 | llms.txt, Chunking, Spezial-Markup unnötig; „still SEO“; Fan-out-Seiten = scaled content abuse; lokal → Business Profile | O | zeitabh. | 2026-12-29 |
| Q-G21 | Search Console: generative AI features setting | https://support.google.com/webmasters/answer/16908024 | 2026-08-31 | Opt-out-Schalter für KI-Funktionen, standardmäßig an | O | zeitabh. | 2026-12-29 |
| Q-G22 | Google common crawlers | https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers | 2026-07-14 | Google-Extended betrifft Gemini-Training/Grounding, nicht Suche und nicht AI Overviews | O | zeitabh. | 2026-12-29 |
| Q-G23 | General structured data guidelines | https://developers.google.com/search/docs/appearance/structured-data/sd-policies | 2026-07-10 | nur Sichtbares markieren, nichts Irreführendes, spezifischster Typ, JSON-LD empfohlen, Pflichtfelder sonst kein Rich Result, keine Garantie | O | stabil | 2027-09-29 |
| Q-G24 | LocalBusiness structured data | https://developers.google.com/search/docs/appearance/structured-data/local-business | 2026-09-08 | Pflicht name + address; empfohlen geo, menu, openingHoursSpecification, priceRange < 100 Zeichen, servesCuisine, telephone, url; Mehrfachtyp als Array; Formate für 24 h/geschlossen/Saison | O | stabil | 2027-09-29 |
| Q-G25 | Review snippet | https://developers.google.com/search/docs/appearance/structured-data/review-snippet | 2026-09-08 | keine Sterne für Eigenbewertungen von LocalBusiness/Organization (seit 2019); keine gekauften Bewertungen (seit 2026-07-24) | O | zeitabh. | 2027-03-29 |
| Q-G26 | Organization structured data | https://developers.google.com/search/docs/appearance/structured-data/organization | 2026-09-08 | keine Pflichtfelder; logo ≥ 112 px, sameAs, vatID; nur Startseite/Über uns; bei lokalen Betrieben LocalBusiness-Subtyp | O | stabil | 2027-09-29 |
| Q-G27 | Breadcrumb structured data | https://developers.google.com/search/docs/appearance/structured-data/breadcrumb | 2025-01-23 | ≥ 2 ListItems; seit 2025 mobil nur Domain | O | zeitabh. | 2027-03-29 |
| Q-G28 | Site names (WebSite) | https://developers.google.com/search/docs/appearance/site-names | 2025-12-10 | WebSite name + url nur auf der Startseite | O | stabil | 2027-09-29 |
| Q-G29 | Search Central updates (Features eingestellt) | https://developers.google.com/search/updates | 2026-09 | FAQ-Rich-Results seit 2026-05-07 abgeschaltet, HowTo 2023, Sitelinks-Suchfeld 2024, sieben Typen 2025 | O | zeitabh. | 2026-12-29 |
| Q-G30 | Business Profile: Richtlinien Darstellung | https://support.google.com/business/answer/3038177?hl=de | 2026-09 | echter Name ohne Keywords, keine virtuellen Büros, Servicegebiet statt Adresse, lokale Nummer | O | stabil | 2027-09-29 |
| Q-G31 | Lokales Ranking verbessern | https://support.google.com/business/answer/7091?hl=de | 2026-09 | Relevanz, Entfernung, Bekanntheit; Rezensionen und Verweise zählen zur Bekanntheit; Ranking nicht käuflich | O | stabil | 2027-09-29 |
| Q-G32 | Richtlinie zu Rezensionen (verbotene Inhalte) | https://support.google.com/contributionpolicy/answer/7400114?hl=de | 2026-09 | keine Anreize, kein Review-Gating, keine Interessenkonflikte | O | stabil | 2027-09-29 |
| Q-G33 | Quality Rater Guidelines | https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf | 2025-09-11 | Trust ist das wichtigste Glied von E-E-A-T; Rater-Daten fließen nicht direkt ins Ranking | O | zeitabh. | 2027-03-29 |
| Q-G34 | Search updates: Mobile-Friendly Test eingestellt | https://developers.google.com/search/updates | 2023-12-01 | Test und Bericht eingestellt, Ersatz Lighthouse | O | stabil | 2027-09-29 |

## Web-Standards, Leistung, Barrierefreiheit

| ID | Quelle | URL | Stand | Stützt | Art | Stabilität | Nächste Prüfung |
|---|---|---|---|---|---|---|---|
| Q-W01 | Web Vitals | https://web.dev/articles/vitals | 2025 | LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 am 75. Perzentil, Handy und Computer getrennt | O | zeitabh. | 2027-03-29 |
| Q-W02 | Optimize LCP | https://web.dev/articles/optimize-lcp | 2025 | LCP-Bild mit fetchpriority=high, nie lazy, im Ausgangs-HTML auffindbar, keine synchronen Skripte im Kopf | O | stabil | 2027-09-29 |
| Q-W03 | Optimize CLS | https://web.dev/articles/optimize-cls | 2025-02-07 | width/height oder aspect-ratio, Platz reservieren, font-display, Animation per transform | O | stabil | 2027-09-29 |
| Q-W04 | Optimize INP / long tasks | https://web.dev/articles/optimize-inp | 2024-12-19 | lange Tasks > 50 ms aufteilen, kleines DOM, kein Layout-Thrashing | O | stabil | 2027-09-29 |
| Q-W05 | Font best practices | https://web.dev/articles/font-best-practices | 2022-10-04 | WOFF2, Subsetting, font-display optional/swap | O | stabil | 2027-09-29 |
| Q-W06 | Browser-level image lazy loading | https://web.dev/articles/browser-level-image-lazy-loading | 2024-08-13 | Bilder im ersten Bildschirm nicht lazy, immer Maße angeben | O | stabil | 2027-09-29 |
| Q-W07 | WCAG 2.2 (W3C Recommendation) | https://www.w3.org/TR/WCAG22/ | 2024-12-12 | Erfolgskriterien A/AA, u. a. 1.4.3 Kontrast, 1.4.4 Zoom, 1.4.10 Reflow 320 px, 2.4.11 Fokus nicht verdeckt, 2.5.8 Zielgröße 24 px, 3.2.6 Hilfe, 3.3.7, 3.3.8; 4.1.1 entfällt | O | stabil | 2027-09-29 |
| Q-W08 | ACT-Regel Meta-Viewport | https://www.w3.org/WAI/standards-guidelines/act/rules/b4f0c3/ | 2026 | user-scalable=no oder maximum-scale < 2 ist ein Verstoß | O | stabil | 2027-09-29 |
| Q-W09 | WCAG 3.0 Working Draft | https://www.w3.org/TR/wcag-3.0/ | 2026-09-10 | nur Entwurf, noch Jahre entfernt, nicht als Anforderung verwenden | O | zeitabh. | 2027-03-29 |
| Q-W10 | EN 301 549 V4.1.1 / AccessibleEU | https://accessible-eu-centre.ec.europa.eu/content-corner/news/european-accessibility-standard-en-301-549-has-been-updated-2026-09-07_en | 2026-09-07 | V4.1.1 an WCAG 2.2 angeglichen; bis zur Zitierung im Amtsblatt gilt V3.2.1 (WCAG 2.1) | O | zeitabh. | 2026-12-29 |
| Q-W11 | MDN Heading elements | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements | 2026 | eine h1, keine Ebenen überspringen (Barrierefreiheit) | F | stabil | 2027-09-29 |
| Q-W12 | Open Graph protocol | https://ogp.me/ | – | og:title, og:type, og:image, og:url | F | stabil | 2027-09-29 |
| Q-W13 | Lighthouse: llms.txt (Agentic Browsing, experimentell) | https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt | 2026-05-05 | llms.txt optional, 404 = nicht anwendbar, kein Score | O | zeitabh. | 2026-12-29 |

## schema.org

| ID | Quelle | URL | Stand | Stützt | Art | Stabilität | Nächste Prüfung |
|---|---|---|---|---|---|---|---|
| Q-S01 | schema.org Typ-Hierarchie (LocalBusiness-Untertypen) | https://schema.org/LocalBusiness | V30.1 | FoodEstablishment → Restaurant, CafeOrCoffeeShop, Bakery; HealthAndBeautyBusiness → HairSalon, BeautySalon, NailSalon; HomeAndConstructionBusiness → Electrician, Plumber, HVACBusiness, RoofingContractor, HousePainter, GeneralContractor; MedicalBusiness → Dentist, Physiotherapy; LegalService; AccountingService | O | stabil | 2027-09-29 |
| Q-S02 | schema.org Eigenschaften hasMenu, acceptsReservations, areaServed, hasMap, hasOfferCatalog | https://schema.org/hasMenu | V30.1 | hasMenu ersetzt menu; areaServed ersetzt serviceArea; ProfessionalService und Attorney veraltet | O | stabil | 2027-09-29 |
| Q-S03 | Schema Markup Validator | https://validator.schema.org/ | – | allgemeine Syntaxprüfung ohne Google-Regeln | O | stabil | 2027-09-29 |
| Q-S04 | Rich Results Test | https://search.google.com/test/rich-results | – | Google-spezifische Prüfung (nur öffentlich erreichbare Seiten oder Code-Einfügung) | O | zeitabh. | 2027-03-29 |

## KI-Suche (Anbieter und Forschung)

| ID | Quelle | URL | Stand | Stützt | Art | Stabilität | Nächste Prüfung |
|---|---|---|---|---|---|---|---|
| Q-K01 | OpenAI crawlers | https://developers.openai.com/api/docs/bots | 2026-09 | OAI-SearchBot für ChatGPT-Suche zulassen; GPTBot = Training, unabhängig steuerbar; ChatGPT-User nicht an robots.txt gebunden | O | zeitabh. | 2026-12-29 |
| Q-K02 | Anthropic crawlers | https://support.claude.com/en/articles/8896518 | 2026-09 | ClaudeBot = Training, Claude-SearchBot = Suche, Claude-User = Nutzerabruf, alle respektieren robots.txt | O | zeitabh. | 2026-12-29 |
| Q-K03 | Perplexity crawlers | https://docs.perplexity.ai/guides/bots | 2026-09 | PerplexityBot = Suche, respektiert robots.txt; Perplexity-User ignoriert es meist | O | zeitabh. | 2026-12-29 |
| Q-K04 | Bing: NOCACHE/NOARCHIVE für Chat | https://blogs.bing.com/webmaster/september-2023/Announcing-new-options-for-webmasters-to-control-usage-of-their-content-in-Bing-Chat | 2023-09-22 | Steuerung der Nutzung in Copilot-Antworten | O | zeitabh. | 2026-12-29 |
| Q-K05 | Microsoft: Optimizing content for AI search answers | https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers | 2025-10-08 | klare Überschriften, Kerninfos nicht in Tabs/PDF/Bildern verstecken (Empfehlung ohne Wirkungsnachweis) | O | zeitabh. | 2026-12-29 |
| Q-K06 | Bing Webmaster Tools: AI Performance | https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview | 2026-02-10 | Zitierungen in Copilot messbar | O | zeitabh. | 2026-12-29 |
| Q-K07 | IndexNow | https://www.indexnow.org/ | 2026 | Bing, Yandex, Seznam, Naver, Yep; Google nicht | O | zeitabh. | 2027-03-29 |
| Q-K08 | Apple: Applebot-Extended | https://support.apple.com/en-us/119829 | 2026-09-04 | nur Trainingsnutzung, keine Wirkung auf Suche | O | zeitabh. | 2027-03-29 |
| Q-K09 | llms.txt-Vorschlag | https://llmstxt.org/ | v2 2026-08-10 | Vorschlag, kein Standard; Veröffentlichung ≠ Auswertung durch Suchsysteme | F | zeitabh. | 2026-12-29 |
| Q-K10 | Google zu llms.txt (Mueller, via SERoundtable) | https://www.seroundtable.com/google-does-not-endorse-llms-txt-40789.html | 2026-01-20 | Google empfiehlt llms.txt nicht | F (Sekundärquelle) | zeitabh. | 2026-12-29 |
| Q-K11 | Aggarwal et al.: GEO (KDD 2024) | https://arxiv.org/abs/2311.09735 | 2024 | Zitate, Statistiken, Quellenangaben verbessern Sichtbarkeit im Labor-Benchmark; Keyword-Stuffing schadet; nur für bereits abgerufene Quellen | S | stabil | 2027-09-29 |
| Q-K12 | Puerto et al.: C-SEO Bench (NeurIPS 2025) | https://arxiv.org/abs/2506.11097 | 2025 | die meisten „Conversational SEO“-Methoden weitgehend wirkungslos; klassisches SEO wirkt stärker | S | zeitabh. | 2027-03-29 |
| Q-K13 | Chen et al.: KI-Suche bevorzugt Earned Media (Preprint) | https://arxiv.org/abs/2509.08919 | 2025-09 | Drittquellen werden häufiger zitiert als Markenseiten | S (Preprint) | zeitabh. | 2027-03-29 |
| Q-K14 | Martinez: Überblick GEO-Techniken (Preprint) | https://arxiv.org/abs/2607.14035 | 2026-07 | keine Technik mit stabilem, plattformübergreifendem Kausaleffekt | S (Preprint) | zeitabh. | 2027-03-29 |

## Recht, Datenschutz, Sicherheit (keine Rechtsberatung)

| ID | Quelle | URL | Stand | Stützt | Art | Stabilität | Nächste Prüfung |
|---|---|---|---|---|---|---|---|
| Q-R01 | § 5 DDG (Impressum) | https://www.gesetze-im-internet.de/ddg/__5.html | seit 2024-05-14 | Pflichtangaben leicht erkennbar, unmittelbar erreichbar, ständig verfügbar | G | stabil | 2027-09-29 |
| Q-R02 | BFSG §§ 1–3 | https://www.gesetze-im-internet.de/bfsg/__1.html | seit 2025-06-28 | gilt für Dienstleistungen im elektronischen Geschäftsverkehr mit Verbrauchern; Kleinstunternehmen (< 10 Beschäftigte, ≤ 2 Mio. €) mit Dienstleistungen ausgenommen | G | stabil | 2027-09-29 |
| Q-R03 | BMAS-Leitlinien BFSG / Bundesfachstelle FAQ | https://www.bundesfachstelle-barrierefreiheit.de/DE/Barrierefreiheitsstaerkungsgesetz/FAQ/faq.html | 2026 | Online-Terminbuchung und Shop fallen darunter (dann ganze Seite); reine Präsentationsseiten nicht | O | zeitabh. | 2027-03-29 |
| Q-R04 | § 25 TDDDG | https://www.gesetze-im-internet.de/ttdsg/__25.html | 2024 | Speichern/Auslesen auf dem Endgerät nur mit Einwilligung, außer unbedingt erforderlich | G | stabil | 2027-09-29 |
| Q-R05 | DSK-Orientierungshilfe Digitale Dienste v1.2 | https://www.datenschutzkonferenz-online.de/media/oh/OH_Digitale_Dienste.pdf | 2024-11 | keine pauschale Freigabe für Reichweitenmessung; reine Zählung ohne weitere Nutzerdaten eher unkritisch; Drittinhalte übertragen IP | O | zeitabh. | 2027-03-29 |
| Q-R06 | Cloudflare Web Analytics | https://developers.cloudflare.com/web-analytics/about/ | 2026 | JS-Beacon, laut Hersteller keine Cookies/localStorage, CSP-Einträge nötig | O (Hersteller) | zeitabh. | 2027-03-29 |
| Q-R07 | Google Consent Mode | https://developers.google.com/tag-platform/security/concepts/consent-mode | 2026 | Basic/Advanced, Parameter ad_storage, analytics_storage … | O | zeitabh. | 2026-12-29 |
| Q-R08 | § 5b Abs. 3 UWG | https://www.gesetze-im-internet.de/uwg_2004/__5b.html | seit 2022-05-28 | wer Bewertungen zeigt, muss sagen, ob und wie ihre Echtheit geprüft wird | G | stabil | 2027-09-29 |
| Q-M01 | OWASP HTTP Headers Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html | 2026 | HSTS, nosniff, Referrer-Policy, Permissions-Policy, frame-ancestors, COOP | F | zeitabh. | 2027-03-29 |
| Q-M02 | OWASP CSP Cheat Sheet / MDN CSP | https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html | 2026 | strikte CSP mit Hash/Nonce, object-src none, base-uri; frame-ancestors nicht per meta | F | zeitabh. | 2027-03-29 |
| Q-M03 | Cloudflare Pages: Headers | https://developers.cloudflare.com/pages/configuration/headers/ | 2026 | `_headers` max. 100 Regeln, gilt nicht für Functions-Antworten | O | zeitabh. | 2027-03-29 |
| Q-M04 | RFC 9116 security.txt | https://www.rfc-editor.org/rfc/rfc9116.html | 2022-04 | /.well-known/security.txt mit Contact und Expires | O | stabil | 2027-09-29 |
| Q-M05 | RFC 3966 tel-URI | https://www.rfc-editor.org/rfc/rfc3966.html | 2004 | tel: global mit + schreiben | O | stabil | 2027-09-29 |
| Q-M06 | Cloudflare Turnstile Server-Validierung | https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ | 2026 | Widget allein schützt nicht, serverseitig prüfen | O | zeitabh. | 2027-03-29 |

## Nutzerführung, Vertrauen, lokale Fachquellen

| ID | Quelle | URL | Stand | Stützt | Art | Stabilität | Nächste Prüfung |
|---|---|---|---|---|---|---|---|
| Q-F01 | NN/g: Web form design | https://www.nngroup.com/articles/web-form-design/ | 2016 | wenige Felder, eine Spalte, sichtbare Labels, Pflichtfelder kennzeichnen, klare Fehler; 78 % vs. 42 % Erfolg | F (Studie) | stabil | 2027-09-29 |
| Q-F02 | NN/g: Contact Us pages | https://www.nngroup.com/articles/contact-us-pages/ | 2019 | Telefon, Adresse, E-Mail zeigen; Formular 3–5 Felder; Antwortzeit nennen | F (Studie) | stabil | 2027-09-29 |
| Q-F03 | NN/g: Trustworthy design | https://www.nngroup.com/articles/trustworthy-design/ | 2016 | Designqualität, offene Angaben, aktueller Inhalt, Verbindung zum Web | F (Studie) | stabil | 2027-09-29 |
| Q-F04 | NN/g: F-shaped pattern | https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/ | 2017 | F-Muster ist Folge schlechter Formatierung, kein Ziel | F (Studie) | stabil | 2027-09-29 |
| Q-F05 | Baymard: Checkout form fields | https://baymard.com/blog/checkout-flow-average-form-fields | 2024 | Feldanzahl wiegt schwerer als Schrittzahl | F (Studie) | zeitabh. | 2027-03-29 |
| Q-F06 | Stanford Web Credibility Guidelines | https://credibility.stanford.edu/guidelines/index.html | 2002 | echte Organisation und Adresse, Kontakt, Aktualität, keine Fehler | F (Studie) | stabil | 2027-09-29 |
| Q-F07 | CXL: Which color converts best | https://cxl.com/blog/which-color-converts-the-best/ | 2026-09-11 | keine „beste“ CTA-Farbe, Kontrast zur Umgebung zählt | F | stabil | 2027-09-29 |
| Q-F08 | Whitespark Local Search Ranking Factors 2026 | https://whitespark.ca/local-search-ranking-factors/ | 2025-11-06 | Expertenumfrage: NAP der Website = GBP (Platz 15), konsistente Einträge (Platz 28) | F (Umfrage, keine Messung) | zeitabh. | 2027-03-29 |

## Eigene Praxis

| ID | Quelle | URL | Stand | Stützt | Art | Stabilität | Nächste Prüfung |
|---|---|---|---|---|---|---|---|
| Q-P01 | Meisterstandard | wissen/MEISTERSTANDARD.md | 2026-09-29 | Lighthouse-Grenzen, Budget, Bewegung, Anpassbarkeit, Wirkung | P | stabil | 2027-09-29 |
| Q-P02 | Bekannte Fehler | wissen/FEHLER.md | 2026-09-29 | JSON-LD nur Sichtbares, noindex-Seiten, Schriften-Budget u. v. m. | P | stabil | 2027-09-29 |
| Q-P03 | CLAUDE.md Pflichten | CLAUDE.md | 2026-09-29 | kein Tracking, keine fremden Skripte, strenge CSP, Honigtopf, Kopf-Regeln | P | stabil | 2027-09-29 |
