## Why

A brand's one-line tagline ("Alpine pantoffels", "Comforttechnologie") is written twice today —
once per block in `templates/index.json` (homepage logo grid, as `description`) and once per block
in `templates/page.merken.json` (Merken page, as `eyebrow`). The `homepage-sections` spec even
requires the two to read identically, which makes the duplication a documented correctness risk
rather than a convenience: nothing enforces it, so the first merchant edit on one page silently
makes the two surfaces disagree. The copy belongs to the brand, not to a page, so it should live
on the brand's collection and be read by both surfaces.

The same pass retires the superseded text-wordmark grid. `sections/ob-home-brands.liquid` was kept
as a disabled one-click fallback when `ob-home-brand-logos.liquid` shipped; the real-logo grid has
since been live and reviewed, so the fallback is now dead weight that still has to be reasoned
about every time the brand row is touched.

## What Changes

- New collection metafield `custom.brand_tagline` (single-line text) becomes the single source for
  each brand's one-line tagline, edited on the collection in Admin.
- `sections/ob-home-brand-logos.liquid` and `sections/merken-brands.liquid` both read that metafield,
  falling back to their existing block setting when it is empty **or** when the brand has no
  collection at all (RH+ is rendered from `brand_handle` and therefore can carry no collection
  metafield).
- **BREAKING** (spec-level, not shopper-visible): `sections/ob-home-brands.liquid`,
  `assets/component-ob-home-brands.css`, and the section's disabled instance in `templates/index.json`
  are removed. The current `homepage-sections` requirement to retain them is dropped.
- Layout on both pages is deliberately unchanged — the homepage keeps its card grid, the Merken page
  keeps its hero chips and photo tiles. Only the data source is shared.
- The Merken page's *longer* per-brand description ("Biomechanisch ontwikkelde zolen, sinds 2007.")
  stays a page-specific block setting and does **not** move into the metafield.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `homepage-sections`: the requirement that the superseded text-wordmark section be retained as a
  disabled fallback is removed; the brand card's tagline requirement changes from "reuses the copy
  written on the Merken page" to "reads the brand's `custom.brand_tagline` metafield, block setting
  as fallback".
- `merken-brands-directory`: the tile eyebrow changes from a purely block-level setting to the same
  metafield-first, block-as-fallback resolution, so the "merchant-editable without a code change"
  guarantee is preserved while the copy stops being page-local.

## Impact

- **Theme files:** `sections/ob-home-brand-logos.liquid`, `sections/merken-brands.liquid` (tagline
  resolution); `sections/ob-home-brands.liquid` + `assets/component-ob-home-brands.css` (deleted);
  header comments in `sections/ob-home-brand-logos.liquid` and `assets/component-ob-home-brand-logos.css`
  that reference the removed section.
- **Merchant-editable state:** `templates/index.json` (disabled section instance removed) — a
  `templates/*.json` push, so it goes through the pull-and-diff workflow.
- **Shop data:** one new collection metafield definition, `custom.brand_tagline`, plus a value on each
  of the 11 brand collections. This is a shop-side dependency and goes in MIGRATION-TO-LIVE.md.
- **Not affected:** visual layout of either page, the Merken page's long descriptions, the logo assets
  and `--ob-logo-scale` sizing, and the `ob-brand-logotype` snippet itself.
