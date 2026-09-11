## MODIFIED Requirements

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
  just DOM order), matching the reference proto's own source order rather
  than the photo-first stacking this section shipped with initially.

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

