## Why

Owner report (2026-11-07): adding a wishlist item to the cart from the favorites page left it on the wishlist, while the cart cross-sell moves it out. Both surfaces should behave the same: an item bought is no longer a wish.

## What Changes

- Add-to-cart on the favorites page becomes a move-to-cart: the entry leaves the wishlist after a successful add, and its card fades out while the request runs. A rejected add keeps the entry.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `wishlist-integration`: the favorites page requirement states the move-to-cart.

## Impact

- `assets/ob-wishlist-items.js` (one code path for both surfaces), `assets/component-ob-wishlist-native.css` (fade on both layouts). The `remove_from_wishlist` event now also follows a favorites-page add.
