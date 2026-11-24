## Why

The OB team wants sold-out products off the storefront listings. On pre-live, 454 of 884 active products have zero stock (Odlo: 303 of 533), scattered through every collection, so shoppers page through a grid that is half "Uitverkocht". Shopify has no global switch for collections: its native "Inventory stock > 0" rule only works per automated collection with "match all conditions", which the vendor-based needs collections (match any) and the manual collections cannot use.

## What Changes

- Collection pages list only in-stock products by always applying Shopify's own availability filter (`filter.v.availability=1`): on the first page load and on every facet, sort, chip-removal, clear-all, history and load-more update.
- The forced filter is invisible: no "Beschikbaarheid" filter group, no active chip, and it doesn't count toward the active-filter total or keep "Wis alles" visible.
- New theme setting "Uitverkochte producten verbergen" (default on). With the setting off, or while the Availability filter is not enabled in Search & Discovery, collection pages behave exactly as before and nothing redirects.
- The homepage featured-collection rail skips sold-out products under the same setting and still fills up to its configured product count.
- Out of scope for the theme: search and predictive search follow the Search & Discovery setting "Out of stock products: Hide" (admin). Product pages stay reachable by URL (redirects, wishlists, cart links).

## Capabilities

### New Capabilities
- `plp-hide-sold-out`: collection listings and the homepage product rail show only products that can be bought; the filter that achieves it stays out of the shopper's filter UI and survives every listing update.

### Modified Capabilities
<!-- none: plp-filter-panel-chrome, plp-mobile-filter-bar and plp-loading-feedback requirements are unchanged; the availability facet simply isn't rendered while forced. -->

## Impact

- `snippets/ob-in-stock-only.liquid` (new, the single gate), `snippets/facets.liquid`, `assets/facets.js`, `layout/theme.liquid` (early redirect on collection templates), `sections/featured-collection.liquid`, `config/settings_schema.json`.
- Shop-side dependency, per shop: Search & Discovery → Filters → Availability must be enabled; Search & Discovery → Settings → Out of stock products → Hide for search. Both go into MIGRATION-TO-LIVE.md.
- One extra page load when a shopper enters a collection by a URL without the filter (menus, hero pills, external links). Canonical URLs are unaffected: Shopify's `canonical_url` already drops filter parameters.
