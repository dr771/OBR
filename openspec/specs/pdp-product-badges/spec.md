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

### Requirement: Selected-variant sale status renders over the PDP gallery
The PDP SHALL render a sale badge over the gallery when the selected variant has a compare-at price greater than its current price, and SHALL render no sale badge in the price row. The gallery badge SHALL update from Shopify's section response whenever the shopper changes variants, without requiring a page reload.

#### Scenario: Selected variant is on sale
- **WHEN** the selected variant's compare-at price is greater than its current price
- **THEN** a sale badge appears at the gallery's top-left inset and no sale badge appears beside the PDP price

#### Scenario: Shopper selects a regular-price variant
- **WHEN** the shopper changes from a sale variant to a variant without a valid higher compare-at price
- **THEN** the gallery sale badge disappears while the PDP price updates normally

#### Scenario: Shopper selects a sale variant
- **WHEN** the shopper changes from a regular-price variant to a sale variant
- **THEN** the gallery sale badge appears from the same variant section update that refreshes the price

### Requirement: Gallery merchandising badges share one reference treatment
The sale and bestseller gallery badges SHALL share the measured 22px top-left inset, fully rounded accent pill, 0.6rem by 1.2rem padding, and white text. Every label SHALL render uppercase. The bestseller SHALL retain semibold 1.2rem text on a 1.6rem line, while the sale badge SHALL use the storefront sale-badge typography at 1.1rem, weight 500, 1.4rem line-height, and zero letter-spacing. When both states apply, both badges SHALL remain visible in a top-left vertical stack without overlap.

#### Scenario: Sale product is not a bestseller
- **WHEN** only the selected variant's sale status applies
- **THEN** its gallery pill keeps the bestseller badge's geometry, colour, and inset while using the sale-specific uppercase typography

#### Scenario: Sale product is also a bestseller
- **WHEN** the product is marked as a bestseller and the selected variant is on sale
- **THEN** both matching pills remain aligned at the gallery's top-left and are separated without overlap, with each badge retaining its own typography

### Requirement: PDP sale badge states the rounded-down selected-variant discount
The PDP gallery sale badge SHALL display the selected variant's discount as `-N%`, where `N` is `floor((compare_at_price - price) * 100 / compare_at_price)`. It SHALL use the selected variant prices that already determine sale visibility and SHALL update from the same Shopify section response when variants change.

#### Scenario: Selected variant has a fractional percentage saving
- **WHEN** the selected variant costs EUR 60 and has a compare-at price of EUR 70
- **THEN** the gallery sale badge displays `-14%`

#### Scenario: Shopper changes between differently discounted variants
- **WHEN** the shopper selects another sale variant with a different price or compare-at price
- **THEN** the badge displays that variant's rounded-down whole percentage without a page reload

#### Scenario: Percentage label replaces the generic sale word
- **WHEN** a sale variant renders on the PDP
- **THEN** the gallery badge displays only its `-N%` value while retaining the existing gallery-badge treatment
