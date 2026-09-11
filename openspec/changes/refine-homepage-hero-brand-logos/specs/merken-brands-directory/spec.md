## MODIFIED Requirements

### Requirement: Hero includes a brand-mark chip grid at 6 columns
Below the title/subheading, the hero SHALL render one chip per brand block, each containing a per-brand brand mark (not the plain collection title), laid out with a flex-wrap technique so a short last row's chips stretch to fill the row instead of leaving a dead gap.

#### Scenario: 11 brands split 6 + 5
- **WHEN** 11 brand blocks are configured
- **THEN** the chip grid SHALL render 6 chips in the first row and 5 in the second at desktop widths (≥990px), with the second row's chips stretched to fill the full row width.

#### Scenario: Real logo for a sourced brand
- **WHEN** a chip is rendered for a brand with a sourced logo file (FitFlop, Hi-Tec, Holster, Irasuto Studios, Juicy Couture, Löwenweiss, Nike Swim, Odlo, Pas de Monaco, Sweaty Betty)
- **THEN** it SHALL render that brand's real logo image (`assets/ob-logo-<handle>.*`, sourced from `snippets/ob-brand-logotype.liquid`) at a uniform grayscale, contrast-boosted, reduced-opacity weight - dark enough that lighter source files don't read pale next to the near-black ones - and SHALL reveal full color and opacity on hover/focus of the chip.

#### Scenario: Text fallback for a brand with no sourced logo
- **WHEN** a chip is rendered for a brand with no sourced logo file (Sneaker Lab)
- **THEN** it SHALL use that brand's distinct typographic treatment, sourced from `snippets/ob-brand-logotype.liquid`, unaffected by the logo grayscale treatment.

#### Scenario: Unknown brand falls back to plain text
- **WHEN** a chip is rendered for a collection handle with no defined brand mark
- **THEN** it SHALL render the plain collection title rather than erroring or rendering empty.
