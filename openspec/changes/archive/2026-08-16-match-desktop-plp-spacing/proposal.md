## Why

The desktop PLP currently uses Dawn's compact 8px product-grid gaps and a narrower shell than the approved Bolt reference. Matching the measured reference spacing restores the intended separation between the filter panel and product grid and the intended product-card rhythm.

## What Changes

- Match the desktop PLP shell to the reference's 24px page inset, 230px filter column, and 48px filter-to-grid gap.
- Match desktop collection product grids to 24px horizontal and 36px vertical gaps.
- Keep all mobile spacing and unrelated product grids unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `plp-filter-panel-chrome`: Replace the existing 20px desktop filter-to-grid gutter requirement with the measured 48px reference gutter and define the paired 230px filter column.
- `plp-grid-config`: Add the approved desktop collection-grid gap and shell-inset geometry.

## Impact

Desktop-only CSS in `assets/component-facets.css`; no Liquid, JavaScript, data, app, or mobile behavior changes.
