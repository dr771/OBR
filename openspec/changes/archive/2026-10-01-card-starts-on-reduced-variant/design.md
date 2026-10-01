## Context

`card-product.liquid` derives the card image from `selected_or_first_available_variant` (D1). The swatch row marks `value.selected` active, and the sale badge tests `product.compare_at_price > product.price`. The Akeneo sync writes `0.00` as compare-at on non-reduced variants, so a partly reduced product has a product-level compare-at of 0 and never gets a badge.

## Goals / Non-Goals

**Goals:** one server-side decision for which variant the card represents, used by image, active chip, link and badge on every card surface.

**Non-Goals:** hiding non-reduced chips; changing the card price (stays product-level "vanaf"); changing the PDP's own default variant when opened without a `variant` parameter; changing collection membership rules.

## Decisions

- **Card variant resolved once in `card-product.liquid`** and passed to `ob-card-swatches`. Order: filter-narrowed variant, else first available variant with `compare_at_price > price`, else `selected_or_first_available_variant`.
- **Narrowing is detected by `variant=` in `product.url`.** Shopify adds it whenever it has resolved the product to a matching variant: a variant-level filter, or a search query that matched a variant (verified: `q=redaur` gives no parameter, `q=REDAUR__BLACK__M` gives that variant; a colour name selects that colour). Overriding then would show a colour the shopper filtered or searched away from. Detecting only `filter.v.*` filters was tried and rejected for that reason: a search for a full-price colour came back showing the reduced one. Consequence: a search whose terms Shopify matches to a full-price variant shows that variant without a badge.
- **The scan is gated on `compare_at_price_max > price_min`.** Products with no possible reduction (the normal case) skip the loop, so a grid of 20 cards with 100+ variants each pays nothing.
- **The link carries `?variant=` only when the card variant differs from Shopify's default**, joined with `?` or `&` as the URL requires. A `variant` parameter already in the URL is swapped by replacing exactly `variant=<default id>`, which leaves `_pos`/`_fid`/`_ss` alone.
- **A size filter relinks the card, nothing else.** The size facet is `filter.p.m.akeneo.available_erp_sizes`, a product-level filter, so Shopify never narrows the variant for it. The card reads the filter's active values (the same strings as the size option's values: "37", "M") and links to shown colour + that size when available; chips do the same per colour. Badge and "vanaf" price stay colour/product-level: showing the exact price of the filtered size would also need the price line to follow chip selection, which is deliberately left for a later change. The PDP then opens on the same colour, which keeps card and PDP in agreement.
- **Badge is per shown colour, from `snippets/ob-sale-label.liquid`.** Sizes of one colour can be reduced by different amounts: equal percentages give `-N%`, differing ones `tot -MAX%` (a full-price available size counts as 0). Showing the first reduced size's own percentage was tried first and read `-10%` beside "Vanaf €45,00" (a 50% size). The snippet returns the value with a `~` flag for the ranged case; the caller renders the prefix from `products.product.sale_up_to`, so it is translatable. The card chips' `Kleur:` label and the colour/size rail chevron labels (PLP and PDP) moved to locale keys in the same pass.
- **A reduced colour's chip always carries an accent-tinted edge**, at rest too, instead of the neutral hairline, so the sale colour is identifiable in the row. Appearance only; values live in `component-ob-swatches.css`.
- **The sale badge element renders whenever the product has a reduced colour**, `hidden` when the shown colour is not reduced, so chip selection can reveal it. Each chip carries its colour's label in `data-ob-sale-label`.

## Risks / Trade-offs

- A compare-at equal to or below the price is not a reduction here, while the Solden collection rule (`compare-at > 0`) would still admit the product. That is a data issue, already raised.
- The "vanaf" price is product-wide while the badge is per colour, so with two reduced colours the cheapest size may belong to the colour not shown.
