## Why

The active storefront mixes a 1600px theme container with narrower or differently inset PDP and PLP shells, so product and filter content do not align with the header logo. The owner has superseded the earlier Bolt-derived 1280px/24px decisions after reviewing the 1600px PDP directly.

## What Changes

- Make the PDP follow the active theme's configured page width instead of an independent 1280px cap.
- Keep the full PDP gallery chain and the vertical-filter PLP aligned to the header's 50px inner edge.
- Make the PDP's admin Media width setting control the custom grid: Small 40/60, Medium 50/50, and Large 60/40.
- Let the admin Original/Fill setting own the main image's `object-fit` behavior.
- Align the standalone Swish wishlist page's desktop cards and controls with the header logo while retaining its 1600px app setting.
- Keep the existing narrower PDP inset below the desktop breakpoint.
- Push and verify the change directly on active theme `148245381229`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `pdp-layout-chrome`: PDP shell width and desktop inset now follow the active 1600px theme container and header edge; the admin Media width setting controls the desktop column ratio.
- `plp-grid-config`: Desktop PLP outer inset changes from 24px to 50px so the filter starts at the logo edge.
- `wishlist-integration`: The standalone wishlist page uses the header's 50px desktop content edge instead of Swish's fixed 16px inner padding.

## Impact

Affected code is limited to the PDP/PLP geometry assets plus a dedicated standalone-wishlist stylesheet loaded by `layout/theme.liquid`. Mobile behavior, wishlist cart/drawer cross-sells, and product-card gaps remain unchanged. The PDP desktop column split follows the section's existing Media width setting.
