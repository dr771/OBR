## 1. Liquid ordering

- [x] 1.1 Rewrite `snippets/ob-option-value-order.liquid` to rank every size option by fixed-width sort keys (letters, numbers of any magnitude and decimals, ranges, unknown values in source order); non-size options keep source order
- [x] 1.2 Pass the option kind from `snippets/product-variant-options.liquid` instead of the size family, and update both snippets' doc comments
- [x] 1.3 Run `shopify theme check` and confirm no new findings in the touched snippets

## 2. JS twin

- [x] 2.1 Apply the same ranking in `sortSizeValues` in `assets/ob-size-memory.js`

## 3. Verify and ship

- [x] 3.1 Push to DEV via `scripts/theme-push.sh --dev` and verify a letter, a numeric and (if present) a range product on DEV's storefront
- [x] 3.2 Commit, push the same files to pre-live and verify the Odlo Gloves Active Warm Kids Eco PDP renders `XXS XS S M L XL`, plus one product each for socks ranges, kids sizes and half shoe sizes
