## ADDED Requirements

### Requirement: PLP card swatch visual is merchant-switchable
The theme SHALL provide one global presentation setting for PLP card color controls, with `color swatches` as the default and `image chips` as the retained alternative. Changing the setting SHALL change only the chip visual; selection, pressed state, card-image swapping, matched second-shot hover, and variant-link retargeting SHALL behave identically in both modes.

#### Scenario: Default color-swatch mode
- **WHEN** the merchant has not explicitly changed the PLP card swatch presentation setting
- **THEN** product cards render color swatches while retaining the existing interactive behavior

#### Scenario: Merchant restores image chips
- **WHEN** the merchant selects the image-chip presentation
- **THEN** product cards render the existing cropped variant-photo chips without a code or template change

### Requirement: Color-swatch mode resolves variant filter-color values safely
In color-swatch mode, each PLP color option SHALL resolve the `custom.filtercolors` values of its matched variant. One valid hex value SHALL render a solid swatch; multiple valid hex values SHALL render a segmented swatch containing every valid value; and no valid hex value SHALL fall back to that variant's image chip. Untrusted or malformed text SHALL NOT be emitted as executable inline CSS.

#### Scenario: Variant has one filter color
- **WHEN** the matched variant carries one `filtercolors` entry with a valid hex value
- **THEN** the chip renders that hex as a solid color

#### Scenario: Variant has several filter colors
- **WHEN** the matched variant carries multiple `filtercolors` entries with valid hex values
- **THEN** the chip renders all of those colors as equal segments

#### Scenario: Variant has no valid filter color
- **WHEN** the matched variant has no readable `filtercolors` reference or every referenced hex value is malformed or blank
- **THEN** the chip renders the existing cropped variant photo, or the neutral unavailable state if no photo exists

## REMOVED Requirements

### Requirement: Swatch chip visual is always the color's own variant photo

**Reason**: Per-variant `custom.filtercolors` references now provide a maintainable flat-color source, and the visual direction needs to remain reversible while it is evaluated.

**Migration**: Image chips remain available through the global presentation setting and as the automatic fallback when color data is missing.
