## MODIFIED Requirements

### Requirement: Brand marquee scrolls continuously and shows each brand's real logo
The homepage SHALL render exactly one continuously auto-scrolling row of brand marks on a tinted band, owned by the hero section (its brands are the hero section's blocks), each linking to its collection, reusing `snippets/ob-brand-logotype.liquid` (shared with the Merken hero chips) so both surfaces stay in sync.

#### Scenario: Position below 750px
- **WHEN** the homepage is displayed below 750px wide
- **THEN** the band SHALL render at full viewport width between the hero copy (after the trust/rating block) and the hero image.

#### Scenario: Position from 750px up
- **WHEN** the homepage is displayed at 750px wide or more
- **THEN** the band SHALL render at full viewport width directly under the hero's copy and image.

#### Scenario: Seamless loop
- **WHEN** the marquee is displayed
- **THEN** its block list SHALL render twice back-to-back and its track SHALL be translated continuously toward -100% of one rendered set's width, wrapping back to 0 at that point so the loop has no visible seam; the scroll speed SHALL ease toward a slower (not stopped) speed on hover/focus and ease back on leave, and motion SHALL be replaced by a static wrapped row under `prefers-reduced-motion: reduce`.

#### Scenario: Tinted band
- **WHEN** the marquee is displayed
- **THEN** its strip SHALL render on the theme's single light surface tint, the same value used by the featured-brands band, the footer, and the PLP/PDP product-photo surface, not a transparent/white background and not a second, near-identical tint. The hero's floating-card icon tile SHALL use that same value, so no two light surfaces on the page sit one step apart.

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
