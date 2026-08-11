## Why

Color variants currently share one nine-or-more-image PDP gallery, so selecting Grey still shows Rust, Blue, and Beige product photography. Dawn's enabled variant-media hiding also produces a broken `-Infinity` mobile counter on the live catalog because repeated variant image references outnumber the product's actual media.

## What Changes

- Render only media belonging to the selected color in the PDP gallery, thumbnail rail, and expanded media modal.
- Keep media without a parseable Akeneo color code visible as shared/generic product media.
- Swap the complete color gallery through Dawn's existing variant section refresh; add no custom gallery JavaScript.
- Compute gallery counts from the filtered media set so counters and single/slider states remain valid.
- Support OB's live multi-segment mismatch by normalizing a Loewenweiss SKU code such as `192-953` to its media filename code `192_953`.
- Preserve the current featured-image loading priority: the selected color's featured media remains eager/high-priority and later media remain lazy.

## Capabilities

### New Capabilities

- `pdp-color-media-gallery`: Selected-color filtering and switching across all PDP media surfaces.

### Modified Capabilities

- `akeneo-option-handling`: Centralize extraction of a selected variant's color code from the Akeneo SKU so gallery surfaces do not parse SKU structure inline.

## Impact

Affected theme code is the product media gallery/modal plus one centralized `ob-*` SKU helper. The existing `ob-media-color-code` filename parser and Dawn `product-info.js` refresh pipeline are reused unchanged. No app, metafield, metaobject, custom JavaScript, or live-shop-only configuration is introduced.
