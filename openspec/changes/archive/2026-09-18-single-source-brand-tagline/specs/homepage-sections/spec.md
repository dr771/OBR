## ADDED Requirements

### Requirement: A brand's one-line tagline has a single source of truth
Each brand's one-line tagline SHALL be stored once, on the brand's own collection, in the
`custom.brand_tagline` metafield (single-line text), and SHALL be read from there by every surface
that displays it. A surface SHALL fall back to its own block setting only when the metafield resolves
to blank, or when the brand has no collection to carry a metafield at all. No surface SHALL require a
merchant to write the same tagline twice.

#### Scenario: One edit updates every surface
- **WHEN** a merchant edits `custom.brand_tagline` on a brand's collection in Admin
- **THEN** the homepage featured-brands card and the Merken page tile for that brand SHALL both show
  the new text, with no theme-editor edit and no code change on either page.

#### Scenario: Brand without a collection still renders
- **WHEN** a brand is rendered from `brand_handle` because it has no Shopify collection yet (RH+)
- **THEN** its tagline SHALL come from the section block's own setting, and the card SHALL render
  normally rather than showing an empty tagline or erroring.

#### Scenario: Empty metafield falls back rather than blanking
- **WHEN** a brand collection exists but its `custom.brand_tagline` is unset or empty
- **THEN** the surface SHALL render its block setting's text, so a not-yet-populated metafield never
  strips copy that is already live.

## MODIFIED Requirements

### Requirement: Featured-brands grid shows the real 11-brand roster, not bolt's demo set
The "Uitgelichte merken" grid SHALL be its own section
(`sections/ob-home-brand-logos.liquid`) listing the shop's real 11 brand
collections, each card showing that brand's real logo from
`snippets/ob-brand-logotype.liquid` (the text wordmark fallback only for a
brand with no sourced logo, currently Sneaker Lab) and a short one-line
tagline resolved from the brand collection's `custom.brand_tagline` metafield
(the card's own block setting only as a fallback), laid out with an uneven
flex-row technique (6 + 5) rather than a rigid column count. This SHALL be
the only brand-grid section in the theme.

#### Scenario: Copy matches the Merken page
- **WHEN** a shopper reads a brand's one-line tagline on the homepage
- **THEN** it SHALL read identically to that brand's eyebrow on
  `/pages/merken`, because both render the same `custom.brand_tagline` value
  rather than two independently maintained copies.

#### Scenario: Uneven last row stretches to fill
- **WHEN** 11 brand blocks are configured
- **THEN** the grid SHALL render 6 cards in the first row and 5 in the
  second at desktop widths, with the second row's cards stretched to fill
  the full row width — the same technique as `merken-brands-directory`'s
  chip grid.

#### Scenario: Logo at rest and on hover
- **WHEN** a card for a brand with a sourced logo is rendered
- **THEN** its logo SHALL render grayscale, contrast-boosted, at 90% opacity
  at rest — the same weight as the brand marquee — and SHALL reveal full
  color at 100% opacity on hover/focus of the card.

#### Scenario: Descriptions align across a row
- **WHEN** cards in the same row carry logos of different optical heights
- **THEN** each logo SHALL sit centered in a fixed-height mark slot, so
  every card's description starts at the same vertical position.

#### Scenario: The superseded text grid is gone, not hidden
- **WHEN** a merchant opens the homepage in the theme editor
- **THEN** no disabled "OB Uitgelichte merken" text-wordmark section SHALL be
  present. Its section file and stylesheet are removed from the theme; the
  wordmark treatment itself survives in `snippets/ob-brand-logotype.liquid`
  (`style: 'text'`, and automatically for any brand with no sourced logo) with
  its `.ob-logotype` / `.ob-lt-*` rules in `assets/component-ob-merken.css`, and
  the removed section is recoverable from git history at commit `788772c`.
