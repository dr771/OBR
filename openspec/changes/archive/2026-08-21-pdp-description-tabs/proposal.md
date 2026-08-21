## Why

The PDP's description block rendered as a plain unstyled `rte` div, and the Akeneo-synced `custom.materials_maintenance` metafield had no storefront presentation at all. The approved Bolt reference (`/#product/hygge`) shows both as the first two of a stack of detail accordions — the accordion shell CSS for this was already built and pixel-matched during `match-pdp-to-proto` but left unwired ("styled but no panels are configured"), because at the time only `product.description` existed as real content. `materials_maintenance` is now populated on the Akeneo-synced catalog, so both panels have real content to wire up.

## What Changes

- The `description` block in `sections/main-product.liquid` now renders `product.description` inside a proto-matched accordion ("Productdetails"/"Product details"), open by default, reusing Dawn's `collapsible_tab` markup shape (`summary__title`, `icon-caret`, `accordion__content`) so the existing `.ob-pdp .product__accordion` CSS applies unchanged.
- A second accordion ("Materiaal & onderhoud"/"Materials & maintenance") renders immediately after it, sourced from `product.metafields.custom.materials_maintenance.value`, closed by default, and omitted entirely when the metafield is blank.
- Two new locale keys added: `products.product.details_heading`, `products.product.materials_maintenance_heading` (en.default.json + nl.json).
- Unrelated: all 5 DRAFT `activities` metaobject entries (ski_snowboard, cycling, hiking, training, swimming) were published to ACTIVE via Admin API so they're no longer invisible to the storefront — a data-only fix with no spec-level behavior, not covered by this change.

## Capabilities

### New Capabilities
- `pdp-description-tabs`: the PDP description and materials/maintenance accordions — content source, open/closed default state, and omission rule.

### Modified Capabilities
(none — this is new PDP surface, not a change to an existing capability's requirements)

## Impact

- `sections/main-product.liquid` — `description` block case.
- `locales/en.default.json`, `locales/nl.json` — two new keys.
- No CSS changes: `assets/component-ob-pdp.css`'s existing `.ob-pdp .product__accordion` rules (from `match-pdp-to-proto`) are reused as-is.
- Depends on the Akeneo-synced `custom.materials_maintenance` product metafield (multi_line_text_field, HTML content) already present in the shop.
