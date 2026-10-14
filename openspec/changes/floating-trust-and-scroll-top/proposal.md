## Why

The old Drupal shop showed a Trusted Shops trustbadge (4.49★ from ~2400 reviews) and a back-to-top button. Both are missing from the new theme (open items in TODO.md). The new theme already has fixed bottom chrome on mobile: the PDP purchase bar and the cart CTA dock. Two more floating elements must not cover those bars, each other, or any overlay.

## What Changes

- Add the Trusted Shops trustbadge site-wide as a theme script snippet with the existing shop TSID, placed bottom-left on mobile and at the right edge above the scroll-to-top button on desktop.
- Add a scroll-to-top button site-wide in the bottom-right corner. It is shown only after the shopper has scrolled.
- On viewports where a fixed purchase or checkout bar is shown, lift both elements above it.
- Keep both from floating over the cart drawer, mobile menu and predictive search.
- At live migration, the official Trusted Shops Shopify app replaces the theme snippet, so that review invites flow from Shopify orders. This is recorded in MIGRATION-TO-LIVE.md.

## Capabilities

### New Capabilities
- `floating-trust-and-scroll-top`: The site-wide floating trustbadge and scroll-to-top button. Covers their corner placement, how they coexist with the fixed mobile bars and overlays, and how the button behaves.

### Modified Capabilities
<!-- none: pdp-mobile-purchase-bar's requirements still hold unchanged -->

## Impact

- `layout/theme.liquid`: renders the two new snippets and loads their CSS/JS.
- New files: `snippets/ob-trustbadge.liquid`, `snippets/ob-scroll-top.liquid`, `assets/ob-scroll-top.js`, `assets/component-ob-scroll-top.css`.
- New third-party script: `widgets.trustedshops.com`.
- Shop-side dependency: the Trusted Shops account and TSID, and later the TS Shopify app. Goes in MIGRATION-TO-LIVE.md.
