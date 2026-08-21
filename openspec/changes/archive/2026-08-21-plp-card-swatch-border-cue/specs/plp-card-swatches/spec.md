## MODIFIED Requirements

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
