## MODIFIED Requirements

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
