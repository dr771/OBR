## ADDED Requirements

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

## MODIFIED Requirements

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
