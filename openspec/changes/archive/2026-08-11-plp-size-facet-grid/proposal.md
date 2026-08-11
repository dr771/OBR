## Why

The "Maat" facet is the only merchandising-relevant filter still rendering as Dawn's stock checkbox list. Colour already got a dedicated visual treatment (`plp-color-filter`), so size now looks like an afterthought beside it — and a vertical list is a poor fit for size values, which are short, uniform-width tokens that a shopper scans rather than reads. SweatyBetty shipped a 4-column box grid for exactly this and it is on the reuse ledger as "reuse as-is".

Measuring the live facet before porting changed the scope materially, and in OB's favour: **the ordering work SB's port implies is not needed here.** Shopify already returns the values size-sorted (`35 36 … 47`, then `XXS XS S M L XL XXL`), because OB's facet is metafield-backed rather than option-backed. This change is therefore presentation-only.

## What Changes

- The collection template switches to the **vertical** filter layout. It was set to `horizontal`, which put facets in dropdown popups and disabled Dawn's show-more truncation entirely; vertical is the intended layout, confirmed with the owner during implementation.
- The "Maat" facet renders each value as a clickable box in a 4-column grid on the desktop vertical filter, instead of a checkbox list. Selected values invert their fill; zero-count values stay visibly disabled.
- Detection is by `filter.param_name contains 'available_erp_sizes'`, matching how the colour facet is already detected in `facets.liquid`. No other facet's rendering changes.
- Dawn's native AJAX facet filtering and its show-more/show-less truncation are preserved unchanged — the grid re-skins the same `<input type="checkbox">` controls rather than replacing them.
- The mobile filter drawer keeps Dawn's default list for now. SB later superseded that carve-out via `plp-mobile-filter-bar`, which OB has not ported yet; folding it in here would drag an unported capability into scope.

Explicitly **not** in scope, and each for a measured reason:

- **No theme-side size ordering.** Verified live: the facet arrives correctly sorted. Porting SB's ordering logic would add a code path whose only observable effect is to re-derive an order Shopify already supplies.
- **No use of `ob-option-meta`.** It keys off a bracketed Akeneo *option* name (`[shoe_size_eu]`); the filter object carries no such key. It stays correct for PDP/PLP option rendering — facets are a separate path.
- **No split into separate shoe and apparel facets.** Both systems already share one "Maat" facet and read acceptably. Splitting would require a Search & Discovery change and cannot be justified from 7 test products.

## Capabilities

### New Capabilities
- `plp-size-facet-grid`: the desktop PLP size facet renders as a 4-column grid of selectable boxes, preserving Dawn's native filtering, disabled-value and show-more behaviour.

### Modified Capabilities
<!-- None. The colour facet, option-kind detection and the other facets are untouched;
     this adds a rendering branch alongside them rather than altering their requirements. -->

## Impact

- `snippets/facets.liquid` — one added branch in the desktop value loop (alongside the existing `filtercolors` branch), plus a grid class on the enclosing `<ul>` for the size filter.
- `templates/collection.json` — `filter_type` set to `vertical`. Affects the layout of *every* facet on the collection page, not just size.
- `assets/*.css` — grid and box/selected/disabled styling.
- No JS. No Search & Discovery/admin change, so nothing new for `MIGRATION-TO-LIVE.md`.
- Depends on the `akeneo.available_erp_sizes` facet existing in Search & Discovery, which the migration checklist already tracks.

**Risk checked and cleared:** `facets.liquid` reorders values active-first when `filter.operator == 'AND'`, which would have scrambled the size order the moment a shopper selected a value. Measured against the live facet with `?filter.p.m.akeneo.available_erp_sizes=40` — the order is identical to the unfiltered page and `40` stays in place, so the Maat facet is OR-operated and the reorder never applies. No guard needed.

**One decision the port forces:** Dawn truncates at `show_more_number = 10` for text-presentation filters, and the facet currently carries 20 values. Ten boxes in a 4-column grid truncates mid-row, which looks like a rendering bug rather than a deliberate cut. The size grid therefore needs a threshold that is a multiple of 4 — see design.
