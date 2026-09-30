## Why

The PDP already renders Akeneo-synced product description and materials as accordions. The delivery and returns panel is still missing. It contains shop-wide policy, so it should be one merchant-editable product-template block rather than another Akeneo product field. The DEV shop's `Verzending & retour` page currently contains placeholder copy.

## What Changes

- Add one Dawn collapsible row labelled `Bezorging & retour` after the description/material accordions on every PDP, desktop and mobile.
- Summarize the published delivery and return terms and link to their full published pages. Keep the content in the shared product template for later merchant editing.
- Keep the existing Akeneo-derived product content unchanged.

## Capabilities

### Modified Capabilities

- `pdp-description-tabs`: adds a shop-wide delivery and returns panel after the product-specific detail panels.
- `pdp-layout-chrome`: replaces an obsolete plain-description fallback with the current accordion stack behavior.

## Impact

- `templates/product.json`: shared accordion block and policy content.
- `openspec/specs/pdp-layout-chrome/spec.md`: update the old requirement that assumed all reference panels were unconfigured.
