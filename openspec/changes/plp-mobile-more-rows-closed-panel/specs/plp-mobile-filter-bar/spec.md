## RENAMED Requirements

- FROM: `### Requirement: Gender, Merk, Maat and Kleur render as simultaneous scrolling rows`
- TO: `### Requirement: Bar filters render as simultaneous scrolling rows`

## REMOVED Requirements

### Requirement: Panel state is open by default and persistent
**Reason**: Client request 2026-11-12: the panel starts closed and opens only on the toggle.
**Migration**: Replaced by "Panel starts closed and opens on the toggle". The `ob-plp-filter-bar` localStorage key is cleared.

## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Bar filters render as simultaneous scrolling rows
The open panel SHALL render exactly the Gender (`custom.genderid`), Merk (`vendor`), Category (the Akeneo category metafield, `akeneo.shopify_originalbrands_cate__1` or `custom.shopify_originalbrands_category`), Activities (`custom.activities`), Maat, and Kleur filters, in that order, simultaneously as independent, non-wrapping horizontal rows. Gender, Merk, Category, Activities and Maat SHALL use native checkbox-backed boxes, with Gender, Merk, Category and Activities shorter than Maat; Kleur SHALL use the same color-family values and chips as desktop. Other filters, including Producttype, SHALL not render as rows.

#### Scenario: Mobile panel is open
- **WHEN** the shopper views the open panel on a collection with several brands, categories and activities
- **THEN** Gender, Merk, Category, Activities, Maat, and Kleur are all visible, each row scrolls independently, and overflowing rows retain a native scroll indicator

#### Scenario: Shopper selects a row value
- **WHEN** the shopper taps a Gender, Merk, Category, Activities, Maat, or Kleur value
- **THEN** that control shows selected state and submits the same native parameter as its desktop counterpart

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

### Requirement: A bar row with fewer than two values does not render
The Gender, Merk, Category, Activities, Maat, or Kleur row SHALL NOT render when its underlying facet's `values` collapse to 0 or 1 entries and none of them is active, since selecting the sole remaining value cannot narrow the result set. A row with an active value SHALL always render, so a selection stays on its row control. The other rows are unaffected.

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

### Requirement: Unrendered active filters are preserved and removable
Active parameters for filters without a rendered bar row SHALL pass through every bar submission and SHALL retain their mobile active pill as their removal path. Gender, Merk, Category, Activities, Maat, and Kleur SHALL show state only on their row controls and SHALL not render separate pills or per-row reset links.

#### Scenario: Shared URL contains an active price filter
- **WHEN** the shopper changes a size in the mobile bar
- **THEN** the price parameter remains active and its pill remains available to remove it

#### Scenario: Shared URL contains an active product type
- **WHEN** a URL carries an active Producttype value and the shopper changes a Gender value in the mobile bar
- **THEN** the product type parameter remains active and its pill remains available to remove it

#### Scenario: Shopper toggles an active row value
- **WHEN** the shopper taps an already selected Gender, Merk, Category, Activities, Maat, or Kleur control
- **THEN** that value is removed through the same control and no duplicate pill is involved
