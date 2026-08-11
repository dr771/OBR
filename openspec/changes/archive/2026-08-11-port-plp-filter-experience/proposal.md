## Why

The desktop sidebar still carries Dawn's default chrome and the mobile experience hides every filter behind a full-screen drawer. Porting SB's coordinated desktop panel and mobile bar gives shoppers a faster, continuously visible refinement surface while preserving Shopify's native facet URLs and AJAX updates.

## What Changes

- Restyle the desktop vertical filter as open-by-default “Shop op …” accordions with compact reset controls, value-only active pills, a narrower content-hugging sidebar, and a sticky summon control when the panel leaves the viewport.
- Replace Dawn's mobile filter drawer for collection/search layouts with an open-by-default toolbar and collapsible Type/Maat/Kleur rows above the grid.
- Render Type and Maat as horizontally scrolling boxes and Kleur as the existing flat family chips in a horizontally scrolling row on mobile.
- Keep filtering and sorting on Dawn's native AJAX pipeline, preserve active parameters for filters omitted from the bar, and retain a screen-reader result announcement.
- Change the existing mobile colour presentation from the drawer's five-column grid to the new bar's non-wrapping row.

## Capabilities

### New Capabilities

- `plp-filter-panel-chrome`: Desktop vertical-filter chrome, reset/pill presentation, content-hugging width, and summon behavior.
- `plp-mobile-filter-bar`: Mobile collection/search toolbar and direct Type/Maat/Kleur refinement rows.

### Modified Capabilities

- `plp-color-filter`: Replace the superseded mobile-drawer grid contract with the mobile bar's horizontal colour row.

## Impact

Touches the shared facet Liquid, an OB mobile-bar snippet, facet and PLP CSS/JavaScript, and storefront translations. No app, admin setting, data-model, or external dependency is added; Shopify Search & Discovery continues to supply the native filters.
