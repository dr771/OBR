## MODIFIED Requirements

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
