# plp-card-swatches Specification

## Purpose
Renders the PLP product card's color swatch row: one chip per color, each showing that color's own variant photo (this project's feed has no curated swatch-crop asset). Hovering a chip swaps the card image to that color and reveals its name; hovering the card reveals a second, color-matched shot. Also governs which color the card's base image represents, and where each chip links.
## Requirements
### Requirement: Swatch chip visual is always the color's own variant photo
Each PLP card swatch chip SHALL render the color's first variant's own product photo, cropped square. Unlike the reuse-source project, this project's Akeneo feed carries no per-color curated swatch-image metaobject and no curated color-crop map, so there is no preference chain to try before it — the variant photo is the only source. If a color has no resolvable image at all, the chip renders in a neutral/unavailable style rather than a broken or empty background.

#### Scenario: Color has a variant with a product photo
- **WHEN** a color value's first variant has a product image
- **THEN** its chip renders that image, cropped to a square

#### Scenario: Color has no image at all
- **WHEN** a color value's first variant has no resolvable product image
- **THEN** the chip renders in its unavailable style instead of a broken or empty background

### Requirement: Card base image tracks the first available variant's color, not featured_media
The product card's base (non-hovered) image SHALL derive from `product.selected_or_first_available_variant`'s color — the same logic the PDP uses to choose its hero color — not from `featured_media` (simply the product's first uploaded image, in Akeneo upload order). This keeps the PLP grid tile and the PDP's initial hero color in agreement at all times, including once a color sells out.

#### Scenario: First-uploaded color is sold out
- **WHEN** a product's first-uploaded color (by Akeneo image order) has no available inventory in any size, but a later-uploaded color does
- **THEN** the PLP card shows the later color's image (matching what the PDP would show on load), not the sold-out first color

#### Scenario: First-uploaded color is available
- **WHEN** a product's first-uploaded color also has available inventory
- **THEN** the PLP card and PDP hero show the same color, same as before this change

### Requirement: Swatch row is interactive above the card's stretched link
The swatch row SHALL be positioned above the card's stretched heading-link overlay, so that chips are hoverable and clickable. Dawn's `.card__heading a::after` overlays the entire card, which would otherwise swallow every pointer event aimed at a chip.

#### Scenario: Shopper points at a swatch chip
- **WHEN** a shopper moves the pointer over a swatch chip
- **THEN** the chip receives the pointer event (tooltip appears, image swaps), rather than the card's stretched product link

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

### Requirement: Swatch chip reveals the color name on hover or focus
Each swatch chip SHALL reveal its color's display name in a CSS-only tooltip on hover or keyboard focus, so shoppers can identify a colorway without leaving the grid. The tooltip SHALL use fixed-height sizing rather than auto-height, to prevent vertical jitter when the swatch row wraps across multiple lines and chips sit at differing Y-offsets.

#### Scenario: Shopper hovers a swatch chip
- **WHEN** a shopper hovers a chip
- **THEN** a tooltip appears showing that color's name (e.g. "Midnight Navy")

#### Scenario: Keyboard user focuses a swatch chip
- **WHEN** a keyboard user tabs to a chip
- **THEN** the same tooltip appears as on hover

#### Scenario: Swatch row wraps onto multiple lines
- **WHEN** a product has enough colors that the swatch row wraps
- **THEN** each chip's tooltip renders at a consistent vertical offset relative to its own chip, with no jitter between rows

### Requirement: Hover reveals a second, color-matched image
Each swatch chip SHALL carry a reference to that color's second color-coded media item when one exists, identified by matching media filename color codes rather than by global position. On pointer-capable desktop, the second image for the currently selected color SHALL be materialized client-side only and revealed only while the pointer is geometrically over the card image area. When selection changes, both the primary and materialized second image SHALL follow the newly selected color without a fade. Touch-only devices SHALL not fetch the hover-only second image. When the rendering section's own `show_secondary_image` setting is on, the color-matched second shot SHALL take priority over that section's default second image by retargeting the same element, rather than being suppressed by it — this keeps hover behavior identical across every grid regardless of that per-section setting.

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
- **WHEN** the rendering section has Dawn's `show_secondary_image` setting on, so a non-color-aware second image is already server-rendered, and the currently selected color has its own second shot
- **THEN** that server-rendered element is retargeted to the selected color's second shot instead of showing the section's generic default, and no duplicate second `<img>` is created

#### Scenario: The section's own secondary-image setting is enabled and the active color has no second shot
- **WHEN** the rendering section has Dawn's `show_secondary_image` setting on and the currently selected color has no second shot of its own
- **THEN** the server-rendered element shows the section's original default second image, matching the color-has-only-one-shot fallback shoppers see everywhere else

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
