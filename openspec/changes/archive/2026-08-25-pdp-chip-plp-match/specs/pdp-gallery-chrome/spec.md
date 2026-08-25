## MODIFIED Requirements

### Requirement: Main gallery image sits in a framed surface
The main gallery image SHALL render inside a color-mixed surface (matching the PLP card-swatch treatment defined by `plp-card-swatches`) with a 3.2rem radius and a fixed `1/1` aspect, clipped to that radius. The image SHALL be contained rather than cropped, SHALL fill the surface without an inset, and SHALL render with a multiply blend against the surface. The frame SHALL be borderless at rest (a transparent, reserved-width border); hovering or keyboard-focusing the frame's zoom control SHALL present a hairline border together with the surface returning to its full (non-mixed) tint. Exactly one such border/box-shadow indicator SHALL be visible at a time: any square-cornered border the base theme applies to an enclosing media container, and any box-shadow ring the base theme draws for its own active/focus states, SHALL both be suppressed, so no second outline or ring ever appears alongside the frame's hairline.

Two deliberate departures from the reference, both driven by the real asset pipeline rather than by taste:
- The reference insets the image by 4rem (2.4rem below its `sm` breakpoint). OB's Akeneo photography carries its own backdrop and whitespace, so that inset doubled up against the supplied one.
- The reference frames at `1.06/1`. Every Akeneo image across all six synced brands is exactly 1:1, so a 1.06 frame letterboxed the square photo and the radius clipped the resulting bars into a corner that read as a cropping fault.

#### Scenario: Square catalogue photography fills the frame

- **WHEN** a 1:1 product image renders in the gallery
- **THEN** it fills the surface edge to edge with no letterbox bars on any side, and its corners follow the surface radius

#### Scenario: Only one border is drawn

- **WHEN** the gallery renders inside the theme's own media container
- **THEN** exactly one border/box-shadow indicator is visible at a time, following the 3.2rem radius, with no square-cornered outline or extra ring appearing outside or alongside it

#### Scenario: Frame at rest is borderless

- **WHEN** the main gallery image is neither hovered nor focused
- **THEN** its border is transparent (reserved space only) and its surface is the color-mixed (translucent) tint, with no square-cornered outline or box-shadow ring visible anywhere around the frame

#### Scenario: Shopper hovers or focuses the zoom control

- **WHEN** a shopper points at, or keyboard-focuses, the main image's zoom trigger
- **THEN** the frame's surface lightens to its full (non-mixed) tint and a hairline border appears

#### Scenario: Non-square image is supplied

- **WHEN** a product supplies an image that is not 1:1
- **THEN** it is fully visible inside the fixed square surface without cropping, and the surface's height does not change between slides

#### Scenario: Gallery renders on mobile

- **WHEN** the PDP renders at a 390px viewport
- **THEN** the surface keeps its radius, the image fills it, and the page does not overflow horizontally

### Requirement: Thumbnails render as a four-column grid
Thumbnails SHALL render in a four-column grid at a 1.2rem gap, each square with a 1.2rem radius and a color-mixed surface (matching the PLP card-swatch treatment defined by `plp-card-swatches`), its image contained and filling the tile without an inset, clipped to the tile's radius, and rendered with a multiply blend against the surface. An unselected, unhovered thumbnail SHALL be borderless (a transparent, reserved-width border) with the color-mixed (translucent) surface tint. The active thumbnail, and any thumbnail being hovered or keyboard-focused, SHALL both present the same visual cue — the surface returning to its full (non-mixed) tint plus a hairline border — so the active thumbnail is distinguished purely by that surface-lightness cue, with no separate ink-colored border, box-shadow ring, or dimming. Focus-visible SHALL additionally draw an inset outline ring, since the hairline border alone is insufficient focus contrast. Any box-shadow ring or opacity change the base theme applies to its own active/hover/focus states SHALL be suppressed, across every pseudo-state combination the base theme defines for them (including the state produced by a plain mouse click), so only the hairline-border cue is ever visible.

#### Scenario: Product has more thumbnails than one row holds

- **WHEN** a product supplies more media than fit the visible columns
- **THEN** the additional thumbnails remain reachable by scrolling the rail rather than reflowing the frame or the counter row

#### Scenario: Shopper selects a thumbnail

- **WHEN** a shopper activates a thumbnail
- **THEN** the main image changes to that media and only that thumbnail shows the lightened surface and hairline border

#### Scenario: Shopper hovers an unselected thumbnail

- **WHEN** a shopper points at, or keyboard-focuses, an unselected thumbnail
- **THEN** that thumbnail's surface lightens to its full tone and a hairline border appears, without dimming the thumbnail

#### Scenario: Shopper clicks a thumbnail with a mouse

- **WHEN** a shopper clicks a thumbnail, leaving it focused without a keyboard-visible focus ring
- **THEN** it still shows only the lightened-surface and hairline-border cue, with no box-shadow ring or outline appearing
