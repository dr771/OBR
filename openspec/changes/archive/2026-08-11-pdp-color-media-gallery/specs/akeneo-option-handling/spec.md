## ADDED Requirements

### Requirement: Variant color codes are parsed centrally from Akeneo SKUs
Code that needs a selected variant's machine color code SHALL obtain it through a centralized `ob-*` boundary that first confirms the product has a recognized color option, parses `{item}__{color_code}__{size}`, and normalizes internal SKU hyphens to the media filename's underscore convention; page-specific templates SHALL NOT parse or normalize the SKU structure inline.

#### Scenario: Single-segment color code
- **WHEN** a selected variant SKU is `7100FL__903__35` on a product with a recognized color option
- **THEN** its variant color code resolves to `903`

#### Scenario: Multi-segment color code
- **WHEN** a selected variant SKU carries `192-953` between the double-underscore delimiters
- **THEN** its normalized media-matching color code resolves to `192_953` without truncation

#### Scenario: Product has no recognized color option
- **WHEN** a conforming-looking SKU belongs to a product whose options contain no recognized color key
- **THEN** no variant color code is returned
