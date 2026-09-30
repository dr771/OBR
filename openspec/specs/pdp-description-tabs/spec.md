## Purpose

Presents Akeneo-synced product description and materials alongside shared delivery and returns information as a single PDP accordion stack.

## Requirements

### Requirement: Description renders as an accordion open by default
The PDP SHALL render `product.description` inside a detail accordion labelled "Productdetails" ("Product details" in English), using the same accordion presentation as the theme's other collapsible detail panels. This accordion SHALL be expanded by default on page load. The accordion SHALL be omitted entirely when the product has no description.

#### Scenario: Product has a description

- **WHEN** a product has non-blank `description` content
- **THEN** the "Productdetails" accordion renders expanded, with the description content visible without user interaction

#### Scenario: Product has no description

- **WHEN** a product's `description` is blank
- **THEN** no "Productdetails" accordion renders

### Requirement: Materials & maintenance renders as an accordion below description, closed by default
The PDP SHALL render the `custom.materials_maintenance` product metafield inside a second detail accordion labelled "Materiaal & onderhoud" ("Materials & maintenance" in English), positioned immediately after the description accordion. This accordion SHALL be collapsed by default. The accordion SHALL be omitted entirely when the metafield has no value.

#### Scenario: Product has materials & maintenance content

- **WHEN** a product's `custom.materials_maintenance` metafield is non-blank
- **THEN** a "Materiaal & onderhoud" accordion renders immediately after the description accordion, collapsed by default, and expands on click to reveal the metafield's content

#### Scenario: Product has no materials & maintenance content

- **WHEN** a product's `custom.materials_maintenance` metafield is blank
- **THEN** no "Materiaal & onderhoud" accordion renders, and no gap is left in its place

### Requirement: Both accordions share the approved reference's presentation
Both accordions SHALL use the same visual treatment as the theme's other PDP detail accordions (heading typography, hairline divider, chevron indicator), matching the approved Bolt reference's detail-accordion styling.

#### Scenario: Multiple accordions render together

- **WHEN** both the description and materials & maintenance accordions render
- **THEN** they stack with a hairline divider between each and consistent heading/chevron styling, matching the reference

### Requirement: Delivery and returns renders from one shop-wide template block

The default PDP template SHALL render a `Bezorging & retour` accordion after the product-specific description and materials accordions. Its copy SHALL be configured once in the shared product template rather than read from an Akeneo product field. It SHALL link to the published delivery and return terms. The accordion SHALL appear on desktop and mobile even when either product-specific field is blank.

#### Scenario: Product has both Akeneo detail fields

- **WHEN** a product has a description and materials/maintenance value
- **THEN** the delivery and returns accordion follows those two detail accordions and links to the published terms

#### Scenario: Product-specific detail field is blank

- **WHEN** a product has no description or materials/maintenance value
- **THEN** the corresponding product-specific accordion is omitted while the delivery and returns accordion remains available
