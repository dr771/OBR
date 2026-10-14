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
- **Right-hand stack, badge above arrow, right edges aligned.** Opposite corners (badge left) were the first choice, but the owner found that the badge covered the page content's left edge (2026-10-14), so it went back to the old shop's right-hand stack. The widget can't be moved horizontally from CSS, so the arrow follows it instead: `right: 2rem` on desktop and `1rem` up to 648px, matching the widget's 20px/10px. Offsets put the badge 15px above the arrow's top edge: desktop 54px default + 20 = 74px; mobile 10px default + 64 = 74px, and + 142 = 152px on product/cart, where the arrow is lifted to 9.3rem. Those `data-*` offsets are now only the fallback: `component-ob-scroll-top.css` sets the badge's bottom to `var(--ob-scroll-top-bottom) + 4.4rem + 1.5rem` through its fixed box (`:has(> [id^='minimized-trustbadge-'])`), so the badge follows the arrow, including the safe-area inset Android Chrome reports while its toolbar is hidden, and the cart page's not-stuck dock.
- **648px is the widget's breakpoint, not ours.** Its mobile layout is `matchMedia('(max-width: 648px)')`; the bars switch at 749px. Because the badge's bottom follows `--ob-scroll-top-bottom`, it clears the lifted arrow between the two as well.
- **Compact badge at every width, copied at runtime** (owner, 2026-10-14). The widget has no attribute for it: `data-desktop-enable-custom` needs a custom container and renders no floating badge, and `data-desktop-disable-reviews` drops the rating. The compact look is purely its `(max-width: 648px)` CSS. The widget injects its styles through Aphrodite into `style[data-aphrodite]` via CSSOM (no DOM mutation), with hashed single-class selectors. `ob-scroll-top.js` copies the rules of that media block into its own unconditional `<style>`, redone in a rAF after each mutation of the badge container (the rAF runs before paint, so the big badge does not flash). Reading the live sheet survives class-hash changes; if TS drops Aphrodite or the 648px block, the copy is empty and the desktop badge falls back to its full size, still stacked above the arrow. Arrow `right: 2.2rem` centres it under the 68px badge at 10px.
- **Product cards are isolated** (`isolation: isolate` on `.card-wrapper.product-card-wrapper`): Wishlist King sets its card heart to z-index 9, which painted over the badge and arrow (8). Raising the floating chrome would have put it over the purchase bars (9) instead.
- **Mobile badge waits for a reveal point** set by `ob-scroll-top.js` as `html.ob-trustbadge-reveal`: home once `.ob-home-marquee`'s bottom is above the viewport, elsewhere once `footer.footer`'s top is within 1.5 viewport heights. It is computed in the arrow's existing rAF-throttled scroll handler, no extra listener. The badge also stays hidden while the arrow is (`body:has(.ob-scroll-top[hidden])`), so it never floats without the arrow under it; on a page too short to reveal the arrow it does not show at all. On mobile the arrow is centred under the 68px badge (`right: 2.2rem`). The widget's `data-mobile-enable-fadeout` does the opposite (hides on scroll down, shows only within 10px of the top), so it is off.
- **Tame the widget's z-index from our CSS**: `[id^="trustbadge-container-"] { z-index: 8 !important }`. The id prefix is the only stable hook, because the inner classes are hashed. z 8 puts the badge under the bars (9), header (10) and drawers, so overlays cover it without any JS. It is also hidden via the same `body:has(...)` overlay selector as the arrow, as a second guard for overlays that don't span the corner. Every badge hide rule uses `display: none` on the container: the widget's inner buttons set `visibility: visible`, so `visibility: hidden` on the container does not hide them.
- **Mobile lift for the badge via `data-mobile-y-offset` chosen in Liquid per template** (`product`, `cart`), kept as the fallback for the CSS stacking above. `env(safe-area-inset-bottom)` is not reliably 0 without `viewport-fit=cover`: Android Chrome reports it while its toolbar is hidden.
- **Arrow lift via CSS `body:has()`**, mirroring the existing PDP-bar overlay rule. No JS measurement of bar heights.
- **Arrow visibility via a passive scroll listener with rAF throttle** toggling `hidden`. One listener and trivial work; an IntersectionObserver sentinel would need an extra layout element in `theme.liquid`.
- **Own CSS file `component-ob-scroll-top.css`** loaded in `theme.liquid`, containing both the arrow styles and the trustbadge z-index/hide rules. They are one capability.

## Risks / Trade-offs

- [TS changes the container id scheme] → the z-index override silently stops and the badge floats over drawers. Recorded in GOTCHAS.md; the `body:has` hide rule shares the same hook, so re-verify after TS widget updates.
- [Third-party script cost] → loaded `async` at the end of `<body>`; not rendered in the theme editor.
- [Cookie/consent] → the trustbadge sets no marketing cookies per TS, same as on the old shop. Revisit with the app at migration.

## Migration Plan

Push 5 theme files with `--only`. Rollback: remove the two `render` lines from `theme.liquid`. At live migration, see the MIGRATION-TO-LIVE.md line: install the TS app, drop `ob-trustbadge`.
