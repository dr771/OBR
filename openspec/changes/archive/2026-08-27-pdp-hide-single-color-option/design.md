## Context

See proposal.md - Why. `snippets/product-variant-picker.liquid` loops `product.options_with_values` and, for a recognized color option, always renders a `<fieldset>` with a legend and (per `ob_single_row_options`) a rail shell, regardless of how many values the option has. `option.values.size` is available on the Liquid `option` object already in scope in that loop — no new data source needed.

## Goals / Non-Goals

**Goals:**
- Skip rendering the color fieldset/legend/rail entirely when `option.values.size == 1`, on the PDP only.

**Non-Goals:**
- Touching `snippets/ob-card-swatches.liquid`, `assets/ob-card-swatches.js`, or any cart drawer template — explicitly unaffected per the user's instruction.
- Changing behavior for size options, or for color options with 2+ values.
- Changing gallery color-filtering, variant selection, or `has_only_default_variant` handling — unrelated code paths.

## Decisions

- **Guard placement**: add the value-count check to the existing `{%- if picker_type == 'swatch' -%}` branch in `snippets/product-variant-picker.liquid` (around line 73), narrowed to `{%- if picker_type == 'swatch' and option.values.size > 1 -%}`. Alternative considered: adding a separate early `{%- continue -%}` at the top of the `for option in product.options_with_values` loop keyed on `option_kind == 'color'` — rejected because it would also skip a legitimate single-value *non-color* swatch option (e.g. a "Style" swatch), which is out of scope for this change; scoping the condition to the existing color/swatch branch keeps the change minimal and precisely targeted.
- **No JS/CSS change**: `ob-option-rail.js` and `ob-swatch-tooltip.js` are attribute/document-delegated (`[data-ob-option-rail-shell]`, etc.) — when the markup simply isn't present, they have nothing to bind to and do nothing. No guard needed on the JS side.

## Risks / Trade-offs

- [The color name (e.g. "Zwart") disappears from the PDP entirely, since it lived in the fieldset's legend] → Accepted per user's explicit request; out of scope to relocate that text elsewhere.
- [A product could have a color option with exactly one value today that gains a second value later via an Akeneo sync] → No action needed: the guard re-evaluates on every render from live `option.values.size`, so the rail appears automatically once a second color exists.
