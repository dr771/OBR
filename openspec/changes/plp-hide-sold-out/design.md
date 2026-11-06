## Context

Shopify filters a collection server-side only through URL parameters; Liquid cannot apply a filter to `collection.products` itself. The native availability filter (`filter.v.availability=1` = in stock) exists only when Search & Discovery has the Availability filter enabled — on pre-live it isn't (2026-11-06: the parameter is ignored, Odlo stays at 533). Dawn's facets route every listing update through `FacetFiltersForm.renderPage(searchParams)`: form input, sort, chip removal and clear-all (`onActiveFilterClick`) and popstate. Load-more (`assets/ob-plp.js`) follows the rendered page's `paginate.next.url`, which carries the current parameters.

## Goals / Non-Goals

**Goals:** correct product counts, pagination and filter counts (so Shopify does the filtering, not the template); one gate deciding when the restriction applies; zero effect while the shop isn't set up for it.

**Non-Goals:** search (admin setting), product recommendations and recently viewed, sold-out sizes inside an in-stock product (the PDP and card size UI already mute them), rewriting every collection link in menus/pills.

## Decisions

1. **Force the native filter rather than skip cards in Liquid.** Skipping `product.available == false` in the grid leaves "533 producten" and half-empty pages. The native filter keeps counts, facet counts and pagination right. Alternative per-collection "Inventory stock > 0" rules were rejected: they break the match-any vendor collections and can't apply to manual ones.
2. **One gate snippet, `ob-in-stock-only`.** Renders `true` when `settings.ob_hide_sold_out` is on, the template is a collection, and the collection's `filters` include `filter.v.availability`. `theme.liquid` and `facets.liquid` both capture it, so the "filter not enabled" fallback can't diverge between redirect and UI.
3. **Early inline redirect in `<head>`** on collection templates when the gate is true and the URL's availability parameter isn't exactly `1`: `location.replace` with the parameter set, keeping all other parameters and the hash. It runs before any stylesheet, so the first load costs one round trip and no paint; `replace` keeps the parameterless URL out of history so Back doesn't bounce. The URL check makes a second redirect impossible. Alternative — appending the parameter to every collection link (menus, hero pills, breadcrumbs, cards, homepage tiles, external links) — was rejected as unbounded and still needed for external entry.
4. **`renderPage` normalises the parameters** (`facets.js`): when `.facets-container[data-ob-in-stock-only="true"]`, availability is set to exactly `1` before fetching and before `pushState`. That one choke point covers form submits, sort, chips, clear-all and history.
5. **Hide the facet by skipping it in Liquid**, not CSS: every `for filter in results.filters` loop in `facets.liquid` `continue`s on the availability filter while gated (desktop panel, mobile drawer, both chip rows, the active-value count). No hidden input is needed because decision 4 re-adds the parameter on every submit.
6. **Featured collection over-fetches**: paginate by 50 (the Liquid per-page cap for that loop) and `continue` past unavailable products with a separate counter that replaces `forloop.index` for slide ids and animation order, `break`ing at `products_to_show`. `products_to_display` (slider total) stays the configured count; when fewer in-stock products exist the slider counter can over-state the total, accepted for a homepage rail.

## Risks / Trade-offs

- [Search & Discovery Availability filter disabled later] → gate turns false, listings show sold-out products again, no redirect loop. Recorded in MIGRATION-TO-LIVE.md as a per-shop dependency.
- [Stale filter index after an Akeneo sync] → in-stock filtering lags until Shopify reindexes; same failure mode as the other facets (POST-SYNC-CHECK.md).
- [Extra load on plain collection URLs] → small, one `replace` before render; canonical stays the plain collection URL.
- [Wrong stock data] → if pre-live stock is incomplete, real stock disappears from listings. The setting is the off switch.

## Migration Plan

DEV first, then pre-live, per the theme workflow. Before verifying on each shop the Availability filter must be enabled there (admin, by the owner/team). Rollback: untick the theme setting, or disable the Availability filter.
