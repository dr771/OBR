## MODIFIED Requirements

### Requirement: Recognized PDP sizes render in shopper-friendly order
The PDP variant picker SHALL render every size option's values in shopper-friendly order, whatever the Akeneo size key (`[shoe_size_eu]`, `[tops_size]`, `[bottoms_size]`, `[accessory_size]`, `[socks_size]`, `[bra_size]` or any other size key). The order is independent of both the raw Akeneo value order and the generic variant picker's configured presentation type:
- Letter sizes come first, in semantic order from `3XS` to `6XL`.
- Numbered sizes follow (EU sizes, waist sizes `W32`, kids sizes, decimals such as `36.5`), in ascending numeric order with no upper bound.
- A range value (`S_M`, `116_128`) ranks by its first size and then its second, so it sits right after its first size.

Size options SHALL use the visible button presentation required by the PDP size grid.

#### Scenario: EU shoe sizes arrive scrambled
- **WHEN** `[shoe_size_eu]` values arrive as `35 36 37 40 39 42 38 41`
- **THEN** the PDP picker renders them as `35 36 37 38 39 40 41 42`

#### Scenario: Half shoe sizes
- **WHEN** `[shoe_size_eu]` values arrive as `37 36.5 36 38`
- **THEN** the PDP picker renders `36 36.5 37 38`

#### Scenario: Tops sizes arrive outside semantic order
- **WHEN** `[tops_size]` contains `XXS XS S M L XL XXL` in any source order
- **THEN** the PDP picker renders the available values in that semantic order

#### Scenario: Bottoms sizes use a subset
- **WHEN** `[bottoms_size]` contains only `S M L XL` in any source order
- **THEN** the PDP picker renders `S M L XL` without inserting unavailable sizes

#### Scenario: Generic variant picker is configured as a dropdown
- **WHEN** a size option is rendered while the generic variant-picker setting is `dropdown`
- **THEN** that size option still renders as ordered visible buttons in the PDP size grid

#### Scenario: Akeneo writes long letter forms
- **WHEN** `[bottoms_size]` contains `XXXXL XS S L XXXL XXL XXS XL M`
- **THEN** the PDP picker renders `XXS XS S M L XL XXL XXXL XXXXL` with `XXXL` ordered as `3XL` and `XXXXL` as `4XL`

#### Scenario: Bottoms use waist sizes
- **WHEN** `[bottoms_size]` contains `W27 W28 W29 W32 W30 W34 W25 W26`
- **THEN** the PDP picker renders `W25 W26 W27 W28 W29 W30 W32 W34`, numbered sizes ordered after any letter sizes

#### Scenario: Accessory sizes arrive scrambled
- **WHEN** `[accessory_size]` values arrive as `XL XXS M L XS S`
- **THEN** the PDP picker renders `XXS XS S M L XL`

#### Scenario: Kids clothing sizes above 100
- **WHEN** `[tops_size]` values arrive as `140 92 164 104 116 128 152`
- **THEN** the PDP picker renders `92 104 116 128 140 152 164`

#### Scenario: Range values
- **WHEN** `[socks_size]` values arrive as `L_XL S_M` or `[accessory_size]` as `M_L XS_M S L_XL`
- **THEN** the PDP picker renders `S_M L_XL` and `XS_M S M_L L_XL` respectively

### Requirement: Unrecognized size data degrades without loss
A size value outside the ordering taxonomy SHALL remain visible and SHALL retain its source-relative order rather than being dropped or raising a rendering error.

#### Scenario: Future brand supplies an unrecognized value
- **WHEN** a size option contains a value outside its known ordering taxonomy
- **THEN** the picker appends that value after recognized values while preserving its order relative to other unrecognized values

#### Scenario: Future brand supplies an unrecognized size key
- **WHEN** an option is detected as size but its key is not one of the known Akeneo size keys
- **THEN** its values are ordered by the same rules as any size option, with unrecognized values appended in source order
