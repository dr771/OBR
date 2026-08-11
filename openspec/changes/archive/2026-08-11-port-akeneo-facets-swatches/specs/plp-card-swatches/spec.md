# plp-card-swatches Delta

## ADDED Requirements

### Requirement: Swatch chip visual is always the color's own variant photo
Each PLP card swatch chip SHALL render the color's first variant's own product photo, cropped square. Unlike the reuse-source project, this project's Akeneo feed carries no per-color curated swatch-image metaobject and no curated color-crop map, so there is no preference chain to try before it — the variant photo is the only source. If a color has no resolvable image at all, the chip renders in a neutral/unavailable style rather than a broken or empty background.

#### Scenario: Color has a variant with a product photo
- **WHEN** a color value's first variant has a product image
- **THEN** its chip renders that image, cropped to a square

#### Scenario: Color has no image at all
- **WHEN** a color value's first variant has no resolvable product image
- **THEN** the chip renders in its unavailable style instead of a broken or empty background

### Requirement: Card base image tracks the first available variant's color, not featured_media
The product card's base (non-hovered) image SHALL derive from `product.selected_or_first_available_variant`'s color — the same logic the PDP uses to choose its hero color — not from `featured_media` (simply the product's first uploaded image, in Akeneo upload order). This keeps the PLP grid tile and the PDP's initial hero color in agreement at all times, including once a color sells out.

#### Scenario: First-uploaded color is sold out
- **WHEN** a product's first-uploaded color (by Akeneo image order) has no available inventory in any size, but a later-uploaded color does
- **THEN** the PLP card shows the later color's image (matching what the PDP would show on load), not the sold-out first color

#### Scenario: First-uploaded color is available
- **WHEN** a product's first-uploaded color also has available inventory
- **THEN** the PLP card and PDP hero show the same color, same as before this change

### Requirement: Swatch links target the correct variant across any rendering context
The swatch chip's link SHALL point to the card's product URL with the matched variant's ID appended as a query parameter, correctly joined whether or not the base URL already carries query parameters. The option-value drop's own `product_url` SHALL NOT be used, because it is only populated on a product's own page and renders empty on a card (producing a dead link to the current page).

#### Scenario: Card URL has no existing query string
- **WHEN** `card_product.url` has no `?` (e.g. a plain collection grid card)
- **THEN** the variant link appends `?variant=<id>`

#### Scenario: Card URL already carries tracking parameters
- **WHEN** `card_product.url` already contains a query string (e.g. `pr_prod_strat=...` from product recommendations)
- **THEN** the variant link appends `&variant=<id>` instead of a second `?`, producing a valid URL

### Requirement: Swatch row is interactive above the card's stretched link
The swatch row SHALL be positioned above the card's stretched heading-link overlay, so that chips are hoverable and clickable. Dawn's `.card__heading a::after` overlays the entire card, which would otherwise swallow every pointer event aimed at a chip.

#### Scenario: Shopper points at a swatch chip
- **WHEN** a shopper moves the pointer over a swatch chip
- **THEN** the chip receives the pointer event (tooltip appears, image swaps), rather than the card's stretched product link

### Requirement: Card image swaps to the hovered swatch
Hovering or focusing a swatch chip SHALL swap the card's primary image to that color's photo and mark that chip active, replacing whichever chip was previously active. The swap SHALL persist after the pointer leaves the chip (hover-persist), rather than reverting, so a shopper can compare colorways by sweeping across the row.

#### Scenario: Shopper hovers a non-active swatch
- **WHEN** a shopper hovers a swatch chip for a color other than the currently-shown one
- **THEN** the card's primary image swaps to that color's photo, that chip becomes the active one, and the previously active chip is deactivated

#### Scenario: Pointer leaves the swatch row
- **WHEN** the pointer moves away from the swatch row after a hover swap
- **THEN** the last-hovered color's image remains shown, rather than reverting to the original

#### Scenario: JavaScript is unavailable
- **WHEN** a shopper has JavaScript disabled
- **THEN** each chip still functions as a plain link to its variant, since the swap is a progressive enhancement layered on real anchors

### Requirement: Swatch chip reveals the color name on hover or focus
Each swatch chip SHALL reveal its color's display name in a CSS-only tooltip on hover or keyboard focus, so shoppers can identify a colorway without leaving the grid. The tooltip SHALL use fixed-height sizing rather than auto-height, to prevent vertical jitter when the swatch row wraps across multiple lines and chips sit at differing Y-offsets.

#### Scenario: Shopper hovers a swatch chip
- **WHEN** a shopper hovers a chip
- **THEN** a tooltip appears showing that color's name (e.g. "Midnight Navy")

#### Scenario: Keyboard user focuses a swatch chip
- **WHEN** a keyboard user tabs to a chip
- **THEN** the same tooltip appears as on hover

#### Scenario: Swatch row wraps onto multiple lines
- **WHEN** a product has enough colors that the swatch row wraps
- **THEN** each chip's tooltip renders at a consistent vertical offset relative to its own chip, with no jitter between rows

### Requirement: Hover reveals a second, color-matched image
Each swatch chip SHALL carry a reference to that color's second color-coded media item, when one exists — identified by matching media filename color codes, not by position or index. On hover of the card, a second `<img>` for the *currently active* color SHALL be materialized client-side only, never server-rendered, so that touch devices (where hover never fires) download no extra image. When the active color changes, the materialized image SHALL follow it.

#### Scenario: Shopper hovers a card whose active color has a second shot
- **WHEN** a shopper on a pointer-capable device hovers a product card
- **THEN** a second image for the currently active color is inserted after the primary image and revealed on card hover

#### Scenario: Shopper switches color after the pair exists
- **WHEN** a shopper hovers a different swatch chip after the second image has been materialized
- **THEN** both the primary and second image update to the newly active color's first and second shots

#### Scenario: Color has only one shot
- **WHEN** the active color has no second media item matching its filename code
- **THEN** no second image is materialized, and the card falls back to its normal single-image behavior

#### Scenario: Touch-only device
- **WHEN** a shopper on a touch-only device views the product card
- **THEN** no second image is fetched, because materialization only happens on a hover event

#### Scenario: The section's own secondary-image setting is enabled
- **WHEN** the rendering section has Dawn's `show_secondary_image` setting on, so a non-color-aware second image is already server-rendered
- **THEN** that image is left untouched rather than being replaced or duplicated
