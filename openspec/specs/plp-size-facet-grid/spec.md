# plp-size-facet-grid Specification

## Purpose
Renders the desktop PLP size facet ("Maat") as a compact grid of clickable boxes instead of Dawn's default checkbox list, with the selected value shown by an inverted fill — giving size the same deliberate visual treatment the colour facet already has, and suiting values that are short uniform tokens a shopper scans rather than reads. Presentation only: the facet's value ordering is supplied correctly by Shopify and is deliberately not re-derived in the theme.
## Requirements
### Requirement: Collection filters use the vertical layout
The collection page SHALL present its desktop filters as the vertical sidebar layout rather than the horizontal popup layout.

#### Scenario: Shopper opens a collection on desktop
- **WHEN** a shopper loads a collection page on desktop
- **THEN** the filters render as a vertical sidebar beside the product grid, not as a row of dropdown popups above it

### Requirement: Size facet renders as a box grid
On the desktop vertical filter, the size facet SHALL render each of its values as a clickable box arranged in a 4-column grid, replacing Dawn's default checkbox-list rendering for that facet only. The facet SHALL be identified by its filter parameter name (the `akeneo.available_erp_sizes` metafield), never by its visible label, so that translating or renaming the facet in Search & Discovery cannot change how it renders.

#### Scenario: Desktop vertical filter shows the size grid
- **WHEN** a shopper opens the "Maat" facet on the desktop vertical filter
- **THEN** each size value renders as a box in a 4-column grid, instead of a vertical list of labelled checkboxes

#### Scenario: Grid fits the sidebar without overflow
- **WHEN** the size grid renders in the vertical sidebar
- **THEN** all 4 columns fit within the sidebar's width, and no box overflows it or clips its label

#### Scenario: Facet is renamed or translated in the admin
- **WHEN** a merchant changes the size facet's display label in Search & Discovery
- **THEN** the facet still renders as the box grid, because identification does not depend on the label

#### Scenario: Other facets are unaffected
- **WHEN** a shopper opens any other facet (Kleur, Merk, Gender, Producttype, Prijs)
- **THEN** its rendering is unchanged — colour keeps its swatch chips, the others keep Dawn's default list

### Requirement: Selected size renders with an inverted fill
An active size value's box SHALL render with an inverted fill (dark background, light text), visually distinct from unselected boxes at a glance.

#### Scenario: Shopper selects a size
- **WHEN** a shopper selects a size value in the grid
- **THEN** that value's box shows the inverted-fill selected state

#### Scenario: Shopper deselects a size
- **WHEN** a shopper deselects a previously active size value
- **THEN** that value's box returns to the unselected appearance

### Requirement: The grid shows exactly the sizes the facet supplies
The grid SHALL render exactly the values supplied for the facet, and SHALL NOT synthesise, retain or pad out values that are absent. Whether values with no matching products are supplied at all is a store-level Search & Discovery setting, not a property of this grid; the store is currently configured to hide them, so narrowing the results shrinks the grid rather than greying values out.

When a value with zero matching products and no active selection *is* supplied — which is what flipping that setting produces — its box SHALL render visually disabled and non-selectable, consistent with Dawn's disabled-value behaviour for other facets. The grid SHALL therefore render correctly under either setting, without a code change.

#### Scenario: Empty values hidden (current store setting)
- **WHEN** a shopper applies another facet that reduces which sizes are available, and the store hides filter values with no results
- **THEN** the grid renders only the still-available sizes, in the supplied order, with no leftover boxes for the sizes that dropped out

#### Scenario: Empty values shown
- **WHEN** the store is configured to show filter values with no results, and a size value has zero count and is not currently active
- **THEN** its box renders visibly disabled, cannot be selected, and keeps its position in the grid

### Requirement: Native filtering behaviour is preserved
The grid SHALL be built on the same `<input type="checkbox">` controls that Dawn's facet filtering depends on, carrying each value's parameter name, value, active state and disabled state unchanged.

#### Scenario: Selecting a size filters the collection
- **WHEN** a shopper selects or deselects a size box
- **THEN** the product results update through Dawn's existing facet-filtering mechanism, and the URL reflects the selection exactly as it did before this change

#### Scenario: Arriving on a pre-filtered URL
- **WHEN** a shopper loads a collection URL that already carries a size filter parameter
- **THEN** the corresponding box renders in its selected state

### Requirement: Truncation cuts on a whole row
The size facet SHALL keep Dawn's show-more/show-less truncation on the desktop vertical filter, and the number of values shown before truncation SHALL be a multiple of the grid's column count, so the visible area ends on a complete row rather than a partial one.

#### Scenario: Facet has more values than the threshold
- **WHEN** the size facet's value list exceeds the show-more threshold
- **THEN** the excess boxes are hidden behind a "show more" control that behaves identically to Dawn's existing toggle, and the boxes still visible form complete rows with no partially filled final row

#### Scenario: Facet fits within the threshold
- **WHEN** the size facet has no more values than the threshold
- **THEN** every value renders and no show-more control appears

### Requirement: Facet-supplied value order is preserved
The theme SHALL render size values in the order the platform supplies them and SHALL NOT re-sort them. The supplied order is size-aware (numeric sizes ascending, then letter sizes from smallest to largest), which the theme relies on rather than reproducing.

#### Scenario: Mixed numeric and letter sizes
- **WHEN** a collection contains both footwear and apparel, so the facet carries EU numeric and letter sizes together
- **THEN** the grid renders them in the platform-supplied order — numeric ascending, then letter sizes in size order — with no alphabetical or other re-sorting applied

#### Scenario: Order is stable across selections
- **WHEN** a shopper selects a size value
- **THEN** the remaining boxes keep their positions, and the selected value does not move within the grid

