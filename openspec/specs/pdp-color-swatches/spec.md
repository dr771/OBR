# pdp-color-swatches Specification

## Purpose
Renders the PDP color picker as image swatch chips showing each color's own variant photo, kept visually consistent with the PLP card's chips. This project's Akeneo feed uses neither Shopify's native swatch linking nor a curated color-crop asset, so the picker forces swatch presentation for color options itself.

## Requirements

### Requirement: PDP chip visual is always the color's own variant photo
Each PDP color picker chip SHALL render the color's first variant's own product photo, cropped square — the same single-tier source as the PLP card swatch (see `plp-card-swatches`), for consistency between the two surfaces. No metaobject-image or curated-map tier exists in this project's feed to prefer ahead of it. If a color has no resolvable image, the chip renders in its unavailable style.

#### Scenario: Color's variant has a product photo
- **WHEN** a color value's first variant has a product image
- **THEN** the PDP chip renders that image, cropped square, matching the equivalent PLP card chip for the same color

#### Scenario: Color has no image at all
- **WHEN** a color value's first variant has no resolvable product image
- **THEN** the chip renders in its unavailable style instead of a broken or empty background
