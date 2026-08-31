# plp-card-swatches Specification

## Purpose
Renders the product card's color swatch row on every surface that renders `card-product.liquid` — the PLP grid, search results, homepage featured collections, related products, and collage blocks alike: one chip per color, each showing that color's own variant photo (this project's feed has no curated swatch-crop asset). Hovering a chip swaps the card image to that color and reveals its name; hovering the card reveals a second, color-matched shot. Also governs which color the card's base image represents, and where each chip links.
## Requirements
### Requirement: Card base image tracks the first available variant's color, not featured_media
The product card's base (non-hovered) image SHALL derive from `product.selected_or_first_available_variant`'s color — the same logic the PDP uses to choose its hero color — not from `featured_media` (simply the product's first uploaded image, in Akeneo upload order). This keeps the PLP grid tile and the PDP's initial hero color in agreement at all times, including once a color sells out.

#### Scenario: First-uploaded color is sold out
- **WHEN** a product's first-uploaded color (by Akeneo image order) has no available inventory in any size, but a later-uploaded color does
- **THEN** the PLP card shows the later color's image (matching what the PDP would show on load), not the sold-out first color

#### Scenario: First-uploaded color is available
- **WHEN** a product's first-uploaded color also has available inventory
- **THEN** the PLP card and PDP hero show the same color, same as before this change

### Requirement: Swatch row is interactive above the card's stretched link
The swatch row SHALL be positioned above the card's stretched heading-link overlay, so that chips are hoverable and clickable. Dawn's `.card__heading a::after` overlays the entire card, which would otherwise swallow every pointer event aimed at a chip.

#### Scenario: Shopper points at a swatch chip
- **WHEN** a shopper moves the pointer over a swatch chip
- **THEN** the chip receives the pointer event (tooltip appears, image swaps), rather than the card's stretched product link

### Requirement: Card image swaps to the hovered swatch
Hovering, focusing, or clicking a swatch chip SHALL select that color in place, swap the card's primary image to that color's photo, mark only that chip active, and expose the state through `aria-pressed`. The selected state SHALL persist after the pointer leaves the chip so the shopper can preview its first and second shots from the grid.

#### Scenario: Shopper hovers a non-active swatch
- **WHEN** a shopper hovers a swatch chip for a color other than the currently shown one
- **THEN** the card's primary image swaps to that color's photo, that chip becomes active and pressed, and the previously active chip is deactivated and unpressed

#### Scenario: Shopper clicks a non-active swatch
- **WHEN** a shopper clicks a swatch chip for a color other than the currently shown one
- **THEN** the same persistent in-grid selection occurs without navigating away

#### Scenario: Pointer leaves the swatch row
- **WHEN** the pointer moves away from the swatch row after a selection
- **THEN** the selected color's primary image remains shown rather than reverting to the original color

#### Scenario: JavaScript is unavailable
- **WHEN** a shopper has JavaScript disabled
- **THEN** swatch buttons remain non-navigating and the card retains its server-rendered initial color and normal product link

### Requirement: Hover reveals a second, color-matched image
Each swatch chip SHALL carry a reference to that color's second color-coded media item when one exists, identified by matching media filename color codes rather than by global position. On pointer-capable desktop, the second image for the currently selected color SHALL be materialized client-side only and revealed only while the pointer is geometrically over the card image area. When selection changes, both the primary and materialized second image SHALL follow the newly selected color without a fade. Touch-only devices SHALL not fetch the hover-only second image. When the rendering section's own `show_secondary_image` setting is on, the color-matched second shot SHALL take priority over that section's default second image by retargeting the same element, rather than being suppressed by it — this keeps hover behavior identical across every grid regardless of that per-section setting.

#### Scenario: Shopper hovers a card whose active color has a second shot
- **WHEN** a shopper on a pointer-capable device moves the pointer over the image area of a card whose selected color has a second shot
- **THEN** that selected color's second image is inserted after the primary image and revealed without a fade

#### Scenario: Shopper switches color after the pair exists
- **WHEN** a shopper selects another color after the second image has been materialized
- **THEN** the primary image and second image update to that color's first and second shots, while chip interaction itself continues showing the first shot

#### Scenario: Pointer leaves the image area
- **WHEN** the pointer moves from the card image area to its swatches, title, or outside the card
- **THEN** the selected color's first image is shown again without a fade

#### Scenario: Color has only one shot
- **WHEN** the selected color has no second media item matching its filename code
- **THEN** no second image is materialized and the card retains its normal single-image behavior

#### Scenario: Touch-only device
- **WHEN** a shopper on a touch-only device views or selects a color on the product card
- **THEN** no hover-only second image is fetched

#### Scenario: The section's own secondary-image setting is enabled
- **WHEN** the rendering section has Dawn's `show_secondary_image` setting on, so a non-color-aware second image is already server-rendered, and the currently selected color has its own second shot
- **THEN** that server-rendered element is retargeted to the selected color's second shot instead of showing the section's generic default, and no duplicate second `<img>` is created

#### Scenario: The section's own secondary-image setting is enabled and the active color has no second shot
- **WHEN** the rendering section has Dawn's `show_secondary_image` setting on and the currently selected color has no second shot of its own
- **THEN** the server-rendered element shows the section's original default second image, matching the color-has-only-one-shot fallback shoppers see everywhere else

### Requirement: Swatch selection retargets the card's product links
Each PLP color chip SHALL be a non-navigating button that selects its color within the product card. Selecting a chip SHALL retarget the card's normal product links to that color's matched variant URL, correctly joined whether or not the base product URL already has query parameters.

#### Scenario: Shopper clicks a non-active chip
- **WHEN** a shopper clicks a color chip for a different color
- **THEN** the card remains on the current grid, that color becomes selected, and no PDP navigation occurs

#### Scenario: Shopper opens the selected card
- **WHEN** a shopper selects a color and then activates the card's normal product link
- **THEN** the PDP opens with the selected color's matched variant in the URL

#### Scenario: Filtered card URL already contains a variant and tracking parameters
- **WHEN** a facet-refreshed card link already contains `variant`, `_pos`, `_fid`, and `_ss` parameters and the shopper selects another color
- **THEN** the link contains exactly one `variant` parameter for the new selection and retains the tracking parameters

#### Scenario: JavaScript is unavailable
- **WHEN** JavaScript is unavailable
- **THEN** the swatch buttons do not navigate or change the card, while the card's normal product link remains usable with its server-rendered initial variant

### Requirement: Swatch row renders below the card image with borderless, blended chips
The swatch row SHALL render directly beneath the card's main product image rather than after the price or other card content. Each chip SHALL apply `mix-blend-mode: multiply` to its own image over a surface derived from the card media's warm surface colour, matching the main image's treatment instead of a bordered chip look, and use a 0.5rem corner radius in every chip mode.

Selection SHALL be signalled primarily by the chip's own surface lightness, not by a drawn edge. At rest a chip's surface SHALL be the card media's warm surface colour lightened substantially toward white; the active or hovered chip SHALL carry the full, unlightened warm surface colour, making it the darkest chip in the row. The lightening SHALL be derived from that shared surface colour rather than being a fixed neutral, so a brand overriding the surface keeps a coherent pair of states.

No border SHALL be drawn on a card chip at rest. The active, hovered, and keyboard-focused states SHALL additionally draw a hairline border (`0.1rem solid #66666612`) on top of the surface-lightness cue. A chip SHALL always reserve a border's width transparently even when no border is drawn, so chip geometry stays identical across every state and drawing a border never insets the chip's image.

Keyboard focus SHALL additionally draw a foreground-coloured outline, because a difference in surface lightness alone is not a sufficient focus indicator. A chip in its unavailable style SHALL be indicated with reduced opacity rather than a dashed border.

#### Scenario: Card renders its swatch row
- **WHEN** a PLP card with multiple colors renders
- **THEN** the swatch row appears directly beneath the main product image, before the card's title/price content

#### Scenario: Chips at rest
- **WHEN** a card's chip row renders with no chip active or hovered
- **THEN** every chip's surface is the card's warm surface colour lightened toward white, and no chip has a drawn border

#### Scenario: Chip is active or keyboard-focused
- **WHEN** a chip is the active selection or is hovered
- **THEN** its surface returns to the full warm surface colour, making it visibly darker than the resting chips beside it
- **AND** a hairline `0.1rem solid #66666612` border is drawn around it, and the chip's image neither shifts nor changes size
- **AND WHEN** a keyboard user focuses a chip
- **THEN** a foreground-coloured outline is drawn, in addition to the chip taking its full-surface appearance and hairline border

#### Scenario: Chip has no resolvable image
- **WHEN** a color has no resolvable image and renders in its unavailable style
- **THEN** that style is reduced opacity, not a dashed border

#### Scenario: Card renders chips in either visual mode
- **WHEN** a card renders variant-photo chips, or flat colour chips under the alternative card-swatch style setting
- **THEN** both render with the same 0.5rem corner radius rather than one being square-ish and the other a circle

### Requirement: The card swatch row is a single-row rail with sized chips
The PLP card swatch row SHALL render every colour chip on one horizontal line that scrolls inline, never wrapping onto a second line regardless of how many colours the product has. Chip size SHALL be derived from the rail's own width so that exactly five chips are fully visible and the sixth is partially visible at the trailing edge, at every card width the grid produces. The partial sixth chip SHALL be the primary overflow affordance; the rail SHALL NOT show a scroll track of its own, because a product grid renders many rails at once.

#### Scenario: Product has more colours than fit the card
- **WHEN** a card renders a product with more than six colours
- **THEN** the chips occupy a single scrolling row showing five full chips and part of the sixth, and the card's title and price sit at the same height as on every other card in the grid

#### Scenario: Product has six or fewer colours
- **WHEN** a card renders a product with exactly six colours
- **THEN** five chips are fully visible and the sixth is partially visible, and the shopper can scroll or use the rail controls to reach it

#### Scenario: Product has fewer colours than the visible count
- **WHEN** a card renders a product with three colours
- **THEN** all three chips render at the same size as chips on a many-colour card, left-aligned, with no overflow cues

#### Scenario: Grid renders at a narrower card width
- **WHEN** the same card renders in a narrower column (a denser desktop grid or a mobile two-up grid)
- **THEN** the chips shrink so that five full chips plus a partial sixth still fit that width

### Requirement: Card rail overflow is discoverable through fades and chevrons
The card rail SHALL show a directional edge fade and a chevron control on a side only while undiscovered chips remain in that direction, and SHALL hide both at the corresponding edge and entirely when no chips overflow. Activating a chevron SHALL advance or retreat the rail by exactly one chip, so the row never changes wholesale between glances and the shopper keeps their place; the movement SHALL honour reduced-motion preferences. Chevrons SHALL be buttons with localized accessible labels identifying their direction, SHALL be drawn in neutral theme foreground tones rather than a brand accent, and SHALL never navigate to the product page. On input without hover, chevrons SHALL NOT be rendered at all, since swiping is the native gesture there and the control would cover the peeking chip on a phone-width card.

#### Scenario: Shopper on a touch device
- **WHEN** a shopper views an overflowing card rail on a device without hover
- **THEN** no chevrons are shown, and the peeking chip and fade remain as the overflow cues

#### Scenario: More colours exist to the right
- **WHEN** a card rail is at its initial scroll position with chips beyond the visible area
- **THEN** the trailing fade and next chevron are visible and the leading fade and previous chevron are hidden

#### Scenario: Shopper reaches the last chip
- **WHEN** the shopper scrolls a card rail to its end
- **THEN** the trailing fade and next chevron are hidden and the previous chevron remains available

#### Scenario: All chips fit
- **WHEN** every chip fits within the rail
- **THEN** no fades and no chevrons are displayed

#### Scenario: Shopper activates a chevron
- **WHEN** a shopper clicks or keyboard-activates a card rail chevron
- **THEN** the rail advances by one chip in that direction, the cue states update, and the shopper stays on the current grid with no colour selection or navigation triggered

#### Scenario: Grid is replaced by a filter or sort change
- **WHEN** Dawn replaces the product grid after a facet or sort change
- **THEN** the rails in the newly rendered cards are set up with working scroll cues and chevrons

#### Scenario: Card rail initialises below the fold
- **WHEN** cards whose rails are outside the viewport are initialised or a chip outside the visible rail area becomes the selected one
- **THEN** only the rail scrolls horizontally to reveal that chip and the page's own scroll position is left untouched

### Requirement: Chip imagery is requested at the density it renders at
A chip's image SHALL be requested at a source size that stays sharp on high-density displays at the largest size the chip renders anywhere — the rail sizes chips from the card width, so the same chip is larger on a wide featured-collection card than on a dense collection card. The candidate widths offered to the browser SHALL cover that range rather than a single small crop.

#### Scenario: Chip on a high-density display
- **WHEN** a shopper on a 2x or 3x display views a card chip
- **THEN** the chip's image is rendered from a source at least as large as its device-pixel size, not upscaled from a smaller crop

#### Scenario: Same chip on a wider card
- **WHEN** the same product renders on a wide card where chips are larger
- **THEN** the browser can select a larger candidate for the chip rather than stretching the densest available one

### Requirement: Swatch chip reveals the color name through the shared tooltip
Each swatch chip SHALL reveal its color's display name on hover or keyboard focus, so shoppers can identify a colorway without leaving the grid. Because the chips sit in a horizontally scrolling rail whose track clips its own vertical overflow, the name SHALL be shown in the same shared, viewport-positioned tooltip node the PDP colour chips use, rendered outside that track, rather than as a chip-anchored pseudo-element.

#### Scenario: Shopper hovers a swatch chip
- **WHEN** a shopper hovers a chip
- **THEN** a tooltip appears above that chip showing that color's name (e.g. "Midnight Navy")

#### Scenario: Keyboard user focuses a swatch chip
- **WHEN** a keyboard user tabs to a chip
- **THEN** the same tooltip appears as on hover

#### Scenario: Tooltip on a chip inside the scrolling rail
- **WHEN** a shopper hovers any chip in the rail, including the partially visible one at the trailing edge
- **THEN** the tooltip is fully visible above the rail rather than clipped by the rail's scroll track

### Requirement: Card visual treatment applies to every surface rendering the product card

The swatch-row visual treatment defined by this capability — borderless/blended chips, the surface-lightness selection cue with hairline border, the single-row rail with fades/chevrons, and the shared tooltip — SHALL apply identically wherever `card-product.liquid` renders, not only within the collection/search grid. A shopper SHALL NOT be able to tell, from the swatch row alone, whether a card is rendering inside the PLP grid, a homepage featured collection, a related-products rail, or a collage block.

#### Scenario: Card renders inside a homepage featured collection
- **WHEN** a product card with multiple colors renders inside a "Featured collection" section on the homepage
- **THEN** its swatch row shows the same borderless/blended chips, surface-lightness selection cue, and single-row rail behavior as a card in the collection grid

#### Scenario: Card renders inside related products
- **WHEN** a product card renders inside the PDP's related-products section
- **THEN** its swatch row matches the collection-grid treatment, including rail overflow fades/chevrons when the product has more colors than fit

#### Scenario: Card renders inside a collage block
- **WHEN** a product card renders inside a homepage collage block
- **THEN** its swatch row matches the collection-grid treatment

#### Scenario: Card renders inside the collection grid or search results
- **WHEN** a product card renders inside the collection page or search results grid
- **THEN** behavior is unchanged from before this requirement was added

### Requirement: PLP card swatch visual is merchant-switchable
The theme SHALL provide one global presentation setting for PLP card color controls, with `color swatches` as the default and `image chips` as the retained alternative. Changing the setting SHALL change only the chip visual; selection, pressed state, card-image swapping, matched second-shot hover, and variant-link retargeting SHALL behave identically in both modes.

#### Scenario: Default color-swatch mode
- **WHEN** the merchant has not explicitly changed the PLP card swatch presentation setting
- **THEN** product cards render color swatches while retaining the existing interactive behavior

#### Scenario: Merchant restores image chips
- **WHEN** the merchant selects the image-chip presentation
- **THEN** product cards render the existing cropped variant-photo chips without a code or template change

### Requirement: Color-swatch mode resolves variant filter-color values safely
In color-swatch mode, each PLP color option SHALL resolve the `custom.filtercolors` values of its matched variant. One valid hex value SHALL render a solid swatch; multiple valid hex values SHALL render a segmented swatch containing every valid value; and no valid hex value SHALL fall back to that variant's image chip. Untrusted or malformed text SHALL NOT be emitted as executable inline CSS.

#### Scenario: Variant has one filter color
- **WHEN** the matched variant carries one `filtercolors` entry with a valid hex value
- **THEN** the chip renders that hex as a solid color

#### Scenario: Variant has several filter colors
- **WHEN** the matched variant carries multiple `filtercolors` entries with valid hex values
- **THEN** the chip renders all of those colors as equal segments

#### Scenario: Variant has no valid filter color
- **WHEN** the matched variant has no readable `filtercolors` reference or every referenced hex value is malformed or blank
- **THEN** the chip renders the existing cropped variant photo, or the neutral unavailable state if no photo exists

