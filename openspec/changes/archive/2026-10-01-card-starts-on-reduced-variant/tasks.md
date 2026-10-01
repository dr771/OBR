## 1. Card variant

- [x] 1.1 Resolve the card variant in `snippets/card-product.liquid` (filter-narrowed → first available reduced → first available) and use it for the card image and product links
- [x] 1.2 Drive both sale-badge branches and their `aria-labelledby` from the card variant; render the badge hidden when another colour is reduced

## 2. Swatch row

- [x] 2.1 `snippets/ob-card-swatches.liquid`: active chip and default second shot from the card variant; per-colour reduced variant id and `data-ob-sale-label`
- [x] 2.2 `assets/ob-card-swatches.js`: badge follows the selected chip
- [x] 2.3 `assets/component-ob-swatches.css`: hidden sale badge stays hidden

## 3. Ship and verify

- [x] 3.1 `shopify theme check` on the touched Liquid, push to theme 148245381229
- [x] 3.2 Live-verify Solden and a regular collection: image, active chip, link, badge, chip switching, colour-filtered listing, a product with no reduction

## 4. Size-filter link

- [x] 4.1 Card and chips link to the shown colour in the filtered size (`available_erp_sizes`), replacing an existing `variant` parameter in place
