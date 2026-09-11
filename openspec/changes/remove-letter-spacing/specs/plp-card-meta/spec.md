## MODIFIED Requirements

### Requirement: Card text follows the measured reference typography
PLP card text SHALL match the reference's measured values except for tracking: the brand label at 10px, weight 600, 15px line-height, normal letter-spacing, uppercase, at 45% of the foreground ink; the product name at 16px, weight 500, 22px line-height, normal letter-spacing; and 4px of clearance between label and name. The reference's 1.8px label tracking is deliberately not carried, per the storefront-wide no-positive-tracking rule. The label's transparency SHALL come from its colour's alpha, not from an opacity applied to the element, so the value is exact and nothing the label ever wraps is dimmed with it.

#### Scenario: Card renders in the collection or search grid
- **WHEN** a shopper views a product card in the grid
- **THEN** its label and name render at the measured sizes, weights, line-heights, and label tint, both with normal letter-spacing, with 4px between them

#### Scenario: Reference and implementation are compared
- **WHEN** the rendered card's computed styles are diffed against the reference card's
- **THEN** the typographic values agree exactly, allowing for this project's own ink colour token in place of the reference's palette and for the label's normal letter-spacing in place of the reference's 1.8px
