## 1. Line-item markup (`snippets/cart-drawer.liquid`)

- [x] 1.1 Replace the per-option `<dl>`/`dt`/`dd` loop with a single label-free `Value / Value` line (keep the separate property `<dl>` untouched).
- [x] 1.2 Move the price markup (`cart-item__price-wrapper`, discounted/unit-price logic) from `.cart-item__totals` into `.cart-item__quantity-wrapper` (row 2, after the quantity-popover-container). Also dropped OB's extra duplicate per-unit price block that rendered under the title (out of scope for SB, but violated the "only one price" requirement as OB's Dawn baseline had it).
- [x] 1.3 Move `<cart-remove-button>` from `.cart-item__quantity-wrapper` into `.cart-item__totals` (row 1), swap its icon from `icon-remove.svg` to `icon-close.svg`.
- [x] 1.4 Apply `class="visually-hidden"` directly to the "Product" and "Total" `<th>` elements (`CartDrawer-ColumnProduct`, `CartDrawer-ColumnTotal`), keeping their `id`/`headers` associations intact.
- [x] 1.5 Confirm the existing `cart-item__title`/`cart-disclosure-indicator` wrapper is untouched by the above edits.

## 2. Styling (`assets/component-cart-drawer.css`)

- [x] 2.1 Add compact price typography (13px, 500 weight, 0.2px letter-spacing) scoped to the relocated `.cart-item__quantity-price`/price wrapper, applied to both current and struck-through price.
- [x] 2.2 Add `margin-left: auto` on the relocated price wrapper so it right-aligns in the flex quantity row.
- [x] 2.3 Add `.cart-drawer .cart-item__totals cart-remove-button { pointer-events: auto; }` to undo Dawn's `pointer-events: none` on `.cart-item__totals`.
- [x] 2.4 Add remove-icon sizing (11px×11px) and reduced tap-target height (2rem), scoped to `cart-remove-button` inside the drawer only.
- [x] 2.5 Add `.cart-drawer .cart-item__quantity-wrapper .quantity { width: fit-content; }`, keeping `--inputs-radius: 0` corners.
- [x] 2.6 Add compact item-title sizing: `calc(var(--font-heading-scale) * 1.4rem)`.
- [x] 2.7 Zero out the header row's residual bottom margin so no gap remains above the first line item once the header text is hidden.
- [x] 2.8 Add borderless panel + asymmetric gutter (2.5rem right / 1.5rem left), scoped so `.drawer__inner` used by the mobile menu drawer is unaffected.
- [x] 2.9 Style the drawer heading larger with no extra bottom margin, plus a hairline bottom border on `.drawer__header`.

## 3. Copy (`locales/en.default.json`, `locales/nl.json`)

- [x] 3.1 Change `sections.cart.title`: "Your cart" → "My cart" (en.default.json).
- [x] 3.2 Change `sections.cart.title`: "Je winkelwagen" → "Mijn winkelwagen" (nl.json).

## 4. Shop-side dependency

- [x] 4.1 Flip `cart_type` from `"notification"` to `"drawer"` in `config/settings_data.json`.

## 5. Push and verify

- [x] 5.1 Push changed files to the main Dawn theme via `shopify theme push --allow-live --only <files>`.
- [x] 5.2 Set stock directly on 1-2 test variants in Shopify (Nick's ERP stock sync isn't wired yet) so a multi-line-item cart can be built for testing. Set 10 units each on Loewenweiss Diva (Rust/36), SB leggings (Black Grey/S), and Holster Soleseeker (Beige/36); also set a compare-at price on the Holster variant (€65 → €50) to exercise the discounted-price scenario.
- [x] 5.3a Verify deployment landed: `cart_type: drawer` active (`<cart-drawer>` present in DOM), drawer `aria-label` renders "Mijn winkelwagen" (locale change live), and all eight ported CSS rules parse on the live storefront. Confirmed 2026-08-11.

**Root cause of the add-to-cart blocker found and fixed 2026-08-11** (see project memory `ob-dev-store-nothing-addable-to-cart` for full diagnosis): the dev store's only shipping zone covered the US, its only Market is EU — every shippable variant was permanently "sold out" regardless of stock. Confirmed via a brand-new, zero-option, `inventoryPolicy: CONTINUE` test product that still failed; confirmed the mechanism by flipping `inventoryItem.requiresShipping` to `false` on it (instant fix). Used that same flip temporarily on the 3 real test variants (Loewenweiss Diva `Rust/36`, SB leggings `Black Grey/S`, Holster Soleseeker `Beige/36`) to populate a real cart for the verification below, then reverted `requiresShipping` back to `true` on all 3. Separately, added a real **"EU" shipping zone** (BE/NL/DE/FR/LU, €4,95 flat rate) to the shop's default delivery profile via `deliveryProfileUpdate` (`locationGroupsToUpdate`, not the misleadingly-named `profileLocationGroups` field, which silently no-ops) — confirmed live on Holster `Beige/36` with `requiresShipping: true` and no workaround: `available: true`, `/cart/add.js` 200. This is a shop-config fix, not a theme change; logged in [MIGRATION-TO-LIVE.md](../../../MIGRATION-TO-LIVE.md) so the live shop doesn't inherit the same US-only default.

- [x] 5.3b Verify live in Chrome: label-free options ("Beige / 36", "Black Grey / S", "Rust / 36"), single line-total price, swapped remove/price rows (X top-right, price bottom-right), content-sized quantity stepper, hidden column headers present in DOM (PRODUCTAFBEELDING/PRODUCT/TOTAAL/AANTAL) for screen-reader association, "Mijn winkelwagen" heading with hairline separator, borderless panel. Confirmed 2026-08-11 with a real 3-line-item cart (desktop 1440px).
- [x] 5.4 Multi-quantity line total verified correct (Diva qty 2 → €120,00, not €60,00 per-unit; qty increment to 3 → €180,00, recalculated live with no wrap). Discounted-price (`original_line_price != final_line_price`) scenario could not be produced live — a Shopify discount code created via Admin API applied at order level, not per-line, despite `customerGets.items.all: true` (a Shopify discount-API quirk, not a theme issue). Verified instead by code inspection: the compact price CSS targets the shared `.cart-drawer .cart-item__price-wrapper .price` class, which both the current-price `<span>` and struck-through `<s>` elements share identically, so the rule is structurally guaranteed to apply to both.
- [x] 5.5 Verified at a true 390×844 mobile viewport (device-emulated): identical label-free options, compact stepper, single price, hidden headers, borderless panel; no horizontal overflow (`scrollWidth === clientWidth === 390`).
- [x] 5.6 Mobile hamburger menu drawer verified unaffected: full-bleed edge-to-edge layout, standard Dawn spacing, none of the cart-drawer's border/gutter/heading overrides leaked in (confirms the `.cart-drawer` scoping prefix works).
- [x] 5.7 Console clean (no errors/warnings after cart population). Remove-button click removed the correct line item and recalculated the total live. Quantity +/- buttons updated price and total live with no layout breakage, including after a mid-session viewport switch.
