## ADDED Requirements

### Requirement: Predictive product results carry discount badges
Each predictive product result SHALL show a sale badge whenever at least one available variant has a compare-at price greater than its price, with the label produced by the shared sale-label rule over all of the product's available variants: `-N%` when every such variant is reduced by the same rounded-down percentage, otherwise the largest percentage behind the translatable "up to" prefix. Each result SHALL also show the product's campaign badge under the same campaign window and precedence rules as product cards, including the run-time window check for results inserted after page load. A product with neither SHALL render no badge and no reserved space.

#### Scenario: Reduced product is suggested
- **WHEN** predictive search returns a product whose available variants all cost EUR 60 with a compare-at price of EUR 70
- **THEN** its result shows a `-14%` sale badge

#### Scenario: Sizes are reduced by different amounts
- **WHEN** a suggested product's available variants are reduced by 10% and 50%, or some are full price
- **THEN** its result shows `tot -50%`

#### Scenario: Campaign product is suggested
- **WHEN** a suggested product belongs to a campaign collection whose run time includes the shopper's current time
- **THEN** its result shows that campaign's badge, the same one its product card shows

#### Scenario: Full-price product is suggested
- **WHEN** a suggested product has no reduced available variant and no running campaign
- **THEN** its result shows no badge
