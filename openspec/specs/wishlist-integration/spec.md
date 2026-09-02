# wishlist-integration Specification

## Purpose
Owns every storefront touchpoint for Wishlist King (Swish) on Original Brands: a runtime fix for WK's Akeneo-bracket-key option-parsing bug, a display-label overlay on the wishlist page, the header wishlist entry point (heart + count badge), the PDP wishlist toggle beside add-to-cart, and the cart drawer/`/cart` page wishlist cross-sell — all fail-open against WK being absent, slow to boot, or internally reshaped, and none of it interfering with WK's own lazy-init loading strategy.
## Requirements
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

The overlay MUST handle the key in both its bracketed and its bracketless form, since Translate & Adapt may strip the Akeneo brackets before the storefront renders them (`options[shoe_size_eu]` rather than `options[[shoe_size_eu]]`). For the bracketless form the key SHALL be read from the option control's own `name` attribute and substituted only inside that control's label, its placeholder option, its displayed value, and its form's CTA label — never by scanning arbitrary card text, which would corrupt product titles that happen to contain a key word.

In the compact cart drawer / `/cart` cross-sell, a picker whose placeholder is showing SHALL display the bare label ("Kleur", "Maat") rather than WK's full "Selecteer …" sentence, so that two unresolved pickers side by side in a drawer-width row both remain legible instead of ellipsizing. The CTA SHALL keep the full sentence.

#### Scenario: Option group labels
- **WHEN** the wishlist page renders a product card with option groups `[color]` and `[shoe_size_eu]`
- **THEN** the visible group labels read "Kleur" and "Maat"

#### Scenario: CTA interpolation
- **WHEN** no color is selected yet and WK renders the CTA "Selecteer [color]"
- **THEN** the visible CTA reads "Selecteer kleur"

#### Scenario: Bracketless key from Translate & Adapt
- **WHEN** WK renders an option control whose `name` is `options[shoe_size_eu]` (brackets already stripped) and prints `shoe_size_eu` in its label, placeholder and CTA
- **THEN** none of those texts show the raw key, and the product title on the same card is left untouched

#### Scenario: Unresolved compact picker
- **WHEN** a cross-sell card in the cart drawer has neither its color nor its size chosen
- **THEN** the two pickers read "Kleur" and "Maat" in full, while the disabled CTA's accessible label still reads the full "Selecteer kleur" sentence

### Requirement: Header wishlist heart with count badge
The header SHALL render a heart icon link to `/apps/wishlist` in the icon row immediately before the cart icon, on all viewports, styled like Dawn's `header__icon` controls, with a localized accessible label. When the optional account icon is rendered, the heart SHALL follow it and remain before cart. The link SHALL carry `wk-skip` so WK does not inject its own component into it. A count badge (visually consistent with Dawn's cart bubble) SHALL show the wishlist item count, driven by WK's reactive wishlist state (including optimistic updates), hidden entirely at count 0 and before WK boots.

#### Scenario: Badge reflects wishlist count
- **WHEN** WK has booted and the wishlist contains 3 items
- **THEN** the header heart shows a badge with "3", and adding/removing an item updates the badge without a page reload

#### Scenario: WK not yet loaded
- **WHEN** the page is in the pre-boot window of the WK lazy-init (or WK fails to load)
- **THEN** the heart link still renders and navigates to `/apps/wishlist`, with no badge shown

#### Scenario: Optional account icon is absent
- **WHEN** the customer-account icon is disabled
- **THEN** the heart remains immediately before the cart icon without an empty account-control gap

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
The cart drawer (filled and empty-cart states) and the `/cart` page SHALL render a wishlist cross-sell section: a localized title/heading above WK's wishlist-page element configured compact (product title, price, dropdown option pickers, add-to-cart CTA, move-to-cart). The title SHALL link to `/apps/wishlist`. Cards SHALL render as horizontal mini rows (thumbnail, title/price, inline option dropdowns, compact CTA) visually matching OB's shipped `cart-drawer-line-item-layout` cart drawer — including the same multiply-blend photo treatment on a tinted local frame — not a generic style. The section MUST hide itself entirely when the wishlist is empty or WK hasn't booted. The `/cart` page section SHALL be a standalone custom section wired into `templates/cart.json` (no edit to Dawn's `main-cart-items`). Adding an item from a cross-sell card MUST result in the full cart drawer refreshing and opening (never a single-row patch), showing the new line item and updated totals, with the item removed from the wishlist (move-to-cart).

Each card SHALL also render a remove-from-wishlist control to the right of its add-to-cart CTA. Since WK's own remove control is a floating, JS-transform-positioned control built for a card corner (matching the PLP collection-card heart), not an inline row control, the theme SHALL render its own plain button here and drive it via WK's public `removeWishlistItem` API rather than repositioning WK's control. Activating it MUST remove the item from the wishlist (not just visually from the drawer); the card disappearing from WK's own reactive render is what removes it from the drawer, and the whole cross-sell section hides itself once the wishlist becomes empty as a result.

The compact row SHALL hold this layout in the **no-variant** state an item saved from a PLP card arrives in, where WK renders a disabled CTA and placeholder pickers:

- The CTA SHALL keep its compact square footprint in both its enabled and its disabled state, overriding WK's own full-width disabled sizing.
- The card MUST NOT widen past the drawer's content width; option controls SHALL shrink and ellipsize instead, and a single-value option picker SHALL be hidden rather than consume row width.
- Each option control's resting width SHALL be measured from the text it can actually display, using a measurement that accounts for the rendered font including letter-spacing.

Theme cart code MUST NOT apply its own form-control validation to WK's option controls: invalidating one of them makes WK's add-to-cart form fail interactive validation, which suppresses the `submit` event the move-to-cart intercept depends on and silently disables adding from the cross-sell.

The label overlay and the measured widths MUST survive the cart drawer replacing its own contents wholesale on a cart mutation.

#### Scenario: Drawer cross-sell visible
- **WHEN** the cart drawer opens while the wishlist holds items
- **THEN** the cross-sell section renders at the bottom of the drawer body with compact wishlist cards styled like the rest of the OB cart drawer

#### Scenario: Empty wishlist
- **WHEN** the wishlist holds no items (or WK hasn't booted)
- **THEN** no cross-sell section (including title/heading) is visible in the drawer or on `/cart`

#### Scenario: Move to cart from drawer
- **WHEN** the shopper resolves a variant in a cross-sell card and clicks its add-to-cart CTA
- **THEN** the item is added to the Shopify cart, removed from the wishlist, and the full cart drawer refreshes and opens showing the new line item and updated totals

#### Scenario: Item saved from a PLP card
- **WHEN** the drawer's cross-sell renders an item that was saved from a PLP card and therefore has no variant chosen
- **THEN** its pickers and its disabled CTA sit on one row inside the drawer's width with no horizontal overflow, and choosing every option enables the CTA and resolves a variant id

#### Scenario: Move to cart after a previous cart mutation
- **WHEN** the shopper adds one cross-sell item, and the drawer re-renders, and then works with a second cross-sell card
- **THEN** that card still shows display labels and correctly sized pickers, and its own move-to-cart still adds in-drawer without a page navigation

#### Scenario: Shopper clicks the cross-sell title
- **WHEN** a shopper clicks the "Uw wenslijst" / "Your favorites" title above the cross-sell cards
- **THEN** the browser navigates to `/apps/wishlist`

#### Scenario: Shopper removes a cross-sell item
- **WHEN** a shopper clicks a cross-sell card's remove control
- **THEN** the card disappears from the drawer and the item is gone from `/apps/wishlist` as well — not merely hidden client-side while remaining saved

#### Scenario: Removing the last cross-sell item
- **WHEN** a shopper removes the only remaining item via a cross-sell card's remove control
- **THEN** the whole cross-sell section (including title/heading) hides itself, matching the empty-wishlist scenario

### Requirement: WK readiness handling preserves lazy-init
All WK-dependent theme JS SHALL obtain the WK app object via a shared readiness helper that waits for `window.WishlistKing` to appear (bounded polling with timeout) and MUST NOT touch WK's lazy-init loader stash or otherwise interfere with WK's existing loading strategy. If WK never appears, every consumer degrades silently (no errors, wishlist UI stays in its pre-boot state).

#### Scenario: Post-LCP boot
- **WHEN** WK boots after its lazy-init release (post-LCP, up to several seconds after load)
- **THEN** the header badge, PDP heart state, and label overlay all attach within roughly 1 second of the boot without requiring user interaction

### Requirement: Standalone wishlist page aligns with the theme content edge
At desktop widths, the standalone `/apps/wishlist` Swish page SHALL cap its outer shell at 1200px, centered, in place of the app's native 1600px page-width setting, with additional inline padding so its product cards and controls don't touch the viewport edge. This rule SHALL NOT affect cart/drawer wishlist cross-sells or Swish's mobile spacing.

The standalone page's product-card grid, product photos, card meta typography, variant option pickers, add-to-cart CTA, remove-from-wishlist control, and page header SHALL be restyled to match the theme's design system, distinct from — and independently stylable from — the cart/drawer wishlist cross-sell's own compact styling. All such CSS rules MUST be scoped under `#MainContent > wishlist-page` (never a bare `wishlist-page` or `.wk-*` selector), since a second, hidden `<wishlist-page>` instance for the cart-drawer cross-sell exists on every page and MUST NOT be affected. Any JS or CSS assets added for this page specifically (not already loaded globally) MUST be loaded conditionally for this page only, to avoid double-loading assets that already ship on PDP/PLP pages via their own includes.

The product-card grid SHALL render as a responsive multi-column grid — 2 columns below 750px, 3 columns from 750px to 989px, 4 columns from 990px — replacing WK's own internal grid-column logic, sized so a resolved card is no wider than a PLP product card at an equivalent viewport width.

Each product photo SHALL render with the same treatment as PLP product-card photos: a tinted surface background, `mix-blend-mode: multiply` on the image, and matching border-radius.

Card meta (vendor label, product title, price) SHALL use the same typography as PLP card meta (uppercase low-emphasis vendor label, medium-weight product title), left-aligned rather than centered. The colour option rail (see below) SHALL render directly below the product photo, above the card meta — matching the PLP card's chip-then-meta order — while any other option rail (e.g. size) stays with the form controls below the meta block.

Each card's variant option pickers SHALL render as PLP/PDP-style single-row rails instead of WK's native dropdowns: colour options as image-swatch chips (the option's own representative variant photo, matching the PDP colour-chip treatment) and other options (e.g. size) as text/number box chips, both reusing the theme's existing shared rail chrome (overflow chevrons, edge fades) rather than a bespoke implementation. WK's native `<select>` elements MUST remain present in the DOM (hidden, not removed) and continue to be the mechanism that drives variant resolution: selecting a rail chip MUST set the corresponding select's value and dispatch a real change event on it, and MUST NOT reimplement WK's own variant-resolution, availability, or add-to-cart logic. Rail chip availability (enabled/disabled) MUST stay synchronized with what WK itself has computed for the current selection (e.g. picking a colour that leaves only some sizes available). This applies to the standalone page only; the cart-drawer/`/cart` cross-sell keeps its own native dropdown pickers unchanged.

Prices SHALL render without a redundant trailing ISO currency code (e.g. "€100,00", not "€100,00 EUR"), matching how prices render everywhere else in the theme.

The add-to-cart CTA SHALL render as a labeled pill button using the theme's button color tokens (dark fill, accent-color hover), compact enough to sit in the same row as a remove-from-wishlist control — distinct from the cross-sell's icon-only CTA, since the standalone page keeps a visible label, but no longer spanning the full card width alone.

Each card SHALL render a themed remove-from-wishlist control (trash icon) immediately to the right of its add-to-cart CTA, replacing WK's own floating corner "X" control for this surface. It MUST be the same themed control already shipped for the cart-drawer/`/cart` cross-sell (reusing its markup, styling, and `removeWishlistItem` wiring) rather than a separate implementation, and MUST be positioned correctly regardless of its position in WK's rendered DOM order.

The page header (title, login/share controls) SHALL use the theme's body font family and ink color tokens instead of WK's own default typography.

#### Scenario: Wishlist renders on a wide desktop viewport

- **WHEN** the standalone wishlist page renders wider than 1200px
- **THEN** its outer shell caps at 1200px and centers, with its content inset from the viewport edge rather than spanning full width

#### Scenario: Wishlist renders in another surface or below desktop

- **WHEN** a wishlist component renders in the cart/drawer or the standalone page renders below 990px
- **THEN** the desktop standalone-page width cap and inset do not apply

#### Scenario: Product grid reflows at each breakpoint

- **WHEN** the standalone wishlist page is viewed below 750px, between 750px and 989px, and at 990px or wider
- **THEN** the product-card grid renders 2, 3, and 4 columns respectively, with each card no wider than an equivalent-viewport PLP card

#### Scenario: Product photo matches PLP treatment

- **WHEN** a product card renders its photo on the standalone wishlist page
- **THEN** the photo sits on a tinted surface, blends multiply against it, and shares the PLP card's border-radius

#### Scenario: Colour options render as image swatch rails

- **WHEN** a product card has a colour option
- **THEN** each value renders as a chip showing that colour's own variant photo, in a horizontally scrollable single-row rail with overflow chevrons when there are more chips than fit

#### Scenario: Size options render as box chip rails

- **WHEN** a product card has a size (or other non-colour) option
- **THEN** each value renders as a text/number box chip in a horizontally scrollable single-row rail, matching the PDP's size-box treatment

#### Scenario: Rail selection drives the real variant state

- **WHEN** a shopper clicks a colour or size chip
- **THEN** the underlying native option control updates to that value and WK resolves price, image, and add-to-cart availability exactly as it would from its own native control

#### Scenario: Rail availability follows WK's own resolution

- **WHEN** a shopper picks a value that leaves some other option's values unavailable for the resulting combination
- **THEN** the corresponding chips in that other option's rail become disabled, matching what WK itself has computed

#### Scenario: Cross-sell keeps its native pickers

- **WHEN** the cart drawer or `/cart` page renders its wishlist cross-sell
- **THEN** its option pickers remain WK's native dropdowns, unaffected by the standalone page's rails

#### Scenario: Price has no redundant currency code

- **WHEN** a product card renders its price
- **THEN** it shows the currency symbol and amount only (e.g. "€100,00"), without a trailing ISO currency code

#### Scenario: CTA and remove control share a row

- **WHEN** a product card's variant is fully resolved
- **THEN** the add-to-cart CTA renders as a labeled pill button with the theme's dark-fill/accent-hover colors, sized to share its row with a themed trash-icon remove-from-wishlist control immediately to its right, and WK's own floating "X" control is hidden

#### Scenario: CTA in the disabled/no-variant state

- **WHEN** a product card has no variant resolved yet (e.g. an item saved from a PLP card)
- **THEN** the CTA renders in a muted disabled style while remaining the same pill shape, still paired with the remove control

#### Scenario: Removing an item from the standalone page

- **WHEN** a shopper clicks a card's trash-icon remove control on `/apps/wishlist`
- **THEN** the item is removed from the wishlist via WK's `removeWishlistItem` API and the card disappears via WK's own reactive render, the same underlying behavior already shipped for the cross-sell's remove control

#### Scenario: Page header uses theme typography

- **WHEN** the standalone wishlist page renders its header (title, login/share controls)
- **THEN** the text renders in the theme's body font family and ink color tokens, not WK's default serif/Arial typography

#### Scenario: Cross-sell styling is unaffected

- **WHEN** the cart drawer or `/cart` page renders its wishlist cross-sell
- **THEN** its layout, dropdown sizing, CTA styling, and remove control remain exactly as previously shipped, unaffected by the standalone page's restyling

