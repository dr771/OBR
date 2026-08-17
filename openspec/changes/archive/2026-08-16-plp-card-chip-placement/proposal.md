## Why

The PLP card's color-chip row rendered after the price with a bordered chip look. Matching the approved Bolt reference means the chips sit directly under the product photo and share its warm-surface/multiply treatment instead of standing apart with borders.

## What Changes

- Move the swatch row's markup to directly below the card's main image (`card__content`'s first child), instead of after the price.
- Chips share the card media's warm surface color (`#efedec`) and `mix-blend-mode: multiply` on the chip image, replacing the bordered chip look.
- Active/keyboard-focused chip state uses an outline instead of a border.
- Unavailable chip state uses reduced opacity (`0.35`) instead of a dashed border.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `plp-card-swatches`: document swatch-row position (below the main image) and the borderless/blended/outline/opacity visual treatment that replaced the bordered chip look.

## Impact

CSS-only in `assets/component-ob-swatches.css` plus a markup-position move in `snippets/card-product.liquid`. No behavior, JavaScript, data, or admin/shop dependency change — this is a visual-only backfill of an already-shipped commit (2860b48).
