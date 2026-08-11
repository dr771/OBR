# Proposal: port-akeneo-facets-swatches

## Why

Original Brands' first real Akeneo-synced products landed 2026-08-11 (7 products across Sweaty Betty, FitFlop, Holster, Loewenweiss — apparel + footwear). SweatyBetty already has these PLP/PDP mechanics built and shipped; the reuse ledger in `MIXED-SHOPS-PLAYBOOK.md` marks them "Reuse as-is" or "Reuse, adapt" and two theme-side decisions (D1: card image source, D2: no curated swatch-color map) are already made with Nick/the owner. Nothing here depends on the still-unapproved homepage mockup or the still-open red/blue CTA-color question — this is data-plumbing and PLP/PDP mechanics, not homepage visual design. Verified live via Admin GraphQL against real synced products before writing this proposal (not assumed from the SB port): `[color]`/`[shoe_size_eu]` bracket-key options, the `custom.filtercolors` metaobject (`code`/`label`/`hexcode`/`image_asset`) on variants, `custom.genderid` on products, and `vendor` already correctly populated per brand.

## What Changes

- **`akeneo-option-handling`**: bracket-key option detection (`[color]`, `[shoe_size_eu]`, etc.) ported as-is from SB — Akeneo-universal, not brand-specific.
- **`plp-card-swatches`** (adapt, per D2): swatch chip visual is always the variant's own product photo, cropped square — no curated color-crop map tier (OB has no Amplience-style asset and hand-maintaining one doesn't scale to ~30 brands).
- **`plp-card-swatches`** (D1 fix): card image derives from the first *available* (in-stock) variant's color, not `featured_media`, so the PLP grid tile and the PDP hero color never disagree once a color sells out.
- **`pdp-color-swatches`** (adapt, per D2): same img-swatch-only chip visual as the PLP card, no curated map tier.
- **`plp-color-filter`** (new for OB): facet chip is a flat color chip rendered from the `filtercolors` metaobject's `hexcode` (fallback `image_asset`) — deliberately *not* an img-swatch, since a filter value represents a color family spanning many products, not one purchasable variant.
- **`plp-brand-facet`** (new capability, not from SB): checkbox/multi-select facet driven by Shopify's native `vendor` field, already correctly populated.
- **`plp-gender-facet`** (new capability, not from SB): facet driven by the confirmed `custom.genderid` product metafield, same bracket-key-adjacent detection pattern as color/size.

## Capabilities

### New Capabilities
- `plp-brand-facet` — vendor-driven brand filter, no SB precedent (SB is single-brand).
- `plp-gender-facet` — genderid-driven gender filter, no SB precedent.

### Modified Capabilities (seeded fresh for OB — first spec written for each)
- `akeneo-option-handling` — bracket-key option detection.
- `plp-card-swatches` — swatch chip visual source (D2) + card image source (D1).
- `pdp-color-swatches` — swatch chip visual source (D2).
- `plp-color-filter` — facet chip visual source (hexcode, not img-swatch).

## Impact

- **Code**: new/adapted Liquid snippets for option-key parsing, swatch chip rendering (PLP card + PDP), card image color resolution, color-family facet chips, brand facet, gender facet. Reference implementation to port from: `C:\Users\rezni\SHOPIFY\SweatyBetty` `openspec/specs/akeneo-option-handling`, `plp-color-filter`, `plp-card-swatches`, `pdp-color-swatches` — adapt per the D1/D2 decisions below, don't copy SB's swatch-tier logic verbatim.
- **Docs**: `MIXED-SHOPS-PLAYBOOK.md` open-question #1 (image filename convention) can be marked confirmed — the `{sha1}_{product_code}_{color_code}__{shot}` pattern holds across all 4 brands currently synced, including Loewenweiss's two-part color code. Ledger rows for the capabilities above move from "reuse ledger" to "seeded."
- **Explicitly out of scope**: homepage sections, any styling gated on the pending red-vs-blue CTA call, reviews, footwear width/half-size handling (no data yet), `pdp-feature-icons` (separate proposal — confirmed live that `custom.activities` is a ready-to-use metaobject reference, code/label/image_asset, same shape as `filtercolors`, but scoping that is a separate change).
- **Data risk**: only 7 products are synced so far; option-key coverage (`[color]`/`[shoe_size_eu]`) and metafield shapes are confirmed only for the brands currently synced (Sweaty Betty, FitFlop, Holster, Loewenweiss). Other ~26 brands are unverified — theme code should fail gracefully (nil-safe chains, per SB's existing pattern) rather than assume universal coverage.
