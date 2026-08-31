## Why

The PDP's native sale badge currently sits beside the price, while product merchandising badges already use the gallery's top-left overlay treatment. Moving the sale state into that established badge position keeps the price row cleaner and makes the promotion visible where shoppers first look.

## What Changes

- Render the selected variant's sale badge over the gallery at the same inset, geometry, and typography as the existing bestseller gallery badge.
- Remove the native sale badge from the PDP price row while preserving Dawn's sold-out badge behavior.
- Keep the gallery sale badge synchronized when the shopper changes variants, including hiding it for variants without a valid compare-at price.
- Render the struck-through compare-at price at 35% foreground opacity on the PDP only.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `pdp-product-badges`: Add the selected-variant sale badge's gallery placement, reference treatment, and variant-change behavior.
- `pdp-layout-chrome`: Define the PDP-only muted treatment for a struck-through compare-at price and remove the sale pill from the price row.

## Impact

- `sections/main-product.liquid`: adds the gallery sale badge and a stable variant-update target.
- `assets/product-info.js`: synchronizes the badge from Dawn's variant section response.
- `assets/component-ob-pdp.css`: reuses the gallery badge treatment, stacks simultaneous gallery badges, hides the price-row sale badge, and applies the compare-at colour.
- No Shopify data, app configuration, or migration dependency changes.
