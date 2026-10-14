## Context

See proposal.md for motivation. Constraints found while probing the live widget on the dev storefront (2026-10-05):

- The Trusted Shops script (`widgets.trustedshops.com/js/<TSID>.js`) renders on the `myshopify.com` domain. It appends `div#trustbadge-container-<hash>` to `<body>` in light DOM, with inline `position: fixed; z-index: 2147483647`. The visible badge is a nested fixed element with hashed class names.
- Position and offsets are controlled by `data-*` attributes on the script tag (`data-desktop-position`, `data-mobile-position`, `data-desktop-y-offset`, `data-mobile-y-offset`, `data-mobile-enable-fadeout`).
- Existing fixed bottom chrome: the PDP purchase bar (`component-ob-pdp.css`, z 9, mobile only) and the cart CTA dock (`component-ob-cart-page.css`, z 9, only when `.is-stuck`). Header is z 10, drawers 1000+.

## Goals / Non-Goals

**Goals:** both elements site-wide, no overlap with each other, the fixed bars or overlays; no change to existing bar/drawer code.

**Non-Goals:** review invites / buyer-protection checkout integration (official TS app, at live migration); restyling the badge itself; theme-editor settings for either element.

## Decisions

- **Script snippet with data attributes, not the legacy `_tsConfig` global.** Same widget URL. The attributes are the currently documented embed and expose left/right position per device. Alternative: the TS Shopify app. The owner deferred it to live migration.
- **Desktop: right-hand stack (badge above arrow); mobile: opposite corners (badge left, arrow right).** Opposite corners were the first choice everywhere, but the owner found that on desktop the 93×171px badge covered the page content's left edge (2026-10-14), so desktop went back to the old shop's right-hand stack. With `data-desktop-y-offset="20"` the widget's default bottom of 54px becomes 74px, 15px above the arrow's top edge (1.5rem + 4.4rem). The trade-off is the hand-tuned offset: if the arrow or the widget's default bottom changes size, re-measure it. Mobile stays in opposite corners, because there the mobile y-offset already has to clear the purchase bars.
- **Tame the widget's z-index from our CSS**: `[id^="trustbadge-container-"] { z-index: 8 !important }`. The id prefix is the only stable hook, because the inner classes are hashed. z 8 puts the badge under the bars (9), header (10) and drawers, so overlays cover it without any JS. It is also hidden via the same `body:has(...)` overlay selector as the arrow, as a second guard for overlays that don't span the corner.
- **Mobile lift for the badge via `data-mobile-y-offset` chosen in Liquid per template** (`product`, `cart`). The inner fixed element can't be targeted reliably from CSS. Trade-off: the offset can't include `env(safe-area-inset-bottom)` and applies on the cart page even when the dock isn't stuck. Mobile fadeout-on-scroll is enabled, which further limits the time the badge is on screen.
- **Arrow lift via CSS `body:has()`**, mirroring the existing PDP-bar overlay rule. No JS measurement of bar heights.
- **Arrow visibility via a passive scroll listener with rAF throttle** toggling `hidden`. One listener and trivial work; an IntersectionObserver sentinel would need an extra layout element in `theme.liquid`.
- **Own CSS file `component-ob-scroll-top.css`** loaded in `theme.liquid`, containing both the arrow styles and the trustbadge z-index/hide rules. They are one capability.

## Risks / Trade-offs

- [TS changes the container id scheme] → the z-index override silently stops and the badge floats over drawers. Recorded in GOTCHAS.md; the `body:has` hide rule shares the same hook, so re-verify after TS widget updates.
- [Third-party script cost] → loaded `async` at the end of `<body>`; not rendered in the theme editor.
- [Cookie/consent] → the trustbadge sets no marketing cookies per TS, same as on the old shop. Revisit with the app at migration.

## Migration Plan

Push 5 theme files with `--only`. Rollback: remove the two `render` lines from `theme.liquid`. At live migration, see the MIGRATION-TO-LIVE.md line: install the TS app, drop `ob-trustbadge`.
