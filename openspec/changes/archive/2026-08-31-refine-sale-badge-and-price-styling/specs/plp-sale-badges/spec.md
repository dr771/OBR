## MODIFIED Requirements

### Requirement: Product-card sale badges state the rounded-down discount
Every shared product-card sale badge SHALL display `-N%`, where `N` is `floor((compare_at_price - price) * 100 / compare_at_price)` using the same product-level price fields that determine the card's sale state and displayed price range. The percentage label SHALL replace the generic translated sale word while retaining the badge's existing placement, padding, border, and radius. It SHALL render uppercase with the shared sale-badge typography.

#### Scenario: Product card has a fractional percentage saving
- **WHEN** a product card's current price is EUR 60 and its compare-at price is EUR 70
- **THEN** every rendered sale-badge branch for that card displays `-14%` at `1.1rem / 500 / 1.4rem / 0`

#### Scenario: Product card is not on sale
- **WHEN** the product's compare-at price is absent or is not greater than its current price
- **THEN** no percentage sale badge renders

#### Scenario: Card renders outside a collection grid
- **WHEN** `card-product.liquid` renders the product in search, a featured collection, related products, or another shared card surface
- **THEN** its sale badge uses the same rounded-down percentage label and sale typography as the PLP

## ADDED Requirements

### Requirement: Product-card merchandising badges use distinct colour roles
On shared product cards, the sale badge SHALL use the brand accent `#38B6FF` with white text, while the bestseller badge SHALL use `#121212` with white text. Their existing placement, padding, border, and radius SHALL remain unchanged.

#### Scenario: Collection contains sale and bestseller products
- **WHEN** both badge types are visible in the same product grid
- **THEN** sale reads as a blue pill and bestseller reads as a black pill

### Requirement: Product-card current sale amount uses the brand accent
When a product card is on sale, its current payable amount SHALL use the global `--ob-accent` token at full opacity and semibold weight 600 while its struck-through compare-at amount retains the existing regular weight and muted grey treatment. A regular non-sale product amount SHALL retain its normal card price colour and weight.

#### Scenario: Product card renders sale pricing
- **WHEN** the card displays both current and compare-at amounts
- **THEN** the current amount is blue at weight 600 and the compare-at amount remains regular-weight grey and struck through

#### Scenario: Product card renders regular pricing
- **WHEN** the card has no valid higher compare-at amount
- **THEN** its price retains the existing card ink colour
