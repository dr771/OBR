## Context

See `proposal.md` for motivation. Dawn renders `product.options_with_values` and each option's values in the order supplied by Shopify. OB's Akeneo feed uses stable bracketed option keys, while the visible picker must use storefront labels and a deliberate order. The existing `ob-option-meta` snippet is the required boundary for interpreting those keys.

## Goals / Non-Goals

**Goals:**

- Keep native Dawn radio/select markup, availability state, selected state, product URLs, and variant events unchanged.
- Make ordering server-rendered and deterministic without a JavaScript reordering pass.
- Keep option identity and submitted form names on the original Akeneo key.

**Non-Goals:**

- Sorting the metafield-backed PLP size facet, which Shopify already orders.
- Defining half-size, width, bra, sock, or brand-specific size taxonomies before those data shapes are confirmed.
- Adding a size chart or changing the visual design of Dawn's picker.

## Decisions

1. **Extend `ob-option-meta` with explicit fields.** It will return `kind`, a plain Dutch `label`, or a `size_kind` derived from the stable raw key. This follows the existing centralized-snippet rule and avoids page-local checks for `[shoe_size_eu]`, `[tops_size]`, or `[bottoms_size]`.

2. **Order by original value indexes, then let the existing renderer consume the same value drops.** A small `ob-option-value-order` helper will emit original array indexes in the desired order. `product-variant-options` can therefore retain every ProductOptionValue property and all Dawn behavior; it only changes iteration order.

3. **Use bounded, known taxonomies and preserve unknowns.** EU integer sizes are ordered numerically across a broad 1–100 range; tops/bottoms use a semantic letter-size sequence. Values not recognized by the selected family are appended in original source order. This avoids silently dropping future values and keeps unconfirmed half-size/width behavior honest until real data arrives.

4. **Apply ordering to every picker presentation.** Button, dropdown, and swatch-dropdown settings receive the same order because the shared variant-options renderer owns iteration. The current button picker remains the intended PDP presentation.

## Risks / Trade-offs

- [A future brand introduces decimal EU sizes or another notation] → The value remains visible in source order after recognized integers; add a measured taxonomy once that feed shape is confirmed.
- [A future apparel value is outside the known letter sequence] → The value is appended in source order rather than omitted.
- [Reordering changes generated input IDs] → IDs remain unique and labels remain associated; original option value IDs in `data-option-value-id` continue to drive Dawn's variant selection.

## Migration Plan

Push only the changed snippets to main theme `148245381229`, then verify representative footwear and apparel PDPs on the password-protected dev shop. Rollback is the inverse theme push of those snippets. No shop-side configuration migrates with this change.
