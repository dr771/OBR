## 1. Matching

- [x] 1.1 Add optional `color` argument to `snippets/ob-media-color-code.liquid`: echo it when the filename carries `_{color}__` (case-insensitive), else the parsed code
- [x] 1.2 Pass `color: ob_current_color` to every `ob-media-color-code` call in `product-media-gallery.liquid` and `product-media-modal.liquid`

## 2. Fail-open

- [x] 2.1 In `product-media-gallery.liquid`, count matching media first and turn the color filter off when the count is 0, before single-media/`hide_variants` state is derived
- [x] 2.2 Apply the same zero-match guard in `product-media-modal.liquid`

## 3. Verify and ship

- [x] 3.1 `shopify theme check` clean for the touched snippets
- [x] 3.2 Push to DEV and check a color-switching product (gallery filters per color, counter correct)
- [ ] 3.3 Commit, push to pre-live, verify Mechanix Specialty Vent Covert (3 images), a multi-color product, and Holster Solace NATM (fail-open)
