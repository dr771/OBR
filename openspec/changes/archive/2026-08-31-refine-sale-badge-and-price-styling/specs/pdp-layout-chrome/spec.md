## MODIFIED Requirements

### Requirement: PDP sale pricing keeps the comparison subordinate
On a PDP sale price, the current sale amount SHALL use the brand accent `#38B6FF` while retaining the normal PDP price size and weight. The struck-through compare-at amount SHALL use the current foreground colour at 35% opacity. This treatment SHALL NOT change a regular non-sale PDP price.

#### Scenario: PDP renders a sale variant
- **WHEN** the selected variant has a compare-at price greater than its current price
- **THEN** the current amount is `#38B6FF` and the compare-at amount is struck through at `rgba(var(--color-foreground), 0.35)`

#### Scenario: PDP renders a regular-price variant
- **WHEN** the selected variant has no valid higher compare-at price
- **THEN** its current amount retains the normal PDP ink colour
