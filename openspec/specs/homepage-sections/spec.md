# homepage-sections Specification

## Purpose

Defines the `/` homepage: seven sections replacing Dawn's stock `image-banner` +
`featured-collection` default, matched to the approved homepage reference at
https://original-brands.bolt.host/. Order: hero, brand marquee, "Shop per
behoefte" occasion grid, outlet promo banner, bestsellers (Dawn's
`featured-collection`, restyled), featured-brands grid, newsletter signup
(Dawn's `newsletter`, restyled).

## Requirements

### Requirement: Hero links copy, CTAs, and floating info cards to editable settings
The hero SHALL render an eyebrow badge, a heading split into prefix/accent/suffix
text settings (so the accent phrase can carry its own italic/colour styling
without inline HTML), a subheading, two CTA buttons, a star rating line, and
two floating info cards over the hero photo — all merchant-editable, with the
photo defaulting to a real curated theme asset rather than rendering blank
before a merchant uploads one.

#### Scenario: Accent phrase renders distinctly
- **WHEN** the hero renders with default settings
- **THEN** the heading's accent span ("elk moment") SHALL render italic in the
  AA-safe accent ink (`#0d80c4`), not the raw `--ob-accent` value, which fails
  text contrast at this size per CI-STYLE-TOKENS.md.

#### Scenario: Hero image has a real default
- **WHEN** a merchant has not yet picked a hero image in the theme editor
- **THEN** the hero SHALL display a curated theme asset (`ob-brand-fitflop.jpg`)
  rather than a broken or empty image.

#### Scenario: Floating cards hide on narrow viewports
- **WHEN** the viewport is narrower than 990px
- **THEN** the two floating info cards SHALL NOT render, avoiding overlap with
  the stacked mobile layout.

### Requirement: Brand marquee scrolls continuously and reuses existing brand typography
The homepage SHALL render a continuously auto-scrolling row of brand
wordmarks directly under the hero, each linking to its collection, reusing
`snippets/ob-brand-logotype.liquid` (built for the Merken hero chips) so both
surfaces show identical brand typography.

#### Scenario: Seamless loop
- **WHEN** the marquee is displayed
- **THEN** its block list SHALL render twice back-to-back with the track
  animating -50%, so the loop has no visible seam, and the animation SHALL
  pause on hover/focus and SHALL be replaced by a static wrapped row under
  `prefers-reduced-motion: reduce`.

### Requirement: Occasion grid links to the real metafield-based collections
The "Shop per behoefte" grid SHALL render one card per occasion block, each
linking to its real collection (`sport-training`, `outdoor-werk`,
`dagelijks-comfort`) with a photo resolved via
`snippets/ob-occasion-image.liquid`, a numbered eyebrow, the collection's own
title as the card heading, and a scrim ensuring the overlaid text stays
legible against any photo.

#### Scenario: Curated occasion photography
- **WHEN** an occasion card is for one of the three known collection handles
- **THEN** its image SHALL be the theme's curated asset for that occasion
  (not a generic placeholder), falling back to the collection's own
  `featured_image` for any other handle.

### Requirement: Outlet promo banner links to the real Solden collection
The dark promo banner SHALL link its CTA to the shop's real "Solden"
collection, using the same informal "outlet" marketing language the footer's
existing "Outlet" link already established for that collection, rather than
its literal Dutch title.

#### Scenario: Default CTA target
- **WHEN** the promo section renders with default settings
- **THEN** its button SHALL link to `/collections/solden`.

### Requirement: Bestsellers reuses the finished PLP card treatment with no bespoke card work
The bestsellers section SHALL be Dawn's `featured-collection` section
restyled (eyebrow added, "view all" link relocated beside the heading), not a
forked or bespoke section, so its product cards continue to inherit the full
PLP treatment (badges, swatches, hover zoom) automatically.

#### Scenario: Eyebrow and inline view-all
- **WHEN** the bestsellers section has more products in its collection than
  it displays
- **THEN** an eyebrow SHALL render above the heading, and a "Bekijk alles"
  link with a chevron SHALL render beside the heading (not as a centered
  block below the grid, Dawn's stock position).

#### Scenario: No sales history yet
- **WHEN** the "all" collection has no real order history
- **THEN** the section MAY display products in a non-bestselling order; this
  is a known, temporary data gap (see PLP load-more and predictive search's
  own documented equivalents), not a defect in this section.

### Requirement: Featured-brands grid shows the real 11-brand roster, not bolt's demo set
The "Uitgelichte merken" grid SHALL list the shop's real 11 brand
collections with plain brand names (never the hero marquee's stylized
logotypes) and a short one-line description reusing the identical copy
already written for each brand's block on the Merken page, laid out with an
uneven flex-row technique (6 + 5) rather than a rigid column count.

#### Scenario: Copy matches the Merken page
- **WHEN** a shopper reads a brand's one-line description on the homepage
- **THEN** it SHALL read identically to that brand's `eyebrow` value on
  `/pages/merken`, so the two surfaces never describe the same brand two
  different ways.

#### Scenario: Uneven last row stretches to fill
- **WHEN** 11 brand blocks are configured
- **THEN** the grid SHALL render 6 cards in the first row and 5 in the
  second at desktop widths, with the second row's cards stretched to fill
  the full row width — the same technique as `merken-brands-directory`'s
  chip grid.

### Requirement: Newsletter signup uses Dawn's native customer-tagging form
The newsletter section SHALL be Dawn's stock `newsletter` section restyled
(dark card, pill input/button) with two new block types (`eyebrow`,
`fine_print`) added to match the reference's copy, not a custom form
submission mechanism.

#### Scenario: Real signup mechanism
- **WHEN** a visitor submits the newsletter form
- **THEN** it SHALL submit through Dawn's existing `{% form 'customer' %}`
  mechanism with `contact[tags]=newsletter`, requiring no new app or
  shop-side dependency.

### Requirement: Homepage display headings use Fraunces, matching PDP and PLP
Every `<h1>`/`<h2>` heading introduced by these seven sections SHALL render
in `var(--font-heading-family)` (Fraunces) rather than Inter.

#### Scenario: Not a special-case override
- **WHEN** a homepage heading's font-family is inspected
- **THEN** it SHALL match Dawn's own sitewide default for heading tags
  (Fraunces, from the theme's heading-font setting) — the same "un-overridden"
  path PDP and PLP already take — rather than an Inter override like the
  footer, announcement bar, or cart, which deliberately fought that default
  back to Inter for their own dense-UI surfaces. See CI-STYLE-TOKENS.md's
  "Font stack" section.
