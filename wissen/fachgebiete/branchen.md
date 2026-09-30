# Branchen → schema.org-Typ und Pflichtinhalte

> Von `werkzeuge/regeln.mjs` gelesen: erkennt die Branche aus dem Auftrag (Stichwörter; bei Wörtern ab 5 Zeichen auch als Wortanfang,
> z. B. „Friseursalon“) und schreibt Typ, Pflichtinhalte und Hinweise ins Pflichtenheft. Typen belegt über Q-S01, Q-S02, Q-G24.
> Mehrere Typen durch Komma = JSON-LD-Array; die Prüfung `jsonld-lokal` verlangt mindestens einen davon.

| Branche | Stichwörter | schema.org-Typ | Lokal | Pflichtinhalte | Hinweise |
|---|---|---|---|---|---|
| Restaurant | restaurant, gaststätte, gasthaus, imbiss, pizzeria, grill, döner, sofrası, lokanta, bistro | Restaurant | ja | Speisekarte als HTML-Seite (PDF nur zusätzlich), Öffnungszeiten, Reservieren/Anrufen, Adresse mit Route, Allergen-/Zusatzstoff-Hinweis | `servesCuisine` nur mit sichtbaren Küchen; `menu`/`hasMenu` = URL der Speisekarte; `acceptsReservations` nur wenn wahr; Preise nur vom Kunden |
| Café | café, cafe, kaffeehaus, konditorei, eiscafé | CafeOrCoffeeShop | ja | Karte, Öffnungszeiten, Adresse mit Route | wie Restaurant |
| Bäckerei | bäckerei, backstube, backhaus | Bakery | ja | Sortiment, Filialen mit Zeiten | mehrere Filialen: je Standort eigene Seite (LOC-11) |
| Bar | bar, kneipe, pub, cocktailbar | BarOrPub | ja | Karte, Zeiten, Veranstaltungen | kurze Stichwörter nur als ganzes Wort |
| Friseur | friseur, frisör, coiffeur, barbier, barber, haarstudio, hairstyle, barbershop | HairSalon | ja | Leistungen mit Preisrahmen, Online-Termin oder Telefon, Team | Online-Terminbuchung für Verbraucher → BFSG prüfen (A11Y-08) |
| Nagelstudio | nagelstudio, nail | NailSalon | ja | Leistungen, Preise, Termin | wie Friseur |
| Kosmetik | kosmetik, beauty, kosmetikstudio | BeautySalon | ja | Behandlungen, Preise, Termin | wie Friseur |
| Elektriker | elektriker, elektro, elektroinstallation, elektrotechnik | Electrician | ja | Leistungen, Einzugsgebiet als Text, Notdienst (falls ja), Meisterbetrieb/Innung | ohne Laden: Adresse im Profil ausblenden, Servicegebiet (Q-G30); `areaServed` nur sichtbare Orte |
| Sanitär und Heizung | sanitär, heizung, installateur, klempner, shk, badsanierung | Plumber, HVACBusiness | ja | wie Elektriker, Notdienst | Mehrfachtyp als Array |
| Dachdecker | dachdecker, bedachung, dachdeckerei | RoofingContractor | ja | wie Elektriker, Referenzfotos | |
| Maler | maler, malerbetrieb, lackierer, malermeister | HousePainter | ja | wie Elektriker, Referenzfotos | |
| Schlüsseldienst | schlüsseldienst | Locksmith | ja | Preise transparent, Notdienst | Branche mit vielen Abzockern: Preise offen (CRO-05) |
| Umzug | umzug, umzugsunternehmen, umzüge | MovingCompany | ja | Leistungen, Gebiet, Anfrageformular | |
| Schreiner | schreiner, tischler, schreinerei, tischlerei | HomeAndConstructionBusiness | ja | Arbeiten (Fotos), Gebiet, Werkstatt | kein eigener schema.org-Typ |
| Handwerk allgemein | handwerk, handwerker, handwerksbetrieb, bauunternehmen, fliesenleger, zimmerei, gartenbau | HomeAndConstructionBusiness | ja | Leistungen, Gebiet, Referenzen, Meisterbetrieb | spezifischeren Typ wählen, wenn einer passt (GeneralContractor …) |
| Steuerberater | steuerberater, steuerberatung, steuerkanzlei, steuerbüro | AccountingService | ja | Leistungen, Team mit Berufsbezeichnung, Kammer (Impressum) | AccountingService ist Näherung; reglementierter Beruf → Impressumsangaben (Q-R01) |
| Rechtsanwalt | rechtsanwalt, anwalt, anwaltskanzlei, kanzlei | LegalService | ja | Rechtsgebiete, Anwälte, Kammer (Impressum) | `Attorney` ist veraltet |
| Zahnarzt | zahnarzt, zahnärztin, zahnarztpraxis, zahnmedizin | Dentist | ja | Leistungen, Team, Sprechzeiten, Notfall | Heilmittelwerberecht beachten (nicht recherchiert) |
| Physiotherapie | physio, physiotherapie, krankengymnastik, physiotherapeut | Physiotherapy | ja | Leistungen, Termin, Kassen/Privat, Team | Online-Terminbuchung → BFSG prüfen |
| Fotograf | fotograf, fotografin, fotostudio | LocalBusiness | ja | Portfolio, Pakete, Anfrage | kein eigener Typ |
| Agentur und Beratung | agentur, beratung, berater, consulting, dienstleister, dienstleistung, coaching | LocalBusiness | ja | Leistungen, Referenzen/Fälle, Team, Anfrage | ohne Kundenverkehr am Ort: Organization statt LocalBusiness erwägen |
| Hersteller und Industrie (B2B) | hersteller, herstellung, fertigung, maschinenbau, zulieferer, industrie, b2b | Organization | nein | Produkte/Serien mit technischen Daten, Anwendungen/Branchen, Ansprechpartner oder Vertrieb, Downloads (Katalog, Zertifikate), Händler | ohne Laden mit Kundenverkehr: `Organization` statt LocalBusiness, keine Öffnungszeiten im JSON-LD (Organization hat keine); Shop/Portal nur verlinken |
