## Why

The PDP's recognized size options are correctly ordered but still use Dawn's loose generic pill layout, making mixed footwear and apparel sizes harder to scan. A compact, equal-width box grid implements the approved Melissa-derived layout direction without depending on brand colors, typography, homepage approval, or new Akeneo data.

## What Changes

- Render every recognized PDP size family as visible radio-backed boxes with a compact responsive grid fallback.
- Keep the grid responsive inside the product-information column, with touch-sized controls and no hard-coded size values or ranges.
- Preserve distinct selected, unavailable, hover, and keyboard-focus states using the active theme color scheme.
- Allow the dedicated PDP option-rail capability to present color and recognized size controls in a single scrollable row, while retaining this grid as its rollback path.

## Capabilities

### New Capabilities

- `pdp-size-picker-grid`: Defines the responsive layout, state presentation, accessibility, and scope of the PDP size box grid.

### Modified Capabilities

- `pdp-size-picker-order`: Recognized size options now always use the visible button presentation required by the grid, independently of the generic variant-picker setting.

## Impact

- PDP variant-picker Liquid and component CSS; the option-rail CSS, controls snippet, and progressive-enhancement JavaScript are defined by `pdp-option-rails`.
- Existing Dawn radio inputs, variant resolution, availability semantics, and form submission remain intact.
- No app, Akeneo, Shopify-admin, or migration dependency is introduced.
