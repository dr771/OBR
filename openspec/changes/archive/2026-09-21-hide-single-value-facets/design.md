## Context

`snippets/facets.liquid` renders every entry in `results.filters` as an accordion (vertical/horizontal layouts) regardless of how many values it currently offers. `snippets/ob-mobile-filter-bar.liquid` already restricts its rows to `type`/`size`/`color` kinds only (Activities/Gender/Merk/Category never appear there), so the desktop panel is the surface where the reported problem actually occurs; the mobile bar only needs the same guard for its size/color rows for consistency, since a narrow enough collection could still collapse those to one value.

## Goals / Non-Goals

**Goals:**
- A list/boolean facet with 0 or 1 available value never renders its accordion/row, on any surface.
- No change to which values render within a facet that does have 2+, and no change to active-filter pill behavior.

**Non-Goals:**
- `price_range` facet visibility (different data shape — `min_value`/`max_value`, not a `values` list). Not touched.
- Reworking facet ordering, show-more truncation, or any other `plp-filter-panel-chrome`/`plp-mobile-filter-bar` requirement.

## Decisions

- **Guard on `filter.values.size <= 1`, not a hardcoded facet list.** The set of collapsed facets is a function of the collection's product mix, not fixed per facet type (Activities/Merk/etc. could have 2+ values on a broader collection like `/collections/schoenen`). A value-count guard is correct everywhere without per-collection config.
- **Guard in the Liquid loop, not via CSS.** Dawn's facets are server-rendered; a CSS-only hide would still submit/reserve layout space and would fight the existing `show-more`/accordion-open logic. Skipping the `{% when 'boolean', 'list' %}` render entirely is the same pattern the codebase already uses elsewhere (e.g. the mobile bar's `bar_kind` filter).
- **Leave active pills untouched.** `ob-active-filters-desktop.liquid` iterates `filter.active_values` independently of accordion visibility, so a facet that becomes single-valued only *after* a value was selected still shows that value as a removable pill — consistent with the existing design where the facet's own inline reset link is already suppressed in favor of pills.

## Risks / Trade-offs

- [A facet could flicker in/out of existence as a shopper narrows other filters via AJAX] → Same re-render path Dawn already uses for every facet update (`facets.js` replaces the whole panel), so this is no different from values within a visible facet appearing/disappearing today.
- [A single remaining value in an otherwise-informative facet (e.g. "Merk: FitFlop") no longer tells the shopper anything about the collection] → Accepted per owner decision; the active-filter/collection copy is not this facet panel's job.
