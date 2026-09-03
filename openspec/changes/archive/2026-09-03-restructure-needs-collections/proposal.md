## Why

The three "Shop per behoefte" needs-collections were merchandised by activity/category metafield rather than vendor, and the 11-product test sync made two of the three pillars look wrong: "Outdoor & Werk" looked empty (no products), and "Dagelijks Comfort" looked like a weak leftover bucket. A full-catalog SKU export and a live GraphQL check of the actual synced products showed both reads were misleading, and surfaced a real merchandising bug: because Odlo (the brand that dominates Sport & Training's SKU volume) tags nearly every product with activities spanning both the Sport & Training and Outdoor & Werk activity buckets at once (e.g. `Active Warm Base Layer Top` is tagged `[Training, Fietsen, Skiën & Snowboard, Wandelen, Running]`), the two collections would show largely overlapping product sets under the current rule type — not the distinct occasions the homepage grid promises shoppers.

## What Changes

- Switch all three needs-collections from activity/category `PRODUCT_METAFIELD_DEFINITION` OR-conditions to **vendor** OR-conditions (`appliedDisjunctively: true`, one rule per vendor). Vendor is single-valued per product, so the three collections become mutually exclusive by construction, independent of how multi-valued the activity tagging is.
- Keep "Sport & Training" (handle `sport-training`) and "Outdoor & Werk" (handle `outdoor-werk`) as-is by name; re-point their conditions to vendor lists (Odlo/RH+/Nike Swim/Sweaty Betty-provisional, and Hi-Tec/Magnum respectively).
- **BREAKING**: Rename "Dagelijks Comfort" to "Fashion & Lifestyle" and change its handle from `dagelijks-comfort` to `fashion-lifestyle`, re-pointed to vendor list Juicy Couture/Pas de Monaco/Irasuto Studios. Any link or reference to the old handle breaks unless updated.
- Update the homepage "Shop per behoefte" section (`templates/index.json`) to reference the new `fashion-lifestyle` handle and refreshed copy (hero subheading, block number-label, section subheading) that no longer frames the third pillar as "comfort"/"sitting", plus `snippets/ob-occasion-image.liquid`'s image resolver for the new handle.
- Update `COLLECTIONS.md` (the approved merchandising rule set doc) to document the new vendor-based rules, the SKU-weight rationale, and two caveats: RH+/Magnum's exact vendor string is unverified until they sync, and Sweaty Betty's inclusion is provisional pending confirmation it stays in the Akeneo feed.
- No change to the comfort-footwear brands (FitFlop, Holster, Loewenweiss) or Sneaker Lab — they deliberately get no needs-collection, to avoid duplicating the existing Schoenen/Kleding/Accessoires product-type axis.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `homepage-sections`: the "Occasion grid links to the real metafield-based collections" requirement hardcodes the handle `dagelijks-comfort` and describes the collections as metafield-based; both need updating to reflect the `fashion-lifestyle` handle and vendor-based rule type.

## Impact

- **Shopify Admin (live data)**: `collectionUpdate` mutations on the three existing collection IDs (`sport-training`, `outdoor-werk`, `dagelijks-comfort`→`fashion-lifestyle`) replacing `ruleSet.rules` and, for the third, `title`/`handle`.
- **Code**: `templates/index.json` (hero + occasions section settings), `snippets/ob-occasion-image.liquid` (handle-keyed image resolver).
- **Docs**: `COLLECTIONS.md` (non-spec merchandising rule doc), `openspec/specs/homepage-sections/spec.md` (spec delta via this change).
- **Out of scope**: the Merken page / homepage brand marquee and featured-brands grid still list the old 11-brand roster (including Sweaty Betty and Nike Swim, missing RH+ and Magnum) — that mismatch is real but is a separate follow-up, not touched by this change.
