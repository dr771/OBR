## MODIFIED Requirements

### Requirement: Featured-brands grid shows the real 11-brand roster, not bolt's demo set
The "Uitgelichte merken" grid SHALL be its own section (`sections/ob-home-brand-logos.liquid`) listing the shop's real 11 brand collections, each card showing that brand's real logo from `snippets/ob-brand-logotype.liquid` (the text wordmark fallback only for a brand with no sourced logo, currently Sneaker Lab) and a short one-line description reusing the identical copy already written for each brand's block on the Merken page, laid out with an uneven flex-row technique (6 + 5) rather than a rigid column count. The previous text-wordmark grid (`sections/ob-home-brands.liquid`) SHALL remain in the theme and in `templates/index.json` as a disabled section, so it can be restored from the theme editor.

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

#### Scenario: Logo at rest and on hover
- **WHEN** a card for a brand with a sourced logo is rendered
- **THEN** its logo SHALL render grayscale, contrast-boosted, at 90% opacity at rest — the same weight as the brand marquee — and SHALL reveal full color at 100% opacity on hover/focus of the card.

#### Scenario: Descriptions align across a row
- **WHEN** cards in the same row carry logos of different optical heights
- **THEN** each logo SHALL sit centered in a fixed-height mark slot, so every card's description starts at the same vertical position.

#### Scenario: Archived text grid can be restored
- **WHEN** a merchant opens the homepage in the theme editor
- **THEN** the text-wordmark "OB Uitgelichte merken" section SHALL be present but hidden, with its 11 blocks and copy intact, and re-enabling it SHALL render the old grid unchanged.

## ADDED Requirements

### Requirement: Homepage brand logos are optically size-normalized
Every real brand logo on the homepage (marquee and featured-brands grid) SHALL be sized by its own `--ob-logo-scale` multiplier from `snippets/ob-brand-logotype.liquid` applied to the row's base height, instead of a shared fixed height, so near-square marks and long wordmarks carry the same visual weight. Logo assets SHALL be trimmed to their ink (no transparent padding), since the scale is derived from the trimmed ink box.

#### Scenario: Square mark versus long wordmark
- **WHEN** the marquee renders Odlo (near-square mark) and Sweaty Betty (a wordmark ~10× wider than tall)
- **THEN** Odlo SHALL render taller and Sweaty Betty shorter than the row's base height, neither capped by a shared max-width, so both read at comparable visual weight.

#### Scenario: Grid and marquee agree
- **WHEN** the same brand appears in the marquee and the featured-brands grid
- **THEN** both SHALL use the same `--ob-logo-scale` value for it, differing only in the row's base height.
