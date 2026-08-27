## Why

Many products in the catalog have exactly one color value (e.g. the Pas de Monaco Otis Shirt). On the PDP, `pdp-option-rails` currently renders a full swatch/rail fieldset — legend, single chip, rail chrome, tooltip/chevron JS hooks — for that one color, even though there is nothing to choose. It reads as a non-functional UI element rather than useful information.

## What Changes

- On the PDP only, when a product's recognized color option has exactly one value, the entire color fieldset (`product-form__input product-form__input--swatch product-form__input--ob-block product-form__input--option-rail`, its legend/label, and the rail shell/controls) is skipped — nothing renders for that option.
- A color option with two or more values is unaffected: it keeps rendering as the existing single-row rail exactly as today.
- Recognized size options are unaffected regardless of value count.
- PLP card swatches (`ob-card-swatches`) and the cart drawer's variant line-item display are explicitly out of scope and keep showing single-value colors exactly as they do today — this is a PDP-only change.
- No change to variant resolution, gallery color-filtering, or first-available-variant selection — those already key off the selected/first-available variant, not off whether the swatch UI renders.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `pdp-option-rails`: refines "Recognized color and size options use independent single-row rails" to add an exception — a recognized color option with exactly one value renders no fieldset/rail at all on the PDP, instead of a single-chip rail.

## Impact

- `snippets/product-variant-picker.liquid` — guard the color fieldset render on `option.values.size > 1`.
- No CSS/JS changes expected: `assets/component-ob-option-rail.css`, `assets/ob-option-rail.js`, `assets/ob-swatch-tooltip.js` simply have nothing to attach to when the fieldset doesn't render.
- No changes to `snippets/ob-card-swatches.liquid`, `assets/ob-card-swatches.js`, or cart drawer templates/snippets.
