## Context

See `proposal.md` for motivation. The current picker already renders semantically correct radio inputs and delegates sorting to `ob-option-value-order`; its generic pill CSS sizes every label from its content. `ob-option-meta` already identifies recognized size axes separately from color and generic axes.

## Goals / Non-Goals

**Goals:**

- Add a layout hook only to recognized size fieldsets and use it to create a predictable box grid that is also the no-rail fallback.
- Preserve Dawn's form controls, variant-change events, availability calculation, and no-JavaScript submission behavior.
- Reuse active color-scheme variables so later branding changes do not require component rewrites.

**Non-Goals:**

- Changing size ordering, availability rules, inventory behavior, or the product form.
- Adding size-chart, fit-guide, or brand-specific content.
- Defining rail controls, overflow cues, or color-swatch navigation; those belong to `pdp-option-rails`.

## Decisions

### Force recognized sizes onto Dawn's button path

`product-variant-picker.liquid` will select the existing button renderer whenever `ob-option-meta` reports `size`. This makes the approved grid stable even if the merchant changes the generic picker setting, while leaving unrecognized options configurable. Rebuilding the controls or adding JavaScript was rejected because Dawn's native radios already provide the required semantics and event behavior.

### Add a size-specific fieldset class and responsive inner layout

The recognized size fieldset retains the generic pill class for its established input-state rules and adds a size-grid class for specialization. With the rail variation off, its option controls use a dedicated CSS Grid: four `minmax(0, 1fr)` tracks in narrow product columns and eight tracks from a 44rem container width. This gives equal columns without assuming a size count while avoiding browser-specific `fieldset`/`legend` grid layout behavior. The option-rail capability may switch that same inner element to a single flex row without changing any radio markup.

### Specialize existing labels instead of duplicating their state system

Size-grid CSS removes content-sized pill margins, uses the same input-radius token as the existing PLP size grid, provides 5.6rem square targets in narrow product columns and 4.8rem desktop targets, and retains the existing checked, unavailable, and focus selectors. Theme foreground/background variables remain the sole color source. This keeps the component skin-agnostic and preserves forced-colors behavior.

## Risks / Trade-offs

- [Four columns can make unusually long future size labels wrap] → Allow label content to wrap and preserve the minimum height; unknown option families remain outside the grid.
- [Forcing button presentation overrides a merchant's dropdown choice for recognized sizes] → This is intentional capability behavior and is limited to the three Akeneo size families.
- [Generic pill rules may change in a future Dawn update] → Keep the size specialization scoped and verify selected, unavailable, and focus states during Dawn upgrades.

## Migration Plan

Deploy the changed Liquid and CSS together. Rollback is the inverse two-file deployment; there is no data or admin migration.
