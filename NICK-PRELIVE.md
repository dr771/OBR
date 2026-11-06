# Pre-live shop: checklist voor Nick

Shop: `original-brands-live.myshopify.com` (ID `109574717777`), met wachtwoord beveiligd. Stand van 2026-11-06.
Interne status en technische details: [MIGRATION-PLAN.md](MIGRATION-PLAN.md). Open sync-issues voor de DEV-shop staan apart in [NICK.md](NICK.md).

## Al klaar in pre-live (alleen ter info)

- Thema met alle instellingen, logo en favicon. Taal NL, tijdzone Brussel, EUR, prijzen inclusief btw.
- Pagina's (klantenservice, levering, verzending & retour, FAQ, merken, …), de blog `inspiratie` met 14 artikels, de footer-menu's en het hoofdmenu.
- 25 collecties: merken, Schoenen/Kleding (op producttype), Solden, Outlet, `all` en twee actie-collecties.
- Kortingen: code `Welcome27` (10%, één keer per klant) en automatisch "Winteractie Löwenweiss – 2+1 gratis".
- Markt **België & Nederland**. Verzending BE/NL: **€ 5,95**, **gratis vanaf € 70**. Dit komt van de oude site; de DEV-shop rekende € 4,95.
- Beleidsteksten: algemene voorwaarden (letterlijk van de oude site, versie 1 december 2023), retourbeleid, verzendbeleid, contactgegevens en juridische vermelding. Het privacybeleid wordt automatisch door Shopify beheerd.
- Winkeladres: Original Brands B.V., Maasstraat 67, 2060 Antwerpen, tel. +32 13 53 26 85.
- Nieuwsbrief-popup (Shopify Forms) met de code Welcome27, Search & Discovery en Flow.

## Graag beslissen of doen

### 0. Gender in het Nederlands (Akeneo live → pre-live)

Je koos voor de waarden `Dames`, `Heren`, `Unisex`, `Kinderen`, `Jongens` en `Meisjes`. Op 2026-11-06 staan in pre-live nog de oude waarden:

| Nu in de shop | Producten | Wordt |
|---|---:|---|
| `Women` | 464 | `Dames` |
| `Mannen` | 251 | `Heren` |
| `Unisex` | 130 | blijft |
| `Kinderen` | 34 | blijft |
| `Jongens` | 3 | blijft |
| `Meisjes` | 2 | blijft |

- [ ] In Akeneo live `Women` vervangen door `Dames` en `Mannen` door `Heren`, en de producten opnieuw naar pre-live syncen. Graag precies zo geschreven (hoofdletter, geen spatie): de collecties filteren op de exacte tekst.
- [ ] `Unisex` betekent bij ons unisex voor volwassenen: die producten staan in Dames én Heren, niet in Kinderen. Kinderproducten krijgen `Kinderen`, `Jongens` of `Meisjes`. Klopt dat zo?
- [ ] Elk product krijgt precies één waarde. Op dit moment heeft geen enkel product een lege gender; graag zo houden.
- [ ] Laat ons weten wanneer de sync klaar is. Dan halen wij de oude waarden uit de collectieregels en zetten we de genderfilter om. Tot dan zijn de collecties FitFlop Dames en FitFlop Heren leeg.


### 1. Akeneo-schema in pre-live: dit blokkeert verdere migratie

Deze definities beheert de Akeneo-connector. We maken ze daarom niet zelf aan zonder jouw akkoord:

- **Product:** `custom.shopify_originalbrands_category`, `custom.genderid`, `custom.activities` (`list.metaobject_reference`), `custom.itemid`, `custom.materials_maintenance`, `custom.bestseller`, `akeneo.available_erp_sizes`, `akeneo.erp_size`, `akeneo.color_internal_value`, `akeneo.stock`, `akeneo.shopify_originalbrands_cate__1`
- **Variant:** `custom.colorid`, `custom.sizeid`, `custom.filtercolors`, `akeneo.stock`
- **Metaobjecten:** `filtercolors` en `activities`, met storefront-toegang `PUBLIC_READ`

Wat erop wacht: 37 categorie-, activiteit- en gendercollecties, `accessoires`, de submenu's van het hoofdmenu (33 links staan voorlopig als placeholder), de FitFlop-subcollecties, de actie "FitFlop laarzen – 2e paar -50%" en de filters in Search & Discovery.

- [x] Je maakt ze aan via de Akeneo-connector (zoals in DEV), zodra pre-live gekoppeld is. Gedaan op 2026-11-03.
- [x] Wanneer koppel je pre-live aan de **live** Akeneo-omgeving? Gekoppeld op 2026-11-03.

Sinds 2026-11-06 bestaan alle collecties en is het hoofdmenu compleet. De categorie staat in `akeneo.shopify_originalbrands_cate__1`, zoals je bevestigde; wij hebben daar "Gebruiken in automatische collecties" en storefront-toegang aangezet. Laat het ons weten als de connector die definitie bij een volgende sync opnieuw aanmaakt.

### 2. Bedrijf, betalingen en btw (na de overdracht, in jouw account)

- [ ] **Bedrijfsentiteit:** vervang de tijdelijke entiteit Dr770.com door Original Brands B.V. Bevestig de juiste juridische naam: de oude AV noemen "Original Brands", de contactpagina "Original Brands B.V.". Ondernemingsnummer 0839.961.404.
- [ ] **Betaalmethoden:** Shopify Payments of een andere provider? Welke methoden: Bancontact, iDEAL, kaart, PayPal?
- [ ] **Btw:** registratie BE 0839 961 404 invoeren onder Belastingen. Is er een OSS-registratie voor verkoop naar NL?
- [ ] **Uitbetalingen:** IBAN. Op de oude site staat BE59 3630 9403 0426; graag bevestigen.

### 3. Verzending en markten

- [ ] Klopt € 5,95 en gratis vanaf € 70 voor BE en NL?
- [ ] De retourpagina van de oude site noemt ook andere landen (DPD) en de DEV-shop had DE/FR/LU in de markt. Leveren jullie ook daarheen? Zo ja: welke tarieven?
- [ ] Een expresoptie, ja of nee?
- [ ] Vanaf welk magazijnadres wordt verzonden? Dat wordt de Shopify-locatie; die staat nu zonder adres.

### 4. E-mail

- [ ] Na de overdracht het winkel-e-mailadres op `service@originalbrands.nl` zetten. Nu staat het nog op het adres van de bouwer.
- [ ] Het afzenderadres voor klantmails verifiëren op het domein `originalbrands.nl` (DNS-records voor SPF/DKIM).

### 5. Apps (na de overdracht)

Apps van derden vragen op deze shop nog een identiteitsverificatie van de eigenaar.

- [ ] **Akeneo PIM App** met de live-omgeving.
- [ ] **ERP/orderkoppeling:** welke app gaat naar productie, `OB_AX-SFY_TEST` of een andere? Heeft die toegang tot beschermde klantgegevens op het gekozen abonnement?
- [ ] **Channable:** jouw account, installeren en feed instellen.

### 6. Teksten nalezen

- [ ] De **algemene voorwaarden** (versie 1 december 2023): nog actueel?
- [ ] Het **retourproces**: retourformulier, meegeleverd retourlabel, € 5,95 bijdrage, DHL (NL), bpost (BE) en DPD (overig). Klopt dit nog?
- [ ] **Privacybeleid:** het automatische Shopify-beleid behouden, of het oude privacy statement van de site overnemen?
- [ ] De **openingsuren** van de klantenservice: ma–do 9.30–16.30, vr 9.30–15.30.
