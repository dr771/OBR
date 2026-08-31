## Why

The storefront currently labels discounted items with a generic translated sale word. Showing the actual percentage makes the saving immediately legible on both the PDP and product cards while retaining the already-approved badge styling and placement.

## What Changes

- Replace the PDP gallery sale label with the selected variant's percentage discount.
- Replace product-card sale labels with the percentage derived from the same product price fields that drive the card's sale state.
- Round every displayed discount down to a whole percentage and format it compactly as `-N%`.
- Preserve all existing badge geometry, colours, placement, visibility rules, and PDP variant synchronization.

## Capabilities

### New Capabilities

- `plp-sale-badges`: Defines the percentage label used by sale badges on shared product-card surfaces.

### Modified Capabilities

- `pdp-product-badges`: Defines the selected variant's rounded-down percentage as the PDP gallery sale-badge label.

## Impact

- `snippets/ob-discount-percentage.liquid`: centralizes the sale-percentage calculation and output.
- `sections/main-product.liquid`: renders the calculated selected-variant percentage in the existing stable PDP badge target.
- `snippets/card-product.liquid`: renders the calculated product-level percentage in both of Dawn's card sale-badge placements.
- No CSS, JavaScript, Shopify data, or merchant configuration changes.
