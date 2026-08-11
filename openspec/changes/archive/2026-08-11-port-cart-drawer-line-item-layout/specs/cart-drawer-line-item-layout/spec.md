## Purpose

Presentational layout of the cart drawer (`snippets/cart-drawer.liquid`) — how a line item's variant options, price, remove control, and quantity stepper are arranged and styled, plus the drawer panel's own chrome (header, heading, border/padding). Scoped to the cart drawer only, not the full `/cart` page (`sections/main-cart-items.liquid`) or the cart notification popup (`sections/cart-notification-product.liquid`), which render their own option/price markup and are unaffected by this spec.

## ADDED Requirements

### Requirement: Variant options render without labels
Each cart drawer line item SHALL render its variant option values as plain text joined by " / ", with no option-name label (no "[color]:", "[tops_size]:", or any translated equivalent prefix). Line-item properties (user-entered text, e.g. gift-wrap notes or personalization) are unaffected and keep their own labeled list.

#### Scenario: Product has color and size options
- **WHEN** a cart line item is a product with `[color]` value "Black Grey" and `[shoe_size_eu]` value "40"
- **THEN** the drawer shows "Black Grey / 40" with no labels

#### Scenario: Line item carries a custom property
- **WHEN** a cart line item has a non-empty, non-underscore-prefixed line item property (e.g. "Engraving: Happy Birthday")
- **THEN** that property still renders with its own `<dt>`/`<dd>` label pair, unaffected by the option-list formatting change

### Requirement: Only one price renders per line item
Each cart drawer line item SHALL show exactly one price (the line total for its quantity) — no separate per-unit price rendered under the title. The visible price SHALL use compact typography (13px, 500 weight, 0.2px letter-spacing) distinct from Dawn's default price styling, applied to both the current price and any struck-through original price.

#### Scenario: Single-quantity line item
- **WHEN** a cart line item has quantity 1
- **THEN** only one price appears for that line item, in the quantity-stepper row (see remove-control/price placement requirement)

#### Scenario: Multi-quantity line item
- **WHEN** a cart line item has quantity greater than 1
- **THEN** the single visible price is the line total (unit price × quantity), not a per-unit price

### Requirement: Remove control and price occupy swapped rows
Within a cart drawer line item's two-row grid layout, the remove control SHALL render in the top row, right-aligned and vertically level with the first line of the item title. The line price SHALL render in the bottom row, right-aligned and vertically level with the quantity stepper.

#### Scenario: Viewing a line item
- **WHEN** a shopper views any line item in the cart drawer
- **THEN** the remove control appears at the top-right, aligned with the title's first line, and the price appears at the bottom-right, aligned with the quantity stepper

### Requirement: Remove control uses a close (X) icon at a compact size
The cart drawer's per-line-item remove control SHALL render Dawn's close icon (`icon-close.svg`) instead of the trash icon (`icon-remove.svg`), sized smaller (11px×11px) than Dawn's default and with a reduced tap-target height (2rem) — scoped to the `cart-remove-button` custom element so the drawer's own close (X) button (which closes the entire drawer) is unaffected and stays at its original size. The control SHALL keep its existing accessible name, custom element, and click behavior.

#### Scenario: Shopper views the remove control
- **WHEN** a shopper views a line item's remove control in the cart drawer
- **THEN** it displays as a small, plain "X" close icon, not a trash-can icon, and is visibly smaller than the drawer's own close button in the header

#### Scenario: Shopper activates the remove control
- **WHEN** a shopper clicks the remove control
- **THEN** the line item is removed from the cart exactly as before the icon/size change (no change to the underlying remove behavior)

### Requirement: Quantity stepper sizes to its content
The cart drawer's quantity stepper SHALL size its width to fit its buttons and input (capped at a small max-width) rather than using Dawn's fixed default width, and SHALL keep sharp (non-rounded) corners consistent with the sitewide `--inputs-radius: 0` setting. This sizing applies uniformly regardless of viewport width (desktop, tablet, or mobile) since the drawer itself is always a fixed-width narrow panel.

#### Scenario: Quantity stepper next to the price
- **WHEN** the quantity stepper renders in the same row as the line price
- **THEN** the stepper's width fits only its minus button, number input, and plus button — it does not reserve Dawn's default fixed width — and its corners remain square

#### Scenario: Viewing the cart drawer on mobile or tablet
- **WHEN** a shopper opens the cart drawer on a mobile or tablet viewport
- **THEN** the quantity stepper is just as compact as on desktop, not reverting to Dawn's wider default

### Requirement: Item title uses a compact heading size
The cart drawer line item's product title SHALL render slightly smaller than Dawn's default h4 size, using `calc(var(--font-heading-scale) * 1.4rem)` instead of the default 1.5rem multiplier.

#### Scenario: Viewing a line item title
- **WHEN** a shopper views a line item's product title in the cart drawer
- **THEN** it renders at the compact size, still scaling with the theme's heading-scale setting

### Requirement: Column-header row is visually hidden
The cart drawer's line-item table SHALL NOT display visible "Product"/"Total" column-header text above the line items. The header cells SHALL remain present in the DOM as visually-hidden elements so the table's `headers` attribute associations (used for accessibility) continue to resolve.

#### Scenario: Shopper opens the cart drawer
- **WHEN** a shopper with items in their cart opens the cart drawer
- **THEN** no visible "Product"/"Total" heading text or header-row divider line appears above the first line item

#### Scenario: Screen reader navigates the line-item table
- **WHEN** a screen reader user navigates a line-item's cells
- **THEN** the cells' accessible names still resolve via the (visually-hidden but DOM-present) column headers, unchanged from before this change

### Requirement: Cart drawer heading reads "My cart" with a hairline separator
The cart drawer's heading SHALL read "My cart" in English (`sections.cart.title` in `en.default.json`) and "Mijn winkelwagen" in Dutch (`sections.cart.title` in `nl.json`), replacing "Your cart" / "Je winkelwagen". The heading SHALL render larger and without extra bottom margin, and the drawer header SHALL carry a hairline bottom border that sits close against the line-item list below it.

#### Scenario: Dutch-locale shopper opens the cart drawer
- **WHEN** a shopper on the Dutch storefront opens the cart drawer
- **THEN** the drawer heading reads "Mijn winkelwagen", above a hairline separator

#### Scenario: English-locale shopper opens the cart drawer
- **WHEN** a shopper on the English storefront (or theme editor preview) opens the cart drawer
- **THEN** the drawer heading reads "My cart"

### Requirement: Drawer panel has no border and an asymmetric gutter
The cart drawer panel SHALL render without Dawn's default panel border, and SHALL use a wider right-side padding than left (2.5rem right, 1.5rem left) — scoped so the shared `.drawer__inner` class used by the mobile menu drawer is unaffected.

#### Scenario: Shopper opens the cart drawer
- **WHEN** a shopper opens the cart drawer
- **THEN** the panel shows no border, with a visibly wider gutter on the right side than the left

#### Scenario: Shopper opens the mobile menu drawer
- **WHEN** a shopper opens the mobile hamburger menu drawer
- **THEN** its border and padding are unaffected by the cart drawer's styling
