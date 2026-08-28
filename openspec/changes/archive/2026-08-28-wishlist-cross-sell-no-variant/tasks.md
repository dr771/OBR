## 1. Unblock adding to cart

- [x] 1.1 Guard `CartItems.onChange` in `assets/cart.js` to `event.target.matches('.quantity__input')`, so Dawn's quantity validation stops calling `setCustomValidity()` on WK's option `<select>`s
- [x] 1.2 Confirm `.quantity__input` is the class Dawn actually renders on its quantity controls in `snippets/cart-drawer.liquid`, `snippets/quantity-input.liquid` and `sections/main-cart-items.liquid`
- [x] 1.3 Verify live that `form.checkValidity()` is `true` for a cross-sell card with a resolved variant, and that clicking its CTA fires a `submit` the intercept handles

## 2. Hold the compact row in the no-variant state

- [x] 2.1 Force `.wk-cta-button` sizing (`flex`, `display`, alignment, `width`, `height`, `min-height`, `padding`) and `.wk-cta-label { display: none }` with `!important` in `assets/component-cart-drawer.css`, over WK's `[disabled]` rule
- [x] 2.2 Change the card grid to `8rem minmax(0, 1fr)` so the nowrap option row ellipsizes instead of widening the card
- [x] 2.3 Give `.wk-control .wk-text` `white-space: nowrap` + `overflow: hidden` + `text-overflow: ellipsis` and the compact font size, so a long placeholder can't wrap to two lines
- [x] 2.4 Hide `wk-option-select.wk-single-option`, matching SB and Holster
- [x] 2.5 Replace the fixed 5.5rem size-picker clamp with a `min-width` floor plus the JS-measured width

## 3. Labels and widths

- [x] 3.1 Add `rewriteRawKeys` to `assets/ob-wishlist.js`: read each key from `select.name`, substitute only inside the picker's label, placeholder option, displayed value, and the form's CTA label
- [x] 3.2 Collapse a showing placeholder to the bare label ("Kleur", "Maat"), leaving the CTA's full sentence intact
- [x] 3.3 Measure option widths with an off-screen ruler span instead of canvas `measureText`, and size from the label alone while the placeholder shows
- [x] 3.4 Re-attach the overlay's observers off a `document.body` observer, coalescing passes into one `requestAnimationFrame`

## 4. Verify on the active theme

- [x] 4.1 Push `assets/cart.js`, `assets/component-cart-drawer.css` and `assets/ob-wishlist.js` to theme `148245381229` with `--only`
- [x] 4.2 Verify a PLP-saved item in the drawer: pickers read "Kleur"/"Maat" unclipped, CTA is a 32×32 square, `cart__contents` `scrollWidth === clientWidth`
- [x] 4.3 Verify choosing every option resolves a variant id and enables the CTA
- [x] 4.4 Verify move-to-cart adds in-drawer with no navigation, and removes the item from the wishlist
- [x] 4.5 Verify a second cross-sell card still shows display labels and sized pickers after the drawer has re-rendered

## 5. Documentation

- [x] 5.1 Record the four traps in project memory (`ob-wishlist-cross-sell-traps`)
- [x] 5.2 Extend the `wishlist-integration` bullet in `CLAUDE.md` with the fixes and the reason each was invisible until now
- [x] 5.3 Sync the delta into `openspec/specs/wishlist-integration/spec.md` by archiving this change
