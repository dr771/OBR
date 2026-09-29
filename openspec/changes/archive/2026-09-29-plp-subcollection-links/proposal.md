## Why

Shoppers reach the big top-level collections (Schoenen: ~400 products) from the main menu. To get into a category from there, they have to open the filter panel. One tap on `Sandalen` or `Ballerina's` is quicker, especially on mobile, and it lands on a real category page with its own URL and breadcrumb rather than a filter URL. The approved bolt reference (`#collection/outdoor-werk`) shows these shortcuts as pills in the collection hero.

## What Changes

- The collection hero renders a row of pill links to the collection's group in the `main-menu` navigation:
  - **Top-level collection** (e.g. Schoenen): its "Alle …" entry, shown as current, then its children.
  - **Sub-collection** (e.g. Ballerina's): the same group of links, with the current one marked, so shoppers can switch sideways.
- Only menu items that link to a collection with products are shown. The row is omitted when fewer than two links remain.
- Desktop: the pills wrap, right-aligned beside the title (as in the reference). Mobile: a single horizontally scrolling row, with the current pill scrolled into view.
- The group lookup reuses the breadcrumb's main-menu walk (`ob-menu-trail`), so both always agree on where a collection sits.

## Capabilities

### New Capabilities

- `plp-subcollection-links`: menu-derived quick links to sibling/child collections in the collection hero.

### Modified Capabilities

_None._ The `ob-collection-hero` requirements are unchanged; the hero gains an optional content slot, and its breadcrumb rule is untouched.

## Impact

- `snippets/ob-menu-trail.liquid`: new `links` output format, sharing the existing menu walk.
- `snippets/ob-collection-hero.liquid`: new optional `links_content` slot. `sections/main-collection-banner.liquid` fills it.
- `assets/component-ob-collection-hero.css`: pill styling.
- `locales/nl.json` and `locales/en.default.json`: nav label.
- Shop dependency: the same main-menu nesting already listed in MIGRATION-TO-LIVE.md. That entry gets extended.
