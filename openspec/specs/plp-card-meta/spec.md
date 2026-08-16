# plp-card-meta Specification

## Purpose
Governs the text block under a PLP product card's image — brand label, product name, price — and the typography they render in. Values are measured from the approved Bolt reference collection page rather than chosen, since the card is the most repeated element on the site and the reference is what the design was signed off against.

## Requirements

### Requirement: Brand label renders above the product name
The card's brand label SHALL appear above the product name. It SHALL be moved in the markup rather than visually reordered with flex/grid ordering, so DOM order, reading order, and screen-reader order stay identical. The label SHALL remain gated by the rendering section's own vendor setting, preserving merchant control.

#### Scenario: Section has the vendor setting enabled
- **WHEN** a card renders on a section with its vendor setting on
- **THEN** the brand appears above the product name, preceded by its visually-hidden "vendor" label for assistive technology

#### Scenario: Section has the vendor setting disabled
- **WHEN** a card renders on a section with its vendor setting off
- **THEN** no brand label renders and the product name is the first line of the text block

### Requirement: Card text follows the measured reference typography
PLP card text SHALL match the reference's measured values: the brand label at 10px, weight 600, 15px line-height, 1.8px letter-spacing, uppercase, at 45% of the foreground ink; the product name at 16px, weight 500, 22px line-height, normal letter-spacing; and 4px of clearance between label and name. The label's transparency SHALL come from its colour's alpha, not from an opacity applied to the element, so the value is exact and nothing the label ever wraps is dimmed with it.

#### Scenario: Card renders in the collection or search grid
- **WHEN** a shopper views a product card in the grid
- **THEN** its label and name render at the measured sizes, weights, line-heights, letter-spacing, and label tint, with 4px between them

#### Scenario: Reference and implementation are compared
- **WHEN** the rendered card's computed styles are diffed against the reference card's
- **THEN** the typographic values agree exactly, allowing for this project's own ink colour token in place of the reference's palette

### Requirement: Declared font weights must have a loaded face
The theme SHALL load a font face for every weight the card typography declares. A declared weight with no corresponding loaded face is silently remapped by the browser to the nearest available one — rendering 500 as regular and 600 as bold — which computed-style comparison cannot detect, since it reports the declared weight. Face loading SHALL be guarded so a font family that does not carry a given weight simply loads nothing for it.

#### Scenario: Body font carries the declared weights
- **WHEN** the theme's body font offers the weights the card typography declares
- **THEN** those faces load and the card renders at the declared weights

#### Scenario: Body font does not carry a declared weight
- **WHEN** a merchant selects a body font whose library entry lacks one of those weights
- **THEN** no face is emitted for it and the page still renders, rather than the theme erroring on a nil font
