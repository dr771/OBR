## Why

Brand is a first-class shopping dimension for this multi-brand shop, and desktop has a "Merk" facet, but the mobile filter bar only offers Gender, Maat and Kleur. A phone shopper on a mixed collection cannot narrow by brand at all.

## What Changes

- The mobile filter bar gains a Merk row (native `vendor` facet), placed directly after Gender, with the same checkbox-backed boxes and the same native parameter as desktop.
- The row follows the existing "fewer than two values" rule, so it stays away on brand collections and wherever only one brand remains.
- A row that is not rendered no longer counts as a bar row: its active values get a mobile pill and pass through bar submissions as hidden inputs. The spec already promised this pill for Gender, Maat and Kleur; the code suppressed it regardless of whether the row rendered, so such a selection could not be removed and was dropped on the next filter change.

## Capabilities

### New Capabilities

### Modified Capabilities
- `plp-mobile-filter-bar`: the open panel renders Gender, Merk, Maat and Kleur rows instead of exactly Gender, Maat and Kleur; the pill and pass-through rules depend on whether a row rendered, not on the filter kind alone.

## Impact

- `snippets/ob-mobile-filter-bar.liquid`, `snippets/facets.liquid` (mobile pill row), `assets/component-facets.css`.
- Shop dependency: the Merk filter must be enabled in Search & Discovery. Already on the migration checklist.
