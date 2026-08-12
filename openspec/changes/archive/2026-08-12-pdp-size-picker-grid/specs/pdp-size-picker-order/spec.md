## MODIFIED Requirements

### Requirement: Recognized PDP sizes render in shopper-friendly order
The PDP variant picker SHALL render recognized EU shoe sizes in numeric ascending order and recognized tops/bottoms letter sizes in semantic ascending order, independently of both the raw Akeneo value order and the generic variant picker's configured presentation type. Recognized size options SHALL use the visible button presentation required by the PDP size grid.

#### Scenario: EU shoe sizes arrive scrambled
- **WHEN** `[shoe_size_eu]` values arrive as `35 36 37 40 39 42 38 41`
- **THEN** the PDP picker renders them as `35 36 37 38 39 40 41 42`

#### Scenario: Tops sizes arrive outside semantic order
- **WHEN** `[tops_size]` contains `XXS XS S M L XL XXL` in any source order
- **THEN** the PDP picker renders the available values in that semantic order

#### Scenario: Bottoms sizes use a subset
- **WHEN** `[bottoms_size]` contains only `S M L XL` in any source order
- **THEN** the PDP picker renders `S M L XL` without inserting unavailable sizes

#### Scenario: Generic variant picker is configured as a dropdown
- **WHEN** a recognized size option is rendered while the generic variant-picker setting is `dropdown`
- **THEN** that size option still renders as ordered visible buttons in the PDP size grid
