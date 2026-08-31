## Context

The PDP already has a stable, variant-aware gallery sale badge whose contents are refreshed from Shopify's section response. Dawn product cards render the same product sale state in two markup branches. Both currently use the generic `products.product.on_sale` translation.

## Goals / Non-Goals

**Goals:**

- Calculate the saving from the same current and compare-at price objects that govern each badge's visibility.
- Always round down to a whole percentage.
- Keep PDP variant changes accurate without adding a client-side calculation.
- Preserve the existing visual treatment on PDP and product cards.

**Non-Goals:**

- Change prices, compare-at prices, Markets behavior, sale eligibility, or card variant selection behavior.
- Move or restyle product-card badges.
- Add merchant settings for percentage formatting.

## Decisions

- Use one small Liquid snippet that accepts either a Variant or Product object through `target`. Both expose `price` and `compare_at_price`, so the formula remains identical across surfaces.
- Calculate `floor((compare_at_price - price) * 100 / compare_at_price)` and output compact ASCII text as `-N%`.
- Keep the PDP badge element stable even for regular-price variants. The existing section-response synchronization continues to replace its contents and toggle its `hidden` class.
- Keep both product-card badge branches because Dawn uses them for different card layouts; both call the same percentage snippet.

## Risks / Trade-offs

- **Variant and product calculations drift** -> centralize the formula in one snippet and pass the surface's existing sale target.
- **Client-side rounding differs from Liquid** -> perform no browser-side arithmetic; incoming Shopify markup is authoritative.
- **New label changes pill width** -> retain all padding, height, type, colour, and radius rules; only intrinsic text width changes.
