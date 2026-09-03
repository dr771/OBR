# merken-brands-directory Specification

## Purpose

Defines the `/pages/merken` brands directory: a bespoke section (replacing Dawn's stock `collection-list` rendering) that presents the shop's brands with the shared `ob-collection-hero` (see that spec), a styled-logotype chip grid, and a photo-tile grid, matched to the already-shipped PLP/PDP card system.

## Requirements

### Requirement: Page uses the shared ob-collection-hero, not a page-specific hero
The Merken page's hero (breadcrumb, H1, subheading, background/spacing) SHALL be rendered via `snippets/ob-collection-hero.liquid` — the same component every real `/collections/*` page uses — rather than markup/CSS owned by this page. See the `ob-collection-hero` spec for the hero's own requirements.

#### Scenario: Brand count is passed as the hero's meta slot
- **WHEN** the section has 11 brand blocks configured
- **THEN** it SHALL pass `meta: "11 merken"` (block count, never hardcoded) to `ob-collection-hero`, and adding or removing a block SHALL change this number without a code edit.

#### Scenario: Brand chip grid renders inside the shared hero's tint
- **WHEN** the Merken page renders
- **THEN** the brand-chip grid SHALL be passed to `ob-collection-hero` as its `extra_content` parameter (a captured HTML string), so it renders inside the same tinted wrapper as the breadcrumb/title, above the hero's bottom border — not as separate markup after the hero closes.

### Requirement: Hero includes a styled brand-logotype chip grid at 6 columns
Below the title/subheading, the hero SHALL render one chip per brand block, each containing a per-brand styled wordmark (not the plain collection title), laid out with a flex-wrap technique so a short last row's chips stretch to fill the row instead of leaving a dead gap.

#### Scenario: 11 brands split 6 + 5
- **WHEN** 11 brand blocks are configured
- **THEN** the chip grid SHALL render 6 chips in the first row and 5 in the second at desktop widths (≥990px), with the second row's chips stretched to fill the full row width.

#### Scenario: Per-brand logotype styling
- **WHEN** a chip is rendered for a brand with a defined logotype (FitFlop, Hi-Tec, Holster, Irasuto Studios, Juicy Couture, Loewenweiss, Nike Swim, Odlo, Pas de Monaco, Sneaker Lab, Sweaty Betty)
- **THEN** it SHALL use that brand's distinct typographic treatment (weight, style, case, and — for Juicy Couture, Loewenweiss, Pas de Monaco, and Sweaty Betty — `var(--font-heading-family)`), sourced from `snippets/ob-brand-logotype.liquid`.

#### Scenario: Unknown brand falls back to plain text
- **WHEN** a chip is rendered for a collection handle with no defined logotype
- **THEN** it SHALL render the plain collection title rather than erroring or rendering empty.

### Requirement: Photo-tile grid shows plain brand names, not logotypes
Each tile in the main grid SHALL show the collection's plain title as its heading (never the styled logotype, which is reserved for the hero chips), preceded by an accent-colored eyebrow and followed by a short description.

#### Scenario: Tile heading is plain text
- **WHEN** a visitor views any brand tile in the main grid
- **THEN** the brand name SHALL render in the theme's body font at normal case (e.g. "FitFlop", not the stylized "fitflop" logotype used in the hero chip).

#### Scenario: Eyebrow uses the AA-safe accent ink
- **WHEN** a tile's eyebrow (category label) is rendered
- **THEN** it SHALL use `#0d80c4` (the readable, AA-safe sibling of the `#38b6ff` primary accent — see CI-STYLE-TOKENS.md), never the raw `--ob-accent` value, which fails text contrast.

### Requirement: Tile photography prefers a curated image, falling back to the collection's own featured image
Each tile SHALL render a full-bleed (`object-fit: cover`, no surface-tint multiply blend) photo. For brands with a curated lifestyle/campaign image in `assets/ob-brand-<handle>.jpg` (as resolved by `snippets/ob-brand-hero-image.liquid`), that image SHALL be used; all other brands SHALL fall back to the collection's own `featured_image`.

#### Scenario: Curated brands use their theme asset
- **WHEN** the tile is for a brand with a curated asset (fitflop, hi-tec, holster, juicy-couture, loewenweiss, nike-swim, odlo, pas-de-monaco, sweaty-betty)
- **THEN** the tile image SHALL be `assets/ob-brand-<handle>.jpg`, not the collection's featured image, even if the collection's featured image later changes.

#### Scenario: Uncurated brands fall back to Shopify data
- **WHEN** the tile is for a brand with no curated asset (irasuto-studios, sneaker-lab, as of 2026-09-03)
- **THEN** the tile image SHALL be the collection's own `featured_image`, so a newly synced collection with no curated shot still renders something instead of a broken image.

#### Scenario: No multiply blend on tile photography
- **WHEN** any tile photo is rendered
- **THEN** it SHALL NOT have `mix-blend-mode: multiply` applied — these are campaign/lifestyle frames on their own backdrop, not cut-out packshots on the shared surface tint (contrast with `plp-card-swatches`, where multiply is correct).

### Requirement: Brand copy (collection, eyebrow, description) is merchant-editable per block
Each brand's collection link, eyebrow, and description SHALL be block-level settings (not hardcoded in the section file), so copy can be corrected in the theme editor without a code change.

#### Scenario: Editing a block's description updates the storefront
- **WHEN** a merchant edits a brand block's "Korte omschrijving" setting in the theme editor
- **THEN** the corresponding tile's description SHALL update on the storefront without any Liquid/CSS change.
