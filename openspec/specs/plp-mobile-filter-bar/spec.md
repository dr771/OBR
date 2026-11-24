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
The toolbar SHALL have equal-width sort and “Verfijn op” halves with a divider and top/bottom hairlines. The toggle SHALL expose `aria-expanded` and swap between filter and close icons. While at least one filter is active, the toggle SHALL show the number of active filter values, updated with every AJAX facet response; with no active filter it SHALL show no number. No result count SHALL be visible there, while a visually hidden live status SHALL continue announcing AJAX result counts.

#### Scenario: Shopper toggles the filter block
- **WHEN** the shopper opens or closes the block
- **THEN** `aria-expanded`, the visible icon, and the panel visibility change together

#### Scenario: Active filters with a closed panel
- **WHEN** a page loads with two active filter values
- **THEN** the closed panel's toggle reads “Verfijn op (2)”

#### Scenario: Results update
- **WHEN** a filter or sort changes the result set
- **THEN** the visible toolbar shows no result count, the active-filter number reflects the new state, and assistive technology receives the updated result count

### Requirement: Bar changes use native instant filtering
Checkbox, swatch, and sort changes SHALL flow through Dawn's existing AJAX facet pipeline with no apply button or page reload, preserving the existing debounce, skeleton, URL, and search-term behavior.

#### Scenario: Shopper changes a size
- **WHEN** the shopper taps a Maat box
- **THEN** loading feedback starts, the grid updates in place, and the URL carries the native size parameter

### Requirement: Opening the panel preserves useful grid context
When the shopper manually opens the panel, the viewport SHALL keep the bar and at least the beginning of the first product row visible, including on hero collections.

#### Scenario: Shopper opens filters below a collection hero
- **WHEN** the shopper activates the closed toggle
- **THEN** the resulting viewport includes the bar and the start of the product grid

### Requirement: Unrendered active filters are preserved and removable
Active parameters for filters without a rendered bar row SHALL pass through every bar submission and SHALL retain their mobile active pill as their removal path. Gender, Merk, Maat, Kleur, Category, and Activities SHALL show state only on their row controls and SHALL not render separate pills or per-row reset links.

#### Scenario: Shared URL contains an active price filter
- **WHEN** the shopper changes a size in the mobile bar
- **THEN** the price parameter remains active and its pill remains available to remove it

#### Scenario: Shared URL contains an active product type
- **WHEN** a URL carries an active Producttype value and the shopper changes a Gender value in the mobile bar
- **THEN** the product type parameter remains active and its pill remains available to remove it

#### Scenario: Shopper toggles an active row value
- **WHEN** the shopper taps an already selected Gender, Merk, Maat, Kleur, Category, or Activities control
- **THEN** that value is removed through the same control and no duplicate pill is involved

### Requirement: Search results use the same mobile bar
The search results page SHALL expose the same bar and preserve its original search terms across filter and sort changes.

#### Scenario: Shopper filters search results
- **WHEN** the shopper selects a value in the mobile search bar
- **THEN** the updated results remain constrained by the original query

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
The Gender, Merk, Maat, Kleur, Category, or Activities row SHALL NOT render when its underlying facet's `values` collapse to 0 or 1 entries and none of them is active, since selecting the sole remaining value cannot narrow the result set. A row with an active value SHALL always render, so a selection stays on its row control. The other rows are unaffected.

#### Scenario: Collection narrows Gender to one value
- **WHEN** a collection's product mix leaves the Gender facet with exactly one available value
- **THEN** the Gender row is absent from the open panel while the other rows (if they have 2+ values) still render

#### Scenario: Brand collection
- **WHEN** a collection contains products of a single brand
- **THEN** the Merk row is absent from the open panel

#### Scenario: Category collection
- **WHEN** a collection contains products of a single category
- **THEN** the Category row is absent from the open panel

#### Scenario: A single-valued row has an active selection
- **WHEN** a row's sole remaining value is already selected (active)
- **THEN** the row renders with that value selected, no pill appears for it, and tapping the control removes the selection and brings back the values available again

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

### Requirement: Bar filters render as simultaneous scrolling rows
The open panel SHALL render exactly the Gender (`custom.genderid`), Merk (`vendor`), Maat, Kleur, Category (the Akeneo category metafield, `akeneo.shopify_originalbrands_cate__1` or `custom.shopify_originalbrands_category`), and Activities (`custom.activities`) filters, in that order, simultaneously as independent, non-wrapping horizontal rows. Gender, Merk, Category, Activities and Maat SHALL use native checkbox-backed boxes, with Gender, Merk, Category and Activities shorter than Maat; Kleur SHALL use the same color-family values and chips as desktop. Other filters, including Producttype, SHALL not render as rows.

#### Scenario: Mobile panel is open
- **WHEN** the shopper views the open panel on a collection with several brands, categories and activities
- **THEN** Gender, Merk, Maat, Kleur, Category, and Activities are all visible, each row scrolls independently, and overflowing rows retain a native scroll indicator

#### Scenario: Shopper selects a row value
- **WHEN** the shopper taps a Gender, Merk, Maat, Kleur, Category, or Activities value
- **THEN** that control shows selected state and submits the same native parameter as its desktop counterpart

### Requirement: Panel starts closed and opens on the toggle
The panel SHALL be closed at first paint on every page load, with the toggle's `aria-expanded` set to `false`, and SHALL open only when the shopper activates the toggle. The open/closed choice SHALL NOT be persisted across page loads. An opened panel SHALL stay open across AJAX facet and sort updates on the same page.

#### Scenario: Collection loads
- **WHEN** a shopper opens a collection or search results page on a mobile viewport
- **THEN** the panel is closed without flashing open, and only the toolbar is visible above the grid

#### Scenario: Shopper opens the panel and filters
- **WHEN** the shopper taps the toggle and then selects a filter value
- **THEN** the panel opens, the grid updates in place, and the panel remains open

#### Scenario: Next page load
- **WHEN** the shopper opened the panel and then navigates to another collection
- **THEN** the panel on the new page is closed

