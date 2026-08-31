## ADDED Requirements

### Requirement: PDP sale badge states the rounded-down selected-variant discount
The PDP gallery sale badge SHALL display the selected variant's discount as `-N%`, where `N` is `floor((compare_at_price - price) * 100 / compare_at_price)`. It SHALL use the selected variant prices that already determine sale visibility and SHALL update from the same Shopify section response when variants change.

#### Scenario: Selected variant has a fractional percentage saving
- **WHEN** the selected variant costs EUR 60 and has a compare-at price of EUR 70
- **THEN** the gallery sale badge displays `-14%`

#### Scenario: Shopper changes between differently discounted variants
- **WHEN** the shopper selects another sale variant with a different price or compare-at price
- **THEN** the badge displays that variant's rounded-down whole percentage without a page reload

#### Scenario: Percentage label replaces the generic sale word
- **WHEN** a sale variant renders on the PDP
- **THEN** the gallery badge displays only its `-N%` value while retaining the existing gallery-badge treatment
