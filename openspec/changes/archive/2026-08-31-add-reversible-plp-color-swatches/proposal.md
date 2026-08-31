## Why

Akeneo now exposes each variant's `custom.filtercolors` metaobject references, including hex values, so the PLP can reproduce the legacy storefront's flat color-swatch language instead of relying only on product-photo chips. The visual direction is still open, so both presentations must remain available without maintaining duplicate card templates or losing the existing selection behavior.

## What Changes

- Add a global theme setting that switches PLP card controls between flat/split color swatches and the existing product-image chips.
- Make color-swatches the default while retaining the image-chip renderer as an immediate rollback option.
- Resolve each color option's visual from its matched variant's `custom.filtercolors` values: one hex renders solid, multiple hexes render a segmented swatch, and missing color data falls back to the product-image chip.
- Keep the existing pressed state, image swap, matched second-shot hover, and variant-link retargeting identical in both modes.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `plp-card-swatches`: Replace the image-only visual requirement with a merchant-switchable color/image presentation and a graceful fallback chain.

## Impact

- `config/settings_schema.json`: one global PLP swatch-style selector; no `settings_data.json` mutation.
- `snippets/ob-card-swatches.liquid`: both visual renderers and per-variant `filtercolors` resolution.
- `assets/component-ob-swatches.css`: flat and segmented color-swatch styling.
- No JavaScript behavior, product model, filtering configuration, or external dependency changes.
