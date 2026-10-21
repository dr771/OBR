## Why

Wishlist King can only store a whole variant (colour and size), never a colour alone. Its PLP/search card heart saved the product without any variant, so the wishlist opened on the product's first colour with no size, whatever colour the card showed. On the wishlist page, picking a colour without a size changed nothing visible: WK swaps photo, price and add-to-cart only for a resolved variant. Shoppers who had not thought about size yet saw their colour choice ignored.

## What Changes

- The card heart adds through WK's API with the shown colour's first available size (storefront size order) instead of WK's variant-less add. Removing through a filled heart stays WK's own.
- On the wishlist page, picking a colour on an item without a chosen size also picks that colour's first available size, so photo, price, badge and add-to-cart follow at once.
- The wishlist page's size grid renders in the PDP's size order.
- The PDP size order (and its JS twin) recognises Akeneo's long letter forms `XXXS`, `XXXL`, `XXXXL` as `3XS`, `3XL`, `4XL`; Juicy Couture's sizes used to land unsorted at the end.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `wishlist-integration`: card-heart saves a variant; colour pick fills a missing size; ordered size grid.
- `pdp-size-picker-order`: long letter-size forms are recognised.

## Impact

- `assets/ob-wishlist.js`: `obSortSizeValues`, `obWishlistStartVariant`, card-heart add intercept.
- `assets/ob-wishlist-page-rails.js`: ordered size grid, missing-size fill on colour pick.
- `snippets/ob-option-value-order.liquid`: long-form aliases.
