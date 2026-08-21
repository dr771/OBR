## Why

A hairline border on active/hover/focus-visible PLP card colour chips is requested to make the selected/interactive chip state read more clearly, adding a border cue on top of the existing surface-lightness cue.

## What Changes

- Add `border: .1rem solid #66666612` to `#ProductGridContainer .product-card-wrapper .ob-card-swatch--active`, `:hover`, and `:focus-visible` in `assets/component-ob-swatches.css`, superseding the 2026-08-17 "borderless chip" decision. **BREAKING** (reverses a documented spec requirement: `plp-card-swatches` — "No border SHALL be drawn on a card chip in any state").
- The reserved transparent border on the resting `.ob-card-swatch` rule stays transparent at rest; only the three interactive states gain the visible border, so rail/chip geometry is unaffected in every state.
- The existing surface-lightness background-color cue on these same three states is unchanged — the border is additive, not a replacement.
- Keyboard focus keeps its foreground-coloured `outline` in addition to the new border.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `plp-card-swatches`: the "Swatch row renders below the card image with borderless, blended chips" requirement changes from "no border in any state" to "no border at rest; a hairline border on active/hover/focus-visible, additive to the existing surface-lightness cue."

## Impact

- `assets/component-ob-swatches.css` — the `#ProductGridContainer .product-card-wrapper .ob-card-swatch--active` / `:hover` / `:focus-visible` rule block, and its preceding rationale comment.
- `openspec/specs/plp-card-swatches/spec.md` — requirement text and scenario updates.
