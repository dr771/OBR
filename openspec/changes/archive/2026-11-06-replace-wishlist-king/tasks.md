## 1. Shared groundwork

- [x] 1.1 Move `obWishlistStartVariant` from `assets/ob-wishlist.js` into `assets/ob-size-memory.js` (WK path keeps working through the global)
- [x] 1.2 Add theme setting `ob_wishlist_native` (default off) to `config/settings_schema.json`
- [x] 1.3 Add locale keys (favorites page empty state, loading, rail labels) to `locales/nl.json` and `locales/en.default.json`

## 2. Storage API and header badge

- [x] 2.1 `assets/ob-wishlist-store.js`: `window.obWishlist` (items/has/get/add/update/remove/subscribe), try/catch storage, cross-tab `storage` event
- [x] 2.2 Header badge from the store; header heart links to `/pages/favorieten` when the switch is on
- [x] 2.3 `layout/theme.liquid`: load native assets when on, WK assets (`ob-wishlist.js`, page rails) only when off; `ob-wishlist-native` body class

## 3. Card heart and PDP button

- [x] 3.1 Native heart button in `snippets/card-product.liquid` (switch on only, `wk-skip`), styled like the WK heart; hide WK's floating heart while on
- [x] 3.2 Heart click: add with the card's active colour + start variant (fallback: entry without variant), filled heart removes; state sync on load, store change, grid re-render
- [x] 3.3 PDP `.ob-wishlist-btn` toggles the selected variant through the store; state survives variant re-render

## 4. Item section and favorites page

- [x] 4.1 `snippets/ob-wishlist-item.liquid` (layouts `card` / `compact`) + `sections/ob-wishlist-item.liquid` + `sections/ob-wishlist-item-compact.liquid`, variant JSON embedded
- [x] 4.2 `assets/ob-wishlist-items.js`: `<ob-wishlist-item>` (colour/size rule, disabled missing sizes, photo/price/badge/link/CTA, store update) and `<ob-wishlist-list>` (parallel fetch, cache, reconcile, drop 404s, placeholders, empty state)
- [x] 4.3 `sections/ob-wishlist-page.liquid` + `templates/page.favorieten.json`; styles in `assets/component-ob-wishlist-native.css`
- [x] 4.4 Add-to-cart via `/cart/add.js` + drawer `renderContents`; remove control

## 5. Cart cross-sell

- [x] 5.1 `snippets/ob-wishlist-cross-sell.liquid`: native list (compact) when on, WK markup when off; hidden while empty
- [x] 5.2 Compact row styling matching the drawer line items; move-to-cart removes the entry; works after drawer re-render; `/cart` page section

## 6. Verification on DEV

- [x] 6.1 Create page "Favorieten" (template `favorieten`) on DEV; switch on and WK embeds off in DEV's theme editor
- [x] 6.2 Run the checklist in `WISHLIST-CUSTOM.md` on mobile (390px) and desktop; `shopify theme check` for the touched Liquid files
- [x] 6.3 Switch off: WK surfaces behave as before (checked on pre-live, where the switch is off and WK is live)

## 7. Ship switched off, docs

- [x] 7.1 Commit; push the same files to pre-live (switch off), verify nothing changed there
- [x] 7.2 MIGRATION-TO-LIVE.md shop-side items; STATUS-LOG.md; GOTCHAS.md findings; CLAUDE.md asset notes; WISHLIST-CUSTOM.md status
- [x] 7.3 Pre-live switch on and verified on real data, WK uninstalled (DEV, then pre-live), WK code and the switch removed, `/apps/wishlist` redirect; archive
