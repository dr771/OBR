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

#### Scenario: Akeneo writes long letter forms
- **WHEN** `[bottoms_size]` contains `XXXXL XS S L XXXL XXL XXS XL M`
- **THEN** the PDP picker renders `XXS XS S M L XL XXL XXXL XXXXL` with `XXXL` ordered as `3XL` and `XXXXL` as `4XL`

#### Scenario: Bottoms use waist sizes
- **WHEN** `[bottoms_size]` contains `W27 W28 W29 W32 W30 W34 W25 W26`
- **THEN** the PDP picker renders `W25 W26 W27 W28 W29 W30 W32 W34`, numbered sizes ordered after any letter sizes
