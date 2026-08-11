## 1. Markup and selection state

- [x] 1.1 Replace navigating swatch anchors with native pressed-state buttons carrying the matched variant ID
- [x] 1.2 Update delegated selection behavior to persist the active chip, update ARIA state, swap the primary image, and retarget the card links

## 2. Color-aware hover pair

- [x] 2.1 Port SB's image-area hover tracking and update an existing hover pair when the selected color changes
- [x] 2.2 Override Dawn's whole-card hover behavior so only image-area hover reveals the pair, without fades
- [x] 2.3 Preserve no-extra-image behavior on touch-only devices and leave merchant secondary images untouched

## 3. Verification and handoff

- [x] 3.1 Validate the OpenSpec change and run Shopify theme checks
- [x] 3.2 Deploy only the changed theme files to main theme `148245381229`
- [x] 3.3 Verify desktop click non-navigation, selected PDP link, pre/post-selection hover pair, focus state, facet-refresh survival, and console output in Chrome DevTools
- [x] 3.4 Verify 390px touch/mobile selection, layout, and absence of a hover-only second image request
- [x] 3.5 Update shared project documentation and stop before archive for user review
