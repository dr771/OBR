## Why

The reuse ledger in MIXED-SHOPS-PLAYBOOK.md marks `predictive-search-overlay` "Reuse as-is — Generic search UX" — SB already shipped and archived this capability against stock Dawn, and OB's header predictive search is currently untouched Dawn (single-column results only, generic "Products" heading, no visible-result cap, no stacking guard against Wishlist King's collection-card hearts). Porting it now clears the next ready item off the "Next up" list in the playbook.

## What Changes

- Cap desktop predictive-search product matches at 8, rendered in a 2-column grid at 750px+ (single column below), with larger 115x140 responsive product imagery (150w/300w srcset) instead of Dawn's 50px thumbnail at all widths.
- Rename the product group heading to a translatable "Suggested products" label with the same larger/bold/uppercase treatment shared by the suggestions and pages group headings (previously each used a different visual weight).
- Product-card hover no longer fills with a background; native keyboard-selected highlight is preserved.
- Bottom action becomes conditional: a translatable "See all results" action appears only when matches exceed 8 and submits to the full search page; 1-8 matches show no redundant action; zero matches keep Dawn's native "Search for …" action.
- When header search is open, the header's stacking context is raised above Wishlist King's collection-card hearts (which otherwise escape above Dawn's sticky header at z-index 9); closing search restores normal stacking. The cart drawer's existing precedence (z-index 1000) stays above both.
- New CSS lives in a new `assets/component-ob-search.css` (OB doesn't use a `custom.css` file the way SB does) loaded from `sections/header.liquid` alongside the existing predictive-search stylesheet links.
- `sections/predictive-search.liquid` markup is restructured to match SB's version (drop the always-present outer wrapper div in favor of a conditional one, `limit: 8` on the product loop, srcset image, new heading/action logic) while preserving OB's existing `<product-component view-event-payload="...">` wrapper around each result link, which SB's older Dawn clone doesn't have.
- New locale keys `templates.search.suggested_products` and `templates.search.see_all_results` added to `locales/en.default.json` and `locales/nl.json`.
- No JavaScript changes — this is a Liquid/CSS-only port; `assets/predictive-search.js` and `assets/component-predictive-search.css` are stock Dawn on both sides already and are not touched.

## Capabilities

### New Capabilities
- `predictive-search-overlay`: header predictive-search result layout, imagery, heading treatment, hover/selection state, conditional see-all-results action, and search-vs-wishlist stacking precedence — ported from SB's already-shipped spec of the same name.

### Modified Capabilities
(none — no existing OB spec covers predictive search today)

## Impact

- `sections/predictive-search.liquid` — markup restructure (product loop, headings, bottom action, live-region count).
- `sections/header.liquid` — add new stylesheet link for `component-ob-search.css`.
- `assets/component-ob-search.css` — new file: 2-column grid, image sizing, heading treatment, hover/selection overrides, search-vs-wishlist z-index guard.
- `locales/en.default.json`, `locales/nl.json` — two new keys under `templates.search`.
- `MIXED-SHOPS-PLAYBOOK.md` — reuse ledger row for `predictive-search-overlay` updated from "Reuse as-is" to seeded/shipped once archived, and the "Next up" list item marked done, matching the convention used for other ported rows.
- No shop-side/admin dependency — this is theme-only, same as SB's version (confirmed in the SB spec, which lists no migration dependency).
