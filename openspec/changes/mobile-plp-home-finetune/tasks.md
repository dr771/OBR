## 1. Mobile filter bar

- [x] 1.1 Replace the `type` bar kind with `gender` (`custom.genderid`), heading from the filter's own label, in `snippets/ob-mobile-filter-bar.liquid`.
- [x] 1.2 Move `product_type` to the unrendered-filter path in both the bar's hidden-input passthrough and `snippets/facets.liquid`'s mobile pill exclusion list.
- [x] 1.3 Visible "Sorteer op" label over an invisible native select; caret inset to match the toggle icon; "Verfijn op" on the same typography; panel rows aligned to the page gutter.

## 2. Homepage occasion cards

- [x] 2.1 Below 750px, show the description statically (no max-height/opacity reveal).

## 3. Verification

- [x] 3.1 Live at 390px on `/collections/all`: Gender/Maat/Kleur rows, headings and first boxes on the 15px grid gutter, a Gender tap filters via AJAX, a sort change submits `sort_by`.
- [x] 3.2 Live: `?filter.p.product_type=Shoe` keeps a removable mobile pill and survives a Gender change.
- [x] 3.3 Live at 390px on `/`: all three descriptions visible at rest.
