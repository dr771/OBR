## 1. Shared helpers

- [x] 1.1 `obSortSizeValues` in `assets/ob-wishlist.js` (JS twin of `ob-option-value-order`, long letter forms aliased)
- [x] 1.2 `obWishlistStartVariant`: colour plus start size (remembered size, else middle available size)
- [x] 1.3 Remember trusted size picks per size key in localStorage (`ob-size-memory`); wishlist size radios carry `data-option-name` like the PDP's

## 2. Card heart

- [x] 2.1 Capture clicks on an empty card heart, add through `addWishlistItem` with the shown chip's start variant; filled hearts and failures stay WK's own

## 3. Wishlist page

- [x] 3.1 Size grid in storefront order
- [x] 3.2 Colour pick on an entry without a size queues the colour's start size and checks its box

## 4. PDP

- [x] 4.1 `ob-option-value-order` aliases `XXXXXXL`…`XXXL`, `XXXS` to the numbered forms

## 5. Verify

- [x] 5.1 Live: Juicy PDP sizes `XXS … XXL XXXL XXXXL`; wishlist placeholder entry → Bright Pink picks XXS, photo/price/CTA follow; search-card heart on Sugar Swizzle saved Sugar Swizzle / L (middle) without memory; filled heart still removes; after a real PDP click on M: trousers M, hoodie M, shoes still 39 / 43 (middle); wishlist size keypress remembered
