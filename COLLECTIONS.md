# Smart collections

## Current catalog values

### Categories

- Headware
- Kousen
- Legging
- Ondergoed
- Outdoor
- Sandal
- Shirt
- Slipper
- Sneaker

### Activities

- Fietsen
- Lifestyle
- Running
- Skiën & Snowboard
- Training
- Wandelen
- Zwemmen

## Special collections

These three automatic collections use **OR** logic: a product is included when it matches at least one listed activity or category. The mapping below is the approved merchandising rule set for Original Brands DEV.

### Sport & Training

- Fietsen (act)
- Running (act)
- Zwemmen (act)
- Training (act)

### Outdoor & Werk

- Wandelen (act)
- Skiën & Snowboard (act)
- Outdoor (cat)

### Dagelijks Comfort

- Lifestyle (act)
- Ondergoed (cat)
- Slipper (cat)
- Sandal (cat)

## Gender collections

These automatic collections use the Product metafield `custom.genderid` with OR logic:

- Dames: `Women` or `Unisex`
- Heren: `Men` or `Unisex`
- Kinderen: `Unisex`

## Breadcrumb rank

Most products belong to several of the collections above at once — the Loewenweiss Diva slipper is in `Schoenen`, `Dames`, `Loewenweiss` and `Dagelijks Comfort` simultaneously. The PDP breadcrumb can only name one, and Liquid's `product.collections` order is neither documented nor merchant-configurable, so the choice was effectively arbitrary: `Dagelijks Comfort` — the broadest collection at 18 of 26 products — won every trail on every product.

Rank resolves that. It is the Collection metafield `custom.breadcrumb_rank` (integer, storefront access **public read**). **Lower wins; unset sorts last.** It selects the default PDP breadcrumb collection and has no effect on membership or a collection's own product order.

| Rank | Band | Collections |
|---|---|---|
| 10 | Product type | `Schoenen`, `Kleding`, `Accessoires` |
| 20 | Occasion | `Dagelijks Comfort`, `Sport & Training`, `Outdoor & Werk` |
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

- **(act)** is a value of the Product metafield `custom.activities` (a reference to an `activities` metaobject).
- **(cat)** is an exact value of the Product metafield `custom.shopify_originalbrands_category`.
- The gender collections use exact text values from the Product metafield `custom.genderid`.
- The two metafield definitions must retain Shopify's **Use as a condition in collections** capability. See `MIGRATION-TO-LIVE.md` for the live-shop requirement.
- **A newly created collection has no `breadcrumb_rank` and therefore sorts last.** That is a safe default, not a broken state — it simply never wins a breadcrumb while any ranked collection also contains the product. Assign it a band when the collection is approved.
- When the catalog changes, run the repository-local `ob-collection-maintenance` skill. It scans both sources, compares them with this approved mapping, and reports new or unassigned values. It does not assign newly discovered values automatically; approve their destination first, then update the corresponding collection rule set and this file together.

## Current scan baseline

All activities are assigned exactly once across the three collections. The generic category values `Headware`, `Kousen`, `Legging`, `Shirt`, and `Sneaker` intentionally do not control membership of these special collections: they caused false-positive merchandising results. The mapped category values are `Ondergoed`, `Outdoor`, `Sandal`, and `Slipper`.
