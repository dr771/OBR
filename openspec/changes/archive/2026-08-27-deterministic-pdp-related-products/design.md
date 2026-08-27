## Context

The existing Dawn section lazy-loads Shopify's automatic recommendation response. Live API evidence labels the results `collection_fallback`, causing generic products to repeat across PDPs. `custom.breadcrumb_rank` already provides public-read, merchant-maintained collection priority.

## Goals / Non-Goals

**Goals:**

- Make PDP recommendations deterministic and relevant to the product's best collection.
- Keep related products within the viewed product's exact gender value.
- Let Shopify collection ordering remain the merchant's ranking control.
- Retain the current section layout and card rendering.

**Non-Goals:**

- Changing the breadcrumb's route/session-aware label selection.
- Editing Search & Discovery manual recommendations or Shopify collection ordering.
- Combining products from multiple collections.

## Decisions

### Resolve collection sources server-side from `product.collections`

The rail scans the product's collections in ascending `breadcrumb_rank`, using each broader rank only when a more specific one leaves open positions. This mirrors the documented collection-priority hierarchy without inheriting the breadcrumb's shopper-navigation context: a PDP rail must remain stable for direct, search, and collection entry.

### Render the collection's products directly

Liquid receives a collection's ordered products, so the section can skip the current product and stop at the editor-configured limit without JavaScript or an endpoint request. Retaining the collection's order lets merchandising choose manual, best-selling, newest, or other native ordering in Shopify Admin.

### Require an exact `genderid` match

`custom.genderid` is a confirmed single-line product metafield, so the rail compares its stored values directly. `Unisex` remains its own value: the request is for the same value, rather than a gender-collection membership match that would let Women/Unisex or Men/Unisex products mix.

### Prefer one collection over a blended algorithm

Using every overlapping collection indiscriminately would immediately reintroduce broad-gender and occasion noise. Progressive rank fallback keeps product type first while still completing a sparse rail, and the exact gender guard constrains every source.

## Risks / Trade-offs

- [Risk] A selected collection can contain only the viewed product. → The section remains absent rather than showing an irrelevant fallback.
- [Risk] The primary collection has too few matching products. → Continue through broader ranked collections while preserving source priority and exact gender equality.
- [Risk] Merchant collection ordering may not express a desired product priority. → The collection's existing native sort setting is the deliberate editorial control; no second ranking field is introduced.
- [Risk] A new collection lacks a rank. → It remains a last-resort source, matching the established safe default.
- [Risk] A narrow collection has fewer than the configured number of same-gender products. → The rail renders the available same-gender products only; it never supplements them with another gender.

## Migration Plan

Push only the related-products section to active theme `148245381229`, then verify direct PDP loads for products in product-type, occasion-only, and unranked collections. Rollback is a single-file theme push restoring the native section.
