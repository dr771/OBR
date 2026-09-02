## Why

The standalone Wishlist King page at `/apps/wishlist` is rendered entirely by WK's own `<wishlist-page>` custom element and, apart from a 7-line desktop content-edge inset, still carries WK's raw defaults — serif/Arial type, unstyled dropdowns, a plain black square CTA, and un-tinted product photos. The cart-drawer wishlist cross-sell already received the theme's polish (image blend/radius, dropdown sizing, CTA color tokens) under this same capability; the standalone page is the one surface still visibly off-brand.

## What Changes

- Product-card grid: WK's own undocumented native grid columns replaced with a deterministic responsive grid (2 cols below 750px, 3 cols 750–989px, 4 cols from 990px), capped so a card is no wider than an equivalent-viewport PLP card; outer page shell capped at 1200px (was WK's native 1600px).
- Product photo treatment matched to the PLP card system: `#f1f5f9` tinted surface background, `mix-blend-mode: multiply`, `1.6rem` border-radius.
- Card meta typography (vendor label, product title, price) matched to PLP card-meta values; redundant trailing ISO currency code stripped from prices ("€100,00 EUR" → "€100,00").
- Variant option pickers replaced with PLP/PDP-style single-row rails — colour options as real variant-photo swatch chips, other options (size) as box chips — reusing the theme's existing shared rail chrome/tooltip JS unmodified. WK's native `<select>` elements stay in the DOM (hidden) and remain the actual mechanism driving variant resolution, price/image updates, and add-to-cart; a rail click proxies into that same interaction rather than reimplementing it. Rail availability stays synced to what WK itself resolves.
- CTA button (`.wk-cta-button`) restyled as a labeled pill using the theme's `--ob-button-*` tokens (dark fill, `#1e9fe6` hover), sized to share its row with a themed trash-icon remove-from-wishlist control — a deliberate departure from the cross-sell's icon-only 32px CTA and WK's native floating "X", since a full page has room for a labeled primary action plus an inline remove control.
- Page header (`.wk-title`, `.wk-controls`, `.wk-login-callout`) restyled from WK's raw Fraunces/Arial defaults to the theme's body font family and ink color tokens.
- Changes: additive CSS in `assets/component-ob-wishlist.css`; a small, additive selector-broadening edit to the shared `assets/ob-wishlist.js` (reusing its existing remove-button injection for this page); a new page-scoped `assets/ob-wishlist-page-rails.js`; and conditional (`request.path contains '/apps/wishlist'`) asset includes in `layout/theme.liquid` for that new file plus three already-shipped, unmodified PDP/PLP rail assets (`component-ob-swatches.css`, `component-ob-option-rail.css`, `ob-swatch-tooltip.js`, `ob-option-rail.js`). No changes to the cart-drawer cross-sell's own files (`component-cart-drawer.css`, `ob-cart-wishlist.liquid`, `ob-wishlist-cross-sell.liquid`), which a parallel workstream is actively touching on `/cart` — confirmed via live regression checks after each round that its dropdowns/CTA remain pixel-identical.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `wishlist-integration`: requirement "Standalone wishlist page aligns with the theme content edge" gains new SHALL-level behavior — product-card grid layout, product-photo treatment, card meta typography, dropdown styling, CTA styling, and page-header typography for the standalone `/apps/wishlist` page — in addition to the existing content-edge inset.

## Impact

- `assets/component-ob-wishlist.css` — extended.
- `assets/ob-wishlist.js` — one selector broadened (remove-button injection now also matches this page).
- `assets/ob-wishlist-page-rails.js` — new file.
- `layout/theme.liquid` — new conditional asset includes, guarded to `/apps/wishlist` only.
- `openspec/specs/wishlist-integration/spec.md` — requirement updated via delta spec.
- No impact to the cart-drawer/`/cart` wishlist cross-sell (still native dropdowns, still its own files unmodified), PDP wishlist toggle, header wishlist badge, or the Akeneo option-parser patch — all out of scope and unmodified, confirmed live.
