## Why

A product can be reduced in only one colour (FitFlop Lulu: 17 colours, only Metallic Cosmic Blue has a compare-at price above its price). The card starts on the first *available* variant, so in the Solden collection, and everywhere else, such a product shows a full-price colour, no sale badge, and a link to a full-price variant. The shopper cannot see which colour the "vanaf" price belongs to.

## What Changes

- On every surface that renders the product card, a product with at least one available reduced variant starts on the first such variant: its photo, its colour chip active, and its variant in the product link.
- An active variant-level filter keeps priority: when Shopify has already narrowed the card to a matching variant, that variant stays.
- The sale badge follows the colour the card shows instead of product-level price fields. It renders for a reduced colour and is absent for a full-price one, and it follows in-card colour selection.
- A colour chip links to that colour's reduced variant when one exists.
- All colour chips stay visible. The card price stays product-level.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `plp-card-swatches`: the card's initial variant prefers an available reduced variant over the first available one; chips of reduced colours link to the reduced variant.
- `plp-sale-badges`: the badge and its percentage come from the shown colour's variant, not product-level fields, and follow chip selection.

## Impact

- `snippets/card-product.liquid`: resolves the card variant once; image, product links, badges and their `aria-labelledby` read from it.
- `snippets/ob-card-swatches.liquid`: active chip from the card variant, per-colour reduced variant and sale label.
- `assets/ob-card-swatches.js`: badge follows the selected chip.
- `assets/component-ob-swatches.css`: a hidden sale badge stays hidden.
- No shop-side dependency. Relies on `compareAtPrice` being `null`/`0` or a real higher price; a compare-at equal to the price is correctly not treated as reduced.
