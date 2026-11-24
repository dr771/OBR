# Collections

Rules, ranks and menu of the live shop, read from it on 2026-11-24. Counts are in-stock products on that day. Collections are shop data: change them in the Admin or through the Admin API (`sources`, GOTCHAS.md), then update this file.

**Every automated collection also has `Variant inventory > 0`** as an extra AND condition, added by the OB team in the Admin (found 2026-11-24). Side effect: a sold-out product drops out of all its collections, so its PDP loses the breadcrumb (also in the JSON-LD) and the related-products rail (GOTCHAS.md). The team was asked why it was added and whether it can go. Keep the theme's own mechanism (`plp-hide-sold-out`) either way: it also works on manual collections, and its availability filter combines with the variant-level colour filter (Odlo, one colour: 62 products without it, 22 with). Even `all` is automated for this reason: *title is not `§§§ob-no-such-product-title§§§`* AND inventory > 0.

Within one condition, the listed values are OR (the `sources` API takes a value list). Conditions are AND.

## Data the rules read

- **Category:** `akeneo.shopify_originalbrands_cate__1`, Dutch labels from Akeneo live. Values on 2026-11-24: Accessoires, Badjassen, Badmode, Ballerina's, Bovenkleding, Broeken, Handsschoenen (typo, SHOP-SETUP.md), Hemden, Instappers, Jassen, Jurken, Kousen, Laarzen, Leggings, Mutsen & petten, Ondergoed, One-piece, Pyjama's, Rokken, Sandalen, Shorts, Slippers, Sneakers, Teenslippers, Truien, Vesten. Every value needs a collection home (POST-SYNC-CHECK.md §1). [cats-dev.csv](cats-dev.csv) is the Akeneo **dev** vocabulary and differs.
- **Gender:** `custom.genderid`. Live has `Women`, `Mannen`, `Unisex`, `Kinderen`, `Jongens`; Nick's final values are `Dames`, `Heren`, `Unisex`, `Kinderen`, `Jongens`, `Meisjes`. `Unisex` means adult unisex.
- **Activities:** `custom.activities`, by metaobject: `running`, `training`, `hiking`, `cycling`, `ski_snowboard`, `swimming`.
- **Vendor** for the needs, brand and product-group collections: exact text, case-sensitive.
- **Product type** `Shoe` / `Sport` / `Fashion`, used only by `schoenen`.

## Needs collections and their product groups

Vendor-based (`ob-collection-maintenance` skill when the brand roster changes). Activity/category rules made Sport & Training and Outdoor & Werk overlap, which is why vendor replaced them (archived change `2026-09-03-restructure-needs-collections`).

| Collection | Handle | Vendor is one of | Rank | Products |
|---|---|---|---:|---:|
| Sport & Training | `sport-training` | Odlo, RH+, Nike Swim, Sweaty Betty | 20 | 504 |
| Outdoor & Werk | `outdoor-werk` | Mechanix | 20 | 58 |
| Fashion & Lifestyle | `fashion-lifestyle` | Juicy Couture, Pas dé Monacó, Irasuto Studios, FitFlop, Holster | 20 | 352 |
| → Werkkleding | `werkkleding` | Mechanix | 5 | 58 |
| → Streetwear | `streetwear` | Pas dé Monacó, Irasuto Studios | 5 | 18 |
| → Loungewear | `loungewear` | Juicy Couture | 5 | 55 |
| → Comfort Footwear | `comfort-footwear` | FitFlop | 15 | 266 |

`comfort-footwear` is rank 15, not 5: it holds all of FitFlop, so at 5 it would tie with the more precise `sandalen`/`sneakers`/… and a FitFlop sandal's breadcrumb could flip to "Comfort Footwear".

Deliberately in no needs collection: Loewenweiss, Sneaker Lab. Briko (products, no collection) is undecided (SHOP-SETUP.md, Open after launch).

## Product type and category collections

| Parent | Collection | Handle | Rule | Products |
|---|---|---|---|---:|
| — | Schoenen | `schoenen` | type `Shoe` AND title does not contain `Socks` | 286 |
| — | Kleding | `kleding` | category: Bovenkleding, Broeken, Hemden, Truien, Vesten, Shorts, Leggings, Jurken, Rokken, Jassen, Ondergoed, Badmode, Pyjama's, One-piece, Kousen, Mutsen & Petten, Handsschoenen, Badjassen, Skibroeken | 611 |
| — | Accessoires | `accessoires` | category: Handschoenen, Handsschoenen, Kousen, Mutsen & petten, Accessoires | 153 |
| Schoenen | Sandalen | `sandalen` | Sandalen | 37 |
| Schoenen | Slippers | `slippers` | Teenslippers | 68 |
| Schoenen | Slides & pantoffels | `slides` | Slippers | 64 |
| Schoenen | Sneakers | `sneakers` | Sneakers | 63 |
| Schoenen | Laarzen | `laarzen` | Laarzen | 25 |
| Schoenen | Ballerina's | `ballerinas` | Ballerina's | 17 |
| Schoenen | Instappers | `instappers` | Instappers | 12 |
| Kleding | Broeken | `broeken` | Broeken | 52 |
| Kleding | Truien | `truien` | Truien | 38 |
| Kleding | Vesten | `vesten` | Vesten | 31 |
| Kleding | Jassen | `jassen` | Jassen | 22 |
| Kleding | Shirts & tops | `shirts-tops` | Hemden, Bovenkleding | 177 |
| Kleding | Shorts | `shorts` | Shorts | 49 |
| Kleding | Leggings | `leggings` | Leggings | 72 |
| Kleding | Ondergoed & baselayers | `ondergoed` | Ondergoed | 48 |
| Kleding | Jurken & rokken | `jurken-rokken` | Jurken, Rokken | 3 |
| Accessoires | Handschoenen | `handschoenen` | Handschoenen, Handsschoenen | 66 |
| Accessoires | Kousen | `kousen` | Kousen | 18 |
| Accessoires | Hoofddeksels | `hoofddeksels` | Mutsen & petten | 15 |
| Accessoires | Overige accessoires | `overige-accessoires` | Accessoires | 54 |

Ranks: parents 10, children 5. `kleding` also lists accessory values (Kousen, `Mutsen & Petten` with a capital P, Handsschoenen) and `Pyjama's` twice; that came in through an Admin edit and was left as found. No collection of its own, deliberately: Badmode (all Nike Swim, already in `zwemmen`), Pyjama's, One-piece, Badjassen, Skibroeken. Odlo base-layer tops and sports bras sit partly under Bovenkleding and partly under Ondergoed in Akeneo, so they show in either collection.

**Activity collections** (under Sport & Training, rank 5): `hardlopen` (running, vendor not Hi-Tec, 242), `training` (441), `wandelen` (hiking, vendor not Hi-Tec, 247), `fietsen` (cycling, 138), `skien-snowboard` (78), `zwemmen` (swimming, 13).

## Gender collections

Rank 30, not in the main menu (at ~80% women, Dames/Heren trees would be near-identical; gender is the first filter instead).

| Collection | Handle | Gender is one of | Products |
|---|---|---|---:|
| Dames | `dames` | Dames, Women, Unisex | 765 |
| Heren | `heren` | Heren, Mannen, Unisex, Men | 303 |
| Kinderen | `kinderen` | Kinderen, Jongens, Meisjes | 17 |

Drop `Women`, `Mannen`, `Men` once Nick's Dutch re-sync has landed (SHOP-SETUP.md, Open with Nick).

## Brand collections

One per vendor (`fitflop`, `holster`, `irasuto-studios`, `juicy-couture`, `loewenweiss`, `mechanix`, `nike-swim`, `odlo`, `pas-de-monaco`, `rh`, `sneaker-lab`, `sweaty-betty`), rank 40.

**FitFlop sub-collections** (the only brand with a third menu level, because its old Drupal pages carried ~19,600 search clicks). **The handle is the old Drupal slug**, so `/nl/fitflop-sandalen` redirects 1:1; don't rename them. Vendor FitFlop AND:

| Menu title | Handle | Second condition | Products |
|---|---|---|---:|
| Slippers | `fitflop-slippers` | category Teenslippers | 65 |
| Slides | `fitflop-slides` | category Slippers | 49 |
| Sandalen | `fitflop-sandalen` | category Sandalen | 36 |
| Sneakers | `fitflop-sneakers` | category Sneakers | 62 |
| Enkellaarzen | `fitflop-enkellaarzen` | category Laarzen | 25 |
| Pantoffels | `fitflop-pantoffels` | category Slippers: since 2026-11-20 the same 49 summer slides as Slides, no house slippers (asked the team) | 49 |
| Ballerina's & loafers | `fitflop-ballerinas` | category Ballerina's | 17 |
| Dames | `fitflop-dames` | gender Women, Unisex | 244 |
| Heren | `fitflop-heren` | gender Mannen, Unisex | 22 |
| Outlet | `fitflop-outlet` | price reduced AND compare-at > 0 | 221 |

No rank: a product in one of these is always also in a rank-5 collection.

**Naming:** the storefront follows the old site, not Akeneo. Akeneo `Teenslippers` (toe-posts) are "Slippers" (`slippers`, `fitflop-slippers`; "FitFlop slippers" was the old site's biggest search term). Akeneo `Slippers` (slides plus Löwenweiss house slippers) are "Slides & pantoffels" (`slides`). The Category filter still shows the Akeneo wording.

## Price and utility collections

- `solden`: price reduced is set AND compare-at > 0 (699). The `> 0` guards against the sync's old `0.00` compare-at. Homepage outlet banner, footer "Outlet" and the menu's Solden link point here.
- `volle-prijs`: price reduced is not set (325). Not published; the target for a code that should skip Sale (DISCOUNTS.md). WELCOME27 on live doesn't use it: it is an order discount on everything. A product with mixed reduced and full-price sizes is in both.
- Campaign collections: handle `actie-…`, must be published to Online Store or no badge shows (DISCOUNTS.md). None exist on 2026-11-24.
- `frontpage` (manual, empty) and `merken` (manual, unused; the brands directory is `/pages/merken`): leave unranked.

## Breadcrumb rank

Collection metafield `custom.breadcrumb_rank`: when a product is in several collections, the PDP breadcrumb and the related-products rail start at the lowest rank; unset sorts last. Liquid's `product.collections` order is undocumented, so without ranks every trail named the broadest collection. Entering from a collection page, the breadcrumb names that collection instead (`pdp-breadcrumb`).

| Rank | Band |
|---:|---|
| 5 | category, activity and product-group sub-collections |
| 10 | `schoenen`, `kleding`, `accessoires` |
| 15 | `comfort-footwear` |
| 20 | needs collections |
| 30 | gender |
| 40 | brands |
| unset | `solden`, `volle-prijs`, `all`, `merken`, `frontpage`, FitFlop sub-collections |

A new collection has no rank and never wins a breadcrumb while a ranked one also holds the product. Assign a band when it's approved.

**Related products** (`pdp-related-products`): start at the product's lowest-ranked collection and broaden through higher ranks until four are found; same exact `custom.genderid` only; skip the viewed product, unavailable products and duplicates; keep each collection's own order; hide the rail when nothing qualifies.

## Main menu (`main-menu`)

```text
Sport & Training ▾   Alles voor sport & training, Hardlopen, Training, Wandelen, Fietsen, Skiën & snowboard, Zwemmen
Outdoor & Werk ▾     Alles voor outdoor & werk, Werkkleding
Fashion & Lifestyle ▾ Alles voor fashion & lifestyle, Streetwear, Loungewear, Comfort Footwear
Schoenen ▾           Alle schoenen, Sandalen, Slippers, Slides & pantoffels, Sneakers, Laarzen, Ballerina's, Instappers
Kleding ▾            Alle kleding, Broeken, Truien, Vesten, Jassen, Shirts & tops, Shorts, Leggings, Ondergoed & baselayers, Jurken & rokken
Accessoires ▾        Alle accessoires, Handschoenen, Kousen, Hoofddeksels, Overige accessoires
Merken ▾             Alle merken (/pages/merken), every brand collection A–Z; FitFlop ▾ Alles van FitFlop + its 10 sub-collections
Solden
```

Every top-level label links to the same target as its first "Alle …" child, which also labels the collection hero's first pill. The nesting is breadcrumb data: the hero trail (`Home › Schoenen › Ballerina's`) and the PDP's BreadcrumbList read a collection's parent from its first position in this menu. Hover-open on fine pointers is `assets/details-disclosure.js`; touch and keyboard stay click/Enter. Hero pills hide children that are empty, but the header dropdown still lists them.

## Current scan baseline

Vendors on the live storefront, 2026-11-24 (in-stock products from the brand collections). The `ob-collection-maintenance` skill compares against this.

| Vendor | Products | Needs collection |
|---|---:|---|
| Odlo | 278 | Sport & Training |
| FitFlop | 266 | Fashion & Lifestyle (+ Comfort Footwear) |
| Sweaty Betty | 182 | Sport & Training |
| Mechanix | 58 | Outdoor & Werk (+ Werkkleding) |
| Juicy Couture | 55 | Fashion & Lifestyle (+ Loungewear) |
| RH+ | 32 | Sport & Training |
| Irasuto Studios | 17 | Fashion & Lifestyle (+ Streetwear) |
| Holster | 13 | Fashion & Lifestyle |
| Nike Swim | 12 | Sport & Training |
| Loewenweiss | 7 | none |
| Pas dé Monacó | 1 | Fashion & Lifestyle (+ Streetwear) |
| Briko | ? | none yet, no brand collection |
| Sneaker Lab | 0 | none |
