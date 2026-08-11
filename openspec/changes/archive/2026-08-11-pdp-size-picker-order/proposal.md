## Why

Akeneo supplies PDP size values in source order, which currently produces visibly scrambled EU shoe sizes and exposes raw bracketed option keys as headings. The live catalog already contains footwear and apparel size systems, so the picker needs one predictable storefront contract for both.

## What Changes

- Render recognized EU shoe-size values in numeric ascending order on product variant pickers.
- Render recognized tops and bottoms letter sizes in semantic size order rather than source or alphabetical order.
- Display the Dutch storefront label `Maat` for recognized size options while retaining the raw Akeneo key for form submission and option identity.
- Preserve Dawn's native option controls, availability, selected state, and variant-change behavior; unknown option keys and unrecognized values degrade to source order.

## Capabilities

### New Capabilities

- `pdp-size-picker-order`: PDP ordering and display behavior for Akeneo footwear and apparel size options.

### Modified Capabilities

- `akeneo-option-handling`: Centralized option metadata also supplies storefront labels and recognized size families without branching on visible labels.

## Impact

Affected code is limited to the centralized `ob-option-meta` helper and Dawn's product variant-picker snippets. There are no new apps, scripts, metafields, metaobjects, admin settings, or live-store migration dependencies.
