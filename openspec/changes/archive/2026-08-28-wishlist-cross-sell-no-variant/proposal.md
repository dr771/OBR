## Why

An item saved to the wishlist from a **PLP card** carries no variant, so the cart-drawer cross-sell renders it in Wishlist King's placeholder/disabled state — a state no PDP-added item ever reaches, and one the shipped `wishlist-integration` work was never exercised against. In that state the cross-sell was unusable: the option pickers collapsed to 0px wide, the card overflowed the drawer horizontally, the pickers were labelled with the raw Akeneo key (`Selecteer shoe_size_eu`), and the move-to-cart CTA silently did nothing at all — no request, no error. Since the PLP heart is the primary way shoppers save products, this was the common path, not the edge case.

The code fix is already implemented and live-verified on theme `148245381229`. This change records the behavior in the spec, because two of the fixes alter what `wishlist-integration` documents rather than only how it is implemented.

## What Changes

- **Raw option keys are read from `select.name`, not matched as bracket tokens.** Translate & Adapt strips the Akeneo brackets before the storefront sees them, so select names arrive as `options[shoe_size_eu]`, not `options[[shoe_size_eu]]`. The existing bracket-token rewriter never fired on them, leaving the raw key visible in the picker label, the placeholder, and the disabled CTA. The overlay now derives each key from its own select and substitutes only inside those elements.
- **A compact cross-sell picker's placeholder collapses to the bare label.** It reads `Kleur` / `Maat` rather than `Selecteer kleur` / `Selecteer maat`, so two unselected pickers side by side in a drawer-width row do not both ellipsize to `Selecte…`. The CTA keeps the full sentence for screen readers. This narrows the existing "CTA interpolation" requirement, which currently describes the sentence form everywhere.
- **The cross-sell row holds its compact layout in the no-variant state.** WK's own `.wk-cta-button[disabled]` rule sizes the CTA `width: 100%` / `45px`; the option row must survive that and the card must not widen past the drawer.
- **The label overlay survives the drawer's wholesale re-render.** The cart drawer replaces `<cart-drawer-items>` on every cart mutation, discarding the node the overlay's observers were attached to.
- **Dawn's `cart-drawer-items` quantity validation no longer touches third-party controls.** Its `change` listener was calling `setCustomValidity()` on WK's option `<select>`s, which made the WK form fail interactive validation permanently — no `submit` event was ever dispatched, so the documented move-to-cart intercept could never run.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `wishlist-integration`: the display-label requirement gains the bracketless-key case and the bare-label placeholder for compact cross-sell pickers; the cross-sell requirement gains the no-variant layout and post-re-render guarantees, and states that theme cart code must not invalidate WK's form controls.

## Impact

- `assets/ob-wishlist.js` — label overlay reads keys from `select.name`, collapses compact placeholders, re-attaches observers off a `document.body` observer, measures option widths with an off-screen ruler span instead of canvas `measureText`.
- `assets/component-cart-drawer.css` — CTA sizing declarations forced over WK's `[disabled]` rule, card grid `minmax(0, 1fr)`, single-line ellipsized picker text, single-value pickers hidden, measured picker widths replacing the fixed size-picker clamp.
- `assets/cart.js` — `CartItems.onChange` guarded to Dawn's own `.quantity__input` controls. Affects the cart page and cart drawer, not just the wishlist.
- No shop-side configuration, metafield, or app-setting dependency is introduced.
