## ADDED Requirements

### Requirement: Bottom copy is separate merchant-owned collection content
The storefront SHALL read collection bottom copy from `custom.bottom_description`, a Collection `rich_text_field` definition with public storefront read access. The native collection description SHALL remain the short hero introduction and SHALL NOT be overwritten by this feature.

#### Scenario: Collection has authored bottom content
- **WHEN** a collection with a nonempty bottom description renders
- **THEN** its rich text SHALL render once after the product grid, with semantic headings, paragraphs, and links in the server response
- **AND** the hero SHALL retain its existing short description

#### Scenario: Collection has no bottom content
- **WHEN** the bottom-description field is empty or absent
- **THEN** no bottom-description content wrapper SHALL render

### Requirement: Product-grid updates preserve one editorial section
Bottom content SHALL sit outside the product grid replaced by Dawn's filtering and sorting responses and SHALL NOT be appended with load-more product cards.

#### Scenario: Shopper changes results or loads more
- **WHEN** filtering, sorting, or loading another product page completes
- **THEN** the page SHALL still contain exactly one copy of its collection bottom description

### Requirement: Editorial content has portable links and shared provenance
Authored internal links SHALL use root-relative published collection/page paths without a temporary shop domain. Revised collection copy SHALL have a shared repository record mapping it to dated legacy sources or explicitly identifying newly authored content where no matching legacy page exists. Legacy reference files SHALL retain the captured wording separately from revised storefront copy.

#### Scenario: Theme and content migrate to the live shop
- **WHEN** the metafield definition and values are recreated by collection handle on the live shop
- **THEN** internal links SHALL resolve under the live storefront domain without rewriting a development hostname

#### Scenario: Team reviews a rewrite
- **WHEN** a team member opens the content inventory
- **THEN** they SHALL be able to locate the original captured copy and distinguish it from the revised text
