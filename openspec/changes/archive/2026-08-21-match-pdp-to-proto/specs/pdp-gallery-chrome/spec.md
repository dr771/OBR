## Purpose

Defines the PDP gallery's visual presentation — the framed main image, the thumbnail grid, and the counter row that carries the rail's navigation chevrons — separately from which media the gallery selects, which `pdp-color-media-gallery` governs.

## ADDED Requirements

### Requirement: Main gallery image sits in a framed surface
The main gallery image SHALL render inside a white surface with a 3.2rem radius, a single 1px hairline border, and a fixed `1/1` aspect, clipped to that radius. The image SHALL be contained rather than cropped, and SHALL fill the surface without an inset. Exactly one border SHALL be drawn around the gallery: any square-cornered border the base theme applies to an enclosing media container SHALL be suppressed, so a second right-angled outline never appears outside the rounded frame.

Two deliberate departures from the reference, both driven by the real asset pipeline rather than by taste:
- The reference insets the image by 4rem (2.4rem below its `sm` breakpoint). OB's Akeneo photography carries its own backdrop and whitespace, so that inset doubled up against the supplied one.
- The reference frames at `1.06/1`. Every Akeneo image across all six synced brands is exactly 1:1, so a 1.06 frame letterboxed the square photo and the radius clipped the resulting bars into a corner that read as a cropping fault.

#### Scenario: Square catalogue photography fills the frame

- **WHEN** a 1:1 product image renders in the gallery
- **THEN** it fills the surface edge to edge with no letterbox bars on any side, and its corners follow the surface radius

#### Scenario: Only one border is drawn

- **WHEN** the gallery renders inside the theme's own media container
- **THEN** exactly one hairline is visible, following the 3.2rem radius, with no square-cornered outline outside it

#### Scenario: Non-square image is supplied

- **WHEN** a product supplies an image that is not 1:1
- **THEN** it is fully visible inside the fixed square surface without cropping, and the surface's height does not change between slides

#### Scenario: Gallery renders on mobile

- **WHEN** the PDP renders at a 390px viewport
- **THEN** the surface keeps its radius and hairline, the image fills it, and the page does not overflow horizontally

### Requirement: Thumbnails render as a four-column grid
Thumbnails SHALL render in a four-column grid at a 1.2rem gap, each square with a 1.2rem radius and a white surface, its image contained and filling the tile without an inset, clipped to the tile's radius. An unselected thumbnail SHALL carry a hairline border; the selected thumbnail SHALL carry a full-ink border reinforced by a 1px ring, so selection stays legible without an inset to separate image from border.

#### Scenario: Product has more thumbnails than one row holds

- **WHEN** a product supplies more media than fit the visible columns
- **THEN** the additional thumbnails remain reachable by scrolling the rail rather than reflowing the frame or the counter row

#### Scenario: Shopper selects a thumbnail

- **WHEN** a shopper activates a thumbnail
- **THEN** the main image changes to that media and only that thumbnail shows the selected border and ring

### Requirement: Gallery navigation lives in a counter row beneath the thumbnails
A row beneath the thumbnails SHALL carry the localized image counter at its start and both rail navigation chevrons at its end. The chevrons SHALL retain the scrolling behaviour they have on the thumbnail rail and SHALL NOT be rendered flanking the rail.

#### Scenario: Product has more media than the rail shows at once

- **WHEN** a shopper activates the next chevron
- **THEN** the thumbnail rail advances, and no chevron appears to either side of the rail

#### Scenario: Counter reflects the selected media

- **WHEN** the selected media changes by any means
- **THEN** the counter row names the selected image's position within the media actually included for the selected colour

#### Scenario: Product has a single image

- **WHEN** a product's selected colour resolves to one image
- **THEN** the thumbnail grid and the counter row's chevrons are not rendered

### Requirement: Gallery chevrons present as circular controls
Each gallery chevron SHALL be a 3.4rem circular button with a white surface, a hairline border, and a 1.6rem directional glyph, carrying a localized accessible label naming its direction. Hover and keyboard focus SHALL each produce a visible change without removing the other's indicator.

#### Scenario: Keyboard user reaches a chevron

- **WHEN** keyboard focus lands on a gallery chevron
- **THEN** a visible focus indicator appears and the control's direction is announced

#### Scenario: Pointer user hovers a chevron

- **WHEN** a pointer hovers a gallery chevron
- **THEN** its border darkens to full ink while its size and position stay unchanged
