## Why

"Recent bekeken" renders every previously visited product, including sold-out ones. A shopper who browsed a few sold-out items sees a row of `Uitverkocht` cards they cannot buy (reported 2026-11-13 on the Mechanix Specialty Vent Covert PDP, all four cards sold out). Related products already skip sold-out products.

## What Changes

- Recently viewed skips products with no available variant and fills the four slots from older history entries instead.
- The history itself stays unchanged, so a product that comes back in stock reappears.

## Capabilities

### New Capabilities

### Modified Capabilities
- `pdp-recently-viewed`: shown products must be available; sold-out history entries are skipped and backfilled.

## Impact

- `sections/ob-recently-viewed.liquid` (card template carries availability)
- `assets/ob-recently-viewed.js` (skip + backfill)
