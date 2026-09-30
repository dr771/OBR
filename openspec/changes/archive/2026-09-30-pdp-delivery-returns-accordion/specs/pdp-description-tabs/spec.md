## ADDED Requirements

### Requirement: Delivery and returns renders from one shop-wide template block

The default PDP template SHALL render a `Bezorging & retour` accordion after the product-specific description and materials accordions. Its copy SHALL be configured once in the shared product template rather than read from an Akeneo product field. It SHALL link to the published delivery and return terms. The accordion SHALL appear on desktop and mobile even when either product-specific field is blank.

#### Scenario: Product has both Akeneo detail fields

- **WHEN** a product has a description and materials/maintenance value
- **THEN** the delivery and returns accordion follows those two detail accordions and links to the published terms

#### Scenario: Product-specific detail field is blank

- **WHEN** a product has no description or materials/maintenance value
- **THEN** the corresponding product-specific accordion is omitted while the delivery and returns accordion remains available
