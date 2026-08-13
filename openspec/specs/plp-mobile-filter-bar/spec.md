# plp-mobile-filter-bar Specification

## Purpose
Defines the direct mobile filtering surface above collection and search grids, replacing Dawn's full-screen drawer with immediate native facet controls.
## Requirements
### Requirement: Mobile filtering uses a bar above the grid
On collection and search pages using vertical or horizontal filter layouts, mobile viewports SHALL render a filter bar above the product grid and SHALL NOT render Dawn's full-screen filter drawer. Desktop filtering SHALL remain unaffected.

#### Scenario: Collection loads on mobile
- **WHEN** a shopper opens a collection on a mobile viewport
- **THEN** the filter bar appears above the grid and no drawer opener exists

### Requirement: Toolbar contains sort and a master toggle
The toolbar SHALL have equal-width sort and “Verfijn op” halves with a divider and top/bottom hairlines. The toggle SHALL expose `aria-expanded` and swap between filter and close icons. No result count SHALL be visible there, while a visually hidden live status SHALL continue announcing AJAX result counts.

#### Scenario: Shopper toggles the filter block
- **WHEN** the shopper opens or closes the block
- **THEN** `aria-expanded`, the visible icon, and the panel visibility change together

#### Scenario: Results update
- **WHEN** a filter or sort changes the result set
- **THEN** the visible toolbar remains count-free and assistive technology receives the updated count

### Requirement: Type, Maat and Kleur render as simultaneous scrolling rows
The open panel SHALL render exactly the Type, Maat, and Kleur filters simultaneously as independent, non-wrapping horizontal rows. Type and Maat SHALL use native checkbox-backed boxes, with Type shorter than Maat; Kleur SHALL use the same color-family values and chips as desktop. Other filters SHALL not render as rows.

#### Scenario: Mobile panel is open
- **WHEN** the shopper views the open panel
- **THEN** Type, Maat, and Kleur are all visible, each row scrolls independently, and overflowing rows retain a native scroll indicator

#### Scenario: Shopper selects a row value
- **WHEN** the shopper taps a Type, Maat, or Kleur value
- **THEN** that control shows selected state and submits the same native parameter as its desktop counterpart

### Requirement: Bar changes use native instant filtering
Checkbox, swatch, and sort changes SHALL flow through Dawn's existing AJAX facet pipeline with no apply button or page reload, preserving the existing debounce, skeleton, URL, and search-term behavior.

#### Scenario: Shopper changes a size
- **WHEN** the shopper taps a Maat box
- **THEN** loading feedback starts, the grid updates in place, and the URL carries the native size parameter

### Requirement: Panel state is open by default and persistent
With no saved preference the panel SHALL be open at first paint. The shopper's open/closed choice SHALL persist across navigation and AJAX facet updates without a visible state flash.

#### Scenario: First visit
- **WHEN** no filter-bar preference is stored
- **THEN** the three rows render open at first paint

#### Scenario: Closed state survives navigation and filtering
- **WHEN** the shopper closes the panel and later navigates or changes a filter
- **THEN** the panel remains closed without flashing open

### Requirement: Opening the panel preserves useful grid context
When the shopper manually opens the panel, the viewport SHALL keep the bar and at least the beginning of the first product row visible, including on hero collections.

#### Scenario: Shopper opens filters below a collection hero
- **WHEN** the shopper activates the closed toggle
- **THEN** the resulting viewport includes the bar and the start of the product grid

### Requirement: Unrendered active filters are preserved and removable
Active parameters for filters without a bar row SHALL pass through every bar submission and SHALL retain their mobile active pill as their removal path. Type, Maat, and Kleur SHALL show state only on their row controls and SHALL not render separate pills or reset links.

#### Scenario: Shared URL contains an active price filter
- **WHEN** the shopper changes a size in the mobile bar
- **THEN** the price parameter remains active and its pill remains available to remove it

#### Scenario: Shopper toggles an active row value
- **WHEN** the shopper taps an already selected Type, Maat, or Kleur control
- **THEN** that value is removed through the same control and no duplicate pill is involved

### Requirement: Search results use the same mobile bar
The search results page SHALL expose the same bar and preserve its original search terms across filter and sort changes.

#### Scenario: Shopper filters search results
- **WHEN** the shopper selects a value in the mobile search bar
- **THEN** the updated results remain constrained by the original query

### Requirement: Mobile color selection follows the global cardinality setting
The Kleur row SHALL use the same global color-filter selection mode as the desktop facet. Multiple mode SHALL retain checkbox-backed chips and allow several active colors; single mode SHALL expose one mutually exclusive radio group and replace the previous color immediately through the existing AJAX facet pipeline. Type and Maat SHALL remain multi-select checkboxes in both modes.

#### Scenario: Mobile multiple mode
- **WHEN** multiple mode is active and the shopper selects two colors in the Kleur row
- **THEN** both chips remain active and both native color parameters are submitted

#### Scenario: Mobile single mode
- **WHEN** single mode is active and the shopper selects a second color in the Kleur row
- **THEN** the first chip is deselected, only the second color parameter remains, and the grid updates without an apply button or page reload

#### Scenario: Non-color rows are unaffected
- **WHEN** single color mode is active
- **THEN** Type and Maat still allow several simultaneous checkbox selections
