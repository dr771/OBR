## Why

OB still uses Dawn's default PLP pagination, slow/deferred loading feedback, unconstrained post-filter scroll position, and full collection sort list. SB has already proven a cohesive native-first replacement for these four related grid interactions, so they should be ported together and verified as one update cycle.

## What Changes

- Show 18 products initially and replace numbered collection pagination with a native “Toon meer” append flow.
- Apply an immediate, geometry-preserving skeleton to existing cards for facet and sort changes; use a short debounce for discrete inputs while retaining a longer price-input debounce.
- Correct only invalid/out-of-bounds scroll positions after a shrinking facet/sort/history grid replacement.
- Restrict collection sort choices to Bestsellers, price ascending, price descending, and Featured; preserve an unsupported server default as a truthful hidden current-value fallback until an approved choice is made. Search sorting remains native.
- Add the editor-facing Featured/manual-order guide.

## Capabilities

### New Capabilities

- `plp-grid-config`: Collection page size, native load-more behavior, and absence of numbered pagination.
- `plp-loading-feedback`: Immediate stable skeleton feedback and input-specific debounce timing.
- `plp-scroll-clamp`: Purely corrective scroll clamping after shrinking grid replacements.
- `plp-sort-options`: Approved collection sorting choices, Dutch labels, default-value fallback, and editor workflow.

### Modified Capabilities

None.

## Impact

- Collection grid Liquid/schema/template settings and a new delegated PLP runtime asset.
- Shared facet runtime used by collection and search results.
- Collection/mobile sort-option rendering and a centralized sort-option snippet.
- PLP styling, `PLP-SORTING.md`, and shared project documentation.
- No app, metafield, metaobject, or admin toggle dependency.
