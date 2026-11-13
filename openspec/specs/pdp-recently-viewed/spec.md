# pdp-recently-viewed Specification

## Purpose
TBD - created by archiving change pdp-mobile-purchase-and-history. Update Purpose after archive.
## Requirements
### Requirement: PDP shows prior product visits after related products
Every PDP SHALL record the current product in bounded browser-local history and show up to four previously visited, distinct, available products in most-recent-first order after the related-products section. The current product SHALL be excluded. A product with no available variant SHALL NOT be shown; older history entries SHALL fill its slot, and the product SHALL stay in history so it reappears once available again. The section SHALL use the shared product card renderer, so its cards inherit the storefront's existing product imagery, price, swatches, and link behavior. An empty or unavailable history SHALL leave no visible heading or gap.

#### Scenario: First product visit
- **WHEN** a browser with no product history opens a PDP
- **THEN** no recently viewed heading or cards appear, and the product is recorded for the next visit

#### Scenario: Shopper visits several products
- **WHEN** a shopper opens a second or later product
- **THEN** prior products appear after related products on desktop and mobile, newest first, without the current product or duplicate cards

#### Scenario: A stored product is no longer available
- **WHEN** a product in local history cannot be rendered
- **THEN** that product is skipped without breaking the rest of the section

#### Scenario: Recently visited products are sold out
- **WHEN** the four most recent history entries include sold-out products and older entries are available
- **THEN** the sold-out products are not shown and the older available products fill the four slots

#### Scenario: Every visited product is sold out
- **WHEN** no product in history other than the current one is available
- **THEN** no recently viewed heading or cards appear

