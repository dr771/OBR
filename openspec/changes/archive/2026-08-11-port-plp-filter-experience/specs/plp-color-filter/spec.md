## MODIFIED Requirements

### Requirement: Color filter renders as a compact swatch grid
The color-family filter SHALL render active values as round 2.8rem swatch chips. Desktop vertical filtering SHALL use a fixed five-column grid; the mobile filter bar SHALL use the same chips and family order in one non-wrapping, horizontally scrollable row. Presentation SHALL NOT change filter parameters, selection semantics, or the underlying color-family set.

#### Scenario: Desktop vertical filter shows swatch grid
- **WHEN** a shopper opens the color filter on desktop
- **THEN** each available color family renders as a 2.8rem round chip in a five-column grid, with no permanently visible label or count

#### Scenario: Mobile bar shows swatch row
- **WHEN** a shopper views the Kleur row in the mobile filter bar
- **THEN** the same color families render as 2.8rem round chips in a single horizontally scrollable row rather than a text list or multi-row grid

#### Scenario: Mobile drawer shows swatch grid
- **WHEN** a theme surface explicitly uses Dawn's `drawer` filter layout instead of the collection/search mobile bar
- **THEN** its color facet retains the compact five-column swatch grid rather than reverting to text rows
