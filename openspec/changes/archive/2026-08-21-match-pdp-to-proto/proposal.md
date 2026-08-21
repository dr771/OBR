## Why

The 2026-08-16 design meeting approved the Bolt proto as the reference for live PDP/PDP typography, spacing, shadows, borders and radii, and the PLP has already been carried to it (`match-desktop-plp-spacing`, `plp-card-meta`, `plp-card-swatch-rail`). The PDP is still on Dawn's stock chrome, so a shopper crossing from a finished collection grid into a product page drops out of the design system mid-journey.

The proto also carries four pieces of page furniture the PDP has never had at all — a breadcrumb, a trust/USP strip, a size-guide entry point, and a bestseller badge — and it relocates the gallery's thumbnail chevrons out of their Dawn flanking position.

## What Changes

Reference: `https://original-brands.bolt.host/#product/hygge`, measured at a 1440px viewport. Every value below is a `getComputedStyle` reading from that page, not an estimate.

**Section shell and gallery**
- Cap the PDP section at 1280px with a 24px inset and a `minmax(0,1.12fr) minmax(400px,0.88fr)` two-column split at a 56px gutter. Deliberately narrower than the PLP — verified directly in the proto, whose PLP uses `max-w-[1600px]` while its PDP uses `max-w-7xl`. The `page_width` theme setting is **not** touched.
- Give the main image a bordered white frame: `1.06/1` aspect, 32px radius, 1px `#E2E8F0`, image `object-fit: contain` at 40px padding (24px below `sm`).
- Present thumbnails as a 4-up grid at a 12px gap, 12px radius, 8px image padding; idle border `#E2E8F0`, active border `#0F172A` plus a 1px ring.
- Move both thumbnail-rail chevrons from Dawn's flanking positions into the bottom-right of a new counter row, with `Afbeelding X van Y` at its left. The chevrons keep the behaviour they have today (they scroll the thumbnail rail); only their position and styling change. Restyled to 34px circles, 1px `#CBD5E1`, 16px glyph.

**Product information column**
- Match the measured type scale: brand eyebrow 11px/16.5 w600 at 2.75px tracking, `h1` 48px/48 w600 in Fraunces at -0.48px tracking, price 20px/28 w600.
- Separate the colour and size blocks with a 1px `#E2E8F0` rule at 28px margin / 24px padding, each with a `Label: value` row.
- Restyle the add-to-cart row: 56px tall, pill radius, `#0F172A`, 14px/20 w600. The wishlist heart keeps its current position beside the button.
- Restyle the description/accordion stack: 1px `#E2E8F0` bottom rules, `16px 0` triggers at 14px/20 w600, 14px/22.75 bodies, first panel open.
- Load a Fraunces 600 face. The heading font is already Fraunces but only its 400 face is loaded, so a declared 600 silently renders at 400 — the same trap already fixed for the body 500/600 faces.

**New page furniture**
- Add a breadcrumb above the section: 12px/16, 8px gaps, muted links, current page in full ink, chevron separators.
- Add a two-item USP strip below add-to-cart, bounded by 1px `#E2E8F0` rules, 20px padding, 20px icons in `#1E9FE6`, editor-configurable. Ships with `Gratis levering vanaf € 70 in BE & NL` and `Voor 12u besteld, volgende werkdag geleverd` — both verbatim from originalbrands.nl's own USP bar. The proto's second line (`30 dagen gratis retour`) is **rejected as factually false**: the published policy withholds €5.95 in return costs.
- Add a `Maatadvies` trigger to the size label row (ruler icon, 12px/16 w500, underlined at 4px offset), mirroring SweatyBetty's `sb-size-chart` trigger/dialog split. The dialog is stubbed until the real measurement tables arrive.
- Add a `Bestseller` badge in two placements — on the gallery frame (pill, `#38B6FF`, white) and beside the price (pill, `#EFF9FF` on `#0D80C4`) — driven by a metafield so it can be switched on per product.

**Deliberately not taken from the proto** (owner's call): the `Meer kleuren` label, the quantity stepper, the review badge on the main image, moving the wishlist heart to the top-right, and the three sections below the product data.

## Capabilities

### New Capabilities
- `pdp-layout-chrome`: the PDP section shell — content cap, two-column split, information-column type scale, block dividers, add-to-cart row, and accordion stack.
- `pdp-gallery-chrome`: the gallery's visual frame, thumbnail grid, and the counter/chevron row that replaces Dawn's flanking thumbnail buttons.
- `pdp-breadcrumb`: the breadcrumb trail rendered above the product section.
- `pdp-usp-strip`: the editor-configurable trust/USP row in the information column.
- `pdp-size-guide-trigger`: the `Maatadvies` entry point beside the size label.
- `pdp-product-badges`: the bestseller badge and its gallery and price placements.

### Modified Capabilities
- `pdp-option-rails`: colour chips change from 5.4rem to 4.8rem square and take the proto's chip treatment (8px radius, 4px padding, `#CBD5E1` idle border, ink border plus ring when selected). The rail itself, its overflow cues, and its rollback switch are unchanged.
- `pdp-size-picker-grid`: size boxes change from 5.6rem/4.8rem interaction heights to a uniform 4.4rem, square corners, and the proto's border and selected-state colours. Column counts and source-derived values are unchanged.

## Impact

- `sections/main-product.liquid` — breadcrumb, USP strip and badge blocks; schema settings for each.
- `snippets/product-media-gallery.liquid` — thumbnail grid, counter row, chevron relocation.
- `snippets/product-variant-picker.liquid` — size-guide trigger placement, label rows.
- `snippets/ob-size-chart.liquid`, `snippets/ob-breadcrumb.liquid`, `snippets/ob-usp-strip.liquid`, `snippets/ob-product-badge.liquid` — new.
- `assets/component-ob-pdp.css` — new; the measured values live here rather than in existing PLP stylesheets.
- `layout/theme.liquid` — guarded Fraunces 600 face.
- `templates/product.json` — gallery layout and new blocks. **Merchant-editable state: the live theme is on `thumbnail_slider` while the repo copy says `stacked`, so this file must be pulled and diffed before any push.**
- A bestseller metafield definition and the USP block defaults are shop-side configuration and belong in `MIGRATION-TO-LIVE.md`.
