## Why

On pre-live the owner reported that colour and size changes on wishlist items do nothing, in the cart drawer, on `/cart` and on `/apps/wishlist`. The parser bug behind the first report is fixed (`d803913`). A second cause remains: Akeneo products often offer colours in only some sizes. Hi-Tec Blackout Mid Wp Jr has Beige, Asphalt and Navy/Fuchsia in size 28 only. The pickers offer every colour and every size regardless, and the spec says a colour pick keeps the chosen size. So picking Beige on an entry in size 37 lands on Beige/37, a combination with no variant. WK then keeps showing the saved variant (photo, price, label, add-to-cart) and saves nothing, and every further size except 28 is just as dead. To the shopper, nothing reacts.

## What Changes

- On both wishlist surfaces (cart drawer / `/cart` cross-sell dropdowns and the `/apps/wishlist` chips), a colour pick that the chosen size doesn't exist in also picks that colour's start size (remembered size, else the middle one, as for a new entry). A size the colour does offer stays, as before.
- On both surfaces, sizes the chosen colour doesn't come in are disabled, in the dropdown and in the size grid, so a dead combination can't be reached from the size side either.
- **BREAKING (spec):** "An already chosen size SHALL NOT be changed by a colour pick" now applies only when the colour offers that size, and the colour-pick rule covers the cross-sell, not only the standalone page.
- Size memory keys compare without their Akeneo brackets (`[shoe_size_eu]` and `shoe_size_eu` are one size system), as already shipped in `afc8815`.

## Capabilities

### New Capabilities

### Modified Capabilities
- `wishlist-integration`: "Wishlist entries start on a whole variant" — a colour pick always lands on an existing variant, on both surfaces, and sizes a colour lacks are unavailable.

## Impact

- `assets/ob-wishlist.js` (shared product cache, missing-size marking, cross-sell colour handling), `assets/ob-wishlist-page-rails.js` (size grid keeps marked sizes as disabled chips, colour pick replaces a size the colour lacks, shares the product cache).
- No data, schema or app changes. WK's own options are untouched apart from the `disabled` flag on size options.
