## MODIFIED Requirements

### Requirement: Variant options render without labels
Each cart drawer line item SHALL render its variant option values as plain text joined by " / ", with no option-name label (no "[color]:", "[tops_size]:", or any translated equivalent prefix). Variant-option text SHALL use `calc(var(--font-heading-scale) * 1.4rem)` and `-0.4px` letter spacing. Line-item properties (user-entered text, e.g. gift-wrap notes or personalization) are unaffected and keep their own labeled list.

#### Scenario: Product has color and size options
- **WHEN** a cart line item is a product with `[color]` value "Black Grey" and `[shoe_size_eu]` value "40"
- **THEN** the drawer shows "Black Grey / 40" with no labels, at the same font size as the product name and with -0.4px letter spacing

#### Scenario: Line item carries a custom property
- **WHEN** a cart line item has a non-empty, non-underscore-prefixed line item property (e.g. "Engraving: Happy Birthday")
- **THEN** that property still renders with its own `<dt>`/`<dd>` label pair, unaffected by the option-list typography change
