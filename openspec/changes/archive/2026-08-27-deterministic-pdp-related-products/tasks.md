## 1. Deterministic source

- [x] 1.1 Resolve the viewed product's lowest-ranked collection in the related-products section.
- [x] 1.2 Render the selected collection's ordered products while excluding the viewed product and honoring the configured item limit.
- [x] 1.3 Remove the native automatic-recommendation loading path from this section.
- [x] 1.4 Require an exact `custom.genderid` match for every related product.
- [x] 1.5 Fill unoccupied positions from broader ranked collections without duplicate products or gender drift.

## 2. Documentation and delivery

- [x] 2.1 Update the collection-ranking documentation to cover its PDP recommendation use.
- [x] 2.2 Validate the OpenSpec change and Liquid syntax.
- [x] 2.3 Push only the changed section to the active theme and verify deterministic results on representative PDPs.
- [x] 2.4 Push the gender guard to the active theme and verify that mixed-gender collection products are excluded.
- [x] 2.5 Push and verify broader-collection fallback on a PDP whose primary collection has too few same-gender products.
