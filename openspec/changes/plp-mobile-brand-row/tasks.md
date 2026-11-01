## 1. Theme code

- [x] 1.1 Add the `brand` kind to the row loop in `snippets/ob-mobile-filter-bar.liquid` (Gender, Merk, Maat, Kleur), heading from `filter.label`
- [x] 1.2 Base the row and its hidden pass-through on "known kind, and `values.size > 1` or an active value"
- [x] 1.3 Apply the same rule to the mobile pill exclusion in `snippets/facets.liquid`
- [x] 1.4 Style `.ob-mobile-bar__row--brand` in `assets/component-facets.css` at the compact Gender height, labels on one line

## 2. Verify and ship

- [x] 2.1 Run `shopify theme check`, grep for the touched files
- [x] 2.2 Push to DEV, verify at phone width: row on a mixed collection, absent on a brand collection, native parameter via AJAX, row with an active sole value stays with no pill, search results
- [x] 2.3 Commit and push to git
- [x] 2.4 Push the same files to pre-live and compare them against the commit (no catalog there yet)
