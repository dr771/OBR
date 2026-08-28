## Context

`wishlist-integration` shipped and was live-verified on 2026-08-12, but only ever against wishlist items saved from a PDP — which always carry a resolved variant. An item saved from a **PLP card** carries none, and Wishlist King renders that item down a different path: placeholder `<option>`s, a disabled CTA, and the raw Shopify option name printed as the prompt. That path was broken in four independent ways, one of which made adding from the cross-sell impossible rather than merely ugly.

Two sibling projects already have a working version of this row — SweatyBetty (`assets/custom.css`, `.sb-cart-wishlist`) and Holster (`assets/style.css`, `.cart-wishlist-section`). OB's rules were written fresh rather than ported, and dropped two defenses both siblings carry.

Constraints: WK is a third-party app whose DOM and stylesheet are not ours to edit, its cards are rendered by lit and re-render asynchronously, and the whole cross-sell lives inside `<cart-drawer-items>`, which Dawn replaces wholesale on every cart mutation.

## Goals / Non-Goals

**Goals:**
- Adding to cart from a cross-sell card works for a PLP-saved item, in-drawer, without navigation.
- The compact row holds its layout in WK's disabled/placeholder state at drawer width.
- No raw Akeneo key is ever visible, in either the bracketed or the bracketless form.
- The above survives the drawer re-rendering itself.

**Non-Goals:**
- Restyling the cross-sell beyond what these states require — the shipped compact look stands.
- Changing WK configuration, its app embeds, or its `product-options="dropdowns"` mode.
- Auto-resolving a single-value option on the shopper's behalf. WK already hides such a picker; the theme only asserts it.

## Decisions

**Fix Dawn's over-broad quantity validation in `assets/cart.js`, not in `ob-wishlist.js`.**
`CartItems` binds `change` on the whole element, so WK's option `<select>`s reached `validateQuantity`, which read `dataset.min` / `max` / `step` that don't exist, failed `value % NaN !== 0`, and called `setCustomValidity()` on that select. The WK form then failed interactive validation permanently: no `submit` event was ever dispatched — `form.requestSubmit()` also silently no-ops — so the move-to-cart intercept never ran and nothing reached `/cart/add`. The defect is Dawn treating any descendant control as its own, so the guard belongs there (`event.target.matches('.quantity__input')`) and protects any other widget rendered into the drawer. *Alternative rejected:* stopping `change` propagation at the cross-sell boundary from `ob-wishlist.js` — it leaves the underlying bug live for the next widget and risks starving a WK listener bound above the wrapper.

**Force the CTA's sizing over WK's `[disabled]` rule with `!important`.**
WK's own stylesheet sizes `.wk-cta-button[disabled]` at `width: 100%` / `45px`, which outspecifies a plain descendant selector and let the disabled CTA consume the entire row, squashing the pickers to `0px`. This is precisely why SB's and Holster's rules are `!important` throughout; it was a load-order defense, not stylistic noise. *Alternative rejected:* raising specificity with a longer selector chain — it would have to be re-raised for every WK state we haven't seen yet.

**`grid-template-columns: 8rem minmax(0, 1fr)`.**
A grid track's automatic minimum is its content's max-content size, and the option row is `flex-wrap: nowrap`, so the card widened past the drawer instead of letting the pickers ellipsize. SB already had `minmax(0, 1fr)`.

**Read the raw key from `select.name`, and substitute only inside four known elements.**
Translate & Adapt strips the Akeneo brackets before the storefront (`options[shoe_size_eu]`), so the existing bracket-token rewriter never matched. Scanning all card text for a bare key like `color` would mangle a product title such as "Color Block Tee", so substitution is confined to the picker's label, its placeholder option, its displayed value, and its form's CTA label. Every rewrite is idempotent, so the mutation it triggers on itself converges in one extra pass.

**Collapse a showing placeholder to the bare label.**
`Selecteer kleur` and `Selecteer maat` side by side in a 235px row both ellipsize to `Selecte…`, which tells the shopper nothing. The bare label reads as a prompt, matches the PDP's own "Maat" wording, and the CTA keeps the full sentence for assistive tech.

**Size a picker from what it can actually display, measured with an off-screen ruler span.**
While the placeholder shows, only the label needs to fit — sizing an unchosen colour picker to `Cherry Blossom` squeezed the size picker beside it down to `M…`. Once a value is chosen, the widest selectable value sets the width so the control stops resizing as the shopper cycles. Canvas `measureText` ignores letter-spacing and came out ~3px short per label, just enough to ellipsize `Maat`; a hidden span carrying the real computed font measures exactly.

**Re-attach the overlay's observers off a `document.body` observer.**
The drawer replaces `<cart-drawer-items>` wholesale on every cart mutation, so the observers were left watching a detached node and the overlay silently stopped after the first add. A body-level `childList`/`subtree` observer re-attaches to any new container, with the passes coalesced into one `requestAnimationFrame`. This mirrors `ob-card-swatches.js`, which is document-delegated for the same reason.

## Risks / Trade-offs

- **A body-level observer fires on every DOM change on the page.** → Work is coalesced into a single `requestAnimationFrame`, and each pass is a cheap `querySelectorAll` that finds nothing when no cross-sell is present.
- **Guarding `onChange` narrows Dawn's validation to `.quantity__input`.** → That is the only control Dawn renders with the `data-index` / `min` / `max` / `step` attributes `validateQuantity` reads; anything else was already being mis-validated. Verified present in `cart-drawer.liquid`, `quantity-input.liquid` and `main-cart-items.liquid`.
- **The overlay rewrites text WK owns, so a future WK version could re-render over it.** → The observer re-applies on WK's own mutations, and every consumer stays fail-open: if the shapes stop matching, the raw key reappears but nothing breaks.
- **Setting the placeholder `<option>`'s text also changes its `value`** (it has no `value` attribute). → It is `disabled` and unselectable by the shopper, and the CTA is disabled while it is selected, so it can never be submitted.
- **Not measured at a true 390px viewport** — Chrome's minimum window width is 500px, so the mobile case was verified at the drawer's 357px content width, which is narrower than a 390px phone's drawer would be.
