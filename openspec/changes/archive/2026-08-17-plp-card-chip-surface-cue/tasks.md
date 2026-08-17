## 1. Chip surface states

- [x] 1.1 In `assets/component-ob-swatches.css`, drop `background-color` from the base `#ProductGridContainer .product-card-wrapper .ob-card-swatch` rule, leaving only the transparent border reservation, so the rest/active surfaces are each declared exactly once
- [x] 1.2 Give the card chip a resting surface of `color-mix(in srgb, var(--ob-product-photo-surface) 40%, #fff)` plus a `background-color` transition over `--duration-short`
- [x] 1.3 Restore the full `var(--ob-product-photo-surface)` on `.ob-card-swatch--active`, `:hover`, and `:focus-visible`

## 2. Remove the outgoing border cue

- [x] 2.1 Delete the `border-color: color-mix(in srgb, var(--ob-product-photo-surface) 80%, #000)` rule for `--active` / `:hover`, so no border is drawn in any state
- [x] 2.2 Confirm the `:focus-visible` foreground outline rule and the `--unavailable` opacity rule are untouched

## 3. Verify

- [x] 3.1 Push `assets/component-ob-swatches.css` to main theme `148245381229` and confirm on the collection grid that the active chip is visibly the darkest in its row, with no border in any state
- [x] 3.2 Confirm chip geometry is unchanged — five full chips plus a peeking sixth, chevrons and edge fades still appearing only on overflow
- [x] 3.3 Confirm the PDP colour chips and the homepage/search grid chips are visually unchanged
- [x] 3.4 Tab to a chip and confirm the foreground-coloured focus outline still draws
