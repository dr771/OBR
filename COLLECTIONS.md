# Smart collections

## Special collections

These three automatic collections use **OR** logic: a product is included when it matches at least one listed activity or category. The mapping below is the approved merchandising rule set for Original Brands DEV.

### Sport & Training

- Fietsen (act)
- Running (act)
- Zwemmen (act)
- Training (act)
- Legging (cat)
- Shirt (cat)
- Sneaker (cat)

### Outdoor & Werk

- Wandelen (act)
- Skiën & Snowboard (act)
- Outdoor (cat)
- Headware (cat)
- Kousen (cat)

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

## Sources and maintenance

- **(act)** is a value of the Product metafield `custom.activities` (a reference to an `activities` metaobject).
- **(cat)** is an exact value of the Product metafield `custom.shopify_originalbrands_category`.
- The gender collections use exact text values from the Product metafield `custom.genderid`.
- The two metafield definitions must retain Shopify's **Use as a condition in collections** capability. See `MIGRATION-TO-LIVE.md` for the live-shop requirement.
- When the catalog changes, run the repository-local `ob-collection-maintenance` skill. It scans both sources, compares them with this approved mapping, and reports new or unassigned values. It does not assign newly discovered values automatically; approve their destination first, then update the corresponding collection rule set and this file together.

## Current scan baseline

All current values are assigned exactly once across the three collections:

- Activities: Fietsen, Wandelen, Lifestyle, Running, Skiën & Snowboard, Zwemmen, Training.
- Categories: Headware, Kousen, Legging, Ondergoed, Outdoor, Sandal, Shirt, Slipper, Sneaker.
