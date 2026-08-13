## ADDED Requirements

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
