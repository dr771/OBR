## Why

The PLP card colour chips mark their selection with a hairline border one step darker than the card's warm surface. Shipped, that hairline reads as almost nothing on a rail of five to eight chips — it is a one-pixel edge against a surface it was deliberately derived from, so the shopper cannot tell at a glance which colourway the card is currently showing. The card's whole chip treatment is otherwise borderless and blended, and a border was the one leftover control-like element in it.

Reviewed live on the collection grid: shifting the cue from a border to the chip's own surface lightness makes the selected chip legible from across the grid without adding a ring, an outline, or any drawn edge.

## What Changes

- Every card colour chip rests on the card's warm surface mixed 60% toward white, instead of the full surface colour.
- The active, hovered, or keyboard-focused chip returns to the full warm surface colour — it is the darkest chip in the rail, and that contrast is the selection cue.
- **BREAKING** (spec-level): no border is drawn on a card chip in any state. The hairline `color-mix(in srgb, var(--ob-product-photo-surface) 80%, #000)` on `--active` / `:hover` is removed. The transparent border-width reservation stays, purely so chip geometry is unchanged.
- The keyboard `:focus-visible` outline is unchanged — surface lightness alone is not a focus indicator, so the foreground-coloured outline still carries that job.
- Chip photography is untouched: it keeps `mix-blend-mode: multiply` onto the chip surface, so a resting chip reads lighter as a consequence of the lighter backdrop rather than through any change to the image itself.
- Scope is the collection grid only (`#ProductGridContainer`), matching where the blended chip treatment already lives. Homepage and search grids keep their bordered chips, as today.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `plp-card-swatches`: the requirement "Swatch row renders below the card image with borderless, blended chips" currently mandates a hairline border on the active/hovered chip and a reserved border width so drawing it does not inset the image. That cue is replaced by a surface-lightness cue, and the border is removed from every state.

## Impact

- `assets/component-ob-swatches.css` — the `#ProductGridContainer .product-card-wrapper .ob-card-swatch` block only. Already implemented and live-verified on main theme `148245381229`.
- No Liquid, JS, template, or theme-setting changes. `snippets/ob-card-swatches.liquid` and `assets/ob-option-rail.js` are untouched.
- No shop-side dependency, so no new line in MIGRATION-TO-LIVE.md.
- The PDP chips (`ob-swatch-input`) share the file but not the `#ProductGridContainer` scope, and are unaffected.
