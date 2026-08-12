## Why

The legacy Drupal-ish site already shows a wishlist icon, which the playbook's reuse ledger treats as validated demand, not a guess. SweatyBetty already shipped a complete Wishlist King (Swish) integration on the same Dawn/Akeneo stack — header entry point, PDP toggle, cart cross-sell — and the app itself (Swish) is confirmed installed on this shop's `appInstallations`. Porting it now gives OB the same customer-facing wishlist capability the old site had, on infrastructure that's already proven to work around WK's known bugs (the Akeneo-bracket-key option-parsing crash) and its lazy-init loading strategy.

## What Changes

- Add a header wishlist heart with a live count badge, styled like Dawn's existing `header__icon` controls, between the account and cart icons.
- Add a PDP wishlist toggle beside the add-to-cart button in `buy-buttons.liquid`, reactive to WK's per-product saved state (store runs WK in PRODUCT mode).
- Add a cart drawer + `/cart` page wishlist cross-sell section (compact mini-cards: thumbnail, title/price, option dropdowns, move-to-cart CTA) styled to match OB's already-shipped `cart-drawer-line-item-layout` cart drawer, not SB's.
- Runtime-patch WK's `getInputOption`/`getFormOptions` so Akeneo bracket-key option names (`options[[color]]`) parse correctly instead of throwing on every swatch click on `/apps/wishlist`.
- Overlay WK's raw-Akeneo-key option labels and CTA text on `/apps/wishlist` with display labels, reusing the same color/size kind detection `ob-option-meta` already provides (not a reimplementation).
- All of the above fail open: if WK is absent, not yet booted (post-LCP lazy-init), or its internals are reshaped in a future version, every surface degrades to its pre-boot/no-op state with no console errors and no interference with WK's own loading strategy.

## Capabilities

### New Capabilities
- `wishlist-integration`: every storefront touchpoint for Wishlist King on OB — header heart/badge, PDP toggle, cart drawer/`/cart` cross-sell, the Akeneo bracket-key option-parser patch, the wishlist-page label overlay, and the shared WK-readiness/fail-open discipline all of it runs under.

### Modified Capabilities
(none — this only adds new surfaces; it does not change any documented requirement of `akeneo-option-handling`, `cart-drawer-line-item-layout`, or `pdp-color-swatches`, all of which it reads from via `ob-option-meta` / existing markup without altering their behavior)

## Impact

- New: `assets/ob-wishlist.js` (WK-ready helper, option-parser patch, label overlay, header badge, PDP heart, drawer/cart move-to-cart intercept — one file, mirroring the `ob-card-swatches.js` / `ob-plp.js` per-capability convention rather than SB's monolithic `custom-theme.js`), `snippets/ob-wishlist-cross-sell.liquid`, `sections/ob-cart-wishlist.liquid`.
- Edited: `sections/header.liquid` (heart icon + badge markup), `snippets/buy-buttons.liquid` (PDP toggle), `snippets/cart-drawer.liquid` (cross-sell render call, filled + empty branches), `layout/theme.liquid` (site-wide script load), `assets/component-cart-drawer.css` (cross-sell styling — OB's established "no `custom.css`" pattern), `templates/cart.json` (wire in the new section), `locales/en.default.json` + `locales/nl.json`.
- Shop-side dependency already logged in `MIGRATION-TO-LIVE.md`: WK's theme app embeds must be enabled in the theme editor for the live experience to show real data (code itself doesn't require it to be correct/fail-open).
- No product/Akeneo data impact — this is theme-side only, consuming WK's public JS API (`window.WishlistKing`) at runtime.
