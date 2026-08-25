## MODIFIED Requirements

### Requirement: Color and size targets retain their compact visual hierarchy
Color chips SHALL be 5.0rem square with a 0.8rem radius, matching the PLP card-swatch treatment (`plp-card-swatches`) rather than a bordered-box style: chips SHALL be borderless at rest (a transparent, reserved-width border), SHALL fill their full square with the color's image (no interior padding/inset), and SHALL render that image with a multiply blend against a color-mixed surface background. Hovering, activating, or focusing a chip, and the currently-selected chip, SHALL all present the same visual cue — a lighter, fully-opaque surface background plus a hairline border — so the selected chip is distinguished purely by that surface-lightness cue, with no separate ink-colored border or ring. Focus-visible SHALL additionally draw an inset outline ring, since the hairline border alone is insufficient focus contrast. Recognized size labels SHALL retain the responsive sizing defined by `pdp-size-picker-grid`. Theme foreground, background, and duration variables SHALL drive rail chrome rather than brand-specific values.

#### Scenario: Shopper views the picker on tablet width

- **WHEN** a product has both recognized color and size options in a narrow/tablet product-information column
- **THEN** color chips are 5.0rem square, so color choices do not read smaller than size choices

#### Scenario: Shopper selects a color

- **WHEN** a shopper selects a color chip
- **THEN** that chip shows the same lightened surface background and hairline border as a hovered chip, and no other chip carries that treatment

#### Scenario: Shopper hovers an unselected color chip

- **WHEN** a shopper points at (or keyboard-focuses) an unselected color chip
- **THEN** that chip's background lightens to the full surface tone and a hairline border appears, matching the resting appearance of the selected chip

#### Scenario: Chip at rest, unselected and unhovered

- **WHEN** a color chip is neither selected, hovered, nor focused
- **THEN** its border is transparent (reserved space only) and its background is the color-mixed (translucent) surface tone, so the image reads slightly muted compared to the selected/hovered state
