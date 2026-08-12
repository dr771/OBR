## Context

OB's `sections/predictive-search.liquid`, `snippets/header-search.liquid`, and `assets/component-predictive-search.css` are currently stock Dawn (diffed byte-identical against SB's clone of the same base files except for the product-loop markup, confirmed this session). SB already shipped this exact capability as `predictive-search-overlay` (archived 2026-07-10, two follow-up refinement changes since), with all custom CSS living in `assets/custom.css`. OB does not use a `custom.css` file — CSS additions for shipped capabilities go into new per-capability `component-ob-*.css` files instead (established by `component-ob-plp.css`, `component-ob-swatches.css`). OB's Dawn base is also slightly newer/different than SB's: OB's product loop wraps each result `<a>` in `<product-component view-event-payload="...">`, which SB's clone does not have.

## Goals / Non-Goals

**Goals:**
- Match SB's shipped desktop/mobile predictive-search layout, imagery, heading, hover, and conditional-action behavior exactly.
- Add the search-vs-Wishlist-King stacking fix, adapted to confirm it doesn't regress OB's cart drawer precedence (OB's cart drawer is `z-index: 1000` in `component-cart-drawer.css`, comfortably above the `z-index: 10` stacking bump this change introduces).
- Land all new CSS in a new OB-convention file rather than reviving a `custom.css` pattern.

**Non-Goals:**
- No JavaScript changes. `assets/predictive-search.js` differences between OB and SB observed this session (a `SearchUpdateEvent`/`dispatchSearchUpdateEvent` block present in OB but not SB) are unrelated Dawn-version drift, not part of this capability, and are left untouched.
- No change to `assets/component-predictive-search.css` or `snippets/header-search.liquid` — both already carry the `.predictive-search--header` hook this capability relies on, as stock Dawn.
- No app/admin dependency — this is a theme-only port, same as SB's version.

## Decisions

**New file `assets/component-ob-search.css` instead of reviving `custom.css`.** OB deliberately avoids a monolithic custom stylesheet (per `cart-drawer-line-item-layout` and `wishlist-integration` precedent, which each landed CSS in a scoped file). A dedicated file keeps this capability's ~40 lines of CSS independently greppable and removable, consistent with `component-ob-plp.css` / `component-ob-swatches.css`.

**Preserve OB's `<product-component>` wrapper.** SB's markup restructuring (limit 8, srcset image, new heading key, conditional action block) is ported around the existing wrapper rather than replacing it — dropping it would silently disable whatever view-event tracking that newer Dawn component provides. The wrapper only surrounds the `<a>`; none of SB's changes touch what's inside it in a way that conflicts.

**Stacking fix ported as-is (`z-index: 10` on `.section-header:has(.header__search details[open])`).** Confirmed OB's cart drawer is `z-index: 1000` (`component-cart-drawer.css:3`), so this bump can't invert cart-vs-search precedence. Wishlist King hearts are `z-index: 9` per SB's comment; 10 is the minimal bump that clears them without approaching the cart drawer's range.

## Risks / Trade-offs

- [Risk] OB's newer Dawn base could have other markup deltas in `predictive-search.liquid` beyond the `product-component` wrapper that surface only once the port is applied. → Mitigation: apply the port as a direct diff-informed edit (not a blind file copy) and theme-check the result before verify.
- [Risk] The `:has()` selector for the stacking fix requires a browser that supports `:has()` (all evergreen browsers do; already used elsewhere in SB's shipped CSS with no reported issue). → Accepted, matches existing project browser-support bar.
