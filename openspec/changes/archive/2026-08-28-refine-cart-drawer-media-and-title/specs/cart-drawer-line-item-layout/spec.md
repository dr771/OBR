## MODIFIED Requirements

### Requirement: Item title uses a compact heading size
The cart drawer line item's product title SHALL use the body font family at `calc(var(--font-heading-scale) * 1.4rem)`, 500 weight, 2.2rem line height, and normal letter spacing.

#### Scenario: Viewing a line item title
- **WHEN** a shopper views any cart line item
- **THEN** its title is compact enough for the drawer's narrow product column

#### Scenario: Shopper hovers a line-item title
- **WHEN** a pointer hovers a cart line-item product link
- **THEN** the title remains free of an underline

### Requirement: Line-item images use the PLP default blend treatment
Each cart drawer line-item image itself SHALL use `mix-blend-mode: multiply` and a 1.6rem border radius. Its media container SHALL receive no blend-specific background, radius, or isolation styling.

#### Scenario: Shopper views a line item image
- **WHEN** a cart drawer line item renders
- **THEN** only its image, not its container, owns the blend treatment and rounded corners
