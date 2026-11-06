## 1. Gate and setting

- [ ] 1.1 Add theme setting `ob_hide_sold_out` (checkbox, default on) beside the PLP settings in `config/settings_schema.json`
- [ ] 1.2 Create `snippets/ob-in-stock-only.liquid` rendering `true` only when the setting is on, the template is a collection and the collection's filters include `filter.v.availability`

## 2. Collection pages

- [ ] 2.1 `layout/theme.liquid`: early inline redirect on collection templates when the gate is true and availability isn't exactly `1`
- [ ] 2.2 `snippets/facets.liquid`: expose the gate as `data-ob-in-stock-only` and skip the availability filter in every filter loop, including the active-value count
- [ ] 2.3 `assets/facets.js`: normalise availability to `1` in `renderPage` when the gate is on

## 3. Homepage rail

- [ ] 3.1 `sections/featured-collection.liquid`: skip sold-out products with its own counter under the setting, filling up to `products_to_show`

## 4. Verify and document

- [ ] 4.1 `shopify theme check` on the touched Liquid files
- [ ] 4.2 DEV: push, owner enables the Availability filter, verify plain URL, filter/sort/chip/clear-all/back/load-more, mobile and desktop, homepage rail, setting off
- [ ] 4.3 Commit, push to pre-live theme, repeat the verification there
- [ ] 4.4 MIGRATION-TO-LIVE.md (Availability filter + search out-of-stock setting), STATUS-LOG.md, GOTCHAS.md if a trap turned up
