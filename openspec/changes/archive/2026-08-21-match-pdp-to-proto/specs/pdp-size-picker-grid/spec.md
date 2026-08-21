## MODIFIED Requirements

### Requirement: Size boxes expose clear interactive states
Each size box SHALL retain native single-choice form semantics and SHALL expose visually distinct default, hover, selected, unavailable, and keyboard-focus states. Selected and unavailable states SHALL remain distinguishable without relying on color alone. Boxes SHALL have square corners, an unselected box SHALL carry a hairline border on a white surface, and the selected box SHALL invert to the full-ink surface with its label in white.

#### Scenario: Shopper selects a size

- **WHEN** a shopper activates an available size box
- **THEN** that box becomes the sole selected option, inverting to the full-ink surface with a white label, and remains visually distinct from every unselected box

#### Scenario: Size is unavailable for the current selection

- **WHEN** a size value is unavailable in the current option combination
- **THEN** its box retains Dawn's availability behavior and is visibly muted and struck through

#### Scenario: Keyboard user navigates the size picker

- **WHEN** keyboard focus reaches a size radio
- **THEN** its visible box shows a clear focus outline without hiding the selected or unavailable state

#### Scenario: Pointer user hovers an available size

- **WHEN** a pointer hovers an unselected, available size box
- **THEN** its border darkens to full ink without changing its size or its neighbours' positions

### Requirement: Size boxes remain usable across supported viewports
The grid SHALL stay within its product-information container without horizontal page overflow. Every size box SHALL provide a uniform 4.4rem interaction height at every supported viewport.

#### Scenario: Shopper views the picker on a mobile viewport

- **WHEN** the PDP is rendered at a 390px mobile viewport
- **THEN** the grid remains four columns wide with 4.4rem-high labels, its labels remain legible, and no horizontal page overflow is introduced

#### Scenario: Shopper views the picker on desktop

- **WHEN** the PDP is rendered with a product-information container of at least 44rem
- **THEN** the grid presents eight columns of 4.4rem-high labels within the container
