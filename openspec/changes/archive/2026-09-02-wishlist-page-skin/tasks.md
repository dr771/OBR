## 1. Product grid and photo treatment

- [x] 1.1 Append the `.wk-grid` responsive grid rule (2/3/4 columns at <750px / 750-989px / >=990px) to `assets/component-ob-wishlist.css`, scoped `#MainContent > wishlist-page .wk-grid`
- [x] 1.2 Append `.wk-image-link`/`.wk-image` rules for the tinted surface, `mix-blend-mode: multiply`, and `1.6rem` border-radius, matching `component-ob-swatches.css`'s PLP card-media tokens

## 2. Card meta typography

- [x] 2.1 Append `.wk-meta`/`.wk-vendor`/`.wk-product-title`/`.wk-price` typography rules matching PLP card-meta values (vendor label uppercase/low-emphasis, product name medium-weight)

## 3. Variant dropdowns

- [x] 3.1 Append `.wk-variants`/`.wk-control`/`.wk-variants select` rules reusing the cart-drawer cross-sell's border/ink-alpha color tokens, sized 4rem tall for a full-width stacked layout
- [x] 3.2 Confirm no rule is needed for `.wk-single-option`/`.wk-label`/`.wk-quantity` (already `display:none` by WK's own default on this page — verify live before skipping)

## 4. CTA button

- [x] 4.1 Append `.wk-cta-button` rules for the full-width labeled pill using `--ob-button-*` tokens (dark fill, `#1e9fe6` hover, pill radius), covering enabled, hover/focus-visible, and `[disabled]` states
- [x] 4.2 Add a `prefers-reduced-motion: reduce` override for the CTA's background transition

## 5. Page header typography

- [x] 5.1 Append `.wk-title` rule overriding WK's default serif font to the theme's body font family, sized to the sitewide heading scale
- [x] 5.2 Append `.wk-login-callout`/`.wk-controls .wk-button` rules overriding WK's default Arial font to the theme's body font family and ink color tokens

## 6. Deploy and verify

- [x] 6.1 Push only `assets/component-ob-wishlist.css` to theme `148245381229` with `--only`
- [x] 6.2 Verify live via Chrome DevTools MCP at 1600px/990px/750px/390px: grid column counts, image treatment, CTA enabled and disabled states, header font-family no longer resolving to Fraunces/Arial
- [x] 6.3 Verify the floating `remove-button` still tracks each card's top-right corner at all four widths
- [x] 6.4 Regression check: confirm the cart-drawer/`/cart` wishlist cross-sell renders pixel-identical to before (proves `#MainContent > wishlist-page` scoping held, no collision with parallel `/cart` work)
- [ ] 6.5 If a sale-priced item can be saved to the wishlist, check whether `.wk-price`'s empty comment slots render a compare-at price span; extend the price typography rule if so — **not verifiable**: both test-catalog items in the current wishlist are at full price (no sale item available to save), and `.wk-price`'s comment nodes turned out to be Lit's own template markers, not evidence of an unrendered compare-at span. Left unchecked; revisit once a sale-priced product exists to save.

## 7. Revision: narrower container, compact dropdowns/CTA, trash-icon remove control

- [x] 7.1 Cap `.wk-page` at `max-width: 1200px; margin-inline: auto` (was the app's native 1600px), reduce the ≥990px inset from 5rem to 3rem
- [x] 7.2 Reduce `.wk-grid` column/row gaps at ≥990px from 2.4rem/3.6rem to 1.6rem/3.2rem
- [x] 7.3 Revert `.wk-variants` from a stacked full-width column to the cross-sell's row-wrap layout; reduce `.wk-control`/`select` height from 4rem to 3.2rem, width auto with a 5.5rem min-width
- [x] 7.4 Reduce `.wk-cta-button` from `min-height: 4.4rem` full-width-alone to `min-height: 3.6rem`, sized to share a grid row with the remove control
- [x] 7.5 Restructure `.wk-form` as `display: grid` with explicit `grid-column`/`grid-row` placement for `.wk-variants` (row 1, full width), `.wk-cta-button` and the remove control (row 2)
- [x] 7.6 Hide WK's native floating `remove-button` (`display: none`) on `#MainContent > wishlist-page`
- [x] 7.7 Broaden `injectButtons()` in `assets/ob-wishlist.js` to also match `#MainContent > wishlist-page .wk-form`, reusing the existing cloned remove-button template and its already-shipped (unscoped) CSS from `component-cart-drawer.css`
- [x] 7.8 Verify live: card width (273px @ 1600px viewport) is no larger than the PLP grid's own resolved card width (267px @ 1519px viewport)
- [x] 7.9 Verify live: native "X" hidden, themed trash icon present and positioned immediately right of the CTA on both test cards
- [x] 7.10 Regression check: cart-drawer cross-sell CTA/controls/remove button still render exactly as before (32px square CTA, 0 radius, `display:flex` form) after the shared `ob-wishlist.js` edit

## 8. Second revision: redundant currency code, dropdown font, forced one-line pickers

- [x] 8.1 Add `stripCurrencySuffix()` to the label-overlay IIFE in `assets/ob-wishlist.js`, called from `overlayAll()` for both `wishlist-page` and `.ob-wishlist-cross-sell` roots — strips a trailing 3-letter ISO code from `.wk-current-price` text nodes ("€100,00 EUR" → "€100,00")
- [x] 8.2 Add `font-family: var(--font-body-family) !important` to `.wk-variants select` and `.wk-variants select option` (WK's native `<select>` was rendering Arial; the visible `.wk-text` label was already correctly inheriting Inter)
- [x] 8.3 Force `.wk-variants` to always render as one row: `flex-wrap: nowrap`, pickers `flex: 1 1 0; min-width: 0` (share width, shrink instead of wrapping to a second line), `.wk-control` `width: 100%; min-width: 0` (was a fixed `min-width: 5.5rem` that could force a wrap)
- [x] 8.4 Verify live: price reads "€100,00" (no EUR) on both wishlist cards and confirmed the same fix also cleaned up the cart-drawer cross-sell's price display
- [x] 8.5 Verify live: `.wk-variants select` computed `font-family` resolves to Inter, not Arial
- [x] 8.6 Verify live at 1440px and 390px: FitFlop card's two pickers (Kleur/Maat) stay on one row at both widths, including the narrowest mobile card (~172px)
- [x] 8.7 Regression check: cart-drawer cross-sell CTA (32px) and `.wk-variants` (`display:flex`) unchanged after this round's shared `ob-wishlist.js` edit

## 9. Third revision: PLP/PDP-style option rails replacing native dropdowns

- [x] 9.1 Add conditional (`request.path contains '/apps/wishlist'`) includes in `layout/theme.liquid` for `component-ob-swatches.css`, `component-ob-option-rail.css`, `ob-swatch-tooltip.js`, `ob-option-rail.js`, and new `ob-wishlist-page-rails.js` — guarded rather than global, since `ob-swatch-tooltip.js` has no idempotency guard and would double-register on any page that also renders a PDP/PLP card
- [x] 9.2 Create `assets/ob-wishlist-page-rails.js`: per card, resolve the product handle from its link, fetch `/products/<handle>.js` (cached per handle), and build one rail per non-single-option `wk-option-select` — colour options as `.ob-swatch-input-wrapper` image chips (variant image matched by option position, mirroring `ob-swatch-input.liquid`), other options as `.product-form__input--size-grid` box chips — both wrapped in the shared `.product-form__option-rail-shell`/`[data-ob-option-rail]` markup so `ob-option-rail.js` and `ob-swatch-tooltip.js` pick them up unmodified
- [x] 9.3 Wire each rail's `change` (radio click) to set the underlying native `<select>`'s value and dispatch a real `change` event, and add an availability-sync pass that mirrors each `<option disabled>` flag onto the matching radio after any change
- [x] 9.4 Drive rail building/syncing off a `MutationObserver` + `requestAnimationFrame`-debounced scan, matching the existing pattern in `ob-wishlist.js`; insert the rail container as a sibling of `.wk-variants` (proven-stable DOM position) and hide `.wk-variants` via CSS
- [x] 9.5 Add chip/box geometry overrides to `assets/component-ob-wishlist.css` (colour chip 5rem/0.8rem tinted, size box 4.4rem) scoped under `#MainContent > wishlist-page`, reusing the PDP's exact values; hide `.wk-variants`; place `.ob-wishlist-rails` in the existing CTA-row grid's slot
- [x] 9.6 Fix: first version's product fetch used `credentials: 'omit'`, which drops the storefront password cookie on this password-protected dev store and returns the password-splash HTML instead of JSON — every chip silently fell back to "no image". Removed the override (default `same-origin` credentials).
- [x] 9.7 Verify live: real click on a colour chip updates the underlying select, WK's own price/CTA state, and (once size is also picked) the card's main photo — confirms this also resolves the originally reported "color changing not working" issue by removing the native-select interaction path entirely
- [x] 9.8 Verify live: picking a colour on the 8-colour/11-size Hi-Tec item correctly disables now-unavailable sizes in the size rail (availability sync working)
- [x] 9.9 Verify live at 1440px and 390px: chips/boxes render correctly with working chevrons and edge fades at both widths
- [x] 9.10 Regression check: confirm the four new assets load only on `/apps/wishlist` (absent from `/cart`'s `document.scripts`/`document.styleSheets`) and the cart-drawer cross-sell's dropdowns/CTA are pixel-identical afterward

## 10. Fourth revision: bare radio dots and visible scrollbar track

- [x] 10.1 Fix: size-box radios had no hiding class (unlike colour radios, which already used `.ob-swatch-input__radio`'s `position:absolute; opacity:0` rule) — Dawn's actual native radio-hiding is keyed to `.product-form__input--pill`, a class the rail's box markup never carried, so the raw circle rendered next to each box. Added `visually-hidden` (Dawn's standard clip-based utility, focusable/clickable via its `<label for>`) to each size radio in `buildSizeRail()`.
- [x] 10.2 Hide the rail's native horizontal scrollbar track (`scrollbar-width: none`, `::-webkit-scrollbar { display: none }`) scoped to `#MainContent > wishlist-page .product-form__option-rail` — the shared `component-ob-option-rail.css` deliberately keeps a thin visible scrollbar for the PDP, so this override stays page-scoped rather than changing that shared file
- [x] 10.3 Verify live at 1440px and 390px: no bare radio dots next to size boxes, no visible scrollbar track under either rail

## 11. Fifth revision: match PLP layout (data left-aligned, colour rail directly after main photo)

- [x] 11.1 Split rail building in `ob-wishlist-page-rails.js`: colour-kind rails now insert into a new `.ob-wishlist-color-rail` container placed directly after `.wk-image-link` (before `.wk-meta`), matching PLP's chip-under-photo layout; size/other-kind rails stay in `.ob-wishlist-rails` inside `.wk-form`, above the CTA row. `buildRailsForForm()` and `syncForm()` signatures changed to take `card` alongside `form` so both containers can be found/built.
- [x] 11.2 Left-align card meta: added `text-align: left` to `.wk-meta`, `.wk-vendor`, `.wk-product-title`, `.wk-price`/`.wk-current-price` (was WK's centered default)
- [x] 11.3 Fix: `.wk-price` is `display:flex; justify-content:center` in WK's own CSS — `text-align` has no effect on a flex container's content position, so the price stayed centered until `justify-content: flex-start` was added
- [x] 11.4 Match PLP's ~8px photo-to-chip gap: found WK's own `.wk-image-link` carries a baked-in `margin-bottom: 8px` that was stacking with the rail's own spacing (measured 12px total instead of PLP's 8px) — zeroed it (`margin-bottom: 0`) and tuned `.ob-wishlist-color-rail`'s `margin-top` to `0.4rem` so total gap (rail margin + the shared rail track's own `0.4rem` top padding) matches PLP's measured 8px exactly
- [x] 11.5 Match PLP's chevron size: PDP's shared `.product-form__option-rail-button` (which the rails were reusing as-is) is 3.2rem with a 1rem icon; PLP's own `.ob-card-swatches__button` is smaller (2.8rem/0.9rem icon) and sits flush at the rail edge (`left/right: 0`) rather than overhanging outside it. Added a page-scoped override matching PLP's exact values.
- [x] 11.6 Verify live at 1440px and 390px: colour chips render directly under the photo before the brand/title/price, meta text is left-aligned, price sits flush with the card's left edge, gap and chevron size visually match a live PLP card
- [x] 11.7 Regression check: cross-sell's `.wk-price` (unrelated, already `flex-start` from WK's own default there), `.wk-image-link` margin, and rail absence remain exactly as before — confirms every override in this round stayed scoped to `#MainContent > wishlist-page`

## 12. Sixth revision: size rail felt too messy — simple wrapping box grid instead

- [x] 12.1 Renamed/rewrote `buildSizeRail()` → `buildSizeGrid()` in `ob-wishlist-page-rails.js`: drop the rail-shell/chevron-button markup entirely for size (and any non-colour) options — returns a plain `.product-form__input--size-grid` div with the radio/label pairs as direct children, no `[data-ob-option-rail-shell]`/`[data-ob-option-rail]` attributes, so `ob-option-rail.js` has nothing to attach to for this element (colour still gets the full rail treatment, unchanged)
- [x] 12.2 Updated `syncForm()`'s `otherShells` lookup from `:scope > [data-ob-option-rail-shell]` (no longer present) to `otherContainer.children` (each size/other option's grid div is now a direct child)
- [x] 12.3 CSS: `.product-form__input--size-grid` changed from a horizontal-scroll rail to `flex-wrap: wrap`; box size reduced from 4.4rem to 3.4rem ("smaller boxes" per the request) — same checked/hover/disabled states, no chevron/scrollbar CSS needed since the element no longer carries the rail classes
- [x] 12.4 Verify live at 1440px and 390px: all size values visible at once in a wrapping grid, no scroll/chevrons, correctly wraps to multiple rows on both an 11-value and a 6-value product
- [x] 12.5 Regression check: cross-sell has no `.product-form__input--size-grid` element and its native dropdown (`display:flex`) is unchanged

## 13. Seventh revision: spacing, square size boxes, chevron vertical centering

- [x] 13.1 `.wk-form`: increased price→size-grid gap (`margin-top` 0.8rem → 1.2rem) and size-grid→CTA gap (split `gap` into `column-gap: 0.8rem` / `row-gap: 1.2rem`, was a single `gap: 0.8rem`)
- [x] 13.2 Size box `border-radius: 0` (was `0.4rem`) per request
- [x] 13.3 Fix: colour-rail chevrons sat visibly below the chip row's true vertical center. Root cause: the shared rail track's `0.4rem`/`0.7rem` top/bottom padding (component-ob-option-rail.css) reserves room for a visible scrollbar thumb; this page already hides that scrollbar (task 10.2), so the asymmetry was pure dead space pulling the chevron (centered via `top:0;bottom:0;margin-block:auto` against the *shell*, not the chip row) downward. Made the track padding symmetric (`0.4rem 0`) under the page scope — chevron center now measures within 0.01px of the chip row's center.
- [x] 13.4 Verify live: chevron vertical center matches chip-row center (measured via `getBoundingClientRect`, both ~96.77px in one check), square size boxes, visibly larger price/grid/CTA gaps, screenshot-confirmed at desktop

## 14. Eighth revision: restore PLP's real product-grid gap; size-grid gap matched to PLP's facet grid

- [x] 14.1 `.wk-grid` at ≥990px: restored `column-gap`/`row-gap` from `1.6rem`/`3.2rem` (reduced in an earlier round when the container was narrowed to 1200px) back to PLP's actual documented desktop product-grid values, `2.4rem`/`3.6rem` (`match-desktop-plp-spacing`) — the narrower container was already proven to keep cards no wider than PLP's own cards, so restoring the real gap doesn't reintroduce the "too big" issue from an earlier round
- [x] 14.2 Size-box grid gap matched to PLP's own box-grid reference (`plp-size-facet-grid` in `component-facets.css`, `.ob-size-grid.facets-layout { gap: 0.6rem }`): `0.5rem` → `0.6rem`

## 15. Ninth revision: price-to-size-grid gap was inconsistent between cards

- [x] 15.1 Diagnosed via live measurement (not assumed): the visible gap between a card's price and its size-box grid differed per card (12px vs 27.5px on two live cards) despite `.wk-form`'s `margin-top` being one static value. Root cause traced through `getComputedStyle`/`getBoundingClientRect`: WK's own base CSS sets `.wk-form { flex-grow: 1 }`; the outer `.wk-grid` (CSS Grid, default `align-items: normal` = stretch) stretches every card in a row to match the tallest one (e.g. a 2-line-title neighbour), and that slack flows into `.wk-form`'s flex-grow, which — because `.wk-form` is itself a 2-row CSS Grid with `auto` row tracks under default `align-content: stretch` — inflates row 1's track height unevenly per card; `align-items: center` then centers the (correctly-sized) rails/size-grid content within that inflated track, shifting it down by a different amount depending on how much taller the neighbouring card was.
- [x] 15.2 Fix: `#MainContent > wishlist-page .wk-form { flex-grow: 0; }` — stops the form from absorbing row-stretch slack at all, so every card's internal spacing is driven purely by its own content and the fixed `margin-top`/`row-gap` values, identical regardless of neighbouring cards. Also raised `margin-top` `1.2rem` → `2rem` per the request to standardize on the larger of the two previously-observed gaps.
- [x] 15.3 Verify live: price→size-grid gap measured identically (20px) on both a 2-line-title card and a 1-line-title card in the same grid row, screenshot-confirmed
- [x] 15.4 Regression check: cross-sell's `.wk-form` still reports `flex-grow: 1` (WK's original, untouched) — confirms the override never leaked outside `#MainContent > wishlist-page`
