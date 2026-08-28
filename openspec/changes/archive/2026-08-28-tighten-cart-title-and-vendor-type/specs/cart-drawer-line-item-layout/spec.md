## MODIFIED Requirements

### Requirement: Item title uses a compact heading size
The cart drawer line item's product title SHALL use the body font family at `calc(var(--font-heading-scale) * 1.4rem)`, 500 weight, 1.9rem line height, and normal letter spacing.

#### Scenario: Viewing a line item title
- **WHEN** a shopper views any cart line item
- **THEN** its title is compact enough for the drawer's narrow product column

#### Scenario: Shopper hovers a line-item title
- **WHEN** a pointer hovers a cart line-item product link
- **THEN** the title remains free of an underline
