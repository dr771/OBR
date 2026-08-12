## 1. WK foundation (JS)

- [x] 1.1 Create `assets/ob-wishlist.js` with an `obWkReady(cb)` helper (bounded poll ~100ms × 30s for `window.WishlistKing`, multiple consumers, fail-open, never touches WK's own lazy-init stash)
- [x] 1.2 In the same file, add the parser-patch IIFE: patch `getInputOption` + `getFormOptions` on `wk.utils.product` (anchored `/^options\[(.*)\]$/`, delegate-to-original fallback, `__obOptionParseFixed` guard)
- [x] 1.3 Load `ob-wishlist.js` site-wide from `layout/theme.liquid` (deferred script tag, near the existing `cart-drawer.js`/`predictive-search.js` conditional loads)

## 2. Wishlist page labels

- [x] 2.1 Add label-overlay logic to `ob-wishlist.js`: token rewrite (`\[([a-z0-9_]+)\]` → Kleur/Maat/humanized, matching `ob-option-meta`'s color/size detection), MutationObserver on `wishlist-page` / `.ob-wishlist-cross-sell` containers, capitalized standalone vs. lowercase mid-CTA, idempotent

## 3. Header heart

- [x] 3.1 `sections/header.liquid`: heart icon link to `/apps/wishlist`, `header__icon` classes, `wk-skip`, empty badge placeholder (`.cart-count-bubble.ob-wishlist-bubble`, relies on Dawn's `:empty` auto-hide rule), placed between the account icon and the cart icon in `.header__icons`
- [x] 3.2 Badge logic in `ob-wishlist.js`: `wk._state.observeWishlist({wishlistId:'mine'}).subscribe` → set badge count text, hide at 0/pre-boot
- [x] 3.3 Add heart icon sizing + `position: relative` badge anchor to `sections/header.liquid`'s inline `{% style %}` block
- [x] 3.4 Add locale keys for the link's accessible label to `en.default.json` / `nl.json`, matching the nesting style already used by neighboring `accessibility`/`general` keys

## 4. PDP heart

- [x] 4.1 `snippets/buy-buttons.liquid`: `.ob-wishlist-btn` button (empty+filled heart SVGs, `data-product-handle`, aria-label via locale key) after the submit button inside `.product-form__buttons`
- [x] 4.2 PDP-heart logic in `ob-wishlist.js`: `observeProductInfo({productHandle})` subscription toggles a selected class + stores `wishlistItemId` (fresh node query per emit); document-delegated click → add (variant id from closest form's `input[name="id"]`) / remove; re-apply on `<product-info>` DOM changes (MutationObserver or Dawn's `variant-change` pubsub if available — verify which fires reliably on OB)
- [x] 4.3 Style the button in `buy-buttons.liquid`'s scope (square, aligned to `product-form__submit` height, filled state) — inline `{% style %}` matching how this file already scopes its markup, no new CSS file

## 5. Cart drawer + /cart cross-sell

- [x] 5.1 Create `snippets/ob-wishlist-cross-sell.liquid`: title/heading + WK's `<wishlist-page>` element configured compact (`show-product-title`, `show-price`, `cta-button="add-to-cart"`, `product-options="dropdowns"`, `move-to-cart`), accepts a `context` param (`drawer` | `page`)
- [x] 5.2 Render it from `snippets/cart-drawer.liquid` in both the filled-cart body (inside `.js-contents` so it survives Dawn's re-renders) and the empty-cart branch
- [x] 5.3 Create `sections/ob-cart-wishlist.liquid` rendering the same snippet with `context: 'page'`
- [x] 5.4 Pull the live `templates/cart.json`, then wire the new section in between `cart-items` and `cart-footer`
- [x] 5.5 Verify live how WK's add-to-cart CTA behaves in this install (in-drawer vs. navigates to `/cart`, per design.md decision 5) and implement whichever of: (a) subscribe to `wishlist:add-to-cart:success` → trigger OB's existing cart-drawer refresh path, or (b) a capture-phase AJAX intercept matching SB's, based on what's actually observed
- [x] 5.6 Add `.ob-wishlist-cross-sell` styling to `assets/component-cart-drawer.css`: compact horizontal mini-row cards (thumbnail, title/price, option dropdowns, compact CTA) matching OB's shipped drawer tokens/spacing from `cart-drawer-line-item-layout`, `:has()` show-gate so the section is fully absent when empty/pre-boot, drawer + page context variants
- [x] 5.7 Add locale keys for the cross-sell title/heading, matching the placement pattern `cart-drawer-line-item-layout` already used in `en.default.json` / `nl.json`

## 6. Ship & verify

- [x] 6.1 `shopify theme push --only <touched files> --allow-live` to the main Dawn theme (`148245381229`)
- [x] 6.2 Verify fail-open behavior works regardless of WK app-embed state: heart renders and links correctly, no badge, no PDP toggle errors, no cross-sell section, zero console errors
- [x] 6.3 WK app embeds were enabled and saved live mid-session — verified end-to-end: `/apps/wishlist` dropdown option selection resolves correctly with no parse error (product's raw option.name is bracketed per Admin API, but Translate & Adapt currently strips brackets for the NL storefront — see design.md Context); header badge count syncs on add/remove; PDP add/remove toggle confirmed both directions; drawer cross-sell move-to-cart confirmed via live click-through (`POST /cart/add` succeeded, `DELETE .../wishlists/mine/items` succeeded, cart item count went 8→9, no navigation to `/cart`, drawer refreshed in place with the new line item). `wishlist-page`'s own page-level chrome (`.wk-header` — "Mijn favorieten" h1 + login callout) had to be hidden via CSS once discovered live, not assumed from SB. Not independently re-verified: the label-overlay's bracket→"Kleur"/"Maat" rewrite, since the live bracket condition doesn't reproduce under current translation coverage — code path exists and threw no errors, but couldn't be visually confirmed doing something today.
- [x] 6.4 N/A — embeds were enabled this session, so this is live-verified rather than fail-open-only; the MIGRATION-TO-LIVE.md entry remains for the *live* shop launch, where embeds will need enabling again from scratch
