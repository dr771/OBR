## Why

The approved storefront format is `€25,00`, not the recently introduced `€25,-`. The redundant trailing `EUR` still needs to disappear, but Shopify's normal two-decimal money output must otherwise remain unchanged.

## What Changes

- Restore Shopify's two-decimal product-price presentation for whole-euro and non-zero-cent amounts.
- Continue omitting the redundant ISO currency code from product prices.
- Keep localization controls unchanged so their `EUR` identifier remains available where it describes the selected market rather than repeating a price currency.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `storefront-price-format`: Replace the Dutch dash convention requirement with a requirement to preserve Shopify's standard two-decimal euro output while continuing to omit the trailing currency code.

## Impact

- `snippets/price.liquid`: remove whole-euro modulo/replacement logic and retain the symbol-only `money` filter path.
- `openspec/specs/storefront-price-format/spec.md`: update the canonical price-format contract when the change is archived.
- No shop settings, product data, app configuration, or JavaScript behavior changes.
