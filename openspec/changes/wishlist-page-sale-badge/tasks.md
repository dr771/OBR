## 1. Badge

- [x] 1.1 Compute the badge state per card in `assets/ob-wishlist-page-rails.js` from the cached `/products/<handle>.js` (resolved WK variant first, chosen-options scope otherwise, placeholder values ignored)
- [x] 1.2 Render the badge inside `.wk-image-link`, rewriting it only when its state changes; re-sync on option `change` and on WK's price-text mutations
- [x] 1.3 Expose translated labels and badge colour-scheme classes from `layout/theme.liquid` on `/apps/wishlist` only
- [x] 1.4 Style badge and sale price in `assets/component-ob-wishlist.css` like the PLP card

## 2. Price

- [x] 2.1 Strip the trailing ISO code from `.wk-compare-price` as well

## 3. Verify

- [x] 3.1 Live: reduced resolved variant, item saved without a variant (colour range), full-price product, full-price size of a reduced colour, colour switches
