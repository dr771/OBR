## Context

Dawn already renders a variant-aware sale badge inside `snippets/price.liquid`, and Original Brands already renders a measured bestseller badge over the PDP gallery. Variant selection fetches a fresh section response and updates selected destinations in `assets/product-info.js`, but the gallery wrapper itself is not replaced for price-only changes.

## Goals / Non-Goals

**Goals:**

- Reuse the established gallery badge geometry and type without creating a parallel visual treatment.
- Keep sale visibility tied to the selected variant's effective Liquid `price` and `compare_at_price`.
- Preserve dynamic variant switching and the native sold-out badge behavior.
- Keep the compare-at opacity change scoped to the PDP.

**Non-Goals:**

- Change sale pricing, Markets behavior, translations, PLP badges, or checkout presentation.
- Replace Dawn's section-response variant update architecture.

## Decisions

- Render a stable `SaleBadge-<section>` element for every PDP and toggle its `hidden` state from the incoming section response. This supports both sale-to-regular and regular-to-sale variant changes; conditionally omitting the destination would prevent Dawn from inserting it later.
- Add the sale badge to a positioned gallery-badge stack with the existing bestseller badge. A single badge keeps the measured 22px inset and 28px pill geometry; simultaneous badges stack vertically instead of overlapping.
- Reuse `ob-badge ob-badge--gallery` and Shopify's existing `products.product.on_sale` translation. No duplicate geometry or label source is introduced.
- Hide only `.price__badge-sale` inside `.ob-pdp`, leaving the native sold-out badge eligible to render beside the price.
- Apply the 35% comparison colour through a PDP-scoped selector so cards and other shared `snippets/price.liquid` surfaces retain their current treatment.

## Risks / Trade-offs

- **Variant response and destination drift** → Use the same stable section-scoped ID pattern and `updateSourceFromDestination` helper as the existing price, SKU, and inventory updates.
- **Sale and bestseller collision** → Position their shared flex stack, not each pill independently.
- **Dawn stacking context covers the overlay on desktop** → Keep the already-proven gallery overlay at `z-index: 3`, above the sticky media gallery's `z-index: 2`.
