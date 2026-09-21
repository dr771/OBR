## ADDED Requirements

### Requirement: A bar row with fewer than two values does not render
The Type, Maat, or Kleur row SHALL NOT render when its underlying facet's `values` collapse to 0 or 1 entries, since selecting the sole remaining value cannot narrow the result set. The other rows are unaffected.

#### Scenario: Collection narrows Type to one value
- **WHEN** a collection's product mix leaves the Producttype facet with exactly one available value
- **THEN** the Type row is absent from the open panel while Maat and Kleur (if they have 2+ values) still render

#### Scenario: A single-valued row has an active selection
- **WHEN** a row's sole remaining value is already selected (active)
- **THEN** the row still does not render, and the selection remains removable via the active-filter pill row
