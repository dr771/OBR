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

| Vendor | Needs-collection |
|---|---|
| Odlo | Sport & Training |
| RH+ | Sport & Training (vendor string unverified — not synced yet) |
| Nike Swim | Sport & Training |
| Sweaty Betty | Sport & Training (provisional — may leave the feed) |
| Hi-Tec | Outdoor & Werk |
| Magnum | Outdoor & Werk (vendor string unverified — not synced yet) |
| Juicy Couture | Fashion & Lifestyle |
| Pas dé Monacó | Fashion & Lifestyle |
| Irasuto Studios | Fashion & Lifestyle |
| FitFlop | None — comfort footwear, reachable via Schoenen + its Merken brand page |
| Holster | None — comfort footwear, reachable via Schoenen + its Merken brand page |
| Loewenweiss | None — comfort footwear, reachable via Schoenen + its Merken brand page |
| Sneaker Lab | None — care products, reachable via Accessoires + its Merken brand page |

Every activity value is still assigned to a metaobject and every category value above is still real product data, but as of 2026-09-03 neither list controls membership of the three needs-collections — see "Special collections."
