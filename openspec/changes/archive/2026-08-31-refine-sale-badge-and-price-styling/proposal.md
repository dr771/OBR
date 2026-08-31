## Why

Sale and bestseller states currently use inconsistent colour roles between the PDP and product cards, and the active sale price is not visually distinguished from a regular price. A small shared treatment makes promotions easier to scan without changing any layout or pricing logic.

## What Changes

- Render every theme-owned badge label in uppercase.
- Give sale badges their own `1.1rem / 500 / 1.4rem / 0` typography.
- On product cards, switch the sale badge to accent blue and the bestseller badge to black.
- On PDP and product cards, colour the current sale amount accent blue while keeping the struck-through compare-at amount muted grey.
- Preserve existing badge placement, padding, radius, visibility, percentage calculation, and variant synchronization.

## Capabilities

### New Capabilities

- `storefront-badge-treatment`: Defines the global uppercase convention and sale-badge typography.

### Modified Capabilities

- `pdp-product-badges`: Keeps shared gallery geometry while giving sale and bestseller labels distinct typography.
- `pdp-layout-chrome`: Changes the current PDP sale amount to the brand accent while retaining the muted compare-at amount.
- `plp-sale-badges`: Defines the reversed PLP sale/bestseller colour roles and the blue current sale amount.

## Impact

- `assets/base.css`: applies uppercase text to Dawn's shared badge primitive.
- `assets/component-price.css`: applies the sale-specific type treatment to native price sale badges.
- `assets/component-ob-pdp.css`: applies uppercase, sale-badge type, and blue current-sale price on the PDP.
- `assets/component-ob-swatches.css`: swaps PLP badge colour roles and styles the card sale price.
- `sections/main-product.liquid` and `snippets/card-product.liquid`: add semantic sale modifier classes for precise styling.
- No JavaScript, pricing, Shopify data, or merchant setting changes.
