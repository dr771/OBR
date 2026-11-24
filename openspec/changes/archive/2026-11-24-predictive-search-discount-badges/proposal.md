## Why

The header's predictive search shows product thumbnails, title and price, but none of the discount badges that the same product carries on every product card. A shopper searching for a reduced or campaign product sees nothing in the dropdown that tells them it is discounted, until they open the full search page or the PDP.

## What Changes

- Each predictive product result shows the sale badge (`-N%`, or `tot -N%` when sizes are reduced by different amounts) whenever an available variant is reduced, computed by the shared `ob-sale-label` snippet over all available variants (the dropdown has no color selection).
- Each predictive product result shows the campaign badge from `ob-campaign-badge`, under the same window and precedence rules as on cards; `ob-campaign-window.js` already re-checks inserted nodes, so the dropdown needs no new script.
- Desktop places the badges over the thumbnail's top-left corner, as on cards; mobile, where the thumbnail is too small to carry a pill, places them under the price.

## Capabilities

### New Capabilities

### Modified Capabilities
- `predictive-search-overlay`: product results carry the sale and campaign badges.

## Impact

- `sections/predictive-search.liquid`, `snippets/ob-campaign-badge.liquid` (new `search` placement noted in its docs), `assets/component-ob-search.css`.
- No shop-side dependency beyond the existing campaign-collection setup (DISCOUNTS.md).
