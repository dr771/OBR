## ADDED Requirements

### Requirement: The open panel offers one reset for all filters
While at least one filter is active, the open panel SHALL show one link that removes all active filters through the existing AJAX facet pipeline, and SHALL be the only clear-all control on mobile. With no active filter the link SHALL be absent. On search results the link SHALL keep the original query.

#### Scenario: Shopper resets filters
- **WHEN** filters are active and the shopper taps the reset link
- **THEN** all filters are removed, the grid updates without a page reload, and the link disappears

#### Scenario: First filter applied
- **WHEN** the shopper selects the first filter value
- **THEN** the reset link appears without a page reload

#### Scenario: Reset on search results
- **WHEN** the shopper taps the reset link on the search results page
- **THEN** the filters are removed and the results stay constrained by the original query

## RENAMED Requirements

- FROM: `### Requirement: Gender, Maat and Kleur render as simultaneous scrolling rows`
- TO: `### Requirement: Gender, Merk, Maat and Kleur render as simultaneous scrolling rows`

## MODIFIED Requirements

### Requirement: Gender, Merk, Maat and Kleur render as simultaneous scrolling rows
The open panel SHALL render exactly the Gender (`custom.genderid`), Merk (`vendor`), Maat, and Kleur filters, in that order, simultaneously as independent, non-wrapping horizontal rows. Gender, Merk and Maat SHALL use native checkbox-backed boxes, with Gender and Merk shorter than Maat; Kleur SHALL use the same color-family values and chips as desktop. Other filters, including Producttype, SHALL not render as rows.

#### Scenario: Mobile panel is open
- **WHEN** the shopper views the open panel on a collection with several brands
- **THEN** Gender, Merk, Maat, and Kleur are all visible, each row scrolls independently, and overflowing rows retain a native scroll indicator

#### Scenario: Shopper selects a row value
- **WHEN** the shopper taps a Gender, Merk, Maat, or Kleur value
- **THEN** that control shows selected state and submits the same native parameter as its desktop counterpart

### Requirement: A bar row with fewer than two values does not render
The Gender, Merk, Maat, or Kleur row SHALL NOT render when its underlying facet's `values` collapse to 0 or 1 entries and none of them is active, since selecting the sole remaining value cannot narrow the result set. A row with an active value SHALL always render, so a selection stays on its row control. The other rows are unaffected.

#### Scenario: Collection narrows Gender to one value
- **WHEN** a collection's product mix leaves the Gender facet with exactly one available value
- **THEN** the Gender row is absent from the open panel while Merk, Maat and Kleur (if they have 2+ values) still render

#### Scenario: Brand collection
- **WHEN** a collection contains products of a single brand
- **THEN** the Merk row is absent from the open panel

#### Scenario: A single-valued row has an active selection
- **WHEN** a row's sole remaining value is already selected (active)
- **THEN** the row renders with that value selected, no pill appears for it, and tapping the control removes the selection and brings back the values available again

### Requirement: Unrendered active filters are preserved and removable
Active parameters for filters without a rendered bar row SHALL pass through every bar submission and SHALL retain their mobile active pill as their removal path. Gender, Merk, Maat, and Kleur SHALL show state only on their row controls and SHALL not render separate pills or per-row reset links.

#### Scenario: Shared URL contains an active price filter
- **WHEN** the shopper changes a size in the mobile bar
- **THEN** the price parameter remains active and its pill remains available to remove it

#### Scenario: Shared URL contains an active product type
- **WHEN** a URL carries an active Producttype value and the shopper changes a Gender value in the mobile bar
- **THEN** the product type parameter remains active and its pill remains available to remove it

#### Scenario: Shopper toggles an active row value
- **WHEN** the shopper taps an already selected Gender, Merk, Maat, or Kleur control
- **THEN** that value is removed through the same control and no duplicate pill is involved

### Requirement: Panel state is open by default and persistent
With no saved preference the panel SHALL be open at first paint. The shopper's open/closed choice SHALL persist across navigation and AJAX facet updates without a visible state flash.

#### Scenario: First visit
- **WHEN** no filter-bar preference is stored
- **THEN** the filter rows render open at first paint

#### Scenario: Closed state survives navigation and filtering
- **WHEN** the shopper closes the panel and later navigates or changes a filter
- **THEN** the panel remains closed without flashing open
