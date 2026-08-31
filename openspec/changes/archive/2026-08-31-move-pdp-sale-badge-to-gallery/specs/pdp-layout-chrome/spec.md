## ADDED Requirements

### Requirement: PDP sale pricing keeps the comparison subordinate
On a PDP sale price, the struck-through compare-at amount SHALL use the current foreground colour at 35% opacity while the current sale amount retains the normal PDP price treatment. This muted comparison treatment SHALL NOT change prices on collection cards or other shared price surfaces.

#### Scenario: PDP renders a sale variant
- **WHEN** the selected variant has a compare-at price greater than its current price
- **THEN** the compare-at amount is struck through at `rgba(var(--color-foreground), 0.35)` and the current price retains its normal emphasis

#### Scenario: Product card renders a sale variant
- **WHEN** a shared price renderer appears outside the PDP
- **THEN** its existing compare-at colour remains unchanged
