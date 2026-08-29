## Context

`snippets/price.liquid` currently bypasses Dawn's `currency_code_enabled` branch so product prices use Shopify's symbol-only `money` filter, then applies modulo-based replacements that turn whole-euro `,00` fractions into `,-`. The owner has confirmed that only the redundant trailing `EUR` should be removed; Shopify's normal two-decimal amount must remain.

## Goals / Non-Goals

**Goals:**

- Render whole-euro product prices as `€25,00` without a trailing `EUR`.
- Preserve non-zero-cent prices such as `€7,99`.
- Keep every surface using the shared price snippet consistent and server-rendered.

**Non-Goals:**

- Changing localization controls, shop currency configuration, cart/order templates that do not use the shared price snippet, or Shopify checkout.
- Adding JavaScript price rewriting.

## Decisions

- Continue using Shopify's `money` filter rather than `money_with_currency`; this removes the redundant ISO code while retaining the active currency symbol and Shopify's configured decimal formatting.
- Remove all modulo/replacement calculations. Native `money` output already distinguishes `€25,00` from `€7,99`, so extra conditional formatting is unnecessary and now contrary to the approved display.
- Keep the change in `snippets/price.liquid`, ensuring collection cards, PDPs, featured products, predictive search, and section responses share the same server-rendered result.

## Risks / Trade-offs

- [Theme setting no longer adds ISO codes to shared product prices] → This is intentional owner-approved behavior; localization controls still identify the selected currency.
- [Other templates can still call `money_with_currency` directly] → This change is scoped to the existing `storefront-price-format` capability and shared product-price renderer; broader cart/order formatting remains separate work if requested.

## Migration Plan

1. Remove modulo/replacement assignments and update the explanatory Liquid comment.
2. Validate the theme and delta spec.
3. Push only `snippets/price.liquid` to active theme `148245381229`.
4. Verify live whole-euro and non-zero-cent product prices plus header/footer presence.
5. Archive the change to update the canonical spec, then commit and push the implementation and archived artifacts.

Rollback is the previous `snippets/price.liquid` from Git.

## Open Questions

None.
