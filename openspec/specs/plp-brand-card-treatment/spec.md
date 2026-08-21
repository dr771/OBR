# plp-brand-card-treatment Specification

## Purpose
Lets each brand's product-card photography be corrected independently, identically wherever that brand's card renders — the PLP grid, search results, homepage featured collections, related products, and collage blocks alike. Original Brands sells ~30 brands whose photo policies disagree — cut-out packshots on white, shadowed studio shots, full-bleed lifestyle frames — while the grid has to read as one wall of product. Brand comes from Shopify's native `vendor` field (the same signal `plp-brand-facet` uses), so no Akeneo bracket-key detection and no theme-side brand allowlist is involved. Corrections are declarative CSS-variable overrides, never per-brand template branches.
## Requirements
### Requirement: Every product card carries its brand as a styling hook
Each rendered product card SHALL expose its brand in the markup twice: as a class `ob-brand--<vendor handleized>` on the card wrapper, and as `data-brand="<vendor>"` on the card's custom element for scripting and debugging. The hook SHALL be emitted by the shared card snippet so every card surface — collection grid, search, related products, featured collection, collage, complementary products — carries it identically.

#### Scenario: Product has a vendor
- **WHEN** a product whose `vendor` is "Hi-Tec" renders on any card surface
- **THEN** its card wrapper carries `ob-brand ob-brand--hi-tec` and its card element carries `data-brand="Hi-Tec"`

#### Scenario: Product has no vendor
- **WHEN** a product with an empty `vendor` renders
- **THEN** neither the class nor the data attribute is emitted, and the card keeps stock rendering

#### Scenario: A new brand's first product syncs
- **WHEN** a product for a brand never seen before syncs with `vendor` set
- **THEN** its cards carry that brand's hook automatically, with no theme-side mapping to update

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

### Requirement: Per-brand corrections are desktop-scoped until reviewed narrower
Brand corrections SHALL apply from the 990px breakpoint upward, because their values are judged against the four-up desktop grid where a tile is ~300px wide. Narrower viewports SHALL keep stock framing until a brand's values are re-measured there, since the same absolute padding consumes a far larger share of a two-up phone tile.

#### Scenario: Shopper on a phone
- **WHEN** a shopper views a corrected brand's card below 990px
- **THEN** the card renders with stock framing, not the desktop inset

### Requirement: The grid's shared multiply treatment stays the default
The collection grid's card images SHALL keep their `mix-blend-mode: multiply` against the warm card surface — the mechanism that dissolves white packshot backgrounds into one shared tone — expressed so that a brand block can opt out by variable. Absent any brand override, the multiply SHALL remain in force.

#### Scenario: Brand ships photography on white
- **WHEN** a brand with white-background packshots renders and sets no blend override
- **THEN** its images multiply onto the shared warm surface like every other brand

#### Scenario: Brand ships photography on a coloured or dark backdrop
- **WHEN** such a brand's block sets the blend variable to `normal`
- **THEN** only that brand's card images stop multiplying, and every other brand is unaffected

### Requirement: Brand photo corrections apply to every surface rendering the product card

A brand's photo-correction custom-property overrides (padding, `object-fit`, tile background, blend mode) SHALL apply identically wherever that brand's product card renders — the collection grid, homepage featured collections, related products, and collage blocks alike — since the correction is declared on the brand class (`.ob-brand--<vendor handle>`), not on a grid-container-scoped selector.

#### Scenario: A corrected brand's card renders on the homepage
- **WHEN** a Hi-Tec or Holster product card renders inside a homepage featured collection or collage block
- **THEN** its photo shows the same brand-specific padding and treatment as the identical card in the collection grid

#### Scenario: A corrected brand's card renders in related products
- **WHEN** a Hi-Tec or Holster product card renders inside the PDP's related-products section
- **THEN** its photo shows the same brand-specific correction as the collection grid

