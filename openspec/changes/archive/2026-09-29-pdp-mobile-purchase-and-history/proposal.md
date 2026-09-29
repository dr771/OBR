## Why

The PDP leaves avoidable space above its mobile back link, loses the purchase controls as shoppers scroll, and has no way to return to recently viewed products. The mobile purchase control must keep Dawn's variant and cart behavior and the existing Wishlist King toggle.

## What Changes

- Tighten the mobile back-link spacing.
- Pin the existing add-to-cart and wishlist row to the bottom of the mobile viewport, with room for the safe area and cart/menu overlays.
- Show previously visited products after related products on desktop and mobile, using the shared storefront product card.

## Capabilities

### New Capabilities

- `pdp-mobile-purchase-bar`: the PDP buy controls remain usable while scrolling on mobile.
- `pdp-recently-viewed`: cross-page product history renders in the PDP card system.

### Modified Capabilities

_None._ The existing PDP layout, wishlist, and related-products contracts remain intact.

## Impact

- `sections/main-product.liquid`, `assets/component-ob-pdp.css`: mobile spacing and purchase row.
- `sections/ob-recently-viewed.liquid`, `assets/ob-recently-viewed.js`, `assets/section-ob-recently-viewed.css`, `templates/product.json`: history section.
- `locales/nl.json`, `locales/en.default.json`: section heading.
