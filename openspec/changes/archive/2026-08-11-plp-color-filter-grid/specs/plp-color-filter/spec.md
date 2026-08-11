## ADDED Requirements

### Requirement: Color filter renders as a compact swatch grid
The color-family filter SHALL render active values as round 2.8rem swatch chips in a fixed five-column grid on the desktop vertical filter and in the existing mobile filter drawer. The grid SHALL replace the persistent text-row presentation without changing filter parameters, selection semantics, or the underlying color-family set.

#### Scenario: Desktop vertical filter shows swatch grid
- **WHEN** a shopper opens the color filter on desktop
- **THEN** each available color family renders as a 2.8rem round chip in a five-column grid, with no permanently visible label or count

#### Scenario: Mobile drawer shows swatch grid
- **WHEN** a shopper opens the color facet inside the current mobile filter drawer
- **THEN** the same color families render as 2.8rem round chips in a compact five-column grid rather than text rows

### Requirement: Swatch hover or focus reveals label and count
Each color-family chip SHALL expose a CSS-only tooltip containing the family’s display label and current product count when its interactive label is hovered or keyboard-focused. The tooltip SHALL not require JavaScript and SHALL not change layout geometry when shown.

#### Scenario: Pointer reveals tooltip
- **WHEN** a pointer user hovers a color-family chip
- **THEN** a tooltip appears with the family label and count, such as “blauw (4)”

#### Scenario: Keyboard focus reveals tooltip
- **WHEN** a keyboard user focuses the native checkbox for a color-family chip
- **THEN** the same tooltip appears and the chip retains a visible focus indication

### Requirement: Compact chip retains an accessible name and native control semantics
Removing the visible label and count SHALL NOT remove the native checkbox or its accessible name. Each chip SHALL retain a real DOM label containing the family name and count, and unavailable values SHALL remain disabled rather than being removed from the grid.

#### Scenario: Screen reader reaches a color chip
- **WHEN** assistive technology navigates to a color-family checkbox
- **THEN** it announces the family label and product count from DOM text and exposes the checked and disabled states natively

#### Scenario: Color family is unavailable
- **WHEN** a color family has zero matching products and is not active
- **THEN** its chip remains in grid order as a disabled native checkbox with unavailable styling

### Requirement: Active color pills show the value only
An active filter pill for the color-family facet SHALL display only the family value and remove control, without repeating the color facet’s label prefix.

#### Scenario: Color filter is active
- **WHEN** a shopper selects the “blauw” color family
- **THEN** its active-filter pill reads “blauw” rather than “Kleur: blauw”
