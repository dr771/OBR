## Context

See proposal.md for why, and `WISHLIST-CUSTOM.md` for the owner-approved plan. Today every wishlist surface is ours except storage and variant state, which belong to Wishlist King (WK). `ob-wishlist.js` holds both the WK workarounds and the shared start-variant rule (`obWishlistStartVariant`); `ob-size-memory.js` holds size order and size memory. Pre-live keeps WK until the owner switches, so both versions must ship side by side in one theme and stay deployable DEV → commit → pre-live with the switch off.

## Goals / Non-Goals

**Goals:**
- One source of truth per browser, with no request needed to change an option.
- Cards rendered by the same Liquid snippets as the rest of the shop (prices, badges, option labels, size order), so there is no JS twin of that logic.
- WK can stay installed (and its embed even enabled) while the switch is on.

**Non-Goals:**
- Cross-device sync for logged-in customers, emails, analytics, sharing links (later, only if asked).
- Deleting WK code (the removal step after owner approval).

## Decisions

**Storage: `localStorage` key `ob-wishlist`, array of `{handle, variantId, addedAt}`.** Handle instead of product id because the Section Rendering URL and every product link use it. The variant id is kept as a number. A missing variant id is allowed (a heart whose product fetch failed) and is resolved and saved by the first surface that renders the entry. Alternative: cookies or a customer metafield. Cookies are size-limited and travel with every request; a metafield needs an app proxy. Both were deferred.

**API on `window.obWishlist`** (`items`, `has`, `get`, `add`, `update`, `remove`, `subscribe`, `ready`). `subscribe` fires for this tab's writes and for the `storage` event from other tabs. All storage access is wrapped in try/catch; without storage the list is an in-memory empty array.

**Cards via the Section Rendering API, one request per entry.** `/products/<handle>?section_id=ob-wishlist-item&variant=<id>` gives the section the real `product` with `selected_variant`. That lets it reuse `ob-swatch-input`, `ob-option-meta`, `ob-option-value-order` and money formatting unchanged. Two thin sections (`ob-wishlist-item` for the page card, `ob-wishlist-item-compact` for the cross-sell row) render one shared snippet with a `layout` parameter, because the Section Rendering API cannot pass parameters. A 404 means the product is gone, and the entry is dropped. Alternatives: client-side rendering from `/products/x.js` (would need JS twins of the price, badge and label logic, which is the main thing we're escaping) or one search request for all handles (search can't reliably return exact handles).

**Variant switching on the client, from JSON in the section.** The section embeds every variant's options, availability, formatted price and compare-at price, sale percentage, image URLs and URL. An option pick therefore needs no request, and "last click wins" holds by construction: each click synchronously applies and saves its variant.

**Lists reconcile against the store.** `<ob-wishlist-list layout="page|compact">` renders the store's entries in store order. It keeps an in-memory HTML cache per handle, so the cart drawer, which replaces its contents on every cart mutation, re-renders the cross-sell without refetching. It then applies the stored variant to each item. A list that only sees variant changes updates the existing item in place.

**Start variant shared, not duplicated.** `obWishlistStartVariant` moves from `ob-wishlist.js` into `ob-size-memory.js` (loaded on every page, in both modes); the WK file keeps calling the global. The colour-pick rule (keep the size when the colour has it, else the colour's start variant) lives once in the item script.

**Cart add.** Uses the theme's `/cart/add.js` with `sections`/`sections_url` from `cart-drawer.getSectionsToRender()`, then `cartDrawer.renderContents(response)`, the same pattern as the WK move-to-cart intercept. Compact rows remove their entry after a successful add (move-to-cart). Page cards keep theirs (plain add-to-cart). Without a cart drawer the browser goes to `/cart`.

**Feature switch in Liquid, not JS.** `settings.ob_wishlist_native` decides which assets load, where the header links, whether cards get the native heart, and which cross-sell markup renders. The WK assets (`ob-wishlist.js`, the `/apps/wishlist` page rails) don't load while it is on, so no WK workaround runs against native markup. A CSS rule keyed on a `ob-wishlist-native` class on `<body>` hides WK's injected floating card heart, and our card heart carries `wk-skip`.

**Card heart markup in `card-product.liquid`.** A button inside the card's media box, above Dawn's full-card link overlay, with the same look as the WK heart it replaces. Its state is synced from the store on load, on store changes, and whenever new cards enter the DOM (facet and load-more re-renders replace the grid).

## Risks / Trade-offs

- [One request per entry on the favorites page] → Requests run in parallel and the responses are small. Wishlists are short, and the drawer re-uses the cache.
- [Section response is cached by Shopify's CDN briefly] → Prices and availability may lag by the CDN cache time, as with any storefront page.
- [Per-browser list] → A shopper switching device loses the list. This was accepted in the plan, and sync for logged-in customers can come later.
- [Both modes shipped at once] → More conditional Liquid until WK is removed. Each branch is small and keyed on one setting; the removal deletes the WK branch.
- [WK app embed still on while switched on] → WK still loads its script. The CSS and `wk-skip` keep its UI out of our surfaces; the owner turns the embed off as part of the trial.

## Migration Plan

1. Code to DEV with the switch on in DEV's theme editor and WK's embeds off; verify.
2. Commit, push the same files to pre-live (switch off: nothing visible changes).
3. Owner creates the "Favorieten" page with template `page.favorieten` on pre-live, turns the switch on, verifies on real data.
4. Rollback at any time: switch off.
5. After owner approval: uninstall WK (DEV first), delete WK code, add the `/apps/wishlist` → `/pages/favorieten` redirect, then archive this change.
