## Purpose

Owns every storefront touchpoint for Wishlist King (Swish) on Original Brands: a runtime fix for WK's Akeneo-bracket-key option-parsing bug, a display-label overlay on the wishlist page, the header wishlist entry point (heart + count badge), the PDP wishlist toggle beside add-to-cart, and the cart drawer/`/cart` page wishlist cross-sell — all fail-open against WK being absent, slow to boot, or internally reshaped, and none of it interfering with WK's own lazy-init loading strategy.

## ADDED Requirements

### Requirement: WK option parsing works with Akeneo bracket keys
The theme SHALL patch `WishlistKing.utils.product.getInputOption` and `getFormOptions` at runtime so that option form inputs named `options[<option-name>]` resolve correctly even when `<option-name>` itself contains brackets (Akeneo keys such as `[color]`, `[shoe_size_eu]`). The patch MUST parse with an anchored greedy pattern (`/^options\[(.*)\]$/`) and MUST fall back to WK's original behavior for input names that don't match the anchored pattern, and to a no-op (WK unpatched) when the WK global or the target methods are absent.

#### Scenario: Option selection on /apps/wishlist
- **WHEN** a shopper picks a color or size value from a wishlist-page product card's option dropdown whose underlying option name is an Akeneo bracket key
- **THEN** the selection registers in WK state (dropdown reflects the new value, product image/price update, variant id resolves once all options are chosen) and no "Cannot parse options from input" error is thrown

#### Scenario: WK internals change shape
- **WHEN** a future WK version renames the utils global or methods
- **THEN** the patch silently does not apply and WK behaves exactly as unpatched (fail-open, no console errors from theme code)

### Requirement: Wishlist page shows display labels instead of raw Akeneo keys
The theme SHALL overlay WK-rendered option labels and CTA texts that contain raw Akeneo option keys with display labels, using the same color/size kind detection `ob-option-meta` already provides: keys detected as `color` render "Kleur", keys detected as `size` render "Maat", otherwise the key stripped of brackets with underscores humanized and capitalized. Standalone option labels SHALL be capitalized; keys interpolated inside CTA sentences (e.g. `Selecteer [color]`) SHALL be replaced lowercase. The overlay MUST re-apply after WK's async re-renders.

#### Scenario: Option group labels
- **WHEN** the wishlist page renders a product card with option groups `[color]` and `[shoe_size_eu]`
- **THEN** the visible group labels read "Kleur" and "Maat"

#### Scenario: CTA interpolation
- **WHEN** no color is selected yet and WK renders the CTA "Selecteer [color]"
- **THEN** the visible CTA reads "Selecteer kleur"

### Requirement: Header wishlist heart with count badge
The header SHALL render a heart icon link to `/apps/wishlist` in the icon row between the account and cart icons, on all viewports, styled like Dawn's `header__icon` controls, with a localized accessible label. The link SHALL carry `wk-skip` so WK does not inject its own component into it. A count badge (visually consistent with Dawn's cart bubble) SHALL show the wishlist item count, driven by WK's reactive wishlist state (including optimistic updates), hidden entirely at count 0 and before WK boots.

#### Scenario: Badge reflects wishlist count
- **WHEN** WK has booted and the wishlist contains 3 items
- **THEN** the header heart shows a badge with "3", and adding/removing an item updates the badge without a page reload

#### Scenario: WK not yet loaded
- **WHEN** the page is in the pre-boot window of the WK lazy-init (or WK fails to load)
- **THEN** the heart link still renders and navigates to `/apps/wishlist`, with no badge shown

### Requirement: PDP wishlist button beside add-to-cart
The PDP buy-buttons block SHALL render a square heart toggle button beside the add-to-cart button, carrying the product handle and the selected variant id. Clicking it SHALL add the product to the wishlist via WK's public add API when not saved, and remove it via WK's public remove API when already saved. Selected state SHALL derive reactively from WK's per-product state and MUST survive Dawn's `product-info.js` innerHTML replacement on variant change. Since the store runs WK in PRODUCT mode, the saved state is per product, not per variant. All behavior MUST be fail-open when WK is unavailable (button renders; click is a no-op).

#### Scenario: Add from PDP
- **WHEN** a shopper on a product page clicks the empty heart next to add-to-cart
- **THEN** the product is added to the wishlist, the heart fills, and the header badge count increments

#### Scenario: Variant change re-render
- **WHEN** the shopper switches color/size after the heart was filled
- **THEN** the re-rendered heart still shows the saved state within a normal re-render latency

#### Scenario: Remove from PDP
- **WHEN** the product is already in the wishlist and the shopper clicks the filled heart
- **THEN** the wishlist item is removed and the heart returns to the empty outline state

### Requirement: Cart drawer and cart page wishlist cross-sell
The cart drawer (filled and empty-cart states) and the `/cart` page SHALL render a wishlist cross-sell section: a localized title/heading above WK's wishlist-page element configured compact (product title, price, dropdown option pickers, add-to-cart CTA, move-to-cart). Cards SHALL render as horizontal mini rows (thumbnail, title/price, inline option dropdowns, compact CTA) visually matching OB's shipped `cart-drawer-line-item-layout` cart drawer, not a generic style. The section MUST hide itself entirely when the wishlist is empty or WK hasn't booted. The `/cart` page section SHALL be a standalone custom section wired into `templates/cart.json` (no edit to Dawn's `main-cart-items`). Adding an item from a cross-sell card MUST result in the full cart drawer refreshing and opening (never a single-row patch), showing the new line item and updated totals, with the item removed from the wishlist (move-to-cart).

#### Scenario: Drawer cross-sell visible
- **WHEN** the cart drawer opens while the wishlist holds items
- **THEN** the cross-sell section renders at the bottom of the drawer body with compact wishlist cards styled like the rest of the OB cart drawer

#### Scenario: Empty wishlist
- **WHEN** the wishlist holds no items (or WK hasn't booted)
- **THEN** no cross-sell section (including title/heading) is visible in the drawer or on `/cart`

#### Scenario: Move to cart from drawer
- **WHEN** the shopper resolves a variant in a cross-sell card and clicks its add-to-cart CTA
- **THEN** the item is added to the Shopify cart, removed from the wishlist, and the full cart drawer refreshes and opens showing the new line item and updated totals

### Requirement: WK readiness handling preserves lazy-init
All WK-dependent theme JS SHALL obtain the WK app object via a shared readiness helper that waits for `window.WishlistKing` to appear (bounded polling with timeout) and MUST NOT touch WK's lazy-init loader stash or otherwise interfere with WK's existing loading strategy. If WK never appears, every consumer degrades silently (no errors, wishlist UI stays in its pre-boot state).

#### Scenario: Post-LCP boot
- **WHEN** WK boots after its lazy-init release (post-LCP, up to several seconds after load)
- **THEN** the header badge, PDP heart state, and label overlay all attach within roughly 1 second of the boot without requiring user interaction
