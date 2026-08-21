## 1. Locale keys

- [x] 1.1 Add `products.product.details_heading` to `locales/en.default.json` and `locales/nl.json`
- [x] 1.2 Add `products.product.materials_maintenance_heading` to `locales/en.default.json` and `locales/nl.json`

## 2. PDP markup

- [x] 2.1 Render `product.description` as a `.product__accordion` `<details open>` panel titled via `details_heading`, reusing Dawn's `collapsible_tab` markup shape, omitted when `product.description` is blank
- [x] 2.2 Render `product.metafields.custom.materials_maintenance.value` as a second `.product__accordion` `<details>` panel (closed) titled via `materials_maintenance_heading`, immediately after the description accordion, omitted when the metafield is blank

## 3. Verification

- [x] 3.1 Push `sections/main-product.liquid` + both locale files to theme `148245381229`
- [x] 3.2 Live-verify on a product with both fields populated: description accordion open with content, materials accordion closed with content, styling matches the Bolt reference's accordion stack
- [x] 3.3 Confirm no live sample product currently has a blank `materials_maintenance` value (documented as a known verification gap in design.md, same class as other >N-item PDP/PLP branches)
