## RENAMED Requirements

- FROM: `### Requirement: Type, Maat and Kleur render as simultaneous scrolling rows`
- TO: `### Requirement: Gender, Maat and Kleur render as simultaneous scrolling rows`

## MODIFIED Requirements

### Requirement: Gender, Maat and Kleur render as simultaneous scrolling rows
The open panel SHALL render exactly the Gender (`custom.genderid`), Maat, and Kleur filters simultaneously as independent, non-wrapping horizontal rows. Gender and Maat SHALL use native checkbox-backed boxes, with Gender shorter than Maat; Kleur SHALL use the same color-family values and chips as desktop. Other filters, including Producttype, SHALL not render as rows.

#### Scenario: Mobile panel is open
- **WHEN** the shopper views the open panel
- **THEN** Gender, Maat, and Kleur are all visible, each row scrolls independently, and overflowing rows retain a native scroll indicator

#### Scenario: Shopper selects a row value
- **WHEN** the shopper taps a Gender, Maat, or Kleur value
- **THEN** that control shows selected state and submits the same native parameter as its desktop counterpart

### Requirement: Unrendered active filters are preserved and removable
Active parameters for filters without a bar row SHALL pass through every bar submission and SHALL retain their mobile active pill as their removal path. Gender, Maat, and Kleur SHALL show state only on their row controls and SHALL not render separate pills or reset links.

#### Scenario: Shared URL contains an active price filter
- **WHEN** the shopper changes a size in the mobile bar
- **THEN** the price parameter remains active and its pill remains available to remove it

#### Scenario: Shared URL contains an active product type
- **WHEN** a URL carries an active Producttype value and the shopper changes a Gender value in the mobile bar
- **THEN** the product type parameter remains active and its pill remains available to remove it

#### Scenario: Shopper toggles an active row value
- **WHEN** the shopper taps an already selected Gender, Maat, or Kleur control
- **THEN** that value is removed through the same control and no duplicate pill is involved

### Requirement: Mobile color selection follows the global cardinality setting
The Kleur row SHALL use the same global color-filter selection mode as the desktop facet. Multiple mode SHALL retain checkbox-backed chips and allow several active colors; single mode SHALL expose one mutually exclusive radio group and replace the previous color immediately through the existing AJAX facet pipeline. Gender and Maat SHALL remain multi-select checkboxes in both modes.

#### Scenario: Mobile multiple mode
- **WHEN** multiple mode is active and the shopper selects two colors in the Kleur row
- **THEN** both chips remain active and both native color parameters are submitted

#### Scenario: Mobile single mode
- **WHEN** single mode is active and the shopper selects a second color in the Kleur row
- **THEN** the first chip is deselected, only the second color parameter remains, and the grid updates without an apply button or page reload

#### Scenario: Non-color rows are unaffected
- **WHEN** single color mode is active
- **THEN** Gender and Maat still allow several simultaneous checkbox selections

### Requirement: A bar row with fewer than two values does not render
The Gender, Maat, or Kleur row SHALL NOT render when its underlying facet's `values` collapse to 0 or 1 entries, since selecting the sole remaining value cannot narrow the result set. The other rows are unaffected.

#### Scenario: Collection narrows Gender to one value
- **WHEN** a collection's product mix leaves the Gender facet with exactly one available value
- **THEN** the Gender row is absent from the open panel while Maat and Kleur (if they have 2+ values) still render

#### Scenario: A single-valued row has an active selection
- **WHEN** a row's sole remaining value is already selected (active)
- **THEN** the row still does not render, and the selection remains removable via the active-filter pill row
