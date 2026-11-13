## MODIFIED Requirements

### Requirement: PDP media surfaces show the selected color's gallery
When a product has a recognized color option and selected-variant color code, the main gallery, thumbnail rail, and expanded media modal SHALL include only media whose filename carries that selected color code, plus color-neutral media.

#### Scenario: Grey color is selected
- **WHEN** a product contains Rust, Grey, Blue, and Beige media and the selected variant's color code is Grey's code
- **THEN** all PDP media surfaces contain Grey-coded and color-neutral media and contain no Rust-, Blue-, or Beige-coded media

#### Scenario: Media has no parseable color code
- **WHEN** the product contains a video, 3D model, or generic image without the Akeneo filename convention
- **THEN** that media remains visible for every selected color

### Requirement: Color-code variants supported by OB remain matchable
Gallery filtering SHALL normalize the selected variant's hyphenated Akeneo SKU color code to the media filename's underscore convention, and SHALL treat a media filename as carrying that color when the normalized code appears, case-insensitively, as whole underscore-separated segments immediately before the filename's shot separator (`__`). This SHALL hold for single-segment and multi-segment color codes and regardless of how many segments the item code occupies in the filename.

#### Scenario: Multi-segment Loewenweiss color code
- **WHEN** the selected variant SKU carries color code `192-953` and media filenames carry `192_953`
- **THEN** those media remain in the selected gallery and media for other codes are excluded

#### Scenario: Hyphenated item code
- **WHEN** the selected variant SKU is `MSV-55__CVRT__S` and the media filenames are `{sha1}_MSV_55_CVRT__01.jpg`, `…__02.jpg`, `…__03.jpg`
- **THEN** all three images appear in the selected gallery

### Requirement: Unrecognized product data fails open
If the product has no recognized color option, the selected variant has no parseable Akeneo color code, or no product media carries the selected color code, the PDP SHALL render all product media in source order rather than hiding content or raising an error.

#### Scenario: Product has no color option
- **WHEN** a product contains only a size option
- **THEN** all product media remain visible

#### Scenario: Selected variant SKU is blank or nonconforming
- **WHEN** the selected variant SKU does not match `{item}__{color_code}__{size}`
- **THEN** all product media remain visible

#### Scenario: Selected color has no photos of its own
- **WHEN** the selected variant's color code is `NATM` and every product image is coded `BL`
- **THEN** all product media remain visible and the gallery count equals the product's media count
