# Smart collections

## Current catalog values

### Categories

Live Admin API scan on 2026-09-21: **565 active products**, of which **564** have
`custom.shopify_originalbrands_category`. The stored metafield currently contains
28 distinct values:

| Stored value | Products | Note |
|---|---:|---|
| Accessoires | 3 | Valid `cats-dev.csv` label |
| Badmode | 1 | Valid label |
| Ballerinas | 20 | Valid label; storefront title should be `Ballerina's` |
| Bovenkleding | 6 | Valid label; review wording with Nick (`top` maps here) |
| Broeken | 34 | Valid label |
| Handschoenen | 14 | Valid label |
| Headware | 5 | Valid label; English/misspelt source label, present as stored |
| Hemden | 30 | Valid label; both `shirt` and `buttonupshirt` map here |
| Instappers | 14 | Valid label |
| Jurken | 3 | Valid label |
| Kousen | 10 | Valid label |
| Laarzen | 26 | Valid label |
| Legging | 3 | Stale/incorrect value; should be `Leggings` |
| Leggings | 2 | Valid label |
| Ondergoed | 1 | Valid label |
| One-piece | 1 | Valid label |
| Outdoor | 1 | Invalid: absent from both columns of `cats-dev.csv` |
| Rokjes | 3 | Valid label; storefront title should be `Rokken` |
| Sandalen | 50 | Valid label |
| Shirt | 4 | Stale/incorrect value; should be `Hemden` |
| Shorten | 10 | Valid source label; storefront title should be `Shorts` |
| Slipper | 2 | Stale/incorrect value; should be `Slippers` |
| Slippers | 88 | Valid label |
| Sneaker | 2 | Stale/incorrect value; should be `Sneakers` |
| Sneakers | 78 | Valid label |
| Teenslippers | 112 | Valid label |
| Truien | 20 | Valid label |
| Vesten | 21 | Valid label |
| *(missing)* | 1 | Active product without this metafield |

Four valid dev-vocabulary labels currently have zero products: `Pyjama's`,
`Badjassen`, `Jassen`, and `Skibroeken`. The 12 products on `Shirt`, `Legging`,
`Slipper`, `Sneaker`, or `Outdoor` are tracked with Nick in `NICK.md` #11.
Until the feed is corrected, any approved category collection that should contain
those products must OR the stale value with its canonical label; `Outdoor` needs a
merchandising decision rather than an inferred mapping.

### Activities

- Fietsen
- Lifestyle
- Running
- Skiën & Snowboard
- Training
- Wandelen
- Zwemmen

## Special collections

These three automatic collections use **OR** logic on the product's **vendor**: a product is included when its vendor matches one of the collection's listed brands. This replaced the original activity/category-based rule set on 2026-09-03 (see `openspec/changes/restructure-needs-collections/`) after a live check found it caused real overlap — Odlo, which dominates Sport & Training's SKU volume, tags nearly every product with activities spanning both the Sport & Training and Outdoor & Werk buckets at once (e.g. one base layer tagged `Training, Fietsen, Skiën & Snowboard, Wandelen, Running` simultaneously), so the two collections showed largely the same products under the old rule type. Vendor is single-valued per product, so these three collections are now mutually exclusive by construction.

The pillar assignment is based on a full-catalog SKU export (not just what's synced), which showed the catalog splits cleanly by brand mission — see `TODO.md` for the SKU counts behind this call. FitFlop, Holster, Loewenweiss, and Sneaker Lab deliberately have **no** needs-collection: they're comfort-footwear/care brands already reachable via the Schoenen/Kleding/Accessoires product-type collections and their own Merken brand page — a "Comfort" needs-card would just duplicate that existing axis.

### Sport & Training (`sport-training`)

- Vendor is one of: Odlo, RH+, Nike Swim, Sweaty Betty

Sweaty Betty is **provisional** — the user expects it will likely leave the Akeneo feed, but it currently has live synced products, so it stays in the condition until that's confirmed (harmless if it later contributes zero SKUs).

### Outdoor & Werk (`outdoor-werk`)

- Vendor is one of: Hi-Tec, Magnum

Magnum (work/tactical/safety boots) hasn't synced yet, so this collection is sparse (Hi-Tec only) for now — same class of "not yet exercisable at full scale" caveat this project already accepts elsewhere (PLP load-more >18 products, predictive search >8 results). "Werk" isn't a misnomer: it only looked empty because the original 11-product test sync happened to have zero Magnum items.

### Fashion & Lifestyle (`fashion-lifestyle`, renamed from "Dagelijks Comfort")

- Vendor is one of: Juicy Couture, Pas dé Monacó, Irasuto Studios

**Caveat:** RH+ and Magnum's vendor conditions use the brand labels from the SKU export ("RH+", "Magnum") verbatim, but neither brand has synced yet, so the exact vendor string is unverified — re-check against the real product record the moment either syncs.

## Gender collections

These automatic collections use the Product metafield `custom.genderid` with OR logic:

- Dames: `Women` or `Unisex`
- Heren: `Men` or `Unisex`
- Kinderen: `Unisex`

## Breadcrumb rank

Most products belong to several of the collections above at once — e.g. an Odlo running jacket is in `Kleding`, `Heren` or `Dames`, `Odlo`, and `Sport & Training` simultaneously. The PDP breadcrumb can only name one, and Liquid's `product.collections` order is neither documented nor merchant-configurable, so without a rank the choice would be arbitrary and tend to default to whichever collection happens to be broadest.

Rank resolves that. It is the Collection metafield `custom.breadcrumb_rank` (integer, storefront access **public read**). **Lower wins; unset sorts last.** It selects the default PDP breadcrumb collection and has no effect on membership or a collection's own product order.

| Rank | Band | Collections |
|---|---|---|
| 5 | Product sub-type and activity | the live second-level collections behind the two-level menu — `Sandalen`, `Teenslippers`, `Slippers`, `Sneakers`, `Laarzen`, `Hardlopen`, `Training`, … They locate a product more precisely than a parent collection, so they rank below 10. |
| 10 | Product type | `Schoenen`, `Kleding`, `Accessoires` |
| 20 | Occasion | `Fashion & Lifestyle`, `Sport & Training`, `Outdoor & Werk` |
| 30 | Gender | `Dames`, `Heren`, `Kinderen` |
| 40 | Brand | `FitFlop`, `Hi-Tec`, `Holster`, `Irasuto Studios`, `Juicy Couture`, `Loewenweiss`, `Nike Swim`, `Odlo`, `Pas dé Monacó`, `Sneaker Lab`, `Sweaty Betty` |
| — | Left unset deliberately | `Solden`, `Merken`, `Home page` |

The banding answers "which of these tells a shopper where they are?" — `Schoenen` locates them better than `Dames`, which locates them better than `Loewenweiss`. `Solden` and `Merken` are left unset so a sale or landing collection can never caption a trail.

For breadcrumbs, rank is only the fallback: when a shopper reaches a product from a collection page, the breadcrumb names the collection they actually browsed instead. See the `pdp-breadcrumb` capability spec.

## PDP related products

- Start at the lowest-ranked product collection; broaden through higher ranks only until four items are found. Unranked collections come last.
- Keep only products with the exact same `custom.genderid`; exclude the viewed product, unavailable products, and duplicates.
- Preserve each source collection's native Shopify product order. If no eligible product exists, hide the rail.
- The rail never uses breadcrumb route/session context, so it is stable for every PDP entry point. See `pdp-related-products`.

## Sources and maintenance

- The three special collections above key on the exact Product **vendor** text (case-sensitive, no fuzzy match) — see "Special collections" for the mapping.
- The Product metafields `custom.activities` (metaobject reference, multi-valued) and `custom.shopify_originalbrands_category` (plain string) still exist as real product data and may still surface as native PLP filters within whichever collection a product belongs to — they just no longer control membership of these three special collections, since a live check found `custom.activities` is genuinely multi-valued in ways that made the two most-visited pillars overlap (see "Special collections" above).
- The gender collections use exact text values from the Product metafield `custom.genderid`.
- The two metafield definitions must retain Shopify's **Use as a condition in collections** capability if anything elsewhere still conditions on them. See `MIGRATION-TO-LIVE.md` for the live-shop requirement.
- **A newly created collection has no `breadcrumb_rank` and therefore sorts last.** That is a safe default, not a broken state — it simply never wins a breadcrumb while any ranked collection also contains the product. Assign it a band when the collection is approved.
- When the catalog changes, run the repository-local `ob-collection-maintenance` skill. It now scans live **vendor** values against this approved mapping (updated 2026-09-03 alongside this rule-type change) and reports new or unassigned vendors. It does not assign a newly discovered vendor automatically; approve its destination first, then update the corresponding collection rule set and this file together.

## Current scan baseline

Live Admin API audit on 2026-09-21: **565 active products**, 11 distinct live
vendor strings, and no vendor outside the approved baseline. The live special
collections still use the documented OR rule sets and currently contain:

- Sport & Training: 98 products
- Outdoor & Werk: 2 products
- Fashion & Lifestyle: 74 products

| Vendor | Live products | Needs-collection |
|---|---:|---|
| Odlo | 92 | Sport & Training |
| RH+ | 0 | Sport & Training (vendor string unverified — not synced yet) |
| Nike Swim | 3 | Sport & Training |
| Sweaty Betty | 3 | Sport & Training (provisional — may leave the feed) |
| Hi-Tec | 2 | Outdoor & Werk |
| Magnum | 0 | Outdoor & Werk (vendor string unverified — not synced yet) |
| Juicy Couture | 70 | Fashion & Lifestyle |
| Pas dé Monacó | 3 | Fashion & Lifestyle |
| Irasuto Studios | 1 | Fashion & Lifestyle |
| FitFlop | 379 | None — comfort footwear, reachable via Schoenen + its Merken brand page |
| Holster | 3 | None — comfort footwear, reachable via Schoenen + its Merken brand page |
| Loewenweiss | 8 | None — comfort footwear, reachable via Schoenen + its Merken brand page |
| Sneaker Lab | 1 | None — care products, reachable via Accessoires + its Merken brand page |

Every activity value is still assigned to a metaobject and every category value above is still real product data, but as of 2026-09-03 neither list controls membership of the three needs-collections — see "Special collections."

## Two-level main navigation

Implemented in the dev shop on 2026-09-21. The Main menu uses resource-linked
collection/page items rather than hard-coded HTTP links. All 24 new smart
collections are published to the Online Store, sort by best selling, and carry
`custom.breadcrumb_rank = 5`. The existing `Accessoires` collection was converted
in place to a smart collection, retains its URL, and carries rank 10.

**One deliberate exception:** `Outdoor & Werk`'s `Magnum` child is a plain `HTTP`
item pointing at `#`, added same-day once Magnum's SKUs still hadn't synced (see
`NICK.md`). There is no Magnum collection yet to resource-link to. Replace it with
a real `COLLECTION` item (same pattern as `Hi-Tec`'s child) the moment Magnum syncs
and its vendor collection exists — until then this is the one menu item that isn't
resource-linked.

Desktop rendering uses Dawn's compact `Dropdown` menu type. Fine-pointer desktop
devices open and close the dropdowns on hover; touch devices and keyboard users
retain an explicit disclosure control. Every top-level label is a real link to
the parent destination, identical to the first `Alles ...` child target; the
adjacent caret opens the submenu for keyboard users. The hover enhancement lives
in `assets/details-disclosure.js`; the menu tree itself remains Shopify Admin data.

### Smart collection rules and verified counts

| Parent | Collection | Handle | Included source value(s) | Products |
|---|---|---|---|---:|
| Sport & Training | Hardlopen | `hardlopen` | Activities: `Running` OR `Hardlopen` | 41 |
| Sport & Training | Training | `training` | Activities: `Training` | 85 |
| Sport & Training | Wandelen | `wandelen` | Activities: `Wandelen` | 80 |
| Sport & Training | Fietsen | `fietsen` | Activities: `Fietsen` | 16 |
| Sport & Training | Skiën & snowboard | `skien-snowboard` | Activities: `Skiën & Snowboard` | 25 |
| Sport & Training | Zwemmen | `zwemmen` | Activities: `Zwemmen` | 4 |
| Schoenen | Sandalen | `sandalen` | Category: `Sandalen` | 50 |
| Schoenen | Teenslippers | `teenslippers` | Category: `Teenslippers` | 112 |
| Schoenen | Slippers | `slippers` | Category: `Slippers` OR `Slipper` | 90 |
| Schoenen | Sneakers | `sneakers` | Category: `Sneakers` | 78 |
| Schoenen | Laarzen | `laarzen` | Category: `Laarzen` | 26 |
| Schoenen | Ballerina's | `ballerinas` | Category: `Ballerinas` | 20 |
| Schoenen | Instappers | `instappers` | Category: `Instappers` | 14 |
| Kleding | Broeken | `broeken` | Category: `Broeken` | 34 |
| Kleding | Truien | `truien` | Category: `Truien` | 20 |
| Kleding | Vesten | `vesten` | Category: `Vesten` | 21 |
| Kleding | Shirts & tops | `shirts-tops` | Category: `Hemden` OR `Bovenkleding` OR `Shirt` | 40 |
| Kleding | Shorts | `shorts` | Category: `Shorten` | 10 |
| Kleding | Leggings | `leggings` | Category: `Leggings` OR `Legging` | 5 |
| Kleding | Jurken & rokken | `jurken-rokken` | Category: `Jurken` OR `Rokjes` | 6 |
| Accessoires | Handschoenen | `handschoenen` | Category: `Handschoenen` | 14 |
| Accessoires | Kousen | `kousen` | Category: `Kousen` | 10 |
| Accessoires | Hoofddeksels | `hoofddeksels` | Category: `Headware` | 5 |
| Accessoires | Overige accessoires | `overige-accessoires` | Category: `Accessoires` | 3 |

The parent `Accessoires` collection contains the OR-union of `Handschoenen`,
`Kousen`, `Headware`, and `Accessoires`: **32 products**. `Sneaker` remains out of
the `Sneakers` collection until Nick normalizes or confirms that ambiguous value;
the intentionally merged stale singular values are shown explicitly in the table.

All 24 of these smart collections shipped 2026-09-21 with an empty `descriptionHtml`
(only the top-level/needs/brand/gender collections had one). Descriptions were
written the same day, one short Dutch paragraph per collection, sourced from each
collection's actual vendor composition (checked live via the Admin API rather than
assumed from the category name) — e.g. `Sandalen`/`Teenslippers`/`Sneakers`/`Laarzen`/
`Ballerina's`/`Instappers` are 100% FitFlop, `Slippers` mixes in Löwenweiss, and the
`Sport & Training` sub-collections (`Hardlopen`, `Training`, `Wandelen`, `Fietsen`,
`Skiën & snowboard`) are effectively all Odlo.

### Main menu structure

```text
Sport & Training ▾
├─ Alles voor sport & training
├─ Hardlopen
├─ Training
├─ Wandelen
├─ Fietsen
├─ Skiën & snowboard
└─ Zwemmen

Outdoor & Werk
├─ Alles voor outdoor & werk
├─ Hi-Tec
└─ Magnum (temp. # link, geen collectie tot Akeneo-sync)

Fashion & Lifestyle
├─ Alles voor fashion & lifestyle
├─ Juicy Couture
├─ Pas dé Monacó
└─ Irasuto Studios

Schoenen ▾
├─ Alle schoenen
├─ Sandalen
├─ Teenslippers
├─ Slippers
├─ Sneakers
├─ Laarzen
├─ Ballerina's
└─ Instappers

Kleding ▾
├─ Alle kleding
├─ Broeken
├─ Truien
├─ Vesten
├─ Shirts & tops
├─ Shorts
├─ Leggings
└─ Jurken & rokken

Accessoires ▾
├─ Alle accessoires
├─ Handschoenen
├─ Kousen
├─ Hoofddeksels
└─ Overige accessoires

Merken ▾
├─ Alle merken
└─ 11 huidige merken, alfabetisch

Solden
└─ voorlopig empty. Drin lassen!
```
