## Why

The cart drawer (`snippets/cart-drawer.liquid`) is still Dawn's stock layout: labeled option lists ("[color]: Black"), a duplicate per-unit price under the title, a trash-can remove icon, a fixed-width quantity stepper, visible "Product"/"Total" column headers, and a bordered panel with even padding. SB already solved every one of these as one shipped, verified capability (`cart-drawer-line-item-layout`, archived 2026-07-12) on the same Dawn base. It's next on OB's reuse ledger (`Reuse as-is`) and next up in the playbook's port queue.

## What Changes

- Variant options render as plain `Value / Value` text, no `[color]:`/`[tops_size]:` labels — line-item properties (gift notes etc.) keep their own labeled list.
- Only one price per line item (the line total), compact typography (13px/500/0.2px), applied to both current and struck-through original price.
- Remove control (X icon, `icon-close.svg`, 11×11px, 2rem tap target) moves to the top row, right-aligned with the title; the price moves to the bottom row, right-aligned with the quantity stepper.
- Quantity stepper sizes to its content (`fit-content`) instead of Dawn's fixed ~14rem, sharp corners preserved, on all viewports.
- Item title renders at `calc(var(--font-heading-scale) * 1.4rem)` instead of Dawn's default 1.5rem.
- "Product"/"Total" column headers become visually-hidden (still present in the DOM for the `headers` accessibility attribute) — no visible header row/divider above the first line item.
- Drawer heading copy changes: `sections.cart.title` → "My cart" (en.default.json) / "Mijn winkelwagen" (nl.json), replacing "Your cart"/"Je winkelwagen", rendered larger with no extra bottom margin, with a hairline separator above the item list.
- Drawer panel loses Dawn's default border and gets an asymmetric gutter (2.5rem right, 1.5rem left), scoped so the mobile menu drawer (`.drawer__inner`) is unaffected.
- OB-specific adaptation: OB's `cart-item__title` wrapper and its `cart-disclosure-indicator` render (an unrelated, already-shipped OB feature) are preserved as-is; the layout changes are applied around them, not by replacing SB's markup wholesale.
- OB-specific adaptation: scoped CSS overrides go into `assets/component-cart-drawer.css` (Dawn's own file for this component), not a new `assets/custom.css` — OB has no custom.css and its established convention (see `plp-filter-panel-chrome`) is editing the relevant Dawn component file directly.
- Explicitly excluded: SB's `sb-wishlist-cross-sell` drawer markup — that belongs to the separate, not-yet-ported `wishlist-integration` capability and must not be pulled in here.
- Shop-side dependency, not theme code: `config/settings_data.json`'s `cart_type` is currently `"notification"`, so the drawer this change edits isn't even the active cart UI today. Flipping it to `"drawer"` is required for this port to be reachable/testable and ships alongside this change.

## Capabilities

### New Capabilities
- `cart-drawer-line-item-layout`: presentational layout of the cart drawer's line items (variant options, price, remove control, quantity stepper) and the drawer panel's own chrome (heading, border, padding) — ported 1:1 from SB's shipped spec, scoped to `snippets/cart-drawer.liquid` only (not `/cart` page, not the cart notification popup).

### Modified Capabilities
(none — new capability, no existing OB spec covers this today)

## Impact

- `snippets/cart-drawer.liquid` — line-item markup restructuring (option list, price/remove-control row swap, header cell classes).
- `assets/component-cart-drawer.css` — new scoped rules for stepper width, compact price typography, title size, hidden header row, borderless/asymmetric-gutter panel.
- `locales/en.default.json`, `locales/nl.json` — `sections.cart.title` copy change.
- `config/settings_data.json` — `cart_type: "notification"` → `"drawer"` (shop-side toggle, ships with this change since the drawer is otherwise unreachable).
- No changes to `sections/main-cart-items.liquid` or `sections/cart-notification-product.liquid`.
- No changes to `cart-remove-button`/`quantity-input` custom element JS — DOM position/icon only.
