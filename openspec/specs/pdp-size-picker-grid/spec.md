# pdp-size-picker-grid Specification

## Purpose
Defines a compact, accessible PDP size-box layout that stays consistent across footwear and apparel while remaining independent of brand-specific styling.
## Requirements
### Requirement: Recognized sizes have a responsive equal-width grid fallback
When the PDP option-rail variation is disabled, the PDP SHALL present every recognized size option as an equal-width grid within the product-information column. The grid SHALL use four columns in narrow product columns and eight columns from a 44rem product-information container width. It SHALL derive its boxes from the product's actual option values without inserting or assuming a fixed size range.

#### Scenario: Footwear has thirteen numeric sizes
- **WHEN** a footwear product supplies sizes `35` through `47`
- **THEN** all thirteen supplied values render in source-derived boxes across four columns in a narrow product column and wrap onto additional rows

#### Scenario: Apparel supplies a shorter letter range
- **WHEN** an apparel product supplies `S M L XL`
- **THEN** the four supplied values fill one equal-width narrow-column row without placeholder boxes

### Requirement: Size boxes expose clear interactive states
Each size box SHALL retain native single-choice form semantics and SHALL expose visually distinct default, hover, selected, unavailable, and keyboard-focus states. Selected and unavailable states SHALL remain distinguishable without relying on color alone.

#### Scenario: Shopper selects a size
- **WHEN** a shopper activates an available size box
- **THEN** that box becomes the sole selected option and remains visually distinct from every unselected box

#### Scenario: Size is unavailable for the current selection
- **WHEN** a size value is unavailable in the current option combination
- **THEN** its box retains Dawn's availability behavior and is visibly muted and struck through

#### Scenario: Keyboard user navigates the size picker
- **WHEN** keyboard focus reaches a size radio
- **THEN** its visible box shows a clear focus outline without hiding the selected or unavailable state

### Requirement: Size boxes remain usable across supported viewports
The grid SHALL stay within its product-information container without horizontal page overflow. Every size box SHALL provide a 5.6rem interaction height in narrow product columns and a minimum 4.8rem interaction height from a 44rem product-information container width.

#### Scenario: Shopper views the picker on a mobile viewport
- **WHEN** the PDP is rendered at a 390px mobile viewport
- **THEN** the grid remains four columns wide with 5.6rem-high labels, its labels remain legible, and no horizontal page overflow is introduced

### Requirement: Non-size options do not inherit size-box treatment
Unrecognized generic product options SHALL remain on their existing button or dropdown presentation paths rather than inheriting the size grid. Color behavior is governed by `pdp-color-swatches` and `pdp-option-rails`.

#### Scenario: Product has color and size options
- **WHEN** a PDP renders both a recognized color option and a recognized size option
- **THEN** color remains image-swatch content while only size receives equal-width size-box treatment

#### Scenario: Future product has a generic dropdown option
- **WHEN** a non-size, non-color option is configured to use a dropdown
- **THEN** it remains a dropdown and does not render as a size grid

