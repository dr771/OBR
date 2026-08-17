## MODIFIED Requirements

### Requirement: Brand corrections are expressed as variables, not new selectors
A per-brand correction SHALL be written as custom-property overrides on the brand's own `.ob-brand--*` class — inner padding (all sides or per side), `object-fit`, tile background, and blend mode. Brand blocks SHALL NOT introduce their own `.card__media` descendant selectors, because the card's swatch hover-pair rules already own that subtree and per-brand selectors there become unreasonable to maintain.

A brand's inner padding SHALL be expressed proportionally rather than as an absolute length, and SHALL apply to every image on the card cropped from that brand's photography — the main tile and the card's colour chips alike. The two differ in size by roughly six times, so an absolute value tuned on the tile would swallow a chip; a proportional one lands the same correction on both from a single number.

#### Scenario: A brand needs inner padding
- **WHEN** a brand's packshots run edge-to-edge and need breathing room
- **THEN** its block sets the padding variables only, and both the primary and hover/secondary image inherit the same inset so the pair does not change framing mid-hover

#### Scenario: A brand needs a different fit
- **WHEN** a brand's correction would otherwise re-crop the photo
- **THEN** its block sets the fit variable, since padding shrinks the content box and the default `cover` responds by cropping to refill it rather than insetting the product

#### Scenario: A corrected brand's card renders its colour chips
- **WHEN** a card for a brand with a padding correction renders its colour chip row
- **THEN** each chip's image carries the same correction scaled to the chip, so a chip reads as a small copy of the tile rather than a differently-framed crop

#### Scenario: Maintainer tunes a brand's inset
- **WHEN** a maintainer changes a brand's padding value
- **THEN** the tile and the chips move together from that one edit, with no second chip-specific value to keep in sync
