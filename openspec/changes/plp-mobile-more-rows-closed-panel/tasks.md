## 1. Theme code

- [x] 1.1 Add `category` and `activity` kinds to the row loop in `snippets/ob-mobile-filter-bar.liquid` (Gender, Merk, Category, Activities, Maat, Kleur), heading from `filter.label`
- [x] 1.2 Add both kinds to the pass-through rule and to the mobile pill exclusion in `snippets/facets.liquid`
- [x] 1.3 Render the panel closed (`hidden`, `aria-expanded="false"`); remove the inline localStorage script and the storage write in `assets/ob-plp.js`, clear the old key
- [x] 1.4 Active-filter count in the toggle as a `.js-filter` span
- [x] 1.5 Style `.ob-mobile-bar__row--category` / `--activity` at the compact height, labels on one line

## 2. Verify and ship

- [x] 2.1 Run `shopify theme check`, grep for the touched files
- [ ] 2.2 Push to DEV, verify at phone width: panel closed on load and after navigation, opens on the toggle and stays open while filtering, Category and Activities rows on a mixed collection, native parameters via AJAX, count on the toggle appears/updates/disappears, search results
- [ ] 2.3 Commit and push to git
- [ ] 2.4 Push the same files to pre-live theme `209721262417` and verify on a pre-live collection
