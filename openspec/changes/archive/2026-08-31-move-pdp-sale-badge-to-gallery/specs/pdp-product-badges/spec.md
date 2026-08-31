## ADDED Requirements

### Requirement: Selected-variant sale status renders over the PDP gallery
The PDP SHALL render a sale badge over the gallery when the selected variant has a compare-at price greater than its current price, and SHALL render no sale badge in the price row. The gallery badge SHALL update from Shopify's section response whenever the shopper changes variants, without requiring a page reload.

#### Scenario: Selected variant is on sale
- **WHEN** the selected variant's compare-at price is greater than its current price
- **THEN** a sale badge appears at the gallery's top-left inset and no sale badge appears beside the PDP price

#### Scenario: Shopper selects a regular-price variant
- **WHEN** the shopper changes from a sale variant to a variant without a valid higher compare-at price
- **THEN** the gallery sale badge disappears while the PDP price updates normally

#### Scenario: Shopper selects a sale variant
- **WHEN** the shopper changes from a regular-price variant to a sale variant
- **THEN** the gallery sale badge appears from the same variant section update that refreshes the price

### Requirement: Gallery merchandising badges share one reference treatment
The sale gallery badge SHALL use the bestseller gallery badge's measured 22px top-left inset, fully rounded accent pill, 0.6rem by 1.2rem padding, white text, and semibold 1.2rem text on a 1.6rem line. When both sale and bestseller states apply, both badges SHALL remain visible in a top-left vertical stack without overlap.

#### Scenario: Sale product is not a bestseller
- **WHEN** only the selected variant's sale status applies
- **THEN** its gallery pill matches the bestseller gallery badge's geometry, type, colour, and inset

#### Scenario: Sale product is also a bestseller
- **WHEN** the product is marked as a bestseller and the selected variant is on sale
- **THEN** both matching pills remain aligned at the gallery's top-left and are separated without overlap
