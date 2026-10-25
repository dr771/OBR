# Acties starten — checklist voor marketing

Een actie (Black Friday, "2+1", merkweek) bestaat uit maximaal vier onderdelen die je zelf in Shopify Admin instelt, zonder developer. Het thema **kan niet controleren** of die onderdelen bij elkaar passen: een badge zonder korting of een korting met een andere einddatum ziet er op de site gewoon goed uit. Daarom deze checklist.

| Onderdeel | Waar | Wat het doet |
|---|---|---|
| Actiecollectie | Producten → Collecties | Bepaalt welke producten de badge krijgen **en** waar de korting op werkt |
| Korting | Kortingen | Het echte bedrag in winkelwagen en checkout |
| Promobalk | Online Store → Thema's → Aanpassen | De smalle balk bovenaan de site |
| Gratis verzending | Thema-instellingen → Winkelwagen | "Nog € X tot gratis verzending" in winkelwagen |

Afprijzingen (Solden/Outlet) komen uit het ERP/Akeneo als doorgestreepte prijs en krijgen automatisch het %-label. Daar hoef je niets voor te doen, en ze horen **niet** in een actiecollectie.

## Een actie starten

1. **Collectie aanmaken** (Producten → Collecties → Collectie maken)
   - De handle (onderaan, "Zoekmachinevermelding bewerken") **moet beginnen met `actie-`**, bijvoorbeeld `actie-black-friday`. Zonder dat voorvoegsel verschijnt er geen badge.
   - Producten: handmatig of met voorwaarden. **Solden doet niet mee aan acties.** Bij voorwaarden: zet *Producten moeten voldoen aan: alle voorwaarden* en voeg **Vergelijkingsprijs — is gelijk aan — 0** toe. Akeneo vult bij niet-afgeprijsde artikelen `0,00` in, daarom werkt *Prijs verlaagd — is niet ingesteld* hier niet. Handmatig: geen artikelen uit Solden kiezen.
   - Vangnet: toont een product toch een sale-badge (-30%), dan verbergt het thema de actiebadge, zodat er nooit twee kortingsbadges tegelijk staan. De korting zelf werkt dan wel nog in de checkout. Daarom eerst de collectie goed opbouwen.
   - Onderaan bij **Metavelden**:
     - **Actie: badge-tekst**: wat op de badge staat, bijvoorbeeld `-20%` of `2+1` (max. 16 tekens). Leeg betekent geen badge.
     - **Actie: start** / **Actie: einde**: wanneer de badge zichtbaar is. Leeg betekent meteen / geen einde.
     - **Actie: prioriteit**: alleen nodig als een product in twee lopende acties zit. Het hoogste getal wint. Leeg telt als 0. Bij gelijke prioriteit wint de actie die het eerst afloopt.
   - **Publicatie: Online Store aanvinken.** Een collectie die niet in de Online Store staat, geeft geen badge.
2. **Korting aanmaken** (Kortingen → Korting maken → *Bedrag van producten* of *Koop X krijg Y*)
   - Methode **Automatische korting** (een code geeft geen badge, en dat is de bedoeling: nieuwsbrief- en personeelscodes zijn niet voor iedereen).
   - Van toepassing op **dezelfde collectie** als in stap 1.
   - **Zelfde start- en einddatum en -tijd** als Actie: start / Actie: einde.
   - Combinaties: standaard uit (geen stapeling met andere kortingen).
3. **Promobalk (optioneel)**: Online Store → Thema's → Aanpassen → Header
   - Eenmalig (staat al klaar): een tweede sectie *Aankondigingsbalk* met een eigen kleurenschema en het vinkje **Promobalk: vervangt andere aankondigingsbalken**. Zolang de promobalk een bericht toont, verdwijnt de trustbalk (gratis verzending, levertijd, originele merken). Na de actie komt de trustbalk vanzelf terug. Er staan dus nooit twee balken tegelijk.
   - Per bericht: tekst, link (meestal naar de actiecollectie) en bij **Looptijd actie** dezelfde collectie **kiezen met de collectiekiezer**. De naam in de berichttekst typen is niet genoeg: zonder gekozen collectie staat het bericht er altijd. Het bericht verschijnt en verdwijnt dan vanzelf met de data van de collectie. Zonder collectie staat het bericht er altijd.
   - Geen bericht binnen de looptijd? Dan is de promobalk helemaal weg en staat de trustbalk er weer.
   - Wil je de USP's tijdens de actie toch tonen, zet ze dan als extra bericht in de promobalk.
4. **Gratis verzending**: alleen als de drempel verandert
   - Instellingen → Verzending en levering: pas de gratis-verzendtarief aan (nu BE/NL vanaf € 70).
   - Thema-instellingen → Winkelwagen → *Free shipping from (EUR)*: **hetzelfde bedrag**. *Only for countries*: dezelfde landen (nu `BE,NL`).
   - Leeg bedrag betekent dat de melding uit staat.
   - Vergeet de vaste teksten niet die het bedrag noemen (aankondigingsbalk "Gratis verzending vanaf 70€", productpagina, winkelwagen).

## Controleren (5 minuten)

- [ ] Collectiepagina `/collections/actie-…`: badges zichtbaar op de producten.
- [ ] Een product uit de actie in de zoekresultaten en op de productpagina: zelfde badge.
- [ ] Product in winkelwagen: korting staat erbij, bedrag klopt met de badge.
- [ ] Een product **buiten** de actie: geen badge en geen korting.
- [ ] Geen product uit Solden in de actiecollectie (filter de collectie in Admin op *Vergelijkingsprijs groter dan 0*: dat moet leeg blijven).
- [ ] Promobalk zichtbaar (of juist nog niet, als de start in de toekomst ligt).

## Een actie stoppen

Stopt vanzelf op de einddatum. Eerder stoppen: korting deactiveren **én** Actie: einde op nu zetten (of de badge-tekst leegmaken). Alleen de korting stoppen laat de badge staan.

## Valkuilen

- Badge zonder korting of omgekeerd: het thema waarschuwt niet. Altijd stap 1 en 2 samen doen.
- Datums wijken af: de badge kan een uur te vroeg of te laat zichtbaar zijn. Gebruik exact dezelfde tijd (tijdzone CET).
- Mixproducten: een product waarvan sommige maten afgeprijsd zijn en andere niet, valt zowel in Solden als in een collectie met *Vergelijkingsprijs = 0* (ook "Volle prijs"). Een korting via collecties werkt dan ook op de afgeprijsde maten. Het thema verbergt in dat geval wel de actiebadge op de afgeprijsde kleur.
- Thema-editor open laten staan terwijl iemand anders iets aan de header wijzigt: eerst herladen, dan pas opslaan, anders zet je hun wijziging terug.
- Handle achteraf hernoemen: de oude URL verdwijnt. Kies `actie-…` bij het aanmaken.
