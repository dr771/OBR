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

### 0. Gender in Dutch (Akeneo live → pre-live)

You chose the values `Dames`, `Heren`, `Unisex`, `Kinderen`, `Jongens` and `Meisjes`. On 2026-11-06 pre-live still has the old values:

| In the shop now | Products | Becomes |
|---|---:|---|
| `Women` | 464 | `Dames` |
| `Mannen` | 251 | `Heren` |
| `Unisex` | 130 | unchanged |
| `Kinderen` | 34 | unchanged |
| `Jongens` | 3 | unchanged |
| `Meisjes` | 2 | unchanged |

- [ ] In Akeneo live, replace `Women` with `Dames` and `Mannen` with `Heren`, then sync the products to pre-live again. Please spell them exactly like this (capital first letter, no spaces): the collections match the exact text.
- [ ] We read `Unisex` as adult unisex: those products are in both Dames and Heren, not in Kinderen. Children's products get `Kinderen`, `Jongens` or `Meisjes`. Is that right?
- [ ] Every product gets exactly one value. No product has an empty gender right now; please keep it that way.
- [ ] Let us know when the sync is done. We then remove the old values from the collection rules and update the gender filter. Until then the FitFlop Dames and FitFlop Heren collections are empty.

### 1. Akeneo-schema in pre-live: dit blokkeert verdere migratie

Deze definities beheert de Akeneo-connector. We maken ze daarom niet zelf aan zonder jouw akkoord:

- **Product:** `custom.shopify_originalbrands_category`, `custom.genderid`, `custom.activities` (`list.metaobject_reference`), `custom.itemid`, `custom.materials_maintenance`, `custom.bestseller`, `akeneo.available_erp_sizes`, `akeneo.erp_size`, `akeneo.color_internal_value`, `akeneo.stock`, `akeneo.shopify_originalbrands_cate__1`
- **Variant:** `custom.colorid`, `custom.sizeid`, `custom.filtercolors`, `akeneo.stock`
- **Metaobjecten:** `filtercolors` en `activities`, met storefront-toegang `PUBLIC_READ`

Wat erop wacht: 37 categorie-, activiteit- en gendercollecties, `accessoires`, de submenu's van het hoofdmenu (33 links staan voorlopig als placeholder), de FitFlop-subcollecties, de actie "FitFlop laarzen – 2e paar -50%" en de filters in Search & Discovery.

- [x] Je maakt ze aan via de Akeneo-connector (zoals in DEV), zodra pre-live gekoppeld is. Gedaan op 2026-11-03.
- [x] Wanneer koppel je pre-live aan de **live** Akeneo-omgeving? Gekoppeld op 2026-11-03.

Since 2026-11-06 all collections exist and the main menu is complete. The category lives in `akeneo.shopify_originalbrands_cate__1`, as you confirmed; we turned on "Use as a condition in collections" and storefront access on that definition. Please tell us if the connector recreates that definition in a later sync.

### 2. Bedrijf, betalingen en btw (na de overdracht, in jouw account)

- [ ] **Bedrijfsentiteit:** vervang de tijdelijke entiteit Dr770.com door Original Brands B.V. Bevestig de juiste juridische naam: de oude AV noemen "Original Brands", de contactpagina "Original Brands B.V.". Ondernemingsnummer 0839.961.404.
- [ ] **Betaalmethoden:** Shopify Payments of een andere provider? Welke methoden: Bancontact, iDEAL, kaart, PayPal?
- [x] **Btw:** registratie BE 0839 961 404 invoeren onder Belastingen. Is er een OSS-registratie voor verkoop naar NL? *Done (checked 2026-11-24): Belgium collecting, EU (OSS) collecting in 26 regions, reverse charge for valid EU VAT numbers on.*
  - [ ] **Automatic VAT invoices (team request 2026-11-17, "like the Holster shop"):** once VAT is collected, go to Settings → Taxes and duties → European Union → *VAT invoices* and tick "Generate and display invoices when orders are placed"; optionally add a custom logo there. That section only appears after the BE registration (and OSS, if any) is entered. Holster uses exactly this native feature (timeline: "VAT invoice INV-BE-35 was generated"), no app. Check one test order afterwards.
    - **On hold (2026-11-20):** Nick objected that the invoice is created before shipping; finance expects invoicing on shipment. The native feature invoices at order/payment only, with no fulfilment trigger (legally fine: VAT is chargeable on receipt of payment, Btw-Wetboek art. 17 §1/§3, VAT Directive art. 65). Suggested to Nick in Asana: let his ERP invoice webshop orders on shipment and keep Shopify's invoices **off** on OB, so there's one invoice number per order. Asked whether the ERP can email invoices to customers (the original wish), and flagged that Holster may issue two invoices per order if its ERP also invoices. Fallback if the ERP doesn't invoice webshop orders: an invoicing app (e.g. Sufio) for invoice-on-fulfilment + email.
    - **Nick, 2026-11-20:** ERP invoicing is not an option; the only real problem is delivering less than ordered (stock shortage). Native invoices can't handle that (no credit notes; Shopify help says invoices can't be regenerated after order changes). Proposed **Sufio Professional** ($49/mo, 5,000 invoices/mo, 14-day trial): "Multiple documents per order" mode (Professional+) creates an automatic credit note for a refunded item; alternatively create + send on "Fulfilled" (only fires on *full* fulfilment, so refund the short item first; whether the invoice then excludes it is unconfirmed, test in the trial). Dutch documents and auto-email supported. Keep Shopify's native VAT invoices off. Waiting for Nick's go to install (billing is his).
- [ ] **Uitbetalingen:** IBAN. Op de oude site staat BE59 3630 9403 0426; graag bevestigen.

### 3. Verzending en markten

- [x] Klopt € 5,95 en gratis vanaf € 70 voor BE en NL? *Yes (Cindy, Asana 1220555712066383, 2026-11-17). Set on the market's Standard rate, transit 1–4 business days.*
- [ ] De retourpagina van de oude site noemt ook andere landen (DPD) en de DEV-shop had DE/FR/LU in de markt. Leveren jullie ook daarheen? Zo ja: welke tarieven?
- [x] Een expresoptie, ja of nee? *No (Cindy, 2026-11-17): Express removed from the market.*
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
