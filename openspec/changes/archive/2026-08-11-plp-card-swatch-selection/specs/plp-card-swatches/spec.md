## ADDED Requirements

### Requirement: Swatch selection retargets the card's product links
Each PLP color chip SHALL be a non-navigating button that selects its color within the product card. Selecting a chip SHALL retarget the card's normal product links to that color's matched variant URL, correctly joined whether or not the base product URL already has query parameters.

#### Scenario: Shopper clicks a non-active chip
- **WHEN** a shopper clicks a color chip for a different color
- **THEN** the card remains on the current grid, that color becomes selected, and no PDP navigation occurs

#### Scenario: Shopper opens the selected card
- **WHEN** a shopper selects a color and then activates the card's normal product link
- **THEN** the PDP opens with the selected color's matched variant in the URL

#### Scenario: Filtered card URL already contains a variant and tracking parameters
- **WHEN** a facet-refreshed card link already contains `variant`, `_pos`, `_fid`, and `_ss` parameters and the shopper selects another color
- **THEN** the link contains exactly one `variant` parameter for the new selection and retains the tracking parameters

#### Scenario: JavaScript is unavailable
- **WHEN** JavaScript is unavailable
- **THEN** the swatch buttons do not navigate or change the card, while the card's normal product link remains usable with its server-rendered initial variant

## MODIFIED Requirements

### Requirement: Card image swaps to the hovered swatch
Hovering, focusing, or clicking a swatch chip SHALL select that color in place, swap the card's primary image to that color's photo, mark only that chip active, and expose the state through `aria-pressed`. The selected state SHALL persist after the pointer leaves the chip so the shopper can preview its first and second shots from the grid.

#### Scenario: Shopper hovers a non-active swatch
- **WHEN** a shopper hovers a swatch chip for a color other than the currently shown one
- **THEN** the card's primary image swaps to that color's photo, that chip becomes active and pressed, and the previously active chip is deactivated and unpressed

#### Scenario: Shopper clicks a non-active swatch
- **WHEN** a shopper clicks a swatch chip for a color other than the currently shown one
- **THEN** the same persistent in-grid selection occurs without navigating away

#### Scenario: Pointer leaves the swatch row
- **WHEN** the pointer moves away from the swatch row after a selection
- **THEN** the selected color's primary image remains shown rather than reverting to the original color

#### Scenario: JavaScript is unavailable
- **WHEN** a shopper has JavaScript disabled
- **THEN** swatch buttons remain non-navigating and the card retains its server-rendered initial color and normal product link

### Requirement: Hover reveals a second, color-matched image
Each swatch chip SHALL carry a reference to that color's second color-coded media item when one exists, identified by matching media filename color codes rather than by global position. On pointer-capable desktop, the second image for the currently selected color SHALL be materialized client-side only and revealed only while the pointer is geometrically over the card image area. When selection changes, both the primary and materialized second image SHALL follow the newly selected color without a fade. Touch-only devices SHALL not fetch the hover-only second image.

#### Scenario: Shopper hovers a card whose active color has a second shot
- **WHEN** a shopper on a pointer-capable device moves the pointer over the image area of a card whose selected color has a second shot
- **THEN** that selected color's second image is inserted after the primary image and revealed without a fade

#### Scenario: Shopper switches color after the pair exists
- **WHEN** a shopper selects another color after the second image has been materialized
- **THEN** the primary image and second image update to that color's first and second shots, while chip interaction itself continues showing the first shot

#### Scenario: Pointer leaves the image area
- **WHEN** the pointer moves from the card image area to its swatches, title, or outside the card
- **THEN** the selected color's first image is shown again without a fade

#### Scenario: Color has only one shot
- **WHEN** the selected color has no second media item matching its filename code
- **THEN** no second image is materialized and the card retains its normal single-image behavior

#### Scenario: Touch-only device
- **WHEN** a shopper on a touch-only device views or selects a color on the product card
- **THEN** no hover-only second image is fetched

#### Scenario: The section's own secondary-image setting is enabled
- **WHEN** the rendering section has Dawn's `show_secondary_image` setting on, so a non-color-aware second image is already server-rendered
- **THEN** that image is left untouched rather than being replaced or duplicated

## REMOVED Requirements

### Requirement: Swatch links target the correct variant across any rendering context
**Reason**: SB parity requires chips to select a color in place instead of navigating; the card's normal product links become the variant navigation surface.

**Migration**: Render native buttons with the variant URL in data, then retarget the card links when a chip is selected.
