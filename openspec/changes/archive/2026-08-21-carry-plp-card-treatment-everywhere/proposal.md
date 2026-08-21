## Why

The finished PLP product-card treatment (borderless/blended swatch rail with a surface-lightness selection cue, per-brand photo corrections, and Bolt-matched meta typography) is deliberately CSS-scoped to `#ProductGridContainer`, an ID that only exists on the collection page and search results. Every other surface that renders `card-product.liquid` — homepage featured collections, related products, cross-sells, collage blocks — still shows the pre-D11/D12 bordered-chip look. This was intentionally deferred (playbook "Next up" item 5, 2026-08-17) until the PLP grid itself stabilized; it has now been stable and live-verified since 2026-08-21, so it's the next item.

## What Changes

- Broaden the card-swatch, brand-photo-correction, and card-meta styling in `assets/component-ob-swatches.css` / `assets/component-ob-brand-media.css` from the `#ProductGridContainer`-scoped selector to every `.product-card-wrapper` rendering `card-product.liquid`, regardless of which section contains it.
- Verify and adjust (not redesign) the treatment on each non-PLP surface: homepage featured collections (`featured-collection.liquid`), related products (`related-products.liquid`), and collage blocks (`collage.liquid`).
- Confirm the rail JS (`assets/ob-option-rail.js`, `assets/ob-card-swatches.js`, `assets/ob-swatch-tooltip.js`) already initializes correctly on these surfaces (it's currently keyed on data attributes, not the ID scope, so this is a verification task, not new code) — including Dawn's dynamic section-rendering paths (e.g. related-products' async load).
- No visual or behavioral change to the collection page or search results — this is a scope-lift of already-shipped styling, not a redesign.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `plp-card-swatches`: the swatch-row visual and rail requirements (borderless/blended chips, surface-lightness + hairline selection cue, single-row rail with fades/chevrons/tooltip) currently describe "the PLP product card" — broaden scope so they govern the card's swatch row on every rendering surface, not just the PLP grid.
- `plp-brand-card-treatment`: per-brand CSS-variable photo corrections currently apply only within the PLP grid container — broaden scope so a brand's correction applies identically everywhere that brand's card renders.
- `plp-card-meta`: the Bolt-matched brand/name/price typography currently applies only within the PLP grid container — broaden scope so it applies to every card render.

## Impact

- `assets/component-ob-swatches.css`: replace `#ProductGridContainer .product-card-wrapper` selectors with an unscoped `.product-card-wrapper` (or equivalent shared selector), auditing for any rule that legitimately needs to stay PLP-only (e.g. facet-loading skeleton states, which are out of scope for this change).
- `assets/component-ob-brand-media.css`: confirm brand corrections are already unscoped (spot-checked as `.ob-brand` class-based, not ID-scoped) and only need live verification on new surfaces, not a code change.
- `sections/featured-collection.liquid`, `sections/related-products.liquid`, `sections/collage.liquid`: no expected template changes (they already render `card-product.liquid`), but verify markup parity (e.g. presence of the same wrapper classes/data attributes the rail JS and tooltip depend on).
- No changes to `sections/main-collection-product-grid.liquid` or `sections/main-search.liquid` (already correctly scoped) or to facet/loading-feedback/scroll-clamp behavior.
