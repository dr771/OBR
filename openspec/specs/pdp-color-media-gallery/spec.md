# pdp-color-media-gallery Specification

## Purpose
Provides a coherent PDP media gallery in which every selected color displays only its own photography plus intentionally shared product media.
## Requirements
### Requirement: PDP media surfaces show the selected color's gallery
When a product has a recognized color option and selected-variant color code, the main gallery, thumbnail rail, and expanded media modal SHALL include only media whose filename carries that selected color code, plus color-neutral media.

#### Scenario: Grey color is selected
- **WHEN** a product contains Rust, Grey, Blue, and Beige media and the selected variant's color code is Grey's code
- **THEN** all PDP media surfaces contain Grey-coded and color-neutral media and contain no Rust-, Blue-, or Beige-coded media

#### Scenario: Media has no parseable color code
- **WHEN** the product contains a video, 3D model, or generic image without the Akeneo filename convention
- **THEN** that media remains visible for every selected color

### Requirement: Selecting a color replaces the complete gallery natively
Changing the selected color SHALL update the main gallery, thumbnails, modal content, active media, and gallery count through Dawn's existing variant section refresh without a page reload or a custom client-side gallery data source.

#### Scenario: Shopper switches from Grey to Blue
- **WHEN** the shopper selects Blue on a PDP initially showing Grey
- **THEN** Grey-only media is removed, Blue-only media is inserted in source order, the Blue featured media becomes active, and the URL/form resolve the Blue variant

### Requirement: Gallery count and navigation reflect filtered media
Every visible gallery count and its single-item/slider navigation state SHALL be derived from the number of media items actually included for the selected color and SHALL never render a negative, infinite, or unrelated all-color total.

#### Scenario: Selected color owns three images
- **WHEN** the full product has nine images but the selected color gallery contains three and no shared media
- **THEN** the gallery count is `3` and navigation operates across exactly those three images

#### Scenario: Duplicate variant image references exceed media count
- **WHEN** Dawn's variant-image collection contains repeated references across color-size variants
- **THEN** the gallery still renders a finite count based on included unique product media

### Requirement: Color-code variants supported by OB remain matchable
Gallery filtering SHALL normalize the selected variant's hyphenated Akeneo SKU color code to the media filename's underscore convention, and SHALL treat a media filename as carrying that color when the normalized code appears, case-insensitively, as whole underscore-separated segments immediately before the filename's shot separator (`__`). This SHALL hold for single-segment and multi-segment color codes and regardless of how many segments the item code occupies in the filename.

#### Scenario: Multi-segment Loewenweiss color code
- **WHEN** the selected variant SKU carries color code `192-953` and media filenames carry `192_953`
- **THEN** those media remain in the selected gallery and media for other codes are excluded

#### Scenario: Hyphenated item code
- **WHEN** the selected variant SKU is `MSV-55__CVRT__S` and the media filenames are `{sha1}_MSV_55_CVRT__01.jpg`, `…__02.jpg`, `…__03.jpg`
- **THEN** all three images appear in the selected gallery

### Requirement: Unrecognized product data fails open
If the product has no recognized color option or the selected variant has no parseable Akeneo color code, the PDP SHALL render all product media in source order rather than hiding content or raising an error. If no product media carries the selected color code, the PDP SHALL render the gallery it renders without color filtering (Dawn's own media behavior, including its hide-other-variants setting) and SHALL NOT render an empty gallery.

#### Scenario: Product has no color option
- **WHEN** a product contains only a size option
- **THEN** all product media remain visible

#### Scenario: Selected variant SKU is blank or nonconforming
- **WHEN** the selected variant SKU does not match `{item}__{color_code}__{size}`
- **THEN** all product media remain visible

#### Scenario: Selected color has no photos of its own
- **WHEN** the selected variant's color code is `NATM` and every product image is coded `BL`
- **THEN** the gallery shows the selected variant's featured image and Dawn's unfiltered media set, its count matches the rendered items, and it is never empty

### Requirement: Initial image loading priority is preserved
The selected color's featured media SHALL remain the initial eager/LCP gallery image, while subsequent matching/shared images SHALL retain Dawn's lazy-loading behavior.

#### Scenario: Color gallery contains multiple images
- **WHEN** the PDP initially renders a selected color with three media items
- **THEN** only its featured first image is rendered without lazy loading and later images remain lazy loaded

