# plp-color-filter Specification

## Purpose
Renders the PLP color filter facet as flat hex-color chips sourced from the `filtercolors` metaobject. Deliberately distinct from the card/PDP image swatches: a filter value is an abstract color family spanning many products, which no single product photo can represent honestly. Color families arrive pre-grouped from the Akeneo sync, so no theme-side family merging is needed.
## Requirements
### Requirement: Color facet chip renders from the filtercolors metaobject, not an image
The color filter facet SHALL render each active color family as a flat chip colored from the `filtercolors` metaobject's `hexcode` field, falling back to the metaobject's `image_asset` only if `hexcode` is absent. This is deliberately not an image-swatch (unlike the PLP card and PDP chips) — a filter value represents a color family spanning many products, and no single product photo can represent that group accurately, whereas a flat color chip communicates the family without implying one specific product's exact shade or print.

#### Scenario: Filter family has a hex code
- **WHEN** a `filtercolors` metaobject entry has a `hexcode` value (e.g. `#000000` for `black`/`zwart`)
- **THEN** the facet chip renders as a flat color swatch using that hex value

#### Scenario: Filter family lacks a hex code but has an image
- **WHEN** a `filtercolors` entry has no `hexcode` but does have an `image_asset`
- **THEN** the facet chip falls back to rendering that image

### Requirement: Color families are grouped by the filtercolors reference, not by name-matching
The color facet SHALL group product colors by their `filtercolors` metaobject reference (via the variant's `custom.filtercolors` list field) rather than by word-matching color-name text into families. Nick's Akeneo sync owns the family grouping; the theme SHALL NOT reimplement or duplicate that grouping logic.

#### Scenario: Two differently-named colors share a family
- **WHEN** two color option values both reference the same `filtercolors` metaobject entry (e.g. both map to `code: black`)
- **THEN** they are grouped under a single facet chip, with no theme-side name-matching involved

#### Scenario: A variant has no filtercolors reference
- **WHEN** a variant's `custom.filtercolors` field is empty or absent
- **THEN** that variant is excluded from the color facet rather than causing a facet error or an ungrouped stray chip

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

### Requirement: Swatch hover or focus reveals label and count
Each color-family chip SHALL expose a CSS-only tooltip containing the family’s display label and current product count when its interactive label is hovered or keyboard-focused. The tooltip SHALL not require JavaScript and SHALL not change layout geometry when shown.

#### Scenario: Pointer reveals tooltip
- **WHEN** a pointer user hovers a color-family chip
- **THEN** a tooltip appears with the family label and count, such as “blauw (4)”

#### Scenario: Keyboard focus reveals tooltip
- **WHEN** a keyboard user focuses the native checkbox for a color-family chip
- **THEN** the same tooltip appears and the chip retains a visible focus indication

### Requirement: Compact chip retains an accessible name and native control semantics
Removing the visible label and count SHALL NOT remove the native form control or its accessible name. Each chip SHALL retain a real DOM label containing the family name and count; multiple mode SHALL use native checkbox semantics, single mode SHALL use native radio semantics, and unavailable values SHALL remain disabled rather than being removed from the grid.

#### Scenario: Screen reader reaches a color chip
- **WHEN** assistive technology navigates to a color-family control
- **THEN** it announces the family label and product count and exposes the checked/selected and disabled states through the native control appropriate to the configured mode

#### Scenario: Screen reader reaches a color chip in single mode
- **WHEN** assistive technology navigates to a color-family control while single mode is active
- **THEN** it announces the family label and product count and exposes the choices as one native radio group with selected/disabled states

#### Scenario: Color family is unavailable
- **WHEN** a color family has zero matching products and is not active
- **THEN** its chip remains in grid order as a disabled native control with unavailable styling

### Requirement: Active color pills show the value only
An active filter pill for the color-family facet SHALL display only the family value and remove control, without repeating the color facet’s label prefix.

#### Scenario: Color filter is active
- **WHEN** a shopper selects the “blauw” color family
- **THEN** its active-filter pill reads “blauw” rather than “Kleur: blauw”

### Requirement: Color selection cardinality is merchant-switchable
The theme SHALL provide one global color-filter selection setting with `One color` as the default and `Multiple colors` as the alternative. The setting SHALL apply consistently to collection and search results on desktop, the mobile filter bar, and Dawn's fallback mobile drawer. It SHALL control how many color values the storefront permits to remain active, independently of Search & Discovery's OR/AND query operator.

#### Scenario: Default single mode
- **WHEN** the merchant has not explicitly changed the color-filter selection setting
- **THEN** shoppers can keep one color family selected

#### Scenario: Merchant enables single mode
- **WHEN** the merchant selects `One color`
- **THEN** choosing a different color replaces the previously active color everywhere the color facet renders

#### Scenario: Selection mode and query operator remain distinct
- **WHEN** multiple mode is active and Search & Discovery reports the color filter operator as OR
- **THEN** several colors can be active and products matching any active color are returned

### Requirement: Single mode maintains one canonical active color
In single mode, the color facet SHALL expose mutually exclusive native selection semantics and SHALL keep the rendered selected state, native filter URL, and result set synchronized around no more than one active color. The active color SHALL remain removable through the facet reset and active-filter removal controls.

#### Scenario: Shopper replaces the active color
- **WHEN** one color is active and the shopper selects another color
- **THEN** the previous color parameter is removed, the new color is the only active color parameter, and the grid updates through the native facet pipeline

#### Scenario: Shopper clears the active color
- **WHEN** the shopper activates the color reset or active-filter removal control
- **THEN** no color remains selected and the unfiltered color result set is restored

#### Scenario: Shared URL contains several color values
- **WHEN** a page opens in single mode with multiple native color parameters from a shared URL or a previous multiple-mode session
- **THEN** the storefront deterministically retains the first URL value, removes the others, and refreshes the result set so URL, controls, and products agree
