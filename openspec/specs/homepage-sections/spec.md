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

#### Scenario: Floating cards render at every width, sized to fit
- **WHEN** the hero renders at any viewport width, including mobile
- **THEN** the two floating info cards SHALL render inset within the photo's
  own edges (never overflowing past them) at a compact size below 1024px,
  growing to their full desktop size and their owner-dictated overflow
  position only from 1024px up - a deliberate departure from the reference
  proto, which hides its own floating cards below 768px.

#### Scenario: Copy leads, photo follows, at every width
- **WHEN** the hero renders at any viewport width, stacked or two-column
- **THEN** the copy column SHALL appear before the photo in visual order (not
  just DOM order), matching the reference proto's own source order.

#### Scenario: Two-column layout starts at 1024px, not the theme's 990px
- **WHEN** the viewport is between 750px and 1023px
- **THEN** the hero SHALL still render stacked (copy full-width, photo with
  both floating cards below it) - matching the reference proto's own
  `lg:` (1024px) breakpoint for its two-column switch, a deliberate
  one-section departure from this theme's shared 990px breakpoint.

#### Scenario: Photo is full width while stacked
- **WHEN** the hero renders stacked (narrower than 1024px, mobile or tablet)
- **THEN** the photo SHALL span the full copy-column width, not a narrower
  centered block, matching the proto's own single grid track at these
  widths.

#### Scenario: Photo is shorter on tablet
- **WHEN** the hero renders between 750px and 1023px
- **THEN** the photo SHALL use a 3:2 aspect ratio rather than the square
  ratio used at mobile and desktop widths, since a full-width square photo
  at these widths would otherwise stand as tall as the viewport is wide.

#### Scenario: Square photo and usable CTAs
- **WHEN** the homepage renders at desktop or mobile widths
- **THEN** the hero photo SHALL be square and both CTA buttons SHALL have matching usable minimum heights.

#### Scenario: Accurate editable social proof
- **WHEN** the hero renders with the owner-supplied September 2026 review snapshot
- **THEN** it SHALL show "Uitstekend, 4.50" and "2.394 geverifieerde beoordelingen", with four-and-a-half stars, and these copy fields SHALL remain editable.

#### Scenario: Compact linked outlet badge
- **WHEN** a desktop shopper views the floating cards
- **THEN** their text SHALL use explicit compact line heights, and the outlet card SHALL be a keyboard-accessible link to `/collections/solden`.

#### Scenario: Outlet badge hover inverts to solid accent
- **WHEN** the outlet badge is hovered or focused
- **THEN** its background SHALL invert to the solid accent ink (`#0d80c4`) with its text turning white, rather than a paler blue tint - its rest-state pale blue is shared with the brand marquee directly below it, so a same-family hover would no longer read as a distinct reward.

#### Scenario: Count-free eyebrow
- **WHEN** the default eyebrow is displayed
- **THEN** it SHALL say "Topmerken · slim gekozen" beside a decorative 6px blue dot.

### Requirement: Brand marquee scrolls continuously and shows each brand's real logo
The homepage SHALL render a continuously auto-scrolling row of brand marks on a tinted band directly under the hero, each linking to its collection, reusing `snippets/ob-brand-logotype.liquid` (shared with the Merken hero chips) so both surfaces stay in sync.

#### Scenario: Seamless loop
- **WHEN** the marquee is displayed
- **THEN** its block list SHALL render twice back-to-back and its track SHALL be translated continuously toward -100% of one rendered set's width, wrapping back to 0 at that point so the loop has no visible seam; the scroll speed SHALL ease toward a slower (not stopped) speed on hover/focus and ease back on leave, and motion SHALL be replaced by a static wrapped row under `prefers-reduced-motion: reduce`.

#### Scenario: Tinted band
- **WHEN** the marquee is displayed
- **THEN** its strip SHALL render on the same pale blue as the hero's outlet badge rest state (`#edf7fd`), not a transparent/white background or a different tint, so it reads as its own band between the hero and the next section without clashing against the badge directly above it.

#### Scenario: Real logo for a sourced brand
- **WHEN** a marquee item is rendered for a brand with a sourced logo file (FitFlop, Hi-Tec, Holster, Irasuto Studios, Juicy Couture, Löwenweiss, Nike Swim, Odlo, Pas de Monaco, RH+, Sweaty Betty)
- **THEN** it SHALL render that brand's real logo image (`assets/ob-logo-<handle>.*`) at a uniform grayscale, contrast-boosted, 90%-opacity weight - dark enough that lighter source files (e.g. Holster's cool gray, Pas de Monaco's olive) read at roughly the same weight as the near-black ones, not their own original lightness - and SHALL reveal full color and 100% opacity on hover/focus of the marquee item.

#### Scenario: Inverted logo for a brand with no dark-on-light source file
- **WHEN** a marquee item is rendered for a brand whose only sourced logo file is light-on-transparent, built for a dark surface (RH+)
- **THEN** it SHALL render that logo permanently inverted (dark on this row's light tint) at rest and on hover/focus alike, since the source file has no legible color state to reveal.

#### Scenario: Brand with no synced collection yet
- **WHEN** a marquee block has no `collection` selected but a `brand_handle` setting is set (e.g. `rh-plus`, for a brand not yet synced from Akeneo)
- **THEN** the item SHALL still render, using `brand_handle` to pick the logo and linking to `/collections/<brand_handle>` even though that collection does not exist yet.

#### Scenario: Text fallback for an unsourced brand
- **WHEN** a marquee item is rendered for a brand with no sourced logo file (Sneaker Lab) or an unrecognized collection handle
- **THEN** it SHALL render the existing styled-text wordmark (or the plain collection title, for an unrecognized handle) unaffected by the logo grayscale treatment.

### Requirement: Occasion grid links to the real vendor-conditioned collections
The "Shop per behoefte" grid SHALL render one card per occasion block, each
linking to its real collection (`sport-training`, `outdoor-werk`,
`fashion-lifestyle`) with a photo resolved via
`snippets/ob-occasion-image.liquid`, a numbered eyebrow, the collection's own
title as the card heading, and a scrim ensuring the overlaid text stays
legible against any photo. Each collection's product membership SHALL be
determined by vendor-based OR conditions (see `COLLECTIONS.md`), not by
activity/category metafields, so the three collections stay mutually
exclusive regardless of how a product's own activity tags are set.

#### Scenario: Curated occasion photography
- **WHEN** an occasion card is for one of the three known collection handles
- **THEN** its image SHALL be the theme's curated asset for that occasion
  (not a generic placeholder), falling back to the collection's own
  `featured_image` for any other handle.

#### Scenario: Collections are mutually exclusive by vendor
- **WHEN** a product carries activity or category metafield values that
  would have matched more than one occasion collection under the previous
  activity/category rule type
- **THEN** the product SHALL still appear in exactly one occasion
  collection, determined solely by its vendor, never by its activity tags.

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
