# Branchen → schema.org-Typ und Pflichtinhalte

> Read by `werkzeuge/regeln.mjs`: detects the industry from the order (keywords; words of 5+ characters also match as a word start,
> e.g. „Friseursalon“) and writes type, mandatory content and notes into the requirements spec. Types evidenced via Q-S01, Q-S02, Q-G24.
> Several types separated by comma = JSON-LD array; the check `jsonld-lokal` requires at least one of them.
> Branche names and Stichwörter stay German (they are matched against German order text); Pflichtinhalte and Hinweise are translated.

| Branche | Stichwörter | schema.org-Typ | Lokal | Pflichtinhalte | Hinweise |
|---|---|---|---|---|---|
| Restaurant | restaurant, gaststätte, gasthaus, imbiss, pizzeria, grill, döner, sofrası, lokanta, bistro | Restaurant | ja | menu as an HTML page (PDF only in addition), opening hours, reserve/call, address with directions, allergen/additive notice | `servesCuisine` only with visible cuisines; `menu`/`hasMenu` = URL of the menu; `acceptsReservations` only if true; prices only from the customer |
| Café | café, cafe, kaffeehaus, konditorei, eiscafé | CafeOrCoffeeShop | ja | menu, opening hours, address with directions | as restaurant |
| Bäckerei | bäckerei, backstube, backhaus | Bakery | ja | range of products, branches with hours | several branches: own page per location (LOC-11) |
| Bar | bar, kneipe, pub, cocktailbar | BarOrPub | ja | menu, hours, events | short keywords only as a whole word |
| Friseur | friseur, frisör, coiffeur, barbier, barber, haarstudio, hairstyle, barbershop | HairSalon | ja | services with price range, online appointment or phone, team | online appointment booking for consumers → check BFSG (A11Y-08) |
| Nagelstudio | nagelstudio, nail | NailSalon | ja | services, prices, appointment | as hairdresser |
| Kosmetik | kosmetik, beauty, kosmetikstudio | BeautySalon | ja | treatments, prices, appointment | as hairdresser |
| Elektriker | elektriker, elektro, elektroinstallation, elektrotechnik | Electrician | ja | services, service area as text, emergency service (if offered), master craftsman business/guild | without a shop: hide the address in the profile, service area (Q-G30); `areaServed` only visible places |
| Sanitär und Heizung | sanitär, heizung, installateur, klempner, shk, badsanierung | Plumber, HVACBusiness | ja | as electrician, emergency service | multiple type as array |
| Dachdecker | dachdecker, bedachung, dachdeckerei | RoofingContractor | ja | as electrician, reference photos | |
| Maler | maler, malerbetrieb, lackierer, malermeister | HousePainter | ja | as electrician, reference photos | |
| Schlüsseldienst | schlüsseldienst | Locksmith | ja | transparent prices, emergency service | industry with many rip-off operators: show prices openly (CRO-05) |
| Umzug | umzug, umzugsunternehmen, umzüge | MovingCompany | ja | services, area, inquiry form | |
| Schreiner | schreiner, tischler, schreinerei, tischlerei | HomeAndConstructionBusiness | ja | work (photos), area, workshop | no dedicated schema.org type |
| Handwerk allgemein | handwerk, handwerker, handwerksbetrieb, bauunternehmen, fliesenleger, zimmerei, gartenbau | HomeAndConstructionBusiness | ja | services, area, references, master craftsman business | choose a more specific type if one fits (GeneralContractor …) |
| Steuerberater | steuerberater, steuerberatung, steuerkanzlei, steuerbüro | AccountingService | ja | services, team with professional title, chamber (imprint) | AccountingService is an approximation; regulated profession → imprint details (Q-R01) |
| Rechtsanwalt | rechtsanwalt, anwalt, anwaltskanzlei, kanzlei | LegalService | ja | areas of law, lawyers, chamber (imprint) | `Attorney` is outdated |
| Zahnarzt | zahnarzt, zahnärztin, zahnarztpraxis, zahnmedizin | Dentist | ja | services, team, consultation hours, emergency | observe the healthcare advertising law (Heilmittelwerberecht) (not researched) |
| Physiotherapie | physio, physiotherapie, krankengymnastik, physiotherapeut | Physiotherapy | ja | services, appointment, statutory/private insurance, team | online appointment booking → check BFSG |
| Fotograf | fotograf, fotografin, fotostudio | LocalBusiness | ja | portfolio, packages, inquiry | no dedicated type |
| Gebäudereinigung | gebäudereinigung, gebäudereiniger, reinigungsservice, reinigungsfirma, reinigungsdienst | ProfessionalService | ja | services as own pages, service area as text, process (visit, offer, plan), guarantee conditions, contact person | no dedicated schema.org type; `Service` per service page, `areaServed` only visible places; without reviews/prices unless confirmed |
| Agentur und Beratung | agentur, beratung, berater, consulting, dienstleister, dienstleistung, coaching | LocalBusiness | ja | services, references/cases, team, inquiry | without customer traffic on site: consider Organization instead of LocalBusiness |
| Hersteller und Industrie (B2B) | hersteller, herstellung, fertigung, maschinenbau, zulieferer, industrie, b2b | Organization | nein | products/series with technical data, applications/industries, contact person or sales, downloads (catalog, certificates), dealers | without a shop with customer traffic: `Organization` instead of LocalBusiness, no opening hours in JSON-LD (Organization has none); only link to shop/portal |
