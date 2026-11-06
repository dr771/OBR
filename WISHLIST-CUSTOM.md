# Custom wishlist (replacing Wishlist King)

Status: **built and verified on DEV, shipped to pre-live switched off** (2026-11-06, OpenSpec change `replace-wishlist-king`). Next: owner review on DEV, then the pre-live switch-over (phase 7) and WK removal (phase 8). Pre-live keeps Wishlist King (WK) until the owner switches over.

## Why

WK has caused more trouble than everything else under our control. The bugs we keep chasing are WK internals, not our code:

- Its option parser breaks on Akeneo bracket keys (`options[[color]]`), and our patch for it was silently a no-op for weeks.
- It drops option changes, adds and removes made while a save is still running. `/apps/wishlist` needs a whole request queue to work around that.
- It lists only the sizes of the colour it last *saved*, so a colour pick can't reach its own sizes without tricks (a stand-in hidden input).
- Its lit rendering resets selects, re-renders removed cards and can't be controlled. The label overlay, the stale-card hiding and the width measuring all exist only because of it.

What WK still actually does for us is **storage and its own variant state**. Hearts, the PDP button, the header badge, the cross-sell layout, move-to-cart, remove, badges, the page rails and the size logic are already ours.

Cost: $19/month plus usage charges above 10,000 website sessions/month, which could rise once launch traffic arrives.

Nobody uses WK's extras yet: the feature is new to the OB team, and there are no customer wishlists before launch, so there is nothing to migrate.

## Decision

Replace WK with a theme-native wishlist, **guest-only (localStorage)** for v1. Add cross-device sync for logged-in customers only if someone asks for it later.

## What we keep, what we lose

Kept, on equal or better terms:
- card hearts (PLP, search, every shared product-card surface), saving the colour shown plus a start size
- PDP wishlist button beside add-to-cart
- header heart with count badge
- favorites page: photo, sale/sold-out badge, price, colour chips, size grid, add-to-cart, remove
- cart drawer and `/cart` cross-sell with move-to-cart
- size memory and start-size logic (`ob-size-memory.js`), unchanged
- the colour/size rule from `wishlist-integration`: a colour pick always lands on an existing variant, and sizes the colour lacks are disabled

Lost, until asked for:
- the same list across devices for logged-in customers (WK stores it on the account)
- WK's reminder / back-in-stock emails and wishlist analytics
- the `/apps/wishlist` URL (redirected to the new page)

## Architecture

### Storage
- localStorage key `ob-wishlist`: `[{ handle, variantId, addedAt }]`, newest first, one entry per product (saving the same product again replaces its variant).
- Every read and write in try/catch. If storage is unavailable, the wishlist is simply empty, never an error.
- Cross-tab sync through the `storage` event, so the badge and hearts update in other tabs.
- A small API on `window.obWishlist`: `items()`, `has(handle)`, `add(handle, variantId)`, `update(handle, variantId)`, `remove(handle)`, `subscribe(fn)`. Everything else uses only this.
- Fully separate from WK, whose list lives on appmate's servers. The two lists never touch.

### Rendering
- Cards are rendered **server-side in Liquid** through the Section Rendering API (`/products/<handle>?section_id=ob-wishlist-item&variant=<id>`), one small section per item. That reuses our own snippets directly: `ob-sale-label`, the badges, price formatting, `ob-option-meta`, `ob-option-value-order`, the swatches. No JS twin of the price/badge logic, unlike the WK page today.
- Requests run in parallel. The page shows placeholders until they arrive.
- Variant data for the pickers comes from the section's own JSON (`product.variants`: options, availability, image, price), so switching colour or size is purely client-side, with no request and no queue.
- A product that no longer exists or isn't published is dropped from the list quietly.

### Option logic (reused, not reinvented)
- Colour/size kind: `obOptionKind` (`ob-size-memory.js`) / `ob-option-meta`.
- Start size: `obWishlistStartVariant` (remembered size, else the middle one).
- A colour without the chosen size moves to its start size. Sizes the colour lacks are disabled (same rule as now, without the WK workarounds).
- A size picked by the shopper is remembered as on the PDP (`data-option-name` on the size radios, real clicks only).

### Cart
- Add-to-cart and move-to-cart through `/cart/add.js` with `sections` / `sections_url`, then `cart-drawer.renderContents(...)`. This is the pattern `ob-wishlist.js` already uses for its move-to-cart intercept. Move-to-cart removes the item from `ob-wishlist` after a successful add.

### Surfaces
- **Card heart:** our own button in `card-product.liquid` instead of WK's injected floating button. The click toggles `obWishlist` with the card's active colour chip plus its start size.
- **PDP button:** the existing `.ob-wishlist-btn` (`data-product-handle`), now saving the selected variant through `obWishlist`.
- **Header badge:** the existing `.ob-wishlist-bubble`, fed by `obWishlist.subscribe`. The header heart links to whichever version is switched on.
- **Favorites page:** `templates/page.favorieten.json` plus a section (`/pages/favorieten`), with page chrome as on the current `/apps/wishlist` skin.
- **Cross-sell:** `snippets/ob-wishlist-cross-sell.liquid` renders the same item section in its compact variant (native dropdowns), hidden while the list is empty.
- **Sharing (optional, v1.1):** a link carrying the encoded list (`?items=handle:variantId,...`) that opens the page read-only, with "add all to my favorites".

### Feature switch and coexistence with WK
- Theme setting `ob_wishlist_native` (default **off**). When off, everything stays as today (WK). When on, our surfaces render and the WK-based ones (cross-sell, header link, PDP button wiring) are left out.
- The switch alone isn't enough: WK's **app embed** loads its script on every page and injects its own floating heart into product cards. So while the switch is on, our code also keeps WK out of our surfaces: `wk-skip` on our card markup (as the header heart already has) and CSS that hides WK's floating button. That keeps pre-live safe during a trial even if someone forgets the app embed.
- This keeps the normal deploy route intact: code goes DEV → commit → pre-live, switched off. Testing on pre-live data is then a single switch in the theme editor, and so is going back.

## Testing on DEV (WK stays installed)

- **Our version:** in DEV's theme editor, `ob_wishlist_native` **on**, and App embeds → Wishlist King **off** (plus its collection-button block if separate). One reversible toggle, nothing uninstalled. The page then behaves as if WK weren't there.
- **Comparison with WK:** switch off, app embed on.
- WK stays on DEV during the build, so DEV remains the test bed for pre-live, which still runs WK until the switch-over.

## Implementation phases

1. **OpenSpec change `replace-wishlist-king`.** Rewrite `wishlist-integration`. Drop the WK-only requirements (parser patch, label overlay, change queue, WK readiness/lazy-init). Keep and restate the behavior contracts: whole-variant entries, the start size, the colour/size rule, move-to-cart, the cross-sell hiding when empty, and no theme validation on the option controls.
2. **Storage API and header badge** (`assets/ob-wishlist-store.js`, loaded after `ob-size-memory.js`).
3. **Card heart and PDP button** on `obWishlist`, behind the switch, keeping WK's injected heart out.
4. **Item section and favorites page** (server-rendered cards, client-side option switching, add-to-cart, remove).
5. **Cart cross-sell** on the same item section, compact variant, move-to-cart.
6. **Verification on DEV,** mobile and desktop (switch on, WK app embed off).
7. **Pre-live with the switch off, then on:** verify on real Akeneo data (e.g. Hi-Tec Blackout Mid Wp Jr, where colours come only in some sizes).
8. **WK removal, after owner approval: DEV first, then pre-live.** DEV is the rehearsal, so leftovers and surprises (theme blocks, orphaned scripts, settings) show up there first.
   - Uninstall the app and remove its app blocks/embed in the theme editor.
   - Delete the WK-only code: `ob-wishlist-page-rails.js`, the parser patch, the label overlay, the WK workarounds in `ob-wishlist.js`, and the `wk-*` rules in `component-ob-wishlist.css`.
   - Redirect `/apps/wishlist` → `/pages/favorieten`.
   - Move the WK section of GOTCHAS.md to a short "historic" note.
   - Then the same steps on pre-live.

Time estimate (agent time): phases 1–5 in one focused session (about 2–4 h), then 1–2 shorter review rounds after the owner has clicked through it. The checking takes longer than the code.

## Verification checklist

- Heart on a PLP card showing a non-default colour saves that colour plus its start size, and the heart fills. A second click removes it. Only one heart per card (no WK heart).
- The PDP button saves the selected variant, and the badge count follows in the same tab and in another tab.
- Favorites page: a colour pick without the chosen size moves to the start size, and sizes the colour lacks are disabled. Photo, price and badge follow without a request.
- Quick clicks (3 sizes within a second): the last click wins, nothing is dropped.
- Add-to-cart opens the drawer with the right variant. Move-to-cart from the cross-sell also removes the item. The cross-sell hides after the last item.
- A sold-out variant shows sold-out and add-to-cart is disabled. A deleted product disappears quietly.
- Storage blocked (private mode): no errors, the wishlist is empty, everything else works.
- Mobile 390px and desktop, cart drawer and `/cart` page.

## Shop-side items (go into MIGRATION-TO-LIVE.md when started)

- Theme setting `ob_wishlist_native` on.
- Page "Favorieten" with template `page.favorieten`.
- URL redirect `/apps/wishlist` → `/pages/favorieten`.
- WK app embed off, then WK uninstalled (DEV first, then pre-live).

## Later, only if asked

- **Cross-device sync for logged-in customers:** a customer metafield (list as JSON), written through a small custom app or app proxy, since the theme alone can't write customer data. Merge it with the guest list at login.
- **Wishlist / back-in-stock emails:** Shopify Flow, or a dedicated back-in-stock app.
- **Wishlist analytics:** events to the existing analytics setup (`add_to_wishlist`).

## Open questions

- Before uninstalling: is any WK setting used outside the theme (emails, Flow triggers)? Check on DEV first.
- Sessions per month (relevant only to what WK would have cost after launch): can be read later from the Google Search Console data collected for the redirect work. Not urgent.
