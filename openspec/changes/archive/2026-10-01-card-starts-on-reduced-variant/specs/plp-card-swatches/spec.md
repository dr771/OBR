## RENAMED Requirements

- FROM: `### Requirement: Card base image tracks the first available variant's color, not featured_media`
- TO: `### Requirement: Card base image tracks the card variant's color, not featured_media`

## MODIFIED Requirements

### Requirement: Card base image tracks the card variant's color, not featured_media
The product card SHALL resolve one card variant and derive its base (non-hovered) image, its initially active color chip, and the variant in its product links from that variant, not from `featured_media` (simply the product's first uploaded image, in Akeneo upload order). The card variant SHALL be, in order: the variant Shopify has narrowed the product to when a variant-level filter is active or a search query matched a variant; otherwise the first available variant whose compare-at price is greater than its price; otherwise `product.selected_or_first_available_variant`. When the card variant differs from Shopify's own default variant, the card's product links SHALL carry it as the `variant` parameter, so the PDP opens on the color the card showed.

#### Scenario: First-uploaded color is sold out
- **WHEN** a product's first-uploaded color (by Akeneo image order) has no available inventory in any size, but a later-uploaded color does, and no variant is reduced
- **THEN** the card shows the later color's image (matching what the PDP would show on load), not the sold-out first color

#### Scenario: First-uploaded color is available
- **WHEN** a product has no reduced variant and its first-uploaded color has available inventory
- **THEN** the card and PDP hero show the same color

#### Scenario: Only a later color is reduced
- **WHEN** a product's first available variant is full price and a later color has an available variant with a compare-at price greater than its price
- **THEN** the card shows the reduced color's image, marks that color's chip active, and links to that reduced variant, on every surface that renders the card

#### Scenario: Compare-at price is zero, unset, or equal to the price
- **WHEN** a variant's compare-at price is unset, `0`, or not greater than its price
- **THEN** that variant is not treated as reduced and does not change which color the card shows

#### Scenario: A variant-level filter is active
- **WHEN** a color or size filter has narrowed the product to a matching variant and a different color is reduced
- **THEN** the card keeps the filtered variant's color rather than switching to the reduced one

#### Scenario: A search query matched a full-price variant
- **WHEN** a shopper searches for a full-price color's name or SKU and a different color of that product is reduced
- **THEN** the card shows the searched variant, not the reduced one

#### Scenario: Reduced color is sold out
- **WHEN** the only reduced variants of a product are unavailable
- **THEN** the card falls back to the first available variant

## ADDED Requirements

### Requirement: A size-filtered listing links cards to the filtered size
While the listing's size filter is active, the card's product links and each color chip's link target SHALL name the variant of that color in a filtered size, when that variant is available, so the PDP opens on the size the shopper asked for. The size filter is a product-level filter that Shopify does not resolve to a variant; the card SHALL resolve it by matching the filter's active values against the product's size option values. The filter SHALL NOT change which color the card shows, its image, or its badge. A color that has no available variant in a filtered size SHALL keep the link it would have without the filter. An existing `variant` parameter in the card URL SHALL be replaced in place, leaving every other parameter intact.

#### Scenario: Listing filtered to one size
- **WHEN** a listing is filtered to size 37 and the card's shown color has size 37 available
- **THEN** the card's product link carries that color's size-37 variant, and the card's image, active chip and badge are the same as without the filter

#### Scenario: Shopper selects another color under a size filter
- **WHEN** the listing is filtered to size 37 and a shopper selects a chip whose color has size 37 available
- **THEN** the product link carries that color's size-37 variant

#### Scenario: Shown color lacks the filtered size
- **WHEN** the shown color has no available variant in any filtered size
- **THEN** the card keeps the link it would have without the size filter

#### Scenario: Size and color filters are both active
- **WHEN** a color filter has put a `variant` parameter in the card URL and a size filter is also active
- **THEN** the link names the filtered color in the filtered size, with exactly one `variant` parameter and the tracking parameters unchanged

### Requirement: A reduced color's chip links to its reduced variant
When a color has an available variant whose compare-at price is greater than its price, selecting that color's chip SHALL retarget the card's product links to that reduced variant rather than to the color's first variant.

#### Scenario: Shopper selects a reduced color
- **WHEN** a shopper selects the chip of a color whose first size is full price or sold out but another size is available and reduced
- **THEN** the card's product link carries the reduced variant

#### Scenario: Shopper selects a full-price color
- **WHEN** a shopper selects the chip of a color with no available reduced variant
- **THEN** the card's product link carries that color's first variant, as before
