# plp-brand-facet Specification

## Purpose
Exposes brand ("Merk") as a first-class PLP facet, driven by Shopify's native `vendor` field. Original Brands is a multi-brand retailer (~30 brands) where brand is a primary shopping dimension, unlike the single-brand reuse-source project where `vendor` sat unused. No Akeneo bracket-key detection is needed — `vendor` is a native Shopify product field, already correctly populated per product by the sync (confirmed live: FitFlop, Holster, Loewenweiss, Sweaty Betty).

## Requirements

### Requirement: Brand facet lists vendors with counts
The PLP filter panel SHALL include a "Merk" facet, checkbox/multi-select, listing each distinct `vendor` value present in the current collection with its product count, using the same open-by-default accordion chrome as the other facets (`plp-filter-panel-chrome`).

#### Scenario: Shopper opens the brand facet
- **WHEN** a shopper views the "Merk" facet on a collection containing multiple brands
- **THEN** each brand appears as a checkbox option with its product count, open by default

#### Scenario: Shopper filters by brand
- **WHEN** a shopper checks a brand (e.g. "FitFlop")
- **THEN** the grid narrows to that brand's products, and the selection reflects in the URL/active filter pills like every other facet

### Requirement: Brand facet requires no Akeneo-side detection
Brand facet values SHALL come directly from Shopify's native `vendor` field — no bracketed-key detection, no metafield lookup, and no dependency on `akeneo-option-handling`'s option-kind detection.

#### Scenario: A new brand's first product syncs
- **WHEN** a new brand's product is synced with `vendor` set correctly
- **THEN** it appears in the brand facet automatically, with no theme-side mapping or allowlist to update
