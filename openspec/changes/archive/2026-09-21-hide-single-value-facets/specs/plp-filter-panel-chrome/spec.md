## ADDED Requirements

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
