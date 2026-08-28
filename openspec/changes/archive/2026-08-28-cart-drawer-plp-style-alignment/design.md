## Context

The PLP sets the established product-card visual language in `assets/component-ob-swatches.css`: Inter product titles at 1.6rem/500/2.2rem and product imagery composited with `mix-blend-mode: multiply` on `#f1f5f9`. The drawer currently inherits Inter for most body content, but its headings, line-item names, total heading, buttons, and inputs can retain theme or browser font overrides. Its direct `<img class="cart-item__image">` also has no PLP surface or blend treatment.

## Goals / Non-Goals

**Goals:**

- Make all visible cart drawer text use the body typeface (Inter).
- Reuse the PLP product-title tokens exactly for cart line-item titles.
- Reuse the PLP default photo surface and multiply compositing for cart line-item images.

**Non-Goals:**

- No changes to cart markup, quantity/remove behavior, or the full cart page.
- No per-brand image framing overrides: drawer items do not carry the PLP's brand-card markup, so this change deliberately uses the PLP default shared treatment only.

## Decisions

- Scope the font reset to `.cart-drawer` and descendants. This covers explicit theme heading declarations and form-control browser defaults without leaking to the mobile navigation drawer or page behind it.
- Set the cart item title to the same values as `.card-wrapper.product-card-wrapper .card__heading.h5`: body font, 1.6rem, 500, 2.2rem, normal spacing. This supersedes the earlier compact-only 1.4rem title rule.
- Apply `#f1f5f9`, `isolation: isolate`, and the default `multiply` blend to the cart media cell/image. Isolation provides the exact intended compositing backdrop and contains blending to the thumbnail.

## Risks / Trade-offs

- Multiply is a default PLP treatment; imagery with dark or coloured baked-in backgrounds can look darker. The PLP's per-brand exceptions cannot be safely inferred in the drawer without expanding its markup, which is out of scope for this style alignment.
