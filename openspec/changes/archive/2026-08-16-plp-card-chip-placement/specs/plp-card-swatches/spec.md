## ADDED Requirements

### Requirement: Swatch row renders below the card image with borderless, blended chips
The swatch row SHALL render directly beneath the card's main product image rather than after the price or other card content. Each chip SHALL share the card media's warm surface color and apply `mix-blend-mode: multiply` to its own image, matching the main image's treatment instead of a bordered chip look. An active or keyboard-focused chip SHALL be indicated with an outline rather than a border, and a chip in its unavailable style SHALL be indicated with reduced opacity rather than a dashed border.

#### Scenario: Card renders its swatch row
- **WHEN** a PLP card with multiple colors renders
- **THEN** the swatch row appears directly beneath the main product image, before the card's title/price content

#### Scenario: Chip is active or keyboard-focused
- **WHEN** a chip is the active selection or receives keyboard focus
- **THEN** it is indicated with an outline, not a border

#### Scenario: Chip has no resolvable image
- **WHEN** a color has no resolvable image and renders in its unavailable style
- **THEN** that style is reduced opacity, not a dashed border
