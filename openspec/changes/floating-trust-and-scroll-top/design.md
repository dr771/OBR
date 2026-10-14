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
- **Right-hand stack, badge above arrow, right edges aligned.** Opposite corners (badge left) were the first choice, but the owner found that the badge covered the page content's left edge (2026-10-14), so it went back to the old shop's right-hand stack. The widget can't be moved horizontally from CSS, so the arrow follows it instead: `right: 2rem` on desktop and `1rem` up to 648px, matching the widget's 20px/10px. Offsets put the badge 15px above the arrow's top edge: desktop 54px default + 20 = 74px; mobile 10px default + 64 = 74px, and + 142 = 152px on product/cart, where the arrow is lifted to 9.3rem. The trade-off is hand-tuned offsets: if the arrow or the widget's defaults change size, re-measure them.
- **648px is the widget's breakpoint, not ours.** Its mobile layout is `matchMedia('(max-width: 648px)')`; the bars switch at 749px. Between them the badge is in its desktop layout while the bar is fixed and the arrow is lifted, so the badge is hidden there on PDP / stuck cart dock.
- **Mobile badge waits for a reveal point** set by `ob-scroll-top.js` as `html.ob-trustbadge-reveal`: home once `.ob-home-marquee`'s bottom is above the viewport, elsewhere once `footer.footer`'s top is within 1.5 viewport heights. It is computed in the arrow's existing rAF-throttled scroll handler, no extra listener. The badge also stays hidden while the arrow is (`body:has(.ob-scroll-top[hidden])`), so it never floats without the arrow under it; on a page too short to reveal the arrow it does not show at all. On mobile the arrow is centred under the 68px badge (`right: 2.2rem`). The widget's `data-mobile-enable-fadeout` does the opposite (hides on scroll down, shows only within 10px of the top), so it is off.
- **Tame the widget's z-index from our CSS**: `[id^="trustbadge-container-"] { z-index: 8 !important }`. The id prefix is the only stable hook, because the inner classes are hashed. z 8 puts the badge under the bars (9), header (10) and drawers, so overlays cover it without any JS. It is also hidden via the same `body:has(...)` overlay selector as the arrow, as a second guard for overlays that don't span the corner.
- **Mobile lift for the badge via `data-mobile-y-offset` chosen in Liquid per template** (`product`, `cart`). The inner fixed element can't be targeted reliably from CSS. Trade-off: the offset applies on the cart page even when the dock isn't stuck, leaving a gap above the arrow there. `env(safe-area-inset-bottom)` is 0 in this theme (no `viewport-fit=cover`), so the offset needs no safe-area term.
- **Arrow lift via CSS `body:has()`**, mirroring the existing PDP-bar overlay rule. No JS measurement of bar heights.
- **Arrow visibility via a passive scroll listener with rAF throttle** toggling `hidden`. One listener and trivial work; an IntersectionObserver sentinel would need an extra layout element in `theme.liquid`.
- **Own CSS file `component-ob-scroll-top.css`** loaded in `theme.liquid`, containing both the arrow styles and the trustbadge z-index/hide rules. They are one capability.

## Risks / Trade-offs

- [TS changes the container id scheme] → the z-index override silently stops and the badge floats over drawers. Recorded in GOTCHAS.md; the `body:has` hide rule shares the same hook, so re-verify after TS widget updates.
- [Third-party script cost] → loaded `async` at the end of `<body>`; not rendered in the theme editor.
- [Cookie/consent] → the trustbadge sets no marketing cookies per TS, same as on the old shop. Revisit with the app at migration.

## Migration Plan

Push 5 theme files with `--only`. Rollback: remove the two `render` lines from `theme.liquid`. At live migration, see the MIGRATION-TO-LIVE.md line: install the TS app, drop `ob-trustbadge`.
