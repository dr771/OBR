# plp-filter-panel-chrome Specification

## Purpose
Defines the desktop vertical PLP filter panel's compact, reusable chrome and the control that restores access after the panel scrolls away.
## Requirements
### Requirement: Desktop facet accordions are open by default
Every facet in the desktop vertical filter SHALL render expanded on initial page load, while remaining a native disclosure that the shopper can collapse and reopen.

#### Scenario: Collection loads on desktop
- **WHEN** a shopper opens a collection with vertical filters
- **THEN** every facet's values are visible without first opening an accordion

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

### Requirement: Sidebar width follows compact facet content
The desktop form SHALL use a 23rem content width, a 4.8rem gutter before the product grid, and keep each title on one line by allowing its reset link to wrap beneath it when necessary.

#### Scenario: Long active facet title shares the desktop sidebar
- **WHEN** a long facet title and its reset link cannot fit within the 23rem filter column
- **THEN** the title remains unbroken, the reset link moves to the next row without clipping the facet content, and 4.8rem separates the filter column from the product grid

### Requirement: A desktop summon control restores an off-screen panel
On desktop vertical layouts only, a sticky translated summon button SHALL appear whenever the filter form is fully outside the viewport and remain hidden whenever any part of the form is visible. Activating it SHALL relocate the form within the sidebar bounds near the button without changing `window.scrollY`; returning to the sidebar top SHALL restore natural flow, and the cycle SHALL remain repeatable in either scroll direction.

#### Scenario: Panel has scrolled out of view
- **WHEN** the desktop filter form is fully outside the viewport
- **THEN** a full-sidebar-width summon button appears at a stable offset below the header

#### Scenario: Shopper summons the panel
- **WHEN** the shopper activates the visible summon button
- **THEN** the form reappears within the sidebar bounds, the button hides, and the page scroll position does not change

#### Scenario: Shopper returns to the sidebar top
- **WHEN** a relocated form's original sidebar top enters the viewport
- **THEN** the form returns to natural flow and no empty gap remains

### Requirement: Relocated panel is re-clamped after facet swaps
When a facet or sort update replaces the product grid while the panel is relocated, the form SHALL be re-clamped to the sidebar's new bounds before the existing document scroll clamp runs. Load-more appends SHALL NOT reposition the panel.

#### Scenario: Filtering substantially shortens the grid
- **WHEN** a relocated panel no longer fits at its parked offset after a facet update
- **THEN** it returns to natural flow and the shopper's scroll position is clamped within the real document

#### Scenario: Load more appends products
- **WHEN** products are appended without replacing the grid container child
- **THEN** the relocated panel stays at its current position

### Requirement: Summon behavior is desktop-vertical-only
The summon control and relocation behavior SHALL NOT render on mobile or on a non-vertical desktop filter layout.

#### Scenario: Mobile bar renders
- **WHEN** a shopper uses filters on a mobile viewport
- **THEN** no desktop summon control is present

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

### Requirement: A facet with fewer than two values does not render
A list- or boolean-type facet whose `values` collapse to 0 or 1 entries SHALL NOT render its accordion in the desktop vertical (or horizontal) filter panel, since selecting the sole remaining value cannot narrow the result set. This does not apply to the price-range facet.

#### Scenario: Collection narrows a facet to one value
- **WHEN** a collection's product mix leaves a facet (e.g. Merk, Gender, Producttype) with exactly one available value
- **THEN** that facet's accordion is absent from the panel entirely, while facets with two or more values still render normally

#### Scenario: A facet later gains a second value
- **WHEN** an AJAX facet update changes the result set so a previously single-valued facet now offers two or more values
- **THEN** that facet's accordion appears in the re-rendered panel

#### Scenario: A single-valued facet has an active selection
- **WHEN** a facet's sole remaining value is already selected (active)
- **THEN** the facet's own accordion still does not render, and the selection remains visible and removable via the active-filter pill row

