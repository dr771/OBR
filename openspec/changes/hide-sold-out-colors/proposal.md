## Why

The OB team (Asana 1220572955571949, Cindy) sees colors with zero stock in every size still offered as swatches: on the RH+ Helmet Bike Z Zero the Lime chip opens a page where every size reads "Uitverkocht". `plp-hide-sold-out` only removes products whose *every* variant is sold out; on pre-live 347 of 966 buyable products carry at least one fully sold-out color (845 of 2,723 colors), so shoppers hit dead ends constantly, especially in Solden.

## What Changes

- A color with no available variant in any size is no longer offered on the PLP product card's chip rail, the PDP color rail, or the wishlist surfaces' colour controls (favorites-page chips, cart cross-sell dropdown).
- The color a surface is currently on stays visible even when sold out (a PDP opened through `?variant=` from a wishlist, cart, redirect or search engine; a card narrowed to a sold-out variant by a filter; a saved wishlist entry), so the selected state never points at a missing chip.
- A product with no available variant at all keeps every color, unchanged: there is nothing to steer the shopper toward, and such a product is only reachable by URL or a wishlist.
- "Only one color left" follows the existing single-color rules: the card renders no chip row and the PDP renders no color fieldset when one color remains offered.
- One shared snippet decides which colors are offered, so all three surfaces agree.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `plp-card-swatches`: the card chip rail omits fully sold-out colors.
- `pdp-option-rails`: the PDP color rail omits fully sold-out colors; the single-color exception counts offered colors.
- `wishlist-integration`: the favorites-page chips and cross-sell colour dropdown omit fully sold-out colors other than the entry's own.

## Impact

- `snippets/ob-offered-colors.liquid` (new), `snippets/ob-card-swatches.liquid`, `snippets/product-variant-picker.liquid`, `snippets/product-variant-options.liquid`, `snippets/ob-wishlist-item.liquid`.
- No JS changes expected: Dawn re-renders the PDP picker from the server on every option change, card and wishlist JS read the chips that are rendered.
- No shop-side dependency: availability comes from Shopify inventory (correct as long as variants are tracked, see NICK.md #17).
