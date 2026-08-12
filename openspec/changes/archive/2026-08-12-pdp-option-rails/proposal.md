## Why

Color and size choices can exceed the available PDP product-information width. Native browser scrollbars are commonly hidden, especially on macOS, so a bare horizontal row fails to communicate that more choices exist. The accepted PDP option rail retains compact one-row scanning while adding restrained, state-aware affordances that reveal more values without dominating the product form.

## What Changes

- Present recognized PDP color swatches and recognized size boxes in independent single-row horizontal rails.
- Provide a thin visible scrollbar, subtle edge fades, and chevron controls only when a rail overflows; hide each directional cue when its edge has been reached.
- Keep color chips at 5.4rem square and size boxes at 5.6rem square on narrow/tablet layouts so colors do not read smaller than sizes.
- Scroll an option into view after it is selected and support pointer, keyboard, touch, reduced-motion, and dynamic Dawn section rendering.
- Gate the whole variation behind one picker-scoped Liquid assignment so it can revert to wrapping color swatches and the responsive size grid without partial remnants.

## Capabilities

### New Capabilities

- `pdp-option-rails`: Defines the single-row PDP color and size option rails, their overflow affordances, their progressive enhancement, and their rollback contract.

## Impact

- PDP variant-picker Liquid, a shared controls snippet, scoped option-rail CSS, and a small progressive-enhancement JavaScript asset.
- Existing Dawn radio inputs, availability behavior, variant resolution, and form submission remain unchanged.
- No app, Akeneo, Shopify-admin, or migration dependency is introduced.
