## ADDED Requirements

### Requirement: Card meta typography applies to every surface rendering the product card

The Bolt-matched brand-label, product-name, and price typography defined by this capability SHALL apply identically wherever `card-product.liquid` renders, not only within the collection/search grid, so the card reads as the same repeated element across the whole site.

#### Scenario: Card renders inside a homepage featured collection
- **WHEN** a product card renders inside a "Featured collection" section on the homepage
- **THEN** its brand label, product name, and price render with the same typography as a card in the collection grid

#### Scenario: Card renders inside related products or a collage block
- **WHEN** a product card renders inside the PDP's related-products section or a homepage collage block
- **THEN** its brand label, product name, and price render with the same typography as a card in the collection grid
