## Context

OB uses current Dawn section-rendered facets on collection and search pages. Collection cards are paginated in groups of 16 with numbered pagination; all inputs share an 800ms debounce and Dawn's dim overlay; collection controls expose every native sort value. The test catalog has only seven products, so load-more's multi-page path requires a controlled section-response verification in addition to live markup checks.

## Goals / Non-Goals

**Goals:**

- Port SB's four native PLP contracts without introducing a framework, build step, or app dependency.
- Preserve Dawn's section-render/facet/history pipeline and existing delegated card-swatch behavior.
- Keep visible geometry stable during loading and preserve native card image priorities.

**Non-Goals:**

- Porting SB's branded custom dropdown component; OB retains Dawn's native semantic select until the separate branded-control design task is chosen.
- Infinite scroll, automatic prefetch, crawler pagination, or applying `content-visibility` to the initial grid.
- Changing the current four-column desktop/two-column mobile grid.

## Decisions

### Treat load more as part of grid configuration

Removing numbered pagination is only usable if the next page remains reachable, so the section renders a button/count whenever `paginate.next` exists and a small deferred, document-delegated runtime appends the next section response. Delegation survives facet replacements. Appended reveal-animation classes and high fetch priority are stripped because appended cards are below the initial viewport and are not LCP candidates.

### Reuse card DOM for immediate loading feedback

Facet input handling marks the existing `.collection` busy/loading synchronously, then schedules the request. CSS masks media/text with a reduced-motion-aware skeleton; section replacement removes the state. Separate placeholder markup was rejected because it duplicates card geometry and risks CLS. Dawn's dim overlay is not activated.

### Use input-specific scheduling inside the existing facet component

One per-form timer is reset on every input. Price-range fields use 800ms; all discrete controls use 250ms. This keeps coalescing deterministic without layering multiple global listeners over Dawn. `facet-remove` remains routed by Dawn's existing click pipeline and receives the same loading marker at render start.

### Clamp immediately after the existing grid swap

After replacing `#ProductGridContainer` contents, the runtime reads the new maximum offset once and calls instant `scrollTo` only if `scrollY` exceeds it. Load more uses a separate append path and never calls the clamp.

### Centralize collection option ordering in Liquid

A single `ob-plp-sort-options` snippet filters Shopify's supplied values and is rendered by every collection select. Search keeps its native loop. When the current server value is outside the whitelist, a selected hidden option preserves truthful control state; this is required for built-in `/collections/all`, which currently defaults to A–Z. Using the first approved option as a false selected label was rejected.

### Do not add content visibility to this grid

The modern guidance limits `content-visibility: auto` to confirmed heavy offscreen blocks paired with stable intrinsic sizing. OB starts with only 18 cards whose variable image/text heights already use native lazy loading, and appended pages are user-requested; speculative containment would add scrollbar/keyboard risk without measured value.

## Risks / Trade-offs

- [No crawler-deep numbered pagination] → Accepted SB trade-off; collection discovery relies on Shopify/product links rather than page-number anchors.
- [Seven-product test catalog cannot naturally produce `paginate.next`] → Verify the real section markup contract and exercise the delegated append path with a temporary in-browser button against a valid section response; re-check naturally when the assortment exceeds 18.
- [A section response is malformed] → Restore the load-more button and leave existing cards untouched.
- [Unsupported current sort is visually present] → Render it selected but hidden from the selectable list; once an approved sort is chosen, only approved options remain.

## Migration Plan

Deploy only the changed theme files to main theme `148245381229`. Verify sorting and filtering on desktop and 390px mobile, timing/network behavior, skeleton geometry, scroll clamp, synthetic load-more append/failure recovery, and console output. Roll back with an inverse targeted push. No shop-side configuration is required.
