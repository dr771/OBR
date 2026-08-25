## Context

The active theme already sets Dawn's shared page width to 1600px. The PDP overrides that value with an independent cap, while the desktop PLP overrides Dawn's 50px page padding with 24px. Both overrides came from an earlier reference match and now conflict with the owner's selected live alignment.

## Goals / Non-Goals

**Goals:**

- Use the active theme's page-width value as the PDP's single width source.
- Align desktop PDP and PLP content with the header logo edge.
- Keep the PDP main frame, thumbnails, counter, breadcrumb, and related-products content on one shared desktop edge.
- Align standalone wishlist cards/controls with the header edge without changing Swish's 1600px page-width setting or its cart surfaces.
- Preserve existing mobile behavior, filter-column width, and card gaps.

**Non-Goals:**

- Changing the theme's configured page width.
- Changing Wishlist King's app-level page-width setting again.
- Changing header geometry or mobile PLP chrome.

## Decisions

- The PDP width token references Dawn's `--page-width` token instead of copying `160rem`. This keeps the PDP synchronized with the merchant setting without another hard-coded width.
- Desktop PDP and PLP use `5rem` logical inline padding, matching Dawn's active desktop header padding and the visible logo-image edge. The PDP retains its existing `2.4rem` inset below 990px.
- Do not use a negative margin or independently widen the PDP media wrapper. A live trial split the main frame, thumbnails, counter, and related-products tracks; the coherent 50px gallery edge is the accepted layout.
- Map Dawn's existing `product--small`, `product--medium`, and `product--large` classes onto the custom PDP grid as 40/60, 50/50, and 60/40. This restores the merchant-facing Media width control that the custom grid previously masked. Keep a 400px information-column minimum near the desktop breakpoint; the requested ratios are exact at normal wide viewports.
- Do not set `object-fit` unconditionally on the main PDP image. Dawn's `media-fit-contain` / `media-fit-cover` classes own the admin Original/Fill setting; the custom PDP stylesheet only retains `contain` for thumbnails.
- Swish exposes the page width but not its fixed 16px internal padding as a theme setting. A dedicated stylesheet scopes `5rem` padding to `#MainContent > wishlist-page > .wk-page`, excluding cart/drawer wishlist components and preserving Swish's mobile padding.
- Only explicitly affected files are pushed directly to active theme `148245381229`; verification uses the real storefront URLs, not localhost or a preview theme.

## Risks / Trade-offs

- [The Large setting could compress the buy box near the desktop breakpoint] → Keep the information track at a 400px minimum and stack the PDP below 990px as before.
- [Increasing PLP inset removes 52px from the filter/grid shell] → Keep the established filter width and card gaps, and verify the four-column grid remains stable at the wide desktop viewport.
- [Theme page width changes later] → Referencing `--page-width` keeps PDP and header synchronized automatically.

## Migration Plan

Push only the affected CSS assets and `layout/theme.liquid` to active theme `148245381229` with explicit `--only` flags. Verify PDP, PLP, and wishlist geometry and screenshots on `original-brands-dev.myshopify.com`.
