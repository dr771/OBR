## Why

The owner reviewed the approved Bolt reference (`#collection/outdoor-werk`, desktop) against the live desktop vertical filter panel and flagged concrete chrome mismatches: no "FILTER" heading exists today, active-filter pills sit in the wrong column, chevrons are on the wrong side, per-facet reset links and the price facet's max-price caption are visible when they should be hidden, and the filter panel's vertical rhythm hasn't been checked against the reference. `plp-filter-panel-chrome` currently codifies the *opposite* of three of these (no heading, visible inline reset link, left-aligned triangle), so those requirements need to change, not just the implementation.

## What Changes

- Add a blue "FILTER" heading (icon + label, reusing the existing `assets/icon-filter.svg`) above the accordion list in the desktop vertical filter sidebar. **BREAKING** (behavior change): clicking it now collapses/expands the entire accordion list — new interaction not present in the reference proto, confirmed with the owner.
- Relocate the active-filter pill row ("ACTIEF" kicker + value pills + "Wis alles") from the top of the filter sidebar into the main content column, directly below the sort/product-count bar — matching the proto's layout. Requires narrowing the sort/product-count bar so it spans only the grid column instead of the full page width.
- Restyle the active-filter pills to match the proto: rounded pill, white background, hairline border, black (full-ink) label text, color-swatch dot prefix on color-value pills.
- Move each facet accordion's chevron from the left edge to the right edge of its header row.
- Normalize the vertical rhythm inside each accordion section (padding + hairline divider) to match the proto's measured spacing.
- Hide (CSS-only, not removed) the per-facet "Opnieuw instellen" reset link and the price facet's "De hoogste prijs is €X,00" caption, keeping both rendered in the DOM so they can be re-enabled later without re-adding markup.
- Explicitly unchanged: the product grid/cards, the checked/active-state color of in-panel controls (checkboxes, color-swatch selection ring stay blue), and no Klassiek/Inline or grid-density-style controls are added (the proto has them; OB does not and isn't gaining them).

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `plp-filter-panel-chrome`: supersedes "no top-level Filter: heading" → heading now renders and doubles as a panel-wide collapse/expand toggle; supersedes "facet carets are left-aligned filled triangles" → carets move to the right edge; supersedes "a facet with active values SHALL show a small inline reset link" → reset links render but stay visually hidden; adds requirements for the relocated active-filter row's position/styling and the accordion section vertical rhythm; adds a requirement hiding the price facet's max-price caption.

## Impact

- `snippets/facets.liquid` — desktop vertical branch: new FILTER heading markup, relocated active-facets block, hidden reset-link/max-price markup stays but gets a hiding class, chevron markup order/placement.
- `sections/main-collection-product-grid.liquid` and `sections/main-search.liquid` — sort/product-count bar width changes from full-page to grid-column-only, and now sits directly above the relocated active-filter row.
- `assets/component-facets.css` — vertical rhythm, chevron position, pill styling, hidden elements.
- New small JS for the panel-wide collapse/expand toggle (likely alongside `assets/facets.js` or a new `assets/ob-filter-panel-toggle.js` following the `ob-*` snippet/asset convention).
- Affects both the collection page and search results page (both use `filter_type: "vertical"`).
