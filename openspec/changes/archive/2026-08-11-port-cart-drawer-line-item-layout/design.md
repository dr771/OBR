## Context

`snippets/cart-drawer.liquid` currently renders each line item as Dawn's stock 4-column CSS grid row (`.cart-drawer .cart-item { display: grid; grid-template: repeat(2, auto) / repeat(4, 1fr); }`, defined in `assets/component-cart-drawer.css`, no media-query gate — the drawer is always narrow):

- Row 1: media (col 1, spans both rows), details/title+options (`.cart-item__details`, cols 2–3), totals/price (`.cart-item__totals`, auto-placed col 4)
- Row 2: quantity stepper + remove button (`.cart-item__quantity`, explicit cols 2–5)

OB's file already diverges from Dawn's baseline in one place unrelated to this spec: `.cart-item__title` wraps the title `<a>` together with a `render 'cart-disclosure-indicator'` call (a separate, already-shipped OB feature). That wrapper is preserved untouched; this change only restructures the option list, price, and remove-control markup around it.

SB shipped this exact capability on the same Dawn base (`../SweatyBetty/openspec/changes/archive/2026-07-12-cart-drawer-line-item-layout/`) — see that change's own design.md for the original DOM-move rationale, which this design follows directly. See proposal.md for why this is next in OB's port queue.

## Goals / Non-Goals

**Goals:**
- Match SB's shipped behavior 1:1 (all 8 requirements in the accompanying spec delta).
- Keep OB's existing `cart-item__title`/`cart-disclosure-indicator` markup intact.
- Land the CSS in `assets/component-cart-drawer.css` (Dawn's own file for this component) rather than introducing a new `assets/custom.css` — OB has no such file today, and its established convention for component-scoped overrides (see `plp-filter-panel-chrome`'s edits to `assets/component-facets.css`) is editing the relevant Dawn component file directly.
- Ship the `config/settings_data.json` `cart_type` flip (`"notification"` → `"drawer"`) alongside the code, since the drawer this change edits is otherwise unreachable on the storefront today.

**Non-Goals:**
- No changes to `sections/main-cart-items.liquid` (full `/cart` page) or `sections/cart-notification-product.liquid` (the notification popup) — both render their own option/price markup and are out of scope, matching SB's spec.
- No changes to `cart-remove-button` or `quantity-input` custom element JS behavior — only DOM position/icon changes, not event wiring.
- No pill/rounded-corner treatment — sharp corners stay sitewide (`--inputs-radius: 0`).
- Not pulling in SB's `sb-wishlist-cross-sell` drawer markup — that's the separate `wishlist-integration` capability, still open in OB's reuse ledger.
- Not touching `de.json`/`fr.json`/other inactive locale files — only `en.default.json` (schema/fallback source) and `nl.json` (OB's actual served locale, same pattern as SB) get the heading copy change.

## Decisions

**Swap via DOM move, not CSS reordering.** The remove-button markup (`<cart-remove-button>...</cart-remove-button>`) moves from inside `.cart-item__quantity-wrapper` into `.cart-item__totals` (row 1, replacing the price markup that was there). The price markup (`.cart-item__price-wrapper` and its discounted/unit-price logic) moves from `.cart-item__totals` into `.cart-item__quantity-wrapper` (row 2, appended after the quantity-popover-container). Both `<td>`s keep their existing grid placement — only their *contents* change, so no grid-template edits are needed. Rejected alternative: `order`/`grid-row` CSS reordering without moving markup — the remove button and price both carry per-item state (`data-variant-id`, `data-index`, discount markup) that's easiest to reason about co-located with the column semantics it visually represents, and pure CSS reordering would fight the table's `headers`/`role="cell"` structure for no benefit.

**OB's option-list restructuring targets the `<dl>` SB already flattened.** OB's current markup wraps each option in its own `product-option`/`dt`/`dd` block inside a shared `<dl>`. The port replaces that per-option loop with a single `<p class="product-option cart-item__variant-options">` joining `option.value` with " / " (dropping `option.name`/`dt`/`dd` entirely for options), while leaving the separate line-item `<dl>` for user-entered properties untouched — matching SB's shipped structure exactly.

**Icon swap is a one-line asset change.** `icon-remove.svg` → `icon-close.svg` on the existing `<cart-remove-button>` button; the button's classes, aria-label, and JS-bound custom element are untouched.

**Quantity width via `width: fit-content`, scoped to the drawer, in `assets/component-cart-drawer.css`.** Dawn's base `.quantity` rule (in `assets/base.css`) sets a fixed width; add `.cart-drawer .cart-item__quantity-wrapper .quantity { width: fit-content; }` to `component-cart-drawer.css` instead — same scoping SB used, different host file per the OB convention above.

**Price right-alignment in row 2 via `margin-left: auto`.** `.cart-item__quantity-wrapper` is already `display: flex`; the moved-in price wrapper gets a scoped class (`.cart-item__quantity-price`) with `margin-left: auto` so it sits at the far right of the row regardless of how narrow the (now content-sized) quantity stepper is.

**`.cart-item__totals` needs a `pointer-events: auto` override for the relocated remove button.** SB discovered mid-implementation that `.cart-item__totals` carries Dawn's `pointer-events: none` (harmless while it only held a static price) — moving the interactive remove button there silently eats clicks. Port the fix directly: `.cart-drawer .cart-item__totals cart-remove-button { pointer-events: auto; }`.

**Header row hidden via `visually-hidden` on the `<th>` elements themselves**, not just their text — same as SB. OB's "Product"/"Total" `<th>`s currently render visible text directly (not wrapped in a `<span>` like the image/quantity columns already are); apply `class="visually-hidden"` directly to those two `<th>` elements so they fully leave visual flow (collapsing the border-bottom line) while staying in the DOM for the `headers="CartDrawer-ColumnProduct"`/`headers="CartDrawer-ColumnTotal"` accessibility association. Rejected alternative: `display: none` on the header row — removes the cells from the accessibility tree entirely, breaking that association.

**Heading rename touches two locale files**, matching SB: `en.default.json`'s `sections.cart.title` ("Your cart" → "My cart") and `nl.json`'s `sections.cart.title` ("Je winkelwagen" → "Mijn winkelwagen") — OB's storefront default locale is Dutch, matching SB's own situation.

**`cart_type` flip lands in this change, not a separate migration note.** Unlike SB (where the drawer was presumably already the active cart UI), OB's `config/settings_data.json` currently has `cart_type: "notification"`. Without flipping it to `"drawer"`, none of this change's markup renders on Add-to-Cart at all. This is a shop-side setting that happens to be tracked in the repo's `settings_data.json` (unlike most shop-side config, which lives only in the live shop) — so it ships as a file edit in this change rather than a MIGRATION-TO-LIVE.md checklist line. No migration entry needed since the setting travels with the theme file itself.

**Test data note (not a design decision, a verification constraint):** Nick's ERP stock sync isn't wired yet, so live verification sets stock directly in Shopify admin/API on a couple of test variants — same "pipeline test data" caveat that already applies to the rest of the dev catalog (see MIXED-SHOPS-PLAYBOOK.md).

## Risks / Trade-offs

- [Moving the price into the flex-based quantity row could wrap awkwardly on very narrow drawers if a discounted-price block (old + new price stacked) is present] → verify visually with both a plain-price and a discounted-price item before calling this done.
- [Hiding the header row's visible text could reduce scannability for sighted users who relied on "Total" to know a number is a price] → accepted, matching SB's shipped decision; the price already carries a `€` currency symbol so context isn't lost.
- [Flipping `cart_type` to `"drawer"` changes the Add-to-Cart experience sitewide on this dev shop, not just for this one feature] → acceptable: this whole shop is the dev environment and never goes public under the real domain (per CLAUDE.md Current Status), and the notification popup was never a deliberate OB decision — it's Dawn's unconfigured default.
- [OB's option-list restructuring touches markup shared with the property-list `<dl>` immediately below it] → keep the property loop's own `<dl>` wrapper and per-property `dt`/`dd` structure completely unedited; only the options loop changes shape.
