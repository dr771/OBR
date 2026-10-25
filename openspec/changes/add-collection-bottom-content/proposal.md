## Why

Preserve useful legacy collection content through the Shopify migration while replacing repetitive promotional copy with practical buying guidance and working internal links. Keep the existing short collection introductions.

## What Changes

- Add a merchant-editable collection rich-text metafield, `custom.bottom_description`.
- Render it once below the collection grid, independently of filtering and load more, with no empty content wrapper when unset.
- Archive legacy text with source URLs and capture dates in `content/collections/legacy/`; maintain revised Dutch copy and source mappings in the same shared content directory.
- Use root-relative collection links, with no development-domain URLs, and record the shop-data migration dependency.

## Capabilities

### New Capabilities
- `plp-bottom-description`: collection editorial field, rendering, source provenance, and internal-link contract.

### Modified Capabilities
None. The hero continues to use `collection.description`.

## Impact

New collection metafield definition and values; one section and stylesheet; collection JSON template; content archive and migration documentation.
