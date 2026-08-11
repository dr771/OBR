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
The redundant top-level “Filter:” heading SHALL NOT render, and every facet title SHALL prepend the translated `Shop by` phrase to the facet's display label. Facet titles SHALL omit selected-value counts and AND-operator help text.

#### Scenario: Desktop sidebar renders
- **WHEN** the sidebar contains Kleur, Maat, Merk, Gender, Producttype, and Prijs facets
- **THEN** each title begins with the translated “Shop by” copy, with no top-level “Filter:” heading, selected count, or AND help text

### Requirement: Active filters use compact value-only controls
Desktop active-filter pills SHALL be square, tightly spaced, and show only each selected value. A facet with active values SHALL show a small inline reset link that removes only that facet, and the clear-all link SHALL use the same muted style above the pills at the right edge; reset links SHALL be absent when they have nothing to clear.

#### Scenario: Multiple facets are active
- **WHEN** a shopper selects values in two different facets
- **THEN** value-only pills appear with matching square styling, each active facet shows its own reset, and clear-all appears at the upper right

### Requirement: Facet carets are left-aligned filled triangles
Each desktop vertical facet SHALL show a filled triangle at the left of its title, pointing right when collapsed and down when expanded.

#### Scenario: Shopper toggles a facet
- **WHEN** the shopper collapses and reopens a facet
- **THEN** the left-edge triangle rotates between right and down while the disclosure remains keyboard operable

### Requirement: Sidebar width follows compact facet content
The desktop form SHALL closely hug its swatch grids without clipping them, use a 2rem gutter before the product grid, and keep each title on one line by allowing its reset link to wrap beneath it when necessary.

#### Scenario: Long active facet title shares the narrow sidebar
- **WHEN** a long facet title and its reset link cannot fit on one row
- **THEN** the title remains unbroken and the reset link moves to the next row without clipping the facet content

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
