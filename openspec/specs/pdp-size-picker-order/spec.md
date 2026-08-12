# pdp-size-picker-order Specification

## Purpose
Defines predictable, human-readable PDP size pickers for the footwear and apparel size systems supplied by Akeneo.
## Requirements
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

### Requirement: Size ordering preserves option behavior
Reordering SHALL preserve each option value's selected state, availability state, submitted raw option name/value, linked-product URL data, and native variant-change behavior.

#### Scenario: Shopper selects a reordered size
- **WHEN** a shopper selects a size whose visible position differs from its Akeneo source position
- **THEN** Dawn selects the corresponding Shopify option value and resolves the correct variant

### Requirement: Unrecognized size data degrades without loss
An unrecognized size family or value SHALL remain visible and SHALL retain its source-relative order rather than being dropped or raising a rendering error.

#### Scenario: Future brand supplies an unrecognized value
- **WHEN** a recognized size option contains a value outside its known ordering taxonomy
- **THEN** the picker appends that value after recognized values while preserving its order relative to other unrecognized values

#### Scenario: Future brand supplies an unrecognized size key
- **WHEN** an option is detected as size but its family is not recognized
- **THEN** all option values render in their original source order

### Requirement: Size picker uses a storefront label
Recognized size options SHALL display `Maat` as their Dutch storefront heading while retaining the original Akeneo option key for form identity and submission.

#### Scenario: EU size option heading renders
- **WHEN** the PDP contains the raw option key `[shoe_size_eu]`
- **THEN** the visible picker heading is `Maat` and the underlying option form name still identifies `[shoe_size_eu]`

