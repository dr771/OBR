## Why

Search & Discovery's OR/AND setting controls how several active values are queried, but it does not control whether the storefront permits one or several active color choices. The merchant needs that separate interaction decision to remain reversible while the PLP direction is evaluated.

## What Changes

- Add a global theme setting for color-filter selection mode: `One color` (default) or `Multiple colors` (the previous behavior).
- In multiple mode, keep native checkbox controls and allow several active color families; Shopify's configured filter operator continues to govern how those values combine.
- In single mode, expose native radio semantics on desktop, the mobile filter bar, and Dawn's fallback mobile drawer; selecting a new color replaces the previous color.
- Keep native URLs, instant AJAX filtering, active-filter removal, counts, tooltips, disabled states, and all non-color facets unchanged.
- Normalize an incoming multi-color URL when single mode is enabled so rendered controls, URL, and results cannot disagree.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `plp-color-filter`: Add the merchant-selectable single/multiple interaction semantics to the color facet across all filter layouts.
- `plp-mobile-filter-bar`: Require the mobile color row to follow the same global selection mode as desktop while preserving instant native filtering.

## Impact

- `config/settings_schema.json`: one global color-filter selection setting; no direct `settings_data.json` mutation.
- `snippets/facets.liquid`, `snippets/ob-mobile-filter-bar.liquid`, and the shared facet input snippet: checkbox/radio rendering based on the setting.
- Existing Dawn facet JavaScript or a small delegated normalization layer: single-mode URL/state replacement and AJAX refresh.
- No Search & Discovery configuration, Akeneo data, product model, or filter parameter changes.
