## 1. Desktop vertical/horizontal filter panel

- [x] 1.1 In `snippets/facets.liquid`, guard the `{% when 'boolean', 'list' %}` facet render (the `<details>...</details>` block) so it only renders when `filter.values.size > 1`.

## 2. Mobile Type/Maat/Kleur bar

- [x] 2.1 In `snippets/ob-mobile-filter-bar.liquid`, guard the per-`bar_kind` row render so it only renders when `filter.values.size > 1`.

## 3. Verification

- [x] 3.1 Push `snippets/facets.liquid` and `snippets/ob-mobile-filter-bar.liquid` to theme `148245381229` and verify `/collections/laarzen` live: only Maat and Kleur accordions/rows render, at desktop and mobile widths.
- [x] 3.2 Verify a broader collection (e.g. `/collections/schoenen` or `/collections/all`) still shows facets with 2+ values (Merk, Producttype, etc.) unaffected.
- [x] 3.3 Verify an active filter in a now-hidden single-value facet (if reachable) still shows as a removable pill in the active-filters row.
