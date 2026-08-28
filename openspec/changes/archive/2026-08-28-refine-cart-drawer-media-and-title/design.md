## Context

The drawer currently gives its media cell the PLP's pale background and isolation in addition to applying `multiply` to the image. The intended treatment is narrower: only the image owns the blend. Its 1.6rem title token also occupies too much of the drawer's constrained text column.

## Decisions

- Remove the media-cell `background-color` and `isolation` declarations entirely; retain `mix-blend-mode: multiply` and apply the PLP's 1.6rem radius on `.cart-item__image`.
- Restore the compact title size, `calc(var(--font-heading-scale) * 1.4rem)`, while retaining the Inter/500 typography rule.
- Set `text-decoration: none` on the drawer product-name link in both resting and hover states; focus visibility stays with the existing browser/theme focus treatment.

## Non-Goals

- No changes to cart structure, behavior, or typography outside product-name sizing.
