# pdp-product-badges Specification

## Purpose
Defines the bestseller badge and where it appears on the PDP, giving merchandisers a per-product way to mark standout items without editing the theme.
## Requirements
### Requirement: Bestseller status is set per product outside the theme
Whether a product is a bestseller SHALL be determined by per-product shop data rather than by theme code or a hard-coded list. A product without that data set SHALL render no badge anywhere.

#### Scenario: Merchandiser marks a product as a bestseller

- **WHEN** a product's bestseller flag is set in the shop
- **THEN** the badge appears on that product's PDP without a theme deployment

#### Scenario: Product is not marked

- **WHEN** a product has no bestseller flag set
- **THEN** neither badge placement renders and the surrounding layout closes up with no reserved gap

#### Scenario: Shop data is unavailable

- **WHEN** the bestseller field is absent from the shop entirely
- **THEN** the PDP renders normally with no badge and no error

### Requirement: Bestseller badge renders in two PDP placements
A bestseller product SHALL show the badge both overlaid on the gallery frame and beside the price. The two placements SHALL carry the same localized label and SHALL appear and disappear together.

#### Scenario: Bestseller product renders

- **WHEN** a product marked as a bestseller renders its PDP
- **THEN** the badge appears at the gallery frame's top-left inset from its corner, and again immediately after the price

#### Scenario: Shopper scrolls the gallery

- **WHEN** a shopper moves to another image in the gallery
- **THEN** the gallery badge stays in place over the frame rather than scrolling with the media

### Requirement: Badge placements use their reference treatments
The gallery badge SHALL be a fully rounded pill on the accent background with white text; the price badge SHALL be a fully rounded pill on the accent's tint background with the accent's dark ink. Both SHALL render their label at 1.2rem on a 1.6rem line at semibold weight.

#### Scenario: Both badges render on one page

- **WHEN** a bestseller product renders both placements
- **THEN** the gallery badge reads white on the accent colour and the price badge reads dark accent ink on the accent tint, each at the reference's radius, padding and type

#### Scenario: Badge label is translated

- **WHEN** the storefront renders in another available language
- **THEN** both placements show the translated label without overflowing their pill
