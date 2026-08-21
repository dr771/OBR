## Purpose

Presents the product description and the Akeneo-synced materials/maintenance copy as proto-matched accordions in the PDP information column, so both read as part of one detail stack instead of one being unstyled body text.

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
