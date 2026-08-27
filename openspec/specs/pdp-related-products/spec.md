# pdp-related-products Specification

## Purpose
Provides stable, relevant PDP related products from the most specific approved collection, without relying on sparse sales history or Shopify's opaque fallback.
## Requirements
### Requirement: Related products fill from the product's ranked collection hierarchy
The PDP related-products rail SHALL begin with the product collection having the lowest numeric `custom.breadcrumb_rank` value. If eligible products from that collection do not fill the configured item limit, the rail SHALL continue through the product's collections in ascending rank order. Collections without a rank SHALL sort after every ranked collection. Within each collection, the rail SHALL preserve its native Shopify product order and SHALL not render a product more than once.

#### Scenario: Product belongs to several ranked collections
- **WHEN** a product belongs to both a product-type collection ranked 10 and an occasion collection ranked 20
- **THEN** its related-products rail draws products from the rank-10 collection before considering the rank-20 collection

#### Scenario: Primary collection cannot fill the rail
- **WHEN** the rank-10 collection provides two eligible products and the rank-20 collection provides additional eligible products
- **THEN** the rail shows the two rank-10 products first and fills its remaining positions from the rank-20 collection

#### Scenario: Product has only unranked collections
- **WHEN** a product belongs only to collections without `custom.breadcrumb_rank`
- **THEN** the rail uses the available unranked collections as deterministic fallback sources

### Requirement: Related products match the viewed product's gender
The rail SHALL include only products whose `custom.genderid` value exactly equals the viewed product's `custom.genderid` value. A product without a gender value SHALL have no related-products rail rather than receiving recommendations from another gender.

#### Scenario: Ranked sources contain multiple gender values
- **WHEN** the PDP's ranked source collections contain Women, Men, and Unisex products
- **THEN** a Women PDP displays only Women products from those collections

#### Scenario: Viewed product has no gender value
- **WHEN** the viewed product has no `custom.genderid` value
- **THEN** the related-products rail does not render

### Requirement: Related products exclude the viewed product
The rail SHALL render up to its configured item limit from its ranked collection sources, excluding the product being viewed, matching its gender, and preserving each source collection's native order.

#### Scenario: Viewed product is first in its collection
- **WHEN** the viewed product is first in the selected collection's order
- **THEN** it is omitted and the following collection products fill the available rail positions

#### Scenario: No ranked source has an eligible product
- **WHEN** none of the product's collections contains another available product with the same gender value
- **THEN** the related-products rail does not render

### Requirement: Related products do not use Shopify's automatic recommendation response
The PDP related-products rail SHALL not display products returned by Shopify's automatic product-recommendations endpoint.

#### Scenario: Shopify automatic suggestions differ from collection products
- **WHEN** Shopify's automatic endpoint proposes products outside the selected collection
- **THEN** those products do not appear in the PDP related-products rail

