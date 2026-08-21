## 1. CSS change

- [x] 1.1 In `assets/component-ob-swatches.css`, add `border: .1rem solid #66666612;` to the `#ProductGridContainer .product-card-wrapper .ob-card-swatch--active, :hover, :focus-visible` rule (currently only `background-color`).
- [x] 1.2 Update the rationale comment above that rule block (lines ~421-433) so it no longer claims chips are borderless in every state — describe the border as an additive cue on the active/hover/focus-visible states only, resting chips stay borderless.

## 2. Verify

- [x] 2.1 `shopify theme push --theme=148245381229 --allow-live --only assets/component-ob-swatches.css` and confirm live on the collection page: resting chips show no border, hovering/selecting/focusing a chip shows the hairline border with no geometry shift (chip size/position unchanged, rail's five-full-plus-peek arithmetic unaffected).
- [x] 2.2 Confirm unavailable-chip styling (reduced opacity) and keyboard-focus outline are unaffected.
