## Why

Brand is a first-class shopping dimension for this multi-brand shop, and desktop has a "Merk" facet, but the mobile filter bar only offers Gender, Maat and Kleur. A phone shopper on a mixed collection cannot narrow by brand at all.

## What Changes

- The mobile filter bar gains a Merk row (native `vendor` facet), placed directly after Gender, with the same checkbox-backed boxes and the same native parameter as desktop.
- The row follows the existing "fewer than two values" rule, so it stays away on brand collections and wherever only one brand remains.
- A row with an active value always renders, even as the only value left, so a selection stays on its row control. Previously the row vanished with no pill, so such a selection could not be removed and was dropped on the next filter change.
- The open panel gets one reset link while any filter is active, replacing Dawn's clear-all in the mobile pill row.

## Capabilities

### New Capabilities

### Modified Capabilities
- `plp-mobile-filter-bar`: the open panel renders Gender, Merk, Maat and Kleur rows instead of exactly Gender, Maat and Kleur; a row with an active value renders even with a single value, replacing the pill for that case.

## Impact

- `snippets/ob-mobile-filter-bar.liquid`, `snippets/facets.liquid` (mobile pill row), `assets/component-facets.css`.
- Shop dependency: the Merk filter must be enabled in Search & Discovery. Already on the migration checklist.
