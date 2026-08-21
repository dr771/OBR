## ADDED Requirements

### Requirement: Brand photo corrections apply to every surface rendering the product card

A brand's photo-correction custom-property overrides (padding, `object-fit`, tile background, blend mode) SHALL apply identically wherever that brand's product card renders — the collection grid, homepage featured collections, related products, and collage blocks alike — since the correction is declared on the brand class (`.ob-brand--<vendor handle>`), not on a grid-container-scoped selector.

#### Scenario: A corrected brand's card renders on the homepage
- **WHEN** a Hi-Tec or Holster product card renders inside a homepage featured collection or collage block
- **THEN** its photo shows the same brand-specific padding and treatment as the identical card in the collection grid

#### Scenario: A corrected brand's card renders in related products
- **WHEN** a Hi-Tec or Holster product card renders inside the PDP's related-products section
- **THEN** its photo shows the same brand-specific correction as the collection grid
