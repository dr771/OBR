## Why

The PDP's full trail (`Home › Ballerina's › FitFlop F-Luma…`) asks a shopper who wants "another item" to pick a target out of a row of links. What they want is to go back to where they were. Zalando solves this with one `← back to <listing>` link, and the owner wants the same. The PLP has the opposite problem: its hero trail is always `Home › <title>`, so it never shows where a category sits (`Schoenen › Ballerina's`).

## What Changes

- **BREAKING (PDP presentation):** the PDP breadcrumb trail becomes a single back link, `← Terug naar <collection>`. The product's own entry and the Home entry are no longer rendered visibly.
- The collection the link names is resolved exactly as today: routing collection → the collection remembered from this tab (only if the product belongs to it) → the lowest `breadcrumb_rank` collection.
- The remembered context now holds the full listing URL, including filter/sort parameters, captured when the shopper leaves the listing. It is no longer just the collection handle. The link returns to that filtered listing.
- When the shopper came straight from that listing, activating the link goes back in browser history instead of loading the page again. Scroll position, and anything the browser restores from its back/forward cache, comes back with it.
- Arriving from search results produces `← Terug naar zoekresultaten`, linking back to the same query and filters.
- Visiting any page that is not a listing or a PDP (homepage, content page, cart) clears the remembered context. A later product opened from, for example, homepage bestsellers therefore gets the ranked fallback, not a stale listing.
- The PDP emits `BreadcrumbList` structured data with the full path (`Home › <menu parent> › <collection> › <product>`), so search engines still get the hierarchy that is no longer visible.
- The PLP collection hero shows the full path `Home › <parent> › <collection>`. The parent comes from the collection's position in the `main-menu` navigation, and a collection that is not in the menu keeps `Home › <title>`.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `pdp-breadcrumb`: the visible trail becomes a single back link. The remembered context becomes a full listing URL that can be a search. Same-listing returns use history. BreadcrumbList structured data is added. The measured presentation values are dropped, per the altitude rule.
- `ob-collection-hero`: the breadcrumb goes from the fixed two-level `Home / {title}` to a menu-derived full path.

## Impact

- `snippets/ob-breadcrumb.liquid`: markup, inline resolver, and JSON-LD.
- `assets/ob-breadcrumb.js`: now loaded site-wide. It records collection/search context with the full URL, clears context elsewhere, and handles the history-back click.
- New `snippets/ob-menu-trail.liquid`: resolves a collection's menu ancestors, shared by the hero and the PDP JSON-LD.
- `snippets/ob-collection-hero.liquid` and `sections/main-collection-banner.liquid`: pass the collection and render its ancestors.
- `sections/main-collection-product-grid.liquid` and `sections/main-search.liquid`: context markers. `layout/theme.liquid`: global script include.
- `assets/component-ob-pdp.css`: back-link styling. `locales/nl.json` and `locales/en.default.json`: back-link strings.
- The shop depends on `main-menu` staying nested (category under its parent). Add this to MIGRATION-TO-LIVE.md.
