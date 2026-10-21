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

- [x] 4.2 PDP opens on the remembered size (`ob-size-memory.js`), size helpers moved there from `ob-wishlist.js`

## 5. Verify

- [x] 5.1 Live: Juicy PDP sizes `XXS … XXL XXXL XXXXL`; wishlist placeholder entry → Bright Pink picks XXS, photo/price/CTA follow; search-card heart on Sugar Swizzle saved Sugar Swizzle / L (middle) without memory; filled heart still removes; after a real PDP click on M: trousers M, hoodie M, shoes still 39 / 43 (middle); wishlist size keypress remembered
- [x] 5.2 Live: with M remembered for `bottoms_size`, trousers PDP linked to Bright Pink/XXXXL opens Bright Pink/M (URL and cart id follow); hoodie opens M; Lulu keeps 35
- [x] 5.3 PDP order/median/filter/cart rules (isolated browser context, empty memory): jeans `W25…W34` opens W28; trackpant linked to XXL opens L; Lulu opens 39; listing filtered to M opens M with L remembered; kept cart/wishlist variant unchanged; no focus ring; memory stays empty after preselects
