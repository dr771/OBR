## ADDED Requirements

### Requirement: Product-card sale badges state the rounded-down discount
Every shared product-card sale badge SHALL display `-N%`, where `N` is `floor((compare_at_price - price) * 100 / compare_at_price)` using the same product-level price fields that determine the card's sale state and displayed price range. The percentage label SHALL replace the generic translated sale word without changing the badge's existing placement or visual treatment.

#### Scenario: Product card has a fractional percentage saving
- **WHEN** a product card's current price is EUR 60 and its compare-at price is EUR 70
- **THEN** every rendered sale-badge branch for that card displays `-14%`

#### Scenario: Product card is not on sale
- **WHEN** the product's compare-at price is absent or is not greater than its current price
- **THEN** no percentage sale badge renders

#### Scenario: Card renders outside a collection grid
- **WHEN** `card-product.liquid` renders the product in search, a featured collection, related products, or another shared card surface
- **THEN** its sale badge uses the same rounded-down percentage label as the PLP
