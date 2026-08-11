## Why

PLP color chips currently navigate directly to the PDP and the card's hover pair is governed by Dawn's whole-card hover state. This prevents shoppers from selecting a color in place and makes the post-selection first/second-image interaction diverge from the proven SweatyBetty behavior.

## What Changes

- Render PLP color chips as non-navigating buttons that select the card color in place.
- Retarget the card's normal PDP link to the selected color's variant, replacing any existing variant parameter while preserving Shopify tracking parameters, so the shopper can still enter the correctly selected PDP by clicking the card.
- Keep the selected color's first image visible while interacting with chips and reveal that color's second image only while the pointer is over the card image area.
- Keep hover-pair media lazy and color-aware after every selection, including cards inserted by Dawn facet refreshes.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `plp-card-swatches`: Replace chip navigation with in-grid selection and align post-selection hover-pair behavior with the SweatyBetty reference implementation.

## Impact

- `snippets/ob-card-swatches.liquid`
- `assets/ob-card-swatches.js`
- `assets/component-ob-swatches.css`
- Canonical `plp-card-swatches` requirements and shared project documentation
- No app, admin, metafield, or migration dependency
