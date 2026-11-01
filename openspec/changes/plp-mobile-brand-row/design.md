## Context

`ob-mobile-filter-bar` loops over a fixed list of row kinds and matches each filter by `param_name`. Filters without a row pass through as hidden inputs and keep a mobile pill. Both that pass-through and the pill exclusion in `facets.liquid` decide by filter kind only, independent of whether the row actually rendered (`values.size > 1`).

## Goals / Non-Goals

**Goals:**
- Merk row on mobile collection and search pages wherever two or more brands are available.
- An active selection stays visible and removable when its row collapses.

**Non-Goals:**
- No change to desktop facets.
- No theme setting to toggle the row. Search & Discovery already controls whether the filter exists.

## Decisions

- **Match on `filter.p.vendor` via `param_name`.** Native field, no Akeneo detection, consistent with `plp-brand-facet`.
- **Order: Gender, Merk, Maat, Kleur.** Brand is a primary dimension and these are short labels; Maat and Kleur stay adjacent as the variant-level pair. Alternative was appending it last, which would bury it under the tallest rows.
- **Heading from `filter.label`,** as Gender does. `ob-option-meta` would humanize the param name into "Filter.p.vendor".
- **One rule for "has a bar row": known kind, and `values.size > 1` or an active value.** Used for the row itself, the pass-through and the pill exclusion, for all four kinds. A first version dropped the row at one value and showed a pill; the owner rejected that on review because the selected color changed form depending on the other filters. The active value now stays on its row.
- **Pass-through inputs live in their own `.js-filter` span.** Dawn's AJAX render only replaces `.js-filter` elements, so inputs outside one kept their page-load state: a row collapsing mid-session would lose its selection on the next change, and a removed pill's input would bring the value back. A span, because the last-row spacing depends on `.ob-mobile-bar__filter:last-of-type`.

## Risks / Trade-offs

- A fourth row makes the open panel taller, pushing the grid down → the row uses the compact Gender height, the panel stays collapsible, and the "keep grid context" scroll on opening still applies.
- Long brand lists scroll horizontally → same pattern as Maat; the row keeps its native scroll indicator.
