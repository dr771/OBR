## Why

Wishlist King (WK) causes more breakage than anything else in the theme, and the bugs live in its internals: option parsing that breaks on Akeneo bracket keys, changes dropped while a save is in flight, size lists that follow the last *saved* colour, and a lit render we cannot control. What WK still does for us is storage and its own variant state; every visible surface is already ours. It also costs $19/month plus usage above 10,000 sessions. Nothing needs migrating: there are no customer wishlists before launch. Owner decision and full rationale: `WISHLIST-CUSTOM.md`.

## What Changes

- New theme-native, guest-only wishlist stored in the shopper's browser (one whole variant per product), with cross-tab sync.
- Card hearts become our own button on the shared product card (no WK injection); the PDP button, header badge, favorites page and cart cross-sell run on the native list.
- New favorites page at `/pages/favorieten` (page template `favorieten`). Its cards are rendered by the theme from the product itself, so price, badges and option order come from the same snippets as the rest of the shop, and option changes are instant and local.
- The cart drawer / `/cart` cross-sell renders the same items in a compact row with native dropdowns and move-to-cart.
- Theme setting `ob_wishlist_native` (default off) chooses between WK and the native wishlist. While on, theme code keeps WK's injected controls out of our surfaces even if its app embed is still enabled.
- **BREAKING (at switch-over):** logged-in customers no longer get the same list across devices; WK's reminder emails and analytics go away; `/apps/wishlist` is redirected to `/pages/favorieten`.
- WK-only requirements (parser patch, label overlay, readiness polling, change queue, WK page skin) are removed. The code behind them stays in the theme until WK is uninstalled (owner approval, DEV first, then pre-live); this change is archived after that removal.

## Capabilities

### New Capabilities

None. The wishlist stays one capability.

### Modified Capabilities

- `wishlist-integration`: storage moves from WK to the browser; the header badge, PDP button, card heart, favorites page and cart cross-sell are re-specified on the native list; the WK-only requirements are removed; a feature switch and WK coexistence are added. The whole-variant and start-size rules are kept, and so are the colour/size rule and move-to-cart.

## Impact

- New: `assets/ob-wishlist-store.js` (storage API, header badge, card heart, PDP button), `assets/ob-wishlist-items.js` (item cards, page and cross-sell lists, cart add), `sections/ob-wishlist-item.liquid` + `sections/ob-wishlist-item-compact.liquid` (+ shared `snippets/ob-wishlist-item.liquid`), `sections/ob-wishlist-page.liquid`, `templates/page.favorieten.json`, `assets/component-ob-wishlist-native.css`.
- Changed: `config/settings_schema.json` (switch), `layout/theme.liquid` (asset loading per mode), `sections/header.liquid` (link target), `snippets/card-product.liquid` (heart), `snippets/ob-wishlist-cross-sell.liquid` (native list), `assets/ob-size-memory.js` (takes over the shared start-variant helper from `ob-wishlist.js`), locales.
- Shop-side (added to MIGRATION-TO-LIVE.md): page "Favorieten" with template `page.favorieten`, the switch, the `/apps/wishlist` redirect, then WK app embed off and uninstall.
- No app, API or customer data involved; storage is per browser.
