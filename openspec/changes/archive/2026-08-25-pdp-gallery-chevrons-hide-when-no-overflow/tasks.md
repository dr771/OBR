## 1. CSS

- [x] 1.1 In `assets/component-ob-pdp.css`, add a rule near the existing single-image `.ob-pdp__gallery-nav` hide rule: `.ob-pdp__gallery-chevrons:has(.slider-button--prev[disabled]):has(.slider-button--next[disabled]) { display: none; }`
- [x] 1.2 Add a short comment above it explaining why this is keyed on `disabled` rather than a thumbnail count (breakpoint-dependent 4-up/3-up rail), matching the file's existing comment style.

## 2. Verification

- [x] 2.1 Push the changed CSS file to the dev theme (`shopify theme push --theme=148245381229 --allow-live --only assets/component-ob-pdp.css`) and hard-refresh https://original-brands-dev.myshopify.com/en/products/loewenweiss-hygge-bicolor-slipper (password `original`) at desktop width — confirm the counter still renders ("Afbeelding 1 van 4") but no chevrons appear.
- [x] 2.2 Resize to a mobile width (390px) on the same product and confirm whether the rail overflows there (3-up); if it does, confirm the chevrons appear at that breakpoint per the design's breakpoint-dependent behavior.
- [x] 2.3 Check a product with more images than fit any breakpoint's rail (e.g. 7 images) and confirm chevrons still render and function (advance the rail, respect `data-step="3"`) exactly as before.
- [x] 2.4 Check a single-image product and confirm the whole nav row (counter + chevrons) is still hidden, unchanged from before this change.
