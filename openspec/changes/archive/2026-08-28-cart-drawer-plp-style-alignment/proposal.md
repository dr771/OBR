## Why

The cart drawer still exposes Dawn's heading font and neutral product thumbnails, so it reads as a separate surface from the product listing. Aligning its type and media treatment with the PLP makes the shopping flow feel continuous.

## What Changes

- Use Inter throughout the cart drawer; no Fraunces headings or form-control fallbacks remain in that surface.
- Match cart line-item titles to the PLP product-title typography.
- Give line-item imagery the PLP's pale product surface and `multiply` blend treatment.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `cart-drawer-line-item-layout`: extend the drawer's presentational contract with PLP-aligned type and image treatment, and update its title token.

## Impact

- `assets/component-cart-drawer.css` only; no Liquid markup, cart behavior, or shop configuration changes.
