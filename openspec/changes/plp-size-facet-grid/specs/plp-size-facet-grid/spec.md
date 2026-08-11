## Purpose
Renders the desktop PLP size facet ("Maat") as a compact grid of clickable boxes instead of Dawn's default checkbox list, with the selected value shown by an inverted fill — giving size the same deliberate visual treatment the colour facet already has, and suiting values that are short uniform tokens a shopper scans rather than reads. Presentation only: the facet's value ordering is supplied correctly by Shopify and is deliberately not re-derived in the theme.

## ADDED Requirements

### Requirement: Size facet renders as a box grid
On the desktop vertical filter, the size facet SHALL render each of its values as a clickable box arranged in a 4-column grid, replacing Dawn's default checkbox-list rendering for that facet only. The facet SHALL be identified by its filter parameter name (the `akeneo.available_erp_sizes` metafield), never by its visible label, so that translating or renaming the facet in Search & Discovery cannot change how it renders.

#### Scenario: Desktop vertical filter shows the size grid
- **WHEN** a shopper opens the "Maat" facet on the desktop vertical filter
- **THEN** each size value renders as a box in a 4-column grid, instead of a vertical list of labelled checkboxes

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

### Requirement: Unavailable sizes remain visible but non-interactive
A size value with zero matching products and no active selection SHALL render in a visually disabled state and SHALL NOT be selectable, consistent with Dawn's disabled-value behaviour for other facets. Such values SHALL remain visible rather than being removed, so the grid does not reflow as a shopper narrows the results.

#### Scenario: A size with no matching products is shown
- **WHEN** a size value has zero count and is not currently active
- **THEN** its box renders visibly disabled and cannot be selected

#### Scenario: Narrowing the results does not reflow the grid
- **WHEN** applying another facet reduces some size values to zero count
- **THEN** those values stay in place as disabled boxes rather than disappearing from the grid

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
