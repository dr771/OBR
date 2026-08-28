## MODIFIED Requirements

### Requirement: Item title uses a compact heading size
The cart drawer line item's product title SHALL use the same typography as a PLP product-card title: the body font family, 1.6rem font size, 500 weight, 2.2rem line height, and normal letter spacing.

#### Scenario: Viewing a line item title
- **WHEN** a shopper views any cart line item
- **THEN** its title has the same typographic treatment as a PLP product-card title

## ADDED Requirements

### Requirement: Cart drawer uses Inter throughout
All text and form controls inside the cart drawer SHALL use the theme body font family (Inter); the drawer SHALL not render Fraunces heading text or browser-default form-control typography.

#### Scenario: Shopper views a populated cart drawer
- **WHEN** the drawer contains line items, controls, and totals
- **THEN** all visible text in the drawer uses Inter

### Requirement: Line-item images use the PLP default blend treatment
Each cart drawer line-item image SHALL render on the PLP's default `#f1f5f9` product-photo surface with isolated `multiply` blending, so white packshot backgrounds blend into the shared surface.

#### Scenario: Shopper views a white-background packshot in the drawer
- **WHEN** a cart line item has a white-background product image
- **THEN** its white background blends into the pale product-photo surface rather than appearing as a separate white tile
