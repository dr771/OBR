## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Swatch row renders below the card image with borderless, blended chips
The swatch row SHALL render directly beneath the card's main product image rather than after the price or other card content. Each chip SHALL share the card media's warm surface color, apply `mix-blend-mode: multiply` to its own image, matching the main image's treatment instead of a bordered chip look, and use a 0.5rem corner radius in every chip mode. The active or hovered chip SHALL be marked with a hairline border one step darker than that shared surface colour — derived from it, not a fixed neutral — and never with a heavy or high-contrast ring. Every chip SHALL reserve that border's width whether or not it is drawn, so turning it on does not inset the chip's image. Keyboard focus SHALL additionally draw a foreground-coloured outline, because a hairline that quiet is not a focus indicator. A chip in its unavailable style SHALL be indicated with reduced opacity rather than a dashed border.

#### Scenario: Card renders its swatch row
- **WHEN** a PLP card with multiple colors renders
- **THEN** the swatch row appears directly beneath the main product image, before the card's title/price content

#### Scenario: Chip is active or keyboard-focused
- **WHEN** a chip is the active selection or is hovered
- **THEN** a hairline border a step darker than the card's surface colour is drawn around it, and the chip's image neither shifts nor changes size
- **AND WHEN** a keyboard user focuses a chip
- **THEN** a foreground-coloured outline is drawn in addition to the hairline

#### Scenario: Chip has no resolvable image
- **WHEN** a color has no resolvable image and renders in its unavailable style
- **THEN** that style is reduced opacity, not a dashed border

#### Scenario: Card renders chips in either visual mode
- **WHEN** a card renders variant-photo chips, or flat colour chips under the alternative card-swatch style setting
- **THEN** both render with the same 0.5rem corner radius rather than one being square-ish and the other a circle

## REMOVED Requirements

### Requirement: Swatch chip reveals the color name on hover or focus
**Reason**: Both of this requirement's premises are gone. The row no longer wraps, so there is no multi-line jitter to defend against with fixed-height sizing, and a chip-anchored CSS pseudo-element tooltip cannot escape the rail's scroll track at all.

**Migration**: Replaced by "Swatch chip reveals the color name through the shared tooltip", which keeps the same shopper-visible behaviour (hover and keyboard focus both reveal the colour name) using the shared viewport-positioned tooltip node the PDP chips already use.
