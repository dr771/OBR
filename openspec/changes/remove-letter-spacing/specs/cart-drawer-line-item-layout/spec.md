## MODIFIED Requirements

### Requirement: Only one price renders per line item
Each cart drawer line item SHALL show exactly one price (the line total for its quantity) — no separate per-unit price rendered under the title. The visible price SHALL use compact typography (13px, 500 weight, normal letter-spacing) distinct from Dawn's default price styling, applied to both the current price and any struck-through original price.

#### Scenario: Single-quantity line item
- **WHEN** a cart line item has quantity 1
- **THEN** only one price appears for that line item, in the quantity-stepper row (see remove-control/price placement requirement)

#### Scenario: Multi-quantity line item
- **WHEN** a cart line item has quantity greater than 1
- **THEN** the single visible price is the line total (unit price × quantity), not a per-unit price
