## ADDED Requirements

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
