## Why

Shopify's automatic PDP recommendations currently fall back to broad collection membership, producing the same unrelated products across different product pages. The PDP needs deterministic, catalogue-led recommendations that stay useful while the shop has little purchase history.

## What Changes

- Replace the PDP's native related-products recommendation request with products from the viewed product's highest-ranked collection.
- Preserve the selected collection's own Shopify order as the merchant's product ranking.
- Limit recommendations to products with the exact same `custom.genderid` value as the viewed product.
- When the primary collection cannot fill the rail, continue through broader ranked collections without duplicating products.
- Exclude the viewed product and suppress the rail when no other product is available.

## Capabilities

### New Capabilities

- `pdp-related-products`: Deterministic, collection-led related product recommendations on PDPs.

### Modified Capabilities

None.

## Impact

Updates `sections/related-products.liquid`, the collection-ranking documentation, and the active theme's rendered PDP recommendation rail. It reuses the existing public-read `custom.breadcrumb_rank` collection metafield; no app setting or new shop data is required.
