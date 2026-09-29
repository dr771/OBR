## Why

Mobile fine-tuning pass on the homepage and PLP (owner review, 2026-09-29). Two of the requested changes alter documented behavior:

- The mobile filter bar's first row was **Type** (`product_type`). For this assortment Gender narrows the grid far more usefully on a phone than product type, which the collection itself largely implies.
- The "Shop per behoefte" cards reveal their description only on hover/focus. Touch has no hover, so on a phone the copy was either invisible or flashed in on the same tap that navigates away.

The rest of the pass (visible "Sorteer op" label, caret inset, no focus box on the sort select, "Verfijn op" typography, panel gutter aligned to the grid) is appearance only and is not specced.

## What Changes

- The mobile bar renders **Gender, Maat and Kleur** rows. `product_type` loses its row and becomes an unrendered filter: its active values pass through as hidden inputs and keep their mobile pill as the removal path.
- Below 750px the occasion-card description is always visible, with no reveal transition. Hover/focus reveal is unchanged from 750px up.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `plp-mobile-filter-bar`: the three rows are Gender/Maat/Kleur instead of Type/Maat/Kleur.
- `homepage-sections`: the occasion-card description is static below 750px.

## Impact

- `snippets/ob-mobile-filter-bar.liquid`, `snippets/facets.liquid` (mobile pill exclusion list), `assets/component-facets.css`, `assets/component-ob-home-occasions.css`.
- No shop-side dependency: the `custom.genderid` facet is already enabled in Search & Discovery (it renders on desktop).
