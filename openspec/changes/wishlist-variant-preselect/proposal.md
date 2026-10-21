## Why

Wishlist King can only store a whole variant (colour and size), never a colour alone. Its PLP/search card heart saved the product without any variant, so the wishlist opened on the product's first colour with no size, whatever colour the card showed. On the wishlist page, picking a colour without a size changed nothing visible: WK swaps photo, price and add-to-cart only for a resolved variant. Shoppers who had not thought about size yet saw their colour choice ignored.

## What Changes

- The card heart adds through WK's API with the shown colour and a start size: the shopper's last chosen size for that size system (letter sizes also across systems), else the middle available size instead of WK's variant-less add. Removing through a filled heart stays WK's own.
- On the wishlist page, picking a colour on an item without a chosen size also picks that colour's start size, so photo, price, badge and add-to-cart follow at once.
- The PDP opens on the remembered size when its colour offers it; otherwise its start variant is unchanged.
- The wishlist page's size grid renders in the PDP's size order.
- The PDP size order (and its JS twin) recognises Akeneo's long letter forms `XXXS`, `XXXL`, `XXXXL` as `3XS`, `3XL`, `4XL`; Juicy Couture's sizes used to land unsorted at the end.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `wishlist-integration`: card-heart saves a variant; colour pick fills a missing size; ordered size grid.
- `pdp-size-picker-order`: long letter-size forms are recognised.

## Impact

- `assets/ob-size-memory.js` (new, every page): size ordering, size memory, PDP preselect.
- `assets/ob-wishlist.js`: `obWishlistStartVariant`, card-heart add intercept.
- `layout/theme.liquid`: loads `ob-size-memory.js` before `ob-wishlist.js`.
- `assets/ob-wishlist-page-rails.js`: ordered size grid, missing-size fill on colour pick.
- `snippets/ob-option-value-order.liquid`: long-form aliases.
