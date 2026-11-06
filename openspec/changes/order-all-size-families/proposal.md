## Why

Nick saw the PDP for Odlo Gloves Active Warm Kids Eco list its sizes as `XL XXS M L XS S`. Its option key is `[accessory_size]`, which the size ordering doesn't recognize, so the picker falls back to Akeneo order. A scan of the pre-live catalog (1,534 products) shows the same gap in other places:
- Two more families get no ordering at all: `[socks_size]` and `[bra_size]`.
- Range values (`S_M`, `L_XL`, `XS_M`, `116_128`, `23_26`) are never ranked.
- Numbered sizes above 100 (kids clothing `104`–`164`) keep source order.
- Decimal shoe sizes (`36.5`) are pushed to the end.

## What Changes

- Every size option on the PDP is ordered, not only `[shoe_size_eu]`, `[tops_size]` and `[bottoms_size]`. This covers `[accessory_size]`, `[socks_size]`, `[bra_size]` and any future size key. Values outside the taxonomy still keep their source order and go last.
- Range values are ranked by their first size, then their second (`S`, `S_M`, `M`, `M_L`, `L`, `L_XL`).
- Numbered sizes of any magnitude, decimals included, sort ascending after letter sizes.
- The JS twin (`obSortSizeValues`, used for the PDP start size and the wishlist size grids) applies the same ranking.
- **BREAKING (spec):** the scenario "unrecognized size key keeps source order" is replaced. An unknown size key is ordered like any other, and only unknown *values* keep source order.

## Capabilities

### New Capabilities

### Modified Capabilities
- `pdp-size-picker-order`: ordering covers every size option, ranges and numbered sizes of any magnitude, and unknown keys are no longer left unsorted.

## Impact

- `snippets/ob-option-value-order.liquid` (ranking rewritten as sort keys), `snippets/product-variant-options.liquid` (passes the option kind instead of the size family).
- `assets/ob-size-memory.js` (`sortSizeValues` ranking).
- No data, schema or app changes. The PLP size facet is untouched: it keeps the platform-supplied order (`plp-size-facet-grid`).
