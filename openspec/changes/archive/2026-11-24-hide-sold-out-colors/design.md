## Context

Three surfaces render a product's color values: the PLP card rail (`ob-card-swatches`), the PDP picker (`product-variant-picker` → `product-variant-options` → `ob-swatch-input`) and the wishlist item (`ob-wishlist-item`, chips on the favorites page, a `<select>` in the cart cross-sell). Today none of them drop a color for availability. The PDP dims chips via Dawn's `value.available`; the card checks only for a missing image.

## Goals / Non-Goals

**Goals:** one definition of "offered color", applied on all three surfaces, server-side.

**Non-Goals:** the color *filter* in the PLP facet panel (Shopify's own counts); cart line items; hero sub-collection pills; changing which variant a card or PDP starts on (already availability-aware).

## Decisions

- **New snippet `ob-offered-colors`** (product, color_index, current): outputs `|A|B|` of colors that have an available variant, always including `current`; outputs nothing when the product has no available variant ("offer everything"). Callers test `offered == blank or offered contains '|' + value + '|'`. Delimiter-bounded tokens keep `Black` from matching `Matt Black`. Follows the `card_size_values` `|37|38|` convention already in the card. One pass over `product.variants`, so cost is linear in variants, like the existing loops.
- **Not Dawn's `value.available`**: for a color it depends on the selected size (Anthracite reads unavailable while L/XL is selected although XS/M is in stock), so it would hide buyable colors.
- **`current`** is the card variant's color (card), `option.selected_value` (PDP) and the entry variant's color (wishlist). This keeps deep links and filter-narrowed cards consistent without special cases in the JS.
- **Hide, don't dim**: team expectation in the Asana task; no back-in-stock notification exists that would make a visible sold-out color useful.
- **Single-color rules count offered colors**: card `values.size > 1`, PDP `ob_hide_single_color_option`, wishlist `values.size < 2` switch to the offered count.

## Risks / Trade-offs

- [The PDP rail reflows after leaving a sold-out deep-linked color (it disappears on re-render)] → acceptable; it only happens once per visit and moves the shopper onto buyable colors.
- [Untracked zero-stock variants count as available (NICK.md #17)] → data issue, already with Nick; the theme follows Shopify's `available`.
- [Liquid render cost on 100-variant products] → one extra linear variant pass per card; same order as the existing per-color scans.

## Migration Plan

DEV push → verify → commit → pre-live push via `scripts/theme-push.sh` → verify on the RH+ helmet. Rollback: revert the commit and push the same files.
