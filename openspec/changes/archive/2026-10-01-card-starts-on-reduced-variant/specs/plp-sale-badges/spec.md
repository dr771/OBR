## MODIFIED Requirements

### Requirement: Product-card sale badges state the rounded-down discount
Every shared product-card sale badge SHALL state the reduction of the color the card currently shows, computed per variant as `floor((compare_at_price - price) * 100 / compare_at_price)` over that color's available variants (all available variants for a product with no color option), not from product-level price fields. An available variant that is not reduced counts as 0. When every such variant has the same percentage the badge SHALL display `-N%`; when they differ it SHALL display the largest percentage behind a translatable "up to" prefix (`tot -N%` in Dutch), so the badge never understates or overstates against the card's "vanaf" price. The badge SHALL be visible only while the shown color has an available variant whose compare-at price is greater than its price, and SHALL follow in-card color selection. The percentage label SHALL replace the generic translated sale word.

#### Scenario: Product card has a fractional percentage saving
- **WHEN** every available variant of the shown color costs EUR 60 with a compare-at price of EUR 70
- **THEN** every rendered sale-badge branch for that card displays `-14%`

#### Scenario: Sizes of the shown color are reduced by different amounts
- **WHEN** the shown color's available sizes are reduced by 10% and 50%, or some sizes are reduced and others are full price
- **THEN** the badge displays `tot -50%`

#### Scenario: Product card is not on sale
- **WHEN** no available variant of the product has a compare-at price greater than its price
- **THEN** no percentage sale badge renders

#### Scenario: Only one color is reduced
- **WHEN** a product has one reduced color among full-price colors
- **THEN** the card starts on the reduced color with its badge visible

#### Scenario: Shopper switches to a full-price color
- **WHEN** a shopper selects the chip of a full-price color on a card whose badge is visible
- **THEN** the badge is hidden, and it returns with the right percentage when a reduced color is selected again

#### Scenario: Card renders outside a collection grid
- **WHEN** `card-product.liquid` renders the product in search, a featured collection, related products, or another shared card surface
- **THEN** its sale badge follows the same rule as on the PLP
