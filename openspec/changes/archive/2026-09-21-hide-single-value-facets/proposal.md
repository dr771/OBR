## Why

On narrow collections (e.g. `/collections/laarzen`, a single-brand, single-category collection), the desktop vertical filter panel renders 5-7 facet accordions but most offer only one selectable value — selecting it can't narrow the result set at all. Confirmed live: Activities, Gender, Producttype, Merk, and Category each showed exactly one checkbox with the full product count, while only Kleur and Maat varied. A facet that can't filter anything is noise, not a choice.

## What Changes

- A facet group whose available values collapse to 0 or 1 (list/boolean-type facets only) SHALL NOT render its accordion, on both the desktop vertical filter panel and the mobile Type/Maat/Kleur bar's per-kind row.
- `price_range` facet visibility is unchanged (different data shape, not in scope).
- Already-active filter pills (`ob-active-filters-desktop.liquid`) are unaffected — they render from `active_values` regardless of accordion visibility, so a selected value in a now-single-value facet stays removable via its pill or clear-all.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `plp-filter-panel-chrome`: add a requirement that a desktop vertical facet with fewer than two available values does not render.
- `plp-mobile-filter-bar`: add a requirement that a mobile bar row (Type/Maat/Kleur) with fewer than two available values does not render.

## Impact

- `snippets/facets.liquid` — desktop vertical (and horizontal) `{% when 'boolean', 'list' %}` facet loop gains a value-count guard.
- `snippets/ob-mobile-filter-bar.liquid` — per-`bar_kind` row rendering gains the same guard.
- No template/section/schema changes; no shop-side (Admin) dependency.
