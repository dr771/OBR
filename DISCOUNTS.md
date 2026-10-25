# Discounts — cheat sheet

Short reference for explaining discounts to marketing. Details: spec `campaign-badges`, GOTCHAS.md.

## Three kinds

| Kind | Set up in | Customer sees |
|---|---|---|
| **Price reduction** (Sale/Outlet; Black Friday preferred) | ERP/Akeneo compare-at price | Struck-through price + blue `-X%` everywhere |
| **Visible campaign** (2+1, -20% week) | Shopify automatic discount on an `actie-…` collection | Red badge, PDP line "korting wordt verrekend in je winkelwagen", discount in cart |
| **Silent discount / code** (WELCOME27, staff) | Shopify discount on products or a code | Nothing until the cart |

The theme can't read Shopify discounts, only collections. That's why a visible campaign needs the collection.

## Visible campaign in 5 steps

Live example on dev: [FitFlop laarzen – 2e paar -50%](https://original-brands-dev.myshopify.com/collections/actie-fitflop-laarzen) (collection `actie-fitflop-laarzen` incl. Sale, BXGY discount of the same name, promo bar message linking to Laarzen), running in parallel with [Winteractie Löwenweiss – 2+1 gratis](https://original-brands-dev.myshopify.com/collections/loewenweiss).


1. **Create Collection:** handle starts with `actie-`. Add the products (no sale items). Fill the metafields *Actie: badge-tekst* (`-20%`, `2+1`), *start*, *einde*, and optionally *prioriteit*. Publish to Online Store.
2. **Automatic discount** on that same collection, same dates. Under combinations, tick **product discounts** (otherwise two running campaigns cancel each other in one cart).
3. **Promo bar (optional):** add a message in the promo bar and pick the collection under *Actiecollectie*. While it runs it replaces the trust bar.
4. **Check:** badge on the collection, in search and on the PDP; discount appears in the cart.
5. **Stop early:** end the discount **and** set *Actie: einde* to now. Otherwise the badge stays.

## Buy X get Y — the three "get" values

| Option | Example on dev |
|---|---|
| *Free* | Winteractie Löwenweiss: buy 2, get 1 free (cheapest one) |
| *Percentage* | FitFlop laarzen: buy 1, get the 2nd at -50 % |
| *Amount off each* | Odlo skiset: buy a midlayer, get **€15 off each** pair of gloves (cross-sell: X and Y are different products) |

For a cross-sell, put the X and Y products straight into the discount, and make one `actie-…` collection with **both** groups for the badge. Sort it *manually*, alternating X and Y (dev: midlayer, gloves, midlayer, gloves…), and say "step 1 / step 2" in the collection text; with the default sort shoppers saw only the discounted gloves and couldn't find what unlocks them.

## What the theme guarantees

- One campaign badge per product; the higher *prioriteit* wins.
- Sale and campaign badges both show (stacked). So a `-15%` campaign should exclude Sale via its collection (two percentages would contradict); a `2e paar -50%` may include it.
- Start/end are re-checked in the browser, so cached pages switch on time.

## Traps

- Badge and discount are separate objects: a mismatch (other products, other dates) is not detected.
- Collection conditions: use *compare-at price = 0* for "not reduced". Akeneo writes `0.00`, so *price reduced is not set* misses almost everything.
- In *Actiecollectie*, pick the collection. Typing its name in the message text does nothing.
- Reload the theme editor before saving if someone else changed the header meanwhile.

## Free shipping (not a discount)

- **Shipping rate:** Settings → Shipping and delivery → General profile → zone **BE/NL**. *Standaard verzending* €4.95 up to €69.99, *Gratis verzending* €0 from €70. Zone **EU overig** (DE/FR/LU): €4.95 always.
- **Cart progress bar:** Theme settings → Cart → *Free shipping from (EUR)* `70`, *Only for countries* `BE,NL`.
- Change both together, and update the texts that mention €70 (trust bar, PDP USPs, cart USP).
- The €70 counts **after discounts** (tested: €80 item at -15% = €68 → €4.95 shipping; 2× = €136 → free). The cart bar uses the same total, so it agrees.
- **Free shipping *discount*** (Discounts → Free shipping) is for exceptions, not the standing rule: a time-boxed "free shipping weekend", a code (customer service, influencer), a customer segment, a different threshold during a campaign, or limiting it to certain products. The cart bar doesn't know about it.

## Black Friday "on everything": order or products?

- **Amount off products** on a collection with condition *compare-at price = 0*: excludes Sale, struck-through price per line, badge/PDP note possible. **Use this** while Sale is excluded.
- **Amount off order**: one line on the cart total, also discounts Sale items, no badge. Only if it really should include everything.

## Newsletter code

**Policy still open (owner is testing).** Pick the type by what the code should cover:

| Code should apply to… | Type | Notes |
|---|---|---|
| **Everything** (incl. Sale and campaign items) | **Amount off order** | Combinations: tick *product discounts* on the code **and** *order discounts* on every campaign, or the code is rejected while that campaign is in the cart. Calculated on the total after campaigns (tested: 3 Löwenweiss €168 → 2+1 €114 → -10 % €102.60). One line on the total, not per item. Can't exclude anything. |
| **Everything except Sale** | **Amount off products** on `volle-prijs` | Doesn't stack on campaign items (one product discount per item; a 2+1 also "uses" the paid items). Cart with only campaign items → code rejected. ~60 partly-reduced products still slip through. |

For both: *Limit to one use per customer*; optional minimum order value. The €70 free shipping counts after the code (€75 − 10 % = €67.50 → €4.95 shipping); the cart bar shows this correctly.

Dev state: WELCOME27 is a product code targeting `all` + `volle-prijs` (= everything except campaign items); WELCOME28 is an order code (10 %), both demo campaigns allow order discounts.
