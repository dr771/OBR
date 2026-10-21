## Why

Reduced products on the standalone `/apps/wishlist` page showed a struck-through price but no sale badge, unlike every shared product card (`plp-sale-badges`). The wishlist card is rendered by Wishlist King, not `card-product.liquid`, so it never got the badge.

## What Changes

- Each wishlist-page card shows the product card's photo badge: the sale percentage, or "sold out" when nothing is available, in the same spot and style as the PLP card.
- The percentage uses the PLP rule (rounded down, full-price variants count as 0, "up to" when the scope's percentages differ), but its scope is what the wishlist card shows: the variant WK has resolved, otherwise the available variants matching the options chosen so far.
- Rail chip changes, the themed remove button and add-to-cart are queued behind WK's own save cycle, which silently drops anything that arrives mid-save. The last chip clicked wins; add-to-cart waits behind a spinner and posts the final variant.
- The current sale amount takes the PLP card's accent treatment, and the compare-at amount loses its trailing ISO code too (the existing currency-strip requirement only covered the current amount).

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `wishlist-integration`: adds requirements for the standalone page's photo badge and for never dropping a shopper's option change.

## Impact

- `assets/ob-wishlist-page-rails.js` — badge sync in the existing per-card pass, reusing its cached product JSON.
- `assets/component-ob-wishlist.css` — badge and sale-price styles, scoped to `#MainContent > wishlist-page`.
- `assets/ob-wishlist.js` — currency strip also covers `.wk-compare-price` (both wishlist surfaces); the remove button waits for the page's queue when there is one.
- `layout/theme.liquid` — translated badge labels and colour-scheme classes for the page.
