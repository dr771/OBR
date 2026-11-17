## 1. Shared rule

- [x] 1.1 Add `snippets/ob-offered-colors.liquid` (product, color_index, current → `|A|B|` or blank) and list it under the `ob-*` snippets in CLAUDE.md

## 2. Surfaces

- [x] 2.1 `ob-card-swatches`: compute offered colors, count them for the row gate, skip non-offered chips
- [x] 2.2 `product-variant-picker` + `product-variant-options`: compute offered colors for the color option, count them for `ob_hide_single_color_option`, skip non-offered values
- [x] 2.3 `ob-wishlist-item`: same for the favorites chips and the cross-sell colour dropdown

## 3. Verify and ship

- [x] 3.1 `shopify theme check` on the touched files
- [x] 3.2 Push to DEV, verify a product with a fully sold-out color on card, PDP (incl. `?variant=` of the sold-out color, color switch) and favorites page
- [x] 3.3 Commit, push to pre-live, verify on the RH+ Helmet Bike Z Zero (card in Solden, PDP, deep link to Lime)
- [x] 3.4 STATUS-LOG entry; Asana reply draft for Cindy
