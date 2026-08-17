## RENAMED Requirements

- FROM: `### Requirement: Facet carets are left-aligned filled triangles`
- TO: `### Requirement: Facet carets sit at the right edge of each title`

## MODIFIED Requirements

### Requirement: Desktop headings use centralized “Shop by” copy
A blue “FILTER” heading (icon + label, reusing the theme's existing filter icon) SHALL render at the top of the desktop vertical sidebar, above the accordions, and every facet title SHALL prepend the translated `Shop by` phrase to the facet's display label. Facet titles SHALL omit selected-value counts and AND-operator help text.

#### Scenario: Desktop sidebar renders
- **WHEN** the sidebar contains Kleur, Maat, Merk, Gender, Producttype, and Prijs facets
- **THEN** a blue “FILTER” heading renders above the accordion list, each facet title begins with the translated “Shop by” copy, and no facet title shows a selected count or AND help text

#### Scenario: Shopper activates the FILTER heading
- **WHEN** the shopper clicks or otherwise activates the “FILTER” heading while any facet section is open
- **THEN** every facet section collapses while all facet headings remain visible, and each facet stays individually operable afterwards

#### Scenario: Shopper reopens the facets
- **WHEN** the shopper activates the “FILTER” heading while every facet section is collapsed
- **THEN** every facet section expands again, and a fresh page load still renders them all expanded by default

#### Scenario: Filtering while the sections are collapsed
- **WHEN** a facet or active-filter change re-renders the panel while the sections are collapsed
- **THEN** the sections remain collapsed rather than springing open

### Requirement: Active filters use compact value-only controls
Desktop active-filter pills SHALL render in the main content column, directly below the sort/product-count bar — not inside the filter sidebar — and SHALL show only each selected value in a rounded, white, hairline-bordered pill with full-ink (black) label text. A muted uppercase kicker label SHALL precede the pill row. A facet's own inline reset link SHALL remain in the DOM but SHALL NOT be visually shown; the clear-all link SHALL use a muted underlined style and sit inline after the last pill.

#### Scenario: Multiple facets are active
- **WHEN** a shopper selects values in two different facets
- **THEN** rounded value-only pills with black label text appear in the main column below the sort bar, no per-facet reset link is visible anywhere in the sidebar, and clear-all appears inline after the last pill

#### Scenario: Color facet is active
- **WHEN** a shopper selects a Kleur value
- **THEN** its pill shows a small color-swatch dot before the label, in addition to the black label text

### Requirement: Facet carets sit at the right edge of each title
Each desktop vertical facet SHALL show a muted chevron at the right edge of its title row, vertically centred on the title, rotating between collapsed and expanded states.

#### Scenario: Shopper toggles a facet
- **WHEN** the shopper collapses and reopens a facet
- **THEN** the right-edge chevron rotates between its collapsed and expanded orientation while the disclosure remains keyboard operable

## ADDED Requirements

### Requirement: Desktop accordion sections keep proto-matched vertical rhythm
Each accordion section in the desktop vertical filter SHALL use consistent top and bottom padding with a single hairline bottom border as its only separator from the next section; no additional margin SHALL appear between adjacent sections.

#### Scenario: Two accordions sit adjacent
- **WHEN** a shopper views two adjacent facet sections (e.g. Merk and Producttype)
- **THEN** each section has equal internal padding and a hairline border below it, with no extra gap beyond that border

### Requirement: Price facet omits its maximum-price caption
The price facet's “highest price” caption SHALL remain rendered in the DOM for future re-enablement but SHALL NOT be visually shown.

#### Scenario: Shopper opens the Prijs facet
- **WHEN** the shopper expands the Prijs accordion
- **THEN** the min/max price inputs are visible and no “De hoogste prijs is €X,00” caption is shown
