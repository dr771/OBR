## Why

The color facet already renders accurate metaobject-backed family chips, but its vertical text rows waste sidebar space and make colors slower to scan. Sweaty Betty’s shipped compact swatch-grid pattern solves that usability gap without changing OB’s native filter data or behavior.

## What Changes

- Render the color-family facet as a fixed five-column grid of 2.8rem circular chips on desktop.
- Render the same compact chip grid inside the existing mobile filter drawer; the separate mobile filter-bar redesign remains out of scope.
- Replace persistent label/count text with a CSS-only hover/focus tooltip while preserving a native checkbox and an accessible DOM label.
- Show only the color-family value in active filter pills, without the redundant facet-name prefix.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `plp-color-filter`: Adds the compact desktop/mobile grid, tooltip, accessible-name, and active-pill presentation requirements.

## Impact

- Theme files: `snippets/facets.liquid`, `snippets/ob-facet-swatch-input.liquid`, and `assets/component-facets.css`.
- No JavaScript, app, Akeneo, Search & Discovery, admin, or migration dependency changes.
- Existing filter URLs and native checkbox submission remain unchanged.
